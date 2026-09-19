using System.Text;
using System.Text.Json;
using System.Net.Http.Json;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MLBBTopUp.Core.Interfaces;

namespace MLBBTopUp.Infrastructure.Services;

public class SupplierGatewayManager : ISupplierGatewayManager
{
    private readonly ILogger<SupplierGatewayManager> _logger;
    private readonly IConfiguration _configuration;
    private readonly HttpClient _httpClient;
    private readonly string _settingsFilePath;
    private SupplierSettingsModel _settings;
    private readonly object _lock = new();

    public SupplierGatewayManager(
        ILogger<SupplierGatewayManager> logger,
        IConfiguration configuration,
        HttpClient? httpClient = null)
    {
        _logger = logger;
        _configuration = configuration;
        _httpClient = httpClient ?? new HttpClient { Timeout = TimeSpan.FromSeconds(8) };

        _settingsFilePath = Path.Combine(AppContext.BaseDirectory, "supplier_gateway_settings.json");
        _settings = LoadInitialSettings();

        // Background task to sync from MongoDB Atlas on start
        _ = Task.Run(async () =>
        {
            try
            {
                await LoadFromMongoAsync();
                await RefreshBalancesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogWarning("SupplierGatewayManager initialization sync error: {Message}", ex.Message);
            }
        });
    }

    private SupplierSettingsModel LoadInitialSettings()
    {
        // 1. Try local JSON file
        try
        {
            if (File.Exists(_settingsFilePath))
            {
                var json = File.ReadAllText(_settingsFilePath);
                var loaded = JsonSerializer.Deserialize<SupplierSettingsModel>(json);
                if (loaded != null)
                {
                    _logger.LogInformation("Loaded supplier gateway settings from local cache: Active = {ActiveProvider}", loaded.ActiveProvider);
                    return loaded;
                }
            }
        }
        catch { }

        // 2. Fallback to appsettings.json or defaults
        var active = _configuration["TopUpProvider:Provider"] ?? "FazerCards";
        var fzrKey = _configuration["TopUpProvider:ApiKey"] ?? "fc_5f79a0016d5d87bd1e83ea4f";
        var ktKey = "kt_6d38a3a5940e970221cc62fa306ae96044736364";

        return new SupplierSettingsModel
        {
            ActiveProvider = active.Equals("KhmerTopUp", StringComparison.OrdinalIgnoreCase) ? "KhmerTopUp" : "FazerCards",
            Environment = _configuration["TopUpProvider:Environment"] ?? "Production",
            AutoDispatchOnPayment = true,
            AutoFailoverEnabled = true,
            MerchantId = _configuration["TopUpProvider:MerchantId"] ?? "peakmao007",
            ApiKey = active.Equals("KhmerTopUp", StringComparison.OrdinalIgnoreCase) ? ktKey : fzrKey,
            FazerCardsApiKey = fzrKey,
            KhmerTopUpApiKey = ktKey,
            FazerCardsApiUrl = "https://api.fzr.cards/api/v2",
            KhmerTopUpApiUrl = "https://khmer-topup.com/api/v1/orders",
            WebhookUrl = "https://mlbb-backend-api.onrender.com/api/supplier/webhook",
            BalanceUSD = 18.50m,
            FazerCardsBalanceUSD = 18.50m,
            KhmerTopUpBalanceUSD = 1.45m,
            Status = "Connected & Active",
            UpdatedAt = DateTime.UtcNow
        };
    }

