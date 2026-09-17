import re

with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'r', encoding='utf8') as f:
    text = f.read()

# Add ABA PayWay logo and Transaction ID to the success receipt
old_receipt_bottom = """                <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                  <span className="text-slate-400">Amount Paid:</span>
                  <span className="font-black text-emerald-400">${paymentData?.amount?.toFixed(2) || 'â€”'}</span>
                </div>
              </div>"""

new_receipt_bottom = """                <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                  <span className="text-slate-400">Amount Paid:</span>
                  <span className="font-black text-emerald-400">${paymentData?.amount?.toFixed(2) || '—'}</span>
                </div>
                {paymentData?.tranId && (
                  <div className="flex justify-between items-center pt-2 border-t border-slate-800/50">
                    <span className="text-slate-400">ABA Transaction ID:</span>
                    <span className="font-mono text-[10px] text-slate-300 bg-slate-800/50 px-2 py-0.5 rounded">{paymentData.tranId}</span>
                  </div>
                )}
                <div className="flex justify-center pt-3 pb-1">
                  <div className="flex items-center gap-1.5 opacity-60">
                    <span className="text-[10px] text-slate-500 font-medium">Processed securely by</span>
                    <img src="https://checkout.payway.com.kh/images/payway-logo-white.svg" alt="ABA PayWay" className="h-3" />
                  </div>
                </div>
              </div>"""

if old_receipt_bottom in text:
    text = text.replace(old_receipt_bottom, new_receipt_bottom)
    with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'w', encoding='utf8') as f:
        f.write(text)
    print("Added ABA logo and Transaction ID.")
else:
    print("Could not find the receipt bottom.")
