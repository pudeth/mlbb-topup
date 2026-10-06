using Microsoft.Extensions.Logging;
using System.Collections.Concurrent;
using System.Text;
using System.Text.Json;

namespace MLBBTopUp.Infrastructure.Services;

/// <summary>
/// Fetches real Free Fire in-game nicknames by proxying freefirejornal.com's
/// profile-preview API (server-to-server — no CORS restriction, no cookies needed).
/// Results are cached in memory to avoid hammering the upstream service.
/// </summary>
public class FreefireNicknameService
{
    private readonly ILogger<FreefireNicknameService> _logger;

    // Cache: playerId → (nickname, fetchedAt)
    private static readonly ConcurrentDictionary<string, (string Nickname, string Region, DateTimeOffset FetchedAt)> _cache = new();
    private static readonly TimeSpan CacheTtl = TimeSpan.FromMinutes(30);

    // HttpClient is shared/static to avoid socket exhaustion
    private static readonly HttpClient _http = new(new HttpClientHandler
    {
        AllowAutoRedirect = true,
        UseCookies = false
    })
    {
        Timeout = TimeSpan.FromSeconds(60)
    };

    private const string BaseUrl = "https://freefirejornal.com";

    static FreefireNicknameService()
    {
        _http.DefaultRequestHeaders.Add("User-Agent",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36");
        _http.DefaultRequestHeaders.Add("Accept", "application/json");
        _http.DefaultRequestHeaders.Add("X-FFJ-FF-Profile", "preview");
    }

    public FreefireNicknameService(ILogger<FreefireNicknameService> logger)
    {
        _logger = logger;
    }

    public record NicknameResult(bool Found, string? Nickname, string? Region, string? Message);

    /// <summary>
    /// Returns the real Free Fire in-game nickname for the given UID.
    /// </summary>
    public async Task<NicknameResult> GetNicknameAsync(string uid, CancellationToken ct = default)
    {
        uid = (uid ?? string.Empty).Trim();
        if (!System.Text.RegularExpressions.Regex.IsMatch(uid, @"^\d{7,20}$"))
            return new NicknameResult(false, null, null, "Invalid UID format");

        // Return from cache if fresh
        if (_cache.TryGetValue(uid, out var cached) && DateTimeOffset.UtcNow - cached.FetchedAt < CacheTtl)
            return new NicknameResult(true, cached.Nickname, cached.Region, null);

        try
        {
            // Step 1: Bootstrap — get a short-lived token
            var bootstrapPayload = JsonSerializer.Serialize(new { id = uid, languageCode = "en" });
            using var bootstrapContent = new StringContent(bootstrapPayload, Encoding.UTF8, "application/json");
            var bootstrapResp = await _http.PostAsync($"{BaseUrl}/api/freefire/profile-preview/bootstrap", bootstrapContent, ct);

            if (!bootstrapResp.IsSuccessStatusCode)
            {
                _logger.LogWarning("FFJ bootstrap returned {Status} for UID {Uid}", bootstrapResp.StatusCode, uid);
                return new NicknameResult(false, null, null, "Upstream service unavailable");
            }

            var bootstrapJson = await bootstrapResp.Content.ReadAsStringAsync(ct);
            using var bootstrapDoc = JsonDocument.Parse(bootstrapJson);
            var bs = bootstrapDoc.RootElement;

            if (!bs.TryGetProperty("state", out var stateEl) || stateEl.GetString() != "prepared")
                return new NicknameResult(false, null, null, "Bootstrap did not return prepared state");

            var token = bs.TryGetProperty("token", out var tokenEl) ? tokenEl.GetString() : null;
            if (string.IsNullOrWhiteSpace(token))
                return new NicknameResult(false, null, null, "No token received from bootstrap");

            // Mandatory delay the upstream mandates (capped at 15 s)
            var delaySeconds = bs.TryGetProperty("delay", out var delayEl)
                ? Math.Max(1, Math.Min(15, delayEl.GetInt32()))
                : 5;
            await Task.Delay(TimeSpan.FromSeconds(delaySeconds), ct);

            // Step 2: Fetch preview
            var previewPayload = JsonSerializer.Serialize(new { id = uid, token, languageCode = "en" });
            using var previewContent = new StringContent(previewPayload, Encoding.UTF8, "application/json");
            var previewResp = await _http.PostAsync($"{BaseUrl}/api/freefire/profile-preview", previewContent, ct);

            var previewJson = await previewResp.Content.ReadAsStringAsync(ct);
            using var previewDoc = JsonDocument.Parse(previewJson);
            var pv = previewDoc.RootElement;

            // If pending, poll status until ready
            if (previewResp.StatusCode == System.Net.HttpStatusCode.Accepted ||
                (pv.TryGetProperty("state", out var pvState) && pvState.GetString() == "pending"))
            {
                var pollToken = pv.TryGetProperty("pollToken", out var pt) ? pt.GetString() : token;
                pv = await PollUntilReadyAsync(uid, pollToken ?? token, ct);
            }

            return ExtractNickname(uid, pv);
        }
        catch (TaskCanceledException)
        {
            return new NicknameResult(false, null, null, "Timeout");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching FF nickname for UID {Uid}", uid);
            return new NicknameResult(false, null, null, "Error: " + ex.Message);
        }
    }

    private async Task<JsonElement> PollUntilReadyAsync(string uid, string pollToken, CancellationToken ct)
    {
        var deadline = DateTimeOffset.UtcNow.AddSeconds(90);
        while (DateTimeOffset.UtcNow < deadline)
        {
            await Task.Delay(1500, ct);
            var url = $"{BaseUrl}/api/freefire/profile-preview/status/{Uri.EscapeDataString(uid)}" +
                      $"?token={Uri.EscapeDataString(pollToken)}&lang=en";
            try
            {
                var resp = await _http.GetAsync(url, ct);
                if (!resp.IsSuccessStatusCode) continue;
                var json = await resp.Content.ReadAsStringAsync(ct);
                var doc = JsonDocument.Parse(json);
                var state = doc.RootElement.TryGetProperty("state", out var s) ? s.GetString() : "";
                if (state is "ready" or "stale" or "notfound" or "error")
                    return doc.RootElement;
            }
            catch { }
        }
        return default;
    }

    private NicknameResult ExtractNickname(string uid, JsonElement pv)
    {
        if (pv.ValueKind == JsonValueKind.Undefined)
            return new NicknameResult(false, null, null, "Timeout waiting for profile");

        var state = pv.TryGetProperty("state", out var stEl) ? stEl.GetString() : "";
        if (state is "notfound" or "error")
            return new NicknameResult(false, null, null, "Player not found");

        if (state is not "ready" and not "stale")
            return new NicknameResult(false, null, null, $"Unexpected state: {state}");

        var nickname = pv.TryGetProperty("nickname", out var nn) ? nn.GetString() : null;
        var region = pv.TryGetProperty("region", out var rg) ? rg.GetString() : null;

        if (!string.IsNullOrWhiteSpace(nickname))
        {
            _cache[uid] = (nickname, region ?? "Global", DateTimeOffset.UtcNow);
            return new NicknameResult(true, nickname, region ?? "Global", null);
        }

        return new NicknameResult(false, null, null, "Nickname not available");
    }
}
