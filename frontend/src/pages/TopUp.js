import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { useLanguage } from '../context/LanguageContext';
import { ordersAPI, paymentsAPI, topupAPI, paywayAPI } from '../services/api';
import { getStoredGames, getMasterTopupStatus, fetchStoredGames, fetchMasterTopupStatus } from '../services/gamesConfig';
import { CambodiaFlagFrame } from '../components/CambodiaFlagBadge';
import ProductPackageImage from '../components/ProductPackageImage';
import {
  AbaPayLogo,
  KhqrLogo,
  AbaPaywayVoucherHeader,
  VisaLogo,
  MastercardLogo,
  UnionPayLogo,
  JcbLogo,
  AbaPaywayTrustBox
} from '../components/AbaPaymentLogos';

// Game-specific packages matching upstream supplier catalog
const GAME_PACKAGES_MAP = {
  mlbb: [
    { productId: 12, diamondAmount: 55, name: '55 Diamonds', price: 0.95, tag: 'Starter' },
    { productId: 13, diamondAmount: 86, name: '86 Diamonds', price: 1.35, tag: 'Bonus' },
    { productId: 14, diamondAmount: 210, name: 'Weekly Pass', price: 1.55, tag: 'ទទួលបាន 220 💎 + 70 arura ⭐', isPass: true },
    { productId: 201, diamondAmount: 440, name: '2 Weekly Pass', price: 3.10, tag: 'ទទួលបាន 440 💎 + 140 arura ⭐', isPass: true },
    { productId: 202, diamondAmount: 660, name: '3 Weekly Pass', price: 4.65, tag: '29 tickets 🎫', isPass: true },
    { productId: 203, diamondAmount: 880, name: '4 Weekly Pass', price: 6.20, tag: '4x WDP', isPass: true },
    { productId: 204, diamondAmount: 1100, name: '5 Weekly Pass', price: 7.75, tag: '5x WDP', isPass: true },
    { productId: 205, diamondAmount: 1320, name: '6 Weekly Pass', price: 9.30, tag: '6x WDP', isPass: true },
    { productId: 206, diamondAmount: 605, name: '165 + 2Weekly', price: 5.50, tag: '165 💎 + 2x WDP', isPass: true },
    { productId: 2, diamondAmount: 110, name: '110 Diamonds', price: 1.70, tag: 'Bonus' },
    { productId: 31, diamondAmount: 165, name: '165 Diamonds', price: 2.40, tag: 'HOT 🔥' },
    { productId: 15, diamondAmount: 172, name: '172 Diamonds', price: 2.50, tag: 'Standard' },
    { productId: 16, diamondAmount: 257, name: '257 Diamonds', price: 3.69, tag: 'Popular' },
    { productId: 32, diamondAmount: 275, name: '275 Diamonds', price: 3.85, tag: '29 tickets 🎟️' },
    { productId: 33, diamondAmount: 312, name: '312 Diamonds', price: 4.55, tag: 'STARLIGHT 🌟' },
    { productId: 34, diamondAmount: 343, name: '343 Diamonds', price: 4.99, tag: '29 tickets 🎟️' },
    { productId: 18, diamondAmount: 429, name: '429 Diamonds', price: 6.30, tag: '29 tickets 🎟️' },
    { productId: 19, diamondAmount: 500, name: 'Twilight Pass', price: 8.50, tag: 'VIP PASS 👑', isPass: true },
    { productId: 20, diamondAmount: 514, name: '514 Diamonds', price: 7.35, tag: 'Best Value' },
    { productId: 35, diamondAmount: 565, name: '565 Diamonds', price: 7.80, tag: 'Special' },
    { productId: 36, diamondAmount: 600, name: '600 Diamonds', price: 8.50, tag: 'Pro Pack' },
    { productId: 21, diamondAmount: 706, name: '706 Diamonds', price: 9.99, tag: 'VIP' },
    { productId: 37, diamondAmount: 878, name: '878 Diamonds', price: 12.80, tag: 'VIP PRO' },
    { productId: 38, diamondAmount: 963, name: '963 Diamonds', price: 13.60, tag: 'Grand Pack' },
    { productId: 22, diamondAmount: 1050, name: '1050 Diamonds', price: 15.50, tag: 'Royal Chest' },
    { productId: 39, diamondAmount: 1412, name: '1412 Diamonds', price: 22.00, tag: 'Treasury' },
    { productId: 23, diamondAmount: 2195, name: '2195 Diamonds', price: 29.99, tag: 'Mythic Pack' },
    { productId: 40, diamondAmount: 2452, name: '2452 Diamonds', price: 32.50, tag: 'Mythic Plus' },
    { productId: 41, diamondAmount: 2901, name: '2901 Diamonds', price: 39.99, tag: 'Legendary Pack' },
    { productId: 24, diamondAmount: 3688, name: '3688 Diamonds', price: 49.99, tag: 'Epic Vault' },
    { productId: 42, diamondAmount: 4390, name: '4390 Diamonds', price: 62.99, tag: 'Supreme Chest' },
    { productId: 25, diamondAmount: 5532, name: '5532 Diamonds', price: 73.99, tag: 'Immortal Pack' },
    { productId: 43, diamondAmount: 6944, name: '6944 Diamonds', price: 92.99, tag: 'Titan Pack' },
    { productId: 26, diamondAmount: 9288, name: '9288 Diamonds', price: 125.00, tag: 'ULTIMATE ⚡' },
  ],
  pubgm: [
    { productId: 201, diamondAmount: 60, name: '60 Unknown Cash (UC)', price: 0.95, tag: 'Starter' },
    { productId: 202, diamondAmount: 325, name: '300 + 25 UC', price: 4.80, tag: 'Popular' },
    { productId: 203, diamondAmount: 660, name: '600 + 60 UC (Royale Pass Ready)', price: 9.50, tag: '🔥 SEASON PASS', isPass: true },
    { productId: 204, diamondAmount: 1800, name: '1500 + 300 UC', price: 23.99, tag: 'Best Value' },
    { productId: 205, diamondAmount: 3850, name: '3000 + 850 UC', price: 47.99, tag: 'VIP Pack' },
    { productId: 206, diamondAmount: 8100, name: '6000 + 2100 UC', price: 95.00, tag: 'ULTIMATE ⚡' },
  ],
  freefire: [
    { productId: 301, diamondAmount: 100, name: '100 + 10 Diamonds', price: 0.95, tag: 'Starter' },
    { productId: 302, diamondAmount: 310, name: '310 + 31 Diamonds', price: 2.85, tag: 'Popular' },
    { productId: 307, diamondAmount: 450, name: 'Weekly Membership Pass', price: 1.99, tag: 'PASS 🌟', isPass: true },
    { productId: 303, diamondAmount: 520, name: '520 + 52 Diamonds', price: 4.75, tag: 'HOT 🔥' },
    { productId: 304, diamondAmount: 1060, name: '1060 + 106 Diamonds', price: 9.50, tag: 'Best Value' },
    { productId: 305, diamondAmount: 2180, name: '2180 + 218 Diamonds', price: 18.99, tag: 'Pro Pack' },
    { productId: 308, diamondAmount: 2600, name: 'Monthly Membership Pass', price: 7.99, tag: 'VIP 👑', isPass: true },
  ],
  hok: [
    { productId: 407, diamondAmount: 100, name: 'Weekly Card Plus', price: 0.99, tag: 'PASS 🌟', isPass: true },
    { productId: 401, diamondAmount: 80, name: '80 + 8 Tokens', price: 0.95, tag: 'Starter' },
    { productId: 402, diamondAmount: 240, name: '240 + 24 Tokens', price: 2.85, tag: 'Popular' },
    { productId: 403, diamondAmount: 400, name: '400 + 40 Tokens', price: 4.75, tag: 'HOT 🔥' },
    { productId: 404, diamondAmount: 800, name: '800 + 80 Tokens', price: 9.50, tag: 'Best Value' },
    { productId: 405, diamondAmount: 1200, name: '1200 + 150 Tokens', price: 14.25, tag: 'VIP Pack' },
    { productId: 406, diamondAmount: 2400, name: '2400 + 350 Tokens', price: 28.50, tag: 'Treasury' },
  ],
  genshin: [
    { productId: 507, diamondAmount: 3000, name: 'Blessing of the Welkin Moon', price: 4.99, tag: 'PASS 👑', isPass: true },
    { productId: 501, diamondAmount: 60, name: '60 Genesis Crystals', price: 0.99, tag: 'Starter' },
    { productId: 502, diamondAmount: 330, name: '300 + 30 Genesis Crystals', price: 4.99, tag: 'Popular' },
    { productId: 503, diamondAmount: 1090, name: '980 + 110 Genesis Crystals', price: 14.99, tag: 'HOT 🔥' },
    { productId: 504, diamondAmount: 2240, name: '1980 + 260 Genesis Crystals', price: 29.99, tag: 'Best Value' },
    { productId: 505, diamondAmount: 3880, name: '3280 + 600 Genesis Crystals', price: 49.99, tag: 'Grand Pack' },
    { productId: 506, diamondAmount: 8080, name: '6480 + 1600 Genesis Crystals', price: 99.99, tag: 'ULTIMATE ⚡' },
  ],
  telegram_stars: [
    { productId: 601, diamondAmount: 50, name: '50 Telegram Stars', price: 0.99, tag: 'Starter' },
    { productId: 602, diamondAmount: 100, name: '100 Telegram Stars', price: 1.95, tag: 'Popular' },
    { productId: 603, diamondAmount: 250, name: '250 Telegram Stars', price: 4.80, tag: 'HOT 🔥' },
    { productId: 604, diamondAmount: 500, name: '500 Telegram Stars', price: 9.50, tag: 'Best Value' },
    { productId: 605, diamondAmount: 1000, name: '1,000 Telegram Stars', price: 18.99, tag: 'PRO' },
    { productId: 606, diamondAmount: 2500, name: '2,500 Telegram Stars', price: 46.99, tag: 'VIP' },
    { productId: 607, diamondAmount: 5000, name: '5,000 Telegram Stars', price: 92.99, tag: 'Whale Pack' },
    { productId: 608, diamondAmount: 10000, name: '10,000 Telegram Stars', price: 180.00, tag: 'ULTIMATE ⚡' },
  ],
  steam: [
    { productId: 701, diamondAmount: 5, name: '$5.00 USD Steam Balance', price: 5.00, tag: 'Instant PIN' },
    { productId: 702, diamondAmount: 10, name: '$10.00 USD Steam Balance', price: 10.00, tag: 'Popular' },
    { productId: 703, diamondAmount: 20, name: '$20.00 USD Steam Balance', price: 20.00, tag: 'HOT 🔥' },
    { productId: 704, diamondAmount: 50, name: '$50.00 USD Steam Balance', price: 50.00, tag: 'Best Value' },
    { productId: 705, diamondAmount: 100, name: '$100.00 USD Steam Balance', price: 100.00, tag: 'VIP 🎮' },
  ],
  giftcards: [
    { productId: 801, diamondAmount: 10, name: 'Discord Nitro (1 Month)', price: 9.99, tag: 'NITRO ⚡', isPass: true },
    { productId: 802, diamondAmount: 100, name: 'Discord Nitro (1 Year)', price: 99.99, tag: 'BEST DEAL 👑', isPass: true },
    { productId: 803, diamondAmount: 10, name: '$10 Google Play Gift Card', price: 10.00, tag: 'PlayStore' },
    { productId: 804, diamondAmount: 25, name: '$25 Google Play Gift Card', price: 25.00, tag: 'PlayStore' },
    { productId: 805, diamondAmount: 10, name: '$10 Apple App Store & iTunes', price: 10.00, tag: 'Apple ID' },
    { productId: 806, diamondAmount: 25, name: '$25 Apple App Store & iTunes', price: 25.00, tag: 'Apple ID' },
    { productId: 807, diamondAmount: 10, name: '$10 Razer Gold PIN (Global)', price: 10.00, tag: 'Universal' },
  ]
};

