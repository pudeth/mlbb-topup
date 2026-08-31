#!/usr/bin/env python
"""Test QR generation"""

import os
import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')
from dotenv import load_dotenv
from bakong_khqr import KHQR

load_dotenv()

print("Testing QR Code Generation...")
print("=" * 50)

try:
    # Initialize KHQR
    khqr = KHQR(os.getenv('BAKONG_TOKEN'))
    print("[+] KHQR initialized")
    
    # Create QR code
    qr = khqr.create_qr(
        bank_account=os.getenv('MERCHANT_BAKONG_ID'),
        merchant_name=os.getenv('MERCHANT_NAME'),
        merchant_city=os.getenv('MERCHANT_CITY'),
        amount=10.00,
        currency='USD',
        store_label='Test',
        phone_number='85512345678',
        bill_number='TEST123',
        terminal_label='POS-01',
        static=False,
        expiration=1
    )
    print("[+] QR code created")
    print(f"  QR String: {qr[:50]}...")
    
    # Generate MD5
    md5 = khqr.generate_md5(qr)
    print(f"[+] MD5 hash: {md5}")
    
    # Try to generate QR image
    print("\nTesting QR image generation...")
    try:
        qr_bytes = khqr.qr_image(qr, format='bytes')
        print(f"[+] QR image generated: {len(qr_bytes)} bytes")
        
        # Try to save as PNG
        qr_path = khqr.qr_image(qr, format='png', output_path='test_qr.png')
        print(f"[+] QR image saved to: {qr_path}")
        
    except ImportError as e:
        print(f"[-] Missing dependencies: {e}")
        print("\nTo fix, install:")
        print("  pip install pillow qrcode[pil]")
    except Exception as e:
        print(f"[-] Error generating QR image: {e}")
        import traceback
        traceback.print_exc()
    
    print("\n" + "=" * 50)
    print("Test completed!")
    
except Exception as e:
    print(f"[-] Error: {e}")
    import traceback
    traceback.print_exc()
