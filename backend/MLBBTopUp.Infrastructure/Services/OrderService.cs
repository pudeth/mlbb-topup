using Microsoft.EntityFrameworkCore;
using MLBBTopUp.Core.DTOs;
using MLBBTopUp.Core.Entities;
using MLBBTopUp.Core.Interfaces;
using MLBBTopUp.Infrastructure.Data;

namespace MLBBTopUp.Infrastructure.Services;

public class OrderService : IOrderService
{
    private readonly ApplicationDbContext _context;

    public OrderService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<OrderResponse?> CreateOrderAsync(int? userId, CreateOrderRequest request)
    {
        Product? product = null;

        // 1. Check if custom diamond amount is requested
        if (request.CustomDiamondAmount.HasValue && request.CustomDiamondAmount.Value > 0)
        {
            int customDiamonds = request.CustomDiamondAmount.Value;
            product = await _context.Products.FirstOrDefaultAsync(p => p.DiamondAmount == customDiamonds && p.Status == "Active");

            if (product == null)
            {
                // Calculate classic fair price per diamond based on official MLBB rates (1050=$15.50, 2195=$29.99, 9288=$125.00)
                decimal calculatedPrice;
                if (customDiamonds == 9288) calculatedPrice = 125.00m;
                else if (customDiamonds == 5532) calculatedPrice = 75.00m;
                else if (customDiamonds == 3688) calculatedPrice = 49.99m;
                else if (customDiamonds == 2195) calculatedPrice = 29.99m;
                else if (customDiamonds == 1050) calculatedPrice = 15.50m;
                else if (customDiamonds == 706)  calculatedPrice = 10.30m;
                else if (customDiamonds == 514)  calculatedPrice = 7.50m;
                else if (customDiamonds == 344)  calculatedPrice = 5.00m;
                else if (customDiamonds == 257)  calculatedPrice = 3.80m;
                else if (customDiamonds == 172)  calculatedPrice = 2.50m;
                else if (customDiamonds == 86)   calculatedPrice = 1.25m;
                else if (customDiamonds == 55)   calculatedPrice = 0.85m;
                else if (customDiamonds == 11)   calculatedPrice = 0.20m;
                else
                {
                    decimal rate = customDiamonds >= 9288 ? (125.00m / 9288m)
                                 : customDiamonds >= 5532 ? (75.00m / 5532m)
                                 : customDiamonds >= 3688 ? (49.99m / 3688m)
                                 : customDiamonds >= 2195 ? (29.99m / 2195m)
                                 : customDiamonds >= 1050 ? (15.50m / 1050m)
                                 : customDiamonds >= 706  ? (10.30m / 706m)
                                 : customDiamonds >= 514  ? (7.50m / 514m)
                                 : customDiamonds >= 257  ? (3.80m / 257m)
                                 : customDiamonds >= 86   ? (1.25m / 86m)
                                 : (0.85m / 55m);

                    calculatedPrice = Math.Max(0.20m, Math.Round(customDiamonds * rate, 2));
                }

                product = new Product
                {
                    DiamondAmount = customDiamonds,
                    Price = calculatedPrice,
                    Description = !string.IsNullOrWhiteSpace(request.ProductName) ? request.ProductName : $"{customDiamonds} Diamonds",
                    Status = "Active",
                    CreatedAt = DateTime.UtcNow
                };

                _context.Products.Add(product);
                await _context.SaveChangesAsync();
            }
        }
        
        // 2. If product not found yet and ProductId is provided, look up by ID or DiamondAmount
        if (product == null && request.ProductId.HasValue)
        {
            product = await _context.Products.FindAsync(request.ProductId.Value);
            if (product == null || product.Status != "Active")
            {
                product = await _context.Products.FirstOrDefaultAsync(p => p.DiamondAmount == request.ProductId.Value && p.Status == "Active");
            }
        }

        // 3. Fallback to first available active product if still null
        if (product == null || product.Status != "Active")
        {
            product = await _context.Products.FirstOrDefaultAsync(p => p.Status == "Active");
        }

        // 4. If no products exist in DB, create initial 10-diamond product
        if (product == null)
        {
            product = new Product
            {
                DiamondAmount = 10,
                Price = 0.25m,
                Status = "Active",
                CreatedAt = DateTime.UtcNow
            };
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
        }

        // Validate user exists only if userId is provided (not guest)
        if (userId.HasValue)
        {
            var user = await _context.Users.FindAsync(userId.Value);
            if (user == null)
            {
                // Graceful fallback: If JWT token belongs to a wiped or stale user ID, treat as guest order
                userId = null;
            }
        }

        // Sanitize and auto-extract Player ID and Server ID if entered together
        var (cleanPlayerId, cleanServerId) = SanitizePlayerAndServerId(request.PlayerID, request.ServerID);

        // Auto-link to existing user account if order was placed as guest but player has registered
        if (!userId.HasValue && !string.IsNullOrWhiteSpace(cleanPlayerId))
        {
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Email.StartsWith(cleanPlayerId + "_") || u.Name.Contains(cleanPlayerId));
            if (existingUser != null)
            {
                userId = existingUser.UserId;
            }
        }

