import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useStoreBranding } from '../services/storeBranding';

const Footer = () => {
  const { t } = useLanguage();
  const { branding } = useStoreBranding();

  return (
    <footer className="bg-[#07090E] border-t border-slate-800/80 text-slate-400 mt-12 sm:mt-16 relative z-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        
        {/* ======================================================== */}
        {/* 1. TRUST DETAILS (Clean Normal Text Format) */}
        {/* ======================================================== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 py-2">
          {/* Detail 1: 10-Second Delivery */}
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-white font-bold text-xs sm:text-sm">
              <span className="text-amber-400 text-sm sm:text-base">⚡</span>
              <span>{t('footer_delivery')}</span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">
              {t('footer_delivery_desc')}
            </p>
          </div>

          {/* Detail 2: 100% Safe Top-Up */}
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-white font-bold text-xs sm:text-sm">
              <span className="text-sky-400 text-sm sm:text-base">🛡️</span>
              <span>{t('footer_safe')}</span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">
              {t('footer_safe_desc')}
            </p>
          </div>

          {/* Detail 3: Bakong KHQR */}
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-white font-bold text-xs sm:text-sm">
              <span className="text-emerald-400 text-sm sm:text-base">🏦</span>
              <span>{t('footer_khqr')}</span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">
              {t('footer_khqr_desc')}
            </p>
          </div>

          {/* Detail 4: 24/7 Live Support */}
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-white font-bold text-xs sm:text-sm">
              <span className="text-purple-400 text-sm sm:text-base">🎧</span>
              <span>{t('footer_support')}</span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">
              {t('footer_support_desc')}
            </p>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. CONCISE SUMMARY FOOTER BAR */}
        {/* ======================================================== */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          
          {/* Brand + Status */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            <Link to="/" className="flex items-center gap-2 group">
              {branding.logoType === 'image' && branding.logoImage ? (
                <div className="h-9 w-auto flex items-center justify-center shrink-0">
                  <img
                    src={branding.logoImage}
                    alt={branding.storeName || 'Store Logo'}
                    className="h-9 w-auto max-w-[120px] object-contain drop-shadow-md"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-lg shadow-md">
                  <span>{branding.logoEmoji || '💎'}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black text-white group-hover:text-amber-400 transition-colors">
                  {branding.storeName || 'Tin-TopUp'}
                </span>
                {branding.badgeText && (
                  <span className="bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded tracking-widest uppercase">
                    {branding.badgeText}
                  </span>
                )}
              </div>
            </Link>

            <span className="hidden sm:inline text-slate-700">|</span>

            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              24/7 Instant Top-Up Online
            </div>
          </div>

          {/* Quick Nav Links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-medium text-slate-300">
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              {t('nav_home')}
            </Link>
            <span className="text-slate-700">•</span>
            <Link
              to="/topup"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              {t('nav_topup')}
            </Link>
            <span className="text-slate-700">•</span>
            <Link
              to="/topup?tab=pass"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              Weekly Pass
            </Link>
            <span className="text-slate-700">•</span>
            <Link
              to="/#games-section"
              onClick={() => {
                const el = document.getElementById('games-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              All Games
            </Link>
            <span className="text-slate-700">•</span>
            <Link
              to="/support"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              {t('nav_support')}
            </Link>
            <span className="text-slate-700">•</span>
            <Link
              to="/privacy"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              {t('nav_privacy')}
            </Link>
            <span className="text-slate-700">•</span>
            <Link
              to="/admin"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Reseller
            </Link>
          </nav>

          {/* Social Contact Buttons: Facebook & Telegram */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <a
              href={branding.facebookPage || 'https://facebook.com'}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all active:scale-95 cursor-pointer"
            >
              <span>📘</span>
              <span>Facebook Page</span>
            </a>
            <a
              href={branding.telegramUrl || 'https://t.me/Peak_Deth'}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition-all active:scale-95 cursor-pointer"
            >
              <span>✈️</span>
              <span>Telegram {branding.telegramUsername || '@Peak_Deth'}</span>
            </a>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 3. COPYRIGHT & DISCLAIMER */}
        {/* ======================================================== */}
        <div className="border-t border-slate-900 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 text-center sm:text-left">
          <p>© {new Date().getFullYear()} {branding.storeName || 'Tin-TopUp'}. {t('footer_rights')}</p>
          <div className="flex items-center gap-3 text-slate-400">
            <Link
              to="/terms"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-amber-400 transition-colors"
            >
              {t('footer_terms')}
            </Link>
            <span>•</span>
            <Link
              to="/privacy"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-cyan-400 transition-colors"
            >
              {t('footer_privacy')}
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
