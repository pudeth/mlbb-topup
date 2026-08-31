#!/usr/bin/env python
"""
Complete Bakong KHQR Payment System
Integrates with MySQL database and Telegram notifications
Runs both API and Web Server
"""

import os
import sys
from dotenv import load_dotenv
from bakong_khqr import KHQR
import mysql.connector
from mysql.connector import Error
import requests
from datetime import datetime
import time
import threading
import webbrowser
from threading import Timer

# Load environment variables
load_dotenv()

class BakongPaymentSystem:
    def __init__(self):
        """Initialize the payment system with credentials from .env"""
        self.app_name = os.getenv('APP_NAME')
        self.bakong_token = os.getenv('BAKONG_TOKEN')
        self.merchant_id = os.getenv('MERCHANT_BAKONG_ID')
        self.merchant_name = os.getenv('MERCHANT_NAME')
        self.merchant_city = os.getenv('MERCHANT_CITY')
        self.telegram_token = os.getenv('TELEGRAM_BOT_TOKEN')
        self.telegram_chat_id = os.getenv('TELEGRAM_CHAT_ID')
        
        # Initialize KHQR
        self.khqr = KHQR(self.bakong_token)
        
        # Database connection
        self.db_config = {
            'host': os.getenv('DB_HOST'),
            'port': int(os.getenv('DB_PORT', 3306)),
            'database': os.getenv('DB_DATABASE'),
            'user': os.getenv('DB_USERNAME'),
            'password': os.getenv('DB_PASSWORD', '')
        }
    
    def connect_db(self):
        """Connect to MySQL database"""
        try:
            connection = mysql.connector.connect(**self.db_config)
            if connection.is_connected():
                return connection
        except Error as e:
            print(f"Error connecting to MySQL: {e}")
            return None
    
    def create_tables(self):
        """Create necessary database tables"""
        connection = self.connect_db()
        if not connection:
            print("⚠ Database connection failed. Skipping table creation.")
            return False
        
        try:
            cursor = connection.cursor()
            
            # Create payments table
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
            
            connection.commit()
            print("✓ Database tables created successfully")
            return True
            
        except Error as e:
            print(f"Error creating tables: {e}")
            return False
        finally:
            if connection.is_connected():
                cursor.close()
                connection.close()
    
    def send_telegram_notification(self, message):
        """Send notification via Telegram"""
        if not self.telegram_token or not self.telegram_chat_id:
            return False
        
        try:
            url = f"https://api.telegram.org/bot{self.telegram_token}/sendMessage"
            data = {
                "chat_id": self.telegram_chat_id,
                "text": message,
                "parse_mode": "HTML"
            }
            response = requests.post(url, data=data, timeout=10)
            return response.status_code == 200
        except Exception as e:
            print(f"Telegram notification error: {e}")
            return False
    
    def create_payment(self, amount, currency='USD', phone_number='', bill_number=None):
        """Create a new payment transaction"""
        if not bill_number:
            bill_number = f"TRX{int(time.time())}"
        
        try:
            # Generate QR code
            qr = self.khqr.create_qr(
                bank_account=self.merchant_id,
                merchant_name=self.merchant_name,
                merchant_city=self.merchant_city,
                amount=amount,
                currency=currency,
                store_label='Smart-PAY',
                phone_number=phone_number or '85512345678',
                bill_number=bill_number,
                terminal_label='POS-01',
                static=False,
                expiration=1
            )
            
            # Generate MD5 hash
            md5 = self.khqr.generate_md5(qr)
            
            # Generate deeplink
            deeplink = self.khqr.generate_deeplink(
                qr,
                callback=f"{os.getenv('APP_URL')}/payment/callback",
                appIconUrl=f"{os.getenv('APP_URL')}/logo.png",
                appName="SmartPAY"
            )
            
            # Save to database
            connection = self.connect_db()
            if connection:
                try:
                    cursor = connection.cursor()
                    cursor.execute("""
                        INSERT INTO payments 
                        (bill_number, qr_code, md5_hash, deeplink, amount, currency, customer_phone)
                        VALUES (%s, %s, %s, %s, %s, %s, %s)
                    """, (bill_number, qr, md5, deeplink, amount, currency, phone_number))
                    connection.commit()
                    print("✓ Payment saved to database")
                except Error as e:
                    print(f"Database error: {e}")
                finally:
                    if connection.is_connected():
                        cursor.close()
                        connection.close()
            
            # Send Telegram notification
            message = f"""
🆕 <b>New Payment Created</b>

💰 Amount: {amount} {currency}
🔢 Bill: {bill_number}
📱 Phone: {phone_number or 'N/A'}
🔐 MD5: {md5}

🔗 <a href="{deeplink}">Pay Now</a>
            """
            self.send_telegram_notification(message)
            
            return {
                'success': True,
                'bill_number': bill_number,
                'qr_code': qr,
                'md5_hash': md5,
                'deeplink': deeplink,
                'amount': amount,
                'currency': currency
            }
            
        except Exception as e:
            print(f"Error creating payment: {e}")
            return {'success': False, 'error': str(e)}
    
    def check_payment_status(self, md5_hash):
        """Check if a payment has been completed"""
        try:
            status = self.khqr.check_payment(md5_hash)
            
            # Update database if paid
            if status == "PAID":
                connection = self.connect_db()
                if connection:
                    try:
                        cursor = connection.cursor()
                        cursor.execute("""
                            UPDATE payments 
                            SET status = 'PAID', paid_at = NOW()
                            WHERE md5_hash = %s AND status = 'UNPAID'
                        """, (md5_hash,))
                        connection.commit()
                        
                        if cursor.rowcount > 0:
                            # Get payment details
                            cursor.execute("""
                                SELECT bill_number, amount, currency 
                                FROM payments WHERE md5_hash = %s
                            """, (md5_hash,))
                            result = cursor.fetchone()
                            
                            if result:
                                bill, amount, currency = result
                                message = f"""
✅ <b>Payment Received!</b>

💰 Amount: {amount} {currency}
🔢 Bill: {bill}
🔐 MD5: {md5_hash}
⏰ Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
                                """
                                self.send_telegram_notification(message)
                    except Error as e:
                        print(f"Database error: {e}")
                    finally:
                        if connection.is_connected():
                            cursor.close()
                            connection.close()
            
            return status
            
        except Exception as e:
            print(f"Error checking payment: {e}")
            return "ERROR"
    
    def get_payment_info(self, md5_hash):
        """Get detailed payment information"""
        try:
            return self.khqr.get_payment(md5_hash)
        except Exception as e:
            print(f"Error getting payment info: {e}")
            return None
    
    def list_payments(self, status=None, limit=10):
        """List payments from database"""
        connection = self.connect_db()
        if not connection:
            return []
        
        try:
            cursor = connection.cursor(dictionary=True)
            
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
            
            return cursor.fetchall()
            
        except Error as e:
            print(f"Error listing payments: {e}")
            return []
        finally:
            if connection.is_connected():
                cursor.close()
                connection.close()
    
    def monitor_payments(self, interval=10):
        """Monitor unpaid payments and check their status"""
        print(f"\n🔄 Starting payment monitor (checking every {interval} seconds)...")
        print("Press Ctrl+C to stop\n")
        
        try:
            while True:
                unpaid = self.list_payments(status='UNPAID', limit=50)
                
                if unpaid:
                    print(f"Checking {len(unpaid)} unpaid transactions...")
                    
                    for payment in unpaid:
                        md5 = payment['md5_hash']
                        status = self.check_payment_status(md5)
                        
                        if status == "PAID":
                            print(f"✅ Payment {payment['bill_number']} is now PAID!")
                        else:
                            print(f"⏳ Payment {payment['bill_number']} still {status}")
                
                time.sleep(interval)
                
        except KeyboardInterrupt:
            print("\n\n⏹ Payment monitor stopped")


