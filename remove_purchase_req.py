import sys

with open(r'd:\TopUP\backend\MLBBTopUp.Infrastructure\Services\AbaPayWayService.cs', 'r', encoding='utf8') as f:
    text = f.read()

# Strip out the first purchaseReq block
block1 = """                            // Post to purchase to register the transaction
                            try
                            {
                                using var purchaseReq = new HttpRequestMessage(HttpMethod.Post, purchaseUrl)
                                {
                                    Content = new FormUrlEncodedContent(formData)
                                };
                                purchaseReq.Headers.TryAddWithoutValidation("User-Agent", "Mozilla/5.0");
                                await _httpClient.SendAsync(purchaseReq);
                            }
                            catch (Exception ex)
                            {
                                _logger.LogWarning(ex, "Failed to call /purchase API");
                            }"""

text = text.replace(block1, "")

# Strip out the second purchaseReq block
block2 = """            // Registering the card link transaction by POSTing to the API (Optional, but safe if it behaves like /purchase)
            try
            {
                using var purchaseReq = new HttpRequestMessage(HttpMethod.Post, purchaseUrl)
                {
                    Content = new FormUrlEncodedContent(formData)
                };
                purchaseReq.Headers.TryAddWithoutValidation("User-Agent", "Mozilla/5.0");
                await _httpClient.SendAsync(purchaseReq);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to call link-card API server-to-server");
            }"""

text = text.replace(block2, "")

with open(r'd:\TopUP\backend\MLBBTopUp.Infrastructure\Services\AbaPayWayService.cs', 'w', encoding='utf8') as f:
    f.write(text)

print("Removed purchaseReq")
