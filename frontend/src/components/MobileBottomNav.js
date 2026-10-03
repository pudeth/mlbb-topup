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

          if (delta > 10 && currentScrollY > 80) {
            setIsVisible(false);
          } else if (delta < -8 || currentScrollY <= 60) {
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
  const isPromo = pathname === '/' && location.hash === '#promotions';
  const isHistory = pathname === '/order-history';
  const isSupport = pathname === '/support';

  // 5 Tab labels matching screenshot
  const labelHome = language === 'km' ? 'ទំព័រដើម' : 'Home';
  const labelGames = language === 'km' ? 'ហ្គេម' : 'Games';
  const labelPromo = language === 'km' ? 'ប្រូម៉ូសិន' : 'Promos';
  const labelHistory = language === 'km' ? 'ប្រវត្តិ' : 'History';
  const labelSupport = language === 'km' ? 'ជំនួយ' : 'Support';

  return (
    <>
      {/* Centered Floating Pill Dock matching screenshot */}
      <div
        className={`fixed bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-out select-none pointer-events-auto font-khmer ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'
        }`}
      >
        <nav className="inline-flex items-center gap-1 sm:gap-1.5 p-1.5 bg-[#0a1020]/95 backdrop-blur-2xl border border-slate-700/80 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.85)] ring-1 ring-white/10">
          
          {/* 1. Home */}
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`h-9 px-3 sm:px-3.5 rounded-full flex items-center justify-center gap-1.5 whitespace-nowrap text-xs font-bold transition-all duration-200 ${
              isHome
                ? 'bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 text-white font-black shadow-[0_0_15px_rgba(37,99,235,0.45)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40 active:scale-95'
            }`}
          >
            <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M12 3L4 9.5V20c0 .55.45 1 1 1h4.5v-6h5v6H19c.55 0 1-.45 1-1V9.5L12 3z" />
            </svg>
            <span className="text-[11px] sm:text-xs font-extrabold tracking-tight">{labelHome}</span>
          </Link>

          {/* 2. All Games */}
          <Link
            to="/#games-section"
            onClick={() => {
              const el = document.getElementById('games-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`h-9 px-3 sm:px-3.5 rounded-full flex items-center justify-center gap-1.5 whitespace-nowrap text-xs font-bold transition-all duration-200 ${
              isAllGames
                ? 'bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 text-white font-black shadow-[0_0_15px_rgba(37,99,235,0.45)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40 active:scale-95'
            }`}
          >
            <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M4 4h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 10h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 16h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4z"/>
            </svg>
            <span className="text-[11px] sm:text-xs font-extrabold tracking-tight">{labelGames}</span>
          </Link>

          {/* 3. Promotions */}
          <Link
            to="/#promotions"
            onClick={() => {
              const el = document.getElementById('promotions');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`h-9 px-3 sm:px-3.5 rounded-full flex items-center justify-center gap-1.5 whitespace-nowrap text-xs font-bold transition-all duration-200 ${
              isPromo
                ? 'bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 text-white font-black shadow-[0_0_15px_rgba(37,99,235,0.45)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40 active:scale-95'
            }`}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V3m0 5l-4-4m4 4l4-4M3 8h18v13a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
            </svg>
            <span className="text-[11px] sm:text-xs font-extrabold tracking-tight">{labelPromo}</span>
          </Link>

          {/* 4. History / Transaction */}
          <Link
            to="/order-history"
            className={`h-9 px-3 sm:px-3.5 rounded-full flex items-center justify-center gap-1.5 whitespace-nowrap text-xs font-bold transition-all duration-200 ${
              isHistory
                ? 'bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 text-white font-black shadow-[0_0_15px_rgba(37,99,235,0.45)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40 active:scale-95'
            }`}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <span className="text-[11px] sm:text-xs font-extrabold tracking-tight">{labelHistory}</span>
          </Link>

          {/* 5. Support */}
          <Link
            to="/support"
            className={`h-9 px-3 sm:px-3.5 rounded-full flex items-center justify-center gap-1.5 whitespace-nowrap text-xs font-bold transition-all duration-200 ${
              isSupport
                ? 'bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 text-white font-black shadow-[0_0_15px_rgba(37,99,235,0.45)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/40 active:scale-95'
            }`}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" />
            </svg>
            <span className="text-[11px] sm:text-xs font-extrabold tracking-tight">{labelSupport}</span>
          </Link>
        </nav>
      </div>

      {/* Floating Headset Support Button at Bottom-Right matching screenshot */}
      <div className="fixed bottom-4 right-4 z-40">
        <Link
          to="/support"
          title="24/7 Live Support"
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-blue-600 via-sky-500 to-indigo-600 text-white flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.5)] hover:scale-110 active:scale-95 transition-all cursor-pointer ring-2 ring-sky-400/50"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" />
          </svg>
        </Link>
      </div>
    </>
  );
};

export default MobileBottomNav;
