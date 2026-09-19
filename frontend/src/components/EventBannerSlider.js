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

    // 3. Periodic cloud polling (every 4s) so smartphone changes appear on desktop & clients automatically
    const pollInterval = setInterval(() => {
      fetchStoredBanners().then((cloudList) => {
        if (cloudList && cloudList.length > 0) syncBanners(cloudList);
      });
    }, 4000);

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
      className={`relative w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-800/80 bg-slate-900 group select-none transition-colors ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Banner Canvas Area */}
      <div className="relative aspect-[21/9] sm:aspect-[24/9] md:aspect-[3/1] min-h-[190px] sm:min-h-[230px] md:min-h-[270px] w-full overflow-hidden">
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
                  className="w-full h-full object-cover object-center filter brightness-[0.88]"
                />
              </div>
              {/* Clean, Non-murky Linear Contrast Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/75 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-black/20" />
            </div>
          );
        })}

        {/* Content Overlay */}
        <div className="absolute inset-0 z-20 flex flex-col justify-between p-4 sm:p-6 md:p-8 pointer-events-none">
          
          {/* Top Header / Badges */}
          <div 
            key={`badge-${currentIndex}`}
            className="flex items-center justify-between gap-2 pointer-events-auto animate-banner-badge"
          >
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-black tracking-wider uppercase shadow-md ${currentBanner.badgeColor || 'bg-amber-400 text-slate-950'}`}>
                {currentBanner.tag || 'SPECIAL EVENT'}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-700/60 text-[10px] sm:text-xs text-slate-300 font-bold backdrop-blur-md shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live Event</span>
              </span>
            </div>

            {/* Slide Index Counter */}
            <div className="px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-700/60 text-[10px] sm:text-xs font-mono text-slate-300 font-bold backdrop-blur-md shadow-sm">
              <span className="text-amber-400 font-black">{currentIndex + 1}</span> / {banners.length}
            </div>
          </div>

          {/* Center / Typography Area */}
          <div 
            key={`text-${currentIndex}`}
            className="space-y-1.5 sm:space-y-2 max-w-xl pointer-events-auto animate-banner-text font-khmer"
          >
            <h3 className="text-base sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-tight line-clamp-1 drop-shadow-md">
              {currentBanner.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed line-clamp-2 max-w-lg drop-shadow">
              {currentBanner.subtitle}
            </p>
          </div>

          {/* Bottom Action & Controls */}
          <div className="flex items-center justify-between pt-2 pointer-events-auto">
            <button
              key={`btn-${currentIndex}`}
              type="button"
              onClick={() => navigate(currentBanner.link || `/topup?game=${currentBanner.gameId || 'mlbb'}`)}
              className="py-2 px-4 sm:py-2.5 sm:px-5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-slate-950 text-xs sm:text-sm font-black tracking-wide transition-all duration-200 cursor-pointer flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 group animate-banner-btn"
            >
              <span>{currentBanner.buttonText || 'Top Up Now'}</span>
              <svg className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Indicator Dots */}
            <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-950/60 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-slate-800/80">
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
                      ? 'w-6 sm:w-8 bg-gradient-to-r from-amber-400 to-yellow-300 shadow-[0_0_10px_rgba(251,191,36,0.6)]'
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
            className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-950/75 hover:bg-amber-400 text-white hover:text-slate-950 border border-slate-700/80 hover:border-amber-300 shadow-2xl backdrop-blur-md flex items-center justify-center transition-all duration-300 active:scale-90 cursor-pointer sm:opacity-0 sm:group-hover:opacity-100 hover:scale-110"
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
            className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-950/75 hover:bg-amber-400 text-white hover:text-slate-950 border border-slate-700/80 hover:border-amber-300 shadow-2xl backdrop-blur-md flex items-center justify-center transition-all duration-300 active:scale-90 cursor-pointer sm:opacity-0 sm:group-hover:opacity-100 hover:scale-110"
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
