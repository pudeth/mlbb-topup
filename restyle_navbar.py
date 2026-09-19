import re

with open(r'd:\TopUP\frontend\src\components\Navbar.js', 'r', encoding='utf8') as f:
    text = f.read()

pattern_nav = re.compile(r'\{\/\* Desktop Navigation Links \*\/\}.*?<\/nav>', re.DOTALL)

new_nav = """{/* Desktop Navigation Links - Ultra Sleek Design */}
            <nav className="hidden lg:flex items-center gap-1 bg-[#0b0f19]/80 backdrop-blur-xl p-1.5 rounded-full border border-slate-800/60 shadow-[0_4px_30px_rgba(0,0,0,0.3)] font-khmer">
              <Link
                to="/"
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2 ${
                  isActive('/') 
                    ? 'bg-[#182035] text-cyan-400 border border-cyan-500/20 shadow-sm' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <span>{t('nav_home')}</span>
              </Link>
              <Link
                to="/topup"
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2 ${
                  isActive('/topup') 
                    ? 'bg-[#21182c] text-amber-400 border border-amber-500/20 shadow-sm' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <span>{t('nav_topup')}</span>
              </Link>
              <Link
                to="/support"
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2 ${
                  isActive('/support') 
                    ? 'bg-slate-800/80 text-white shadow-sm border border-slate-600/50' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <span>{t('nav_support')}</span>
              </Link>
              <Link
                to="/terms"
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2 ${
                  isActive('/terms') 
                    ? 'bg-slate-800/80 text-white shadow-sm border border-slate-600/50' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <span>{t('nav_policy')}</span>
              </Link>
              
              {isAdmin() && (
                <>
                  <div className="w-px h-4 bg-slate-700/50 mx-1"></div>
                  <Link
                    to="/admin/setup"
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2 ${
                      isActive('/admin/setup') 
                        ? 'bg-purple-900/40 text-purple-300 border border-purple-500/30 shadow-sm' 
                        : 'text-slate-400 hover:text-purple-300 hover:bg-slate-800/40'
                    }`}
                  >
                    <span>ðŸ”§ {t('nav_admin')}</span>
                  </Link>
                  <Link
                    to="/admin/orders"
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2 ${
                      isActive('/admin/orders') 
                        ? 'bg-purple-900/40 text-purple-300 border border-purple-500/30 shadow-sm' 
                        : 'text-slate-400 hover:text-purple-300 hover:bg-slate-800/40'
                    }`}
                  >
                    <span>ðŸ“Š {t('nav_orders')}</span>
                  </Link>
                </>
              )}
            </nav>"""

text, count = pattern_nav.subn(new_nav, text)
print(f"Replaced {count} instances of desktop nav.")

with open(r'd:\TopUP\frontend\src\components\Navbar.js', 'w', encoding='utf8') as f:
    f.write(text)
