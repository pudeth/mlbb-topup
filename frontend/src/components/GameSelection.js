import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getStoredGames, getMasterTopupStatus, fetchStoredGames, fetchMasterTopupStatus } from '../services/gamesConfig';

// 12 Popular Games Preset matching desktop/laptop screenshot exactly
const POPULAR_GAMES_PRESET = [
  {
    id: 'freefire_kh',
    name: 'FREE FIRE KH',
    genre: 'Garena Free Fire',
    category: 'Free Fire',
    badge: 'HOT',
    badgeType: 'hot',
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
    image: '/images/steam-logo.svg',
    fallbackImage: '/images/steam-logo.svg',
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

const GameSelection = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [games, setGames] = useState(POPULAR_GAMES_PRESET);
  const [masterStatus, setMasterStatus] = useState(getMasterTopupStatus);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery] = useState('');

  // Real-Time Background sync with MongoDB Atlas
  useEffect(() => {
    const loaded = getStoredGames();
    if (loaded && loaded.length > 0) {
      // Merge stored games with presets
      const merged = POPULAR_GAMES_PRESET.map((p) => {
        const found = loaded.find((g) => g.id === p.id || g.name?.toLowerCase() === p.name.toLowerCase());
        return found ? { ...p, status: found.status || p.status, image: found.image || p.image } : p;
      });
      setGames(merged);
    }
    setMasterStatus(getMasterTopupStatus());

    const syncCloudData = async () => {
      try {
        const [cloudGames, cloudStatus] = await Promise.all([
          fetchStoredGames(),
          fetchMasterTopupStatus()
        ]);
        if (cloudGames && Array.isArray(cloudGames) && cloudGames.length > 0) {
          const merged = POPULAR_GAMES_PRESET.map((p) => {
            const found = cloudGames.find((g) => g.id === p.id || g.name?.toLowerCase() === p.name.toLowerCase());
            return found ? { ...p, status: found.status || p.status, image: found.image || p.image } : p;
          });
          setGames(merged);
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
        const merged = POPULAR_GAMES_PRESET.map((p) => {
          const found = stored.find((g) => g.id === p.id || g.name?.toLowerCase() === p.name.toLowerCase());
          return found ? { ...p, status: found.status || p.status, image: found.image || p.image } : p;
        });
        setGames(merged);
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
    { id: 'ALL', label: language === 'km' ? 'ហ្គេមទាំងអស់' : 'All Games', sub: 'All Games', icon: '⚡' },
    { id: 'Telegram Stars', label: 'Telegram Stars', sub: 'Instant Stars', icon: '✈️' },
    { id: 'Steam', label: 'Steam', sub: 'Top-Up & Gift', icon: '💨' },
    { id: 'Mobile Legends', label: 'Mobile Legends', sub: '5v5 MOBA', icon: '🛡️' },
    { id: 'PUBG Mobile', label: 'PUBG Mobile', sub: 'Battle Royale', icon: '🪖' },
    { id: 'Free Fire', label: 'Free Fire', sub: 'Survival Battle', icon: '🔥' }
  ];

  const filteredGames = games.filter((game) => {
    const matchesCategory =
      activeCategory === 'ALL' ||
      game.category?.toLowerCase() === activeCategory.toLowerCase() ||
      game.name?.toLowerCase().includes(activeCategory.toLowerCase());

    const matchesSearch =
      !searchQuery.trim() ||
      game.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.genre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.category?.toLowerCase().includes(searchQuery.toLowerCase());

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
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8.5px] font-black tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 backdrop-blur-md shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span>PAUSED</span>
        </span>
      );
    }
    if (badgeType === 'closed') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8.5px] font-black tracking-wider uppercase bg-rose-500/20 text-rose-300 border border-rose-500/40 backdrop-blur-md shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          <span>CLOSED</span>
        </span>
      );
    }
    if (badgeType === 'new') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[8.5px] font-black tracking-wider uppercase bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-sm">
          NEW
        </span>
      );
    }
    // Default HOT
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[8.5px] font-black tracking-wider uppercase bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-sm">
        HOT
      </span>
    );
  };

  return (
    <section id="games-section" className="py-4 sm:py-6 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 font-khmer space-y-6">
      
      {/* Category Pills Horizontal Bar (Exact match to screenshot) */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none select-none">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 sm:px-5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-300 flex items-center gap-2.5 cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-slate-950 font-black shadow-[0_4px_18px_rgba(251,191,36,0.35)] scale-[1.02] border border-amber-300'
                  : 'bg-[#0f172a]/90 hover:bg-[#1e293b] text-slate-300 border border-slate-800 hover:border-slate-700 shadow-md'
              }`}
            >
              <span className="text-sm">{cat.icon}</span>
              <div className="flex flex-col text-left leading-none">
                <span className="text-[12px] font-black">{cat.label}</span>
                <span className={`text-[9px] mt-0.5 ${isActive ? 'text-amber-950 font-bold' : 'text-slate-500'}`}>
                  {cat.sub}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Section Header: Popular Games */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">🔥</span>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
              {language === 'km' ? 'ហ្គេមពេញនិយម' : 'Popular Games'}
            </h2>
            <p className="text-[10px] sm:text-xs text-slate-400 font-medium">
              Popular Games
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveCategory('ALL')}
          className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors group cursor-pointer"
        >
          <span>{language === 'km' ? 'មើលទាំងអស់' : 'View all'}</span>
          <span className="transition-transform group-hover:translate-x-1">➔</span>
        </button>
      </div>

      {/* Popular Games 4-Column Responsive Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-4.5">
        {filteredGames.map((game) => {
          const isMasterPaused = masterStatus?.status && masterStatus.status !== 'Active';
          const isGamePaused = game.status && game.status !== 'Active';
          const isInactive = isMasterPaused || isGamePaused;

          return (
            <div
              key={game.id}
              onClick={isInactive ? (e) => e.preventDefault() : () => handleGameClick(game)}
              className={`group relative rounded-2xl p-2.5 sm:p-3 transition-all duration-300 flex flex-col justify-between select-none overflow-hidden ${
                isInactive
                  ? 'bg-gradient-to-b from-[#0c1222]/90 to-[#070b16]/95 border border-slate-800/80 opacity-75 cursor-not-allowed'
                  : 'bg-gradient-to-b from-[#0f172a]/95 via-[#0b1222]/95 to-[#070b16]/98 border border-slate-800/80 hover:border-sky-500/50 shadow-[0_4px_16px_rgba(0,0,0,0.5)] hover:shadow-[0_10px_30px_rgba(14,165,233,0.15)] hover:-translate-y-1 cursor-pointer'
              }`}
            >
              {/* Top Row: Status Badge Pill */}
              <div className="flex items-center justify-between mb-2 z-10">
                {renderBadge(game.badge, game.badgeType)}
              </div>

              {/* Game Artwork Cover (4:3 aspect) */}
              <div className="relative aspect-[16/11] w-full rounded-xl overflow-hidden bg-slate-950 mb-2.5 border border-slate-800/60 shadow-md">
                <img
                  src={game.image}
                  alt={game.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = game.fallbackImage || '/mlbb-logo.png';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Subtle gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Game Details: Title & Genre */}
              <div className="mb-3 text-left">
                <h3 className="font-black text-xs sm:text-[13px] text-white group-hover:text-amber-300 transition-colors line-clamp-1 leading-snug tracking-tight">
                  {game.name}
                </h3>
                <p className="text-[10px] sm:text-[10.5px] font-bold text-sky-400 mt-0.5 line-clamp-1">
                  {game.genre}
                </p>
              </div>

              {/* Action Button */}
              <div className="mt-auto w-full">
                {isInactive ? (
                  <button
                    type="button"
                    disabled
                    className="w-full py-1.5 sm:py-2 px-3 rounded-xl bg-slate-800/90 text-slate-400 font-bold text-xs flex items-center justify-center gap-1 cursor-not-allowed border border-slate-700/60"
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
                    className="w-full py-1.5 sm:py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs flex items-center justify-center gap-1 shadow-md shadow-blue-600/30 transition-all duration-200 group-hover:scale-[1.02] cursor-pointer"
                  >
                    <span>{language === 'km' ? 'ចូលលេង' : 'Play'}</span>
                    <span className="text-[11px] font-mono">›</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* SECTION: ពិសេសសម្រាប់អ្នក / Special for You (Exact 3 Cards) */}
      {/* ========================================================= */}
      <div id="promotions" className="pt-6 sm:pt-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🎁</span>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
                {language === 'km' ? 'ពិសេសសម្រាប់អ្នក' : 'Special for You'}
              </h2>
              <p className="text-[10px] sm:text-xs text-slate-400 font-medium">
                Special for You
              </p>
            </div>
          </div>

          <Link
            to="/topup"
            className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors group"
          >
            <span>{language === 'km' ? 'មើលទាំងអស់' : 'View all'}</span>
            <span className="transition-transform group-hover:translate-x-1">➔</span>
          </Link>
        </div>

        {/* 3 Wide Promo Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
          
          {/* Card 1: Special Discount (Golden Chest) */}
          <div className="relative rounded-2xl p-4 bg-gradient-to-r from-[#1c1407] via-[#140e04] to-[#0d0902] border border-amber-500/40 shadow-xl flex items-center gap-3.5 group hover:border-amber-400 transition-all">
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden shrink-0 flex items-center justify-center bg-amber-500/10 border border-amber-500/30 p-1 group-hover:scale-105 transition-transform">
              <img
                src="/images/treasure-chest.png"
                alt="Discount Offer"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.src = '/mlbb-logo.png';
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-black text-sm text-white group-hover:text-amber-300 transition-colors truncate">
                {language === 'km' ? 'បញ្ចុះតម្លៃពិសេស' : 'Special Discount'}
              </h3>
              <p className="text-[10px] text-amber-200/80 font-medium mt-0.5 line-clamp-1">
                {language === 'km' ? 'ពង្រឹងការលេងហ្គេមរបស់អ្នក' : 'Supercharge your gaming'}
              </p>
              <Link
                to="/topup"
                className="inline-flex items-center gap-1 mt-2.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-[11px] shadow-md transition-transform active:scale-95"
              >
                <span>{language === 'km' ? 'ចូលលេងឥឡូវនេះ' : 'Play Now'}</span>
              </Link>
            </div>
          </div>

          {/* Card 2: Telegram Stars */}
          <div className="relative rounded-2xl p-4 bg-gradient-to-r from-[#071729] via-[#05111e] to-[#030b15] border border-sky-500/40 shadow-xl flex items-center gap-3.5 group hover:border-sky-400 transition-all">
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden shrink-0 flex items-center justify-center bg-sky-500/10 border border-sky-500/30 p-2 group-hover:scale-105 transition-transform">
              <svg className="w-10 h-10 text-sky-400 drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .37z"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-black text-sm text-white group-hover:text-sky-300 transition-colors truncate">
                Telegram Stars
              </h3>
              <p className="text-[10px] text-sky-200/80 font-medium mt-0.5 line-clamp-1">
                {language === 'km' ? 'ទូទាត់ឆាប់រហ័ស' : 'Instant Automated Delivery'}
              </p>
              <Link
                to="/topup?service=telegram_stars"
                className="inline-flex items-center gap-1 mt-2.5 px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white font-black text-[11px] shadow-md transition-transform active:scale-95"
              >
                <span>{language === 'km' ? 'ចូលមើល' : 'View Deals'}</span>
              </Link>
            </div>
          </div>

          {/* Card 3: Steam Wallet */}
          <div className="relative rounded-2xl p-4 bg-gradient-to-r from-[#0b1228] via-[#080d1e] to-[#040814] border border-indigo-500/40 shadow-xl flex items-center gap-3.5 group hover:border-indigo-400 transition-all">
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden shrink-0 flex items-center justify-center bg-indigo-500/10 border border-indigo-500/30 p-2 group-hover:scale-105 transition-transform">
              <svg className="w-10 h-10 text-slate-300 drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.979 0C5.642 0 .467 4.908.024 11.144l6.741 2.783c.567-.384 1.25-.615 1.986-.615.158 0 .313.013.465.034l3.414-4.947c-.01-.064-.02-.13-.02-.196 0-2.43 1.975-4.405 4.405-4.405s4.405 1.975 4.405 4.405-1.975 4.405-4.405 4.405c-.066 0-.131-.01-.195-.02l-4.947 3.414c.021.152.034.307.034.465 0 1.942-1.574 3.516-3.516 3.516-1.637 0-3.008-1.12-3.398-2.637L.341 14.88C1.724 20.088 6.471 24 12.021 24c6.627 0 12-5.373 12-12s-5.373-12-12.042-12zM8.751 16.59c-.93 0-1.684.754-1.684 1.684 0 .93.754 1.684 1.684 1.684.93 0 1.684-.754 1.684-1.684 0-.93-.754-1.684-1.684-1.684zm8.264-10.457c-1.332 0-2.412 1.08-2.412 2.412s1.08 2.412 2.412 2.412 2.412-1.08 2.412-2.412-1.08-2.412-2.412-2.412z"/>
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-black text-sm text-white group-hover:text-indigo-300 transition-colors truncate">
                Steam Wallet
              </h3>
              <p className="text-[10px] text-indigo-200/80 font-medium mt-0.5 line-clamp-1">
                {language === 'km' ? 'បញ្ចូលប្រាក់' : 'Steam USD & CIS Balance'}
              </p>
              <Link
                to="/topup?service=steam"
                className="inline-flex items-center gap-1 mt-2.5 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-black text-[11px] shadow-md transition-transform active:scale-95"
              >
                <span>{language === 'km' ? 'ចូលមើល' : 'View Deals'}</span>
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Floating Pill Dock & 24/7 Status Indicator (Matching screenshot) */}
      <div className="pt-8 pb-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 border-t border-slate-800/60 select-none">
        <div>
          © 2025 Tin-TopUp PRO. All rights reserved.
        </div>

        {/* Live Support Indicator */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300 font-bold">Online - 24/7</span>
        </div>
      </div>

    </section>
  );
};

export default GameSelection;
