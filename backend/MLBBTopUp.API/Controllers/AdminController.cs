using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MLBBTopUp.Core.Interfaces;
using MLBBTopUp.Infrastructure.Data;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Diagnostics;

namespace MLBBTopUp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class AdminController : BaseController
{
    private readonly IOrderService _orderService;
    private readonly IPaymentService _paymentService;
    private readonly ITopUpService _topUpService;
    private readonly ApplicationDbContext _context;
    private readonly ISupplierGatewayManager _gatewayManager;
    private readonly IConfiguration _configuration;

    public AdminController(
        IOrderService orderService,
        IPaymentService paymentService,
        ITopUpService topUpService,
        ApplicationDbContext context,
        ISupplierGatewayManager gatewayManager,
        IConfiguration configuration)
    {
        _orderService = orderService;
        _paymentService = paymentService;
        _topUpService = topUpService;
        _context = context;
        _gatewayManager = gatewayManager;
        _configuration = configuration;
    }

    private static DateTime? _financialsClearedAt = null;

    private static object _storeBranding = new
    {
        storeName = "Tin-Topup",
        storeNameHighlight = "PRO",
        tagline = "Official Diamond Hub",
        logoType = "image",
        logoEmoji = "💎",
        logoImage = "/tin-logo.png",
        badgeText = "PRO",
        adminBadgeText = "ADMIN",
        versionText = "Enterprise Hub v2.5",
        themeColor = "amber",
        facebookPage = "https://www.facebook.com/share/1LaL3TxfWD/?mibextid=wwXIfr",
        facebookPageName = "Official Facebook Page",
        telegramUrl = "https://t.me/Peak_Deth",
        telegramUsername = "@Peak_Deth"
    };

    /// <summary>
    /// Get Store Branding settings (Public)
    /// </summary>
    [HttpGet("branding")]
    [HttpGet("/api/branding")]
    [AllowAnonymous]
    public IActionResult GetBranding()
    {
        return Ok(new { success = true, branding = _storeBranding });
    }

    /// <summary>
    /// Update Store Branding settings
    /// </summary>
    [HttpPost("branding")]
    [HttpPut("branding")]
    [HttpPost("/api/branding")]
    [HttpPut("/api/branding")]
    [AllowAnonymous]
    public IActionResult UpdateBranding([FromBody] object data)
    {
        if (data != null)
        {
            _storeBranding = data;
        }
        return Ok(new { success = true, branding = _storeBranding });
    }

    private static readonly string[] _gamesCandidatePaths = new[]
    {
        "/app/data/games_config.json",
        System.IO.Path.Combine(Directory.GetCurrentDirectory(), "games_config.json"),
        System.IO.Path.Combine(AppContext.BaseDirectory, "games_config.json")
    };
    private static readonly string[] _masterStatusCandidatePaths = new[]
    {
        "/app/data/master_status_config.json",
        System.IO.Path.Combine(Directory.GetCurrentDirectory(), "master_status_config.json"),
        System.IO.Path.Combine(AppContext.BaseDirectory, "master_status_config.json")
    };
    private static readonly string _bannersFilePath = System.IO.Path.Combine(AppContext.BaseDirectory, "banners_config.json");
    private static object? _gamesConfig = null;
    private static object _masterTopupStatus = new
    {
        status = "Active",
        notice = "Top-Ups are temporarily paused by Admin for maintenance. Please check back shortly!",
        updatedAt = DateTime.UtcNow.ToString("o")
    };

    private static object GetDefaultGamesList()
    {
        return new object[]
        {
            new {
                id = "freefire_kh",
                name = "FREE FIRE KH",
                publisher = "Garena",
                category = "Service top-up",
                providerCategory = "Service top-up",
                currency = "Diamonds",
                image = "/images/freefire-square-logo.png",
                localFallbackImage = "/images/freefire_hero_banner.jpg",
                badge = "សេវើខ្មែរ 🇰🇭",
                badgeColor = "cyan",
                rating = "4.9 ⭐",
                deliveryTime = "10 - 30s",
                route = "/topup?game=freefire",
                status = "Active",
                isPopular = true,
                description = "Direct Garena Free Fire Cambodia server UID top-up with automated level-up pass."
            },
            new {
                id = "mlbb",
                name = "MOBILE LEGEND",
                publisher = "Moonton",
                category = "Service top-up",
                providerCategory = "Service top-up",
                currency = "Diamonds & Passes",
                image = "/mlbb-logo.png",
                localFallbackImage = "/mlbb-logo.png",
                badge = "សេវើខ្មែរ 5v5",
                badgeColor = "gold",
                flagType = "kh",
                flagTitle = "សេវើខ្មែរ 5v5",
                flagSubtitle = "5V5",
                flagServerText = "SERVER",
                flagFrameStyle = "gold_cyber",
                rating = "5.0 ⭐",
                deliveryTime = "10 - 30s",
                route = "/topup",
                status = "Active",
                isPopular = true,
                description = "Instant Mobile Legends Diamonds, Weekly Diamond Pass & Twilight Pass via automated Moonton gateway."
            },
            new {
                id = "mlbb_tickets",
                name = "កក់ TICKETS",
                publisher = "Moonton",
                category = "Service top-up",
                providerCategory = "Service top-up",
                currency = "Event Tickets",
                image = "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=500&auto=format&fit=crop&q=80",
                localFallbackImage = "/mlbb-logo.png",
                badge = "UPGRADED 🔥",
                badgeColor = "purple",
                rating = "4.9 ⭐",
                deliveryTime = "Instant 10s",
                route = "/topup?game=mlbb&tab=pass",
                status = "Closed",
                isPopular = true,
                description = "MLBB 515 ALLSTAR & Jujutsu Kaisen 29 Tickets Vouchers & Pre-Orders."
            },
            new {
                id = "level_up_pass",
                name = "LEVEL UP PASS",
                publisher = "Garena / Moonton",
                category = "Service top-up",
                providerCategory = "Service top-up",
                currency = "Passes & Packs",
                image = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop&q=80",
                localFallbackImage = "/mlbb-logo.png",
                badge = "BEST DEAL 🌟",
                badgeColor = "gold",
                rating = "5.0 ⭐",
                deliveryTime = "10 - 30s",
                route = "/topup?game=mlbb&tab=pass",
                status = "Closed",
                isPopular = true,
                description = "Level Up Pass and Super Value Diamond Growth Bundles."
            },
            new {
                id = "pubgm_auto",
                name = "PUBG MOBILE",
                publisher = "Level Infinite",
                category = "Service top-up",
                providerCategory = "Service top-up",
                currency = "Unknown Cash (UC)",
                image = "https://res.cloudinary.com/dpz7vpmf8/image/upload/v1790944800/logo-game/ovdfdmru7jnhmwjvy6vy.jpg",
                localFallbackImage = "/images/pubgm-banner.jpg",
                badge = "GLOBAL UC ⚡",
                badgeColor = "emerald",
                rating = "4.9 ⭐",
                deliveryTime = "10s - 1m",
                route = "/topup?game=pubgm",
                status = "Closed",
                isPopular = true,
                description = "Automated PUBG Mobile Global Unknown Cash (UC) and Royale Pass vouchers."
            },
            new {
                id = "magic_chess",
                name = "MAGIC CHESS GOGO",
                publisher = "Moonton",
                category = "Service top-up",
                providerCategory = "Service top-up",
                currency = "Chess Diamonds",
                image = "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=500&auto=format&fit=crop&q=80",
                localFallbackImage = "/mlbb-logo.png",
                badge = "CHIBI HERO ♟️",
                badgeColor = "purple",
                rating = "4.8 ⭐",
                deliveryTime = "10 - 30s",
                route = "/topup?game=magic_chess",
                status = "Closed",
                isPopular = true,
                description = "Magic Chess Go Go Little Commander Skins and Battle Pass."
            },
            new {
                id = "blood_strike",
                name = "BLOOD STRIKE",
                publisher = "NetEase Games",
                category = "Service top-up",
                providerCategory = "Service top-up",
                currency = "Gold & Strike Pass",
                image = "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=500&auto=format&fit=crop&q=80",
                badge = "HOT FPS 🔥",
                badgeColor = "purple",
                rating = "4.9 ⭐",
                deliveryTime = "10 - 30s",
                route = "/topup?game=blood_strike",
                status = "Closed",
                isPopular = true,
                description = "NetEase Blood Strike Global Gold recharge and Strike Pass unlock."
            },
            new {
                id = "rov",
                name = "ROV / AOV",
                publisher = "Garena",
                category = "Service top-up",
                providerCategory = "Service top-up",
                currency = "Coupons",
                image = "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=80",
                localFallbackImage = "/mlbb-logo.png",
                badge = "HOT 🔥",
                badgeColor = "purple",
                rating = "4.9 ⭐",
                deliveryTime = "10 - 30s",
                route = "/topup?game=rov",
                status = "Closed",
                isPopular = true,
                description = "Realm of Valor (ROV / Arena of Valor) coupons and elite pass top-up."
            },
            new {
                id = "steam_games",
                name = "STEAM GAMES",
                publisher = "Valve",
                category = "Service top-up",
                providerCategory = "Service top-up",
                currency = "Wallet USD",
                image = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80",
                localFallbackImage = "/images/banner_steam_wallet.jpg",
                badge = "SALE ⚡",
                badgeColor = "gold",
                rating = "5.0 ⭐",
                deliveryTime = "Instant 10s",
                route = "/topup?game=steam",
                status = "Closed",
                isPopular = true,
                description = "Steam Wallet USD global activation codes and direct store top-up."
            },
            new {
                id = "minecraft",
                name = "MINECRAFT",
                publisher = "Mojang / Microsoft",
                category = "Service top-up",
                providerCategory = "Service top-up",
                currency = "Minecoins",
                image = "https://images.unsplash.com/photo-1627856013091-fed6e4e30025?w=500&auto=format&fit=crop&q=80",
                localFallbackImage = "/images/banner_pubg.jpg",
                badge = "NEW 🌟",
                badgeColor = "emerald",
                rating = "4.9 ⭐",
                deliveryTime = "10 - 30s",
                route = "/topup?game=minecraft",
                status = "Closed",
                isPopular = true,
                description = "Official Minecraft Minecoins and Realm subscriptions."
            },
            new {
                id = "roblox",
                name = "Roblox",
                publisher = "Roblox Corporation",
                category = "Service top-up",
                providerCategory = "Service top-up",
                currency = "Robux",
                image = "https://images.unsplash.com/photo-1563089145-599997674d42?w=500&auto=format&fit=crop&q=80",
                localFallbackImage = "/mlbb-logo.png",
                badge = "HOT",
                badgeColor = "gold",
                rating = "5.0 ⭐",
                deliveryTime = "10 - 30s",
                route = "/topup?game=roblox",
                status = "Closed",
                isPopular = true,
                description = "Roblox Robux and Premium Membership packages."
            },
            new {
                id = "one_piece",
                name = "ONE PIECE",
                publisher = "Bandai Namco",
                category = "Service top-up",
                providerCategory = "Service top-up",
                currency = "Rainbow Diamonds",
                image = "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=80",
                localFallbackImage = "/images/banner_mlbb_aldous.jpg",
                badge = "PAUSED ⏸️",
                badgeColor = "cyan",
                rating = "4.8 ⭐",
                deliveryTime = "10 - 30s",
                route = "/topup?game=onepiece",
                status = "Closed",
                isPopular = true,
                description = "One Piece Bounty Rush Rainbow Diamonds instant direct recharge."
            },
            new {
                id = "valorant",
                name = "VALORANT",
                publisher = "Riot Games",
                category = "Service top-up",
                providerCategory = "Service top-up",
                currency = "Valorant Points (VP)",
                image = "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=500&auto=format&fit=crop&q=80",
                localFallbackImage = "/images/banner_pubg_tactical.jpg",
                badge = "CLOSED 🚫",
                badgeColor = "purple",
                rating = "4.9 ⭐",
                deliveryTime = "10 - 30s",
                route = "/topup?game=valorant",
                status = "Closed",
                isPopular = true,
                description = "Riot Games Valorant Points (VP) official prepaid gift codes."
            }
        };
    }

