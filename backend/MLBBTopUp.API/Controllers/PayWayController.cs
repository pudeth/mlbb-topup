using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MLBBTopUp.Core.Interfaces;
using MLBBTopUp.Infrastructure.Data;
using MLBBTopUp.Infrastructure.Services;

namespace MLBBTopUp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PayWayController : BaseController
{
    private readonly IAbaPayWayService _abaPayWayService;
    private readonly IPaymentService _paymentService;
    private readonly IOrderService _orderService;
    private readonly ApplicationDbContext _context;
    private readonly ILogger<PayWayController> _logger;

    public PayWayController(
        IAbaPayWayService abaPayWayService,
        IPaymentService paymentService,
        IOrderService orderService,
        ApplicationDbContext context,
        ILogger<PayWayController> logger)
    {
        _abaPayWayService = abaPayWayService;
        _paymentService = paymentService;
        _orderService = orderService;
        _context = context;
        _logger = logger;
    }

    public class CreatePayWayRequest
    {
        public int OrderId { get; set; }
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "USD";
    }

    /// <summary>
    /// Generate dynamic ABA KHQR & Deeplink via ABA PayWay
    /// </summary>
    [HttpPost("create")]
    [AllowAnonymous]
    public async Task<IActionResult> CreatePayment([FromBody] CreatePayWayRequest request)
    {
        var order = await _context.Orders.FindAsync(request.OrderId);
        if (order == null)
        {
            return NotFound(new { message = "Order not found" });
        }

        decimal finalAmount = request.Amount > 0 ? request.Amount : order.Amount;
        var result = await _abaPayWayService.CreatePaymentAsync(request.OrderId, finalAmount, request.Currency);

        if (!result.Success)
        {
            return BadRequest(new { message = result.ErrorMessage ?? "Failed to initialize ABA PayWay transaction" });
        }

        // Link payment to order
        var existingPayment = await _context.Payments.FirstOrDefaultAsync(p => p.OrderId == request.OrderId);
        if (existingPayment != null)
        {
            existingPayment.PaymentMethod = "abapayway";
            existingPayment.TransactionID = result.TranId ?? existingPayment.TransactionID;
            existingPayment.KHQRMd5Hash = result.Md5Hash ?? existingPayment.KHQRMd5Hash;
            existingPayment.KHQRQRCode = result.QrString ?? existingPayment.KHQRQRCode;
            existingPayment.KHQRDeeplink = result.AbapayDeeplink ?? existingPayment.KHQRDeeplink;
            await _context.SaveChangesAsync();
        }

        return Ok(new
        {
            success = true,
            gateway = "aba_payway",
            orderId = request.OrderId,
            tranId = result.TranId,
            qrString = result.QrString,
            qrImage = result.QrImage,
            abapayDeeplink = result.AbapayDeeplink,
            md5 = result.Md5Hash,
            amount = finalAmount,
            currency = request.Currency
        });
    }

    /// <summary>
    /// Check transaction status with ABA PayWay (up to 600 req/sec)
    /// </summary>
    [HttpGet("status/{tranId}")]
    [AllowAnonymous]
    public async Task<IActionResult> CheckStatus(string tranId, [FromQuery] int? orderId)
    {
        var result = await _abaPayWayService.CheckTransactionAsync(tranId);

        if (result.IsPaid && orderId.HasValue)
        {
            await _paymentService.VerifyPaymentAsync(orderId.Value);
        }

        return Ok(result);
    }

    /// <summary>
    /// ABA PayWay instant webhook pushback callback endpoint
    /// </summary>
    [HttpPost("callback")]
    [HttpGet("callback")]
    [AllowAnonymous]
    public async Task<IActionResult> Callback([FromForm] IFormCollection form)
    {
        try
        {
            var tranId = form["tran_id"].ToString();
            var status = form["status"].ToString();

            _logger.LogInformation("ABA PayWay Webhook callback received for TranId: {TranId}, Status: {Status}", tranId, status);

            if (status == "0" || status == "00" || status.Equals("APPROVED", StringComparison.OrdinalIgnoreCase))
            {
                var payment = await _context.Payments.FirstOrDefaultAsync(p => p.TransactionID == tranId);
                if (payment != null)
                {
                    await _paymentService.VerifyPaymentAsync(payment.OrderId);
                }
            }

            return Ok(new { status = 0, description = "Success" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing ABA PayWay callback");
            return Ok(new { status = 0, description = "Error logged" });
        }
    }
}
