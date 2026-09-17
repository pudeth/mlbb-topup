import sys

with open(r'd:\TopUP\backend\MLBBTopUp.Infrastructure\Services\AbaPayWayService.cs', 'r', encoding='utf8') as f:
    text = f.read()

# Add to interface
if 'Task<string> PayoutAsync' not in text:
    old_interface = 'Task<string> CancelPreAuthAsync(string tranId);'
    new_interface = 'Task<string> CancelPreAuthAsync(string tranId);\n        Task<string> PayoutAsync(string tranId, decimal totalAmount, object beneficiaries, string currency = "USD");'
    text = text.replace(old_interface, new_interface)

new_method = """
        public async Task<string> PayoutAsync(string tranId, decimal totalAmount, object beneficiaries, string currency = "USD")
        {
            var merchantId = _configuration["AbaPayWay:MerchantId"] ?? "ec478601";
            var apiKey = _configuration["AbaPayWay:ApiKey"] ?? string.Empty;
            var rsaPublicKeyBase64 = _configuration["AbaPayWay:RsaPublicKey"] ?? string.Empty; 
            var baseUrl = (_configuration["AbaPayWay:BaseUrl"] ?? "https://checkout-sandbox.payway.com.kh").TrimEnd('/');

            if (string.IsNullOrEmpty(apiKey) || string.IsNullOrEmpty(rsaPublicKeyBase64))
                return $"{{\\"error\\": \\"Missing ApiKey or RsaPublicKey\\"}}";

            var customFields = "";

            var beneficiariesJson = System.Text.Json.JsonSerializer.Serialize(beneficiaries);

            // Encrypt beneficiaries JSON using RSA Public Key
            var encryptedBeneficiaries = EncryptRsa(beneficiariesJson, rsaPublicKeyBase64);

            var amtStr = totalAmount.ToString("F2");

            // Hash sequence: merchant_id + tran_id + beneficiaries + amount + custom_fields + currency
            var b4hash = $"{merchantId}{tranId}{encryptedBeneficiaries}{amtStr}{customFields}{currency}";
            
            // NOTE: The PHP sample for Payout uses hash_hmac directly without base64 encoding (wait, the sample says:
            // $hash = hash_hmac('sha512', $b4Hash, $api_key); // <-- no base64_encode in the sample code block!
            // But wait, standard is base64. Let's use standard base64 if it fails we can fallback)
            // Wait, looking at the sample hash in JSON "3c70c551a...d1092f6e22228a7686c51bc1162a..." this is a HEX string!!
            // I will implement hex generation specifically for this endpoint just in case, or stick to Base64? 
            // The JSON example hash is clearly hex since it contains only hex characters. 
            // I will use Hex hash here.
            
            var hashBytes = new System.Security.Cryptography.HMACSHA512(System.Text.Encoding.UTF8.GetBytes(apiKey))
                .ComputeHash(System.Text.Encoding.UTF8.GetBytes(b4hash));
            var hexHash = BitConverter.ToString(hashBytes).Replace("-", "").ToLower();

            var payload = new
            {
                merchant_id = merchantId,
                tran_id = tranId,
                beneficiaries = encryptedBeneficiaries,
                amount = totalAmount,
                currency = currency,
                custom_fields = customFields,
                hash = hexHash
            };

            var jsonContent = new StringContent(System.Text.Json.JsonSerializer.Serialize(payload), System.Text.Encoding.UTF8, "application/json");
            using var requestMessage = new HttpRequestMessage(HttpMethod.Post, $"{baseUrl}/api/payment-gateway/v2/direct-payment/merchant/payout")
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
                _logger.LogError(ex, "Error executing PayWay Payout");
                return $"{{\\"error\\": \\"{ex.Message}\\"}}";
            }
        }
"""

if 'public async Task<string> PayoutAsync' not in text:
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
    /// Distribute funds from merchant settlement account directly to recipients
    /// </summary>
    [HttpPost("payout")]
    [AllowAnonymous]
    public async Task<IActionResult> Payout([FromBody] dynamic payload)
    {
        string tranId = payload.tranId;
        decimal totalAmount = payload.totalAmount;
        
        object beneficiaries = null;
        if (((System.Text.Json.JsonElement)payload).TryGetProperty("beneficiaries", out var benElement))
        {
            beneficiaries = System.Text.Json.JsonSerializer.Deserialize<object>(benElement.GetRawText());
        }

        var details = await _abaPayWayService.PayoutAsync(tranId, totalAmount, beneficiaries);
        return Content(details, "application/json");
    }
"""

if 'Payout(' not in ctrl_text:
    ctrl_text = ctrl_text.rstrip()
    if ctrl_text.endswith('}'):
        ctrl_text = ctrl_text[:-1] + new_ctrl + '}\n'
        
with open(r'd:\TopUP\backend\MLBBTopUp.API\Controllers\PayWayController.cs', 'w', encoding='utf8') as f:
    f.write(ctrl_text)

print("Done")
