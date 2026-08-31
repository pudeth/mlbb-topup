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

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False

# Enable CORS for all routes (including /health)
CORS(app, origins="*", supports_credentials=True)

# Runtime configuration (overrides .env in memory and persists to .env)
runtime_config = {
    'BAKONG_TOKEN': os.getenv('BAKONG_TOKEN', ''),
    'MERCHANT_BAKONG_ID': os.getenv('MERCHANT_BAKONG_ID', 'deth_peak3@aclb'),
    'MERCHANT_NAME': os.getenv('MERCHANT_NAME', 'PuDeth Smart-PAY'),
    'MERCHANT_CITY': os.getenv('MERCHANT_CITY', 'PHNOM PENH'),
    'ACQUIRING_BANK': os.getenv('ACQUIRING_BANK', 'FAMILY PHONE'),
    'DEMO_MODE': os.getenv('DEMO_MODE', 'false').lower() == 'true',
    'TELEGRAM_BOT_TOKEN': os.getenv('TELEGRAM_BOT_TOKEN', ''),
    'TELEGRAM_CHAT_ID': os.getenv('TELEGRAM_CHAT_ID', '')
}

def get_config(key, default=''):
    return runtime_config.get(key, os.getenv(key, default))

# Initialize KHQR
khqr = KHQR(get_config('BAKONG_TOKEN'))

def reload_khqr_instance():
    global khqr
    token = get_config('BAKONG_TOKEN')
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

