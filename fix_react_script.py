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
      
      const scriptUrl = 'https://checkout.payway.com.kh/plugins/checkout2-0.js'; // Always use Production script, it handles Sandbox internally

      const triggerCheckout = () => {
        if (typeof window !== 'undefined' && window.AbaPayway) {
          window.AbaPayway.checkout();
        } else {
          // Fallback just in case plugin is completely blocked
          const form = document.getElementById('aba_merchant_request');
          if (form) form.submit();
        }
      };

      // Load script if not present
      if (!window.AbaPayway) {
        const script = document.createElement('script');
        script.src = scriptUrl;
        script.async = true;
        script.onload = () => {
          setTimeout(triggerCheckout, 300); // Give it a moment to initialize
        };
        script.onerror = triggerCheckout;
        document.head.appendChild(script);
      } else {
        triggerCheckout();
      }
    }
  }, [paymentData, paymentPaid]);

"""
    text = before + new_effect + after
    with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'w', encoding='utf8') as f:
        f.write(text)
    print("Fixed script URL.")
else:
    print("Could not find the bounds.")
