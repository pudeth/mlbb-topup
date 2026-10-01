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
    private readonly Microsoft.Extensions.Configuration.IConfiguration _configuration;
    private readonly IPaymentService _paymentService;
    private readonly IOrderService _orderService;
    private readonly ApplicationDbContext _context;
    private readonly ILogger<PayWayController> _logger;
    private readonly IServiceScopeFactory _serviceScopeFactory;

    public PayWayController(
        IAbaPayWayService abaPayWayService,
        IPaymentService paymentService,
        IOrderService orderService,
        ApplicationDbContext context,
        ILogger<PayWayController> logger,
        Microsoft.Extensions.Configuration.IConfiguration configuration,
        IServiceScopeFactory serviceScopeFactory)
    {
        _abaPayWayService = abaPayWayService;
        _paymentService = paymentService;
        _orderService = orderService;
        _context = context;
        _logger = logger;
        _configuration = configuration;
        _serviceScopeFactory = serviceScopeFactory;
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

        // Start background verification poller using the official Check Transaction API (per outline)
        _ = Task.Run(async () =>
        {
            var curTranId = result.TranId;
            var ordId = request.OrderId;
            if (string.IsNullOrEmpty(curTranId)) return;

            // Wait 3 seconds before starting checks (matching ABA PayWay guidelines)
            await Task.Delay(3000);

            // Poll every 3 seconds for up to 6 minutes (120 iterations)
            for (int i = 0; i < 120; i++)
            {
                try
                {
                    using var scope = _serviceScopeFactory.CreateScope();
                    var scopedContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                    var pay = await scopedContext.Payments.FirstOrDefaultAsync(p => p.OrderId == ordId);
                    if (pay != null && pay.Status == "Completed")
                    {
                        break;
                    }

                    var payWayService = scope.ServiceProvider.GetRequiredService<IAbaPayWayService>();
                    var checkRes = await payWayService.CheckTransactionAsync(curTranId);
                    if (checkRes.IsPaid)
                    {
                        var scopedPayService = scope.ServiceProvider.GetRequiredService<IPaymentService>();
                        await scopedPayService.VerifyPaymentAsync(ordId);
                        break;
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"[ABA PayWay Background Poller] tran_id {curTranId} notice: {ex.Message}");
                }

                await Task.Delay(3000);
            }
        });

        return Ok(new
        {
            success = true,
            gateway = "aba_payway",
            orderId = request.OrderId,
            tranId = result.TranId,
            qrString = result.QrString,
            qrImage = result.QrImage,
            abapayDeeplink = result.AbapayDeeplink,
            checkoutUrl = result.CheckoutUrl,
            purchaseUrl = result.PurchaseUrl,
            hash = result.Hash,
            formData = result.FormData,
            md5 = result.Md5Hash,
            amount = finalAmount,
            currency = request.Currency
        });
    }

    /// <summary>
    /// Official ABA PayWay Check Transaction API
    /// </summary>
    [HttpPost("check-transaction")]
    [HttpGet("check-transaction")]
    [HttpPost("check-transaction/{tranId}")]
    [HttpGet("check-transaction/{tranId}")]
    [HttpGet("status/{tranId}")]
    [AllowAnonymous]
    public async Task<IActionResult> CheckStatus(string? tranId, [FromQuery] int? orderId)
    {
        if (string.IsNullOrEmpty(tranId))
        {
            tranId = Request.Query["tran_id"].ToString();
            if (string.IsNullOrEmpty(tranId)) tranId = Request.Query["tranId"].ToString();
        }

        if (string.IsNullOrEmpty(tranId) && Request.HasFormContentType)
        {
            var form = await Request.ReadFormAsync();
            tranId = form["tran_id"].ToString();
        }

        if (string.IsNullOrEmpty(tranId) && Request.Body != null)
        {
            try
            {
                using var reader = new System.IO.StreamReader(Request.Body);
                var raw = await reader.ReadToEndAsync();
                if (!string.IsNullOrWhiteSpace(raw))
                {
                    using var doc = System.Text.Json.JsonDocument.Parse(raw);
                    if (doc.RootElement.TryGetProperty("tran_id", out var tid)) tranId = tid.GetString();
                    if (string.IsNullOrEmpty(tranId) && doc.RootElement.TryGetProperty("tranId", out var tid2)) tranId = tid2.GetString();
                }
            }
            catch { }
        }

        if (string.IsNullOrEmpty(tranId))
        {
            return BadRequest(new { message = "tran_id is required" });
        }

        var result = await _abaPayWayService.CheckTransactionAsync(tranId);

        if (result.IsPaid)
        {
            var payment = await _context.Payments.FirstOrDefaultAsync(p => p.TransactionID == tranId);
            if (payment != null)
            {
                await _paymentService.VerifyPaymentAsync(payment.OrderId);
            }
            else if (orderId.HasValue)
            {
                await _paymentService.VerifyPaymentAsync(orderId.Value);
            }
        }

        return Ok(result);
    }

    /// <summary>
    /// ABA PayWay instant webhook pushback callback endpoint
    /// Accepts HTTP POST/GET via HTTPS port 443 with JSON, Form, or Raw data
    /// Updates transaction status to Completed / Success and returns confirmation
    /// </summary>
    [HttpPost("callback")]
    [HttpGet("callback")]
    [AllowAnonymous]
    public async Task<IActionResult> Callback()
    {
        try
        {
            string tranId = string.Empty;
            string status = string.Empty;
            string rawBody = string.Empty;

            // 1. Try reading Form Collection if available
            if (Request.HasFormContentType)
            {
                var form = await Request.ReadFormAsync();
                tranId = form["tran_id"].ToString();
                status = form["status"].ToString();
                if (string.IsNullOrEmpty(status)) status = form["response"].ToString();
            }

            // 2. Try reading JSON or Raw Body
            if (string.IsNullOrEmpty(tranId) && Request.Body != null)
            {
                using var reader = new System.IO.StreamReader(Request.Body);
                rawBody = await reader.ReadToEndAsync();
                if (!string.IsNullOrWhiteSpace(rawBody))
                {
                    try
                    {
                        using var doc = System.Text.Json.JsonDocument.Parse(rawBody);
                        var root = doc.RootElement;
                        if (root.TryGetProperty("tran_id", out var tid)) tranId = tid.GetString() ?? "";
                        if (string.IsNullOrEmpty(tranId) && root.TryGetProperty("tranId", out var tid2)) tranId = tid2.GetString() ?? "";
                        if (root.TryGetProperty("status", out var st)) status = st.ToString();
                        if (string.IsNullOrEmpty(status) && root.TryGetProperty("response", out var resp)) status = resp.ToString();
                    }
                    catch { }
                }
            }

            // 3. Fallback to Query Parameters
            if (string.IsNullOrEmpty(tranId))
            {
                tranId = Request.Query["tran_id"].ToString();
                if (string.IsNullOrEmpty(tranId)) tranId = Request.Query["tranId"].ToString();
                if (string.IsNullOrEmpty(status)) status = Request.Query["status"].ToString();
            }

            _logger.LogInformation("ABA PayWay pushback callback received for TranId: {TranId}, Status: {Status}", tranId, status);

            if (!string.IsNullOrEmpty(tranId))
            {
                var payment = await _context.Payments.FirstOrDefaultAsync(p => p.TransactionID == tranId);
                if (payment != null)
                {
                    // Confirm transaction in database as Completed / Success
                    payment.Status = "Completed";
                    payment.PaidAt = DateTime.UtcNow;
                    await _orderService.UpdateOrderPaymentStatusAsync(payment.OrderId, "Paid");
                    await _orderService.UpdateOrderTopupStatusAsync(payment.OrderId, "Completed");
                    await _context.SaveChangesAsync();

                    // Verify payment & trigger auto delivery
                    await _paymentService.VerifyPaymentAsync(payment.OrderId);
                    _logger.LogInformation("Payment for Order #{OrderId} (TranId: {TranId}) confirmed and updated to Completed / Paid!", payment.OrderId, tranId);
                }
            }

            // Check if request is from a browser navigating directly
            var acceptHeader = Request.Headers.Accept.ToString();
            if (!string.IsNullOrEmpty(acceptHeader) && acceptHeader.Contains("text/html"))
            {
                var frontendUrl = _configuration?["FrontendUrl"] ?? "https://mlbb-topup-jet.vercel.app";
                return Redirect($"{frontendUrl.TrimEnd('/')}/topup?status=Completed&tran_id={Uri.EscapeDataString(tranId)}");
            }

            // Server-to-server pushback JSON response confirming Completed / Success
            return Ok(new
            {
                status = 0,
                tran_id = tranId,
                payment_status = "Completed",
                order_status = "Completed",
                description = "Success",
                message = "Transaction confirmed as Completed / Success"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing ABA PayWay callback");
            return Ok(new { status = 0, description = "Success", message = "Callback processed" });
        }
    }

    /// <summary>
    /// Get detailed information about a past transaction
    /// </summary>
    [HttpGet("details/{tranId}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetDetails(string tranId)
    {
        var details = await _abaPayWayService.GetTransactionDetailsAsync(tranId);
        return Content(details, "application/json");
    }

    /// <summary>
    /// Close/Cancel a transaction
    /// </summary>
    [HttpPost("close/{tranId}")]
    [AllowAnonymous]
    public async Task<IActionResult> CloseTransaction(string tranId)
    {
        var details = await _abaPayWayService.CloseTransactionAsync(tranId);
        return Content(details, "application/json");
    }

    /// <summary>
    /// Get list of transactions
    /// </summary>
    [HttpGet("list")]
    [AllowAnonymous]
    public async Task<IActionResult> GetTransactionList(
        [FromQuery] string fromDate = "",
        [FromQuery] string toDate = "",
        [FromQuery] string fromAmount = "",
        [FromQuery] string toAmount = "",
        [FromQuery] string status = "",
        [FromQuery] string page = "1",
        [FromQuery] string pagination = "40")
    {
        var details = await _abaPayWayService.GetTransactionListAsync(fromDate, toDate, fromAmount, toAmount, status, page, pagination);
        return Content(details, "application/json");
    }

    /// <summary>
    /// Get exchange rate from ABA PayWay
    /// </summary>
    [HttpGet("exchange-rate")]
    [AllowAnonymous]
    public async Task<IActionResult> GetExchangeRate()
    {
        var details = await _abaPayWayService.GetExchangeRateAsync();
        return Content(details, "application/json");
    }

    /// <summary>
    /// Execute a Credentials on File (CoF) automatic payment
    /// </summary>
    [HttpPost("cof-purchase")]
    [AllowAnonymous]
    public async Task<IActionResult> CofPurchase([FromBody] System.Text.Json.JsonElement payload)
    {
        string token = payload.GetProperty("token").GetString();
        int orderId = payload.GetProperty("orderId").GetInt32();
        decimal amount = payload.GetProperty("amount").GetDecimal();
        string ctid = payload.GetProperty("ctid").GetString();
        string tokenFlag = payload.TryGetProperty("tokenFlag", out var tf) ? tf.GetString() : "CITU_FLEX"; // Defaults to Unscheduled Customer Initiated
        
        var details = await _abaPayWayService.CreateTokenPaymentAsync(token, orderId, amount, ctid, tokenFlag);
        return Content(details, "application/json");
    }

    /// <summary>
    /// ABA PayWay Webhook Callback (Pushback Notification)
    /// Handles both CoF Account Linking and Transaction Status updates
    /// </summary>
    [HttpPost("webhook")]
    [AllowAnonymous]
    public async Task<IActionResult> Webhook()
    {
        using var reader = new System.IO.StreamReader(Request.Body);
        var body = await reader.ReadToEndAsync();
        
        if (string.IsNullOrEmpty(body))
            return BadRequest("Empty body");

        // 1. Get Signature from Header
        if (!Request.Headers.TryGetValue("X-PAYWAY-HMAC-SHA512", out var receivedSignature))
        {
            return Unauthorized("Missing signature");
        }

        // 2. Parse JSON to Dictionary to sort keys
        var jsonDict = System.Text.Json.JsonSerializer.Deserialize<System.Collections.Generic.SortedDictionary<string, object>>(body);
        if (jsonDict == null)
            return BadRequest("Invalid JSON");

        // 3. Concatenate all values
        var b4hash = new System.Text.StringBuilder();
        foreach (var kvp in jsonDict)
        {
            if (kvp.Value is System.Text.Json.JsonElement element)
            {
                if (element.ValueKind == System.Text.Json.JsonValueKind.Object || element.ValueKind == System.Text.Json.JsonValueKind.Array)
                {
                    b4hash.Append(element.GetRawText());
                }
                else
                {
                    b4hash.Append(element.ToString());
                }
            }
            else
            {
                b4hash.Append(kvp.Value?.ToString());
            }
        }

        // 4. Generate HMAC-SHA512 signature
        var apiKey = _configuration["AbaPayWay:ApiKey"] ?? string.Empty;
        var computedSignature = "";
        using (var hmac = new System.Security.Cryptography.HMACSHA512(System.Text.Encoding.UTF8.GetBytes(apiKey)))
        {
            var hashBytes = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(b4hash.ToString()));
            computedSignature = Convert.ToBase64String(hashBytes);
        }

        // 5. Compare signatures
        if (computedSignature != receivedSignature.ToString())
        {
            _logger.LogWarning("Invalid webhook signature. Received: {Received}, Computed: {Computed}", receivedSignature, computedSignature);
            return Unauthorized("Invalid signature");
        }

        // --- Process the valid notification ---
        using var doc = System.Text.Json.JsonDocument.Parse(body);
        var root = doc.RootElement;

        // Check if it's a Credentials on File (CoF) linking notification
        if (root.TryGetProperty("payment_credential", out var credentialProp))
        {
            var pwt = credentialProp.TryGetProperty("pwt", out var pwtProp) ? pwtProp.GetString() : null;
            var source = credentialProp.TryGetProperty("source_of_fund", out var srcProp) ? srcProp.GetString() : null;
            var status = credentialProp.TryGetProperty("status", out var statProp) ? statProp.GetInt32() : 0;
            
            _logger.LogInformation("CoF Linked! Token: {Pwt}, Source: {Source}, Status: {Status}", pwt, source, status);
            // TODO: Save token to database for future one-click checkout
        }
        // Check if it's a standard Purchase notification
        else if (root.TryGetProperty("tran_id", out var tranIdProp))
        {
            var tranId = tranIdProp.GetString();
            var status = root.TryGetProperty("status", out var statusProp) ? statusProp.GetInt32() : -1;
            
            _logger.LogInformation("Payment Update! TranId: {TranId}, Status: {Status}", tranId, status);
            // TODO: Update database order status
        }

        return Ok(new { message = "Success" });
    }


    /// <summary>
    /// Initiate a Scheduled Subscription
    /// </summary>
    [HttpPost("subscribe")]
    [AllowAnonymous]
    public async Task<IActionResult> Subscribe([FromBody] System.Text.Json.JsonElement payload)
    {
        int orderId = payload.GetProperty("orderId").GetInt32();
        decimal amount = payload.GetProperty("amount").GetDecimal();
        string ctid = payload.GetProperty("ctid").GetString(); // Custom User ID
        string frequency = payload.TryGetProperty("frequency", out var f) ? f.GetString() : "1M"; // Default to Monthly
        
        var details = await _abaPayWayService.CreateSubscriptionPaymentAsync(orderId, amount, ctid, frequency);
        return Content(System.Text.Json.JsonSerializer.Serialize(details), "application/json");
    }

    /// <summary>
    /// Initiate a Link Account request for Credentials on File (CoF)
    /// </summary>
    [HttpPost("link-account")]
    [AllowAnonymous]
    public async Task<IActionResult> LinkAccount([FromBody] System.Text.Json.JsonElement payload)
    {
        string ctid = payload.GetProperty("ctid").GetString(); // Custom User ID
        var details = await _abaPayWayService.LinkAccountAsync(ctid);
        return Content(details, "application/json");
    }

    /// <summary>
    /// Initiate a Link Card request for Credentials on File (CoF)
    /// </summary>
    [HttpPost("link-card")]
    [AllowAnonymous]
    public async Task<IActionResult> LinkCard([FromBody] System.Text.Json.JsonElement payload)
    {
        string ctid = payload.GetProperty("ctid").GetString(); // Custom User ID
        var details = await _abaPayWayService.LinkCardAsync(ctid);
        return Content(System.Text.Json.JsonSerializer.Serialize(details), "application/json");
    }

    /// <summary>
    /// Renew an expired Credentials on File token
    /// </summary>
    [HttpPost("renew-token")]
    [AllowAnonymous]
    public async Task<IActionResult> RenewToken([FromBody] System.Text.Json.JsonElement payload)
    {
        string ctid = payload.GetProperty("ctid").GetString(); 
        string pwt = payload.GetProperty("pwt").GetString(); 
        var details = await _abaPayWayService.RenewTokenAsync(ctid, pwt);
        return Content(details, "application/json");
    }

    /// <summary>
    /// Retrieve CoF Token Details manually if webhook fails
    /// </summary>
    [HttpGet("token-details/{requestId}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetTokenDetails(string requestId)
    {
        var details = await _abaPayWayService.GetTokenDetailsAsync(requestId);
        return Content(details, "application/json");
    }

    /// <summary>
    /// Remove a Credentials on File token
    /// </summary>
    [HttpPost("remove-token")]
    [AllowAnonymous]
    public async Task<IActionResult> RemoveToken([FromBody] System.Text.Json.JsonElement payload)
    {
        string ctid = payload.GetProperty("ctid").GetString(); 
        string pwt = payload.GetProperty("pwt").GetString(); 
        var details = await _abaPayWayService.RemoveTokenAsync(ctid, pwt);
        return Content(details, "application/json");
    }

    /// <summary>
    /// Dedicated API to generate ABA KHQR JSON response
    /// </summary>
    [HttpPost("generate-qr")]
    [AllowAnonymous]
    public async Task<IActionResult> GenerateQr([FromBody] System.Text.Json.JsonElement payload)
    {
        int orderId = payload.GetProperty("orderId").GetInt32(); 
        decimal amount = payload.GetProperty("amount").GetDecimal(); 
        var details = await _abaPayWayService.GenerateQrAsync(orderId, amount);
        return Content(details, "application/json");
    }

    /// <summary>
    /// Create a manual Payment Link via API
    /// </summary>
    [HttpPost("create-payment-link")]
    [AllowAnonymous]
    public async Task<IActionResult> CreatePaymentLink([FromBody] System.Text.Json.JsonElement payload)
    {
        string title = payload.TryGetProperty("title", out var ti) ? ti.GetString() : "MLBB Diamonds";
        decimal amount = payload.GetProperty("amount").GetDecimal();
        string returnUrl = "https://yourdomain.com/api/PayWay/webhook";
        string merchantRefNo = Guid.NewGuid().ToString("N").Substring(0, 20);
        
        var details = await _abaPayWayService.CreatePaymentLinkAsync(title, amount, returnUrl, merchantRefNo);
        return Content(details, "application/json");
    }

    /// <summary>
    /// Retrieve details of an existing Payment Link
    /// </summary>
    [HttpGet("payment-link/{linkId}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetPaymentLinkDetails(string linkId)
    {
        // Because linkId usually contains Base64 padding like '==' which gets stripped or URL encoded in path params,
        // we might need to decode it first, but we will pass it as is for now.
        // It's safer to use WebUtility.UrlDecode(linkId) if it was encoded by the client.
        var decodedLinkId = System.Net.WebUtility.UrlDecode(linkId);
        var details = await _abaPayWayService.GetPaymentLinkDetailsAsync(decodedLinkId);
        return Content(details, "application/json");
    }

    /// <summary>
    /// Capture/Complete a Pre-Authorized Transaction
    /// </summary>
    [HttpPost("complete-pre-auth")]
    [AllowAnonymous]
    public async Task<IActionResult> CompletePreAuth([FromBody] System.Text.Json.JsonElement payload)
    {
        string tranId = payload.GetProperty("tranId").GetString();
        decimal completeAmount = payload.GetProperty("completeAmount").GetDecimal();
        
        // Optional payout object (e.g. splitting funds across multiple ABA accounts)
        object payout = null;
        if (((System.Text.Json.JsonElement)payload).TryGetProperty("payout", out var payoutElement))
        {
            payout = System.Text.Json.JsonSerializer.Deserialize<object>(payoutElement.GetRawText());
        }

        var details = await _abaPayWayService.CompletePreAuthAsync(tranId, completeAmount, payout);
        return Content(details, "application/json");
    }

    /// <summary>
    /// Cancel/Release a Pre-Authorized Transaction
    /// </summary>
    [HttpPost("cancel-pre-auth")]
    [AllowAnonymous]
    public async Task<IActionResult> CancelPreAuth([FromBody] System.Text.Json.JsonElement payload)
    {
        string tranId = payload.GetProperty("tranId").GetString();
        var details = await _abaPayWayService.CancelPreAuthAsync(tranId);
        return Content(details, "application/json");
    }

    /// <summary>
    /// Distribute funds from merchant settlement account directly to recipients
    /// </summary>
    [HttpPost("payout")]
    [AllowAnonymous]
    public async Task<IActionResult> Payout([FromBody] System.Text.Json.JsonElement payload)
    {
        string tranId = payload.GetProperty("tranId").GetString();
        decimal totalAmount = payload.GetProperty("totalAmount").GetDecimal();
        
        object beneficiaries = null;
        if (((System.Text.Json.JsonElement)payload).TryGetProperty("beneficiaries", out var benElement))
        {
            beneficiaries = System.Text.Json.JsonSerializer.Deserialize<object>(benElement.GetRawText());
        }

        var details = await _abaPayWayService.PayoutAsync(tranId, totalAmount, beneficiaries);
        return Content(details, "application/json");
    }

    /// <summary>
    /// Update/Toggle Whitelist Beneficiary Status
    /// </summary>
    [HttpPost("update-beneficiary")]
    [AllowAnonymous]
    public async Task<IActionResult> UpdateBeneficiary([FromBody] System.Text.Json.JsonElement payload)
    {
        string payee = payload.GetProperty("payee").GetString();
        int status = payload.GetProperty("status").GetInt32(); // 1 = Active, 0 = Inactive
        var details = await _abaPayWayService.UpdateBeneficiaryStatusAsync(payee, status);
        return Content(details, "application/json");
    }

    /// <summary>
    /// Add a new beneficiary to the Payout Whitelist
    /// </summary>
    [HttpPost("add-beneficiary")]
    [AllowAnonymous]
    public async Task<IActionResult> AddBeneficiary([FromBody] System.Text.Json.JsonElement payload)
    {
        string payee = payload.GetProperty("payee").GetString();
        var details = await _abaPayWayService.AddBeneficiaryAsync(payee);
        return Content(details, "application/json");
    }

    /// <summary>
    /// Retrieve up to 50 transactions using a Merchant Reference Number (e.g. Invoice ID)
    /// </summary>
    [HttpGet("transactions-by-ref/{merchantRef}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetTransactionsByRef(string merchantRef)
    {
        var details = await _abaPayWayService.GetTransactionsByMerchantRefAsync(merchantRef);
        return Content(details, "application/json");
    }
}



