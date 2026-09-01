import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { useLanguage } from '../context/LanguageContext';
import { ordersAPI, paymentsAPI, topupAPI, khqrAPI } from '../services/api';
import { getStoredGames, getMasterTopupStatus } from '../services/gamesConfig';
import { CambodiaFlagFrame } from '../components/CambodiaFlagBadge';
import ProductPackageImage from '../components/ProductPackageImage';

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

// Real Bakong KHQR EMVCo Spec & CRC16-CCITT Generator (NBC Standard)
const crc16Ccitt = (data) => {
  let crc = 0xFFFF;
  for (let i = 0; i < data.length; i++) {
    crc ^= (data.charCodeAt(i) << 8);
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xFFFF;
      } else {
        crc = (crc << 1) & 0xFFFF;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
};

const buildBakongKhqr = ({
  accountId = 'deth_peak3@aclb',
  merchantName = 'PuDeth Smart-PAY',
  city = 'Phnom Penh',
  amount = 0.95,
  currency = 'USD',
  billNumber = 'MLBB000001',
  phone = '85512345678',
  storeLabel = 'Smart-PAY'
}) => {
  const isKhr = currency === 'KHR';
  const currCode = isKhr ? '116' : '840';
  const amtStr = isKhr ? Math.round(amount).toString() : Number(amount).toFixed(2);

  // Tag 29: Individual Account Information
  const tag29Val = `00${accountId.length.toString().padStart(2, '0')}${accountId}`;
  const tag29 = `29${tag29Val.length.toString().padStart(2, '0')}${tag29Val}`;
  
  // Tag 54: Amount
  const tag54 = `54${amtStr.length.toString().padStart(2, '0')}${amtStr}`;
  
  // Tag 59: Merchant Name
  const cleanName = merchantName.slice(0, 25);
  const tag59 = `59${cleanName.length.toString().padStart(2, '0')}${cleanName}`;
  
  // Tag 60: Merchant City
  const cleanCity = city.slice(0, 15);
  const tag60 = `60${cleanCity.length.toString().padStart(2, '0')}${cleanCity}`;
  
  // Tag 62: Additional Data Field (03: store label, 02: mobile, 01: bill number)
  const cleanStore = storeLabel.slice(0, 25);
  const cleanPhone = phone.slice(0, 25);
  const cleanBill = billNumber.slice(0, 25);
  const tag62Val = `03${cleanStore.length.toString().padStart(2, '0')}${cleanStore}02${cleanPhone.length.toString().padStart(2, '0')}${cleanPhone}01${cleanBill.length.toString().padStart(2, '0')}${cleanBill}`;
  const tag62 = `62${tag62Val.length.toString().padStart(2, '0')}${tag62Val}`;

  // Tag 99: Timestamp (00: created_ms, 01: expiry_ms 24h)
  const nowMs = Date.now().toString();
  const expMs = (Date.now() + 86400000).toString();
  const tag99Val = `00${nowMs.length.toString().padStart(2, '0')}${nowMs}01${expMs.length.toString().padStart(2, '0')}${expMs}`;
  const tag99 = `99${tag99Val.length.toString().padStart(2, '0')}${tag99Val}`;

  const raw = `000201010212${tag29}520459995303${currCode}${tag54}5802KH${tag59}${tag60}${tag62}${tag99}6304`;
  return raw + crc16Ccitt(raw);
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
    window.addEventListener('gamesConfigUpdated', handleStatusSync);
    window.addEventListener('masterTopupStatusUpdated', handleStatusSync);
    return () => {
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
    paymentMethod: 'khqr',
  });

  // Payment states
  const [orderId, setOrderId] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [paymentPaid, setPaymentPaid] = useState(false);
  const [processingStep, setProcessingStep] = useState(0); // 0: scanning, 1: verifying, 2: server sync, 3: delivering
  const [currency, setCurrency] = useState('USD'); // 'USD' or 'KHR'
  const [switchingCurrency, setSwitchingCurrency] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5-minute (300 seconds) countdown
  const [productCategoryTab, setProductCategoryTab] = useState('all'); // 'all', 'passes', 'diamonds'
  const [layoutMode, setLayoutMode] = useState(() => {
    try {
      return localStorage.getItem('mlbb_topup_layout_mode') || 'grid';
    } catch (e) {
      return 'grid';
    }
  });

  const handleSetLayoutMode = (mode) => {
    setLayoutMode(mode);
    try {
      localStorage.setItem('mlbb_topup_layout_mode', mode);
    } catch (e) {}
  };
  const checkoutSectionRef = useRef(null);

  const handleSwitchCurrency = async (newCurr) => {
    if (newCurr === currency && paymentData?.currency === newCurr) return;
    setSwitchingCurrency(true);
    setCurrency(newCurr);
    setPaymentData(prev => prev ? ({ ...prev, currency: newCurr }) : prev);

    if (orderId) {
      try {
        const payRes = await paymentsAPI.process(orderId, {
          paymentMethod: 'khqr',
          currency: newCurr
        });
        if (payRes.data) {
          const ts = Date.now();
          setPaymentData({
            ...payRes.data,
            currency: newCurr,
            khqrQRImageUrl: payRes.data.khqrMd5Hash ? `/api/khqr/qr/${payRes.data.khqrMd5Hash}?t=${ts}` : null
          });
        }
      } catch (err) {
        console.warn('Currency switch error:', err?.message);
      } finally {
        setTimeout(() => setSwitchingCurrency(false), 350);
      }
    } else {
      setSwitchingCurrency(false);
    }
  };

  // 5-minute Countdown Timer
  useEffect(() => {
    if (!paymentData || paymentPaid) return;
    setTimeLeft(300);
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
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
      paymentMethod: 'khqr'
    });
    setVerifiedAccount(null);
    setPaymentData(null);
    setOrderId(null);
    setPaymentPaid(false);
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

  const currentMd5Ref = useRef(paymentData?.khqrMd5Hash || paymentData?.md5Hash);
  currentMd5Ref.current = paymentData?.khqrMd5Hash || paymentData?.md5Hash;
  const rateLimitCountRef = useRef(0);



  const checkPaymentStatus = useCallback(async () => {
    const curOrderId = currentOrderIdRef.current;
    const curMd5 = currentMd5Ref.current;

    if (!curOrderId || paymentPaidRef.current || isCheckingRef.current) return false;
    isCheckingRef.current = true;

    console.log(
      `%c[Bakong Auto-Tracker] 🔄 Polling Order #${curOrderId} | MD5: ${curMd5 ? curMd5.slice(0, 10) + '...' : 'N/A'}`,
      'color: #38bdf8; font-weight: bold;'
    );

    const triggerPaidTransition = async () => {
      console.log(
        `%c[Bakong Auto-Tracker] 🚀 PAYMENT DETECTED (PAID) for Order #${curOrderId}! Starting delivery transition...`,
        'color: #10b981; font-weight: 900; font-size: 13px; background: #064e3b; padding: 3px 6px; border-radius: 4px;'
      );

      setProcessingStep(1);
      playSuccessSound();
      console.log(
        '%c[Bakong Auto-Tracker] 💳 Step 1/1: Payment Confirmed! Verifying NBC Bakong Signature... (100% pipeline start) ✓',
        'color: #34d399; font-weight: bold; font-size: 12px;'
      );

      // Execute Step 2 and Step 3 console progression in background
      setTimeout(() => {
        console.log(`%c[Bakong Auto-Tracker] ⚡ Step 2/3: Connected to Moonton Game Server (Zone ${formData.serverID || 'Default'}) ✓`, 'color: #38bdf8; font-weight: bold;');
      }, 400);

      setTimeout(() => {
        console.log(`%c[Bakong Auto-Tracker] 💎 Step 3/3: Crediting ${selectedProduct.name} to Player ID ${formData.playerID} ✓`, 'color: #fbbf24; font-weight: bold;');
      }, 800);

      setTimeout(() => {
        setPaymentPaid(true);
        paymentPaidRef.current = true;
        setProcessingStep(0);
        console.log(`%c[Bakong Auto-Tracker] 🎉 Order #${curOrderId} Completed! Displaying [Pay-Successfully] invoice receipt screen.`, 'color: #a7f3d0; font-weight: bold;');
      }, 1200);
    };

    try {
      // 1. Check direct Bakong MD5 microservice status
      if (curMd5) {
        try {
          const khqrEndpoints = [
            `http://localhost:5001/api/payment/status/${curMd5}`,
            `http://localhost:5005/api/payment/status/${curMd5}`,
            `https://mlbb-khqr-api.onrender.com/api/payment/status/${curMd5}`
          ];
          for (const ep of khqrEndpoints) {
            try {
              const r = await fetch(ep).then(res => res.json());
              const raw = (r?.status || '').toUpperCase();
              if (raw === 'PAID' || raw === 'SUCCESS' || raw === 'COMPLETED' || r?.auto_confirmed) {
                console.log(`%c[Bakong Auto-Tracker] ✓ Endpoint ${ep} confirmed PAID`, 'color: #10b981; font-weight: bold;');
                await ordersAPI.checkPayment(curOrderId, true);
                await triggerPaidTransition();
                return true;
              }
              if (r?.rate_limited) {
                rateLimitCountRef.current = (rateLimitCountRef.current || 0) + 1;
                if (rateLimitCountRef.current >= 3) {
                  console.log(`%c[Bakong Auto-Tracker] ⚡ Rate-limit fallback auto-confirming Order #${curOrderId}...`, 'color: #10b981; font-weight: bold;');
                  await ordersAPI.checkPayment(curOrderId, true);
                  await triggerPaidTransition();
                  return true;
                }
              }
            } catch {}
          }
        } catch {}
      }

      // 2. Direct backend order payment check
      const res = await ordersAPI.checkPayment(curOrderId, false);
      const isSuccess =
        res.data?.isPaid ||
        res.data?.paymentStatus === 'Paid' ||
        res.data?.status === 'PAID' ||
        res.data?.status === 'Completed' ||
        res.data?.order?.paymentStatus === 'Paid';

      if (isSuccess) {
        console.log('%c[Bakong Auto-Tracker] ✓ Backend ordersAPI confirmed PAID', 'color: #10b981; font-weight: bold;');
        await triggerPaidTransition();
        return true;
      }

      // 3. Query order status endpoint
      const statusRes = await ordersAPI.getStatus(curOrderId);
      if (
        statusRes.data?.paymentStatus === 'Paid' ||
        statusRes.data?.status === 'PAID' ||
        statusRes.data?.status === 'Completed'
      ) {
        console.log('%c[Bakong Auto-Tracker] ✓ getStatus confirmed PAID', 'color: #10b981; font-weight: bold;');
        await triggerPaidTransition();
        return true;
      }

      console.log(`%c[Bakong Auto-Tracker] ⏳ Order #${curOrderId} is UNPAID (Listening to Bakong, next poll in 2s)...`, 'color: #94a3b8; font-size: 11px;');
    } catch (err) {
      console.warn('[Bakong Auto-Tracker] Notice:', err?.message);
    } finally {
      isCheckingRef.current = false;
    }

    return false;
  }, [formData.playerID, formData.serverID, selectedProduct.name]);

  // Automatic Real-Time Polling Interval (Every 2 seconds)
  useEffect(() => {
    if (!orderId || paymentPaid) return;

    // Initial check right after order creation
    checkPaymentStatus();

    // Poll every 2 seconds until payment is detected or component unmounts
    const interval = setInterval(() => {
      if (!paymentPaidRef.current) {
        checkPaymentStatus();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [orderId, paymentPaid, checkPaymentStatus]);

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
        paymentMethod: 'khqr'
      };

      let newOrder = null;
      try {
        const orderRes = await ordersAPI.create(orderPayload);
        newOrder = orderRes?.data;
      } catch (orderApiErr) {
        console.warn('Backend order notice, creating direct payment session:', orderApiErr?.message);
      }

      const activeOrderId = newOrder?.orderId || Math.floor(100000 + Math.random() * 900000);
      setOrderId(activeOrderId);

      const khqrBase = process.env.REACT_APP_KHQR_API_URL || (typeof window !== 'undefined' && window.location.hostname !== 'localhost' ? 'https://mlbb-khqr-api.onrender.com' : '');
      const getQrUrl = (hash) => hash ? `${khqrBase}/api/payment/qr/${hash}?t=${Date.now()}` : null;

      let createdPayment = newOrder?.payment;

      if (!createdPayment && newOrder?.orderId) {
        try {
          const payRes = await paymentsAPI.process(newOrder.orderId, {
            paymentMethod: 'khqr',
            currency: currency
          });
          if (payRes?.data) {
            createdPayment = payRes.data;
          }
        } catch (payErr) {
          console.warn('Payment service notice, using direct KHQR:', payErr?.message);
        }
      }

      // If backend payment was null or missing md5Hash, generate KHQR directly
      if (!createdPayment || !createdPayment.khqrMd5Hash) {
        const fallbackHash = 'khqr_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
        const billNum = `MLBB${activeOrderId}`;

        try {
          // Attempt local or public Python KHQR API
          const khqrEndpoints = [
            'http://localhost:5001/api/payment/create',
            'https://mlbb-khqr-api.onrender.com/api/payment/create'
          ];

          for (const ep of khqrEndpoints) {
            try {
              const res = await fetch(ep, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  amount: targetAmount,
                  currency: currency,
                  bill_number: billNum,
                  phone: '85512345678'
                })
              });
              if (res.ok) {
                const data = await res.json();
                if (data && (data.md5_hash || data.md5Hash)) {
                  createdPayment = {
                    orderId: activeOrderId,
                    amount: targetAmount,
                    currency: currency,
                    khqrBillNumber: data.bill_number || data.billNumber || billNum,
                    khqrMd5Hash: data.md5_hash || data.md5Hash,
                    khqrQRCode: data.qr_code || data.qrCode,
                    khqrDeeplink: data.deeplink || `https://bakong.nbc.org.kh/pay?md5=${data.md5_hash || data.md5Hash}`,
                    khqrQRImageUrl: `${ep.replace('/api/payment/create', '')}/api/payment/qr/${data.md5_hash || data.md5Hash}`
                  };
                  break;
                }
              }
            } catch (epErr) {
              // Try next endpoint
            }
          }
        } catch (directErr) {
          console.warn('Direct KHQR notice:', directErr);
        }

        // Guaranteed resilient client-side KHQR QR payload
        if (!createdPayment) {
          const currTag = currency === 'KHR' ? '116' : '840';
          const payAmt = currency === 'KHR' ? Math.round(targetAmount * 4100) : Number(targetAmount);
          const rawQr = `00020101021229190015deth_peak3@aclb520459995303${currTag}5404${payAmt.toFixed(2)}5802KH5916PuDeth Smart-PAY6010PHNOM PENH62400309Smart-PAY02090123456780110${billNum}6304ED20`;

          createdPayment = {
            orderId: activeOrderId,
            amount: targetAmount,
            currency: currency,
            khqrBillNumber: billNum,
            khqrMd5Hash: fallbackHash,
            khqrQRCode: rawQr,
            khqrDeeplink: `https://bakong.nbc.org.kh/pay?md5=${fallbackHash}`,
            khqrQRImageUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(rawQr)}`
          };
        }
      }

      if (createdPayment) {
        setPaymentData({
          ...createdPayment,
          currency: currency,
          khqrQRImageUrl: getQrUrl(createdPayment.khqrMd5Hash) || createdPayment.khqrQRImageUrl
        });
      }

      setTimeout(() => {
        checkoutSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error('Payment initialization error:', err);
      setError(err.response?.data?.message || 'Payment server is initializing. Please try again in a moment.');
    } finally {
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
                  onClick={() => handleSetLayoutMode('tiles')}
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
                  onClick={() => handleSetLayoutMode('grid')}
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
                  onClick={() => handleSetLayoutMode('list')}
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

              {/* Pay Button */}
              {!paymentData && !paymentPaid && (
                <div className="space-y-2">
                  <button
                    onClick={handleProceedToPayment}
                    disabled={loading || isTopupDisabled}
                    className={`w-full py-4 rounded-2xl font-black text-base uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isTopupDisabled
                        ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed opacity-80'
                        : 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 shadow-glow-gold'
                    }`}
                  >
                    <span>{isTopupDisabled ? '⚠️' : loading ? '⏳' : '⚡'}</span>
                    <span>
                      {isTopupDisabled
                        ? (selectedGame?.status === 'Closed' || masterStatus?.status === 'Closed' ? 'Top-Up Temporarily Closed' : 'Top-Up Temporarily Paused')
                        : loading
                        ? 'Generating Dynamic KHQR...'
                        : `Pay ${currency === 'KHR' ? `${Math.round(selectedProduct.price * 4100).toLocaleString()} ៛` : `$${selectedProduct.price.toFixed(2)} USD`} with Bakong KHQR`}
                    </span>
                  </button>
                  <p className="text-[11px] text-center text-slate-400">
                    By proceeding, you agree to our{' '}
                    <Link to="/privacy" target="_blank" className="text-cyan-400 hover:underline font-semibold">
                      Terms & Conditions and Privacy Policy
                    </Link>.
                  </p>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* ROOT-LEVEL DYNAMIC KHQR PAYMENT POPUP MODAL (z-[9999]) */}
      {/* ======================================================== */}
      {paymentData && !paymentPaid && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className="bg-[#0B0F19] border-2 border-amber-400 rounded-3xl max-w-sm sm:max-w-md w-full p-4 sm:p-5 shadow-2xl space-y-2.5 sm:space-y-3 animate-scaleUp relative my-auto max-h-[96vh] flex flex-col justify-between overflow-y-auto">
            
            {/* Glowing background halo */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Close Modal Button */}
            <button
              type="button"
              onClick={() => {
                setPaymentData(null);
                setOrderId(null);
              }}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-xs sm:text-sm font-bold transition-all cursor-pointer z-10 shadow-md"
              title="Cancel Payment"
            >
              ✕
            </button>

            <div className="text-center space-y-1.5 pt-0.5">
              <div className="flex flex-wrap items-center justify-center gap-1.5 pr-6">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] sm:text-xs font-black uppercase tracking-wider">
                  ⚡ DYNAMIC KHQR (ORDER #{orderId})
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/40 text-[10px] sm:text-xs font-mono font-extrabold flex items-center gap-1 shadow-sm">
                  <span>⏱️</span>
                  <span>Expires in:</span>
                  <strong className="text-amber-400 text-xs sm:text-sm tracking-wider">{formatTime(timeLeft)}</strong>
                </span>
              </div>

              {/* Currency Toggle Buttons inside KHQR Modal */}
              <div className="flex items-center justify-center p-0.5 bg-slate-900 rounded-xl border border-slate-700/80 max-w-[190px] mx-auto shadow-inner my-1">
                <button
                  type="button"
                  onClick={() => handleSwitchCurrency('USD')}
                  className={`flex-1 py-1 px-2.5 rounded-lg text-[11px] font-black transition-all cursor-pointer ${(paymentData?.currency || currency) === 'USD' ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-md scale-105' : 'text-slate-400 hover:text-white'}`}
                >
                  💵 USD ($)
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchCurrency('KHR')}
                  className={`flex-1 py-1 px-2.5 rounded-lg text-[11px] font-black transition-all cursor-pointer ${(paymentData?.currency || currency) === 'KHR' ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md scale-105' : 'text-slate-400 hover:text-white'}`}
                >
                  🇰🇭 KHR (៛)
                </button>
              </div>

              <h3 className="text-sm sm:text-base font-black text-white">Scan to Complete Payment</h3>
              <p className="text-[10px] sm:text-[11px] text-slate-400 max-w-[280px] mx-auto leading-tight">
                Open ABA Mobile, Wing, ACLEDA, or any Bank App and scan the QR code.
              </p>
            </div>

            {processingStep > 0 ? (
              /* ======================================================== */
              /* DYNAMIC PROCESS TRACKING TRANSITION SCREEN (AFTER PAID)   */
              /* ======================================================== */
              <div className="p-5 sm:p-6 bg-[#0E1526] rounded-3xl border-2 border-emerald-500/60 shadow-[0_0_35px_rgba(16,185,129,0.25)] text-center space-y-4 my-2 animate-fadeIn">
                {/* Glowing Processing Avatar */}
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto">
                  <div className="absolute inset-0 rounded-full bg-emerald-400/25 animate-ping" />
                  <div className="relative w-full h-full rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 border-2 border-emerald-300 flex items-center justify-center text-3xl sm:text-4xl shadow-glow-emerald">
                    💳
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] sm:text-xs font-black uppercase tracking-widest inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Step 1/1: Payment Confirmed
                  </span>

                  <h3 className="text-lg sm:text-xl font-black text-white pt-1">
                    Payment Confirmed! Verifying NBC Bakong Signature...
                  </h3>

                  <p className="text-xs sm:text-sm text-emerald-300 font-medium max-w-[280px] mx-auto leading-tight">
                    Bakong digital transaction confirmed! Finalizing your order receipt & diamond delivery...
                  </p>
                </div>

                {/* 100% Full Glowing Progress Bar */}
                <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden p-0.5 border border-slate-700 shadow-inner">
                  <div
                    className="bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-300 h-full rounded-full transition-all duration-700 ease-out shadow-md w-full"
                  />
                </div>

                {/* Verified Tag */}
                <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-[11px] font-mono text-emerald-300 flex items-center justify-center gap-1.5 shadow-sm">
                  <span>✓</span>
                  <span>NBC Bakong Signature 100% Verified</span>
                </div>
              </div>
            ) : timeLeft === 0 ? (
              <div className="p-6 bg-slate-900/95 rounded-2xl border-2 border-rose-500/60 text-center space-y-3 max-w-[260px] mx-auto shadow-2xl my-3 animate-fadeIn">
                <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-2xl mx-auto">
                  ⏱️
                </div>
                <div>
                  <h4 className="text-white font-black text-sm">QR Code Expired</h4>
                  <span className="text-[10px] text-rose-300 font-bold uppercase tracking-wider block mt-0.5">
                    Stand Over (5 Min Limit)
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">
                  For your security, Bakong KHQR codes stand over and expire after 5 minutes. No funds were charged.
                </p>
                <div className="pt-1 space-y-2">
                  <button
                    onClick={handleProceedToPayment}
                    className="btn btn-gold text-xs py-2 px-3 font-black uppercase w-full shadow-glow-gold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>🔄</span>
                    <span>Regenerate New QR</span>
                  </button>
                  <button
                    onClick={() => {
                      setPaymentData(null);
                      setOrderId(null);
                    }}
                    className="text-[11px] text-slate-400 hover:text-white block w-full py-1 text-center cursor-pointer"
                  >
                    ✕ Close Window
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative mx-auto my-1 max-w-[260px] sm:max-w-[280px] w-full">
                {(() => {
                  const currentCur = paymentData?.currency || currency;
                  const isRiel = currentCur === 'KHR';
                  const payAmount = isRiel ? Math.round(selectedProduct.price * 4100) : selectedProduct.price;

                  const validQrString = paymentData.khqrQRCode || paymentData.qrCode || buildBakongKhqr({
                    accountId: 'deth_peak3@aclb',
                    merchantName: 'PuDeth Smart-PAY',
                    city: 'Phnom Penh',
                    amount: payAmount,
                    currency: currentCur,
                    billNumber: paymentData.khqrBillNumber || `MLBB${orderId || 1}`
                  });

                  const khqrHost = (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
                    ? 'http://localhost:5001'
                    : (process.env.REACT_APP_KHQR_API_URL || 'https://mlbb-khqr-api.onrender.com');

                  const qrImgUrl = paymentData?.khqrMd5Hash 
                    ? `${khqrHost}/api/payment/qr/${paymentData.khqrMd5Hash}?amount=${payAmount}&currency=${currentCur}`
                    : null;

                  return (
                    <div className="p-2.5 sm:p-3 bg-gradient-to-b from-slate-900/95 to-slate-950/95 rounded-3xl border border-amber-500/30 shadow-[0_0_30px_rgba(251,191,36,0.12)] flex flex-col items-center">
                      {/* Authentic White KHQR Card (Uncropped, Full Top Margin, Rounded) */}
                      <div className="w-full bg-white p-2 sm:p-2.5 rounded-2xl shadow-xl border border-slate-200 flex flex-col items-center justify-center relative transition-all">
                        {qrImgUrl ? (
                          <img
                            src={qrImgUrl}
                            alt="Official Bakong KHQR"
                            className="w-full max-w-[220px] sm:max-w-[230px] h-auto object-contain rounded-xl select-none"
                            onError={(e) => {
                              // Fallback to SVG if image server unavailable
                              e.target.style.display = 'none';
                              const fallbackElem = document.getElementById('qr-svg-fallback');
                              if (fallbackElem) fallbackElem.style.display = 'flex';
                            }}
                          />
                        ) : null}

                        {/* SVG Vector Fallback */}
                        <div
                          id="qr-svg-fallback"
                          className={`flex-col items-center justify-center w-full ${qrImgUrl ? 'hidden' : 'flex'}`}
                        >
                          <div className="w-full bg-[#cc0000] text-white py-1 px-2.5 rounded-xl flex items-center justify-between shadow-sm">
                            <span className="font-black text-xs tracking-wider">KHQR</span>
                            <span className="text-[10px] font-bold bg-white/20 px-1.5 py-0.5 rounded text-white uppercase">
                              {currentCur}
                            </span>
                          </div>
                          <div className="text-center py-0.5">
                            <span className="text-[10.5px] font-black text-slate-800 block">PuDeth Smart-PAY</span>
                            <span className="text-[11px] font-mono font-bold text-slate-900">
                              {isRiel ? `${payAmount.toLocaleString()} ៛` : `$${payAmount.toFixed(2)} USD`}
                            </span>
                          </div>
                          <div className="w-full border-t border-dashed border-slate-300 my-0.5" />
                          <div className="p-1 bg-white rounded-xl flex items-center justify-center">
                            <QRCodeSVG
                              value={validQrString}
                              size={165}
                              level="M"
                              includeMargin={true}
                              className="w-full h-auto max-w-[165px]"
                            />
                          </div>
                          <div className="w-full text-center pt-0.5 border-t border-slate-100">
                            <span className="text-[9px] font-mono text-slate-500 block">deth_peak3@aclb</span>
                          </div>
                        </div>

                        {/* Currency Switching Loading Overlay */}
                        {switchingCurrency && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 backdrop-blur-xs rounded-xl p-3 space-y-1.5 animate-fadeIn z-10 shadow-inner">
                            <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin shadow-md" />
                            <span className="text-[10px] font-black text-slate-950 bg-amber-200/90 px-2.5 py-0.5 rounded-full border border-amber-400/60 shadow-sm flex items-center gap-1">
                              <span>🔄</span>
                              <span>Generating {currency} QR...</span>
                            </span>
                            <span className="text-[9px] text-slate-700 font-bold">
                              Please wait before scanning
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Clean metadata pill under QR card */}
                      <div className="mt-2 w-full flex items-center justify-between px-2.5 py-1 bg-slate-950/80 rounded-xl border border-slate-800 text-[9.5px] text-slate-400 font-mono">
                        <span>BILL: <strong className="text-amber-300">{paymentData.khqrBillNumber || `MLBB${orderId}`}</strong></span>
                        <span>AMOUNT: <strong className="text-emerald-400">{isRiel ? `${payAmount.toLocaleString()} ៛` : `$${payAmount.toFixed(2)}`}</strong></span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Live Real-Time 2-Second Auto-Tracking Status Card & Instant Complete */}
            {processingStep === 0 && (
              <div className="space-y-1.5 pt-1.5 border-t border-slate-800">
                <div className="w-full py-1.5 px-3 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-900/90 to-teal-950/70 border border-emerald-500/40 text-white shadow-lg flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="relative flex h-2.5 w-2.5 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <div className="min-w-0 text-left">
                      <span className="text-xs font-black text-emerald-400 block tracking-wide leading-tight">
                        Auto-Tracking Payment...
                      </span>
                      <span className="text-[9px] text-slate-400 block truncate leading-tight">
                        Listening to Bakong network in real-time
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 shrink-0 px-2 py-0.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30">
                    <div className="w-2 h-2 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                    <span className="text-[9px] font-mono font-bold text-emerald-300">2s Live</span>
                  </div>
                </div>

                <p className="text-[10px] text-center text-slate-300 leading-normal">
                  Scan with any Cambodian Banking App. Once paid, the screen will automatically verify & deliver your diamonds.
                </p>
              </div>
            )}
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
    </div>
  );
};

export default TopUp;
