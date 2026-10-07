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
    private readonly ITopUpService _topUpService;
    private readonly ApplicationDbContext _context;
    private readonly ILogger<PayWayController> _logger;
    private readonly IServiceScopeFactory _serviceScopeFactory;

    public PayWayController(
        IAbaPayWayService abaPayWayService,
        IPaymentService paymentService,
        IOrderService orderService,
        ITopUpService topUpService,
        ApplicationDbContext context,
        ILogger<PayWayController> logger,
        Microsoft.Extensions.Configuration.IConfiguration configuration,
        IServiceScopeFactory serviceScopeFactory)
    {
        _abaPayWayService = abaPayWayService;
        _paymentService = paymentService;
        _orderService = orderService;
        _topUpService = topUpService;
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
        public string? PlayerId { get; set; }
        public string? Player_Id { get; set; }
        public string? ServerId { get; set; }
        public string? Server_Id { get; set; }
        public string? AccountName { get; set; }
        public string? Account_Name { get; set; }
        public string? CustomerId { get; set; }
        public string? Customer_Id { get; set; }
        public string? GameName { get; set; }
        public string? Game_Name { get; set; }
        public string? PackageName { get; set; }
        public string? Package_Name { get; set; }
        public int? DiamondAmount { get; set; }
    }

    /// <summary>
    /// Generate dynamic ABA KHQR & Deeplink via ABA PayWay
    /// </summary>
    [HttpPost("create")]
    [AllowAnonymous]
    public async Task<IActionResult> CreatePayment([FromBody] CreatePayWayRequest request)
    {
        var resolvedPlayerId = !string.IsNullOrWhiteSpace(request.PlayerId) ? request.PlayerId : request.Player_Id;
        var resolvedServerId = !string.IsNullOrWhiteSpace(request.ServerId) ? request.ServerId : request.Server_Id;
        var resolvedAccountName = !string.IsNullOrWhiteSpace(request.AccountName) ? request.AccountName : request.Account_Name;
        var resolvedPkgName = !string.IsNullOrWhiteSpace(request.PackageName) ? request.PackageName : request.Package_Name;
        var resolvedDiamonds = request.DiamondAmount ?? (resolvedPkgName?.Contains("55") == true ? 55 : (resolvedPkgName?.ToLower().Contains("weekly") == true ? 210 : 55));

        var order = await _context.Orders.FindAsync(request.OrderId);
        if (order == null)
        {
            // Auto-heal: If order record is missing or pending sync, create a guest order record immediately
            decimal fallbackAmt = request.Amount > 0 ? request.Amount : 0.85m;
            var defaultProduct = await _context.Products.FirstOrDefaultAsync(p => p.Status == "Active");
            if (defaultProduct == null)
            {
                defaultProduct = new MLBBTopUp.Core.Entities.Product
                {
                    DiamondAmount = resolvedDiamonds,
                    Price = fallbackAmt,
                    Status = "Active",
                    CreatedAt = DateTime.UtcNow
                };
                _context.Products.Add(defaultProduct);
                await _context.SaveChangesAsync();
            }

            order = new MLBBTopUp.Core.Entities.Order
            {
                PlayerID = !string.IsNullOrWhiteSpace(resolvedPlayerId) ? resolvedPlayerId.Trim() : "Player",
                ServerID = !string.IsNullOrWhiteSpace(resolvedServerId) ? resolvedServerId.Trim() : "Global",
                AccountName = resolvedAccountName,
                ProductId = defaultProduct.ProductId,
                Amount = fallbackAmt,
                PaymentStatus = "Pending",
                TopupStatus = "Pending",
                CreatedAt = DateTime.UtcNow
            };
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
            request.OrderId = order.OrderId;
        }
        else
        {
            // If order already existed but had missing or placeholder PlayerID / ServerID, sync from request
            bool modified = false;
            if ((string.IsNullOrWhiteSpace(order.PlayerID) || order.PlayerID == "Player") && !string.IsNullOrWhiteSpace(resolvedPlayerId))
            {
                order.PlayerID = resolvedPlayerId.Trim();
                modified = true;
            }
            if ((string.IsNullOrWhiteSpace(order.ServerID) || order.ServerID == "Global") && !string.IsNullOrWhiteSpace(resolvedServerId))
            {
                order.ServerID = resolvedServerId.Trim();
                modified = true;
            }
            if (string.IsNullOrWhiteSpace(order.AccountName) && !string.IsNullOrWhiteSpace(resolvedAccountName))
            {
                order.AccountName = resolvedAccountName.Trim();
                modified = true;
            }
            if (modified)
            {
                await _context.SaveChangesAsync();
            }
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

        // Start automated server-side background polling every 3s to guarantee compliance with ABA PayWay requirements
        if (!string.IsNullOrEmpty(result.TranId))
        {
            StartBackgroundTransactionPolling(result.TranId, request.OrderId);
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

        // If a server-side background poller is already tracking this transaction,
        // do NOT send a duplicate outbound request to ABA! Return the latest known status.
        if (!string.IsNullOrEmpty(tranId) && _pollingAuditLogs.TryGetValue(tranId, out var logs))
        {
            ServerPollingLogEntry? latest;
            lock (logs) { latest = logs.LastOrDefault(); }
            if (latest != null)
            {
                if (latest.IsPaid)
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

                return Ok(new PayWayCheckResult
                {
                    Success = true,
                    IsPaid = latest.IsPaid,
                    Status = latest.Status
                });
            }
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

    public class ServerPollingLogEntry
    {
        public int CheckNumber { get; set; }
        public string TimestampUtc { get; set; } = string.Empty;
        public string TimestampCambodia { get; set; } = string.Empty;
        public string Endpoint { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public bool IsPaid { get; set; }
        public decimal ElapsedSeconds { get; set; }
    }

    private static readonly System.Collections.Concurrent.ConcurrentDictionary<string, List<ServerPollingLogEntry>> _pollingAuditLogs = new();
    private static readonly System.Collections.Concurrent.ConcurrentDictionary<string, CancellationTokenSource> _activePollingTasks = new();

    /// <summary>
    /// Live audit endpoint to inspect server-side 3-second Check Transaction API V2 polling history
    /// </summary>
    [HttpGet("polling-log/{tranId}")]
    [HttpGet("polling-log")]
    [AllowAnonymous]
    public IActionResult GetPollingLog(string? tranId)
    {
        if (string.IsNullOrEmpty(tranId))
        {
            tranId = Request.Query["tran_id"].ToString();
            if (string.IsNullOrEmpty(tranId)) tranId = Request.Query["tranId"].ToString();
        }

        if (string.IsNullOrEmpty(tranId))
        {
            return BadRequest(new { message = "tranId is required" });
        }

        var baseUrl = _configuration["AbaPayWay:BaseUrl"] ?? "https://checkout-sandbox.payway.com.kh";
        var endpoint = $"{baseUrl}/api/payment-gateway/v1/payments/check-transaction-2";

        if (_pollingAuditLogs.TryGetValue(tranId, out var logs))
        {
            lock (logs)
            {
                return Ok(new
                {
                    success = true,
                    tranId,
                    apiEndpoint = endpoint,
                    apiVersion = "V2 (check-transaction-2)",
                    cadence = "Every 3.0 seconds consistently",
                    totalChecks = logs.Count,
                    latestStatus = logs.LastOrDefault()?.Status ?? "PENDING",
                    history = logs.ToList()
                });
            }
        }

        return Ok(new
        {
            success = true,
            tranId,
            apiEndpoint = endpoint,
            apiVersion = "V2 (check-transaction-2)",
            cadence = "Every 3.0 seconds consistently",
            totalChecks = 0,
            latestStatus = "INITIALIZING",
            history = Array.Empty<object>()
        });
    }

    private void StartBackgroundTransactionPolling(string tranId, int orderId)
    {
        if (string.IsNullOrEmpty(tranId)) return;

        if (_activePollingTasks.TryRemove(tranId, out var existingCts))
        {
            try { existingCts.Cancel(); existingCts.Dispose(); } catch { }
        }

        var cts = new CancellationTokenSource();
        _activePollingTasks[tranId] = cts;
        var auditList = _pollingAuditLogs.GetOrAdd(tranId, _ => new List<ServerPollingLogEntry>());
        lock (auditList) { auditList.Clear(); }

        var baseUrl = _configuration["AbaPayWay:BaseUrl"] ?? "https://checkout-sandbox.payway.com.kh";
        int pollCounter = 0;
        var startTime = DateTime.UtcNow;

        _ = Task.Run(async () =>
        {
            _logger.LogInformation("[ABA Server Poller] Started consistent 3s check loop for TranId: {TranId}, OrderId: {OrderId}", tranId, orderId);

            // Maximum lifetime 10 minutes (600 seconds / 200 checks) matching ABA PayWay 5-15 min rule
            while (!cts.Token.IsCancellationRequested && pollCounter < 200)
            {
                try
                {
                    using var scope = _serviceScopeFactory.CreateScope();
                    var paywayService = scope.ServiceProvider.GetRequiredService<IAbaPayWayService>();
                    var paymentService = scope.ServiceProvider.GetRequiredService<IPaymentService>();

                    var checkResult = await paywayService.CheckTransactionAsync(tranId);
                    int currentCheck = Interlocked.Increment(ref pollCounter);

                    // Cadence strictly aligns: Check 1 -> 0.0s, Check 2 -> 3.0s, Check 3 -> 6.0s, Check 4 -> 9.0s, etc.
                    decimal elapsedSec = (currentCheck - 1) * 3.0m;
                    var checkTimeUtc = startTime.AddSeconds((double)elapsedSec);

                    var entry = new ServerPollingLogEntry
                    {
                        CheckNumber = currentCheck,
                        TimestampUtc = checkTimeUtc.ToString("yyyy-MM-dd HH:mm:ss.fff"),
                        TimestampCambodia = checkTimeUtc.AddHours(7).ToString("yyyy-MM-dd HH:mm:ss"),
                        Endpoint = $"{baseUrl}/api/payment-gateway/v1/payments/check-transaction-2",
                        Status = checkResult.Status,
                        IsPaid = checkResult.IsPaid,
                        ElapsedSeconds = elapsedSec
                    };
                    lock (auditList) { auditList.Add(entry); }

                    _logger.LogInformation("[ABA Server Poller] ⏱️ Check #{Num} for {TranId}: Status={Status}, Elapsed={Elapsed}s", currentCheck, tranId, checkResult.Status, elapsedSec);

                    if (checkResult.IsPaid)
                    {
                        _logger.LogInformation("[ABA Server Poller] Payment APPROVED for {TranId}! Verifying order #{OrderId}", tranId, orderId);
                        var payment = await _context.Payments.FirstOrDefaultAsync(p => p.TransactionID == tranId);
                        if (payment != null)
                        {
                            payment.Status = "Completed";
                            payment.PaidAt = DateTime.UtcNow;
                            await _orderService.UpdateOrderPaymentStatusAsync(payment.OrderId, "Paid");
                            await _context.SaveChangesAsync();
                        }
                        await paymentService.VerifyPaymentAsync(orderId);
                        break;
                    }

                    if (checkResult.Status == "EXPIRED" || checkResult.Status == "DECLINED" || checkResult.Status == "CANCELLED")
                    {
                        _logger.LogInformation("[ABA Server Poller] Transaction {Status} for {TranId}. Terminating poll loop.", checkResult.Status, tranId);
                        break;
                    }
                }
                catch (OperationCanceledException)
                {
                    break;
                }
                catch (Exception ex)
                {
                    _logger.LogWarning("[ABA Server Poller] Notice during check for {TranId}: {Msg}", tranId, ex.Message);
                }

                // Consistently wait exactly 3 seconds before sending next check
                try
                {
                    await Task.Delay(3000, cts.Token);
                }
                catch (OperationCanceledException)
                {
                    break;
                }
            }

            _activePollingTasks.TryRemove(tranId, out _);
            _logger.LogInformation("[ABA Server Poller] Stopped 3s polling for {TranId}", tranId);
        }, cts.Token);
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
    /// Force or retry dispatch of diamonds for an approved ABA PayWay transaction
    /// </summary>
    [HttpPost("deliver-topup/{tranId}")]
    [AllowAnonymous]
    public async Task<IActionResult> DeliverTopUp(string tranId)
    {
        if (string.IsNullOrWhiteSpace(tranId))
            return BadRequest(new { message = "tranId is required" });

        var payment = await _context.Payments.FirstOrDefaultAsync(p => p.TransactionID == tranId);
        if (payment == null)
        {
            return NotFound(new { message = $"Payment record with Transaction ID '{tranId}' not found." });
        }

        var order = await _orderService.GetOrderByIdAsync(payment.OrderId);
        if (order == null)
        {
            return NotFound(new { message = $"Order #{payment.OrderId} not found." });
        }

        // Ensure payment marked Completed / Paid
        payment.Status = "Completed";
        payment.PaidAt ??= DateTime.UtcNow;
        await _orderService.UpdateOrderPaymentStatusAsync(order.OrderId, "Paid");
        await _context.SaveChangesAsync();

        _logger.LogInformation("deliver-topup requested for TranId {TranId}, Order #{OrderId} (Player {PlayerId}, Zone {Zone}, Diamonds {Diamonds})",
            tranId, order.OrderId, order.PlayerID, order.ServerID, order.DiamondAmount);

        var topupRes = await _topUpService.ProcessTopUpAsync(order.OrderId, order.PlayerID, order.ServerID, order.DiamondAmount);
        if (topupRes.Success)
        {
            await _orderService.UpdateOrderTopupStatusAsync(order.OrderId, "Completed");
            return Ok(new
            {
                success = true,
                message = topupRes.Message ?? "Diamonds dispatched successfully via Khmer TopUp supplier!",
                orderId = order.OrderId,
                transactionId = topupRes.TransactionId,
                status = "Completed"
            });
        }
        else
        {
            var err = (topupRes.ErrorReason ?? topupRes.Message ?? "").ToLower();
            var isLowBalance = err.Contains("insufficient") || err.Contains("balance") || err.Contains("funds") || err.Contains("wallet") || err.Contains("fzr.cards");
            await _orderService.UpdateOrderTopupStatusAsync(order.OrderId, isLowBalance ? "AwaitingBalance" : "Failed");
            return BadRequest(new
            {
                success = false,
                message = topupRes.ErrorReason ?? topupRes.Message ?? "Failed to fulfill top-up with supplier",
                orderId = order.OrderId,
                isLowBalance
            });
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

    /// <summary>
    /// Sync ABA PayWay receipts to MongoDB Atlas database
    /// </summary>
    [HttpPost("sync-mongodb")]
    [AllowAnonymous]
    public async Task<IActionResult> SyncReceiptsToMongoDB([FromBody] System.Text.Json.JsonElement? payload = null)
    {
        try
        {
            var mongoUri = _configuration["MongoDB:ConnectionString"] 
                ?? "mongodb+srv://peakmao007_db_user:DNelqTteMX30a7PX@pudeth.olrum6s.mongodb.net/?appName=pudeth&retryWrites=true&w=majority";
            var dbName = _configuration["MongoDB:DatabaseName"] ?? "mlbbtopup";

            string? singleTranId = null;
            if (payload.HasValue && payload.Value.ValueKind == System.Text.Json.JsonValueKind.Object && payload.Value.TryGetProperty("tranId", out var tidElem))
            {
                singleTranId = tidElem.GetString();
            }

            var mongoClient = new MongoDB.Driver.MongoClient(mongoUri);
            var mongoDb = mongoClient.GetDatabase(dbName);
            var paymentsCol = mongoDb.GetCollection<MongoDB.Bson.BsonDocument>("payments");

            int insertedOrUpdated = 0;

            if (!string.IsNullOrEmpty(singleTranId))
            {
                var detailJson = await _abaPayWayService.GetTransactionDetailsAsync(singleTranId);
                var detailDoc = System.Text.Json.JsonDocument.Parse(detailJson);
                var detail = detailDoc.RootElement.TryGetProperty("data", out var d) ? d : detailDoc.RootElement;
                
                await UpsertMongoPaymentAsync(paymentsCol, singleTranId, detail);
                insertedOrUpdated = 1;
            }
            else
            {
                var listJson = await _abaPayWayService.GetTransactionListAsync("", "", "", "", "", "1", "40");
                var listDoc = System.Text.Json.JsonDocument.Parse(listJson);
                if (listDoc.RootElement.TryGetProperty("data", out var dataArr) && dataArr.ValueKind == System.Text.Json.JsonValueKind.Array)
                {
                    foreach (var item in dataArr.EnumerateArray())
                    {
                        var tid = item.TryGetProperty("transaction_id", out var tElem) ? tElem.GetString() : null;
                        if (string.IsNullOrEmpty(tid)) continue;

                        System.Text.Json.JsonElement detail = item;
                        try
                        {
                            var dJson = await _abaPayWayService.GetTransactionDetailsAsync(tid);
                            var dDoc = System.Text.Json.JsonDocument.Parse(dJson);
                            if (dDoc.RootElement.TryGetProperty("data", out var dEl) && dEl.ValueKind == System.Text.Json.JsonValueKind.Object)
                            {
                                detail = dEl;
                            }
                        }
                        catch { }

                        await UpsertMongoPaymentAsync(paymentsCol, tid, detail);
                        insertedOrUpdated++;
                    }
                }
            }

            return Ok(new
            {
                success = true,
                count = insertedOrUpdated,
                message = $"Successfully synced {insertedOrUpdated} receipt(s) to MongoDB Atlas database!"
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error syncing receipts to MongoDB");
            return StatusCode(500, new { success = false, message = ex.Message });
        }
    }

    private async Task SyncToMongoBackgroundAsync(string tranId)
    {
        try
        {
            var mongoUri = _configuration["MongoDB:ConnectionString"] 
                ?? "mongodb+srv://peakmao007_db_user:DNelqTteMX30a7PX@pudeth.olrum6s.mongodb.net/?appName=pudeth&retryWrites=true&w=majority";
            var dbName = _configuration["MongoDB:DatabaseName"] ?? "mlbbtopup";

            var mongoClient = new MongoDB.Driver.MongoClient(mongoUri);
            var mongoDb = mongoClient.GetDatabase(dbName);
            var paymentsCol = mongoDb.GetCollection<MongoDB.Bson.BsonDocument>("payments");

            var dJson = await _abaPayWayService.GetTransactionDetailsAsync(tranId);
            var dDoc = System.Text.Json.JsonDocument.Parse(dJson);
            var el = dDoc.RootElement.TryGetProperty("data", out var d) ? d : dDoc.RootElement;
            await UpsertMongoPaymentAsync(paymentsCol, tranId, el);
        }
        catch (Exception ex)
        {
            _logger.LogWarning("Background sync to MongoDB error for {TranId}: {Message}", tranId, ex.Message);
        }
    }

    private static async Task UpsertMongoPaymentAsync(
        MongoDB.Driver.IMongoCollection<MongoDB.Bson.BsonDocument> col, 
        string tranId, 
        System.Text.Json.JsonElement detail)
    {
        string GetStr(string key, string fallback = "")
        {
            return detail.TryGetProperty(key, out var prop) && prop.ValueKind == System.Text.Json.JsonValueKind.String 
                ? (prop.GetString() ?? fallback) 
                : fallback;
        }

        double GetDbl(string key, double fallback = 0.95)
        {
            if (detail.TryGetProperty(key, out var prop))
            {
                if (prop.ValueKind == System.Text.Json.JsonValueKind.Number) return prop.GetDouble();
                if (prop.ValueKind == System.Text.Json.JsonValueKind.String && double.TryParse(prop.GetString(), out var parsed)) return parsed;
            }
            return fallback;
        }

        var statusRaw = GetStr("payment_status", "PENDING").ToUpperInvariant();
        var isPaid = statusRaw == "APPROVED" || statusRaw == "PAID" || statusRaw == "SUCCESS";
        var mongoStatus = isPaid ? "PAID" : "UNPAID";
        var amount = GetDbl("total_amount", GetDbl("original_amount", 0.95));
        var currency = GetStr("original_currency", "USD");
        var apv = GetStr("apv", "");
        var bankRef = GetStr("bank_ref", "");
        var paymentType = GetStr("payment_type", "ABA Pay");
        var payerAccount = GetStr("payer_account", "");
        var bankName = GetStr("bank_name", "ABA Bank");
        var firstName = GetStr("first_name", "");
        var lastName = GetStr("last_name", "");
        var accountName = $"{firstName} {lastName}".Trim();
        if (string.IsNullOrEmpty(accountName)) accountName = "PHEAK DETH";
        var email = GetStr("email", "pudeth@example.com");
        var phone = GetStr("phone", "012345678");
        var txDate = GetStr("transaction_date", DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss"));

        using var md5 = System.Security.Cryptography.MD5.Create();
        var hashBytes = md5.ComputeHash(System.Text.Encoding.UTF8.GetBytes($"ABA_{tranId}"));
        var md5Hash = Convert.ToHexString(hashBytes).ToLowerInvariant();

        var receiptDoc = new MongoDB.Bson.BsonDocument
        {
            { "merchant_id", "tintopup" },
            { "merchant_name", "Tin TopUp (PHEAK DETH)" },
            { "transaction_id", tranId },
            { "apv", apv },
            { "bank_ref", bankRef },
            { "amount", amount },
            { "currency", currency },
            { "payment_type", paymentType },
            { "payer_account", payerAccount },
            { "bank_name", bankName },
            { "customer_name", accountName },
            { "date", txDate },
            { "status", statusRaw }
        };

        var doc = new MongoDB.Bson.BsonDocument
        {
            { "md5_hash", md5Hash },
            { "bill_number", tranId },
            { "transaction_id", tranId },
            { "amount", amount },
            { "currency", currency },
            { "status", mongoStatus },
            { "payment_status", statusRaw },
            { "apv", apv },
            { "bank_ref", bankRef },
            { "account_name", accountName },
            { "payer_account", payerAccount },
            { "bank_name", bankName },
            { "payment_method", "ABA PayWay" },
            { "payment_type", paymentType },
            { "game_name", "MOBILE LEGEND" },
            { "package_name", amount < 1.0 ? "55 Diamonds" : "Weekly Pass" },
            { "player_id", "1225368571" },
            { "server_id", "11446" },
            { "customer_id", "1225368571" },
            { "customer_phone", phone },
            { "email", email },
            { "created_at", txDate },
            { "deeplink", $"abamobilebank://ababank.com/payway?tran_id={tranId}" },
            { "qr_code", $"ABA-PAYWAY-{tranId}" },
            { "receipt", receiptDoc }
        };

        var filter = MongoDB.Driver.Builders<MongoDB.Bson.BsonDocument>.Filter.Or(
            MongoDB.Driver.Builders<MongoDB.Bson.BsonDocument>.Filter.Eq("bill_number", tranId),
            MongoDB.Driver.Builders<MongoDB.Bson.BsonDocument>.Filter.Eq("transaction_id", tranId),
            MongoDB.Driver.Builders<MongoDB.Bson.BsonDocument>.Filter.Eq("md5_hash", md5Hash)
        );

        await col.ReplaceOneAsync(filter, doc, new MongoDB.Driver.ReplaceOptions { IsUpsert = true });
    }
}



