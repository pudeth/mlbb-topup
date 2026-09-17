import re

with open(r'd:\TopUP\frontend\public\index.html', 'r', encoding='utf8') as f:
    text = f.read()

text = text.replace('    <script src="https://checkout.payway.com.kh/plugins/checkout2-0.js"></script>\n', '')

with open(r'd:\TopUP\frontend\public\index.html', 'w', encoding='utf8') as f:
    f.write(text)

with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'r', encoding='utf8') as f:
    text = f.read()

old_effect = """  // Automatically trigger ABA Official Checkout if backend QR generation fails
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
  }, [paymentData, paymentPaid]);"""

new_effect = """  // Automatically trigger ABA Official Checkout if backend QR generation fails
  useEffect(() => {
    if (paymentData && !paymentPaid && !paymentData.qrString && !paymentData.khqrQRCode) {
      
      let attempts = 0;
      const maxAttempts = 50; // 50 * 100ms = 5 seconds
      const scriptUrl = 'https://checkout.payway.com.kh/plugins/checkout2-0.js';

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

      if (!window.AbaPayway) {
        if (!document.querySelector(`script[src="${scriptUrl}"]`)) {
          const script = document.createElement('script');
          script.src = scriptUrl;
          script.async = true;
          document.head.appendChild(script);
        }
      }
      tryCheckout();
    }
  }, [paymentData, paymentPaid]);"""

if old_effect in text:
    text = text.replace(old_effect, new_effect)
    with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'w', encoding='utf8') as f:
        f.write(text)
    print("Reverted to robust dynamic injection.")
else:
    print("Could not find effect block.")
