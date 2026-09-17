import re

# 1. Put script in index.html
with open(r'd:\TopUP\frontend\public\index.html', 'r', encoding='utf8') as f:
    text = f.read()

if 'checkout2-0.js' not in text:
    text = text.replace('</head>', '  <script src="https://checkout.payway.com.kh/plugins/checkout2-0.js"></script>\n  </head>')
    with open(r'd:\TopUP\frontend\public\index.html', 'w', encoding='utf8') as f:
        f.write(text)

# 2. Fix TopUp.js
with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'r', encoding='utf8') as f:
    text = f.read()

old_effect = """  // Automatically trigger ABA Official Checkout if backend QR generation fails
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

new_effect = """  // Automatically trigger ABA Official Checkout if backend QR generation fails
  useEffect(() => {
    if (paymentData && !paymentPaid && !paymentData.qrString && !paymentData.khqrQRCode) {
      
      let attempts = 0;
      const maxAttempts = 50; // Wait up to 5s for the script to load

      const tryCheckout = () => {
        if (typeof window !== 'undefined' && window.AbaPayway) {
          window.AbaPayway.checkout();
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(tryCheckout, 100);
        } else {
          // Absolute fallback: submit directly in current window so Safari doesn't block it!
          const form = document.getElementById('aba_merchant_request');
          if (form) {
             form.removeAttribute('target'); // Force current tab
             form.submit();
          }
        }
      };

      tryCheckout();
    }
  }, [paymentData, paymentPaid]);"""

if old_effect in text:
    text = text.replace(old_effect, new_effect)
    with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'w', encoding='utf8') as f:
        f.write(text)
    print("Fixed.")
else:
    print("Could not find effect block.")
