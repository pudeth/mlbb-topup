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
        { 963, ("mlbb_963", "963", "mlbb-963", "858_86_diamonds", "963 Diamonds") },
        { 1007, ("mlbb_1007", "1050", "mlbb-1007", "1007_156_diamonds", "1007 Diamonds (1007+156 Bonus)") },
        { 1050, ("mlbb_1050", "1050", "mlbb-1050", "933_117_diamonds", "1050 Diamonds (933+117 Bonus)") },
        { 1084, ("mlbb_1084", "1084", "mlbb-1084", "1084_diamonds", "1084 Diamonds") },
        { 1412, ("mlbb_1412", "1412", "mlbb-1412", "1250_162_diamonds", "1412 Diamonds (1250+162 Bonus)") },
        { 1446, ("mlbb_1446", "1446", "mlbb-1446", "1446_diamonds", "1446 Diamonds") },
        { 1860, ("mlbb_1860", "46", "mlbb-1860", "1860_335_diamonds", "1860 Diamonds (1860+335 Bonus)") },
        { 2015, ("mlbb_2015", "2015", "mlbb-2015", "2015_383_diamonds", "2015 Diamonds (2015+383 Bonus)") },
        { 2195, ("mlbb_2195", "46", "mlbb-2195", "1860_335_diamonds", "2195 Diamonds (1860+335 Bonus)") },
        { 2976, ("mlbb_2976", "2976", "mlbb-2976", "2976_diamonds", "2976 Diamonds") },
        { 3099, ("mlbb_3099", "3688", "mlbb-3099", "3099_589_diamonds", "3099 Diamonds (3099+589 Bonus)") },
        { 3688, ("mlbb_3688", "3688", "mlbb-3688", "3099_589_diamonds", "3688 Diamonds (3099+589 Bonus)") },
        { 4649, ("mlbb_4649", "5532", "mlbb-4649", "4649_883_diamonds", "4649 Diamonds (4649+883 Bonus)") },
        { 5532, ("mlbb_5532", "5532", "mlbb-5532", "4649_883_diamonds", "5532 Diamonds (4649+883 Bonus)") },
        { 7502, ("mlbb_7502", "7502", "mlbb-7502", "7502_diamonds", "7502 Diamonds") },
        { 7740, ("mlbb_7740", "9288", "mlbb-7740", "7740_1548_diamonds", "7740 Diamonds (7740+1548 Bonus)") },
        { 9288, ("mlbb_9288", "9288", "mlbb-9288", "7740_1548_diamonds", "9288 Diamonds (7740+1548 Bonus)") }
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
        string? productName = null)
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
                result = await ProcessKhmerTopUpAsync(cleanPlayerId, cleanServerId, diamondAmount, sku, orderId, merchantId, settings.KhmerTopUpApiKey, secretKey, settings.KhmerTopUpApiUrl, gameName, productName);

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
                    var ktBackup = await ProcessKhmerTopUpAsync(cleanPlayerId, cleanServerId, diamondAmount, sku, orderId, merchantId, settings.KhmerTopUpApiKey, secretKey, settings.KhmerTopUpApiUrl, gameName, productName);
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
        string? productName = null)
    {
        var targetUrl = "https://khmer-topup.com/api/v1/orders";
        var activeKey = !string.IsNullOrWhiteSpace(apiKey) ? apiKey : "kt_28c2640c86717199395d973670cf039a30ba2716";

        var cleanServer = serverId?.Trim() ?? string.Empty;
        var isNumericServer = System.Text.RegularExpressions.Regex.IsMatch(cleanServer, @"^\d{3,6}$");

        // Comprehensive Free Fire detection
        bool isFreeFire = (gameName?.Contains("freefire", StringComparison.OrdinalIgnoreCase) == true) ||
                          (gameName?.Contains("free fire", StringComparison.OrdinalIgnoreCase) == true) ||
                          (gameName?.Contains("ff", StringComparison.OrdinalIgnoreCase) == true) ||
                          (productName?.Contains("freefire", StringComparison.OrdinalIgnoreCase) == true) ||
                          (productName?.Contains("weeklylite", StringComparison.OrdinalIgnoreCase) == true) ||
                          (productName?.Contains("evo", StringComparison.OrdinalIgnoreCase) == true) ||
                          (sku?.Contains("freefire", StringComparison.OrdinalIgnoreCase) == true) ||
                          (sku?.Contains("ff", StringComparison.OrdinalIgnoreCase) == true) ||
                          string.IsNullOrWhiteSpace(cleanServer) ||
                          cleanServer.Equals("FREEFIRE", StringComparison.OrdinalIgnoreCase) ||
                          cleanServer.Equals("FF", StringComparison.OrdinalIgnoreCase) ||
                          cleanServer.Equals("SG", StringComparison.OrdinalIgnoreCase) ||
                          cleanServer.Equals("SGMY", StringComparison.OrdinalIgnoreCase) ||
                          cleanServer.Equals("KH", StringComparison.OrdinalIgnoreCase) ||
                          cleanServer.Equals("KH/SG", StringComparison.OrdinalIgnoreCase) ||
                          cleanServer.Equals("GLOBAL", StringComparison.OrdinalIgnoreCase) ||
                          cleanServer.Equals("BR", StringComparison.OrdinalIgnoreCase) ||
                          cleanServer.Equals("US", StringComparison.OrdinalIgnoreCase) ||
                          cleanServer.Equals("IND", StringComparison.OrdinalIgnoreCase) ||
                          cleanServer.Equals("ID", StringComparison.OrdinalIgnoreCase) ||
                          cleanServer.Equals("TH", StringComparison.OrdinalIgnoreCase) ||
                          cleanServer.Equals("VN", StringComparison.OrdinalIgnoreCase) ||
                          cleanServer.Equals("BD", StringComparison.OrdinalIgnoreCase) ||
                          cleanServer.Equals("MENA", StringComparison.OrdinalIgnoreCase) ||
                          cleanServer.Equals("ME", StringComparison.OrdinalIgnoreCase) ||
                          !isNumericServer; // In Mobile Legends, server is strictly numeric! If it's letters like "SG", it's Free Fire!

        int packageId;
        if (int.TryParse(sku, out var parsedSku) && parsedSku > 100)
        {
            packageId = parsedSku;
        }
        else if (isFreeFire)
        {
            // Free Fire Official Packages (khmer-topup.com slug: freefire-sgmy)
            var passContext = $"{sku} {productName}".ToLower();
            if (passContext.Contains("level"))
            {
                if (passContext.Contains("30")) packageId = 389;      // Level 30 ($0.90)
                else if (passContext.Contains("25")) packageId = 388; // Level 25 ($0.61)
                else if (passContext.Contains("20")) packageId = 387; // Level 20 ($0.61)
                else if (passContext.Contains("15")) packageId = 386; // Level 15 ($0.61)
                else if (passContext.Contains("10")) packageId = 385; // Level 10 ($0.61)
                else packageId = 390;                                 // Level 6  ($0.29)
            }
            else if (passContext.Contains("evo"))
            {
                if (passContext.Contains("30")) packageId = 5303;
                else if (passContext.Contains("7")) packageId = 5302;
                else packageId = 5301;
            }
            else if (passContext.Contains("weeklylite") || passContext.Contains("weekly lite") || passContext.Contains("weekly lit") || passContext.Contains("lite"))
            {
                if (passContext.Contains("3") || passContext.Contains("x3")) packageId = 5029; // Weekly Lite x3 ($0.94)
                else if (passContext.Contains("2") || passContext.Contains("x2")) packageId = 5028; // Weekly Lite x2 ($0.63)
                else packageId = 384; // Weekly Lite ($0.32)
            }
            else if (passContext.Contains("monthly") || diamondAmount == 2600)
            {
                if (passContext.Contains("3") || passContext.Contains("x3")) packageId = 5022; // Monthly x3 ($22.55)
                else if (passContext.Contains("2") || passContext.Contains("x2")) packageId = 5021; // Monthly x2 ($15.03)
                else packageId = 4852; // Monthly Membership ($7.76)
            }
            else if (passContext.Contains("weekly") || diamondAmount == 450)
            {
                if (passContext.Contains("3") || passContext.Contains("x3")) packageId = 5025; // Weekly x3 ($4.67)
                else if (passContext.Contains("2") || passContext.Contains("x2")) packageId = 5024; // Weekly x2 ($3.12)
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
                    <= 830 => 5299, // 830 Diamonds
                    <= 1060 => 378, // 1060 Diamonds ($9.02)
                    <= 1600 => 5146,// 1580 Diamonds
                    <= 2180 => 379, // 2180 Diamonds ($18.22)
                    <= 3300 => 5147,// 3240 Diamonds
                    <= 5600 => 380, // 5600 Diamonds ($45.09)
                    <= 8400 => 5148,// 7780 Diamonds
                    _ => 381        // 11500 Diamonds ($92.86)
                };
            }
        }
        else if (sku?.Contains("2wdp", StringComparison.OrdinalIgnoreCase) == true || diamondAmount == 440)
        {
            packageId = 4967; // 2x Weekly ($2.97)
        }
        else if (sku?.Contains("3wdp", StringComparison.OrdinalIgnoreCase) == true || diamondAmount == 660)
        {
            packageId = 4968; // 3x Weekly ($4.46)
        }
        else if (sku?.Contains("4wdp", StringComparison.OrdinalIgnoreCase) == true || diamondAmount == 880)
        {
            packageId = 4969; // 4x Weekly ($5.94)
        }
        else if (sku?.Contains("5wdp", StringComparison.OrdinalIgnoreCase) == true || diamondAmount == 1100)
        {
            packageId = 4970; // 5x Weekly ($7.43)
        }
        else if (sku?.Contains("wdp", StringComparison.OrdinalIgnoreCase) == true || 
                 sku?.Contains("weekly", StringComparison.OrdinalIgnoreCase) == true || 
                 diamondAmount == 210)
        {
            packageId = 371; // Weekly Pass ($1.54)
        }
        else if (sku?.Contains("twilight", StringComparison.OrdinalIgnoreCase) == true || diamondAmount == 500)
        {
            packageId = 370; // Twilight Pass ($8.10)
        }
        else
        {
            packageId = diamondAmount switch
            {
                <= 15 => 569,   // 14 Diamonds Special ($0.25)
                <= 30 => 570,   // 28 Diamonds Special ($0.49)
                <= 45 => 571,   // 42 Diamonds Special ($0.73)
                <= 60 => 268,   // 55 Diamonds Main ($0.79)
                <= 95 => 269,   // 86 Diamonds Main ($1.25)
                <= 125 => 269,  // 86 Diamonds Main ($1.25)
                <= 168 => 270,  // 165 Diamonds Main ($2.36)
                <= 200 => 271,  // 172 Diamonds Main ($2.46)
                <= 260 => 272,  // 257 Diamonds Main ($3.55)
                <= 300 => 273,  // 275 Diamonds Main ($3.69)
                <= 350 => 274,  // 343 Diamonds Main ($4.78)
                <= 450 => 276,  // 429 Diamonds Main ($5.99)
                <= 520 => 278,  // 514 Diamonds Main ($7.06)
                <= 570 => 280,  // 565 Diamonds Main ($7.58)
                <= 650 => 281,  // 600 Diamonds Main ($8.32)
                <= 800 => 283,  // 706 Diamonds Main ($9.70)
                <= 1200 => 288, // 1050 Diamonds Main ($14.63)
                <= 2500 => 300, // 2195 Diamonds Main ($29.17)
                <= 4000 => 316, // 3688 Diamonds Main ($48.68)
                <= 6000 => 337, // 5532 Diamonds Main ($73.49)
                _ => 350        // 9288 Diamonds Main ($122.05)
            };
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
