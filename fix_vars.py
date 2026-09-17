import sys

with open(r'd:\TopUP\backend\MLBBTopUp.Infrastructure\Services\AbaPayWayService.cs', 'r', encoding='utf8') as f:
    text = f.read()

text = text.replace('var paymentOption = "abapay_khqr_deeplink";', 'var paymentOption = "abapay_khqr";')
text = text.replace('var qrImageTemplate = "1";', 'var qrImageTemplate = "template1";')

with open(r'd:\TopUP\backend\MLBBTopUp.Infrastructure\Services\AbaPayWayService.cs', 'w', encoding='utf8') as f:
    f.write(text)

print("Fixed variables")
