import re

with open(r'd:\TopUP\frontend\public\index.html', 'r', encoding='utf8') as f:
    text = f.read()

# Put the script back in the head
if '<script src="https://checkout.payway.com.kh/plugins/checkout2-0.js"></script>' not in text:
    text = text.replace('</head>', '  <script src="https://checkout.payway.com.kh/plugins/checkout2-0.js"></script>\n  </head>')
    with open(r'd:\TopUP\frontend\public\index.html', 'w', encoding='utf8') as f:
        f.write(text)
    print("Added script to index.html")
else:
    print("Script already in index.html")
