import sys

with open(r'd:\TopUP\backend\MLBBTopUp.Infrastructure\Services\AbaPayWayService.cs', 'r', encoding='utf8') as f:
    content = f.read()

content = content.replace('{ "lifetime", qrLifetime },\n                { "hash", formHash }',
                          '{ "lifetime", qrLifetime },\n                { "payment_gate", "0" },\n                { "hash", formHash }')

with open(r'd:\TopUP\backend\MLBBTopUp.Infrastructure\Services\AbaPayWayService.cs', 'w', encoding='utf8') as f:
    f.write(content)
print("Done!")
