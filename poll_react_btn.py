import re

with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'r', encoding='utf8') as f:
    text = f.read()

# Replace manual button onClick
old_onclick = """                    onClick={(e) => {
                      e.preventDefault();
                      if (typeof window !== 'undefined' && window.AbaPayway) {
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

new_onclick = """                    onClick={(e) => {
                      e.preventDefault();
                      
                      let attempts = 0;
                      const maxAttempts = 30; // 3 seconds max for manual click
                      
                      const tryClickCheckout = () => {
                        if (typeof window !== 'undefined' && window.AbaPayway) {
                          window.AbaPayway.checkout();
                        } else if (attempts < maxAttempts) {
                          attempts++;
                          setTimeout(tryClickCheckout, 100);
                        } else {
                          const form = document.getElementById('aba_merchant_request');
                          if (form) form.submit();
                        }
                      };
                      
                      tryClickCheckout();
                    }}"""

if old_onclick in text:
    text = text.replace(old_onclick, new_onclick)
    with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'w', encoding='utf8') as f:
        f.write(text)
    print("Fixed manual button.")
else:
    print("Could not find manual button block.")
