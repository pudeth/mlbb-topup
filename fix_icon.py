import re

with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'r', encoding='utf8') as f:
    text = f.read()

# Fix the garbled text by replacing it with an SVG icon
garbled1 = "âœ•"
garbled2 = "Ã¢Å“â€¢"
garbled3 = "âœ•"

svg_close = """<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>"""

text = text.replace(garbled1, svg_close)
text = text.replace(garbled2, svg_close)
text = text.replace(garbled3, svg_close)

with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'w', encoding='utf8') as f:
    f.write(text)

print("Fixed close button icon.")
