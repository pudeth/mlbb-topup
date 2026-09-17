import sys
import re

with open(r'd:\TopUP\backend\MLBBTopUp.API\Controllers\PayWayController.cs', 'r', encoding='utf8') as f:
    text = f.read()

# Replace the exact line
text = re.sub(r'int frequency = payload\.GetProperty\("frequency"\)\.GetInt32\(\) \?\? "monthly";', 'int frequency = payload.TryGetProperty("frequency", out var f) ? f.GetInt32() : 1;', text)

with open(r'd:\TopUP\backend\MLBBTopUp.API\Controllers\PayWayController.cs', 'w', encoding='utf8') as f:
    f.write(text)

print("Fixed")
