import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Box, 
    Container, 
    Typography, 
    Button, 
    Card, 
    CardContent, 
    Grid,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';



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

export default function Wallet() {
    const [tokens, setTokens] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openLinkDialog, setOpenLinkDialog] = useState(false);
    const ctid = "USER123"; // TODO: Replace with logged in user's ID

    useEffect(() => {
        // In a real app, you would fetch tokens from your database here
        // For now, we'll just mock some data to show the UI
        setTokens([
            { pwt: "token_123", type: "Visa", sourceOfFund: "*****1234", status: 1, expiredAt: "2027-01-01" },
            { pwt: "token_456", type: "ABA ACCOUNT", sourceOfFund: "*****9876", status: 1, expiredAt: "2026-12-31" }
        ]);
    }, []);

    const handleLinkAccount = async () => {
        try {
            setLoading(true);
            const res = await axios.post('http://localhost:5000/api/PayWay/link-account', { ctid });
            
            // ABA returns an Android/iOS deeplink and a QR string
            // For desktop, you'd show the QR. For mobile, you redirect to deeplink.
            alert("Please check the console for the linking payload!");
            console.log(res.data);
            setOpenLinkDialog(false);
        } catch (err) {
            console.error(err);
            alert("Error linking account");
        } finally {
            setLoading(false);
        }
    };

    const handleLinkCard = async () => {
        try {
            setLoading(true);
            const res = await axios.post('http://localhost:5000/api/PayWay/link-card', { ctid });
            
            // This returns a form payload that we need to submit to ABA to show the card entry popup
            const { formData, purchaseUrl } = res.data;
            
            // Create a hidden form and submit it to ABA
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = purchaseUrl;
            form.target = 'aba_checkout'; // opens in popup or new tab

            for (const key in formData) {
                if (formData.hasOwnProperty(key)) {
                    const hiddenField = document.createElement('input');
                    hiddenField.type = 'hidden';
                    hiddenField.name = key;
                    hiddenField.value = formData[key];
                    form.appendChild(hiddenField);
                }
            }
            
            document.body.appendChild(form);
            window.open('', 'aba_checkout', 'width=600,height=600');
            form.submit();
            document.body.removeChild(form);
            
            setOpenLinkDialog(false);
        } catch (err) {
            console.error(err);
            alert("Error linking card");
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveToken = async (pwt) => {
        if (!window.confirm("Are you sure you want to remove this payment method?")) return;
        
        try {
            setLoading(true);
            await axios.post('http://localhost:5000/api/PayWay/remove-token', { ctid, pwt });
            setTokens(tokens.filter(t => t.pwt !== pwt));
            alert("Token removed successfully");
        } catch (err) {
            console.error(err);
            alert("Error removing token");
        } finally {
            setLoading(false);
        }
    };

    const handleRenewToken = async (pwt) => {
        try {
            setLoading(true);
            await axios.post('http://localhost:5000/api/PayWay/renew-token', { ctid, pwt });
            alert("Renewal request sent! Please check your ABA Mobile App to approve.");
        } catch (err) {
            console.error(err);
            alert("Error renewing token");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4" fontWeight="bold">My Wallet</Typography>
                <Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => setOpenLinkDialog(true)}
                >
                    Add Payment Method
                </Button>
            </Box>

            <Grid container spacing={3}>
                {tokens.length === 0 ? (
                    <Grid item xs={12}>
                        <Typography variant="body1" color="textSecondary" align="center">
                            You have no saved payment methods.
                        </Typography>
                    </Grid>
                ) : (
                    tokens.map((token, idx) => (
                        <Grid item xs={12} sm={6} key={idx}>
                            <Card variant="outlined" sx={{ borderRadius: 2 }}>
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" mb={2}>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            {token.type === "ABA ACCOUNT" ? 
                                                <AccountBalanceWalletIcon color="primary" /> : 
                                                <CreditCardIcon color="secondary" />
                                            }
                                            <Typography variant="h6">{token.type}</Typography>
                                        </Box>
                                        <Chip 
                                            label={token.status === 1 ? "Active" : "Inactive"} 
                                            color={token.status === 1 ? "success" : "default"}
                                            size="small"
                                        />
                                    </Box>
                                    
                                    <Typography variant="h5" sx={{ letterSpacing: 2, mb: 2 }}>
                                        {token.sourceOfFund}
                                    </Typography>

                                    <Typography variant="body2" color="textSecondary" mb={2}>
                                        Expires: {new Date(token.expiredAt).toLocaleDateString()}
                                    </Typography>

                                    <Box display="flex" gap={1} justifyContent="flex-end">
                                        {token.type === "ABA ACCOUNT" && (
                                            <Button 
                                                size="small" 
                                                startIcon={<AutorenewIcon />}
                                                onClick={() => handleRenewToken(token.pwt)}
                                                disabled={loading}
                                            >
                                                Renew
                                            </Button>
                                        )}
                                        <Button 
                                            size="small" 
                                            color="error" 
                                            startIcon={<DeleteIcon />}
                                            onClick={() => handleRemoveToken(token.pwt)}
                                            disabled={loading}
                                        >
                                            Remove
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                )}
            </Grid>

            <Dialog open={openLinkDialog} onClose={() => setOpenLinkDialog(false)}>
                <DialogTitle>Add Payment Method</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" mb={3}>
                        Securely save your payment method for faster 1-click checkouts and subscriptions.
                    </Typography>
                    <Box display="flex" flexDirection="column" gap={2}>
                        <Button 
                            variant="outlined" 
                            size="large" 
                            startIcon={<AccountBalanceWalletIcon />}
                            onClick={handleLinkAccount}
                            disabled={loading}
                        >
                            Link ABA Account
                        </Button>
                        <Button 
                            variant="outlined" 
                            size="large" 
                            startIcon={<CreditCardIcon />}
                            onClick={handleLinkCard}
                            disabled={loading}
                        >
                            Link Credit / Debit Card
                        </Button>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenLinkDialog(false)}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
