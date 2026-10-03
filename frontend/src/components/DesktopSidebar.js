import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const DesktopSidebar = () => {
  const location = useLocation();
  const { language } = useLanguage();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/' && !location.hash;
    if (path.includes('#')) {
      const [p, hash] = path.split('#');
      return (location.pathname === p || (p === '/' && location.pathname === '/')) && location.hash === `#${hash}`;
    }
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const navItems = [
    {
      id: 'home',
      label: language === 'km' ? 'ទំព័រដើម' : 'Home',
      sub: 'Home',
      path: '/',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      id: 'games',
      label: language === 'km' ? 'ហ្គេមទាំងអស់' : 'All Games',
      sub: 'All Games',
      path: '/#games-section',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4 4h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 10h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 16h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4z"/>
        </svg>
      )
    },
    {
      id: 'telegram',
      label: 'Telegram Stars',
      sub: 'Instant API',
      path: '/topup?service=telegram_stars',
      icon: (
        <svg className="w-4 h-4 text-sky-400" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .37z"/>
        </svg>
      )
    },
    {
      id: 'steam',
      label: 'Steam',
      sub: 'Steam CIS & Gift',
      path: '/topup?service=steam',
      icon: (
        <svg className="w-4 h-4 text-slate-300" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.979 0C5.642 0 .467 4.908.024 11.144l6.741 2.783c.567-.384 1.25-.615 1.986-.615.158 0 .313.013.465.034l3.414-4.947c-.01-.064-.02-.13-.02-.196 0-2.43 1.975-4.405 4.405-4.405s4.405 1.975 4.405 4.405-1.975 4.405-4.405 4.405c-.066 0-.131-.01-.195-.02l-4.947 3.414c.021.152.034.307.034.465 0 1.942-1.574 3.516-3.516 3.516-1.637 0-3.008-1.12-3.398-2.637L.341 14.88C1.724 20.088 6.471 24 12.021 24c6.627 0 12-5.373 12-12s-5.373-12-12.042-12zM8.751 16.59c-.93 0-1.684.754-1.684 1.684 0 .93.754 1.684 1.684 1.684.93 0 1.684-.754 1.684-1.684 0-.93-.754-1.684-1.684-1.684zm8.264-10.457c-1.332 0-2.412 1.08-2.412 2.412s1.08 2.412 2.412 2.412 2.412-1.08 2.412-2.412-1.08-2.412-2.412-2.412z"/>
        </svg>
      )
    },
    {
      id: 'promo',
      label: language === 'km' ? 'ប្រូម៉ូសិន' : 'Promotions',
      sub: 'Special Deals',
      path: '/#promotions',
      icon: (
        <svg className="w-4 h-4 text-pink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V3m0 5l-4-4m4 4l4-4M3 8h18v13a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
        </svg>
      )
    },
    {
      id: 'tx',
      label: language === 'km' ? 'ប្រវត្តិប្រតិបត្តិការ' : 'Transaction',
      sub: 'Order History',
      path: '/order-history',
      icon: (
        <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      )
    },
    {
      id: 'support',
      label: language === 'km' ? 'ជំនួយ' : 'Support',
      sub: 'Help & 24/7',
      path: '/support',
      icon: (
        <svg className="w-4 h-4 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" />
        </svg>
      )
    }
  ];

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-60 xl:w-64 bg-[#080d1a]/95 backdrop-blur-2xl border-r border-slate-800/80 z-40 flex-col justify-between p-3.5 select-none overflow-y-auto scrollbar-none font-khmer">
      {/* Top Brand Logo Section */}
      <div className="space-y-4">
        <Link to="/" className="flex items-center gap-3 px-2 py-1.5 rounded-2xl hover:bg-slate-800/40 transition-all group">
          <div className="relative w-11 h-11 rounded-2xl p-0.5 bg-gradient-to-tr from-cyan-400 via-blue-500 to-amber-400 shadow-[0_0_15px_rgba(56,189,248,0.4)] shrink-0 group-hover:scale-105 transition-transform">
            <img
              src="https://res.cloudinary.com/dpz7vpmf8/image/upload/v1790944800/logo-game/ovdfdmru7jnhmwjvy6vy.jpg"
              alt="Tin-Topup PRO"
              className="w-full h-full object-cover rounded-[14px]"
              onError={(e) => {
                e.target.src = '/mlbb-logo.png';
              }}
            />
            <span className="absolute -bottom-1 -right-1 text-[8px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded-full shadow-sm">
              PRO
            </span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-sm tracking-tight text-white group-hover:text-amber-300 transition-colors">
                Tin-Topup
              </span>
              <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
                + PRO
              </span>
            </div>
            <div className="mt-0.5">
              <span className="inline-block text-[8px] font-black uppercase text-amber-300 bg-amber-500/10 border border-amber-500/25 px-1.5 py-0.5 rounded tracking-wider">
                ENTERPRISE HUB v2.5
              </span>
            </div>
          </div>
        </Link>

        {/* Navigation Menu List */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.path);

            return (
              <Link
                key={item.id}
                to={item.path}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-xs font-bold ${
                  active
                    ? 'bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 text-white shadow-[0_0_18px_rgba(37,99,235,0.45)] border border-sky-400/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                    active
                      ? 'bg-white/20 text-white shadow-inner'
                      : 'bg-slate-800/80 text-slate-400 group-hover:text-white group-hover:bg-slate-700/80'
                  }`}
                >
                  {item.icon}
                </div>

                <div className="flex flex-col leading-tight min-w-0">
                  <span className={`text-[12px] truncate ${active ? 'font-black text-white' : 'font-bold'}`}>
                    {item.label}
                  </span>
                  <span className={`text-[9.5px] truncate font-medium ${active ? 'text-blue-100' : 'text-slate-500 group-hover:text-slate-400'}`}>
                    {item.sub}
                  </span>
                </div>

                {active && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#fff]" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Sidebar Promo Card (Anime Girl Artwork + Golden Button) */}
      <div className="pt-4">
        <div className="relative rounded-2xl p-3 bg-gradient-to-b from-[#131d36] to-[#0a1020] border border-sky-500/30 overflow-hidden shadow-xl group">
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-sky-400/40 bg-slate-900 shadow-md">
              <img
                src="https://images.unsplash.com/photo-1578632767115-351597cf2477?w=150&auto=format&fit=crop&q=80"
                alt="Special Reward"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="min-w-0">
              <h4 className="text-[11.5px] font-black text-white leading-tight truncate">
                {language === 'km' ? 'ទទួលបានបន្ថែម' : 'Get More Bonuses'}
              </h4>
              <p className="text-[9px] text-sky-300 font-medium truncate mt-0.5">
                {language === 'km' ? 'ពង្រឹងការលេងហ្គេមរបស់អ្នក' : 'Power up your gameplay'}
              </p>
            </div>
          </div>

          <Link
            to="/topup"
            className="w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-[11px] flex items-center justify-center gap-1.5 shadow-[0_2px_10px_rgba(251,191,36,0.3)] transition-all hover:scale-[1.02]"
          >
            <span>{language === 'km' ? 'ចូលលេងឥឡូវនេះ' : 'Play Now'}</span>
            <span className="text-xs">→</span>
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default DesktopSidebar;
