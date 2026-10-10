import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getStoredGames, getMasterTopupStatus, fetchStoredGames, fetchMasterTopupStatus, getSavedGameStatuses } from '../services/gamesConfig';

// 12 Popular Games Preset matching desktop/laptop screenshot exactly
const POPULAR_GAMES_PRESET = [
  {
    id: 'freefire_kh',
    name: 'FREE FIRE KH',
    genre: 'Garena Free Fire',
    category: 'Free Fire',
    badge: 'HOT',
    badgeType: 'hot',
    flagType: 'kh',
    flagTitle: 'សេវើខ្មែរ',
    flagSubtitle: 'KH',
    flagServerText: 'SERVER',
    flagFrameStyle: 'gold_cyber',
    image: '/images/freefire-square-logo.png',
    fallbackImage: '/images/freefire_hero_banner.jpg',
    status: 'Active',
    route: '/topup?game=freefire'
  },
  {
    id: 'mlbb',
    name: 'MOBILE LEGENDS',
    genre: '5v5 MOBA',
    category: 'Mobile Legends',
    badge: 'NEW',
    badgeType: 'new',
    flagType: 'kh',
    flagTitle: 'សេវើខ្មែរ 5v5',
    flagSubtitle: '5V5',
    flagServerText: 'SERVER',
    flagFrameStyle: 'gold_cyber',
    image: '/mlbb-logo.png',
    fallbackImage: '/mlbb-logo.png',
    status: 'Active',
    route: '/topup'
  },
  {
    id: 'pubgm_auto',
    name: '(PUBG MOBILE)',
    genre: 'PUBG Mobile',
    category: 'PUBG Mobile',
    badge: 'CLOSED',
    badgeType: 'closed',
    flagType: 'global',
    flagTitle: 'GLOBAL UC',
    flagSubtitle: 'PUBG',
    flagServerText: 'DIRECT',
    flagFrameStyle: 'gold_cyber',
    image: 'https://res.cloudinary.com/dpz7vpmf8/image/upload/v1790944800/logo-game/ovdfdmru7jnhmwjvy6vy.jpg',
    fallbackImage: '/images/pubgm-banner.jpg',
    status: 'Closed',
    route: '/topup?game=pubgm'
  },
  {
    id: 'level_up_pass',
    name: 'LEVEL UP PASS',
    genre: 'Event & Reward',
    category: 'Mobile Legends',
    badge: 'CLOSED',
    badgeType: 'closed',
    flagType: 'kh',
    flagTitle: 'សេវើខ្មែរ 5v5',
    flagSubtitle: '5V5',
    flagServerText: 'SERVER',
    flagFrameStyle: 'gold_cyber',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop&q=80',
    fallbackImage: '/mlbb-logo.png',
    status: 'Closed',
    route: '/topup?game=mlbb&tab=pass'
  },
  {
    id: 'magic_chess',
    name: 'MAGIC CHESS',
    genre: 'Auto Chess',
    category: 'Mobile Legends',
    badge: 'CLOSED',
    badgeType: 'closed',
    flagType: 'kh',
    flagTitle: 'សេវើខ្មែរ 5v5',
    flagSubtitle: '5V5',
    flagServerText: 'SERVER',
    flagFrameStyle: 'gold_cyber',
    image: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=500&auto=format&fit=crop&q=80',
    fallbackImage: '/mlbb-logo.png',
    status: 'Closed',
    route: '/topup?game=magic_chess'
  },
  {
    id: 'blood_strike',
    name: 'BLOOD STRIKE',
    genre: 'FPS Shooter',
    category: 'Service top-up',
    badge: 'CLOSED',
    badgeType: 'closed',
    image: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=500&auto=format&fit=crop&q=80',
    fallbackImage: '/images/banner_freefire.jpg',
    status: 'Closed',
    route: '/topup?game=blood_strike'
  },
  {
    id: 'rov',
    name: 'ROV / ARENA OF VALOR',
    genre: 'MOBA',
    category: 'Service top-up',
    badge: 'CLOSED',
    badgeType: 'closed',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=80',
    fallbackImage: '/mlbb-logo.png',
    status: 'Closed',
    route: '/topup?game=rov'
  },
  {
    id: 'steam_games',
    name: 'STEAM GAMES',
    genre: 'Top PC Games',
    category: 'Steam',
    badge: 'CLOSED',
    badgeType: 'closed',
    image: '/images/steam-logo.png',
    fallbackImage: '/images/steam-logo.png',
    status: 'Closed',
    route: '/topup?service=steam'
  },
  {
    id: 'minecraft',
    name: 'MINECRAFT',
    genre: 'Sandbox',
    category: 'Service top-up',
    badge: 'CLOSED',
    badgeType: 'closed',
    image: 'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?w=500&auto=format&fit=crop&q=80',
    fallbackImage: '/images/banner_pubg.jpg',
    status: 'Closed',
    route: '/topup?game=minecraft'
  },
  {
    id: 'roblox',
    name: 'ROBLOX',
    genre: 'Adventure',
    category: 'Service top-up',
    badge: 'CLOSED',
    badgeType: 'closed',
    image: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=500&auto=format&fit=crop&q=80',
    fallbackImage: '/mlbb-logo.png',
    status: 'Closed',
    route: '/topup?game=roblox'
  },
  {
    id: 'one_piece',
    name: 'ONE PIECE',
    genre: 'RPG Adventure',
    category: 'Service top-up',
    badge: 'CLOSED',
    badgeType: 'closed',
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=80',
    fallbackImage: '/images/banner_mlbb_aldous.jpg',
    status: 'Closed',
    route: '/topup?game=onepiece'
  },
  {
    id: 'valorant',
    name: 'VALORANT',
    genre: 'Tactical Shooter',
    category: 'Service top-up',
    badge: 'CLOSED',
    badgeType: 'closed',
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=500&auto=format&fit=crop&q=80',
    fallbackImage: '/images/banner_pubg_tactical.jpg',
    status: 'Closed',
    route: '/topup?game=valorant'
  }
];

