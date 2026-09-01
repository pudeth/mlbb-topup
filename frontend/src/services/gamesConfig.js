// Real FazerCards Upstream Provider Catalog (Games & Digital Services)
export const DEFAULT_GAMES = [
  // ==========================================
  // TOP PRIORITY GAMES (MATCHING STOREFRONT 3-COL GRID)
  // ==========================================
  {
    id: 'freefire_kh',
    name: 'FREE FIRE KH',
    publisher: 'Garena',
    category: 'Service top-up',
    providerCategory: 'Service top-up',
    currency: 'Diamonds',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=80',
    localFallbackImage: '/mlbb-logo.png',
    badge: 'SEVER ខ្មែរ 🇰🇭',
    badgeColor: 'cyan',
    rating: '4.9 ⭐',
    deliveryTime: '10 - 30s',
    route: '/topup?game=freefire',
    status: 'Active',
    isPopular: true,
    description: 'Direct Garena Free Fire Cambodia server UID top-up with automated level-up pass.'
  },
  {
    id: 'mlbb',
    name: 'MOBILE LEGEND',
    publisher: 'Moonton',
    category: 'Service top-up',
    providerCategory: 'Service top-up',
    currency: 'Diamonds & Passes',
    image: '/mlbb-logo.png',
    localFallbackImage: '/mlbb-logo.png',
    badge: 'សេវើខ្មែរ 5v5',
    badgeColor: 'gold',
    rating: '5.0 ⭐',
    deliveryTime: '10 - 30s',
    route: '/topup',
    status: 'Active',
    isPopular: true,
    description: 'Instant Mobile Legends Diamonds, Weekly Diamond Pass & Twilight Pass via automated Moonton gateway.'
  },
  {
    id: 'mlbb_tickets',
    name: 'កក់ TICKETS',
    publisher: 'Moonton',
    category: 'Service top-up',
    providerCategory: 'Service top-up',
    currency: 'Event Tickets',
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=500&auto=format&fit=crop&q=80',
    localFallbackImage: '/mlbb-logo.png',
    badge: 'UPGRADED 🔥',
    badgeColor: 'purple',
    rating: '4.9 ⭐',
    deliveryTime: 'Instant 10s',
    route: '/topup?game=mlbb&tab=pass',
    status: 'Active',
    isPopular: true,
    description: 'MLBB 515 ALLSTAR & Jujutsu Kaisen 29 Tickets Vouchers & Pre-Orders.'
  },
  {
    id: 'level_up_pass',
    name: 'LEVEL UP PASS',
    publisher: 'Garena / Moonton',
    category: 'Service top-up',
    providerCategory: 'Service top-up',
    currency: 'Passes & Packs',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop&q=80',
    localFallbackImage: '/mlbb-logo.png',
    badge: 'BEST DEAL 🌟',
    badgeColor: 'gold',
    rating: '5.0 ⭐',
    deliveryTime: '10 - 30s',
    route: '/topup?game=mlbb&tab=pass',
    status: 'Active',
    isPopular: true,
    description: 'Level Up Pass and Super Value Diamond Growth Bundles.'
  },
  {
    id: 'mlbb_ph',
    name: 'MOBILE LEGENDS (PH)',
    publisher: 'Moonton',
    category: 'Service top-up',
    providerCategory: 'Service top-up',
    currency: 'Diamonds',
    image: '/mlbb-logo.png',
    localFallbackImage: '/mlbb-logo.png',
    badge: '🇵🇭 PH SERVER',
    badgeColor: 'cyan',
    rating: '4.9 ⭐',
    deliveryTime: '10 - 30s',
    route: '/topup?game=mlbb_ph',
    status: 'Active',
    isPopular: true,
    description: 'Mobile Legends Philippines Region Server UID Top-Up.'
  },
  {
    id: 'magic_chess',
    name: 'MAGIC CHESS GOGO',
    publisher: 'Moonton',
    category: 'Service top-up',
    providerCategory: 'Service top-up',
    currency: 'Chess Diamonds',
    image: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=500&auto=format&fit=crop&q=80',
    localFallbackImage: '/mlbb-logo.png',
    badge: 'CHIBI HERO ♟️',
    badgeColor: 'purple',
    rating: '4.8 ⭐',
    deliveryTime: '10 - 30s',
    route: '/topup?game=magic_chess',
    status: 'Active',
    isPopular: true,
    description: 'Magic Chess Go Go Little Commander Skins and Battle Pass.'
  },
  {
    id: 'mlbb_id',
    name: 'MOBILE LEGENDS (ID)',
    publisher: 'Moonton',
    category: 'Service top-up',
    providerCategory: 'Service top-up',
    currency: 'Diamonds',
    image: '/mlbb-logo.png',
    localFallbackImage: '/mlbb-logo.png',
    badge: '🇮🇩 ID SERVER',
    badgeColor: 'cyan',
    rating: '4.9 ⭐',
    deliveryTime: '10 - 30s',
    route: '/topup?game=mlbb_id',
    status: 'Active',
    isPopular: true,
    description: 'Mobile Legends Indonesia Region Server Direct UID Top-Up.'
  },
  {
    id: 'pubgm_auto',
    name: 'PUBG MOBILE',
    publisher: 'Level Infinite',
    category: 'Service top-up',
    providerCategory: 'Service top-up',
    currency: 'Unknown Cash (UC)',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&auto=format&fit=crop&q=80',
    badge: 'GLOBAL UC ⚡',
    badgeColor: 'emerald',
    rating: '4.9 ⭐',
    deliveryTime: '10s - 1m',
    route: '/topup?game=pubgm',
    status: 'Active',
    isPopular: true,
    description: 'Automated PUBG Mobile Global Unknown Cash (UC) and Royale Pass vouchers.'
  },
  {
    id: 'blood_strike',
    name: 'BLOOD STRIKE',
    publisher: 'NetEase Games',
    category: 'Service top-up',
    providerCategory: 'Service top-up',
    currency: 'Gold & Strike Pass',
    image: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=500&auto=format&fit=crop&q=80',
    badge: 'HOT FPS 🔥',
    badgeColor: 'purple',
    rating: '4.9 ⭐',
    deliveryTime: '10 - 30s',
    route: '/topup?game=blood_strike',
    status: 'Active',
    isPopular: true,
    description: 'NetEase Blood Strike Global Gold recharge and Strike Pass unlock.'
  },
  {
    id: 'freefire_mena',
    name: 'Free Fire (MENA)',
    publisher: 'Garena',
    category: 'Service top-up',
    providerCategory: 'Service top-up',
    currency: 'Diamonds',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=80',
    badge: 'MENA',
    badgeColor: 'cyan',
    rating: '4.8 ⭐',
    deliveryTime: '10 - 30s',
    route: '/topup?game=freefire_mena',
    status: 'Active',
    isPopular: false,
    description: 'Instant Free Fire diamonds for Middle East & North Africa accounts.'
  },
  {
    id: 'freefire_latam',
    name: 'Free Fire (LATAM)',
    publisher: 'Garena',
    category: 'Service top-up',
    providerCategory: 'Service top-up',
    currency: 'Diamonds',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=80',
    badge: 'LATAM',
    badgeColor: 'cyan',
    rating: '4.8 ⭐',
    deliveryTime: '10 - 30s',
    route: '/topup?game=freefire_latam',
    status: 'Active',
    isPopular: false,
    description: 'Instant Free Fire diamonds for Latin America region accounts.'
  },
  {
    id: 'wuthering_waves',
    name: 'Wuthering Waves',
    publisher: 'Kuro Games',
    category: 'Service top-up',
    providerCategory: 'Service top-up',
    currency: 'Lunite & Subscriptions',
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=80',
    badge: 'NEW 🌟',
    badgeColor: 'purple',
    rating: '4.9 ⭐',
    deliveryTime: 'Instant - 1m',
    route: '/topup?game=wuthering_waves',
    status: 'Active',
    isPopular: true,
    description: 'Direct Kuro Games UID recharge for Lunite and Lunite Subscription pass.'
  },
  {
    id: 'zzz',
    name: 'Zenless Zone Zero',
    publisher: 'HoYoverse / Cognosphere',
    category: 'Service top-up',
    providerCategory: 'Service top-up',
    currency: 'Monochromes & Passes',
    image: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=500&auto=format&fit=crop&q=80',
    badge: 'HOT 🔥',
    badgeColor: 'emerald',
    rating: '4.9 ⭐',
    deliveryTime: '10s - 1m',
    route: '/topup?game=zzz',
    status: 'Active',
    isPopular: true,
    description: 'Direct UID recharge for Monochromes and Inter-Knot Membership.'
  },
  {
    id: 'star_rail',
    name: 'Honkai: Star Rail',
    publisher: 'HoYoverse',
    category: 'Service top-up',
    providerCategory: 'Service top-up',
    currency: 'Oneiric Shards & Passes',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=80',
    badge: 'Official API',
    badgeColor: 'cyan',
    rating: '4.9 ⭐',
    deliveryTime: 'Instant - 1m',
    route: '/topup?game=star_rail',
    status: 'Active',
    isPopular: true,
    description: 'Oneiric Shards and Express Supply Pass reload directly via player UID.'
  },
  {
    id: 'genshin',
    name: 'Genshin Impact',
    publisher: 'HoYoverse / Cognosphere',
    category: 'Service top-up',
    providerCategory: 'Service top-up',
    currency: 'Genesis Crystals & Welkin',
    image: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=500&auto=format&fit=crop&q=80',
    badge: 'Official API',
    badgeColor: 'purple',
    rating: '4.9 ⭐',
    deliveryTime: '10s - 1m',
    route: '/topup?game=genshin',
    status: 'Active',
    isPopular: true,
    description: 'Genesis Crystals and Blessing of the Welkin Moon direct UID top-up.'
  },
  {
    id: 'hok',
    name: 'Honor of Kings',
    publisher: 'Level Infinite / TiMi Studio',
    category: 'Service top-up',
    providerCategory: 'Service top-up',
    currency: 'Tokens & Weekly Cards',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop&q=80',
    badge: 'POPULAR',
    badgeColor: 'cyan',
    rating: '4.8 ⭐',
    deliveryTime: '10 - 30s',
    route: '/topup?game=hok',
    status: 'Active',
    isPopular: true,
    description: 'Honor of Kings Global & SEA server Tokens and Weekly Cards top-up.'
  },
  {
    id: 'brawlstars',
    name: 'Brawl Stars & Clash of Clans',
    publisher: 'Supercell',
    category: 'Service top-up',
    providerCategory: 'Service top-up',
    currency: 'Gems & Passes',
    image: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=500&auto=format&fit=crop&q=80',
    badge: 'SUPERCELL',
    badgeColor: 'emerald',
    rating: '4.8 ⭐',
    deliveryTime: '10 - 45s',
    route: '/topup?game=brawlstars',
    status: 'Active',
    isPopular: false,
    description: 'Direct Supercell player tag top-up for Gems, Brawl Pass Plus, and Gold Pass.'
  },
  {
    id: 'roblox',
    name: 'Roblox',
    publisher: 'Roblox Corporation',
    category: 'Service top-up',
    providerCategory: 'Service top-up',
    currency: 'Robux & Gift Codes',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop&q=80',
    badge: 'BEST SELLER 🏆',
    badgeColor: 'gold',
    rating: '4.8 ⭐',
    deliveryTime: 'Instant Code',
    route: '/topup?game=roblox',
    status: 'Active',
    isPopular: true,
    description: 'Instant Robux top-up and digital gift card codes delivered with automatic verification.'
  },

  // ==========================================
  // TELEGRAM STARS
  // ==========================================
  {
    id: 'telegram_stars',
    name: 'Telegram Stars (Instant)',
    publisher: 'Telegram FZ-LLC',
    category: 'Telegram stars',
    providerCategory: 'Telegram stars',
    currency: '50 - 10,000 Stars',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80',
    badge: 'TELEGRAM ⭐',
    badgeColor: 'cyan',
    rating: '5.0 ⭐',
    deliveryTime: 'Instant API',
    route: '/topup?service=telegram_stars',
    status: 'Active',
    isPopular: true,
    description: 'Direct Telegram username top-up for Telegram Stars to use in mini-apps, bots, and digital media.'
  },

  // ==========================================
  // STEAM TOP-UP & GIFT GAMES
  // ==========================================
  {
    id: 'steam_topup_cis',
    name: 'Steam Top-Up (CIS / USD / Global)',
    publisher: 'Valve Corporation',
    category: 'Steam Top-Up (CIS)',
    providerCategory: 'Steam Top-Up (CIS)',
    currency: 'Direct Steam Balance',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=80',
    badge: 'STEAM DIRECT 🔑',
    badgeColor: 'gold',
    rating: '5.0 ⭐',
    deliveryTime: 'Instant Balance',
    route: '/topup?service=steam',
    status: 'Active',
    isPopular: true,
    description: 'Direct login top-up for Steam accounts with zero commission.'
  },
  {
    id: 'steam_gift_games',
    name: 'Steam Gift Games & Activation',
    publisher: 'Valve Corporation',
    category: 'Steam Gift Games',
    providerCategory: 'Steam Gift Games',
    currency: 'Digital Game Gifts',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=80',
    badge: 'GIFT BOT',
    badgeColor: 'emerald',
    rating: '4.9 ⭐',
    deliveryTime: '1 - 3 mins',
    route: '/topup?service=steam_gift',
    status: 'Active',
    isPopular: false,
    description: 'Automated Steam bot sending gifts directly to your Steam friend profile.'
  },

  // ==========================================
  // GIFT CARDS & KEYS
  // ==========================================
  {
    id: 'discord_nitro',
    name: 'Discord Nitro & Boosts',
    publisher: 'Discord Inc.',
    category: 'Gift cards',
    providerCategory: 'Gift cards',
    currency: '1 Month / 1 Year Sub',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80',
    badge: 'NITRO ⚡',
    badgeColor: 'purple',
    rating: '4.9 ⭐',
    deliveryTime: 'Instant Link',
    route: '/topup?service=discord',
    status: 'Active',
    isPopular: true,
    description: 'Discord Nitro monthly & yearly activation gift links with 2 free Server Boosts.'
  },
  {
    id: 'google_play',
    name: 'Google Play Gift Card',
    publisher: 'Google LLC',
    category: 'Gift cards',
    providerCategory: 'Gift cards',
    currency: 'USD / Global Balance',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=80',
    badge: 'DIGITAL PIN',
    badgeColor: 'emerald',
    rating: '4.9 ⭐',
    deliveryTime: 'Instant Code',
    route: '/topup?service=googleplay',
    status: 'Active',
    isPopular: true,
    description: 'Google Play digital balance cards for Android apps, game in-app purchases, and media.'
  },
  {
    id: 'apple_itunes',
    name: 'Apple App Store & iTunes',
    publisher: 'Apple Inc.',
    category: 'Gift cards',
    providerCategory: 'Gift cards',
    currency: 'App Store Credit',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=80',
    badge: 'APPLE ID',
    badgeColor: 'cyan',
    rating: '4.9 ⭐',
    deliveryTime: 'Instant Code',
    route: '/topup?service=apple',
    status: 'Active',
    isPopular: true,
    description: 'Direct Apple Store credit for iPhone/iPad game purchases, iCloud, and Apple Music.'
  },
  {
    id: 'razer_gold',
    name: 'Razer Gold PIN (Global)',
    publisher: 'Razer Inc.',
    category: 'Gift cards',
    providerCategory: 'Gift cards',
    currency: 'Universal Game Credit',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=80',
    badge: 'UNIVERSAL PIN ⭐',
    badgeColor: 'gold',
    rating: '4.9 ⭐',
    deliveryTime: 'Instant PIN',
    route: '/topup?service=razergold',
    status: 'Active',
    isPopular: true,
    description: 'Unified virtual credits for over 42,000 games and digital entertainment titles worldwide.'
  }
];

