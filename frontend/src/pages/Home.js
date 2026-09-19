import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import GameSelection from '../components/GameSelection';
import EventBannerSlider from '../components/EventBannerSlider';

const Home = () => {
  const { t } = useLanguage();

  return (
    <div className="animate-fadeIn">
      {/* Hero Section (Desktop Only - Hidden on Mobile) */}
      <section className="hidden lg:block relative overflow-hidden pt-8 sm:pt-12 pb-16 sm:pb-20 border-b border-slate-800">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-cyan-500/15 via-blue-600/10 to-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
            
            {/* Left Hero Text */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs font-bold text-cyan-300 shadow-glow-cyan">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                <span>{t('hero_badge')}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
                {t('hero_title_1')}{' '}
                <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
                  {t('hero_title_highlight')}
                </span>{' '}
                {t('hero_title_2')}
              </h1>

              <p className="text-slate-300 text-sm sm:text-base lg:text-lg max-w-2xl leading-relaxed">
                {t('hero_desc')}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 sm:gap-4 pt-2">
                <Link
                  to="/topup"
                  className="btn btn-gold text-sm sm:text-base px-8 py-3.5 sm:py-4 rounded-2xl shadow-glow-gold hover:scale-105 transition-all w-full sm:w-auto font-black uppercase tracking-wider"
                >
                  ⚡ {t('hero_btn_topup')}
                </Link>
                <Link
                  to="/support"
                  className="btn btn-secondary text-xs sm:text-sm px-6 py-3.5 sm:py-4 rounded-2xl w-full sm:w-auto font-semibold"
                >
                  🎧 {t('hero_btn_support')}
                </Link>
              </div>

              {/* Trust Metric Chips */}
              <div className="pt-5 sm:pt-6 grid grid-cols-3 gap-3 sm:gap-4 border-t border-slate-800/80">
                <div>
                  <div className="text-xl sm:text-3xl font-black text-cyan-400">10s</div>
                  <div className="text-[10px] sm:text-[11px] text-slate-400 font-semibold uppercase">{t('hero_stat_delivery')}</div>
                </div>
                <div>
                  <div className="text-xl sm:text-3xl font-black text-amber-400">100k+</div>
                  <div className="text-[10px] sm:text-[11px] text-slate-400 font-semibold uppercase">{t('hero_stat_orders')}</div>
                </div>
                <div>
                  <div className="text-xl sm:text-3xl font-black text-emerald-400">4.9/5 ⭐</div>
                  <div className="text-[10px] sm:text-[11px] text-slate-400 font-semibold uppercase">{t('hero_stat_trust')}</div>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Banner (Hidden on Mobile) */}
            <div className="hidden lg:block lg:col-span-5 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-amber-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-60 transition-opacity duration-700"></div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-slate-800/50">
                <img
                  src="/mlbb-logo.png"
                  alt="Mobile Legends Banner"
                  className="w-full h-[380px] object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent pointer-events-none"></div>
                
                {/* Banner Content Overlay */}
                <div className="absolute bottom-0 left-0 w-full p-8">
                  <span className="inline-block px-3 py-1 bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-widest rounded-full mb-3 shadow-lg">Official Integration</span>
                  <h3 className="text-2xl font-black text-white mb-2 leading-tight drop-shadow-md">Instant Delivery System</h3>
                  <p className="text-slate-300 text-sm font-medium drop-shadow">Top up your diamonds directly using ABA KHQR in seconds.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News of Event Game Banner Slider */}
      <section className="py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg">📢</span>
              <h2 className="text-sm sm:text-lg font-black text-white uppercase tracking-wider">
                {t('event_banner_title')}
              </h2>
            </div>
            <span className="text-[10px] sm:text-xs text-amber-400 font-bold hidden sm:inline">
              {t('event_banner_badge')}
            </span>
          </div>

          <EventBannerSlider />
        </div>
      </section>

      {/* Customer Game Selection Section */}
      <GameSelection />
    </div>
  );
};

export default Home;
