import sys

with open(r'd:\TopUP\backend\MLBBTopUp.Infrastructure\Services\AbaPayWayService.cs', 'r', encoding='utf8') as f:
    text = f.read()

# Add to interface
if 'Task<string> GetTransactionsByMerchantRefAsync' not in text:
    old_interface = 'Task<string> AddBeneficiaryAsync(string payee);'
    new_interface = 'Task<string> AddBeneficiaryAsync(string payee);\n        Task<string> GetTransactionsByMerchantRefAsync(string merchantRef);'
    text = text.replace(old_interface, new_interface)

new_method = """
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
                var response = await _httpClient.SendAsync(requestMessage);
                return await response.Content.ReadAsStringAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting PayWay transactions by merchant ref");
                return $"{{\\"error\\": \\"{ex.Message}\\"}}";
            }
        }
"""

if 'public async Task<string> GetTransactionsByMerchantRefAsync' not in text:
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
    /// Retrieve up to 50 transactions using a Merchant Reference Number (e.g. Invoice ID)
    /// </summary>
    [HttpGet("transactions-by-ref/{merchantRef}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetTransactionsByRef(string merchantRef)
    {
        var details = await _abaPayWayService.GetTransactionsByMerchantRefAsync(merchantRef);
        return Content(details, "application/json");
    }
"""

if 'GetTransactionsByRef(' not in ctrl_text:
    ctrl_text = ctrl_text.rstrip()
    if ctrl_text.endswith('}'):
        ctrl_text = ctrl_text[:-1] + new_ctrl + '}\n'
        
with open(r'd:\TopUP\backend\MLBBTopUp.API\Controllers\PayWayController.cs', 'w', encoding='utf8') as f:
    f.write(ctrl_text)

print("Done")
