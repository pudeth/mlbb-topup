import re

with open(r'd:\TopUP\backend\MLBBTopUp.Infrastructure\Services\AbaPayWayService.cs', 'r', encoding='utf8') as f:
    text = f.read()

# First, remove them from inside the if block
block_to_remove = """                            var purchaseUrl = $"{baseUrl}/api/payment-gateway/v1/payments/purchase";
                            var checkoutUrl = $"{baseUrl}/pay?tran_id={tranId}&amount={amtStr}&currency={paywayCurrency}";
                            var popupPaymentOption = ""; 
                            
                            var returnUrl = "http://localhost:3000/success"; // Success URL for Web Continuation
                            var continueSuccessUrl = "http://localhost:3000/success";
                            var returnDeeplink = "abamobilebank://ababank.com"; // Success URL for Mobile Continuation
                            var cancelUrl = "http://localhost:3000/checkout";

                            var popupHash = GeneratePurchaseHash(reqTime, merchantId, tranId, amtStr, itemsBase64,
                                "", firstName, lastName, email, phone, purchaseType, popupPaymentOption,
                                returnUrl, cancelUrl, continueSuccessUrl, returnDeeplink, "", paywayCurrency, "", "", "", "", "", "");

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
                                { "return_url", returnUrl },
                                { "cancel_url", cancelUrl },
                                { "continue_success_url", continueSuccessUrl },
                                { "return_deeplink", returnDeeplink },
                                { "currency", paywayCurrency },
                                { "payment_gate", "0" },
                                { "hash", popupHash }
                            };"""

if block_to_remove in text:
    text = text.replace(block_to_remove, "")
else:
    print("Could not find block to remove!")

# Now, define them before the HttpRequestMessage
insertion_point = """                        var qrEndpoint = $"{baseUrl}/api/payment-gateway/v1/payments/generate-qr";"""

replacement = """
                        var purchaseUrl = $"{baseUrl}/api/payment-gateway/v1/payments/purchase";
                        var checkoutUrl = $"{baseUrl}/pay?tran_id={tranId}&amount={amtStr}&currency={paywayCurrency}";
                        var popupPaymentOption = ""; 
                        
                        var returnUrl = "http://localhost:3000/success"; // Success URL for Web Continuation
                        var continueSuccessUrl = "http://localhost:3000/success";
                        var returnDeeplink = "abamobilebank://ababank.com"; // Success URL for Mobile Continuation
                        var cancelUrl = "http://localhost:3000/checkout";

                        var popupHash = GeneratePurchaseHash(reqTime, merchantId, tranId, amtStr, itemsBase64,
                            "", firstName, lastName, email, phone, purchaseType, popupPaymentOption,
                            returnUrl, cancelUrl, continueSuccessUrl, returnDeeplink, "", paywayCurrency, "", "", "", "", "", "");

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
                            { "return_url", returnUrl },
                            { "cancel_url", cancelUrl },
                            { "continue_success_url", continueSuccessUrl },
                            { "return_deeplink", returnDeeplink },
                            { "currency", paywayCurrency },
                            { "payment_gate", "0" },
                            { "hash", popupHash }
                        };

                        var qrEndpoint = $"{baseUrl}/api/payment-gateway/v1/payments/generate-qr";"""

if insertion_point in text:
    text = text.replace(insertion_point, replacement)
    print("Successfully moved variables.")
else:
    print("Could not find insertion point!")

with open(r'd:\TopUP\backend\MLBBTopUp.Infrastructure\Services\AbaPayWayService.cs', 'w', encoding='utf8') as f:
    f.write(text)
