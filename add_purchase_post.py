import sys

with open(r'd:\TopUP\backend\MLBBTopUp.Infrastructure\Services\AbaPayWayService.cs', 'r', encoding='utf8') as f:
    content = f.read()

# Replace the block in CreatePaymentAsync
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

with open(r'd:\TopUP\backend\MLBBTopUp.Infrastructure\Services\AbaPayWayService.cs', 'w', encoding='utf8') as f:
    f.write(content)
print("Done!")
