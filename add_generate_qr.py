import sys

with open(r'd:\TopUP\backend\MLBBTopUp.Infrastructure\Services\AbaPayWayService.cs', 'r', encoding='utf8') as f:
    text = f.read()

# Add to interface
if 'Task<string> GenerateQrAsync' not in text:
    old_interface = 'Task<string> RemoveTokenAsync(string ctid, string pwt);'
    new_interface = 'Task<string> RemoveTokenAsync(string ctid, string pwt);\n        Task<string> GenerateQrAsync(int orderId, decimal amount, string currency = "USD");'
    text = text.replace(old_interface, new_interface)

new_method = """
        public async Task<string> GenerateQrAsync(int orderId, decimal amount, string currency = "USD")
        {
            var merchantId = _configuration["AbaPayWay:MerchantId"] ?? "ec478601";
            var apiKey = _configuration["AbaPayWay:ApiKey"] ?? string.Empty;
            var baseUrl = (_configuration["AbaPayWay:BaseUrl"] ?? "https://checkout-sandbox.payway.com.kh").TrimEnd('/');

            if (string.IsNullOrEmpty(apiKey))
                return "{}";

            var reqTime = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
            var tranId = $"TRX{orderId}-{DateTime.UtcNow.Ticks.ToString().Substring(8, 5)}";
            var amtStr = amount.ToString("F2");
            var firstName = "";
            var lastName = "";
            var email = "";
            var phone = "";
            var purchaseType = "purchase";
            var paymentOption = "abapay_khqr";
            
            var itemsArray = new[] { new { name = $"Order #{orderId}", quantity = 1, price = amount } };
            var itemsBase64 = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(System.Text.Json.JsonSerializer.Serialize(itemsArray)));
            
            var callbackUrl = "";
            var returnDeeplink = "";
            var customFields = "";
            var returnParams = "";
            var payout = "";
            var lifetime = "6";
            var qrImageTemplate = "template3_color";

            // Hash sequence: req_time + merchant_id + tran_id + amount + items + first_name + last_name + email + phone + purchase_type + payment_option + callback_url + return_deeplink + currency + custom_fields + return_params + payout + lifetime + qr_image_template
            var b4hash = $"{reqTime}{merchantId}{tranId}{amtStr}{itemsBase64}{firstName}{lastName}{email}{phone}{purchaseType}{paymentOption}{callbackUrl}{returnDeeplink}{currency}{customFields}{returnParams}{payout}{lifetime}{qrImageTemplate}";
            var hash = GenerateHash(b4hash);

            var payload = new
            {
                req_time = reqTime,
                merchant_id = merchantId,
                tran_id = tranId,
                first_name = firstName,
                last_name = lastName,
                email = email,
                phone = phone,
                amount = amount,
                currency = currency,
                purchase_type = purchaseType,
                payment_option = paymentOption,
                items = itemsBase64,
                callback_url = callbackUrl,
                return_deeplink = returnDeeplink,
                custom_fields = customFields,
                return_params = returnParams,
                payout = payout,
                lifetime = int.Parse(lifetime),
                qr_image_template = qrImageTemplate,
                hash = hash
            };

            var jsonContent = new StringContent(System.Text.Json.JsonSerializer.Serialize(payload), System.Text.Encoding.UTF8, "application/json");
            using var requestMessage = new HttpRequestMessage(HttpMethod.Post, $"{baseUrl}/api/payment-gateway/v1/payments/generate-qr")
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
                _logger.LogError(ex, "Error generating PayWay QR");
                return $"{{\\"error\\": \\"{ex.Message}\\"}}";
            }
        }
"""

if 'public async Task<string> GenerateQrAsync' not in text:
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
    /// Dedicated API to generate ABA KHQR JSON response
    /// </summary>
    [HttpPost("generate-qr")]
    [AllowAnonymous]
    public async Task<IActionResult> GenerateQr([FromBody] dynamic payload)
    {
        int orderId = payload.orderId; 
        decimal amount = payload.amount; 
        var details = await _abaPayWayService.GenerateQrAsync(orderId, amount);
        return Content(details, "application/json");
    }
"""

if 'GenerateQr(' not in ctrl_text:
    ctrl_text = ctrl_text.rstrip()
    if ctrl_text.endswith('}'):
        ctrl_text = ctrl_text[:-1] + new_ctrl + '}\n'
        
with open(r'd:\TopUP\backend\MLBBTopUp.API\Controllers\PayWayController.cs', 'w', encoding='utf8') as f:
    f.write(ctrl_text)

print("Done")
