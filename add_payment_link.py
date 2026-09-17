import sys

with open(r'd:\TopUP\backend\MLBBTopUp.Infrastructure\Services\AbaPayWayService.cs', 'r', encoding='utf8') as f:
    text = f.read()

# Add to interface
if 'Task<string> CreatePaymentLinkAsync' not in text:
    old_interface = 'Task<string> GenerateQrAsync(int orderId, decimal amount, string currency = "USD");'
    new_interface = 'Task<string> GenerateQrAsync(int orderId, decimal amount, string currency = "USD");\n        Task<string> CreatePaymentLinkAsync(string title, decimal amount, string returnUrl, string merchantRefNo, string currency = "USD");'
    text = text.replace(old_interface, new_interface)

new_method = """
        public async Task<string> CreatePaymentLinkAsync(string title, decimal amount, string returnUrl, string merchantRefNo, string currency = "USD")
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
                title = title,
                amount = amount.ToString("F2"),
                currency = currency,
                description = "MLBB TopUp Payment Link",
                payment_limit = 1,
                expired_date = DateTimeOffset.UtcNow.AddDays(7).ToUnixTimeSeconds(),
                return_url = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(returnUrl)),
                merchant_ref_no = merchantRefNo
            };
            var authJson = System.Text.Json.JsonSerializer.Serialize(authData);

            // Encrypt authJson using RSA Public Key
            var merchantAuth = EncryptRsa(authJson, rsaPublicKeyBase64);

            // Hash sequence: request_time + merchant_id + merchant_auth
            var b4hash = $"{reqTime}{merchantId}{merchantAuth}";
            var hash = GenerateHash(b4hash);

            using var content = new MultipartFormDataContent();
            content.Add(new StringContent(reqTime), "request_time");
            content.Add(new StringContent(merchantId), "merchant_id");
            content.Add(new StringContent(merchantAuth), "merchant_auth");
            content.Add(new StringContent(hash), "hash");

            using var requestMessage = new HttpRequestMessage(HttpMethod.Post, $"{baseUrl}/api/merchant-portal/merchant-access/payment-link/create")
            {
                Content = content
            };
            requestMessage.Headers.TryAddWithoutValidation("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");

            try
            {
                var response = await _httpClient.SendAsync(requestMessage);
                return await response.Content.ReadAsStringAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating PayWay Payment Link");
                return $"{{\\"error\\": \\"{ex.Message}\\"}}";
            }
        }

        private string EncryptRsa(string source, string publicKeyPem)
        {
            // Simple PEM parser to get raw key bytes
            var publicKeyBase64 = publicKeyPem
                .Replace("-----BEGIN PUBLIC KEY-----", "")
                .Replace("-----END PUBLIC KEY-----", "")
                .Replace("\\n", "")
                .Replace("\\r", "")
                .Trim();
                
            byte[] publicKeyBytes = Convert.FromBase64String(publicKeyBase64);

            using var rsa = System.Security.Cryptography.RSA.Create();
            rsa.ImportSubjectPublicKeyInfo(publicKeyBytes, out _);

            var sourceBytes = System.Text.Encoding.UTF8.GetBytes(source);
            
            // ABA specifies chunked encryption (117 bytes max per chunk for PKCS#1 v1.5 with 1024-bit key)
            int maxLength = 117; 
            int dataLength = sourceBytes.Length;
            int iterations = dataLength / maxLength;
            
            var output = new System.Collections.Generic.List<byte>();
            
            for (int i = 0; i <= iterations; i++)
            {
                int start = i * maxLength;
                int length = Math.Min(maxLength, dataLength - start);
                
                if (length > 0)
                {
                    byte[] temp = new byte[length];
                    Array.Copy(sourceBytes, start, temp, 0, length);
                    
                    byte[] encryptedChunk = rsa.Encrypt(temp, System.Security.Cryptography.RSAEncryptionPadding.Pkcs1);
                    output.AddRange(encryptedChunk);
                }
            }

            return Convert.ToBase64String(output.ToArray());
        }
"""

if 'public async Task<string> CreatePaymentLinkAsync' not in text:
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
    /// Create a manual Payment Link via API
    /// </summary>
    [HttpPost("create-payment-link")]
    [AllowAnonymous]
    public async Task<IActionResult> CreatePaymentLink([FromBody] dynamic payload)
    {
        string title = payload.title ?? "MLBB Diamonds";
        decimal amount = payload.amount;
        string returnUrl = "https://yourdomain.com/api/PayWay/webhook";
        string merchantRefNo = Guid.NewGuid().ToString("N").Substring(0, 20);
        
        var details = await _abaPayWayService.CreatePaymentLinkAsync(title, amount, returnUrl, merchantRefNo);
        return Content(details, "application/json");
    }
"""

if 'CreatePaymentLink' not in ctrl_text:
    ctrl_text = ctrl_text.rstrip()
    if ctrl_text.endswith('}'):
        ctrl_text = ctrl_text[:-1] + new_ctrl + '}\n'
        
with open(r'd:\TopUP\backend\MLBBTopUp.API\Controllers\PayWayController.cs', 'w', encoding='utf8') as f:
    f.write(ctrl_text)

print("Done")
