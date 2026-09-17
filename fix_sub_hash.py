import sys

with open(r'd:\TopUP\backend\MLBBTopUp.Infrastructure\Services\AbaPayWayService.cs', 'r', encoding='utf8') as f:
    text = f.read()

import re

old_hash_func = r"""        public string GenerateSubscriptionHash\(string reqTime, string merchantId, string tranId, string amount, string items,
            string shipping, string firstName, string lastName, string email, string phone, string type,
            string paymentOption, string returnUrl, string cancelUrl, string continueSuccessUrl,
            string returnDeeplink, string currency, string customFields, string returnParams, string payout,
            string lifetime, string additionalParams, string googlePayToken, string skipSuccessPage,
            string ctid, string tokenFlag, string frequency\)
        \{
            var b4hash = \$\"\{reqTime\}\{merchantId\}\{tranId\}\{amount\}\{items\}\{shipping\}\{firstName\}\{lastName\}\{email\}\{phone\}\{type\}\{paymentOption\}\{returnUrl\}\{cancelUrl\}\{continueSuccessUrl\}\{returnDeeplink\}\{currency\}\{customFields\}\{returnParams\}\{payout\}\{lifetime\}\{additionalParams\}\{googlePayToken\}\{skipSuccessPage\}\{ctid\}\{tokenFlag\}\{frequency\}\";
            return GenerateHash\(b4hash\);
        \}"""

new_hash_func = """        public string GenerateSubscriptionHash(string reqTime, string merchantId, string tranId, string amount, string items,
            string shipping, string firstName, string lastName, string email, string phone, string type,
            string paymentOption, string returnUrl, string cancelUrl, string continueSuccessUrl,
            string returnDeeplink, string currency, string customFields, string returnParams, string payout,
            string lifetime, string additionalParams, string skipSuccessPage, string tokenFlag, string frequency)
        {
            // NOTE: According to official ABA PayWay docs, ctid and googlePayToken are EXCLUDED from this hash sequence!
            var b4hash = $"{reqTime}{merchantId}{tranId}{amount}{items}{shipping}{firstName}{lastName}{email}{phone}{type}{paymentOption}{returnUrl}{cancelUrl}{continueSuccessUrl}{returnDeeplink}{currency}{customFields}{returnParams}{payout}{lifetime}{additionalParams}{skipSuccessPage}{tokenFlag}{frequency}";
            return GenerateHash(b4hash);
        }"""

match = re.search(old_hash_func, text)
if match:
    text = text.replace(match.group(0), new_hash_func)

old_hash_call = r"""                    var popupHash = GenerateSubscriptionHash\(reqTime, merchantId, tranId, amtStr, itemsBase64,
                        "", firstName, lastName, email, phone, purchaseType, popupPaymentOption,
                        returnUrl, cancelUrl, continueSuccessUrl, returnDeeplink, paywayCurrency, "", "", "", qrLifetime, "", "", "",
                        ctid, tokenFlag, frequency\);"""

new_hash_call = """                    var popupHash = GenerateSubscriptionHash(reqTime, merchantId, tranId, amtStr, itemsBase64,
                        "", firstName, lastName, email, phone, purchaseType, popupPaymentOption,
                        returnUrl, cancelUrl, continueSuccessUrl, returnDeeplink, paywayCurrency, "", "", "", qrLifetime, "", "", tokenFlag, frequency);"""

call_match = re.search(old_hash_call, text)
if call_match:
    text = text.replace(call_match.group(0), new_hash_call)

with open(r'd:\TopUP\backend\MLBBTopUp.Infrastructure\Services\AbaPayWayService.cs', 'w', encoding='utf8') as f:
    f.write(text)

print("Done")
