import re

with open(r'd:\TopUP\backend\MLBBTopUp.Infrastructure\Services\AbaPayWayService.cs', 'r', encoding='utf8') as f:
    text = f.read()

# Fix continueSuccessUrl to be the base URL
text = text.replace('var continueSuccessUrl = "http://localhost:3000/success";', 'var continueSuccessUrl = $"{_configuration["FrontendUrl"] ?? "http://localhost:3000"}/topup";')
text = text.replace('var cancelUrl = "http://localhost:3000/checkout";', 'var cancelUrl = $"{_configuration["FrontendUrl"] ?? "http://localhost:3000"}/topup";')

with open(r'd:\TopUP\backend\MLBBTopUp.Infrastructure\Services\AbaPayWayService.cs', 'w', encoding='utf8') as f:
    f.write(text)

print("Updated URLs in backend.")