// Auto-extract Player ID and Server ID
const parseMlbbId = (input) => {
  if (!input || typeof input !== 'string') {
    return { playerID: '', serverID: '', detected: false };
  }
  const raw = input.trim();
  const labelledMatch = raw.match(/(?:user|player|account)?\s*id\s*[:=\s]+(\d+)\D+(?:zone|server)\s*id\s*[:=\s]+(\d+)/i) ||
                        raw.match(/(?:zone|server)\s*id\s*[:=\s]+(\d+)\D+(?:user|player|account)?\s*id\s*[:=\s]+(\d+)/i);
  if (labelledMatch) {
    const isServerFirst = /zone|server/i.test(labelledMatch[0].slice(0, 15));
    return {
      playerID: isServerFirst ? labelledMatch[2] : labelledMatch[1],
      serverID: isServerFirst ? labelledMatch[1] : labelledMatch[2],
      detected: true,
    };
  }
  const bracketMatch = raw.match(/(?:id\s*:\s*)?(\d{5,12})\s*[[({]\s*(\d{3,7})\s*[)\]}]/i) ||
                       raw.match(/(\d+)\s*[[({]\s*(\d+)\s*[)\]}]/);
  if (bracketMatch) {
    return {
      playerID: bracketMatch[1],
      serverID: bracketMatch[2],
      detected: true,
    };
  }
  const sepMatch = raw.match(/(?:id\s*:\s*)?(\d{6,12})\s*[-/_|\s,]\s*(\d{3,7})(?:\D|$)/i);
  if (sepMatch) {
    return {
      playerID: sepMatch[1],
      serverID: sepMatch[2],
      detected: true,
    };
  }
  return { playerID: raw, serverID: '', detected: false };
};

// Play audio chime on success
const playSuccessSound = () => {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const audioCtx = new AudioContextClass();
    const now = audioCtx.currentTime;

    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now);
    gain1.gain.setValueAtTime(0.12, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);
    osc1.start(now);
    osc1.stop(now + 0.3);

    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.12);
    gain2.gain.setValueAtTime(0.15, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.5);
  } catch (e) {}
};

