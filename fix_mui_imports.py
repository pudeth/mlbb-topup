import sys

with open(r'd:\TopUP\frontend\src\pages\Wallet.js', 'r', encoding='utf8') as f:
    text = f.read()

# Replace individual default imports with a single named import
old_imports = """import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import DeleteIcon from '@mui/icons-material/Delete';
import AutorenewIcon from '@mui/icons-material/Autorenew';"""

new_imports = """import { CreditCard as CreditCardIcon, AccountBalanceWallet as AccountBalanceWalletIcon, Delete as DeleteIcon, Autorenew as AutorenewIcon } from '@mui/icons-material';"""

text = text.replace(old_imports, new_imports)

with open(r'd:\TopUP\frontend\src\pages\Wallet.js', 'w', encoding='utf8') as f:
    f.write(text)

print("Fixed imports in Wallet.js")
