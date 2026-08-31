import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';

const ScrollNavigator = () => {
  const { t } = useLanguage();
  const [scrollY, setScrollY] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const scrollTimeoutRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setMaxScroll(document.documentElement.scrollHeight - window.innerHeight);

      // Trigger text expansion when scrolling
      setIsScrolling(true);

      // Auto-hide text labels 1.6s after scroll stops
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 1600);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const scrollToHalfway = () => {
    const gamesSection = document.getElementById('games-section');
    if (gamesSection) {
      gamesSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    const halfway = document.documentElement.scrollHeight / 2;
    window.scrollTo({
      top: halfway - window.innerHeight / 3,
      behavior: 'smooth',
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  // Only render if page is scrollable
  if (maxScroll < 150) return null;

  // Section detector
  const isNearTop = scrollY < 250;
  const isNearBottom = scrollY >= maxScroll - 250;
  const isMiddle = !isNearTop && !isNearBottom;

  // Show text if currently scrolling OR hovered
  const showText = isScrolling || isHovered;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed top-1/2 -translate-y-1/2 right-2 sm:right-3.5 z-40 flex flex-col items-end gap-2 pointer-events-auto select-none transition-all"
    >
      {/* 1. SECTION 1: Banner Button (Visible ONLY when at Top) */}
      {isNearTop && (
        <div className="flex items-center gap-2 group animate-fadeIn">
          <span
            onClick={scrollToHalfway}
            className={`cursor-pointer px-2.5 py-1 rounded-xl text-[11px] font-black shadow-xl transition-all duration-300 bg-amber-500 text-slate-950 border border-amber-300 scale-105 shadow-glow-gold ${
              showText
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 translate-x-4 pointer-events-none'
            }`}
          >
            {t('nav_scroll_banner')}
          </span>
          <button
            onClick={scrollToHalfway}
            title={t('nav_scroll_banner')}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl transition-all flex items-center justify-center cursor-pointer shadow-md bg-gradient-to-b from-[#2a2414] to-[#141208] text-amber-300 border-2 border-amber-400 shadow-glow-gold hover:scale-110 active:scale-95"
            aria-label="1 - Banner"
          >
            <span className="text-sm font-black group-hover:translate-y-0.5 transition-transform">
              ▼
            </span>
          </button>
        </div>
      )}

      {/* 2. SECTION 2: Game TopUP Button (Visible ONLY when in Middle) */}
      {isMiddle && (
        <div className="flex items-center gap-2 group animate-fadeIn">
          <span
            onClick={scrollToTop}
            className={`cursor-pointer px-2.5 py-1 rounded-xl text-[11px] font-black shadow-xl transition-all duration-300 bg-cyan-500 text-slate-950 border border-cyan-300 scale-105 shadow-glow-cyan ${
              showText
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 translate-x-4 pointer-events-none'
            }`}
          >
            {t('nav_scroll_topup')}
          </span>
          <button
            onClick={scrollToTop}
            title={t('nav_scroll_topup')}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl transition-all flex items-center justify-center cursor-pointer shadow-md bg-gradient-to-b from-[#122838] to-[#081520] text-cyan-300 border-2 border-cyan-400 shadow-glow-cyan hover:scale-110 active:scale-95"
            aria-label="2 - Game TopUP"
          >
            <span className="text-sm font-black group-hover:-translate-y-0.5 transition-transform">
              ▲
            </span>
          </button>
        </div>
      )}

      {/* 3. SECTION 3: Footer / Connect Button (Visible ONLY when at Bottom) */}
      {isNearBottom && (
        <div className="flex items-center gap-2 group animate-fadeIn">
          <span
            onClick={scrollToTop}
            className={`cursor-pointer px-2.5 py-1 rounded-xl text-[11px] font-black shadow-xl transition-all duration-300 bg-purple-500 text-white border border-purple-300 scale-105 shadow-[0_0_15px_rgba(168,85,247,0.5)] ${
              showText
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 translate-x-4 pointer-events-none'
            }`}
          >
            {t('nav_scroll_footer')}
          </span>
          <button
            onClick={scrollToTop}
            title={t('nav_scroll_footer')}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl transition-all flex items-center justify-center cursor-pointer shadow-md bg-gradient-to-b from-[#2a1738] to-[#150a20] text-purple-300 border-2 border-purple-400 shadow-[0_0_18px_rgba(168,85,247,0.5)] hover:scale-110 active:scale-95"
            aria-label="3 - Footer / Connect"
          >
            <span className="text-sm font-black group-hover:-translate-y-0.5 transition-transform">
              ▲
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ScrollNavigator;
