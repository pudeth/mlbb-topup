import re

with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'r', encoding='utf8') as f:
    text = f.read()

old_btn = """                    onClick={(e) => {
                      e.preventDefault();
                      if (typeof window !== 'undefined' && 'AbaPayway' in window) {
                         window.AbaPayway.checkout();
                      } else if (typeof AbaPayway !== 'undefined') {
                         // eslint-disable-next-line no-undef
                         AbaPayway.checkout();
                      } else {
                        const form = document.getElementById('aba_merchant_request');
                        if (form) {
                          form.submit(); // Hosted view mode fallback
                        }
                      }
                    }}"""

new_btn = """                    onClick={(e) => {
                      e.preventDefault();
                      setShowCustomModal(true);
                    }}"""

text = text.replace(old_btn, new_btn)

with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'w', encoding='utf8') as f:
    f.write(text)
    
print("Replaced manual button onClick.")
