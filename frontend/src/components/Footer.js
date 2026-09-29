import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useStoreBranding } from '../services/storeBranding';
import { BrandLogo } from './BrandLogo';
import WeAcceptPayments from './WeAcceptPayments';

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

          {/* Detail 3: ABA PayWay & KHQR */}
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-white font-bold text-xs sm:text-sm">
              <span className="text-sky-400 text-sm sm:text-base">💳</span>
              <span>ABA PayWay & KHQR</span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">
              Zero-fee instant checkout with ABA Mobile, KHQR & Cards
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
        {/* 2. CONCISE SUMMARY FOOTER BAR & BRAND HUB */}
        {/* ======================================================== */}
        <div className="pt-6 border-t border-slate-800/80">
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#0d121f]/90 via-[#0a0e18]/90 to-[#070a12]/95 border border-slate-800/90 shadow-2xl">
            {/* Brand Profile + Live Status + Social Action Buttons */}
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              
              {/* Left: Brand Identity & Live Status */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4">
                <Link to="/" className="group flex items-center">
                  <BrandLogo branding={branding} size="md" showSubtitle={true} />
                </Link>

                <div className="inline-flex items-center gap-2 text-[11px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="tracking-wide font-mono uppercase">24/7 Instant Online</span>
                </div>
              </div>

              {/* Right: Official Social & Support Badges */}
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                {/* Facebook Button */}
                <a
                  href={branding.facebookPage || 'https://facebook.com'}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border border-[#1877F2]/40 hover:border-[#1877F2]/80 text-[#54A0FF] hover:text-white text-xs font-bold shadow-sm hover:shadow-[0_0_15px_rgba(24,119,242,0.3)] transition-all active:scale-95 group cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current shrink-0 transition-transform group-hover:scale-110 text-[#1877F2] group-hover:text-white" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>Facebook Page</span>
                </a>

                {/* Telegram Button */}
                <a
                  href={branding.telegramUrl || 'https://t.me/Peak_Deth'}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#229ED9]/10 hover:bg-[#229ED9]/20 border border-[#229ED9]/40 hover:border-[#229ED9]/80 text-[#38bdf8] hover:text-white text-xs font-bold shadow-sm hover:shadow-[0_0_15px_rgba(34,158,217,0.3)] transition-all active:scale-95 group cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current shrink-0 transition-transform group-hover:scale-110 text-[#229ED9] group-hover:text-white" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                  <span>Telegram {branding.telegramUsername || '@Peak_Deth'}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 3. ACCEPTED PAYMENTS & COPYRIGHT */}
        {/* ======================================================== */}
        <div className="border-t border-slate-900 pt-5 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* We Accept Payment Marks (Figma: width 326px, height 18px, gap 4px, opacity 1) */}
            <WeAcceptPayments />

            {/* Terms & Privacy Links */}
            <div className="flex items-center gap-3 text-[11px] text-slate-400">
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

          <p className="text-[11px] text-slate-500 text-center md:text-left">
            © {new Date().getFullYear()} {branding.storeName || 'Tin-TopUp'}. {t('footer_rights')}
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
