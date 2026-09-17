import sys

with open(r'd:\TopUP\backend\MLBBTopUp.Infrastructure\Services\AbaPayWayService.cs', 'r', encoding='utf8') as f:
    text = f.read()

# Replace CreateTokenPaymentAsync implementation
old_method = r"""        public async Task<string> CreateTokenPaymentAsync\(string token, int orderId, decimal amount, string currency = "USD"\)
        \{
.*?
            catch \(Exception ex\)
            \{
                _logger\.LogError\(ex, "Error executing PayWay CoF transaction"\);
                return \$"\{\{\\"error\\": \\"\{ex\.Message\}\\"\}\}";
            \}
        \}"""

import re
match = re.search(old_method, text, flags=re.DOTALL)

new_method = """        public async Task<string> CreateTokenPaymentAsync(string token, int orderId, decimal amount, string ctid, string tokenFlag = "CITU_FLEX", string currency = "USD")
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
                var response = await _httpClient.SendAsync(requestMessage);
                return await response.Content.ReadAsStringAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error executing PayWay CoF transaction");
                return $"{{\\"error\\": \\"{ex.Message}\\"}}";
            }
        }"""

if match:
    text = text.replace(match.group(0), new_method)
else:
    print("Could not find method to replace")
    
# Update Interface
text = text.replace('Task<string> CreateTokenPaymentAsync(string token, int orderId, decimal amount, string currency = "USD");',
                    'Task<string> CreateTokenPaymentAsync(string token, int orderId, decimal amount, string ctid, string tokenFlag = "CITU_FLEX", string currency = "USD");')

with open(r'd:\TopUP\backend\MLBBTopUp.Infrastructure\Services\AbaPayWayService.cs', 'w', encoding='utf8') as f:
    f.write(text)


with open(r'd:\TopUP\backend\MLBBTopUp.API\Controllers\PayWayController.cs', 'r', encoding='utf8') as f:
    ctrl_text = f.read()

import re
old_ctrl = r"""    public async Task<IActionResult> CofPurchase\(\[FromBody\] dynamic payload\)
    \{
        // NOTE: Placeholder endpoint for Credentials on File
        string token = payload.token;
        int orderId = payload.orderId;
        decimal amount = payload.amount;
        
        var details = await _abaPayWayService.CreateTokenPaymentAsync\(token, orderId, amount\);
        return Content\(details, "application/json"\);
    \}"""

new_ctrl = """    public async Task<IActionResult> CofPurchase([FromBody] dynamic payload)
    {
        string token = payload.token;
        int orderId = payload.orderId;
        decimal amount = payload.amount;
        string ctid = payload.ctid;
        string tokenFlag = payload.tokenFlag ?? "CITU_FLEX"; // Defaults to Unscheduled Customer Initiated
        
        var details = await _abaPayWayService.CreateTokenPaymentAsync(token, orderId, amount, ctid, tokenFlag);
        return Content(details, "application/json");
    }"""

ctrl_match = re.search(old_ctrl, ctrl_text)
if ctrl_match:
    ctrl_text = ctrl_text.replace(ctrl_match.group(0), new_ctrl)

with open(r'd:\TopUP\backend\MLBBTopUp.API\Controllers\PayWayController.cs', 'w', encoding='utf8') as f:
    f.write(ctrl_text)

print("Done")
