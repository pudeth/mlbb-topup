import urllib.request, json, time, hashlib, hmac, base64

api_key = 'DC6C3259F57E68E217203249A46D7ABFD1E438C2'
merchant_id = 'ec478601'
req_time = time.strftime('%Y%m%d%H%M%S', time.gmtime())
tran_id = f"TRX{int(time.time())}"
amount = "0.95"
currency = "USD"
first_name = "Customer"
last_name = "Player"
phone = "012345678"
email = "customer@mlbb-topup.com"
payment_option = "abapay_khqr"
purchase_type = "purchase"
items = base64.b64encode(json.dumps([{'name': 'Diamonds', 'quantity': '1', 'price': '0.95'}]).encode()).decode()
qr_lifetime = "6"
qr_image_template = "template1"
callback_url = "https://yourdomain.com/api/PayWay/webhook"
encoded_callback = base64.b64encode(callback_url.encode()).decode()

url = "https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/generate-qr"

b4 = req_time + merchant_id + tran_id + amount + items + first_name + last_name + email + phone + purchase_type + payment_option + encoded_callback + currency + qr_lifetime + qr_image_template

sig = base64.b64encode(hmac.new(api_key.encode(), b4.encode(), hashlib.sha512).digest()).decode()

payload = {
    "req_time": req_time,
    "merchant_id": merchant_id,
    "tran_id": tran_id,
    "amount": amount,
    "items": items,
    "firstname": first_name,
    "lastname": last_name,
    "email": email,
    "phone": phone,
    "type": purchase_type,
    "payment_option": payment_option,
    "return_url": encoded_callback,
    "currency": currency,
    "qr_lifetime": qr_lifetime,
    "qr_image_template": qr_image_template,
    "hash": sig
}

req = urllib.request.Request(
    url,
    data=json.dumps(payload).encode('utf-8'),
    headers={'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0'}
)
try:
    res = urllib.request.urlopen(req, timeout=5)
    print("SUCCESS Response:", res.read().decode())
except urllib.error.HTTPError as e:
    print(f"HTTPError {e.code}:", e.read().decode())
except Exception as ex:
    print(f"Error:", ex)
