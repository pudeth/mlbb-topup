import React from 'react';
import GameSelection from '../components/GameSelection';
import EventBannerSlider from '../components/EventBannerSlider';

const Home = () => {
  return (
    <div className="animate-fadeIn pb-0">
      {/* Hero Event Banner Slider */}
      <section className="pt-2 sm:pt-4 pb-0.5">
        <div className="max-w-6xl mx-auto px-2.5 sm:px-6 lg:px-8">
          <EventBannerSlider />
        </div>
      </section>

      {/* Category Pills, 12 Popular Games Grid & Special Offers */}
      <GameSelection />
    </div>
  );
};

export default Home;
