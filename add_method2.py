import sys

with open(r'd:\TopUP\backend\MLBBTopUp.Infrastructure\Services\AbaPayWayService.cs', 'r', encoding='utf8') as f:
    content = f.read()

# 1. Add to Interface
content = content.replace('Task<PayWayCheckResult> CheckTransactionAsync(string tranId);',
    'Task<PayWayCheckResult> CheckTransactionAsync(string tranId);\n        Task<string> GetTransactionDetailsAsync(string tranId);')

# 2. Add payment_gate="0"
content = content.replace('{ "lifetime", qrLifetime },\n                { "hash", formHash }',
                          '{ "lifetime", qrLifetime },\n                { "payment_gate", "0" },\n                { "hash", formHash }')

new_method = """
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
            requestMessage.Headers.TryAddWithoutValidation("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");

            try
            {
                var response = await _httpClient.SendAsync(requestMessage);
                return await response.Content.ReadAsStringAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting PayWay transaction details {TranId}", tranId);
                return $"{{\\"error\\": \\"{ex.Message}\\"}}";
            }
        }
"""

# 3. Add Method at the very end of the file, right before the last two closing braces
parts = content.rsplit('}\n}', 1)
content = parts[0] + new_method + '    }\n}'

with open(r'd:\TopUP\backend\MLBBTopUp.Infrastructure\Services\AbaPayWayService.cs', 'w', encoding='utf8') as f:
    f.write(content)
print("Done!")
