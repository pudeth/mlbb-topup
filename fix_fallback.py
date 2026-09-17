import re

with open(r'd:\TopUP\backend\MLBBTopUp.Infrastructure\Services\AbaPayWayService.cs', 'r', encoding='utf8') as f:
    text = f.read()

pattern = r'AbapayDeeplink = \$"https://bakong\.nbc\.org\.kh/pay\?md5=\{fallbackMd5\}"\s*};'
replacement = 'AbapayDeeplink = $"https://bakong.nbc.org.kh/pay?md5={fallbackMd5}",\n                    CheckoutUrl = checkoutUrl,\n                    PurchaseUrl = purchaseUrl,\n                    Hash = popupHash,\n                    FormData = formData\n                };'

new_text = re.sub(pattern, replacement, text)

if new_text != text:
    with open(r'd:\TopUP\backend\MLBBTopUp.Infrastructure\Services\AbaPayWayService.cs', 'w', encoding='utf8') as f:
        f.write(new_text)
    print("Successfully replaced fallback block.")
else:
    print("Regex failed to match.")