        // Create order
        var order = new Order
        {
            UserId = userId,
            PlayerID = cleanPlayerId,
            ServerID = cleanServerId,
            AccountName = !string.IsNullOrWhiteSpace(request.AccountName) ? request.AccountName : request.CustomerName,
            CustomerPhone = request.CustomerPhone,
            GameName = request.GameName,
            ProductId = product.ProductId,
            Amount = request.Amount ?? request.Price ?? product.Price,
            PaymentStatus = "Pending",
            TopupStatus = "Pending",
            CreatedAt = DateTime.UtcNow
        };

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        // Load navigation properties
        await _context.Entry(order).Reference(o => o.Product).LoadAsync();

        return MapToResponse(order);
    }

    public async Task<OrderResponse?> GetOrderByIdAsync(int orderId)
    {
        var order = await _context.Orders
            .Include(o => o.Product)
            .FirstOrDefaultAsync(o => o.OrderId == orderId);

        if (order == null)
        {
            return null;
        }

        return MapToResponse(order);
    }

    public async Task<IEnumerable<OrderResponse>> GetUserOrdersAsync(int userId)
    {
        var user = await _context.Users.FindAsync(userId);
        string? userPlayerId = null;
        if (user != null && !string.IsNullOrEmpty(user.Email))
        {
            var match = System.Text.RegularExpressions.Regex.Match(user.Email, @"^(\d+)_");
            if (match.Success)
            {
                userPlayerId = match.Groups[1].Value;
            }
        }

        var query = _context.Orders
            .Include(o => o.Product)
            .Where(o => o.UserId == userId || (userPlayerId != null && o.PlayerID == userPlayerId));

        var orders = await query
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        return orders.Select(o => MapToResponse(o));
    }

    public async Task<IEnumerable<OrderResponse>> GetOrdersByPlayerAsync(string playerId, string? serverId)
    {
        var p = (playerId ?? string.Empty).Trim();
        var s = (serverId ?? string.Empty).Trim();

        var query = _context.Orders
            .Include(o => o.Product)
            .Where(o => o.PlayerID == p);

        if (!string.IsNullOrEmpty(s) && !s.Equals("Global", StringComparison.OrdinalIgnoreCase))
        {
            var hasExact = await query.AnyAsync(o => o.ServerID == s);
            if (hasExact)
            {
                query = query.Where(o => o.ServerID == s || string.IsNullOrEmpty(o.ServerID) || o.ServerID == "Global");
            }
        }

        var orders = await query
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        return orders.Select(o => MapToResponse(o));
    }

    public async Task<IEnumerable<OrderResponse>> GetAllOrdersAsync()
    {
        var orders = await _context.Orders
            .Include(o => o.Product)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        return orders.Select(o => MapToResponse(o));
    }

    public async Task<IEnumerable<OrderResponse>> GetPendingOrdersAsync()
    {
        var orders = await _context.Orders
            .Include(o => o.Product)
            .Where(o => o.PaymentStatus == "Paid" && o.TopupStatus == "Pending")
            .OrderBy(o => o.CreatedAt)
            .ToListAsync();

        return orders.Select(o => MapToResponse(o));
    }

    public async Task<OrderStatusResponse?> GetOrderStatusAsync(int orderId)
    {
        var order = await _context.Orders.FindAsync(orderId);

        if (order == null)
        {
            return null;
        }

        string message = (order.PaymentStatus, order.TopupStatus) switch
        {
            ("Pending", _) => "Waiting for payment",
            ("Paid", "Pending") => "Payment received, processing top-up",
            ("Paid", "Processing") => "Top-up in progress",
            ("Paid", "Completed") => "Diamonds delivered successfully",
            ("Paid", "Failed") => "Top-up failed, please contact support",
            ("Failed", _) => "Payment failed",
            _ => "Order status unknown"
        };

        return new OrderStatusResponse
        {
            OrderId = order.OrderId,
            PaymentStatus = order.PaymentStatus,
            TopupStatus = order.TopupStatus,
            Message = message
        };
    }

    public async Task<bool> UpdateOrderPaymentStatusAsync(int orderId, string paymentStatus)
    {
        var order = await _context.Orders.FindAsync(orderId);

        if (order == null)
        {
            return false;
        }

        order.PaymentStatus = paymentStatus;
        order.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> UpdateOrderTopupStatusAsync(int orderId, string topupStatus)
    {
        var order = await _context.Orders.FindAsync(orderId);

        if (order == null)
        {
            return false;
        }

        order.TopupStatus = topupStatus;
        order.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return true;
    }

    private static OrderResponse MapToResponse(Order order)
    {
        return new OrderResponse
        {
            OrderId = order.OrderId,
            UserId = order.UserId,
            PlayerID = order.PlayerID,
            ServerID = order.ServerID,
            AccountName = order.AccountName,
            CustomerPhone = order.CustomerPhone,
            GameName = order.GameName,
            ProductId = order.ProductId,
            ProductName = !string.IsNullOrWhiteSpace(order.Product?.Description) ? order.Product.Description : $"{order.Product?.DiamondAmount ?? 0} Diamonds",
            DiamondAmount = order.Product?.DiamondAmount ?? 0,
            Amount = order.Amount,
            PaymentStatus = order.PaymentStatus,
            TopupStatus = order.TopupStatus,
            CreatedAt = order.CreatedAt,
            UpdatedAt = order.UpdatedAt
        };
    }

    private static (string PlayerID, string ServerID) SanitizePlayerAndServerId(string playerID, string serverID)
    {
        var p = (playerID ?? string.Empty).Trim();
        var s = (serverID ?? string.Empty).Trim();

        if (string.IsNullOrEmpty(s) || p.Contains("(") || p.Contains("[") || p.Contains("-"))
        {
            var match = System.Text.RegularExpressions.Regex.Match(p, @"(?:\bID\s*:\s*)?(\d{5,12})\s*[\(\[\{]\s*(\d{3,7})\s*[\)\]\}]", System.Text.RegularExpressions.RegexOptions.IgnoreCase);
            if (match.Success)
            {
                return (match.Groups[1].Value, match.Groups[2].Value);
            }

            var sepMatch = System.Text.RegularExpressions.Regex.Match(p, @"(?:\bID\s*:\s*)?(\d{6,12})\s*[-/,\s|:]\s*(\d{3,7})", System.Text.RegularExpressions.RegexOptions.IgnoreCase);
            if (sepMatch.Success)
            {
                return (sepMatch.Groups[1].Value, sepMatch.Groups[2].Value);
            }
        }

        return (p, s);
    }
}
