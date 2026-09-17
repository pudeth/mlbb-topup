import sys

with open(r'd:\TopUP\backend\MLBBTopUp.Infrastructure\Services\AbaPayWayService.cs', 'r', encoding='utf8') as f:
    text = f.read()

# Add to interface
if 'Task<string> GetTokenDetailsAsync' not in text:
    old_interface = 'Task<string> RenewTokenAsync(string ctid, string pwt);'
    new_interface = 'Task<string> RenewTokenAsync(string ctid, string pwt);\n        Task<string> GetTokenDetailsAsync(string requestId);'
    text = text.replace(old_interface, new_interface)

new_method = """
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
                var response = await _httpClient.SendAsync(requestMessage);
                return await response.Content.ReadAsStringAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting PayWay token details");
                return $"{{\\"error\\": \\"{ex.Message}\\"}}";
            }
        }
"""

if 'public async Task<string> GetTokenDetailsAsync' not in text:
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
    /// Retrieve CoF Token Details manually if webhook fails
    /// </summary>
    [HttpGet("token-details/{requestId}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetTokenDetails(string requestId)
    {
        var details = await _abaPayWayService.GetTokenDetailsAsync(requestId);
        return Content(details, "application/json");
    }
"""

if 'GetTokenDetails' not in ctrl_text:
    ctrl_text = ctrl_text.rstrip()
    if ctrl_text.endswith('}'):
        ctrl_text = ctrl_text[:-1] + new_ctrl + '}\n'
        
with open(r'd:\TopUP\backend\MLBBTopUp.API\Controllers\PayWayController.cs', 'w', encoding='utf8') as f:
    f.write(ctrl_text)

print("Done")
