import re

with open(r'd:\TopUP\backend\MLBBTopUp.Infrastructure\Services\AbaPayWayService.cs', 'r', encoding='utf8') as f:
    text = f.read()

match = re.search(r'        public async Task<string> CloseTransactionAsync.*?return \$\"\{\{\\"error\\": \\"{ex.Message}\\"\}\}\";\n            }\n        }', text, flags=re.DOTALL)
if match:
    method = match.group(0)
    text = text.replace(method, '')
    
    text = text.rstrip()
    if text.endswith('}'): text = text[:-1].rstrip()
    if text.endswith('}'): text = text[:-1].rstrip()
    
    text = text + '\n\n' + method + '\n    }\n}\n'

with open(r'd:\TopUP\backend\MLBBTopUp.Infrastructure\Services\AbaPayWayService.cs', 'w', encoding='utf8') as f:
    f.write(text)
print("Done")
