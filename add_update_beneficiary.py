import sys

with open(r'd:\TopUP\backend\MLBBTopUp.Infrastructure\Services\AbaPayWayService.cs', 'r', encoding='utf8') as f:
    text = f.read()

# Add to interface
if 'Task<string> UpdateBeneficiaryStatusAsync' not in text:
    old_interface = 'Task<string> PayoutAsync(string tranId, decimal totalAmount, object beneficiaries, string currency = "USD");'
    new_interface = 'Task<string> PayoutAsync(string tranId, decimal totalAmount, object beneficiaries, string currency = "USD");\n        Task<string> UpdateBeneficiaryStatusAsync(string payee, int status);'
    text = text.replace(old_interface, new_interface)

new_method = """
        public async Task<string> UpdateBeneficiaryStatusAsync(string payee, int status)
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
                payee = payee,
                status = status
            };
            var authJson = System.Text.Json.JsonSerializer.Serialize(authData);

            // Encrypt authJson using RSA Public Key
            var merchantAuth = EncryptRsa(authJson, rsaPublicKeyBase64);

            // Hash sequence: request_time + merchant_auth (Note: merchant_id is omitted from hash string per docs)
            var b4hash = $"{reqTime}{merchantAuth}";
            var hash = GenerateHash(b4hash);

            var payload = new
            {
                request_time = reqTime,
                merchant_id = merchantId,
                merchant_auth = merchantAuth,
                hash = hash
            };

            var jsonContent = new StringContent(System.Text.Json.JsonSerializer.Serialize(payload), System.Text.Encoding.UTF8, "application/json");
            using var requestMessage = new HttpRequestMessage(HttpMethod.Post, $"{baseUrl}/api/merchant-portal/merchant-access/whitelist-account/update-whitelist-status")
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
                _logger.LogError(ex, "Error updating PayWay beneficiary status");
                return $"{{\\"error\\": \\"{ex.Message}\\"}}";
            }
        }
"""

if 'public async Task<string> UpdateBeneficiaryStatusAsync' not in text:
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
    /// Update/Toggle Whitelist Beneficiary Status
    /// </summary>
    [HttpPost("update-beneficiary")]
    [AllowAnonymous]
    public async Task<IActionResult> UpdateBeneficiary([FromBody] dynamic payload)
    {
        string payee = payload.payee;
        int status = payload.status; // 1 = Active, 0 = Inactive
        var details = await _abaPayWayService.UpdateBeneficiaryStatusAsync(payee, status);
        return Content(details, "application/json");
    }
"""

if 'UpdateBeneficiary(' not in ctrl_text:
    ctrl_text = ctrl_text.rstrip()
    if ctrl_text.endswith('}'):
        ctrl_text = ctrl_text[:-1] + new_ctrl + '}\n'
        
with open(r'd:\TopUP\backend\MLBBTopUp.API\Controllers\PayWayController.cs', 'w', encoding='utf8') as f:
    f.write(ctrl_text)

print("Done")
