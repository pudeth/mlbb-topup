import re

with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'r', encoding='utf8') as f:
    text = f.read()

# Add state for custom modal
if 'const [showCustomModal, setShowCustomModal] = useState(false);' not in text:
    text = text.replace("const [error, setError] = useState('');", "const [error, setError] = useState('');\n  const [showCustomModal, setShowCustomModal] = useState(false);")
    with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'w', encoding='utf8') as f:
        f.write(text)
    print("Added missing state.")
else:
    print("State already exists.")
