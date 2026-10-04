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

  return (
    <>
      {/* Centered Floating Capsule Dock - Hidden on PC & Laptop (lg+), Visible on Mobile/Tablet */}
      <div
        className={`lg:hidden fixed bottom-2.5 sm:bottom-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] select-none font-khmer w-[94%] max-w-md ${
          isVisible ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-28 opacity-0 pointer-events-none'
        }`}
      >
        <nav className="relative flex items-center justify-around py-2 px-2 bg-[#090f1e]/90 backdrop-blur-2xl border border-sky-500/35 rounded-full shadow-[0_15px_40px_rgba(0,0,0,0.9),0_0_20px_rgba(14,165,233,0.18)] ring-1 ring-white/10">
          
          {/* 1. Home */}
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex-1 flex flex-col items-center justify-center py-1 transition-all duration-200 group relative cursor-pointer"
          >
            <div className={`transition-all duration-300 ${isHome ? 'scale-115 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.85)]' : 'text-slate-400 group-hover:text-slate-200'}`}>
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
            </div>
            <span className={`text-[10px] sm:text-[11px] mt-0.5 leading-tight tracking-tight transition-colors ${isHome ? 'text-cyan-400 font-black' : 'text-slate-400 font-semibold group-hover:text-slate-200'}`}>
              {labelHome}
            </span>
            {isHome && (
              <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,1)] animate-pulse" />
            )}
          </Link>

          {/* 2. Games */}
          <Link
            to="/#games-section"
            onClick={() => {
              const el = document.getElementById('games-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex-1 flex flex-col items-center justify-center py-1 transition-all duration-200 group relative cursor-pointer"
          >
            <div className={`transition-all duration-300 ${isAllGames ? 'scale-115 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.85)]' : 'text-slate-400 group-hover:text-slate-200'}`}>
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
              </svg>
            </div>
            <span className={`text-[10px] sm:text-[11px] mt-0.5 leading-tight tracking-tight transition-colors ${isAllGames ? 'text-cyan-400 font-black' : 'text-slate-400 font-semibold group-hover:text-slate-200'}`}>
              {labelGames}
            </span>
            {isAllGames && (
              <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,1)] animate-pulse" />
            )}
          </Link>

          {/* 3. Promotions */}
          <Link
            to="/#promotions"
            onClick={() => {
              const el = document.getElementById('promotions');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex-1 flex flex-col items-center justify-center py-1 transition-all duration-200 group relative cursor-pointer"
          >
            <div className={`transition-all duration-300 ${isPromo ? 'scale-115 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.85)]' : 'text-slate-400 group-hover:text-slate-200'}`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V3m0 5l-4-4m4 4l4-4M3 8h18v13a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
              </svg>
            </div>
            <span className={`text-[10px] sm:text-[11px] mt-0.5 leading-tight tracking-tight transition-colors ${isPromo ? 'text-cyan-400 font-black' : 'text-slate-400 font-semibold group-hover:text-slate-200'}`}>
              {labelPromo}
            </span>
            {isPromo && (
              <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,1)] animate-pulse" />
            )}
          </Link>

          {/* 4. History */}
          <Link
            to="/order-history"
            className="flex-1 flex flex-col items-center justify-center py-1 transition-all duration-200 group relative cursor-pointer"
          >
            <div className={`transition-all duration-300 ${isHistory ? 'scale-115 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.85)]' : 'text-slate-400 group-hover:text-slate-200'}`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <span className={`text-[10px] sm:text-[11px] mt-0.5 leading-tight tracking-tight transition-colors ${isHistory ? 'text-cyan-400 font-black' : 'text-slate-400 font-semibold group-hover:text-slate-200'}`}>
              {labelHistory}
            </span>
            {isHistory && (
              <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,1)] animate-pulse" />
            )}
          </Link>
        </nav>
      </div>

      {/* Floating Headset Support Button at Bottom-Right (Only on larger screens so mobile dock is clean) */}
      <div className="hidden lg:block fixed bottom-4 right-4 z-40">
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
