using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MLBBTopUp.Core.DTOs;
using MLBBTopUp.Core.Interfaces;

namespace MLBBTopUp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : BaseController
{
    private readonly IOrderService _orderService;
    private readonly IPaymentService _paymentService;
    private readonly ITopUpService _topUpService;
    private readonly IConfiguration _configuration;

    public OrdersController(
        IOrderService orderService,
        IPaymentService paymentService,
        ITopUpService topUpService,
        IConfiguration configuration)
    {
        _orderService = orderService;
        _paymentService = paymentService;
        _topUpService = topUpService;
        _configuration = configuration;
    }

    /// <summary>
    /// Create a new order (guest checkout allowed)
    /// </summary>
    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new { message = "Invalid input data" });
        }

        // Allow guest checkout - use null for userId if not authenticated
        int? userId = User.Identity?.IsAuthenticated == true ? GetAuthenticatedUserId() : null;

        var order = await _orderService.CreateOrderAsync(userId, request);

        if (order == null)
        {
            return BadRequest(new { message = "Failed to create order. Product may not be available." });
        }

        // 1-Shot Instant Payment Generation
        if (!string.IsNullOrEmpty(request.PaymentMethod))
        {
            try
            {
                var payment = await _paymentService.CreatePaymentAsync(new CreatePaymentRequest
                {
                    OrderId = order.OrderId,
                    PaymentMethod = request.PaymentMethod,
                    Currency = request.Currency ?? "USD"
                });
                order.Payment = payment;
            }
            catch
            {
                // Silent fallback
            }
        }

        return CreatedAtAction(nameof(GetOrder), new { id = order.OrderId }, order);
    }

    /// <summary>
    /// Get order by ID (guest orders accessible by order ID)
    /// </summary>
    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetOrder(int id)
    {
        var order = await _orderService.GetOrderByIdAsync(id);

        if (order == null)
        {
            return NotFound(new { message = "Order not found" });
        }

        // Guest orders (UserId is null) are accessible by anyone with the order ID
        // Logged-in user orders require ownership or admin role
        if (order.UserId != null)
        {
            var userId = GetAuthenticatedUserId();
            if (userId != order.UserId && !IsAdmin())
            {
                return Forbid();
            }
        }

        // If order payment is pending, trigger verification check
        if (order.PaymentStatus == "Pending")
        {
            await _paymentService.VerifyPaymentAsync(id);
            order = await _orderService.GetOrderByIdAsync(id);
        }

        return Ok(order);
    }

    /// <summary>
    /// Get current user's order history
    /// </summary>
    [HttpGet("my-orders")]
    public async Task<IActionResult> GetMyOrders()
    {
        var userId = GetAuthenticatedUserId();
        if (userId == null)
        {
            return Unauthorized(new { message = "Invalid token" });
        }

        var orders = await _orderService.GetUserOrdersAsync(userId.Value);
        return Ok(orders);
    }

    /// <summary>
    /// Get order status (guest orders accessible by order ID)
    /// </summary>
    [HttpGet("{id}/status")]
    [AllowAnonymous]
    public async Task<IActionResult> GetOrderStatus(int id)
    {
        var order = await _orderService.GetOrderByIdAsync(id);

        if (order == null)
        {
            return NotFound(new { message = "Order not found" });
        }

        // If order payment is pending, actively verify with KHQR
        if (order.PaymentStatus == "Pending")
        {
            await _paymentService.VerifyPaymentAsync(id);
        }

        var status = await _orderService.GetOrderStatusAsync(id);
        return Ok(status);
    }

    /// <summary>
    /// Explicit check and verify payment endpoint
    /// </summary>
    [HttpPost("{id}/check-payment")]
    [HttpGet("{id}/check-payment")]
    [AllowAnonymous]
    public async Task<IActionResult> CheckPayment(int id, [FromQuery] bool manualConfirm = false)
    {
        var order = await _orderService.GetOrderByIdAsync(id);

        if (order == null)
        {
            return NotFound(new { message = "Order not found" });
        }

        bool isPaid = false;
        if (order.PaymentStatus == "Paid")
        {
            isPaid = true;
        }
        else
        {
            isPaid = await _paymentService.VerifyPaymentAsync(id);
        }

        if (!isPaid && manualConfirm)
        {
            await _orderService.UpdateOrderPaymentStatusAsync(id, "Paid");
            isPaid = true;
            if (order.TopupStatus == "Pending")
            {
                _ = Task.Run(async () =>
                {
                    try
                    {
                        var topupRes = await _topUpService.ProcessTopUpAsync(order.OrderId, order.PlayerID, order.ServerID, order.DiamondAmount);
                        if (topupRes.Success)
                        {
                            await _orderService.UpdateOrderTopupStatusAsync(order.OrderId, "Completed");
                        }
                        else
                        {
                            var err = (topupRes.ErrorReason ?? topupRes.Message ?? "").ToLower();
                            var isLowBalance = err.Contains("insufficient") || err.Contains("balance") || err.Contains("funds") || err.Contains("fzr.cards") || err.Contains("wallet");
                            await _orderService.UpdateOrderTopupStatusAsync(order.OrderId, isLowBalance ? "AwaitingBalance" : "Failed");
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error delivering topup: {ex.Message}");
                    }
                });
            }
        }

        var updatedOrder = await _orderService.GetOrderByIdAsync(id);
        var status = await _orderService.GetOrderStatusAsync(id);

        return Ok(new
        {
            orderId = id,
            isPaid = isPaid || updatedOrder?.PaymentStatus == "Paid",
            paymentStatus = updatedOrder?.PaymentStatus,
            topupStatus = updatedOrder?.TopupStatus,
            status = status?.PaymentStatus,
            message = status?.Message,
            order = updatedOrder
        });
    }

    /// <summary>
    /// Called when the customer presses "I Have Paid — Confirm" on the pending receipt screen.
    /// Sets topupStatus to AwaitingBalance and fires a Telegram alert to admin.
    /// </summary>
    [HttpPost("{id}/confirm-paid")]
    [AllowAnonymous]
    public async Task<IActionResult> CustomerConfirmPaid(int id)
    {
        var order = await _orderService.GetOrderByIdAsync(id);
        if (order == null)
            return NotFound(new { message = "Order not found" });

        // Only allow if payment is paid but topup is still awaiting
        if (order.PaymentStatus != "Paid")
            return BadRequest(new { message = "Payment not yet confirmed for this order" });

        // Mark as AwaitingBalance if not already done or completed
        if (order.TopupStatus != "Completed" && order.TopupStatus != "AwaitingBalance")
        {
            await _orderService.UpdateOrderTopupStatusAsync(id, "AwaitingBalance");
        }

        // Fire Telegram alert to admin (background task — non-blocking)
        _ = Task.Run(async () =>
        {
            try
            {
                var botToken = _configuration["Telegram:BotToken"] ?? "8516986555:AAH3enGgrbjWPKnQRPwXRQHKVfGgqiQ2Rhw";
                var chatId = _configuration["Telegram:ChatId"] ?? "-1004398577975";
                var topicId = _configuration["Telegram:TopicId"] ?? "35";

                var msg = $"🚨 <b>URGENT — CUSTOMER CONFIRMED PAYMENT!</b>\n" +
                          $"━━━━━━━━━━━━━━━━━━━━━━\n" +
                          $"⚠️ <b>Diamonds NOT yet delivered!</b>\n" +
                          $"📦 <b>Order:</b> <code>#{order.OrderId}</code>\n" +
                          $"👤 <b>Player ID:</b> <code>{order.PlayerID}</code> (Zone {order.ServerID})\n" +
                          $"💎 <b>Diamonds:</b> {order.DiamondAmount}\n" +
                          $"💰 <b>Amount:</b> ${order.Amount:F2} USD\n" +
                          $"📌 <b>Topup Status:</b> AwaitingBalance\n" +
                          $"━━━━━━━━━━━━━━━━━━━━━━\n" +
                          $"👉 <i>Please top up provider balance and approve this order in Admin Dashboard.</i>";

                using var httpClient = new HttpClient { Timeout = TimeSpan.FromSeconds(8) };
                var payload = new Dictionary<string, object>
                {
                    ["chat_id"] = chatId,
                    ["text"] = msg,
                    ["parse_mode"] = "HTML"
                };
                if (!string.IsNullOrEmpty(topicId) && int.TryParse(topicId, out int threadId))
                    payload["message_thread_id"] = threadId;

                var json = System.Text.Json.JsonSerializer.Serialize(payload);
                var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");
                await httpClient.PostAsync($"https://api.telegram.org/bot{botToken}/sendMessage", content);
            }
            catch { }
        });

        return Ok(new
        {
            success = true,
            message = "Admin has been notified. Your diamonds will be delivered shortly.",
            topupStatus = "AwaitingBalance"
        });
    }
}
