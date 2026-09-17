import sys

with open(r'd:\TopUP\backend\MLBBTopUp.Infrastructure\Services\AbaPayWayService.cs', 'r', encoding='utf8') as f:
    text = f.read()

# Add to interface
if 'Task<PayWayCreateResult> LinkCardAsync' not in text:
    old_interface = 'Task<string> LinkAccountAsync(string ctid, string currency = "USD");'
    new_interface = 'Task<string> LinkAccountAsync(string ctid, string currency = "USD");\n        Task<PayWayCreateResult> LinkCardAsync(string ctid, string currency = "USD");'
    text = text.replace(old_interface, new_interface)

new_method = """
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
            
            // Registering the card link transaction by POSTing to the API (Optional, but safe if it behaves like /purchase)
            try
            {
                using var purchaseReq = new HttpRequestMessage(HttpMethod.Post, purchaseUrl)
                {
                    Content = new FormUrlEncodedContent(formData)
                };
                purchaseReq.Headers.TryAddWithoutValidation("User-Agent", "Mozilla/5.0");
                await _httpClient.SendAsync(purchaseReq);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to call link-card API server-to-server");
            }

            return new PayWayCreateResult
            {
                Success = true,
                TranId = requestId,
                PurchaseUrl = purchaseUrl,
                Hash = hash,
                FormData = formData
            };
        }
"""

if 'public async Task<PayWayCreateResult> LinkCardAsync' not in text:
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
    /// Initiate a Link Card request for Credentials on File (CoF)
    /// </summary>
    [HttpPost("link-card")]
    [AllowAnonymous]
    public async Task<IActionResult> LinkCard([FromBody] dynamic payload)
    {
        string ctid = payload.ctid; // Custom User ID
        var details = await _abaPayWayService.LinkCardAsync(ctid);
        return Content(System.Text.Json.JsonSerializer.Serialize(details), "application/json");
    }
"""

if 'LinkCard' not in ctrl_text:
    ctrl_text = ctrl_text.rstrip()
    if ctrl_text.endswith('}'):
        ctrl_text = ctrl_text[:-1] + new_ctrl + '}\n'
        
with open(r'd:\TopUP\backend\MLBBTopUp.API\Controllers\PayWayController.cs', 'w', encoding='utf8') as f:
    f.write(ctrl_text)

print("Done")
