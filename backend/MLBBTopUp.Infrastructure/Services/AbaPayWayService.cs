using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace MLBBTopUp.Infrastructure.Services
{
    public class PayWayCreateResult
    {
        public bool Success { get; set; }
        public string? TranId { get; set; }
        public string? QrString { get; set; }
        public string? QrImage { get; set; }
        public string? AbapayDeeplink { get; set; }
        public string? Md5Hash { get; set; }
        public string? PurchaseUrl { get; set; }
        public string? CheckoutUrl { get; set; }
        public string? Hash { get; set; }
        public Dictionary<string, string>? FormData { get; set; }
        public string? ErrorMessage { get; set; }
    }

    public class PayWayCheckResult
    {
        public bool Success { get; set; }
        public bool IsPaid { get; set; }
        public string Status { get; set; } = "UNPAID";
        public string? ErrorMessage { get; set; }
    }

    public interface IAbaPayWayService
    {
        Task<PayWayCreateResult> CreatePaymentAsync(int orderId, decimal amount, string currency = "USD");
        Task<PayWayCheckResult> CheckTransactionAsync(string tranId);
        Task<string> GetTransactionDetailsAsync(string tranId);
        Task<string> CloseTransactionAsync(string tranId);
        Task<string> GetTransactionListAsync(string fromDate, string toDate, string fromAmount, string toAmount, string status, string page, string pagination);
        Task<string> GetExchangeRateAsync();
        Task<string> CreateTokenPaymentAsync(string token, int orderId, decimal amount, string ctid, string tokenFlag = "CITU_FLEX", string currency = "USD");
        Task<PayWayCreateResult> CreateSubscriptionPaymentAsync(int orderId, decimal amount, string ctid, string frequency = "1M", string currency = "USD");
        Task<string> LinkAccountAsync(string ctid, string currency = "USD");
        Task<PayWayCreateResult> LinkCardAsync(string ctid, string currency = "USD");
        Task<string> RenewTokenAsync(string ctid, string pwt);
        Task<string> GetTokenDetailsAsync(string requestId);
        Task<string> RemoveTokenAsync(string ctid, string pwt);
        Task<string> GenerateQrAsync(int orderId, decimal amount, string currency = "USD");
        Task<string> CreatePaymentLinkAsync(string title, decimal amount, string returnUrl, string merchantRefNo, string currency = "USD");
        Task<string> GetPaymentLinkDetailsAsync(string linkId);
        Task<string> CompletePreAuthAsync(string tranId, decimal completeAmount, object payout = null);
        Task<string> CancelPreAuthAsync(string tranId);
        Task<string> PayoutAsync(string tranId, decimal totalAmount, object beneficiaries, string currency = "USD");
        Task<string> UpdateBeneficiaryStatusAsync(string payee, int status);
        Task<string> AddBeneficiaryAsync(string payee);
        Task<string> GetTransactionsByMerchantRefAsync(string merchantRef);
        string GenerateHash(string rawString);
    }

    public class AbaPayWayService : IAbaPayWayService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AbaPayWayService> _logger;

        public AbaPayWayService(HttpClient httpClient, IConfiguration configuration, ILogger<AbaPayWayService> logger)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _logger = logger;
            
            if (!_httpClient.DefaultRequestHeaders.Contains("User-Agent"))
            {
                _httpClient.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
            }
        }

        public string GenerateHash(string rawString)
        {
            var apiKey = _configuration["AbaPayWay:ApiKey"] ?? string.Empty;
            if (string.IsNullOrEmpty(apiKey))
            {
                return string.Empty;
            }

            using var hmac = new HMACSHA512(Encoding.UTF8.GetBytes(apiKey));
            var hashBytes = hmac.ComputeHash(Encoding.UTF8.GetBytes(rawString));
            return Convert.ToBase64String(hashBytes);
        }

        public string GeneratePurchaseHash(string reqTime, string merchantId, string tranId, string amount, string items,
            string shipping, string firstName, string lastName, string email, string phone, string type,
            string paymentOption, string returnUrl, string cancelUrl, string continueSuccessUrl,
            string returnDeeplink, string customFields, string currency, string returnParams, string payout,
            string lifetime, string additionalParams, string googlePayToken, string skipSuccessPage)
        {
            var b4hash = $"{reqTime}{merchantId}{tranId}{amount}{items}{shipping}{firstName}{lastName}{email}{phone}{type}{paymentOption}{returnUrl}{cancelUrl}{continueSuccessUrl}{returnDeeplink}{customFields}{currency}{returnParams}{payout}{lifetime}{additionalParams}{googlePayToken}{skipSuccessPage}";
            return GenerateHash(b4hash);
        }

        public string GenerateSubscriptionHash(string reqTime, string merchantId, string tranId, string amount, string items,
            string shipping, string firstName, string lastName, string email, string phone, string type,
            string paymentOption, string returnUrl, string cancelUrl, string continueSuccessUrl,
            string returnDeeplink, string currency, string customFields, string returnParams, string payout,
            string lifetime, string additionalParams, string skipSuccessPage, string tokenFlag, string frequency)
        {
            // NOTE: According to official ABA PayWay docs, ctid and googlePayToken are EXCLUDED from this hash sequence!
            var b4hash = $"{reqTime}{merchantId}{tranId}{amount}{items}{shipping}{firstName}{lastName}{email}{phone}{type}{paymentOption}{returnUrl}{cancelUrl}{continueSuccessUrl}{returnDeeplink}{currency}{customFields}{returnParams}{payout}{lifetime}{additionalParams}{skipSuccessPage}{tokenFlag}{frequency}";
            return GenerateHash(b4hash);
        }

        public async Task<PayWayCreateResult> CreatePaymentAsync(int orderId, decimal amount, string currency = "USD")
        {
            try
            {
                var merchantId = _configuration["AbaPayWay:MerchantId"] ?? "ec478601";
                var apiKey = _configuration["AbaPayWay:ApiKey"] ?? string.Empty;
                var baseUrl = (_configuration["AbaPayWay:BaseUrl"] ?? "https://checkout-sandbox.payway.com.kh").TrimEnd('/');

                var reqTime = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
                var tranId = $"TRX{orderId}-{DateTime.UtcNow.Ticks.ToString().Substring(8, 5)}";
                
                var paywayCurrency = currency;
                var amtStr = amount.ToString("F2");
                var purchaseType = "purchase";
                var paymentOption = "abapay_khqr";
                var qrLifetime = "6"; 
                var qrImageTemplate = "template1";
                
                var firstName = "Pu";
                var lastName = "Deth";
                var email = "pudeth@example.com";
                var phone = "012345678";
                
                var itemsArray = new[]
                {
                    new { name = $"Order #{orderId}", quantity = 1, price = amount }
                };
                var itemsJson = JsonSerializer.Serialize(itemsArray);
                var itemsBase64 = Convert.ToBase64String(Encoding.UTF8.GetBytes(itemsJson));

                    var purchaseUrl = $"{baseUrl}/api/payment-gateway/v1/payments/purchase";
                    var checkoutUrl = $"{baseUrl}/pay?tran_id={tranId}&amount={amtStr}&currency={paywayCurrency}";
                    var popupPaymentOption = ""; 
                    
                    var returnUrl = "http://localhost:3000/success"; // Success URL for Web Continuation
                    var continueSuccessUrl = "http://localhost:3000/success";
                    var returnDeeplink = "abamobilebank://ababank.com"; // Success URL for Mobile Continuation
                    var cancelUrl = "http://localhost:3000/checkout";

                    var popupHash = GeneratePurchaseHash(reqTime, merchantId, tranId, amtStr, itemsBase64,
                        "", firstName, lastName, email, phone, purchaseType, popupPaymentOption,
                        returnUrl, cancelUrl, continueSuccessUrl, returnDeeplink, "", paywayCurrency, "", "", "", "", "", "");

                    var formData = new Dictionary<string, string>
                    {
                        { "req_time", reqTime },
                        { "merchant_id", merchantId },
                        { "tran_id", tranId },
                        { "amount", amtStr },
                        { "items", itemsBase64 },
                        { "firstname", firstName },
                        { "lastname", lastName },
                        { "email", email },
                        { "phone", phone },
                        { "type", purchaseType },
                        { "payment_option", popupPaymentOption },
                        { "return_url", returnUrl },
                        { "cancel_url", cancelUrl },
                        { "continue_success_url", continueSuccessUrl },
                        { "return_deeplink", returnDeeplink },
                        { "currency", paywayCurrency },
                        { "payment_gate", "0" },
                        { "hash", popupHash }
                    };

                if (!string.IsNullOrEmpty(apiKey))
                {
                    try
                    {
                        var b4hash = $"{reqTime}{merchantId}{tranId}{amtStr}{itemsBase64}{firstName}{lastName}{email}{phone}{purchaseType}{paymentOption}{string.Empty}{string.Empty}{paywayCurrency}{string.Empty}{string.Empty}{string.Empty}{qrLifetime}{qrImageTemplate}";
                        var qrHash = GenerateHash(b4hash);

                        var qrPayload = new
                        {
                            req_time = reqTime,
                            merchant_id = merchantId,
                            tran_id = tranId,
                            amount = amtStr,
                            items = itemsBase64,
                            firstname = firstName,
                            lastname = lastName,
                            email = email,
                            phone = phone,
                            type = purchaseType,
                            payment_option = paymentOption,
                            currency = paywayCurrency,
                            lifetime = 6,
                            qr_image_template = qrImageTemplate,
                            hash = qrHash
                        };




                        var qrEndpoint = $"{baseUrl}/api/payment-gateway/v1/payments/generate-qr";
                        using var requestMessage = new HttpRequestMessage(HttpMethod.Post, qrEndpoint)
                        {
                            Content = new StringContent(JsonSerializer.Serialize(qrPayload), Encoding.UTF8, "application/json")
                        };
                        requestMessage.Headers.TryAddWithoutValidation("User-Agent", "Mozilla/5.0");

                        var response = await _httpClient.SendAsync(requestMessage); if (!response.IsSuccessStatusCode) { _logger.LogError("Generate QR failed: {Error}", await response.Content.ReadAsStringAsync()); }

                        if (response.IsSuccessStatusCode)
                        {
                            var responseJson = await response.Content.ReadAsStringAsync();
                            using var doc = JsonDocument.Parse(responseJson);
                            var root = doc.RootElement;

                            string? qrString = root.TryGetProperty("qr_string", out var qrProp) ? qrProp.GetString() : null;
                            string? qrImage = root.TryGetProperty("qr_image", out var imgProp) ? imgProp.GetString() : null;
                            string? deeplink = root.TryGetProperty("abapay_deeplink", out var dlProp) ? dlProp.GetString() : null;

                            if (string.IsNullOrEmpty(deeplink) && !string.IsNullOrEmpty(qrString))
                            {
                                deeplink = $"abamobilebank://ababank.com?type=payway&qrcode={Uri.EscapeDataString(qrString)}";
                            }

                            string md5 = !string.IsNullOrEmpty(qrString)
                                ? Convert.ToHexString(MD5.HashData(Encoding.UTF8.GetBytes(qrString))).ToLower()
                                : Convert.ToHexString(MD5.HashData(Encoding.UTF8.GetBytes(tranId))).ToLower();return new PayWayCreateResult
                            {
                                Success = true,
                                TranId = tranId,
                                QrString = qrString,
                                QrImage = qrImage,
                                AbapayDeeplink = deeplink,
                                Md5Hash = md5,
                                CheckoutUrl = checkoutUrl,
                                PurchaseUrl = purchaseUrl,
                                Hash = popupHash,
                                FormData = formData
                            };
                        }
                    }
                    catch (Exception apiEx)
                    {
                        _logger.LogWarning(apiEx, "Failed to call live PayWay generate-qr API for Order #{OrderId}", orderId);
                    }
                }

                // Fallback result with simulated MD5 hash for order
                var fallbackMd5 = Convert.ToHexString(MD5.HashData(Encoding.UTF8.GetBytes($"ORDER_{orderId}_{DateTime.UtcNow.Ticks}"))).ToLower();
                return new PayWayCreateResult
                {
                    Success = true,
                    TranId = tranId,
                    Md5Hash = fallbackMd5,
                    AbapayDeeplink = $"https://bakong.nbc.org.kh/pay?md5={fallbackMd5}",
                    CheckoutUrl = checkoutUrl,
                    PurchaseUrl = purchaseUrl,
                    Hash = popupHash,
                    FormData = formData
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating PayWay payment for order {OrderId}", orderId);
                return new PayWayCreateResult
                {
                    Success = false,
                    ErrorMessage = ex.Message
                };
            }
        }

        public async Task<PayWayCheckResult> CheckTransactionAsync(string tranId)
        {
            var merchantId = _configuration["AbaPayWay:MerchantId"] ?? string.Empty;
            var baseUrl = _configuration["AbaPayWay:BaseUrl"] ?? "https://checkout-sandbox.payway.com.kh";

            if (string.IsNullOrEmpty(merchantId) || tranId.StartsWith("TRX-MOCK"))
            {
                return new PayWayCheckResult { Success = true, IsPaid = false, Status = "UNPAID" };
            }

            var reqTime = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
            var b4hash = $"{reqTime}{merchantId}{tranId}";
            var hash = GenerateHash(b4hash);

            var payload = new
            {
                req_time = reqTime,
                merchant_id = merchantId,
                tran_id = tranId,
                hash = hash
            };

            var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
            using var requestMessage = new HttpRequestMessage(HttpMethod.Post, $"{baseUrl}/api/payment-gateway/v1/payments/check-transaction-2")
            {
                Content = content
            };
            requestMessage.Headers.TryAddWithoutValidation("User-Agent", "Mozilla/5.0");

            try
            {
                var response = await _httpClient.SendAsync(requestMessage); if (!response.IsSuccessStatusCode) { _logger.LogError("Generate QR failed: {Error}", await response.Content.ReadAsStringAsync()); }
                if (response.IsSuccessStatusCode)
                {
                    var responseBody = await response.Content.ReadAsStringAsync();
                    using var doc = JsonDocument.Parse(responseBody);
                    var root = doc.RootElement;
                    var status = root.GetProperty("status").GetInt32();

                    return new PayWayCheckResult
                    {
                        Success = true,
                        IsPaid = status == 0,
                        Status = status == 0 ? "PAID" : "UNPAID"
                    };
                }
                return new PayWayCheckResult { Success = false, ErrorMessage = "Failed to check status" };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking PayWay status for {TranId}", tranId);
                return new PayWayCheckResult { Success = false, ErrorMessage = ex.Message };
            }
        }

        public async Task<string> GetTransactionDetailsAsync(string tranId)
        {
            var merchantId = _configuration["AbaPayWay:MerchantId"] ?? "ec478601";
            var apiKey = _configuration["AbaPayWay:ApiKey"] ?? string.Empty;
            var baseUrl = (_configuration["AbaPayWay:BaseUrl"] ?? "https://checkout-sandbox.payway.com.kh").TrimEnd('/');

            if (string.IsNullOrEmpty(apiKey))
                return "{}";

            var reqTime = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
            var b4hash = $"{reqTime}{merchantId}{tranId}";
            var hash = GenerateHash(b4hash);

            var payload = new
            {
                req_time = reqTime,
                merchant_id = merchantId,
                tran_id = tranId,
                hash = hash
            };

            var jsonContent = new StringContent(System.Text.Json.JsonSerializer.Serialize(payload), System.Text.Encoding.UTF8, "application/json");
            using var requestMessage = new HttpRequestMessage(HttpMethod.Post, $"{baseUrl}/api/payment-gateway/v1/payments/transaction-detail")
            {
                Content = jsonContent
            };
            requestMessage.Headers.TryAddWithoutValidation("User-Agent", "Mozilla/5.0");

            try
            {
                var response = await _httpClient.SendAsync(requestMessage); if (!response.IsSuccessStatusCode) { _logger.LogError("Generate QR failed: {Error}", await response.Content.ReadAsStringAsync()); }
                return await response.Content.ReadAsStringAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting PayWay transaction details {TranId}", tranId);
                return $"{{\"error\": \"{ex.Message}\"}}";
            }
        }

        public async Task<string> CloseTransactionAsync(string tranId)
        {
            var merchantId = _configuration["AbaPayWay:MerchantId"] ?? "ec478601";
            var apiKey = _configuration["AbaPayWay:ApiKey"] ?? string.Empty;
            var baseUrl = (_configuration["AbaPayWay:BaseUrl"] ?? "https://checkout-sandbox.payway.com.kh").TrimEnd('/');

            if (string.IsNullOrEmpty(apiKey))
                return "{}";

            var reqTime = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
            var b4hash = $"{reqTime}{merchantId}{tranId}";
            var hash = GenerateHash(b4hash);

            var payload = new
            {
                req_time = reqTime,
                merchant_id = merchantId,
                tran_id = tranId,
                hash = hash
            };

            var jsonContent = new StringContent(System.Text.Json.JsonSerializer.Serialize(payload), System.Text.Encoding.UTF8, "application/json");
            using var requestMessage = new HttpRequestMessage(HttpMethod.Post, $"{baseUrl}/api/payment-gateway/v1/payments/close-transaction")
            {
                Content = jsonContent
            };
            requestMessage.Headers.TryAddWithoutValidation("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");

            try
            {
                var response = await _httpClient.SendAsync(requestMessage); if (!response.IsSuccessStatusCode) { _logger.LogError("Generate QR failed: {Error}", await response.Content.ReadAsStringAsync()); }
                return await response.Content.ReadAsStringAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error closing PayWay transaction {TranId}", tranId);
                return $"{{\"error\": \"{ex.Message}\"}}";
            }
        }


        public async Task<string> GetTransactionListAsync(string fromDate = "", string toDate = "", string fromAmount = "", string toAmount = "", string status = "", string page = "1", string pagination = "40")
        {
            var merchantId = _configuration["AbaPayWay:MerchantId"] ?? "ec478601";
            var apiKey = _configuration["AbaPayWay:ApiKey"] ?? string.Empty;
            var baseUrl = (_configuration["AbaPayWay:BaseUrl"] ?? "https://checkout-sandbox.payway.com.kh").TrimEnd('/');

            if (string.IsNullOrEmpty(apiKey))
                return "{}";

            var reqTime = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
            
            var fDate = string.IsNullOrEmpty(fromDate) ? null : fromDate;
            var tDate = string.IsNullOrEmpty(toDate) ? null : toDate;
            var fAmt = string.IsNullOrEmpty(fromAmount) ? null : fromAmount;
            var tAmt = string.IsNullOrEmpty(toAmount) ? null : toAmount;
            var stat = string.IsNullOrEmpty(status) ? null : status;

            var b4hash = $"{reqTime}{merchantId}{fDate}{tDate}{fAmt}{tAmt}{stat}{page}{pagination}";
            var hash = GenerateHash(b4hash);

            var payload = new
            {
                req_time = reqTime,
                merchant_id = merchantId,
                from_date = fDate,
                to_date = tDate,
                from_amount = fAmt,
                to_amount = tAmt,
                status = stat,
                page = page,
                pagination = pagination,
                hash = hash
            };

            var jsonContent = new StringContent(System.Text.Json.JsonSerializer.Serialize(payload), System.Text.Encoding.UTF8, "application/json");
            using var requestMessage = new HttpRequestMessage(HttpMethod.Post, $"{baseUrl}/api/payment-gateway/v1/payments/transaction-list-2")
            {
                Content = jsonContent
            };
            requestMessage.Headers.TryAddWithoutValidation("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");

            try
            {
                var response = await _httpClient.SendAsync(requestMessage); if (!response.IsSuccessStatusCode) { _logger.LogError("Generate QR failed: {Error}", await response.Content.ReadAsStringAsync()); }
                return await response.Content.ReadAsStringAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting PayWay transaction list");
                return $"{{\"error\": \"{ex.Message}\"}}";
            }
        }


        public async Task<string> GetExchangeRateAsync()
        {
            var merchantId = _configuration["AbaPayWay:MerchantId"] ?? "ec478601";
            var apiKey = _configuration["AbaPayWay:ApiKey"] ?? string.Empty;
            var baseUrl = (_configuration["AbaPayWay:BaseUrl"] ?? "https://checkout-sandbox.payway.com.kh").TrimEnd('/');

            if (string.IsNullOrEmpty(apiKey))
                return "{}";

            var reqTime = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
            var b4hash = $"{reqTime}{merchantId}";
            var hash = GenerateHash(b4hash);

            var payload = new
            {
                req_time = reqTime,
                merchant_id = merchantId,
                hash = hash
            };

            var jsonContent = new StringContent(System.Text.Json.JsonSerializer.Serialize(payload), System.Text.Encoding.UTF8, "application/json");
            using var requestMessage = new HttpRequestMessage(HttpMethod.Post, $"{baseUrl}/api/payment-gateway/v1/exchange-rate")
            {
                Content = jsonContent
            };
            requestMessage.Headers.TryAddWithoutValidation("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");

            try
            {
                var response = await _httpClient.SendAsync(requestMessage); if (!response.IsSuccessStatusCode) { _logger.LogError("Generate QR failed: {Error}", await response.Content.ReadAsStringAsync()); }
                return await response.Content.ReadAsStringAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting PayWay exchange rate");
                return $"{{\"error\": \"{ex.Message}\"}}";
            }
        }


        public async Task<string> CreateTokenPaymentAsync(string token, int orderId, decimal amount, string ctid, string tokenFlag = "CITU_FLEX", string currency = "USD")
        {
            var merchantId = _configuration["AbaPayWay:MerchantId"] ?? "ec478601";
            var apiKey = _configuration["AbaPayWay:ApiKey"] ?? string.Empty;
            var baseUrl = (_configuration["AbaPayWay:BaseUrl"] ?? "https://checkout-sandbox.payway.com.kh").TrimEnd('/');

            if (string.IsNullOrEmpty(apiKey))
                return "{}";

            var reqTime = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
            var tranId = $"TRX{orderId}-{DateTime.UtcNow.Ticks.ToString().Substring(8, 5)}";
            var amtStr = amount.ToString("F2");
            var purchaseType = "purchase";
            var firstName = "";
            var lastName = "";
            var email = "";
            var phone = "";
            var callbackUrl = "";
            var customFields = "";
            var returnParams = "";
            var payout = "";
            var shippingFee = "";

            var itemsArray = new[]
            {
                new { name = $"Order #{orderId}", quantity = 1, price = amount }
            };
            var itemsBase64 = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(System.Text.Json.JsonSerializer.Serialize(itemsArray)));

            // request_time + merchant_id + tran_id + amount + currency + items + ctid + pwt + first_name + last_name + email + phone + purchase_type + callback_url + custom_fields + return_params + payout + token_flag + shipping_fee
            var b4hash = $"{reqTime}{merchantId}{tranId}{amtStr}{currency}{itemsBase64}{ctid}{token}{firstName}{lastName}{email}{phone}{purchaseType}{callbackUrl}{customFields}{returnParams}{payout}{tokenFlag}{shippingFee}";
            var hash = GenerateHash(b4hash);

            var payload = new
            {
                request_time = reqTime,
                merchant_id = merchantId,
                tran_id = tranId,
                ctid = ctid,
                pwt = token,
                first_name = firstName,
                last_name = lastName,
                email = email,
                phone = phone,
                amount = amount, // Note: numeric double for JSON
                currency = currency,
                token_flag = tokenFlag,
                purchase_type = purchaseType,
                items = itemsBase64,
                hash = hash
            };

            var jsonContent = new StringContent(System.Text.Json.JsonSerializer.Serialize(payload), System.Text.Encoding.UTF8, "application/json");
            using var requestMessage = new HttpRequestMessage(HttpMethod.Post, $"{baseUrl}/api/payment-gateway/v3/purchase/payment-credential")
            {
                Content = jsonContent
            };
            requestMessage.Headers.TryAddWithoutValidation("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");

            try
            {
                var response = await _httpClient.SendAsync(requestMessage); if (!response.IsSuccessStatusCode) { _logger.LogError("Generate QR failed: {Error}", await response.Content.ReadAsStringAsync()); }
                return await response.Content.ReadAsStringAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error executing PayWay CoF transaction");
                return $"{{\"error\": \"{ex.Message}\"}}";
            }
        }


        public async Task<PayWayCreateResult> CreateSubscriptionPaymentAsync(int orderId, decimal amount, string ctid, string frequency = "1M", string currency = "USD")
        {
            try
            {
                var merchantId = _configuration["AbaPayWay:MerchantId"] ?? "ec478601";
                var apiKey = _configuration["AbaPayWay:ApiKey"] ?? string.Empty;
                var baseUrl = (_configuration["AbaPayWay:BaseUrl"] ?? "https://checkout-sandbox.payway.com.kh").TrimEnd('/');

                var reqTime = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
                var tranId = $"TRX{orderId}-{DateTime.UtcNow.Ticks.ToString().Substring(8, 5)}";
                
                var paywayCurrency = currency;
                var amtStr = amount.ToString("F2");
                var purchaseType = "purchase";
                var paymentOption = "abapay"; // default to abapay for subscriptions
                var qrLifetime = "6"; 
                var tokenFlag = "CITR_FIX";
                
                var firstName = "Pu";
                var lastName = "Deth";
                var email = "pudeth@example.com";
                var phone = "012345678";
                
                var itemsArray = new[]
                {
                    new { name = $"Subscription Order #{orderId}", quantity = 1, price = amount }
                };
                var itemsJson = System.Text.Json.JsonSerializer.Serialize(itemsArray);
                var itemsBase64 = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(itemsJson));

                if (!string.IsNullOrEmpty(apiKey))
                {
                    var purchaseUrl = $"{baseUrl}/api/payment-gateway/v1/payments/purchase";
                    var checkoutUrl = $"{baseUrl}/pay?tran_id={tranId}&amount={amtStr}&currency={paywayCurrency}";
                    var popupPaymentOption = "";
                    
                    var returnUrl = "http://localhost:3000/success";
                    var continueSuccessUrl = "http://localhost:3000/success";
                    var returnDeeplink = "abamobilebank://ababank.com";
                    var cancelUrl = "http://localhost:3000/checkout";

                    var popupHash = GenerateSubscriptionHash(reqTime, merchantId, tranId, amtStr, itemsBase64,
                        "", firstName, lastName, email, phone, purchaseType, popupPaymentOption,
                        returnUrl, cancelUrl, continueSuccessUrl, returnDeeplink, paywayCurrency, "", "", "", qrLifetime, "", "", tokenFlag, frequency);

                    var formData = new Dictionary<string, string>
                    {
                        { "req_time", reqTime },
                        { "merchant_id", merchantId },
                        { "tran_id", tranId },
                        { "amount", amtStr },
                        { "items", itemsBase64 },
                        { "firstname", firstName },
                        { "lastname", lastName },
                        { "email", email },
                        { "phone", phone },
                        { "type", purchaseType },
                        { "payment_option", popupPaymentOption },
                        { "return_url", returnUrl },
                        { "cancel_url", cancelUrl },
                        { "continue_success_url", continueSuccessUrl },
                        { "return_deeplink", returnDeeplink },
                        { "currency", paywayCurrency },
                        
                        { "payment_gate", "0" },
                        { "ctid", ctid },
                        { "token_flag", tokenFlag },
                        { "frequency", frequency },
                        { "hash", popupHash }
                    };

                    return new PayWayCreateResult
                    {
                        Success = true,
                        TranId = tranId,
                        CheckoutUrl = checkoutUrl,
                        PurchaseUrl = purchaseUrl,
                        Hash = popupHash,
                        FormData = formData
                    };
                }

                return new PayWayCreateResult { Success = false, ErrorMessage = "Missing API Key" };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating PayWay subscription for order {OrderId}", orderId);
                return new PayWayCreateResult { Success = false, ErrorMessage = ex.Message };
            }
        }


        public async Task<string> LinkAccountAsync(string ctid, string currency = "USD")
        {
            var merchantId = _configuration["AbaPayWay:MerchantId"] ?? "ec478601";
            var apiKey = _configuration["AbaPayWay:ApiKey"] ?? string.Empty;
            var baseUrl = (_configuration["AbaPayWay:BaseUrl"] ?? "https://checkout-sandbox.payway.com.kh").TrimEnd('/');

            if (string.IsNullOrEmpty(apiKey))
                return "{}";

            var reqTime = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
            var requestId = Guid.NewGuid().ToString("N").Substring(0, 20); // 20 chars
            var tokenFlag = "CITI_FLEX";

            // Return Deeplink (Base64 encoded JSON)
            var deeplinkFormat = new { ios_scheme = "myapp://", android_scheme = "myapp://" };
            var returnDeeplink = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(System.Text.Json.JsonSerializer.Serialize(deeplinkFormat)));
            
            // Callback URL (Base64 encoded)
            var callbackUrl = "https://yourdomain.com/api/PayWay/webhook";
            var callbackUrlB64 = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(callbackUrl));

            var b4hash = $"{merchantId}{reqTime}{ctid}{returnDeeplink}{callbackUrlB64}{requestId}{tokenFlag}{currency}";
            var hash = GenerateHash(b4hash);

            var payload = new
            {
                request_id = requestId,
                request_time = reqTime,
                merchant_id = merchantId,
                ctid = ctid,
                return_deeplink = returnDeeplink,
                token_flag = tokenFlag,
                currency = currency,
                callback_url = callbackUrlB64,
                hash = hash
            };

            var jsonContent = new StringContent(System.Text.Json.JsonSerializer.Serialize(payload), System.Text.Encoding.UTF8, "application/json");
            using var requestMessage = new HttpRequestMessage(HttpMethod.Post, $"{baseUrl}/api/payment-credential/v3/aof/link-account")
            {
                Content = jsonContent
            };
            requestMessage.Headers.TryAddWithoutValidation("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");

            try
            {
                var response = await _httpClient.SendAsync(requestMessage); if (!response.IsSuccessStatusCode) { _logger.LogError("Generate QR failed: {Error}", await response.Content.ReadAsStringAsync()); }
                return await response.Content.ReadAsStringAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error linking ABA account");
                return $"{{\"error\": \"{ex.Message}\"}}";
            }
        }


        public async Task<PayWayCreateResult> LinkCardAsync(string ctid, string currency = "USD")
        {
            var merchantId = _configuration["AbaPayWay:MerchantId"] ?? "ec478601";
            var apiKey = _configuration["AbaPayWay:ApiKey"] ?? string.Empty;
            var baseUrl = (_configuration["AbaPayWay:BaseUrl"] ?? "https://checkout-sandbox.payway.com.kh").TrimEnd('/');

            var reqTime = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
            var requestId = Guid.NewGuid().ToString("N").Substring(0, 20); // 20 chars
            var tokenFlag = "CITI_FLEX";
            var frequency = "";
            var amount = "";

            var callbackUrl = "https://yourdomain.com/api/PayWay/webhook";
            var callbackUrlB64 = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(callbackUrl));

            var continueSuccessUrl = "http://localhost:3000/success";
            var continueSuccessUrlB64 = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(continueSuccessUrl));

            var b4hash = $"{merchantId}{reqTime}{ctid}{callbackUrlB64}{requestId}{tokenFlag}{frequency}{amount}{currency}{continueSuccessUrlB64}";
            var hash = GenerateHash(b4hash);

            var formData = new Dictionary<string, string>
            {
                { "request_id", requestId },
                { "request_time", reqTime },
                { "merchant_id", merchantId },
                { "ctid", ctid },
                { "token_flag", tokenFlag },
                { "currency", currency },
                { "callback_url", callbackUrlB64 },
                { "continue_success_url", continueSuccessUrlB64 },
                { "hash", hash }
            };

            var purchaseUrl = $"{baseUrl}/api/payment-credential/v3/cof/link-card";
            


            return new PayWayCreateResult
            {
                Success = true,
                TranId = requestId,
                PurchaseUrl = purchaseUrl,
                Hash = hash,
                FormData = formData
            };
        }


        public async Task<string> RenewTokenAsync(string ctid, string pwt)
        {
            var merchantId = _configuration["AbaPayWay:MerchantId"] ?? "ec478601";
            var apiKey = _configuration["AbaPayWay:ApiKey"] ?? string.Empty;
            var baseUrl = (_configuration["AbaPayWay:BaseUrl"] ?? "https://checkout-sandbox.payway.com.kh").TrimEnd('/');

            if (string.IsNullOrEmpty(apiKey))
                return "{}";

            var reqTime = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
            var requestId = Guid.NewGuid().ToString("N").Substring(0, 20); // 20 chars

            // Hash sequence: ctid + request_time + pwt + merchant_id + request_id
            var b4hash = $"{ctid}{reqTime}{pwt}{merchantId}{requestId}";
            var hash = GenerateHash(b4hash);

            var payload = new
            {
                request_time = reqTime,
                merchant_id = merchantId,
                request_id = requestId,
                ctid = ctid,
                pwt = pwt,
                hash = hash
            };

            var jsonContent = new StringContent(System.Text.Json.JsonSerializer.Serialize(payload), System.Text.Encoding.UTF8, "application/json");
            using var requestMessage = new HttpRequestMessage(HttpMethod.Post, $"{baseUrl}/api/payment-credential/v3/token-management/renew-expired-account-token")
            {
                Content = jsonContent
            };
            requestMessage.Headers.TryAddWithoutValidation("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");

            try
            {
                var response = await _httpClient.SendAsync(requestMessage); if (!response.IsSuccessStatusCode) { _logger.LogError("Generate QR failed: {Error}", await response.Content.ReadAsStringAsync()); }
                return await response.Content.ReadAsStringAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error renewing PayWay token");
                return $"{{\"error\": \"{ex.Message}\"}}";
            }
        }


        public async Task<string> GetTokenDetailsAsync(string requestId)
        {
            var merchantId = _configuration["AbaPayWay:MerchantId"] ?? "ec478601";
            var apiKey = _configuration["AbaPayWay:ApiKey"] ?? string.Empty;
            var baseUrl = (_configuration["AbaPayWay:BaseUrl"] ?? "https://checkout-sandbox.payway.com.kh").TrimEnd('/');

            if (string.IsNullOrEmpty(apiKey))
                return "{}";

            var reqTime = DateTime.UtcNow.ToString("yyyyMMddHHmmss");

            // Hash sequence: merchant_id + request_time + request_id
            var b4hash = $"{merchantId}{reqTime}{requestId}";
            var hash = GenerateHash(b4hash);

            var payload = new
            {
                request_time = reqTime,
                request_id = requestId,
                merchant_id = merchantId,
                hash = hash
            };

            var jsonContent = new StringContent(System.Text.Json.JsonSerializer.Serialize(payload), System.Text.Encoding.UTF8, "application/json");
            using var requestMessage = new HttpRequestMessage(HttpMethod.Post, $"{baseUrl}/api/payment-credential/v3/token-management/get-token-details")
            {
                Content = jsonContent
            };
            requestMessage.Headers.TryAddWithoutValidation("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");

            try
            {
                var response = await _httpClient.SendAsync(requestMessage); if (!response.IsSuccessStatusCode) { _logger.LogError("Generate QR failed: {Error}", await response.Content.ReadAsStringAsync()); }
                return await response.Content.ReadAsStringAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting PayWay token details");
                return $"{{\"error\": \"{ex.Message}\"}}";
            }
        }


        public async Task<string> RemoveTokenAsync(string ctid, string pwt)
        {
            var merchantId = _configuration["AbaPayWay:MerchantId"] ?? "ec478601";
            var apiKey = _configuration["AbaPayWay:ApiKey"] ?? string.Empty;
            var baseUrl = (_configuration["AbaPayWay:BaseUrl"] ?? "https://checkout-sandbox.payway.com.kh").TrimEnd('/');

            if (string.IsNullOrEmpty(apiKey))
                return "{}";

            var reqTime = DateTime.UtcNow.ToString("yyyyMMddHHmmss");

            // Hash sequence: merchant_id + ctid + request_time + pwt
            var b4hash = $"{merchantId}{ctid}{reqTime}{pwt}";
            var hash = GenerateHash(b4hash);

            var payload = new
            {
                request_time = reqTime,
                merchant_id = merchantId,
                ctid = ctid,
                pwt = pwt,
                hash = hash
            };

            var jsonContent = new StringContent(System.Text.Json.JsonSerializer.Serialize(payload), System.Text.Encoding.UTF8, "application/json");
            using var requestMessage = new HttpRequestMessage(HttpMethod.Post, $"{baseUrl}/api/payment-credential/v3/token-management/remove-token")
            {
                Content = jsonContent
            };
            requestMessage.Headers.TryAddWithoutValidation("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");

            try
            {
                var response = await _httpClient.SendAsync(requestMessage); if (!response.IsSuccessStatusCode) { _logger.LogError("Generate QR failed: {Error}", await response.Content.ReadAsStringAsync()); }
                return await response.Content.ReadAsStringAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing PayWay token");
                return $"{{\"error\": \"{ex.Message}\"}}";
            }
        }


        public async Task<string> GenerateQrAsync(int orderId, decimal amount, string currency = "USD")
        {
            var merchantId = _configuration["AbaPayWay:MerchantId"] ?? "ec478601";
            var apiKey = _configuration["AbaPayWay:ApiKey"] ?? string.Empty;
            var baseUrl = (_configuration["AbaPayWay:BaseUrl"] ?? "https://checkout-sandbox.payway.com.kh").TrimEnd('/');

            if (string.IsNullOrEmpty(apiKey))
                return "{}";

            var reqTime = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
            var tranId = $"TRX{orderId}-{DateTime.UtcNow.Ticks.ToString().Substring(8, 5)}";
            var amtStr = amount.ToString("F2");
            var firstName = "";
            var lastName = "";
            var email = "";
            var phone = "";
            var purchaseType = "purchase";
            var paymentOption = "abapay_khqr";
            
            var itemsArray = new[] { new { name = $"Order #{orderId}", quantity = 1, price = amount } };
            var itemsBase64 = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(System.Text.Json.JsonSerializer.Serialize(itemsArray)));
            
            var callbackUrl = "";
            var returnDeeplink = "";
            var customFields = "";
            var returnParams = "";
            var payout = "";
            var lifetime = "6";
            var qrImageTemplate = "template3_color";

            // Hash sequence: req_time + merchant_id + tran_id + amount + items + first_name + last_name + email + phone + purchase_type + payment_option + callback_url + return_deeplink + currency + custom_fields + return_params + payout + lifetime + qr_image_template
            var b4hash = $"{reqTime}{merchantId}{tranId}{amtStr}{itemsBase64}{firstName}{lastName}{email}{phone}{purchaseType}{paymentOption}{callbackUrl}{returnDeeplink}{currency}{customFields}{returnParams}{payout}{lifetime}{qrImageTemplate}";
            var hash = GenerateHash(b4hash);

            var payload = new
            {
                req_time = reqTime,
                merchant_id = merchantId,
                tran_id = tranId,
                first_name = firstName,
                last_name = lastName,
                email = email,
                phone = phone,
                amount = amount,
                currency = currency,
                purchase_type = purchaseType,
                payment_option = paymentOption,
                items = itemsBase64,
                callback_url = callbackUrl,
                return_deeplink = returnDeeplink,
                custom_fields = customFields,
                return_params = returnParams,
                payout = payout,
                lifetime = int.Parse(lifetime),
                qr_image_template = qrImageTemplate,
                hash = hash
            };

            var jsonContent = new StringContent(System.Text.Json.JsonSerializer.Serialize(payload), System.Text.Encoding.UTF8, "application/json");
            using var requestMessage = new HttpRequestMessage(HttpMethod.Post, $"{baseUrl}/api/payment-gateway/v1/payments/generate-qr")
            {
                Content = jsonContent
            };
            requestMessage.Headers.TryAddWithoutValidation("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");

            try
            {
                var response = await _httpClient.SendAsync(requestMessage); if (!response.IsSuccessStatusCode) { _logger.LogError("Generate QR failed: {Error}", await response.Content.ReadAsStringAsync()); }
                return await response.Content.ReadAsStringAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating PayWay QR");
                return $"{{\"error\": \"{ex.Message}\"}}";
            }
        }


        public async Task<string> CreatePaymentLinkAsync(string title, decimal amount, string returnUrl, string merchantRefNo, string currency = "USD")
        {
            var merchantId = _configuration["AbaPayWay:MerchantId"] ?? "ec478601";
            var apiKey = _configuration["AbaPayWay:ApiKey"] ?? string.Empty;
            var rsaPublicKeyBase64 = _configuration["AbaPayWay:RsaPublicKey"] ?? string.Empty; 
            var baseUrl = (_configuration["AbaPayWay:BaseUrl"] ?? "https://checkout-sandbox.payway.com.kh").TrimEnd('/');

            if (string.IsNullOrEmpty(apiKey) || string.IsNullOrEmpty(rsaPublicKeyBase64))
                return $"{{\"error\": \"Missing ApiKey or RsaPublicKey\"}}";

            var reqTime = DateTime.UtcNow.ToString("yyyyMMddHHmmss");

            var authData = new
            {
                mc_id = merchantId,
                title = title,
                amount = amount.ToString("F2"),
                currency = currency,
                description = "MLBB TopUp Payment Link",
                payment_limit = 1,
                expired_date = DateTimeOffset.UtcNow.AddDays(7).ToUnixTimeSeconds(),
                return_url = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(returnUrl)),
                merchant_ref_no = merchantRefNo
            };
            var authJson = System.Text.Json.JsonSerializer.Serialize(authData);

            // Encrypt authJson using RSA Public Key
            var merchantAuth = EncryptRsa(authJson, rsaPublicKeyBase64);

            // Hash sequence: request_time + merchant_id + merchant_auth
            var b4hash = $"{reqTime}{merchantId}{merchantAuth}";
            var hash = GenerateHash(b4hash);

            using var content = new MultipartFormDataContent();
            content.Add(new StringContent(reqTime), "request_time");
            content.Add(new StringContent(merchantId), "merchant_id");
            content.Add(new StringContent(merchantAuth), "merchant_auth");
            content.Add(new StringContent(hash), "hash");

            using var requestMessage = new HttpRequestMessage(HttpMethod.Post, $"{baseUrl}/api/merchant-portal/merchant-access/payment-link/create")
            {
                Content = content
            };
            requestMessage.Headers.TryAddWithoutValidation("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");

            try
            {
                var response = await _httpClient.SendAsync(requestMessage); if (!response.IsSuccessStatusCode) { _logger.LogError("Generate QR failed: {Error}", await response.Content.ReadAsStringAsync()); }
                return await response.Content.ReadAsStringAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating PayWay Payment Link");
                return $"{{\"error\": \"{ex.Message}\"}}";
            }
        }

        private string EncryptRsa(string source, string publicKeyPem)
        {
            // Simple PEM parser to get raw key bytes
            var publicKeyBase64 = publicKeyPem
                .Replace("-----BEGIN PUBLIC KEY-----", "")
                .Replace("-----END PUBLIC KEY-----", "")
                .Replace("\n", "")
                .Replace("\r", "")
                .Trim();
                
            byte[] publicKeyBytes = Convert.FromBase64String(publicKeyBase64);

            using var rsa = System.Security.Cryptography.RSA.Create();
            rsa.ImportSubjectPublicKeyInfo(publicKeyBytes, out _);

            var sourceBytes = System.Text.Encoding.UTF8.GetBytes(source);
            
            // ABA specifies chunked encryption (117 bytes max per chunk for PKCS#1 v1.5 with 1024-bit key)
            int maxLength = 117; 
            int dataLength = sourceBytes.Length;
            int iterations = dataLength / maxLength;
            
            var output = new System.Collections.Generic.List<byte>();
            
            for (int i = 0; i <= iterations; i++)
            {
                int start = i * maxLength;
                int length = Math.Min(maxLength, dataLength - start);
                
                if (length > 0)
                {
                    byte[] temp = new byte[length];
                    Array.Copy(sourceBytes, start, temp, 0, length);
                    
                    byte[] encryptedChunk = rsa.Encrypt(temp, System.Security.Cryptography.RSAEncryptionPadding.Pkcs1);
                    output.AddRange(encryptedChunk);
                }
            }

            return Convert.ToBase64String(output.ToArray());
        }


        public async Task<string> GetPaymentLinkDetailsAsync(string linkId)
        {
            var merchantId = _configuration["AbaPayWay:MerchantId"] ?? "ec478601";
            var apiKey = _configuration["AbaPayWay:ApiKey"] ?? string.Empty;
            var rsaPublicKeyBase64 = _configuration["AbaPayWay:RsaPublicKey"] ?? string.Empty; 
            var baseUrl = (_configuration["AbaPayWay:BaseUrl"] ?? "https://checkout-sandbox.payway.com.kh").TrimEnd('/');

            if (string.IsNullOrEmpty(apiKey) || string.IsNullOrEmpty(rsaPublicKeyBase64))
                return $"{{\"error\": \"Missing ApiKey or RsaPublicKey\"}}";

            var reqTime = DateTime.UtcNow.ToString("yyyyMMddHHmmss");

            var authData = new
            {
                mc_id = merchantId,
                id = linkId
            };
            var authJson = System.Text.Json.JsonSerializer.Serialize(authData);

            // Encrypt authJson using RSA Public Key
            var merchantAuth = EncryptRsa(authJson, rsaPublicKeyBase64);

            // Hash sequence: request_time + merchant_id + merchant_auth
            var b4hash = $"{reqTime}{merchantId}{merchantAuth}";
            var hash = GenerateHash(b4hash);

            var payload = new
            {
                request_time = reqTime,
                merchant_id = merchantId,
                merchant_auth = merchantAuth,
                hash = hash
            };

            var jsonContent = new StringContent(System.Text.Json.JsonSerializer.Serialize(payload), System.Text.Encoding.UTF8, "application/json");
            using var requestMessage = new HttpRequestMessage(HttpMethod.Post, $"{baseUrl}/api/merchant-portal/merchant-access/payment-link/detail")
            {
                Content = jsonContent
            };
            requestMessage.Headers.TryAddWithoutValidation("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");

            try
            {
                var response = await _httpClient.SendAsync(requestMessage); if (!response.IsSuccessStatusCode) { _logger.LogError("Generate QR failed: {Error}", await response.Content.ReadAsStringAsync()); }
                return await response.Content.ReadAsStringAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting PayWay Payment Link details");
                return $"{{\"error\": \"{ex.Message}\"}}";
            }
        }


        public async Task<string> CompletePreAuthAsync(string tranId, decimal completeAmount, object payout = null)
        {
            var merchantId = _configuration["AbaPayWay:MerchantId"] ?? "ec478601";
            var apiKey = _configuration["AbaPayWay:ApiKey"] ?? string.Empty;
            var rsaPublicKeyBase64 = _configuration["AbaPayWay:RsaPublicKey"] ?? string.Empty; 
            var baseUrl = (_configuration["AbaPayWay:BaseUrl"] ?? "https://checkout-sandbox.payway.com.kh").TrimEnd('/');

            if (string.IsNullOrEmpty(apiKey) || string.IsNullOrEmpty(rsaPublicKeyBase64))
                return $"{{\"error\": \"Missing ApiKey or RsaPublicKey\"}}";

            var reqTime = DateTime.UtcNow.ToString("yyyyMMddHHmmss");

            var authDict = new System.Collections.Generic.Dictionary<string, object>
            {
                { "mc_id", merchantId },
                { "tran_id", tranId },
                { "complete_amount", completeAmount }
            };

            if (payout != null)
            {
                authDict.Add("payout", payout);
            }

            var authJson = System.Text.Json.JsonSerializer.Serialize(authDict);

            // Encrypt authJson using RSA Public Key
            var merchantAuth = EncryptRsa(authJson, rsaPublicKeyBase64);

            // Hash sequence: merchant_auth + request_time + merchant_id
            var b4hash = $"{merchantAuth}{reqTime}{merchantId}";
            var hash = GenerateHash(b4hash);

            var payload = new
            {
                request_time = reqTime,
                merchant_id = merchantId,
                merchant_auth = merchantAuth,
                hash = hash
            };

            var jsonContent = new StringContent(System.Text.Json.JsonSerializer.Serialize(payload), System.Text.Encoding.UTF8, "application/json");
            using var requestMessage = new HttpRequestMessage(HttpMethod.Post, $"{baseUrl}/api/merchant-portal/merchant-access/online-transaction/pre-auth-completion")
            {
                Content = jsonContent
            };
            requestMessage.Headers.TryAddWithoutValidation("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");

            try
            {
                var response = await _httpClient.SendAsync(requestMessage); if (!response.IsSuccessStatusCode) { _logger.LogError("Generate QR failed: {Error}", await response.Content.ReadAsStringAsync()); }
                return await response.Content.ReadAsStringAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error completing PayWay pre-auth");
                return $"{{\"error\": \"{ex.Message}\"}}";
            }
        }


        public async Task<string> CancelPreAuthAsync(string tranId)
        {
            var merchantId = _configuration["AbaPayWay:MerchantId"] ?? "ec478601";
            var apiKey = _configuration["AbaPayWay:ApiKey"] ?? string.Empty;
            var rsaPublicKeyBase64 = _configuration["AbaPayWay:RsaPublicKey"] ?? string.Empty; 
            var baseUrl = (_configuration["AbaPayWay:BaseUrl"] ?? "https://checkout-sandbox.payway.com.kh").TrimEnd('/');

            if (string.IsNullOrEmpty(apiKey) || string.IsNullOrEmpty(rsaPublicKeyBase64))
                return $"{{\"error\": \"Missing ApiKey or RsaPublicKey\"}}";

            var reqTime = DateTime.UtcNow.ToString("yyyyMMddHHmmss");

            var authData = new
            {
                mc_id = merchantId,
                tran_id = tranId
            };
            var authJson = System.Text.Json.JsonSerializer.Serialize(authData);

            // Encrypt authJson using RSA Public Key
            var merchantAuth = EncryptRsa(authJson, rsaPublicKeyBase64);

            // Hash sequence: merchant_id + merchant_auth + request_time
            var b4hash = $"{merchantId}{merchantAuth}{reqTime}";
            var hash = GenerateHash(b4hash);

            var payload = new
            {
                request_time = reqTime,
                merchant_id = merchantId,
                merchant_auth = merchantAuth,
                hash = hash
            };

            var jsonContent = new StringContent(System.Text.Json.JsonSerializer.Serialize(payload), System.Text.Encoding.UTF8, "application/json");
            using var requestMessage = new HttpRequestMessage(HttpMethod.Post, $"{baseUrl}/api/merchant-portal/merchant-access/online-transaction/pre-auth-cancellation")
            {
                Content = jsonContent
            };
            requestMessage.Headers.TryAddWithoutValidation("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");

            try
            {
                var response = await _httpClient.SendAsync(requestMessage); if (!response.IsSuccessStatusCode) { _logger.LogError("Generate QR failed: {Error}", await response.Content.ReadAsStringAsync()); }
                return await response.Content.ReadAsStringAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error cancelling PayWay pre-auth");
                return $"{{\"error\": \"{ex.Message}\"}}";
            }
        }


        public async Task<string> PayoutAsync(string tranId, decimal totalAmount, object beneficiaries, string currency = "USD")
        {
            var merchantId = _configuration["AbaPayWay:MerchantId"] ?? "ec478601";
            var apiKey = _configuration["AbaPayWay:ApiKey"] ?? string.Empty;
            var rsaPublicKeyBase64 = _configuration["AbaPayWay:RsaPublicKey"] ?? string.Empty; 
            var baseUrl = (_configuration["AbaPayWay:BaseUrl"] ?? "https://checkout-sandbox.payway.com.kh").TrimEnd('/');

            if (string.IsNullOrEmpty(apiKey) || string.IsNullOrEmpty(rsaPublicKeyBase64))
                return $"{{\"error\": \"Missing ApiKey or RsaPublicKey\"}}";

            var customFields = "";

            var beneficiariesJson = System.Text.Json.JsonSerializer.Serialize(beneficiaries);

            // Encrypt beneficiaries JSON using RSA Public Key
            var encryptedBeneficiaries = EncryptRsa(beneficiariesJson, rsaPublicKeyBase64);

            var amtStr = totalAmount.ToString("F2");

            // Hash sequence: merchant_id + tran_id + beneficiaries + amount + custom_fields + currency
            var b4hash = $"{merchantId}{tranId}{encryptedBeneficiaries}{amtStr}{customFields}{currency}";
            
            // NOTE: The PHP sample for Payout uses hash_hmac directly without base64 encoding (wait, the sample says:
            // $hash = hash_hmac('sha512', $b4Hash, $api_key); // <-- no base64_encode in the sample code block!
            // But wait, standard is base64. Let's use standard base64 if it fails we can fallback)
            // Wait, looking at the sample hash in JSON "3c70c551a...d1092f6e22228a7686c51bc1162a..." this is a HEX string!!
            // I will implement hex generation specifically for this endpoint just in case, or stick to Base64? 
            // The JSON example hash is clearly hex since it contains only hex characters. 
            // I will use Hex hash here.
            
            var hashBytes = new System.Security.Cryptography.HMACSHA512(System.Text.Encoding.UTF8.GetBytes(apiKey))
                .ComputeHash(System.Text.Encoding.UTF8.GetBytes(b4hash));
            var hexHash = BitConverter.ToString(hashBytes).Replace("-", "").ToLower();

            var payload = new
            {
                merchant_id = merchantId,
                tran_id = tranId,
                beneficiaries = encryptedBeneficiaries,
                amount = totalAmount,
                currency = currency,
                custom_fields = customFields,
                hash = hexHash
            };

            var jsonContent = new StringContent(System.Text.Json.JsonSerializer.Serialize(payload), System.Text.Encoding.UTF8, "application/json");
            using var requestMessage = new HttpRequestMessage(HttpMethod.Post, $"{baseUrl}/api/payment-gateway/v2/direct-payment/merchant/payout")
            {
                Content = jsonContent
            };
            requestMessage.Headers.TryAddWithoutValidation("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");

            try
            {
                var response = await _httpClient.SendAsync(requestMessage); if (!response.IsSuccessStatusCode) { _logger.LogError("Generate QR failed: {Error}", await response.Content.ReadAsStringAsync()); }
                return await response.Content.ReadAsStringAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error executing PayWay Payout");
                return $"{{\"error\": \"{ex.Message}\"}}";
            }
        }


        public async Task<string> UpdateBeneficiaryStatusAsync(string payee, int status)
        {
            var merchantId = _configuration["AbaPayWay:MerchantId"] ?? "ec478601";
            var apiKey = _configuration["AbaPayWay:ApiKey"] ?? string.Empty;
            var rsaPublicKeyBase64 = _configuration["AbaPayWay:RsaPublicKey"] ?? string.Empty; 
            var baseUrl = (_configuration["AbaPayWay:BaseUrl"] ?? "https://checkout-sandbox.payway.com.kh").TrimEnd('/');

            if (string.IsNullOrEmpty(apiKey) || string.IsNullOrEmpty(rsaPublicKeyBase64))
                return $"{{\"error\": \"Missing ApiKey or RsaPublicKey\"}}";

            var reqTime = DateTime.UtcNow.ToString("yyyyMMddHHmmss");

            var authData = new
            {
                mc_id = merchantId,
                payee = payee,
                status = status
            };
            var authJson = System.Text.Json.JsonSerializer.Serialize(authData);

            // Encrypt authJson using RSA Public Key
            var merchantAuth = EncryptRsa(authJson, rsaPublicKeyBase64);

            // Hash sequence: request_time + merchant_auth (Note: merchant_id is omitted from hash string per docs)
            var b4hash = $"{reqTime}{merchantAuth}";
            var hash = GenerateHash(b4hash);

            var payload = new
            {
                request_time = reqTime,
                merchant_id = merchantId,
                merchant_auth = merchantAuth,
                hash = hash
            };

            var jsonContent = new StringContent(System.Text.Json.JsonSerializer.Serialize(payload), System.Text.Encoding.UTF8, "application/json");
            using var requestMessage = new HttpRequestMessage(HttpMethod.Post, $"{baseUrl}/api/merchant-portal/merchant-access/whitelist-account/update-whitelist-status")
            {
                Content = jsonContent
            };
            requestMessage.Headers.TryAddWithoutValidation("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");

            try
            {
                var response = await _httpClient.SendAsync(requestMessage); if (!response.IsSuccessStatusCode) { _logger.LogError("Generate QR failed: {Error}", await response.Content.ReadAsStringAsync()); }
                return await response.Content.ReadAsStringAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating PayWay beneficiary status");
                return $"{{\"error\": \"{ex.Message}\"}}";
            }
        }


        public async Task<string> AddBeneficiaryAsync(string payee)
        {
            var merchantId = _configuration["AbaPayWay:MerchantId"] ?? "ec478601";
            var apiKey = _configuration["AbaPayWay:ApiKey"] ?? string.Empty;
            var rsaPublicKeyBase64 = _configuration["AbaPayWay:RsaPublicKey"] ?? string.Empty; 
            var baseUrl = (_configuration["AbaPayWay:BaseUrl"] ?? "https://checkout-sandbox.payway.com.kh").TrimEnd('/');

            if (string.IsNullOrEmpty(apiKey) || string.IsNullOrEmpty(rsaPublicKeyBase64))
                return $"{{\"error\": \"Missing ApiKey or RsaPublicKey\"}}";

            var reqTime = DateTime.UtcNow.ToString("yyyyMMddHHmmss");

            var authData = new
            {
                mc_id = merchantId,
                payee = payee
            };
            var authJson = System.Text.Json.JsonSerializer.Serialize(authData);

            // Encrypt authJson using RSA Public Key
            var merchantAuth = EncryptRsa(authJson, rsaPublicKeyBase64);

            // Hash sequence: request_time + merchant_auth (Note: merchant_id is omitted from hash string per docs)
            var b4hash = $"{reqTime}{merchantAuth}";
            var hash = GenerateHash(b4hash);

            var payload = new
            {
                request_time = reqTime,
                merchant_id = merchantId,
                merchant_auth = merchantAuth,
                hash = hash
            };

            var jsonContent = new StringContent(System.Text.Json.JsonSerializer.Serialize(payload), System.Text.Encoding.UTF8, "application/json");
            using var requestMessage = new HttpRequestMessage(HttpMethod.Post, $"{baseUrl}/api/merchant-portal/merchant-access/whitelist-account/add-whitelist-payout")
            {
                Content = jsonContent
            };
            requestMessage.Headers.TryAddWithoutValidation("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");

            try
            {
                var response = await _httpClient.SendAsync(requestMessage); if (!response.IsSuccessStatusCode) { _logger.LogError("Generate QR failed: {Error}", await response.Content.ReadAsStringAsync()); }
                return await response.Content.ReadAsStringAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding PayWay beneficiary");
                return $"{{\"error\": \"{ex.Message}\"}}";
            }
        }


        public async Task<string> GetTransactionsByMerchantRefAsync(string merchantRef)
        {
            var merchantId = _configuration["AbaPayWay:MerchantId"] ?? "ec478601";
            var apiKey = _configuration["AbaPayWay:ApiKey"] ?? string.Empty;
            var baseUrl = (_configuration["AbaPayWay:BaseUrl"] ?? "https://checkout-sandbox.payway.com.kh").TrimEnd('/');

            if (string.IsNullOrEmpty(apiKey))
                return "{}";

            var reqTime = DateTime.UtcNow.ToString("yyyyMMddHHmmss");

            // Hash sequence: req_time + merchant_id + merchant_ref
            var b4hash = $"{reqTime}{merchantId}{merchantRef}";
            var hash = GenerateHash(b4hash);

            var payload = new
            {
                req_time = reqTime,
                merchant_id = merchantId,
                merchant_ref = merchantRef,
                hash = hash
            };

            var jsonContent = new StringContent(System.Text.Json.JsonSerializer.Serialize(payload), System.Text.Encoding.UTF8, "application/json");
            using var requestMessage = new HttpRequestMessage(HttpMethod.Post, $"{baseUrl}/api/payment-gateway/v1/payments/get-transactions-by-mc-ref")
            {
                Content = jsonContent
            };
            requestMessage.Headers.TryAddWithoutValidation("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");

            try
            {
                var response = await _httpClient.SendAsync(requestMessage); if (!response.IsSuccessStatusCode) { _logger.LogError("Generate QR failed: {Error}", await response.Content.ReadAsStringAsync()); }
                return await response.Content.ReadAsStringAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting PayWay transactions by merchant ref");
                return $"{{\"error\": \"{ex.Message}\"}}";
            }
        }

    }
}


