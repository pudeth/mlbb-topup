import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DEFAULT_EVENT_BANNERS,
  getStoredBanners,
  fetchStoredBanners
} from '../services/eventBanners';

export { DEFAULT_EVENT_BANNERS, getStoredBanners };

/* ─── Keyframe animations injected once ─── */
const STYLE_ID = 'banner-slider-styles';
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    @keyframes bannerGlowPulse {
      0%,100% {
        filter: drop-shadow(0 0 14px rgba(0,200,255,0.45))
                drop-shadow(0 0 10px rgba(220,38,38,0.30));
      }
      50% {
        filter: drop-shadow(0 0 28px rgba(0,200,255,0.80))
                drop-shadow(0 0 20px rgba(220,38,38,0.55));
      }
    }
    @keyframes scanlines {
      0%   { background-position: 0 0; }
      100% { background-position: 0 100px; }
    }
    @keyframes cornerPulse {
      0%,100% { opacity: 0.55; transform: scale(1); }
      50%      { opacity: 1;    transform: scale(1.18); }
    }
    @keyframes edgeFlicker {
      0%,100% { opacity: 0.55; }
      45%      { opacity: 0.85; }
      50%      { opacity: 0.30; }
      55%      { opacity: 0.85; }
    }
    .banner-frame-img {
      animation: bannerGlowPulse 3s ease-in-out infinite;
    }
    .banner-corner { animation: cornerPulse 2.5s ease-in-out infinite; }
    .banner-corner:nth-child(2) { animation-delay: 0.6s; }
    .banner-corner:nth-child(3) { animation-delay: 1.2s; }
    .banner-corner:nth-child(4) { animation-delay: 1.8s; }
    .banner-edge-left  { animation: edgeFlicker 4s ease-in-out infinite; }
    .banner-edge-right { animation: edgeFlicker 4s ease-in-out infinite 1s; }
  `;
  document.head.appendChild(style);
}

const EventBannerSlider = ({ className = '' }) => {
  const navigate = useNavigate();
  const [banners, setBanners] = useState(() => getStoredBanners());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartXRef = useRef(0);
  const touchEndXRef = useRef(0);

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
    const handleBannersUpdated = () => syncBanners(getStoredBanners());
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

  useEffect(() => {
    if (banners.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [banners.length, isPaused]);

  const handleNext = (e) => { if (e) e.stopPropagation(); setCurrentIndex((prev) => (prev + 1) % banners.length); };
  const handlePrev = (e) => { if (e) e.stopPropagation(); setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length); };

  const handleTouchStart = (e) => { touchStartXRef.current = e.targetTouches[0].clientX; setIsHovered((p) => !p); };
  const handleTouchMove  = (e) => { touchEndXRef.current = e.targetTouches[0].clientX; };
  const handleTouchEnd   = () => {
    if (!touchStartXRef.current || !touchEndXRef.current) return;
    const d = touchStartXRef.current - touchEndXRef.current;
    if (d > 50) handleNext(); else if (d < -50) handlePrev();
    touchStartXRef.current = 0; touchEndXRef.current = 0;
  };

  if (!banners || banners.length === 0) return null;
  const currentBanner = banners[currentIndex] || banners[0];

  return (
    <div
      className={`relative w-full select-none cursor-pointer group ${className}`}
      onMouseEnter={() => { setIsPaused(true); setIsHovered(true); }}
      onMouseLeave={() => { setIsPaused(false); setIsHovered(false); }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={(e) => {
        if (e.target.closest('button')) return;
        navigate(currentBanner.link || `/topup?game=${currentBanner.gameId || 'mlbb'}`);
      }}
    >
      {/* ══ LAYER 1 — Banner image, clipped to mask shape ══ */}
      <div
        className="relative aspect-[21/9] sm:aspect-[24/9] md:aspect-[3/1] min-h-[190px] sm:min-h-[230px] md:min-h-[270px] w-full overflow-hidden"
        style={{
          WebkitMaskImage: 'url(/banner-mask.png)',
          maskImage: 'url(/banner-mask.png)',
          WebkitMaskSize: '100% 100%',
          maskSize: '100% 100%',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskPosition: 'center',
        }}
      >
        {/* Base dark fill */}
        <div className="absolute inset-0 bg-slate-950" />

        {/* Slides */}
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
                  onError={(e) => { e.target.onerror = null; e.target.src = banner.localFallbackImage || '/mlbb-logo.png'; }}
                  className="w-full h-full object-cover object-center brightness-[0.95] group-hover:brightness-[0.82] transition-all duration-500"
                />
              </div>

              {/* Color-matched inner edge glows to blend with the frame */}
              <div className="banner-edge-left absolute inset-y-0 left-0 w-10 sm:w-16 pointer-events-none"
                style={{ background: 'linear-gradient(to right, rgba(0,200,255,0.22), transparent)' }} />
              <div className="banner-edge-right absolute inset-y-0 right-0 w-10 sm:w-16 pointer-events-none"
                style={{ background: 'linear-gradient(to left, rgba(220,38,38,0.22), transparent)' }} />

              {/* Scanline HUD effect */}
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.04]"
                style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.8) 0px, rgba(255,255,255,0.8) 1px, transparent 1px, transparent 4px)',
                  animation: 'scanlines 8s linear infinite',
                }}
              />

              {/* Cinematic gradients on hover */}
              <div className={`absolute inset-0 bg-gradient-to-r from-slate-950/88 via-slate-950/55 to-transparent pointer-events-none transition-opacity duration-400 ${isHovered ? 'opacity-100' : 'opacity-0'} group-hover:opacity-100`} />
              <div className={`absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 pointer-events-none transition-opacity duration-400 ${isHovered ? 'opacity-100' : 'opacity-0'} group-hover:opacity-100`} />
            </div>
          );
        })}

        {/* ── LAYER 2 — Content overlay ── */}
        <div className="absolute inset-0 z-20 flex flex-col justify-between p-4 sm:p-6 md:p-8 pointer-events-none">

          {/* Top: badge + counter */}
          <div
            key={`badge-${currentIndex}`}
            className={`flex items-center justify-between gap-2 pointer-events-auto transition-all duration-300 ease-out ${
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'
            } group-hover:opacity-100 group-hover:translate-y-0`}
          >
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-black tracking-wider uppercase shadow-md ${currentBanner.badgeColor || 'bg-amber-400 text-slate-950'}`}>
                {currentBanner.tag || 'SPECIAL EVENT'}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/80 border border-cyan-500/30 text-[10px] sm:text-xs text-cyan-300 font-bold backdrop-blur-md shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live Event</span>
              </span>
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-700/60 text-[10px] sm:text-xs font-mono text-slate-300 font-bold backdrop-blur-md shadow-sm">
              <span className="text-amber-400 font-black">{currentIndex + 1}</span> / {banners.length}
            </div>
          </div>

          {/* Middle: title + subtitle */}
          <div
            key={`text-${currentIndex}`}
            className={`space-y-1 sm:space-y-2 max-w-xl pointer-events-auto font-khmer transition-all duration-300 ease-out ${
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            } group-hover:opacity-100 group-hover:translate-y-0`}
          >
            <h3 className="text-base sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-tight line-clamp-1 drop-shadow-xl">
              {currentBanner.title}
            </h3>
            {currentBanner.subtitle && (
              <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed line-clamp-2 max-w-lg drop-shadow-md">
                {currentBanner.subtitle}
              </p>
            )}
          </div>

          {/* Bottom: CTA + dots */}
          <div className="flex items-center justify-between pt-2 pointer-events-auto">
            <button
              key={`btn-${currentIndex}`}
              type="button"
              onClick={(e) => { e.stopPropagation(); navigate(currentBanner.link || `/topup?game=${currentBanner.gameId || 'mlbb'}`); }}
              className={`py-2 px-4 sm:py-2.5 sm:px-5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-slate-950 text-xs sm:text-sm font-black tracking-wide transition-all duration-300 cursor-pointer flex items-center gap-2 shadow-lg shadow-amber-500/30 active:scale-95 group/btn ${
                isHovered ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-3 pointer-events-none'
              } group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto`}
            >
              <span>{currentBanner.buttonText || 'Top Up Now'}</span>
              <svg className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-950/50 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-slate-800/70 shadow-lg ml-auto opacity-75 group-hover:opacity-100 transition-opacity duration-300">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
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

        {/* Prev arrow */}
        {banners.length > 1 && (
          <button type="button" onClick={handlePrev}
            className={`absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-950/75 hover:bg-cyan-500 text-white hover:text-slate-950 border border-cyan-500/40 hover:border-cyan-300 shadow-[0_0_12px_rgba(0,200,255,0.4)] backdrop-blur-md flex items-center justify-center transition-all duration-300 active:scale-90 cursor-pointer hover:scale-110 ${isHovered ? 'opacity-100' : 'opacity-0'} group-hover:opacity-100`}
            aria-label="Previous slide"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Next arrow */}
        {banners.length > 1 && (
          <button type="button" onClick={handleNext}
            className={`absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-950/75 hover:bg-red-500 text-white hover:text-white border border-red-500/40 hover:border-red-400 shadow-[0_0_12px_rgba(220,38,38,0.4)] backdrop-blur-md flex items-center justify-center transition-all duration-300 active:scale-90 cursor-pointer hover:scale-110 ${isHovered ? 'opacity-100' : 'opacity-0'} group-hover:opacity-100`}
            aria-label="Next slide"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
      {/* END masked area */}

      {/* ══ LAYER 3 — Sci-fi frame PNG on top ══ */}
      <img
        src="/banner-frame.png"
        alt=""
        aria-hidden="true"
        className="banner-frame-img absolute inset-0 w-full h-full object-fill z-40 pointer-events-none select-none"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* ══ LAYER 4 — Animated corner accent dots ══ */}
      {/* Top-left */}
      <div className="banner-corner absolute top-[4%] left-[2%] z-50 pointer-events-none">
        <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_3px_rgba(0,200,255,0.9)]" />
      </div>
      {/* Top-right */}
      <div className="banner-corner absolute top-[4%] right-[2%] z-50 pointer-events-none">
        <div className="w-2 h-2 rounded-full bg-red-400 shadow-[0_0_8px_3px_rgba(220,38,38,0.9)]" />
      </div>
      {/* Bottom-left */}
      <div className="banner-corner absolute bottom-[4%] left-[2%] z-50 pointer-events-none">
        <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_3px_rgba(0,200,255,0.9)]" />
      </div>
      {/* Bottom-right */}
      <div className="banner-corner absolute bottom-[4%] right-[2%] z-50 pointer-events-none">
        <div className="w-2 h-2 rounded-full bg-red-400 shadow-[0_0_8px_3px_rgba(220,38,38,0.9)]" />
      </div>
    </div>
  );
};

export default EventBannerSlider;
