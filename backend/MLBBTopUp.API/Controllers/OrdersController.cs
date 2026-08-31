using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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

    public OrdersController(
        IOrderService orderService,
        IPaymentService paymentService,
        ITopUpService topUpService)
    {
        _orderService = orderService;
        _paymentService = paymentService;
        _topUpService = topUpService;
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

            // If customer confirmed transfer or manualConfirm is true
            if (!isPaid && manualConfirm)
            {
                await _orderService.UpdateOrderPaymentStatusAsync(id, "Paid");
                isPaid = true;

                // Auto-trigger top-up
                if (order.TopupStatus == "Pending")
                {
                    try
                    {
                        await _topUpService.ProcessTopUpAsync(
                            order.OrderId,
                            order.PlayerID,
                            order.ServerID,
                            order.DiamondAmount
                        );
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error processing topup for order {id}: {ex.Message}");
                    }
                }
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
}
