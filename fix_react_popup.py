import re

with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'r', encoding='utf8') as f:
    text = f.read()

# Replace the useEffect block
old_effect = """  // Automatically trigger ABA Official Checkout if backend QR generation fails
  useEffect(() => {
    if (paymentData && !paymentPaid && !paymentData.qrString && !paymentData.khqrQRCode) {
      // The backend failed to generate the QR string due to Wrong Hash (Sandbox constraints).
      // Instantly open the official ABA checkout popup instead of showing a broken React popup.
      if (typeof window !== 'undefined' && 'AbaPayway' in window) {
        window.AbaPayway.checkout();
      } else {
        const form = document.getElementById('aba_merchant_request');
        if (form) form.submit();
      }
    }
  }, [paymentData, paymentPaid]);"""

new_effect = """  // Automatically trigger ABA Official Checkout if backend QR generation fails
  useEffect(() => {
    if (paymentData && !paymentPaid && !paymentData.qrString && !paymentData.khqrQRCode) {
      // The backend failed to generate the QR string due to Wrong Hash (Sandbox constraints).
      // Instantly open the official ABA checkout popup instead of showing a broken React popup.
      
      const purchaseUrl = paymentData?.purchaseUrl || '';
      const isSandbox = purchaseUrl.includes('sandbox');
      const scriptUrl = isSandbox 
        ? 'https://checkout-sandbox.payway.com.kh/plugins/checkout2-0.js'
        : 'https://checkout.payway.com.kh/plugins/checkout2-0.js';

      const triggerCheckout = () => {
        if (typeof window !== 'undefined' && window.AbaPayway) {
          window.AbaPayway.checkout();
        } else {
          // Fallback to iframe to avoid new tab
          const form = document.getElementById('aba_merchant_request');
          if (form) {
            // Create an iframe to target so it doesn't open a new tab
            let iframe = document.getElementById('aba_webservice');
            if (!iframe) {
              iframe = document.createElement('iframe');
              iframe.name = 'aba_webservice';
              iframe.id = 'aba_webservice';
              iframe.style.position = 'fixed';
              iframe.style.top = '0';
              iframe.style.left = '0';
              iframe.style.width = '100vw';
              iframe.style.height = '100vh';
              iframe.style.zIndex = '999999';
              iframe.style.border = 'none';
              iframe.style.backgroundColor = '#fff';
              document.body.appendChild(iframe);
            }
            form.target = 'aba_webservice';
            form.submit();
          }
        }
      };

      // Load script if not present
      if (!window.AbaPayway) {
        const script = document.createElement('script');
        script.src = scriptUrl;
        script.async = true;
        script.onload = () => {
          setTimeout(triggerCheckout, 500); // Give it a moment to initialize
        };
        script.onerror = triggerCheckout;
        document.body.appendChild(script);
      } else {
        triggerCheckout();
      }
    }
  }, [paymentData, paymentPaid]);"""

if old_effect in text:
    text = text.replace(old_effect, new_effect)
    with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'w', encoding='utf8') as f:
        f.write(text)
    print("Replaced effect successfully.")
else:
    print("Could not find the effect block.")
