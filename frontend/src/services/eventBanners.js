// Promotional Event Banners Service with Real-Time Cloud Synchronization
// Persists dynamically to MongoDB Atlas & Backend API so changes on smartphone sync to desktop & all visitors

export const DEFAULT_EVENT_BANNERS = [
  {
    id: 'banner-1',
    tag: '🔥 ALLSTAR 2026 EVENT',
    title: 'Mobile Legends 515 ALLSTAR Special',
    subtitle: 'ទទួលបាន 220 💎 + 70 Aurora ⭐ លើរាល់ការទិញ Weekly Diamond Pass!',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1400&q=80',
    localFallbackImage: '/mlbb-logo.png',
    gameId: 'mlbb',
    buttonText: 'Top Up MLBB Now',
    link: '/topup?game=mlbb',
    badgeColor: 'bg-amber-400 text-slate-950',
    status: 'Active',
    order: 1
  },
  {
    id: 'banner-2',
    tag: '👑 VIP PASS SALE',
    title: 'Twilight Pass & Starlight Pass 2026',
    subtitle: 'Unlock Exclusive Season Skins, Avatar Borders & 29x Draw Tickets!',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1400&q=80',
    localFallbackImage: '/mlbb-logo.png',
    gameId: 'mlbb',
    buttonText: 'Get VIP Pass ($8.50)',
    link: '/topup?game=mlbb',
    badgeColor: 'bg-indigo-500 text-white',
    status: 'Active',
    order: 2
  },
  {
    id: 'banner-3',
    tag: '⚡ ROYALE PASS BONUS',
    title: 'PUBG Mobile UC Mega Season',
    subtitle: 'Fast 10-second automated delivery directly to your Character ID!',
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1400&q=80',
    localFallbackImage: '/mlbb-logo.png',
    gameId: 'pubgm',
    buttonText: 'Top Up UC Now',
    link: '/topup?game=pubgm',
    badgeColor: 'bg-cyan-400 text-slate-950',
    status: 'Active',
    order: 3
  },
  {
    id: 'banner-4',
    tag: '🎁 BOOYAH PASS',
    title: 'Free Fire Booyah Pass & Diamonds',
    subtitle: 'បញ្ចុះតម្លៃពិសេស ជាមួយប្រព័ន្ធស្វ័យប្រវត្តិ Bakong KHQR 0% Fee!',
    image: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=1400&q=80',
    localFallbackImage: '/mlbb-logo.png',
    gameId: 'freefire',
    buttonText: 'Get Free Fire Pass',
    link: '/topup?game=freefire',
    badgeColor: 'bg-rose-500 text-white',
    status: 'Active',
    order: 4
  }
];

const STORAGE_KEY = 'admin_event_banners';
const EVENT_NAME = 'eventBannersUpdated';
const OLD_KEYBOARD_IMG = 'photo-1542751371-adc38448a05e';

const sanitizeBanners = (list) => {
  if (!Array.isArray(list) || list.length === 0) return DEFAULT_EVENT_BANNERS;
  return list.map((b, idx) => {
    let img = b.image;
    // Replace old keyboard "AAA" stock photo with vibrant gaming backdrop
    if (!img || img.includes(OLD_KEYBOARD_IMG)) {
      img = DEFAULT_EVENT_BANNERS[idx % DEFAULT_EVENT_BANNERS.length].image;
    }
    return {
      ...b,
      image: img,
      localFallbackImage: b.localFallbackImage || '/mlbb-logo.png'
    };
  });
};

const getApiUrls = () => {
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return ['http://localhost:5001/api', 'http://localhost:5000/api/admin'];
  }
  const urls = ['/api/khqr'];
  if (process.env.REACT_APP_KHQR_API_URL) urls.unshift(`${process.env.REACT_APP_KHQR_API_URL}/api`);
  if (process.env.REACT_APP_API_URL) urls.unshift(`${process.env.REACT_APP_API_URL}`);
  return urls;
};

// Get cached or default banners synchronously
export const getStoredBanners = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return sanitizeBanners(parsed).filter(b => b.status !== 'Inactive');
      }
    }
  } catch (e) {}
  return DEFAULT_EVENT_BANNERS;
};

// Get all banners for Admin including Inactive ones
export const getAllStoredBanners = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return sanitizeBanners(parsed);
      }
    }
  } catch (e) {}
  return DEFAULT_EVENT_BANNERS;
};

// Fetch latest banners from MongoDB Atlas / Cloud backend
export const fetchStoredBanners = async () => {
  const urls = getApiUrls();
  for (const base of urls) {
    try {
      const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
      const res = await fetch(`${cleanBase}/banners?_t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        let banners = data?.banners;
        if (banners && !Array.isArray(banners) && Array.isArray(banners.banners)) {
          banners = banners.banners;
        }
        if (Array.isArray(banners) && banners.length > 0) {
          const sanitized = sanitizeBanners(banners);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event(EVENT_NAME));
          }
          return sanitized.filter(b => b.status !== 'Inactive');
        }
      }
    } catch (_) {}
  }
  return getStoredBanners();
};

// Save updated banners to local storage AND broadcast to Cloud / MongoDB Atlas
export const saveStoredBanners = async (banners) => {
  try {
    const sanitized = sanitizeBanners(banners);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(EVENT_NAME));
    }

    const urls = getApiUrls();
    await Promise.allSettled(
      urls.map((base) => {
        const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
        return fetch(`${cleanBase}/banners`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ banners: sanitized }),
        });
      })
    );
    return sanitized;
  } catch (err) {
    console.warn('Error saving banners to cloud:', err);
    return banners;
  }
};
