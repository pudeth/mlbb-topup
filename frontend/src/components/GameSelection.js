import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getStoredGames, getMasterTopupStatus, fetchStoredGames, fetchMasterTopupStatus } from '../services/gamesConfig';
import { CambodiaFlagSvg } from './CambodiaFlagBadge';

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

              return (
                  <div
                    key={game.id}
                    onClick={isInactive ? (e) => { e.preventDefault(); e.stopPropagation(); } : () => handleGameClick(game)}
                    className={`group relative rounded-[20px] p-2 transition-all duration-300 flex flex-col justify-between items-center text-center select-none ${
                      isInactive
                        ? 'opacity-60 cursor-not-allowed grayscale-[40%]'
                        : 'hover:scale-[1.02] cursor-pointer'
                    } ${
                      !isInactive && isMLBB ? 'bg-[#181335]/60 ring-1 ring-purple-500/50 shadow-[0_0_20px_rgba(109,40,217,0.15)]' : 'bg-transparent'
                    }`}
                  >
                    {/* Game Artwork Box with Rounded Corners */}
                    <div className="relative aspect-square w-full rounded-[16px] overflow-hidden bg-slate-900/50 mb-3 border border-slate-800/40">
                      <img
                        src={game.image}
                        alt={game.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = game.localFallbackImage || '/mlbb-logo.png';
                        }}
                        className={`w-full h-full object-cover transition-transform duration-500 ${
                          isInactive ? '' : 'group-hover:scale-105'
                        }`}
                      />
  
                      {/* Top Right Server Badge or Status Indicator */}
                      {isInactive ? (
                        <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-sm ${
                              effectiveStatus === 'Closed'
                                ? 'bg-rose-500/30 text-rose-200 border border-rose-500/50'
                                : effectiveStatus === 'Maintenance'
                                ? 'bg-purple-500/30 text-purple-200 border border-purple-400/50'
                                : effectiveStatus === 'Coming Soon'
                                ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400/50'
                                : 'bg-amber-500/30 text-amber-200 border border-amber-400/50'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${effectiveStatus === 'Closed' ? 'bg-rose-400' : 'bg-amber-400'}`}></span>
                            <span>{effectiveStatus === 'Closed' ? 'CLOSED' : effectiveStatus === 'Maintenance' ? 'MAINTENANCE' : effectiveStatus === 'Coming Soon' ? 'COMING SOON' : 'PAUSED'}</span>
                          </span>
                        </div>
                      ) : (game.badge || game.flagTitle) ? (
                        <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-sm ${
                              game.badgeColor === 'gold' || isMLBB
                                ? 'bg-amber-400 text-slate-900 shadow-amber-500/30'
                                : game.badgeColor === 'emerald'
                                ? 'bg-emerald-500 text-white'
                                : game.badgeColor === 'purple'
                                ? 'bg-purple-600 text-white'
                                : 'bg-cyan-500 text-black'
                            }`}
                          >
                            {game.flagImage ? (
                              <span className="w-3 h-3 rounded-full overflow-hidden inline-block shrink-0">
                                <img src={game.flagImage} alt="Flag" className="w-full h-full object-cover" />
                              </span>
                            ) : (game.badge?.includes('áž áŸ’áž˜áŸ‚ážš') || game.flagType === 'kh') ? (
                              <span className="w-3 h-3 rounded-full overflow-hidden inline-block shrink-0">
                                <CambodiaFlagSvg className="w-full h-full object-cover" />
                              </span>
                            ) : null}
                            <span>{game.flagTitle || game.badge}</span>
                          </span>
                        </div>
                      ) : null}
                    </div>
  
                    {/* Game Name Title */}
                    <div className="w-full px-1 mb-2.5">
                      <h3 className={`font-black text-[11px] sm:text-[13px] leading-snug uppercase tracking-wider truncate transition-colors text-center ${
                        isInactive ? 'text-slate-400' : 'text-slate-200 group-hover:text-white'
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
                      className={`w-full py-1.5 sm:py-2 px-3 rounded-full font-black text-[11px] sm:text-xs transition-all flex items-center justify-center shadow-sm ${
                        isInactive
                          ? effectiveStatus === 'Closed'
                            ? 'bg-rose-950/20 text-rose-500/70 border border-rose-900/30 cursor-not-allowed pointer-events-none'
                            : effectiveStatus === 'Maintenance'
                            ? 'bg-purple-950/20 text-purple-500/70 border border-purple-900/30 cursor-not-allowed pointer-events-none'
                            : effectiveStatus === 'Coming Soon'
                            ? 'bg-slate-900/30 text-slate-500/70 border border-slate-800/50 cursor-not-allowed pointer-events-none'
                            : 'bg-amber-950/20 text-amber-500/70 border border-amber-900/30 cursor-not-allowed pointer-events-none'
                          : 'bg-[#7a3bf2] hover:bg-[#6c34d6] active:bg-[#5b2cb6] text-white shadow-purple-500/20 hover:shadow-purple-500/40 cursor-pointer'
                      }`}
                    >
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
