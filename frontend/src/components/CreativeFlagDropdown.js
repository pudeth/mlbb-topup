import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  UniversalSphericalFlag,
  POPULAR_FLAGS,
  MORE_WORLD_FLAGS,
  ALL_FLAG_OPTIONS
} from './CambodiaFlagBadge';

/**
 * CreativeFlagDropdown
 * Modern, esports-grade custom dropdown menu for selecting game server flags.
 * Features:
 * - Uses React Portal (`createPortal`) to render outside modal container borders, avoiding any overflow clipping
 * - Smart auto-positioning (detects viewport bounds and flips upward/downward automatically)
 * - 3D spherical flag orbs for each country
 * - Real-time search/filter input with instant reset
 * - Segmented category tabs (All, Popular, World)
 * - Native script subtitles (Khmer, Thai, Burmese, etc.)
 * - Active glowing selection state with checkmark badges
 * - Smooth hover micro-interactions
 * - Click-outside and Escape key dismissal
 */
export const CreativeFlagDropdown = ({
  value = 'kh',
  onChange,
  flagImage = null,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all'); // 'all' | 'popular' | 'international'
  
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const searchInputRef = useRef(null);

  const [position, setPosition] = useState({
    top: 0,
    left: 0,
    width: 380,
    maxHeight: 380,
    openUpward: false,
  });

  const selectedFlag = useMemo(() => {
    return ALL_FLAG_OPTIONS.find((f) => f.id === value) || POPULAR_FLAGS[0];
  }, [value]);

  // Recalculate fixed coordinates so the dropdown breaks completely outside any modal borders
  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Desired width: clamp between 320 and 420, not exceeding available viewport
    const targetWidth = Math.min(Math.max(rect.width, 380), viewportWidth - 24);

    // Align right edge of menu with right edge of trigger button
    let left = rect.right - targetWidth;
    if (left < 12) left = 12;
    if (left + targetWidth > viewportWidth - 12) {
      left = viewportWidth - targetWidth - 12;
    }

    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;

    // If space below is less than 300px and space above has more room, flip upward
    const shouldOpenUp = spaceBelow < 300 && spaceAbove > spaceBelow;

    let top = 0;
    let maxHeight = 360;

    if (shouldOpenUp) {
      maxHeight = Math.max(180, Math.min(400, spaceAbove - 24));
      top = rect.top - maxHeight - 8;
      if (top < 10) {
        top = 10;
        maxHeight = rect.top - 18;
      }
    } else {
      top = rect.bottom + 8;
      maxHeight = Math.max(180, Math.min(400, spaceBelow - 24));
    }

    setPosition({
      top,
      left,
      width: targetWidth,
      maxHeight,
      openUpward: shouldOpenUp,
    });
  }, []);

  // Update position on open, window resize, and scroll
  useEffect(() => {
    if (!isOpen) return;
    updatePosition();

    const handleScrollOrResize = () => {
      updatePosition();
    };

    window.addEventListener('resize', handleScrollOrResize);
    window.addEventListener('scroll', handleScrollOrResize, true);

    return () => {
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize, true);
    };
  }, [isOpen, updatePosition]);

  // Handle outside clicks and Escape key to close
  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e) => {
      const clickedTrigger = triggerRef.current && triggerRef.current.contains(e.target);
      const clickedMenu = menuRef.current && menuRef.current.contains(e.target);
      if (!clickedTrigger && !clickedMenu) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);

    // Auto-focus search input when opened
    const timer = setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 50);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Filter flags based on search text and active category tab
  const filteredFlags = useMemo(() => {
    const query = search.trim().toLowerCase();

    let list = ALL_FLAG_OPTIONS;
    if (category === 'popular') {
      list = POPULAR_FLAGS;
    } else if (category === 'international') {
      list = MORE_WORLD_FLAGS;
    }

    if (!query) return list;

    return list.filter((f) => {
      const matchName = f.name?.toLowerCase().includes(query);
      const matchId = f.id?.toLowerCase().includes(query);
      const matchLocal = f.local?.toLowerCase().includes(query);
      const matchTitle = f.t1?.toLowerCase().includes(query);
      return matchName || matchId || matchLocal || matchTitle;
    });
  }, [search, category]);

  const handleSelect = (flag) => {
    if (onChange) {
      onChange(flag);
    }
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div className={`relative select-none ${className}`}>
      {/* ── TRIGGER BUTTON (CREATIVE CYBER DESIGN) ── */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full group px-3 py-2.5 rounded-xl text-left cursor-pointer transition-all duration-200 flex items-center justify-between gap-2.5 border-2 ${
          isOpen
            ? 'bg-slate-900 border-amber-400 shadow-lg shadow-amber-500/25 ring-2 ring-amber-400/20'
            : 'bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border-amber-400/80 hover:border-amber-300 shadow-md shadow-amber-500/10 hover:shadow-amber-500/25'
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {/* Selected Flag 3D Orb */}
          <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border-2 border-amber-400 shadow-md shadow-amber-500/20 flex items-center justify-center bg-slate-950">
            {selectedFlag.id === 'none' ? (
              <span className="text-sm">🚫</span>
            ) : (
              <UniversalSphericalFlag
                flagType={selectedFlag.id}
                flagImage={selectedFlag.id === 'custom' ? flagImage : null}
                className="w-full h-full"
              />
            )}
          </div>

          {/* Flag Label & Subtitle */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-black text-xs sm:text-sm text-white group-hover:text-amber-300 transition-colors truncate">
                {selectedFlag.name}
              </span>
              {selectedFlag.local && (
                <span className="text-[11px] font-khmer text-amber-400 font-bold truncate">
                  ({selectedFlag.local})
                </span>
              )}
            </div>
            <div className="text-[10px] text-slate-400 font-mono truncate flex items-center gap-1 mt-0.5">
              <span className="text-amber-400/90 font-semibold">{selectedFlag.t1 || 'Server'}</span>
              {selectedFlag.t2 && <span>• {selectedFlag.t2}</span>}
              {selectedFlag.t3 && <span>• {selectedFlag.t3}</span>}
            </div>
          </div>
        </div>

        {/* Right Server Tag & Animated Chevron */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="px-1.5 py-0.5 rounded bg-amber-400/20 border border-amber-400/40 text-amber-300 font-mono text-[9.5px] font-bold uppercase">
            {selectedFlag.id.toUpperCase()}
          </span>
          <div
            className={`w-6 h-6 rounded-lg bg-slate-800/90 border border-slate-700/80 flex items-center justify-center text-slate-400 transition-all duration-200 ${
              isOpen ? (position.openUpward ? '-rotate-180' : 'rotate-180') + ' text-amber-300 border-amber-400/60 bg-slate-800' : 'group-hover:text-white'
            }`}
          >
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>
      </button>

      {/* ── CREATIVE DROPDOWN POPOVER MENU (PORTAL TO DOCUMENT.BODY) ── */}
      {/* Rendered outside modal container so it can never be clipped by modal borders */}
      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: 'fixed',
              top: `${position.top}px`,
              left: `${position.left}px`,
              width: `${position.width}px`,
              maxHeight: `${position.maxHeight}px`,
              zIndex: 999999,
            }}
            className="bg-slate-950/98 backdrop-blur-2xl border-2 border-amber-400/90 rounded-2xl shadow-2xl shadow-black/95 p-3 flex flex-col space-y-2.5 animate-in fade-in zoom-in-95 duration-150"
          >
            {/* Quick Search Box */}
            <div className="relative shrink-0">
              <svg
                className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search server (Cambodia, PH, Thai, Japan...)"
                className="w-full bg-slate-900/90 hover:bg-slate-900 text-xs text-white placeholder-slate-500 pl-8 pr-8 py-2 rounded-xl border border-slate-700/80 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all font-medium"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Segmented Filter Pills */}
            <div className="flex items-center gap-1.5 pb-1 border-b border-slate-800/80 shrink-0">
              <button
                type="button"
                onClick={() => setCategory('all')}
                className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold transition-all cursor-pointer ${
                  category === 'all'
                    ? 'bg-amber-400 text-slate-950 shadow-sm shadow-amber-500/30'
                    : 'text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                All ({ALL_FLAG_OPTIONS.length})
              </button>
              <button
                type="button"
                onClick={() => setCategory('popular')}
                className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  category === 'popular'
                    ? 'bg-amber-400 text-slate-950 shadow-sm shadow-amber-500/30'
                    : 'text-slate-400 hover:text-amber-300 bg-slate-900/80 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <span>⚡</span> Popular ({POPULAR_FLAGS.length})
              </button>
              <button
                type="button"
                onClick={() => setCategory('international')}
                className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  category === 'international'
                    ? 'bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-500/30'
                    : 'text-slate-400 hover:text-cyan-300 bg-slate-900/80 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <span>🌐</span> World ({MORE_WORLD_FLAGS.length})
              </button>
            </div>

            {/* Scrollable Server Flags List */}
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar min-h-0">
              {filteredFlags.length === 0 ? (
                <div className="py-6 text-center text-slate-400 text-xs">
                  <span>🔍 No server flag matching "{search}"</span>
                </div>
              ) : (
                filteredFlags.map((flag) => {
                  const isSelected = flag.id === selectedFlag.id;
                  return (
                    <div
                      key={flag.id}
                      onClick={() => handleSelect(flag)}
                      className={`group w-full p-2 rounded-xl text-left cursor-pointer transition-all flex items-center justify-between gap-2.5 border ${
                        isSelected
                          ? 'bg-gradient-to-r from-amber-500/25 via-amber-400/10 to-slate-900 border-amber-400/90 shadow-sm'
                          : 'bg-slate-900/70 hover:bg-slate-800/90 border-slate-800/80 hover:border-amber-400/50'
                      }`}
                    >
                      {/* Flag Orb & Names */}
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <div
                          className={`w-7 h-7 rounded-full overflow-hidden shrink-0 border flex items-center justify-center bg-slate-950 transition-transform group-hover:scale-105 ${
                            isSelected ? 'border-amber-400 ring-1 ring-amber-400/40' : 'border-slate-700'
                          }`}
                        >
                          {flag.id === 'none' ? (
                            <span className="text-xs">🚫</span>
                          ) : (
                            <UniversalSphericalFlag
                              flagType={flag.id}
                              flagImage={flag.id === 'custom' ? flagImage : null}
                              className="w-full h-full"
                            />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span
                              className={`font-black text-xs transition-colors truncate ${
                                isSelected ? 'text-amber-300' : 'text-slate-100 group-hover:text-amber-200'
                              }`}
                            >
                              {flag.name}
                            </span>
                            {flag.local && (
                              <span className="text-[10px] font-khmer text-amber-400/90 truncate">
                                ({flag.local})
                              </span>
                            )}
                          </div>
                          <div className="text-[9.5px] text-slate-400 font-mono truncate">
                            <span className="text-slate-300">{flag.t1 || 'Preset'}</span>
                            {flag.t2 && <span> • {flag.t2}</span>}
                            {flag.t3 && <span> • {flag.t3}</span>}
                          </div>
                        </div>
                      </div>

                      {/* Tag / Selection Badge */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {isSelected ? (
                          <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[9px] uppercase tracking-wider flex items-center gap-1 shadow-sm">
                            <span>✓</span>
                            <span>Active</span>
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono text-[9px] font-semibold uppercase group-hover:text-amber-300 group-hover:bg-slate-750 transition-colors">
                            {flag.id.toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Tip */}
            <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[9.5px] text-slate-400 px-1 shrink-0">
              <span>💡 Click any server to auto-apply presets</span>
              <span className="font-mono text-amber-400/80 font-bold">{ALL_FLAG_OPTIONS.length} Presets Available</span>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default CreativeFlagDropdown;
