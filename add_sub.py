import sys

with open(r'd:\TopUP\backend\MLBBTopUp.Infrastructure\Services\AbaPayWayService.cs', 'r', encoding='utf8') as f:
    text = f.read()

# 1. Add GenerateSubscriptionHash if missing
if 'GenerateSubscriptionHash' not in text:
    old_hash = "return GenerateHash(b4hash);\n        }"
    new_hash = """return GenerateHash(b4hash);
        }

        public string GenerateSubscriptionHash(string reqTime, string merchantId, string tranId, string amount, string items,
            string shipping, string firstName, string lastName, string email, string phone, string type,
            string paymentOption, string returnUrl, string cancelUrl, string continueSuccessUrl,
            string returnDeeplink, string currency, string customFields, string returnParams, string payout,
            string lifetime, string additionalParams, string googlePayToken, string skipSuccessPage,
            string ctid, string tokenFlag, string frequency)
        {
            var b4hash = $"{reqTime}{merchantId}{tranId}{amount}{items}{shipping}{firstName}{lastName}{email}{phone}{type}{paymentOption}{returnUrl}{cancelUrl}{continueSuccessUrl}{returnDeeplink}{currency}{customFields}{returnParams}{payout}{lifetime}{additionalParams}{googlePayToken}{skipSuccessPage}{ctid}{tokenFlag}{frequency}";
            return GenerateHash(b4hash);
        }"""
    text = text.replace(old_hash, new_hash, 1)

# 2. Add CreateSubscriptionPaymentAsync
new_method = """
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
                        returnUrl, cancelUrl, continueSuccessUrl, returnDeeplink, paywayCurrency, "", "", "", qrLifetime, "", "", "",
                        ctid, tokenFlag, frequency);

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
                        { "lifetime", qrLifetime },
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
"""

if 'public async Task<PayWayCreateResult> CreateSubscriptionPaymentAsync' not in text:
    text = text.rstrip()
    if text.endswith('}'): text = text[:-1].rstrip()
    if text.endswith('}'): text = text[:-1].rstrip()
    
    text = text + '\n\n' + new_method + '\n    }\n}\n'

with open(r'd:\TopUP\backend\MLBBTopUp.Infrastructure\Services\AbaPayWayService.cs', 'w', encoding='utf8') as f:
    f.write(text)

with open(r'd:\TopUP\backend\MLBBTopUp.API\Controllers\PayWayController.cs', 'r', encoding='utf8') as f:
    ctrl_text = f.read()

new_ctrl = """
    /// <summary>
    /// Initiate a Scheduled Subscription
    /// </summary>
    [HttpPost("subscribe")]
    [AllowAnonymous]
    public async Task<IActionResult> Subscribe([FromBody] dynamic payload)
    {
        int orderId = payload.orderId;
        decimal amount = payload.amount;
        string ctid = payload.ctid; // Custom User ID
        string frequency = payload.frequency ?? "1M"; // Default to Monthly
        
        var details = await _abaPayWayService.CreateSubscriptionPaymentAsync(orderId, amount, ctid, frequency);
        return Content(System.Text.Json.JsonSerializer.Serialize(details), "application/json");
    }
"""

if 'public async Task<IActionResult> Subscribe' not in ctrl_text:
    ctrl_text = ctrl_text.rstrip()
    if ctrl_text.endswith('}'):
        ctrl_text = ctrl_text[:-1] + new_ctrl + '}\n'
        
with open(r'd:\TopUP\backend\MLBBTopUp.API\Controllers\PayWayController.cs', 'w', encoding='utf8') as f:
    f.write(ctrl_text)

print("Done")
