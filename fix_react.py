import re

with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'r', encoding='utf8') as f:
    text = f.read()

# Let's find `// 5-minute Countdown Timer` and insert our new effect there
insertion_point = "  // 5-minute Countdown Timer"

new_effect = """
  // Automatically trigger ABA Official Checkout if backend QR generation fails
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
  }, [paymentData, paymentPaid]);

  // 5-minute Countdown Timer"""

if insertion_point in text:
    text = text.replace(insertion_point, new_effect)
    with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'w', encoding='utf8') as f:
        f.write(text)
    print("Injected auto-checkout logic.")
else:
    print("Could not find insertion point.")