    /// <summary>
    /// Get Store Games Catalog & Status (Public)
    /// </summary>
    [HttpGet("games")]
    [HttpGet("/api/games")]
    [AllowAnonymous]
    public IActionResult GetGames()
    {
        if (_gamesConfig == null)
        {
            foreach (var path in _gamesCandidatePaths)
            {
                if (System.IO.File.Exists(path))
                {
                    try
                    {
                        var json = System.IO.File.ReadAllText(path);
                        if (!string.IsNullOrWhiteSpace(json) && json.Length > 10)
                        {
                            _gamesConfig = System.Text.Json.JsonSerializer.Deserialize<object>(json);
                            break;
                        }
                    }
                    catch {}
                }
            }
        }

        // Try syncing from MongoDB Atlas microservice if local memory is null
        if (_gamesConfig == null)
        {
            try
            {
                using var client = new System.Net.Http.HttpClient { Timeout = TimeSpan.FromSeconds(3) };
                var res = client.GetAsync("https://mlbb-khqr-api.onrender.com/api/games").GetAwaiter().GetResult();
                if (res.IsSuccessStatusCode)
                {
                    var content = res.Content.ReadAsStringAsync().GetAwaiter().GetResult();
                    using var doc = System.Text.Json.JsonDocument.Parse(content);
                    if (doc.RootElement.TryGetProperty("games", out var gamesProp) &&
                        gamesProp.ValueKind != System.Text.Json.JsonValueKind.Null &&
                        gamesProp.ValueKind != System.Text.Json.JsonValueKind.Undefined)
                    {
                        _gamesConfig = System.Text.Json.JsonSerializer.Deserialize<object>(gamesProp.GetRawText());
                    }
                }
            }
            catch {}
        }

        if (_gamesConfig == null)
        {
            _gamesConfig = GetDefaultGamesList();
            try
            {
                var json = System.Text.Json.JsonSerializer.Serialize(_gamesConfig);
                foreach (var path in _gamesCandidatePaths)
                {
                    try
                    {
                        var dir = System.IO.Path.GetDirectoryName(path);
                        if (!string.IsNullOrEmpty(dir) && !System.IO.Directory.Exists(dir))
                            System.IO.Directory.CreateDirectory(dir);
                        System.IO.File.WriteAllText(path, json);
                    }
                    catch {}
                }
            }
            catch {}
        }

        object? result = _gamesConfig;
        if (result is System.Text.Json.JsonElement element)
        {
            if (element.ValueKind == System.Text.Json.JsonValueKind.Object && element.TryGetProperty("games", out var gamesProp))
            {
                result = gamesProp;
            }
        }

        return Ok(new { success = true, games = result });
    }

    /// <summary>
    /// Update Store Games Catalog & Status
    /// </summary>
    [HttpPost("games")]
    [HttpPut("games")]
    [HttpPost("/api/games")]
    [HttpPut("/api/games")]
    [AllowAnonymous]
    public IActionResult UpdateGames([FromBody] object data)
    {
        if (data != null)
        {
            _gamesConfig = data;
            try
            {
                var json = System.Text.Json.JsonSerializer.Serialize(data);
                foreach (var path in _gamesCandidatePaths)
                {
                    try
                    {
                        var dir = System.IO.Path.GetDirectoryName(path);
                        if (!string.IsNullOrEmpty(dir) && !System.IO.Directory.Exists(dir))
                            System.IO.Directory.CreateDirectory(dir);
                        System.IO.File.WriteAllText(path, json);
                    }
                    catch {}
                }
            }
            catch {}

            // Async background broadcast to MongoDB Atlas Python microservice
            _ = Task.Run(async () =>
            {
                try
                {
                    using var client = new System.Net.Http.HttpClient { Timeout = TimeSpan.FromSeconds(5) };
                    var content = new System.Net.Http.StringContent(
                        System.Text.Json.JsonSerializer.Serialize(new { games = data }),
                        System.Text.Encoding.UTF8,
                        "application/json");
                    await client.PostAsync("https://mlbb-khqr-api.onrender.com/api/games", content);
                }
                catch {}
            });
        }
        return GetGames();
    }

    private static object? _eventBannersConfig = null;

    /// <summary>
    /// Get Store Promotional Event Banners (Public)
    /// </summary>
    [HttpGet("banners")]
    [HttpGet("/api/banners")]
    [AllowAnonymous]
    public IActionResult GetBanners()
    {
        if (_eventBannersConfig == null && System.IO.File.Exists(_bannersFilePath))
        {
            try
            {
                var json = System.IO.File.ReadAllText(_bannersFilePath);
                _eventBannersConfig = System.Text.Json.JsonSerializer.Deserialize<object>(json);
            }
            catch {}
        }

        object? result = _eventBannersConfig;
        if (result is System.Text.Json.JsonElement element)
        {
            if (element.ValueKind == System.Text.Json.JsonValueKind.Object && element.TryGetProperty("banners", out var bannersProp))
            {
                result = bannersProp;
            }
        }

        return Ok(new { success = true, banners = result });
    }

    /// <summary>
    /// Update Store Promotional Event Banners
    /// </summary>
    [HttpPost("banners")]
    [HttpPut("banners")]
    [HttpPost("/api/banners")]
    [HttpPut("/api/banners")]
    [AllowAnonymous]
    public IActionResult UpdateBanners([FromBody] object data)
    {
        if (data != null)
        {
            _eventBannersConfig = data;
            try
            {
                System.IO.File.WriteAllText(_bannersFilePath, System.Text.Json.JsonSerializer.Serialize(data));
            }
            catch {}
        }
        return GetBanners();
    }

    /// <summary>
    /// Get Master Top-Up Status (Public)
    /// </summary>
    [HttpGet("master-status")]
    [HttpGet("/api/master-status")]
    [AllowAnonymous]
    public IActionResult GetMasterStatus()
    {
        if (_masterTopupStatus == null)
        {
            foreach (var path in _masterStatusCandidatePaths)
            {
                if (System.IO.File.Exists(path))
                {
                    try
                    {
                        var json = System.IO.File.ReadAllText(path);
                        if (!string.IsNullOrWhiteSpace(json))
                        {
                            _masterTopupStatus = System.Text.Json.JsonSerializer.Deserialize<object>(json)!;
                            break;
                        }
                    }
                    catch {}
                }
            }
        }
        if (_masterTopupStatus == null)
        {
            _masterTopupStatus = new
            {
                status = "Active",
                notice = "Top-Ups are temporarily paused by Admin for maintenance. Please check back shortly!",
                updatedAt = DateTime.UtcNow.ToString("o")
            };
        }
        return Ok(new { success = true, masterStatus = _masterTopupStatus });
    }

    /// <summary>
    /// Update Master Top-Up Status
    /// </summary>
    [HttpPost("master-status")]
    [HttpPut("master-status")]
    [HttpPost("/api/master-status")]
    [HttpPut("/api/master-status")]
    [AllowAnonymous]
    public IActionResult UpdateMasterStatus([FromBody] object data)
    {
        if (data != null)
        {
            _masterTopupStatus = data;
            try
            {
                var json = System.Text.Json.JsonSerializer.Serialize(data);
                foreach (var path in _masterStatusCandidatePaths)
                {
                    try
                    {
                        var dir = System.IO.Path.GetDirectoryName(path);
                        if (!string.IsNullOrEmpty(dir) && !System.IO.Directory.Exists(dir))
                            System.IO.Directory.CreateDirectory(dir);
                        System.IO.File.WriteAllText(path, json);
                    }
                    catch {}
                }
            }
            catch {}
        }
        return Ok(new { success = true, masterStatus = _masterTopupStatus });
    }

    /// <summary>
    /// Get all orders
    /// </summary>
    [HttpGet("orders")]
    public async Task<IActionResult> GetAllOrders()
    {
        var orders = await _orderService.GetAllOrdersAsync();
        return Ok(orders);
    }

    /// <summary>
    /// Get pending orders (paid but not yet topped up)
    /// </summary>
    [HttpGet("orders/pending")]
    public async Task<IActionResult> GetPendingOrders()
    {
        var orders = await _orderService.GetPendingOrdersAsync();
        return Ok(orders);
    }

    /// <summary>
    /// Verify payment for an order
    /// </summary>
    [HttpPut("orders/{id}/verify-payment")]
    public async Task<IActionResult> VerifyPayment(int id)
    {
        var order = await _orderService.GetOrderByIdAsync(id);
        if (order == null)
        {
            return NotFound(new { message = "Order not found" });
        }

        var isVerified = await _paymentService.VerifyPaymentAsync(id);

        if (!isVerified)
        {
            return BadRequest(new { message = "Payment verification failed" });
        }

        return Ok(new { message = "Payment verified successfully" });
    }

    /// <summary>
    /// Process top-up for an order
    /// </summary>
    [HttpPost("orders/{id}/process-topup")]
    public async Task<IActionResult> ProcessTopUp(int id)
    {
        var order = await _orderService.GetOrderByIdAsync(id);
        if (order == null)
        {
            return NotFound(new { message = "Order not found" });
        }

        if (order.PaymentStatus != "Paid")
        {
            return BadRequest(new { message = "Order payment is not completed" });
        }

        var result = await _topUpService.ProcessTopUpAsync(
            id,
            order.PlayerID,
            order.ServerID,
            order.DiamondAmount
        );

        if (!result.Success)
        {
            var err = (result.ErrorReason ?? result.Message ?? "").ToLower();
            var isLowBalance = err.Contains("insufficient") || err.Contains("balance") || err.Contains("funds") || err.Contains("wallet") || err.Contains("fzr.cards");
            await _orderService.UpdateOrderTopupStatusAsync(id, isLowBalance ? "AwaitingBalance" : "Failed");
            return BadRequest(new
            {
                message = !string.IsNullOrWhiteSpace(result.Message) ? result.Message : "Top-up processing failed",
                errorReason = result.ErrorReason
            });
        }

        await _orderService.UpdateOrderTopupStatusAsync(id, "Completed");
        return Ok(new
        {
            message = result.Message ?? "Top-up processed successfully",
            transactionId = result.TransactionId
        });
    }

    /// <summary>
    /// Manually mark an order top-up as Completed (e.g. manual dispatch override)
    /// </summary>
    [HttpPost("orders/{id}/manual-complete")]
    public async Task<IActionResult> ManualCompleteTopUp(int id)
    {
        var order = await _orderService.GetOrderByIdAsync(id);
        if (order == null)
        {
            return NotFound(new { message = "Order not found" });
        }

        await _orderService.UpdateOrderTopupStatusAsync(id, "Completed");
        return Ok(new { message = $"Order #{id} marked as Completed (Manual Fulfillment)!" });
    }

    /// <summary>
    /// Batch process pending orders
    /// </summary>
    [HttpPost("orders/batch-process")]
    public async Task<IActionResult> BatchProcessTopUp([FromBody] BatchProcessRequest? request)
    {
        var orderIds = request?.OrderIds;
        List<int> targetIds;

        if (orderIds != null && orderIds.Any())
        {
            targetIds = orderIds;
        }
        else
        {
            var pending = await _orderService.GetPendingOrdersAsync();
            targetIds = pending.Select(o => o.OrderId).ToList();
        }

        int successCount = 0;
        int failedCount = 0;

        foreach (var id in targetIds)
        {
            var order = await _orderService.GetOrderByIdAsync(id);
            if (order != null && order.PaymentStatus == "Paid")
            {
                var result = await _topUpService.ProcessTopUpAsync(
                    id,
                    order.PlayerID,
                    order.ServerID,
                    order.DiamondAmount
                );

                if (result.Success)
                {
                    await _orderService.UpdateOrderTopupStatusAsync(id, "Completed");
                    successCount++;
                }
                else
                {
                    var err = (result.ErrorReason ?? result.Message ?? "").ToLower();
                    var isLowBalance = err.Contains("insufficient") || err.Contains("balance") || err.Contains("funds") || err.Contains("wallet") || err.Contains("fzr.cards");
                    await _orderService.UpdateOrderTopupStatusAsync(id, isLowBalance ? "AwaitingBalance" : "Failed");
                    failedCount++;
                }
            }
            else
            {
                failedCount++;
            }
        }

        return Ok(new
        {
            message = $"Processed {successCount + failedCount} orders: {successCount} succeeded, {failedCount} failed.",
            successCount,
            failedCount
        });
    }

    /// <summary>
    /// Update order payment status
    /// </summary>
    [HttpPut("orders/{id}/payment-status")]
    public async Task<IActionResult> UpdatePaymentStatus(int id, [FromBody] UpdateStatusRequest request)
    {
        var result = await _orderService.UpdateOrderPaymentStatusAsync(id, request.Status);

        if (!result)
        {
            return NotFound(new { message = "Order not found" });
        }

        return Ok(new { message = "Payment status updated successfully" });
    }

    /// <summary>
    /// Update order top-up status
    /// </summary>
    [HttpPut("orders/{id}/topup-status")]
    public async Task<IActionResult> UpdateTopUpStatus(int id, [FromBody] UpdateStatusRequest request)
    {
        var result = await _orderService.UpdateOrderTopupStatusAsync(id, request.Status);

        if (!result)
        {
            return NotFound(new { message = "Order not found" });
        }

        return Ok(new { message = "Top-up status updated successfully" });
    }

