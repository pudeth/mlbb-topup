import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { BrandLogo } from './BrandLogo';
import { SmartSearchBar } from './SmartSearchBar';
const Navbar = () => {
  const { user, playerAccount, logout, isAuthenticated, isAdmin } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isUserLoggedIn = isAuthenticated();

  const isActive = (path) => location.pathname === path;

  const languages = [
    { code: 'km', name: 'ភាសាខ្មែរ', sub: 'Khmer • កម្ពុជា', flagCode: 'kh', flag: '🇰🇭', short: 'ខ្មែរ' },
    { code: 'en', name: 'English', sub: 'English • Global', flagCode: 'gb', flag: '🇬🇧', short: 'EN' },
    { code: 'zh', name: '中文', sub: 'Chinese • 简体', flagCode: 'cn', flag: '🇨🇳', short: '中文' },
  ];

  const currentLang = languages.find(l => l.code === language) || languages[1];

  const trustNotices = [
    { icon: '⚡', title: t('ticker_1_title'), desc: t('ticker_1_desc') },
    { icon: '🛡️', title: t('ticker_2_title'), desc: t('ticker_2_desc') },
    { icon: '🏦', title: t('ticker_3_title'), desc: t('ticker_3_desc') },
    { icon: '🎧', title: t('ticker_4_title'), desc: t('ticker_4_desc') },
  ];

  const isAuthPage = location.pathname.startsWith('/login') || location.pathname.startsWith('/register');

  return (
    <header className={`sticky top-0 z-[9995] ${isAuthPage ? '' : 'bg-dark-bg/85 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl'}`}>
      {/* Top micro moving marquee announcement bar (Text Transition) */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 border-b border-cyan-500/20 py-1.5 overflow-hidden relative select-none">
        <div className="flex items-center gap-2">
          {/* Live pulsing dot */}
          <div className="pl-3 sm:pl-4 pr-1 flex items-center gap-1.5 shrink-0 z-10 bg-gradient-to-r from-cyan-950 via-cyan-950/90 to-transparent">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>

          {/* Marquee Track */}
          <div className="overflow-hidden flex-1 relative">
            <div className="animate-marquee flex items-center gap-8 whitespace-nowrap text-xs font-semibold text-cyan-200">
              {[...trustNotices, ...trustNotices, ...trustNotices].map((item, idx) => (
                <div key={idx} className="inline-flex items-center gap-2">
                  <span className="text-amber-400 text-sm">{item.icon}</span>
                  <span className="font-bold text-white">{item.title}</span>
                  <span className="text-slate-400 text-[11px] font-normal">• {item.desc}</span>
                  <span className="text-slate-600 pl-4">|</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {!isAuthPage && (
        <>
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-20">
            <div className="flex items-center justify-between h-16 lg:h-20">
          
              {/* Logo (Visible on mobile & tablet, hidden on desktop since it is in DesktopSidebar) */}
              <div className="flex items-center lg:hidden select-none">
                <Link to="/" className="group flex items-center">
                  <BrandLogo size="sm" />
                </Link>
              </div>

              {/* Desktop Central Smart Search Bar */}
              <div className="hidden lg:flex items-center flex-1 max-w-xl mx-4">
                <SmartSearchBar isMobile={false} />
              </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 select-none">
            {/* Notification Bell with Red Badge 1 */}
            <button
              type="button"
              title="Notifications"
              className="relative h-10 w-10 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-black text-[9px] flex items-center justify-center shadow-md">
                1
              </span>
            </button>

            {/* Language Selector Dropdown */}
            <div className="relative z-[100]">
              <button
                type="button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className={`h-10 px-3 sm:px-3.5 rounded-xl border transition-all duration-200 text-xs font-bold flex items-center gap-2 shadow-sm active:scale-95 whitespace-nowrap cursor-pointer ${
                  langDropdownOpen
                    ? 'bg-slate-800 border-cyan-500/60 text-white ring-2 ring-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                    : 'bg-slate-900/95 hover:bg-slate-800/95 border-slate-700/80 hover:border-slate-600 text-slate-200'
                }`}
                aria-expanded={langDropdownOpen}
                aria-label="Select Language"
              >
                <span className="w-5 h-3.5 rounded-[3px] overflow-hidden shadow-xs border border-white/25 shrink-0 inline-flex items-center justify-center">
                  <span className={`fi fi-${currentLang.flagCode || 'kh'} w-full h-full object-cover leading-none`} />
                </span>
                <span className="hidden sm:inline font-bold tracking-wide">{currentLang.short}</span>
                <svg
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-300 ${langDropdownOpen ? 'rotate-180 text-cyan-400' : ''}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {langDropdownOpen && (
                <>
                  {/* Invisible Dismiss Overlay */}
                  <div
                    className="fixed inset-0 z-[90]"
                    onClick={() => setLangDropdownOpen(false)}
                  />

                  {/* High-End Gaming / Fintech Dropdown Card (Completely Opaque to eliminate bleed-through) */}
                  <div className="absolute right-0 mt-2.5 w-64 bg-[#0b101c] border border-slate-700/90 rounded-2xl p-2 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_30px_rgba(6,182,212,0.12)] ring-1 ring-white/10 z-[100] animate-fadeIn font-khmer select-none">
                    
                    {/* Dropdown Header */}
                    <div className="flex items-center justify-between px-2.5 py-2 border-b border-slate-800/90 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs">🌐</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                          Language / ភាសា
                        </span>
                      </div>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">
                        {languages.length} Available
                      </span>
                    </div>

                    {/* Language Options */}
                    <div className="space-y-1">
                      {languages.map((l) => {
                        const isSelected = language === l.code;
                        return (
                          <button
                            key={l.code}
                            type="button"
                            onClick={() => {
                              setLanguage(l.code);
                              setLangDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2.5 rounded-xl transition-all duration-150 flex items-center justify-between cursor-pointer group ${
                              isSelected
                                ? 'bg-gradient-to-r from-cyan-950/80 via-slate-900 to-slate-900 border border-cyan-500/50 shadow-sm text-white'
                                : 'hover:bg-slate-800/80 border border-transparent hover:border-slate-700/60 text-slate-300 hover:text-white'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`w-6 h-4.5 rounded-[4px] overflow-hidden shadow-sm border shrink-0 flex items-center justify-center transition-transform group-hover:scale-105 ${
                                isSelected ? 'border-cyan-400/80 ring-1 ring-cyan-400/40' : 'border-white/20'
                              }`}>
                                <span className={`fi fi-${l.flagCode || 'kh'} w-full h-full object-cover text-sm leading-none`} />
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className={`text-xs font-bold leading-tight truncate ${isSelected ? 'text-cyan-200' : 'text-slate-200 group-hover:text-white'}`}>
                                  {l.name}
                                </span>
                                <span className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5 truncate">
                                  {l.sub}
                                </span>
                              </div>
                            </div>

                            {isSelected && (
                              <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-300 flex items-center justify-center text-[11px] font-black shrink-0 shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                                ✓
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-1.5 pt-1.5 border-t border-slate-800/80 px-2 py-0.5 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                      <span>⚡ Instant Switch</span>
                      <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        Active
                      </span>
                    </div>

                  </div>
                </>
              )}
            </div>

            {/* User Login or Profile / Sign Out Control (Visible on Mobile & Desktop) */}
            {!isUserLoggedIn ? (
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('open-player-login'))}
                className="h-10 px-3 sm:px-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold flex items-center gap-1.5 shadow-[0_2px_10px_rgba(14,165,233,0.3)] transition-all active:scale-95 cursor-pointer whitespace-nowrap"
                title="Login with Player ID & Server ID"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="font-bold">{language === 'km' ? 'ចូលគណនី' : 'Login'}</span>
              </button>
            ) : (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="h-10 px-2.5 sm:px-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-sky-500/40 text-white text-xs font-bold flex items-center gap-1.5 sm:gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
                  title="Player Account Menu"
                >
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white text-xs font-black shrink-0">
                    {((playerAccount?.realName || user?.name || playerAccount?.playerId || 'P')).charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline max-w-[85px] truncate text-[11px] font-bold">
                    {playerAccount?.realName || user?.name || playerAccount?.playerId}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#090f20]/95 backdrop-blur-2xl border border-sky-500/40 shadow-2xl p-2 z-50 animate-scaleUp font-khmer">
                      {/* Top Header Card - Click to edit profile */}
                      <div 
                        onClick={() => {
                          setUserMenuOpen(false);
                          window.dispatchEvent(new CustomEvent('open-player-profile'));
                        }}
                        className="px-3 py-2.5 border-b border-slate-800/80 mb-1 hover:bg-slate-800/50 rounded-xl transition-all cursor-pointer group"
                        title="Click to view & edit profile"
                      >
                        <div className="flex items-center justify-between">
                          <div className="text-xs font-black text-white truncate group-hover:text-cyan-300 transition-colors">
                            {playerAccount?.realName || user?.name || 'Player'}
                          </div>
                          <span className="text-[10px] text-sky-400 group-hover:translate-x-0.5 transition-transform">✏️</span>
                        </div>
                        <div className="text-[10px] text-sky-300 font-mono mt-0.5">
                          ID: {playerAccount?.playerId || user?.email?.split('@')[0]}
                        </div>
                        {playerAccount?.serverId && (
                          <div className="text-[9.5px] text-emerald-400 font-semibold mt-0.5 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Zone: {playerAccount.serverId} • Active
                          </div>
                        )}
                      </div>

                      {/* 1. Profile / Edit Info Option */}
                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false);
                          window.dispatchEvent(new CustomEvent('open-player-profile'));
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-cyan-300 hover:bg-slate-800/70 transition-colors cursor-pointer"
                      >
                        <span>👤</span>
                        <span>{language === 'km' ? 'ព័ត៌មាន Profile & កែប្រែ' : 'Profile & Edit Info'}</span>
                      </button>

                      {/* 2. Order History */}
                      <Link
                        to="/order-history"
                        onClick={() => setUserMenuOpen(false)}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors"
                      >
                        <span>📋</span>
                        <span>{language === 'km' ? 'ប្រវត្តិបញ្ជាទិញ' : 'Order History'}</span>
                      </Link>

                      {/* 3. Sign Out */}
                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-200 hover:bg-rose-950/40 transition-colors cursor-pointer mt-1"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>{language === 'km' ? 'ចាកចេញ (Sign Out)' : 'Sign Out'}</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Mobile Hamburger / Close Button - Hidden to match clean mockup where bottom dock handles navigation */}
            <button
              type="button"
              className={`hidden h-10 w-10 items-center justify-center rounded-xl border transition-all duration-300 ${
                mobileMenuOpen
                  ? 'bg-rose-950/40 border-rose-500/40 text-rose-300 rotate-90 shadow-sm'
                  : 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white'
              }`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Smart Search Bar matching screenshot */}
        <div className="lg:hidden pb-3 pt-1">
          <SmartSearchBar
            isMobile={true}
            onFilterClick={() => {
              const el = document.getElementById('games-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </div>
      </div>

      {/* Ultra Clean & Smooth Animated Mobile Drawer */}
      <div
        className={`lg:hidden relative z-10 bg-[#0a0f1d] border-b border-slate-800/90 shadow-[0_25px_60px_rgba(0,0,0,0.95)] transition-all duration-300 ease-in-out overflow-y-auto ${
          mobileMenuOpen
            ? 'max-h-[calc(100vh-80px)] opacity-100 translate-y-0 pointer-events-auto border-slate-800/90'
            : 'max-h-0 opacity-0 -translate-y-2 pointer-events-none border-transparent'
        }`}
      >
        <div className="px-4 pt-3 pb-28 space-y-3 max-w-md mx-auto">

          {/* 3. Grouped Navigation Inset List (iOS / Fintech Style) */}
          <div className="bg-[#0e1424]/90 backdrop-blur-xl rounded-2xl border border-slate-800/80 divide-y divide-slate-800/60 overflow-hidden shadow-lg">
            
            {/* Home */}
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between p-3 transition-colors ${
                isActive('/') ? 'bg-cyan-500/10 text-cyan-300' : 'text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm ${isActive('/') ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}>
                  🏠
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-white">{t('nav_home')}</div>
                  <div className="text-[10px] text-slate-400">Official Game Store & Events</div>
                </div>
              </div>
              <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
            </Link>

            {/* Top Up Diamonds */}
            <Link
              to="/topup"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between p-3 transition-colors ${
                isActive('/topup') && !window.location.search.includes('pass') ? 'bg-amber-500/10 text-amber-300' : 'text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm ${isActive('/topup') ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}>
                  💎
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-white">{t('nav_topup')}</div>
                  <div className="text-[10px] text-slate-400">Direct MLBB Diamonds & Packages</div>
                </div>
              </div>
              <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
            </Link>

            {/* Weekly Diamond Pass */}
            <Link
              to="/topup?tab=pass"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 text-slate-200 hover:bg-slate-800/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-cyan-950/60 text-cyan-400 border border-cyan-800/40 flex items-center justify-center text-sm">
                  🔥
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-white">Weekly Diamond Pass</div>
                  <div className="text-[10px] text-cyan-400/80">Special Passes & Ticket Bundles</div>
                </div>
              </div>
              <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
            </Link>

            {/* Help & FAQ */}
            <Link
              to="/support"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between p-3 transition-colors ${
                isActive('/support') ? 'bg-purple-500/10 text-purple-300' : 'text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm ${isActive('/support') ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-900 text-slate-400 border border-slate-800'}`}>
                  🎧
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-white">{t('nav_support')}</div>
                  <div className="text-[10px] text-slate-400">Telegram & 24/7 Customer Care</div>
                </div>
              </div>
              <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
            </Link>

            {/* Privacy & Terms */}
            <Link
              to="/privacy"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between p-3 transition-colors ${
                isActive('/privacy') || isActive('/terms') ? 'bg-emerald-500/10 text-emerald-300' : 'text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 flex items-center justify-center text-sm">
                  📜
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-white">{t('nav_privacy')}</div>
                  <div className="text-[10px] text-slate-400">100% Safe Official Guarantee</div>
                </div>
              </div>
              <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
            </Link>

            {/* Admin (Only if Admin) */}
            {isAdmin() && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 bg-red-950/20 text-red-300 hover:bg-red-950/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-red-950 text-red-400 border border-red-800/50 flex items-center justify-center text-sm">
                    ⚙️
                  </div>
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-white">{t('nav_admin')}</div>
                    <div className="text-[10px] text-red-400/80">Store & Product Management</div>
                  </div>
                </div>
                <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
              </Link>
            )}

            {/* Logout (if authenticated) */}
            {isAuthenticated() && (
              <button
                type="button"
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between p-3 text-red-400 hover:bg-red-950/30 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-red-950/40 text-red-400 border border-red-800/40 flex items-center justify-center text-sm">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-xs sm:text-sm">Logout ({user?.name || 'Account'})</div>
                    <div className="text-[10px] text-slate-500">Sign out of current session</div>
                  </div>
                </div>
                <span className="text-xs text-red-400 font-bold">Exit</span>
              </button>
            )}
          </div>

          {/* 4. Instant Top-Up Main Action & Telegram Support */}
          <div className="pt-1 space-y-2">
            <Link
              to="/topup"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full h-11 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 text-xs sm:text-sm font-black tracking-wide flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(251,191,36,0.35)] active:scale-98 transition-all font-khmer cursor-pointer"
            >
              <svg 
                className="w-4 h-4 shrink-0 text-slate-950 fill-current drop-shadow-[0_1px_0_rgba(255,255,255,0.4)] transition-transform duration-200 group-hover:scale-125 group-hover:rotate-6" 
                viewBox="0 0 24 24"
              >
                <path d="M13 2L3 14h8l-2 8 11-12h-8l2-8z" />
              </svg>
              <span>{t('nav_instant_btn')} ({t('nav_guest')})</span>
            </Link>

            <a
              href="https://t.me/Peak_Deth"
              target="_blank"
              rel="noreferrer"
              className="w-full h-9 rounded-full bg-[#121c2d] hover:bg-[#1a2840] border border-sky-500/30 text-sky-300 text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-98 shadow-sm"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
              <span>Telegram 24/7: @Peak_Deth</span>
            </a>
          </div>
        </div>
      </div>
        </>
      )}
    </header>
  );
};

export default Navbar;
