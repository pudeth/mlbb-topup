import sys

with open(r'd:\TopUP\backend\MLBBTopUp.API\Controllers\PayWayController.cs', 'r', encoding='utf8') as f:
    text = f.read()

old_response = """          return Ok(new
          {
              success = true,
              gateway = "aba_payway",
              orderId = order.OrderId,
              tranId = result.TranId,
              qrString = result.QrString,
              qrImage = result.QrImage,
              abapayDeeplink = result.AbapayDeeplink,
              md5 = result.Md5Hash,
              amount = finalAmount,
              currency = request.Currency
          });"""

new_response = """          return Ok(new
          {
              success = true,
              gateway = "aba_payway",
              orderId = order.OrderId,
              tranId = result.TranId,
              qrString = result.QrString,
              qrImage = result.QrImage,
              abapayDeeplink = result.AbapayDeeplink,
              md5 = result.Md5Hash,
              checkoutUrl = result.CheckoutUrl,
              purchaseUrl = result.PurchaseUrl,
              formData = result.FormData,
              amount = finalAmount,
              currency = request.Currency
          });"""

text = text.replace(old_response, new_response)

with open(r'd:\TopUP\backend\MLBBTopUp.API\Controllers\PayWayController.cs', 'w', encoding='utf8') as f:
    f.write(text)

print("Updated PayWayController.cs")
