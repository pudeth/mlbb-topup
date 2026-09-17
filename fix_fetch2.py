import re

with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'r', encoding='utf8') as f:
    text = f.read()

pattern = re.compile(r'// Always check \.NET backend DB via quick-status as fallback.*?} catch \(e\) {}', re.DOTALL)

new_fetch = """// Always check .NET backend DB via quick-status as fallback
        if (!isPaidConfirmed && curOrderId) {
          try {
            const ordCheckRes = await ordersAPI.getQuickStatus(curOrderId);
            const ordCheck = ordCheckRes?.data;
            if (ordCheck?.isPaid === true || ordCheck?.paymentStatus === 'Paid') {
              console.log(`%c[ABA PayWay Tracker] ✓ Backend DB confirmed PAID for Order #${curOrderId}`, 'color: #10b981; font-weight: bold;');
              isPaidConfirmed = true;
            }
          } catch (e) {}"""

text, count = pattern.subn(new_fetch, text)
print(f"Replaced {count} instances")

with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'w', encoding='utf8') as f:
    f.write(text)
