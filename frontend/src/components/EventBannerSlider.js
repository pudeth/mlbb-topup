import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DEFAULT_EVENT_BANNERS,
  getStoredBanners,
  fetchStoredBanners
} from '../services/eventBanners';
import cyberBannerFrame from '../assets/cyber-banner-frame.png';
import bannerCutoutMask from '../assets/banner-cutout-mask.png';

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
    setIsHovered((prev) => !prev);
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
      className={`relative w-full group select-none transition-all duration-300 cursor-pointer ${className}`}
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
      {/* Ambient Cyber Neon Under-Glow (Cyan on Left, Magenta-Red on Right) */}
      <div className="absolute -inset-1 sm:-inset-2 bg-gradient-to-r from-cyan-500/20 via-blue-500/10 to-rose-500/20 blur-xl opacity-60 group-hover:opacity-85 transition-opacity duration-500 pointer-events-none" />

      {/* Main Container with Exact Aspect Ratio of the Cyber Frame (1024 / 423) */}
      <div 
        className="relative w-full"
        style={{ aspectRatio: '1024 / 423' }}
      >
        {/* Pixel-Perfect Confined Artwork Layer - Masked strictly to the Cyber Frame inner viewport */}
        <div
          className="absolute inset-0"
          style={{
            WebkitMaskImage: `url(${bannerCutoutMask || '/banner-cutout-mask.png'})`,
            WebkitMaskSize: '100% 100%',
            WebkitMaskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            maskImage: `url(${bannerCutoutMask || '/banner-cutout-mask.png'})`,
            maskSize: '100% 100%',
            maskRepeat: 'no-repeat',
            maskPosition: 'center',
            zIndex: 5
          }}
        >
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
                    className="w-full h-full object-cover object-center filter brightness-[0.98] group-hover:brightness-[0.9] transition-all duration-500"
                  />
                </div>

                {/* Cinematic Contrast Gradient for readable typography */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent transition-opacity duration-300 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 transition-opacity duration-300 pointer-events-none" />
              </div>
            );
          })}
        </div>

        {/* Content Overlay (Badges, Titles, Buttons) positioned gracefully inside the frame */}
        <div
          className="absolute flex flex-col justify-between pointer-events-none"
          style={{
            top: '12%',
            bottom: '14%',
            left: '5.5%',
            right: '5.5%',
            zIndex: 20
          }}
        >
          {/* Top Header / Badges */}
          <div
            key={`badge-${currentIndex}`}
            className="flex items-center justify-between gap-2 pointer-events-auto transition-transform duration-300"
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
            className="space-y-1 sm:space-y-1.5 max-w-xl pointer-events-auto font-khmer transition-transform duration-300"
          >
            <h3 className="text-base sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-tight line-clamp-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              {currentBanner.title}
            </h3>
            {currentBanner.subtitle && (
              <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed line-clamp-2 max-w-lg drop-shadow-md">
                {currentBanner.subtitle}
              </p>
            )}
          </div>

          {/* Bottom Action & Controls */}
          <div className="flex items-center justify-between pt-1 pointer-events-auto">
            <button
              key={`btn-${currentIndex}`}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate(currentBanner.link || `/topup?game=${currentBanner.gameId || 'mlbb'}`);
              }}
              className="py-1.5 px-3.5 sm:py-2.5 sm:px-5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-slate-950 text-xs sm:text-sm font-black tracking-wide transition-all duration-300 cursor-pointer flex items-center gap-2 shadow-lg shadow-amber-500/25 active:scale-95 group/btn"
            >
              <span>{currentBanner.buttonText || 'Top Up Now'}</span>
              <svg className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Indicator Dots */}
            <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-950/70 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-slate-800/70 shadow-lg ml-auto">
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

        {/* Futuristic Cyber Esports Overlay Frame (Guaranteed Top Layer - Covers edges flawlessly) */}
        <img
          src={cyberBannerFrame || '/cyber-banner-frame.png'}
          alt="Cyber Frame"
          className="absolute inset-0 w-full h-full object-fill select-none filter drop-shadow-[0_0_16px_rgba(6,182,212,0.45)] pointer-events-none"
          style={{ zIndex: 15 }}
          onError={(e) => {
            if (e.target.src !== `${process.env.PUBLIC_URL || ''}/cyber-banner-frame.png`) {
              e.target.src = `${process.env.PUBLIC_URL || ''}/cyber-banner-frame.png`;
            }
          }}
        />

        {/* Left Arrow Button */}
        {banners.length > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            style={{ zIndex: 25 }}
            className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-950/80 hover:bg-amber-400 text-white hover:text-slate-950 border border-slate-700/80 hover:border-amber-300 shadow-2xl backdrop-blur-md flex items-center justify-center transition-all duration-300 active:scale-90 cursor-pointer group-hover:scale-105"
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
            style={{ zIndex: 25 }}
            className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-950/80 hover:bg-amber-400 text-white hover:text-slate-950 border border-slate-700/80 hover:border-amber-300 shadow-2xl backdrop-blur-md flex items-center justify-center transition-all duration-300 active:scale-90 cursor-pointer group-hover:scale-105"
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
