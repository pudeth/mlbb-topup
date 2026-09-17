import re

with open(r'd:\TopUP\backend\MLBBTopUp.Infrastructure\Services\AbaPayWayService.cs', 'r', encoding='utf8') as f:
    text = f.read()

# I will find this:
# var qrEndpoint = $"{baseUrl}/api/payment-gateway/v1/payments/generate-qr";
# And see where it's located.
# Wait, let's just do a manual replacement. I know exactly what code needs to be moved.
# Let's extract the block of code and put it BEFORE `if (!string.IsNullOrEmpty(apiKey))`

block_to_extract = """                        var purchaseUrl = $"{baseUrl}/api/payment-gateway/v1/payments/purchase";
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

if block_to_extract in text:
    text = text.replace(block_to_extract, "")
else:
    print("Could not find block to extract!")

# Insert it before `if (!string.IsNullOrEmpty(apiKey))`
insertion_target = "                if (!string.IsNullOrEmpty(apiKey))"

if insertion_target in text:
    # Remove one layer of indentation from block_to_extract
    unindented_block = "\n".join([line[4:] if line.startswith("    ") else line for line in block_to_extract.split("\n")])
    text = text.replace(insertion_target, unindented_block + "\n\n" + insertion_target, 1)
    print("Moved successfully!")
else:
    print("Could not find insertion target!")

with open(r'd:\TopUP\backend\MLBBTopUp.Infrastructure\Services\AbaPayWayService.cs', 'w', encoding='utf8') as f:
    f.write(text)
