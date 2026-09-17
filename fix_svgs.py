import sys

with open(r'd:\TopUP\frontend\src\pages\Wallet.js', 'r', encoding='utf8') as f:
    text = f.read()

# Remove the mui icon import
text = text.replace("import { CreditCard as CreditCardIcon, AccountBalanceWallet as AccountBalanceWalletIcon, Delete as DeleteIcon, Autorenew as AutorenewIcon } from '@mui/icons-material';", "")

# Add inline SVG components
svgs = """
const CreditCardIcon = (props) => (
  <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
  </svg>
);

const AccountBalanceWalletIcon = (props) => (
  <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 7.28V5c0-1.1-.9-2-2-2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-2.28c.59-.35 1-.98 1-1.72V9c0-.74-.41-1.37-1-1.72zM20 9v6h-7V9h7zM5 19V5h14v2h-6c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h6v2H5z"/>
    <circle cx="16" cy="12" r="1.5"/>
  </svg>
);

const DeleteIcon = (props) => (
  <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
  </svg>
);

const AutorenewIcon = (props) => (
  <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/>
  </svg>
);
"""

# Insert SVGs after imports
import_block_end = text.find("export default function Wallet() {")
text = text[:import_block_end] + svgs + "\n" + text[import_block_end:]

with open(r'd:\TopUP\frontend\src\pages\Wallet.js', 'w', encoding='utf8') as f:
    f.write(text)

print("Fixed")
