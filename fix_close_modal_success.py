import re

with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'r', encoding='utf8') as f:
    text = f.read()

# Add logic to close custom modal when payment is paid
old_effect = """  // Automatically trigger ABA Official Checkout if backend QR generation fails
  useEffect(() => {
    if (paymentData && !paymentPaid && !paymentData.qrString && !paymentData.khqrQRCode) {
      // We explicitly bypass the flaky ABA PayWay global script to guarantee a flawless React popup
      setShowCustomModal(true);
    }
  }, [paymentData, paymentPaid]);"""

new_effect = """  // Automatically trigger ABA Official Checkout if backend QR generation fails
  useEffect(() => {
    if (paymentPaid) {
      setShowCustomModal(false);
    } else if (paymentData && !paymentPaid && !paymentData.qrString && !paymentData.khqrQRCode) {
      // We explicitly bypass the flaky ABA PayWay global script to guarantee a flawless React popup
      setShowCustomModal(true);
    }
  }, [paymentData, paymentPaid]);"""

if old_effect in text:
    text = text.replace(old_effect, new_effect)
    with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'w', encoding='utf8') as f:
        f.write(text)
    print("Fixed.")
else:
    print("Could not find effect block.")
