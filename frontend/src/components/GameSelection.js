import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getStoredGames, getMasterTopupStatus, fetchStoredGames, fetchMasterTopupStatus } from '../services/gamesConfig';
import { CambodiaFlagFrame } from './CambodiaFlagBadge';

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
    flagTitle: 'SEVER ខ្មែរ',
    flagSubtitle: 'KH',
    flagServerText: 'DIRECT',
    flagFrameStyle: 'gold_cyber',
    image: 'https://res.cloudinary.com/dpz7vpmf8/image/upload/v1790944937/logo-game/srnteatj2ns0e2dswfwq.webp',
    fallbackImage: '/images/banner_freefire.jpg',
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
    badge: 'HOT',
    badgeType: 'hot',
    flagType: 'global',
    flagTitle: 'GLOBAL UC',
    flagSubtitle: 'PUBG',
    flagServerText: 'DIRECT',
    flagFrameStyle: 'gold_cyber',
    image: 'https://res.cloudinary.com/dpz7vpmf8/image/upload/v1790944800/logo-game/ovdfdmru7jnhmwjvy6vy.jpg',
    fallbackImage: '/images/pubgm-banner.jpg',
    status: 'Active',
    route: '/topup?game=pubgm'
  },
  {
    id: 'level_up_pass',
    name: 'LEVEL UP PASS',
    genre: 'Event & Reward',
    category: 'Mobile Legends',
    badge: 'NEW',
    badgeType: 'new',
    flagType: 'kh',
    flagTitle: 'សេវើខ្មែរ 5v5',
    flagSubtitle: '5V5',
    flagServerText: 'SERVER',
    flagFrameStyle: 'gold_cyber',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop&q=80',
    fallbackImage: '/mlbb-logo.png',
    status: 'Active',
    route: '/topup?game=mlbb&tab=pass'
  },
  {
    id: 'magic_chess',
    name: 'MAGIC CHESS',
    genre: 'Auto Chess',
    category: 'Mobile Legends',
    badge: 'PAUSED',
    badgeType: 'paused',
    flagType: 'kh',
    flagTitle: 'សេវើខ្មែរ 5v5',
    flagSubtitle: '5V5',
    flagServerText: 'SERVER',
    flagFrameStyle: 'gold_cyber',
    image: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=500&auto=format&fit=crop&q=80',
    fallbackImage: '/mlbb-logo.png',
    status: 'Paused',
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
    badge: 'HOT',
    badgeType: 'hot',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=80',
    fallbackImage: '/mlbb-logo.png',
    status: 'Active',
    route: '/topup?game=rov'
  },
  {
    id: 'steam_games',
    name: 'STEAM GAMES',
    genre: 'Top PC Games',
    category: 'Steam',
    badge: 'NEW',
    badgeType: 'new',
    image: '/images/steam-logo.png',
    fallbackImage: '/images/steam-logo.png',
    status: 'Active',
    route: '/topup?service=steam'
  },
  {
    id: 'minecraft',
    name: 'MINECRAFT',
    genre: 'Sandbox',
    category: 'Service top-up',
    badge: 'NEW',
    badgeType: 'new',
    image: 'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?w=500&auto=format&fit=crop&q=80',
    fallbackImage: '/images/banner_pubg.jpg',
    status: 'Active',
    route: '/topup?game=minecraft'
  },
  {
    id: 'roblox',
    name: 'ROBLOX',
    genre: 'Adventure',
    category: 'Service top-up',
    badge: 'HOT',
    badgeType: 'hot',
    image: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=500&auto=format&fit=crop&q=80',
    fallbackImage: '/mlbb-logo.png',
    status: 'Active',
    route: '/topup?game=roblox'
  },
  {
    id: 'one_piece',
    name: 'ONE PIECE',
    genre: 'RPG Adventure',
    category: 'Service top-up',
    badge: 'PAUSED',
    badgeType: 'paused',
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=80',
    fallbackImage: '/images/banner_mlbb_aldous.jpg',
    status: 'Paused',
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
  if (!storedList || !Array.isArray(storedList) || storedList.length === 0) {
    return POPULAR_GAMES_PRESET;
  }
  return POPULAR_GAMES_PRESET.map((p) => {
    const found = storedList.find((g) => g.id === p.id || g.name?.toLowerCase() === p.name.toLowerCase());
    if (!found) return p;
    return {
      ...p,
      ...found,
      genre: p.genre || found.genre || found.publisher,
      category: p.category || found.category,
      image: found.image || p.image,
      fallbackImage: found.localFallbackImage || p.fallbackImage,
      status: found.status || p.status,
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
        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[6.5px] sm:text-[8px] font-black tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 backdrop-blur-md shadow-xs">
          <span className="w-1 h-1 rounded-full bg-amber-400 animate-pulse" />
          <span>PAUSED</span>
        </span>
      );
    }
    if (badgeType === 'closed') {
      return (
        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[6.5px] sm:text-[8px] font-black tracking-wider uppercase bg-rose-500/20 text-rose-300 border border-rose-500/40 backdrop-blur-md shadow-xs">
          <span className="w-1 h-1 rounded-full bg-rose-500" />
          <span>CLOSED</span>
        </span>
      );
    }
    if (badgeType === 'new') {
      return (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[6.5px] sm:text-[8px] font-black tracking-wider uppercase bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-xs">
          NEW
        </span>
      );
    }
    // Default HOT
    return (
      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[6.5px] sm:text-[8px] font-black tracking-wider uppercase bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-xs">
        HOT
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

      {/* Popular Games 4-Column Responsive Grid matching screenshot */}
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2.5 md:gap-3.5 lg:gap-4">
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
              className={`group relative rounded-xl sm:rounded-2xl p-1.5 sm:p-2.5 transition-all duration-300 flex flex-col justify-between select-none overflow-hidden ${
                isInactive
                  ? 'bg-gradient-to-b from-[#0c1222]/90 to-[#070b16]/95 border border-slate-800/80 opacity-80 cursor-not-allowed'
                  : 'bg-gradient-to-b from-[#0f172a]/95 via-[#0b1222]/95 to-[#070b16]/98 border border-slate-800/80 hover:border-sky-500/50 shadow-[0_4px_16px_rgba(0,0,0,0.5)] hover:shadow-[0_10px_30px_rgba(14,165,233,0.15)] hover:-translate-y-0.5 cursor-pointer'
              }`}
            >
              {/* Game Artwork Cover (4:3 aspect) */}
              <div className="relative aspect-[4/3] w-full rounded-lg sm:rounded-xl overflow-hidden bg-slate-950 mb-1 border border-slate-800/60 shadow-xs">
                <img
                  src={game.image}
                  alt={game.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = game.fallbackImage || game.localFallbackImage || '/mlbb-logo.png';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Subtle gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />

                {/* 3D Server Badge Frame (when active) */}
                {!isInactive && hasServerBadge && (
                  <div className="absolute top-1 left-1 z-20 pointer-events-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] scale-[0.52] xs:scale-[0.58] sm:scale-[0.68] md:scale-[0.76] origin-top-left">
                    <CambodiaFlagFrame
                      title={game.flagTitle || (isMLBB ? "សេវើខ្មែរ 5v5" : game.badge)}
                      subtitle={game.flagSubtitle || (isMLBB ? "5V5" : "")}
                      sub={game.flagServerText || (game.badge?.includes('PH') ? 'OFFICIAL' : game.badge?.includes('ID') ? 'FAST' : 'SERVER')}
                      flagType={game.flagType || (game.badge?.includes('PH') ? 'ph' : game.badge?.includes('ID') ? 'id' : isMLBB ? 'kh' : 'kh')}
                      flagImage={game.flagImage || null}
                      badgeStyle={game.flagFrameStyle || "gold_cyber"}
                    />
                  </div>
                )}

                {/* Top Right Status Badge */}
                <div className="absolute top-1 right-1 z-20">
                  {renderBadge(game.badge, game.badgeType)}
                </div>
              </div>

              {/* Game Details: Title & Genre */}
              <div className="mb-1 sm:mb-1.5 text-center sm:text-left min-w-0">
                <h3 className="font-black text-[8px] sm:text-[11px] md:text-xs text-white group-hover:text-amber-300 transition-colors truncate leading-tight tracking-tight">
                  {game.name}
                </h3>
                <p className="text-[6.5px] sm:text-[9px] font-bold text-sky-400 mt-0.5 truncate flex items-center justify-center sm:justify-start gap-0.5">
                  <span className="w-1 h-1 rounded-full bg-sky-400 shrink-0 inline-block" />
                  <span className="truncate">{game.genre}</span>
                </p>
              </div>

              {/* Action Button */}
              <div className="mt-auto w-full">
                {isInactive ? (
                  <button
                    type="button"
                    disabled
                    className="w-full py-1 sm:py-1.5 px-1 rounded-lg bg-slate-800/90 text-slate-400 font-bold text-[7.5px] sm:text-[10px] flex items-center justify-center gap-0.5 cursor-not-allowed border border-slate-700/60"
                  >
                    <span>{language === 'km' ? 'បិទមើល' : 'Closed'}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGameClick(game);
                    }}
                    className="w-full py-1 sm:py-1.5 px-1 rounded-lg bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-[7.5px] sm:text-[10px] flex items-center justify-center gap-0.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                  >
                    <span>{language === 'km' ? 'ចូលលេង' : 'Play'}</span>
                    <span className="text-[8px] sm:text-[10px]">›</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* SECTION: ពិសេសសម្រាប់អ្នក / Special for You             */}
      {/* ========================================================= */}
      <div id="promotions" className="pt-6 sm:pt-8 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-amber-500/20 via-sky-500/15 to-blue-500/10 border border-sky-500/30 flex items-center justify-center shadow-[0_0_16px_rgba(56,189,248,0.25)] text-lg">
              🎁
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight leading-tight">
                  {language === 'km' ? 'ពិសេសសម្រាប់អ្នក' : 'Special for You'}
                </h2>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9.5px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
                  HOT
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-400 font-medium">
                {language === 'km' ? 'ការផ្ដល់ជូនពិសេស និងបញ្ចុះតម្លៃផ្តាច់មុខសម្រាប់អ្នក' : 'Exclusive promotions, instant top-ups & special gamer deals'}
              </p>
            </div>
          </div>

          <Link
            to="/topup"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-sky-950/70 border border-slate-800 hover:border-sky-500/40 text-xs font-bold text-sky-400 hover:text-white transition-all shadow-sm group shrink-0 active:scale-95"
          >
            <span>{language === 'km' ? 'មើលទាំងអស់' : 'View all'}</span>
            <span className="transition-transform group-hover:translate-x-1">➔</span>
          </Link>
        </div>

        {/* 3 Premium Wide Promo Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-3.5 lg:gap-4">
          
          {/* Card 1: Special Discount (3D Red Gift Box with Gold Coins) */}
          <Link
            to="/topup"
            className="group relative rounded-3xl p-3.5 sm:p-4 bg-gradient-to-br from-[#1a1205] via-[#100a02] to-[#080501] border border-amber-500/40 hover:border-amber-400/90 shadow-[0_10px_30px_rgba(0,0,0,0.6),0_0_20px_rgba(245,158,11,0.12)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(245,158,11,0.28)] flex items-center justify-between transition-all duration-300 select-none overflow-hidden active:scale-[0.99]"
          >
            {/* Ambient glows & glossy sheen */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
            <div className="absolute -left-6 -bottom-6 w-32 h-32 bg-amber-500/15 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
            
            <div className="w-18 h-18 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center relative z-10">
              <img
                src="/images/special_gift_box_3d.png"
                alt="Special Discount"
                className="w-full h-full object-contain drop-shadow-[0_8px_16px_rgba(251,191,36,0.35)] group-hover:scale-110 group-hover:-translate-y-0.5 transition-all duration-300"
                onError={(e) => {
                  e.target.src = '/images/special_art_gift.png';
                }}
              />
            </div>

            <div className="flex-1 min-w-0 pl-3 sm:pl-3.5 flex flex-col justify-center items-start relative z-10">
              <div className="flex items-center justify-between w-full gap-1 mb-1">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/35">
                  <span>🔥</span>
                  <span>{language === 'km' ? 'បញ្ចុះតម្លៃ 30%' : 'Save 30%'}</span>
                </span>
              </div>
              <h3 className="font-black text-sm sm:text-base text-amber-100 group-hover:text-amber-200 transition-colors leading-tight truncate w-full">
                {language === 'km' ? 'បញ្ចុះតម្លៃពិសេស' : 'Special Discount'}
              </h3>
              <p className="text-[10px] sm:text-[11px] text-amber-200/70 font-medium leading-tight mt-0.5 truncate w-full">
                {language === 'km' ? 'ការផ្ដល់ជូនពេជ្រ និងកញ្ចប់ប្រូម៉ូសិន' : 'Best Deals & Discounts'}
              </p>
              
              <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 font-black text-[11px] shadow-[0_2px_12px_rgba(245,158,11,0.4)] group-hover:brightness-110 transition-all">
                <span>{language === 'km' ? 'ទិញពេលឥឡូវ' : 'Buy Now'}</span>
                <span className="transition-transform group-hover:translate-x-1">➔</span>
              </div>
            </div>
          </Link>

          {/* Card 2: Telegram Stars (3D Telegram Badge with Floating Stars) */}
          <Link
            to="/topup?service=telegram_stars"
            className="group relative rounded-3xl p-3.5 sm:p-4 bg-gradient-to-br from-[#031d3d] via-[#021226] to-[#010814] border border-sky-500/40 hover:border-sky-400/90 shadow-[0_10px_30px_rgba(0,0,0,0.6),0_0_20px_rgba(56,189,248,0.12)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(56,189,248,0.28)] flex items-center justify-between transition-all duration-300 select-none overflow-hidden active:scale-[0.99]"
          >
            {/* Ambient glows & glossy sheen */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-sky-400/50 to-transparent" />
            <div className="absolute -left-6 -bottom-6 w-32 h-32 bg-sky-500/15 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
            
            <div className="w-18 h-18 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center relative z-10">
              <img
                src="/images/special_telegram_stars_3d.png"
                alt="Telegram Stars"
                className="w-full h-full object-contain drop-shadow-[0_8px_16px_rgba(56,189,248,0.35)] group-hover:scale-110 group-hover:-translate-y-0.5 transition-all duration-300"
                onError={(e) => {
                  e.target.src = '/images/special_art_telegram.png';
                }}
              />
            </div>

            <div className="flex-1 min-w-0 pl-3 sm:pl-3.5 flex flex-col justify-center items-start relative z-10">
              <div className="flex items-center justify-between w-full gap-1 mb-1">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/35">
                  <span>⭐</span>
                  <span>{language === 'km' ? 'ពេញនិយម' : 'Popular'}</span>
                </span>
              </div>
              <h3 className="font-black text-sm sm:text-base text-white group-hover:text-sky-200 transition-colors leading-tight truncate w-full">
                Telegram Stars
              </h3>
              <p className="text-[10px] sm:text-[11px] text-sky-200/70 font-medium leading-tight mt-0.5 truncate w-full">
                {language === 'km' ? 'ផ្ញើចូលគណនីក្នុង 10 វិនាទី' : 'Instant Stars Delivery'}
              </p>
              
              <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-sky-400 via-sky-500 to-blue-600 text-white font-black text-[11px] shadow-[0_2px_12px_rgba(56,189,248,0.4)] group-hover:brightness-110 transition-all">
                <span>{language === 'km' ? 'ចូលមើល' : 'View Deals'}</span>
                <span className="transition-transform group-hover:translate-x-1">➔</span>
              </div>
            </div>
          </Link>

          {/* Card 3: Steam Wallet (3D Steam Emblem with Floating Crystals) */}
          <Link
            to="/topup?service=steam"
            className="group relative rounded-3xl p-3.5 sm:p-4 bg-gradient-to-br from-[#051636] via-[#030d22] to-[#010612] border border-blue-500/40 hover:border-blue-400/90 shadow-[0_10px_30px_rgba(0,0,0,0.6),0_0_20px_rgba(59,130,246,0.12)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(59,130,246,0.28)] flex items-center justify-between transition-all duration-300 select-none overflow-hidden active:scale-[0.99]"
          >
            {/* Ambient glows & glossy sheen */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />
            <div className="absolute -left-6 -bottom-6 w-32 h-32 bg-blue-500/15 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
            
            <div className="w-18 h-18 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center relative z-10">
              <img
                src="/images/special_steam_wallet_3d.png"
                alt="Steam Wallet"
                className="w-full h-full object-contain drop-shadow-[0_8px_16px_rgba(59,130,246,0.35)] group-hover:scale-110 group-hover:-translate-y-0.5 transition-all duration-300"
                onError={(e) => {
                  e.target.src = '/images/special_art_steam.png';
                }}
              />
            </div>

            <div className="flex-1 min-w-0 pl-3 sm:pl-3.5 flex flex-col justify-center items-start relative z-10">
              <div className="flex items-center justify-between w-full gap-1 mb-1">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/35">
                  <span>⚡</span>
                  <span>{language === 'km' ? 'សុវត្ថិភាព 100%' : 'Direct USD'}</span>
                </span>
              </div>
              <h3 className="font-black text-sm sm:text-base text-white group-hover:text-blue-200 transition-colors leading-tight truncate w-full">
                Steam Wallet
              </h3>
              <p className="text-[10px] sm:text-[11px] text-blue-200/70 font-medium leading-tight mt-0.5 truncate w-full">
                {language === 'km' ? 'បញ្ចូលកូដលឿនរហ័ស' : 'Steam CIS & Global'}
              </p>
              
              <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 text-white font-black text-[11px] shadow-[0_2px_12px_rgba(59,130,246,0.4)] group-hover:brightness-110 transition-all">
                <span>{language === 'km' ? 'ទិញពេលឥឡូវ' : 'Buy Now'}</span>
                <span className="transition-transform group-hover:translate-x-1">➔</span>
              </div>
            </div>
          </Link>

        </div>
      </div>

    </section>
  );
};

export default GameSelection;
