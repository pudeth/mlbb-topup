import sys

with open(r'd:\TopUP\backend\MLBBTopUp.Infrastructure\Services\AbaPayWayService.cs', 'r', encoding='utf8') as f:
    text = f.read()

import re

old_method = r"""        public async Task<string> CompletePreAuthAsync\(string tranId, decimal completeAmount\)
        \{
            var merchantId = _configuration\["AbaPayWay:MerchantId"\] \?\? "ec478601";
.*?
            var authData = new
            \{
                mc_id = merchantId,
                tran_id = tranId,
                complete_amount = completeAmount
            \};
            var authJson = System\.Text\.Json\.JsonSerializer\.Serialize\(authData\);"""

new_method = """        public async Task<string> CompletePreAuthAsync(string tranId, decimal completeAmount, object payout = null)
        {
            var merchantId = _configuration["AbaPayWay:MerchantId"] ?? "ec478601";
            var apiKey = _configuration["AbaPayWay:ApiKey"] ?? string.Empty;
            var rsaPublicKeyBase64 = _configuration["AbaPayWay:RsaPublicKey"] ?? string.Empty; 
            var baseUrl = (_configuration["AbaPayWay:BaseUrl"] ?? "https://checkout-sandbox.payway.com.kh").TrimEnd('/');

            if (string.IsNullOrEmpty(apiKey) || string.IsNullOrEmpty(rsaPublicKeyBase64))
                return $"{{\\"error\\": \\"Missing ApiKey or RsaPublicKey\\"}}";

            var reqTime = DateTime.UtcNow.ToString("yyyyMMddHHmmss");

            var authDict = new System.Collections.Generic.Dictionary<string, object>
            {
                { "mc_id", merchantId },
                { "tran_id", tranId },
                { "complete_amount", completeAmount }
            };

            if (payout != null)
            {
                authDict.Add("payout", payout);
            }

            var authJson = System.Text.Json.JsonSerializer.Serialize(authDict);"""

match = re.search(old_method, text, flags=re.DOTALL)
if match:
    text = text.replace(match.group(0), new_method)

# Update Interface
text = text.replace('Task<string> CompletePreAuthAsync(string tranId, decimal completeAmount);',
                    'Task<string> CompletePreAuthAsync(string tranId, decimal completeAmount, object payout = null);')

with open(r'd:\TopUP\backend\MLBBTopUp.Infrastructure\Services\AbaPayWayService.cs', 'w', encoding='utf8') as f:
    f.write(text)


with open(r'd:\TopUP\backend\MLBBTopUp.API\Controllers\PayWayController.cs', 'r', encoding='utf8') as f:
    ctrl_text = f.read()

old_ctrl = r"""    public async Task<IActionResult> CompletePreAuth\(\[FromBody\] dynamic payload\)
    \{
        string tranId = payload.tranId;
        decimal completeAmount = payload.completeAmount;
        var details = await _abaPayWayService.CompletePreAuthAsync\(tranId, completeAmount\);
        return Content\(details, "application/json"\);
    \}"""

new_ctrl = """    public async Task<IActionResult> CompletePreAuth([FromBody] dynamic payload)
    {
        string tranId = payload.tranId;
        decimal completeAmount = payload.completeAmount;
        
        // Optional payout object (e.g. splitting funds across multiple ABA accounts)
        object payout = null;
        if (((System.Text.Json.JsonElement)payload).TryGetProperty("payout", out var payoutElement))
        {
            payout = System.Text.Json.JsonSerializer.Deserialize<object>(payoutElement.GetRawText());
        }

        var details = await _abaPayWayService.CompletePreAuthAsync(tranId, completeAmount, payout);
        return Content(details, "application/json");
    }"""

ctrl_match = re.search(old_ctrl, ctrl_text, flags=re.DOTALL)
if ctrl_match:
    ctrl_text = ctrl_text.replace(ctrl_match.group(0), new_ctrl)

with open(r'd:\TopUP\backend\MLBBTopUp.API\Controllers\PayWayController.cs', 'w', encoding='utf8') as f:
    f.write(ctrl_text)

print("Done")
