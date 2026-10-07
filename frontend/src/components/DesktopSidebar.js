import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { BrandLogo } from './BrandLogo';
import GamerAvatar from './GamerAvatar';

const DesktopSidebar = () => {
  const location = useLocation();
  const { language } = useLanguage();
  const { user, playerAccount, logout, isAuthenticated } = useAuth();
  const isUserLoggedIn = isAuthenticated();

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
    },
    {
      id: 'apidocs',
      label: language === 'km' ? 'ឯកសារ API' : 'API Docs',
      sub: 'Free Fire & B2B',
      path: '/api-docs',
      icon: (
        <svg className="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      )
    }
  ];

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-60 xl:w-64 bg-[#080d1a]/95 backdrop-blur-2xl border-r border-slate-800/80 z-40 flex-col justify-between p-3.5 select-none overflow-y-auto scrollbar-none font-khmer">
      {/* Top Brand Logo Section */}
      <div className="space-y-4">
        <Link to="/" className="flex items-center px-1 py-1 rounded-2xl hover:bg-slate-800/40 transition-all group">
          <BrandLogo size="md" />
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

      {/* Bottom Sidebar User Login / Auth Section */}
      <div className="pt-3 border-t border-slate-800/80">
        {!isUserLoggedIn ? (
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('open-player-login'))}
            className="w-full text-left group relative flex items-center gap-3 p-2.5 rounded-xl bg-gradient-to-r from-blue-600/20 via-sky-600/15 to-indigo-600/20 hover:from-blue-600 hover:via-sky-600 hover:to-indigo-600 border border-sky-500/30 hover:border-sky-400 text-white shadow-lg shadow-sky-950/40 transition-all duration-200 active:scale-[0.98] overflow-hidden cursor-pointer"
            title={language === 'km' ? 'ចុចដើម្បីបើកផ្ទាំងចូលគណនី (Player ID & Server ID)' : 'Click to open Player Login popup'}
          >
            {/* Subtle light shimmer effect on hover */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

            <div className="w-9 h-9 rounded-lg bg-sky-500/20 group-hover:bg-white/20 border border-sky-400/40 group-hover:border-white/40 flex items-center justify-center shrink-0 text-sky-300 group-hover:text-white transition-all shadow-inner">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>

            <div className="flex flex-col min-w-0 flex-1 leading-tight">
              <span className="text-[12px] font-black text-white group-hover:text-white tracking-wide">
                {language === 'km' ? 'ចូលគណនី' : 'Login'}
              </span>
              <span className="text-[9.5px] text-sky-300/90 group-hover:text-sky-100 font-bold truncate mt-0.5">
                ID Player & ID Server
              </span>
            </div>

            <div className="w-6 h-6 rounded-lg bg-white/10 group-hover:bg-white/20 flex items-center justify-center text-white text-xs shrink-0 transition-transform group-hover:translate-x-0.5">
              →
            </div>
          </button>
        ) : (
          <div className="rounded-xl p-2.5 bg-slate-900/90 border border-slate-800 shadow-md">
            <Link
              to="/order-history"
              className="flex items-center gap-2.5 mb-2 group/profile cursor-pointer"
              title="View Player Orders & History"
            >
              <GamerAvatar 
                avatarId={playerAccount?.avatar || user?.avatar} 
                name={playerAccount?.realName || user?.name || playerAccount?.playerId} 
                size="sm" 
                showGlow={true} 
              />
              <div className="flex flex-col min-w-0 flex-1 leading-tight">
                <span className="text-[12px] font-bold text-white truncate group-hover/profile:text-sky-300 transition-colors">
                  {playerAccount?.realName || user?.name || (playerAccount?.playerId ? `ID: ${playerAccount.playerId}` : user?.email?.split('@')[0] || 'Player')}
                </span>
                <span className="text-[9.5px] text-emerald-400 font-semibold truncate flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {playerAccount?.serverId ? `Zone ${playerAccount.serverId}` : (user?.role ? user.role.toUpperCase() : (language === 'km' ? 'សកម្ម' : 'Active'))}
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('open-player-profile'))}
                className="flex-1 py-1.5 px-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 hover:border-cyan-400/50 text-slate-300 hover:text-cyan-300 text-[11px] font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer"
                title="Edit Profile"
              >
                <span>⚙️</span>
                <span>Profile</span>
              </button>

              <button
                onClick={logout}
                className="flex-1 py-1.5 px-2 rounded-lg bg-slate-800/80 hover:bg-rose-950/50 border border-slate-700/60 hover:border-rose-500/40 text-slate-300 hover:text-rose-200 text-[11px] font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>{language === 'km' ? 'ចាកចេញ' : 'Logout'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default DesktopSidebar;
