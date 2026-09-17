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
shipping = "0.00"

url = "https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/generate-qr"

# Candidate formulas:
formulas = [
    ("f1", req_time + merchant_id + tran_id + amount + payment_option),
    ("f2", req_time + merchant_id + tran_id + amount + currency + payment_option),
    ("f3", req_time + merchant_id + tran_id + amount + payment_option + currency),
    ("f4", req_time + merchant_id + tran_id + amount + first_name + last_name + email + phone + payment_option + currency),
    ("f5", req_time + merchant_id + tran_id + amount + first_name + last_name + email + phone + purchase_type + payment_option + currency),
    ("f6", req_time + merchant_id + tran_id + amount + items + shipping + first_name + last_name + email + phone + purchase_type + payment_option + currency),
    ("f7", req_time + merchant_id + tran_id + amount + payment_option + first_name + last_name + email + phone),
    ("f8", req_time + merchant_id + tran_id + amount + currency),
    ("f9", merchant_id + tran_id + amount + req_time),
    ("f10", req_time + merchant_id + tran_id + amount + first_name + last_name + email + phone + payment_option),
    ("f11", req_time + merchant_id + tran_id + amount + first_name + last_name + phone + payment_option + currency),
    ("f12", req_time + merchant_id + tran_id + amount + first_name + last_name + payment_option + currency),
    ("f13", req_time + merchant_id + tran_id + amount + purchase_type + payment_option + currency),
    ("f14", req_time + merchant_id + tran_id + amount + currency + payment_option + first_name + last_name + email + phone),
]

for name, b4 in formulas:
    sig = base64.b64encode(hmac.new(api_key.encode(), b4.encode(), hashlib.sha512).digest()).decode()
    payload = {
        "req_time": req_time,
        "merchant_id": merchant_id,
        "tran_id": tran_id,
        "amount": amount,
        "currency": currency,
        "payment_option": payment_option,
        "first_name": first_name,
        "last_name": last_name,
        "phone": phone,
        "email": email,
        "type": purchase_type,
        "items": items,
        "shipping": shipping,
        "hash": sig
    }
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode('utf-8'),
        headers={'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0'}
    )
    try:
        res = urllib.request.urlopen(req, timeout=5)
        print(f"🎉 SUCCESS with {name}! Response:", res.read().decode())
        break
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        if "Wrong Hash" in body:
            pass
        else:
            print(f"[{name}] HTTPError {e.code}:", body)
    except Exception as ex:
        print(f"[{name}] Error:", ex)
else:
    print("None of the standard 14 formulas matched. Let's search developer doc or check fields.")
