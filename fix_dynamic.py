import sys
import re

with open(r'd:\TopUP\backend\MLBBTopUp.API\Controllers\PayWayController.cs', 'r', encoding='utf8') as f:
    text = f.read()

# Replace dynamic payload with JsonElement payload in method signatures
text = text.replace('[FromBody] dynamic payload', '[FromBody] System.Text.Json.JsonElement payload')

# Fix dynamic property accessors
replacements = {
    r'string ctid = payload\.ctid;': 'string ctid = payload.GetProperty("ctid").GetString();',
    r'string pwt = payload\.pwt;': 'string pwt = payload.GetProperty("pwt").GetString();',
    r'int orderId = payload\.orderId;': 'int orderId = payload.GetProperty("orderId").GetInt32();',
    r'decimal amount = payload\.amount;': 'decimal amount = payload.GetProperty("amount").GetDecimal();',
    r'string tranId = payload\.tranId;': 'string tranId = payload.GetProperty("tranId").GetString();',
    r'decimal completeAmount = payload\.completeAmount;': 'decimal completeAmount = payload.GetProperty("completeAmount").GetDecimal();',
    r'decimal totalAmount = payload\.totalAmount;': 'decimal totalAmount = payload.GetProperty("totalAmount").GetDecimal();',
    r'string payee = payload\.payee;': 'string payee = payload.GetProperty("payee").GetString();',
    r'int status = payload\.status;': 'int status = payload.GetProperty("status").GetInt32();',
    r'string tokenFlag = payload\.tokenFlag \?\? "CITU_FLEX";': 'string tokenFlag = payload.TryGetProperty("tokenFlag", out var tf) ? tf.GetString() : "CITU_FLEX";',
    r'\(\(\(System\.Text\.Json\.JsonElement\)payload\)\)': '(payload)',
    r'string title = payload\.title \?\? "MLBB Diamonds";': 'string title = payload.TryGetProperty("title", out var ti) ? ti.GetString() : "MLBB Diamonds";',
}

for old, new in replacements.items():
    text = re.sub(old, new, text)

# Note: Check if there are any other dynamic accesses
# I'll just write it back
with open(r'd:\TopUP\backend\MLBBTopUp.API\Controllers\PayWayController.cs', 'w', encoding='utf8') as f:
    f.write(text)

print("Done")
