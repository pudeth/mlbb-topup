import re

with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'r', encoding='utf8') as f:
    text = f.read()

# Add target="aba_webservice" back to the form
if 'target="aba_webservice"' not in text:
    text = text.replace('id="aba_merchant_request"\n          method="POST"\n          action=', 'id="aba_merchant_request"\n          method="POST"\n          target="aba_webservice"\n          action=')
    with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'w', encoding='utf8') as f:
        f.write(text)
    print("Added target back to form.")
else:
    print("Target already present.")
