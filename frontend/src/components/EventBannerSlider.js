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
    buttonText: 'Top Up MLBB Now',
    link: '/topup?game=mlbb',
    badgeColor: 'bg-amber-400 text-slate-950',
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
    buttonText: 'Get VIP Pass ($8.50)',
    link: '/topup?game=mlbb',
    badgeColor: 'bg-indigo-500 text-white',
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
    buttonText: 'Top Up UC Now',
    link: '/topup?game=pubgm',
    badgeColor: 'bg-cyan-400 text-slate-950',
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
    buttonText: 'Get Free Fire Pass',
    link: '/topup?game=freefire',
    badgeColor: 'bg-rose-500 text-white',
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
      <div className="relative aspect-[21/9] sm:aspect-[24/9] md:aspect-[3/1] min-h-[180px] sm:min-h-[220px] w-full overflow-hidden">
        {banners.map((banner, index) => (
          <div
            key={banner.id || index}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
            }`}
          >
            <img
              src={banner.image}
              alt={banner.title}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80';
              }}
              className="w-full h-full object-cover object-center filter brightness-90"
            />
            {/* Clean, Non-murky Linear Contrast Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/75 to-slate-950/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
          </div>
        ))}

        {/* Content Overlay */}
        <div className="absolute inset-0 z-20 flex flex-col justify-between p-4 sm:p-6 md:p-8">
          
          {/* Top Header / Badges */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-bold tracking-wider uppercase truncate ${currentBanner.badgeColor || 'bg-amber-400 text-slate-950'}`}>
                {currentBanner.tag || 'SPECIAL EVENT'}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-700/60 text-[10px] sm:text-xs text-slate-300 font-medium backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Live Event</span>
              </span>
            </div>

            {/* Slide Index Counter */}
            <div className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-700/60 text-[10px] sm:text-xs font-mono text-slate-400 font-medium backdrop-blur-sm">
              <span className="text-white font-bold">{currentIndex + 1}</span> / {banners.length}
            </div>
          </div>

          {/* Center / Typography Area */}
          <div className="space-y-1.5 sm:space-y-2 max-w-xl">
            <h3 className="text-base sm:text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight line-clamp-1">
              {currentBanner.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed line-clamp-2 max-w-lg">
              {currentBanner.subtitle}
            </p>
          </div>

          {/* Bottom Action & Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => navigate(currentBanner.link || `/topup?game=${currentBanner.gameId || 'mlbb'}`)}
              className="py-2 px-4 sm:py-2.5 sm:px-5 rounded-xl bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 cursor-pointer flex items-center gap-2"
            >
              <span>{currentBanner.buttonText || 'Top Up Now'}</span>
              <span className="text-base leading-none">›</span>
            </button>

            {/* Indicator Dots */}
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
                      ? 'w-6 sm:w-8 bg-amber-400'
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
            className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-950/70 hover:bg-slate-900 text-slate-200 hover:text-white border border-slate-700/60 flex items-center justify-center text-base sm:text-lg font-medium opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm cursor-pointer"
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
            className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-950/70 hover:bg-slate-900 text-slate-200 hover:text-white border border-slate-700/60 flex items-center justify-center text-base sm:text-lg font-medium opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm cursor-pointer"
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