def main():
    """Main application entry point"""
    print("=" * 70)
    print(f"  {os.getenv('APP_NAME')}")
    print("=" * 70)
    
    # Initialize system
    system = BakongPaymentSystem()
    
    # Create database tables
    print("\n📊 Setting up database...")
    system.create_tables()
    
    # Main menu
    while True:
        print("\n" + "=" * 70)
        print("MENU:")
        print("1. Create New Payment")
        print("2. Check Payment Status")
        print("3. Get Payment Info")
        print("4. List Recent Payments")
        print("5. Monitor Payments (Auto-check)")
        print("6. Exit")
        print("=" * 70)
        
        choice = input("\nSelect option (1-6): ").strip()
        
        if choice == '1':
            print("\n--- Create New Payment ---")
            try:
                amount = float(input("Amount: "))
                currency = input("Currency (USD/KHR) [USD]: ").strip().upper() or 'USD'
                phone = input("Customer Phone (optional): ").strip()
                bill = input("Bill Number (optional, auto-generated): ").strip() or None
                
                result = system.create_payment(amount, currency, phone, bill)
                
                if result['success']:
                    print("\n✅ Payment Created Successfully!")
                    print(f"Bill Number: {result['bill_number']}")
                    print(f"Amount: {result['amount']} {result['currency']}")
                    print(f"MD5 Hash: {result['md5_hash']}")
                    print(f"Deeplink: {result['deeplink']}")
                    print(f"\nQR Code: {result['qr_code'][:80]}...")
                else:
                    print(f"\n❌ Error: {result.get('error')}")
            except ValueError:
                print("❌ Invalid amount")
        
        elif choice == '2':
            print("\n--- Check Payment Status ---")
            md5 = input("Enter MD5 hash: ").strip()
            status = system.check_payment_status(md5)
            print(f"\n📊 Payment Status: {status}")
        
        elif choice == '3':
            print("\n--- Get Payment Info ---")
            md5 = input("Enter MD5 hash: ").strip()
            info = system.get_payment_info(md5)
            if info:
                print("\n📄 Payment Information:")
                for key, value in info.items():
                    print(f"  {key}: {value}")
            else:
                print("❌ Payment not found")
        
        elif choice == '4':
            print("\n--- Recent Payments ---")
            status_filter = input("Filter by status (UNPAID/PAID/all) [all]: ").strip().upper()
            status_filter = status_filter if status_filter in ['UNPAID', 'PAID'] else None
            
            payments = system.list_payments(status=status_filter, limit=10)
            
            if payments:
                print(f"\nFound {len(payments)} payment(s):\n")
                for p in payments:
                    print(f"Bill: {p['bill_number']} | Amount: {p['amount']} {p['currency']} | Status: {p['status']} | Created: {p['created_at']}")
            else:
                print("No payments found")
        
        elif choice == '5':
            interval = input("Check interval in seconds [10]: ").strip()
            interval = int(interval) if interval.isdigit() else 10
            system.monitor_payments(interval)
        
        elif choice == '6':
            print("\n👋 Goodbye!")
            sys.exit(0)
        
        else:
            print("❌ Invalid option")


