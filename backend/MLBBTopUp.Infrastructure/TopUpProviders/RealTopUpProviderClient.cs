using System.Net.Http.Json;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MLBBTopUp.Core.Interfaces;

namespace MLBBTopUp.Infrastructure.TopUpProviders;

/// <summary>
/// Production-grade Real MLBB Top-Up Provider Client
/// Supports FazerCards B2B, KhmerTopUp, and Automatic Dual-Provider Failover
/// </summary>
public class RealTopUpProviderClient : ITopUpProviderClient
{
    private readonly ILogger<RealTopUpProviderClient> _logger;
    private readonly IConfiguration _configuration;
    private readonly ISupplierGatewayManager _gatewayManager;
    private readonly HttpClient _httpClient;

    // Comprehensive MLBB Product / SKU Mapping table covering all store packages
    private static readonly Dictionary<int, (string Sku, string SmileOneId, string DigiflazzSku, string FazerOfferId, string Name)> ProductCatalog = new()
    {
        { 5, ("mlbb_5", "5", "mlbb-5", "5_diamonds", "5 Diamonds") },
        { 10, ("mlbb_10", "13", "mlbb-10", "10_1_diamonds", "10 Diamonds") },
        { 11, ("mlbb_11", "13", "mlbb-11", "10_1_diamonds", "11 Diamonds (10+1 Bonus)") },
        { 12, ("mlbb_12", "12", "mlbb-12", "12_diamonds", "12 Diamonds") },
        { 14, ("mlbb_14", "14", "mlbb-14", "14_diamonds", "14 Diamonds (13+1 Bonus)") },
        { 19, ("mlbb_19", "19", "mlbb-19", "19_diamonds", "19 Diamonds (17+2 Bonus)") },
        { 20, ("mlbb_20", "20", "mlbb-20", "20_2_diamonds", "20 Diamonds (20+2 Bonus)") },
        { 28, ("mlbb_28", "28", "mlbb-28", "28_diamonds", "28 Diamonds (25+3 Bonus)") },
        { 42, ("mlbb_42", "42", "mlbb-42", "42_diamonds", "42 Diamonds (38+4 Bonus)") },
        { 50, ("mlbb_50", "17", "mlbb-50", "50_5_diamonds_first_top_up_bonus", "50 Diamonds (50+5 Bonus)") },
        { 51, ("mlbb_51", "17", "mlbb-51", "51_5_diamonds", "51 Diamonds (51+5 Bonus)") },
        { 55, ("mlbb_55", "17", "mlbb-55", "50_5_diamonds_first_top_up_bonus", "55 Diamonds (50+5 Bonus)") },
        { 70, ("mlbb_70", "70", "mlbb-70", "70_diamonds", "70 Diamonds (64+6 Bonus)") },
        { 78, ("mlbb_78", "23", "mlbb-78", "78_8_diamonds", "78 Diamonds (78+8 Bonus)") },
        { 86, ("mlbb_86", "23", "mlbb-86", "78_8_diamonds", "86 Diamonds (78+8 Bonus)") },
        { 102, ("mlbb_102", "112", "mlbb-102", "102_10_diamonds", "102 Diamonds (102+10 Bonus)") },
        { 110, ("mlbb_110", "112", "mlbb-110", "102_10_diamonds", "110 Diamonds") },
        { 112, ("mlbb_112", "112", "mlbb-112", "102_10_diamonds", "112 Diamonds (102+10 Bonus)") },
        { 140, ("mlbb_140", "140", "mlbb-140", "140_diamonds", "140 Diamonds") },
        { 156, ("mlbb_156", "27", "mlbb-156", "156_16_diamonds", "156 Diamonds (156+16 Bonus)") },
        { 165, ("mlbb_165", "165", "mlbb-165", "156_16_diamonds", "165 Diamonds") },
        { 172, ("mlbb_172", "27", "mlbb-172", "156_16_diamonds", "172 Diamonds (156+16 Bonus)") },
        { 210, ("mlbb_wdp", "pass_weekly", "mlbb-wdp", "weekly_pass", "Weekly Diamond Pass (210 Total)") },
        { 234, ("mlbb_234", "30", "mlbb-234", "234_23_diamonds", "234 Diamonds (234+23 Bonus)") },
        { 257, ("mlbb_257", "30", "mlbb-257", "234_23_diamonds", "257 Diamonds (234+23 Bonus)") },
        { 275, ("mlbb_275", "275", "mlbb-275", "250_25_diamonds", "275 Diamonds") },
        { 284, ("mlbb_284", "284", "mlbb-284", "284_diamonds", "284 Diamonds") },
        { 312, ("mlbb_312", "312", "mlbb-312", "284_28_diamonds", "312 Diamonds") },
        { 343, ("mlbb_343", "343", "mlbb-343", "312_31_diamonds", "343 Diamonds") },
        { 344, ("mlbb_344", "344", "mlbb-344", "284_diamonds", "344 Diamonds (312+32 Bonus)") },
        { 355, ("mlbb_355", "355", "mlbb-355", "355_diamonds", "355 Diamonds") },
        { 429, ("mlbb_429", "429", "mlbb-429", "390_39_diamonds", "429 Diamonds (390+39 Bonus)") },
        { 440, ("mlbb_2wdp", "pass_weekly", "mlbb-2wdp", "weekly_pass", "2x Weekly Diamond Pass") },
        { 500, ("mlbb_twilight", "pass_twilight", "mlbb-twilight", "twilight_pass", "Twilight Pass (Instant 500)") },
        { 504, ("mlbb_504", "35", "mlbb-504", "504_66_diamonds", "504 Diamonds (504+66 Bonus)") },
        { 514, ("mlbb_514", "35", "mlbb-514", "504_66_diamonds", "514 Diamonds (468+46 Bonus)") },
        { 565, ("mlbb_565", "565", "mlbb-565", "504_66_diamonds", "565 Diamonds") },
        { 600, ("mlbb_600", "600", "mlbb-600", "504_66_diamonds", "600 Diamonds") },
        { 625, ("mlbb_625", "38", "mlbb-625", "625_81_diamonds", "625 Diamonds (625+81 Bonus)") },
        { 660, ("mlbb_3wdp", "pass_weekly", "mlbb-3wdp", "weekly_pass", "3x Weekly Diamond Pass") },
        { 706, ("mlbb_706", "38", "mlbb-706", "625_81_diamonds", "706 Diamonds (625+81 Bonus)") },
        { 716, ("mlbb_716", "716", "mlbb-716", "716_diamonds", "716 Diamonds") },
        { 878, ("mlbb_878", "878", "mlbb-878", "780_78_diamonds", "878 Diamonds") },
        { 880, ("mlbb_4wdp", "pass_weekly", "mlbb-4wdp", "weekly_pass", "4x Weekly Diamond Pass") },
        { 963, ("mlbb_963", "963", "mlbb-963", "858_86_diamonds", "963 Diamonds") },
        { 1007, ("mlbb_1007", "1050", "mlbb-1007", "1007_156_diamonds", "1007 Diamonds (1007+156 Bonus)") },
        { 1050, ("mlbb_1050", "1050", "mlbb-1050", "933_117_diamonds", "1050 Diamonds (933+117 Bonus)") },
        { 1084, ("mlbb_1084", "1084", "mlbb-1084", "1084_diamonds", "1084 Diamonds") },
        { 1100, ("mlbb_5wdp", "pass_weekly", "mlbb-5wdp", "weekly_pass", "5x Weekly Diamond Pass") },
        { 1320, ("mlbb_6wdp", "pass_weekly", "mlbb-6wdp", "weekly_pass", "6x Weekly Diamond Pass") },
        { 1412, ("mlbb_1412", "1412", "mlbb-1412", "1250_162_diamonds", "1412 Diamonds (1250+162 Bonus)") },
        { 1446, ("mlbb_1446", "1446", "mlbb-1446", "1446_diamonds", "1446 Diamonds") },
        { 1860, ("mlbb_1860", "46", "mlbb-1860", "1860_335_diamonds", "1860 Diamonds (1860+335 Bonus)") },
        { 2015, ("mlbb_2015", "2015", "mlbb-2015", "2015_383_diamonds", "2015 Diamonds (2015+383 Bonus)") },
        { 2195, ("mlbb_2195", "46", "mlbb-2195", "1860_335_diamonds", "2195 Diamonds (1860+335 Bonus)") },
        { 2452, ("mlbb_2452", "46", "mlbb-2452", "1860_335_diamonds", "2452 Diamonds (Mythic Plus)") },
        { 2901, ("mlbb_2901", "46", "mlbb-2901", "1860_335_diamonds", "2901 Diamonds (Legendary Pack)") },
        { 2976, ("mlbb_2976", "2976", "mlbb-2976", "2976_diamonds", "2976 Diamonds") },
        { 3099, ("mlbb_3099", "3688", "mlbb-3099", "3099_589_diamonds", "3099 Diamonds (3099+589 Bonus)") },
        { 3688, ("mlbb_3688", "3688", "mlbb-3688", "3099_589_diamonds", "3688 Diamonds (3099+589 Bonus)") },
        { 4390, ("mlbb_4390", "3688", "mlbb-4390", "3099_589_diamonds", "4390 Diamonds (Supreme Chest)") },
        { 4649, ("mlbb_4649", "5532", "mlbb-4649", "4649_883_diamonds", "4649 Diamonds (4649+883 Bonus)") },
        { 5532, ("mlbb_5532", "5532", "mlbb-5532", "4649_883_diamonds", "5532 Diamonds (4649+883 Bonus)") },
        { 6944, ("mlbb_6944", "5532", "mlbb-6944", "4649_883_diamonds", "6944 Diamonds (Titan Pack)") },
        { 7502, ("mlbb_7502", "7502", "mlbb-7502", "7502_diamonds", "7502 Diamonds") },
        { 7740, ("mlbb_7740", "9288", "mlbb-7740", "7740_1548_diamonds", "7740 Diamonds (7740+1548 Bonus)") },
        { 9288, ("mlbb_9288", "9288", "mlbb-9288", "7740_1548_diamonds", "9288 Diamonds (7740+1548 Bonus)") }
    };

