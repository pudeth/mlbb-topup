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
      
      let attempts = 0;
      const maxAttempts = 50; // 50 * 100ms = 5 seconds
      
      const tryCheckout = () => {
        if (typeof window !== 'undefined' && window.AbaPayway) {
          window.AbaPayway.checkout();
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(tryCheckout, 100);
        } else {
          // Absolute fallback (wait failed)
          const form = document.getElementById('aba_merchant_request');
          if (form) form.submit();
        }
      };

      tryCheckout();
    }
  }, [paymentData, paymentPaid]);

"""
    text = before + new_effect + after
    with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'w', encoding='utf8') as f:
        f.write(text)
    print("Added polling for AbaPayway script.")
else:
    print("Could not find the bounds.")
