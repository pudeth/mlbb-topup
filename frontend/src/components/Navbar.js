import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useStoreBranding } from '../services/storeBranding';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { branding } = useStoreBranding();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const languages = [
    { code: 'km', name: 'ភាសាខ្មែរ', flag: '🇰🇭', short: 'ខ្មែរ' },
    { code: 'en', name: 'English', flag: '🇬🇧', short: 'EN' },
    { code: 'zh', name: '中文 (Chinese)', flag: '🇨🇳', short: '中文' },
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
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="h-10 sm:h-12 w-10 sm:w-12 flex items-center justify-center shrink-0 group-hover:scale-105 transition-all">
                <img
                  src={branding.logoImage || '/tin-logo.png'}
                  alt={branding.storeName || 'Tin-Topup'}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/tin-logo.png';
                  }}
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg sm:text-xl font-black tracking-wider text-white group-hover:text-amber-400 transition-colors">
                    {branding.storeName || 'Tin-Topup'}
                  </span>
                  {branding.badgeText && (
                    <span className="bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded tracking-widest uppercase">
                      {branding.badgeText}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-300">
                    {branding.versionText || 'Enterprise Hub v2.5'}
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/80">
            <Link
              to="/"
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                isActive('/') 
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30 shadow-sm' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              🏠 {t('nav_home')}
            </Link>
            <Link
              to="/topup"
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                isActive('/topup') 
                  ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-400 border border-amber-500/30 shadow-sm' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              💎 {t('nav_topup')}
            </Link>
            <Link
              to="/support"
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                isActive('/support') 
                  ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border border-purple-500/30 shadow-sm' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              🎧 {t('nav_support')}
            </Link>
            <Link
              to="/privacy"
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                isActive('/privacy') || isActive('/terms')
                  ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30 shadow-sm' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              📜 {t('nav_privacy')}
            </Link>
            {isAdmin() && (
              <Link
                to="/admin"
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive('/admin') 
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                ⚙️ {t('nav_admin')}
              </Link>
            )}
          </nav>

          {/* Right Action: Admin Quick Button + AI Language Switcher + CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Admin Button - Always visible on mobile & login */}
            <Link
              to="/admin"
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl border transition-all flex flex-col items-center justify-center text-center select-none active:scale-95 ${
                isActive('/admin')
                  ? 'bg-red-500/20 text-red-400 border-red-500/50 shadow-glow-red'
                  : 'bg-[#0e1320] hover:bg-slate-800 border-slate-700/80 text-slate-200 hover:text-white shadow-sm'
              }`}
              title={t('nav_admin')}
            >
              <span className="text-xs sm:text-sm leading-none">⚙️</span>
              <span className="text-[10px] sm:text-xs font-bold leading-tight mt-0.5">{t('nav_admin')}</span>
            </Link>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/30 text-slate-200 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all shadow-sm"
              >
                <span>{currentLang.flag}</span>
                <span className="hidden sm:inline">{currentLang.short}</span>
                <span className="text-[10px] text-cyan-400">▼</span>
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-slate-950 border-2 border-cyan-500/30 rounded-2xl p-1.5 shadow-2xl z-50 animate-fadeIn">
                  <div className="px-3 py-1.5 text-[10px] font-extrabold text-cyan-400 uppercase tracking-wider border-b border-slate-800/80 mb-1 flex items-center gap-1">
                    <span>🌐</span> AI Translate
                  </div>
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => {
                        setLanguage(l.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                        language === l.code
                          ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-base">{l.flag}</span>
                        <span>{l.name}</span>
                      </span>
                      {language === l.code && <span className="text-cyan-400 text-xs font-black">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop Top Up CTA */}
            <Link
              to="/topup"
              className="btn btn-gold text-xs sm:text-sm px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl hidden sm:flex items-center gap-1.5 shadow-glow-gold hover:scale-105 transition-all font-black"
            >
              <span>⚡</span>
              <span>{t('nav_instant_btn')}</span>
            </Link>

            {isAuthenticated() && (
              <button
                onClick={logout}
                className="btn btn-secondary text-xs py-2 px-3 hidden lg:block"
              >
                Logout ({user?.name})
              </button>
            )}

            {/* Mobile menu button hidden (mobile uses bottom dock) */}
            {/* <div className="hidden">...</div> */}
          </div>
        </div>
      </div>

      {/* Personalized Professional Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0B0F19]/95 backdrop-blur-2xl border-b border-slate-800/90 px-4 pt-3 pb-6 space-y-4 animate-slideDown shadow-2xl">
          
          {/* 1. VIP Gamer / Store Identity Card */}
          <div className="p-3 rounded-2xl bg-gradient-to-r from-slate-900/90 via-[#111728] to-slate-900/90 border border-slate-800/90 flex items-center justify-between shadow-inner">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-glow-cyan shrink-0 flex items-center justify-center">
                {branding.logoType === 'image' && branding.logoImage ? (
                  <img src={branding.logoImage} alt="Logo" className="w-full h-full object-contain rounded-lg" />
                ) : (
                  <span className="text-base font-black text-slate-950">💎</span>
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-white font-extrabold text-sm tracking-tight">{branding.brandName || 'Tin-TopUp'}</span>
                  <span className="bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded font-mono">VIP</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Instant KHQR Service Online</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-amber-400 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded-lg">
                ⚡ 10s Fast
              </span>
            </div>
          </div>

          {/* 2. Glass Language Switcher */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <span>🌐</span>
                <span>Language / ភាសា</span>
              </span>
              <span className="text-[10px] text-cyan-400 font-bold">{currentLang?.name}</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800/80 shadow-inner">
              {languages.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setLanguage(l.code)}
                  className={`py-2 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    language === l.code
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md font-black scale-[1.02]'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <span className="text-sm">{l.flag}</span>
                  <span>{l.short}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Personalized Nav Link Cards */}
          <div className="space-y-1.5">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                isActive('/')
                  ? 'bg-[#141d33] border-cyan-500/50 text-cyan-300 shadow-sm ring-1 ring-cyan-500/30'
                  : 'bg-[#0f1422]/60 border-slate-800/80 text-slate-300 hover:bg-[#151c2e] hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-base ${isActive('/') ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-900 text-slate-400'}`}>
                  🏠
                </div>
                <div>
                  <div className="font-bold text-sm text-white">{t('nav_home')}</div>
                  <div className="text-[10px] text-slate-400">Official Game Store & Events</div>
                </div>
              </div>
              <span className="text-slate-500 text-xs font-bold">→</span>
            </Link>

            <Link
              to="/topup"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                isActive('/topup') && !window.location.search.includes('pass')
                  ? 'bg-[#1c182d] border-amber-500/50 text-amber-300 shadow-sm ring-1 ring-amber-500/30'
                  : 'bg-[#0f1422]/60 border-slate-800/80 text-slate-300 hover:bg-[#151c2e] hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-base ${isActive('/topup') ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-900 text-slate-400'}`}>
                  💎
                </div>
                <div>
                  <div className="font-bold text-sm text-white">{t('nav_topup')}</div>
                  <div className="text-[10px] text-slate-400">Direct MLBB Diamonds & Packages</div>
                </div>
              </div>
              <span className="text-slate-500 text-xs font-bold">→</span>
            </Link>

            <Link
              to="/topup?tab=pass"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl border bg-[#0f1422]/60 border-slate-800/80 text-slate-300 hover:bg-[#151c2e] hover:border-slate-700 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-950/60 text-cyan-400 flex items-center justify-center text-base">
                  🔥
                </div>
                <div>
                  <div className="font-bold text-sm text-white">Weekly Diamond Pass</div>
                  <div className="text-[10px] text-cyan-400/80">Special Passes & Ticket Bundles</div>
                </div>
              </div>
              <span className="text-slate-500 text-xs font-bold">→</span>
            </Link>

            <Link
              to="/support"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                isActive('/support')
                  ? 'bg-[#1b142d] border-purple-500/50 text-purple-300 shadow-sm ring-1 ring-purple-500/30'
                  : 'bg-[#0f1422]/60 border-slate-800/80 text-slate-300 hover:bg-[#151c2e] hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-base ${isActive('/support') ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-900 text-slate-400'}`}>
                  🎧
                </div>
                <div>
                  <div className="font-bold text-sm text-white">{t('nav_support')}</div>
                  <div className="text-[10px] text-slate-400">Telegram & 24/7 Customer Care</div>
                </div>
              </div>
              <span className="text-slate-500 text-xs font-bold">→</span>
            </Link>

            <Link
              to="/privacy"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                isActive('/privacy') || isActive('/terms')
                  ? 'bg-[#122320] border-emerald-500/50 text-emerald-300 shadow-sm'
                  : 'bg-[#0f1422]/60 border-slate-800/80 text-slate-300 hover:bg-[#151c2e] hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-950/60 text-emerald-400 flex items-center justify-center text-base">
                  📜
                </div>
                <div>
                  <div className="font-bold text-sm text-white">{t('nav_privacy')}</div>
                  <div className="text-[10px] text-slate-400">100% Safe Official Guarantee</div>
                </div>
              </div>
              <span className="text-slate-500 text-xs font-bold">→</span>
            </Link>

            {isAdmin() && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl border border-red-500/40 bg-red-500/10 text-red-300 hover:bg-red-500/20 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-950 text-red-400 flex items-center justify-center text-base">
                    ⚙️
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white">{t('nav_admin')}</div>
                    <div className="text-[10px] text-red-400/80">Store & Product Management</div>
                  </div>
                </div>
                <span className="text-red-400 text-xs font-bold">→</span>
              </Link>
            )}
          </div>

          {/* 4. Instant Top-Up Main Action & Telegram Support */}
          <div className="pt-2 space-y-2">
            <Link
              to="/topup"
              onClick={() => setMobileMenuOpen(false)}
              className="btn btn-gold w-full text-center font-black py-3.5 rounded-2xl shadow-glow-gold hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-wider text-xs sm:text-sm flex items-center justify-center gap-2"
            >
              <span>⚡</span>
              <span>{t('nav_instant_btn')} ({t('nav_guest')})</span>
            </Link>

            <a
              href="https://t.me/Peak_Deth"
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-[#121c2d] hover:bg-[#1a2840] border border-sky-500/40 text-sky-300 text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
            >
              <span>✈️</span>
              <span>Telegram 24/7: @Peak_Deth</span>
            </a>
          </div>
        </div>
      )}
        </>
      )}
    </header>
  );
};

export default Navbar;
