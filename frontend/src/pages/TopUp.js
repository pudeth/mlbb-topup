import React, { useState, useEffect, useCallback, useRef, useTransition } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { ordersAPI, topupAPI, paywayAPI, productsAPI } from '../services/api';
import { getStoredGames, getMasterTopupStatus, fetchStoredGames, fetchMasterTopupStatus } from '../services/gamesConfig';
import ProductPackageImage from '../components/ProductPackageImage';
import { AbaKhqrLogo } from '../components/AbaPaymentLogos';
import WeAcceptPayments from '../components/WeAcceptPayments';

// Game-specific packages matching upstream supplier catalog
const GAME_PACKAGES_MAP = {
  mlbb: [
    { productId: 12, diamondAmount: 55, name: '55 Diamonds', price: 0.95, tag: 'Starter', customImage: '/images/diamond-chest-3d.png' },
    { productId: 13, diamondAmount: 86, name: '86 Diamonds', price: 1.35, tag: 'Bonus', customImage: '/images/diamond-chest-3d.png' },
    { productId: 14, diamondAmount: 210, name: 'Weekly Pass', price: 1.55, tag: 'ទទួលបាន 220 💎 + 70 arura ⭐', isPass: true, customImage: '/images/weekly-pass.png' },
    { productId: 201, diamondAmount: 440, name: '2 Weekly Pass', price: 3.10, tag: 'ទទួលបាន 440 💎 + 140 arura ⭐', isPass: true, customImage: '/images/weekly-pass.png' },
    { productId: 202, diamondAmount: 660, name: '3 Weekly Pass', price: 4.65, tag: '29 tickets 🎫', isPass: true, customImage: '/images/weekly-pass.png' },
    { productId: 203, diamondAmount: 880, name: '4 Weekly Pass', price: 6.20, tag: '4x WDP', isPass: true, customImage: '/images/weekly-pass.png' },
    { productId: 204, diamondAmount: 1100, name: '5 Weekly Pass', price: 7.75, tag: '5x WDP', isPass: true, customImage: '/images/weekly-pass.png' },
    { productId: 205, diamondAmount: 1320, name: '6 Weekly Pass', price: 9.30, tag: '6x WDP', isPass: true, customImage: '/images/weekly-pass.png' },
    { productId: 206, diamondAmount: 605, name: '165 + 2Weekly', price: 5.50, tag: '165 💎 + 2x WDP', isPass: true, customImage: '/images/weekly-pass.png' },
    { productId: 2, diamondAmount: 110, name: '110 Diamonds', price: 1.70, tag: 'Bonus', customImage: '/images/diamond-chest-3d.png' },
    { productId: 31, diamondAmount: 165, name: '165 Diamonds', price: 2.40, tag: 'HOT 🔥', customImage: '/images/diamond-chest-3d.png' },
    { productId: 15, diamondAmount: 172, name: '172 Diamonds', price: 2.50, tag: 'Standard', customImage: '/images/diamond-chest-3d.png' },
    { productId: 16, diamondAmount: 257, name: '257 Diamonds', price: 3.69, tag: 'Popular', customImage: '/images/diamond-chest-3d.png' },
    { productId: 32, diamondAmount: 275, name: '275 Diamonds', price: 3.85, tag: '29 tickets 🎟️', customImage: '/images/diamond-chest-3d.png' },
    { productId: 33, diamondAmount: 312, name: '312 Diamonds', price: 4.55, tag: 'STARLIGHT 🌟', customImage: '/images/diamond-chest-3d.png' },
    { productId: 34, diamondAmount: 343, name: '343 Diamonds', price: 4.99, tag: '29 tickets 🎟️', customImage: '/images/diamond-chest-3d.png' },
    { productId: 18, diamondAmount: 429, name: '429 Diamonds', price: 6.30, tag: '29 tickets 🎟️', customImage: '/images/diamond-chest-3d.png' },
    { productId: 19, diamondAmount: 500, name: 'Twilight Pass', price: 8.50, tag: 'VIP PASS 👑', isPass: true, customImage: '/images/weekly-pass.png' },
    { productId: 20, diamondAmount: 514, name: '514 Diamonds', price: 7.35, tag: 'Best Value', customImage: '/images/diamond-chest-3d.png' },
    { productId: 35, diamondAmount: 565, name: '565 Diamonds', price: 7.80, tag: 'Special', customImage: '/images/diamond-chest-3d.png' },
    { productId: 36, diamondAmount: 600, name: '600 Diamonds', price: 8.50, tag: 'Pro Pack', customImage: '/images/diamond-chest-3d.png' },
    { productId: 21, diamondAmount: 706, name: '706 Diamonds', price: 9.99, tag: 'VIP', customImage: '/images/diamond-chest-3d.png' },
    { productId: 37, diamondAmount: 878, name: '878 Diamonds', price: 12.80, tag: 'VIP PRO', customImage: '/images/diamond-chest-3d.png' },
    { productId: 38, diamondAmount: 963, name: '963 Diamonds', price: 13.60, tag: 'Grand Pack', customImage: '/images/diamond-chest-3d.png' },
    { productId: 22, diamondAmount: 1050, name: '1050 Diamonds', price: 15.50, tag: 'Royal Chest', customImage: '/images/diamond-chest-3d.png' },
    { productId: 39, diamondAmount: 1412, name: '1412 Diamonds', price: 22.00, tag: 'Treasury', customImage: '/images/diamond-chest-3d.png' },
    { productId: 23, diamondAmount: 2195, name: '2195 Diamonds', price: 29.99, tag: 'Mythic Pack', customImage: '/images/diamond-chest-3d.png' },
    { productId: 40, diamondAmount: 2452, name: '2452 Diamonds', price: 32.50, tag: 'Mythic Plus', customImage: '/images/diamond-chest-3d.png' },
    { productId: 41, diamondAmount: 2901, name: '2901 Diamonds', price: 39.99, tag: 'Legendary Pack', customImage: '/images/diamond-chest-3d.png' },
    { productId: 24, diamondAmount: 3688, name: '3688 Diamonds', price: 49.99, tag: 'Epic Vault', customImage: '/images/diamond-chest-3d.png' },
    { productId: 42, diamondAmount: 4390, name: '4390 Diamonds', price: 62.99, tag: 'Supreme Chest', customImage: '/images/diamond-chest-3d.png' },
    { productId: 25, diamondAmount: 5532, name: '5532 Diamonds', price: 73.99, tag: 'Immortal Pack', customImage: '/images/diamond-chest-3d.png' },
    { productId: 43, diamondAmount: 6944, name: '6944 Diamonds', price: 92.99, tag: 'Titan Pack', customImage: '/images/diamond-chest-3d.png' },
    { productId: 26, diamondAmount: 9288, name: '9288 Diamonds', price: 125.00, tag: 'ULTIMATE ⚡', customImage: '/images/diamond-chest-3d.png' },
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

// Safe accessor for official ABA PayWay instance from script scope
const getAbaPaywayInstance = () => {
  if (typeof window !== 'undefined') {
    let instance = window.AbaPayway;
    if (!instance) {
      try {
        // Evaluate in global classic script scope where const AbaPayway is declared
        // eslint-disable-next-line no-eval
        const g = (0, eval)('typeof AbaPayway !== "undefined" ? AbaPayway : undefined');
        if (g && typeof g.checkout === 'function') {
          window.AbaPayway = g;
          instance = g;
        }
      } catch (e) {}
    }
    return instance;
  }
  return null;
};

// Graceful close of ABA PayWay popup without full page refresh & complete scroll restoration
const closeAbaCheckoutPopup = () => {
  try {
    const payway = getAbaPaywayInstance();
    if (payway && typeof payway.closeCheckout === 'function') {
      try {
        payway.closeCheckout(false);
      } catch (e) {}
    }
    const abaCheckout = document.getElementById('aba-checkout');
    if (abaCheckout) {
      abaCheckout.style.display = 'none';
      abaCheckout.classList.remove('aba-checkout-desktop');
      abaCheckout.innerHTML = '';
    }
    const sheet = document.getElementById('aba_checkout_sheet');
    if (sheet) {
      sheet.style.display = 'none';
      sheet.setAttribute('aria-hidden', 'true');
      sheet.style.pointerEvents = 'none';
    }
    const exitModal = document.getElementById('aba_checkout_open_exit_modal_mini_app');
    if (exitModal) exitModal.style.display = 'none';
    const exitCloseModal = document.getElementById('aba_checkout_close_exit_modal_mini_app');
    if (exitCloseModal) exitCloseModal.style.display = 'none';

    // Thoroughly unlock document & body scrolling on mobile & desktop
    document.body.classList.remove('modal-open');
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('overflow-y');
    document.documentElement.style.removeProperty('overflow');
    document.documentElement.style.removeProperty('overflow-y');
    document.body.style.overflow = '';
    document.body.style.overflowY = '';
    document.documentElement.style.overflow = '';
    document.documentElement.style.overflowY = '';
  } catch (e) {}
};

// MLBB Multi-Hero Showcase Banner Slides
const MLBB_BANNERS = [
  '/images/mlbb_hero_banner.png',
  '/images/banner_mlbb_allstar.jpg',
  '/images/banner_mlbb_aldous.jpg',
  '/images/banner_starlight_cosmic.jpg',
];

const TopUp = () => {
  const { t, language } = useLanguage();
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
  const [copiedPlayerId, setCopiedPlayerId] = useState(false);
  const [activeBannerIdx, setActiveBannerIdx] = useState(0);

  const selectedGameIdRef = useRef(selectedGame.id);
  useEffect(() => {
    selectedGameIdRef.current = selectedGame.id;
  }, [selectedGame.id]);

  useEffect(() => {
    const handleStatusSync = () => {
      setMasterStatus(getMasterTopupStatus());
      const updatedAll = getStoredGames();
      const updatedMatched = updatedAll.find(g => g.id === selectedGameIdRef.current) || updatedAll[0];
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
          const updatedMatched = cloudGames.find(g => g.id === selectedGameIdRef.current) || cloudGames[0];
          if (updatedMatched) setSelectedGame(updatedMatched);
        }
      } catch (err) {}
    };

    // Immediate initial sync
    syncCloudData();

    // 5s Real-Time Background polling across all mobile devices
    const interval = setInterval(syncCloudData, 5000);

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
  }, []);

  const isMasterPaused = masterStatus?.status && masterStatus.status !== 'Active';
  const isGamePaused = selectedGame?.status && selectedGame.status !== 'Active';
  const isTopupDisabled = isMasterPaused || isGamePaused;
  const isClosed = masterStatus?.status === 'Closed' || selectedGame?.status === 'Closed';

  const noticeTitle = isMasterPaused
    ? t('status_master_paused_title')
    : isClosed
    ? t('status_closed_title')
    : t('status_paused_title');

  const noticeDesc = isMasterPaused
    ? (masterStatus?.notice || t('status_master_paused_desc'))
    : isClosed
    ? (selectedGame?.notice || t('status_closed_desc').replace('{game}', selectedGame?.name || 'this game'))
    : (selectedGame?.notice || t('status_paused_desc').replace('{game}', selectedGame?.name || 'this game'));
  const pauseReasonMessage = noticeDesc;

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
        let customProducts = JSON.parse(saved);
        if (Array.isArray(customProducts)) {
          baseList = baseList.map(item => {
            const match = customProducts.find(p => p.productId === item.productId || (p.game === (gameId.startsWith('mlbb') ? 'mlbb' : gameId) && p.diamondAmount === item.diamondAmount));
            if (match) {
              const cleanedPrice = Number(match.price);
              // Clean any stale treasure-chest.png to the new 3D diamond chest
              const cleanImg = match.customImage === '/images/treasure-chest.png' ? '/images/diamond-chest-3d.png' : match.customImage;
              return {
                ...item,
                price: (cleanedPrice && cleanedPrice >= 0.5) ? cleanedPrice : item.price,
                name: match.name || item.name,
                tag: match.tag !== undefined ? match.tag : item.tag,
                status: match.status || 'Active',
                customImage: cleanImg !== undefined ? cleanImg : item.customImage
              };
            }
            return item;
          }).filter(item => item.status !== 'Inactive');
        }
      }
    } catch (e) {}

    // Ensure 55 Diamonds is strictly $0.95 and ensure all diamond packages default to 3D diamond chest
    baseList = baseList.map(item => {
      const isPass = item.isPass || (item.name && item.name.toLowerCase().includes('pass'));
      let finalImg = item.customImage;
      if (!finalImg || finalImg === '/images/treasure-chest.png') {
        finalImg = isPass ? '/images/weekly-pass.png' : '/images/diamond-chest-3d.png';
      }
      if ((item.diamondAmount === 55 || item.name === '55 Diamonds') && item.price < 0.5) {
        return { ...item, price: 0.95, diamondAmount: 55, customImage: finalImg };
      }
      return { ...item, customImage: finalImg };
    });

    return baseList;
  }, []);

  const [products, setProducts] = useState(() => getPackagesForGame(selectedGame.id));

  // Real-time synchronization with Admin Price changes & Cloud Backend across all devices
  useEffect(() => {
    let isSubscribed = true;

    const handleProductsUpdated = () => {
      const updatedList = getPackagesForGame(selectedGame.id);
      setProducts(updatedList);
      setSelectedProduct(prev => {
        const match = updatedList.find(p => p.productId === prev?.productId);
        return match || updatedList[0];
      });
    };

    const syncCloudProducts = async () => {
      try {
        const res = await productsAPI.getAll().catch(() => null);
        if (res && res.data && Array.isArray(res.data) && res.data.length > 0 && isSubscribed) {
          try {
            localStorage.setItem('admin_custom_products', JSON.stringify(res.data));
          } catch (e) {}
          handleProductsUpdated();
        }
      } catch (err) {}
    };

    // Immediate cloud sync
    syncCloudProducts();

    // 3.5s background polling so mobile devices immediately receive new uploaded PNGs & prices
    const interval = setInterval(syncCloudProducts, 3500);

    window.addEventListener('productsConfigUpdated', handleProductsUpdated);
    window.addEventListener('adminProductsUpdated', handleProductsUpdated);
    window.addEventListener('storage', handleProductsUpdated);

    return () => {
      isSubscribed = false;
      clearInterval(interval);
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

  const handleCopyPlayerId = () => {
    if (formData.playerID) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(formData.playerID).catch(() => {});
      }
      setCopiedPlayerId(true);
      setTimeout(() => setCopiedPlayerId(false), 2000);
    }
  };

  const handleStartGameAction = () => {
    if (!formData.playerID.trim()) {
      setError(language === 'km' ? 'សូមបញ្ចូល Player ID (UID) របស់អ្នកជាមុនសិន' : 'Please enter your Player ID (UID) first');
      const el = document.getElementById('player_id_input');
      if (el) {
        el.focus();
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    const el = document.getElementById('packages-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Payment states
  const [orderId, setOrderId] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [paymentPaid, setPaymentPaid] = useState(false);
  const [awaitingBalance, setAwaitingBalance] = useState(false); // provider has no balance — pending admin
  const [confirmSent, setConfirmSent] = useState(false); // customer pressed Confirm button
  const [qrExpired, setQrExpired] = useState(false);
  const qrExpiredRef = useRef(false);
  const timeLeftRef = useRef(360); // 6-minute (360 seconds) transaction lifetime (ABA PayWay standard)
  const [currency, setCurrency] = useState('USD'); // 'USD' or 'KHR'
  const [productCategoryTab, setProductCategoryTab] = useState('all'); // 'all', 'passes', 'diamonds'
  const [layoutMode, setLayoutMode] = useState('tiles'); // 'list', 'tiles', 'grid'
  const [listScroll, setListScroll] = useState({ atTop: true, atBottom: false, progress: 0 });
  const productListRef = useRef(null);
  const handleListScroll = (e) => {
    const el = e.currentTarget;
    const max = el.scrollHeight - el.clientHeight;
    const next = { atTop: el.scrollTop <= 4, atBottom: el.scrollTop >= max - 4, progress: max > 0 ? el.scrollTop / max : 1 };
    setListScroll(prev => (prev.atTop === next.atTop && prev.atBottom === next.atBottom && Math.abs(prev.progress - next.progress) < 0.02) ? prev : next);
  };
  useEffect(() => {
    const el = productListRef.current;
    if (!el) return;
    el.scrollTop = 0;
    const max = el.scrollHeight - el.clientHeight;
    setListScroll({ atTop: true, atBottom: max <= 4, progress: max > 0 ? 0 : 1 });
  }, [productCategoryTab, layoutMode, selectedGame.id, products.length]);
  const checkoutSectionRef = useRef(null);

  const handleSwitchCurrency = async (newCurr) => {
    if (newCurr === currency && paymentData?.currency === newCurr) return;
    setCurrency(newCurr);

    const isRiel = newCurr === 'KHR';
    const rawPrice = selectedProduct?.price || 0.95;
    const targetAmount = isRiel ? Math.round(rawPrice * 4100) : rawPrice;

    setPaymentData(prev => prev ? ({ ...prev, currency: newCurr, amount: targetAmount }) : prev);

    if (orderId) {
      try {
        let currentUser = null;
        try {
          const stored = localStorage.getItem('user');
          if (stored) currentUser = JSON.parse(stored);
        } catch (e) {}

        const pId = formData.playerID ? formData.playerID.trim() : '';
        const sId = formData.serverID ? formData.serverID.trim() : '11446';
        const playerAccName = verifiedAccount?.name || '';
        const customerId = currentUser?.userId || currentUser?.id || '';
        const gameTitle = selectedGame?.name || 'Mobile Legends: Bang Bang';
        const pkgName = selectedProduct?.name || `${selectedProduct?.diamondAmount || 55} Diamonds`;

        const payRes = await paywayAPI.create({
          orderId,
          amount: targetAmount,
          currency: newCurr,
          player_id: pId,
          server_id: sId,
          account_name: playerAccName,
          customer_id: customerId,
          game_name: gameTitle,
          package_name: pkgName
        });

        if (payRes?.data) {
          const pd = payRes.data;
          setPaymentData(prev => ({
            ...prev,
            ...pd,
            amount: targetAmount,
            currency: newCurr,
            tranId: pd.tranId,
            qrString: pd.qrString || null,
            abapayDeeplink: pd.abapayDeeplink || pd.checkoutUrl,
            khqrDeeplink: pd.abapayDeeplink || pd.checkoutUrl,
            md5Hash: pd.md5,
            formData: pd.formData,
            purchaseUrl: pd.purchaseUrl,
            checkoutUrl: pd.checkoutUrl,
            merchantName: 'DETH PHEAK',
            gateway: 'aba_payway'
          }));
        }
      } catch (err) {
        console.warn('Currency switch notice:', err?.message);
      }
    }
  };


  // Automatically trigger ABA Official Checkout Popup via AbaPayway.checkout() directly in the browser
  useEffect(() => {
    // ABA Rule: Do NOT automatically close or hide the official ABA checkout popup upon payment.
    // The official popup must remain visible so the customer can view the Success screen,
    // download the official ABA receipt, and click "Continues Shopping" at their own discretion.
    if (paymentData && !paymentPaid && paymentData.gateway === 'aba_payway') {
      const openOfficialAbaCheckout = () => {
        const payway = getAbaPaywayInstance();
        if (payway && typeof payway.checkout === 'function') {
          try {
            // 1. Ensure official desktop container exists in DOM
            let abaContainer = document.getElementById('aba-checkout');
            if (!abaContainer) {
              abaContainer = document.createElement('div');
              abaContainer.id = 'aba-checkout';
              document.body.appendChild(abaContainer);
            }

            // Remove any legacy custom sheet covering if present to keep ABA interface 100% clean
            const legacySheet = document.getElementById('aba_checkout_sheet');
            if (legacySheet) {
              legacySheet.remove();
            }

            const purchaseUrl = paymentData.purchaseUrl || "https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/purchase";

            // Prepare #aba_merchant_request form in DOM with target="aba_webservice"
            let form = document.getElementById('aba_merchant_request');
            if (!form) {
              form = document.createElement('form');
              form.id = 'aba_merchant_request';
              form.method = 'POST';
              form.target = 'aba_webservice';
              form.style.display = 'none';
              document.body.appendChild(form);
            }
            form.action = purchaseUrl;
            form.target = 'aba_webservice';
            form.innerHTML = '';
            if (paymentData.formData) {
              Object.entries(paymentData.formData).forEach(([k, v]) => {
                const inp = document.createElement('input');
                inp.type = 'hidden';
                inp.name = k;
                inp.value = v != null ? String(v) : '';
                if (k === 'payment_option') {
                  inp.className = 'payment_option';
                }
                form.appendChild(inp);
              });
            }

            // Ensure payment_option input exists per ABA guidance
            if (!form.querySelector('input[name="payment_option"]')) {
              const opt = document.createElement('input');
              opt.type = 'hidden';
              opt.name = 'payment_option';
              opt.className = 'payment_option';
              opt.value = 'abapay_khqr';
              form.appendChild(opt);
            }

            // Launch official ABA PayWay popup / mobile drawer per ABA specification
            payway.checkout();

            console.log('[ABA PayWay] Official AbaPayway.checkout() launched successfully (Mobile & Desktop)!');
            return true;
          } catch (e) {
            console.warn('[ABA PayWay] AbaPayway.checkout() notice:', e);
          }
        }
        return false;
      };

      if (!openOfficialAbaCheckout()) {
        let attempts = 0;
        const interval = setInterval(() => {
          attempts++;
          if (openOfficialAbaCheckout() || attempts >= 40) {
            clearInterval(interval);
          }
        }, 100);
        return () => clearInterval(interval);
      }
    }
  }, [paymentData, paymentPaid]);

  // Transaction Lifetime Countdown Timer (6 minutes / 360 seconds matching ABA PayWay standard: 5-15 mins)
  useEffect(() => {
    if (!paymentData || paymentPaid) return;
    timeLeftRef.current = 360;
    setQrExpired(false);
    qrExpiredRef.current = false;
    const timer = setInterval(() => {
      timeLeftRef.current -= 1;
      if (timeLeftRef.current <= 0) {
        clearInterval(timer);
        // Step ③ & ④: Stop checking & safely end the process within lifetime (5-15 min rule)
        setQrExpired(true);
        qrExpiredRef.current = true;
        closeAbaCheckoutPopup();
        setError('Transaction lifetime reached. Please initiate a new top-up request.');
        const curTranId = paymentData?.tranId || paymentData?.formData?.tran_id;
        if (curTranId && paymentData?.gateway === 'aba_payway') {
          try {
            paywayAPI.close(curTranId).catch(() => {});
          } catch (e) {}
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [paymentData, paymentPaid]);

  // Lock scroll & hide floating navigation ONLY when our internal non-ABA checkout modal is active
  useEffect(() => {
    // ABA PayWay manages its own drawer/modal; only lock body for internal modals or receipt
    if (paymentData && !paymentPaid && paymentData.gateway !== 'aba_payway') {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && paymentData && !paymentPaid) {
        closeAbaCheckoutPopup();
        setPaymentData(null);
        setOrderId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.classList.remove('modal-open');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [paymentData, paymentPaid]);

  // Listen for ABA PayWay postMessage events and custom close events to guarantee scroll unlock
  useEffect(() => {
    const handleAbaMessage = (e) => {
      try {
        const data = e.data;
        if (!data) return;
        if (data.close || data.merchantUrl === '' || data.merchantUrl) {
          closeAbaCheckoutPopup();
        }
      } catch (err) {}
    };

    const handleAbaClosedEvent = () => {
      closeAbaCheckoutPopup();
    };

    window.addEventListener('message', handleAbaMessage);
    window.addEventListener('abaCheckoutClosed', handleAbaClosedEvent);

    return () => {
      window.removeEventListener('message', handleAbaMessage);
      window.removeEventListener('abaCheckoutClosed', handleAbaClosedEvent);
      closeAbaCheckoutPopup();
    };
  }, []);



  const [, startTransition] = useTransition();
  const carouselContainerRef = useRef(null);

  // Unified smooth game selection (preserves window vertical scroll position)
  // eslint-disable-next-line no-unused-vars
  const handleSelectGame = useCallback((game, e = null) => {
    if (!game || game.id === selectedGame.id) return;

    // Scroll ONLY the carousel container horizontally without moving window vertically
    if (e?.currentTarget && carouselContainerRef.current) {
      const container = carouselContainerRef.current;
      const target = e.currentTarget;
      const targetRect = target.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const scrollOffset = (targetRect.left + targetRect.width / 2) - (containerRect.left + containerRect.width / 2);
      container.scrollBy({ left: scrollOffset, behavior: 'smooth' });
    }

    // Update URL query parameter cleanly without reload
    setSearchParams({ game: game.id }, { replace: true });

    const newPkgs = getPackagesForGame(game.id);

    // Non-blocking transition for smooth 60fps UI
    startTransition(() => {
      setSelectedGame(game);
      setProducts(newPkgs);
      setSelectedProduct(newPkgs[0]);
      setFormData(prev => ({
        ...prev,
        playerID: '',
        serverID: game.id.startsWith('mlbb') ? '' : 'Global',
        productId: newPkgs[0]?.productId || 100,
        paymentMethod: 'abapayway'
      }));
      setVerifiedAccount(null);
      setPaymentData(null);
      setOrderId(null);
      setPaymentPaid(false);
      setAwaitingBalance(false);
      setConfirmSent(false);
    });
  }, [selectedGame.id, getPackagesForGame, setSearchParams]);

  // Sync game from URL (only if changed externally e.g. browser back/forward or direct link)
  useEffect(() => {
    if (!rawGameParam) return;
    const gameObj = allGames.find(g => g.id === rawGameParam || g.id.startsWith(rawGameParam));
    if (gameObj && gameObj.id !== selectedGame.id) {
      const newPkgs = getPackagesForGame(gameObj.id);
      startTransition(() => {
        setSelectedGame(gameObj);
        setProducts(newPkgs);
        setSelectedProduct(newPkgs[0]);
        setFormData(prev => ({
          ...prev,
          productId: newPkgs[0]?.productId || 100,
          serverID: gameObj.id.startsWith('mlbb') ? '' : (prev.serverID || 'Global')
        }));
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawGameParam]);

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

  const currentTranIdRef = useRef(paymentData?.tranId || paymentData?.tran_id || paymentData?.formData?.tran_id);
  currentTranIdRef.current = paymentData?.tranId || paymentData?.tran_id || paymentData?.formData?.tran_id;

  const currentMd5Ref = useRef(paymentData?.khqrMd5Hash || paymentData?.md5Hash);
  currentMd5Ref.current = paymentData?.khqrMd5Hash || paymentData?.md5Hash;

  // Real-Time Poller Telemetry for ABA PayWay QA Verification
  const pollCountRef = useRef(0);
  const [pollTelemetry, setPollTelemetry] = useState({
    count: 0,
    status: 'PENDING',
    lastTime: null,
    tranId: null
  });

  // Reset telemetry upon new transaction
  useEffect(() => {
    const tid = paymentData?.tranId || paymentData?.tran_id || paymentData?.formData?.tran_id;
    pollCountRef.current = 0;
    setPollTelemetry({
      count: 0,
      status: 'PENDING',
      lastTime: null,
      tranId: tid || null
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentData?.tranId]);

  const checkPaymentStatus = useCallback(async () => {
    const curOrderId = currentOrderIdRef.current;
    const curTranId = currentTranIdRef.current;

    if (!curOrderId || paymentPaidRef.current || isCheckingRef.current || qrExpiredRef.current) return false;
    isCheckingRef.current = true;

    const triggerPaidTransition = async () => {
      // ABA Rule: Do NOT automatically dismiss ABA popup. Keep the official Success screen active so customer can view it and download receipt!
      console.log(
        `%c[ABA PayWay V2 Poller] 🚀 PAYMENT DETECTED (PAID) for Order #${curOrderId}! Official ABA Success interface will remain active.`,
        'color: #10b981; font-weight: 900; font-size: 13px; background: #064e3b; padding: 3px 6px; border-radius: 4px;'
      );

      playSuccessSound();
      setPaymentPaid(true);
      paymentPaidRef.current = true;
    };

    try {
      let isPaidConfirmed = false;

      // Real direct bank checking via ABA PayWay V2 endpoint (check-transaction-2)
      if (curTranId) {
        pollCountRef.current += 1;
        const currentCount = pollCountRef.current;
        const timeStr = new Date().toLocaleTimeString();

        try {
          const r = await paywayAPI.checkStatus(curTranId, curOrderId);
          const payStatus = (r?.data?.status || '').toUpperCase() || 'PENDING';

          setPollTelemetry({
            count: currentCount,
            status: payStatus,
            lastTime: timeStr,
            tranId: curTranId
          });

          console.log(
            `%c[ABA PayWay V2 Poller] ⏱️ ${timeStr} | Check #${currentCount} (+3.0s) | Target: check-transaction-2 | TranID: ${curTranId} | Status: ${payStatus}`,
            'color: #0284c7; font-weight: bold; background: #e0f2fe; padding: 2px 6px; border-radius: 4px;'
          );

          if (r?.data?.isPaid === true || payStatus === 'APPROVED' || payStatus === 'PAID' || payStatus === 'SUCCESS') {
            console.log(
              `%c[ABA PayWay V2 Poller] ✅ PayWay Bank API confirmed PAID (TranID: ${curTranId}, Total Checks: ${currentCount})`,
              'color: #10b981; font-weight: bold; background: #064e3b; padding: 2px 6px; border-radius: 4px;'
            );
            isPaidConfirmed = true;
          } else if (payStatus === 'EXPIRED' || payStatus === 'DECLINED' || payStatus === 'CANCELLED') {
            console.log(
              `%c[ABA PayWay V2 Poller] ⏹ Transaction ${payStatus} (TranID: ${curTranId}, Total Checks: ${currentCount})`,
              'color: #ef4444; font-weight: bold; background: #450a0a; padding: 2px 6px; border-radius: 4px;'
            );
            setQrExpired(true);
            qrExpiredRef.current = true;
            return false;
          }
        } catch (pwErr) {
          console.warn('[ABA PayWay V2 Poller] PayWay status error:', pwErr?.message);
        }
      }

      // Always check .NET backend DB via quick-status as fallback
      if (!isPaidConfirmed && curOrderId) {
        try {
          const ordCheckRes = await ordersAPI.getQuickStatus(curOrderId);
          const ordCheck = ordCheckRes?.data;
          if (ordCheck?.isPaid === true || ordCheck?.paymentStatus === 'Paid') {
            console.log(`%c[ABA PayWay Tracker] ✓ Backend DB confirmed PAID for Order #${curOrderId}`, 'color: #10b981; font-weight: bold;');
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
          return true;
        }
        await triggerPaidTransition();
        return true;
      }
    } catch (err) {
      console.warn('[ABA PayWay Tracker] Notice:', err?.message);
    } finally {
      isCheckingRef.current = false;
    }

    return false;
  }, []);

  // Automatic Real-Time Polling (ABA PayWay Recommended Logic Flow: wait 3s, then check consistently every 3s until expiry or approval)
  useEffect(() => {
    const curTranId = paymentData?.tranId || paymentData?.tran_id || paymentData?.formData?.tran_id;
    // Step ③: Stop checking when payment is Approved/done or when transaction lifetime expires
    if (!orderId || paymentPaid || qrExpired || !curTranId) return;

    let timerId = null;
    let isCancelled = false;

    const poll = async () => {
      if (isCancelled || paymentPaidRef.current || qrExpiredRef.current) return;

      try {
        await checkPaymentStatus();
      } catch (e) {}

      // Consistently wait exactly 3 seconds AFTER previous request completes before sending next check
      if (!isCancelled && !paymentPaidRef.current && !qrExpiredRef.current) {
        timerId = setTimeout(poll, 3000);
      }
    };

    // Step ②: Wait exactly 3 seconds after initiating before starting the first check
    timerId = setTimeout(poll, 3000);

    return () => {
      isCancelled = true;
      if (timerId) clearTimeout(timerId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, paymentData?.tranId, paymentPaid, qrExpired, checkPaymentStatus]);


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
    // Reset payment states for new attempt
    setPaymentPaid(false);
    paymentPaidRef.current = false;
    setPaymentData(null);
    setQrExpired(false);
    qrExpiredRef.current = false;

    try {
      const isRiel = currency === 'KHR';
      const rawPrice = selectedProduct?.price || 0.95;
      const targetAmount = isRiel ? Math.round(rawPrice * 4100) : rawPrice;
      const effectiveDiamonds = selectedProduct?.diamondAmount || 55;

      // Auto-fetch Player Account Name if user didn't click check button
      let playerAccName = verifiedAccount?.name || '';
      const pId = formData.playerID ? formData.playerID.trim() : '';
      const sId = formData.serverID ? formData.serverID.trim() : '11446';
      if (!playerAccName && selectedGame?.id?.startsWith('mlbb') && pId) {
        try {
          const directCheck = await fetch(`https://api.isan.eu.org/nickname/ml?id=${pId}&server=${sId}`).then(r => r.json());
          if (directCheck?.name) {
            playerAccName = directCheck.name;
            setVerifiedAccount({
              valid: true,
              name: directCheck.name,
              country: directCheck.country || 'Cambodia',
              id: pId,
              server: sId
            });
          }
        } catch (e) {}
      }

      let currentUser = null;
      try {
        const stored = localStorage.getItem('user');
        if (stored) currentUser = JSON.parse(stored);
      } catch (e) {}

      const customerId = currentUser?.userId || currentUser?.id || '';
      const customerName = currentUser?.username || currentUser?.name || '';
      const customerPhone = currentUser?.phone || formData.customerPhone || '';
      const gameTitle = selectedGame?.name || 'Mobile Legends: Bang Bang';
      const pkgName = selectedProduct?.name || `${effectiveDiamonds} Diamonds`;

      const orderPayload = {
        playerID: pId,
        serverID: formData.serverID ? formData.serverID.trim() : 'Global',
        productId: selectedProduct?.productId || 12,
        customDiamondAmount: effectiveDiamonds,
        price: rawPrice,
        amount: targetAmount,
        currency: currency,
        paymentMethod: 'abapayway',
        accountName: playerAccName,
        customerName: customerName,
        customerPhone: customerPhone,
        gameName: gameTitle
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

      // Official ABA PayWay Gateway (Strict adherence to ABA Technical Specification)
      // Retry once on failure to handle Render.com cold starts (backend may need ~30s to wake)
      const paywayPayload = {
        orderId: activeOrderId,
        amount: targetAmount,
        currency: currency,
        player_id: pId,
        server_id: sId,
        account_name: playerAccName,
        customer_id: customerId,
        game_name: gameTitle,
        package_name: pkgName
      };

      let directRes = null;
      try {
        directRes = await paywayAPI.create(paywayPayload);
      } catch (firstErr) {
        console.warn('ABA PayWay first attempt failed, retrying in 4s...', firstErr?.message);
        // Show "connecting" feedback while backend wakes up
        setError('');
        setLoading(true);
        await new Promise(r => setTimeout(r, 4000));
        try {
          directRes = await paywayAPI.create(paywayPayload);
        } catch (retryErr) {
          console.error('ABA PayWay retry also failed:', retryErr);
          setError(
            retryErr.response?.data?.message ||
            firstErr.response?.data?.message ||
            'Could not connect to ABA PayWay gateway. Please check your internet and try again.'
          );
        }
      }

      if (directRes) {
        const pd = directRes?.data;
        if (pd?.tranId && (pd?.formData || pd?.purchaseUrl)) {
          createdPayment = {
            orderId: activeOrderId,
            amount: targetAmount,
            currency: currency,
            tranId: pd.tranId,
            qrString: pd.qrString || null,
            abapayDeeplink: pd.abapayDeeplink || pd.checkoutUrl,
            khqrDeeplink: pd.abapayDeeplink || pd.checkoutUrl,
            md5Hash: pd.md5,
            khqrMd5Hash: pd.md5,
            khqrQRCode: pd.qrString || null,
            formData: pd.formData,
            purchaseUrl: pd.purchaseUrl,
            checkoutUrl: pd.checkoutUrl,
            merchantName: 'DETH PHEAK',
            gateway: 'aba_payway'
          };
        } else {
          setError(pd?.message || 'Failed to initialize ABA PayWay transaction. Please try again.');
        }
      }

      if (createdPayment) {
        setPaymentData({
          ...createdPayment,
          amount: targetAmount,
          currency: currency
        });
      }
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
      {/* Top-Up Paused / Closed Maintenance Notice Banner (Classic Fintech & Multilingual) */}
      {isTopupDisabled && (
        <div className={`relative overflow-hidden rounded-[22px] p-4 sm:p-5 mb-6 border backdrop-blur-xl shadow-2xl transition-all duration-300 select-none ${
          isClosed
            ? 'bg-gradient-to-r from-[#200d14]/95 via-[#180a0f]/95 to-[#0e0508]/98 border-rose-500/35 shadow-[0_10px_35px_rgba(0,0,0,0.6),0_0_20px_rgba(244,63,94,0.12)]'
            : 'bg-gradient-to-r from-[#1f1608]/95 via-[#171106]/95 to-[#0f0b04]/98 border-amber-500/35 shadow-[0_10px_35px_rgba(0,0,0,0.6),0_0_20px_rgba(245,158,11,0.12)]'
        }`}>
          {/* Top Specular Sheen Line */}
          <div className={`absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent ${
            isClosed ? 'via-rose-400/50' : 'via-amber-400/50'
          } to-transparent pointer-events-none`} />

          {/* Background Ambient Glow */}
          <div className={`absolute -right-10 -top-10 w-40 h-40 rounded-full blur-3xl pointer-events-none ${
            isClosed ? 'bg-rose-500/10' : 'bg-amber-500/10'
          }`} />

          <div className="relative z-10 flex items-start sm:items-center gap-3.5 sm:gap-4">
            {/* 3D Glass Icon Medallion */}
            <div className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-lg ${
              isClosed
                ? 'bg-gradient-to-br from-rose-500/25 via-rose-600/15 to-rose-950/40 border-rose-400/40 shadow-rose-950/50 text-rose-300'
                : 'bg-gradient-to-br from-amber-500/25 via-amber-600/15 to-amber-950/40 border-amber-400/40 shadow-amber-950/50 text-amber-300'
            }`}>
              {/* Inner Specular Highlight */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />

              {/* Pulsing Corner Status Dot */}
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isClosed ? 'bg-rose-400' : 'bg-amber-400'
                }`} />
                <span className={`relative inline-flex rounded-full h-3 w-3 border-2 ${
                  isClosed ? 'border-[#180a0f] bg-rose-500' : 'border-[#171106] bg-amber-500'
                }`} />
              </span>

              {/* Classic SVG Vector Icon */}
              {isClosed ? (
                <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                </svg>
              ) : (
                <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="6" y="4" width="4" height="16" rx="1.5" />
                  <rect x="14" y="4" width="4" height="16" rx="1.5" />
                </svg>
              )}
            </div>

            {/* Notice Text Content */}
            <div className="flex-1 min-w-0">
              {/* Micro Status Badge */}
              <div className="flex items-center gap-2 mb-1">
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider font-mono border ${
                  isClosed
                    ? 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                    : 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                }`}>
                  <span className={`w-1 h-1 rounded-full ${isClosed ? 'bg-rose-400' : 'bg-amber-400'}`} />
                  <span>{t('status_notice_badge')}</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono tracking-wide truncate">
                  {selectedGame?.name}
                </span>
              </div>

              {/* Classic Gold / Ruby Metallic Gradient Header */}
              <h3 className={`text-sm sm:text-base font-black tracking-wide font-khmer uppercase ${
                isClosed
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-rose-300 to-red-400 drop-shadow-sm'
                  : 'text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-yellow-400 drop-shadow-sm'
              }`}>
                {noticeTitle}
              </h3>

              {/* Refined Description */}
              <p className="text-xs sm:text-[13px] leading-relaxed text-slate-200/90 font-khmer mt-0.5">
                {noticeDesc}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. NEW LUXURY GAME SHOWCASE & PLAYER INFORMATION HERO     */}
      {/* Exactly matching reference design media_1791047969801.png */}
      {/* ========================================================= */}
      {/* ========================================================= */}
      {/* 1. NEW LUXURY GAME SHOWCASE & PLAYER INFORMATION HERO     */}
      {/* Side-by-side with best mobile responsiveness               */}
      {/* ========================================================= */}
      <div className="flex flex-row gap-2 sm:gap-4 md:gap-6 items-stretch mb-6 sm:mb-8">

        {/* ========================================== */}
        {/* LEFT COLUMN: GAME ARTWORK SHOWCASE & BANNER */}
        {/* ========================================== */}
        <div className="w-[34%] xs:w-[36%] sm:w-[38%] lg:w-[40%] relative rounded-2xl sm:rounded-3xl lg:rounded-[28px] overflow-hidden bg-[#040817] border border-sky-500/40 shadow-[0_0_25px_rgba(14,165,233,0.22)] flex flex-col justify-between group min-h-[300px] xs:min-h-[330px] sm:min-h-[400px] shrink-0">
          
          {/* Background Image / Banner Carousel */}
          <div className="absolute inset-0 z-0">
            <img
              src={
                selectedGame.id.startsWith('mlbb')
                  ? (MLBB_BANNERS[activeBannerIdx] || '/images/mlbb_hero_banner.png')
                  : (selectedGame.image || selectedGame.localFallbackImage || '/mlbb-logo.png')
              }
              alt={selectedGame.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = selectedGame.localFallbackImage || '/mlbb-logo.png';
              }}
              className="w-full h-full object-cover object-center transition-all duration-700 group-hover:scale-105"
            />
            {/* Cinematic Vignette & Ambient Glow Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#040817] via-transparent to-black/40 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/30 pointer-events-none" />
          </div>

          {/* Top Bar: Official Game Brand Emblem (Left) & Back Button (Right) */}
          <div className="relative z-10 p-2.5 xs:p-3 sm:p-5 flex items-center justify-between">
            {/* Official Game Logo Badge */}
            <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-2.5 bg-black/60 backdrop-blur-md px-2 py-1 xs:px-2.5 sm:px-3 sm:py-1.5 rounded-xl sm:rounded-2xl border border-white/10 shadow-lg">
              {selectedGame.id.startsWith('mlbb') ? (
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-5 h-5 xs:w-6 xs:h-6 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-amber-400 to-yellow-600 p-0.5 flex items-center justify-center shadow-md shrink-0">
                    <span className="font-black text-slate-950 text-[10px] xs:text-xs sm:text-sm tracking-tighter">M</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[8px] xs:text-[9px] sm:text-[11px] font-black text-white tracking-wider sm:tracking-widest leading-none drop-shadow">MOBILE LEGENDS</span>
                    <span className="text-[7px] xs:text-[8px] sm:text-[9px] font-bold text-amber-400 tracking-wider leading-none mt-0.5 hidden xs:block">BANG BANG</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] sm:text-xs font-black text-white tracking-wide truncate max-w-[80px] xs:max-w-none">{selectedGame.name}</span>
                </div>
              )}
            </div>

            {/* Back Button to Home */}
            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-slate-950/80 hover:bg-slate-900 backdrop-blur-xl text-white hover:text-cyan-300 flex items-center justify-center text-sm sm:text-lg font-black border border-white/20 hover:border-cyan-400/80 cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 shadow-md shrink-0 ml-1"
              title="Back to Home"
            >
              ‹
            </button>
          </div>

          {/* Bottom Artwork Content: Slogan, 5v5 Emblem & Carousel Dots */}
          <div className="relative z-10 p-2.5 xs:p-3 sm:p-6 mt-auto flex flex-col justify-end space-y-2 sm:space-y-4">
            {!selectedGame.id.startsWith('mlbb') && (
              <div className="flex flex-col select-none min-w-0">
                <span className="text-[11px] xs:text-sm sm:text-2xl lg:text-3xl font-black uppercase leading-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] line-clamp-3 break-words">
                  {selectedGame.name}
                </span>
                {selectedGame.currency && (
                  <span className="mt-1 self-start max-w-full truncate px-1.5 sm:px-2.5 py-0.5 rounded-full bg-sky-500/20 border border-sky-400/40 text-sky-200 text-[8px] xs:text-[9px] sm:text-xs font-bold uppercase tracking-wider">
                    {selectedGame.currency}
                  </span>
                )}
              </div>
            )}
            {/* Slogan & 5v5 Metallic Emblem Row (MLBB only) */}
            {selectedGame.id.startsWith('mlbb') && (
            <div className="flex items-end justify-between gap-1 sm:gap-3">
              {/* Glowing Slogan: LEGENDS NEVER FADE */}
              <div className="flex flex-col select-none">
                <span className="text-xs xs:text-sm sm:text-2xl lg:text-3xl font-black italic tracking-wide sm:tracking-wider leading-none uppercase text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-cyan-300 to-blue-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.85)] font-sans">
                  LEGENDS
                </span>
                <span className="text-xs xs:text-sm sm:text-2xl lg:text-3xl font-black italic tracking-wide sm:tracking-wider leading-tight uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-300 to-indigo-300 drop-shadow-[0_0_12px_rgba(56,189,248,0.85)] font-sans">
                  NEVER FADE
                </span>
              </div>

              {/* 3D Golden 5v5 Emblem */}
              <div className="relative select-none shrink-0">
                <div className="text-lg xs:text-2xl sm:text-4xl lg:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[#FFF2B2] via-[#E8B931] to-[#9E6E00] drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                  5v5
                </div>
              </div>
            </div>
            )}

            {/* Carousel Pagination Controls: < ● ○ ○ ○ > */}
            {selectedGame.id.startsWith('mlbb') && (
            <div className="flex items-center justify-center gap-1.5 sm:gap-3 pt-1">
              <button
                type="button"
                onClick={() => setActiveBannerIdx((prev) => (prev > 0 ? prev - 1 : MLBB_BANNERS.length - 1))}
                className="text-slate-400 hover:text-cyan-300 text-xs sm:text-sm font-black px-1 py-0.5 transition-colors cursor-pointer"
                title="Previous Banner"
              >
                ‹
              </button>
              <div className="flex items-center gap-1 sm:gap-1.5">
                {MLBB_BANNERS.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveBannerIdx(idx)}
                    className={`rounded-full transition-all duration-300 cursor-pointer ${
                      activeBannerIdx === idx
                        ? 'w-3.5 sm:w-5 h-1.5 sm:h-2 bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_8px_rgba(34,211,238,0.8)]'
                        : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-slate-600/80 hover:bg-slate-400'
                    }`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => setActiveBannerIdx((prev) => (prev < MLBB_BANNERS.length - 1 ? prev + 1 : 0))}
                className="text-slate-400 hover:text-cyan-300 text-xs sm:text-sm font-black px-1 py-0.5 transition-colors cursor-pointer"
                title="Next Banner"
              >
                ›
              </button>
            </div>
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: GAME INFO, 4 FEATURE PILLS & PLAYER INFO HUB */}
        {/* ======================================================== */}
        <div className="flex-1 min-w-0 rounded-2xl sm:rounded-3xl lg:rounded-[28px] border border-sky-500/40 bg-[#060c21]/95 backdrop-blur-2xl p-2.5 xs:p-3 sm:p-5 lg:p-6 shadow-[0_0_25px_rgba(14,165,233,0.22)] flex flex-col justify-between space-y-2 sm:space-y-3.5">
          
          <div>
            {/* Row 1: Game Header with Glowing Icon, Title, Subtitle & Popular Badge */}
            <div className="flex items-center justify-between gap-1.5 sm:gap-3">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                {/* Glowing Game Icon Frame */}
                <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-13 sm:h-13 rounded-xl sm:rounded-2xl bg-slate-950 border border-sky-500/80 shadow-[0_0_12px_rgba(14,165,233,0.5)] p-0.5 sm:p-1.5 flex items-center justify-center shrink-0">
                  <img
                    key={selectedGame.id}
                    src={selectedGame.id.startsWith('mlbb') ? '/images/mlbb_square_logo.png' : (selectedGame.image || selectedGame.localFallbackImage || '/mlbb-logo.png')}
                    alt={selectedGame.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = selectedGame.localFallbackImage || selectedGame.image || '/mlbb-logo.png';
                    }}
                    className={`w-full h-full rounded-lg sm:rounded-xl ${selectedGame.id.startsWith('mlbb') ? 'object-contain' : 'object-cover'}`}
                  />
                </div>
                
                {/* Title & Subtitle */}
                <div className="min-w-0">
                  <h1 className="text-xs xs:text-sm sm:text-xl lg:text-2xl font-black text-white tracking-wide uppercase leading-tight font-sans">
                    {selectedGame.name}
                  </h1>
                  <span className="text-[9px] xs:text-[10px] sm:text-[13px] text-slate-400 font-medium block truncate mt-0.5">
                    {selectedGame.publisher || 'Moonton'} • {selectedGame.id.startsWith('mlbb') ? '5v5 Multiplayer' : (selectedGame.currency || 'Official Service')}
                  </span>
                </div>
              </div>

              {/* Popular Badge */}
              <div className="shrink-0">
                <span className="px-1.5 xs:px-2 sm:px-3 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 text-[8px] xs:text-[9px] sm:text-xs font-bold shadow-sm flex items-center gap-1">
                  <span className="text-cyan-300">★</span>
                  <span>Popular</span>
                </span>
              </div>
            </div>

            {/* Row 2: Description Text (Visible on sm and up to save mobile space) */}
            <p className="hidden sm:block text-xs sm:text-[13px] text-slate-300 leading-relaxed mt-2.5 mb-2.5 font-sans">
              {selectedGame.id.startsWith('mlbb')
                ? 'Join the ultimate 5v5 battle arena! Team up with your friends, choose your hero, and fight for victory in Mobile Legends: Bang Bang.'
                : (selectedGame.description || 'Fast, secure, and instant automated direct UID game top-up delivery with official API.')}
            </p>
          </div>

          {/* ======================================================== */}
          {/* PLAYER INFORMATION BOX — clean, modern, mobile-first      */}
          {/* ======================================================== */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] sm:text-sm font-bold text-white flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                <span className="truncate">{language === 'km' ? 'ព័ត៌មានអ្នកលេង' : 'Player Information'}</span>
              </span>
              <button
                type="button"
                onClick={() => setShowIdGuide(true)}
                className="shrink-0 inline-flex items-center gap-1 text-[9.5px] sm:text-[11px] text-cyan-300 hover:text-white font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-400/25 hover:border-cyan-300/60 transition-colors cursor-pointer"
              >
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.1 9a3 3 0 015.8 1c0 2-3 3-3 3M12 17h.01" /></svg>
                <span>{language === 'km' ? 'រក ID?' : 'Where is ID?'}</span>
              </button>
            </div>

            {/* Main Inner Card */}
            <div className="relative p-2.5 sm:p-4 rounded-2xl bg-gradient-to-b from-[#071030] to-[#040a1e] border border-sky-500/25 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] space-y-2.5 sm:space-y-3">

              {/* Profile Status Row: Avatar + name/status */}
              <div className="flex items-center gap-2.5">
                <div className="relative w-9 h-9 sm:w-12 sm:h-12 shrink-0">
                  <div className={`w-full h-full rounded-full p-[2px] ${verifiedAccount?.valid ? 'bg-gradient-to-tr from-emerald-400 to-cyan-300 shadow-[0_0_12px_rgba(52,211,153,0.55)]' : 'bg-gradient-to-tr from-sky-400 via-blue-500 to-cyan-300 shadow-[0_0_12px_rgba(56,189,248,0.5)]'}`}>
                    <img src="/images/gamer_avatar_pro.png" alt="Player Avatar" className="w-full h-full object-cover rounded-full bg-slate-900" />
                  </div>
                  <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border-2 border-[#050b20] ${verifiedAccount?.valid ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] sm:text-sm font-extrabold text-white truncate leading-tight">
                    {verifiedAccount?.valid ? verifiedAccount.name : (language === 'km' ? 'មិនទាន់ផ្ទៀងផ្ទាត់' : 'Guest Player')}
                  </div>
                  <div className={`text-[9px] sm:text-[11px] truncate mt-0.5 font-medium ${verifiedAccount?.valid ? 'text-emerald-400' : verifiedAccount && !verifiedAccount.valid ? 'text-rose-400' : 'text-slate-400'}`}>
                    {verifiedAccount?.valid
                      ? `✓ ${verifiedAccount.id} (${verifiedAccount.server}) • ${verifiedAccount.country || 'Cambodia'}`
                      : verifiedAccount && !verifiedAccount.valid
                        ? (verifiedAccount.error || 'Player account not found.')
                        : (language === 'km' ? 'បញ្ចូល UID ដើម្បីផ្ទៀងផ្ទាត់' : 'Enter UID to verify account')}
                  </div>
                </div>
              </div>

              {/* Inputs */}
              <div className={`grid gap-2 ${isMlbb || isHoyoverse ? 'grid-cols-1 sm:grid-cols-[1fr_0.75fr]' : 'grid-cols-1'}`}>
                {/* Player ID with inline copy */}
                <div>
                  <label htmlFor="player_id_input" className="block text-[9.5px] sm:text-[11px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">
                    {isTelegram ? 'Telegram @' : isSteam ? 'Steam Name' : isGiftCard ? 'Email' : 'Player ID'}
                  </label>
                  <div className="relative">
                    <input
                      id="player_id_input"
                      type="text"
                      inputMode={isTelegram || isSteam || isGiftCard ? 'text' : 'numeric'}
                      value={formData.playerID}
                      onChange={handlePlayerIdChange}
                      placeholder={isTelegram ? '@username' : isSteam ? 'steam_username' : isGiftCard ? 'email@domain.com' : '123456789'}
                      className="w-full h-9 sm:h-10 bg-[#030817] border border-slate-700/70 rounded-xl pl-3 pr-9 text-xs sm:text-sm font-mono text-white placeholder-slate-600 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/25 transition-all"
                    />
                    <button
                      type="button"
                      onClick={handleCopyPlayerId}
                      disabled={!formData.playerID}
                      className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-sky-300 hover:bg-sky-500/10 disabled:opacity-30 transition-colors cursor-pointer"
                      title={copiedPlayerId ? 'Copied!' : 'Copy Player ID'}
                    >
                      {copiedPlayerId ? (
                        <svg className="w-3.5 h-3.5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                      ) : (
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Zone / Server */}
                {isMlbb && (
                  <div>
                    <label className="block text-[9.5px] sm:text-[11px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">Zone ID</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={formData.serverID}
                      onChange={(e) => setFormData(prev => ({ ...prev, serverID: e.target.value }))}
                      placeholder="11446"
                      className="w-full h-9 sm:h-10 bg-[#030817] border border-slate-700/70 rounded-xl px-3 text-xs sm:text-sm font-mono text-white placeholder-slate-600 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/25 transition-all"
                    />
                  </div>
                )}
                {isHoyoverse && (
                  <div>
                    <label className="block text-[9.5px] sm:text-[11px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">Server</label>
                    <select
                      value={formData.serverID}
                      onChange={(e) => setFormData(prev => ({ ...prev, serverID: e.target.value }))}
                      className="w-full h-9 sm:h-10 bg-[#030817] border border-slate-700/70 rounded-xl px-3 text-xs sm:text-sm text-white focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/25 transition-all"
                    >
                      <option value="Asia">Asia</option>
                      <option value="America">America</option>
                      <option value="Europe">Europe</option>
                      <option value="TW/HK/MO">TW/HK/MO</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Auto-detected message notice */}
              {autoDetectedMessage && (
                <div className="text-[10px] sm:text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                  <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                  <span className="truncate">{autoDetectedMessage}</span>
                </div>
              )}

              {/* Buttons */}
              <div className="space-y-2 pt-0.5">
                <button
                  type="button"
                  onClick={handleVerifyAccount}
                  disabled={accountChecking || !formData.playerID.trim()}
                  className={`w-full h-9 sm:h-10 rounded-xl border font-bold text-[11px] sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-[0.98] disabled:cursor-not-allowed ${
                    verifiedAccount?.valid
                      ? 'border-emerald-400/50 bg-emerald-500/10 text-emerald-300'
                      : 'border-sky-400/40 bg-sky-500/10 text-sky-200 hover:bg-sky-500/20 hover:border-sky-300/70 disabled:opacity-45'
                  }`}
                >
                  {accountChecking ? (
                    <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" /><path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>
                  ) : verifiedAccount?.valid ? (
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                  ) : (
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
                  )}
                  <span>{accountChecking ? 'Checking...' : verifiedAccount?.valid ? 'Verified' : 'Check Player Name'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleStartGameAction}
                  className="group/sg relative w-full h-10 sm:h-12 rounded-xl overflow-hidden bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 text-white font-black text-xs sm:text-base flex items-center justify-center gap-2 shadow-[0_8px_24px_-6px_rgba(14,165,233,0.75)] hover:shadow-[0_10px_30px_-4px_rgba(34,211,238,0.85)] active:scale-[0.98] transition-all cursor-pointer tracking-wide"
                >
                  <span className="absolute inset-0 -translate-x-full group-hover/sg:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                  <svg className="relative w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                  <span className="relative">Start Game</span>
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* ======================================================== */}
      {/* STEP 2: SELECT RECHARGE PACKAGE (DIAMONDS & PASSES)      */}
      {/* ======================================================== */}
      <div id="packages-section" className="space-y-6">
          <div className="bg-slate-900/30 border border-slate-800/50 rounded-[24px] p-3.5 sm:p-5 shadow-2xl backdrop-blur-md space-y-5">
            
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
                <div className="flex items-center gap-1 p-1 bg-[#0b0f19] rounded-xl border border-slate-800 shadow-inner">
                  <button
                    type="button"
                    onClick={() => setLayoutMode('tiles')}
                    className={`py-1.5 px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      layoutMode === 'tiles'
                        ? 'bg-[#1a2538] text-[#38bdf8] border border-[#38bdf8]/40 shadow-sm'
                        : 'text-slate-400 hover:text-white border border-transparent'
                    }`}
                    title="Tiles View"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
                      <span className="text-[11px] font-semibold">{t('layout_tiles')}</span>
                  </button>
  
                  <button
                    type="button"
                    onClick={() => setLayoutMode('grid')}
                    className={`py-1.5 px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      layoutMode === 'grid'
                        ? 'bg-[#1a2538] text-[#38bdf8] border border-[#38bdf8]/40 shadow-sm'
                        : 'text-slate-400 hover:text-white border border-transparent'
                    }`}
                    title="Large Icons View"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
                      <span className="text-[11px] font-semibold">{t('layout_large_icons')}</span>
                  </button>
  
                  <button
                    type="button"
                    onClick={() => setLayoutMode('list')}
                    className={`py-1.5 px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      layoutMode === 'list'
                        ? 'bg-[#1a2538] text-[#38bdf8] border border-[#38bdf8]/40 shadow-sm'
                        : 'text-slate-400 hover:text-white border border-transparent'
                    }`}
                    title="List Rows View"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                      <span className="text-[11px] font-semibold">{t('layout_list')}</span>
                  </button>
                </div>
              </div>
  
            {/* ===== Scrollable Product Frame ===== */}
            <div className="relative rounded-2xl border border-sky-500/30 bg-gradient-to-b from-[#060d24] to-[#030817] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_0_24px_rgba(14,165,233,0.12)] overflow-hidden">
              {/* Frame header */}
              <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-sky-500/20 bg-[#071232]/80 backdrop-blur">
                <span className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-sky-200">
                  <svg className="w-3.5 h-3.5 text-cyan-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h12l4 6-10 12L2 9z" /><path d="M2 9h20M12 21L8 9l4-6 4 6-4 12" /></svg>
                  <span>{language === 'km' ? 'កញ្ចប់' : 'Packages'}</span>
                  <span className="px-1.5 py-0.5 rounded-md bg-sky-500/15 border border-sky-400/30 text-[10px] font-mono text-sky-300">{products.filter(p => productCategoryTab === 'all' ? true : productCategoryTab === 'passes' ? (p.isPass || p.name?.toLowerCase().includes('pass') || p.name?.toLowerCase().includes('bundle') || [210, 440, 660, 880, 1100, 1320, 605, 500].includes(p.diamondAmount)) : !(p.isPass || p.name?.toLowerCase().includes('pass') || p.name?.toLowerCase().includes('bundle') || [210, 440, 660, 880, 1100, 1320, 605, 500].includes(p.diamondAmount))).length}</span>
                </span>
                <span className={`flex items-center gap-1 text-[10px] font-semibold transition-opacity ${listScroll.atBottom && listScroll.atTop ? 'opacity-0' : 'opacity-100'} text-slate-400`}>
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
                  <span>{language === 'km' ? 'អូសមើល' : 'Scroll'}</span>
                </span>
              </div>
              {/* Scroll progress bar */}
              <div className="h-[2px] bg-slate-800/60">
                <div className="h-full bg-gradient-to-r from-sky-500 to-cyan-300 shadow-[0_0_6px_rgba(34,211,238,0.8)] transition-[width] duration-150" style={{ width: `${Math.round(listScroll.progress * 100)}%` }} />
              </div>
              {/* Top fade */}
              <div className={`pointer-events-none absolute left-0 right-0 top-[38px] h-6 z-10 bg-gradient-to-b from-[#060d24] to-transparent transition-opacity duration-200 ${listScroll.atTop ? 'opacity-0' : 'opacity-100'}`} />
              <div
                ref={productListRef}
                onScroll={handleListScroll}
                className="product-scroll-frame max-h-[56vh] sm:max-h-[600px] overflow-y-auto overscroll-contain p-2 sm:p-3"
              >
              {(() => {
                const isPassItem = (p) => p.isPass || p.name?.toLowerCase().includes('pass') || p.name?.toLowerCase().includes('bundle') || [210, 440, 660, 880, 1100, 1320, 605, 500].includes(p.diamondAmount);

                const formatTagText = (rawTag) => {
                  if (!rawTag) return '';
                  if (rawTag.includes('220') && rawTag.includes('70')) return '+70 Aurora ⭐';
                  if (rawTag.includes('440') && rawTag.includes('140')) return '+140 Aurora ⭐';
                  return rawTag;
                };

                const getTagStyle = (tag) => {
                  if (!tag) return '';
                  const lower = tag.toLowerCase();
                  if (lower.includes('hot') || lower.includes('bonus') || lower.includes('best') || lower.includes('popular') || lower.includes('arura')) {
                    return 'border-[1.5px] border-[#FFE169] bg-gradient-to-b from-[#ff8c00] via-[#e65100] to-[#b32600] text-white shadow-[0_0_10px_rgba(255,140,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.4)]';
                  }
                  if (lower.includes('starter') || lower.includes('ticket')) {
                    return 'border-[1.5px] border-cyan-400 bg-gradient-to-b from-[#0284c7] via-[#0369a1] to-[#075985] text-white shadow-[0_0_10px_rgba(6,182,212,0.4),inset_0_1px_1px_rgba(255,255,255,0.3)]';
                  }
                  if (lower.includes('wdp') || lower.includes('pass') || lower.includes('starlight') || lower.includes('vip')) {
                    return 'border-[1.5px] border-purple-400 bg-gradient-to-b from-[#9333ea] via-[#7e22ce] to-[#581c87] text-white shadow-[0_0_10px_rgba(168,85,247,0.4),inset_0_1px_1px_rgba(255,255,255,0.3)]';
                  }
                  return 'border-[1.5px] border-emerald-400 bg-gradient-to-b from-[#059669] via-[#047857] to-[#065f46] text-white shadow-[0_0_10px_rgba(16,185,129,0.4),inset_0_1px_1px_rgba(255,255,255,0.3)]';
                };

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

                // ==================== MODE 1: TILES VIEW (COMPACT 2-3 COLUMNS) ====================
                // ==================== MODE 1: 100% POLISHED 2-COLUMN CYBER CARDS ====================
                if (layoutMode === 'tiles') {
                  return (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-2.5">
                      {filtered.map((pkg) => {
                        const isSelected = selectedProduct.productId === pkg.productId;
                        const isPass = isPassItem(pkg);
                        const tagLower = (pkg.tag || '').toLowerCase();
                        const isPopular = pkg.productId === 12 || pkg.diamondAmount === 55 || tagLower.includes('popular') || tagLower.includes('starter');
                        const isRecommend = !isPopular && (pkg.productId === 13 || pkg.diamondAmount === 86 || tagLower.includes('bonus') || tagLower.includes('recommend') || tagLower.includes('best'));
                        const ribbon = isPopular
                          ? { text: 'Popular', cls: 'from-orange-500 to-amber-500 text-white' }
                          : isRecommend
                            ? { text: 'Recommend', cls: 'from-amber-300 to-yellow-500 text-slate-950' }
                            : pkg.tag
                              ? { text: formatTagText(pkg.tag), cls: 'from-sky-600 to-indigo-600 text-white' }
                              : null;

                        return (
                          <button
                            type="button"
                            key={pkg.productId}
                            onClick={() => setSelectedProduct(pkg)}
                            className={`group relative rounded-2xl p-2.5 pt-3 sm:p-3 sm:pt-3.5 flex flex-col items-center text-center select-none transition-all duration-200 cursor-pointer overflow-hidden active:scale-[0.97] ${
                              isSelected
                                ? 'bg-gradient-to-b from-[#1a1530] to-[#0a0a1a] border border-amber-400 shadow-[0_0_0_1px_rgba(251,191,36,0.6),0_6px_18px_-6px_rgba(251,191,36,0.55)]'
                                : 'bg-gradient-to-b from-[#0b1430] to-[#050a1a] border border-sky-500/20 hover:border-sky-400/60 hover:-translate-y-0.5'
                            }`}
                          >
                            {/* Glow behind artwork */}
                            <span className={`pointer-events-none absolute top-3 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full blur-2xl transition-opacity ${isSelected ? 'bg-amber-400/30' : 'bg-sky-500/25 group-hover:bg-sky-400/40'}`} />

                            {/* Ribbon tag */}
                            {ribbon && (
                              <span className={`absolute top-0 left-0 max-w-[80%] truncate px-2 py-0.5 rounded-br-xl bg-gradient-to-r ${ribbon.cls} text-[8.5px] sm:text-[9.5px] font-extrabold uppercase tracking-wide shadow-md z-20`}>
                                {ribbon.text}
                              </span>
                            )}

                            {/* Selected check */}
                            {isSelected && (
                              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-[0_0_8px_rgba(251,191,36,0.8)] z-20">
                                <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                              </span>
                            )}

                            {/* Artwork: Big prominent 3D Diamond / Pass Image */}
                            <div className="relative w-full h-16 sm:h-20 flex items-center justify-center my-1">
                              <ProductPackageImage
                                pkg={pkg}
                                size="lg"
                                className="relative z-10 transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_6px_14px_rgba(0,180,255,0.45)]"
                              />
                            </div>

                            {/* Name + sub */}
                            <h3 className={`relative mt-1 w-full text-[11px] sm:text-xs font-extrabold leading-tight line-clamp-1 transition-colors ${isSelected ? 'text-amber-300' : 'text-white group-hover:text-sky-200'}`}>
                              {pkg.name}
                            </h3>
                            <span className="relative text-[9px] sm:text-[10px] font-semibold text-slate-400 leading-tight mt-0.5 truncate w-full">
                              {isPass ? '⚡ Daily Pass' : `💎 ${pkg.diamondAmount}`}
                            </span>

                            {/* Price bar */}
                            <div className={`relative mt-2 w-full flex items-center justify-between rounded-lg pl-2 pr-0.5 py-0.5 border ${isSelected ? 'bg-amber-400/10 border-amber-400/40' : 'bg-slate-950/70 border-slate-800'}`}>
                              <span className={`font-black font-mono text-xs sm:text-[13px] tracking-tight ${isSelected ? 'text-amber-300' : 'text-[#00F5B8]'}`}>
                                ${pkg.price.toFixed(2)}
                              </span>
                              <span className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${isSelected ? 'bg-amber-400 text-slate-950' : 'bg-[#00E599] text-slate-950 group-hover:bg-[#00F5B8]'}`}>
                                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" /></svg>
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  );
                }

                // ==================== MODE 2: LARGE ICONS / GRID VIEW ====================
                if (layoutMode === 'grid') {
                  return (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
                      {filtered.map((pkg) => {
                        const isSelected = selectedProduct.productId === pkg.productId;
                        const isPass = isPassItem(pkg);
                        const tagLower = (pkg.tag || '').toLowerCase();
                        const isPopular = pkg.productId === 12 || pkg.diamondAmount === 55 || tagLower.includes('popular') || tagLower.includes('starter');
                        const isRecommend = !isPopular && (pkg.productId === 13 || pkg.diamondAmount === 86 || tagLower.includes('bonus') || tagLower.includes('recommend') || tagLower.includes('best'));
                        const ribbon = isPopular
                          ? { text: 'Popular', cls: 'from-orange-500 to-amber-500 text-white' }
                          : isRecommend
                            ? { text: 'Recommend', cls: 'from-amber-300 to-yellow-500 text-slate-950' }
                            : pkg.tag
                              ? { text: formatTagText(pkg.tag), cls: 'from-sky-600 to-indigo-600 text-white' }
                              : null;

                        return (
                          <div
                            key={pkg.productId}
                            onClick={() => setSelectedProduct(pkg)}
                            className={`group relative rounded-2xl p-3 sm:p-4 cursor-pointer select-none transition-all duration-300 flex flex-col items-center text-center justify-between overflow-hidden ${
                              isSelected
                                ? 'bg-gradient-to-b from-[#24173d] via-[#170f28] to-[#0b0816] border-2 border-amber-400 shadow-[0_0_24px_rgba(251,191,36,0.4),inset_0_1px_2px_rgba(255,255,255,0.2)] scale-[1.02] -translate-y-1 z-10'
                                : 'bg-gradient-to-b from-[#0f172a]/95 via-[#0b1220]/95 to-[#070b14]/98 border border-slate-700/70 hover:border-sky-400/60 hover:shadow-[0_10px_24px_-6px_rgba(0,0,0,0.7),0_0_16px_rgba(56,189,248,0.2)] hover:-translate-y-1'
                            }`}
                          >
                            {/* Ambient card background glow on hover / active */}
                            <div
                              className={`pointer-events-none absolute inset-0 transition-opacity duration-300 ${
                                isSelected
                                  ? 'bg-gradient-to-t from-amber-400/10 via-amber-400/5 to-transparent'
                                  : 'bg-gradient-to-t from-sky-500/5 to-transparent group-hover:opacity-100 opacity-0'
                              }`}
                            />

                            {/* Top Ribbon Tag */}
                            {ribbon && (
                              <span
                                className={`absolute top-0 left-0 max-w-[85%] truncate px-2.5 py-0.5 rounded-br-xl bg-gradient-to-r ${ribbon.cls} text-[8.5px] sm:text-[9.5px] font-black uppercase tracking-wider shadow-md z-20`}
                              >
                                {ribbon.text}
                              </span>
                            )}

                            {/* Selected Active Checkmark */}
                            {isSelected && (
                              <div className="absolute top-2 right-2 z-20 w-5 h-5 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 flex items-center justify-center font-black shadow-[0_0_10px_rgba(251,191,36,0.9)]">
                                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                              </div>
                            )}

                            {/* Truly Large 3D Artwork Centerpiece */}
                            <div className="relative w-full h-24 sm:h-28 flex items-center justify-center my-2">
                              {/* Ambient radial backlight aura */}
                              <div
                                className={`absolute w-20 h-20 sm:w-24 sm:h-24 rounded-full blur-xl pointer-events-none transition-all duration-300 ${
                                  isSelected
                                    ? 'bg-amber-400/30 scale-110'
                                    : 'bg-cyan-500/25 group-hover:bg-cyan-400/40'
                                }`}
                              />
                              <ProductPackageImage
                                pkg={pkg}
                                size="xl"
                                className="relative z-10 group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_10px_22px_rgba(0,180,255,0.45)]"
                              />
                            </div>

                            {/* Title */}
                            <h3
                              className={`font-black text-xs sm:text-sm lg:text-[15px] leading-tight line-clamp-1 w-full transition-colors drop-shadow-sm relative z-10 ${
                                isSelected ? 'text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' : 'text-white group-hover:text-sky-200'
                              }`}
                            >
                              {pkg.name}
                            </h3>

                            {/* Subtitle Pill (Diamond count or Pass) */}
                            <div className="flex items-center justify-center gap-1.5 mt-1 mb-2 text-[10px] sm:text-[11px] font-bold relative z-10">
                              {isPass ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20">
                                  <span>⚡</span>
                                  <span>Daily Pass</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-400/10 text-cyan-300 border border-cyan-400/20">
                                  <span>💎</span>
                                  <span>{pkg.diamondAmount} ពេជ្រ</span>
                                </span>
                              )}
                            </div>

                            {/* Price & Buy Action Capsule */}
                            <div
                              className={`mt-auto w-full rounded-xl p-2 transition-all duration-200 flex items-center justify-between border relative z-10 ${
                                isSelected
                                  ? 'bg-slate-950/90 border-amber-400/50 shadow-inner'
                                  : 'bg-slate-950/75 border-slate-800/90 group-hover:border-slate-700 shadow-inner'
                              }`}
                            >
                              {/* Price in USD and Riel */}
                              <div className="flex flex-col items-start min-w-0 pl-1 text-left">
                                <span
                                  className={`font-black font-mono text-sm sm:text-base leading-none tracking-tight ${
                                    isSelected
                                      ? 'text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                                      : 'text-[#00F5B8] drop-shadow-[0_0_8px_rgba(0,245,184,0.4)]'
                                  }`}
                                >
                                  ${pkg.price.toFixed(2)}
                                </span>
                                <span className="text-[8.5px] sm:text-[9.5px] font-mono font-medium text-slate-400 mt-0.5 truncate">
                                  ~{Math.round(pkg.price * 4100).toLocaleString()} ៛
                                </span>
                              </div>

                              {/* Buy Button */}
                              <div
                                className={`h-7 px-2.5 sm:px-3 rounded-lg flex items-center justify-center gap-1 text-[10px] sm:text-[11px] font-black transition-all shrink-0 shadow-sm ${
                                  isSelected
                                    ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 shadow-amber-400/40'
                                    : 'bg-gradient-to-r from-[#00E599] to-[#00F5B8] text-slate-950 group-hover:scale-105'
                                }`}
                              >
                                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                  <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
                                </svg>
                                <span className="hidden xs:inline">ទិញ</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                }

                // ==================== MODE 3: COMPACT LIST ROWS ====================
                return (
                  <div className="space-y-2">
                    {filtered.map((pkg) => {
                      const isSelected = selectedProduct.productId === pkg.productId;

                      return (
                        <div
                          key={pkg.productId}
                          onClick={() => setSelectedProduct(pkg)}
                          className={`group relative flex items-center justify-between p-2 sm:p-2.5 rounded-xl cursor-pointer select-none transition-all duration-200 overflow-hidden ${
                            isSelected
                              ? 'bg-gradient-to-r from-[#1c1233] via-[#140d26] to-[#0d0918] border-2 border-amber-400 shadow-xl shadow-black/60 scale-[1.01] z-10'
                              : 'bg-gradient-to-r from-[#111827] via-[#0d1320] to-[#080d16] border border-slate-700/60 hover:border-amber-400/50 hover:bg-gradient-to-r hover:from-[#152033] hover:via-[#101828] hover:to-[#0a0f1c] hover:shadow-lg hover:shadow-black/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 sm:gap-3 relative z-10">
                            <div className="relative flex items-center justify-center">
                              <ProductPackageImage
                                pkg={pkg}
                                size="sm"
                                className="relative z-10 group-hover:scale-105 transition-transform duration-200 ml-0.5"
                              />
                            </div>
                            <div className="flex flex-col justify-center">
                              <div className="flex items-center gap-1.5">
                                <span className="font-black text-xs sm:text-[13px] leading-tight text-white group-hover:text-amber-300 transition-colors drop-shadow-sm">
                                  {pkg.name}
                                </span>
                                {pkg.tag && (
                                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[8px] sm:text-[8.5px] font-bold tracking-wide ${getTagStyle(pkg.tag)}`}>
                                    {formatTagText(pkg.tag)}
                                  </span>
                                )}
                              </div>
                              <span className="text-[9px] sm:text-[9.5px] font-mono font-medium text-slate-400 group-hover:text-slate-300 mt-0.5">
                                ~{Math.round(pkg.price * 4100).toLocaleString()} ៛
                              </span>
                            </div>
                          </div>

                          <div
                            className={`relative z-10 px-2.5 py-1 rounded-lg flex items-center justify-center min-w-[65px] transition-all duration-200 ${
                              isSelected
                                ? 'bg-slate-950/80 border border-amber-400/40 shadow-inner'
                                : 'bg-slate-950/65 border border-slate-800/80 group-hover:border-slate-700/80 shadow-inner'
                            }`}
                          >
                            <span
                              className={`font-black text-xs sm:text-[13px] font-mono leading-none ${
                                isSelected
                                  ? 'text-amber-300 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]'
                                  : 'text-emerald-400 group-hover:text-emerald-300 drop-shadow-[0_0_5px_rgba(52,211,153,0.3)]'
                              }`}
                            >
                              ${pkg.price.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
                })()}
              </div>
              {/* Bottom fade + scroll-down hint */}
              <div className={`pointer-events-none absolute left-0 right-0 bottom-0 h-14 z-10 bg-gradient-to-t from-[#030817] via-[#030817]/80 to-transparent flex items-end justify-center pb-1.5 transition-opacity duration-200 ${listScroll.atBottom ? 'opacity-0' : 'opacity-100'}`}>
                <span className="w-6 h-6 rounded-full bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300 animate-bounce">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
                </span>
              </div>
            </div>

            {/* Bottom Helper Note */}
            <div className="text-center pt-1 text-[10px] text-slate-500 font-medium">
              Click any item to select and proceed to instant checkout.
            </div>

            {/* Selected Item & Total Summary Box (Moved directly above Step 3) */}
            <div ref={checkoutSectionRef} className="pt-3 font-khmer">
              <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-[#0b1220] via-[#0f172a] to-[#0b1220] border border-slate-700/80 shadow-xl space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
                {/* Product Summary */}
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block font-khmer">
                      {language === 'km' ? 'កញ្ចប់ដែលបានជ្រើសរើស & សរុប' : 'Selected Item & Total'}
                    </span>
                    {selectedProduct.tag && (
                      <span className="px-2 py-0.2 rounded-full text-[9px] font-bold bg-amber-400/15 text-amber-300 border border-amber-400/30 font-khmer">
                        {selectedProduct.tag}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <ProductPackageImage pkg={selectedProduct} size="xs" />
                    <span className="font-black text-amber-300 text-sm sm:text-base tracking-wide font-khmer">
                      {selectedProduct.name}
                    </span>
                  </div>
                </div>
                
                {/* Currency Switcher & Price Display */}
                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  {/* Currency Switcher Pill */}
                  <div className="flex items-center p-1 bg-slate-900/90 rounded-xl border border-slate-700/90 shadow-inner">
                    <button
                      type="button"
                      onClick={() => handleSwitchCurrency('USD')}
                      className={`py-1 px-2.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                        currency === 'USD'
                          ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      USD ($)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSwitchCurrency('KHR')}
                      className={`py-1 px-2.5 rounded-lg text-xs font-black transition-all cursor-pointer font-khmer ${
                        currency === 'KHR'
                          ? 'bg-emerald-400 text-slate-950 shadow-md font-black'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      KHR (៛)
                    </button>
                  </div>

                  {/* Price Block */}
                  <div className="text-right">
                    <span className="font-mono font-black text-emerald-400 text-xl sm:text-2xl block leading-tight drop-shadow-sm">
                      {currency === 'KHR'
                        ? <span>{Math.round(selectedProduct.price * 4100).toLocaleString()} <span className="font-khmer font-bold">៛</span></span>
                        : `$${selectedProduct.price.toFixed(2)} USD`}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      {currency === 'KHR'
                        ? `~$${selectedProduct.price.toFixed(2)} USD`
                        : <span>~{Math.round(selectedProduct.price * 4100).toLocaleString()} <span className="font-khmer">៛</span></span>}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ======================================================== */}
            {/* STEP 3: SELECT PAYMENT METHOD (ABA PAYWAY COMPLIANCE v2.11) */}
            {/* Strictly adhering to Figma Guideline Node 18242-814 */}
            {/* ======================================================== */}
            <div className="pt-4 border-t border-slate-800/90 space-y-3.5 font-khmer">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 text-white font-black text-xs flex items-center justify-center shadow-md shadow-sky-500/25 shrink-0">
                    3
                  </span>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-white tracking-wide flex items-center gap-1.5 flex-wrap font-khmer">
                      <span>{language === 'km' ? 'ជ្រើសរើសវិធីសាស្ត្រទូទាត់' : 'Select Payment Method'}</span>
                      <span className="text-[11px] text-sky-400 font-semibold font-khmer">
                        {language === 'km' ? '(Payment Methods)' : '(វិធីសាស្ត្រទូទាត់)'}
                      </span>
                    </h3>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-[10px] sm:text-[11px] font-bold shrink-0 font-khmer">
                  ⚡ {language === 'km' ? 'ឥតគិតថ្លៃសេវា 0%' : '0% Fee'}
                </span>
              </div>

              {/* Single Official ABA KHQR Payment Method - Press Directly to Pay */}
              <div className="flex flex-wrap items-center">
                <button
                  type="button"
                  id="checkout_button"
                  onClick={() => {
                    if (loading || isTopupDisabled) return;
                    handleProceedToPayment();
                  }}
                  disabled={loading || isTopupDisabled}
                  style={{
                    opacity: isTopupDisabled ? 0.6 : 1,
                  }}
                  title={isTopupDisabled ? 'Top-Up Temporarily Paused' : 'Click to pay with ABA KHQR'}
                  className={`relative w-full sm:w-[320px] md:w-[340px] h-[64px] rounded-2xl px-3.5 py-2.5 bg-gradient-to-br from-[#0b1220] via-[#0f172a] to-[#0b1220] border border-slate-700/90 hover:border-sky-400/80 shadow-lg hover:shadow-[0_0_20px_rgba(14,165,233,0.18)] transition-all select-none active:scale-[0.985] flex items-center justify-between text-left group ${
                    loading ? 'cursor-wait opacity-90' : isTopupDisabled ? 'cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  <div className="flex items-center gap-[10px] min-w-0">
                    <AbaKhqrLogo
                      alt="ABA KHQR"
                      style={{ width: '40px', height: '40px', borderRadius: '8px' }}
                      className="shrink-0 object-contain shadow-sm"
                    />
                    <div className="flex flex-col justify-center text-left min-w-0">
                      <span className="text-[14px] font-bold text-white group-hover:text-sky-300 leading-none tracking-tight transition-colors">
                        ABA KHQR
                      </span>
                      <span
                        className="text-[11px] leading-tight font-medium truncate font-khmer text-slate-400 mt-1"
                      >
                        {loading
                          ? (language === 'km' ? 'កំពុងភ្ជាប់ទៅកាន់ ABA...' : 'Connecting to ABA...')
                          : (language === 'km' ? 'ស្គែនទូទាត់តាមធនាគារជាសមាជិក' : 'Scan to pay with any banking app')}
                      </span>
                    </div>
                  </div>

                  {/* Right Action / Chevron Button */}
                  <div className="w-7 h-7 rounded-md bg-slate-800/90 border border-slate-700/80 group-hover:border-sky-400/50 flex items-center justify-center text-slate-300 group-hover:text-sky-300 shrink-0 transition-colors">
                    {loading ? (
                      <svg className="animate-spin w-3.5 h-3.5 text-sky-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                      </svg>
                    ) : (
                      <svg className="w-3.5 h-3.5 text-slate-300 group-hover:text-sky-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </div>
                </button>
              </div>

              {error && (
                <div className="p-3 bg-rose-950/60 border border-rose-500/40 rounded-xl text-rose-300 text-xs font-bold flex items-center gap-2 animate-pulse font-khmer">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Footer Trust Row: We Accept Marks & Terms (Figma: width 326px, height 18px, gap 4px) */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800/80 font-khmer">
                <WeAcceptPayments />

                {/* Terms & Privacy Link */}
                <div className="flex items-center justify-end text-[10.5px] text-slate-400 px-1 font-khmer">
                  <Link to="/privacy" target="_blank" className="text-slate-500 hover:text-cyan-400 transition-colors font-khmer">
                    {language === 'km' ? 'លក្ខខណ្ឌ & ឯកជនភាព' : 'Terms & Privacy Policy'}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>



      {/* ======================================================== */}
      {/* ABA PAYWAY V2 3-SECOND POLLING AUDIT BAR                 */}
      {/* ======================================================== */}
      {paymentData && !paymentPaid && (
        <div className="fixed bottom-4 right-4 z-[99999] max-w-sm w-[calc(100%-2rem)] sm:w-84 bg-slate-900/95 backdrop-blur-md border border-cyan-500/50 rounded-2xl p-3.5 shadow-2xl shadow-cyan-500/20 text-xs text-white space-y-2 animate-fadeIn">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
              </span>
              <span className="font-bold text-cyan-300 text-xs tracking-wide">ABA PayWay V2 Poller</span>
            </div>
            <span className="text-[11px] font-mono bg-cyan-950/80 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800">
              Check #{pollTelemetry.count || 0} • 3.0s
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-300">
            <span>Bank Status: <strong className={pollTelemetry.status === 'APPROVED' ? 'text-emerald-400' : 'text-amber-400'}>{pollTelemetry.status || 'PENDING'}</strong></span>
            <span className="text-slate-400 font-mono text-[10px]">{pollTelemetry.lastTime || 'Starting...'}</span>
          </div>

          {paymentData?.tranId && (
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
              <span className="font-mono text-slate-400 truncate max-w-[130px]">Tran: {paymentData.tranId}</span>
              <a 
                href={`https://mlbb-backend-api.onrender.com/api/payway/polling-log/${paymentData.tranId}`} 
                target="_blank" 
                rel="noreferrer"
                className="text-cyan-400 hover:text-cyan-300 underline font-semibold flex items-center gap-1"
                title="View live ABA gateway server audit logs"
              >
                Audit Server Logs ↗
              </a>
            </div>
          )}
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
            
                {paymentData?.tranId && (
                  <div className="flex justify-between items-center pt-2 border-t border-slate-800/50">
                    <span className="text-slate-400">ABA Transaction ID:</span>
                    <span className="font-mono text-[10px] text-slate-300 bg-slate-800/50 px-2 py-0.5 rounded">{paymentData.tranId}</span>
                  </div>
                )}
                <div className="flex justify-center pt-3 pb-1">
                  <div className="flex items-center gap-1.5 opacity-60">
                    <span className="text-[10px] text-slate-500 font-medium">Processed securely by</span>
                    <img src="https://checkout.payway.com.kh/images/payway-logo-white.svg" alt="ABA PayWay" className="h-3" />
                  </div>
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
            <input
              key={k}
              type="hidden"
              name={k}
              value={v || ''}
              className={k === 'payment_option' ? 'payment_option' : undefined}
            />
          ))}
        {paymentData?.formData && !paymentData.formData.payment_option && (
          <input type="hidden" name="payment_option" className="payment_option" value="abapay_khqr" />
        )}
              </form>
    </div>
  );
};

export default TopUp;
