import urllib.request, json, time, hashlib, hmac, base64

req_time = time.strftime('%Y%m%d%H%M%S', time.gmtime())
merchant_id = 'ec478601'
tran_id = f'TRX{int(time.time())}'
firstname = 'Customer'
lastname = 'Player'
email = 'customer@mlbb-topup.com'
phone = '012345678'
purchase_type = 'purchase'
payment_option = 'abapay_khqr'
items = base64.b64encode(json.dumps([{'name': 'Test Diamond', 'quantity': '1', 'price': '0.95'}]).encode()).decode()
shipping = '0.00'
amount = '0.95'
currency = 'USD'
return_url = base64.b64encode(b'https://mlbb-backend-api.onrender.com/api/payway/callback').decode()
cancel_url = base64.b64encode(b'https://checkout-sandbox.payway.com.kh/cancel').decode()
skip_success_page = '0'
continue_success_url = base64.b64encode(b'https://checkout-sandbox.payway.com.kh/success').decode()
return_deeplink = ''
custom_fields = ''
return_params = ''
view_type = 'popup'
payment_gate = '0'
payout = ''
additional_params = ''
lifetime = '30'
google_pay_token = ''

api_key = 'DC6C3259F57E68E217203249A46D7ABFD1E438C2'

b4hash = (req_time + merchant_id + tran_id + amount + items + shipping +
          firstname + lastname + email + phone + purchase_type + payment_option +
          return_url + cancel_url + continue_success_url + return_deeplink +
          currency + custom_fields + return_params + payout + lifetime +
          additional_params + google_pay_token + skip_success_page)

h = hmac.new(api_key.encode('utf-8'), b4hash.encode('utf-8'), hashlib.sha512)
signature = base64.b64encode(h.digest()).decode('utf-8')

fields = {
    'req_time': req_time,
    'merchant_id': merchant_id,
    'tran_id': tran_id,
    'firstname': firstname,
    'lastname': lastname,
    'email': email,
    'phone': phone,
    'type': purchase_type,
    'payment_option': payment_option,
    'items': items,
    'shipping': shipping,
    'amount': amount,
    'currency': currency,
    'return_url': return_url,
    'cancel_url': cancel_url,
    'skip_success_page': skip_success_page,
    'continue_success_url': continue_success_url,
    'return_deeplink': return_deeplink,
    'custom_fields': custom_fields,
    'return_params': return_params,
    'view_type': view_type,
    'payment_gate': payment_gate,
    'payout': payout,
    'additional_params': additional_params,
    'lifetime': lifetime,
    'google_pay_token': google_pay_token,
    'hash': signature
}

boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW'
body = []
for k, v in fields.items():
    body.append(f'--{boundary}\r\nContent-Disposition: form-data; name="{k}"\r\n\r\n{v}\r\n')
body.append(f'--{boundary}--\r\n')
body_bytes = ''.join(body).encode('utf-8')

req = urllib.request.Request(
    'https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/purchase',
    data=body_bytes,
    headers={'Content-Type': f'multipart/form-data; boundary={boundary}'}
)

class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None

opener = urllib.request.build_opener(NoRedirect)
try:
    resp = opener.open(req)
    print('Status:', resp.status)
    print('Headers:', dict(resp.headers))
    print('Body:', resp.read().decode())
except urllib.error.HTTPError as e:
    print('HTTPError Status:', e.code)
    loc = e.headers.get('Location')
    print('Location:', loc)
    if loc and '/checkout/' in loc:
        encoded = loc.split('/checkout/')[1].split('?')[0]
        pad = (4 - len(encoded) % 4) % 4
        encoded += '=' * pad
        decoded = base64.b64decode(encoded).decode('utf-8', errors='ignore')
        print('Decoded payload:', decoded)
