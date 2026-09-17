import re

with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'r', encoding='utf8') as f:
    text = f.read()

# 1. Add state for custom modal
if 'const [showCustomModal, setShowCustomModal] = useState(false);' not in text:
    text = text.replace('const [error, setError] = useState(null);', 'const [error, setError] = useState(null);\n  const [showCustomModal, setShowCustomModal] = useState(false);')

# 2. Modify effect to trigger the custom modal instead of form.submit()
old_effect = """  // Automatically trigger ABA Official Checkout if backend QR generation fails
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

new_effect = """  // Automatically trigger ABA Official Checkout if backend QR generation fails
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
  }, [paymentData, paymentPaid]);
  
  // When custom modal is shown, submit form into the iframe
  useEffect(() => {
    if (showCustomModal) {
      setTimeout(() => {
        const form = document.getElementById('aba_merchant_request');
        if (form) {
          form.target = 'custom_aba_iframe';
          form.submit();
        }
      }, 200);
    }
  }, [showCustomModal]);"""

text = text.replace(old_effect, new_effect)

# 3. Inject the custom modal HTML at the end of the return statement
modal_html = """        {/* Custom React Modal for ABA PayWay (Fallback if script blocked) */}
        {showCustomModal && (
          <div className="fixed inset-0 z-[999999] flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center">
            <div className="w-full h-[90vh] sm:h-[80vh] sm:max-w-[400px] bg-white rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col shadow-2xl animate-[slideUp_0.3s_ease-out]">
              <div className="w-full flex justify-between items-center p-4 border-b border-gray-100 bg-white">
                <span className="font-black text-slate-800 text-lg">Payment</span>
                <button 
                  onClick={() => setShowCustomModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 font-bold active:bg-slate-200"
                >
                  âœ•
                </button>
              </div>
              <div className="flex-1 w-full bg-slate-50 relative">
                <iframe
                  name="custom_aba_iframe"
                  id="custom_aba_iframe"
                  title="ABA Payway Checkout"
                  className="w-full h-full border-none"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                />
              </div>
            </div>
            <style>{`
              @keyframes slideUp {
                from { transform: translateY(100%); }
                to { transform: translateY(0); }
              }
            `}</style>
          </div>
        )}

      </div>
    </Layout>
  );"""

text = text.replace('      </div>\n    </Layout>\n  );', modal_html)

with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'w', encoding='utf8') as f:
    f.write(text)

print("Added custom react modal.")
