import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getStoredGames, fetchStoredGames } from '../services/gamesConfig';

// Standard comprehensive list of all searchable games & services
export const BASE_GAMES_CATALOG = [
  {
    id: 'mlbb',
    name: 'Mobile Legends: Bang Bang',
    alias: 'MLBB, Mobile Legend, Diamonds, Weekly Diamond Pass, ពេជ្រ',
    genre: '5v5 MOBA',
    category: 'Mobile Legends',
    badge: 'NEW',
    badgeColor: 'emerald',
    image: '/mlbb-logo.png',
    route: '/topup?game=mlbb'
  },
  {
    id: 'pubgm_auto',
    name: 'PUBG Mobile (Global / UC)',
    alias: 'PUBGM, PlayerUnknown Battlegrounds, UC, ប៉ាប់ជី',
    genre: 'Battle Royale',
    category: 'PUBG Mobile',
    badge: 'HOT',
    badgeColor: 'red',
    image: 'https://res.cloudinary.com/dpz7vpmf8/image/upload/v1790944800/logo-game/ovdfdmru7jnhmwjvy6vy.jpg',
    route: '/topup?game=pubgm'
  },
  {
    id: 'freefire_kh',
    name: 'Free Fire KH (Garena)',
    alias: 'FF, Freefire, Garena, Diamond, ហ្វ្រីហ្វាយ',
    genre: 'Survival Battle',
    category: 'Free Fire',
    badge: 'HOT',
    badgeColor: 'red',
    image: '/images/freefire-square-logo.png',
    route: '/topup?game=freefire'
  },
  {
    id: 'level_up_pass',
    name: 'Level Up Pass & Weekly Pass',
    alias: 'WDP, Pass, Ticket, Starlight, Twilight',
    genre: 'Event & Reward',
    category: 'Mobile Legends',
    badge: 'NEW',
    badgeColor: 'emerald',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop&q=80',
    route: '/topup?game=mlbb&tab=pass'
  },
  {
    id: 'magic_chess',
    name: 'Magic Chess: Go Go',
    alias: 'Chess, MLBB Chess, Commander',
    genre: 'Auto Chess Strategy',
    category: 'Mobile Legends',
    badge: 'PAUSED',
    badgeColor: 'amber',
    image: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=500&auto=format&fit=crop&q=80',
    route: '/topup?game=magic_chess'
  },
  {
    id: 'telegram_stars',
    name: 'Telegram Stars (Instant)',
    alias: 'Telegram, Stars, Bot, TG Stars',
    genre: 'Digital Currency',
    category: 'Telegram Stars',
    badge: 'HOT',
    badgeColor: 'sky',
    image: '/images/telegram-stars-logo.svg',
    route: '/topup?service=telegram_stars'
  },
  {
    id: 'steam_games',
    name: 'Steam Wallet & CIS Codes',
    genre: 'PC Gaming Platform',
    category: 'Steam',
    badge: 'NEW',
    badgeColor: 'emerald',
    image: '/images/steam-logo.png',
    route: '/topup?service=steam'
  },
  {
    id: 'blood_strike',
    name: 'Blood Strike FPS',
    alias: 'Bloodstrike, NetEase, Shooter',
    genre: 'FPS Shooter',
    category: 'Service top-up',
    badge: 'CLOSED',
    badgeColor: 'rose',
    image: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=500&auto=format&fit=crop&q=80',
    route: '/topup?game=blood_strike'
  },
  {
    id: 'rov',
    name: 'ROV / Arena of Valor',
    alias: 'AOV, Arena of Valor, Garena ROV',
    genre: '5v5 MOBA',
    category: 'Service top-up',
    badge: 'HOT',
    badgeColor: 'red',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&auto=format&fit=crop&q=80',
    route: '/topup?game=rov'
  },
  {
    id: 'minecraft',
    name: 'Minecraft Java & Bedrock',
    alias: 'Mine craft, Mine coins',
    genre: 'Sandbox Adventure',
    category: 'Service top-up',
    badge: 'NEW',
    badgeColor: 'emerald',
    image: 'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?w=500&auto=format&fit=crop&q=80',
    route: '/topup?game=minecraft'
  },
  {
    id: 'roblox',
    name: 'Roblox Robux Gift Cards',
    alias: 'Robux, RBX, Roblox',
    genre: 'Adventure Metaverse',
    category: 'Service top-up',
    badge: 'HOT',
    badgeColor: 'red',
    image: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=500&auto=format&fit=crop&q=80',
    route: '/topup?game=roblox'
  },
  {
    id: 'one_piece',
    name: 'One Piece Fighting Path',
    alias: 'One Piece, Luffy, OPFP',
    genre: 'Action RPG',
    category: 'Service top-up',
    badge: 'PAUSED',
    badgeColor: 'amber',
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=80',
    route: '/topup?game=onepiece'
  },
  {
    id: 'valorant',
    name: 'Valorant Points (Riot VP)',
    alias: 'Riot, VP, Valorant Points',
    genre: 'Tactical Shooter',
    category: 'Service top-up',
    badge: 'CLOSED',
    badgeColor: 'rose',
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=500&auto=format&fit=crop&q=80',
    route: '/topup?game=valorant'
  }
];

