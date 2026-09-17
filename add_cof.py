import sys

with open(r'd:\TopUP\backend\MLBBTopUp.Infrastructure\Services\AbaPayWayService.cs', 'r', encoding='utf8') as f:
    text = f.read()

if 'Task<string> CreateTokenPaymentAsync' not in text:
    text = text.replace('Task<string> GetExchangeRateAsync();',
                        'Task<string> GetExchangeRateAsync();\n        Task<string> CreateTokenPaymentAsync(string token, int orderId, decimal amount, string currency = "USD");')

new_method = """
        public async Task<string> CreateTokenPaymentAsync(string token, int orderId, decimal amount, string currency = "USD")
        {
            var merchantId = _configuration["AbaPayWay:MerchantId"] ?? "ec478601";
            var apiKey = _configuration["AbaPayWay:ApiKey"] ?? string.Empty;
            var baseUrl = (_configuration["AbaPayWay:BaseUrl"] ?? "https://checkout-sandbox.payway.com.kh").TrimEnd('/');

            if (string.IsNullOrEmpty(apiKey))
                return "{}";

            var reqTime = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
            var tranId = $"TRX{orderId}-{DateTime.UtcNow.Ticks.ToString().Substring(8, 5)}";
            var amtStr = amount.ToString("F2");
            
            // NOTE: The exact hashing sequence for Credentials on File (CoF) purchases
            // will depend on the official ABA PayWay CoF Documentation. 
            // We are using a placeholder hash sequence here until we get the exact parameters from the CoF API docs.
            var b4hash = $"{reqTime}{merchantId}{tranId}{amtStr}{token}";
            var hash = GenerateHash(b4hash);

            var payload = new
            {
                req_time = reqTime,
                merchant_id = merchantId,
                tran_id = tranId,
                amount = amtStr,
                payment_token = token,
                hash = hash
            };

            var jsonContent = new StringContent(System.Text.Json.JsonSerializer.Serialize(payload), System.Text.Encoding.UTF8, "application/json");
            
            // NOTE: This URL is a placeholder. 
            using var requestMessage = new HttpRequestMessage(HttpMethod.Post, $"{baseUrl}/api/payment-gateway/v1/payments/purchase-by-token")
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
                _logger.LogError(ex, "Error executing PayWay CoF transaction");
                return $"{{\\"error\\": \\"{ex.Message}\\"}}";
            }
        }
"""

if 'public async Task<string> CreateTokenPaymentAsync' not in text:
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
    /// Execute a Credentials on File (CoF) automatic payment
    /// </summary>
    [HttpPost("cof-purchase")]
    [AllowAnonymous]
    public async Task<IActionResult> CofPurchase([FromBody] dynamic payload)
    {
        // NOTE: Placeholder endpoint for Credentials on File
        string token = payload.token;
        int orderId = payload.orderId;
        decimal amount = payload.amount;
        
        var details = await _abaPayWayService.CreateTokenPaymentAsync(token, orderId, amount);
        return Content(details, "application/json");
    }
}"""

if 'CofPurchase' not in ctrl_text:
    ctrl_text = ctrl_text.rstrip()
    if ctrl_text.endswith('}'):
        ctrl_text = ctrl_text[:-1] + new_ctrl + '\n'
        
with open(r'd:\TopUP\backend\MLBBTopUp.API\Controllers\PayWayController.cs', 'w', encoding='utf8') as f:
    f.write(ctrl_text)

print("Done")
