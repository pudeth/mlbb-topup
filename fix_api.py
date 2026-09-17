import re

with open(r'd:\TopUP\frontend\src\services\api.js', 'r', encoding='utf8') as f:
    text = f.read()

text = text.replace(
    "getStatus: (id) => api.get(`/orders/${id}/status`),",
    "getStatus: (id) => api.get(`/orders/${id}/status`),\n  getQuickStatus: (id) => api.get(`/orders/${id}/quick-status`),"
)

with open(r'd:\TopUP\frontend\src\services\api.js', 'w', encoding='utf8') as f:
    f.write(text)

print("Added getQuickStatus to ordersAPI")
