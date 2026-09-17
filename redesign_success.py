import re

with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'r', encoding='utf8') as f:
    text = f.read()

old_success_start = "{/* PAY-SUCCESSFULLY CELEBRATORY POPUP INTERFACE (z-[9999]) */}"
old_success_end = "        {/* ======================================================== */}"

# We need to extract everything from old_success_start to the next ROOT-LEVEL block.
# Let's just find the exact block.
pattern = re.compile(r'\{\/\* PAY-SUCCESSFULLY CELEBRATORY POPUP INTERFACE \(z-\[9999\]\) \*\/\}.*?\{paymentPaid && \(\s*<div className="fixed inset-0 z-\[9999\].*?</div>\s*</div>\s*\)\}', re.DOTALL)

new_success_modal = """{/* PAY-SUCCESSFULLY CELEBRATORY POPUP INTERFACE (z-[9999]) */}
        {/* ======================================================== */}
        {paymentPaid && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl text-center relative overflow-hidden my-auto animate-scaleUp">
              
              {/* Top Graphic Section (matching ABA PayWay Guideline) */}
              <div className="w-full h-48 bg-[#e8f5fb] relative overflow-hidden flex flex-col items-center justify-end pb-8" style={{ backgroundImage: 'radial-gradient(#cbe7f5 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                {/* Simulated clouds and landscape */}
                <div className="absolute bottom-0 left-0 w-full h-16 bg-white/40" style={{ borderRadius: '100% 100% 0 0' }} />
                
                {/* Flag pole and flag with Checkmark */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-1 h-24 bg-blue-400 absolute -bottom-8 -left-3 rounded-full" />
                  <div className="bg-white px-8 py-4 rounded-r-2xl shadow-sm relative -ml-4">
                    <div className="w-16 h-16 rounded-full bg-[#48b668] flex items-center justify-center shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Text Section */}
              <div className="px-6 py-6 space-y-3 bg-white">
                <h2 className="text-3xl font-semibold text-[#152745]">
                  Success
                </h2>
                <p className="text-[#8c94a0] text-[13px] leading-relaxed max-w-[260px] mx-auto">
                  Your diamonds have been automatically credited directly into your in-game mailbox!
                </p>
              </div>

              {/* Action Buttons */}
              <div className="px-6 pb-8 space-y-3 bg-white">
                <Link
                  to={`/order-status/${orderId}`}
                  className="block w-full py-3.5 rounded-xl border border-[#48b668] text-[#48b668] font-bold text-[15px] bg-transparent hover:bg-[#48b668]/5 transition-all text-center"
                >
                  Download Receipt
                </Link>
                
                <button
                  onClick={() => {
                    setFormData(prev => ({ ...prev, playerID: '' }));
                    setOrderId(null);
                    setPaymentData(null);
                    setPaymentPaid(false);
                  }}
                  className="block w-full py-3.5 rounded-xl bg-[#48b668] text-white font-bold text-[15px] hover:bg-[#3ea05b] shadow-md shadow-[#48b668]/30 transition-all text-center"
                >
                  Continue Shopping
                </button>
              </div>

            </div>
          </div>
        )}"""

text, count = pattern.subn(new_success_modal, text)
print(f"Replaced {count} instances.")

with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'w', encoding='utf8') as f:
    f.write(text)
