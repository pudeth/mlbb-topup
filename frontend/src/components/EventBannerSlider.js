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

    fetchStoredBanners().then((cloudList) => {
      if (cloudList && cloudList.length > 0) syncBanners(cloudList);
    });

    const handleBannersUpdated = () => {
      const updated = getStoredBanners();
      syncBanners(updated);
    };

    window.addEventListener('eventBannersUpdated', handleBannersUpdated);
    window.addEventListener('storage', handleBannersUpdated);

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

  const handleNext = (e) => { if (e) e.stopPropagation(); setCurrentIndex((prev) => (prev + 1) % banners.length); };
  const handlePrev = (e) => { if (e) e.stopPropagation(); setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length); };

  const handleTouchStart = (e) => { touchStartXRef.current = e.targetTouches[0].clientX; };
  const handleTouchMove  = (e) => { touchEndXRef.current  = e.targetTouches[0].clientX; };
  const handleTouchEnd   = ()  => {
    if (!touchStartXRef.current || !touchEndXRef.current) return;
    const dist = touchStartXRef.current - touchEndXRef.current;
    if (dist > 50) handleNext(); else if (dist < -50) handlePrev();
    touchStartXRef.current = 0; touchEndXRef.current = 0;
  };

  if (!banners || banners.length === 0) return null;
  const currentBanner = banners[currentIndex] || banners[0];

  // Chamfered-corner clip-path that matches the inner shape of the neon frame
  const frameClip = `polygon(
    2.5% 14%, 4% 0%,
    96% 0%, 97.5% 14%,
    100% 16%, 100% 84%,
    97.5% 86%, 96% 100%,
    4% 100%, 2.5% 86%,
    0% 84%, 0% 16%
  )`;

  return (
    <div
      className={`relative w-full select-none cursor-pointer group ${className}`}
      style={{
        /* Ambient neon dual-tone glow matching the blue/red frame */
        filter: 'drop-shadow(0 0 18px rgba(0,200,255,0.35)) drop-shadow(0 0 28px rgba(220,30,80,0.22))',
      }}
      onMouseEnter={() => { setIsPaused(true);  setIsHovered(true);  }}
      onMouseLeave={() => { setIsPaused(false); setIsHovered(false); }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={(e) => {
        if (e.target.closest('button')) return;
        navigate(currentBanner.link || `/topup?game=${currentBanner.gameId || 'mlbb'}`);
      }}
    >
      {/* ── BANNER STAGE ─────────────────────────────────────────────────── */}
      <div className="relative w-full" style={{ aspectRatio: '21/9' }}>

        {/* ── Layer 0 · Dark base ── */}
        <div className="absolute inset-0 bg-[#050810] rounded-2xl" />

        {/* ── Layer 1 · Banner images clipped to frame inner shape ── */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: frameClip }}
        >
          {/* Subtle dark vignette always visible on edges */}
          <div className="absolute inset-0 z-10 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(5,8,16,0.7) 100%)' }}
          />

          {banners.map((banner, index) => {
            const isActive = index === currentIndex;
            return (
              <div
                key={banner.id || index}
                className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                  isActive ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-[1.03] z-0 pointer-events-none'
                }`}
              >
                <img
                  src={banner.image}
                  alt={banner.title}
                  onError={(e) => { e.target.onerror = null; e.target.src = banner.localFallbackImage || '/mlbb-logo.png'; }}
                  className="w-full h-full object-cover object-center"
                  style={{
                    filter: isActive ? 'brightness(1.05) saturate(1.1)' : 'brightness(0.9)',
                    transition: 'filter 0.6s ease',
                  }}
                />

                {/* Left gradient for text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#050810]/85 via-[#050810]/30 to-transparent pointer-events-none" />
                {/* Bottom gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050810]/70 via-transparent to-[#050810]/20 pointer-events-none" />
              </div>
            );
          })}

          {/* ── Content overlay ── */}
          <div className="absolute inset-0 z-20 flex flex-col justify-between p-4 sm:p-5 md:p-7 pointer-events-none">

            {/* Top row */}
            <div className="flex items-center justify-between gap-2 pointer-events-auto">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-black tracking-wider uppercase shadow-lg ${currentBanner.badgeColor || 'bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950'}`}>
                  {currentBanner.tag || 'SPECIAL EVENT'}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/70 border border-cyan-500/30 text-[10px] sm:text-xs text-cyan-300 font-bold backdrop-blur-md shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                  <span>Live Event</span>
                </span>
              </div>
              <div className="px-2.5 py-1 rounded-lg bg-slate-950/70 border border-slate-700/50 text-[10px] sm:text-xs font-mono text-slate-300 font-bold backdrop-blur-md">
                <span className="text-amber-400 font-black">{currentIndex + 1}</span>
                <span className="text-slate-500"> / {banners.length}</span>
              </div>
            </div>

            {/* Bottom row: title + button + dots */}
            <div className="flex items-end justify-between gap-3 pointer-events-auto">
              {/* Title block */}
              <div key={`text-${currentIndex}`} className="space-y-1 max-w-[60%]">
                <h3 className="text-sm sm:text-xl md:text-2xl lg:text-3xl font-black text-white tracking-tight leading-tight line-clamp-2 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                  {currentBanner.title}
                </h3>
                {currentBanner.subtitle && (
                  <p className="text-[10px] sm:text-xs text-slate-300 font-medium leading-relaxed line-clamp-2 drop-shadow-md">
                    {currentBanner.subtitle}
                  </p>
                )}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); navigate(currentBanner.link || `/topup?game=${currentBanner.gameId || 'mlbb'}`); }}
                  className="mt-1 sm:mt-2 py-1.5 px-3 sm:py-2 sm:px-4 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-slate-950 text-[10px] sm:text-xs font-black tracking-wide transition-all duration-200 cursor-pointer inline-flex items-center gap-1.5 shadow-lg shadow-amber-500/30 active:scale-95 hover:scale-105"
                >
                  <span>{currentBanner.buttonText || 'Top Up Now'}</span>
                  <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Slide dots */}
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-950/60 backdrop-blur-md px-2 py-1.5 rounded-full border border-slate-700/40 shadow-lg">
                  {banners.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                      className={`rounded-full transition-all duration-500 cursor-pointer ${
                        idx === currentIndex
                          ? 'w-5 sm:w-7 h-1.5 sm:h-2 bg-gradient-to-r from-cyan-400 to-blue-400 shadow-[0_0_8px_rgba(0,200,255,0.7)]'
                          : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-slate-600 hover:bg-slate-400'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Layer 2 · Neon frame overlay — on top of clipped image ── */}
        {/* screen blend: white bg of PNG disappears, neon colors glow over the image */}
        <img
          src="/banner-frame.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-fill z-30 pointer-events-none select-none"
          style={{ mixBlendMode: 'screen', opacity: 0.92 }}
        />

        {/* ── Layer 3 · Corner scan-line animation (subtle gaming HUD effect) ── */}
        <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-2xl" style={{ clipPath: frameClip }}>
          <div
            className="absolute left-0 right-0 h-px opacity-20"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(0,200,255,0.8), transparent)',
              animation: 'bannerScan 4s linear infinite',
              top: 0,
            }}
          />
        </div>

        {/* ── Prev/Next arrows ── */}
        {banners.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className={`absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-50 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-950/80 hover:bg-cyan-500/90 text-cyan-300 hover:text-white border border-cyan-500/40 hover:border-cyan-400 shadow-[0_0_12px_rgba(0,200,255,0.3)] hover:shadow-[0_0_20px_rgba(0,200,255,0.6)] backdrop-blur-md flex items-center justify-center transition-all duration-200 active:scale-90 cursor-pointer opacity-0 group-hover:opacity-100 hover:scale-110`}
              aria-label="Previous slide"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleNext}
              className={`absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-50 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-950/80 hover:bg-cyan-500/90 text-cyan-300 hover:text-white border border-cyan-500/40 hover:border-cyan-400 shadow-[0_0_12px_rgba(0,200,255,0.3)] hover:shadow-[0_0_20px_rgba(0,200,255,0.6)] backdrop-blur-md flex items-center justify-center transition-all duration-200 active:scale-90 cursor-pointer opacity-0 group-hover:opacity-100 hover:scale-110`}
              aria-label="Next slide"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* CSS keyframe for scan-line */}
      <style>{`
        @keyframes bannerScan {
          0%   { top: -2px; opacity: 0; }
          10%  { opacity: 0.25; }
          90%  { opacity: 0.25; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default EventBannerSlider;
