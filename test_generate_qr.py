import urllib.request, json, time, hashlib, hmac, base64

api_key = 'DC6C3259F57E68E217203249A46D7ABFD1E438C2'
merchant_id = 'ec478601'
req_time = time.strftime('%Y%m%d%H%M%S', time.gmtime())
tran_id = f"TRX{int(time.time())}"
amount = "0.95"
currency = "USD"
firstname = "Customer"
lastname = "Player"
phone = "012345678"
email = "customer@mlbb-topup.com"
payment_option = "abapay_khqr"

# Let's test various hash combinations
# Combination 1: req_time + merchant_id + tran_id + amount + firstname + lastname + email + phone + payment_option
b4hash_1 = req_time + merchant_id + tran_id + amount + firstname + lastname + email + phone + payment_option
hash_1 = base64.b64encode(hmac.new(api_key.encode(), b4hash_1.encode(), hashlib.sha512).digest()).decode()

# Combination 2: req_time + merchant_id + tran_id + amount
b4hash_2 = req_time + merchant_id + tran_id + amount
hash_2 = base64.b64encode(hmac.new(api_key.encode(), b4hash_2.encode(), hashlib.sha512).digest()).decode()

# Combination 3: req_time + merchant_id + tran_id + amount + currency
b4hash_3 = req_time + merchant_id + tran_id + amount + currency
hash_3 = base64.b64encode(hmac.new(api_key.encode(), b4hash_3.encode(), hashlib.sha512).digest()).decode()

url = "https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/generate-qr"

for name, h_val, extra in [
    ("all_fields", hash_1, {"currency": currency, "payment_option": payment_option, "first_name": firstname, "last_name": lastname, "phone": phone, "email": email}),
    ("simple", hash_2, {"first_name": firstname, "last_name": lastname}),
    ("with_curr", hash_3, {"currency": currency, "first_name": firstname, "last_name": lastname})
]:
    payload = {
        "req_time": req_time,
        "merchant_id": merchant_id,
        "tran_id": tran_id,
        "amount": amount,
        "hash": h_val,
        **extra
    }
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode('utf-8'),
        headers={
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        }
    )
    try:
        res = urllib.request.urlopen(req, timeout=10)
        print(f"[{name}] Success {res.status}:", res.read().decode())
        break
    except urllib.error.HTTPError as e:
        print(f"[{name}] HTTPError {e.code}:", e.read().decode())
    except Exception as ex:
        print(f"[{name}] Error:", ex)
