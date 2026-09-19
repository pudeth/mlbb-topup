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
      <section className="pt-8 sm:pt-12 pb-6 sm:pb-8">
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
