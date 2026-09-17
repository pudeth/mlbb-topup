import sys

with open(r'd:\TopUP\backend\MLBBTopUp.Infrastructure\Services\AbaPayWayService.cs', 'r', encoding='utf8') as f:
    text = f.read()

# Add to interface
if 'Task<string> CancelPreAuthAsync' not in text:
    old_interface = 'Task<string> CompletePreAuthAsync(string tranId, decimal completeAmount, object payout = null);'
    new_interface = 'Task<string> CompletePreAuthAsync(string tranId, decimal completeAmount, object payout = null);\n        Task<string> CancelPreAuthAsync(string tranId);'
    text = text.replace(old_interface, new_interface)

new_method = """
        public async Task<string> CancelPreAuthAsync(string tranId)
        {
            var merchantId = _configuration["AbaPayWay:MerchantId"] ?? "ec478601";
            var apiKey = _configuration["AbaPayWay:ApiKey"] ?? string.Empty;
            var rsaPublicKeyBase64 = _configuration["AbaPayWay:RsaPublicKey"] ?? string.Empty; 
            var baseUrl = (_configuration["AbaPayWay:BaseUrl"] ?? "https://checkout-sandbox.payway.com.kh").TrimEnd('/');

            if (string.IsNullOrEmpty(apiKey) || string.IsNullOrEmpty(rsaPublicKeyBase64))
                return $"{{\\"error\\": \\"Missing ApiKey or RsaPublicKey\\"}}";

            var reqTime = DateTime.UtcNow.ToString("yyyyMMddHHmmss");

            var authData = new
            {
                mc_id = merchantId,
                tran_id = tranId
            };
            var authJson = System.Text.Json.JsonSerializer.Serialize(authData);

            // Encrypt authJson using RSA Public Key
            var merchantAuth = EncryptRsa(authJson, rsaPublicKeyBase64);

            // Hash sequence: merchant_id + merchant_auth + request_time
            var b4hash = $"{merchantId}{merchantAuth}{reqTime}";
            var hash = GenerateHash(b4hash);

            var payload = new
            {
                request_time = reqTime,
                merchant_id = merchantId,
                merchant_auth = merchantAuth,
                hash = hash
            };

            var jsonContent = new StringContent(System.Text.Json.JsonSerializer.Serialize(payload), System.Text.Encoding.UTF8, "application/json");
            using var requestMessage = new HttpRequestMessage(HttpMethod.Post, $"{baseUrl}/api/merchant-portal/merchant-access/online-transaction/pre-auth-cancellation")
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
                _logger.LogError(ex, "Error cancelling PayWay pre-auth");
                return $"{{\\"error\\": \\"{ex.Message}\\"}}";
            }
        }
"""

if 'public async Task<string> CancelPreAuthAsync' not in text:
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
    /// Cancel/Release a Pre-Authorized Transaction
    /// </summary>
    [HttpPost("cancel-pre-auth")]
    [AllowAnonymous]
    public async Task<IActionResult> CancelPreAuth([FromBody] dynamic payload)
    {
        string tranId = payload.tranId;
        var details = await _abaPayWayService.CancelPreAuthAsync(tranId);
        return Content(details, "application/json");
    }
"""

if 'CancelPreAuth(' not in ctrl_text:
    ctrl_text = ctrl_text.rstrip()
    if ctrl_text.endswith('}'):
        ctrl_text = ctrl_text[:-1] + new_ctrl + '}\n'
        
with open(r'd:\TopUP\backend\MLBBTopUp.API\Controllers\PayWayController.cs', 'w', encoding='utf8') as f:
    f.write(ctrl_text)

print("Done")
