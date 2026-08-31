#!/usr/bin/env python
"""Test payment status checking with Bakong API"""

import os
from dotenv import load_dotenv
from bakong_khqr import KHQR

load_dotenv()

print("=" * 70)
print("Testing Payment Status Check with Bakong API")
print("=" * 70)
print()

# Initialize KHQR
try:
    token = os.getenv('BAKONG_TOKEN')
    print(f"Token: {token[:20]}... (length: {len(token)})")
    
    khqr = KHQR(token)
    print("✓ KHQR initialized")
    print()
    
    # Test with a sample MD5 - you can replace this with your actual MD5
    print("Enter the MD5 hash of your payment to check:")
    print("(You can find it in the URL or from the payment details)")
    print()
    md5_hash = input("MD5 Hash: ").strip()
    
    if not md5_hash:
        print("\n❌ No MD5 provided. Creating test payment instead...")
        print()
        
        # Create a test QR
        qr = khqr.create_qr(
            bank_account=os.getenv('MERCHANT_BAKONG_ID'),
            merchant_name=os.getenv('MERCHANT_NAME'),
            merchant_city=os.getenv('MERCHANT_CITY'),
            amount=1.00,
            currency='USD',
            store_label='Test',
            phone_number='85512345678',
            bill_number='TEST_CHECK',
            terminal_label='Test',
            static=False,
            expiration=1
        )
        
        md5_hash = khqr.generate_md5(qr)
        print(f"Created test payment with MD5: {md5_hash}")
        print()
    
    # Check payment status
    print(f"Checking status for MD5: {md5_hash}")
    print("Please wait...")
    print()
    
    try:
        status = khqr.check_payment(md5_hash)
        print("=" * 70)
        print(f"✓ Payment Status: {status}")
        print("=" * 70)
        print()
        
        if status == "PAID":
            print("✅ This payment has been PAID!")
            print()
            print("Getting payment details...")
            try:
                info = khqr.get_payment(md5_hash)
                if info:
                    print("\nPayment Information:")
                    for key, value in info.items():
                        print(f"  {key}: {value}")
            except Exception as e:
                print(f"Could not get details: {e}")
        else:
            print("⏳ This payment is still UNPAID")
            print()
            print("If you have paid this:")
            print("1. Wait a few moments")
            print("2. Run this test again")
            print("3. Check your Bakong app transaction history")
        
    except Exception as api_error:
        print("=" * 70)
        print(f"❌ API Error: {api_error}")
        print("=" * 70)
        print()
        
        error_str = str(api_error)
        
        if 'Token' in error_str or 'expired' in error_str:
            print("Token Issue Detected:")
            print("- Your Bakong API token may be expired")
            print("- Get a new token from Bakong Developer Portal")
            print("- Update BAKONG_TOKEN in .env file")
        elif '429' in error_str:
            print("Rate Limit:")
            print("- Too many requests")
            print("- Wait a few moments and try again")
        elif '503' in error_str or '504' in error_str:
            print("Server Busy:")
            print("- Bakong API server is temporarily unavailable")
            print("- Try again in a few moments")
        else:
            print("Unknown Error:")
            print("- Check your internet connection")
            print("- Verify MD5 hash is correct")
            print("- Check .env configuration")
        
        print()
        print("For testing without API, set DEMO_MODE=true in .env")
        
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()

print()
print("=" * 70)
print("Test Complete")
print("=" * 70)
