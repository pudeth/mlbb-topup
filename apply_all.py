import sys

with open(r'd:\TopUP\backend\MLBBTopUp.Infrastructure\Services\AbaPayWayService.cs', 'r', encoding='utf8') as f:
    content = f.read()

# 1. Add GetTransactionDetailsAsync to Interface
content = content.replace('Task<PayWayCheckResult> CheckTransactionAsync(string tranId);',
    'Task<PayWayCheckResult> CheckTransactionAsync(string tranId);\n    Task<string> GetTransactionDetailsAsync(string tranId);')


# 2. Add payment_gate="0"
content = content.replace('{ "lifetime", qrLifetime },\n                { "hash", formHash }',
                          '{ "lifetime", qrLifetime },\n                { "payment_gate", "0" },\n                { "hash", formHash }')

# 3. Add POST to /purchase
old_code = """                catch (Exception apiEx)
                {
                    _logger.LogWarning(apiEx, "Failed to call live PayWay generate-qr API for Order #{OrderId}", orderId);
                }
            }"""
new_code = """                catch (Exception apiEx)
                {
                    _logger.LogWarning(apiEx, "Failed to call live PayWay generate-qr API for Order #{OrderId}", orderId);
                }

                try
                {
                    var purchaseApiUrl = $"{baseUrl}/api/payment-gateway/v1/payments/purchase";
                    var purchaseHash = GeneratePurchaseHash(reqTime, merchantId, tranId, amtStr, itemsBase64,
                        "", firstName, lastName, email, phone, purchaseType, "",
                        "", "", "", "", paywayCurrency, "", "", "", qrLifetime, "", "", "");

                    var purchasePayload = new Dictionary<string, string>
                    {
                        { "req_time", reqTime },
                        { "merchant_id", merchantId },
                        { "tran_id", tranId },
                        { "amount", amtStr },
                        { "items", itemsBase64 },
                        { "firstname", firstName },
                        { "lastname", lastName },
                        { "email", email },
                        { "phone", phone },
                        { "type", purchaseType },
                        { "payment_option", "" },
                        { "currency", paywayCurrency },
                        { "lifetime", qrLifetime },
                        { "hash", purchaseHash }
                    };

                    using var purchaseReq = new HttpRequestMessage(HttpMethod.Post, purchaseApiUrl)
                    {
                        Content = new FormUrlEncodedContent(purchasePayload)
                    };
                    purchaseReq.Headers.TryAddWithoutValidation("User-Agent", "Mozilla/5.0");
                    await _httpClient.SendAsync(purchaseReq);
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to call /purchase API");
                }
            }"""
content = content.replace(old_code, new_code)


# 4. Add GetTransactionDetailsAsync method implementation
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

# Append just before the final '}'
content = content.rstrip()
if content.endswith('}'):
    content = content[:-1] + new_method + '}\n'

with open(r'd:\TopUP\backend\MLBBTopUp.Infrastructure\Services\AbaPayWayService.cs', 'w', encoding='utf8') as f:
    f.write(content)
print("Done!")
