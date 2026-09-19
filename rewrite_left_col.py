import re

with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'r', encoding='utf8') as f:
    text = f.read()

pattern_left_col = re.compile(r'\{\/\* LEFT COLUMN: GAME ART, INFO & ACCOUNT FORM \*\/\}.*?\{\/\* ========================================== \*\/\}\s*\{\/\* RIGHT COLUMN: PRODUCT SELECTION & CHECKOUT \*\/\}', re.DOTALL)

new_left_col = """{/* LEFT COLUMN: GAME ART, INFO & ACCOUNT FORM */}
          {/* ========================================== */}
          <div className="lg:col-span-4 space-y-4">
            {/* Game Artwork Card with Back, Favorite button & Cambodia Flag Frame */}
            <div className="bg-slate-900/30 border border-slate-800/50 rounded-[24px] p-4 sm:p-5 shadow-2xl backdrop-blur-md space-y-5">
              <div className="relative aspect-square w-full rounded-[16px] overflow-hidden bg-slate-950 border border-slate-800/40 shadow-inner group">
                <img
                  src={selectedGame.image}
                  alt={selectedGame.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = selectedGame.localFallbackImage || '/mlbb-logo.png';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                
                {/* Back Button (<) */}
                <button
                  onClick={() => navigate('/')}
                  className="absolute top-3 left-3 w-8 h-8 rounded-full bg-slate-950/60 hover:bg-slate-900/80 backdrop-blur-md text-slate-300 hover:text-white flex items-center justify-center font-bold border border-slate-700/50 shadow-md cursor-pointer transition-all z-10"
                  title="Back to Home"
                >
                  â€¹
                </button>
  
                {/* Top-Right Glowing Server Badge Frame */}
                <div className="absolute top-3 right-3 z-10">
                  <CambodiaFlagFrame
                    title={selectedGame.flagTitle || selectedGame.badge || "ážŸáŸ ážœáž¾áž áŸ’áž˜áŸ‚ážš"}
                    subtitle={selectedGame.flagSubtitle || (selectedGame.id === 'mlbb' ? "5V5" : "")}
                    sub={selectedGame.flagServerText || "SERVER"}
                    flagImage={selectedGame.flagImage || null}
                    isFullBadgePng={selectedGame.isFullBadgePng || false}
                    className="shadow-xl"
                  />
                </div>
  
                {/* Bottom Ambient Glow Gradient */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent pointer-events-none" />
              </div>
  
              {/* Game Title & Cambodia Server Badge */}
              <div className="space-y-1.5 px-1">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-white leading-none tracking-wide uppercase">
                    {selectedGame.name}
                  </h2>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-black uppercase tracking-widest shadow-sm">
                    â—  10s API
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium block tracking-wide">
                  {selectedGame.publisher || 'Moonton Official'} â€¢ ážŸáŸ ážœáž¾áž•áŸ’áž›áž¼ážœáž€áž¶ážš
                </span>
              </div>
  
              {/* Account ID / UID Input Form */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2 px-1">
                  <label className="text-xs font-black text-slate-300 uppercase tracking-widest">
                    Player ID (UID)
                  </label>
                  <button type="button" className="text-[10px] text-purple-400 font-bold hover:text-purple-300 transition-colors flex items-center gap-1">
                    <span className="text-rose-500 font-black">?</span> Where is ID?
                  </button>
                </div>
  
                {/* ID Input Layout (Single ID vs ID+Zone) */}
                <div className="flex gap-2.5">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      name="playerID"
                      value={formData.playerID}
                      onChange={handleInputChange}
                      placeholder={selectedGame.id === 'mlbb' ? "e.g. 1225368571" : "Enter Player ID"}
                      className="w-full bg-slate-950/50 border border-slate-700/60 rounded-xl px-4 py-3.5 text-sm font-mono text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/50 transition-all shadow-inner"
                      autoComplete="off"
                    />
                  </div>
                  {/* Zone ID Input (Only shown for games requiring Server/Zone ID) */}
                  {selectedGame.requiresZoneId !== false && selectedGame.id === 'mlbb' && (
                    <div className="w-[100px] sm:w-[110px] relative shrink-0">
                      <input
                        type="text"
                        name="serverID"
                        value={formData.serverID}
                        onChange={handleInputChange}
                        placeholder="(10288)"
                        className="w-full bg-slate-950/50 border border-slate-700/60 rounded-xl px-3 py-3.5 text-sm font-mono text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/50 transition-all shadow-inner text-center"
                        autoComplete="off"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
  
          {/* ========================================== */}
          {/* RIGHT COLUMN: PRODUCT SELECTION & CHECKOUT */}"""

text, count = pattern_left_col.subn(new_left_col, text)
print(f"Replaced {count} instances of left column.")

with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'w', encoding='utf8') as f:
    f.write(text)
