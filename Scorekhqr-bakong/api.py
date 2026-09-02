#!/usr/bin/env python
"""
Bakong KHQR Payment API
RESTful API for payment processing
"""

import os
import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')
from dotenv import load_dotenv
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from bakong_khqr import KHQR
import mysql.connector
from mysql.connector import Error
import requests
from datetime import datetime
import io
import hashlib
import time

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False

# Enable CORS for all routes and all headers
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True, allow_headers="*", methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    return response

DEFAULT_BAKONG_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiYzY4NGNhNTUwNTJmNDRjYiJ9LCJpYXQiOjE3ODcwNTkwNTIsImV4cCI6MTc5NDgzNTA1Mn0.IOaSl7-TRdyrTjWM7mQMaaaAUP0E7N7zgtX-AsPZPLE'

# Runtime configuration (overrides .env in memory and persists to .env)
runtime_config = {
    'BAKONG_TOKEN': os.getenv('BAKONG_TOKEN') or DEFAULT_BAKONG_TOKEN,
    'MERCHANT_BAKONG_ID': os.getenv('MERCHANT_BAKONG_ID', 'deth_peak3@aclb'),
    'MERCHANT_NAME': os.getenv('MERCHANT_NAME', 'PuDeth Smart-PAY'),
    'MERCHANT_CITY': os.getenv('MERCHANT_CITY', 'PHNOM PENH'),
    'ACQUIRING_BANK': os.getenv('ACQUIRING_BANK', 'FAMILY PHONE'),
    'DEMO_MODE': os.getenv('DEMO_MODE', 'false').lower() == 'true',
    'TELEGRAM_BOT_TOKEN': os.getenv('TELEGRAM_BOT_TOKEN', ''),
    'TELEGRAM_CHAT_ID': os.getenv('TELEGRAM_CHAT_ID', '')
}

def get_config(key, default=''):
    val = runtime_config.get(key, os.getenv(key, default))
    if key == 'BAKONG_TOKEN' and not val:
        return DEFAULT_BAKONG_TOKEN
    return val

# Initialize KHQR
khqr = KHQR(get_config('BAKONG_TOKEN'))

def reload_khqr_instance():
    global khqr
    token = get_config('BAKONG_TOKEN') or DEFAULT_BAKONG_TOKEN
    khqr = KHQR(token)
    print(f"[+] KHQR instance reloaded with token length: {len(token)}")

# In-memory storage for QR codes when database is unavailable
qr_cache = {}

# Database configuration (MySQL & MongoDB Atlas)
db_config = {
    'host': os.getenv('DB_HOST'),
    'port': int(os.getenv('DB_PORT', 3306)),
    'database': os.getenv('DB_DATABASE'),
    'user': os.getenv('DB_USERNAME'),
    'password': os.getenv('DB_PASSWORD', '')
}

# Initialize MongoDB Atlas Client
mongo_payments = None
mongo_db = None
try:
    from pymongo import MongoClient
    mongo_uri = os.getenv('MONGODB_URI', 'mongodb+srv://peakmao007_db_user:DNelqTteMX30a7PX@pudeth.olrum6s.mongodb.net/?appName=pudeth&retryWrites=true&w=majority')
    if mongo_uri:
        mongo_client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
        mongo_db = mongo_client.get_database('mlbbtopup')
        mongo_payments = mongo_db.payments
        print("[+] MongoDB Atlas connected successfully!")
except Exception as mongo_err:
    print(f"[-] MongoDB Atlas notice: {mongo_err}")
    mongo_payments = None
    mongo_db = None

def get_db_connection():
    """Get database connection"""
    try:
        if db_config['host']:
            return mysql.connector.connect(**db_config)
    except Error as e:
        print(f"Database error: {e}")
    return None

def save_payment_record(doc):
    """Save payment record to MongoDB Atlas or cache"""
    if mongo_payments is not None:
        try:
            mongo_payments.update_one({'md5_hash': doc['md5_hash']}, {'$set': doc}, upsert=True)
            print(f"[+] Payment saved to MongoDB Atlas: {doc.get('md5_hash')}")
            return True
        except Exception as e:
            print(f"[-] MongoDB save error: {e}")
    qr_cache[doc['md5_hash']] = doc
    return False

def get_payment_record(md5_hash):
    """Fetch payment record by MD5 from MongoDB Atlas or cache"""
    if mongo_payments is not None:
        try:
            rec = mongo_payments.find_one({'md5_hash': md5_hash})
            if rec:
                rec.pop('_id', None)
                return rec
        except Exception as e:
            print(f"[-] MongoDB fetch error: {e}")
    return qr_cache.get(md5_hash)

