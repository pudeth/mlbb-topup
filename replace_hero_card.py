import re

with open(r'd:\TopUP\frontend\src\pages\Home.js', 'r', encoding='utf8') as f:
    text = f.read()

# Replace the right hero visual card
old_card = """            {/* Right Hero Visual Card (Hidden on Mobile) */}
            <div className="hidden lg:block lg:col-span-5">
              <div className="relative rounded-3xl p-1 bg-gradient-to-br from-cyan-500 via-indigo-500 to-amber-500 shadow-2xl">
                <div className="bg-slate-950 rounded-[22px] p-5 sm:p-8 space-y-5 sm:space-y-6">
                  
                  {/* Card Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-900 border-2 border-amber-400/70 p-0.5 shadow-glow-gold flex items-center justify-center shrink-0">
                        <img
                          src="/mlbb-logo.png"
                          alt="Mobile Legends"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/mlbb-logo.png';
                          }}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-white text-sm sm:text-base">{t('card_game_title')}</h3>
                        <span className="text-xs text-emerald-400 font-semibold">ðŸŸ¢ {t('card_api_ready')}</span>
                      </div>
                    </div>
                    <span className="badge badge-warning text-[9px] sm:text-[10px]">Hot</span>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-2.5 sm:space-y-3 text-xs text-slate-300">
                    <div className="flex items-center gap-2.5 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                      <span className="text-cyan-400 text-base">âš¡</span>
                      <div>
                        <strong className="text-white block text-xs sm:text-sm">{t('card_feat_1_title')}</strong>
                        <span className="text-slate-400 text-[11px]">{t('card_feat_1_desc')}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                      <span className="text-emerald-400 text-base">ðŸ ¦</span>
                      <div>
                        <strong className="text-white block text-xs sm:text-sm">{t('card_feat_2_title')}</strong>
                        <span className="text-slate-400 text-[11px]">{t('card_feat_2_desc')}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                      <span className="text-amber-400 text-base">ðŸ›¡ï¸ </span>
                      <div>
                        <strong className="text-white block text-xs sm:text-sm">{t('card_feat_3_title')}</strong>
                        <span className="text-slate-400 text-[11px]">{t('card_feat_3_desc')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Direct Action */}
                  <Link
                    to="/topup"
                    className="btn btn-primary w-full text-center py-3.5 rounded-xl font-bold tracking-wide shadow-glow-cyan flex items-center justify-center gap-2 text-xs sm:text-sm"
                  >
                    <span>ðŸŽ® {t('card_goto_topup')}</span>
                    <span>â†’</span>
                  </Link>
                </div>
              </div>
            </div>"""

new_banner = """            {/* Right Hero Visual Banner (Hidden on Mobile) */}
            <div className="hidden lg:block lg:col-span-5 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-amber-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-60 transition-opacity duration-700"></div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-slate-800/50">
                <img
                  src="/mlbb-logo.png"
                  alt="Mobile Legends Banner"
                  className="w-full h-[400px] object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
                
                {/* Banner Content Overlay */}
                <div className="absolute bottom-0 left-0 w-full p-8">
                  <span className="inline-block px-3 py-1 bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-widest rounded-full mb-3">Official Integration</span>
                  <h3 className="text-2xl font-black text-white mb-2 leading-tight shadow-sm">Instant Delivery System</h3>
                  <p className="text-slate-300 text-sm font-medium">Top up your diamonds directly using ABA KHQR in seconds.</p>
                </div>
              </div>
            </div>"""

if old_card in text:
    text = text.replace(old_card, new_banner)
    with open(r'd:\TopUP\frontend\src\pages\Home.js', 'w', encoding='utf8') as f:
        f.write(text)
    print("Replaced interface with banner.")
else:
    print("Could not find the card interface to replace.")
