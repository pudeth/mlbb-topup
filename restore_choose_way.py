import re

with open(r'd:\TopUP\backend\MLBBTopUp.Infrastructure\Services\AbaPayWayService.cs', 'r', encoding='utf8') as f:
    text = f.read()

# Change it back to empty string
text = text.replace('string popupPaymentOption = "abapay_khqr";', 'string popupPaymentOption = "";')

with open(r'd:\TopUP\backend\MLBBTopUp.Infrastructure\Services\AbaPayWayService.cs', 'w', encoding='utf8') as f:
    f.write(text)

print("Restored Choose way to pay screen.")
