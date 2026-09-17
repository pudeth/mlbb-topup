import sys

with open(r'd:\TopUP\backend\MLBBTopUp.Infrastructure\Services\AbaPayWayService.cs', 'r', encoding='utf8') as f:
    text = f.read()

new_method = """
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
                var response = await _httpClient.SendAsync(requestMessage);
                return await response.Content.ReadAsStringAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting PayWay transaction list");
                return $"{{\\"error\\": \\"{ex.Message}\\"}}";
            }
        }
"""

if 'public async Task<string> GetTransactionListAsync' not in text:
    text = text.rstrip()
    if text.endswith('}'): text = text[:-1].rstrip()
    if text.endswith('}'): text = text[:-1].rstrip()
    
    text = text + '\n\n' + new_method + '\n    }\n}\n'

with open(r'd:\TopUP\backend\MLBBTopUp.Infrastructure\Services\AbaPayWayService.cs', 'w', encoding='utf8') as f:
    f.write(text)

print("Done")