def send_telegram(message):
    """Send Telegram notification"""
    try:
        bot_token = get_config('TELEGRAM_BOT_TOKEN')
        chat_id = get_config('TELEGRAM_CHAT_ID')
        if not bot_token or not chat_id:
            return
        url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
        data = {
            "chat_id": chat_id,
            "text": message,
            "parse_mode": "HTML"
        }
        requests.post(url, data=data, timeout=10)
    except:
        pass

@app.route('/api/mlbb/check', methods=['GET', 'OPTIONS'])
def check_mlbb_account():
    """Verify in-game MLBB account name server-side without CORS limitations"""
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'})

    player_id = request.args.get('id', '').strip()
    server_id = request.args.get('server', '').strip()

    if not player_id:
        return jsonify({'valid': False, 'message': 'Player ID is required'}), 400

    try:
        url = f"https://api.isan.eu.org/nickname/ml?id={player_id}&server={server_id}"
        r = requests.get(url, timeout=4, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        if r.status_code == 200:
            data = r.json()
            if data.get('success') and data.get('name'):
                return jsonify({
                    'valid': True,
                    'success': True,
                    'username': data.get('name'),
                    'country': data.get('country', 'Cambodia'),
                    'id': player_id,
                    'server': server_id
                })
    except Exception as e:
        print(f"[-] Server-side MLBB check notice: {e}")

    return jsonify({
        'valid': True,
        'success': True,
        'username': f"Player #{player_id}",
        'country': 'Cambodia',
        'id': player_id,
        'server': server_id
    })

@app.route('/favicon.ico')
def favicon():
    return '', 204

@app.route('/')
def index():
    """API home"""
    return jsonify({
        'app': os.getenv('APP_NAME'),
        'version': '1.0.0',
        'endpoints': {
            'POST /api/payment/create': 'Create new payment',
            'GET /api/payment/status/<md5>': 'Check payment status',
            'GET /api/payment/info/<md5>': 'Get payment details',
            'GET /api/payments': 'List all payments',
            'GET /api/payment/qr/<md5>': 'Get QR code image',
            'POST /api/payment/callback': 'Payment callback'
        }
    })

@app.after_request
def after_request(response):
    """Add CORS headers to all responses"""
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response


def calculate_emvco_crc16(data: str) -> str:
    """Standard EMVCo CRC-16 CCITT Algorithm (Polynomial 0x1021, Initial 0xFFFF)"""
    crc = 0xFFFF
    polynomial = 0x1021
    bytes_data = data.encode('utf-8')
    for b in bytes_data:
        for i in range(8):
            bit = ((b >> (7 - i)) & 1) == 1
            c15 = ((crc >> 15) & 1) == 1
            crc = (crc << 1) & 0xFFFF
            if c15 ^ bit:
                crc ^= polynomial
    return f"{crc:04X}"


def generate_emvco_khqr(bakong_id: str, name: str, city: str, amount: float, currency: str = 'USD'):
    """
    Constructs exact EMVCo standard KHQR payload matching Official NBC Bakong KHQR Engine
    and Restaurant Management System (BakongPaymentController.java)
    """
    currency_type = currency.upper()
    is_khr = (currency_type == 'KHR')
    currency_code = '116' if is_khr else '840'
    final_amt = round(amount * 4100) if is_khr else amount
    amt_str = f"{final_amt:.0f}" if is_khr else f"{final_amt:.2f}"

    payload = "000201010212"

    # Tag 29: Merchant Account Info (Bakong Account ID + Account Info + Acquiring Bank)
    sub00 = f"00{len(bakong_id):02d}{bakong_id}"
    sub01 = f"01{len(name):02d}{name}"
    sub02 = "0206Bakong"
    tag29_content = sub00 + sub01 + sub02
    payload += f"29{len(tag29_content):02d}{tag29_content}"

    # Tag 52: Merchant Category Code (5999 for Personal/Individual/Retail KHQR)
    payload += "52045999"

    # Tag 53: Transaction Currency (840 = USD, 116 = KHR)
    payload += f"5303{currency_code}"

    # Tag 54: Transaction Amount
    payload += f"54{len(amt_str):02d}{amt_str}"

    # Tag 58: Country Code (KH)
    payload += "5802KH"

    # Tag 59: Merchant Name
    payload += f"59{len(name):02d}{name}"

    # Tag 60: Merchant City
    merchant_city = city or "Phnom Penh"
    payload += f"60{len(merchant_city):02d}{merchant_city}"

    # Tag 99: Bakong Expiration Timestamp (Required by NBC for dynamic QR validation — 5 Minutes)
    now_ms = int(time.time() * 1000)
    expire_ms = now_ms + (5 * 60 * 1000)
    created_str = str(now_ms)
    expire_str = str(expire_ms)
    subT00 = f"00{len(created_str):02d}{created_str}"
    subT01 = f"01{len(expire_str):02d}{expire_str}"
    tag99_content = subT00 + subT01
    payload += f"99{len(tag99_content):02d}{tag99_content}"

    # Tag 63: CRC Tag ID & Length
    payload += "6304"

    # Calculate standard EMVCo CRC-16
    crc = calculate_emvco_crc16(payload)
    full_khqr = payload + crc

    # Generate MD5 hash of full KHQR string for Bakong API check
    md5_hash = hashlib.md5(full_khqr.encode('utf-8')).hexdigest()

    return full_khqr, md5_hash


@app.route('/api/payment/create', methods=['POST'])
@app.route('/api/payments/khqr/generate', methods=['POST'])
@app.route('/api/khqr/payment/create', methods=['POST'])
def create_payment():
    """Create a new payment with official EMVCo standard matching Restaurant Management System"""
    try:
        data = request.get_json() or {}
        
        amount = float(data.get('amount', 0))
        currency = data.get('currency', 'USD').upper()
        phone = data.get('phone', '')
        bill_number = data.get('bill_number', data.get('orderId', f"TRX{int(datetime.now().timestamp())}"))
        
        if amount <= 0:
            return jsonify({'error': 'Invalid amount'}), 400
        
        bakong_id = get_config('MERCHANT_BAKONG_ID') or 'phorn_sokkhim@bkrt'
        merchant_name = get_config('MERCHANT_NAME') or 'Phorn Sokkhim'
        merchant_city = get_config('MERCHANT_CITY') or 'Phnom Penh'

        # Generate official EMVCo KHQR code
        qr, md5 = generate_emvco_khqr(bakong_id, merchant_name, merchant_city, amount, currency)
        
        # Direct official Bakong deeplink
        deeplink = f"https://bakong.nbc.org.kh/pay?md5={md5}"
        
        # Save to MongoDB Atlas / MySQL / Cache
        payment_doc = {
            'bill_number': bill_number,
            'qr_code': qr,
            'md5_hash': md5,
            'deeplink': deeplink,
            'amount': amount,
            'currency': currency,
            'customer_phone': phone,
            'status': 'UNPAID',
            'created_at': datetime.now().isoformat()
        }
        save_payment_record(payment_doc)
        
        # Send Telegram notification (if configured)
        send_telegram(f"""
🆕 <b>New Payment</b>
💰 {amount} {currency}
🔢 {bill_number}
🔐 {md5}
        """)
        
        return jsonify({
            'success': True,
            'status': 'SUCCESS',
            'bill_number': bill_number,
            'orderId': bill_number,
            'qr_code': qr,
            'khqrString': qr,
            'md5_hash': md5,
            'md5': md5,
            'deeplink': deeplink,
            'amount': amount,
            'amountUsd': amount if currency == 'USD' else amount / 4100,
            'amountKhr': round(amount * 4100) if currency == 'USD' else amount,
            'currency': currency,
            'bakongAccountId': bakong_id,
            'merchantName': merchant_name,
            'qr_image_url': f"/api/payment/qr/{md5}",
            'qrImageUrl': f"/api/payment/qr/{md5}"
        }), 201
        
    except Exception as e:
        print(f"Error in create_payment: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@app.route('/api/payments/khqr/check-status', methods=['POST'])
def check_khqr_status_body():
    """POST /api/payments/khqr/check-status matching Restaurant Management System format"""
    data = request.get_json() or {}
    md5 = data.get('md5', '')
    if not md5:
        return jsonify({'paid': False, 'message': 'Missing md5'}), 400
    return check_status(md5)

# Last check timestamp cache to throttle rapid duplicate calls (2 seconds minimum)
last_check_cache = {}

def query_bakong_nbc_direct(md5):
    """
    Directly queries NBC Bakong check_transaction_by_md5 API
    matching the proven working implementation in Restaurant Management System
    """
    tokens = [
        # 1. Fresh active token from Restaurant Management System
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiYzY4NGNhNTUwNTJmNDRjYiJ9LCJpYXQiOjE3ODcwNTkwNTIsImV4cCI6MTc5NDgzNTA1Mn0.IOaSl7-TRdyrTjWM7mQMaaaAUP0E7N7zgtX-AsPZPLE",
        # 2. Configured token from environment
        get_config('BAKONG_TOKEN', '')
    ]

    for tok in tokens:
        if not tok:
            continue
        try:
            url = "https://api-bakong.nbc.gov.kh/v1/check_transaction_by_md5"
            headers = {
                "Authorization": f"Bearer {tok}",
                "Content-Type": "application/json"
            }
            resp = requests.post(url, json={"md5": md5}, headers=headers, timeout=6)
            if resp.status_code == 200:
                data = resp.json()
                resp_code = data.get("responseCode")
                if resp_code == 0:
                    print(f"[BAKONG-SUCCESS] MD5 {md5} CONFIRMED PAID by Bakong NBC!")
                    return "PAID", data.get("data")
                elif data.get("errorCode") == 17:
                    print(f"[BAKONG-WARN] Token rate-limited, failing over to backup...")
                    continue
                else:
                    # Genuinely unpaid / not found on Bakong yet
                    return "UNPAID", None
        except Exception as e:
            print(f"[BAKONG-ERR] Error checking Bakong API: {e}")
            continue

    return "UNPAID", None


@app.route('/api/payment/status/<md5>', methods=['GET'])
def check_status(md5):
    """Check payment status — checks cache/DB first, then real Bakong API"""
    try:
        # 1. Check in-memory cache first (fastest path)
        if md5 in qr_cache and qr_cache[md5].get('status') == 'PAID':
            return jsonify({'md5_hash': md5, 'status': 'PAID', 'paid': True})

        # 2. Check MongoDB Atlas payments collection
        if mongo_payments is not None:
            try:
                doc = mongo_payments.find_one({'md5_hash': md5})
                if doc and doc.get('status') == 'PAID':
                    if md5 not in qr_cache:
                        qr_cache[md5] = {}
                    qr_cache[md5]['status'] = 'PAID'
                    return jsonify({'md5_hash': md5, 'status': 'PAID', 'paid': True})
            except Exception as mongo_e:
                print(f"MongoDB check error: {mongo_e}")

        # 3. Check MySQL database if connected
        conn = get_db_connection()
        if conn:
            try:
                cursor = conn.cursor()
                cursor.execute("SELECT status FROM payments WHERE md5_hash = %s", (md5,))
                row = cursor.fetchone()
                if row and row[0] == 'PAID':
                    if md5 not in qr_cache:
                        qr_cache[md5] = {}
                    qr_cache[md5]['status'] = 'PAID'
                    return jsonify({'md5_hash': md5, 'status': 'PAID', 'paid': True})
            except Exception as db_e:
                print(f"DB check error: {db_e}")
            finally:
                conn.close()

        # 4. Minimal throttle: at most once per 2 seconds per MD5
        now_ts = datetime.now().timestamp()
        last_check = last_check_cache.get(md5, 0)
        if (now_ts - last_check) < 2.0:
            current_st = qr_cache.get(md5, {}).get('status', 'UNPAID')
            return jsonify({
                'md5_hash': md5,
                'status': current_st,
                'paid': current_st == 'PAID',
                'cached': True
            })

        last_check_cache[md5] = now_ts

        # 5. Call real Bakong NBC API
        status, pay_data = query_bakong_nbc_direct(md5)
        print(f"[+] Bakong status for {md5}: {status}")

        # 6. Update all stores if PAID
        if status == "PAID":
            print(f"[+] Payment PAID! Updating records for {md5}...")
            if md5 not in qr_cache:
                qr_cache[md5] = {}
            qr_cache[md5]['status'] = 'PAID'
            qr_cache[md5]['paid_at'] = datetime.now().isoformat()

            if mongo_payments is not None:
                try:
                    mongo_payments.update_one(
                        {'md5_hash': md5},
                        {'$set': {'status': 'PAID', 'paid_at': datetime.now().isoformat()}},
                        upsert=True
                    )
                    print(f"[+] Updated PAID in MongoDB Atlas: {md5}")
                except Exception as e:
                    print(f"[-] MongoDB update error: {e}")

            conn = get_db_connection()
            if conn:
                try:
                    cursor = conn.cursor()
                    cursor.execute(
                        "UPDATE payments SET status='PAID', paid_at=NOW() WHERE md5_hash=%s AND status='UNPAID'",
                        (md5,)
                    )
                    conn.commit()
                finally:
                    conn.close()

            return jsonify({'md5_hash': md5, 'status': 'PAID', 'paid': True, 'data': pay_data})

        return jsonify({'md5_hash': md5, 'status': 'UNPAID', 'paid': False, 'message': 'You have not paid yet'})

    except Exception as e:
        print(f"[-] Error in check_status: {e}")
        return jsonify({'md5_hash': md5, 'status': 'UNPAID', 'paid': False, 'error': str(e)})


@app.route('/api/payment/force-check/<md5>', methods=['GET'])
def force_check_status(md5):
    """Force-check payment status with real Bakong API — strictly verifies payment on Bakong network"""
    try:
        # 1. Check in-memory cache/DB first
        if md5 in qr_cache and qr_cache[md5].get('status') == 'PAID':
            return jsonify({'md5_hash': md5, 'status': 'PAID', 'paid': True})

        if mongo_payments is not None:
            try:
                doc = mongo_payments.find_one({'md5_hash': md5})
                if doc and doc.get('status') == 'PAID':
                    if md5 not in qr_cache:
                        qr_cache[md5] = {}
                    qr_cache[md5]['status'] = 'PAID'
                    return jsonify({'md5_hash': md5, 'status': 'PAID', 'paid': True})
            except Exception as mongo_e:
                print(f"MongoDB force-check error: {mongo_e}")

        # 2. Query real Bakong NBC API (bypass throttle)
        last_check_cache[md5] = 0
        status, pay_data = query_bakong_nbc_direct(md5)
        print(f"[FORCE-CHECK] Bakong NBC API status for {md5}: {status}")

        # 3. Only update records if REAL payment is confirmed PAID
        if status == "PAID":
            if md5 not in qr_cache:
                qr_cache[md5] = {}
            qr_cache[md5]['status'] = 'PAID'
            qr_cache[md5]['paid_at'] = datetime.now().isoformat()
            if mongo_payments is not None:
                try:
                    mongo_payments.update_one(
                        {'md5_hash': md5},
                        {'$set': {'status': 'PAID', 'paid_at': datetime.now().isoformat()}},
                        upsert=True
                    )
                except Exception:
                    pass

            conn = get_db_connection()
            if conn:
                try:
                    cursor = conn.cursor()
                    cursor.execute(
                        "UPDATE payments SET status='PAID', paid_at=NOW() WHERE md5_hash=%s AND status='UNPAID'",
                        (md5,)
                    )
                    conn.commit()
                finally:
                    conn.close()

            return jsonify({'md5_hash': md5, 'status': 'PAID', 'paid': True, 'data': pay_data})

        return jsonify({
            'md5_hash': md5,
            'status': 'UNPAID',
            'paid': False,
            'message': 'You have not paid yet'
        })

    except Exception as e:
        return jsonify({'md5_hash': md5, 'status': 'UNPAID', 'paid': False, 'error': str(e)})

@app.route('/api/payment/confirm/<md5>', methods=['POST', 'GET'])
def confirm_payment(md5):
    """Manually confirm/simulate payment as PAID"""
    try:
        if md5 not in qr_cache:
            qr_cache[md5] = {'status': 'PAID'}
        else:
            qr_cache[md5]['status'] = 'PAID'

        conn = get_db_connection()
        if conn:
            try:
                cursor = conn.cursor()
                cursor.execute("""
                    UPDATE payments 
                    SET status = 'PAID', paid_at = NOW()
                    WHERE md5_hash = %s
                """, (md5,))
                conn.commit()
            finally:
                conn.close()

        print(f"[+] Payment confirmed as PAID for {md5}")
        return jsonify({
            'success': True,
            'md5_hash': md5,
            'status': 'PAID',
            'message': 'Payment marked as PAID'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/payment/info/<md5>', methods=['GET'])
def get_payment_info(md5):
    """Get payment information"""
    try:
        info = khqr.get_payment(md5)
        return jsonify(info or {'message': 'Transaction not found or pending', 'paid': False})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/payment/check-bulk', methods=['POST'])
@app.route('/api/payments/check-bulk', methods=['POST'])
def check_bulk_status():
    """Bulk check transaction statuses via Bakong check_transaction_by_md5_list with fallback"""
    data = request.get_json() or {}
    md5_list = data.get('md5_list', [])
    if not md5_list or not isinstance(md5_list, list):
        return jsonify({'error': 'md5_list array is required'}), 400
    try:
        try:
            paid_hashes = khqr.check_bulk_payments(md5_list[:50])
            return jsonify({
                'success': True,
                'paid_md5': paid_hashes,
                'count': len(paid_hashes)
            })
        except Exception as bulk_err:
            print(f"[!] Bulk endpoint notice: {bulk_err}, failing over to single queries...")
            paid_hashes = []
            for h in md5_list[:20]:
                st, _ = query_bakong_nbc_direct(h)
                if st == "PAID":
                    paid_hashes.append(h)
            return jsonify({
                'success': True,
                'paid_md5': paid_hashes,
                'count': len(paid_hashes),
                'fallback': True
            })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/payment/webcheckout/create', methods=['POST'])
def create_web_checkout():
    """Create a Web Checkout Session using Bakong Relay"""
    try:
        data = request.get_json() or {}
        session = khqr.create_webcheckout(
            trans_id=data.get('trans_id', f"TRX{int(time.time())}"),
            account_id=data.get('account_id', get_config('MERCHANT_BAKONG_ID', 'deth_peak3@aclb')),
            merchant_name=data.get('merchant_name', get_config('MERCHANT_NAME', 'PuDeth Smart-PAY')),
            merchant_city=data.get('merchant_city', get_config('MERCHANT_CITY', 'Phnom Penh')),
            amount=float(data.get('amount', 0.95)),
            currency=data.get('currency', 'USD').upper(),
            return_url=data.get('return_url', 'https://mlbb-topup-jet.vercel.app/topup'),
            webhook_url=data.get('webhook_url', f"{get_config('APP_URL')}/api/payment/callback"),
            lang=data.get('lang', 'en'),
            ttl=int(data.get('ttl', 5))
        )
        return jsonify(session)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/payment/webcheckout/status/<session_id>', methods=['GET'])
def get_web_checkout_status(session_id):
    """Check the status of a Web Checkout session"""
    try:
        status = khqr.get_webcheckout(session_id=session_id)
        return jsonify(status)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/payments', methods=['GET'])
def list_payments():
    """List all payments"""
    try:
        status = request.args.get('status')
        limit = int(request.args.get('limit', 20))
        
        conn = get_db_connection()
        if not conn:
            return jsonify({'error': 'Database connection failed'}), 500
        
        try:
            cursor = conn.cursor(dictionary=True)
            
            if status:
                cursor.execute("""
                    SELECT * FROM payments 
                    WHERE status = %s 
                    ORDER BY created_at DESC 
                    LIMIT %s
                """, (status, limit))
            else:
                cursor.execute("""
                    SELECT * FROM payments 
                    ORDER BY created_at DESC 
                    LIMIT %s
                """, (limit,))
            
            payments = cursor.fetchall()
            
            # Convert datetime to string
            for p in payments:
                if p.get('created_at'):
                    p['created_at'] = p['created_at'].isoformat()
                if p.get('paid_at'):
                    p['paid_at'] = p['paid_at'].isoformat()
            
            return jsonify({
                'count': len(payments),
                'payments': payments
            })
            
        finally:
            conn.close()
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/payment/qr/<md5>', methods=['GET'])
def get_qr_image(md5):
    """Get QR code image"""
    try:
        qr_code = None
        
        # 1. Check MongoDB Atlas / memory cache
        rec = get_payment_record(md5)
        if rec and rec.get('qr_code'):
            qr_code = rec['qr_code']
            print(f"[+] QR code found in MongoDB Atlas for {md5}")

        # 2. Check MySQL database
        if not qr_code:
            conn = get_db_connection()
            if conn:
                try:
                    cursor = conn.cursor()
                    cursor.execute("SELECT qr_code FROM payments WHERE md5_hash = %s", (md5,))
                    result = cursor.fetchone()
                    if result:
                        qr_code = result[0]
                finally:
                    conn.close()
        
        if not qr_code:
            print(f"[*] Generating dynamic KHQR for {md5} on the fly...")
            try:
                amt = float(request.args.get('amount', 0.95))
                curr = request.args.get('currency', 'USD').upper()
                qr_code = khqr.create_qr(
                    bank_account=get_config('MERCHANT_BAKONG_ID', 'deth_peak3@aclb'),
                    merchant_name=get_config('MERCHANT_NAME', 'PuDeth Smart-PAY'),
                    merchant_city=get_config('MERCHANT_CITY', 'PHNOM PENH'),
                    amount=amt,
                    currency=curr,
                    store_label='Smart-PAY',
                    phone_number='85512345678',
                    bill_number=f"TRX{int(datetime.now().timestamp())}",
                    terminal_label='POS-01',
                    static=False,
                    expiration=1
                )
                qr_cache[md5] = {'qr_code': qr_code, 'md5_hash': md5}
            except Exception as dyn_err:
                print(f"[-] Dynamic QR error: {dyn_err}")
                currTag = '116' if request.args.get('currency') == 'KHR' else '840'
                qr_code = f"00020101021229190015deth_peak3@aclb520459995303{currTag}54040.955802KH5916PuDeth Smart-PAY6010PHNOM PENH62400309Smart-PAY02090123456780110TRX016304ED20"
        
        # Generate QR image as bytes using official Bakong image generator
        try:
            qr_bytes = khqr.qr_image(qr_code, format='bytes')
            return send_file(
                io.BytesIO(qr_bytes),
                mimetype='image/png',
                as_attachment=False,
                download_name=f'qr_{md5}.png'
            )
        except Exception as img_error:
            print(f"[-] Error generating Bakong styled QR image: {img_error}")
            import qrcode
            qr_img = qrcode.make(qr_code)
            img_io = io.BytesIO()
            qr_img.save(img_io, 'PNG')
            img_io.seek(0)
            return send_file(img_io, mimetype='image/png')
        
    except Exception as e:
        print(f"[-] Error in get_qr_image: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/payment/callback', methods=['POST', 'GET'])
def payment_callback():
    """Payment callback endpoint"""
    try:
        data = request.get_json() if request.is_json else request.args.to_dict()
        
        # Log callback
        print(f"Payment callback received: {data}")
        
        return jsonify({
            'success': True,
            'message': 'Callback received'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/branding', methods=['GET', 'POST', 'PUT'])
@app.route('/api/admin/branding', methods=['GET', 'POST', 'PUT'])
def handle_branding():
    """Fetch or update store branding persisted in MongoDB Atlas settings collection"""
    if request.method == 'GET':
        if mongo_db is not None:
            try:
                branding_doc = mongo_db.settings.find_one({'type': 'store_branding'})
                if branding_doc:
                    branding_doc.pop('_id', None)
                    return jsonify({'success': True, 'branding': branding_doc.get('data')})
            except Exception as e:
                print(f"[-] MongoDB branding fetch error: {e}")
        return jsonify({'success': True, 'branding': None})
    
    if request.method in ['POST', 'PUT']:
        try:
            data = request.get_json() or {}
            if mongo_db is not None:
                mongo_db.settings.update_one(
                    {'type': 'store_branding'},
                    {'$set': {'type': 'store_branding', 'data': data, 'updated_at': datetime.utcnow().isoformat()}},
                    upsert=True
                )
                print("[+] Saved branding to MongoDB Atlas settings collection!")
            return jsonify({'success': True, 'branding': data})
        except Exception as e:
            return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/games', methods=['GET', 'POST', 'PUT'])
@app.route('/api/admin/games', methods=['GET', 'POST', 'PUT'])
def handle_games_config():
    """Fetch or update store games catalog & status persisted in MongoDB Atlas settings collection"""
    if request.method == 'GET':
        if mongo_db is not None:
            try:
                doc = mongo_db.settings.find_one({'type': 'store_games_config'})
                if doc:
                    doc.pop('_id', None)
                    return jsonify({'success': True, 'games': doc.get('data')})
            except Exception as e:
                print(f"[-] MongoDB games fetch error: {e}")
        return jsonify({'success': True, 'games': None})
    
    if request.method in ['POST', 'PUT']:
        try:
            data = request.get_json() or {}
            games_payload = data.get('games') if isinstance(data, dict) and 'games' in data else data
            if mongo_db is not None:
                mongo_db.settings.update_one(
                    {'type': 'store_games_config'},
                    {'$set': {'type': 'store_games_config', 'data': games_payload, 'updated_at': datetime.utcnow().isoformat()}},
                    upsert=True
                )
                print("[+] Saved games config & statuses to MongoDB Atlas settings collection!")
            return jsonify({'success': True, 'games': games_payload})
        except Exception as e:
            return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/master-status', methods=['GET', 'POST', 'PUT'])
@app.route('/api/admin/master-status', methods=['GET', 'POST', 'PUT'])
def handle_master_status():
    """Fetch or update master top-up status persisted in MongoDB Atlas settings collection"""
    if request.method == 'GET':
        if mongo_db is not None:
            try:
                doc = mongo_db.settings.find_one({'type': 'store_master_status'})
                if doc:
                    doc.pop('_id', None)
                    return jsonify({'success': True, 'masterStatus': doc.get('data')})
            except Exception as e:
                print(f"[-] MongoDB master status fetch error: {e}")
        return jsonify({'success': True, 'masterStatus': None})
    
    if request.method in ['POST', 'PUT']:
        try:
            data = request.get_json() or {}
            if mongo_db is not None:
                mongo_db.settings.update_one(
                    {'type': 'store_master_status'},
                    {'$set': {'type': 'store_master_status', 'data': data, 'updated_at': datetime.utcnow().isoformat()}},
                    upsert=True
                )
                print("[+] Saved master top-up status to MongoDB Atlas settings collection!")
            return jsonify({'success': True, 'masterStatus': data})
        except Exception as e:
            return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/config', methods=['GET'])
def get_current_config():
    """Get active Bakong KHQR configuration"""
    token = get_config('BAKONG_TOKEN')
    masked_token = (token[:10] + '...' + token[-8:]) if len(token) > 20 else token
    return jsonify({
        'success': True,
        'merchant_bakong_id': get_config('MERCHANT_BAKONG_ID'),
        'merchant_name': get_config('MERCHANT_NAME'),
        'merchant_city': get_config('MERCHANT_CITY'),
        'acquiring_bank': get_config('ACQUIRING_BANK'),
        'demo_mode': str(get_config('DEMO_MODE')).lower() == 'true',
        'bakong_token': token,
        'masked_token': masked_token,
        'token_length': len(token),
        'telegram_bot_token': get_config('TELEGRAM_BOT_TOKEN'),
        'telegram_chat_id': get_config('TELEGRAM_CHAT_ID')
    })

@app.route('/api/config/update', methods=['POST'])
def update_current_config():
    """Update active Bakong KHQR configuration and persist to .env"""
    try:
        data = request.get_json() or {}
        
        # Update runtime config
        for key in ['BAKONG_TOKEN', 'MERCHANT_BAKONG_ID', 'MERCHANT_NAME', 'MERCHANT_CITY', 
                    'ACQUIRING_BANK', 'DEMO_MODE', 'TELEGRAM_BOT_TOKEN', 'TELEGRAM_CHAT_ID']:
            if key in data:
                runtime_config[key] = data[key]

        # Reload KHQR instance
        reload_khqr_instance()

        # Persist changes to .env file
        env_path = os.path.join(os.path.dirname(__file__), '.env')
        if os.path.exists(env_path):
            with open(env_path, 'r', encoding='utf-8') as f:
                lines = f.readlines()
            
            new_lines = []
            keys_written = set()
            for line in lines:
                written = False
                for key in runtime_config:
                    if line.strip().startswith(f"{key}="):
                        val = runtime_config[key]
                        if isinstance(val, bool):
                            val = str(val).lower()
                        new_lines.append(f'{key}="{val}"\n' if ' ' in str(val) else f'{key}={val}\n')
                        keys_written.add(key)
                        written = True
                        break
                if not written:
                    new_lines.append(line)
            
            with open(env_path, 'w', encoding='utf-8') as f:
                f.writelines(new_lines)

        print(f"[+] Configuration updated dynamically: Merchant={runtime_config['MERCHANT_NAME']}, BakongId={runtime_config['MERCHANT_BAKONG_ID']}")
        return jsonify({
            'success': True,
            'message': 'Bakong configuration updated and applied successfully',
            'config': {
                'merchant_bakong_id': runtime_config['MERCHANT_BAKONG_ID'],
                'merchant_name': runtime_config['MERCHANT_NAME'],
                'merchant_city': runtime_config['MERCHANT_CITY'],
                'acquiring_bank': runtime_config['ACQUIRING_BANK'],
                'demo_mode': runtime_config['DEMO_MODE'],
                'token_length': len(runtime_config['BAKONG_TOKEN'])
            }
        })
    except Exception as e:
        print(f"[-] Config update error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/config/test-token', methods=['POST'])
def test_bakong_token():
    """Test a Bakong token directly against NBC Bakong API"""
    try:
        data = request.get_json() or {}
        test_token = data.get('token') or get_config('BAKONG_TOKEN')
        
        start_time = datetime.now()
        headers = {
            'Authorization': f'Bearer {test_token}',
            'Content-Type': 'application/json'
        }
        test_md5 = "00000000000000000000000000000000"
        resp = requests.post(
            f"{os.getenv('BAKONG_API_URL', 'https://api-bakong.nbc.gov.kh')}/v1/check_transaction_by_md5",
            json={'md5': test_md5},
            headers=headers,
            timeout=10
        )
        latency = int((datetime.now() - start_time).total_seconds() * 1000)
        
        resp_json = resp.json() if resp.status_code == 200 else {}
        resp_code = resp_json.get('responseCode')
        resp_msg = resp_json.get('responseMessage', resp.text)
        error_code = resp_json.get('errorCode')

        is_token_valid = True
        status_desc = "Connected & Active"
        if resp.status_code == 401 or 'unauthorized' in resp_msg.lower() or 'token' in resp_msg.lower():
            is_token_valid = False
            status_desc = "Invalid or Expired Token"
        elif error_code == 17 or 'limit' in resp_msg.lower():
            status_desc = "Rate Limited (100 daily limit reached on NBC)"
        elif resp_code == 1 and 'not found' in resp_msg.lower():
            status_desc = "Token is VALID & Active (NBC API responded normally)"

        return jsonify({
            'success': is_token_valid,
            'status': status_desc,
            'latency_ms': latency,
            'http_status': resp.status_code,
            'response_code': resp_code,
            'error_code': error_code,
            'response_message': resp_msg,
            'token_length': len(test_token)
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'status': f'Connection Error: {str(e)}',
            'error': str(e)
        }), 500

@app.route('/health', methods=['GET'])
@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    response = jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat()
    })
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

if __name__ == '__main__':
    # Create tables on startup
    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS payments (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    bill_number VARCHAR(50) UNIQUE NOT NULL,
                    qr_code TEXT NOT NULL,
                    md5_hash VARCHAR(32) UNIQUE NOT NULL,
                    deeplink TEXT,
                    amount DECIMAL(10, 2) NOT NULL,
                    currency VARCHAR(3) NOT NULL,
                    customer_phone VARCHAR(20),
                    status ENUM('UNPAID', 'PAID', 'EXPIRED') DEFAULT 'UNPAID',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    paid_at TIMESTAMP NULL,
                    INDEX idx_md5 (md5_hash),
                    INDEX idx_status (status),
                    INDEX idx_bill (bill_number)
                )
            """)
            conn.commit()
            print("[+] Database tables ready")
        finally:
            conn.close()
    
    port = int(os.getenv('PORT', 5001))
    print(f"\n[+] Starting {os.getenv('APP_NAME')} API...")
    print(f"[+] Running on http://localhost:{port}")
    print(f"[+] Merchant: {os.getenv('MERCHANT_NAME')}\n")
    
    app.run(
        host='0.0.0.0',
        port=port,
        debug=False,
        use_reloader=False
    )
