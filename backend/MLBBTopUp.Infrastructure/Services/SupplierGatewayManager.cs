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
    private List<ProviderGameCatalogDto>? _cachedCatalogs;
    private DateTime _lastCatalogFetch = DateTime.MinValue;
    private readonly SemaphoreSlim _catalogLock = new(1, 1);

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
        // 1. Try local JSON file across multiple known paths
        var candidateFiles = new[]
        {
            _settingsFilePath,
            Path.Combine(Directory.GetCurrentDirectory(), "supplier_gateway_settings.json"),
            Path.Combine(AppContext.BaseDirectory, "supplier_gateway_settings.json")
        };

        var jsonOptions = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
        foreach (var path in candidateFiles)
        {
            try
            {
                if (File.Exists(path))
                {
                    var json = File.ReadAllText(path);
                    var loaded = JsonSerializer.Deserialize<SupplierSettingsModel>(json, jsonOptions);
                    if (loaded != null && !string.IsNullOrWhiteSpace(loaded.ActiveProvider))
                    {
                        loaded.ActiveProvider = loaded.ActiveProvider.Contains("khmer", StringComparison.OrdinalIgnoreCase) ? "KhmerTopUp" : "FazerCards";
                        _logger.LogInformation("Loaded supplier gateway settings from {Path}: Active = {ActiveProvider}", path, loaded.ActiveProvider);
                        return loaded;
                    }
                }
            }
            catch { }
        }

        // 2. Fallback to appsettings.json or defaults
        var active = _configuration["TopUpProvider:Provider"] ?? "KhmerTopUp";
        var fzrKey = _configuration["TopUpProvider:ApiKey"] ?? "fc_5f79a0016d5d87bd1e83ea4f";
        var ktKey = "kt_28c2640c86717199395d973670cf039a30ba2716";

        return new SupplierSettingsModel
        {
            ActiveProvider = active.Contains("fazer", StringComparison.OrdinalIgnoreCase) ? "FazerCards" : "KhmerTopUp",
            Environment = _configuration["TopUpProvider:Environment"] ?? "Production",
            AutoDispatchOnPayment = true,
            AutoFailoverEnabled = true,
            MerchantId = _configuration["TopUpProvider:MerchantId"] ?? "peakmao007",
            ApiKey = active.Contains("fazer", StringComparison.OrdinalIgnoreCase) ? fzrKey : ktKey,
            FazerCardsApiKey = fzrKey,
            FazerCardsTokens = new List<FazerCardsTokenItem>
            {
                new FazerCardsTokenItem
                {
                    Id = "default_fzr_token",
                    Token = fzrKey,
                    Name = "Primary Token (Default)",
                    IsActive = false,
                    BalanceUSD = 0.01m,
                    CreatedAt = DateTime.UtcNow
                }
            },
            KhmerTopUpApiKey = ktKey,
            FazerCardsApiUrl = "https://api.fzr.cards/api/v2",
            KhmerTopUpApiUrl = "https://khmer-topup.com/api/v1/orders",
            WebhookUrl = "https://mlbb-backend-api.onrender.com/api/supplier/webhook",
            BalanceUSD = 3.0m,
            FazerCardsBalanceUSD = 0.01m,
            KhmerTopUpBalanceUSD = 3.0m,
            Status = "Connected & Active",
            UpdatedAt = DateTime.UtcNow
        };
    }

    private async Task LoadFromMongoAsync()
    {
        var jsonOptions = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
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
                    var fromDb = JsonSerializer.Deserialize<SupplierSettingsModel>(stElem.GetRawText(), jsonOptions);
                    if (fromDb != null && !string.IsNullOrWhiteSpace(fromDb.ActiveProvider))
                    {
                        var normalized = fromDb.ActiveProvider.Contains("khmer", StringComparison.OrdinalIgnoreCase) ? "KhmerTopUp" : "FazerCards";
                        lock (_lock)
                        {
                            _settings.ActiveProvider = normalized;
                            _settings.FazerCardsApiKey = !string.IsNullOrWhiteSpace(fromDb.FazerCardsApiKey) ? fromDb.FazerCardsApiKey : _settings.FazerCardsApiKey;
                            if (fromDb.FazerCardsTokens != null && fromDb.FazerCardsTokens.Count > 0)
                            {
                                _settings.FazerCardsTokens = fromDb.FazerCardsTokens;
                            }
                            var incomingKtKey = fromDb.KhmerTopUpApiKey;
                            if (!string.IsNullOrWhiteSpace(incomingKtKey) && incomingKtKey != "kt_6d38a3a5940e970221cc62fa306ae96044736364")
                            {
                                _settings.KhmerTopUpApiKey = incomingKtKey.Trim();
                            }
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
        var json = JsonSerializer.Serialize(model, new JsonSerializerOptions { WriteIndented = true });

        // 1. Save to local settings files
        var candidateFiles = new[]
        {
            _settingsFilePath,
            Path.Combine(Directory.GetCurrentDirectory(), "supplier_gateway_settings.json")
        };

        foreach (var path in candidateFiles)
        {
            try
            {
                var dir = Path.GetDirectoryName(path);
                if (!string.IsNullOrEmpty(dir) && !Directory.Exists(dir)) Directory.CreateDirectory(dir);
                await File.WriteAllTextAsync(path, json);
            }
            catch (Exception ex)
            {
                _logger.LogWarning("Failed to write local settings file {Path}: {Message}", path, ex.Message);
            }
        }

        // 2. Persist active provider to appsettings.json so server restarts remember the selection
        try
        {
            var configPaths = new[]
            {
                Path.Combine(Directory.GetCurrentDirectory(), "appsettings.json"),
                Path.Combine(AppContext.BaseDirectory, "appsettings.json")
            };

            foreach (var cfgPath in configPaths)
            {
                if (File.Exists(cfgPath))
                {
                    var cfgContent = await File.ReadAllTextAsync(cfgPath);
                    var dict = JsonSerializer.Deserialize<Dictionary<string, object>>(cfgContent);
                    if (dict != null && dict.TryGetValue("TopUpProvider", out var topVal) && topVal is JsonElement elem)
                    {
                        var provDict = JsonSerializer.Deserialize<Dictionary<string, object>>(elem.GetRawText()) ?? new();
                        provDict["Provider"] = model.ActiveProvider;
                        provDict["ApiKey"] = model.ApiKey;
                        provDict["ApiUrl"] = model.ActiveProvider == "KhmerTopUp" ? "https://khmer-topup.com/api/v1/orders" : "https://api.fzr.cards/api/v2";
                        dict["TopUpProvider"] = provDict;
                        var newCfgJson = JsonSerializer.Serialize(dict, new JsonSerializerOptions { WriteIndented = true });
                        await File.WriteAllTextAsync(cfgPath, newCfgJson);
                    }
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning("Failed to sync appsettings.json with active provider: {Message}", ex.Message);
        }

        // 3. Broadcast to MongoDB Atlas via KHQR microservice (both /api/provider-settings and /api/provider/switch)
        var khqrUrl = _configuration["KHQR:ApiUrl"] ?? _configuration["KHQR__ApiUrl"] ?? "https://mlbb-khqr-api.onrender.com";
        khqrUrl = khqrUrl.TrimEnd('/');

        try
        {
            var contentSettings = JsonContent.Create(new { settings = model });
            await _httpClient.PostAsync($"{khqrUrl}/api/provider-settings", contentSettings);

            var contentSwitch = JsonContent.Create(new { provider = model.ActiveProvider });
            await _httpClient.PostAsync($"{khqrUrl}/api/provider/switch", contentSwitch);

            _logger.LogInformation("Saved supplier gateway settings ({ActiveProvider}) to MongoDB Atlas successfully", model.ActiveProvider);
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
                ApiKey = _settings.ApiKey,
                FazerCardsApiKey = _settings.FazerCardsApiKey,
                FazerCardsTokens = _settings.FazerCardsTokens != null ? new List<FazerCardsTokenItem>(_settings.FazerCardsTokens) : new(),
                CustomProviders = _settings.CustomProviders != null ? new List<CustomProviderItem>(_settings.CustomProviders) : new(),
                Providers = _settings.Providers,
                KhmerTopUpApiKey = _settings.KhmerTopUpApiKey,
                FazerCardsApiUrl = _settings.FazerCardsApiUrl,
                KhmerTopUpApiUrl = _settings.KhmerTopUpApiUrl,
                WebhookUrl = _settings.WebhookUrl,
                BalanceUSD = _settings.BalanceUSD,
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
            if (!string.IsNullOrWhiteSpace(incoming.ActiveProvider))
            {
                _settings.ActiveProvider = incoming.ActiveProvider;
            }
            _settings.Environment = incoming.Environment ?? _settings.Environment;
            _settings.AutoDispatchOnPayment = incoming.AutoDispatchOnPayment;
            _settings.AutoFailoverEnabled = incoming.AutoFailoverEnabled;
            if (!string.IsNullOrWhiteSpace(incoming.KhmerTopUpApiKey))
            {
                _settings.KhmerTopUpApiKey = incoming.KhmerTopUpApiKey.Trim();
            }
            if (!string.IsNullOrWhiteSpace(incoming.ApiKey) && (_settings.ActiveProvider == "KhmerTopUp" || incoming.ApiKey.StartsWith("kt_")))
            {
                _settings.KhmerTopUpApiKey = incoming.ApiKey.Trim();
            }

            if (incoming.CustomProviders != null) _settings.CustomProviders = incoming.CustomProviders;
            if (incoming.Providers != null) _settings.Providers = incoming.Providers;

            // Preserve old tokens: merge incoming tokens into existing keyring
            _settings.FazerCardsTokens ??= new();
            if (incoming.FazerCardsTokens != null && incoming.FazerCardsTokens.Count > 0)
            {
                var merged = new List<FazerCardsTokenItem>(_settings.FazerCardsTokens);
                foreach (var inTok in incoming.FazerCardsTokens)
                {
                    var match = merged.FirstOrDefault(t => t.Id == inTok.Id || t.Token == inTok.Token);
                    if (match != null)
                    {
                        match.Name = !string.IsNullOrWhiteSpace(inTok.Name) ? inTok.Name : match.Name;
                        match.IsActive = inTok.IsActive;
                        if (inTok.BalanceUSD.HasValue) match.BalanceUSD = inTok.BalanceUSD;
                    }
                    else
                    {
                        merged.Add(inTok);
                    }
                }
                _settings.FazerCardsTokens = merged;
            }

            // If a specific FazerCardsApiKey is passed, ensure it is added to keyring without deleting old token
            if (!string.IsNullOrWhiteSpace(incoming.FazerCardsApiKey))
            {
                var cleanFzrKey = incoming.FazerCardsApiKey.Trim();
                _settings.FazerCardsApiKey = cleanFzrKey;
                var found = _settings.FazerCardsTokens.FirstOrDefault(t => t.Token == cleanFzrKey);
                if (found == null)
                {
                    // Mark others inactive and add as new token while keeping old tokens!
                    foreach (var t in _settings.FazerCardsTokens) t.IsActive = false;
                    _settings.FazerCardsTokens.Add(new FazerCardsTokenItem
                    {
                        Id = Guid.NewGuid().ToString("N")[..8],
                        Token = cleanFzrKey,
                        Name = $"Token #{_settings.FazerCardsTokens.Count + 1}",
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow
                    });
                }
                else
                {
                    foreach (var t in _settings.FazerCardsTokens) t.IsActive = (t == found);
                }
            }

            if (!string.IsNullOrWhiteSpace(incoming.ApiKey))
            {
                _settings.ApiKey = incoming.ApiKey.Trim();
            }
            else
            {
                _settings.ApiKey = _settings.ActiveProvider == "KhmerTopUp" ? _settings.KhmerTopUpApiKey : _settings.FazerCardsApiKey;
            }

            if (_settings.ActiveProvider == "KhmerTopUp")
            {
                _settings.ApiKey = _settings.KhmerTopUpApiKey;
            }

            if (incoming.KhmerTopUpBalanceUSD >= 0)
            {
                _settings.KhmerTopUpBalanceUSD = incoming.KhmerTopUpBalanceUSD;
            }
            if (incoming.FazerCardsBalanceUSD >= 0)
            {
                _settings.FazerCardsBalanceUSD = incoming.FazerCardsBalanceUSD;
            }

            if (incoming.BalanceUSD >= 0)
            {
                _settings.BalanceUSD = incoming.BalanceUSD;
            }
            else
            {
                _settings.BalanceUSD = _settings.ActiveProvider == "KhmerTopUp" ? _settings.KhmerTopUpBalanceUSD : _settings.FazerCardsBalanceUSD;
            }

            _settings.UpdatedAt = DateTime.UtcNow;
            copy = GetSettings();
        }

        await PersistSettingsAsync(copy);
        _ = Task.Run(async () => await RefreshBalancesAsync());
        return copy;
    }

    public async Task<SupplierSettingsModel> AddFazerCardsTokenAsync(string token, string? name, bool setActive = true)
    {
        if (string.IsNullOrWhiteSpace(token)) return GetSettings();
        var clean = token.Trim();
        var label = !string.IsNullOrWhiteSpace(name) ? name.Trim() : $"Token #{(_settings.FazerCardsTokens?.Count ?? 0) + 1}";

        SupplierSettingsModel copy;
        lock (_lock)
        {
            _settings.FazerCardsTokens ??= new();
            var existing = _settings.FazerCardsTokens.FirstOrDefault(t => t.Token == clean);
            if (existing != null)
            {
                existing.Name = label;
                if (setActive)
                {
                    foreach (var t in _settings.FazerCardsTokens) t.IsActive = (t == existing);
                    _settings.FazerCardsApiKey = clean;
                    if (_settings.ActiveProvider == "FazerCards") _settings.ApiKey = clean;
                }
            }
            else
            {
                if (setActive)
                {
                    foreach (var t in _settings.FazerCardsTokens) t.IsActive = false;
                }
                _settings.FazerCardsTokens.Add(new FazerCardsTokenItem
                {
                    Id = Guid.NewGuid().ToString("N")[..8],
                    Token = clean,
                    Name = label,
                    IsActive = setActive,
                    CreatedAt = DateTime.UtcNow
                });
                if (setActive)
                {
                    _settings.FazerCardsApiKey = clean;
                    if (_settings.ActiveProvider == "FazerCards") _settings.ApiKey = clean;
                }
            }
            _settings.UpdatedAt = DateTime.UtcNow;
            copy = GetSettings();
        }

        await PersistSettingsAsync(copy);
        _ = Task.Run(async () => await RefreshBalancesAsync());
        return copy;
    }

    public async Task<SupplierSettingsModel> SwitchFazerCardsTokenAsync(string idOrToken)
    {
        if (string.IsNullOrWhiteSpace(idOrToken)) return GetSettings();
        var clean = idOrToken.Trim();

        SupplierSettingsModel copy;
        lock (_lock)
        {
            _settings.FazerCardsTokens ??= new();
            var target = _settings.FazerCardsTokens.FirstOrDefault(t => t.Id == clean || t.Token == clean);
            if (target != null)
            {
                foreach (var t in _settings.FazerCardsTokens) t.IsActive = (t == target);
                _settings.FazerCardsApiKey = target.Token;
                if (_settings.ActiveProvider == "FazerCards") _settings.ApiKey = target.Token;
                _settings.UpdatedAt = DateTime.UtcNow;
            }
            copy = GetSettings();
        }

        await PersistSettingsAsync(copy);
        _ = Task.Run(async () => await RefreshBalancesAsync());
        return copy;
    }

    public async Task<SupplierSettingsModel> DeleteFazerCardsTokenAsync(string id)
    {
        if (string.IsNullOrWhiteSpace(id)) return GetSettings();

        SupplierSettingsModel copy;
        lock (_lock)
        {
            if (_settings.FazerCardsTokens != null && _settings.FazerCardsTokens.Count > 1)
            {
                var target = _settings.FazerCardsTokens.FirstOrDefault(t => t.Id == id);
                if (target != null)
                {
                    bool wasActive = target.IsActive;
                    _settings.FazerCardsTokens.Remove(target);
                    if (wasActive && _settings.FazerCardsTokens.Count > 0)
                    {
                        var first = _settings.FazerCardsTokens[0];
                        first.IsActive = true;
                        _settings.FazerCardsApiKey = first.Token;
                        if (_settings.ActiveProvider == "FazerCards") _settings.ApiKey = first.Token;
                    }
                    _settings.UpdatedAt = DateTime.UtcNow;
                }
            }
            copy = GetSettings();
        }

        await PersistSettingsAsync(copy);
        return copy;
    }

    public async Task<SupplierSettingsModel> SwitchProviderAsync(string targetProvider)
    {
        if (string.IsNullOrWhiteSpace(targetProvider)) return GetSettings();
        string normalized = targetProvider.Trim();
        if (targetProvider.Contains("khmer", StringComparison.OrdinalIgnoreCase)) normalized = "KhmerTopUp";
        else if (targetProvider.Contains("fazer", StringComparison.OrdinalIgnoreCase)) normalized = "FazerCards";

        SupplierSettingsModel copy;
        lock (_lock)
        {
            _settings.ActiveProvider = normalized;
            if (normalized == "KhmerTopUp")
            {
                _settings.ApiKey = _settings.KhmerTopUpApiKey;
                _settings.BalanceUSD = _settings.KhmerTopUpBalanceUSD;
            }
            else if (normalized == "FazerCards")
            {
                _settings.ApiKey = _settings.FazerCardsApiKey;
                _settings.BalanceUSD = _settings.FazerCardsBalanceUSD;
            }
            else
            {
                var custom = _settings.CustomProviders?.FirstOrDefault(p => p.Id.Equals(normalized, StringComparison.OrdinalIgnoreCase) || p.Name.Equals(normalized, StringComparison.OrdinalIgnoreCase));
                if (custom != null)
                {
                    _settings.ApiKey = custom.ApiKey;
                    _settings.BalanceUSD = custom.BalanceUSD;
                }
            }
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
        // 1. FazerCards Balance (Active Token)
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
                        lock (_lock)
                        {
                            _settings.FazerCardsBalanceUSD = bal;
                            var activeTok = _settings.FazerCardsTokens?.FirstOrDefault(t => t.IsActive);
                            if (activeTok != null) activeTok.BalanceUSD = bal;
                        }
                    }
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning("FazerCards balance check warning: {Message}", ex.Message);
        }

        // 1b. Check balance for other tokens in keyring
        if (_settings.FazerCardsTokens != null)
        {
            foreach (var tok in _settings.FazerCardsTokens.Where(t => !t.IsActive))
            {
                try
                {
                    using var req = new HttpRequestMessage(HttpMethod.Get, "https://api.fzr.cards/api/v2/balance");
                    req.Headers.Add("X-API-Key", tok.Token);
                    var res = await _httpClient.SendAsync(req);
                    if (res.IsSuccessStatusCode)
                    {
                        var content = await res.Content.ReadAsStringAsync();
                        using var doc = JsonDocument.Parse(content);
                        if (doc.RootElement.TryGetProperty("balance", out var bProp) && decimal.TryParse(bProp.GetString(), out var bVal))
                        {
                            lock (_lock) tok.BalanceUSD = bVal;
                        }
                    }
                }
                catch { }
            }
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

    public async Task<List<ProviderGameCatalogDto>> LookupProviderPackagesAsync(bool forceRefresh = false)
    {
        if (!forceRefresh && _cachedCatalogs != null && _cachedCatalogs.Count > 0 &&
            DateTime.UtcNow - _lastCatalogFetch < TimeSpan.FromMinutes(20))
        {
            return _cachedCatalogs;
        }

        await _catalogLock.WaitAsync();
        try
        {
            if (!forceRefresh && _cachedCatalogs != null && _cachedCatalogs.Count > 0 &&
                DateTime.UtcNow - _lastCatalogFetch < TimeSpan.FromMinutes(20))
            {
                return _cachedCatalogs;
            }

            var ktKey = !string.IsNullOrWhiteSpace(_settings.KhmerTopUpApiKey)
                ? _settings.KhmerTopUpApiKey
                : "kt_28c2640c86717199395d973670cf039a30ba2716";

            using var req = new HttpRequestMessage(HttpMethod.Get, "https://khmer-topup.com/api/v1/games");
            req.Headers.Add("X-API-Key", ktKey);
            req.Headers.Add("Authorization", $"Bearer {ktKey}");

            var res = await _httpClient.SendAsync(req);
            if (res.IsSuccessStatusCode)
            {
                var content = await res.Content.ReadAsStringAsync();
                using var doc = JsonDocument.Parse(content);

                if (doc.RootElement.TryGetProperty("games", out var gamesArray) && gamesArray.ValueKind == JsonValueKind.Array)
                {
                    var result = new List<ProviderGameCatalogDto>();
                    foreach (var gameElem in gamesArray.EnumerateArray())
                    {
                        var game = new ProviderGameCatalogDto
                        {
                            Slug = gameElem.TryGetProperty("slug", out var s) ? s.GetString() ?? "" : "",
                            Name = gameElem.TryGetProperty("name", out var n) ? n.GetString() ?? "" : "",
                            Image = gameElem.TryGetProperty("image", out var img) && img.ValueKind == JsonValueKind.String ? img.GetString() : null,
                            Category = gameElem.TryGetProperty("category", out var cat) && cat.ValueKind == JsonValueKind.String ? cat.GetString() : null,
                            IdLabel = gameElem.TryGetProperty("id_label", out var idl) && idl.ValueKind == JsonValueKind.String ? idl.GetString() : null,
                            ServerLabel = gameElem.TryGetProperty("server_label", out var svl) && svl.ValueKind == JsonValueKind.String ? svl.GetString() : null,
                        };

                        if (gameElem.TryGetProperty("packages", out var pkgsArray) && pkgsArray.ValueKind == JsonValueKind.Array)
                        {
                            foreach (var pkgElem in pkgsArray.EnumerateArray())
                            {
                                int pkgId = pkgElem.TryGetProperty("package_id", out var pid) ? pid.GetInt32() : 0;
                                string pkgName = pkgElem.TryGetProperty("name", out var pnm) ? pnm.GetString() ?? "" : "";
                                decimal price = 0m;
                                if (pkgElem.TryGetProperty("price", out var prc))
                                {
                                    if (prc.ValueKind == JsonValueKind.Number && prc.TryGetDecimal(out var dPrice))
                                        price = dPrice;
                                    else if (decimal.TryParse(prc.GetString(), out var sPrice))
                                        price = sPrice;
                                }
                                string? tag = pkgElem.TryGetProperty("tag", out var tg) && tg.ValueKind == JsonValueKind.String ? tg.GetString() : null;

                                int? diamonds = null;
                                var match = System.Text.RegularExpressions.Regex.Match(pkgName, @"\b(\d+)\s*(Diamonds|Diamond|UC|Tokens|Coins)?\b", System.Text.RegularExpressions.RegexOptions.IgnoreCase);
                                if (match.Success && int.TryParse(match.Groups[1].Value, out var parsedD))
                                {
                                    diamonds = parsedD;
                                }

                                game.Packages.Add(new ProviderPackageDto
                                {
                                    PackageId = pkgId,
                                    Name = pkgName,
                                    Price = price,
                                    Tag = tag,
                                    GameSlug = game.Slug,
                                    GameName = game.Name,
                                    DiamondAmount = diamonds
                                });
                            }
                        }
                        result.Add(game);
                    }

                    _cachedCatalogs = result;
                    _lastCatalogFetch = DateTime.UtcNow;
                    _logger.LogInformation("Successfully refreshed live provider package catalog: {Count} games and {Packages} packages loaded.",
                        result.Count, result.Sum(g => g.Packages.Count));
                    return result;
                }
            }
            else
            {
                _logger.LogWarning("KhmerTopUp games endpoint returned HTTP {Code}", res.StatusCode);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching live provider package catalog from KhmerTopUp: {Message}", ex.Message);
        }
        finally
        {
            _catalogLock.Release();
        }

        return _cachedCatalogs ?? new List<ProviderGameCatalogDto>();
    }

    public async Task<ProviderPackageDto?> LookupPackageByIdAsync(int packageId)
    {
        var catalogs = await LookupProviderPackagesAsync(false);
        return catalogs.SelectMany(c => c.Packages).FirstOrDefault(p => p.PackageId == packageId);
    }
}