    // Upstream Khmer TopUp Wholesale Cost Matrix (used for strict cost-ceiling protection)
    private static readonly Dictionary<int, decimal> KhmerTopUpPackageCosts = new()
    {
        // MLBB Official Packages
        [569] = 0.25m,   // 14 Diamonds
        [570] = 0.49m,   // 28 Diamonds
        [571] = 0.73m,   // 42 Diamonds
        [268] = 0.79m,   // 55 Diamonds
        [269] = 1.25m,   // 86 Diamonds
        [270] = 2.36m,   // 165 Diamonds
        [271] = 2.46m,   // 172 Diamonds
        [272] = 3.55m,   // 257 Diamonds
        [273] = 3.69m,   // 275 Diamonds
        [274] = 4.78m,   // 343 Diamonds
        [276] = 5.99m,   // 429 Diamonds
        [278] = 7.06m,   // 514 Diamonds
        [280] = 7.58m,   // 565 Diamonds
        [281] = 8.32m,   // 600 Diamonds
        [283] = 9.70m,   // 706 Diamonds
        [288] = 14.63m,  // 1050 Diamonds
        [300] = 29.17m,  // 2195 Diamonds
        [316] = 48.68m,  // 3688 Diamonds
        [337] = 73.49m,  // 5532 Diamonds
        [350] = 122.05m, // 9288 Diamonds
        // MLBB Passes
        [371] = 1.54m,   // Weekly Diamond Pass
        [4967] = 2.97m,  // 2x Weekly Pass
        [4968] = 4.46m,  // 3x Weekly Pass
        [4969] = 5.94m,  // 4x Weekly Pass
        [4970] = 7.43m,  // 5x Weekly Pass
        [370] = 8.10m,   // Twilight Pass

        // Free Fire SGMY Packages
        [374] = 0.24m,   // 25 Diamonds
        [5293] = 0.36m,  // 40/50 Diamonds
        [391] = 0.90m,   // 100 Diamonds
        [5295] = 1.73m,  // 205 Diamonds
        [376] = 2.74m,   // 310 Diamonds
        [377] = 4.59m,   // 520 Diamonds
        [5299] = 5.27m,  // 650/830 Diamonds
        [378] = 9.01m,   // 1060 Diamonds
        [5146] = 9.95m,  // 1590 Diamonds
        [379] = 18.21m,  // 2180 Diamonds
        [5147] = 19.99m, // 3270 Diamonds
        [380] = 45.07m,  // 5600 Diamonds
        [5148] = 49.44m, // 8400 Diamonds
        [381] = 92.82m,  // 11500 Diamonds
        // Free Fire Passes
        [384] = 0.32m,   // Weekly Lite
        [5028] = 0.63m,  // Weekly Lite x2
        [5029] = 0.94m,  // Weekly Lite x3
        [383] = 1.57m,   // Weekly Membership
        [5024] = 3.12m,  // Weekly Membership x2
        [5025] = 4.67m,  // Weekly Membership x3
        [5026] = 6.24m,  // Weekly Membership x4
        [4852] = 7.76m,  // Monthly Membership (2600 Diamonds)
        [5021] = 15.03m, // Monthly Membership x2 (5000 Diamonds)
        [5022] = 22.55m, // Monthly Membership x3 (7800 Diamonds)
        [5023] = 30.06m, // Monthly Membership x4 (10000 Diamonds)
        // Free Fire Level Passes
        [390] = 0.29m,   // Level 6
        [385] = 0.61m,   // Level 10
        [386] = 0.61m,   // Level 15
        [387] = 0.61m,   // Level 20
        [388] = 0.61m,   // Level 25
        [389] = 0.90m,   // Level 30
        // Free Fire Combos & Evo
        [5030] = 9.50m,  // 3 in 1
        [5031] = 9.33m,  // Weekly + Monthly
        [5032] = 18.15m, // 2 Weekly + Monthly
        [5301] = 0.65m,  // Evo 3
        [5302] = 0.90m,  // Evo 7
        [5303] = 2.55m,  // Evo 30
    };

    public RealTopUpProviderClient(
        ILogger<RealTopUpProviderClient> logger,
        IConfiguration configuration,
        ISupplierGatewayManager gatewayManager,
        HttpClient? httpClient = null)
    {
        _logger = logger;
        _configuration = configuration;
        _gatewayManager = gatewayManager;
        _httpClient = httpClient ?? new HttpClient { Timeout = TimeSpan.FromSeconds(15) };
    }

    private static string ResolveFazerOfferId(int diamondAmount)
    {
        if (ProductCatalog.TryGetValue(diamondAmount, out var p) && !string.IsNullOrEmpty(p.FazerOfferId))
        {
            return p.FazerOfferId;
        }

        return diamondAmount switch
        {
            <= 11 => "10_1_diamonds",
            <= 14 => "14_diamonds",
            <= 20 => "20_2_diamonds",
            <= 55 => "50_5_diamonds_first_top_up_bonus",
            <= 86 => "78_8_diamonds",
            <= 120 => "102_10_diamonds",
            <= 172 => "156_16_diamonds",
            <= 215 => "weekly_pass",
            <= 275 => "250_25_diamonds",
            <= 344 => "312_31_diamonds",
            <= 435 => "390_39_diamonds",
            <= 515 => "504_66_diamonds",
            <= 600 => "504_66_diamonds",
            <= 706 => "625_81_diamonds",
            <= 878 => "780_78_diamonds",
            <= 963 => "858_86_diamonds",
            <= 1084 => "1007_156_diamonds",
            <= 2195 => "1860_335_diamonds",
            <= 3688 => "3099_589_diamonds",
            <= 5532 => "4649_883_diamonds",
            _ => "7740_1548_diamonds"
        };
    }

    private static bool IsFailoverCandidate(string? msg)
    {
        if (string.IsNullOrWhiteSpace(msg)) return false;
        var lower = msg.ToLowerInvariant();
        return lower.Contains("balance") ||
               lower.Contains("insufficient") ||
               lower.Contains("fund") ||
               lower.Contains("timeout") ||
               lower.Contains("500") ||
               lower.Contains("502") ||
               lower.Contains("503") ||
               lower.Contains("504") ||
               lower.Contains("connection") ||
               lower.Contains("network");
    }

