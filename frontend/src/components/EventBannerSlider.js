import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export const DEFAULT_EVENT_BANNERS = [
  {
    id: 'banner-1',
    tag: '🔥 ALLSTAR 2026 EVENT',
    title: 'Mobile Legends 515 ALLSTAR Special',
    subtitle: 'ទទួលបាន 220 💎 + 70 Aurora ⭐ លើរាល់ការទិញ Weekly Diamond Pass!',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    gameId: 'mlbb',
    buttonText: '⚡ Top Up MLBB Now',
    link: '/topup?game=mlbb',
    badgeColor: 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black',
    glowColor: 'shadow-[0_0_30px_rgba(251,191,36,0.35)]',
    status: 'Active',
    order: 1
  },
  {
    id: 'banner-2',
    tag: '👑 VIP PASS SALE',
    title: 'Twilight Pass & Starlight Pass 2026',
    subtitle: 'Unlock Exclusive Season Skins, Avatar Borders & 29x Draw Tickets!',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
    gameId: 'mlbb',
    buttonText: '👑 Get VIP Pass ($8.50)',
    link: '/topup?game=mlbb',
    badgeColor: 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white',
    glowColor: 'shadow-[0_0_30px_rgba(168,85,247,0.35)]',
    status: 'Active',
    order: 2
  },
  {
    id: 'banner-3',
    tag: '⚡ ROYALE PASS BONUS',
    title: 'PUBG Mobile UC Mega Season',
    subtitle: 'Fast 10-second automated delivery directly to your Character ID!',
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80',
    gameId: 'pubgm',
    buttonText: '🎯 Top Up UC Now',
    link: '/topup?game=pubgm',
    badgeColor: 'bg-gradient-to-r from-cyan-500 to-blue-500 text-black',
    glowColor: 'shadow-[0_0_30px_rgba(6,182,212,0.35)]',
    status: 'Active',
    order: 3
  },
  {
    id: 'banner-4',
    tag: '🎁 BOOYAH PASS',
    title: 'Free Fire Booyah Pass & Diamonds',
    subtitle: 'បញ្ចុះតម្លៃពិសេស ជាមួយប្រព័ន្ធស្វ័យប្រវត្តិ Bakong KHQR 0% Fee!',
    image: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=1200&q=80',
    gameId: 'freefire',
    buttonText: '🔥 Get Free Fire Pass',
    link: '/topup?game=freefire',
    badgeColor: 'bg-gradient-to-r from-rose-500 to-orange-500 text-white',
    glowColor: 'shadow-[0_0_30px_rgba(244,63,94,0.35)]',
    status: 'Active',
    order: 4
  }
];

export const getStoredBanners = () => {
  try {
    const saved = localStorage.getItem('admin_event_banners');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.filter(b => b.status !== 'Inactive');
      }
    }
  } catch (e) {}
  return DEFAULT_EVENT_BANNERS;
};

const EventBannerSlider = ({ className = '' }) => {
  const navigate = useNavigate();
  const [banners, setBanners] = useState(() => getStoredBanners());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef(0);
  const touchEndXRef = useRef(0);

  // Sync banners with admin updates in real-time
  useEffect(() => {
    const handleBannersUpdated = () => {
      const updated = getStoredBanners();
      setBanners(updated);
      if (currentIndex >= updated.length) {
        setCurrentIndex(0);
      }
    };

    window.addEventListener('eventBannersUpdated', handleBannersUpdated);
    window.addEventListener('storage', handleBannersUpdated);

    return () => {
      window.removeEventListener('eventBannersUpdated', handleBannersUpdated);
      window.removeEventListener('storage', handleBannersUpdated);
    };
  }, [currentIndex]);

  // Auto-advance timer (smooth 4.5s transition)
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
      className={`relative w-full overflow-hidden rounded-3xl border border-slate-800 bg-[#0B0F19] shadow-2xl group select-none transition-all ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Image with Smooth Crossfade */}
      <div className="relative aspect-[21/9] sm:aspect-[24/9] md:aspect-[3/1] min-h-[170px] sm:min-h-[220px] w-full overflow-hidden">
        {banners.map((banner, index) => (
          <div
            key={banner.id || index}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentIndex ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 pointer-events-none z-0'
            }`}
          >
            <img
              src={banner.image}
              alt={banner.title}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80';
              }}
              className="w-full h-full object-cover object-center filter brightness-[0.7] transform transition-transform duration-1000"
            />
            {/* Dynamic Glassmorphic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-black/30" />
          </div>
        ))}

        {/* Content Overlay */}
        <div className="absolute inset-0 z-20 flex flex-col justify-between p-4 sm:p-6 md:p-8">
          
          {/* Top Badge & Timer Dot */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-xl text-[10px] sm:text-xs font-black tracking-wide shadow-md uppercase truncate ${currentBanner.badgeColor || 'bg-amber-400 text-black'}`}>
                {currentBanner.tag || '🔥 SPECIAL EVENT'}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-900/80 border border-slate-700 text-[10px] text-slate-300 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live Event</span>
              </span>
            </div>

            {/* Slide Index Counter */}
            <div className="px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[10px] sm:text-xs font-mono text-slate-300 font-bold">
              {currentIndex + 1} / {banners.length}
            </div>
          </div>

          {/* Center / Bottom Title & Description */}
          <div className="space-y-1.5 sm:space-y-2 max-w-xl">
            <h3 className="text-base sm:text-2xl md:text-3xl font-black text-white leading-tight drop-shadow-md line-clamp-1">
              {currentBanner.title}
            </h3>
            <p className="text-[11px] sm:text-xs md:text-sm text-slate-200/90 font-medium leading-relaxed drop-shadow line-clamp-2 max-w-lg">
              {currentBanner.subtitle}
            </p>
          </div>

          {/* Bottom Action Bar */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => navigate(currentBanner.link || `/topup?game=${currentBanner.gameId || 'mlbb'}`)}
              className="py-1.5 px-3.5 sm:py-2.5 sm:px-5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 text-xs sm:text-sm font-black tracking-wide shadow-glow-gold hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>{currentBanner.buttonText || '⚡ Top Up Now'}</span>
              <span>›</span>
            </button>

            {/* Navigation Indicators / Dots */}
            <div className="flex items-center gap-1.5">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIndex(idx);
                  }}
                  className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentIndex
                      ? 'w-6 sm:w-8 bg-amber-400 shadow-glow-gold'
                      : 'w-1.5 sm:w-2 bg-slate-600/70 hover:bg-slate-400'
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
            className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm shadow-md cursor-pointer"
            aria-label="Previous slide"
          >
            ‹
          </button>
        )}

        {/* Right Arrow Button */}
        {banners.length > 1 && (
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm shadow-md cursor-pointer"
            aria-label="Next slide"
          >
            ›
          </button>
        )}
      </div>
    </div>
  );
};

export default EventBannerSlider;
