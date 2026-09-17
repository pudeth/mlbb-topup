import re

with open(r'd:\TopUP\backend\MLBBTopUp.Infrastructure\Services\AbaPayWayService.cs', 'r', encoding='utf8') as f:
    text = f.read()

# Replace popupPaymentOption
if 'var popupPaymentOption = "";' in text:
    text = text.replace('var popupPaymentOption = "";', 'var popupPaymentOption = "abapay_khqr";')
    with open(r'd:\TopUP\backend\MLBBTopUp.Infrastructure\Services\AbaPayWayService.cs', 'w', encoding='utf8') as f:
        f.write(text)
    print("Replaced popupPaymentOption.")
else:
    print("Not found.")