def run_api_server():
    """Run Flask API server"""
    from flask import Flask, request, jsonify, send_file
    from flask_cors import CORS
    
    app = Flask(__name__)
    app.config['JSON_AS_ASCII'] = False
    CORS(app, origins="*", supports_credentials=True)
    
    # Initialize KHQR for API
    khqr = KHQR(os.getenv('BAKONG_TOKEN'))
    
    # Database configuration
    db_config = {
        'host': os.getenv('DB_HOST'),
        'port': int(os.getenv('DB_PORT', 3306)),
        'database': os.getenv('DB_DATABASE'),
        'user': os.getenv('DB_USERNAME'),
        'password': os.getenv('DB_PASSWORD', '')
    }
    
    def get_db_connection():
        try:
            return mysql.connector.connect(**db_config)
        except Error as e:
            print(f"Database error: {e}")
            return None
    
    def send_telegram(message):
        try:
            url = f"https://api.telegram.org/bot{os.getenv('TELEGRAM_BOT_TOKEN')}/sendMessage"
            data = {"chat_id": os.getenv('TELEGRAM_CHAT_ID'), "text": message, "parse_mode": "HTML"}
            requests.post(url, data=data, timeout=10)
        except:
            pass
    
    @app.route('/')
    def index():
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
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        return response
    
    @app.route('/api/payment/create', methods=['POST'])
    def create_payment():
        try:
            data = request.get_json()
            amount = float(data.get('amount', 0))
            currency = data.get('currency', 'USD').upper()
            phone = data.get('phone', '')
            bill_number = data.get('bill_number', f"TRX{int(datetime.now().timestamp())}")
            
            if amount <= 0:
                return jsonify({'error': 'Invalid amount'}), 400
            
            qr = khqr.create_qr(
                bank_account=os.getenv('MERCHANT_BAKONG_ID'),
                merchant_name=os.getenv('MERCHANT_NAME'),
                merchant_city=os.getenv('MERCHANT_CITY'),
                amount=amount, currency=currency, store_label='Smart-PAY',
                phone_number=phone or '85512345678', bill_number=bill_number,
                terminal_label='POS-01', static=False, expiration=1
            )
            
            md5 = khqr.generate_md5(qr)
            deeplink = khqr.generate_deeplink(qr, callback=f"{os.getenv('APP_URL')}/api/payment/callback",
                                              appIconUrl=f"{os.getenv('APP_URL')}/logo.png", appName="SmartPAY")
            
            conn = get_db_connection()
            if conn:
                try:
                    cursor = conn.cursor()
                    cursor.execute("""INSERT INTO payments (bill_number, qr_code, md5_hash, deeplink, amount, currency, customer_phone)
                                   VALUES (%s, %s, %s, %s, %s, %s, %s)""", 
                                   (bill_number, qr, md5, deeplink, amount, currency, phone))
                    conn.commit()
                finally:
                    conn.close()
            
            send_telegram(f"🆕 <b>New Payment</b>\n💰 {amount} {currency}\n🔢 {bill_number}\n🔐 {md5}")
            
            return jsonify({
                'success': True, 'bill_number': bill_number, 'qr_code': qr,
                'md5_hash': md5, 'deeplink': deeplink, 'amount': amount,
                'currency': currency, 'qr_image_url': f"/api/payment/qr/{md5}"
            }), 201
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/payment/status/<md5>', methods=['GET'])
    def check_status(md5):
        try:
            status = khqr.check_payment(md5)
            if status == "PAID":
                conn = get_db_connection()
                if conn:
                    try:
                        cursor = conn.cursor()
                        cursor.execute("UPDATE payments SET status = 'PAID', paid_at = NOW() WHERE md5_hash = %s AND status = 'UNPAID'", (md5,))
                        conn.commit()
                        if cursor.rowcount > 0:
                            cursor.execute("SELECT bill_number, amount, currency FROM payments WHERE md5_hash = %s", (md5,))
                            result = cursor.fetchone()
                            if result:
                                send_telegram(f"✅ <b>Payment Received</b>\n💰 {result[1]} {result[2]}\n🔢 {result[0]}")
                    finally:
                        conn.close()
            return jsonify({'md5_hash': md5, 'status': status})
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/payment/info/<md5>', methods=['GET'])
    def get_payment_info(md5):
        try:
            info = khqr.get_payment(md5)
            return jsonify(info)
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/payments', methods=['GET'])
    def list_payments():
        try:
            status = request.args.get('status')
            limit = int(request.args.get('limit', 20))
            conn = get_db_connection()
            if not conn:
                return jsonify({'error': 'Database connection failed'}), 500
            try:
                cursor = conn.cursor(dictionary=True)
                if status:
                    cursor.execute("SELECT * FROM payments WHERE status = %s ORDER BY created_at DESC LIMIT %s", (status, limit))
                else:
                    cursor.execute("SELECT * FROM payments ORDER BY created_at DESC LIMIT %s", (limit,))
                payments = cursor.fetchall()
                for p in payments:
                    if p.get('created_at'):
                        p['created_at'] = p['created_at'].isoformat()
                    if p.get('paid_at'):
                        p['paid_at'] = p['paid_at'].isoformat()
                return jsonify({'count': len(payments), 'payments': payments})
            finally:
                conn.close()
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/payment/qr/<md5>', methods=['GET'])
    def get_qr_image(md5):
        try:
            conn = get_db_connection()
            if not conn:
                return jsonify({'error': 'Database connection failed'}), 500
            try:
                cursor = conn.cursor()
                cursor.execute("SELECT qr_code FROM payments WHERE md5_hash = %s", (md5,))
                result = cursor.fetchone()
                if not result:
                    return jsonify({'error': 'Payment not found'}), 404
                qr_code = result[0]
                qr_path = khqr.qr_image(qr_code, format='png')
                return send_file(qr_path, mimetype='image/png')
            finally:
                conn.close()
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/payment/callback', methods=['POST', 'GET'])
    def payment_callback():
        try:
            data = request.get_json() if request.is_json else request.args.to_dict()
            print(f"Payment callback received: {data}")
            return jsonify({'success': True, 'message': 'Callback received'})
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    @app.route('/health', methods=['GET'])
    def health_check():
        response = jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    
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
            print("✓ Database tables ready")
        finally:
            conn.close()
    
    print(f"🚀 API Server starting on http://localhost:5000")
    app.run(host='0.0.0.0', port=5000, debug=False, use_reloader=False)


