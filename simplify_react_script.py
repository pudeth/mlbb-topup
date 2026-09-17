import re

with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'r', encoding='utf8') as f:
    text = f.read()

# Replace the effect block again
old_effect_start = "  // Automatically trigger ABA Official Checkout if backend QR generation fails"
old_effect_end = "  // 5-minute Countdown Timer"

if old_effect_start in text and old_effect_end in text:
    before = text[:text.index(old_effect_start)]
    after = text[text.index(old_effect_end):]
    
    new_effect = """  // Automatically trigger ABA Official Checkout if backend QR generation fails
  useEffect(() => {
    if (paymentData && !paymentPaid && !paymentData.qrString && !paymentData.khqrQRCode) {
      if (typeof window !== 'undefined' && window.AbaPayway) {
        window.AbaPayway.checkout();
      } else {
        // Absolute fallback
        const form = document.getElementById('aba_merchant_request');
        if (form) form.submit();
      }
    }
  }, [paymentData, paymentPaid]);

"""
    text = before + new_effect + after
    with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'w', encoding='utf8') as f:
        f.write(text)
    print("Simplified script loading.")
else:
    print("Could not find the bounds.")
