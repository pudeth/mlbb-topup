using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MLBBTopUp.Core.Interfaces;
using MLBBTopUp.Infrastructure.Data;
using MLBBTopUp.Infrastructure.Services;

namespace MLBBTopUp.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class KHQRController : BaseController
{
    private readonly IKHQRService _khqrService;
    private readonly ApplicationDbContext _context;
    private readonly IPaymentService _paymentService;

    public KHQRController(
        IKHQRService khqrService,
        ApplicationDbContext context,
        IPaymentService paymentService)
    {
        _khqrService = khqrService;
        _context = context;
        _paymentService = paymentService;
    }

    /// <summary>
    /// Get QR code image
    /// </summary>
    [HttpGet("qr/{md5Hash}")]
    [AllowAnonymous]
    public IActionResult GetQRImage(string md5Hash)
    {
        var imageUrl = _khqrService.GetQRImageUrl(md5Hash);
        
        // Proxy the request to KHQR API
        return Redirect(imageUrl);
    }

    /// <summary>
    /// Check KHQR payment status
    /// </summary>
    [HttpGet("status/{md5Hash}")]
    [AllowAnonymous]
    public async Task<IActionResult> CheckStatus(string md5Hash)
    {
        var result = await _khqrService.CheckPaymentStatusAsync(md5Hash);

        // If paid, trigger payment verification and auto top-up
        if (result.Status == "PAID")
        {
            var payment = await _context.Payments.FirstOrDefaultAsync(p => p.KHQRMd5Hash == md5Hash);
            if (payment != null && payment.Status != "Completed")
            {
                await _paymentService.VerifyPaymentAsync(payment.OrderId);
            }
        }
        
        return Ok(result);
    }
}
