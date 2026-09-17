import re

with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'r', encoding='utf8') as f:
    text = f.read()

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

      </form>
    </div>
  );
};"""

if '{/* Custom React Modal for ABA PayWay' not in text:
    text = text.replace('      </form>\n    </div>\n  );\n};', modal_html)
    with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'w', encoding='utf8') as f:
        f.write(text)
    print("Injected HTML.")
else:
    print("HTML already exists.")
