import React from 'react';
import GameSelection from '../components/GameSelection';
import EventBannerSlider from '../components/EventBannerSlider';

const Home = () => {
  return (
    <div className="animate-fadeIn pb-0">
      {/* Hero Event Banner Slider */}
      <section className="pt-3 sm:pt-5 pb-1">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <EventBannerSlider />
        </div>
      </section>

      {/* Category Pills, 12 Popular Games Grid & Special Offers */}
      <GameSelection />
    </div>
  );
};

export default Home;
