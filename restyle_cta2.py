import re

with open(r'd:\TopUP\frontend\src\components\Navbar.js', 'r', encoding='utf8') as f:
    text = f.read()

pattern = re.compile(r'\{\/\* Desktop Top Up CTA \*\/\}.*?<\/button>\s*\}\)\s*<\/div>', re.DOTALL)

new_code = """{/* Desktop Top Up CTA */}
              <Link
                to="/topup"
                className="hidden lg:flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 text-[13px] font-black tracking-wide rounded-full shadow-[0_0_15px_rgba(251,191,36,0.3)] transition-all duration-300 hover:scale-105"
              >
                <svg className="w-4 h-4 fill-current drop-shadow-sm" viewBox="0 0 24 24">
                  <path d="M13 2L3 14h8l-2 8 11-12h-8l2-8z" />
                </svg>
                <span>{t('nav_instant_btn')}</span>
              </Link>
  
              {isAuthenticated() && (
                <button
                  onClick={logout}
                  className="hidden lg:flex items-center gap-2 px-4 py-2 bg-slate-900/80 hover:bg-red-950/40 border border-slate-700/50 hover:border-red-500/30 text-slate-300 hover:text-red-400 text-xs font-bold rounded-full transition-all duration-300"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  <span>Logout</span>
                </button>
              )}
            </div>"""

text, count = pattern.subn(new_code, text)
print(f"Replaced {count} instances.")

with open(r'd:\TopUP\frontend\src\components\Navbar.js', 'w', encoding='utf8') as f:
    f.write(text)
