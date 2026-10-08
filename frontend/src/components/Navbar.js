import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { BrandLogo } from './BrandLogo';
import { SmartSearchBar } from './SmartSearchBar';
import GamerAvatar from './GamerAvatar';
const Navbar = () => {
  const { user, playerAccount, logout, isAuthenticated, isAdmin } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 30);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <>
      {/* Top micro moving marquee announcement bar (Natural document flow at top of page, scrolls naturally away) */}
      {!isAuthPage && (
        <div className={`bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 border-b border-cyan-500/20 overflow-hidden relative select-none transition-all duration-300 ${
          isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}>
          <div className="flex items-center gap-2 py-1.5">
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
      )}

      <header className={`sticky top-0 z-[9995] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isAuthPage 
          ? '' 
          : isScrolled
          ? 'pt-2 sm:pt-3 px-3 sm:px-4 pb-0 pointer-events-none'
          : 'bg-dark-bg/85 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl pointer-events-auto'
      }`}>
        {!isAuthPage && (
          <>
            <div className={`transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isScrolled
                ? 'max-w-6xl mx-auto rounded-full bg-[#03091e]/95 backdrop-blur-2xl border-2 border-[#0062ff] shadow-[0_12px_40px_rgba(0,0,0,0.92),0_0_28px_rgba(0,98,255,0.35)] ring-1 ring-white/10 px-3.5 sm:px-4 h-13 sm:h-14 relative overflow-visible pointer-events-auto'
                : 'max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-20 pointer-events-auto'
            }`}>
            <div className={`flex items-center justify-between transition-all duration-300 ${
              isScrolled ? 'h-full' : 'h-16 lg:h-20'
            }`}>
          
              {/* Logo (Avatar Medallion + Title) */}
              <div className={`flex items-center select-none ${isScrolled ? 'pl-1 sm:pl-2' : ''}`}>
                <Link to="/" className="group flex items-center">
                  <BrandLogo size={isScrolled ? "md" : "sm"} hideTitle={isScrolled} />
                </Link>
              </div>

              {/* Desktop Central Smart Search Bar */}
              <div className={`transition-all duration-300 ${
                isScrolled ? 'hidden' : 'hidden lg:flex items-center flex-1 max-w-xl mx-4'
              }`}>
                <SmartSearchBar isMobile={false} />
              </div>

              {/* Right: Actions (Capsule Pills) */}
              <div className="flex items-center gap-2 select-none">
                {/* 1. Notification Bell with Red Badge 1 */}
                <button
                  type="button"
                  title="Notifications"
                  className="relative h-10 px-3.5 rounded-full border border-[#0055ff]/40 bg-[#081329]/90 hover:bg-[#0e204c] hover:border-[#0088ff]/70 text-slate-200 hover:text-white flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm cursor-pointer"
                >
                  <svg className="w-4.5 h-4.5 text-white/95" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="absolute -top-1 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#ff3b5c] text-white font-black text-[10px] flex items-center justify-center shadow-[0_0_10px_rgba(255,59,92,0.8)] border border-white/20 animate-pulse">
                    1
                  </span>
                </button>

                {/* 2. Language Selector Dropdown */}
                <div className="relative z-[100]">
                  <button
                    type="button"
                    onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                    className={`h-10 px-3 rounded-full border transition-all duration-200 text-xs font-bold flex items-center gap-2 shadow-sm active:scale-95 whitespace-nowrap cursor-pointer ${
                      langDropdownOpen
                        ? 'bg-[#0e204c] border-2 border-cyan-400 text-white ring-2 ring-cyan-400/25 shadow-[0_0_18px_rgba(0,229,255,0.4)]'
                        : 'bg-[#081329]/90 hover:bg-[#0e204c] border-[#0055ff]/40 hover:border-[#0088ff]/70 text-slate-200'
                    }`}
                    aria-expanded={langDropdownOpen}
                    aria-label="Select Language"
                  >
                    <span className="w-5.5 h-4 rounded-[3px] overflow-hidden shadow-sm shrink-0 inline-flex items-center justify-center">
                      <span className={`fi fi-${currentLang.flagCode || 'kh'} w-full h-full object-cover`} />
                    </span>
                    {!isScrolled && (
                      <span className="hidden sm:inline font-bold tracking-wide">{currentLang.short}</span>
                    )}
                    <svg
                      className={`w-3.5 h-3.5 text-slate-300 stroke-[2.5] transition-transform duration-300 ${langDropdownOpen ? 'rotate-180 text-cyan-400' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

              {langDropdownOpen && (
                <>
                  {/* Invisible Dismiss Overlay */}
                  <div
                    className="fixed inset-0 z-[90]"
                    onClick={() => setLangDropdownOpen(false)}
                  />

                  {/* High-End Cyber Gaming Dropdown Card with Smooth Spring Transition */}
                  <div className="absolute right-0 mt-3 w-72 sm:w-80 rounded-[22px] bg-[#040816] border-2 border-[#0055ff]/80 shadow-[0_15px_50px_rgba(0,0,0,0.95),0_0_28px_rgba(0,85,255,0.3)] p-2.5 z-[100] animate-profileDropdown font-khmer select-none">
                    {/* Top Caret Pointer Triangle */}
                    <div className="absolute -top-2 right-6 sm:right-7 w-3.5 h-3.5 rotate-45 bg-[#0a1838] border-t-2 border-l-2 border-[#0055ff]/80 z-20 pointer-events-none" />

                    {/* Dedicated Cosmic Gaming Artwork Background Layer */}
                    <div className="absolute inset-[1px] rounded-[20px] overflow-hidden z-0 pointer-events-none">
                      <div className="absolute inset-0 bg-[#040816]" />
                      <img 
                        src="/images/banner_starlight_cosmic.jpg" 
                        alt="Cosmic Background"
                        className="w-full h-full object-cover object-center opacity-45 scale-105 filter brightness-110 contrast-125"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-[#040816]/80 via-[#040816]/50 to-[#040816]/90" />
                      <div className="absolute inset-0 shadow-[inset_0_0_35px_rgba(0,112,255,0.35)]" />
                    </div>

                    <div className="relative z-10">
                      {/* Dropdown Header */}
                      <div className="flex items-center justify-between px-2.5 py-2 border-b border-blue-900/40 mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-5.5 h-5.5 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-xs text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.3)]">
                            🌐
                          </div>
                          <span className="text-[11px] font-black text-slate-200 uppercase tracking-wider">
                            Language / ភាសា
                          </span>
                        </div>
                        <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-cyan-950/90 border border-cyan-400/50 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.25)]">
                          {languages.length} Available
                        </span>
                      </div>

                      {/* Language Options */}
                      <div className="space-y-1.5">
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
                              className={`w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200 flex items-center justify-between cursor-pointer group ${
                                isSelected
                                  ? 'bg-gradient-to-r from-[#003882]/85 via-[#002860]/90 to-[#001c44]/95 border-2 border-[#00d0ff] shadow-[0_0_18px_rgba(0,208,255,0.35),inset_0_0_12px_rgba(0,180,255,0.2)] text-white scale-[1.01]'
                                  : 'bg-[#060e20]/65 hover:bg-[#0c1a3e]/85 backdrop-blur-sm border border-slate-700/60 hover:border-blue-500/50 text-slate-300 hover:text-white hover:scale-[1.01]'
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                {/* Flag Squircle */}
                                <div className={`w-8 h-5.5 rounded-md overflow-hidden shadow-sm border shrink-0 flex items-center justify-center transition-all ${
                                  isSelected 
                                    ? 'border-cyan-300 ring-2 ring-cyan-400/50 shadow-[0_0_10px_rgba(0,229,255,0.5)]' 
                                    : 'border-white/20 group-hover:border-white/50'
                                }`}>
                                  <span className={`fi fi-${l.flagCode || 'kh'} w-full h-full object-cover leading-none`} />
                                </div>
                                
                                {/* Text */}
                                <div className="flex flex-col min-w-0">
                                  <span className={`text-xs font-bold leading-tight truncate ${
                                    isSelected ? 'text-white font-black drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]' : 'text-slate-200 group-hover:text-white'
                                  }`}>
                                    {l.name}
                                  </span>
                                  <span className={`text-[10px] font-medium leading-tight mt-0.5 truncate ${
                                    isSelected ? 'text-cyan-200' : 'text-slate-400 group-hover:text-slate-300'
                                  }`}>
                                    {l.sub}
                                  </span>
                                </div>
                              </div>

                              {/* Right Indicator */}
                              {isSelected ? (
                                <div className="w-5.5 h-5.5 rounded-full bg-cyan-400 border-2 border-white text-slate-950 flex items-center justify-center text-xs font-black shrink-0 shadow-[0_0_12px_rgba(0,229,255,0.8)]">
                                  ✓
                                </div>
                              ) : (
                                <div className="w-5 h-5 rounded-full border border-slate-700/80 group-hover:border-blue-400/60 flex items-center justify-center text-slate-500 group-hover:text-cyan-400 text-xs transition-colors">
                                  ›
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Footer */}
                      <div className="mt-2 pt-2 border-t border-blue-900/40 px-2 py-0.5 flex items-center justify-between text-[10px] font-medium">
                        <div className="flex items-center gap-1.5 text-amber-400 font-semibold drop-shadow-[0_0_6px_rgba(251,191,36,0.3)]">
                          <span>⚡</span>
                          <span>Instant Switch</span>
                        </div>
                        <span className="text-emerald-400 flex items-center gap-1.5 font-bold drop-shadow-[0_0_6px_rgba(52,211,153,0.3)]">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
                          Active
                        </span>
                      </div>
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
                className="h-10 px-3.5 rounded-full bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold flex items-center gap-1.5 shadow-[0_2px_10px_rgba(14,165,233,0.3)] transition-all active:scale-95 cursor-pointer whitespace-nowrap"
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
                  className={`h-10 px-2.5 sm:px-3 rounded-full border transition-all duration-200 text-xs font-bold flex items-center gap-2 shadow-sm active:scale-95 cursor-pointer ${
                    userMenuOpen
                      ? 'bg-[#0e204c] border-2 border-cyan-400 text-white ring-2 ring-cyan-400/25 shadow-[0_0_18px_rgba(0,229,255,0.4)]'
                      : 'bg-[#081329]/90 hover:bg-[#0e204c] border-[#0055ff]/40 hover:border-[#0088ff]/70 text-slate-200'
                  }`}
                  title="Player Account Menu"
                >
                  {/* Golden Crown Squircle Medallion matching Reference Image 1 */}
                  <div className="w-7.5 h-7.5 rounded-xl border-2 border-amber-400 bg-gradient-to-b from-[#2e1805] via-[#160c02] to-[#0a0501] shadow-[0_0_12px_rgba(251,191,36,0.65)] flex items-center justify-center overflow-hidden shrink-0">
                    <svg className="w-4 h-4 text-amber-400 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/>
                      <circle cx="12" cy="11.5" r="1.5" fill="#38bdf8"/>
                    </svg>
                  </div>
                  {!isScrolled && (
                    <span className="hidden md:inline font-bold max-w-[85px] truncate text-[11px]">
                      {playerAccount?.realName || user?.name || playerAccount?.playerId}
                    </span>
                  )}
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10e396] shadow-[0_0_8px_#10e396] animate-pulse shrink-0" />
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-3 w-72 sm:w-80 rounded-[22px] bg-[#040816] border-2 border-[#0055ff]/80 shadow-[0_15px_50px_rgba(0,0,0,0.95),0_0_28px_rgba(0,85,255,0.3)] p-2.5 z-50 animate-profileDropdown font-khmer select-none">
                      {/* Top Caret Pointer Triangle matching Reference Image 1 */}
                      <div className="absolute -top-2 right-6 w-3.5 h-3.5 rotate-45 bg-[#0a1838] border-t-2 border-l-2 border-[#0055ff]/80 z-20 pointer-events-none" />

                      {/* Dedicated Cosmic Gaming Artwork Background Layer */}
                      <div className="absolute inset-[1px] rounded-[20px] overflow-hidden z-0 pointer-events-none">
                        <div className="absolute inset-0 bg-[#040816]" />
                        <img 
                          src="/images/banner_starlight_cosmic.jpg" 
                          alt="Cosmic Background"
                          className="w-full h-full object-cover object-center opacity-45 scale-105 filter brightness-110 contrast-125"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-[#040816]/80 via-[#040816]/50 to-[#040816]/90" />
                        <div className="absolute inset-0 shadow-[inset_0_0_35px_rgba(0,112,255,0.35)]" />
                      </div>

                      <div className="relative z-10">
                        {/* Top Header Card - Exact Match to Reference Image 1 */}
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0a1838] via-[#091530] to-[#0a1226] border border-blue-500/40 p-3 mb-2 shadow-inner">
                          {/* Ambient Golden Glow on Left */}
                          <div className="absolute -left-10 -top-10 w-32 h-32 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />
                          
                          {/* Specular Top Sheen */}
                          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-amber-400/50 via-blue-400/30 to-transparent pointer-events-none" />

                          {/* Faint Crown Watermark in Background on Right */}
                          <div className="absolute -right-2 -bottom-2 text-white/5 pointer-events-none select-none">
                            <svg className="w-20 h-20 fill-current" viewBox="0 0 24 24">
                              <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
                            </svg>
                          </div>

                          <div className="relative z-10 flex items-center justify-between gap-2.5">
                            {/* Left: Glowing Gold Squircle Avatar */}
                            <div className="relative shrink-0">
                              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl p-[2px] bg-gradient-to-br from-amber-300 via-amber-500 to-yellow-600 shadow-[0_0_18px_rgba(245,158,11,0.55)]">
                                <div className="w-full h-full rounded-[14px] bg-gradient-to-b from-[#2a1705] via-[#140b02] to-[#0a0501] flex items-center justify-center overflow-hidden">
                                  <GamerAvatar 
                                    avatarId={playerAccount?.avatar || user?.avatar || 'crown'} 
                                    name={playerAccount?.realName || user?.name || playerAccount?.playerId} 
                                    size="sm" 
                                    showGlow={false} 
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Middle: User Identity & Active Status */}
                            <div className="min-w-0 flex-1 pl-1">
                              <h4 className="text-sm sm:text-base font-black text-white tracking-wide truncate font-sans">
                                {playerAccount?.realName || user?.name || 'Pu Deth'}
                              </h4>
                              <div className="text-xs font-bold text-slate-300 font-mono mt-0.5 truncate flex items-center gap-1">
                                <span className="text-slate-400 font-sans">ID:</span>
                                <span className="text-[#00e5ff] font-mono tracking-tight font-extrabold">
                                  {playerAccount?.playerId || user?.email?.split('@')[0] || '1225368571'}
                                </span>
                              </div>
                              <div className="text-[11px] text-[#00f59b] font-bold mt-0.5 flex items-center gap-1.5 font-sans tracking-tight">
                                <span className="w-2 h-2 rounded-full bg-[#00f59b] shadow-[0_0_8px_#00f59b] animate-pulse shrink-0" />
                                <span className="truncate">
                                  {playerAccount?.serverId ? `Zone: ${playerAccount.serverId} • Active` : 'Zone: 11446 • Active'}
                                </span>
                              </div>
                            </div>

                            {/* Right: Sleek Edit Icon Button */}
                            <button
                              type="button"
                              onClick={() => {
                                setUserMenuOpen(false);
                                window.dispatchEvent(new CustomEvent('open-player-profile'));
                              }}
                              className="w-8 h-8 rounded-xl bg-[#0e1d3e] hover:bg-[#162a56] border border-blue-500/50 hover:border-cyan-400 text-blue-200 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95 shrink-0 self-start"
                              title={language === 'km' ? 'កែសម្រួល Profile' : 'Edit Profile'}
                            >
                              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* 1. Profile & Edit Info Row Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setUserMenuOpen(false);
                            window.dispatchEvent(new CustomEvent('open-player-profile'));
                          }}
                          className="w-full flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-[#0c152e]/80 hover:bg-[#122046]/95 backdrop-blur-sm border border-blue-500/25 hover:border-blue-400/60 transition-all duration-200 cursor-pointer group mb-1.5 shadow-sm active:scale-[0.99]"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1e1b4b] to-[#1e293b] border border-indigo-500/40 text-indigo-300 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                              </svg>
                            </div>
                            <span className="text-xs sm:text-[13px] font-black text-white group-hover:text-cyan-300 transition-colors font-khmer truncate">
                              {language === 'km' ? 'ព័ត៌មាន Profile & ពិនិត្យ' : 'Profile & Edit Info'}
                            </span>
                          </div>
                          <svg className="w-4 h-4 text-slate-400 group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-all shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>

                        {/* 2. Order History Row Button */}
                        <Link
                          to="/order-history"
                          onClick={() => setUserMenuOpen(false)}
                          className="w-full flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-[#0c152e]/80 hover:bg-[#122046]/95 backdrop-blur-sm border border-blue-500/25 hover:border-blue-400/60 transition-all duration-200 cursor-pointer group mb-1.5 shadow-sm active:scale-[0.99]"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0c2340] to-[#0f172a] border border-cyan-500/40 text-cyan-300 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                              <svg className="w-4 h-4 fill-none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <span className="text-xs sm:text-[13px] font-black text-white group-hover:text-cyan-300 transition-colors font-khmer truncate">
                              {language === 'km' ? 'ប្រវត្តិបញ្ជាទិញ' : 'Order History'}
                            </span>
                          </div>
                          <svg className="w-4 h-4 text-slate-400 group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-all shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>

                        {/* 3. Sign Out Row Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setUserMenuOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-gradient-to-r from-[#200c14]/90 via-[#18080f]/90 to-[#12050b]/95 hover:from-[#2c0e1b] hover:to-[#1a0710] border border-rose-500/40 hover:border-rose-400/70 transition-all duration-200 cursor-pointer group shadow-sm active:scale-[0.99]"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-950/80 to-red-950/80 border border-rose-500/50 text-rose-400 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                              </svg>
                            </div>
                            <span className="text-xs sm:text-[13px] font-black text-[#ff3366] group-hover:text-rose-200 transition-colors font-khmer truncate">
                              {language === 'km' ? 'ចាកចេញ (Sign Out)' : 'Sign Out'}
                            </span>
                          </div>
                          <svg className="w-4 h-4 text-rose-400/70 group-hover:text-rose-300 group-hover:translate-x-0.5 transition-all shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* 4. Quick Games & Categories 4-Square Grid Button matching Reference Image 1 */}
            <button
              type="button"
              onClick={() => {
                const gamesSection = document.getElementById('games-section');
                if (gamesSection) {
                  gamesSection.scrollIntoView({ behavior: 'smooth' });
                } else {
                  setMobileMenuOpen(!mobileMenuOpen);
                }
              }}
              className="w-10 h-10 rounded-full border border-[#0055ff]/50 bg-[#081329]/90 hover:bg-[#0e204c] hover:border-[#0088ff]/80 text-white flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm cursor-pointer group shrink-0"
              title="All Games & Categories / ហ្គេមទាំងអស់"
              aria-label="Toggle all games menu"
            >
              <svg className="w-4 h-4 fill-white group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <rect x="3.5" y="3.5" width="7" height="7" rx="2" />
                <rect x="13.5" y="3.5" width="7" height="7" rx="2" />
                <rect x="3.5" y="13.5" width="7" height="7" rx="2" />
                <rect x="13.5" y="13.5" width="7" height="7" rx="2" />
              </svg>
            </button>
          </div>
        </div>
      </div>

        {/* Mobile Smart Search Bar - completely outside the capsule dock! */}
        <div className={`lg:hidden max-w-7xl mx-auto px-3 sm:px-6 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden pointer-events-auto ${
          isScrolled ? 'max-h-0 min-h-0 h-0 opacity-0 -translate-y-4 pointer-events-none py-0' : 'max-h-24 opacity-100 pb-3 pt-1'
        }`}>
          <SmartSearchBar
            isMobile={true}
            onFilterClick={() => {
              const el = document.getElementById('games-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          />
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
    </>
  );
};

export default Navbar;