    private async Task LoadFromMongoAsync()
    {
        var khqrUrl = _configuration["KHQR:ApiUrl"] ?? _configuration["KHQR__ApiUrl"] ?? "https://mlbb-khqr-api.onrender.com";
        khqrUrl = khqrUrl.TrimEnd('/');
        var targetUrl = $"{khqrUrl}/api/provider-settings?_t={DateTimeOffset.UtcNow.ToUnixTimeSeconds()}";

        try
        {
            var res = await _httpClient.GetAsync(targetUrl);
            if (res.IsSuccessStatusCode)
            {
                var content = await res.Content.ReadAsStringAsync();
                using var doc = JsonDocument.Parse(content);
                if (doc.RootElement.TryGetProperty("settings", out var stElem) && stElem.ValueKind == JsonValueKind.Object)
                {
                    var fromDb = JsonSerializer.Deserialize<SupplierSettingsModel>(stElem.GetRawText());
                    if (fromDb != null)
                    {
                        lock (_lock)
                        {
                            _settings.ActiveProvider = fromDb.ActiveProvider ?? _settings.ActiveProvider;
                            _settings.FazerCardsApiKey = !string.IsNullOrWhiteSpace(fromDb.FazerCardsApiKey) ? fromDb.FazerCardsApiKey : _settings.FazerCardsApiKey;
                            _settings.KhmerTopUpApiKey = !string.IsNullOrWhiteSpace(fromDb.KhmerTopUpApiKey) ? fromDb.KhmerTopUpApiKey : _settings.KhmerTopUpApiKey;
                            _settings.ApiKey = _settings.ActiveProvider == "KhmerTopUp" ? _settings.KhmerTopUpApiKey : _settings.FazerCardsApiKey;
                            _settings.AutoDispatchOnPayment = fromDb.AutoDispatchOnPayment;
                            _settings.AutoFailoverEnabled = fromDb.AutoFailoverEnabled;
                        }
                        _logger.LogInformation("Synced active supplier gateway from MongoDB Atlas: {Provider}", _settings.ActiveProvider);
                    }
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning("Failed to query supplier settings from MongoDB service: {Message}", ex.Message);
        }
    }

    private async Task PersistSettingsAsync(SupplierSettingsModel model)
    {
        // 1. Save to local file
        try
        {
            var json = JsonSerializer.Serialize(model, new JsonSerializerOptions { WriteIndented = true });
            await File.WriteAllTextAsync(_settingsFilePath, json);
        }
        catch (Exception ex)
        {
            _logger.LogWarning("Failed to write local settings file: {Message}", ex.Message);
        }

        // 2. Broadcast to MongoDB Atlas via KHQR microservice
        var khqrUrl = _configuration["KHQR:ApiUrl"] ?? _configuration["KHQR__ApiUrl"] ?? "https://mlbb-khqr-api.onrender.com";
        khqrUrl = khqrUrl.TrimEnd('/');
        var targetUrl = $"{khqrUrl}/api/provider-settings";

        try
        {
            var payload = new { settings = model };
            var content = JsonContent.Create(payload);
            await _httpClient.PostAsync(targetUrl, content);
            _logger.LogInformation("Saved supplier gateway settings to MongoDB Atlas successfully");
        }
        catch (Exception ex)
        {
            _logger.LogWarning("Failed to broadcast settings to MongoDB Atlas: {Message}", ex.Message);
        }
    }

    public SupplierSettingsModel GetSettings()
    {
        lock (_lock)
        {
            return new SupplierSettingsModel
            {
                ActiveProvider = _settings.ActiveProvider,
                Environment = _settings.Environment,
                AutoDispatchOnPayment = _settings.AutoDispatchOnPayment,
                AutoFailoverEnabled = _settings.AutoFailoverEnabled,
                MerchantId = _settings.MerchantId,
                ApiKey = _settings.ActiveProvider == "KhmerTopUp" ? _settings.KhmerTopUpApiKey : _settings.FazerCardsApiKey,
                FazerCardsApiKey = _settings.FazerCardsApiKey,
                KhmerTopUpApiKey = _settings.KhmerTopUpApiKey,
                FazerCardsApiUrl = _settings.FazerCardsApiUrl,
                KhmerTopUpApiUrl = _settings.KhmerTopUpApiUrl,
                WebhookUrl = _settings.WebhookUrl,
                BalanceUSD = _settings.ActiveProvider == "KhmerTopUp" ? _settings.KhmerTopUpBalanceUSD : _settings.FazerCardsBalanceUSD,
                FazerCardsBalanceUSD = _settings.FazerCardsBalanceUSD,
                KhmerTopUpBalanceUSD = _settings.KhmerTopUpBalanceUSD,
                Status = _settings.Status,
                UpdatedAt = _settings.UpdatedAt
            };
        }
    }

    public async Task<SupplierSettingsModel> UpdateSettingsAsync(SupplierSettingsModel incoming)
    {
        SupplierSettingsModel copy;
        lock (_lock)
        {
            _settings.ActiveProvider = incoming.ActiveProvider ?? _settings.ActiveProvider;
            _settings.Environment = incoming.Environment ?? _settings.Environment;
            _settings.AutoDispatchOnPayment = incoming.AutoDispatchOnPayment;
            _settings.AutoFailoverEnabled = incoming.AutoFailoverEnabled;
            if (!string.IsNullOrWhiteSpace(incoming.KhmerTopUpApiKey)) _settings.KhmerTopUpApiKey = incoming.KhmerTopUpApiKey;
            if (!string.IsNullOrWhiteSpace(incoming.FazerCardsApiKey)) _settings.FazerCardsApiKey = incoming.FazerCardsApiKey;
            _settings.ApiKey = _settings.ActiveProvider == "KhmerTopUp" ? _settings.KhmerTopUpApiKey : _settings.FazerCardsApiKey;
            _settings.UpdatedAt = DateTime.UtcNow;
            copy = GetSettings();
        }

        await PersistSettingsAsync(copy);
        _ = Task.Run(async () => await RefreshBalancesAsync());
        return copy;
    }

    public async Task<SupplierSettingsModel> SwitchProviderAsync(string targetProvider)
    {
        string normalized = targetProvider.Equals("KhmerTopUp", StringComparison.OrdinalIgnoreCase) ? "KhmerTopUp" : "FazerCards";
        SupplierSettingsModel copy;
        lock (_lock)
        {
            _settings.ActiveProvider = normalized;
            _settings.ApiKey = normalized == "KhmerTopUp" ? _settings.KhmerTopUpApiKey : _settings.FazerCardsApiKey;
            _settings.BalanceUSD = normalized == "KhmerTopUp" ? _settings.KhmerTopUpBalanceUSD : _settings.FazerCardsBalanceUSD;
            _settings.UpdatedAt = DateTime.UtcNow;
            copy = GetSettings();
        }

        _logger.LogInformation("Switched active supplier gateway to: {Provider}", normalized);
        await PersistSettingsAsync(copy);
        _ = Task.Run(async () => await RefreshBalancesAsync());
        return copy;
    }

    public async Task<SupplierSettingsModel> RefreshBalancesAsync()
    {
        // 1. FazerCards Balance
        try
        {
            var fzrKey = _settings.FazerCardsApiKey;
            using var req = new HttpRequestMessage(HttpMethod.Get, "https://api.fzr.cards/api/v2/balance");
            req.Headers.Add("X-API-Key", fzrKey);
            var res = await _httpClient.SendAsync(req);
            if (res.IsSuccessStatusCode)
            {
                var content = await res.Content.ReadAsStringAsync();
                using var doc = JsonDocument.Parse(content);
                if (doc.RootElement.TryGetProperty("balance", out var bProp))
                {
                    if (decimal.TryParse(bProp.GetString(), out var bal))
                    {
                        lock (_lock) _settings.FazerCardsBalanceUSD = bal;
                    }
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning("FazerCards balance check warning: {Message}", ex.Message);
        }

        // 2. KhmerTopUp Balance
        try
        {
            var ktKey = _settings.KhmerTopUpApiKey;
            using var req = new HttpRequestMessage(HttpMethod.Get, "https://khmer-topup.com/api/v1/me");
            req.Headers.Add("X-API-Key", ktKey);
            req.Headers.Add("Authorization", $"Bearer {ktKey}");
            var res = await _httpClient.SendAsync(req);
            if (res.IsSuccessStatusCode)
            {
                var content = await res.Content.ReadAsStringAsync();
                using var doc = JsonDocument.Parse(content);
                if (doc.RootElement.TryGetProperty("balance", out var bProp))
                {
                    if (bProp.ValueKind == JsonValueKind.Number && bProp.TryGetDecimal(out var dBal))
                    {
                        lock (_lock) _settings.KhmerTopUpBalanceUSD = dBal;
                    }
                    else if (decimal.TryParse(bProp.GetString(), out var sBal))
                    {
                        lock (_lock) _settings.KhmerTopUpBalanceUSD = sBal;
                    }
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning("KhmerTopUp balance check warning: {Message}", ex.Message);
        }

        lock (_lock)
        {
            _settings.BalanceUSD = _settings.ActiveProvider == "KhmerTopUp"
                ? _settings.KhmerTopUpBalanceUSD
                : _settings.FazerCardsBalanceUSD;
        }

        return GetSettings();
    }

    public string GetActiveProvider() => _settings.ActiveProvider;

    public string GetActiveApiKey() => _settings.ActiveProvider == "KhmerTopUp" ? _settings.KhmerTopUpApiKey : _settings.FazerCardsApiKey;

    public bool IsAutoDispatchEnabled() => _settings.AutoDispatchOnPayment;
}
