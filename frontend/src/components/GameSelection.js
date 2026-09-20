import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getStoredGames, getMasterTopupStatus, fetchStoredGames, fetchMasterTopupStatus } from '../services/gamesConfig';
import { CambodiaFlagFrame } from './CambodiaFlagBadge';

const GameSelection = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [masterStatus, setMasterStatus] = useState(getMasterTopupStatus);
  const [activeCategory, setActiveCategory] = useState('Service top-up');
  const [searchQuery, setSearchQuery] = useState('');
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  // Load games from persistent configuration and live sync with MongoDB Atlas
  useEffect(() => {
    const loaded = getStoredGames();
    setGames(loaded);
    setMasterStatus(getMasterTopupStatus());

    const syncCloudData = async () => {
      try {
        const [cloudGames, cloudStatus] = await Promise.all([
          fetchStoredGames(),
          fetchMasterTopupStatus()
        ]);
        if (cloudGames && Array.isArray(cloudGames)) {
          setGames(cloudGames);
        }
        if (cloudStatus) {
          setMasterStatus(cloudStatus);
        }
      } catch (err) {}
    };

    // Immediate initial sync
    syncCloudData();

    // 2.5s Real-Time Background polling across all mobile devices
    const interval = setInterval(syncCloudData, 2500);

    // Sync immediately when mobile user switches back to browser tab
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        syncCloudData();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', syncCloudData);

    // Listen for custom events if admin updates games live
    const handleStorageChange = () => {
      setGames(getStoredGames());
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
    { id: 'Service top-up', label: t('tab_service_topup'), icon: '⚡' },
    { id: 'Telegram stars', label: t('tab_telegram_stars'), icon: '✈️' },
    { id: 'Steam Top-Up (CIS)', label: 'Steam (CIS)', icon: '💨' },
    { id: 'Steam Gift Games', label: 'Steam Games', icon: '🎁' },
    { id: 'Gift cards', label: 'Gift cards', icon: '💳' },
    { id: 'ALL', label: t('tab_all_pkgs'), icon: '✨' },
  ];

  const filteredGames = games.filter((game) => {
    if (favoritesOnly && !game.isPopular) return false;

    const matchesCategory =
      activeCategory === 'ALL' ||
      game.category?.toLowerCase() === activeCategory.toLowerCase() ||
      game.providerCategory?.toLowerCase() === activeCategory.toLowerCase();

    const matchesSearch =
      !searchQuery.trim() ||
      game.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.publisher?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.currency?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleGameClick = (game) => {
    const isMasterPaused = masterStatus?.status && masterStatus.status !== 'Active';
    const isGamePaused = game.status && game.status !== 'Active';

    // Completely locked - user cannot press when it's closed or paused
    if (isMasterPaused || isGamePaused) {
      return;
    }

    if (game.id.startsWith('mlbb') || game.id === 'mlbb') {
      navigate('/topup');
    } else {
      navigate(game.route || '/topup');
    }
  };

  return (
    <section id="games-section" className="py-10 sm:py-14 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      {/* Section Header with dynamic translation */}
      <div className="mb-6 space-y-1">
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          {t('catalog_title')}
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm font-medium">
          {t('catalog_sub')}
        </p>
      </div>

      {/* Main Catalog Workspace with Category Bar & Search */}
      <div className="bg-[#0B0F19]/90 border border-slate-800/90 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-6">
        {/* Master Emergency Pause Notice Banner */}
        {masterStatus?.status && masterStatus.status !== 'Active' && (
          <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-amber-300 animate-pulse">
            <span className="text-xl sm:text-2xl shrink-0">
              {masterStatus.status === 'Closed' ? '🔴' : '⏸️'}
            </span>
            <div className="text-xs sm:text-sm">
              <span className="font-black uppercase tracking-wider mr-1.5">
                {masterStatus.status === 'Closed' ? 'Store Top-Ups Closed:' : 'Store Top-Ups Paused:'}
              </span>
              <span className="text-slate-200 font-medium">{masterStatus.notice}</span>
            </div>
          </div>
        )}

        {/* Search Bar & Favorites Toggle */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full relative flex-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1.5">
              {t('catalog_search_label')}
            </span>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('catalog_search_placeholder')}
                className="w-full bg-[#111728] border border-slate-700/80 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all shadow-inner"
              />
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                🔍
              </span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="shrink-0 w-full sm:w-auto pt-0 sm:pt-5">
            <button
              onClick={() => setFavoritesOnly(!favoritesOnly)}
              className={`w-full sm:w-auto px-4 py-3 rounded-2xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                favoritesOnly
                  ? 'bg-amber-500 text-black border-amber-400 font-black shadow-glow-gold'
                  : 'bg-[#111728] hover:bg-[#182035] text-slate-300 border-slate-700/80'
              }`}
            >
              <span>⭐</span>
              <span>{t('tab_favorites')}</span>
            </button>
          </div>
        </div>

        {/* Category Filter Chips / Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800/80">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setFavoritesOnly(false);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                activeCategory === cat.id && !favoritesOnly
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 border-amber-400 font-black shadow-glow-gold scale-[1.02]'
                  : 'bg-[#111728]/80 hover:bg-[#182035] text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Catalog Grid (FazerCards Visual Card Style) */}
        {filteredGames.length === 0 ? (
          <div className="text-center py-16 bg-[#111728]/40 rounded-3xl border border-slate-800 p-6 space-y-2">
            <div className="text-4xl">🎮</div>
            <h3 className="text-base font-bold text-white">No Products Found</h3>
            <p className="text-xs text-slate-400">Try searching for a different game or select another category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-4">
            {filteredGames.map((game) => {
              const isMLBB = game.id.startsWith('mlbb');
              const isMasterPaused = masterStatus?.status && masterStatus.status !== 'Active';
              const isGamePaused = game.status && game.status !== 'Active';
              const isInactive = isMasterPaused || isGamePaused;
              const effectiveStatus = isMasterPaused ? masterStatus.status : (game.status || 'Active');
              const hasServerBadge = !isInactive && (
                isMLBB ||
                game.flagTitle ||
                (game.flagType && game.flagType !== 'none') ||
                game.badge?.includes('ខ្មែរ') ||
                game.badge?.includes('SERVER') ||
                game.badge?.includes('SEVER')
              );
              const hasSimpleBadge = !isInactive && !hasServerBadge && game.badge;

              return (
                <div
                  key={game.id}
                  onClick={isInactive ? (e) => { e.preventDefault(); e.stopPropagation(); } : () => handleGameClick(game)}
                  className={`group relative rounded-[22px] p-2 sm:p-2.5 transition-all duration-300 flex flex-col justify-between items-center text-center select-none overflow-hidden ${
                    isInactive
                      ? 'bg-gradient-to-b from-[#111624]/60 via-[#0a0d16]/70 to-[#06080e]/80 border border-slate-800/50 opacity-65 cursor-not-allowed grayscale-[30%]'
                      : isMLBB
                      ? 'bg-gradient-to-b from-[#1b1539]/95 via-[#13112a]/95 to-[#0b091a]/98 border border-purple-500/50 shadow-[0_8px_24px_rgba(109,40,217,0.25),inset_0_1px_0_rgba(255,255,255,0.12)] hover:border-purple-400 hover:shadow-[0_14px_35px_rgba(147,51,234,0.35),inset_0_1px_0_rgba(255,255,255,0.2)] hover:-translate-y-1 cursor-pointer'
                      : 'bg-gradient-to-b from-[#151c2e]/85 via-[#0e1424]/90 to-[#090d18]/95 border border-slate-800/80 hover:border-purple-500/50 shadow-[0_8px_20px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.12)] hover:-translate-y-1 cursor-pointer'
                  }`}
                >
                  {/* Top Specular Rim Reflection */}
                  <div className="absolute top-0 inset-x-3 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

                  {/* Game Artwork Frame with 3D Beveled Lighting & Glass Sheen */}
                  <div className="relative aspect-square w-full rounded-[18px] p-[1.5px] mb-2.5 bg-gradient-to-b from-slate-700/60 via-slate-800/40 to-slate-900/90 shadow-[0_6px_20px_rgba(0,0,0,0.6)] group-hover:shadow-[0_10px_26px_rgba(124,58,237,0.3)] transition-all duration-300">
                    <div className="relative w-full h-full rounded-[16.5px] overflow-hidden bg-slate-950">
                      <img
                        src={game.image}
                        alt={game.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = game.localFallbackImage || '/mlbb-logo.png';
                        }}
                        className={`w-full h-full object-cover transition-transform duration-500 ease-out ${
                          isInactive ? '' : 'group-hover:scale-110'
                        }`}
                      />

                      {/* 3D Glass Diagonal Sheen Highlight */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.07] to-white/[0.18] pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Bottom Vignette for depth */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/25 pointer-events-none" />

                      {/* Inner Crisp Rim Border */}
                      <div className="absolute inset-0 rounded-[16.5px] border border-white/10 group-hover:border-purple-400/30 transition-colors pointer-events-none" />

                      {/* Top Right Status Badge for Inactive */}
                      {isInactive ? (
                        <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 z-20">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-wider backdrop-blur-md shadow-lg border ${
                              effectiveStatus === 'Closed'
                                ? 'bg-rose-950/85 text-rose-300 border-rose-500/60 shadow-rose-950/50'
                                : effectiveStatus === 'Maintenance'
                                ? 'bg-purple-950/85 text-purple-300 border-purple-500/60 shadow-purple-950/50'
                                : effectiveStatus === 'Coming Soon'
                                ? 'bg-cyan-950/85 text-cyan-300 border-cyan-500/60 shadow-cyan-950/50'
                                : 'bg-amber-950/85 text-amber-300 border-amber-500/60 shadow-amber-950/50'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${effectiveStatus === 'Closed' ? 'bg-rose-400' : effectiveStatus === 'Maintenance' ? 'bg-purple-400' : effectiveStatus === 'Coming Soon' ? 'bg-cyan-400' : 'bg-amber-400'}`}></span>
                            <span>{effectiveStatus === 'Closed' ? 'CLOSED' : effectiveStatus === 'Maintenance' ? 'MAINT' : effectiveStatus === 'Coming Soon' ? 'SOON' : 'PAUSED'}</span>
                          </span>
                        </div>
                      ) : null}

                      {/* 3D Server Badge Frame (when active) */}
                      {!isInactive && hasServerBadge ? (
                        <div className="absolute top-1 left-1 sm:top-1.5 sm:left-1.5 z-20 pointer-events-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.85)] scale-[0.58] sm:scale-[0.68] md:scale-[0.76] origin-top-left">
                          <CambodiaFlagFrame
                            title={game.flagTitle || (isMLBB ? "សេវើខ្មែរ 5v5" : game.badge)}
                            subtitle={game.flagSubtitle || (isMLBB ? "5V5" : "")}
                            sub={game.flagServerText || (game.badge?.includes('PH') ? 'OFFICIAL' : game.badge?.includes('ID') ? 'FAST' : 'SERVER')}
                            flagType={game.flagType || (game.badge?.includes('PH') ? 'ph' : game.badge?.includes('ID') ? 'id' : isMLBB ? 'kh' : 'kh')}
                            flagImage={game.flagImage || null}
                            badgeStyle={game.flagFrameStyle || "gold_cyber"}
                          />
                        </div>
                      ) : null}

                      {/* Simple Text Badge (if not a server frame) */}
                      {hasSimpleBadge ? (
                        <div className="absolute top-1.5 right-1.5 z-20">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-wider backdrop-blur-md shadow-md ${
                            game.badgeColor === 'emerald'
                              ? 'bg-emerald-500/90 text-white border border-emerald-400/50'
                              : game.badgeColor === 'cyan'
                              ? 'bg-cyan-500/90 text-black border border-cyan-300/50'
                              : 'bg-purple-600/90 text-white border border-purple-400/50'
                          }`}>
                            {game.badge}
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {/* Game Name Title */}
                  <div className="w-full px-1 mb-2">
                    <h3 className={`font-extrabold text-[11px] sm:text-[13px] leading-tight uppercase tracking-wide truncate transition-colors text-center drop-shadow-sm ${
                      isInactive ? 'text-slate-400' : 'text-slate-100 group-hover:text-white'
                    }`}>
                      {game.name}
                    </h3>
                  </div>

                  {/* Action Pill Button */}
                  <button
                    type="button"
                    disabled={isInactive}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isInactive) {
                        handleGameClick(game);
                      }
                    }}
                    className={`w-full py-1.5 sm:py-2 px-2.5 rounded-[12px] font-black text-[11px] sm:text-xs tracking-wider transition-all duration-200 flex items-center justify-center gap-1 shadow-sm select-none ${
                      isInactive
                        ? effectiveStatus === 'Closed'
                          ? 'bg-rose-950/20 text-rose-500/70 border border-rose-900/30 cursor-not-allowed pointer-events-none'
                          : effectiveStatus === 'Maintenance'
                          ? 'bg-purple-950/20 text-purple-500/70 border border-purple-900/30 cursor-not-allowed pointer-events-none'
                          : effectiveStatus === 'Coming Soon'
                          ? 'bg-slate-900/30 text-slate-500/70 border border-slate-800/50 cursor-not-allowed pointer-events-none'
                          : 'bg-amber-950/20 text-amber-500/70 border border-amber-900/30 cursor-not-allowed pointer-events-none'
                        : 'bg-gradient-to-r from-[#7a3bf2] via-[#8b46ff] to-[#6c34d6] hover:from-[#8b46ff] hover:to-[#5b2cb6] text-white shadow-[0_4px_14px_rgba(124,58,237,0.4),inset_0_1px_0_rgba(255,255,255,0.3)] border-t border-white/20 active:scale-[0.97] cursor-pointer'
                    }`}
                  >
                    <span>
                      {isInactive
                        ? effectiveStatus === 'Closed'
                          ? 'Closed'
                          : effectiveStatus === 'Maintenance'
                          ? 'Maintenance'
                          : effectiveStatus === 'Coming Soon'
                          ? 'Coming Soon'
                          : 'Paused'
                        : 'បញ្ចូល'
                      }
                    </span>
                    {!isInactive && (
                      <svg className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5 shrink-0 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default GameSelection;