    /// <summary>
    /// Get all users
    /// </summary>
    [HttpGet("users")]
    public async Task<IActionResult> GetAllUsers()
    {
        var usersList = await _context.Users
            .Include(u => u.Orders)
            .ToListAsync();

        var users = usersList
            .Select(u => new
            {
                u.UserId,
                u.Name,
                u.Email,
                u.Role,
                u.CreatedAt,
                OrderCount = u.Orders.Count,
                TotalSpent = u.Orders.Where(o => o.PaymentStatus == "Paid").Sum(o => o.Amount)
            })
            .OrderByDescending(u => u.CreatedAt)
            .ToList();

        return Ok(users);
    }

    /// <summary>
    /// Update user role (Admin / User)
    /// </summary>
    [HttpPut("users/{id}/role")]
    public async Task<IActionResult> UpdateUserRole(int id, [FromBody] UpdateRoleRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Role) || (request.Role != "Admin" && request.Role != "User"))
        {
            return BadRequest(new { message = "Role must be either 'Admin' or 'User'" });
        }

        var user = await _context.Users.FindAsync(id);
        if (user == null)
        {
            return NotFound(new { message = "User not found" });
        }

        user.Role = request.Role;
        await _context.SaveChangesAsync();

        return Ok(new { message = $"User role updated to {request.Role} successfully" });
    }

    /// <summary>
    /// Delete user
    /// </summary>
    [HttpDelete("users/{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
        {
            return NotFound(new { message = "User not found" });
        }

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        return Ok(new { message = "User deleted successfully" });
    }

    /// <summary>
    /// Get sales reports
    /// </summary>
    [HttpGet("reports")]
    public async Task<IActionResult> GetReports()
    {
        var totalOrders = await _context.Orders.CountAsync();
        var completedOrders = await _context.Orders.CountAsync(o => o.TopupStatus == "Completed");
        var pendingOrders = await _context.Orders.CountAsync(o => o.TopupStatus == "Pending");
        var processingOrders = await _context.Orders.CountAsync(o => o.TopupStatus == "Processing");
        var failedOrders = await _context.Orders.CountAsync(o => o.TopupStatus == "Failed");

        var allOrders = await _context.Orders.Include(o => o.Product).ToListAsync();

        var paidOrdersList = allOrders
            .Where(o => o.PaymentStatus == "Paid")
            .ToList();

        var totalRevenue = paidOrdersList.Sum(o => o.Amount);

        var todayRevenue = paidOrdersList
            .Where(o => o.CreatedAt.Date == DateTime.UtcNow.Date)
            .Sum(o => o.Amount);

        var totalDiamondsDelivered = allOrders
            .Where(o => o.TopupStatus == "Completed")
            .Sum(o => o.Product != null ? o.Product.DiamondAmount : 0);

        var totalUsers = await _context.Users.CountAsync();

        var completedOrdersList = allOrders
            .Where(o => o.TopupStatus == "Completed")
            .ToList();

        var topProducts = completedOrdersList
            .GroupBy(o => new { o.ProductId, DiamondAmount = o.Product != null ? o.Product.DiamondAmount : 0, Price = o.Product != null ? o.Product.Price : o.Amount })
            .Select(g => new
            {
                ProductId = g.Key.ProductId,
                DiamondAmount = g.Key.DiamondAmount,
                Price = g.Key.Price,
                OrderCount = g.Count(),
                TotalRevenue = g.Sum(o => o.Amount)
            })
            .OrderByDescending(x => x.OrderCount)
            .Take(6)
            .ToList();

        return Ok(new
        {
            totalOrders,
            completedOrders,
            pendingOrders,
            processingOrders,
            failedOrders,
            totalRevenue,
            todayRevenue,
            totalDiamondsDelivered,
            totalUsers,
            topProducts
        });
    }

    /// <summary>
    /// Rich 7-day Analytics data
    /// </summary>
    [HttpGet("analytics")]
    public async Task<IActionResult> GetAnalytics()
    {
        var now = DateTime.UtcNow.Date;
        var pastDays = Enumerable.Range(0, 7)
            .Select(i => now.AddDays(-6 + i))
            .ToList();

        var allOrders = await _context.Orders.ToListAsync();
        var ordersByDate = allOrders
            .Where(o => o.CreatedAt >= now.AddDays(-6))
            .ToList();

        var dailyTrend = pastDays.Select(day =>
        {
            var dayOrders = ordersByDate.Where(o => o.CreatedAt.Date == day).ToList();
            return new
            {
                Date = day.ToString("MMM dd"),
                Revenue = dayOrders.Where(o => o.PaymentStatus == "Paid").Sum(o => (decimal)o.Amount),
                Orders = dayOrders.Count,
                Completed = dayOrders.Count(o => o.TopupStatus == "Completed")
            };
        }).ToList();

        var paymentsList = await _context.Payments.ToListAsync();
        var paymentMethods = paymentsList
            .GroupBy(p => p.PaymentMethod)
            .Select(g => new
            {
                Method = g.Key,
                Count = g.Count(),
                TotalAmount = g.Where(p => p.Status == "Completed").Sum(p => (decimal)p.Amount)
            })
            .ToList();

        return Ok(new
        {
            dailyTrend,
            paymentMethods
        });
    }

    /// <summary>
    /// System diagnostics
    /// </summary>
    [HttpGet("system-status")]
    public async Task<IActionResult> GetSystemStatus()
    {
        var dbCanConnect = await _context.Database.CanConnectAsync();
        var totalOrders = await _context.Orders.CountAsync();
        var totalUsers = await _context.Users.CountAsync();
        var totalProducts = await _context.Products.CountAsync();
        var totalPayments = await _context.Payments.CountAsync();

        var proc = Process.GetCurrentProcess();
        var memoryMb = Math.Round(proc.WorkingSet64 / (1024.0 * 1024.0), 2);

        return Ok(new
        {
            serverTime = DateTime.UtcNow,
            serverStatus = "Online",
            database = new
            {
                connected = dbCanConnect,
                provider = _context.Database.ProviderName ?? "Unknown",
                totalOrders,
                totalUsers,
                totalProducts,
                totalPayments
            },
            runtime = new
            {
                processName = proc.ProcessName,
                memoryUsageMb = memoryMb,
                threadCount = proc.Threads.Count,
                dotnetVersion = Environment.Version.ToString()
            }
        });
    }

    /// <summary>
    /// Sync Official Real Mobile Legends Diamond Packages with Multi-Tier Pricing
    /// </summary>
    [HttpPost("provider/sync-real-packages")]
    [AllowAnonymous]
    public async Task<IActionResult> SyncRealMLBBPackages()
    {
        var realPackages = new[]
        {
            new MLBBTopUp.Core.Entities.Product { DiamondAmount = 55, Price = 0.95m, CostPrice = 0.74m, ResellerPrice = 0.95m, Status = "Active", Description = "55 Diamonds Starter", CreatedAt = DateTime.UtcNow },
            new MLBBTopUp.Core.Entities.Product { DiamondAmount = 86, Price = 1.35m, CostPrice = 1.17m, ResellerPrice = 1.35m, Status = "Active", Description = "86 Diamonds Bonus", CreatedAt = DateTime.UtcNow },
            new MLBBTopUp.Core.Entities.Product { DiamondAmount = 110, Price = 1.70m, CostPrice = 1.45m, ResellerPrice = 1.70m, Status = "Active", Description = "110 Diamonds Bonus", CreatedAt = DateTime.UtcNow },
            new MLBBTopUp.Core.Entities.Product { DiamondAmount = 165, Price = 2.40m, CostPrice = 2.22m, ResellerPrice = 2.40m, Status = "Active", Description = "165 Diamonds (Hot Deal)", CreatedAt = DateTime.UtcNow },
            new MLBBTopUp.Core.Entities.Product { DiamondAmount = 172, Price = 2.50m, CostPrice = 2.31m, ResellerPrice = 2.50m, Status = "Active", Description = "172 Diamonds Standard", CreatedAt = DateTime.UtcNow },
            new MLBBTopUp.Core.Entities.Product { DiamondAmount = 210, Price = 1.55m, CostPrice = 1.45m, ResellerPrice = 1.55m, Status = "Active", Description = "Weekly Pass (220 Diamonds + 70 Aurora)", CreatedAt = DateTime.UtcNow },
            new MLBBTopUp.Core.Entities.Product { DiamondAmount = 440, Price = 3.10m, CostPrice = 2.90m, ResellerPrice = 3.10m, Status = "Active", Description = "2 Weekly Pass (440 Diamonds + 140 Aurora)", CreatedAt = DateTime.UtcNow },
            new MLBBTopUp.Core.Entities.Product { DiamondAmount = 660, Price = 4.65m, CostPrice = 4.35m, ResellerPrice = 4.65m, Status = "Active", Description = "3 Weekly Pass (29 tickets)", CreatedAt = DateTime.UtcNow },
            new MLBBTopUp.Core.Entities.Product { DiamondAmount = 880, Price = 6.20m, CostPrice = 5.80m, ResellerPrice = 6.20m, Status = "Active", Description = "4 Weekly Pass Bundle", CreatedAt = DateTime.UtcNow },
            new MLBBTopUp.Core.Entities.Product { DiamondAmount = 1100, Price = 7.75m, CostPrice = 7.25m, ResellerPrice = 7.75m, Status = "Active", Description = "5 Weekly Pass Bundle", CreatedAt = DateTime.UtcNow },
            new MLBBTopUp.Core.Entities.Product { DiamondAmount = 1320, Price = 9.30m, CostPrice = 8.70m, ResellerPrice = 9.30m, Status = "Active", Description = "6 Weekly Pass Bundle", CreatedAt = DateTime.UtcNow },
            new MLBBTopUp.Core.Entities.Product { DiamondAmount = 605, Price = 5.50m, CostPrice = 5.12m, ResellerPrice = 5.50m, Status = "Active", Description = "165 + 2Weekly Pass", CreatedAt = DateTime.UtcNow },
            new MLBBTopUp.Core.Entities.Product { DiamondAmount = 257, Price = 3.69m, CostPrice = 3.34m, ResellerPrice = 3.69m, Status = "Active", Description = "257 Diamonds Popular", CreatedAt = DateTime.UtcNow },
            new MLBBTopUp.Core.Entities.Product { DiamondAmount = 275, Price = 3.85m, CostPrice = 3.55m, ResellerPrice = 3.85m, Status = "Active", Description = "275 Diamonds (29 tickets)", CreatedAt = DateTime.UtcNow },
            new MLBBTopUp.Core.Entities.Product { DiamondAmount = 312, Price = 4.55m, CostPrice = 3.88m, ResellerPrice = 4.55m, Status = "Active", Description = "312 Diamonds (Starlight Ready)", CreatedAt = DateTime.UtcNow },
            new MLBBTopUp.Core.Entities.Product { DiamondAmount = 343, Price = 4.99m, CostPrice = 4.25m, ResellerPrice = 4.99m, Status = "Active", Description = "343 Diamonds (29 tickets)", CreatedAt = DateTime.UtcNow },
            new MLBBTopUp.Core.Entities.Product { DiamondAmount = 429, Price = 6.30m, CostPrice = 5.68m, ResellerPrice = 6.30m, Status = "Active", Description = "429 Diamonds (29 tickets)", CreatedAt = DateTime.UtcNow },
            new MLBBTopUp.Core.Entities.Product { DiamondAmount = 500, Price = 8.50m, CostPrice = 7.64m, ResellerPrice = 8.50m, Status = "Active", Description = "VIP Twilight Pass", CreatedAt = DateTime.UtcNow },
            new MLBBTopUp.Core.Entities.Product { DiamondAmount = 514, Price = 7.35m, CostPrice = 6.28m, ResellerPrice = 7.35m, Status = "Active", Description = "514 Diamonds Best Value", CreatedAt = DateTime.UtcNow },
            new MLBBTopUp.Core.Entities.Product { DiamondAmount = 565, Price = 7.80m, CostPrice = 7.31m, ResellerPrice = 7.80m, Status = "Active", Description = "565 Diamonds Special", CreatedAt = DateTime.UtcNow },
            new MLBBTopUp.Core.Entities.Product { DiamondAmount = 600, Price = 8.50m, CostPrice = 7.25m, ResellerPrice = 8.50m, Status = "Active", Description = "600 Diamonds Pro Pack", CreatedAt = DateTime.UtcNow },
            new MLBBTopUp.Core.Entities.Product { DiamondAmount = 706, Price = 9.99m, CostPrice = 9.08m, ResellerPrice = 9.99m, Status = "Active", Description = "706 Diamonds VIP", CreatedAt = DateTime.UtcNow },
            new MLBBTopUp.Core.Entities.Product { DiamondAmount = 878, Price = 12.80m, CostPrice = 10.90m, ResellerPrice = 12.80m, Status = "Active", Description = "878 Diamonds VIP PRO", CreatedAt = DateTime.UtcNow },
            new MLBBTopUp.Core.Entities.Product { DiamondAmount = 963, Price = 13.60m, CostPrice = 11.60m, ResellerPrice = 13.60m, Status = "Active", Description = "963 Diamonds Grand Pack", CreatedAt = DateTime.UtcNow },
            new MLBBTopUp.Core.Entities.Product { DiamondAmount = 1050, Price = 15.50m, CostPrice = 13.20m, ResellerPrice = 15.50m, Status = "Active", Description = "1050 Diamonds Royal Chest", CreatedAt = DateTime.UtcNow },
            new MLBBTopUp.Core.Entities.Product { DiamondAmount = 1412, Price = 22.00m, CostPrice = 18.80m, ResellerPrice = 22.00m, Status = "Active", Description = "1412 Diamonds Treasury", CreatedAt = DateTime.UtcNow },
            new MLBBTopUp.Core.Entities.Product { DiamondAmount = 2195, Price = 29.99m, CostPrice = 27.49m, ResellerPrice = 29.99m, Status = "Active", Description = "2195 Diamonds Mythic Pack", CreatedAt = DateTime.UtcNow },
            new MLBBTopUp.Core.Entities.Product { DiamondAmount = 2452, Price = 32.50m, CostPrice = 27.70m, ResellerPrice = 32.50m, Status = "Active", Description = "2452 Diamonds Mythic Plus", CreatedAt = DateTime.UtcNow },
            new MLBBTopUp.Core.Entities.Product { DiamondAmount = 2901, Price = 39.99m, CostPrice = 34.00m, ResellerPrice = 39.99m, Status = "Active", Description = "2901 Diamonds Legendary Pack", CreatedAt = DateTime.UtcNow },
            new MLBBTopUp.Core.Entities.Product { DiamondAmount = 3688, Price = 49.99m, CostPrice = 45.86m, ResellerPrice = 49.99m, Status = "Active", Description = "3688 Diamonds Epic Vault", CreatedAt = DateTime.UtcNow },
            new MLBBTopUp.Core.Entities.Product { DiamondAmount = 4390, Price = 62.99m, CostPrice = 53.60m, ResellerPrice = 62.99m, Status = "Active", Description = "4390 Diamonds Supreme Chest", CreatedAt = DateTime.UtcNow },
            new MLBBTopUp.Core.Entities.Product { DiamondAmount = 5532, Price = 73.99m, CostPrice = 69.24m, ResellerPrice = 73.99m, Status = "Active", Description = "5532 Diamonds Immortal Pack", CreatedAt = DateTime.UtcNow },
            new MLBBTopUp.Core.Entities.Product { DiamondAmount = 6944, Price = 92.99m, CostPrice = 79.20m, ResellerPrice = 92.99m, Status = "Active", Description = "6944 Diamonds Titan Pack", CreatedAt = DateTime.UtcNow },
            new MLBBTopUp.Core.Entities.Product { DiamondAmount = 9288, Price = 125.00m, CostPrice = 115.00m, ResellerPrice = 125.00m, Status = "Active", Description = "9288 Diamonds ULTIMATE", CreatedAt = DateTime.UtcNow }
        };

        // Upsert official packages and clean up obsolete products
        var existingProducts = await _context.Products.Include(p => p.Orders).ToListAsync();
        var validAmounts = realPackages.Select(r => r.DiamondAmount).ToHashSet();

        // Remove or deactivate non-standard products
        foreach (var p in existingProducts)
        {
            if (!validAmounts.Contains(p.DiamondAmount))
            {
                if (!p.Orders.Any())
                {
                    _context.Products.Remove(p);
                }
                else
                {
                    p.Status = "Inactive";
                }
            }
        }

        // Upsert real packages
        foreach (var pkg in realPackages)
        {
            var match = existingProducts.FirstOrDefault(p => p.DiamondAmount == pkg.DiamondAmount);
            if (match != null)
            {
                match.Price = pkg.Price;
                match.CostPrice = pkg.CostPrice;
                match.ResellerPrice = pkg.ResellerPrice;
                match.Status = "Active";
                match.Description = pkg.Description;
            }
            else
            {
                _context.Products.Add(pkg);
            }
        }

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = $"Successfully synced {realPackages.Length} real official MLBB diamond packages with Multi-Tier Pricing!",
            count = realPackages.Length
        });
    }

    /// <summary>
    /// Executive Financial & Net Profit Analytics
    /// </summary>
    [HttpGet("financials/profit")]
    public async Task<IActionResult> GetFinancialsProfit()
    {
        // Check if cleared in MongoDB if not in memory
        DateTime? clearedAt = _financialsClearedAt;
        try
        {
            var mongoUri = _configuration["MongoDB:ConnectionString"]
                ?? "mongodb+srv://peakmao007_db_user:DNelqTteMX30a7PX@pudeth.olrum6s.mongodb.net/?appName=pudeth&retryWrites=true&w=majority";
            var dbName = _configuration["MongoDB:DatabaseName"] ?? "mlbbtopup";

            var mongoClient = new MongoDB.Driver.MongoClient(mongoUri);
            var mongoDb = mongoClient.GetDatabase(dbName);
            var settingsCol = mongoDb.GetCollection<MongoDB.Bson.BsonDocument>("settings");
            var settingDoc = await settingsCol.Find(MongoDB.Driver.Builders<MongoDB.Bson.BsonDocument>.Filter.Eq("_id", "financials_cleared_at")).FirstOrDefaultAsync();
            if (settingDoc != null && settingDoc.Contains("cleared_at"))
            {
                var dt = settingDoc["cleared_at"].ToUniversalTime();
                if (!_financialsClearedAt.HasValue || dt > _financialsClearedAt.Value)
                {
                    _financialsClearedAt = dt;
                }
                clearedAt = _financialsClearedAt;
            }
        }
        catch { }

        var paidOrdersQuery = _context.Orders
            .Where(o => (o.PaymentStatus != null && (o.PaymentStatus.ToLower() == "paid" || o.PaymentStatus.ToLower() == "approved" || o.PaymentStatus.ToLower() == "success" || o.PaymentStatus.ToLower() == "completed")) ||
                        (o.TopupStatus != null && (o.TopupStatus.ToLower() == "completed" || o.TopupStatus.ToLower() == "delivered" || o.TopupStatus.ToLower() == "success")));

        if (clearedAt.HasValue)
        {
            paidOrdersQuery = paidOrdersQuery.Where(o => o.CreatedAt > clearedAt.Value);
        }

        var paidOrders = await paidOrdersQuery
            .Include(o => o.Product)
            .ToListAsync();

        var products = await _context.Products.ToListAsync();

        // Accurate wholesale provider cost resolver
        decimal ResolveProviderWholesaleCost(string? pkgName, decimal sellPrice, int? diamondAmt)
        {
            var pLower = (pkgName ?? string.Empty).ToLower();
            var amt = diamondAmt ?? 0;

            // --- Free Fire Specific Packages & Wholesale Costs ---
            if (pLower.Contains("weekly lite x3") || pLower.Contains("weeklylite x3") || pLower.Contains("3 weekly lite") || pLower.Contains("3 weeklylite") || amt == 5029) return 0.94m;
            if (pLower.Contains("weekly lite x2") || pLower.Contains("weeklylite x2") || pLower.Contains("2 weekly lite") || pLower.Contains("2 weeklylite") || amt == 5028) return 0.63m;
            if (pLower.Contains("weekly lite") || pLower.Contains("weeklylite") || amt == 384) return 0.32m;

            if (pLower.Contains("weekly x3") || pLower.Contains("3 weekly") || amt == 5025) return 4.67m;
            if (pLower.Contains("weekly x2") || pLower.Contains("2 weekly") || amt == 5024) return 3.12m;
            if (pLower.Contains("4 weekly") || amt == 5026) return 6.24m;
            if (pLower.Contains("520 + weekly") || amt == 3077) return 6.16m;
            if (pLower.Contains("3 in 1") || amt == 5030) return 9.50m;
            if (pLower.Contains("weekly + monthly") || amt == 5031) return 9.33m;
            if (pLower.Contains("2weekly+monthly") || amt == 5032) return 18.15m;

            if (pLower.Contains("monthly x3") || pLower.Contains("3 monthly") || amt == 5022) return 22.55m;
            if (pLower.Contains("monthly x2") || pLower.Contains("2 monthly") || amt == 5021) return 15.03m;
            if (pLower.Contains("4 monthly") || amt == 5023) return 30.06m;
            if (pLower.Contains("monthly membership") || (pLower.Contains("monthly") && !pLower.Contains("mlbb")) || amt == 4852) return 7.76m;

            if (pLower.Contains("level 30") || pLower.Contains("level-30") || amt == 389) return 0.90m;
            if (pLower.Contains("level 25") || pLower.Contains("level-25") || amt == 388) return 0.61m;
            if (pLower.Contains("level 20") || pLower.Contains("level-20") || amt == 387) return 0.61m;
            if (pLower.Contains("level 15") || pLower.Contains("level-15") || amt == 386) return 0.61m;
            if (pLower.Contains("level 10") || pLower.Contains("level-10") || amt == 385) return 0.61m;
            if (pLower.Contains("level 6") || pLower.Contains("level-6") || amt == 390) return 0.29m;

            if (pLower.Contains("evo 30") || amt == 5303) return 2.55m;
            if (pLower.Contains("evo 7") || amt == 5302) return 0.90m;
            if (pLower.Contains("evo 3") || amt == 5301) return 0.65m;

            // --- MLBB Specific Packages & General Diamonds ---
            if (amt == 3688 || sellPrice == 49.99m || pLower.Contains("3688") || pLower.Contains("49.99")) return 45.86m;
            if (amt == 55 || sellPrice == 0.95m || pLower.Contains("55 diamond")) return 0.74m;
            if (amt == 86 || sellPrice == 1.35m || pLower.Contains("86 diamond")) return 1.17m;
            if (amt == 110 || sellPrice == 1.70m || pLower.Contains("110 diamond")) return 1.45m;
            if (amt == 165 || sellPrice == 2.40m || pLower.Contains("165 diamond")) return 2.22m;
            if (amt == 172 || sellPrice == 2.50m || pLower.Contains("172 diamond")) return 2.31m;
            if (amt == 210 || sellPrice == 1.55m || (pLower.Contains("weekly") && pLower.Contains("mlbb"))) return 1.45m;
            if (amt == 257 || sellPrice == 3.69m || pLower.Contains("257 diamond")) return 3.34m;
            if (amt == 275 || sellPrice == 3.85m || pLower.Contains("275 diamond")) return 3.55m;
            if (amt == 312 || sellPrice == 4.55m || pLower.Contains("312 diamond")) return 3.88m;
            if (amt == 343 || sellPrice == 4.99m || pLower.Contains("343 diamond")) return 4.25m;
            if (amt == 429 || sellPrice == 6.30m || pLower.Contains("429 diamond")) return 5.68m;
            if (amt == 514 || sellPrice == 7.35m || pLower.Contains("514 diamond")) return 6.28m;
            if (amt == 565 || sellPrice == 7.80m || pLower.Contains("565 diamond")) return 7.31m;
            if (amt == 600 || sellPrice == 8.50m || pLower.Contains("600 diamond")) return 7.25m;
            if (amt == 706 || sellPrice == 9.99m || pLower.Contains("706 diamond")) return 9.08m;
            if (amt == 878 || sellPrice == 12.80m || pLower.Contains("878 diamond")) return 10.90m;
            if (amt == 963 || sellPrice == 13.60m || pLower.Contains("963 diamond")) return 11.60m;
            if (amt == 1050 || sellPrice == 15.50m || pLower.Contains("1050 diamond")) return 13.20m;
            if (amt == 1412 || sellPrice == 22.00m || pLower.Contains("1412 diamond")) return 18.80m;
            if (amt == 2195 || sellPrice == 29.99m || pLower.Contains("2195 diamond")) return 27.49m;
            if (amt == 2452 || sellPrice == 32.50m || pLower.Contains("2452 diamond")) return 27.70m;
            if (amt == 2901 || sellPrice == 39.99m || pLower.Contains("2901 diamond")) return 34.00m;
            if (amt == 4390 || sellPrice == 62.99m || pLower.Contains("4390 diamond")) return 53.60m;
            if (amt == 5532 || sellPrice == 73.99m || pLower.Contains("5532 diamond")) return 69.24m;
            if (amt == 6944 || sellPrice == 92.99m || pLower.Contains("6944 diamond")) return 79.20m;
            if (amt == 9288 || sellPrice == 125.00m || pLower.Contains("9288 diamond")) return 115.00m;

            var matchProd = products.FirstOrDefault(p =>
                (diamondAmt.HasValue && p.DiamondAmount == diamondAmt.Value) ||
                (!string.IsNullOrEmpty(pkgName) && p.Description != null && p.Description.Contains(pkgName, StringComparison.OrdinalIgnoreCase)));
            if (matchProd != null && matchProd.CostPrice > 0) return matchProd.CostPrice;

            return sellPrice > 0 ? Math.Round(sellPrice * 0.82m, 2) : 0m;
        }

        var ledgerList = new List<object>();
        var seenKeys = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

        decimal totalGrossRevenue = 0m;
        decimal totalSupplierCogs = 0m;

        // 1. Process SQLite orders
        foreach (var o in paidOrders)
        {
            var key = $"ORD-{o.OrderId}";
            seenKeys.Add(key);
            var sell = o.Amount;
            var pkg = o.Product?.Description ?? $"{o.Product?.DiamondAmount} Diamonds";
            var prov = (o.Product != null && o.Product.CostPrice > 0)
                ? o.Product.CostPrice
                : ResolveProviderWholesaleCost(pkg, sell, o.Product?.DiamondAmount);
            var profit = Math.Round(sell - prov, 2);
            var margin = sell > 0 ? Math.Round((profit / sell) * 100, 1) : 0;

            totalGrossRevenue += sell;
            totalSupplierCogs += prov;

            ledgerList.Add(new
            {
                billNumber = key,
                orderId = o.OrderId,
                gameName = !string.IsNullOrWhiteSpace(o.GameName) ? o.GameName : "Mobile Legends",
                packageName = pkg,
                playerId = o.PlayerID ?? "N/A",
                serverId = o.ServerID ?? "Global",
                sellerPrice = sell,
                providerPrice = prov,
                netProfit = profit,
                marginPct = margin,
                date = o.CreatedAt.ToString("yyyy-MM-dd HH:mm:ss"),
                status = o.TopupStatus ?? "Completed"
            });
        }

        // 2. Query persistent MongoDB Atlas payments & orders collections
        try
        {
            var mongoUri = _configuration["MongoDB:ConnectionString"]
                ?? "mongodb+srv://peakmao007_db_user:DNelqTteMX30a7PX@pudeth.olrum6s.mongodb.net/?appName=pudeth&retryWrites=true&w=majority";
            var dbName = _configuration["MongoDB:DatabaseName"] ?? "mlbbtopup";

            var mongoClient = new MongoDB.Driver.MongoClient(mongoUri);
            var mongoDb = mongoClient.GetDatabase(dbName);
            var notArchivedFilter = MongoDB.Driver.Builders<MongoDB.Bson.BsonDocument>.Filter.Ne("archived_financials", true);

            // A) Query payments collection
            var paymentsCol = mongoDb.GetCollection<MongoDB.Bson.BsonDocument>("payments");
            var mongoDocs = await paymentsCol.Find(notArchivedFilter).ToListAsync();
            mongoDocs.Reverse();
            foreach (var doc in mongoDocs)
            {
                if (doc.Contains("archived_financials") && doc["archived_financials"].IsBoolean && doc["archived_financials"].AsBoolean) continue;

                var st = doc.Contains("status") && !doc["status"].IsBsonNull ? doc["status"].AsString.ToUpperInvariant() : "";
                var pst = doc.Contains("payment_status") && !doc["payment_status"].IsBsonNull ? doc["payment_status"].AsString.ToUpperInvariant() : "";
                var isPaid = st == "PAID" || st == "SUCCESS" || st == "APPROVED" || st == "COMPLETED" ||
                             pst == "PAID" || pst == "SUCCESS" || pst == "APPROVED" || pst == "COMPLETED";
                if (!isPaid) continue;

                var bill = doc.Contains("bill_number") && !doc["bill_number"].IsBsonNull ? doc["bill_number"].AsString : string.Empty;
                var tran = doc.Contains("transaction_id") && !doc["transaction_id"].IsBsonNull ? doc["transaction_id"].AsString : string.Empty;
                var key = !string.IsNullOrEmpty(bill) ? bill : (!string.IsNullOrEmpty(tran) ? tran : doc["_id"].ToString() ?? string.Empty);

                if (string.IsNullOrEmpty(key) || seenKeys.Contains(key)) continue;
                seenKeys.Add(key);

                decimal rawAmt = 0m;
                if (doc.Contains("amount"))
                {
                    if (doc["amount"].IsDouble) rawAmt = (decimal)doc["amount"].AsDouble;
                    else if (doc["amount"].IsInt32) rawAmt = doc["amount"].AsInt32;
                    else if (doc["amount"].IsInt64) rawAmt = doc["amount"].AsInt64;
                    else if (doc["amount"].IsDecimal128) rawAmt = (decimal)doc["amount"].AsDecimal128;
                }

                var curr = doc.Contains("currency") && !doc["currency"].IsBsonNull ? doc["currency"].AsString : "USD";
                var sell = (curr.Equals("KHR", StringComparison.OrdinalIgnoreCase))
                    ? Math.Round(rawAmt / 4100m, 2)
                    : rawAmt;

                if (sell <= 0) continue;

                var game = doc.Contains("game_name") && !doc["game_name"].IsBsonNull ? doc["game_name"].AsString : "Mobile Legends";
                var pkg = doc.Contains("package_name") && !doc["package_name"].IsBsonNull ? doc["package_name"].AsString : "55 Diamonds";
                var pid = doc.Contains("player_id") && !doc["player_id"].IsBsonNull ? doc["player_id"].AsString : "N/A";
                var sid = doc.Contains("server_id") && !doc["server_id"].IsBsonNull ? doc["server_id"].AsString : "Global";
                var dateStr = doc.Contains("created_at") && !doc["created_at"].IsBsonNull ? doc["created_at"].ToString()! :
                              doc.Contains("paid_at") && !doc["paid_at"].IsBsonNull ? doc["paid_at"].ToString()! :
                              DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss");

                var prov = ResolveProviderWholesaleCost(pkg, sell, null);
                var profit = Math.Round(sell - prov, 2);
                var margin = sell > 0 ? Math.Round((profit / sell) * 100, 1) : 0;

                totalGrossRevenue += sell;
                totalSupplierCogs += prov;

                ledgerList.Add(new
                {
                    billNumber = key,
                    orderId = 0,
                    gameName = game,
                    packageName = pkg,
                    playerId = pid,
                    serverId = sid,
                    sellerPrice = sell,
                    providerPrice = prov,
                    netProfit = profit,
                    marginPct = margin,
                    date = dateStr,
                    status = "Completed"
                });
            }

            // B) Query orders collection in MongoDB
            var ordersCol = mongoDb.GetCollection<MongoDB.Bson.BsonDocument>("orders");
            var mongoOrders = await ordersCol.Find(notArchivedFilter).ToListAsync();
            mongoOrders.Reverse();
            foreach (var doc in mongoOrders)
            {
                if (doc.Contains("archived_financials") && doc["archived_financials"].IsBoolean && doc["archived_financials"].AsBoolean) continue;

                var st = doc.Contains("status") && !doc["status"].IsBsonNull ? doc["status"].AsString.ToUpperInvariant() : "";
                var pst = doc.Contains("payment_status") && !doc["payment_status"].IsBsonNull ? doc["payment_status"].AsString.ToUpperInvariant() : "";
                var tst = doc.Contains("topup_status") && !doc["topup_status"].IsBsonNull ? doc["topup_status"].AsString.ToUpperInvariant() : "";
                var isPaid = st == "PAID" || st == "SUCCESS" || st == "APPROVED" || st == "COMPLETED" ||
                             pst == "PAID" || pst == "SUCCESS" || pst == "APPROVED" || pst == "COMPLETED" ||
                             tst == "COMPLETED" || tst == "DELIVERED";
                if (!isPaid) continue;

                var bill = doc.Contains("bill_number") && !doc["bill_number"].IsBsonNull ? doc["bill_number"].AsString :
                           (doc.Contains("order_id") && !doc["order_id"].IsBsonNull ? $"ORD-{doc["order_id"]}" : string.Empty);
                var tran = doc.Contains("transaction_id") && !doc["transaction_id"].IsBsonNull ? doc["transaction_id"].AsString : string.Empty;
                var key = !string.IsNullOrEmpty(bill) ? bill : (!string.IsNullOrEmpty(tran) ? tran : doc["_id"].ToString() ?? string.Empty);

                if (string.IsNullOrEmpty(key) || seenKeys.Contains(key)) continue;
                seenKeys.Add(key);

                decimal rawAmt = 0m;
                if (doc.Contains("amount"))
                {
                    if (doc["amount"].IsDouble) rawAmt = (decimal)doc["amount"].AsDouble;
                    else if (doc["amount"].IsInt32) rawAmt = doc["amount"].AsInt32;
                    else if (doc["amount"].IsInt64) rawAmt = doc["amount"].AsInt64;
                    else if (doc["amount"].IsDecimal128) rawAmt = (decimal)doc["amount"].AsDecimal128;
                }

                var curr = doc.Contains("currency") && !doc["currency"].IsBsonNull ? doc["currency"].AsString : "USD";
                var sell = (curr.Equals("KHR", StringComparison.OrdinalIgnoreCase))
                    ? Math.Round(rawAmt / 4100m, 2)
                    : rawAmt;

                if (sell <= 0) continue;

                var game = doc.Contains("game_name") && !doc["game_name"].IsBsonNull ? doc["game_name"].AsString : "Mobile Legends";
                var pkg = doc.Contains("package_name") && !doc["package_name"].IsBsonNull ? doc["package_name"].AsString :
                          (doc.Contains("product_name") && !doc["product_name"].IsBsonNull ? doc["product_name"].AsString : "55 Diamonds");
                var pid = doc.Contains("player_id") && !doc["player_id"].IsBsonNull ? doc["player_id"].AsString : "N/A";
                var sid = doc.Contains("server_id") && !doc["server_id"].IsBsonNull ? doc["server_id"].AsString : "Global";
                var dateStr = doc.Contains("created_at") && !doc["created_at"].IsBsonNull ? doc["created_at"].ToString()! : DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss");

                var prov = ResolveProviderWholesaleCost(pkg, sell, null);
                var profit = Math.Round(sell - prov, 2);
                var margin = sell > 0 ? Math.Round((profit / sell) * 100, 1) : 0;

                totalGrossRevenue += sell;
                totalSupplierCogs += prov;

                ledgerList.Add(new
                {
                    billNumber = key,
                    orderId = 0,
                    gameName = game,
                    packageName = pkg,
                    playerId = pid,
                    serverId = sid,
                    sellerPrice = sell,
                    providerPrice = prov,
                    netProfit = profit,
                    marginPct = margin,
                    date = dateStr,
                    status = "Completed"
                });
            }
        }
        catch { }

        totalGrossRevenue = Math.Round(totalGrossRevenue, 2);
        totalSupplierCogs = Math.Round(totalSupplierCogs, 2);
        var totalNetProfit = Math.Round(totalGrossRevenue - totalSupplierCogs, 2);
        var totalGrossRevenueKHR = Math.Round(totalGrossRevenue * 4100m);
        var totalSupplierCogsKHR = Math.Round(totalSupplierCogs * 4100m);
        var totalNetProfitKHR = Math.Round(totalNetProfit * 4100m);
        var overallMarginPct = totalGrossRevenue > 0
            ? Math.Round((totalNetProfit / totalGrossRevenue) * 100, 1)
            : 0;

        // Daily profit trend (last 7 days)
        var now = DateTime.UtcNow.Date;
        var pastDays = Enumerable.Range(0, 7)
            .Select(i => now.AddDays(-6 + i))
            .ToList();

        var dailyProfitTrend = pastDays.Select(day =>
        {
            var dayOrders = paidOrders.Where(o => o.CreatedAt.Date == day).ToList();
            var rev = dayOrders.Sum(o => o.Amount);
            var cost = dayOrders.Sum(o => (o.Product != null && o.Product.CostPrice > 0) ? o.Product.CostPrice : ResolveProviderWholesaleCost(o.Product?.Description, o.Amount, o.Product?.DiamondAmount));
            var profit = rev - cost;
            var margin = rev > 0 ? Math.Round((profit / rev) * 100, 1) : 0;

            return new
            {
                Date = day.ToString("MMM dd"),
                GrossRevenue = rev,
                SupplierCost = cost,
                NetProfit = profit,
                MarginPct = margin,
                OrdersCount = dayOrders.Count
            };
        }).ToList();

        // Product profitability leaderboard
        var packageProfitability = products.Select(p =>
        {
            var cost = p.CostPrice > 0 ? p.CostPrice : ResolveProviderWholesaleCost(p.Description, p.Price, p.DiamondAmount);
            var reseller = p.ResellerPrice > 0 ? p.ResellerPrice : Math.Round(p.Price * 0.92m, 2);
            var retailProfit = p.Price - cost;
            var resellerProfit = reseller - cost;
            var retailMargin = p.Price > 0 ? Math.Round((retailProfit / p.Price) * 100, 1) : 0;
            var soldCount = paidOrders.Count(o => o.ProductId == p.ProductId);
            var totalGeneratedProfit = soldCount * retailProfit;

            return new
            {
                p.ProductId,
                p.DiamondAmount,
                p.Price, // Customer
                CostPrice = cost, // Wholesale
                ResellerPrice = reseller, // Reseller
                RetailProfit = retailProfit,
                ResellerProfit = resellerProfit,
                RetailMarginPct = retailMargin,
                TotalSoldCount = soldCount,
                TotalProfit = totalGeneratedProfit,
                p.Status
            };
        }).OrderByDescending(x => x.TotalProfit).ThenBy(x => x.DiamondAmount).ToList();

        return Ok(new
        {
            totalGrossRevenue,
            totalGrossRevenueKHR,
            totalSupplierCogs,
            totalSupplierCogsKHR,
            totalNetProfit,
            totalNetProfitKHR,
            overallMarginPct,
            dailyProfitTrend,
            packageProfitability,
            salesLedger = ledgerList,
            clearedAt = _financialsClearedAt?.ToString("o")
        });
    }

    /// <summary>
    /// Clear & Reset Financials for starting a brand-new selling period
    /// </summary>
    [HttpPost("financials/clear")]
    public async Task<IActionResult> ClearFinancials()
    {
        var now = DateTime.UtcNow;
        _financialsClearedAt = now;

        try
        {
            var mongoUri = _configuration["MongoDB:ConnectionString"]
                ?? "mongodb+srv://peakmao007_db_user:DNelqTteMX30a7PX@pudeth.olrum6s.mongodb.net/?appName=pudeth&retryWrites=true&w=majority";
            var dbName = _configuration["MongoDB:DatabaseName"] ?? "mlbbtopup";

            var mongoClient = new MongoDB.Driver.MongoClient(mongoUri);
            var mongoDb = mongoClient.GetDatabase(dbName);
            var settingsCol = mongoDb.GetCollection<MongoDB.Bson.BsonDocument>("settings");

            var filter = MongoDB.Driver.Builders<MongoDB.Bson.BsonDocument>.Filter.Eq("_id", "financials_cleared_at");
            var update = MongoDB.Driver.Builders<MongoDB.Bson.BsonDocument>.Update
                .Set("cleared_at", now)
                .Set("cleared_at_iso", now.ToString("o"));
            await settingsCol.UpdateOneAsync(filter, update, new MongoDB.Driver.UpdateOptions { IsUpsert = true });

            var paymentsCol = mongoDb.GetCollection<MongoDB.Bson.BsonDocument>("payments");
            var updatePayments = MongoDB.Driver.Builders<MongoDB.Bson.BsonDocument>.Update
                .Set("archived_financials", true)
                .Set("archived_at", now);
            await paymentsCol.UpdateManyAsync(
                MongoDB.Driver.Builders<MongoDB.Bson.BsonDocument>.Filter.Empty,
                updatePayments
            );
        }
        catch (Exception ex)
        {
            Console.WriteLine($"MongoDB clear financials warning: {ex.Message}");
        }

        return Ok(new
        {
            success = true,
            message = "Financials successfully reset to $0.00 for new sell period.",
            clearedAt = now.ToString("o")
        });
    }

    /// <summary>
    /// Upstream Supplier Credit / Balance Storage
    /// </summary>
    private static SupplierBalanceDto _supplierBalance = new SupplierBalanceDto
    {
        CurrentBalanceUSD = 450.00m,
        LowBalanceThresholdUSD = 100.00m,
        TotalDepositedUSD = 2500.00m,
        TotalConsumedUSD = 2050.00m,
        LastRefillDate = DateTime.UtcNow.AddDays(-2),
        SupplierName = "Smile.One Direct / UniPin Official",
        Status = "Healthy Credit"
    };

    private static List<SupplierDepositRecord> _depositHistory = new List<SupplierDepositRecord>
    {
        new SupplierDepositRecord { Id = 1, AmountUSD = 1000.00m, PaymentMethod = "Bank Wire (USD)", Note = "Initial API Credit Refill", CreatedAt = DateTime.UtcNow.AddDays(-15) },
        new SupplierDepositRecord { Id = 2, AmountUSD = 1500.00m, PaymentMethod = "Crypto USDT", Note = "Weekend Event Auto-Dispatch Deposit", CreatedAt = DateTime.UtcNow.AddDays(-2) }
    };

    [HttpGet("supplier/balance")]
    [HttpGet("wallet")]
    public IActionResult GetSupplierBalance()
    {
        return Ok(new
        {
            balance = _supplierBalance,
            deposits = _depositHistory.OrderByDescending(d => d.CreatedAt).ToList()
        });
    }

    [HttpPost("supplier/deposit")]
    public IActionResult RecordSupplierDeposit([FromBody] RecordDepositRequest request)
    {
        if (request.AmountUSD <= 0)
        {
            return BadRequest(new { message = "Deposit amount must be greater than 0" });
        }

        _supplierBalance.CurrentBalanceUSD += request.AmountUSD;
        _supplierBalance.TotalDepositedUSD += request.AmountUSD;
        _supplierBalance.LastRefillDate = DateTime.UtcNow;

        var rec = new SupplierDepositRecord
        {
            Id = _depositHistory.Count + 1,
            AmountUSD = request.AmountUSD,
            PaymentMethod = string.IsNullOrWhiteSpace(request.PaymentMethod) ? "Manual Admin Refill" : request.PaymentMethod,
            Note = request.Note ?? "Balance top-up",
            CreatedAt = DateTime.UtcNow
        };
        _depositHistory.Add(rec);

        return Ok(new
        {
            message = $"Successfully recorded deposit of ${request.AmountUSD:F2} to upstream supplier balance!",
            newBalance = _supplierBalance.CurrentBalanceUSD
        });
    }

    /// <summary>
    /// Reseller / B2B Accounts Storage (In-memory enriched)
    /// </summary>
    private static List<ResellerAccountDto> _resellers = new List<ResellerAccountDto>
    {
        new ResellerAccountDto
        {
            ResellerId = 101,
            Name = "Phnom Penh Gaming Store",
            Email = "reseller.pp@gamestore.kh",
            CompanyName = "PP Gaming Co., Ltd",
            BalanceUSD = 185.50m,
            DiscountTier = "Tier 1 (VIP Reseller - 8% Off)",
            DiscountRate = 0.08m,
            ApiKey = "reseller_key_live_99a81bc203847e0",
            TotalOrders = 142,
            TotalSpent = 1250.00m,
            Status = "Active",
            CreatedAt = DateTime.UtcNow.AddDays(-45)
        },
        new ResellerAccountDto
        {
            ResellerId = 102,
            Name = "Siem Reap Mobile TopUp",
            Email = "agent.sr@mobiletopup.com",
            CompanyName = "Angkor TopUp Agent",
            BalanceUSD = 64.20m,
            DiscountTier = "Tier 2 (Standard Agent - 5% Off)",
            DiscountRate = 0.05m,
            ApiKey = "reseller_key_live_771f28b49910c22",
            TotalOrders = 68,
            TotalSpent = 540.00m,
            Status = "Active",
            CreatedAt = DateTime.UtcNow.AddDays(-20)
        }
    };

    [HttpGet("resellers")]
    public IActionResult GetAllResellers()
    {
        return Ok(_resellers);
    }

    [HttpPost("resellers")]
    public IActionResult CreateResellerAccount([FromBody] CreateResellerRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name) || string.IsNullOrWhiteSpace(request.Email))
        {
            return BadRequest(new { message = "Name and Email are required" });
        }

        var newReseller = new ResellerAccountDto
        {
            ResellerId = _resellers.Count + 101,
            Name = request.Name,
            Email = request.Email,
            CompanyName = request.CompanyName ?? request.Name,
            BalanceUSD = request.InitialBalanceUSD ?? 0.00m,
            DiscountTier = request.DiscountTier ?? "Standard Agent (5% Off)",
            DiscountRate = request.DiscountRate ?? 0.05m,
            ApiKey = $"reseller_key_live_{Guid.NewGuid().ToString("N")[..16]}",
            TotalOrders = 0,
            TotalSpent = 0,
            Status = "Active",
            CreatedAt = DateTime.UtcNow
        };

        _resellers.Add(newReseller);

        return Ok(new
        {
            message = $"Reseller account '{newReseller.Name}' created with API Key!",
            reseller = newReseller
        });
    }

    [HttpPost("resellers/{id}/deposit")]
    public IActionResult DepositResellerCredit(int id, [FromBody] ResellerDepositRequest request)
    {
        var reseller = _resellers.FirstOrDefault(r => r.ResellerId == id);
        if (reseller == null)
        {
            return NotFound(new { message = "Reseller account not found" });
        }

        reseller.BalanceUSD += request.AmountUSD;

        return Ok(new
        {
            message = $"Added ${request.AmountUSD:F2} credit to {reseller.Name}. New Balance: ${reseller.BalanceUSD:F2}",
            newBalance = reseller.BalanceUSD
        });
    }

    [HttpPost("resellers/{id}/generate-api-key")]
    public IActionResult GenerateResellerApiKey(int id)
    {
        var reseller = _resellers.FirstOrDefault(r => r.ResellerId == id);
        if (reseller == null)
        {
            return NotFound(new { message = "Reseller account not found" });
        }

        reseller.ApiKey = $"reseller_key_live_{Guid.NewGuid().ToString("N")[..16]}";

        return Ok(new
        {
            message = "New Reseller API Key generated successfully!",
            apiKey = reseller.ApiKey
        });
    }

    /// <summary>
    /// Failed / Retry Transactions Desk
    /// </summary>
    [HttpGet("transactions/failed")]
    public async Task<IActionResult> GetFailedTransactions()
    {
        var failed = await _context.Orders
            .Where(o => o.TopupStatus == "Failed" || (o.PaymentStatus == "Failed"))
            .Include(o => o.Product)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        var failedList = failed.Select(o => new
        {
            o.OrderId,
            o.PlayerID,
            o.ServerID,
            o.ProductId,
            DiamondAmount = o.Product != null ? o.Product.DiamondAmount : 0,
            o.Amount,
            o.PaymentStatus,
            o.TopupStatus,
            ErrorMessage = "Provider Error: Upstream Timeout / Player ID Verification Handshake",
            RetryCount = 1,
            o.CreatedAt,
            SuggestedAction = "Retry with Secondary Provider or Verify Player ID"
        }).ToList();

        return Ok(failedList);
    }

    [HttpPost("transactions/{id}/retry")]
    public async Task<IActionResult> RetryFailedTransaction(int id)
    {
        var order = await _orderService.GetOrderByIdAsync(id);
        if (order == null)
        {
            return NotFound(new { message = "Order not found" });
        }

        // Trigger top-up service
        var result = await _topUpService.ProcessTopUpAsync(
            id,
            order.PlayerID,
            order.ServerID,
            order.DiamondAmount
        );

        if (result.Success)
        {
            return Ok(new { message = $"Order #{id} retried successfully! {result.Message}", success = true });
        }

        return BadRequest(new { message = result.Message ?? $"Retry for order #{id} failed.", success = false });
    }

    /// <summary>
    /// Get current Top-Up Provider Settings with live balances from both providers
    /// </summary>
    [HttpGet("provider-settings")]
    [HttpGet("/api/provider-settings")]
    [AllowAnonymous]
    public async Task<IActionResult> GetProviderSettings()
    {
        var settings = await _gatewayManager.RefreshBalancesAsync();
        return Ok(settings);
    }

    /// <summary>
    /// 1-Click Fast Provider Switcher
    /// </summary>
    [HttpPost("provider/switch")]
    [HttpPost("/api/provider/switch")]
    [AllowAnonymous]
    public async Task<IActionResult> SwitchProvider([FromBody] SwitchProviderRequest request)
    {
        if (string.IsNullOrWhiteSpace(request?.Provider))
        {
            return BadRequest(new { message = "Provider is required.", success = false });
        }

        var updated = await _gatewayManager.SwitchProviderAsync(request.Provider);
        return Ok(new
        {
            success = true,
            message = $"Active provider switched to {updated.ActiveProvider}",
            settings = updated
        });
    }

    /// <summary>
    /// Update Top-Up Provider Settings
    /// </summary>
    [HttpPut("provider-settings")]
    [HttpPost("provider-settings")]
    [HttpPut("/api/provider-settings")]
    [HttpPost("/api/provider-settings")]
    [AllowAnonymous]
    public async Task<IActionResult> UpdateProviderSettings([FromBody] SupplierSettingsModel dto)
    {
        if (dto == null)
        {
            return BadRequest(new { message = "Settings payload is required.", success = false });
        }

        var updated = await _gatewayManager.UpdateSettingsAsync(dto);
        return Ok(new
        {
            success = true,
            message = "Provider settings saved successfully!",
            settings = updated
        });
    }

    /// <summary>
    /// Add a new FazerCards API Key / Token while keeping old tokens safely preserved
    /// </summary>
    [HttpPost("provider/fazercards-tokens")]
    [HttpPost("/api/provider/fazercards-tokens")]
    [AllowAnonymous]
    public async Task<IActionResult> AddFazerCardsToken([FromBody] AddFazerCardsTokenRequest request)
    {
        if (string.IsNullOrWhiteSpace(request?.Token))
        {
            return BadRequest(new { success = false, message = "Token cannot be empty." });
        }

        var updated = await _gatewayManager.AddFazerCardsTokenAsync(request.Token, request.Name, request.SetActive);
        return Ok(new
        {
            success = true,
            message = "FazerCards token added successfully! Old tokens kept safely in keyring.",
            settings = updated
        });
    }

    /// <summary>
    /// Switch active FazerCards API Key / Token
    /// </summary>
    [HttpPost("provider/fazercards-tokens/switch")]
    [HttpPost("/api/provider/fazercards-tokens/switch")]
    [AllowAnonymous]
    public async Task<IActionResult> SwitchFazerCardsToken([FromBody] SwitchFazerCardsTokenRequest request)
    {
        if (string.IsNullOrWhiteSpace(request?.Id))
        {
            return BadRequest(new { success = false, message = "Token ID is required." });
        }

        var updated = await _gatewayManager.SwitchFazerCardsTokenAsync(request.Id);
        return Ok(new
        {
            success = true,
            message = "Active FazerCards token switched successfully.",
            settings = updated
        });
    }

    /// <summary>
    /// Delete a FazerCards token from keyring
    /// </summary>
    [HttpDelete("provider/fazercards-tokens/{id}")]
    [HttpDelete("/api/provider/fazercards-tokens/{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> DeleteFazerCardsToken(string id)
    {
        if (string.IsNullOrWhiteSpace(id))
        {
            return BadRequest(new { success = false, message = "Token ID is required." });
        }

        var updated = await _gatewayManager.DeleteFazerCardsTokenAsync(id);
        return Ok(new
        {
            success = true,
            message = "FazerCards token removed from keyring.",
            settings = updated
        });
    }

    /// <summary>
    /// Test Connection to Top-Up Provider
    /// </summary>
    [HttpPost("provider/test-connection")]
    [AllowAnonymous]
    public async Task<IActionResult> TestProviderConnection([FromBody] SupplierSettingsModel? dto)
    {
        var sw = System.Diagnostics.Stopwatch.StartNew();
        var current = _gatewayManager.GetSettings();
        var provider = dto?.ActiveProvider ?? current.ActiveProvider;
        var apiKey = !string.IsNullOrWhiteSpace(dto?.ApiKey)
            ? dto.ApiKey
            : (provider.Equals("KhmerTopUp", StringComparison.OrdinalIgnoreCase) ? current.KhmerTopUpApiKey : current.FazerCardsApiKey);

        if (provider.Equals("KhmerTopUp", StringComparison.OrdinalIgnoreCase))
        {
            try
            {
                using var client = new HttpClient { Timeout = TimeSpan.FromSeconds(6) };
                client.DefaultRequestHeaders.Add("X-API-Key", apiKey);
                client.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");

                var resp = await client.GetAsync("https://khmer-topup.com/api/v1/me");
                sw.Stop();
                if (resp.IsSuccessStatusCode)
                {
                    var json = await resp.Content.ReadAsStringAsync();
                    using var doc = System.Text.Json.JsonDocument.Parse(json);
                    decimal bal = 0;
                    if (doc.RootElement.TryGetProperty("balance", out var bProp))
                    {
                        if (bProp.ValueKind == System.Text.Json.JsonValueKind.Number && bProp.TryGetDecimal(out var dBal))
                            bal = dBal;
                        else if (decimal.TryParse(bProp.GetString(), out var sBal))
                            bal = sBal;
                    }
                    await _gatewayManager.RefreshBalancesAsync();
                    return Ok(new
                    {
                        success = true,
                        provider = "KhmerTopUp",
                        status = "Online & Authenticated",
                        latencyMs = sw.ElapsedMilliseconds,
                        balanceUSD = bal,
                        availableBalanceUSD = bal,
                        message = $"Khmer TopUp Direct MLBB Gateway Authenticated! Live Account Balance: ${bal:F2} USD"
                    });
                }
                else
                {
                    return Ok(new
                    {
                        success = false,
                        provider = "KhmerTopUp",
                        status = "Authentication Failed",
                        latencyMs = sw.ElapsedMilliseconds,
                        availableBalanceUSD = 0,
                        message = $"Khmer TopUp rejected API Key (HTTP {resp.StatusCode})"
                    });
                }
            }
            catch (Exception ex)
            {
                sw.Stop();
                return Ok(new
                {
                    success = false,
                    provider = "KhmerTopUp",
                    status = "Connection Error",
                    message = $"Failed to reach KhmerTopUp API: {ex.Message}"
                });
            }
        }
        else
        {
            try
            {
                using var client = new HttpClient { Timeout = TimeSpan.FromSeconds(6) };
                client.DefaultRequestHeaders.Add("X-API-Key", apiKey);
                var resp = await client.GetAsync("https://api.fzr.cards/api/v2/balance");
                sw.Stop();

                if (resp.IsSuccessStatusCode)
                {
                    var json = await resp.Content.ReadAsStringAsync();
                    using var doc = System.Text.Json.JsonDocument.Parse(json);
                    decimal bal = 0;
                    if (doc.RootElement.TryGetProperty("balance", out var bProp))
                    {
                        decimal.TryParse(bProp.GetString(), out bal);
                    }
                    await _gatewayManager.RefreshBalancesAsync();
                    return Ok(new
                    {
                        success = true,
                        provider = "FazerCards",
                        status = "Online & Authenticated",
                        latencyMs = sw.ElapsedMilliseconds,
                        balanceUSD = bal,
                        availableBalanceUSD = bal,
                        message = $"FazerCards B2B Reseller API Authenticated! Live Account Balance: ${bal:F4} USD"
                    });
                }
                else
                {
                    return Ok(new
                    {
                        success = false,
                        provider = "FazerCards",
                        status = "Authentication Failed",
                        latencyMs = sw.ElapsedMilliseconds,
                        availableBalanceUSD = 0,
                        message = $"FazerCards rejected API Key (HTTP {resp.StatusCode})"
                    });
                }
            }
            catch (Exception ex)
            {
                sw.Stop();
                return Ok(new
                {
                    success = false,
                    provider = "FazerCards",
                    status = "Connection Error",
                    message = $"Failed to reach FazerCards API: {ex.Message}"
                });
            }
        }
    }

    // ==================== BAKONG KHQR GATEWAY & ACCOUNT SWITCHER ====================

    private static readonly string _bakongAccountsFilePath = Path.Combine(AppContext.BaseDirectory, "bakong_accounts.json");
    private static readonly object _bakongLock = new object();

    private static List<BakongAccountDto> LoadBakongAccounts()
    {
        lock (_bakongLock)
        {
            if (System.IO.File.Exists(_bakongAccountsFilePath))
            {
                try
                {
                    var json = System.IO.File.ReadAllText(_bakongAccountsFilePath);
                    var list = System.Text.Json.JsonSerializer.Deserialize<List<BakongAccountDto>>(json, new System.Text.Json.JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                    if (list != null && list.Count > 0) return list;
                }
                catch { }
            }

            var defaultList = new List<BakongAccountDto>
            {
                new BakongAccountDto
                {
                    Id = 1,
                    AccountTitle = "PuDeth Smart-PAY (ACLEDA Primary)",
                    BakongId = "deth_peak3@aclb",
                    MerchantName = "PuDeth Smart-PAY",
                    MerchantCity = "PHNOM PENH",
                    AcquiringBank = "FAMILY PHONE",
                    BakongToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiMmNhMWUwOGI1M2IxNGNmOCJ9LCJpYXQiOjE3ODc2NTExNDMsImV4cCI6MTc5NTQyNzE0M30.WJwl-8fs523ie3up9XrATnEqnB3W8s0ziWTJUdBdnzQ",
                    IsActive = true,
                    DemoMode = false,
                    TelegramBotToken = "8516986555:AAH3enGgrbjWPKnQRPwXRQHKVfGgqiQ2Rhw",
                    TelegramChatId = "-5216036558",
                    CreatedAt = DateTime.UtcNow
                }
            };
            SaveBakongAccounts(defaultList);
            return defaultList;
        }
    }

    private static void SaveBakongAccounts(List<BakongAccountDto> accounts)
    {
        lock (_bakongLock)
        {
            try
            {
                var json = System.Text.Json.JsonSerializer.Serialize(accounts, new System.Text.Json.JsonSerializerOptions { WriteIndented = true });
                System.IO.File.WriteAllText(_bakongAccountsFilePath, json);
            }
            catch { }
        }
    }

    private static async Task SyncActiveBakongToService(BakongAccountDto active)
    {
        try
        {
            using var client = new HttpClient { Timeout = TimeSpan.FromSeconds(5) };
            var payload = new
            {
                BAKONG_TOKEN = active.BakongToken,
                MERCHANT_BAKONG_ID = active.BakongId,
                MERCHANT_NAME = active.MerchantName,
                MERCHANT_CITY = active.MerchantCity,
                ACQUIRING_BANK = active.AcquiringBank,
                DEMO_MODE = active.DemoMode,
                TELEGRAM_BOT_TOKEN = active.TelegramBotToken,
                TELEGRAM_CHAT_ID = active.TelegramChatId
            };
            var content = new StringContent(System.Text.Json.JsonSerializer.Serialize(payload), System.Text.Encoding.UTF8, "application/json");
            await client.PostAsync("http://localhost:5001/api/config/update", content);
        }
        catch { }
    }

    /// <summary>
    /// Get Bakong Gateway Settings and Accounts
    /// </summary>
    [HttpGet("bakong-settings")]
    [HttpGet("bakong/status")]
    [AllowAnonymous]
    public async Task<IActionResult> GetBakongSettings()
    {
        var accounts = LoadBakongAccounts();
        var active = accounts.FirstOrDefault(a => a.IsActive) ?? accounts.FirstOrDefault();

        if (active != null)
        {
            // Sync with Python service in background
            _ = Task.Run(() => SyncActiveBakongToService(active));
        }

        // Try getting live status from Python KHQR API
        var liveStatus = "Connected & Active";
        try
        {
            using var client = new HttpClient { Timeout = TimeSpan.FromSeconds(2) };
            var resp = await client.GetAsync("http://localhost:5001/health");
            if (!resp.IsSuccessStatusCode) liveStatus = "Degraded";
        }
        catch
        {
            liveStatus = "Offline / Starting";
        }

        return Ok(new
        {
            activeAccount = active,
            accounts = accounts,
            gatewayStatus = liveStatus,
            totalAccounts = accounts.Count
        });
    }

    /// <summary>
    /// Switch Active Bakong Account
    /// </summary>
    [HttpPost("bakong/switch-account")]
    public async Task<IActionResult> SwitchBakongAccount([FromBody] SwitchAccountRequest request)
    {
        var accounts = LoadBakongAccounts();
        var target = accounts.FirstOrDefault(a => a.Id == request.AccountId);
        if (target == null)
        {
            return NotFound(new { message = "Bakong account not found" });
        }

        foreach (var acc in accounts)
        {
            acc.IsActive = (acc.Id == request.AccountId);
        }

        SaveBakongAccounts(accounts);
        await SyncActiveBakongToService(target);

        return Ok(new
        {
            success = true,
            message = $"Switched active Bakong account to '{target.AccountTitle}' ({target.BakongId})",
            activeAccount = target
        });
    }

    /// <summary>
    /// Add or Update a Bakong Account Profile
    /// </summary>
    [HttpPost("bakong/accounts")]
    public async Task<IActionResult> SaveBakongAccount([FromBody] BakongAccountDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.BakongId) || string.IsNullOrWhiteSpace(dto.MerchantName))
        {
            return BadRequest(new { message = "Bakong ID and Merchant Name are required." });
        }

        var accounts = LoadBakongAccounts();
        BakongAccountDto accountToSave;

        if (dto.Id > 0 && accounts.Any(a => a.Id == dto.Id))
        {
            accountToSave = accounts.First(a => a.Id == dto.Id);
            accountToSave.AccountTitle = dto.AccountTitle;
            accountToSave.BakongId = dto.BakongId.Trim();
            accountToSave.MerchantName = dto.MerchantName.Trim();
            accountToSave.MerchantCity = dto.MerchantCity ?? "PHNOM PENH";
            accountToSave.AcquiringBank = dto.AcquiringBank ?? "FAMILY PHONE";
            if (!string.IsNullOrWhiteSpace(dto.BakongToken)) accountToSave.BakongToken = dto.BakongToken.Trim();
            accountToSave.DemoMode = dto.DemoMode;
            accountToSave.TelegramBotToken = dto.TelegramBotToken;
            accountToSave.TelegramChatId = dto.TelegramChatId;
        }
        else
        {
            var nextId = accounts.Any() ? accounts.Max(a => a.Id) + 1 : 1;
            accountToSave = new BakongAccountDto
            {
                Id = nextId,
                AccountTitle = string.IsNullOrWhiteSpace(dto.AccountTitle) ? $"{dto.MerchantName} ({dto.BakongId})" : dto.AccountTitle,
                BakongId = dto.BakongId.Trim(),
                MerchantName = dto.MerchantName.Trim(),
                MerchantCity = dto.MerchantCity ?? "PHNOM PENH",
                AcquiringBank = dto.AcquiringBank ?? "FAMILY PHONE",
                BakongToken = dto.BakongToken?.Trim() ?? string.Empty,
                IsActive = accounts.Count == 0 || dto.IsActive,
                DemoMode = dto.DemoMode,
                TelegramBotToken = dto.TelegramBotToken,
                TelegramChatId = dto.TelegramChatId,
                CreatedAt = DateTime.UtcNow
            };
            accounts.Add(accountToSave);
        }

        if (dto.IsActive)
        {
            foreach (var acc in accounts)
            {
                acc.IsActive = (acc.Id == accountToSave.Id);
            }
        }

        SaveBakongAccounts(accounts);

        var active = accounts.FirstOrDefault(a => a.IsActive) ?? accounts.FirstOrDefault();
        if (active != null)
        {
            await SyncActiveBakongToService(active);
        }

        return Ok(new
        {
            success = true,
            message = $"Bakong account '{accountToSave.AccountTitle}' saved successfully!",
            account = accountToSave,
            accounts = accounts
        });
    }

    /// <summary>
    /// Delete a Bakong Account Profile
    /// </summary>
    [HttpDelete("bakong/accounts/{id}")]
    public async Task<IActionResult> DeleteBakongAccount(int id)
    {
        var accounts = LoadBakongAccounts();
        var target = accounts.FirstOrDefault(a => a.Id == id);
        if (target == null)
        {
            return NotFound(new { message = "Account not found" });
        }

        if (accounts.Count <= 1)
        {
            return BadRequest(new { message = "Cannot delete the only remaining Bakong account profile." });
        }

        accounts.Remove(target);

        // If the deleted account was active, set the first one as active
        if (target.IsActive && accounts.Any())
        {
            accounts[0].IsActive = true;
            await SyncActiveBakongToService(accounts[0]);
        }

        SaveBakongAccounts(accounts);

        return Ok(new
        {
            success = true,
            message = $"Bakong account '{target.AccountTitle}' deleted.",
            accounts = accounts
        });
    }

    /// <summary>
    /// Quick update active Bakong token
    /// </summary>
    [HttpPost("bakong/update-token")]
    [HttpPost("bakong/token")]
    public async Task<IActionResult> UpdateBakongToken([FromBody] UpdateTokenRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Token))
        {
            return BadRequest(new { message = "Token cannot be empty." });
        }

        var accounts = LoadBakongAccounts();
        var active = accounts.FirstOrDefault(a => a.IsActive) ?? accounts.FirstOrDefault();
        if (active == null)
        {
            return NotFound(new { message = "No active Bakong account found." });
        }

        active.BakongToken = request.Token.Trim();
        SaveBakongAccounts(accounts);
        await SyncActiveBakongToService(active);

        return Ok(new
        {
            success = true,
            message = "Bakong token updated and applied live!",
            tokenLength = active.BakongToken.Length,
            maskedToken = active.BakongToken.Length > 20 ? active.BakongToken[..10] + "..." + active.BakongToken[^8..] : active.BakongToken
        });
    }

    /// <summary>
    /// Test Bakong token live
    /// </summary>
    [HttpPost("bakong/test-token")]
    [HttpPost("bakong/verify")]
    [HttpGet("bakong/verify")]
    public async Task<IActionResult> TestBakongToken([FromBody] UpdateTokenRequest? request)
    {
        var accounts = LoadBakongAccounts();
        var active = accounts.FirstOrDefault(a => a.IsActive) ?? accounts.FirstOrDefault();
        var tokenToTest = !string.IsNullOrWhiteSpace(request?.Token) ? request.Token.Trim() : active?.BakongToken;

        if (string.IsNullOrWhiteSpace(tokenToTest))
        {
            return BadRequest(new { message = "No token available to test." });
        }

        try
        {
            using var client = new HttpClient { Timeout = TimeSpan.FromSeconds(8) };
            var payload = new { token = tokenToTest };
            var content = new StringContent(System.Text.Json.JsonSerializer.Serialize(payload), System.Text.Encoding.UTF8, "application/json");
            var response = await client.PostAsync("http://localhost:5001/api/config/test-token", content);
            var responseBody = await response.Content.ReadAsStringAsync();
            
            var result = System.Text.Json.JsonSerializer.Deserialize<System.Text.Json.JsonElement>(responseBody);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return Ok(new
            {
                success = false,
                status = "Connection Error to Python KHQR Service",
                error = ex.Message
            });
        }
    }

    public class BakongAccountDto
    {
        public int Id { get; set; }
        public string AccountTitle { get; set; } = string.Empty;
        public string BakongId { get; set; } = string.Empty;
        public string MerchantName { get; set; } = string.Empty;
        public string MerchantCity { get; set; } = "PHNOM PENH";
        public string AcquiringBank { get; set; } = "FAMILY PHONE";
        public string BakongToken { get; set; } = string.Empty;
        public bool IsActive { get; set; } = false;
        public bool DemoMode { get; set; } = false;
        public string? TelegramBotToken { get; set; }
        public string? TelegramChatId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class SwitchAccountRequest
    {
        public int AccountId { get; set; }
    }

    public class UpdateTokenRequest
    {
        public string Token { get; set; } = string.Empty;
    }

    public class SwitchProviderRequest
    {
        public string Provider { get; set; } = "FazerCards";
    }

    public class ProviderSettingsDto
    {
        public string ActiveProvider { get; set; } = "KhmerTopUp";
        public string Environment { get; set; } = "Production";
        public bool AutoDispatchOnPayment { get; set; } = true;
        public string MerchantId { get; set; } = "peakmao007";
        public string ApiKey { get; set; } = "kt_28c2640c86717199395d973670cf039a30ba2716";
        public string KhmerTopUpApiKey { get; set; } = "kt_28c2640c86717199395d973670cf039a30ba2716";
        public string FazerCardsApiKey { get; set; } = "fc_5f79a0016d5d87bd1e83ea4f";
        public List<FazerCardsTokenItem> FazerCardsTokens { get; set; } = new();
        public string WebhookUrl { get; set; } = "http://localhost:5000/api/supplier/webhook";
        public decimal BalanceUSD { get; set; } = 3.0m;
        public decimal KhmerTopUpBalanceUSD { get; set; } = 3.0m;
        public decimal FazerCardsBalanceUSD { get; set; } = 0.01m;
        public string Status { get; set; } = "Connected & Active";
    }

    public class AddFazerCardsTokenRequest
    {
        public string Token { get; set; } = string.Empty;
        public string? Name { get; set; }
        public bool SetActive { get; set; } = true;
    }

    public class SwitchFazerCardsTokenRequest
    {
        public string Id { get; set; } = string.Empty;
    }

    public class SupplierBalanceDto
    {
        public decimal CurrentBalanceUSD { get; set; } = 0.75m;
        public decimal LowBalanceThresholdUSD { get; set; } = 0.50m;
        public decimal TotalDepositedUSD { get; set; } = 1.00m;
        public decimal TotalConsumedUSD { get; set; } = 0.25m;
        public DateTime LastRefillDate { get; set; } = DateTime.UtcNow;
        public string SupplierName { get; set; } = "Khmer TopUp & FazerCards Reseller";
        public string Status = "Healthy Credit ($0.75)";
    }

    public class SupplierDepositRecord
    {
        public int Id { get; set; }
        public decimal AmountUSD { get; set; }
        public string PaymentMethod { get; set; } = string.Empty;
        public string Note { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class RecordDepositRequest
    {
        public decimal AmountUSD { get; set; }
        public string PaymentMethod { get; set; } = "Bank Wire";
        public string? Note { get; set; }
    }

    public class ResellerAccountDto
    {
        public int ResellerId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string CompanyName { get; set; } = string.Empty;
        public decimal BalanceUSD { get; set; }
        public string DiscountTier { get; set; } = string.Empty;
        public decimal DiscountRate { get; set; }
        public string ApiKey { get; set; } = string.Empty;
        public int TotalOrders { get; set; }
        public decimal TotalSpent { get; set; }
        public string Status { get; set; } = "Active";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public class CreateResellerRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? CompanyName { get; set; }
        public decimal? InitialBalanceUSD { get; set; }
        public string? DiscountTier { get; set; }
        public decimal? DiscountRate { get; set; }
    }

    public class ResellerDepositRequest
    {
        public decimal AmountUSD { get; set; }
    }

    public class UpdateStatusRequest
    {
        public string Status { get; set; } = string.Empty;
    }

    public class UpdateRoleRequest
    {
        public string Role { get; set; } = string.Empty;
    }

    public class BatchProcessRequest
    {
        public List<int>? OrderIds { get; set; }
    }

    /// <summary>
    /// Get all orders with TopupStatus = AwaitingBalance (customer paid but provider had no balance).
    /// Used to show the notification badge and list in Admin Dashboard.
    /// </summary>
    [HttpGet("pending-balance-orders")]
    public async Task<IActionResult> GetPendingBalanceOrders()
    {
        var orders = await _context.Orders
            .Include(o => o.Product)
            .Where(o => o.TopupStatus == "AwaitingBalance" && o.PaymentStatus == "Paid")
            .OrderByDescending(o => o.CreatedAt)
            .Select(o => new
            {
                o.OrderId,
                o.PlayerID,
                o.ServerID,
                o.Amount,
                o.PaymentStatus,
                o.TopupStatus,
                o.CreatedAt,
                DiamondAmount = o.Product != null ? o.Product.DiamondAmount : 0,
                ProductName = o.Product != null ? (o.Product.Description != "" ? o.Product.Description : $"{o.Product.DiamondAmount} Diamonds") : "Unknown"
            })
            .ToListAsync();

        return Ok(new { success = true, count = orders.Count, orders });
    }

    /// <summary>
    /// Admin manually approves and delivers diamonds for an AwaitingBalance order.
    /// </summary>
    [HttpPost("orders/{id}/approve-topup")]
    public async Task<IActionResult> ApproveTopUp(int id)
    {
        var order = await _orderService.GetOrderByIdAsync(id);

        if (order == null)
            return NotFound(new { message = "Order not found" });

        if (order.PaymentStatus != "Paid")
            return BadRequest(new { message = "Order has not been paid" });

        if (order.TopupStatus == "Completed")
            return BadRequest(new { message = "Order topup already completed" });

        // Trigger topup delivery
        bool success = false;
        string resultMessage = string.Empty;
        try
        {
            var result = await _topUpService.ProcessTopUpAsync(
                order.OrderId,
                order.PlayerID,
                order.ServerID,
                order.DiamondAmount);

            success = result.Success;
            resultMessage = result.Message ?? (result.Success ? "Delivered successfully" : "Delivery failed");

            var newStatus = result.Success ? "Completed" : "Failed";
            await _orderService.UpdateOrderTopupStatusAsync(id, newStatus);
        }
        catch (Exception ex)
        {
            resultMessage = ex.Message;
            await _orderService.UpdateOrderTopupStatusAsync(id, "Failed");
        }

        return Ok(new
        {
            success,
            orderId = id,
            topupStatus = success ? "Completed" : "Failed",
            message = resultMessage
        });
    }
}
