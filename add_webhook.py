import sys

with open(r'd:\TopUP\backend\MLBBTopUp.API\Controllers\PayWayController.cs', 'r', encoding='utf8') as f:
    text = f.read()

new_webhook = """
    /// <summary>
    /// ABA PayWay Webhook Callback (Pushback Notification)
    /// Handles both CoF Account Linking and Transaction Status updates
    /// </summary>
    [HttpPost("webhook")]
    [AllowAnonymous]
    public async Task<IActionResult> Webhook()
    {
        using var reader = new System.IO.StreamReader(Request.Body);
        var body = await reader.ReadToEndAsync();
        
        if (string.IsNullOrEmpty(body))
            return BadRequest("Empty body");

        // 1. Get Signature from Header
        if (!Request.Headers.TryGetValue("X-PAYWAY-HMAC-SHA512", out var receivedSignature))
        {
            return Unauthorized("Missing signature");
        }

        // 2. Parse JSON to Dictionary to sort keys
        var jsonDict = System.Text.Json.JsonSerializer.Deserialize<System.Collections.Generic.SortedDictionary<string, object>>(body);
        if (jsonDict == null)
            return BadRequest("Invalid JSON");

        // 3. Concatenate all values
        var b4hash = new System.Text.StringBuilder();
        foreach (var kvp in jsonDict)
        {
            if (kvp.Value is System.Text.Json.JsonElement element)
            {
                if (element.ValueKind == System.Text.Json.JsonValueKind.Object || element.ValueKind == System.Text.Json.JsonValueKind.Array)
                {
                    b4hash.Append(element.GetRawText());
                }
                else
                {
                    b4hash.Append(element.ToString());
                }
            }
            else
            {
                b4hash.Append(kvp.Value?.ToString());
            }
        }

        // 4. Generate HMAC-SHA512 signature
        var apiKey = _configuration["AbaPayWay:ApiKey"] ?? string.Empty;
        var computedSignature = "";
        using (var hmac = new System.Security.Cryptography.HMACSHA512(System.Text.Encoding.UTF8.GetBytes(apiKey)))
        {
            var hashBytes = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(b4hash.ToString()));
            computedSignature = Convert.ToBase64String(hashBytes);
        }

        // 5. Compare signatures
        if (computedSignature != receivedSignature.ToString())
        {
            _logger.LogWarning("Invalid webhook signature. Received: {Received}, Computed: {Computed}", receivedSignature, computedSignature);
            return Unauthorized("Invalid signature");
        }

        // --- Process the valid notification ---
        using var doc = System.Text.Json.JsonDocument.Parse(body);
        var root = doc.RootElement;

        // Check if it's a Credentials on File (CoF) linking notification
        if (root.TryGetProperty("payment_credential", out var credentialProp))
        {
            var pwt = credentialProp.TryGetProperty("pwt", out var pwtProp) ? pwtProp.GetString() : null;
            var source = credentialProp.TryGetProperty("source_of_fund", out var srcProp) ? srcProp.GetString() : null;
            var status = credentialProp.TryGetProperty("status", out var statProp) ? statProp.GetInt32() : 0;
            
            _logger.LogInformation("CoF Linked! Token: {Pwt}, Source: {Source}, Status: {Status}", pwt, source, status);
            // TODO: Save token to database for future one-click checkout
        }
        // Check if it's a standard Purchase notification
        else if (root.TryGetProperty("tran_id", out var tranIdProp))
        {
            var tranId = tranIdProp.GetString();
            var status = root.TryGetProperty("status", out var statusProp) ? statusProp.GetInt32() : -1;
            
            _logger.LogInformation("Payment Update! TranId: {TranId}, Status: {Status}", tranId, status);
            // TODO: Update database order status
        }

        return Ok(new { message = "Success" });
    }
"""

if 'Webhook()' not in text:
    text = text.rstrip()
    if text.endswith('}'):
        text = text[:-1] + new_webhook + '\n}\n'

with open(r'd:\TopUP\backend\MLBBTopUp.API\Controllers\PayWayController.cs', 'w', encoding='utf8') as f:
    f.write(text)

print("Done")
