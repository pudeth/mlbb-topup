import urllib.request, json, time, hashlib, hmac, base64
from datetime import datetime, timezone, timedelta
from pymongo import MongoClient

MONGO_URI = "mongodb+srv://peakmao007_db_user:DNelqTteMX30a7PX@pudeth.olrum6s.mongodb.net/?appName=pudeth&retryWrites=true&w=majority"
merchant_id = 'tintopup'
api_key = '84a7f019-9440-4fd9-8164-788e50eee08f'

def fetch_all_aba_transactions():
    req_time = time.strftime('%Y%m%d%H%M%S', time.gmtime())
    page = '1'
    pagination = '50'
    now = datetime.now(timezone.utc)
    fDate = (now - timedelta(days=2)).strftime('%Y-%m-%d 00:00:00')
    tDate = now.strftime('%Y-%m-%d 23:59:59')

    b4hash = f'{req_time}{merchant_id}{fDate}{tDate}{page}{pagination}'
    h = hmac.new(api_key.encode('utf-8'), b4hash.encode('utf-8'), hashlib.sha512)
    sig = base64.b64encode(h.digest()).decode('utf-8')

    payload = {
        'req_time': req_time,
        'merchant_id': merchant_id,
        'from_date': fDate,
        'to_date': tDate,
        'from_amount': None,
        'to_amount': None,
        'status': None,
        'page': page,
        'pagination': pagination,
        'hash': sig
    }
    req = urllib.request.Request(
        'https://checkout.payway.com.kh/api/payment-gateway/v1/payments/transaction-list-2',
        data=json.dumps(payload).encode('utf-8'),
        headers={'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0'}
    )
    with urllib.request.urlopen(req, timeout=15) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        return data.get('data', [])

def get_transaction_detail(tran_id):
    req_time = time.strftime('%Y%m%d%H%M%S', time.gmtime())
    b4hash = f"{req_time}{merchant_id}{tran_id}"
    h = hmac.new(api_key.encode('utf-8'), b4hash.encode('utf-8'), hashlib.sha512)
    sig = base64.b64encode(h.digest()).decode('utf-8')
    payload = {
        'req_time': req_time,
        'merchant_id': merchant_id,
        'tran_id': tran_id,
        'hash': sig
    }
    req = urllib.request.Request(
        'https://checkout.payway.com.kh/api/payment-gateway/v1/payments/transaction-detail',
        data=json.dumps(payload).encode('utf-8'),
        headers={'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0'}
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            return data.get('data') or {}
    except Exception:
        return {}

def run_sync():
    print("[*] Connecting to MongoDB Atlas cluster 'pudeth'...")
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=10000)
    db = client["mlbbtopup"]
    payments_col = db["payments"]
    
    initial_count = payments_col.count_documents({})
    print(f"[+] Initial payments count in MongoDB: {initial_count}")

    print("[*] Fetching live ABA PayWay transactions...")
    txs = fetch_all_aba_transactions()
    print(f"[+] Fetched {len(txs)} transactions from ABA PayWay")

    inserted_count = 0
    updated_count = 0

    for i, t in enumerate(txs):
        tran_id = t.get('transaction_id')
        if not tran_id:
            continue

        detail = get_transaction_detail(tran_id)

        status_raw = (detail.get('payment_status') or t.get('payment_status') or 'PENDING').upper()
        is_paid = status_raw in ['APPROVED', 'PAID', 'SUCCESS']
        mongo_status = 'PAID' if is_paid else 'UNPAID'

        amount = float(detail.get('total_amount') or t.get('total_amount') or t.get('original_amount') or 0.95)
        currency = detail.get('original_currency') or t.get('original_currency') or 'USD'
        apv = detail.get('apv') or t.get('apv') or ''
        bank_ref = detail.get('bank_ref') or ''
        payment_type = detail.get('payment_type') or t.get('payment_type') or 'ABA Pay'
        payer_account = detail.get('payer_account') or ''
        bank_name = detail.get('bank_name') or 'ABA Bank'
        
        first_name = detail.get('first_name') or ''
        last_name = detail.get('last_name') or ''
        account_name = f"{first_name} {last_name}".strip() or "PHEAK DETH"
        
        email = detail.get('email') or 'pudeth@example.com'
        phone = detail.get('phone') or '012345678'
        tx_date = detail.get('transaction_date') or t.get('transaction_date') or datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')

        md5_hash = hashlib.md5(f"ABA_{tran_id}".encode()).hexdigest()

        doc = {
            'md5_hash': md5_hash,
            'bill_number': tran_id,
            'amount': amount,
            'currency': currency,
            'status': mongo_status,
            'payment_status': status_raw,
            'account_name': account_name,
            'game_name': 'MOBILE LEGEND',
            'package_name': '55 Diamonds' if amount < 1.0 else 'Weekly Pass',
            'player_id': '1225368571',
            'server_id': '11446',
            'customer_id': '1225368571',
            'customer_phone': phone,
            'email': email,
            'payment_method': 'ABA PayWay',
            'payment_type': payment_type,
            'transaction_id': tran_id,
            'apv': apv,
            'bank_ref': bank_ref,
            'payer_account': payer_account,
            'bank_name': bank_name,
            'created_at': tx_date,
            'deeplink': f"abamobilebank://ababank.com/payway?tran_id={tran_id}",
            'qr_code': f"ABA-PAYWAY-{tran_id}",
            'receipt': {
                'merchant_id': merchant_id,
                'merchant_name': 'Tin TopUp (PHEAK DETH)',
                'transaction_id': tran_id,
                'apv': apv,
                'bank_ref': bank_ref,
                'amount': amount,
                'currency': currency,
                'payment_amount': detail.get('payment_amount'),
                'payment_currency': detail.get('payment_currency'),
                'payment_type': payment_type,
                'payer_account': payer_account,
                'bank_name': bank_name,
                'customer_name': account_name,
                'date': tx_date,
                'status': status_raw
            }
        }

        res = payments_col.update_one(
            {'$or': [{'bill_number': tran_id}, {'transaction_id': tran_id}, {'md5_hash': md5_hash}]},
            {'$set': doc},
            upsert=True
        )

        if res.upserted_id:
            inserted_count += 1
            print(f" [+] Inserted: {tran_id} (APV: {apv}, Status: {status_raw})")
        else:
            updated_count += 1
            print(f" [*] Synced: {tran_id} (APV: {apv}, Status: {status_raw})")

    final_count = payments_col.count_documents({})
    print(f"\n=======================================================")
    print(f" SUCCESS:")
    print(f"  Inserted new: {inserted_count}")
    print(f"  Updated/Synced: {updated_count}")
    print(f"  Total Payments in MongoDB Atlas: {final_count}")
    print(f"=======================================================")

if __name__ == "__main__":
    run_sync()
