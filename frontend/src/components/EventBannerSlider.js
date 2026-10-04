import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  const [prevIndex, setPrevIndex] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartXRef = useRef(0);
  const touchEndXRef = useRef(0);

  const goToSlide = useCallback((nextIndex) => {
    setCurrentIndex((prev) => {
      if (nextIndex === prev) return prev;
      setPrevIndex(prev);
      return nextIndex;
    });
  }, []);

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

  // Auto-advance timer with zoom out transition
  useEffect(() => {
    if (banners.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      goToSlide((currentIndex + 1) % banners.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [banners.length, isPaused, currentIndex, goToSlide]);

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    goToSlide((currentIndex + 1) % banners.length);
  };

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    goToSlide((currentIndex - 1 + banners.length) % banners.length);
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
      className={`relative w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-800/80 hover:border-amber-400/40 bg-slate-950 group select-none transition-all duration-300 cursor-pointer shadow-[0_12px_40px_-10px_rgba(0,0,0,0.85)] hover:shadow-[0_16px_50px_rgba(245,158,11,0.2)] ${className}`}
      onMouseEnter={() => {
        setIsPaused(true);
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsPaused(false);
        setIsHovered(false);
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={(e) => {
        if (e.target.closest('button')) return;
        navigate(currentBanner.link || `/topup?game=${currentBanner.gameId || 'mlbb'}`);
      }}
    >
      {/* Banner Canvas Area with Cinematic Zoom Out Transition */}
      <div className="relative aspect-[16/10] sm:aspect-[21/9] md:aspect-[24/9] min-h-[190px] sm:min-h-[230px] md:min-h-[270px] w-full overflow-hidden">
        {banners.map((banner, index) => {
          const isActive = index === currentIndex;
          const isExiting = index === prevIndex && prevIndex !== null;

          if (!isActive && !isExiting) {
            return (
              <div
                key={banner.id || index}
                className="absolute inset-0 opacity-0 pointer-events-none z-0"
              />
            );
          }

          return (
            <div
              key={`${banner.id || index}-${isActive ? `active-${currentIndex}` : 'exit'}`}
              className={`absolute inset-0 overflow-hidden ${
                isActive
                  ? 'opacity-100 z-10 pointer-events-auto animate-zoom-out'
                  : 'z-0 pointer-events-none animate-zoom-out-exit'
              }`}
            >
              <div className="w-full h-full">
                <img
                  src={banner.image}
                  alt={banner.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = banner.localFallbackImage || '/mlbb-logo.png';
                  }}
                  className="w-full h-full object-cover object-center filter brightness-[1.02] contrast-[1.02]"
                />
              </div>

              {/* Clean Cinematic Edge Vignettes - leaving center 100% vibrant & unblocked */}
              <div className="absolute top-0 inset-x-0 h-16 sm:h-20 bg-gradient-to-b from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-0 inset-x-0 h-28 sm:h-36 bg-gradient-to-t from-slate-950/95 via-slate-950/35 to-transparent pointer-events-none" />
            </div>
          );
        })}

        {/* Content Overlay */}
        <div className="absolute inset-0 z-20 flex flex-col justify-between p-3.5 sm:p-5 md:p-6 pointer-events-none">
          
          {/* Top Header / Badges */}
          <div 
            key={`badge-${currentIndex}`}
            className="flex items-center justify-between gap-2 pointer-events-auto transition-all duration-300"
          >
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-lg text-[9px] sm:text-xs font-black tracking-wider uppercase shadow-md flex items-center gap-1.5 ${currentBanner.badgeColor || 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950'}`}>
                <span>⚡</span>
                <span>{currentBanner.tag || 'SPECIAL EVENT'}</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/75 border border-white/10 text-[10px] sm:text-xs text-slate-300 font-bold backdrop-blur-md shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live Event</span>
              </span>
            </div>

            {/* Slide Index Counter */}
            <div className="px-2.5 py-1 rounded-lg bg-slate-950/75 border border-white/10 text-[10px] sm:text-xs font-mono text-slate-300 font-bold backdrop-blur-md shadow-sm">
              <span className="text-amber-400 font-black">{currentIndex + 1}</span>
              <span className="text-slate-500 mx-1">/</span>
              <span>{banners.length}</span>
            </div>
          </div>

          {/* Center / Typography Area (Subtle reveal on desktop hover to avoid blocking banner artwork) */}
          <div 
            key={`text-${currentIndex}`}
            className={`space-y-1 sm:space-y-2 max-w-xl pointer-events-auto font-khmer my-auto transition-all duration-300 ${
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
            }`}
          >
            <div className="bg-slate-950/80 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-white/10 shadow-2xl inline-block max-w-lg">
              <h3 className="text-base sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-tight line-clamp-2 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                {currentBanner.title}
              </h3>
              {currentBanner.subtitle && (
                <p className="text-[10px] sm:text-xs md:text-sm text-sky-200/90 font-medium leading-relaxed line-clamp-2 mt-1 drop-shadow-md">
                  {currentBanner.subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Bottom Row: CTA Button & Pagination Dots */}
          <div className="flex items-center justify-between pt-1 pointer-events-auto z-30">
            {/* Action CTA Button */}
            <button
              key={`btn-${currentIndex}`}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate(currentBanner.link || `/topup?game=${currentBanner.gameId || 'mlbb'}`);
              }}
              className="btn-gold h-8 sm:h-9.5 px-3.5 sm:px-5 rounded-full text-slate-950 text-[11px] sm:text-xs md:text-sm font-black tracking-wide inline-flex items-center gap-2 shadow-[0_4px_18px_rgba(245,158,11,0.5)] active:scale-95 group/btn cursor-pointer transition-all hover:scale-105"
            >
              <span className="text-xs sm:text-sm">🎮</span>
              <span>{currentBanner.buttonText || 'ចាប់លេងឥឡូវនេះ'}</span>
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-transform duration-200 group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>

            {/* Bottom Pagination Dots */}
            <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-950/75 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/10 shadow-lg">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToSlide(idx);
                  }}
                  className={`rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentIndex
                      ? 'w-5 sm:w-7 h-1.5 sm:h-2 bg-gradient-to-r from-amber-400 to-yellow-300 shadow-[0_0_8px_rgba(251,191,36,0.8)]'
                      : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/30 hover:bg-white/60'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Left Arrow Button (Hidden on mobile to keep artwork clean & unblocked) */}
        {banners.length > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            className="hidden sm:flex absolute left-3 md:left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-slate-950/65 hover:bg-amber-400 text-white hover:text-slate-950 border border-white/15 hover:border-amber-300 shadow-2xl backdrop-blur-md items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-90 cursor-pointer -translate-x-2 group-hover:translate-x-0"
            aria-label="Previous slide"
          >
            <svg className="w-5 h-5 -ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Desktop Right Arrow Button (Hidden on mobile to keep artwork clean & unblocked) */}
        {banners.length > 1 && (
          <button
            type="button"
            onClick={handleNext}
            className="hidden sm:flex absolute right-3 md:right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-slate-950/65 hover:bg-amber-400 text-white hover:text-slate-950 border border-white/15 hover:border-amber-300 shadow-2xl backdrop-blur-md items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-90 cursor-pointer translate-x-2 group-hover:translate-x-0"
            aria-label="Next slide"
          >
            <svg className="w-5 h-5 -mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Bottom Animated Auto-Advance Progress Bar */}
        {banners.length > 1 && (
          <div className="absolute bottom-0 inset-x-0 h-[2.5px] bg-slate-900/60 z-30 overflow-hidden pointer-events-none">
            <div
              key={`progress-${currentIndex}-${isPaused}`}
              className={`h-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 origin-left ${
                isPaused ? 'w-full opacity-40' : 'animate-banner-progress'
              }`}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EventBannerSlider;
