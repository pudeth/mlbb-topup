import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const MobileBottomNav = () => {
  const location = useLocation();
  const { language } = useLanguage();

  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(0);
  const tickingRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!tickingRef.current) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const delta = currentScrollY - lastScrollYRef.current;

          // If scrolled down past 50px, hide smoothly
          if (delta > 8 && currentScrollY > 50) {
            setIsVisible(false);
          } else if (delta < -5 || currentScrollY <= 40) {
            // If scrolled up or near top, reveal immediately
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
  // Hide generic bottom nav on top-up pages to let dedicated sticky Pay Now action bar take over
  if (pathname.startsWith('/topup')) {
    return null;
  }
  const hash = location.hash;
  const isHome = pathname === '/' && !hash;
  const isAllGames = pathname === '/' && hash === '#games-section';
  const isPromo = pathname === '/' && hash === '#promotions';
  const isHistory = pathname === '/order-history';

  // 4 Tab labels matching screenshot
  const labelHome = language === 'km' ? 'ទំព័រដើម' : 'Home';
  const labelGames = language === 'km' ? 'ហ្គេម' : 'Games';
  const labelPromo = language === 'km' ? 'ប្រូម៉ូសិន' : 'Promos';
  const labelHistory = language === 'km' ? 'ប្រវត្តិ' : 'History';

  // Centered Floating Capsule Dock - Hidden on PC & Laptop (lg+), Visible on Mobile/Tablet
  return (
    <div
      style={{ bottom: 'calc(max(10px, env(safe-area-inset-bottom, 0px)) + 4px)' }}
      className={`lg:hidden fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] select-none font-khmer w-[94%] max-w-md ${
        isVisible ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-28 opacity-0 pointer-events-none'
      }`}
    >
      <nav className="relative flex items-center justify-between p-1.5 sm:p-2 bg-[#040816]/95 backdrop-blur-2xl border-2 border-[#0070ff] rounded-full shadow-[0_0_30px_rgba(0,112,255,0.45),0_15px_45px_rgba(0,0,0,0.95)] ring-1 ring-white/10 overflow-hidden">
        {/* Top Specular Sheen Highlight Line */}
        <div className="pointer-events-none absolute inset-x-8 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent shadow-[0_0_8px_#00e5ff]" />
        
        {/* Subtle Ambient Diagonal Glare */}
        <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-sky-500/[0.04] to-cyan-400/[0.12]" />

        {/* 1. Home */}
        <Link
          to="/"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`relative flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-full transition-all duration-300 cursor-pointer ${
            isHome
              ? 'bg-gradient-to-b from-[#0055ff]/75 via-[#0044ee]/55 to-[#0033cc]/75 border-2 border-[#00d0ff] shadow-[0_0_20px_rgba(0,180,255,0.7),inset_0_0_12px_rgba(0,180,255,0.35)]'
              : 'hover:bg-white/5 group text-slate-300 hover:text-white'
          }`}
        >
          <div className={`transition-all duration-300 ${isHome ? 'scale-105 text-[#00f0ff] drop-shadow-[0_0_12px_rgba(0,240,255,0.95)]' : 'text-slate-300 group-hover:text-white group-hover:scale-105 group-hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.5)]'}`}>
            <svg className="w-5.5 h-5.5 sm:w-6 sm:h-6 fill-current" viewBox="0 0 24 24">
              <path d="M12 3L2 12h3v8a1 1 0 001 1h4v-5a1 1 0 011-1h2a1 1 0 011 1v5h4a1 1 0 001-1v-8h3L12 3z"/>
            </svg>
          </div>
          <span className={`text-[11px] sm:text-xs mt-0.5 leading-tight tracking-wide transition-all ${isHome ? 'text-white font-bold drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]' : 'text-slate-300 font-semibold group-hover:text-white'}`}>
            {labelHome}
          </span>
          {isHome ? (
            <span className="w-5 sm:w-6 h-0.5 sm:h-1 rounded-full bg-[#00f0ff] shadow-[0_0_8px_#00f0ff] mt-0.5 animate-pulse" />
          ) : (
            <span className="w-5 sm:w-6 h-0.5 sm:h-1 rounded-full opacity-0 mt-0.5" />
          )}
        </Link>

        {/* 2. Games */}
        <Link
          to="/#games-section"
          onClick={() => {
            const el = document.getElementById('games-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className={`relative flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-full transition-all duration-300 cursor-pointer ${
            isAllGames
              ? 'bg-gradient-to-b from-[#0055ff]/75 via-[#0044ee]/55 to-[#0033cc]/75 border-2 border-[#00d0ff] shadow-[0_0_20px_rgba(0,180,255,0.7),inset_0_0_12px_rgba(0,180,255,0.35)]'
              : 'hover:bg-white/5 group text-slate-300 hover:text-white'
          }`}
        >
          <div className={`transition-all duration-300 ${isAllGames ? 'scale-105 text-[#00f0ff] drop-shadow-[0_0_12px_rgba(0,240,255,0.95)]' : 'text-slate-300 group-hover:text-white group-hover:scale-105 group-hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.5)]'}`}>
            <svg className="w-5.5 h-5.5 sm:w-6 sm:h-6 fill-current" viewBox="0 0 24 24">
              <path d="M17.5 7h-11A5.5 5.5 0 001 12.5c0 3.03 2.47 5.5 5.5 5.5 1.13 0 2.18-.34 3.05-.93L11.4 15.2c.36-.26.8-.4 1.25-.4h2.7c.45 0 .89.14 1.25.4l1.85 1.87c.87.59 1.92.93 3.05.93 3.03 0 5.5-2.47 5.5-5.5A5.5 5.5 0 0021.5 7h-4zm-11.5 7v1.5a.75.75 0 01-1.5 0V14h-1.5a.75.75 0 010-1.5H4V11a.75.75 0 011.5 0v1.5H7a.75.75 0 010 1.5H6zm11.5-2a1 1 0 110-2 1 1 0 010 2zm1.75 1.75a1 1 0 110-2 1 1 0 010 2zm-3.5 0a1 1 0 110-2 1 1 0 010 2zm1.75 1.75a1 1 0 110-2 1 1 0 010 2z"/>
            </svg>
          </div>
          <span className={`text-[11px] sm:text-xs mt-0.5 leading-tight tracking-wide transition-all ${isAllGames ? 'text-white font-bold drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]' : 'text-slate-300 font-semibold group-hover:text-white'}`}>
            {labelGames}
          </span>
          {isAllGames ? (
            <span className="w-5 sm:w-6 h-0.5 sm:h-1 rounded-full bg-[#00f0ff] shadow-[0_0_8px_#00f0ff] mt-0.5 animate-pulse" />
          ) : (
            <span className="w-5 sm:w-6 h-0.5 sm:h-1 rounded-full opacity-0 mt-0.5" />
          )}
        </Link>

        {/* 3. Promotions */}
        <Link
          to="/#promotions"
          onClick={() => {
            const el = document.getElementById('promotions');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className={`relative flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-full transition-all duration-300 cursor-pointer ${
            isPromo
              ? 'bg-gradient-to-b from-[#0055ff]/75 via-[#0044ee]/55 to-[#0033cc]/75 border-2 border-[#00d0ff] shadow-[0_0_20px_rgba(0,180,255,0.7),inset_0_0_12px_rgba(0,180,255,0.35)]'
              : 'hover:bg-white/5 group text-slate-300 hover:text-white'
          }`}
        >
          <div className={`transition-all duration-300 ${isPromo ? 'scale-105 text-[#00f0ff] drop-shadow-[0_0_12px_rgba(0,240,255,0.95)]' : 'text-slate-300 group-hover:text-white group-hover:scale-105 group-hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.5)]'}`}>
            <svg className="w-5.5 h-5.5 sm:w-6 sm:h-6 fill-current" viewBox="0 0 24 24">
              <path d="M19.5 8H17V6.5C17 4.57 15.43 3 13.5 3c-1.07 0-2.02.48-2.67 1.24A3.49 3.49 0 008.17 3C6.24 3 4.67 4.57 4.67 6.5V8H2.5C1.67 8 1 8.67 1 9.5V12c0 .83.67 1.5 1.5 1.5H3v7a2 2 0 002 2h14a2 2 0 002-2v-7h.5c.83 0 1.5-.67 1.5-1.5V9.5c0-.83-.67-1.5-1.5-1.5zM13.5 5c.83 0 1.5.67 1.5 1.5V8h-3V6.5c0-.83.67-1.5 1.5-1.5zM6.67 6.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5V8h-3V6.5zm4.33 14.5H5v-6h6v6zm0-8H3V10h8v3zm8 8h-6v-6h6v6zm1.5-8h-7.5V10H20v3z"/>
            </svg>
          </div>
          <span className={`text-[11px] sm:text-xs mt-0.5 leading-tight tracking-wide transition-all ${isPromo ? 'text-white font-bold drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]' : 'text-slate-300 font-semibold group-hover:text-white'}`}>
            {labelPromo}
          </span>
          {isPromo ? (
            <span className="w-5 sm:w-6 h-0.5 sm:h-1 rounded-full bg-[#00f0ff] shadow-[0_0_8px_#00f0ff] mt-0.5 animate-pulse" />
          ) : (
            <span className="w-5 sm:w-6 h-0.5 sm:h-1 rounded-full opacity-0 mt-0.5" />
          )}
        </Link>

        {/* 4. History */}
        <Link
          to="/order-history"
          className={`relative flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-full transition-all duration-300 cursor-pointer ${
            isHistory
              ? 'bg-gradient-to-b from-[#0055ff]/75 via-[#0044ee]/55 to-[#0033cc]/75 border-2 border-[#00d0ff] shadow-[0_0_20px_rgba(0,180,255,0.7),inset_0_0_12px_rgba(0,180,255,0.35)]'
              : 'hover:bg-white/5 group text-slate-300 hover:text-white'
          }`}
        >
          <div className={`transition-all duration-300 ${isHistory ? 'scale-105 text-[#00f0ff] drop-shadow-[0_0_12px_rgba(0,240,255,0.95)]' : 'text-slate-300 group-hover:text-white group-hover:scale-105 group-hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.5)]'}`}>
            <svg className="w-5.5 h-5.5 sm:w-6 sm:h-6 fill-current" viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h6.2a6.5 6.5 0 01-.2-1.5c0-1.8.74-3.43 1.94-4.6A6.47 6.47 0 0118.5 14c.7 0 1.38.11 2 .32V8l-6-6zm-1 6V3.5L18.5 8H13zM7 8h4a1 1 0 110 2H7a1 1 0 010-2zm0 4h5a1 1 0 110 2H7a1 1 0 110-2z" />
              <path d="M18.5 15a4.5 4.5 0 100 9 4.5 4.5 0 000-9zm.5 5h-1.5a.75.75 0 01-.75-.75v-2a.75.75 0 011.5 0v1.25H19a.75.75 0 010 1.5z" />
            </svg>
          </div>
          <span className={`text-[11px] sm:text-xs mt-0.5 leading-tight tracking-wide transition-all ${isHistory ? 'text-white font-bold drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]' : 'text-slate-300 font-semibold group-hover:text-white'}`}>
            {labelHistory}
          </span>
          {isHistory ? (
            <span className="w-5 sm:w-6 h-0.5 sm:h-1 rounded-full bg-[#00f0ff] shadow-[0_0_8px_#00f0ff] mt-0.5 animate-pulse" />
          ) : (
            <span className="w-5 sm:w-6 h-0.5 sm:h-1 rounded-full opacity-0 mt-0.5" />
          )}
        </Link>
      </nav>
    </div>
  );
  };

export default MobileBottomNav;
