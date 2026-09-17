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
      if (typeof window !== 'undefined' && window.AbaPayway) {
        window.AbaPayway.checkout();
      } else {
        // Absolute fallback
        const form = document.getElementById('aba_merchant_request');
        if (form) form.submit();
      }
    }
  }, [paymentData, paymentPaid]);"""

new_effect = """  // Automatically trigger ABA Official Checkout if backend QR generation fails
  useEffect(() => {
    if (paymentData && !paymentPaid && !paymentData.qrString && !paymentData.khqrQRCode) {
      
      const scriptUrl = 'https://checkout.payway.com.kh/plugins/checkout2-0.js';
      let attempts = 0;
      const maxAttempts = 50; // Wait up to 5s for the script to load

      const tryCheckout = () => {
        if (typeof window !== 'undefined' && window.AbaPayway) {
          window.AbaPayway.checkout();
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(tryCheckout, 100);
        } else {
          // Absolute fallback
          const form = document.getElementById('aba_merchant_request');
          if (form) form.submit();
        }
      };

      if (!window.AbaPayway) {
        // Only inject if not already present
        if (!document.querySelector(`script[src="${scriptUrl}"]`)) {
          const script = document.createElement('script');
          script.src = scriptUrl;
          script.async = true;
          document.head.appendChild(script);
        }
        tryCheckout(); // Start polling
      } else {
        window.AbaPayway.checkout();
      }
    }
  }, [paymentData, paymentPaid]);"""

if old_effect in text:
    text = text.replace(old_effect, new_effect)
    with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'w', encoding='utf8') as f:
        f.write(text)
    print("Reverted to robust dynamic injection.")
else:
    print("Could not find effect block.")
