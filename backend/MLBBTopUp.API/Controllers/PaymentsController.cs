using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MLBBTopUp.Core.DTOs;
using MLBBTopUp.Core.Interfaces;

namespace MLBBTopUp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentsController : BaseController
{
    private readonly IPaymentService _paymentService;
    private readonly IOrderService _orderService;

    public PaymentsController(IPaymentService paymentService, IOrderService orderService)
    {
        _paymentService = paymentService;
        _orderService = orderService;
    }

    /// <summary>
    /// Create payment for an order (guest checkout allowed)
    /// </summary>
    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> CreatePayment([FromBody] CreatePaymentRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new { message = "Invalid input data" });
        }

        // Verify order exists
        var order = await _orderService.GetOrderByIdAsync(request.OrderId);
        if (order == null)
        {
            return NotFound(new { message = "Order not found" });
        }

        // Only enforce ownership check for authenticated user orders
        if (order.UserId != null)
        {
            var userId = GetAuthenticatedUserId();
            if (userId != order.UserId && !IsAdmin())
            {
                return Forbid();
            }
        }

        var payment = await _paymentService.CreatePaymentAsync(request);

        if (payment == null)
        {
            return BadRequest(new { message = "Failed to create payment" });
        }

        return Ok(payment);
    }

    /// <summary>
    /// Get payment details by order ID (guest orders accessible)
    /// </summary>
    [HttpGet("order/{orderId}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetPaymentByOrderId(int orderId)
    {
        // Verify order exists
        var order = await _orderService.GetOrderByIdAsync(orderId);
        if (order == null)
        {
            return NotFound(new { message = "Order not found" });
        }

        // Only enforce ownership check for authenticated user orders
        if (order.UserId != null)
        {
            var userId = GetAuthenticatedUserId();
            if (userId != order.UserId && !IsAdmin())
            {
                return Forbid();
            }
        }

        var payment = await _paymentService.GetPaymentByOrderIdAsync(orderId);

        if (payment == null)
        {
            return NotFound(new { message = "Payment not found" });
        }

        return Ok(payment);
    }

    /// <summary>
    /// Webhook endpoint for payment gateway callbacks
    /// </summary>
    [HttpPost("webhook")]
    [AllowAnonymous]
    public async Task<IActionResult> PaymentWebhook([FromBody] PaymentWebhookRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new { message = "Invalid webhook data" });
        }

        var result = await _paymentService.ProcessPaymentWebhookAsync(request);

        if (!result)
        {
            return BadRequest(new { message = "Failed to process webhook" });
        }

        return Ok(new { message = "Webhook processed successfully" });
    }
}
