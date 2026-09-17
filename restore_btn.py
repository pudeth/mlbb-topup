import re

with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'r', encoding='utf8') as f:
    text = f.read()

old_btn = """                    onClick={(e) => {
                      e.preventDefault();
                      setShowCustomModal(true);
                    }}"""

new_btn = """                    onClick={(e) => {
                      e.preventDefault();
                      if (typeof window !== 'undefined' && 'AbaPayway' in window) {
                         window.AbaPayway.checkout();
                      } else {
                         setShowCustomModal(true);
                      }
                    }}"""

if old_btn in text:
    text = text.replace(old_btn, new_btn)
    with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'w', encoding='utf8') as f:
        f.write(text)
    print("Fixed button")
else:
    print("Could not find button")
