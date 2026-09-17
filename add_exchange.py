import re

with open(r'd:\TopUP\backend\MLBBTopUp.Infrastructure\Services\AbaPayWayService.cs', 'r', encoding='utf8') as f:
    text = f.read()

if 'Task<string> GetExchangeRateAsync()' not in text:
    text = text.replace('Task<string> GetTransactionListAsync(string fromDate, string toDate, string fromAmount, string toAmount, string status, string page, string pagination);',
                        'Task<string> GetTransactionListAsync(string fromDate, string toDate, string fromAmount, string toAmount, string status, string page, string pagination);\n        Task<string> GetExchangeRateAsync();')

new_method = """
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
                var response = await _httpClient.SendAsync(requestMessage);
                return await response.Content.ReadAsStringAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting PayWay exchange rate");
                return $"{{\\"error\\": \\"{ex.Message}\\"}}";
            }
        }
"""

if 'public async Task<string> GetExchangeRateAsync()' not in text:
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
    /// Get exchange rate from ABA PayWay
    /// </summary>
    [HttpGet("exchange-rate")]
    [AllowAnonymous]
    public async Task<IActionResult> GetExchangeRate()
    {
        var details = await _abaPayWayService.GetExchangeRateAsync();
        return Content(details, "application/json");
    }
}"""

if 'GetExchangeRate' not in ctrl_text:
    ctrl_text = ctrl_text.rstrip()
    if ctrl_text.endswith('}'):
        ctrl_text = ctrl_text[:-1] + new_ctrl + '\n'
        
with open(r'd:\TopUP\backend\MLBBTopUp.API\Controllers\PayWayController.cs', 'w', encoding='utf8') as f:
    f.write(ctrl_text)

print("Done")