export const SmartSearchBar = ({ isMobile = false, onFilterClick }) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [allGames, setAllGames] = useState(BASE_GAMES_CATALOG);
  const containerRef = useRef(null);

  // Sync cloud games
  useEffect(() => {
    const stored = getStoredGames();
    if (stored && Array.isArray(stored) && stored.length > 0) {
      const merged = [...BASE_GAMES_CATALOG];
      stored.forEach((sg) => {
        if (!merged.some((m) => m.id === sg.id || m.name?.toLowerCase() === sg.name?.toLowerCase())) {
          merged.push({
            id: sg.id,
            name: sg.name,
            genre: sg.category || 'Game Top-Up',
            category: sg.category || 'Service top-up',
            badge: sg.badge || 'NEW',
            image: sg.image || '/mlbb-logo.png',
            route: sg.route || `/topup?game=${sg.id}`
          });
        }
      });
      setAllGames(merged);
    }

    fetchStoredGames().then((cloud) => {
      if (cloud && Array.isArray(cloud) && cloud.length > 0) {
        const merged = [...BASE_GAMES_CATALOG];
        cloud.forEach((sg) => {
          if (!merged.some((m) => m.id === sg.id || m.name?.toLowerCase() === sg.name?.toLowerCase())) {
            merged.push({
              id: sg.id,
              name: sg.name,
              genre: sg.category || 'Game Top-Up',
              category: sg.category || 'Service top-up',
              badge: sg.badge || 'NEW',
              image: sg.image || '/mlbb-logo.png',
              route: sg.route || `/topup?game=${sg.id}`
            });
          }
        });
        setAllGames(merged);
      }
    });
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Filter matching games based on user input
  const trimmed = query.trim().toLowerCase();
  const matchedGames = trimmed
    ? allGames.filter((g) => {
        return (
          g.name?.toLowerCase().includes(trimmed) ||
          g.genre?.toLowerCase().includes(trimmed) ||
          g.category?.toLowerCase().includes(trimmed) ||
          g.alias?.toLowerCase().includes(trimmed)
        );
      })
    : [];

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setIsOpen(val.trim().length > 0);
    // Broadcast event so on-page grid filters simultaneously
    window.dispatchEvent(new CustomEvent('filterGames', { detail: val }));
  };

  const handleSelectGame = (game) => {
    setIsOpen(false);
    navigate(game.route || '/topup');
  };

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
    window.dispatchEvent(new CustomEvent('filterGames', { detail: '' }));
  };

  // Helper to highlight matching text
  const renderHighlightedText = (text, highlight) => {
    if (!highlight.trim()) return text;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={i} className="text-amber-400 font-black underline decoration-amber-400/50">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div ref={containerRef} className={`relative w-full ${isMobile ? '' : 'font-khmer'} ${isOpen && query.trim().length > 0 ? 'z-[9999]' : 'z-30'}`}>
      <div className={`relative w-full flex items-center ${isOpen && query.trim().length > 0 ? 'z-[9999]' : 'z-10'}`}>
        {/* Search Input Box */}
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            placeholder={language === 'km' ? 'ស្វែងរកហ្គេម ឬប្រភេទ...' : 'Search games or categories...'}
            className={`w-full ${
              isOpen && query.trim().length > 0
                ? 'bg-[#0f172a] border-sky-400 text-white font-bold ring-2 ring-sky-500/40 shadow-[0_0_20px_rgba(56,189,248,0.25)]'
                : 'bg-[#0b101e] border-slate-700/80 text-white font-medium'
            } border ${
              isMobile ? 'rounded-2xl pl-10 pr-9 py-2.5 text-sm' : 'rounded-full pl-10 pr-9 py-2 text-xs'
            } placeholder-slate-400 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/40 transition-all shadow-inner text-white`}
            onChange={handleInputChange}
            onFocus={() => {
              if (query.trim().length > 0) setIsOpen(true);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (matchedGames.length > 0) {
                  handleSelectGame(matchedGames[0]);
                } else {
                  const el = document.getElementById('games-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }
              if (e.key === 'Escape') {
                setIsOpen(false);
              }
            }}
          />

          {/* Left Magnifying Glass Icon */}
          <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${isOpen && query.trim().length > 0 ? 'text-sky-400' : 'text-slate-400'} text-sm pointer-events-none select-none transition-colors`}>
            🔍
          </span>

          {/* Clear Button (Shown when user has typed) */}
          {query.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white flex items-center justify-center text-xs font-bold cursor-pointer transition-colors shadow-sm"
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Sliders Button (on mobile) */}
        {isMobile && (
          <button
            type="button"
            onClick={onFilterClick || (() => {
              const el = document.getElementById('games-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            })}
            className={`ml-2 w-10 h-10 rounded-2xl ${
              isOpen && query.trim().length > 0 ? 'bg-[#0f172a] border-sky-500/60 text-sky-300' : 'bg-[#0b101e] border-slate-700/80 text-slate-300'
            } border hover:text-white flex items-center justify-center shrink-0 shadow-sm active:scale-95 transition-all cursor-pointer`}
            aria-label="Filter games"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </button>
        )}
      </div>

      {/* ========================================================= */}
      {/* SMART SEARCH RESULTS DROPDOWN OVERLAY                     */}
      {/* ========================================================= */}
      {isOpen && query.trim().length > 0 && (
        <>
          {/* Backdrop overlay to completely dim and block the background - behind input (z-[9980]) */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-xs z-[9980]"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute top-full left-0 right-0 mt-2 z-[9999] bg-[#070c17] border border-sky-500/70 rounded-2xl shadow-[0_30px_90px_rgba(0,0,0,1)] ring-1 ring-white/10 overflow-hidden animate-fadeIn font-khmer select-none">
            
            {/* Dropdown Header */}
            <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-slate-800 bg-[#040810]">
              <div className="flex items-center gap-2">
                <span className="text-xs">⚡</span>
                <span className="text-[11px] font-black text-slate-300 uppercase tracking-wide">
                  {language === 'km' ? 'លទ្ធផលស្វែងរកហ្គេម' : 'Smart Game Results'}
                </span>
              </div>
              <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-sky-950 border border-sky-500/40 text-sky-300">
                {matchedGames.length} {language === 'km' ? 'ហ្គេម' : 'Games'}
              </span>
            </div>

            {/* Results List */}
            <div className="max-h-56 sm:max-h-80 overflow-y-auto divide-y divide-slate-800/80 bg-[#070c17] scrollbar-thin scrollbar-thumb-slate-700">
              {matchedGames.length > 0 ? (
                matchedGames.map((game) => {
                  return (
                    <div
                      key={game.id}
                      onClick={() => handleSelectGame(game)}
                      className="flex items-center justify-between p-2.5 sm:p-3 bg-[#070c17] hover:bg-[#121c33] transition-all cursor-pointer group active:bg-sky-950/60"
                    >
                      {/* Game Cover Artwork */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-slate-950 border border-slate-700/80 group-hover:border-sky-400 shrink-0 shadow-md transition-colors">
                          <img
                            src={game.image}
                            alt={game.name}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/mlbb-logo.png';
                            }}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>

                        {/* Game Title & Category */}
                        <div className="flex flex-col min-w-0 text-left">
                          <h4 className="font-black text-xs sm:text-sm text-white group-hover:text-amber-300 transition-colors truncate leading-snug">
                            {renderHighlightedText(game.name, trimmed)}
                          </h4>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] text-sky-400 font-bold truncate">
                              {game.genre}
                            </span>
                            <span className="text-slate-600 text-[9px]">•</span>
                            <span className="text-[9.5px] text-slate-400 truncate">
                              {game.category}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Action Button & Badge */}
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        {game.badge && (
                          <span className={`hidden sm:inline-flex px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${
                            game.badgeColor === 'red' ? 'bg-red-500/20 text-red-300 border border-red-500/40' :
                            game.badgeColor === 'amber' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                            game.badgeColor === 'rose' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                            'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          }`}>
                            {game.badge}
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectGame(game);
                          }}
                          className="py-1 px-2.5 sm:px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-[10px] sm:text-xs flex items-center gap-1 shadow-md shadow-blue-600/30 group-hover:scale-105 active:scale-95 transition-all cursor-pointer"
                        >
                          <span>{language === 'km' ? 'បញ្ចូល' : 'Top Up'}</span>
                          <span className="text-[11px] font-mono">›</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                /* Empty State */
                <div className="p-6 text-center text-slate-400 space-y-2 bg-[#070c17]">
                  <div className="text-2xl">🔍</div>
                  <div className="text-xs font-bold text-white">
                    {language === 'km' ? `រកមិនឃើញហ្គេម "${query}" ទេ` : `No games found matching "${query}"`}
                  </div>
                  <p className="text-[10px] text-slate-400">
                    {language === 'km' ? 'សូមសាកល្បងស្វែងរក: MLBB, PUBG, Free Fire, Steam, Pass...' : 'Try searching: MLBB, PUBG, Free Fire, Steam, Pass...'}
                  </p>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="mt-2 text-xs text-sky-400 hover:text-sky-300 font-bold underline"
                  >
                    {language === 'km' ? 'សម្អាតការស្វែងរក' : 'Clear search'}
                  </button>
                </div>
              )}
            </div>

            {/* Footer note */}
            <div className="px-3 py-1.5 bg-[#040810] border-t border-slate-800 flex items-center justify-between text-[9px] text-slate-500">
              <span>⚡ Instant Smart Search</span>
              <span className="text-sky-400 flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                Live
              </span>
            </div>

          </div>
        </>
      )}
    </div>
  );
};