const mergeStoredWithPresets = (storedList) => {
  const savedStatuses = typeof getSavedGameStatuses === 'function' ? getSavedGameStatuses() : {};
  if (!storedList || !Array.isArray(storedList) || storedList.length === 0) {
    return POPULAR_GAMES_PRESET.map((p) => {
      const st = savedStatuses[p.id] !== undefined ? savedStatuses[p.id] : p.status;
      return {
        ...p,
        status: st,
        badge: st === 'Closed' ? 'CLOSED' : st === 'Paused' ? 'PAUSED' : p.badge,
        badgeType: st === 'Closed' ? 'closed' : st === 'Paused' ? 'paused' : p.badgeType
      };
    });
  }
  return POPULAR_GAMES_PRESET.map((p) => {
    const found = storedList.find((g) => g.id === p.id || g.name?.toLowerCase() === p.name.toLowerCase());
    const effectiveStatus = (savedStatuses[p.id] !== undefined)
      ? savedStatuses[p.id]
      : (found && savedStatuses[found.id] !== undefined)
        ? savedStatuses[found.id]
        : (found && found.status)
          ? found.status
          : p.status;

    const effectiveBadge = effectiveStatus === 'Closed' ? 'CLOSED' : effectiveStatus === 'Paused' ? 'PAUSED' : (found?.badge || p.badge);
    const effectiveBadgeType = effectiveStatus === 'Closed' ? 'closed' : effectiveStatus === 'Paused' ? 'paused' : (found?.badgeType || p.badgeType);

    if (!found) {
      return {
        ...p,
        status: effectiveStatus,
        badge: effectiveBadge,
        badgeType: effectiveBadgeType
      };
    }
    return {
      ...p,
      ...found,
      genre: p.genre || found.genre || found.publisher,
      category: p.category || found.category,
      image: found.image || p.image,
      fallbackImage: found.localFallbackImage || p.fallbackImage,
      status: effectiveStatus,
      badge: effectiveBadge,
      badgeType: effectiveBadgeType,
      flagType: found.flagType !== undefined ? found.flagType : p.flagType,
      flagTitle: found.flagTitle || p.flagTitle,
      flagSubtitle: found.flagSubtitle !== undefined ? found.flagSubtitle : p.flagSubtitle,
      flagServerText: found.flagServerText || p.flagServerText,
      flagFrameStyle: found.flagFrameStyle || p.flagFrameStyle,
      flagImage: found.flagImage || p.flagImage,
    };
  });
};