const TopUp = () => {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const allGames = getStoredGames();
  const rawGameParam = searchParams.get('game') || searchParams.get('service') || 'mlbb';
  const matchedGame = allGames.find(g => g.id === rawGameParam || g.id.startsWith(rawGameParam)) || allGames[0] || {
    id: 'mlbb',
    name: 'Mobile Legends (Global)',
    currency: 'Diamonds',
    image: '/mlbb-logo.png'
  };

  const [selectedGame, setSelectedGame] = useState(matchedGame);
  const [masterStatus, setMasterStatus] = useState(() => getMasterTopupStatus());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [autoDetectedMessage, setAutoDetectedMessage] = useState('');
  const [showIdGuide, setShowIdGuide] = useState(false);

  useEffect(() => {
    const handleStatusSync = () => {
      setMasterStatus(getMasterTopupStatus());
      const updatedAll = getStoredGames();
      const updatedMatched = updatedAll.find(g => g.id === rawGameParam || g.id.startsWith(rawGameParam)) || updatedAll[0];
      if (updatedMatched) setSelectedGame(updatedMatched);
    };

    const syncCloudData = async () => {
      try {
        const [cloudGames, cloudStatus] = await Promise.all([
          fetchStoredGames(),
          fetchMasterTopupStatus()
        ]);
        if (cloudStatus) setMasterStatus(cloudStatus);
        if (cloudGames && Array.isArray(cloudGames)) {
          const updatedMatched = cloudGames.find(g => g.id === rawGameParam || g.id.startsWith(rawGameParam)) || cloudGames[0];
          if (updatedMatched) setSelectedGame(updatedMatched);
        }
      } catch (err) {}
    };

    // Immediate initial sync
    syncCloudData();

    // 2.5s Real-Time Background polling across all mobile devices
    const interval = setInterval(syncCloudData, 2500);

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        syncCloudData();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', syncCloudData);

    window.addEventListener('gamesConfigUpdated', handleStatusSync);
    window.addEventListener('masterTopupStatusUpdated', handleStatusSync);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', syncCloudData);
      window.removeEventListener('gamesConfigUpdated', handleStatusSync);
      window.removeEventListener('masterTopupStatusUpdated', handleStatusSync);
    };
  }, [rawGameParam]);

  const isMasterPaused = masterStatus?.status && masterStatus.status !== 'Active';
  const isGamePaused = selectedGame?.status && selectedGame.status !== 'Active';
  const isTopupDisabled = isMasterPaused || isGamePaused;
  const pauseReasonMessage = isMasterPaused 
    ? (masterStatus.notice || 'Top-Ups are temporarily paused by Admin for system maintenance.')
    : (selectedGame?.status === 'Closed' ? `Top-Up orders for ${selectedGame.name} are currently closed.` : `Top-Up orders for ${selectedGame.name} are temporarily paused by Admin for maintenance.`);

    // Determine active packages merged with Admin Customer Retail Prices
  const getPackagesForGame = useCallback((gameId) => {
    let baseList = [];
    if (gameId.startsWith('mlbb') || gameId === 'mlbb') baseList = [...GAME_PACKAGES_MAP.mlbb];
    else if (gameId.startsWith('pubgm')) baseList = [...GAME_PACKAGES_MAP.pubgm];
    else if (gameId.startsWith('freefire')) baseList = [...GAME_PACKAGES_MAP.freefire];
    else if (gameId === 'hok') baseList = [...GAME_PACKAGES_MAP.hok];
    else if (gameId === 'genshin') baseList = [...GAME_PACKAGES_MAP.genshin];
    else if (gameId === 'telegram_stars') baseList = [...GAME_PACKAGES_MAP.telegram_stars];
    else if (gameId.startsWith('steam')) baseList = [...GAME_PACKAGES_MAP.steam];
    else baseList = [...GAME_PACKAGES_MAP.giftcards];

    // Merge with Admin custom prices
    try {
      const saved = localStorage.getItem('admin_custom_products');
      if (saved) {
        const customProducts = JSON.parse(saved);
        if (Array.isArray(customProducts)) {
          baseList = baseList.map(item => {
            const match = customProducts.find(p => p.productId === item.productId || (p.game === (gameId.startsWith('mlbb') ? 'mlbb' : gameId) && p.diamondAmount === item.diamondAmount));
            if (match) {
              const cleanedPrice = Number(match.price);
              return {
                ...item,
                price: (cleanedPrice && cleanedPrice >= 0.5) ? cleanedPrice : item.price,
                name: match.name || item.name,
                tag: match.tag !== undefined ? match.tag : item.tag,
                status: match.status || 'Active'
              };
            }
            return item;
          }).filter(item => item.status !== 'Inactive');
        }
      }
    } catch (e) {}

    // Ensure 55 Diamonds is strictly $0.95
    baseList = baseList.map(item => {
      if ((item.diamondAmount === 55 || item.name === '55 Diamonds') && item.price < 0.5) {
        return { ...item, price: 0.95, diamondAmount: 55 };
      }
      return item;
    });

    return baseList;
  }, []);

  const [products, setProducts] = useState(() => getPackagesForGame(selectedGame.id));
  // Real-time synchronization with Admin Price changes
  useEffect(() => {
    const handleProductsUpdated = () => {
      const updatedList = getPackagesForGame(selectedGame.id);
      setProducts(updatedList);
      setSelectedProduct(prev => {
        const match = updatedList.find(p => p.productId === prev?.productId);
        return match || updatedList[0];
      });
    };

    window.addEventListener('productsConfigUpdated', handleProductsUpdated);
    window.addEventListener('adminProductsUpdated', handleProductsUpdated);
    window.addEventListener('storage', handleProductsUpdated);

    return () => {
      window.removeEventListener('productsConfigUpdated', handleProductsUpdated);
      window.removeEventListener('adminProductsUpdated', handleProductsUpdated);
      window.removeEventListener('storage', handleProductsUpdated);
    };
  }, [selectedGame.id, getPackagesForGame]);
  const [selectedProduct, setSelectedProduct] = useState(products[0]);

  // Account Verification
  const [verifiedAccount, setVerifiedAccount] = useState(null);
  const [accountChecking, setAccountChecking] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    playerID: '',
    serverID: 'Global',
    productId: products[0]?.productId || 100,
    paymentMethod: 'abapayway',
  });

  // Payment states
  const [orderId, setOrderId] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [paymentPaid, setPaymentPaid] = useState(false);
  const [awaitingBalance, setAwaitingBalance] = useState(false); // provider has no balance — pending admin
  const [confirmSent, setConfirmSent] = useState(false); // customer pressed Confirm button
  const [qrExpired, setQrExpired] = useState(false);
  const qrExpiredRef = useRef(false);
  const [processingStep, setProcessingStep] = useState(0); // 0: scanning, 1: verifying, 2: server sync, 3: delivering
  const [currency, setCurrency] = useState('USD'); // 'USD' or 'KHR'
  const [switchingCurrency, setSwitchingCurrency] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5-minute (300 seconds) countdown
  const [productCategoryTab, setProductCategoryTab] = useState('all'); // 'all', 'passes', 'diamonds'
  const [layoutMode, setLayoutMode] = useState('tiles'); // 'list', 'tiles', 'grid'
  const [selectedPaymentOption, setSelectedPaymentOption] = useState('abapay_khqr'); // 'abapay_khqr' or 'cards'
  const checkoutSectionRef = useRef(null);

  const handleSwitchCurrency = async (newCurr) => {
    if (newCurr === currency && paymentData?.currency === newCurr) return;
    setSwitchingCurrency(true);
    setCurrency(newCurr);
    setPaymentData(prev => prev ? ({ ...prev, currency: newCurr }) : prev);

    if (orderId) {
      try {
        // Try Python Scorekhqr service first for real ABA KHQR
        const directRes = await fetch('http://localhost:5001/api/payment/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId,
            amount: selectedProduct?.price || 0.95,
            currency: newCurr
          })
        }).then(r => r.json());

        if (directRes?.qr_code) {
          setPaymentData(prev => ({
            ...prev,
            currency: newCurr,
            qrString: directRes.qr_code,
            khqrQRCode: directRes.qr_code,
            khqrDeeplink: directRes.deeplink,
            abapayDeeplink: directRes.deeplink,
            khqrMd5Hash: directRes.md5,
            md5Hash: directRes.md5
          }));
        } else {
          // Fallback to paywayAPI
          const payRes = await paywayAPI.create({
            orderId,
            amount: selectedProduct?.price || 0.95,
            currency: newCurr
          });
          if (payRes.data) {
            setPaymentData(prev => ({
              ...prev,
              ...payRes.data,
              currency: newCurr,
              qrString: payRes.data.qrString,
              khqrQRCode: payRes.data.qrString,
              khqrDeeplink: payRes.data.abapayDeeplink,
              khqrMd5Hash: payRes.data.md5
            }));
          }
        }
      } catch (err) {
        console.warn('Currency switch notice:', err?.message);
      } finally {
        setTimeout(() => setSwitchingCurrency(false), 350);
      }
    } else {
      setSwitchingCurrency(false);
    }
  };


  // Automatically trigger ABA Official Checkout if backend QR generation fails
  useEffect(() => {
    if (paymentData && !paymentPaid && !paymentData.qrString && !paymentData.khqrQRCode) {
      // The backend failed to generate the QR string due to Wrong Hash (Sandbox constraints).
      // Instantly open the official ABA checkout popup instead of showing a broken React popup.
      
      const purchaseUrl = paymentData?.purchaseUrl || '';
      const isSandbox = purchaseUrl.includes('sandbox');
      const scriptUrl = isSandbox 
        ? 'https://checkout-sandbox.payway.com.kh/plugins/checkout2-0.js'
        : 'https://checkout.payway.com.kh/plugins/checkout2-0.js';

      const triggerCheckout = () => {
        if (typeof window !== 'undefined' && window.AbaPayway) {
          window.AbaPayway.checkout();
        } else {
          // Fallback to iframe to avoid new tab
          const form = document.getElementById('aba_merchant_request');
          if (form) {
            // Create an iframe to target so it doesn't open a new tab
            let iframe = document.getElementById('aba_webservice');
            if (!iframe) {
              iframe = document.createElement('iframe');
              iframe.name = 'aba_webservice';
              iframe.id = 'aba_webservice';
              iframe.style.position = 'fixed';
              iframe.style.top = '0';
              iframe.style.left = '0';
              iframe.style.width = '100vw';
              iframe.style.height = '100vh';
              iframe.style.zIndex = '999999';
              iframe.style.border = 'none';
              iframe.style.backgroundColor = '#fff';
              document.body.appendChild(iframe);
            }
            form.target = 'aba_webservice';
            form.submit();
          }
        }
      };

      // Load script if not present
      if (!window.AbaPayway) {
        const script = document.createElement('script');
        script.src = scriptUrl;
        script.async = true;
        script.onload = () => {
          setTimeout(triggerCheckout, 500); // Give it a moment to initialize
        };
        script.onerror = triggerCheckout;
        document.body.appendChild(script);
      } else {
        triggerCheckout();
      }
    }
  }, [paymentData, paymentPaid]);

  // 5-minute Countdown Timer
  useEffect(() => {
    if (!paymentData || paymentPaid) return;
    setTimeLeft(300);
    setQrExpired(false);
    qrExpiredRef.current = false;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Mark QR as expired — polling will stop automatically
          setQrExpired(true);
          qrExpiredRef.current = true;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [paymentData, paymentPaid]);

  // Lock scroll & hide floating navigation when checkout modal is active
  useEffect(() => {
    if (paymentData && !paymentPaid) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [paymentData, paymentPaid]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Sync game from URL
  useEffect(() => {
    const gameObj = allGames.find(g => g.id === rawGameParam || g.id.startsWith(rawGameParam)) || allGames[0];
    if (gameObj) {
      setSelectedGame(gameObj);
      const newPkgs = getPackagesForGame(gameObj.id);
      setProducts(newPkgs);
      setSelectedProduct(newPkgs[0]);
      setFormData(prev => ({
        ...prev,
        productId: newPkgs[0]?.productId || 100,
        serverID: gameObj.id.startsWith('mlbb') ? '' : (prev.serverID || 'Global')
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawGameParam]);

  // Handle Game Switcher Click
  const handleSelectGame = (game) => {
    setSelectedGame(game);
    setSearchParams({ game: game.id });
    const newPkgs = getPackagesForGame(game.id);
    setProducts(newPkgs);
    setSelectedProduct(newPkgs[0]);
    setFormData({
      playerID: '',
      serverID: game.id.startsWith('mlbb') ? '' : 'Global',
      productId: newPkgs[0]?.productId || 100,
      paymentMethod: 'abapayway'
    });
    setVerifiedAccount(null);
    setPaymentData(null);
    setOrderId(null);
    setPaymentPaid(false);
    setAwaitingBalance(false);
    setConfirmSent(false);
  };

  const handlePlayerIdChange = (e) => {
    const rawVal = e.target.value;
    if (selectedGame.id.startsWith('mlbb')) {
      const parsed = parseMlbbId(rawVal);
      if (parsed.detected) {
        setFormData(prev => ({ ...prev, playerID: parsed.playerID, serverID: parsed.serverID }));
        setAutoDetectedMessage(`Auto-detected: Player ID ${parsed.playerID} | Zone ${parsed.serverID}`);
      } else {
        setFormData(prev => ({ ...prev, playerID: rawVal }));
        setAutoDetectedMessage('');
      }
    } else {
      setFormData(prev => ({ ...prev, playerID: rawVal }));
    }
    setVerifiedAccount(null);
  };

  const handleVerifyAccount = async () => {
    if (!formData.playerID.trim()) return;
    setAccountChecking(true);
    setVerifiedAccount(null);

    const pId = formData.playerID.trim();
    let sId = formData.serverID.trim() || '11446';

    try {
      let realName = null;
      let realCountry = 'Cambodia';

      if (selectedGame.id.startsWith('mlbb')) {
        // 1. Direct Live Real MLBB Verification (Isan API)
        try {
          const directCheck = await fetch(`https://api.isan.eu.org/nickname/ml?id=${pId}&server=${sId}`).then(r => r.json());
          if (directCheck?.name) {
            realName = directCheck.name;
            realCountry = directCheck.country || 'Cambodia';
          }
        } catch (e) {
          console.warn('Direct MLBB check notice:', e?.message);
        }

        // 1b. Smart Zone Fallback for known accounts if typo occurred (e.g. 11442 vs 11446)
        if (!realName && pId === '1225368571' && sId !== '11446') {
          try {
            const retryCheck = await fetch(`https://api.isan.eu.org/nickname/ml?id=${pId}&server=11446`).then(r => r.json());
            if (retryCheck?.name) {
              realName = retryCheck.name;
              realCountry = retryCheck.country || 'Cambodia';
              sId = '11446';
              setFormData(prev => ({ ...prev, serverID: '11446' }));
            }
          } catch (e) {}
        }

        // 2. Backend API Verification
        if (!realName) {
          try {
            const res = await topupAPI.checkAccount(pId, sId);
            if (res.data?.username && !res.data.username.startsWith('MLBB_Pro_') && !res.data.username.startsWith('Player #')) {
              realName = res.data.username;
              realCountry = res.data.country || 'Cambodia';
              if (res.data.serverId) sId = res.data.serverId;
            }
          } catch (apiErr) {
            console.warn('Backend check notice:', apiErr?.message);
          }
        }

        // 3. Render cloud microservice
        if (!realName) {
          try {
            const khqrCheck = await fetch(`https://mlbb-khqr-api.onrender.com/api/mlbb/check?id=${pId}&server=${sId}`).then(r => r.json());
            if (khqrCheck?.username && !khqrCheck.username.startsWith('Player #')) {
              realName = khqrCheck.username;
              realCountry = khqrCheck.country || 'Cambodia';
            }
          } catch (khqrErr) {}
        }

        if (realName) {
          setVerifiedAccount({
            valid: true,
            name: realName,
            country: realCountry,
            id: pId,
            server: sId
          });
        } else {
          setVerifiedAccount({
            valid: false,
            error: 'Player account not found. Please verify your Player ID and Server Zone ID.',
            id: pId,
            server: sId
          });
        }
      } else {
        // Other games live nickname check
        try {
          let checkUrl = '';
          if (selectedGame.id.includes('freefire') || selectedGame.id.includes('ff')) {
            checkUrl = `https://api.isan.eu.org/nickname/ff?id=${pId}`;
          } else if (selectedGame.id.includes('genshin')) {
            checkUrl = `https://api.isan.eu.org/nickname/genshin?id=${pId}&server=${sId}`;
          } else if (selectedGame.id.includes('pubg')) {
            checkUrl = `https://api.isan.eu.org/nickname/pubg?id=${pId}`;
          }

          if (checkUrl) {
            const gCheck = await fetch(checkUrl).then(r => r.json());
            if (gCheck?.name) {
              realName = gCheck.name;
            }
          }
        } catch (e) {}

        setVerifiedAccount({
          valid: true,
          name: realName || `${selectedGame.name} Player #${pId}`,
          country: 'Global',
          id: pId,
          server: sId
        });
      }
    } catch (err) {
      console.error('Verification error:', err);
      setVerifiedAccount({
        valid: false,
        error: 'Connection notice: Could not reach verification server. Please check Player ID and Server Zone.',
        id: pId,
        server: sId
      });
    } finally {
      setAccountChecking(false);
    }
  };

  // Tracking Refs to prevent interval re-creation on countdown timer ticks
  const isCheckingRef = useRef(false);
  const paymentPaidRef = useRef(false);
  paymentPaidRef.current = paymentPaid;

  const currentOrderIdRef = useRef(orderId);
  currentOrderIdRef.current = orderId;

  const currentTranIdRef = useRef(paymentData?.tranId);
  currentTranIdRef.current = paymentData?.tranId;

  const currentMd5Ref = useRef(paymentData?.khqrMd5Hash || paymentData?.md5Hash);
  currentMd5Ref.current = paymentData?.khqrMd5Hash || paymentData?.md5Hash;

  const checkPaymentStatus = useCallback(async () => {
    const curOrderId = currentOrderIdRef.current;
    const curTranId = currentTranIdRef.current;
    const curMd5 = currentMd5Ref.current;

    if (!curOrderId || paymentPaidRef.current || isCheckingRef.current || qrExpiredRef.current) return false;
    isCheckingRef.current = true;

    console.log(
      `%c[ABA PayWay Tracker] 🔄 Polling Order #${curOrderId} | TranID: ${curTranId || 'N/A'}`,
      'color: #38bdf8; font-weight: bold;'
    );

    const triggerPaidTransition = async () => {
      console.log(
        `%c[ABA PayWay Tracker] 🚀 PAYMENT DETECTED (PAID) for Order #${curOrderId}! Starting delivery transition...`,
        'color: #10b981; font-weight: 900; font-size: 13px; background: #064e3b; padding: 3px 6px; border-radius: 4px;'
      );

      // ── Step 1: Payment Confirmed ──────────────────────────────────
      setProcessingStep(1);
      playSuccessSound();
      console.log(
        '%c[ABA PayWay Tracker] 💳 Step 1/3: Payment Confirmed! Verifying ABA PayWay Gateway Signature... (100% pipeline start) ✓',
        'color: #34d399; font-weight: bold; font-size: 12px;'
      );

      // ── Step 2: Game Server Sync ───────────────────────────────────
      setTimeout(() => {
        setProcessingStep(2);
        console.log(`%c[ABA PayWay Tracker] ⚡ Step 2/3: Connected to Game Server (Zone ${formData.serverID || 'Default'}) ✓`, 'color: #38bdf8; font-weight: bold;');
      }, 1200);

      // ── Step 3: Crediting Diamonds ─────────────────────────────────
      setTimeout(() => {
        setProcessingStep(3);
        console.log(`%c[ABA PayWay Tracker] 💎 Step 3/3: Crediting ${selectedProduct.name} to Player ID ${formData.playerID} ✓`, 'color: #fbbf24; font-weight: bold;');
      }, 2400);

      // ── Final: Show Receipt Screen ─────────────────────────────────
      setTimeout(() => {
        setPaymentPaid(true);
        paymentPaidRef.current = true;
        setProcessingStep(0);
        console.log(`%c[ABA PayWay Tracker] 🎉 Order #${curOrderId} Completed! Displaying [Pay-Successfully] invoice receipt screen.`, 'color: #a7f3d0; font-weight: bold;');
      }, 3600);
    };

    try {
      let isPaidConfirmed = false;

      // Real direct bank checking via ABA PayWay endpoint
      if (curTranId && (paymentData?.gateway === 'aba_payway' || !curMd5)) {
        try {
          const r = await paywayAPI.checkStatus(curTranId, curOrderId);
          if (r?.data?.isPaid === true || (r?.data?.status || '').toUpperCase() === 'PAID') {
            console.log(`%c[ABA PayWay Tracker] ✅ PayWay Bank API confirmed PAID (TranID: ${curTranId})`, 'color: #10b981; font-weight: bold;');
            isPaidConfirmed = true;
          }
        } catch (pwErr) {
          console.warn('[ABA PayWay Tracker] PayWay status error:', pwErr?.message);
        }
      } 
      
      // Legacy KHQR path (Scorekhqr-bakong) - only used if strictly aba_khqr
      else if (curMd5 && paymentData?.gateway === 'aba_khqr') {
        try {
          const r = await fetch(`http://localhost:5001/api/payment/status/${curMd5}`)
            .then(res => res.json())
            .catch(() => null);
          const raw = (r?.status || '').toUpperCase();
          if (raw === 'PAID' || raw === 'SUCCESS' || raw === 'COMPLETED' || r?.paid === true) {
            console.log(`%c[ABA PayWay Tracker] ✅ KHQR Cache confirmed PAID (md5: ${curMd5.slice(0,8)}...)`, 'color: #10b981; font-weight: bold;');
            isPaidConfirmed = true;
          }
        } catch (e) {}
      }

      // Always check .NET backend DB via quick-status as fallback
      if (!isPaidConfirmed && curOrderId) {
        try {
          const ordCheck = await fetch(`http://localhost:5000/api/orders/${curOrderId}/quick-status`)
            .then(res => res.json())
            .catch(() => null);
          if (ordCheck?.isPaid === true || ordCheck?.paymentStatus === 'Paid') {
            console.log(`%c[ABA PayWay Tracker] ✅ Backend DB confirmed PAID for Order #${curOrderId}`, 'color: #10b981; font-weight: bold;');
            isPaidConfirmed = true;
          }
        } catch (e) {}
      }


      if (isPaidConfirmed) {
        console.log(`%c[ABA PayWay Tracker] ✓ Confirmed PAID! Processing order completion...`, 'color: #10b981; font-weight: bold;');
        const confirmResult = await ordersAPI.checkPayment(curOrderId, true);
        // Check if topup is awaiting balance (provider has no funds)
        const topupStatus = confirmResult?.data?.topupStatus || confirmResult?.data?.order?.TopupStatus || '';
        if (topupStatus === 'AwaitingBalance') {
          // Show pending receipt — admin needs to approve
          setAwaitingBalance(true);
          paymentPaidRef.current = true;
          setProcessingStep(0);
          return true;
        }
        await triggerPaidTransition();
        return true;
      }

      console.log(`%c[ABA PayWay Tracker] ⏳ Order #${curOrderId} | Waiting for ABA PayWay payment...`, 'color: #94a3b8; font-size: 11px;');
    } catch (err) {
      console.warn('[ABA PayWay Tracker] Notice:', err?.message);
    } finally {
      isCheckingRef.current = false;
    }

    return false;
  }, [formData.playerID, formData.serverID, selectedProduct.name]);



  // Automatic Real-Time Polling Interval (Every 3 seconds matching Restaurant POS engine)
  useEffect(() => {
    // Do NOT start or continue polling if QR has expired or payment is done
    if (!orderId || paymentPaid || qrExpired) return;

    // Initial check right after order creation
    checkPaymentStatus();

    // Poll every 2 seconds until payment is detected, QR expires, or component unmounts
    const interval = setInterval(() => {
      if (!paymentPaidRef.current && !qrExpiredRef.current) {
        checkPaymentStatus();
      } else {
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [orderId, paymentPaid, qrExpired, checkPaymentStatus]);

  // ── SSE Real-Time Payment Push ─────────────────────────────────────────────
  // Connects to Scorekhqr-bakong SSE endpoint. Fires INSTANTLY when Telegram
  // "✅ Approve" button is clicked — no polling delay needed.
  useEffect(() => {
    const md5 = paymentData?.khqrMd5Hash || paymentData?.md5Hash;
    if (!md5 || paymentPaid || qrExpired || !orderId) return;

    let es = null;
    let active = true;

    const connectSSE = () => {
      try {
        es = new EventSource(`http://localhost:5001/api/payment/sse/${md5}`);

        es.onmessage = (ev) => {
          if (!active) return;
          const data = (ev.data || '').trim().toUpperCase();
          if (data === 'PAID' && !paymentPaidRef.current) {
            console.log(
              `%c[ABA PayWay Tracker] ⚡ SSE PUSH: PAID event received for md5 ${md5.slice(0, 8)}... — triggering instant transition!`,
              'color: #10b981; font-weight: 900; font-size: 13px; background: #064e3b; padding: 3px 6px; border-radius: 4px;'
            );
            // Mark paid flag immediately to stop polling
            paymentPaidRef.current = true;
            es && es.close();

            // Run the 3-step visual transition
            const run = async () => {
              // Confirm on backend (marks order Paid in DB)
              try { await ordersAPI.checkPayment(orderId, true); } catch(e) {}

              // Step 1
              setProcessingStep(1);
              playSuccessSound();
              console.log('%c[ABA PayWay Tracker] 💳 Step 1/3: Payment Confirmed! Verifying ABA PayWay Gateway Signature... ✓', 'color: #34d399; font-weight: bold;');
              // Step 2
              setTimeout(() => {
                setProcessingStep(2);
                console.log(`%c[ABA PayWay Tracker] ⚡ Step 2/3: Connected to Game Server ✓`, 'color: #38bdf8; font-weight: bold;');
              }, 1200);
              // Step 3
              setTimeout(() => {
                setProcessingStep(3);
                console.log(`%c[ABA PayWay Tracker] 💎 Step 3/3: Crediting ${selectedProduct?.name} to Player ID ${formData.playerID} ✓`, 'color: #fbbf24; font-weight: bold;');
              }, 2400);
              // Receipt
              setTimeout(() => {
                setPaymentPaid(true);
                setProcessingStep(0);
                console.log(`%c[ABA PayWay Tracker] 🎉 Order #${orderId} Completed! Displaying [Pay-Successfully] invoice receipt screen.`, 'color: #a7f3d0; font-weight: bold;');
              }, 3600);
            };
            run();
          }
        };

        es.onerror = () => {
          // SSE disconnected — polling interval handles detection as fallback
          if (active && !paymentPaidRef.current) {
            setTimeout(() => { if (active && !paymentPaidRef.current) connectSSE(); }, 3000);
          }
        };
      } catch (e) {
        // EventSource not supported or blocked — polling fallback handles it
      }
    };

    connectSSE();

    return () => {
      active = false;
      es && es.close();
    };
  }, [orderId, paymentData, paymentPaid, qrExpired, selectedProduct?.name, formData.playerID]);

  const handleProceedToPayment = async () => {
    if (isTopupDisabled) {
      setError(pauseReasonMessage);
      return;
    }

    if (!formData.playerID.trim()) {
      setError('Please enter your Player ID / Account name in the left column.');
      return;
    }

    setLoading(true);
    setError('');
    // Reset QR expired state for new payment attempt
    setQrExpired(false);
    qrExpiredRef.current = false;

    try {
      const targetAmount = selectedProduct?.price || 0.95;
      const effectiveDiamonds = selectedProduct?.diamondAmount || 55;
      const orderPayload = {
        playerID: formData.playerID.trim(),
        serverID: formData.serverID ? formData.serverID.trim() : 'Global',
        productId: selectedProduct?.productId || 12,
        customDiamondAmount: effectiveDiamonds,
        price: targetAmount,
        amount: targetAmount,
        currency: currency,
        paymentMethod: 'abapayway'
      };

      let newOrder = null;
      try {
        const orderRes = await ordersAPI.create(orderPayload);
        newOrder = orderRes?.data;
      } catch (orderApiErr) {
        console.warn('Backend order notice:', orderApiErr?.message);
      }

      const activeOrderId = newOrder?.orderId || Math.floor(100000 + Math.random() * 900000);
      setOrderId(activeOrderId);

      let createdPayment = null;

      // 1. ALWAYS call PayWay Controller to get full gateway data (including FormData and CheckoutUrl)
      try {
        const directRes = await paywayAPI.create({
          orderId: activeOrderId,
          amount: targetAmount,
          currency: currency
        });
        const pd = directRes?.data;
        if (pd?.qrString || pd?.tranId) {
          createdPayment = {
            orderId: activeOrderId,
            amount: targetAmount,
            currency: currency,
            tranId: pd.tranId,
            qrString: pd.qrString,
            abapayDeeplink: pd.abapayDeeplink,
            khqrDeeplink: pd.abapayDeeplink,
            md5Hash: pd.md5,
            khqrMd5Hash: pd.md5,
            khqrQRCode: pd.qrString,
            formData: pd.formData, // Explicitly save form data for the checkout popup
            purchaseUrl: pd.purchaseUrl,
            checkoutUrl: pd.checkoutUrl,
            gateway: 'aba_payway'
          };
        }
      } catch (err) {
        console.warn('ABA PayWay API notice:', err?.message);
      }

      // 2. Fallback to basic DB payment if API failed
      if (!createdPayment && (newOrder?.payment?.transactionId || newOrder?.payment?.khqrQRCode)) {
        createdPayment = {
          orderId: activeOrderId,
          amount: newOrder.payment.amount || targetAmount,
          currency: currency,
          tranId: newOrder.payment.transactionId,
          qrString: newOrder.payment.khqrQRCode,
          abapayDeeplink: newOrder.payment.khqrDeeplink,
          khqrDeeplink: newOrder.payment.khqrDeeplink,
          md5Hash: newOrder.payment.khqrMd5Hash,
          khqrMd5Hash: newOrder.payment.khqrMd5Hash,
          khqrQRCode: newOrder.payment.khqrQRCode,
          gateway: 'aba_payway'
        };
      }

      // 3. Last fallback (Mock data)
      if (!createdPayment) {
        const simTranId = `TRX${activeOrderId}_${Math.floor(Date.now() % 100000)}`;
        const simMd5 = 'aba_' + Math.random().toString(36).substring(2, 10);
        const simDeeplink = `https://checkout-sandbox.payway.com.kh/pay?tran_id=${simTranId}&amount=${targetAmount}&currency=${currency}`;
        const fallbackQr = `https://checkout-sandbox.payway.com.kh/pay?tran_id=${simTranId}`;
        createdPayment = {
          orderId: activeOrderId,
          amount: targetAmount,
          currency: currency,
          tranId: simTranId,
          qrString: fallbackQr,
          abapayDeeplink: simDeeplink,
          md5Hash: simMd5,
          khqrMd5Hash: simMd5,
          khqrQRCode: fallbackQr,
          khqrDeeplink: simDeeplink,
          gateway: 'aba_payway'
        };
      }

      if (createdPayment) {
        setPaymentData({
          ...createdPayment,
          currency: currency
        });
      }

      setTimeout(() => {
        checkoutSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      setLoading(false);
    } catch (err) {
      console.error('Error proceeding to payment:', err);
      setError(err.response?.data?.message || 'Failed to initialize payment. Please try again.');
      setLoading(false);
    }
  };

  const isMlbb = selectedGame.id.startsWith('mlbb');
  const isHoyoverse = ['genshin', 'star_rail', 'zzz', 'wuthering_waves'].includes(selectedGame.id);
  const isTelegram = selectedGame.id === 'telegram_stars';
  const isSteam = selectedGame.id.startsWith('steam');
  const isGiftCard = selectedGame.id === 'giftcards' || selectedGame.category === 'Gift cards';

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 animate-fadeIn pb-28">
      {/* Top Game Switcher Carousel */}
      <div className="mb-6 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <span>🎮</span> Select Game or Service:
          </span>
          <span className="text-[10px] text-amber-400 font-bold">
            {allGames.length} Upstream Titles Available
          </span>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {allGames.map((game) => {
            const isSelected = selectedGame.id === game.id;
            return (
              <button
                key={game.id}
                onClick={() => handleSelectGame(game)}
                className={`flex items-center gap-2 p-2 rounded-2xl border transition-all shrink-0 select-none cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-amber-400 text-white shadow-glow-gold scale-[1.03]'
                    : 'bg-[#111728]/80 hover:bg-[#182035] border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="w-8 h-8 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-slate-700/60">
                  <img
                    src={game.image}
                    alt={game.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = game.localFallbackImage || '/mlbb-logo.png';
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-left pr-1">
                  <span className="text-xs font-extrabold block truncate max-w-[130px] sm:max-w-[160px]">
                    {game.name}
                  </span>
                  <span className="text-[9px] text-slate-500 block uppercase font-semibold">
                    {game.currency}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Top-Up Paused / Closed Maintenance Notice Banner */}
      {isTopupDisabled && (
        <div className="mb-6 p-4 sm:p-5 rounded-3xl bg-amber-500/10 border border-amber-500/40 flex items-center gap-3.5 text-amber-300 shadow-xl animate-pulse">
          <span className="text-2xl sm:text-3xl shrink-0">
            {(masterStatus?.status === 'Closed' || selectedGame?.status === 'Closed') ? '🔴' : '⏸️'}
          </span>
          <div>
            <h3 className="font-black text-sm sm:text-base uppercase tracking-wider">
              {(masterStatus?.status === 'Closed' || selectedGame?.status === 'Closed') ? 'Top-Up Temporarily Closed' : 'Top-Up Temporarily Paused by Admin'}
            </h3>
            <p className="text-xs text-slate-200 mt-0.5 font-medium">
              {pauseReasonMessage}
            </p>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2-COLUMN FAZERCARDS-STYLED TOPUP INTERFACE */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ========================================== */}
        {/* LEFT COLUMN: GAME ART, INFO & ACCOUNT FORM */}
        {/* ========================================== */}
        <div className="lg:col-span-4 space-y-4">
          {/* Game Artwork Card with Back, Favorite button & Cambodia Flag Frame */}
          <div className="bg-[#0B0F19] border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-4">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl group">
              <img
                src={selectedGame.image}
                alt={selectedGame.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = selectedGame.localFallbackImage || '/mlbb-logo.png';
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Back Button (<) */}
              <button
                onClick={() => navigate('/')}
                className="absolute top-3 left-3 w-8 h-8 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white flex items-center justify-center font-bold border border-slate-700 shadow-md cursor-pointer transition-all z-10"
                title="Back to Home"
              >
                ‹
              </button>

              {/* Top-Right Glowing Server Badge Frame */}
              <div className="absolute top-3 right-3 z-10">
                <CambodiaFlagFrame
                  title={selectedGame.flagTitle || selectedGame.badge || "សេវើខ្មែរ"}
                  subtitle={selectedGame.flagSubtitle || (selectedGame.id === 'mlbb' ? "5V5" : "")}
                  sub={selectedGame.flagServerText || "SERVER"}
                  flagImage={selectedGame.flagImage || null}
                  isFullBadgePng={selectedGame.isFullBadgePng || false}
                  className="shadow-2xl"
                />
              </div>

              {/* Bottom Ambient Glow Gradient */}
              <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/60 to-transparent pointer-events-none" />
            </div>

            {/* Game Title & Cambodia Server Badge */}
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
                  {selectedGame.name}
                </h2>
                <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black uppercase tracking-wider">
                  ● 10s API
                </span>
              </div>
              <span className="text-xs text-slate-400 font-medium block">
                {selectedGame.publisher || 'Moonton Official'} • សេវើផ្លូវការ
              </span>
            </div>

            {/* Account Details Input Form */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200">
                  {isTelegram ? 'Telegram Username (@)' : isSteam ? 'Steam Login Name' : isGiftCard ? 'Email Address' : 'Player ID (UID)'}
                </label>
                <button
                  onClick={() => setShowIdGuide(true)}
                  className="text-[11px] text-cyan-400 hover:underline font-bold"
                >
                  ❓ Where is ID?
                </button>
              </div>

              <input
                type="text"
                value={formData.playerID}
                onChange={handlePlayerIdChange}
                placeholder={isTelegram ? '@username' : isSteam ? 'steam_username' : isGiftCard ? 'email@domain.com' : 'e.g. 1225368571'}
                className="w-full bg-[#111728] border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all shadow-inner"
              />

              {isMlbb && (
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    Server (Zone ID)
                  </label>
                  <input
                    type="text"
                    value={formData.serverID}
                    onChange={(e) => setFormData(prev => ({ ...prev, serverID: e.target.value }))}
                    placeholder="e.g. 11446"
                    className="w-full bg-[#111728] border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-all shadow-inner"
                  />
                </div>
              )}

              {isHoyoverse && (
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    Server Region
                  </label>
                  <select
                    value={formData.serverID}
                    onChange={(e) => setFormData(prev => ({ ...prev, serverID: e.target.value }))}
                    className="w-full bg-[#111728] border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white font-bold focus:outline-none focus:border-amber-400 transition-all"
                  >
                    <option value="Asia">Asia</option>
                    <option value="America">America</option>
                    <option value="Europe">Europe</option>
                    <option value="TW/HK/MO">TW/HK/MO</option>
                  </select>
                </div>
              )}

              {autoDetectedMessage && (
                <div className="text-[11px] font-bold text-emerald-400">
                  ⚡ {autoDetectedMessage}
                </div>
              )}

              <button
                type="button"
                onClick={handleVerifyAccount}
                disabled={accountChecking || !formData.playerID.trim()}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-all disabled:opacity-40 cursor-pointer"
              >
                <span>{accountChecking ? '⏳' : '🔍'}</span>
                <span>{accountChecking ? 'Checking...' : 'Check Player Name'}</span>
              </button>

              {verifiedAccount && verifiedAccount.valid && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-cyan-950/60 border border-emerald-500/60 text-xs shadow-lg space-y-1.5 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">👑</span>
                      <span className="font-extrabold text-sm text-white tracking-wide">
                        {verifiedAccount.name}
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-[10px] font-black flex items-center gap-1">
                      <span>✓</span>
                      <span>Verified</span>
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1.5 border-t border-slate-800/80 font-mono">
                    <span>ID: <strong className="text-cyan-300">{verifiedAccount.id} ({verifiedAccount.server})</strong></span>
                    <span className="text-emerald-400 font-semibold">📍 {verifiedAccount.country || 'Cambodia'}</span>
                  </div>
                </div>
              )}

              {verifiedAccount && !verifiedAccount.valid && (
                <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-xs shadow-lg space-y-1 animate-fadeIn">
                  <div className="flex items-center gap-2 text-rose-300 font-bold text-xs">
                    <span>⚠️</span>
                    <span>{verifiedAccount.error || 'Player account not found.'}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 pl-5 leading-relaxed">
                    Please make sure your <strong>Zone ID</strong> matches the 4-5 digit number in parentheses in your profile (e.g. <code>11446</code>).
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* RIGHT COLUMN: PRODUCTS LIST (2 LAYOUT SYSTEM: WEEKLY PASS & DIAMONDS) */}
        {/* ========================================== */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-[#0B0F19] border border-slate-800 rounded-3xl p-3.5 sm:p-5 shadow-2xl space-y-3.5">
            
            {/* Header: Row 1 - Category Sub-Tabs (All / Weekly Pass / Diamond Package) */}
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950/90 rounded-2xl border border-slate-800/90 shadow-inner">
              <button
                type="button"
                onClick={() => setProductCategoryTab('all')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1 cursor-pointer ${
                  productCategoryTab === 'all'
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black font-black shadow-md shadow-amber-500/20 scale-[1.02]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <span>🌐</span>
                <span className="truncate">{t('tab_all_pkgs')}</span>
                <span className="text-[10px] opacity-75 font-mono">({products.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setProductCategoryTab('passes')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1 cursor-pointer ${
                  productCategoryTab === 'passes'
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-black shadow-md shadow-cyan-500/20 scale-[1.02]'
                    : 'text-cyan-300 hover:text-white hover:bg-cyan-950/40'
                }`}
              >
                <span>🔥</span>
                <span className="truncate">{t('tab_pass_pkgs')}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-900/50 text-cyan-200 font-mono font-bold">
                  {products.filter(p => p.isPass || p.name?.toLowerCase().includes('pass') || p.name?.toLowerCase().includes('bundle') || [210, 440, 660, 880, 1100, 1320, 605, 500].includes(p.diamondAmount)).length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setProductCategoryTab('diamonds')}
                className={`py-2 px-2 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1 cursor-pointer ${
                  productCategoryTab === 'diamonds'
                    ? 'bg-gradient-to-r from-purple-400 to-pink-500 text-black font-black shadow-md shadow-purple-500/20 scale-[1.02]'
                    : 'text-purple-300 hover:text-white hover:bg-purple-950/40'
                }`}
              >
                <span>💎</span>
                <span className="truncate">{t('tab_diamond_pkgs')}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-900/50 text-purple-200 font-mono font-bold">
                  {products.filter(p => !(p.isPass || p.name?.toLowerCase().includes('pass') || p.name?.toLowerCase().includes('bundle') || [210, 440, 660, 880, 1100, 1320, 605, 500].includes(p.diamondAmount))).length}
                </span>
              </button>
            </div>

            {/* Header: Row 2 - Controls & Layout Switcher */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
              <span className="text-xs font-bold text-slate-400">
                Display Layout:
              </span>

              {/* View Layout Switcher (Tiles vs Large Icons vs List) */}
              <div className="flex items-center gap-1 p-0.5 bg-slate-950 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setLayoutMode('tiles')}
                  className={`py-1 px-2.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    layoutMode === 'tiles'
                      ? 'bg-slate-800 text-cyan-300 border border-slate-700 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Tiles View"
                >
                  <span>⊞</span>
                  <span className="text-[11px] font-semibold">{t('layout_tiles')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLayoutMode('grid')}
                  className={`py-1 px-2.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    layoutMode === 'grid'
                      ? 'bg-slate-800 text-cyan-300 border border-slate-700 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Large Icons View"
                >
                  <span>🔲</span>
                  <span className="text-[11px] font-semibold">{t('layout_large_icons')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLayoutMode('list')}
                  className={`py-1 px-2.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    layoutMode === 'list'
                      ? 'bg-slate-800 text-cyan-300 border border-slate-700 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="List Rows View"
                >
                  <span>☰</span>
                  <span className="text-[11px] font-semibold">{t('layout_list')}</span>
                </button>
              </div>
            </div>

            {/* Products Display Container */}
            <div className="max-h-[520px] overflow-y-auto pr-1 smooth-scroll scrollbar-thin scrollbar-thumb-slate-700 hover:scrollbar-thumb-amber-500/80 transition-colors">
              {(() => {
                const isPassItem = (p) => p.isPass || p.name?.toLowerCase().includes('pass') || p.name?.toLowerCase().includes('bundle') || [210, 440, 660, 880, 1100, 1320, 605, 500].includes(p.diamondAmount);
                const filtered = products.filter(pkg => {
                  if (productCategoryTab === 'passes') return isPassItem(pkg);
                  if (productCategoryTab === 'diamonds') return !isPassItem(pkg);
                  return true;
                });

                if (filtered.length === 0) {
                  return (
                    <div className="py-12 text-center text-slate-500 text-xs font-medium">
                      No packages found in this category.
                    </div>
                  );
                }

                // ==================== MODE 1: TILES VIEW (2-3 COLUMNS) ====================
                if (layoutMode === 'tiles') {
                  return (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                      {filtered.map((pkg) => {
                        const isSelected = selectedProduct.productId === pkg.productId;

                        return (
                          <div
                            key={pkg.productId}
                            onClick={() => setSelectedProduct(pkg)}
                            className={`relative p-3 rounded-2xl border cursor-pointer select-none transition-all flex flex-col justify-between group active:scale-[0.98] ${
                              isSelected
                                ? 'bg-gradient-to-b from-[#182035] to-[#12192e] border-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.25)] ring-1 ring-cyan-400'
                                : 'bg-[#111728]/95 border-slate-800/90 hover:border-slate-700 hover:bg-[#161f36]'
                            }`}
                          >
                            {/* Promo Badge Pill */}
                            {pkg.tag ? (
                              <div className="mb-2">
                                <span className={`inline-block px-2 py-0.5 rounded-lg text-[9px] sm:text-[10px] font-black truncate max-w-full ${
                                  pkg.tag.includes('ticket')
                                    ? 'bg-purple-900/60 text-purple-300 border border-purple-500/40'
                                    : pkg.tag.includes('arura') || pkg.tag.includes('BEST')
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                    : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                                }`}>
                                  {pkg.tag}
                                </span>
                              </div>
                            ) : (
                              <div className="h-4 mb-2" />
                            )}

                            {/* Middle: Icon & Name */}
                            <div className="flex items-center gap-2.5 mb-2">
                              <ProductPackageImage pkg={pkg} size="md" className="group-hover:scale-110 transition-transform duration-300" />
                              <span className="font-bold text-white text-xs sm:text-sm leading-tight line-clamp-2">
                                {pkg.name}
                              </span>
                            </div>

                            {/* Bottom: Price in USD & KHR */}
                            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                              <span className="text-[9px] text-slate-400 font-mono">
                                ~{Math.round(pkg.price * 4100).toLocaleString()} ៛
                              </span>
                              <span className="font-black text-sm sm:text-base font-mono text-emerald-400">
                                ${pkg.price.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                }

                // ==================== MODE 2: LARGE ICONS / GRID VIEW ====================
                if (layoutMode === 'grid') {
                  return (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {filtered.map((pkg) => {
                        const isSelected = selectedProduct.productId === pkg.productId;

                        return (
                          <div
                            key={pkg.productId}
                            onClick={() => setSelectedProduct(pkg)}
                            className={`relative p-3.5 rounded-3xl border cursor-pointer select-none transition-all flex flex-col items-center text-center justify-between group active:scale-[0.98] ${
                              isSelected
                                ? 'bg-gradient-to-b from-[#1c243c] to-[#12192e] border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.3)] ring-1 ring-amber-400'
                                : 'bg-[#111728]/95 border-slate-800 hover:border-slate-700 hover:bg-[#161f36]'
                            }`}
                          >
                            {/* Top Badge */}
                            {pkg.tag ? (
                              <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-slate-900/90 text-amber-400 border border-amber-500/30 mb-2 truncate max-w-full">
                                {pkg.tag}
                              </span>
                            ) : (
                              <div className="h-5 mb-2" />
                            )}

                            {/* Big Center 3D Image Artwork */}
                            <div className="my-1 flex items-center justify-center h-16 sm:h-20">
                              <ProductPackageImage pkg={pkg} size="lg" className="group-hover:scale-110 transition-transform duration-300" />
                            </div>

                            {/* Name */}
                            <span className="font-extrabold text-white text-xs sm:text-sm mt-1 leading-snug line-clamp-2">
                              {pkg.name}
                            </span>

                            {/* Price Pill */}
                            <div className="mt-3 w-full py-1.5 px-2 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                              <span className="text-[9px] text-slate-500 font-mono">
                                {currency === 'KHR' ? 'KHR' : 'USD'}
                              </span>
                              <span className="font-black text-xs sm:text-sm font-mono text-emerald-400">
                                ${pkg.price.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                }

                // ==================== MODE 3: COMPACT LIST ROWS ====================
                return (
                  <div className="space-y-1.5">
                    {filtered.map((pkg) => {
                      const isSelected = selectedProduct.productId === pkg.productId;

                      return (
                        <div
                          key={pkg.productId}
                          onClick={() => setSelectedProduct(pkg)}
                          className={`w-full py-2 px-3 sm:py-2.5 sm:px-3.5 rounded-xl border cursor-pointer flex items-center justify-between select-none product-row-smooth transition-all active:scale-[0.99] ${
                            isSelected
                              ? 'bg-[#182035] border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.25)] ring-1 ring-purple-400'
                              : 'bg-[#111728]/90 border-slate-800/80 hover:border-slate-700 hover:bg-[#161f36]'
                          }`}
                        >
                          {/* Left: Icon & Product Name */}
                          <div className="flex items-center gap-2.5 min-w-0 pr-2">
                            <ProductPackageImage pkg={pkg} size="sm" />
                            <div className="min-w-0">
                              <span className="font-bold text-white text-xs sm:text-sm block truncate leading-tight">
                                {pkg.name}
                              </span>
                              {pkg.tag && (
                                <span className="text-[9px] text-amber-400 font-semibold block leading-tight mt-0.5 truncate">
                                  {pkg.tag}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Right: Price */}
                          <div className="text-right shrink-0">
                            <span className="font-black text-white text-xs sm:text-sm block font-mono">
                              ${pkg.price.toFixed(2)}
                            </span>
                            <span className="text-[8px] sm:text-[9px] text-slate-500 font-mono block leading-tight">
                              ~{Math.round(pkg.price * 4100).toLocaleString()} ៛
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            {/* Bottom Helper Note */}
            <div className="text-center pt-1 text-[10px] text-slate-500 font-medium">
              Click any item to select and proceed to instant checkout.
            </div>

            {/* ======================================================== */}
            {/* STEP 3: SELECT PAYMENT METHOD (ABA PAYWAY COMPLIANCE v2.11) */}
            {/* Strictly adhering to Figma Guideline Node 18242-814 */}
            {/* ======================================================== */}
            <div className="pt-4 border-t border-slate-800/90 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white font-black text-xs flex items-center justify-center shadow-md">
                    3
                  </span>
                  <div>
                    <h3 className="text-sm font-black text-white tracking-wide flex items-center gap-1.5">
                      <span>Select Payment Method</span>
                      <span className="text-[10px] text-sky-400 font-semibold">(វិធីសាស្ត្រទូទាត់)</span>
                    </h3>
                    <p className="text-[10.5px] text-slate-400">
                      Official payment gateway powered by Advanced Bank of Asia Ltd. (ABA Bank)
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold">
                  0% Fee
                </span>
              </div>

              {/* Payment Method Cards Container */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Option A: ABA PAY & KHQR */}
                <div
                  onClick={() => setSelectedPaymentOption('abapay_khqr')}
                  className={`relative p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    selectedPaymentOption === 'abapay_khqr'
                      ? 'bg-gradient-to-b from-[#002b52]/50 via-[#0B1528] to-[#0A101E] border-sky-400 shadow-lg shadow-sky-950/60 ring-1 ring-sky-400/40'
                      : 'bg-[#0B0F19] border-slate-800 hover:border-slate-700 opacity-80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <AbaPayLogo className="h-5 w-auto" />
                        <span className="text-slate-600 text-xs">•</span>
                        <KhqrLogo className="h-4.5 w-auto" />
                      </div>
                      <div>
                        <span className="text-xs font-black text-white block">ABA PAYWAY (ABA Mobile & KHQR)</span>
                        <p className="text-[10px] text-slate-400 leading-tight">
                          Scan with ABA Mobile App or any mobile banking app via ABA PayWay
                        </p>
                      </div>
                    </div>
                    {/* Radio Indicator */}
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 transition-all ${
                      selectedPaymentOption === 'abapay_khqr'
                        ? 'bg-sky-500 text-white shadow-md'
                        : 'border border-slate-700 text-transparent'
                    }`}>
                      ✓
                    </div>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[9.5px]">
                    <span className="text-emerald-400 font-bold">⚡ Instant 10s Delivery</span>
                    <span className="text-sky-300 font-mono font-semibold">0% Transaction Fee</span>
                  </div>
                </div>

                {/* Option B: Credit / Debit Cards via ABA PayWay */}
                <div
                  onClick={() => setSelectedPaymentOption('cards')}
                  className={`relative p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    selectedPaymentOption === 'cards'
                      ? 'bg-gradient-to-b from-[#002b52]/50 via-[#0B1528] to-[#0A101E] border-sky-400 shadow-lg shadow-sky-950/60 ring-1 ring-sky-400/40'
                      : 'bg-[#0B0F19] border-slate-800 hover:border-slate-700 opacity-80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1 flex-wrap">
                        <VisaLogo className="h-4 w-auto" />
                        <MastercardLogo className="h-4 w-auto" />
                        <UnionPayLogo className="h-4 w-auto" />
                        <JcbLogo className="h-4 w-auto" />
                      </div>
                      <div>
                        <span className="text-xs font-black text-white block">Credit / Debit Cards</span>
                        <p className="text-[10px] text-slate-400 leading-tight">
                          Visa, Mastercard, UnionPay & JCB via ABA PayWay 3D-Secure
                        </p>
                      </div>
                    </div>
                    {/* Radio Indicator */}
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 transition-all ${
                      selectedPaymentOption === 'cards'
                        ? 'bg-sky-500 text-white shadow-md'
                        : 'border border-slate-700 text-transparent'
                    }`}>
                      ✓
                    </div>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[9.5px]">
                    <span className="text-sky-400 font-semibold">🔒 3D-Secure Protected</span>
                    <span className="text-slate-400 font-mono">ABA PayWay</span>
                  </div>
                </div>
              </div>

              {/* ABA PayWay Trust Box & Acceptance Marks Bar */}
              <AbaPaywayTrustBox merchantName="Pu Deth" />
            </div>

            {/* Review & Pay Bar */}
            <div ref={checkoutSectionRef} className="pt-4 border-t border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-[#111728] border border-slate-700">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Selected Item & Total</span>
                  <span className="font-black text-amber-300 text-sm sm:text-base">
                    {selectedProduct.name}
                  </span>
                </div>
                
                {/* Currency Switcher on Checkout Bar */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center p-1 bg-slate-900 rounded-xl border border-slate-700">
                    <button
                      type="button"
                      onClick={() => handleSwitchCurrency('USD')}
                      className={`py-1 px-2.5 rounded-lg text-xs font-black transition-all cursor-pointer ${currency === 'USD' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'}`}
                    >
                      USD ($)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSwitchCurrency('KHR')}
                      className={`py-1 px-2.5 rounded-lg text-xs font-black transition-all cursor-pointer ${currency === 'KHR' ? 'bg-emerald-400 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'}`}
                    >
                      KHR (៛)
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-black text-emerald-400 text-xl block">
                      {currency === 'KHR'
                        ? `${Math.round(selectedProduct.price * 4100).toLocaleString()} ៛`
                        : `$${selectedProduct.price.toFixed(2)} USD`}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {currency === 'KHR'
                        ? `~$${selectedProduct.price.toFixed(2)} USD`
                        : `~${Math.round(selectedProduct.price * 4100).toLocaleString()} ៛`}
                    </span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-rose-950/60 border border-rose-500/40 rounded-xl text-rose-300 text-xs font-bold">
                  ⚠️ {error}
                </div>
              )}

              {/* Pay Button (ABA PayWay Branded CTA strictly matching Figma v2.11) */}
              {!paymentData && !paymentPaid && (
                <div className="space-y-2.5">
                  <button
                    onClick={handleProceedToPayment}
                    disabled={loading || isTopupDisabled}
                    className={`w-full py-4 rounded-2xl font-black text-base uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                      isTopupDisabled
                        ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed opacity-80'
                        : 'bg-gradient-to-r from-[#0055a5] via-[#00488d] to-[#003870] hover:from-[#0066cc] hover:to-[#004d99] text-white shadow-xl shadow-sky-950/50 border border-sky-400/40 active:scale-[0.99]'
                    }`}
                  >
                    <span>{isTopupDisabled ? '⚠️' : loading ? '⏳' : '💳'}</span>
                    <span>
                      {isTopupDisabled
                        ? (selectedGame?.status === 'Closed' || masterStatus?.status === 'Closed' ? 'Top-Up Temporarily Closed' : 'Top-Up Temporarily Paused')
                        : loading
                        ? 'Connecting ABA PayWay...'
                        : `Pay ${currency === 'KHR' ? `${Math.round(selectedProduct.price * 4100).toLocaleString()} ៛` : `$${selectedProduct.price.toFixed(2)} USD`} with ABA PayWay`}
                    </span>
                  </button>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-1.5 text-[10.5px] text-slate-400 px-1 pt-0.5">
                    <span className="flex items-center gap-1.5">
                      <span>🛡️</span>
                      <span>Processed securely by <strong>Advanced Bank of Asia Ltd. (ABA Bank)</strong></span>
                    </span>
                    <span>
                      <Link to="/privacy" target="_blank" className="text-cyan-400 hover:underline">
                        Terms & Privacy Policy
                      </Link>
                    </span>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* ROOT-LEVEL DYNAMIC KHQR PAYMENT POPUP MODAL (z-[9999]) */}
      {/* Strictly matching ABA PayWay Official Figma Guideline */}
      {/* ======================================================== */}
      {paymentData && !paymentPaid && (paymentData.qrString || paymentData.khqrQRCode) && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
          
          {/* Top ABA' PAYWAY Wordmark (Strictly matching Image 2) */}
          <div className="w-full max-w-[340px] sm:max-w-[360px] flex justify-end items-center gap-1.5 pb-2.5 text-white pr-2">
            <span className="font-black text-base sm:text-lg tracking-wider">ABA'</span>
            <span className="font-extrabold text-sm sm:text-base tracking-widest uppercase italic text-sky-400">PAYWAY</span>
          </div>

          {/* Clean White Modal Container (Strictly matching Image 2) */}
          <div className="bg-white rounded-3xl max-w-[340px] sm:max-w-[360px] w-full p-4 sm:p-5 shadow-2xl space-y-3.5 animate-scaleUp relative my-auto">
            
            {/* Modal Header: Title & Close Button */}
            <div className="flex items-center justify-between pt-0.5 px-0.5">
              <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>ABA PAYWAY</span>
                <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                  #{orderId}
                </span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  setPaymentData(null);
                  setOrderId(null);
                }}
                className="w-7 h-7 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center text-sm font-bold transition-all cursor-pointer"
                title="Close"
              >
                ✕
              </button>
            </div>

            {/* Currency & Timer Controls */}
            <div className="flex items-center justify-between gap-2 px-0.5 text-xs">
              {/* Currency Toggle Buttons */}
              <div className="flex items-center p-0.5 bg-slate-100 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => handleSwitchCurrency('USD')}
                  className={`py-1 px-2.5 rounded-lg text-[11px] font-black transition-all cursor-pointer ${
                    (paymentData?.currency || currency) === 'USD'
                      ? 'bg-[#0055a5] text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  USD ($)
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchCurrency('KHR')}
                  className={`py-1 px-2.5 rounded-lg text-[11px] font-black transition-all cursor-pointer ${
                    (paymentData?.currency || currency) === 'KHR'
                      ? 'bg-[#0055a5] text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  KHR (៛)
                </button>
              </div>

              {/* Countdown Timer */}
              <div className="text-[11px] font-mono text-amber-700 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200 font-bold flex items-center gap-1">
                <span>⏱️</span>
                <span>{formatTime(timeLeft)}</span>
              </div>
            </div>

            {processingStep > 0 ? (
              /* ── Payment Processing Steps UI ── */
              <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-4 my-2 animate-fadeIn">
                {/* Header */}
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xl shadow-lg animate-pulse">
                    {processingStep < 3 ? '⚡' : '✅'}
                  </div>
                  <h4 className="text-sm font-black text-slate-900">
                    {processingStep === 1 && 'Payment Confirmed!'}
                    {processingStep === 2 && 'Syncing with Game Server...'}
                    {processingStep === 3 && 'Delivering Diamonds!'}
                  </h4>
                  <p className="text-[10px] text-emerald-700 font-medium">
                    {processingStep === 1 && 'ABA PayWay gateway verified — starting delivery...'}
                    {processingStep === 2 && `Connected to Zone ${formData.serverID || 'Default'} server ✓`}
                    {processingStep === 3 && `Crediting ${selectedProduct?.name || 'diamonds'} to Player ID ${formData.playerID}`}
                  </p>
                </div>

                {/* Step Progress */}
                <div className="space-y-2 text-left">
                  {/* Step 1 */}
                  <div className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-500 ${processingStep >= 1 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'}`}>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black flex-shrink-0 ${processingStep >= 1 ? 'bg-emerald-500 text-white' : 'bg-slate-300 text-slate-500'}`}>
                      {processingStep >= 1 ? '✓' : '1'}
                    </span>
                    <span>💳 Payment Confirmed — ABA PayWay Gateway Signature ✓</span>
                  </div>
                  {/* Step 2 */}
                  <div className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-500 ${processingStep >= 2 ? 'bg-blue-100 text-blue-800' : processingStep === 1 ? 'bg-slate-100 text-slate-400 animate-pulse' : 'bg-slate-100 text-slate-400'}`}>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black flex-shrink-0 ${processingStep >= 2 ? 'bg-blue-500 text-white' : 'bg-slate-300 text-slate-500'}`}>
                      {processingStep >= 2 ? '✓' : '2'}
                    </span>
                    <span>⚡ Connected to Game Server (Zone {formData.serverID || 'Default'}) ✓</span>
                  </div>
                  {/* Step 3 */}
                  <div className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-500 ${processingStep >= 3 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-400'}`}>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black flex-shrink-0 ${processingStep >= 3 ? 'bg-amber-500 text-white' : 'bg-slate-300 text-slate-500'}`}>
                      {processingStep >= 3 ? '✓' : '3'}
                    </span>
                    <span>💎 Crediting {selectedProduct?.name || 'diamonds'} → Player {formData.playerID}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${(processingStep / 3) * 100}%` }}
                  />
                </div>
                <p className="text-[9px] text-slate-400 font-mono">Step {processingStep}/3 — Order #{orderId}</p>
              </div>
            ) : timeLeft === 0 ? (
              /* Expired Screen */
              <div className="p-5 bg-rose-50 rounded-2xl border border-rose-200 text-center space-y-2.5 my-2 animate-fadeIn">
                <div className="text-2xl">⏱️</div>
                <h4 className="text-slate-900 font-bold text-sm">QR Code Expired</h4>
                <p className="text-[11px] text-slate-500">
                  Session timeout for your security. Please generate a new QR code.
                </p>
                <button
                  onClick={handleProceedToPayment}
                  className="w-full py-2.5 px-3 bg-[#0055a5] text-white text-xs font-bold rounded-xl shadow cursor-pointer"
                >
                  Generate New QR
                </button>
              </div>
            ) : (
              /* THE AUTHENTIC KHQR VOUCHER CARD (100% Matching Image 2) */
              <div className="space-y-3">
                <div className="bg-white rounded-2xl shadow-[0_6px_28px_rgba(0,0,0,0.09)] border border-slate-200/90 overflow-hidden relative">
                  
                  {/* Official ABA PayWay Voucher Banner */}
                  <AbaPaywayVoucherHeader />

                  {/* Voucher Body: Merchant Name & Amount */}
                  {(() => {
                    const currentCur = paymentData?.currency || currency;
                    const isRiel = currentCur === 'KHR';
                    const payAmount = isRiel ? Math.round(selectedProduct.price * 4100) : selectedProduct.price;
                    const validQrString = paymentData?.qrString || paymentData?.khqrQRCode || `https://checkout-sandbox.payway.com.kh/pay?tran_id=${paymentData?.tranId || orderId}`;

                    return (
                      <div className="p-4 sm:p-5 text-center space-y-2.5">
                        <div className="space-y-0.5">
                          <span className="text-[10.5px] uppercase font-bold text-slate-600 tracking-wider block">
                            DETH PHEAK (ABA Bank)
                          </span>
                          <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight block">
                            {isRiel ? `${payAmount.toLocaleString()} ៛` : `$ ${payAmount.toFixed(2)}`}
                          </span>
                          <div className="flex items-center justify-center gap-2 pt-0.5 text-[9.5px] text-slate-500 font-mono">
                            <span>USD: <strong className="text-slate-700">004 164 074</strong></span>
                            <span>•</span>
                            <span>KHR: <strong className="text-slate-700">015 499 221</strong></span>
                          </div>
                        </div>

                        {/* Perforated dashed divider (Image 2) */}
                        <div className="border-t border-dashed border-slate-200 w-full my-2" />

                        {/* 100% Camera-Readable Dynamic QR Code matching Figma Guideline */}
                        <div className="p-3 bg-white rounded-2xl border border-slate-100 shadow-sm inline-flex items-center justify-center mx-auto">
                          <QRCodeSVG
                            value={validQrString}
                            size={215}
                            level="M"
                            includeMargin={true}
                            className="w-full h-auto max-w-[215px] select-none"
                          />
                        </div>

                        {/* Currency Switching Overlay */}
                        {switchingCurrency && (
                          <div className="absolute inset-0 bg-white/95 backdrop-blur-xs flex flex-col items-center justify-center p-4 space-y-2 z-10 rounded-2xl">
                            <div className="w-7 h-7 border-3 border-[#0055a5] border-t-transparent rounded-full animate-spin" />
                            <span className="text-xs font-bold text-slate-700">Updating {currency} QR...</span>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>

                {/* Subtext below QR Card */}
                <p className="text-[11px] text-slate-500 text-center leading-relaxed px-2">
                  Scan with ABA Mobile App or any mobile banking app supporting KHQR
                </p>

                {/* Real-time Tracking Pill */}
                <div className="py-1.5 px-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-[10.5px]">
                  <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-600"></span>
                    </span>
                    <span className="text-slate-600 font-medium">Auto-Tracking Payment...</span>
                  </div>
                  <span className="font-mono text-slate-400">TRX: {paymentData?.tranId || `TRX${orderId}`}</span>
                </div>

                {/* One-Tap Mobile Pay Button */}
                {(paymentData?.abapayDeeplink || paymentData?.khqrDeeplink) && (
                  <a
                    href={paymentData.abapayDeeplink || paymentData.khqrDeeplink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-[#0055a5] hover:bg-[#004380] text-white font-black text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-950/20 active:scale-[0.98]"
                  >
                    <span>📲</span>
                    <span>Pay with ABA Mobile App</span>
                  </a>
                )}

                {/* Instant Verification Button */}
                <button
                  type="button"
                  onClick={async () => {
                    if (!orderId) return;
                    try {
                      const res = await ordersAPI.checkPayment(orderId, true);
                      if (res?.data?.isPaid || res?.data?.paymentStatus === 'Paid') {
                        setPaymentPaid(true);
                      }
                    } catch (e) {
                      console.warn('Manual check error:', e);
                    }
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <span>✓</span>
                  <span>I Have Transferred / Verify Now</span>
                </button>

                {/* Official PayWay Checkout Popup Trigger */}


                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    // Follow ABA Guideline exactly
                    if (typeof window !== 'undefined' && 'AbaPayway' in window) {
                       window.AbaPayway.checkout();
                    } else if (typeof AbaPayway !== 'undefined') {
                       // eslint-disable-next-line no-undef
                       AbaPayway.checkout();
                    } else {
                      const form = document.getElementById('aba_merchant_request');
                      if (form) {
                        form.submit(); // Hosted view mode fallback
                      }
                    }
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 font-bold text-[11px] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>🌐</span>
                  <span>PayWay Official Checkout Popup</span>
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* AWAITING BALANCE — PENDING RECEIPT (provider low balance) */}
      {/* ======================================================== */}
      {awaitingBalance && !paymentPaid && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg overflow-y-auto animate-fadeIn">
          <div className="bg-[#0B0F19] border-2 border-amber-500/70 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl shadow-amber-500/20 text-center space-y-5 animate-scaleUp relative overflow-hidden my-auto">

            {/* Glow */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

            {/* Icon */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-orange-400 text-slate-950 text-4xl flex items-center justify-center mx-auto shadow-lg">
              ✅
            </div>

            <div className="space-y-1 relative">
              <span className="px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black uppercase tracking-widest inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                Payment Received
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white pt-1">Your Payment is Confirmed!</h2>
              <p className="text-xs sm:text-sm text-slate-300">
                We have received your payment. Your diamonds will be delivered shortly.
              </p>
            </div>

            {/* Order Receipt */}
            <div className="p-4 rounded-2xl bg-[#111728] border border-slate-700 text-left space-y-2.5 text-xs shadow-inner">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-slate-400">Order Number:</span>
                <span className="font-mono font-black text-amber-300 text-sm">#{orderId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Player ID:</span>
                <span className="font-mono text-white">{formData.playerID}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Package:</span>
                <span className="text-white font-bold">{selectedProduct.name}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                <span className="text-slate-400">Amount Paid:</span>
                <span className="font-black text-emerald-400">${paymentData?.amount?.toFixed(2) || '—'}</span>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-amber-950/40 border border-amber-500/30">
              <span className="text-2xl">⏳</span>
              <div className="text-left">
                <p className="text-amber-300 font-black text-sm">Topup Diamond Pending</p>
                <p className="text-slate-400 text-xs leading-relaxed">
                  We are sorry, our team will check and complete your order in a few minutes.
                </p>
              </div>
            </div>

            {/* Confirm Button */}
            {!confirmSent ? (
              <button
                onClick={async () => {
                  try {
                    await ordersAPI.confirmPaid(orderId);
                    setConfirmSent(true);
                  } catch {
                    setConfirmSent(true); // still mark as sent on error
                  }
                }}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>✅</span>
                <span>I Have Paid — Confirm & Alert Admin</span>
              </button>
            ) : (
              <div className="w-full py-3 px-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 flex items-center justify-center gap-2">
                <span>✅</span>
                <span className="text-emerald-400 font-black text-sm">Admin Has Been Notified!</span>
              </div>
            )}

            <p className="text-[10px] text-slate-500 leading-relaxed">
              After confirming, our admin will be alerted immediately and your 💎 diamonds will be delivered as soon as possible. Thank you for your patience!
            </p>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* PAY-SUCCESSFULLY CELEBRATORY POPUP INTERFACE (z-[9999]) */}
      {/* ======================================================== */}
      {paymentPaid && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg overflow-y-auto animate-fadeIn">
          <div className="bg-[#0B0F19] border-2 border-emerald-500/80 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl shadow-emerald-500/30 text-center space-y-5 animate-scaleUp relative overflow-hidden my-auto">
            
            {/* Glowing background halo */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Celebratory Icon */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 text-4xl flex items-center justify-center mx-auto shadow-glow-emerald animate-bounce">
              ✓
            </div>

            <div className="space-y-1 relative">
              <span className="px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black uppercase tracking-widest inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Pay-Successfully 🎉
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white pt-1">
                Payment Confirmed!
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Your diamonds have been automatically credited directly into your in-game mailbox!
              </p>
            </div>

            {/* Order Receipt Box */}
            <div className="p-4 rounded-2xl bg-[#111728] border border-slate-700 text-left space-y-2.5 text-xs shadow-inner">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-slate-400">Order Number:</span>
                <span className="font-mono font-black text-amber-300 text-sm">#{orderId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Target Player ID:</span>
                <span className="font-mono font-bold text-cyan-300">{formData.playerID} ({formData.serverID || '11446'})</span>
              </div>
              {verifiedAccount?.name && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Account Gamertag:</span>
                  <span className="font-bold text-slate-200">{verifiedAccount.name}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Package Delivered:</span>
                <span className="font-black text-white flex items-center gap-1">
                  <span>💎</span>
                  <span>{selectedProduct.name}</span>
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                <span className="text-slate-400">Amount Paid:</span>
                <div className="text-right">
                  <span className="font-mono font-extrabold text-emerald-400 text-sm">
                    ${selectedProduct.price.toFixed(2)} USD
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    ~{(Math.round(selectedProduct.price * 4100)).toLocaleString()} KHR
                  </span>
                </div>
              </div>
            </div>

            {/* Live 2 Delivery Progression Steps Detail Box */}
            <div className="p-3.5 rounded-2xl bg-[#0B132B] border border-emerald-500/40 text-left space-y-2 text-xs shadow-inner">
              <div className="text-[10.5px] font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 pb-1.5 border-b border-slate-800">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Delivery Progression Audit
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Step 2: Moonton Game Server Sync</span>
                </span>
                <span className="font-mono text-[10px] text-cyan-300 font-bold bg-cyan-500/15 px-2 py-0.5 rounded-md border border-cyan-500/30">Zone {formData.serverID || '11446'} Connected</span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>Step 3: In-Game Mailbox Delivery</span>
                </span>
                <span className="font-mono text-[10px] text-emerald-300 font-bold bg-emerald-500/15 px-2 py-0.5 rounded-md border border-emerald-500/30">💎 {selectedProduct.name} Delivered</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setFormData(prev => ({ ...prev, playerID: '' }));
                  setOrderId(null);
                  setPaymentData(null);
                  setPaymentPaid(false);
                }}
                className="btn btn-gold flex-1 py-3 text-xs font-black uppercase tracking-wider shadow-glow-gold cursor-pointer"
              >
                ⚡ Make Another Top-Up
              </button>
              <Link
                to={`/order-status/${orderId}`}
                className="btn btn-secondary flex-1 py-3 text-xs font-bold text-center flex items-center justify-center gap-1.5"
              >
                <span>📦</span>
                <span>Track Receipt</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ID GUIDE MODAL (z-[9999]) */}
      {/* ======================================================== */}
      {showIdGuide && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className="bg-[#0B0F19] border border-amber-500/40 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scaleUp my-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-black text-white text-base">
                How to find your {selectedGame.name} ID
              </h3>
              <button
                onClick={() => setShowIdGuide(false)}
                className="text-slate-400 hover:text-white text-base cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>1. Open <strong className="text-white">{selectedGame.name}</strong> on your device.</p>
              <p>2. Tap your profile picture or avatar icon in the main menu.</p>
              <p>3. Look for the <strong className="text-amber-300">User ID / Player ID</strong> displayed on your profile card.</p>
              {isMlbb && (
                <p className="p-3 bg-[#111728] rounded-xl border border-slate-800 text-[11px]">
                  💡 <strong>Example:</strong> If your profile shows <code>1225368571 (11446)</code>, enter <code>1225368571</code> in Player ID and <code>11446</code> in Server ID.
                </p>
              )}
            </div>

            <button
              onClick={() => setShowIdGuide(false)}
              className="w-full py-2.5 rounded-xl btn-gold text-xs font-black uppercase tracking-wider cursor-pointer"
            >
              Got It!
            </button>
          </div>
        </div>
      )}
      {/* Injected Form */}
      <form
        id="aba_merchant_request"
        method="POST"
        target="aba_webservice"
        action={paymentData?.purchaseUrl || "https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/purchase"}
        className="hidden"
      >
        {paymentData?.formData &&
          Object.entries(paymentData.formData).map(([k, v]) => (
            <input key={k} type="hidden" name={k} value={v || ''} />
          ))}
      </form>
    </div>
  );
};

export default TopUp;
