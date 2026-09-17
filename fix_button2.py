import re

with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'r', encoding='utf8') as f:
    text = f.read()

pattern = re.compile(r'onClick=\{\(e\) => \{\s*e\.preventDefault\(\);\s*if \(typeof window !== \'undefined\' && \'AbaPayway\' in window\).*?form\.submit\(\); // Hosted view mode fallback\s*\}\s*\}\s*\}\}', re.DOTALL)

def replacer(match):
    return """onClick={(e) => {
                      e.preventDefault();
                      setShowCustomModal(true);
                    }}"""

text, count = pattern.subn(replacer, text)
print(f"Replaced {count} instances.")

with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'w', encoding='utf8') as f:
    f.write(text)