const STORAGE_KEY = 'mlbb_topup_custom_games_v5';

const getApiUrls = () => {
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return ['http://localhost:5001/api', 'http://localhost:5000/api/admin'];
  }
  const urls = [];
  if (process.env.REACT_APP_KHQR_API_URL) urls.push(`${process.env.REACT_APP_KHQR_API_URL}/api`);
  if (process.env.REACT_APP_API_URL) urls.push(`${process.env.REACT_APP_API_URL}/admin`);
  urls.push('https://mlbb-khqr-api.onrender.com/api');
  urls.push('https://mlbb-backend-api.onrender.com/api/admin');
  return [...new Set(urls)];
};

export const getStoredGames = () => {
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Error reading stored games:', err);
  }
  return DEFAULT_GAMES;
};

export const fetchStoredGames = async () => {
  const urls = getApiUrls();
  for (const base of urls) {
    try {
      const res = await fetch(`${base}/games?_t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.success && Array.isArray(data.games) && data.games.length > 0) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data.games));
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('gamesConfigUpdated'));
          }
          return data.games;
        }
      }
    } catch (e) {}
  }
  return getStoredGames();
};

export const saveStoredGames = (games) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
    // Asynchronously sync to all MongoDB Atlas API backends
    const urls = getApiUrls();
    urls.forEach((base) => {
      fetch(`${base}/games`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ games }),
      }).catch(() => {});
    });
  } catch (err) {
    console.warn('Error saving stored games:', err);
  }
};

export const resetToDefaultGames = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    const urls = getApiUrls();
    urls.forEach((base) => {
      fetch(`${base}/games`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ games: DEFAULT_GAMES }),
      }).catch(() => {});
    });
  } catch (err) {
    console.warn('Error resetting stored games:', err);
  }
  return DEFAULT_GAMES;
};

const MASTER_STATUS_KEY = 'mlbb_topup_master_status_v1';

export const getMasterTopupStatus = () => {
  try {
    const cached = localStorage.getItem(MASTER_STATUS_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (err) {}
  return {
    status: 'Active', // 'Active', 'Paused', 'Closed', 'Maintenance'
    notice: 'Top-Ups are temporarily paused by Admin for maintenance. Please check back shortly!',
    updatedAt: new Date().toISOString()
  };
};

export const fetchMasterTopupStatus = async () => {
  const urls = getApiUrls();
  for (const base of urls) {
    try {
      const res = await fetch(`${base}/master-status?_t=${Date.now()}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.success && data.masterStatus) {
          localStorage.setItem(MASTER_STATUS_KEY, JSON.stringify(data.masterStatus));
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('gamesConfigUpdated'));
            window.dispatchEvent(new CustomEvent('masterTopupStatusUpdated', { detail: data.masterStatus }));
          }
          return data.masterStatus;
        }
      }
    } catch (e) {}
  }
  return getMasterTopupStatus();
};

export const saveMasterTopupStatus = (statusData) => {
  try {
    const data = typeof statusData === 'string'
      ? { status: statusData, notice: 'Top-Ups are temporarily paused by Admin for maintenance. Please check back shortly!', updatedAt: new Date().toISOString() }
      : { updatedAt: new Date().toISOString(), ...statusData };
    localStorage.setItem(MASTER_STATUS_KEY, JSON.stringify(data));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('gamesConfigUpdated'));
      window.dispatchEvent(new CustomEvent('masterTopupStatusUpdated', { detail: data }));
    }
    // Asynchronously sync to all MongoDB Atlas API backends
    const urls = getApiUrls();
    urls.forEach((base) => {
      fetch(`${base}/master-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).catch(() => {});
    });
    return data;
  } catch (err) {
    console.warn('Error saving master topup status:', err);
  }
};
