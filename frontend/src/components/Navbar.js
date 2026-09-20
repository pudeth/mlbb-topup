import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useStoreBranding } from '../services/storeBranding';
import { BrandLogo } from './BrandLogo';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { branding } = useStoreBranding();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const languages = [
    { code: 'km', name: 'ភាសាខ្មែរ', flagCode: 'kh', flag: '🇰🇭', short: 'ខ្មែរ' },
    { code: 'en', name: 'English', flagCode: 'gb', flag: '🇬🇧', short: 'EN' },
    { code: 'zh', name: '中文 (Chinese)', flagCode: 'cn', flag: '🇨🇳', short: '中文' },
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
    <header className={`sticky top-0 z-50 ${isAuthPage ? '' : 'bg-dark-bg/85 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl'}`}>
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
            <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link to="/" className="group flex items-center">
              <BrandLogo branding={branding} size="md" showSubtitle={true} />
            </Link>
          </div>

          {/* Desktop Navigation Links - Ultra Sleek Pill */}
            <nav className="hidden lg:flex items-center gap-0.5 bg-slate-950/80 backdrop-blur-xl p-1 rounded-full border border-slate-800/60 shadow-[0_4px_30px_rgba(0,0,0,0.4)] font-khmer">
              <Link
                to="/"
                className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold transition-all duration-200 flex items-center gap-1.5 ${
                  isActive('/')
                    ? 'bg-slate-800/90 text-cyan-400 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <span className="text-[13px]">🏠</span>
                <span>{t('nav_home')}</span>
              </Link>
              <Link
                to="/topup"
                className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold transition-all duration-200 flex items-center gap-1.5 ${
                  isActive('/topup')
                    ? 'bg-amber-400/15 text-amber-400 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <span className="text-[13px]">💎</span>
                <span>{t('nav_topup')}</span>
              </Link>
              <Link
                to="/support"
                className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold transition-all duration-200 flex items-center gap-1.5 ${
                  isActive('/support')
                    ? 'bg-slate-800/80 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <span className="text-[13px]">🎧</span>
                <span>{t('nav_support')}</span>
              </Link>
              <Link
                to="/terms"
                className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold transition-all duration-200 flex items-center gap-1.5 ${
                  isActive('/terms')
                    ? 'bg-slate-800/80 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <span className="text-[13px]">📜</span>
                <span>{t('nav_policy')}</span>
              </Link>

              {isAdmin() && (
                <>
                  <div className="w-px h-4 bg-slate-700/60 mx-1" />
                  <Link
                    to="/admin/setup"
                    className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold transition-all duration-200 flex items-center gap-1.5 ${
                      isActive('/admin/setup')
                        ? 'bg-purple-900/40 text-purple-300 shadow-sm'
                        : 'text-slate-500 hover:text-purple-300 hover:bg-slate-800/40'
                    }`}
                  >
                    <span className="text-[13px]">⚙️</span>
                    <span>{t('nav_admin')}</span>
                  </Link>
                  <Link
                    to="/admin/orders"
                    className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold transition-all duration-200 flex items-center gap-1.5 ${
                      isActive('/admin/orders')
                        ? 'bg-purple-900/40 text-purple-300 shadow-sm'
                        : 'text-slate-500 hover:text-purple-300 hover:bg-slate-800/40'
                    }`}
                  >
                    <span className="text-[13px]">📊</span>
                    <span>{t('nav_orders')}</span>
                  </Link>
                </>
              )}
            </nav>

          {/* Right: Language + CTA + Logout */}
          <div className="flex items-center gap-2">

            {/* Refresh Button */}
            <button
              type="button"
              onClick={() => window.location.reload()}
              title="Refresh Page"
              className="h-9 w-9 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-600 text-slate-400 hover:text-white flex items-center justify-center transition-all duration-300 hover:rotate-180 group"
            >
              <svg className="w-4 h-4 transition-transform duration-500 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>

            {/* Language Selector Dropdown - Always in front */}
            <div className="relative z-50">
              <button
                type="button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="h-9 px-3 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 text-slate-300 text-[12px] font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
              >
                <span className={`fi fi-${currentLang.flagCode || 'kh'} rounded-xs shadow-xs text-sm leading-none`} />
                <span className="hidden sm:inline font-bold">{currentLang.short}</span>
                <svg className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${langDropdownOpen ? 'rotate-180 text-amber-400' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {langDropdownOpen && (
                <>
                  {/* Click-away overlay to close dropdown */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setLangDropdownOpen(false)}
                  />

                  {/* High-priority Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-[#0d1322]/98 backdrop-blur-2xl border border-slate-700/90 rounded-2xl p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.95)] ring-1 ring-white/10 z-50 animate-fadeIn font-khmer">
                    <div className="px-3 py-1.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-800/80 mb-1 flex items-center gap-1">
                      <span>🌐</span> Language / ភាសា
                    </div>
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        type="button"
                        onClick={() => {
                          setLanguage(l.code);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                          language === l.code
                            ? 'bg-cyan-950/40 text-cyan-300 font-black border border-cyan-500/30 shadow-sm'
                            : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className={`fi fi-${l.flagCode || 'kh'} rounded-xs shadow-xs text-base leading-none`} />
                          <span>{l.name}</span>
                        </span>
                        {language === l.code && <span className="text-cyan-400 text-xs font-black">✓</span>}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Top Up CTA - Golden Pill */}
            <Link
              to="/topup"
              className="hidden sm:flex items-center gap-1.5 h-9 px-4 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 text-[12px] font-black tracking-wide rounded-full shadow-[0_0_16px_rgba(251,191,36,0.25)] hover:shadow-[0_0_24px_rgba(251,191,36,0.4)] transition-all duration-300 hover:scale-[1.04] group font-khmer cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 fill-current shrink-0 transition-transform duration-300 group-hover:rotate-12" viewBox="0 0 24 24">
                <path d="M13 2L3 14h8l-2 8 11-12h-8l2-8z" />
              </svg>
              <span>{t('nav_instant_btn')}</span>
            </Link>

            {/* Logout Button */}
            {isAuthenticated() && (
              <button
                onClick={logout}
                className="hidden lg:flex items-center gap-1.5 h-9 px-3 bg-slate-900/80 hover:bg-red-950/40 border border-slate-800 hover:border-red-500/30 text-slate-400 hover:text-red-400 text-[12px] font-bold rounded-full transition-all duration-200"
              >
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            )}

            {/* Mobile Hamburger / Close Button */}
            <button
              type="button"
              className={`lg:hidden h-9 w-9 flex items-center justify-center rounded-full border transition-all duration-300 ${
                mobileMenuOpen
                  ? 'bg-red-950/40 border-red-500/40 text-red-300 rotate-90 shadow-sm'
                  : 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white'
              }`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
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
