import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DEFAULT_EVENT_BANNERS,
  getStoredBanners,
  fetchStoredBanners
} from '../services/eventBanners';

export { DEFAULT_EVENT_BANNERS, getStoredBanners };

const EventBannerSlider = ({ className = '' }) => {
  const navigate = useNavigate();
  const [banners, setBanners] = useState(() => getStoredBanners());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartXRef = useRef(0);
  const touchEndXRef = useRef(0);

  // Sync banners with cloud MongoDB & admin updates across all devices in real-time
  useEffect(() => {
    let isMounted = true;

    const syncBanners = (list) => {
      if (!isMounted || !Array.isArray(list) || list.length === 0) return;
      setBanners(list);
      setCurrentIndex((prev) => (prev >= list.length ? 0 : prev));
    };

    // 1. Initial cloud fetch
    fetchStoredBanners().then((cloudList) => {
      if (cloudList && cloudList.length > 0) syncBanners(cloudList);
    });

    // 2. Event listeners for instant local changes
    const handleBannersUpdated = () => {
      const updated = getStoredBanners();
      syncBanners(updated);
    };

    window.addEventListener('eventBannersUpdated', handleBannersUpdated);
    window.addEventListener('storage', handleBannersUpdated);

    // 3. Periodic cloud polling (every 30s) so changes appear automatically without network spam
    const pollInterval = setInterval(() => {
      fetchStoredBanners().then((cloudList) => {
        if (cloudList && cloudList.length > 0) syncBanners(cloudList);
      });
    }, 30000);

    return () => {
      isMounted = false;
      window.removeEventListener('eventBannersUpdated', handleBannersUpdated);
      window.removeEventListener('storage', handleBannersUpdated);
      clearInterval(pollInterval);
    };
  }, []);

  // Auto-advance timer
  useEffect(() => {
    if (banners.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [banners.length, isPaused]);

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartXRef.current || !touchEndXRef.current) return;
    const distance = touchStartXRef.current - touchEndXRef.current;
    if (distance > 50) {
      handleNext();
    } else if (distance < -50) {
      handlePrev();
    }
    touchStartXRef.current = 0;
    touchEndXRef.current = 0;
  };

  if (!banners || banners.length === 0) return null;

  const currentBanner = banners[currentIndex] || banners[0];

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-800/80 bg-slate-950 group select-none transition-all duration-300 cursor-pointer shadow-2xl ${className}`}
      onMouseEnter={() => {
        setIsPaused(true);
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsPaused(false);
        setIsHovered(false);
      }}
      onTouchStart={(e) => {
        setIsHovered((prev) => !prev);
        handleTouchStart(e);
      }}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={(e) => {
        if (e.target.closest('button')) return;
        navigate(currentBanner.link || `/topup?game=${currentBanner.gameId || 'mlbb'}`);
      }}
    >
      {/* Banner Canvas Area */}
      <div className="relative aspect-[16/10] sm:aspect-[21/9] md:aspect-[24/9] min-h-[190px] sm:min-h-[230px] md:min-h-[270px] w-full overflow-hidden">
        {banners.map((banner, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={banner.id || index}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <div className={`w-full h-full ${isActive ? 'animate-zoom-out' : ''}`}>
                <img
                  src={banner.image}
                  alt={banner.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = banner.localFallbackImage || '/mlbb-logo.png';
                  }}
                  className="w-full h-full object-cover object-center filter brightness-[0.98] group-hover:brightness-[0.92] transition-all duration-500"
                />
              </div>

              {/* Subtle Cinematic Contrast Gradient */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-[#070b18]/60 via-transparent to-transparent pointer-events-none"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#060a14]/85 via-transparent to-black/20 pointer-events-none"
              />
            </div>
          );
        })}

        {/* Content Overlay */}
        <div className="absolute inset-0 z-20 flex flex-col justify-between p-3.5 sm:p-6 md:p-8 pointer-events-none">
          
          {/* Top Header / Badges (Hidden by default, reveals on hover) */}
          <div 
            key={`badge-${currentIndex}`}
            className={`flex items-center justify-between gap-2 pointer-events-auto transition-all duration-300 ${
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[9px] sm:text-xs font-black tracking-wider uppercase shadow-md ${currentBanner.badgeColor || 'bg-amber-400 text-slate-950'}`}>
                {currentBanner.tag || 'SPECIAL EVENT'}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-700/60 text-[10px] sm:text-xs text-slate-300 font-bold backdrop-blur-md shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live Event</span>
              </span>
            </div>

            {/* Slide Index Counter */}
            <div className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-slate-950/80 border border-slate-700/60 text-[9px] sm:text-xs font-mono text-slate-300 font-bold backdrop-blur-md shadow-sm">
              <span className="text-amber-400 font-black">{currentIndex + 1}</span> / {banners.length}
            </div>
          </div>

          {/* Center / Typography Area (Hidden by default, reveals on hover) */}
          <div 
            key={`text-${currentIndex}`}
            className={`space-y-1 sm:space-y-2 max-w-xl pointer-events-auto font-khmer my-auto transition-all duration-300 ${
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0'
            }`}
          >
            <div className="bg-slate-950/75 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-white/10 shadow-2xl inline-block max-w-lg">
              <h3 className="text-base sm:text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight line-clamp-2 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                {currentBanner.title}
              </h3>
              {currentBanner.subtitle && (
                <p className="text-[10px] sm:text-xs md:text-sm text-sky-200/90 font-medium leading-relaxed line-clamp-2 mt-1 drop-shadow-md">
                  {currentBanner.subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Bottom Row: CTA Button (KEPT VISIBLE AT ALL TIMES) & Pagination Dots */}
          <div className="flex items-center justify-between pt-1 pointer-events-auto z-30">
            {/* Action CTA Button - KEPT VISIBLE AT ALL TIMES as requested */}
            <button
              key={`btn-${currentIndex}`}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate(currentBanner.link || `/topup?game=${currentBanner.gameId || 'mlbb'}`);
              }}
              className="py-1.5 px-3.5 sm:py-2.5 sm:px-5 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 text-[10.5px] sm:text-xs md:text-sm font-black tracking-wide transition-all duration-300 cursor-pointer inline-flex items-center gap-1.5 shadow-[0_4px_20px_rgba(251,191,36,0.5)] active:scale-95 group/btn hover:scale-105"
            >
              <span>🎮</span>
              <span>{currentBanner.buttonText || 'ចាប់លេងឥឡូវនេះ'}</span>
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-transform duration-200 group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>

            {/* Bottom Pagination Dots */}
            <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-950/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-800/80 shadow-lg">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(idx);
                  }}
                  className={`h-1.5 sm:h-2 rounded-full transition-all duration-500 cursor-pointer ${
                    idx === currentIndex
                      ? 'w-5 sm:w-7 bg-gradient-to-r from-cyan-400 to-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.7)]'
                      : 'w-1.5 sm:w-2 bg-slate-700 hover:bg-slate-500'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Left Arrow Button */}
        {banners.length > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-950/75 hover:bg-amber-400 text-white hover:text-slate-950 border border-slate-700/80 hover:border-amber-300 shadow-2xl backdrop-blur-md flex items-center justify-center transition-all duration-300 active:scale-90 cursor-pointer hover:scale-110 opacity-80 hover:opacity-100"
            aria-label="Previous slide"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Right Arrow Button */}
        {banners.length > 1 && (
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-950/75 hover:bg-amber-400 text-white hover:text-slate-950 border border-slate-700/80 hover:border-amber-300 shadow-2xl backdrop-blur-md flex items-center justify-center transition-all duration-300 active:scale-90 cursor-pointer hover:scale-110 opacity-80 hover:opacity-100"
            aria-label="Next slide"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default EventBannerSlider;