const GameSelection = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [games, setGames] = useState(() => {
    try {
      const stored = getStoredGames();
      return mergeStoredWithPresets(stored);
    } catch (e) {
      return POPULAR_GAMES_PRESET;
    }
  });
  const [masterStatus, setMasterStatus] = useState(getMasterTopupStatus);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Listen for search input changes from Navbar (both desktop and mobile)
  useEffect(() => {
    const handleFilter = (e) => {
      if (e.detail !== undefined) {
        setSearchQuery(e.detail);
      }
    };
    window.addEventListener('filterGames', handleFilter);
    return () => window.removeEventListener('filterGames', handleFilter);
  }, []);

  // Real-Time Background sync with MongoDB Atlas
  useEffect(() => {
    const loaded = getStoredGames();
    if (loaded && loaded.length > 0) {
      setGames(mergeStoredWithPresets(loaded));
    }
    setMasterStatus(getMasterTopupStatus());

    const syncCloudData = async () => {
      try {
        const [cloudGames, cloudStatus] = await Promise.all([
          fetchStoredGames(),
          fetchMasterTopupStatus()
        ]);
        if (cloudGames && Array.isArray(cloudGames) && cloudGames.length > 0) {
          setGames(mergeStoredWithPresets(cloudGames));
        }
        if (cloudStatus) {
          setMasterStatus(cloudStatus);
        }
      } catch (err) {}
    };

    syncCloudData();
    const interval = setInterval(syncCloudData, 3000);

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        syncCloudData();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', syncCloudData);

    const handleStorageChange = () => {
      const stored = getStoredGames();
      if (stored && stored.length > 0) {
        setGames(mergeStoredWithPresets(stored));
      }
      setMasterStatus(getMasterTopupStatus());
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('gamesConfigUpdated', handleStorageChange);
    window.addEventListener('masterTopupStatusUpdated', handleStorageChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', syncCloudData);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('gamesConfigUpdated', handleStorageChange);
      window.removeEventListener('masterTopupStatusUpdated', handleStorageChange);
    };
  }, []);

  const categories = [
    {
      id: 'ALL',
      label: language === 'km' ? 'ហ្គេមទាំងអស់' : 'All Games',
      sub: '',
      renderIcon: (isActive) => (
        <svg className={`w-5 h-5 ${isActive ? 'text-slate-950' : 'text-amber-400'} fill-current drop-shadow-[0_0_8px_rgba(251,191,36,0.6)] transition-transform group-hover:scale-110`} viewBox="0 0 24 24">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      )
    },
    {
      id: 'Telegram Stars',
      label: 'Telegram Stars',
      sub: '',
      renderIcon: (isActive) => (
        <img
          src="/images/telegram-logo.webp"
          alt="Telegram Stars"
          className="w-5 h-5 sm:w-6 sm:h-6 object-contain drop-shadow-sm transition-transform group-hover:scale-110"
        />
      )
    },
    {
      id: 'Steam',
      label: 'Steam',
      sub: '',
      renderIcon: (isActive) => (
        <img
          src="/images/steam-logo.png"
          alt="Steam"
          className="w-5 h-5 sm:w-6 sm:h-6 object-contain drop-shadow-sm transition-transform group-hover:scale-110"
        />
      )
    },
    {
      id: 'Mobile Legends',
      label: 'Mobile Legends',
      sub: '',
      renderIcon: (isActive) => (
        <img
          src="/mlbb-logo.png"
          alt="Mobile Legends"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/mlbb_square_logo.png';
          }}
          className="w-5 h-5 sm:w-6 sm:h-6 object-cover rounded-md shadow-xs transition-transform group-hover:scale-110"
        />
      )
    },
    {
      id: 'PUBG Mobile',
      label: 'PUBG Mobile',
      sub: '',
      renderIcon: (isActive) => (
        <img
          src="/images/pubgm-logo.jpg"
          alt="PUBG Mobile"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/banner_pubg.jpg';
          }}
          className="w-5 h-5 sm:w-6 sm:h-6 object-cover rounded-md shadow-xs transition-transform group-hover:scale-110"
        />
      )
    },
    {
      id: 'Free Fire',
      label: 'Free Fire',
      sub: '',
      renderIcon: (isActive) => (
        <img
          src="/images/freefire-app-icon.png"
          alt="Free Fire"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/freefire-logo.png';
          }}
          className="w-5 h-5 sm:w-6 sm:h-6 object-cover rounded-md shadow-xs transition-transform group-hover:scale-110"
        />
      )
    }
  ];

  const filteredGames = games.filter((game) => {
    const activeLower = activeCategory.toLowerCase();
    const gameId = (game.id || '').toLowerCase();
    const gameName = (game.name || '').toLowerCase();
    const gameCat = (game.category || '').toLowerCase();
    const gameGenre = (game.genre || '').toLowerCase();

    const matchesCategory =
      activeCategory === 'ALL' ||
      (activeLower === 'telegram stars' && (gameId.includes('telegram') || gameName.includes('telegram'))) ||
      (activeLower === 'steam' && (gameId.includes('steam') || gameName.includes('steam'))) ||
      (activeLower === 'mobile legends' && (gameId.includes('mlbb') || gameName.includes('mobile legend') || gameName.includes('mlbb'))) ||
      (activeLower === 'pubg mobile' && (gameId.includes('pubg') || gameName.includes('pubg'))) ||
      (activeLower === 'free fire' && (gameId.includes('freefire') || gameName.includes('free fire'))) ||
      gameCat === activeLower ||
      gameName.includes(activeLower);

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      gameName.includes(q) ||
      gameGenre.includes(q) ||
      gameCat.includes(q);

    return matchesCategory && matchesSearch;
  });

  const handleGameClick = (game) => {
    const isMasterPaused = masterStatus?.status && masterStatus.status !== 'Active';
    const isGamePaused = game.status && game.status !== 'Active';

    if (isMasterPaused || isGamePaused) return;

    if (game.id.startsWith('mlbb') || game.id === 'mlbb') {
      navigate('/topup');
    } else {
      navigate(game.route || '/topup');
    }
  };

  const renderBadge = (badge, badgeType) => {
    if (badgeType === 'paused') {
      return (
        <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full text-[7.5px] sm:text-[9px] font-black tracking-wider uppercase bg-amber-500/25 text-amber-300 border border-amber-400/50 backdrop-blur-md shadow-[0_2px_8px_rgba(245,158,11,0.35)]">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span>PAUSED</span>
        </span>
      );
    }
    if (badgeType === 'closed') {
      return (
        <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full text-[7.5px] sm:text-[9px] font-black tracking-wider uppercase bg-rose-500/25 text-rose-300 border border-rose-400/50 backdrop-blur-md shadow-[0_2px_8px_rgba(244,63,94,0.35)]">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          <span>CLOSED</span>
        </span>
      );
    }
    if (badgeType === 'new') {
      return (
        <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full text-[7.5px] sm:text-[9px] font-black tracking-wider uppercase bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 text-slate-950 shadow-[0_2px_10px_rgba(16,185,129,0.5)] border border-emerald-300/60 font-mono">
          <span className="w-1 h-1 rounded-full bg-slate-950 animate-ping shrink-0" />
          <span>NEW</span>
        </span>
      );
    }
    // Default HOT
    return (
      <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full text-[7.5px] sm:text-[9px] font-black tracking-wider uppercase bg-gradient-to-r from-red-500 via-rose-600 to-orange-500 text-white shadow-[0_2px_12px_rgba(239,68,68,0.55)] border border-red-400/50 font-mono">
        <span className="text-[8px] sm:text-[9px] leading-none">🔥</span>
        <span>HOT</span>
      </span>
    );
  };

  return (
    <section id="games-section" className="py-4 sm:py-6 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 font-khmer space-y-6">
      
      {/* Category Filter Pills (Fluid Auto-Width - No Crop Box!) */}
      <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto py-1 scrollbar-none select-none">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2.5 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl whitespace-nowrap transition-all duration-300 cursor-pointer shrink-0 select-none group font-bold text-xs sm:text-sm ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-black shadow-[0_4px_16px_rgba(251,191,36,0.35)] scale-[1.02] border border-amber-300'
                  : 'bg-[#0f172a]/90 hover:bg-[#1e293b] text-slate-200 border border-slate-800 hover:border-slate-700 shadow-sm hover:text-white'
              }`}
            >
              <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center shrink-0">
                {cat.renderIcon(isActive)}
              </div>
              <span className={`tracking-wide ${
                isActive ? 'text-slate-950 font-black' : 'text-slate-200 group-hover:text-white'
              }`}>
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Section Header: Popular Games */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/30 flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.2)] text-base">
            🔥
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white leading-tight tracking-wide flex items-center gap-2">
              <span>{language === 'km' ? 'ហ្គេមពេញនិយម' : 'Popular Games'}</span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/30">
                Trending
              </span>
            </h2>
            <p className="text-[10px] sm:text-xs text-slate-400 font-medium">
              {language === 'km' ? 'ជ្រើសរើសហ្គេមដើម្បីបញ្ចូលទឹកប្រាក់ភ្លាមៗ' : 'Instant Top-Up & Top Digital Services'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveCategory('ALL')}
          className="px-3 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 hover:border-sky-500/40 text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1.5 transition-all group cursor-pointer shadow-xs"
        >
          <span>{language === 'km' ? 'មើលទាំងអស់' : 'View all'}</span>
          <span className="transition-transform group-hover:translate-x-1">➔</span>
        </button>
      </div>

      {/* Popular Games Responsive Grid: 3 cols on mobile (1 row has 3 product cards), 3 on tablet, 4 on desktop */}
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3.5 lg:gap-4.5">
        {filteredGames.map((game) => {
          const isMasterPaused = masterStatus?.status && masterStatus.status !== 'Active';
          const isGamePaused = game.status && game.status !== 'Active';
          const isInactive = isMasterPaused || isGamePaused;
          const isMLBB = (game.id || '').startsWith('mlbb') || (game.name || '').toLowerCase().includes('mobile legend') || game.category === 'Mobile Legends';
          const hasServerBadge = !isInactive && (
            isMLBB ||
            Boolean(game.flagTitle) ||
            (game.flagType && game.flagType !== 'none') ||
            game.badge?.includes('ខ្មែរ') ||
            game.badge?.includes('SERVER') ||
            game.badge?.includes('SEVER')
          );

          return (
            <div
              key={game.id}
              onClick={isInactive ? (e) => e.preventDefault() : () => handleGameClick(game)}
              className={`group relative rounded-xl sm:rounded-2xl p-2 sm:p-2.5 transition-all duration-300 flex flex-col select-none overflow-hidden ${
                isInactive
                  ? 'bg-gradient-to-b from-[#0c1222]/90 to-[#070b16]/95 border border-slate-800/80 opacity-80 cursor-not-allowed'
                  : 'bg-gradient-to-b from-[#0f172a]/95 via-[#0b1222]/95 to-[#070b16]/98 border border-slate-800/90 hover:border-cyan-500/60 shadow-[0_4px_20px_rgba(0,0,0,0.6)] hover:shadow-[0_12px_35px_rgba(14,165,233,0.25)] hover:-translate-y-1 cursor-pointer'
              }`}
            >
              {/* Premium Cyber Game Image Frame (1:1 uncropped square ratio) */}
              <div className="relative mb-1.5 sm:mb-2.5 rounded-xl sm:rounded-2xl p-[1.5px] bg-gradient-to-b from-cyan-400/50 via-slate-700/60 to-blue-600/40 group-hover:from-cyan-300 group-hover:via-sky-400 group-hover:to-blue-500 transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_24px_rgba(14,165,233,0.38)]">
                <div className="relative aspect-square w-full rounded-[10px] sm:rounded-[14px] overflow-hidden bg-slate-950 flex items-center justify-center">
                  <img
                    src={game.image}
                    alt={game.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = game.fallbackImage || game.localFallbackImage || '/mlbb-logo.png';
                    }}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out filter brightness-[1.02] contrast-[1.03] group-hover:brightness-[1.06]"
                  />

                  {/* Subtle Ambient Light Overlay (no heavy dark cropping) */}
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-950/25 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity duration-300" />

                  {/* Inner High-Tech Bevel Ring */}
                  <div className="absolute inset-0 pointer-events-none rounded-[10px] sm:rounded-[14px] ring-1 ring-inset ring-white/15 group-hover:ring-cyan-300/40 transition-colors duration-300" />

                  {/* Diagonal Shimmer Light Sweep on Hover */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12 pointer-events-none z-10" />

                  {/* Top Right Status Badge */}
                  {game.badge && (
                    <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 z-20">
                      {renderBadge(game.badge, game.badgeType)}
                    </div>
                  )}
                </div>
              </div>

              {/* Game Details: Title, Server Name & Genre */}
              <div className="text-left min-w-0">
                <h3 className="font-black text-[10.5px] xs:text-xs sm:text-base text-white group-hover:text-cyan-300 transition-colors truncate leading-tight tracking-tight">
                  {game.name}
                </h3>

                {/* Server Name Indicator (Clean, prominent & unblocking) */}
                {hasServerBadge && (
                  <div className="mt-1 flex items-center">
                    <span className="inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded-md bg-[#08152e] border border-cyan-400/40 text-cyan-200 text-[8.5px] xs:text-[9.5px] sm:text-[11px] font-bold shadow-xs truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                      <img
                        src={game.flagType === 'ph' ? '/flags/4x3/ph.svg' : game.flagType === 'id' ? '/flags/4x3/id.svg' : '/kh.svg'}
                        alt="Flag"
                        className="w-3.5 h-2.5 sm:w-4 sm:h-3 object-cover rounded-[1.5px] border border-white/20 shrink-0 shadow-xs"
                      />
                      <span className="truncate">{game.flagTitle || (isMLBB ? "សេវើខ្មែរ 5v5" : "Official Server")}</span>
                    </span>
                  </div>
                )}

                <p className="text-[8.5px] xs:text-[9.5px] sm:text-xs font-semibold text-slate-400 mt-0.5 sm:mt-1 truncate flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0 inline-block" />
                  <span className="truncate">{game.genre}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* SECTION: ពិសេសសម្រាប់អ្នក / Special for You (Exact 3 Cards matching mockup) */}
      {/* ========================================================= */}
      <div id="promotions" className="pt-6 sm:pt-8 space-y-4">
        {/* Section Header */}
        <div className="flex items-end justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 p-[1.5px] shadow-[0_0_18px_rgba(251,146,60,0.45)]">
              <div className="w-full h-full rounded-[14px] bg-[#0a0f1f] flex items-center justify-center text-lg">
                🎁
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-rose-500 border-2 border-[#050a18] animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black leading-tight bg-gradient-to-r from-white via-sky-100 to-sky-300 bg-clip-text text-transparent">
                {language === 'km' ? 'ពិសេសសម្រាប់អ្នក' : 'Special for You'}
              </h2>
              <p className="text-[10px] sm:text-xs text-slate-400 font-medium">
                {language === 'km' ? 'ការផ្ដល់ជូនពិសេស និងបញ្ចុះតម្លៃផ្តាច់មុខ' : 'Exclusive deals picked just for you'}
              </p>
            </div>
          </div>

          <Link
            to="/topup"
            className="shrink-0 px-3 py-1.5 rounded-full bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 hover:border-sky-400/60 text-[11px] sm:text-xs font-bold text-sky-300 hover:text-white flex items-center gap-1.5 transition-all group"
          >
            <span>{language === 'km' ? 'មើលទាំងអស់' : 'View all'}</span>
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </div>

        {/* Promo Cards - 1 row, 3 columns */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
          {[
            {
              key: 'discount',
              to: '/topup',
              img: '/images/special_gift_box_3d.png',
              fallback: '/images/special_art_gift.png',
              title: language === 'km' ? 'បញ្ចុះតម្លៃពិសេស' : 'Special Discount',
              subtitle: language === 'km' ? 'ការផ្តល់ជូនល្អបំផុតប្រចាំថ្ងៃ' : 'Best daily deals & bonuses',
              badge: language === 'km' ? '🔥 ពេញនិយម' : '🔥 HOT',
              chip: language === 'km' ? 'រហូតដល់ -20%' : 'Up to -20%',
              cta: language === 'km' ? 'ទិញឥឡូវ' : 'Buy Now',
              theme: {
                card: 'from-[#2a1804] via-[#160c02] to-[#0a0601]',
                border: 'border-amber-500/40 hover:border-amber-400/90',
                glow: 'bg-amber-500/25',
                shadow: 'hover:shadow-[0_10px_35px_-5px_rgba(245,158,11,0.35)]',
                title: 'text-amber-100',
                sub: 'text-amber-200/70',
                badge: 'bg-gradient-to-r from-rose-500 to-orange-500 text-white',
                chip: 'bg-amber-400/10 border-amber-400/30 text-amber-300',
                btn: 'bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 text-slate-950 shadow-[0_4px_14px_rgba(245,158,11,0.45)]',
                line: 'from-transparent via-amber-400/70 to-transparent',
                drop: 'drop-shadow-[0_6px_18px_rgba(251,191,36,0.5)]',
              },
            },
            {
              key: 'telegram',
              to: '/topup?service=telegram_stars',
              img: '/images/special_telegram_stars_3d.png',
              fallback: '/images/special_art_telegram.png',
              title: 'Telegram Stars',
              subtitle: language === 'km' ? 'ទទួលបានភ្លាមៗ គ្មានការរង់ចាំ' : 'Delivered instantly to your account',
              badge: language === 'km' ? '⚡ លឿន' : '⚡ INSTANT',
              chip: language === 'km' ? 'ពី 50 ⭐' : 'From 50 ⭐',
              cta: language === 'km' ? 'មើលកញ្ចប់' : 'View Deals',
              theme: {
                card: 'from-[#04274f] via-[#021733] to-[#010a17]',
                border: 'border-sky-500/40 hover:border-sky-400/90',
                glow: 'bg-sky-500/25',
                shadow: 'hover:shadow-[0_10px_35px_-5px_rgba(56,189,248,0.35)]',
                title: 'text-white',
                sub: 'text-sky-200/70',
                badge: 'bg-gradient-to-r from-sky-400 to-cyan-400 text-slate-950',
                chip: 'bg-sky-400/10 border-sky-400/30 text-sky-300',
                btn: 'bg-gradient-to-r from-sky-400 via-sky-500 to-blue-600 text-white shadow-[0_4px_14px_rgba(56,189,248,0.45)]',
                line: 'from-transparent via-sky-400/70 to-transparent',
                drop: 'drop-shadow-[0_6px_18px_rgba(56,189,248,0.5)]',
              },
            },
            {
              key: 'steam',
              to: '/topup?service=steam',
              img: '/images/special_steam_wallet_3d.png',
              fallback: '/images/special_art_steam.png',
              title: 'Steam Wallet',
              subtitle: language === 'km' ? 'បញ្ចូលសមតុល្យ Steam CIS' : 'Steam CIS balance top-up',
              badge: language === 'km' ? '✨ ថ្មី' : '✨ NEW',
              chip: language === 'km' ? 'សុវត្ថិភាព 100%' : '100% Safe',
              cta: language === 'km' ? 'ទិញឥឡូវ' : 'Buy Now',
              theme: {
                card: 'from-[#0d1a48] via-[#071030] to-[#020617]',
                border: 'border-indigo-500/40 hover:border-indigo-400/90',
                glow: 'bg-indigo-500/25',
                shadow: 'hover:shadow-[0_10px_35px_-5px_rgba(99,102,241,0.35)]',
                title: 'text-white',
                sub: 'text-indigo-200/70',
                badge: 'bg-gradient-to-r from-violet-500 to-indigo-500 text-white',
                chip: 'bg-indigo-400/10 border-indigo-400/30 text-indigo-300',
                btn: 'bg-gradient-to-r from-indigo-500 via-blue-600 to-sky-600 text-white shadow-[0_4px_14px_rgba(99,102,241,0.45)]',
                line: 'from-transparent via-indigo-400/70 to-transparent',
                drop: 'drop-shadow-[0_6px_18px_rgba(99,102,241,0.5)]',
              },
            },
          ].map((promo) => (
            <Link
              key={promo.key}
              to={promo.to}
              className={`relative group block rounded-2xl p-[1px] border ${promo.theme.border} ${promo.theme.shadow} bg-gradient-to-br ${promo.theme.card} transition-all duration-300 hover:-translate-y-0.5 overflow-hidden select-none min-h-[140px] sm:min-h-[160px] md:min-h-[180px] lg:min-h-[200px] flex items-center justify-center`}
            >
              {/* Top accent line */}
              <div className={`absolute top-0 inset-x-6 h-px bg-gradient-to-r ${promo.theme.line}`} />
              {/* Ambient glow behind art */}
              <div className={`absolute -right-6 -top-6 w-28 h-28 sm:w-36 sm:h-36 ${promo.theme.glow} rounded-full blur-2xl pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity`} />
              {/* Subtle dot pattern */}
              <div
                className="absolute inset-0 opacity-[0.06] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '14px 14px' }}
              />

              {/* 3D Art - ALWAYS VISIBLE BY DEFAULT */}
              <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-3 sm:p-4">
                <div className="relative w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 flex items-center justify-center">
                  <div className="absolute inset-2 rounded-full bg-white/5 blur-md" />
                  <img
                    src={promo.img}
                    alt={promo.title}
                    loading="lazy"
                    className={`relative w-full h-full object-contain ${promo.theme.drop} transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}
                    onError={(e) => {
                      if (e.target.src.indexOf(promo.fallback) === -1) e.target.src = promo.fallback;
                    }}
                  />
                </div>
                {/* Minimal label under image in normal state */}
                <div className="mt-1 text-center transition-opacity duration-200 group-hover:opacity-0">
                  <span className={`px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-black tracking-wider uppercase shadow-sm ${promo.theme.badge}`}>
                    {promo.badge}
                  </span>
                </div>
              </div>

              {/* Text & Action Details - HIDDEN BY DEFAULT, REVEALED ON HOVER */}
              <div className="absolute inset-0 z-20 bg-[#070d1e]/90 sm:bg-[#070d1e]/95 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 p-2.5 sm:p-4 flex flex-col items-center justify-center text-center">
                <span className={`px-2 py-0.5 rounded-md text-[8px] sm:text-[9px] font-black tracking-wider uppercase shadow-sm ${promo.theme.badge}`}>
                  {promo.badge}
                </span>
                
                <h3 className={`mt-1.5 font-black text-xs sm:text-sm md:text-base leading-tight ${promo.theme.title}`}>
                  {promo.title}
                </h3>
                
                <p className={`text-[9px] sm:text-[11px] font-medium leading-snug mt-1 text-slate-300 line-clamp-2 max-w-[90%]`}>
                  {promo.subtitle}
                </p>

                <div className="mt-2.5 sm:mt-3 flex flex-col items-center gap-1.5 w-full">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-black text-[10px] sm:text-xs transition-transform group-hover:scale-105 active:scale-95 shadow-md ${promo.theme.btn}`}>
                    <span>{promo.cta}</span>
                    <span className="text-[10px]">→</span>
                  </span>
                  
                  <span className={`px-2 py-0.5 rounded-full border text-[8.5px] sm:text-[9.5px] font-bold ${promo.theme.chip}`}>
                    {promo.chip}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </section>
  );
};

export default GameSelection;
