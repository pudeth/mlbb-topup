import sys

with open(r'd:\TopUP\backend\MLBBTopUp.Infrastructure\Services\AbaPayWayService.cs', 'r', encoding='utf8') as f:
    text = f.read()

# Add to interface
if 'Task<string> LinkAccountAsync' not in text:
    old_interface = 'Task<PayWayCreateResult> CreateSubscriptionPaymentAsync(int orderId, decimal amount, string ctid, string frequency = "1M", string currency = "USD");'
    new_interface = 'Task<PayWayCreateResult> CreateSubscriptionPaymentAsync(int orderId, decimal amount, string ctid, string frequency = "1M", string currency = "USD");\n        Task<string> LinkAccountAsync(string ctid, string currency = "USD");'
    text = text.replace(old_interface, new_interface)

new_method = """
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
                var response = await _httpClient.SendAsync(requestMessage);
                return await response.Content.ReadAsStringAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error linking ABA account");
                return $"{{\\"error\\": \\"{ex.Message}\\"}}";
            }
        }
"""

if 'public async Task<string> LinkAccountAsync' not in text:
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
    /// Initiate a Link Account request for Credentials on File (CoF)
    /// </summary>
    [HttpPost("link-account")]
    [AllowAnonymous]
    public async Task<IActionResult> LinkAccount([FromBody] dynamic payload)
    {
        string ctid = payload.ctid; // Custom User ID
        var details = await _abaPayWayService.LinkAccountAsync(ctid);
        return Content(details, "application/json");
    }
"""

if 'LinkAccount' not in ctrl_text:
    ctrl_text = ctrl_text.rstrip()
    if ctrl_text.endswith('}'):
        ctrl_text = ctrl_text[:-1] + new_ctrl + '}\n'
        
with open(r'd:\TopUP\backend\MLBBTopUp.API\Controllers\PayWayController.cs', 'w', encoding='utf8') as f:
    f.write(ctrl_text)

print("Done")
