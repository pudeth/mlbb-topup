import sys

with open(r'd:\TopUP\backend\MLBBTopUp.Infrastructure\Services\AbaPayWayService.cs', 'r', encoding='utf8') as f:
    content = f.read()

# 1. Update PayWayCreateResult properties
content = content.replace('    public string? AbapayDeeplink { get; set; }\n    public string? ErrorMessage { get; set; }\n}',
'''    public string? AbapayDeeplink { get; set; }
    public string? Md5Hash { get; set; }
    public string? PurchaseUrl { get; set; }
    public string? CheckoutUrl { get; set; }
    public string? Hash { get; set; }
    public Dictionary<string, string>? FormData { get; set; }
    public string? ErrorMessage { get; set; }
}''')

# 2. Update the return in CreatePaymentAsync
old_return = """                    return new PayWayCreateResult
                    {
                        Success = true,
                        TranId = tranId,
                        QrString = qrString,
                        QrImage = qrImage,
                        AbapayDeeplink = deeplink,
                        Md5Hash = md5
                    };"""

new_return = """                    var purchaseUrl = $"{baseUrl}/api/payment-gateway/v1/payments/purchase";
                    var checkoutUrl = $"{baseUrl}/pay?tran_id={tranId}&amount={amtStr}&currency={paywayCurrency}";
                    var popupPaymentOption = "";
                    var popupHash = GeneratePurchaseHash(reqTime, merchantId, tranId, amtStr, itemsBase64,
                        "", firstName, lastName, email, phone, purchaseType, popupPaymentOption,
                        "", "", "", "", paywayCurrency, "", "", "", qrLifetime, "", "", "");

                    var formData = new Dictionary<string, string>
                    {
                        { "req_time", reqTime },
                        { "merchant_id", merchantId },
                        { "tran_id", tranId },
                        { "amount", amtStr },
                        { "items", itemsBase64 },
                        { "firstname", firstName },
                        { "lastname", lastName },
                        { "email", email },
                        { "phone", phone },
                        { "type", purchaseType },
                        { "payment_option", popupPaymentOption },
                        { "currency", paywayCurrency },
                        { "lifetime", qrLifetime },
                        { "payment_gate", "0" },
                        { "hash", popupHash }
                    };

                    return new PayWayCreateResult
                    {
                        Success = true,
                        TranId = tranId,
                        QrString = qrString,
                        QrImage = qrImage,
                        AbapayDeeplink = deeplink,
                        Md5Hash = md5,
                        CheckoutUrl = checkoutUrl,
                        PurchaseUrl = purchaseUrl,
                        Hash = popupHash,
                        FormData = formData
                    };"""

content = content.replace(old_return, new_return)

with open(r'd:\TopUP\backend\MLBBTopUp.Infrastructure\Services\AbaPayWayService.cs', 'w', encoding='utf8') as f:
    f.write(content)
print("Done!")
