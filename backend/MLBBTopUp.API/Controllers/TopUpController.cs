using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MLBBTopUp.Core.Interfaces;

namespace MLBBTopUp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TopUpController : BaseController
{
    private readonly ITopUpService _topUpService;
    private readonly IOrderService _orderService;
    private readonly ILogger<TopUpController> _logger;

    public TopUpController(
        ITopUpService topUpService,
        IOrderService orderService,
        ILogger<TopUpController> logger)
    {
        _topUpService = topUpService;
        _orderService = orderService;
        _logger = logger;
    }

    /// <summary>
    /// Check and verify MLBB player ID and server ID, returning the in-game account username
    /// </summary>
    [HttpGet("check-account")]
    [AllowAnonymous]
    public async Task<IActionResult> CheckAccount([FromQuery] string playerId, [FromQuery] string? serverId = null)
    {
        if (string.IsNullOrWhiteSpace(playerId))
        {
            return BadRequest(new { valid = false, message = "Player ID is required" });
        }

        var result = await _topUpService.CheckAccountAsync(playerId, serverId ?? string.Empty);
        return Ok(result);
    }

    /// <summary>
    /// POST /api/player/validate endpoint (Standard Reseller Specification)
    /// </summary>
    [HttpPost("check-account")]
    [HttpPost("validate")]
    [HttpPost("/api/player/validate")]
    [AllowAnonymous]
    public async Task<IActionResult> ValidatePlayerPost([FromBody] ValidatePlayerRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.PlayerId) && string.IsNullOrWhiteSpace(request.UserId))
        {
            return BadRequest(new { valid = false, message = "Player ID is required" });
        }

        var pId = !string.IsNullOrWhiteSpace(request.PlayerId) ? request.PlayerId : request.UserId;
        var sId = !string.IsNullOrWhiteSpace(request.ServerId) ? request.ServerId : request.ZoneId;

        var result = await _topUpService.CheckAccountAsync(pId ?? string.Empty, sId ?? string.Empty);
        return Ok(result);
    }

    /// <summary>
    /// POST /api/supplier/webhook callback handler for Khmer TopUp and Supplier fulfillment networks
    /// </summary>
    [HttpPost("webhook")]
    [HttpPost("supplier-webhook")]
    [HttpPost("/api/supplier/webhook")]
    [AllowAnonymous]
    public async Task<IActionResult> SupplierWebhookCallback([FromBody] SupplierWebhookPayload payload)
    {
        _logger.LogInformation("Received Supplier Webhook Callback: {@Payload}", payload);

        if (payload == null || string.IsNullOrWhiteSpace(payload.OrderId))
        {
            return BadRequest(new { success = false, message = "Invalid webhook payload" });
        }

        if (int.TryParse(payload.OrderId, out int parsedOrderId))
        {
            var isSuccess = payload.Status?.Equals("success", StringComparison.OrdinalIgnoreCase) == true ||
                            payload.Status?.Equals("completed", StringComparison.OrdinalIgnoreCase) == true;

            var newStatus = isSuccess ? "Completed" : "Failed";
            await _orderService.UpdateOrderTopupStatusAsync(parsedOrderId, newStatus);

            return Ok(new
            {
                success = true,
                message = $"Order #{parsedOrderId} topup status updated to {newStatus}",
                orderId = parsedOrderId,
                supplierOrderId = payload.SupplierOrderId ?? payload.TransactionId
            });
        }

        return Ok(new { success = true, message = "Webhook received" });
    }
}

public class ValidatePlayerRequest
{
    public string? PlayerId { get; set; }
    public string? UserId { get; set; }
    public string? ServerId { get; set; }
    public string? ZoneId { get; set; }
}

public class SupplierWebhookPayload
{
    public string? OrderId { get; set; }
    public string? SupplierOrderId { get; set; }
    public string? TransactionId { get; set; }
    public string? Status { get; set; }
    public string? Sign { get; set; }
    public string? Message { get; set; }
}
