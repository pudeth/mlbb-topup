import re

with open(r'd:\TopUP\backend\MLBBTopUp.Infrastructure\Services\AbaPayWayService.cs', 'r', encoding='utf8') as f:
    text = f.read()

old_popup_hash = """                            var popupHash = GeneratePurchaseHash(reqTime, merchantId, tranId, amtStr, itemsBase64,
                                "", firstName, lastName, email, phone, purchaseType, popupPaymentOption,
                                "", "", "", "", paywayCurrency, "", "", "", qrLifetime, "", "", "");"""

new_popup_hash = """                            var returnUrl = "http://localhost:3000/success"; // Success URL for Web Continuation
                            var continueSuccessUrl = "http://localhost:3000/success";
                            var returnDeeplink = "abamobilebank://ababank.com"; // Success URL for Mobile Continuation
                            var cancelUrl = "http://localhost:3000/checkout";

                            var popupHash = GeneratePurchaseHash(reqTime, merchantId, tranId, amtStr, itemsBase64,
                                "", firstName, lastName, email, phone, purchaseType, popupPaymentOption,
                                returnUrl, cancelUrl, continueSuccessUrl, returnDeeplink, paywayCurrency, "", "", "", qrLifetime, "", "", "");"""

text = text.replace(old_popup_hash, new_popup_hash)

old_dict = """                            var formData = new Dictionary<string, string>
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
                            };"""

new_dict = """                            var formData = new Dictionary<string, string>
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
                                { "return_url", returnUrl },
                                { "cancel_url", cancelUrl },
                                { "continue_success_url", continueSuccessUrl },
                                { "return_deeplink", returnDeeplink },
                                { "currency", paywayCurrency },
                                { "lifetime", qrLifetime },
                                { "payment_gate", "0" },
                                { "hash", popupHash }
                            };"""

text = text.replace(old_dict, new_dict)

with open(r'd:\TopUP\backend\MLBBTopUp.Infrastructure\Services\AbaPayWayService.cs', 'w', encoding='utf8') as f:
    f.write(text)
print("Done")
