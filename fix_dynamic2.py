import sys
import re

with open(r'd:\TopUP\backend\MLBBTopUp.API\Controllers\PayWayController.cs', 'r', encoding='utf8') as f:
    text = f.read()

text = re.sub(r'payload\.token\b', 'payload.GetProperty("token").GetString()', text)
text = re.sub(r'payload\.frequency\b', 'payload.GetProperty("frequency").GetInt32()', text)
text = re.sub(r'payload\.linkId\b', 'payload.GetProperty("linkId").GetString()', text)
text = re.sub(r'payload\.merchantRef\b', 'payload.GetProperty("merchantRef").GetString()', text)

with open(r'd:\TopUP\backend\MLBBTopUp.API\Controllers\PayWayController.cs', 'w', encoding='utf8') as f:
    f.write(text)

print("Fixed")
