import re

with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'r', encoding='utf8') as f:
    text = f.read()

# Remove the sandbox attribute from the iframe
if 'sandbox="allow-scripts allow-same-origin allow-forms allow-popups"' in text:
    text = text.replace('sandbox="allow-scripts allow-same-origin allow-forms allow-popups"', '')
    with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'w', encoding='utf8') as f:
        f.write(text)
    print("Removed sandbox from iframe.")
else:
    print("Sandbox attribute not found.")
