import re

with open(r'd:\TopUP\frontend\src\pages\Home.js', 'r', encoding='utf8') as f:
    text = f.read()

pattern = re.compile(r'\{\/\* Right Hero Visual Card \(Hidden on Mobile\) \*\/\}.*?</div>\s*</div>\s*</div>\s*</div>', re.DOTALL)

new_banner = """{/* Right Hero Visual Banner (Hidden on Mobile) */}
            <div className="hidden lg:block lg:col-span-5 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-amber-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-60 transition-opacity duration-700"></div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-slate-800/50">
                <img
                  src="/mlbb-logo.png"
                  alt="Mobile Legends Banner"
                  className="w-full h-[380px] object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent pointer-events-none"></div>
                
                {/* Banner Content Overlay */}
                <div className="absolute bottom-0 left-0 w-full p-8">
                  <span className="inline-block px-3 py-1 bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-widest rounded-full mb-3 shadow-lg">Official Integration</span>
                  <h3 className="text-2xl font-black text-white mb-2 leading-tight drop-shadow-md">Instant Delivery System</h3>
                  <p className="text-slate-300 text-sm font-medium drop-shadow">Top up your diamonds directly using ABA KHQR in seconds.</p>
                </div>
              </div>
            </div>
          </div>"""

text, count = pattern.subn(new_banner, text)
print(f"Replaced {count} instances.")

with open(r'd:\TopUP\frontend\src\pages\Home.js', 'w', encoding='utf8') as f:
    f.write(text)
