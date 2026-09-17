import sys

with open(r'd:\TopUP\backend\MLBBTopUp.Infrastructure\Services\AbaPayWayService.cs', 'r', encoding='utf8') as f:
    text = f.read()

old_b4hash = 'var b4hash = $"{reqTime}{merchantId}{tranId}{amtStr}{itemsBase64}{firstName}{lastName}{email}{phone}{purchaseType}{paymentOption}{string.Empty}{string.Empty}{paywayCurrency}{string.Empty}{string.Empty}{string.Empty}{qrLifetime}{qrImageTemplate}";'
new_b4hash = 'var b4hash = $"{reqTime}{merchantId}{tranId}{amtStr}{itemsBase64}{string.Empty}{firstName}{lastName}{email}{phone}{purchaseType}{paymentOption}{string.Empty}{string.Empty}{string.Empty}{string.Empty}{string.Empty}{paywayCurrency}{string.Empty}{string.Empty}{qrLifetime}{qrImageTemplate}";'

if old_b4hash in text:
    text = text.replace(old_b4hash, new_b4hash)
    with open(r'd:\TopUP\backend\MLBBTopUp.Infrastructure\Services\AbaPayWayService.cs', 'w', encoding='utf8') as f:
        f.write(text)
    print("Fixed b4hash for generate-qr")
else:
    print("Could not find the old_b4hash string to replace!")