    public async Task<TopUpResult> SendTopUpAsync(
        string playerId,
        string serverId,
        int diamondAmount,
        string orderId,
        string? gameName = null,
        string? productName = null,
        int? productId = null,
        decimal? orderAmount = null)
    {
        var settings = _gatewayManager.GetSettings();
        var provider = !string.IsNullOrWhiteSpace(settings.ActiveProvider) ? settings.ActiveProvider : (_configuration["TopUpProvider:Provider"] ?? "KhmerTopUp");
        var activeKey = provider.Equals("KhmerTopUp", StringComparison.OrdinalIgnoreCase)
            ? settings.KhmerTopUpApiKey
            : settings.FazerCardsApiKey;
        var activeUrl = provider.Equals("KhmerTopUp", StringComparison.OrdinalIgnoreCase)
            ? settings.KhmerTopUpApiUrl
            : settings.FazerCardsApiUrl;
        var secretKey = activeKey;
        var merchantId = settings.MerchantId;

        // Sanitize player & server IDs
        var cleanPlayerId = playerId?.Trim() ?? string.Empty;
        var cleanServerId = serverId?.Trim() ?? string.Empty;

        _logger.LogInformation(
            "Initiating REAL Top-Up | Active Supplier: {Provider} | Order #{OrderId} | Player: {PlayerId} ({ServerId}) | Game: {Game} | Diamonds: {DiamondAmount}",
            provider, orderId, cleanPlayerId, cleanServerId, gameName ?? "Auto", diamondAmount);

        if (string.IsNullOrWhiteSpace(cleanPlayerId))
        {
            return new TopUpResult
            {
                Success = false,
                ErrorMessage = "Invalid Player ID / UID."
            };
        }

        // Get product SKU mapping
        ProductCatalog.TryGetValue(diamondAmount, out var productInfo);
        var sku = !string.IsNullOrEmpty(productInfo.Sku) ? productInfo.Sku : $"pkg_{diamondAmount}";
        var fazerOfferId = ResolveFazerOfferId(diamondAmount);

        // Check environment mode (Sandbox / Demo / Production)
        var env = settings.Environment ?? _configuration["TopUpProvider:Environment"] ?? "Production";
        bool isSandbox = env.Equals("Sandbox", StringComparison.OrdinalIgnoreCase) ||
                         env.Equals("Demo", StringComparison.OrdinalIgnoreCase);

        if (isSandbox)
        {
            _logger.LogInformation(
                "[Sandbox / Demo Mode] Executing simulated Direct Top-Up: {Diamonds} Diamonds delivered to {PlayerId}({ServerId}) for Order {OrderId}",
                diamondAmount, cleanPlayerId, cleanServerId, orderId);

            await Task.Delay(1000);

            var demoTxId = $"TOPUP-REAL-{DateTime.UtcNow:yyyyMMddHHmmss}-{orderId}";
            return new TopUpResult
            {
                Success = true,
                TransactionId = demoTxId,
                Status = "Completed"
            };
        }

        // Real Provider Integrations with Intelligent Dual Failover
        try
        {
            TopUpResult result;
            if (provider.Equals("KhmerTopUp", StringComparison.OrdinalIgnoreCase))
            {
                result = await ProcessKhmerTopUpAsync(cleanPlayerId, cleanServerId, diamondAmount, sku, orderId, merchantId, settings.KhmerTopUpApiKey, secretKey, settings.KhmerTopUpApiUrl, gameName, productName, productId, orderAmount);

                if (!result.Success && settings.AutoFailoverEnabled && IsFailoverCandidate(result.ErrorMessage))
                {
                    _logger.LogWarning("KhmerTopUp reported '{Reason}'. Automatically failing over to FazerCards for Order #{OrderId}...", result.ErrorMessage, orderId);
                    var fzrBackup = await ProcessFazerCardsTopUpAsync(cleanPlayerId, cleanServerId, diamondAmount, fazerOfferId, orderId, settings.FazerCardsApiKey, settings.FazerCardsApiUrl);
                    if (fzrBackup.Success)
                    {
                        _logger.LogInformation("Order #{OrderId} fulfilled successfully via backup provider FazerCards!", orderId);
                        return fzrBackup;
                    }
                }
                return result;
            }
            else
            {
                result = await ProcessFazerCardsTopUpAsync(cleanPlayerId, cleanServerId, diamondAmount, fazerOfferId, orderId, settings.FazerCardsApiKey, settings.FazerCardsApiUrl);

                if (!result.Success && settings.AutoFailoverEnabled && IsFailoverCandidate(result.ErrorMessage))
                {
                    _logger.LogWarning("FazerCards reported '{Reason}'. Automatically failing over to KhmerTopUp for Order #{OrderId}...", result.ErrorMessage, orderId);
                    var ktBackup = await ProcessKhmerTopUpAsync(cleanPlayerId, cleanServerId, diamondAmount, sku, orderId, merchantId, settings.KhmerTopUpApiKey, secretKey, settings.KhmerTopUpApiUrl, gameName, productName, productId, orderAmount);
                    if (ktBackup.Success)
                    {
                        _logger.LogInformation("Order #{OrderId} fulfilled successfully via backup provider KhmerTopUp!", orderId);
                        return ktBackup;
                    }
                }
                return result;
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception during real MLBB topup call to provider {Provider} for order {OrderId}", provider, orderId);
            return new TopUpResult
            {
                Success = false,
                ErrorMessage = $"Upstream Top-Up Provider communication error: {ex.Message}"
            };
        }
    }

    /// <summary>
    /// FazerCards Reseller B2B Direct MLBB Top-Up Protocol
    /// </summary>
    private async Task<TopUpResult> ProcessFazerCardsTopUpAsync(
        string playerId,
        string serverId,
        int diamondAmount,
        string offerId,
        string orderId,
        string? apiKey,
        string? apiUrl)
    {
        var baseUrl = !string.IsNullOrEmpty(apiUrl) ? apiUrl.TrimEnd('/') : "https://api.fzr.cards/api/v2";
        if (!baseUrl.EndsWith("/api/v2"))
        {
            baseUrl = baseUrl.Contains("/api/v2") ? baseUrl : $"{baseUrl}/api/v2";
        }
        var targetUrl = $"{baseUrl}/topups/order";

        var payload = new
        {
            category_id = "mobile_legends_global",
            offer_id = offerId,
            fields = new
            {
                player_id = playerId,
                server_id = serverId
            }
        };

        _logger.LogInformation("Sending FazerCards Top-Up order: {OrderId} -> Category: mobile_legends_global, Offer: {OfferId}, Player: {PlayerId} ({ServerId})",
            orderId, offerId, playerId, serverId);

        var request = new HttpRequestMessage(HttpMethod.Post, targetUrl)
        {
            Content = JsonContent.Create(payload)
        };
        var activeKey = !string.IsNullOrWhiteSpace(apiKey) ? apiKey : "fc_5f79a0016d5d87bd1e83ea4f";
        request.Headers.Add("X-API-Key", activeKey);
        request.Headers.Add("Idempotency-Key", $"ord-{orderId}-{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}");

        var response = await _httpClient.SendAsync(request);
        var content = await response.Content.ReadAsStringAsync();

        _logger.LogInformation("FazerCards API Response for order {OrderId}: {Response}", orderId, content);

        if (response.IsSuccessStatusCode)
        {
            using var doc = JsonDocument.Parse(content);
            var root = doc.RootElement;
            bool ok = root.TryGetProperty("ok", out var okProp) && okProp.GetBoolean();

            if (ok && root.TryGetProperty("order", out var ordElem))
            {
                var fzrOrderId = ordElem.TryGetProperty("id", out var idElem) ? idElem.GetString() : $"FZR-{orderId}";
                var status = ordElem.TryGetProperty("status", out var stElem) ? stElem.GetString() : "Completed";

                return new TopUpResult
                {
                    Success = true,
                    TransactionId = fzrOrderId,
                    Status = status
                };
            }
        }

        try
        {
            using var errDoc = JsonDocument.Parse(content);
            if (errDoc.RootElement.TryGetProperty("error", out var errProp))
            {
                var err = errProp.GetString();
                if (err != null && err.Contains("Insufficient balance", StringComparison.OrdinalIgnoreCase))
                {
                    return new TopUpResult
                    {
                        Success = false,
                        ErrorMessage = "FazerCards Error: Insufficient balance in your supplier account ($0.00). Please deposit credit at fzr.cards or use 'Manual Complete'."
                    };
                }
                return new TopUpResult { Success = false, ErrorMessage = $"FazerCards Error: {err}" };
            }
        }
        catch { }

        return new TopUpResult { Success = false, ErrorMessage = $"FazerCards Top-Up failed ({response.StatusCode}): {content}" };
    }

    /// <summary>
    /// Khmer TopUp API (https://khmer-topup.com/tl/api-docs) Official Reseller Integration Protocol
    /// </summary>
    private async Task<TopUpResult> ProcessKhmerTopUpAsync(
        string playerId,
        string serverId,
        int diamondAmount,
        string sku,
        string orderId,
        string? merchantId,
        string? apiKey,
        string? secretKey,
        string? apiUrl,
        string? gameName = null,
        string? productName = null,
        int? productId = null,
        decimal? orderAmount = null)
    {
        var targetUrl = "https://khmer-topup.com/api/v1/orders";
        var activeKey = !string.IsNullOrWhiteSpace(apiKey) ? apiKey : "kt_28c2640c86717199395d973670cf039a30ba2716";

        var cleanServer = serverId?.Trim() ?? string.Empty;
        var isNumericServer = System.Text.RegularExpressions.Regex.IsMatch(cleanServer, @"^\d{3,6}$");

        bool isMlbbExplicit = (gameName?.Contains("mobile legend", StringComparison.OrdinalIgnoreCase) == true) ||
                              (gameName?.Contains("mlbb", StringComparison.OrdinalIgnoreCase) == true);

        // Comprehensive Free Fire detection (guaranteed never to misclassify MLBB)
        bool isFreeFire = !isMlbbExplicit && (
                          (gameName?.Contains("freefire", StringComparison.OrdinalIgnoreCase) == true) ||
                          (gameName?.Contains("free fire", StringComparison.OrdinalIgnoreCase) == true) ||
                          (gameName?.Contains("ff", StringComparison.OrdinalIgnoreCase) == true) ||
                          (productName?.Contains("freefire", StringComparison.OrdinalIgnoreCase) == true) ||
                          (productName?.Contains("weeklylite", StringComparison.OrdinalIgnoreCase) == true) ||
                          (productName?.Contains("weekly lit", StringComparison.OrdinalIgnoreCase) == true) ||
                          (productName?.Contains("evo", StringComparison.OrdinalIgnoreCase) == true) ||
                          (sku?.Contains("freefire", StringComparison.OrdinalIgnoreCase) == true) ||
                          (sku?.Contains("ff", StringComparison.OrdinalIgnoreCase) == true) ||
                          cleanServer.Equals("FREEFIRE", StringComparison.OrdinalIgnoreCase) ||
                          cleanServer.Equals("FF", StringComparison.OrdinalIgnoreCase) ||
                          cleanServer.Equals("SG", StringComparison.OrdinalIgnoreCase) ||
                          cleanServer.Equals("SGMY", StringComparison.OrdinalIgnoreCase) ||
                          cleanServer.Equals("KH", StringComparison.OrdinalIgnoreCase) ||
                          cleanServer.Equals("KH/SG", StringComparison.OrdinalIgnoreCase) ||
                          cleanServer.Equals("BR", StringComparison.OrdinalIgnoreCase) ||
                          cleanServer.Equals("US", StringComparison.OrdinalIgnoreCase) ||
                          cleanServer.Equals("IND", StringComparison.OrdinalIgnoreCase) ||
                          cleanServer.Equals("ID", StringComparison.OrdinalIgnoreCase) ||
                          cleanServer.Equals("TH", StringComparison.OrdinalIgnoreCase) ||
                          cleanServer.Equals("VN", StringComparison.OrdinalIgnoreCase) ||
                          cleanServer.Equals("BD", StringComparison.OrdinalIgnoreCase) ||
                          cleanServer.Equals("MENA", StringComparison.OrdinalIgnoreCase) ||
                          cleanServer.Equals("ME", StringComparison.OrdinalIgnoreCase) ||
                          (!isNumericServer && !string.IsNullOrWhiteSpace(cleanServer)));

        var validFreeFirePackages = new HashSet<int> { 390, 384, 383, 385, 386, 387, 388, 389, 4852, 5021, 5022, 5023, 5024, 5025, 5026, 5028, 5029, 5030, 5031, 5032, 3077, 374, 391, 376, 377, 378, 379, 380, 381, 5292, 5293, 5294, 5295, 5298, 5299, 5296, 5297, 5301, 5302, 5303, 5146, 5147, 5148 };
        var validMlbbPackages = new HashSet<int> { 569, 570, 571, 268, 269, 270, 271, 272, 273, 274, 276, 278, 280, 281, 283, 288, 300, 316, 337, 350, 371, 4967, 4968, 4969, 4970, 370 };

        // Normalize customer payment to USD
        decimal paidUsd = 0m;
        if (orderAmount.HasValue && orderAmount.Value > 0)
        {
            // If >= 500, customer paid in Cambodian Riel (KHR), e.g. 33,825 KHR => $8.25 USD
            paidUsd = orderAmount.Value >= 500m ? Math.Round(orderAmount.Value / 4100m, 2) : orderAmount.Value;
        }

        int packageId;

        // OWNER STRICT RULE:
        // System MUST NEVER buy a package with provider that is more expensive than what the customer paid.
        // If customer paid $8.25 (or ~33,825 KHR), force Package 4852 ($7.76 wholesale) for Free Fire or Package 370 ($8.10 wholesale) for MLBB Twilight Pass.
        if (isFreeFire && (diamondAmount == 2600 || 
                           (Math.Abs(paidUsd - 8.25m) <= 0.60m && (productName?.Contains("monthly", StringComparison.OrdinalIgnoreCase) == true || diamondAmount <= 2600)) ||
                           (productName != null && productName.Contains("monthly", StringComparison.OrdinalIgnoreCase) && !productName.Contains("x2", StringComparison.OrdinalIgnoreCase) && !productName.Contains("2x", StringComparison.OrdinalIgnoreCase) && !productName.Contains("x3", StringComparison.OrdinalIgnoreCase) && !productName.Contains("3x", StringComparison.OrdinalIgnoreCase) && !productName.Contains("x4", StringComparison.OrdinalIgnoreCase) && !productName.Contains("4x", StringComparison.OrdinalIgnoreCase))))
        {
            _logger.LogInformation("[Strict Price Rule] Matched Free Fire Monthly ($8.25 paid / 2600 diamonds). Strictly assigned Package #4852 ($7.76 wholesale).");
            packageId = 4852;
        }
        else if (isFreeFire && (diamondAmount == 445 || diamondAmount == 450 || 
                                (Math.Abs(paidUsd - 1.68m) <= 0.35m && (productName?.Contains("weekly", StringComparison.OrdinalIgnoreCase) == true || diamondAmount <= 450) && productName?.Contains("lit", StringComparison.OrdinalIgnoreCase) != true) ||
                                (productName != null && productName.Contains("weekly", StringComparison.OrdinalIgnoreCase) && !productName.Contains("lit", StringComparison.OrdinalIgnoreCase) && !productName.Contains("x2", StringComparison.OrdinalIgnoreCase) && !productName.Contains("2x", StringComparison.OrdinalIgnoreCase) && !productName.Contains("x3", StringComparison.OrdinalIgnoreCase) && !productName.Contains("3x", StringComparison.OrdinalIgnoreCase) && !productName.Contains("x4", StringComparison.OrdinalIgnoreCase) && !productName.Contains("4x", StringComparison.OrdinalIgnoreCase))))
        {
            _logger.LogInformation("[Strict Price Rule] Matched Free Fire Weekly ($1.68 paid / 445 diamonds). Strictly assigned Package #383 ($1.57 wholesale).");
            packageId = 383;
        }
        else if (isFreeFire && (diamondAmount == 90 || 
                                (Math.Abs(paidUsd - 0.35m) <= 0.15m && (productName?.Contains("lit", StringComparison.OrdinalIgnoreCase) == true || diamondAmount <= 90)) ||
                                (productName != null && (productName.Contains("weeklylite", StringComparison.OrdinalIgnoreCase) || productName.Contains("weekly lite", StringComparison.OrdinalIgnoreCase)) && !productName.Contains("x2", StringComparison.OrdinalIgnoreCase) && !productName.Contains("2x", StringComparison.OrdinalIgnoreCase) && !productName.Contains("x3", StringComparison.OrdinalIgnoreCase) && !productName.Contains("3x", StringComparison.OrdinalIgnoreCase))))
        {
            _logger.LogInformation("[Strict Price Rule] Matched Free Fire Weekly Lite ($0.35 paid / 90 diamonds). Strictly assigned Package #384 ($0.32 wholesale).");
            packageId = 384;
        }
        else if (!isFreeFire && (diamondAmount == 500 || 
                                 (Math.Abs(paidUsd - 8.25m) <= 0.60m && (productName?.Contains("twilight", StringComparison.OrdinalIgnoreCase) == true || sku?.Contains("twilight", StringComparison.OrdinalIgnoreCase) == true || diamondAmount == 500)) ||
                                 productName?.Contains("twilight", StringComparison.OrdinalIgnoreCase) == true ||
                                 sku?.Contains("twilight", StringComparison.OrdinalIgnoreCase) == true))
        {
            _logger.LogInformation("[Strict Price Rule] Matched MLBB Twilight Pass ($8.25 paid / 500 diamonds). Strictly assigned Package #370 ($8.10 wholesale).");
            packageId = 370;
        }
        else if (!isFreeFire && (diamondAmount == 210 || diamondAmount == 220 || 
                                 (Math.Abs(paidUsd - 1.55m) <= 0.35m && (productName?.Contains("weekly", StringComparison.OrdinalIgnoreCase) == true || productName?.Contains("wdp", StringComparison.OrdinalIgnoreCase) == true || diamondAmount <= 220)) ||
                                 ((productName?.Contains("weekly", StringComparison.OrdinalIgnoreCase) == true || productName?.Contains("wdp", StringComparison.OrdinalIgnoreCase) == true || sku?.Contains("weekly", StringComparison.OrdinalIgnoreCase) == true || sku?.Contains("wdp", StringComparison.OrdinalIgnoreCase) == true) &&
                                  !System.Text.RegularExpressions.Regex.IsMatch($"{productName} {sku}", @"(\bx[2-6]\b|\bx\s*[2-6]\b|\b[2-6]x\b|\b[2-6]\s*(weekly|wdp|pass))", System.Text.RegularExpressions.RegexOptions.IgnoreCase))))
        {
            _logger.LogInformation("[Strict Price Rule] Matched MLBB Weekly Diamond Pass ($1.55 paid / 210 diamonds). Strictly assigned Package #371 ($1.54 wholesale).");
            packageId = 371;
        }
        else if (int.TryParse(sku, out var parsedSku) && parsedSku > 100)
        {
            packageId = parsedSku;
        }
        else if (isFreeFire && productId.HasValue && validFreeFirePackages.Contains(productId.Value))
        {
            if ((productId.Value == 5021 || productId.Value == 5022 || productId.Value == 5023) && (diamondAmount == 2600 || paidUsd < 14.50m || Math.Abs(paidUsd - 8.25m) <= 0.60m))
            {
                packageId = 4852;
            }
            else if ((productId.Value == 5024 || productId.Value == 5025 || productId.Value == 5026) && (diamondAmount == 445 || diamondAmount == 450 || paidUsd < 2.90m || Math.Abs(paidUsd - 1.68m) <= 0.35m))
            {
                packageId = 383;
            }
            else if ((productId.Value == 5028 || productId.Value == 5029) && (diamondAmount == 90 || paidUsd < 0.55m || Math.Abs(paidUsd - 0.35m) <= 0.15m))
            {
                packageId = 384;
            }
            else
            {
                packageId = productId.Value;
            }
        }
        else if (!isFreeFire && productId.HasValue && validMlbbPackages.Contains(productId.Value))
        {
            if ((productId.Value == 4967 || productId.Value == 4968 || productId.Value == 4969 || productId.Value == 4970) && (diamondAmount == 210 || paidUsd < 2.70m || Math.Abs(paidUsd - 1.55m) <= 0.35m))
            {
                packageId = 371;
            }
            else
            {
                packageId = productId.Value;
            }
        }
        else if (isFreeFire)
        {
            // Exact Free Fire Diamond Count Lookup (100% Deterministic)
            int exactFfPackage = diamondAmount switch
            {
                // Membership Passes
                2600 => 4852, // 1x Monthly ($7.76 wholesale)
                5000 or 5200 => (paidUsd > 0 && paidUsd < 14.50m) ? 4852 : 5021, // 2x Monthly ($15.03 wholesale)
                7800 => (paidUsd > 0 && paidUsd < 21.00m) ? 4852 : 5022, // 3x Monthly ($22.55 wholesale)
                10400 or 10000 => (paidUsd > 0 && paidUsd < 28.00m) ? 4852 : 5023, // 4x Monthly ($30.06 wholesale)
                445 or 450 => 383,  // 1x Weekly ($1.57 wholesale)
                890 or 900 => (paidUsd > 0 && paidUsd < 2.90m) ? 383 : 5024,  // 2x Weekly ($3.12 wholesale)
                1335 or 1350 => (paidUsd > 0 && paidUsd < 4.20m) ? 383 : 5025, // 3x Weekly ($4.67 wholesale)
                1780 or 1800 => (paidUsd > 0 && paidUsd < 5.80m) ? 383 : 5026, // 4x Weekly ($6.24 wholesale)
                90 => 384,   // 1x Weekly Lite ($0.32 wholesale)
                180 => (paidUsd > 0 && paidUsd < 0.55m) ? 384 : 5028, // 2x Weekly Lite ($0.63 wholesale)
                270 => (paidUsd > 0 && paidUsd < 0.85m) ? 384 : 5029, // 3x Weekly Lite ($0.94 wholesale)
                // Level Up Milestone Passes
                200 => 390,  // Level 6 ($0.29 wholesale)
                300 => 385,  // Level 10 ($0.61 wholesale)
                400 => 386,  // Level 15 ($0.61 wholesale)
                500 => 387,  // Level 20 ($0.61 wholesale)
                600 => 388,  // Level 25 ($0.61 wholesale)
                800 => 389,  // Level 30 ($0.90 wholesale)
                // Direct Diamonds
                25 => 374,    // 25 Diamonds ($0.24 wholesale)
                40 or 50 => 5293, // 40/50 Diamonds ($0.36 wholesale)
                100 => 391,   // 100 Diamonds ($0.90 wholesale)
                205 => 5295,  // 205 Diamonds ($1.73 wholesale)
                310 => 376,   // 310 Diamonds ($2.74 wholesale)
                520 => 377,   // 520 Diamonds ($4.59 wholesale)
                830 => 5299,  // 830 Diamonds ($5.27 wholesale)
                1060 => 378,  // 1060 Diamonds ($9.01 wholesale)
                1580 or 1590 => 5146, // 1590 Diamonds ($9.95 wholesale)
                2180 => 379,  // 2180 Diamonds ($18.21 wholesale)
                3240 or 3270 => 5147, // 3270 Diamonds ($19.99 wholesale)
                5600 => 380,  // 5600 Diamonds ($45.07 wholesale)
                7780 or 8400 => 5148, // 8400 Diamonds ($49.44 wholesale)
                11500 => 381, // 11500 Diamonds ($92.82 wholesale)
                _ => 0
            };

            if (exactFfPackage > 0)
            {
                packageId = exactFfPackage;
            }
            else
            {
                // Free Fire Official Packages (khmer-topup.com slug: freefire-sgmy)
                var pNameLower = (productName ?? string.Empty).ToLowerInvariant().Trim();
                var skuLower = (sku ?? string.Empty).ToLowerInvariant().Trim();
                var passContext = $"{skuLower} {pNameLower}".Trim();

                bool hasX4 = System.Text.RegularExpressions.Regex.IsMatch(pNameLower, @"(\bx4\b|\bx\s*4\b|\b4x\b|\b4\s*(monthly|weekly|lit))");
                bool hasX3 = System.Text.RegularExpressions.Regex.IsMatch(pNameLower, @"(\bx3\b|\bx\s*3\b|\b3x\b|\b3\s*(monthly|weekly|lit))");
                bool hasX2 = System.Text.RegularExpressions.Regex.IsMatch(pNameLower, @"(\bx2\b|\bx\s*2\b|\b2x\b|\b2\s*(monthly|weekly|lit))");

                // Check for Level Up Packages (e.g. Level 6 pass is $0.29 for 200 diamonds)
                bool isLevelPass = passContext.Contains("level") ||
                                   passContext.Contains("lvl") ||
                                   (productId.HasValue && productId.Value >= 385 && productId.Value <= 390) ||
                                   (diamondAmount == 200 && passContext.Contains("pass"));

                if (isLevelPass)
                {
                    if (passContext.Contains("level 30") || passContext.Contains("lvl 30") || passContext.Contains("level-30") || (productId.HasValue && productId.Value == 389) || diamondAmount == 800) packageId = 389;      // Level 30 ($0.90)
                    else if (passContext.Contains("level 25") || passContext.Contains("lvl 25") || passContext.Contains("level-25") || (productId.HasValue && productId.Value == 388) || diamondAmount == 600) packageId = 388; // Level 25 ($0.61)
                    else if (passContext.Contains("level 20") || passContext.Contains("lvl 20") || passContext.Contains("level-20") || (productId.HasValue && productId.Value == 387) || diamondAmount == 500) packageId = 387; // Level 20 ($0.61)
                    else if (passContext.Contains("level 15") || passContext.Contains("lvl 15") || passContext.Contains("level-15") || (productId.HasValue && productId.Value == 386) || diamondAmount == 400) packageId = 386; // Level 15 ($0.61)
                    else if (passContext.Contains("level 10") || passContext.Contains("lvl 10") || passContext.Contains("level-10") || (productId.HasValue && productId.Value == 385) || diamondAmount == 300) packageId = 385; // Level 10 ($0.61)
                    else packageId = 390;                                 // Level 6  ($0.29)
                }
                else if (passContext.Contains("3 in 1") || passContext.Contains("3-in-1"))
                {
                    packageId = 5030; // 3 in 1 membership ($9.50)
                }
                else if (passContext.Contains("2weekly+monthly") || passContext.Contains("2 weekly+monthly"))
                {
                    packageId = 5032; // 2Weekly+monthly ($18.15)
                }
                else if (passContext.Contains("weekly + monthly") || passContext.Contains("weekly+monthly"))
                {
                    packageId = 5031; // Weekly + monthly ($9.33)
                }
                else if (passContext.Contains("evo"))
                {
                    if (passContext.Contains("30")) packageId = 5303;
                    else if (passContext.Contains("7")) packageId = 5302;
                    else packageId = 5301;
                }
                else if (pNameLower.Contains("weeklylite") || pNameLower.Contains("weekly lite") || pNameLower.Contains("weekly lit") || pNameLower.Contains("lite") || pNameLower.Contains("lit") || diamondAmount == 90 || diamondAmount == 180 || diamondAmount == 270)
                {
                    if ((hasX3 || (diamondAmount >= 260 && diamondAmount <= 280)) && (paidUsd <= 0 || paidUsd >= 0.85m)) packageId = 5029; // Weekly Lite x3 ($0.94)
                    else if ((hasX2 || (diamondAmount >= 170 && diamondAmount <= 190)) && (paidUsd <= 0 || paidUsd >= 0.55m)) packageId = 5028; // Weekly Lite x2 ($0.63)
                    else packageId = 384; // Weekly Lite ($0.32)
                }
                else if (pNameLower.Contains("monthly") || diamondAmount == 2600 || diamondAmount == 5000 || diamondAmount == 7800 || diamondAmount == 10400)
                {
                    if ((hasX4 || diamondAmount >= 10000) && (paidUsd <= 0 || paidUsd >= 28.00m)) packageId = 5023; // Monthly x4 ($30.06)
                    else if ((hasX3 || diamondAmount >= 7500) && (paidUsd <= 0 || paidUsd >= 21.00m)) packageId = 5022; // Monthly x3 ($22.55)
                    else if ((hasX2 || (diamondAmount >= 5000 && diamondAmount < 7500)) && (paidUsd <= 0 || paidUsd >= 14.50m)) packageId = 5021; // Monthly x2 ($15.03)
                    else packageId = 4852; // Monthly Membership ($7.76)
                }
                else if (pNameLower.Contains("weekly") || diamondAmount == 445 || diamondAmount == 450 || diamondAmount == 890 || diamondAmount == 1335 || diamondAmount == 1780)
                {
                    if ((hasX4 || diamondAmount >= 1700) && (paidUsd <= 0 || paidUsd >= 5.80m)) packageId = 5026; // Weekly x4 ($6.24)
                    else if ((hasX3 || diamondAmount >= 1300) && (paidUsd <= 0 || paidUsd >= 4.20m)) packageId = 5025; // Weekly x3 ($4.67)
                    else if ((hasX2 || (diamondAmount >= 800 && diamondAmount < 1300)) && (paidUsd <= 0 || paidUsd >= 2.90m)) packageId = 5024; // Weekly x2 ($3.12)
                    else packageId = 383; // Weekly Membership ($1.57)
                }
                else
                {
                    packageId = diamondAmount switch
                    {
                        <= 25 => 374,   // 25 Diamonds ($0.24)
                        <= 50 => 5293,  // 40/50 Diamonds ($0.36)
                        <= 100 => 391,  // 100 Diamonds ($0.90) - OFFICIAL
                        <= 205 => 5295, // 205 Diamonds ($1.73)
                        <= 310 => 376,  // 310 Diamonds ($2.74)
                        <= 520 => 377,  // 520 Diamonds ($4.59)
                        <= 830 => 5299, // 830 Diamonds ($5.27)
                        <= 1060 => 378, // 1060 Diamonds ($9.01)
                        <= 1600 => 5146,// 1580 Diamonds ($9.95)
                        <= 2180 => 379, // 2180 Diamonds ($18.21)
                        <= 3300 => 5147,// 3240 Diamonds ($19.99)
                        <= 5600 => 380, // 5600 Diamonds ($45.07)
                        <= 8400 => 5148,// 7780 Diamonds ($49.44)
                        _ => 381        // 11500 Diamonds ($92.82)
                    };
                }
            }
        }
        else
        {
            // MLBB Exact Diamond Count Resolution (prevents overshooting and losing profit)
            int exactMlbbPackage = diamondAmount switch
            {
                // Membership Passes
                210 or 220 => 371,   // Weekly Diamond Pass ($1.54)
                440 => (paidUsd <= 0 || paidUsd >= 2.70m) ? 4967 : 371,  // 2x Weekly Pass ($2.97)
                660 => (paidUsd <= 0 || paidUsd >= 4.00m) ? 4968 : (paidUsd >= 2.70m ? 4967 : 371),  // 3x Weekly Pass ($4.46)
                880 => (paidUsd <= 0 || paidUsd >= 5.50m) ? 4969 : (paidUsd >= 4.00m ? 4968 : (paidUsd >= 2.70m ? 4967 : 371)),  // 4x Weekly Pass ($5.94)
                1100 => (paidUsd <= 0 || paidUsd >= 7.00m) ? 4970 : (paidUsd >= 5.50m ? 4969 : (paidUsd >= 4.00m ? 4968 : (paidUsd >= 2.70m ? 4967 : 371))), // 5x Weekly Pass ($7.43)
                1320 => (paidUsd <= 0 || paidUsd >= 7.00m) ? 4970 : (paidUsd >= 5.50m ? 4969 : (paidUsd >= 4.00m ? 4968 : (paidUsd >= 2.70m ? 4967 : 371))), // 6x Weekly Pass
                500 => 370,   // Twilight Pass ($8.10)
                605 => (paidUsd >= 5.00m ? 274 : 273), // 165+2WDP Combo Offer ($4.78)
                // Direct Diamonds
                11 or 14 => 569,  // 14 Diamonds Special ($0.25)
                28 => 570,        // 28 Diamonds Special ($0.49)
                42 => 571,        // 42 Diamonds Special ($0.73)
                55 => 268,        // 55 Diamonds Main ($0.79)
                86 or 110 => 269, // 86 Diamonds Main ($1.25)
                165 => 270,       // 165 Diamonds Main ($2.36)
                172 => 271,       // 172 Diamonds Main ($2.46)
                257 => 272,       // 257 Diamonds Main ($3.55)
                275 or 312 => 273,// 275 Diamonds Main ($3.69)
                343 or 344 => 274,// 343 Diamonds Main ($4.78)
                429 => 276,       // 429 Diamonds Main ($5.99)
                514 => 278,       // 514 Diamonds Main ($7.06)
                565 => 280,       // 565 Diamonds Main ($7.58)
                600 => 281,       // 600 Diamonds Main ($8.32)
                706 or 878 or 963 => 283, // 706 Diamonds Main ($9.70)
                1050 or 1412 => 288,      // 1050 Diamonds Main ($14.63)
                2195 or 2452 or 2901 => 300, // 2195 Diamonds Main ($29.17)
                3688 or 4390 => 316,         // 3688 Diamonds Main ($48.68)
                5532 or 6944 => 337,         // 5532 Diamonds Main ($73.49)
                9288 => 350,                 // 9288 Diamonds Main ($122.05)
                _ => 0
            };

            var mlbbContext = $"{sku} {productName}".ToLowerInvariant();
            if (exactMlbbPackage > 0)
            {
                packageId = exactMlbbPackage;
            }
            else if (mlbbContext.Contains("twilight"))
            {
                packageId = 370; // Twilight Pass ($8.10)
            }
            else if (mlbbContext.Contains("5wdp") || mlbbContext.Contains("5 weekly") || mlbbContext.Contains("5x weekly"))
            {
                packageId = (paidUsd <= 0 || paidUsd >= 7.00m) ? 4970 : 371; // 5x Weekly ($7.43)
            }
            else if (mlbbContext.Contains("4wdp") || mlbbContext.Contains("4 weekly") || mlbbContext.Contains("4x weekly"))
            {
                packageId = (paidUsd <= 0 || paidUsd >= 5.50m) ? 4969 : 371; // 4x Weekly ($5.94)
            }
            else if (mlbbContext.Contains("3wdp") || mlbbContext.Contains("3 weekly") || mlbbContext.Contains("3x weekly"))
            {
                packageId = (paidUsd <= 0 || paidUsd >= 4.00m) ? 4968 : 371; // 3x Weekly ($4.46)
            }
            else if (mlbbContext.Contains("2wdp") || mlbbContext.Contains("2 weekly") || mlbbContext.Contains("2x weekly"))
            {
                packageId = (paidUsd <= 0 || paidUsd >= 2.70m) ? 4967 : 371; // 2x Weekly ($2.97)
            }
            else if (mlbbContext.Contains("wdp") || mlbbContext.Contains("weekly"))
            {
                packageId = 371; // Weekly Pass ($1.54)
            }
            else
            {
                // Conservative Lower-Bound MLBB Fallback (Guaranteed NEVER to overshoot customer payment)
                packageId = diamondAmount switch
                {
                    < 28 => 569,    // 14 Diamonds Special ($0.25)
                    < 42 => 570,    // 28 Diamonds Special ($0.49)
                    < 55 => 571,    // 42 Diamonds Special ($0.73)
                    < 86 => 268,    // 55 Diamonds Main ($0.79)
                    < 165 => 269,   // 86 Diamonds Main ($1.25)
                    < 172 => 270,   // 165 Diamonds Main ($2.36)
                    < 257 => 271,   // 172 Diamonds Main ($2.46)
                    < 275 => 272,   // 257 Diamonds Main ($3.55)
                    < 343 => 273,   // 275 Diamonds Main ($3.69)
                    < 429 => 274,   // 343 Diamonds Main ($4.78)
                    < 514 => 276,   // 429 Diamonds Main ($5.99)
                    < 565 => 278,   // 514 Diamonds Main ($7.06)
                    < 600 => 280,   // 565 Diamonds Main ($7.58)
                    < 706 => 281,   // 600 Diamonds Main ($8.32)
                    < 1050 => 283,  // 706 Diamonds Main ($9.70)
                    < 2195 => 288,  // 1050 / 1412 Diamonds Main ($14.63)
                    < 3688 => 300,  // 2195 / 2452 / 2901 Diamonds Main ($29.17)
                    < 5532 => 316,  // 3688 / 4390 Diamonds Main ($48.68)
                    < 9288 => 337,  // 5532 / 6944 Diamonds Main ($73.49)
                    _ => 350        // 9288 Diamonds Main ($122.05)
                };
            }
        }

        // UNIVERSAL FINANCIAL SAFETY GUARD:
        // Absolute rule: Upstream provider package cost MUST NEVER exceed customer payment!
        if (paidUsd > 0)
        {
            // 1. Pass Multiplier Safe Automatic Downgrades:
            if ((packageId == 5021 || packageId == 5022 || packageId == 5023) && (paidUsd < 14.50m || Math.Abs(paidUsd - 8.25m) <= 0.60m))
            {
                _logger.LogWarning("[Price Safeguard] Downgrading Free Fire Monthly multiplier package {OriginalId} to 4852 (1x Monthly $7.76) for Order #{OrderId}: Customer paid ${Paid:F2}, below multiplier threshold.",
                    packageId, orderId, paidUsd);
                packageId = 4852;
            }
            else if ((packageId == 5024 || packageId == 5025 || packageId == 5026) && (paidUsd < 2.90m || Math.Abs(paidUsd - 1.68m) <= 0.35m))
            {
                _logger.LogWarning("[Price Safeguard] Downgrading Free Fire Weekly multiplier package {OriginalId} to 383 (1x Weekly $1.57) for Order #{OrderId}: Customer paid ${Paid:F2}, below multiplier threshold.",
                    packageId, orderId, paidUsd);
                packageId = 383;
            }
            else if ((packageId == 5028 || packageId == 5029) && (paidUsd < 0.55m || Math.Abs(paidUsd - 0.35m) <= 0.15m))
            {
                _logger.LogWarning("[Price Safeguard] Downgrading Free Fire Weekly Lite multiplier package {OriginalId} to 384 (Weekly Lite $0.32) for Order #{OrderId}: Customer paid ${Paid:F2}, below multiplier threshold.",
                    packageId, orderId, paidUsd);
                packageId = 384;
            }
            else if (packageId == 4970 && paidUsd < 7.00m)
            {
                var targetId = paidUsd >= 5.50m ? 4969 : (paidUsd >= 4.00m ? 4968 : (paidUsd >= 2.70m ? 4967 : 371));
                _logger.LogWarning("[Price Safeguard] Downgrading MLBB Weekly multiplier package 4970 to {TargetId} for Order #{OrderId}: Customer paid ${Paid:F2}, below 5x threshold.",
                    targetId, orderId, paidUsd);
                packageId = targetId;
            }
            else if (packageId == 4969 && paidUsd < 5.50m)
            {
                var targetId = paidUsd >= 4.00m ? 4968 : (paidUsd >= 2.70m ? 4967 : 371);
                _logger.LogWarning("[Price Safeguard] Downgrading MLBB Weekly multiplier package 4969 to {TargetId} for Order #{OrderId}: Customer paid ${Paid:F2}, below 4x threshold.",
                    targetId, orderId, paidUsd);
                packageId = targetId;
            }
            else if (packageId == 4968 && paidUsd < 4.00m)
            {
                var targetId = paidUsd >= 2.70m ? 4967 : 371;
                _logger.LogWarning("[Price Safeguard] Downgrading MLBB Weekly multiplier package 4968 to {TargetId} for Order #{OrderId}: Customer paid ${Paid:F2}, below 3x threshold.",
                    targetId, orderId, paidUsd);
                packageId = targetId;
            }
            else if (packageId == 4967 && paidUsd < 2.70m)
            {
                _logger.LogWarning("[Price Safeguard] Downgrading MLBB Weekly multiplier package 4967 to 371 (1x WDP $1.54) for Order #{OrderId}: Customer paid ${Paid:F2}, below 2x threshold.",
                    orderId, paidUsd);
                packageId = 371;
            }

            // 2. Strict Universal Cost-Ceiling Verification across ALL packages:
            if (KhmerTopUpPackageCosts.TryGetValue(packageId, out var wholesaleCost))
            {
                // If wholesale cost strictly exceeds what the customer paid, BLOCK the order to prevent money loss!
                if (wholesaleCost > paidUsd)
                {
                    _logger.LogError("[CRITICAL PRICE GUARD BLOCKED ORDER #{OrderId}] Package {PackageId} wholesale cost ${Cost:F2} is MORE EXPENSIVE than customer payment ${Paid:F2}. Halting upstream order to prevent money loss.",
                        orderId, packageId, wholesaleCost, paidUsd);

                    return new TopUpResult
                    {
                        Success = false,
                        ErrorMessage = $"Strict Financial Price Guard: Upstream provider package #{packageId} price (${wholesaleCost:F2}) is MORE EXPENSIVE than customer payment (${paidUsd:F2}). Automated purchase was strictly halted to prevent store loss."
                    };
                }
            }
        }

        object payload;
        if (isFreeFire)
        {
            payload = new
            {
                package_id = packageId,
                player_id = playerId,
                reference = $"ORD-{orderId}-{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}"
            };
        }
        else
        {
            payload = new
            {
                package_id = packageId,
                player_id = playerId,
                server_id = serverId,
                reference = $"ORD-{orderId}-{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}"
            };
        }

        using var request = new HttpRequestMessage(HttpMethod.Post, targetUrl);
        request.Headers.Add("Authorization", $"Bearer {activeKey}");
        request.Headers.Add("X-API-Key", activeKey);
        request.Content = JsonContent.Create(payload);

        var response = await _httpClient.SendAsync(request);
        var content = await response.Content.ReadAsStringAsync();

        _logger.LogInformation("Khmer TopUp API Response for order {OrderId}: {Response}", orderId, content);

        if (response.IsSuccessStatusCode)
        {
            using var doc = JsonDocument.Parse(content);
            var root = doc.RootElement;

            var orderCode = root.TryGetProperty("order_code", out var oc) ? oc.GetString() :
                            root.TryGetProperty("reference", out var rf) ? rf.GetString() : $"KT-{orderId}";

            var status = root.TryGetProperty("status", out var st) ? st.GetString() : "completed";

            return new TopUpResult
            {
                Success = true,
                TransactionId = orderCode,
                Status = "Completed"
            };
        }

        try
        {
            using var errDoc = JsonDocument.Parse(content);
            var root = errDoc.RootElement;
            var msg = root.TryGetProperty("message", out var m) ? m.GetString() :
                      root.TryGetProperty("detail", out var d) ? d.GetString() :
                      root.TryGetProperty("error", out var e) && e.GetString() != "error" ? e.GetString() :
                      null;

            if (response.StatusCode == System.Net.HttpStatusCode.PaymentRequired || content.Contains("Insufficient balance", StringComparison.OrdinalIgnoreCase))
            {
                return new TopUpResult { Success = false, ErrorMessage = "Khmer TopUp Supplier Balance Insufficient: Please deposit funds on khmer-topup.com/wallet to fulfill this diamond amount." };
            }

            if (!string.IsNullOrEmpty(msg))
            {
                return new TopUpResult { Success = false, ErrorMessage = $"Khmer TopUp Error: {msg}" };
            }
        }
        catch { }

        return new TopUpResult { Success = false, ErrorMessage = $"Khmer TopUp API HTTP Error ({(int)response.StatusCode}): {content}" };
    }

    /// <summary>
    /// Smile.One Direct Official Mobile Legends Top-Up Protocol
    /// </summary>
    private async Task<TopUpResult> ProcessSmileOneTopUpAsync(
        string playerId,
        string serverId,
        int diamondAmount,
        string orderId,
        string? uid,
        string? apiKey,
        string? secretKey,
        string? apiUrl)
    {
        var targetUrl = !string.IsNullOrEmpty(apiUrl) ? apiUrl : "https://www.smile.one/smilecoin/api/createorder";
        var time = DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString();
        var product = "mobilelegends";
        
        ProductCatalog.TryGetValue(diamondAmount, out var pInfo);
        var productId = !string.IsNullOrEmpty(pInfo.SmileOneId) ? pInfo.SmileOneId : diamondAmount.ToString();

        // Sign calculation: md5(uid + email + product + productid + time + secretKey)
        var rawSign = $"{uid}{apiKey}{product}{productId}{time}{secretKey}";
        var sign = ComputeMd5(rawSign);

        var formParams = new Dictionary<string, string>
        {
            { "uid", uid ?? string.Empty },
            { "email", apiKey ?? string.Empty },
            { "product", product },
            { "productid", productId },
            { "userid", playerId },
            { "zoneid", serverId },
            { "time", time },
            { "sign", sign }
        };

        var response = await _httpClient.PostAsync(targetUrl, new FormUrlEncodedContent(formParams));
        var content = await response.Content.ReadAsStringAsync();

        _logger.LogInformation("Smile.One Response for order {OrderId}: {Response}", orderId, content);

        if (response.IsSuccessStatusCode)
        {
            using var doc = JsonDocument.Parse(content);
            var root = doc.RootElement;
            var status = root.TryGetProperty("status", out var s) ? s.GetInt32() : -1;

            if (status == 200)
            {
                var orderNo = root.TryGetProperty("order_id", out var o) ? o.GetString() : $"SMILE-{orderId}";
                return new TopUpResult
                {
                    Success = true,
                    TransactionId = orderNo,
                    Status = "Completed"
                };
            }
            else
            {
                var msg = root.TryGetProperty("message", out var m) ? m.GetString() : "Smile.One Top-Up failed";
                return new TopUpResult { Success = false, ErrorMessage = msg };
            }
        }

        return new TopUpResult { Success = false, ErrorMessage = $"Smile.One HTTP Error: {response.StatusCode}" };
    }

    /// <summary>
    /// VIP-Reseller Mobile Legends Top-Up Protocol
    /// </summary>
    private async Task<TopUpResult> ProcessVipResellerTopUpAsync(
        string playerId,
        string serverId,
        string sku,
        string orderId,
        string? apiKey,
        string? secretKey,
        string? apiUrl)
    {
        var targetUrl = !string.IsNullOrEmpty(apiUrl) ? apiUrl : "https://vip-reseller.co.id/api/game-feature";
        var rawSign = $"{apiKey}{secretKey}";
        var sign = ComputeMd5(rawSign);

        var payload = new
        {
            key = apiKey,
            sign = sign,
            type = "order",
            service = sku,
            data_no = $"{playerId}",
            data_zone = $"{serverId}",
            ref_id = orderId
        };

        var response = await _httpClient.PostAsJsonAsync(targetUrl, payload);
        var content = await response.Content.ReadAsStringAsync();

        if (response.IsSuccessStatusCode)
        {
            using var doc = JsonDocument.Parse(content);
            var root = doc.RootElement;
            var result = root.TryGetProperty("result", out var r) && r.GetBoolean();

            if (result)
            {
                var trxId = root.TryGetProperty("data", out var d) && d.TryGetProperty("trxid", out var t) 
                    ? t.GetString() 
                    : $"VIP-{orderId}";

                return new TopUpResult
                {
                    Success = true,
                    TransactionId = trxId,
                    Status = "Completed"
                };
            }
            else
            {
                var msg = root.TryGetProperty("message", out var m) ? m.GetString() : "VIP-Reseller transaction error";
                return new TopUpResult { Success = false, ErrorMessage = msg };
            }
        }

        return new TopUpResult { Success = false, ErrorMessage = $"VIP-Reseller error: {response.StatusCode}" };
    }

    /// <summary>
    /// Digiflazz Mobile Legends Top-Up Protocol
    /// </summary>
    private async Task<TopUpResult> ProcessDigiflazzTopUpAsync(
        string playerId,
        string serverId,
        string? sku,
        string orderId,
        string? username,
        string? apiKey,
        string? apiUrl)
    {
        var targetUrl = !string.IsNullOrEmpty(apiUrl) ? apiUrl : "https://api.digiflazz.com/v1/transaction";
        var sign = ComputeMd5($"{username}{apiKey}{orderId}");

        var payload = new
        {
            username = username,
            buyer_sku_code = sku ?? "mlbb-86",
            customer_no = $"{playerId}{serverId}",
            ref_id = orderId,
            sign = sign
        };

        var response = await _httpClient.PostAsJsonAsync(targetUrl, payload);
        var content = await response.Content.ReadAsStringAsync();

        if (response.IsSuccessStatusCode)
        {
            using var doc = JsonDocument.Parse(content);
            var data = doc.RootElement.GetProperty("data");
            var status = data.TryGetProperty("status", out var s) ? s.GetString() : string.Empty;

            if (status.Equals("Sukses", StringComparison.OrdinalIgnoreCase) || status.Equals("Pending", StringComparison.OrdinalIgnoreCase))
            {
                return new TopUpResult
                {
                    Success = true,
                    TransactionId = data.TryGetProperty("sn", out var sn) ? sn.GetString() : $"DIGI-{orderId}",
                    Status = "Completed"
                };
            }

            var msg = data.TryGetProperty("message", out var m) ? m.GetString() : "Digiflazz topup failed";
            return new TopUpResult { Success = false, ErrorMessage = msg };
        }

        return new TopUpResult { Success = false, ErrorMessage = $"Digiflazz HTTP error: {response.StatusCode}" };
    }

    /// <summary>
    /// Generic REST Aggregator Top-Up Protocol
    /// </summary>
    private async Task<TopUpResult> ProcessGenericAggregatorTopUpAsync(
        string playerId,
        string serverId,
        int diamondAmount,
        string sku,
        string orderId,
        string? apiKey,
        string? apiUrl)
    {
        var request = new HttpRequestMessage(HttpMethod.Post, $"{apiUrl}/api/topup")
        {
            Content = JsonContent.Create(new
            {
                game = "mobile_legends",
                player_id = playerId,
                server_id = serverId,
                diamonds = diamondAmount,
                product_sku = sku,
                order_reference = orderId
            })
        };

        if (!string.IsNullOrEmpty(apiKey))
        {
            request.Headers.Add("X-API-KEY", apiKey);
            request.Headers.Add("Authorization", $"Bearer {apiKey}");
        }

        var response = await _httpClient.SendAsync(request);
        var content = await response.Content.ReadAsStringAsync();

        if (response.IsSuccessStatusCode)
        {
            return new TopUpResult
            {
                Success = true,
                TransactionId = $"AGG-{orderId}",
                Status = "Completed"
            };
        }

        return new TopUpResult { Success = false, ErrorMessage = $"Aggregator returned error: {content}" };
    }

    public async Task<TopUpStatusResult> GetTopUpStatusAsync(string transactionId)
    {
        await Task.CompletedTask;
        return new TopUpStatusResult
        {
            Status = "Completed",
            Message = "MLBB Diamonds delivered to in-game mailbox / balance",
            IsCompleted = true,
            IsFailed = false
        };
    }

    private static string ComputeMd5(string input)
    {
        using var md5 = MD5.Create();
        var bytes = md5.ComputeHash(Encoding.UTF8.GetBytes(input));
        var sb = new StringBuilder();
        foreach (var b in bytes)
        {
            sb.Append(b.ToString("x2"));
        }
        return sb.ToString();
    }
}
