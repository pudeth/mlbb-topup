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

url = "https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/generate-qr"

# The official documentation for /purchase specifies:
# req_time . merchant_id . tran_id . amount . items . shipping . firstname . lastname . email . phone . type . payment_option . return_url . cancel_url . continue_success_url . return_deeplink . custom_fields . currency . token . payment_gate . payout . qr_lifetime . qr_image_template
# Let's try it with the exact fields we send!

shipping = ""
return_url = ""
cancel_url = ""
continue_success_url = ""
return_deeplink = ""
custom_fields = ""
token = ""
payment_gate = ""
payout = ""

# Actually, the ABA integration guide might say:
# For generate-qr, hash sequence:
# req_time + merchant_id + tran_id + amount + items + shipping + firstname + lastname + email + phone + type + payment_option + currency + qr_lifetime + qr_image_template

b4_full = req_time + merchant_id + tran_id + amount + items + shipping + first_name + last_name + email + phone + purchase_type + payment_option + return_url + cancel_url + continue_success_url + return_deeplink + custom_fields + currency + token + payment_gate + payout + qr_lifetime + qr_image_template
b4_short = req_time + merchant_id + tran_id + amount + items + first_name + last_name + email + phone + purchase_type + payment_option + currency + qr_lifetime + qr_image_template

# Wait, maybe return_url, cancel_url etc are just empty strings in the sequence.
# Let's just try the full sequence but only send the fields we care about.

formulas = [
    ("f1", b4_full),
    ("f2", b4_short),
    ("f3", req_time + merchant_id + tran_id + amount + items + shipping + first_name + last_name + email + phone + purchase_type + payment_option + return_url + cancel_url + continue_success_url + return_deeplink + custom_fields + currency + payout + qr_lifetime + qr_image_template) # No token/payment_gate
]

for name, b4 in formulas:
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
        print(f"SUCCESS with {name}! Response:", res.read().decode())
        break
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        if "Wrong Hash" in body:
            print(f"[{name}] Wrong Hash")
        else:
            print(f"[{name}] HTTPError {e.code}:", body)
    except Exception as ex:
        print(f"[{name}] Error:", ex)
