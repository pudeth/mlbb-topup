import re

with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'r', encoding='utf8') as f:
    text = f.read()

text = text.replace("name='custom_aba_iframe'", "name='aba_webservice'")
text = text.replace('name="custom_aba_iframe"', 'name="aba_webservice"')
text = text.replace("id='custom_aba_iframe'", "id='aba_webservice'")
text = text.replace('id="custom_aba_iframe"', 'id="aba_webservice"')
text = text.replace("form.target = 'custom_aba_iframe';", "form.target = 'aba_webservice';")

with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'w', encoding='utf8') as f:
    f.write(text)

print("Renamed iframe to aba_webservice.")
