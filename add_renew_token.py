import sys

with open(r'd:\TopUP\backend\MLBBTopUp.Infrastructure\Services\AbaPayWayService.cs', 'r', encoding='utf8') as f:
    text = f.read()

# Add to interface
if 'Task<string> RenewTokenAsync' not in text:
    old_interface = 'Task<PayWayCreateResult> LinkCardAsync(string ctid, string currency = "USD");'
    new_interface = 'Task<PayWayCreateResult> LinkCardAsync(string ctid, string currency = "USD");\n        Task<string> RenewTokenAsync(string ctid, string pwt);'
    text = text.replace(old_interface, new_interface)

new_method = """
        public async Task<string> RenewTokenAsync(string ctid, string pwt)
        {
            var merchantId = _configuration["AbaPayWay:MerchantId"] ?? "ec478601";
            var apiKey = _configuration["AbaPayWay:ApiKey"] ?? string.Empty;
            var baseUrl = (_configuration["AbaPayWay:BaseUrl"] ?? "https://checkout-sandbox.payway.com.kh").TrimEnd('/');

            if (string.IsNullOrEmpty(apiKey))
                return "{}";

            var reqTime = DateTime.UtcNow.ToString("yyyyMMddHHmmss");
            var requestId = Guid.NewGuid().ToString("N").Substring(0, 20); // 20 chars

            // Hash sequence: ctid + request_time + pwt + merchant_id + request_id
            var b4hash = $"{ctid}{reqTime}{pwt}{merchantId}{requestId}";
            var hash = GenerateHash(b4hash);

            var payload = new
            {
                request_time = reqTime,
                merchant_id = merchantId,
                request_id = requestId,
                ctid = ctid,
                pwt = pwt,
                hash = hash
            };

            var jsonContent = new StringContent(System.Text.Json.JsonSerializer.Serialize(payload), System.Text.Encoding.UTF8, "application/json");
            using var requestMessage = new HttpRequestMessage(HttpMethod.Post, $"{baseUrl}/api/payment-credential/v3/token-management/renew-expired-account-token")
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
                _logger.LogError(ex, "Error renewing PayWay token");
                return $"{{\\"error\\": \\"{ex.Message}\\"}}";
            }
        }
"""

if 'public async Task<string> RenewTokenAsync' not in text:
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
    /// Renew an expired Credentials on File token
    /// </summary>
    [HttpPost("renew-token")]
    [AllowAnonymous]
    public async Task<IActionResult> RenewToken([FromBody] dynamic payload)
    {
        string ctid = payload.ctid; 
        string pwt = payload.pwt; 
        var details = await _abaPayWayService.RenewTokenAsync(ctid, pwt);
        return Content(details, "application/json");
    }
"""

if 'RenewToken' not in ctrl_text:
    ctrl_text = ctrl_text.rstrip()
    if ctrl_text.endswith('}'):
        ctrl_text = ctrl_text[:-1] + new_ctrl + '}\n'
        
with open(r'd:\TopUP\backend\MLBBTopUp.API\Controllers\PayWayController.cs', 'w', encoding='utf8') as f:
    f.write(ctrl_text)

print("Done")
