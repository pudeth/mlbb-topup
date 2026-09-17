import sys

with open(r'd:\TopUP\backend\MLBBTopUp.Infrastructure\Services\AbaPayWayService.cs', 'r', encoding='utf8') as f:
    text = f.read()

# We need to remove the redeclaration inside if (response.IsSuccessStatusCode)
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

# Sometimes indentation has mixed tabs/spaces, so let's use regex
import re

pattern = r'\s*var purchaseUrl = \$\"\{baseUrl\}/api/payment-gateway/v1/payments/purchase\";[\s\S]*?\{ \"hash\", popupHash \}\s*\};\s*'

# Find matches
matches = list(re.finditer(pattern, text))
print(f"Found {len(matches)} matches.")

if len(matches) >= 2:
    # Match 0: The one we just inserted before generate-qr
    # Match 1: The one inside `if (response.IsSuccessStatusCode)`
    # Match 2: The one in `CreateSubscriptionPaymentAsync`
    
    # Let's remove Match 1
    match = matches[1]
    new_text = text[:match.start()] + text[match.end():]
    with open(r'd:\TopUP\backend\MLBBTopUp.Infrastructure\Services\AbaPayWayService.cs', 'w', encoding='utf8') as f:
        f.write(new_text)
    print("Successfully removed the inner declaration.")
