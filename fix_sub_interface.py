import sys

with open(r'd:\TopUP\backend\MLBBTopUp.Infrastructure\Services\AbaPayWayService.cs', 'r', encoding='utf8') as f:
    text = f.read()

old_interface = 'Task<string> CreateTokenPaymentAsync(string token, int orderId, decimal amount, string currency = "USD");'
new_interface = 'Task<string> CreateTokenPaymentAsync(string token, int orderId, decimal amount, string currency = "USD");\n        Task<PayWayCreateResult> CreateSubscriptionPaymentAsync(int orderId, decimal amount, string ctid, string frequency = "1M", string currency = "USD");'

text = text.replace(old_interface, new_interface)

with open(r'd:\TopUP\backend\MLBBTopUp.Infrastructure\Services\AbaPayWayService.cs', 'w', encoding='utf8') as f:
    f.write(text)

with open(r'd:\TopUP\backend\MLBBTopUp.API\Controllers\PayWayController.cs', 'r', encoding='utf8') as f:
    ctrl_text = f.read()

ctrl_text = ctrl_text.replace('    private readonly IConfiguration _configuration;',
                              '    private readonly Microsoft.Extensions.Configuration.IConfiguration _configuration;')

with open(r'd:\TopUP\backend\MLBBTopUp.API\Controllers\PayWayController.cs', 'w', encoding='utf8') as f:
    f.write(ctrl_text)

print("Done")
