import re

with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'r', encoding='utf8') as f:
    text = f.read()

form_html = """                <form
                  id="aba_merchant_request"
                  method="POST"
                  target="aba_webservice"
                  action={paymentData?.purchaseUrl || "https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/purchase"}
                  className="hidden"
                >
                  {paymentData?.formData &&
                    Object.entries(paymentData.formData).map(([k, v]) => (
                      <input key={k} type="hidden" name={k} value={v || ''} />
                    ))}
                </form>"""

# Move the form outside.
if form_html in text:
    text = text.replace(form_html, "")
    text = text.replace("      {paymentData && !paymentPaid && (", "      {paymentData && !paymentPaid && (paymentData.qrString || paymentData.khqrQRCode) && (")
    # Put form at the bottom
    # Right before `    </div>\n  );\n}`
    bottom = "    </div>\n  );\n}"
    if bottom in text:
        text = text.replace(bottom, "      {/* Injected Form */}\n" + form_html.replace("                ", "      ") + "\n" + bottom)
        with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'w', encoding='utf8') as f:
            f.write(text)
        print("Moved form and hid custom popup!")
    else:
        print("Could not find bottom of file.")
else:
    print("Could not find form HTML. Might be indented differently.")
