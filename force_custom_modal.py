import re

with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'r', encoding='utf8') as f:
    text = f.read()

# Replace the effect block to ALWAYS use custom modal
old_effect = """  // Automatically trigger ABA Official Checkout if backend QR generation fails
  useEffect(() => {
    if (paymentData && !paymentPaid && !paymentData.qrString && !paymentData.khqrQRCode) {
      
      let attempts = 0;
      const maxAttempts = 30; // Wait 3s

      const tryCheckout = () => {
        if (typeof window !== 'undefined' && window.AbaPayway) {
          window.AbaPayway.checkout();
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(tryCheckout, 100);
        } else {
          // Absolute fallback: use custom React Modal overlay with iframe
          setShowCustomModal(true);
        }
      };

      tryCheckout();
    }
  }, [paymentData, paymentPaid]);"""

new_effect = """  // Automatically trigger ABA Official Checkout if backend QR generation fails
  useEffect(() => {
    if (paymentData && !paymentPaid && !paymentData.qrString && !paymentData.khqrQRCode) {
      // We explicitly bypass the flaky ABA PayWay global script to guarantee a flawless React popup
      setShowCustomModal(true);
    }
  }, [paymentData, paymentPaid]);"""

if old_effect in text:
    text = text.replace(old_effect, new_effect)
    with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'w', encoding='utf8') as f:
        f.write(text)
    print("Forced custom modal.")
else:
    print("Could not find effect block.")