def run_web_server():
    """Run HTTP web server"""
    import http.server
    import socketserver
    
    PORT = 8080
    
    class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
        def end_headers(self):
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            super().end_headers()
        
        def log_message(self, format, *args):
            pass
    
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    print(f"🌐 Web Server starting on http://localhost:{PORT}")
    
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        httpd.serve_forever()


def open_browser():
    """Open browser after delay"""
    time.sleep(2)
    webbrowser.open('http://localhost:8080')


if __name__ == "__main__":
    print("=" * 70)
    print(f"  {os.getenv('APP_NAME')}")
    print("  Combined API + Web Server")
    print("=" * 70)
    print()
    
    # Start API server in a thread
    api_thread = threading.Thread(target=run_api_server, daemon=True)
    api_thread.start()
    
    # Wait a bit for API to start
    time.sleep(1)
    
    # Start web server in a thread
    web_thread = threading.Thread(target=run_web_server, daemon=True)
    web_thread.start()
    
    # Open browser
    Timer(2.5, open_browser).start()
    
    print()
    print("=" * 70)
    print("✅ Both servers are running!")
    print()
    print("📍 API Server:  http://localhost:5000")
    print("📍 Web Server:  http://localhost:8080")
    print()
    print("🌐 Opening browser...")
    print()
    print("Press Ctrl+C to stop all servers")
    print("=" * 70)
    print()
    
    try:
        # Keep main thread alive
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n\n⏹  All servers stopped")
        print("=" * 70)
        sys.exit(0)
