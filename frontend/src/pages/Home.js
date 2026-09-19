import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import GameSelection from '../components/GameSelection';
import EventBannerSlider from '../components/EventBannerSlider';

const Home = () => {
  const { t } = useLanguage();

  return (
    <div className="animate-fadeIn">
      

      {/* News of Event Game Banner Slider */}
      <section className="pt-5 sm:pt-7 pb-6 sm:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-3.5 px-1 font-khmer">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500/20 to-yellow-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center text-sm shadow-sm">
                📢
              </div>
              <h2 className="text-sm sm:text-base font-black text-white uppercase tracking-wider">
                {t('event_banner_title')}
              </h2>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/25 px-3 py-1 rounded-full shadow-sm hidden sm:inline-flex">
              <span>✨</span>
              <span>{t('event_banner_badge')}</span>
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
