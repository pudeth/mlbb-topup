import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useStoreBranding } from '../services/storeBranding';

const MobileBottomNav = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const { branding } = useStoreBranding();

  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(0);
  const tickingRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!tickingRef.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const delta = currentScrollY - lastScrollYRef.current;

          // If scrolled down more than 8px and past header: hide
          if (delta > 8 && currentScrollY > 70) {
            setIsVisible(false);
          } 
          // If scrolled up more than 6px or near top: show
          else if (delta < -6 || currentScrollY <= 60) {
            setIsVisible(true);
          }

          lastScrollYRef.current = currentScrollY;
          tickingRef.current = false;
        });
        tickingRef.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const pathname = location.pathname;
  const search = location.search;

  const isHome = pathname === '/';
  const isTopUp = pathname === '/topup';
  const isSupport = pathname === '/support';

  return (
    <div
      className={`mobile-bottom-nav lg:hidden fixed bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-[420px] transition-all duration-300 ease-out select-none ${
        isVisible
          ? 'translate-y-0 opacity-100 pointer-events-auto'
          : 'translate-y-24 opacity-0 pointer-events-none'
      }`}
    >
      {/* Floating Dark Pill Dock matching reference image */}
      <nav className="bg-[#181a20]/95 backdrop-blur-2xl border border-slate-700/60 rounded-full px-3 py-2 flex items-center justify-between shadow-[0_10px_35px_rgba(0,0,0,0.8)] ring-1 ring-white/10">
        
        {/* 1. Home Tab */}
        <Link
          to="/"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`relative flex items-center justify-center transition-all duration-200 ${
            isHome
              ? 'w-11 h-11 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 shadow-glow-gold scale-105'
              : 'w-10 h-10 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/60 active:scale-90'
          }`}
          title={t('nav_home')}
          aria-label="Home"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
        </Link>

        {/* 3. Community / All Games Tab */}
        <Link
          to="/#games-section"
          onClick={() => {
            const el = document.getElementById('games-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="w-10 h-10 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/60 active:scale-90 flex items-center justify-center transition-all"
          title="All Games Catalog"
          aria-label="Games"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
          </svg>
        </Link>

        {/* 4. Store / Top-Up Diamonds Tab */}
        <Link
          to="/topup"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`relative flex items-center justify-center transition-all duration-200 ${
            isTopUp
              ? 'w-11 h-11 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 shadow-glow-gold scale-105'
              : 'w-10 h-10 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/60 active:scale-90'
          }`}
          title={t('nav_topup')}
          aria-label="Shop"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z" />
          </svg>
        </Link>

        {/* 5. Support / Notification Bell Tab */}
        <Link
          to="/support"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`relative flex items-center justify-center transition-all duration-200 ${
            isSupport
              ? 'w-11 h-11 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 text-white shadow-glow-purple scale-105'
              : 'w-10 h-10 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/60 active:scale-90'
          }`}
          title={t('nav_support')}
          aria-label="Support"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
          </svg>
        </Link>

        {/* 6. Profile Avatar with Blue Ring Border matching image */}
        <a
          href="https://t.me/Peak_Deth"
          target="_blank"
          rel="noreferrer"
          className="relative group p-0.5 active:scale-90 transition-transform"
          title="Direct Telegram Profile: @Peak_Deth"
          aria-label="Profile"
        >
          <div className="w-9 h-9 rounded-full ring-2 ring-blue-500 ring-offset-2 ring-offset-[#181a20] overflow-hidden bg-slate-900 shadow-md flex items-center justify-center">
            {branding.logoImage ? (
              <img
                src={branding.logoImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs font-black text-white">💎</span>
            )}
          </div>
          {/* Online green dot */}
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#181a20] rounded-full"></span>
        </a>
      </nav>
    </div>
  );
};

export default MobileBottomNav;
