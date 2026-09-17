import sys

with open(r'd:\TopUP\backend\MLBBTopUp.Infrastructure\Services\AbaPayWayService.cs', 'r', encoding='utf8') as f:
    text = f.read()

# Fix GeneratePurchaseHash
old_purchase = """        public string GeneratePurchaseHash(string reqTime, string merchantId, string tranId, string amount, string items,
            string shipping, string firstName, string lastName, string email, string phone, string type,
            string paymentOption, string returnUrl, string cancelUrl, string continueSuccessUrl,
            string returnDeeplink, string currency, string customFields, string returnParams, string payout,
            string lifetime, string additionalParams, string googlePayToken, string skipSuccessPage)
        {
            var b4hash = $"{reqTime}{merchantId}{tranId}{amount}{items}{shipping}{firstName}{lastName}{email}{phone}{type}{paymentOption}{returnUrl}{cancelUrl}{continueSuccessUrl}{returnDeeplink}{currency}{customFields}{returnParams}{payout}{lifetime}{additionalParams}{googlePayToken}{skipSuccessPage}";
            return GenerateHash(b4hash);
        }"""

new_purchase = """        public string GeneratePurchaseHash(string reqTime, string merchantId, string tranId, string amount, string items,
            string shipping, string firstName, string lastName, string email, string phone, string type,
            string paymentOption, string returnUrl, string cancelUrl, string continueSuccessUrl,
            string returnDeeplink, string customFields, string currency, string returnParams, string payout,
            string lifetime, string additionalParams, string googlePayToken, string skipSuccessPage)
        {
            var b4hash = $"{reqTime}{merchantId}{tranId}{amount}{items}{shipping}{firstName}{lastName}{email}{phone}{type}{paymentOption}{returnUrl}{cancelUrl}{continueSuccessUrl}{returnDeeplink}{customFields}{currency}{returnParams}{payout}{lifetime}{additionalParams}{googlePayToken}{skipSuccessPage}";
            return GenerateHash(b4hash);
        }"""

text = text.replace(old_purchase, new_purchase)

# Also fix the call to GeneratePurchaseHash
old_call = """                            var popupHash = GeneratePurchaseHash(reqTime, merchantId, tranId, amtStr, itemsBase64,
                                "", firstName, lastName, email, phone, purchaseType, popupPaymentOption,
                                returnUrl, cancelUrl, continueSuccessUrl, returnDeeplink, paywayCurrency, "", "", "", qrLifetime, "", "", "");"""

new_call = """                            var popupHash = GeneratePurchaseHash(reqTime, merchantId, tranId, amtStr, itemsBase64,
                                "", firstName, lastName, email, phone, purchaseType, popupPaymentOption,
                                returnUrl, cancelUrl, continueSuccessUrl, returnDeeplink, "", paywayCurrency, "", "", qrLifetime, "", "", "");"""
                                
text = text.replace(old_call, new_call)

with open(r'd:\TopUP\backend\MLBBTopUp.Infrastructure\Services\AbaPayWayService.cs', 'w', encoding='utf8') as f:
    f.write(text)

print("Fixed")
