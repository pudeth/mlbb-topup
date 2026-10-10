import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { BrandLogo } from './BrandLogo';
import { getGamerAvatarPreset } from './GamerAvatar';

const DesktopSidebar = () => {
  const location = useLocation();
  const { language } = useLanguage();
  const { user, playerAccount, logout, isAuthenticated } = useAuth();
  const isUserLoggedIn = isAuthenticated();

  const avatarId = playerAccount?.avatar || user?.avatar || 'crown';
  const avatarPreset = getGamerAvatarPreset(avatarId);
  const avatarSrc = avatarPreset?.image || (avatarId === 'crown' ? '/images/crowned_gamer_avatar.jpg' : null);

  const rawName = playerAccount?.realName || user?.name || (playerAccount?.playerId ? `ID: ${playerAccount.playerId}` : user?.email?.split('@')[0] || 'ZA | PUKAFF');
  const formattedName = (rawName || 'ZA | PUKAFF').replace(/⁞/g, '|');

  const zoneText = playerAccount?.serverId 
    ? `Zone ${playerAccount.serverId}` 
    : (user?.role ? user.role.toUpperCase() : 'Zone SG');

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
          <div className="relative rounded-2xl p-3 bg-gradient-to-br from-[#0c1026] via-[#080d1f] to-[#050814] border border-[#202958] hover:border-[#2b3776] shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_24px_rgba(20,40,95,0.35)] overflow-hidden transition-all duration-300">
            {/* Top-Right Cyber Accent Bar */}
            <div className="absolute top-2.5 right-3 pointer-events-none select-none">
              <svg width="48" height="13" viewBox="0 0 48 13" fill="none" className="drop-shadow-[0_0_8px_rgba(6,182,212,0.85)]">
                <defs>
                  <linearGradient id="cyberAccentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="55%" stopColor="#00f0ff" />
                    <stop offset="100%" stopColor="#10e599" />
                  </linearGradient>
                </defs>
                <path 
                  d="M 2 2.5 L 37 2.5 L 45.5 11" 
                  stroke="url(#cyberAccentGrad)" 
                  strokeWidth="2.8" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
              </svg>
            </div>

            {/* Upper Profile Identity Section */}
            <Link
              to="/order-history"
              className="flex items-center gap-2.5 mb-2.5 group/profile cursor-pointer select-none"
              title="View Player Orders & History"
            >
              {/* Golden Octagonal Avatar Frame */}
              <div className="relative w-[50px] h-[50px] xl:w-[54px] xl:h-[54px] shrink-0 filter drop-shadow-[0_0_12px_rgba(234,179,8,0.6)]">
                {/* Outer Gold Bevel Border */}
                <div 
                  className="w-full h-full p-[2.5px] transition-transform duration-300 group-hover/profile:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #fef08a 0%, #eab308 30%, #ca8a04 60%, #854d0e 100%)',
                    clipPath: 'polygon(29.29% 0%, 70.71% 0%, 100% 29.29%, 100% 70.71%, 70.71% 100%, 29.29% 100%, 0% 70.71%, 0% 29.29%)',
                  }}
                >
                  {/* Dark Inset Gap */}
                  <div 
                    className="w-full h-full p-[1.5px] bg-[#0c0e18]"
                    style={{
                      clipPath: 'polygon(29.29% 0%, 70.71% 0%, 100% 29.29%, 100% 70.71%, 70.71% 100%, 29.29% 100%, 0% 70.71%, 0% 29.29%)',
                    }}
                  >
                    {/* Inner Fine Gold Rim */}
                    <div 
                      className="w-full h-full p-[1.5px]"
                      style={{
                        background: 'linear-gradient(135deg, #fef08a 0%, #eab308 50%, #92400e 100%)',
                        clipPath: 'polygon(29.29% 0%, 70.71% 0%, 100% 29.29%, 100% 70.71%, 70.71% 100%, 29.29% 100%, 0% 70.71%, 0% 29.29%)',
                      }}
                    >
                      {/* Avatar Image Content */}
                      <div 
                        className="w-full h-full bg-[#080a14] flex items-center justify-center overflow-hidden relative"
                        style={{
                          clipPath: 'polygon(29.29% 0%, 70.71% 0%, 100% 29.29%, 100% 70.71%, 70.71% 100%, 29.29% 100%, 0% 70.71%, 0% 29.29%)',
                        }}
                      >
                        {avatarSrc ? (
                          <img 
                            src={avatarSrc} 
                            alt={formattedName} 
                            className="w-full h-full object-cover select-none"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <span 
                          style={{ display: avatarSrc ? 'none' : 'flex' }} 
                          className="w-full h-full items-center justify-center text-xl select-none"
                        >
                          {avatarPreset?.icon || '👑'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Glowing Purple Accent Divider */}
              <div className="w-[2.5px] h-7 bg-gradient-to-b from-indigo-400 via-indigo-500 to-purple-600 rounded-full shrink-0 shadow-[0_0_8px_rgba(99,102,241,0.65)]" />

              {/* User Identity Info */}
              <div className="flex flex-col min-w-0 flex-1 leading-tight justify-center">
                <span className="text-[14px] xl:text-[15px] font-black text-white truncate font-sans tracking-wide group-hover/profile:text-sky-200 transition-colors">
                  {formattedName}
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-2 h-2 rounded-full bg-[#10e599] shadow-[0_0_8px_#10e599] shrink-0" />
                  <span className="text-[11.5px] xl:text-[12px] font-bold text-[#10e599] drop-shadow-[0_0_6px_rgba(16,229,153,0.4)] truncate tracking-tight">
                    {zoneText}
                  </span>
                </div>
              </div>
            </Link>

            {/* Action Buttons: Profile & Logout */}
            <div className="grid grid-cols-2 gap-2 mt-2.5">
              {/* Profile Button */}
              <button
                type="button"
                onClick={() => window.dispatchEvent(new CustomEvent('open-player-profile'))}
                className="h-10 px-2 rounded-xl bg-gradient-to-r from-[#111536] to-[#171c46] hover:from-[#181d4a] hover:to-[#22275e] border border-indigo-500/60 hover:border-indigo-400 text-white shadow-[0_0_14px_rgba(99,102,241,0.22)] hover:shadow-[0_0_20px_rgba(99,102,241,0.45)] flex items-center justify-center gap-1.5 active:scale-[0.97] transition-all duration-200 cursor-pointer"
                title="Profile"
              >
                <svg className="w-4 h-4 text-[#c7d2fe] shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                </svg>
                <span className="text-indigo-400/50 text-xs font-light select-none">|</span>
                <span className="text-white text-[12px] font-bold tracking-wide">Profile</span>
              </button>

              {/* Logout Button */}
              <button
                type="button"
                onClick={logout}
                className="h-10 px-2 rounded-xl bg-gradient-to-r from-[#071628] to-[#0c2038] hover:from-[#0d233e] hover:to-[#132c4e] border border-cyan-500/60 hover:border-cyan-400 text-white shadow-[0_0_14px_rgba(6,182,212,0.22)] hover:shadow-[0_0_20px_rgba(6,182,212,0.45)] flex items-center justify-center gap-1.5 active:scale-[0.97] transition-all duration-200 cursor-pointer"
                title={language === 'km' ? 'ចាកចេញ' : 'Logout'}
              >
                <svg className="w-4 h-4 text-[#00e5ff] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="text-cyan-400/50 text-xs font-light select-none">|</span>
                <span className="text-white text-[12px] font-bold tracking-wide">{language === 'km' ? 'ចាកចេញ' : 'Logout'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default DesktopSidebar;