@app.route('/api/payment/create', methods=['POST'])
def create_payment():
    """Create a new payment"""
    try:
        data = request.get_json()
        
        amount = float(data.get('amount', 0))
        currency = data.get('currency', 'USD').upper()
        phone = data.get('phone', '')
        bill_number = data.get('bill_number', f"TRX{int(datetime.now().timestamp())}")
        
        if amount <= 0:
            return jsonify({'error': 'Invalid amount'}), 400
        
        # Generate QR code
        qr = khqr.create_qr(
            bank_account=get_config('MERCHANT_BAKONG_ID'),
            merchant_name=get_config('MERCHANT_NAME'),
            merchant_city=get_config('MERCHANT_CITY'),
            amount=amount,
            currency=currency,
            store_label='Smart-PAY',
            phone_number=phone or '85512345678',
            bill_number=bill_number,
            terminal_label='POS-01',
            static=False,
            expiration=1
        )
        
        # Generate MD5 and deeplink
        md5 = khqr.generate_md5(qr)
        
        # Try to generate deeplink (skip if demo mode or if it fails)
        demo_mode = str(get_config('DEMO_MODE')).lower() == 'true'
        deeplink = None
        
        if not demo_mode:
            try:
                deeplink = khqr.generate_deeplink(
                    qr,
                    callback=f"{get_config('APP_URL', 'http://localhost:5001')}/api/payment/callback",
                    appIconUrl=f"{get_config('APP_URL', 'http://localhost:5001')}/logo.png",
                    appName="SmartPAY"
                )
            except Exception as e:
                print(f"Warning: Could not generate deeplink: {e}")
                deeplink = None
        
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
        
        # Send Telegram notification
        send_telegram(f"""
🆕 <b>New Payment</b>
💰 {amount} {currency}
🔢 {bill_number}
🔐 {md5}
        """)
        
        return jsonify({
            'success': True,
            'bill_number': bill_number,
            'qr_code': qr,
            'md5_hash': md5,
            'deeplink': deeplink,
            'amount': amount,
            'currency': currency,
            'qr_image_url': f"/api/payment/qr/{md5}"
        }), 201
        
    except Exception as e:
        print(f"Error in create_payment: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

# Last check timestamp cache to prevent exceeding Bakong 100/day limit
last_check_cache = {}

@app.route('/api/payment/status/<md5>', methods=['GET'])
def check_status(md5):
    """Check payment status with rate-limit protection and smart caching"""
    try:
        # 1. Check in-memory cache first
        if md5 in qr_cache and qr_cache[md5].get('status') == 'PAID':
            return jsonify({
                'md5_hash': md5,
                'status': 'PAID'
            })

        # 2. Check database if connected
        conn = get_db_connection()
        if conn:
            try:
                cursor = conn.cursor()
                cursor.execute("SELECT status FROM payments WHERE md5_hash = %s", (md5,))
                row = cursor.fetchone()
                if row and row[0] == 'PAID':
                    if md5 in qr_cache:
                        qr_cache[md5]['status'] = 'PAID'
                    return jsonify({
                        'md5_hash': md5,
                        'status': 'PAID'
                    })
            except Exception as db_e:
                print(f"DB check error: {db_e}")
            finally:
                conn.close()

        # Check if in demo mode
        demo_mode = os.getenv('DEMO_MODE', 'false').lower() == 'true'
        if demo_mode:
            return jsonify({
                'md5_hash': md5,
                'status': qr_cache.get(md5, {}).get('status', 'UNPAID'),
                'demo': True
            })

        # Throttle Bakong NBC API checks: at most once every 6 seconds per MD5 to preserve 100/day limit
        now_ts = datetime.now().timestamp()
        last_check = last_check_cache.get(md5, 0)
        if (now_ts - last_check) < 6.0:
            return jsonify({
                'md5_hash': md5,
                'status': qr_cache.get(md5, {}).get('status', 'UNPAID'),
                'cached': True
            })

        last_check_cache[md5] = now_ts

        # Try to check with Bakong API
        status = "UNPAID"
        try:
            print(f"Checking Bakong API for MD5: {md5}")
            raw_st = khqr.check_payment(md5)
            if str(raw_st).strip().upper() in ["PAID", "SUCCESS", "COMPLETED"]:
                status = "PAID"
            else:
                status = "UNPAID"
            print(f"[+] Bakong status for {md5}: {status}")
        except Exception as api_error:
            error_msg = str(api_error)
            print(f"[-] Bakong API notice: {error_msg}")
            
            # Rate limit or temporary error - return current status with warning and rate_limited flag
            is_rate_limit = "limit" in error_msg.lower() or "exceeded" in error_msg.lower() or "17" in error_msg
            return jsonify({
                'md5_hash': md5,
                'status': qr_cache.get(md5, {}).get('status', 'UNPAID'),
                'warning': error_msg,
                'rate_limited': is_rate_limit
            })

        # Update MongoDB Atlas, database and cache if paid
        if status == "PAID":
            print(f"[+] Payment is PAID! Updating records...")
            if md5 not in qr_cache:
                qr_cache[md5] = {}
            qr_cache[md5]['status'] = 'PAID'
            qr_cache[md5]['paid_at'] = datetime.now().isoformat()

            if mongo_payments is not None:
                try:
                    mongo_payments.update_one(
                        {'md5_hash': md5},
                        {'$set': {'status': 'PAID', 'paid_at': datetime.now().isoformat()}}
                    )
                    print(f"[+] Updated status to PAID in MongoDB Atlas: {md5}")
                except Exception as e:
                    print(f"[-] MongoDB update error: {e}")

            conn = get_db_connection()
            if conn:
                try:
                    cursor = conn.cursor()
                    cursor.execute("""
                        UPDATE payments 
                        SET status = 'PAID', paid_at = NOW()
                        WHERE md5_hash = %s AND status = 'UNPAID'
                    """, (md5,))
                    conn.commit()
                finally:
                    conn.close()

        return jsonify({
            'md5_hash': md5,
            'status': status
        })
        
    except Exception as e:
        print(f"[-] Error in check_status: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'md5_hash': md5,
            'status': qr_cache.get(md5, {}).get('status', 'UNPAID'),
            'error': str(e)
        })

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
        return jsonify(info)
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
            print(f"[-] QR code not found for {md5}")
            return jsonify({'error': 'Payment not found'}), 404
        
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
