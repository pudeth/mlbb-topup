import re

with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'r', encoding='utf8') as f:
    text = f.read()

old_close = "onClick={() => setShowCustomModal(false)}"
new_close = "onClick={() => { setShowCustomModal(false); window.location.reload(); }}"

text = text.replace(old_close, new_close)

with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'w', encoding='utf8') as f:
    f.write(text)

print("Added page refresh on close.")
