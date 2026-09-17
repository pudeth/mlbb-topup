import re

with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'r', encoding='utf8') as f:
    text = f.read()

old_effect = """  // Automatically trigger ABA Official Checkout if backend QR generation fails
  useEffect(() => {
    if (paymentPaid) {
      if (typeof window !== 'undefined' && window.AbaPayway) {
         window.AbaPayway.closeCheckout();
      }
      setShowCustomModal(false);
    } else if (paymentData && !paymentPaid && !paymentData.qrString && !paymentData.khqrQRCode) {
      // Try to use official ABA Payway script first (so Mobile App deeplinks work natively)
      if (typeof window !== 'undefined' && window.AbaPayway) {
          window.AbaPayway.checkout();
      } else {
          // Fallback to custom modal if script is blocked
          setShowCustomModal(true);
      }
    }
  }, [paymentData, paymentPaid]);"""

new_effect = """  // Automatically trigger ABA Official Checkout if backend QR generation fails
  useEffect(() => {
    if (paymentData && !paymentPaid && !paymentData.qrString && !paymentData.khqrQRCode) {
      // Try to use official ABA Payway script first (so Mobile App deeplinks work natively)
      if (typeof window !== 'undefined' && window.AbaPayway) {
          window.AbaPayway.checkout();
      } else {
          // Fallback to custom modal if script is blocked
          setShowCustomModal(true);
      }
    }
  }, [paymentData, paymentPaid]);"""

if old_effect in text:
    text = text.replace(old_effect, new_effect)
    with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'w', encoding='utf8') as f:
        f.write(text)
    print("Removed auto-close logic.")
else:
    print("Could not find effect block.")
