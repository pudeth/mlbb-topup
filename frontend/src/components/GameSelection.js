import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getStoredGames, getMasterTopupStatus } from '../services/gamesConfig';
import { CambodiaFlagSvg } from './CambodiaFlagBadge';

const GameSelection = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [masterStatus, setMasterStatus] = useState(getMasterTopupStatus);
  const [pausedModalGame, setPausedModalGame] = useState(null);
  const [activeCategory, setActiveCategory] = useState('Service top-up');
  const [searchQuery, setSearchQuery] = useState('');
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  // Load games from persistent configuration
  useEffect(() => {
    const loaded = getStoredGames();
    setGames(loaded);
    setMasterStatus(getMasterTopupStatus());

    // Listen for custom events if admin updates games live
    const handleStorageChange = () => {
      setGames(getStoredGames());
      setMasterStatus(getMasterTopupStatus());
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('gamesConfigUpdated', handleStorageChange);
    window.addEventListener('masterTopupStatusUpdated', handleStorageChange);

    return () => {
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
    const isMasterPaused = masterStatus.status && masterStatus.status !== 'Active';
    const isGamePaused = game.status && game.status !== 'Active';

    if (isMasterPaused || isGamePaused) {
      const reason = isMasterPaused 
        ? (masterStatus.notice || 'Store Top-Up is temporarily paused for system maintenance by Admin.')
        : (game.status === 'Closed' ? `Top-Up for "${game.name}" is currently closed by Admin.` : `Top-Up for "${game.name}" is temporarily paused by Admin for maintenance.`);
      setPausedModalGame({ ...game, pauseReason: reason, pausedStatus: isMasterPaused ? masterStatus.status : (game.status || 'Paused') });
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
                  onClick={() => handleGameClick(game)}
                  className={`group relative rounded-2xl p-2 sm:p-2.5 bg-[#0B0F19] border transition-all duration-300 flex flex-col justify-between items-center text-center space-y-2 cursor-pointer shadow-lg select-none ${
                    isInactive
                      ? 'border-slate-800/60 opacity-80 hover:opacity-100 hover:border-amber-500/50'
                      : 'border-slate-800/90 hover:border-purple-500/80 hover:scale-[1.03] hover:shadow-[0_10px_25px_rgba(109,40,217,0.3)]'
                  }`}
                >
                  {/* Game Artwork Box with Rounded Corners */}
                  <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800/90 shadow-inner">
                    <img
                      src={game.image}
                      alt={game.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = game.localFallbackImage || '/mlbb-logo.png';
                      }}
                      className={`w-full h-full object-cover transition-transform duration-500 ${
                        isInactive ? 'grayscale-[30%]' : 'group-hover:scale-105'
                      }`}
                    />

                    {/* Top Right Server Badge or Status Indicator */}
                    {isInactive ? (
                      <div className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5">
                        <span
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[8px] sm:text-[9px] font-black uppercase tracking-wider shadow-md backdrop-blur-md ${
                            effectiveStatus === 'Closed'
                              ? 'bg-rose-500 text-white border border-rose-400'
                              : effectiveStatus === 'Maintenance'
                              ? 'bg-purple-600 text-white border border-purple-400'
                              : effectiveStatus === 'Coming Soon'
                              ? 'bg-cyan-500 text-black border border-cyan-400'
                              : 'bg-amber-500 text-black border border-amber-400'
                          }`}
                        >
                          <span>{effectiveStatus === 'Closed' ? '🔴 CLOSED' : effectiveStatus === 'Maintenance' ? '🛠️ MAINT' : effectiveStatus === 'Coming Soon' ? '⏳ SOON' : '⏸️ PAUSED'}</span>
                        </span>
                      </div>
                    ) : (game.badge || game.flagTitle) ? (
                      <div className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5">
                        <span
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[8px] sm:text-[9px] font-black uppercase tracking-wider shadow-md backdrop-blur-md ${
                            game.badgeColor === 'gold' || isMLBB
                              ? 'bg-amber-500 text-black border border-amber-400'
                              : game.badgeColor === 'emerald'
                              ? 'bg-emerald-500 text-white border border-emerald-400'
                              : game.badgeColor === 'purple'
                              ? 'bg-purple-600 text-white border border-purple-400'
                              : 'bg-cyan-500 text-black border border-cyan-400'
                          }`}
                        >
                          {game.flagImage ? (
                            <span className="w-2.5 h-2.5 rounded-full overflow-hidden inline-block ring-1 ring-white/50 shrink-0">
                              <img src={game.flagImage} alt="Flag" className="w-full h-full object-cover" />
                            </span>
                          ) : (game.badge?.includes('ខ្មែរ') || game.flagType === 'kh') ? (
                            <span className="w-2.5 h-2.5 rounded-full overflow-hidden inline-block ring-1 ring-white/50 shrink-0">
                              <CambodiaFlagSvg className="w-full h-full object-cover" />
                            </span>
                          ) : null}
                          <span>{game.flagTitle || game.badge}</span>
                        </span>
                      </div>
                    ) : null}
                  </div>

                  {/* Game Name Title */}
                  <div className="w-full px-0.5">
                    <h3 className="font-extrabold text-purple-300 group-hover:text-purple-100 text-[10px] sm:text-xs leading-snug uppercase tracking-wide truncate transition-colors text-center">
                      {game.name}
                    </h3>
                  </div>

                  {/* Action Pill Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGameClick(game);
                    }}
                    className={`w-full py-1 sm:py-1.5 px-2 rounded-xl font-black text-[10px] sm:text-xs shadow-md transition-all flex items-center justify-center cursor-pointer ${
                      isInactive
                        ? effectiveStatus === 'Closed'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                          : effectiveStatus === 'Maintenance'
                          ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 hover:bg-purple-600/30'
                          : effectiveStatus === 'Coming Soon'
                          ? 'bg-slate-800 text-slate-400 border border-slate-700'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                        : 'bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 active:scale-95 text-white shadow-purple-950/60'
                    }`}
                  >
                    {isInactive
                      ? effectiveStatus === 'Closed'
                        ? '🔴 Closed'
                        : effectiveStatus === 'Maintenance'
                        ? '🛠️ Maintenance'
                        : effectiveStatus === 'Coming Soon'
                        ? '⏳ Soon'
                        : '⏸️ Paused'
                      : t('btn_topup_card')}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Paused / Closed Game Modal Dialog */}
      {pausedModalGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0D121F] border border-amber-500/40 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-center relative animate-scaleUp">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-3xl">
              {pausedModalGame.pausedStatus === 'Closed' ? '🔴' : pausedModalGame.pausedStatus === 'Maintenance' ? '🛠️' : '⏸️'}
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base sm:text-lg font-black text-white">
                {pausedModalGame.name}
              </h3>
              <p className="text-xs text-amber-300 font-bold uppercase tracking-wider">
                {pausedModalGame.pausedStatus === 'Closed' ? 'Top-Up Temporarily Closed' : 'Top-Up Temporarily Paused'}
              </p>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                {pausedModalGame.pauseReason}
              </p>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setPausedModalGame(null)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs hover:opacity-90 transition-all cursor-pointer"
              >
                Understood / Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default GameSelection;
