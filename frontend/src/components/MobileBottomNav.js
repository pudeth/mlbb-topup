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
  const isHome = pathname === '/' && !location.hash;
  const isAllGames = pathname === '/' && location.hash === '#games-section';
  const isTopUp = pathname === '/topup';

  // Crisp, clean 1-word labels to prevent text wrapping
  const labelHome = language === 'km' ? 'ទំព័រដើម' : language === 'zh' ? '首页' : 'Home';
  const labelGames = language === 'km' ? 'ហ្គេម' : language === 'zh' ? '游戏' : 'Games';
  const labelTopUp = language === 'km' ? 'បញ្ចូល' : language === 'zh' ? '充值' : 'Top Up';

  return (
    <div
      className={`mobile-bottom-nav lg:hidden fixed bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-out select-none pointer-events-auto ${
        isVisible
          ? 'translate-y-0 opacity-100'
          : 'translate-y-24 opacity-0 pointer-events-none'
      }`}
    >
      {/* Sleek Fitted Segmented Dock - Ultra Clean UI */}
      <nav className="inline-flex items-center gap-1.5 p-1.5 bg-[#0e1322]/95 backdrop-blur-2xl border border-slate-700/80 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.85)] ring-1 ring-white/10">
        
        {/* 1. Home */}
        <Link
          to="/"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`h-9 px-3.5 sm:px-4 rounded-full flex items-center justify-center gap-1.5 whitespace-nowrap text-xs font-bold transition-all duration-200 ${
            isHome
              ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 text-slate-950 font-black shadow-[0_2px_14px_rgba(251,191,36,0.45)]'
              : 'text-slate-300/80 hover:text-white hover:bg-slate-800/40 active:scale-95'
          }`}
          aria-label="Home"
        >
          <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
            <path d="M12 3L4 9.5V20c0 .55.45 1 1 1h4.5v-6h5v6H19c.55 0 1-.45 1-1V9.5L12 3z" />
          </svg>
          <span className="text-[12px] font-extrabold tracking-tight leading-none">{labelHome}</span>
        </Link>

        {/* 2. All Games */}
        <Link
          to="/#games-section"
          onClick={() => {
            const el = document.getElementById('games-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className={`h-9 px-3.5 sm:px-4 rounded-full flex items-center justify-center gap-1.5 whitespace-nowrap text-xs font-bold transition-all duration-200 ${
            isAllGames
              ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 text-slate-950 font-black shadow-[0_2px_14px_rgba(251,191,36,0.45)]'
              : 'text-slate-300/80 hover:text-white hover:bg-slate-800/40 active:scale-95'
          }`}
          aria-label="All Games"
        >
          <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
            <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
          </svg>
          <span className="text-[12px] font-extrabold tracking-tight leading-none">{labelGames}</span>
        </Link>

        {/* 3. Top Up */}
        <Link
          to="/topup"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`h-9 px-3.5 sm:px-4 rounded-full flex items-center justify-center gap-1.5 whitespace-nowrap text-xs font-bold transition-all duration-200 ${
            isTopUp
              ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-400 text-slate-950 font-black shadow-[0_2px_14px_rgba(251,191,36,0.45)]'
              : 'text-slate-300/80 hover:text-white hover:bg-slate-800/40 active:scale-95'
          }`}
          aria-label="Top Up"
        >
          <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
            <path d="M12 2L3 9l9 13 9-13-9-7zm0 3.3l6.2 4.7H5.8L12 5.3z" />
          </svg>
          <span className="text-[12px] font-extrabold tracking-tight leading-none">{labelTopUp}</span>
        </Link>
      </nav>
    </div>
  );
};

export default MobileBottomNav;
