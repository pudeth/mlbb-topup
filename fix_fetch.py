import re

with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'r', encoding='utf8') as f:
    text = f.read()

old_fetch = """        // Always check .NET backend DB via quick-status as fallback
        if (!isPaidConfirmed && curOrderId) {
          try {
            const ordCheck = await fetch(`http://localhost:5000/api/orders/${curOrderId}/quick-status`)
              .then(res => res.json())
              .catch(() => null);
            if (ordCheck?.isPaid === true || ordCheck?.paymentStatus === 'Paid') {
              console.log(`%c[ABA PayWay Tracker] âœ… Backend DB confirmed PAID for Order #${curOrderId}`, 'color: #10b981; font-weight: bold;');
              isPaidConfirmed = true;
            }
          } catch (e) {}
        }"""

new_fetch = """        // Always check .NET backend DB via quick-status as fallback
        if (!isPaidConfirmed && curOrderId) {
          try {
            const ordCheckRes = await ordersAPI.getQuickStatus(curOrderId);
            const ordCheck = ordCheckRes?.data;
            if (ordCheck?.isPaid === true || ordCheck?.paymentStatus === 'Paid') {
              console.log(`%c[ABA PayWay Tracker] ✓ Backend DB confirmed PAID for Order #${curOrderId}`, 'color: #10b981; font-weight: bold;');
              isPaidConfirmed = true;
            }
          } catch (e) {}
        }"""

if old_fetch in text:
    text = text.replace(old_fetch, new_fetch)
    with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'w', encoding='utf8') as f:
        f.write(text)
    print("Fixed fetch")
else:
    print("Could not find fetch")
