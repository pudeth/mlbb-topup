with open(r'd:\TopUP\frontend\src\components\Navbar.js', 'r', encoding='utf8') as f:
    text = f.read()

start_marker = '<div className="flex items-center justify-between h-16 sm:h-20">'
end_marker = '</header>'

start_idx = text.find(start_marker)
end_idx = text.find(end_marker, start_idx) + len(end_marker)

if start_idx != -1 and end_idx != -1:
    new_nav = """<div className="flex items-center justify-between h-16 sm:h-20">
          
            {/* 1. Left - Sleek Brand Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-[14px] bg-gradient-to-tr from-slate-900 to-slate-800 border border-slate-700/50 p-1.5 flex items-center justify-center shrink-0 group-hover:border-amber-400/50 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all overflow-hidden shadow-lg">
                  <img
                    src={branding.logoImage || '/tin-logo.png'}
                    alt={branding.storeName || 'Tin-Topup'}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/tin-logo.png';
                    }}
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-lg sm:text-[22px] font-black tracking-tight text-white group-hover:text-amber-400 transition-colors leading-none">
                      {branding.storeName || 'Tin-Topup'}
                    </span>
                    {branding.badgeText && (
                      <span className="bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded-[4px] tracking-wider uppercase shadow-sm">
                        {branding.badgeText}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </div>
  
            {/* 2. Center - Desktop Navigation Links (Ultra Sleek) */}
            <nav className="hidden lg:flex items-center gap-1 bg-slate-950/60 backdrop-blur-xl p-1 rounded-full border border-slate-800/80 shadow-[0_4px_25px_rgba(0,0,0,0.2)] font-khmer">
              <Link
                to="/"
                className={`px-4 py-1.5 rounded-full text-[13px] font-bold transition-all duration-300 flex items-center gap-2 ${
                  isActive('/') 
                    ? 'bg-[#182035] text-cyan-400 border border-cyan-500/20 shadow-sm' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                <span>{t('nav_home')}</span>
              </Link>
              <Link
                to="/topup"
                className={`px-4 py-1.5 rounded-full text-[13px] font-bold transition-all duration-300 flex items-center gap-2 ${
                  isActive('/topup') 
                    ? 'bg-[#21182c] text-amber-400 border border-amber-500/20 shadow-sm' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                <span>{t('nav_topup')}</span>
              </Link>
              <Link
                to="/support"
                className={`px-4 py-1.5 rounded-full text-[13px] font-bold transition-all duration-300 flex items-center gap-2 ${
                  isActive('/support') 
                    ? 'bg-slate-800/80 text-white shadow-sm border border-slate-600/50' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                <span>{t('nav_support')}</span>
              </Link>
              <Link
                to="/terms"
                className={`px-4 py-1.5 rounded-full text-[13px] font-bold transition-all duration-300 flex items-center gap-2 ${
                  isActive('/terms') 
                    ? 'bg-slate-800/80 text-white shadow-sm border border-slate-600/50' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                <span>{t('nav_policy')}</span>
              </Link>
              
              {isAdmin() && (
                <>
                  <div className="w-px h-4 bg-slate-700/50 mx-1"></div>
                  <Link
                    to="/admin/setup"
                    className={`px-4 py-1.5 rounded-full text-[13px] font-bold transition-all duration-300 flex items-center gap-2 ${
                      isActive('/admin/setup') 
                        ? 'bg-purple-950/60 text-purple-400 border border-purple-500/30 shadow-sm' 
                        : 'text-slate-400 hover:text-purple-300 hover:bg-slate-800/40 border border-transparent'
                    }`}
                  >
                    <span>ðŸ”§ {t('nav_admin')}</span>
                  </Link>
                  <Link
                    to="/admin/orders"
                    className={`px-4 py-1.5 rounded-full text-[13px] font-bold transition-all duration-300 flex items-center gap-2 ${
                      isActive('/admin/orders') 
                        ? 'bg-purple-950/60 text-purple-400 border border-purple-500/30 shadow-sm' 
                        : 'text-slate-400 hover:text-purple-300 hover:bg-slate-800/40 border border-transparent'
                    }`}
                  >
                    <span>ðŸ“Š {t('nav_orders')}</span>
                  </Link>
                </>
              )}
            </nav>
  
            {/* 3. Right - Actions */}
            <div className="flex items-center gap-2.5 sm:gap-4">
              
              {/* Language Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className="h-9 sm:h-10 px-2 sm:px-3 rounded-full bg-[#0B0F19] hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-slate-300 text-[11px] sm:text-xs font-bold flex items-center gap-1 sm:gap-2 transition-all shadow-inner"
                >
                  <span className="text-sm sm:text-base">{currentLang.flag}</span>
                  <span className="font-khmer">{currentLang.short}</span>
                  <svg className={`w-3 h-3 text-slate-500 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
  
                {langDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#0f1524]/95 backdrop-blur-xl border border-slate-700 rounded-[16px] shadow-2xl py-1.5 z-50 animate-slideDown overflow-hidden">
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          setLanguage(l.code);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm font-bold flex items-center justify-between transition-colors ${
                          language === l.code
                            ? 'bg-cyan-950/30 text-cyan-400'
                            : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-base">{l.flag}</span>
                          <span>{l.name}</span>
                        </span>
                        {language === l.code && <span className="text-cyan-400 text-xs font-black">âœ“</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
  
              {/* Desktop Top Up CTA */}
              <Link
                to="/topup"
                className="hidden lg:flex items-center gap-2 px-5 py-2 h-10 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 text-[13px] font-black tracking-wide rounded-full shadow-[0_0_15px_rgba(251,191,36,0.2)] transition-all duration-300 hover:scale-105 group font-khmer"
              >
                <svg className="w-4 h-4 fill-current transition-transform duration-300 group-hover:rotate-12" viewBox="0 0 24 24">
                  <path d="M13 2L3 14h8l-2 8 11-12h-8l2-8z" />
                </svg>
                <span>{t('nav_instant_btn')}</span>
              </Link>
  
              {isAuthenticated() && (
                <button
                  onClick={logout}
                  className="hidden lg:flex items-center gap-2 h-10 px-4 bg-slate-900/80 hover:bg-red-950/40 border border-slate-800 hover:border-red-500/30 text-slate-400 hover:text-red-400 text-[13px] font-bold rounded-full transition-all duration-300"
                >
                  <span>Logout</span>
                  <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 font-mono">
                    {user?.name || 'Admin'}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>"""
    
    text = text[:start_idx] + new_nav + text[end_idx:]
    with open(r'd:\TopUP\frontend\src\components\Navbar.js', 'w', encoding='utf8') as f:
        f.write(text)
    print("Navbar successfully restyled for PC.")
else:
    print("Markers not found.")
