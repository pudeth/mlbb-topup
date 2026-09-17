import re

with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'r', encoding='utf8') as f:
    text = f.read()

# Remove target="aba_webservice" from the HTML form entirely
text = text.replace('target="aba_webservice"\n          action=', 'action=')

with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'w', encoding='utf8') as f:
    f.write(text)
    
print("Removed target from form.")
