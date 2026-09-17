import re

with open(r'd:\TopUP\frontend\public\index.html', 'r', encoding='utf8') as f:
    text = f.read()

# Remove the hardcoded payway script
text = re.sub(r'<!-- ABA PayWay Official Checkout Plugin \(Developer Suite\) -->\n\s*<script src="https://checkout\.payway\.com\.kh/plugins/checkout2-0\.js"></script>', '', text)

with open(r'd:\TopUP\frontend\public\index.html', 'w', encoding='utf8') as f:
    f.write(text)
print("Removed hardcoded script from index.html")
