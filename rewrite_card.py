import re

with open(r'd:\TopUP\frontend\src\components\GameSelection.js', 'r', encoding='utf8') as f:
    text = f.read()

# We need to extract the exact return ( <div key={game.id} ... ) inside the map loop.
pattern = re.compile(r'return \(\s*<div\s*key=\{game\.id\}(.*?)\n\s*return\s*\(\s*<div\s*className="text-center mt-8 sm:mt-10">', re.DOTALL)

old_card_full = """                  <div
                    key={game.id}
                    onClick={isInactive ? (e) => { e.preventDefault(); e.stopPropagation(); } : () => handleGameClick(game)}
                    className={`group relative rounded-2xl p-2 sm:p-2.5 bg-[#0B0F19] border transition-all duration-300 flex flex-col justify-between items-center text-center space-y-2 select-none ${
                      isInactive
                        ? 'border-slate-800/50 opacity-60 cursor-not-allowed grayscale-[40%]'
                        : 'border-slate-800/90 hover:border-purple-500/80 hover:scale-[1.03] hover:shadow-[0_10px_25px_rgba(109,40,217,0.3)] cursor-pointer shadow-lg'
                    }`}
                  >
                    {/* Game Artwork Box with Rounded Corners */}
                    <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800/90 shadow-inner">
                      <img
                        src={game.image}
                        alt={game.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = game.localFallbackImage || '/mlbb-logo.png';
                        }}
                        className={`w-full h-full object-cover transition-transform duration-500 ${
                          isInactive ? '' : 'group-hover:scale-105'
                        }`}
                      />
  
                      {/* Top Right Server Badge or Status Indicator */}
                      {isInactive ? (
                        <div className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5">
                          <span
                            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[8px] sm:text-[9px] font-black uppercase tracking-wider shadow-md backdrop-blur-md ${
                              effectiveStatus === 'Closed'
                                ? 'bg-rose-600 text-white border border-rose-500'
                                : effectiveStatus === 'Maintenance'
                                ? 'bg-purple-600 text-white border border-purple-400'
                                : effectiveStatus === 'Coming Soon'
                                ? 'bg-cyan-500 text-black border border-cyan-400'
                                : 'bg-amber-500 text-black border border-amber-400'
                            }`}
                          >
                            <span>{effectiveStatus === 'Closed' ? 'ðŸ”´ CLOSED' : effectiveStatus === 'Maintenance' ? 'ðŸ›ï¸  MAINT' : effectiveStatus === 'Coming Soon' ? 'â ³ SOON' : 'â ¸ï¸  PAUSED'}</span>
                          </span>
                        </div>
                      ) : (game.badge || game.flagTitle) ? (
                        <div className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5">
                          <span
                            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[8px] sm:text-[9px] font-black uppercase tracking-wider shadow-md backdrop-blur-md ${
                              game.badgeColor === 'gold' || isMLBB
                                ? 'bg-amber-400 text-black border border-amber-300'
                                : game.badgeColor === 'emerald'
                                ? 'bg-emerald-500 text-white border border-emerald-400'
                                : game.badgeColor === 'purple'
                                ? 'bg-purple-600 text-white border border-purple-400'
                                : 'bg-cyan-500 text-black border border-cyan-400'
                            }`}
                          >
                            {game.flagImage ? (
                              <span className="w-2.5 h-2.5 rounded-full overflow-hidden inline-block ring-1 ring-white/50 shrink-0">
                                <img src={game.flagImage} alt="Flag" className="w-full h-full object-cover" />
                              </span>
                            ) : (game.badge?.includes('áž áŸ’áž˜áŸ‚ážš') || game.flagType === 'kh') ? (
                              <span className="w-2.5 h-2.5 rounded-full overflow-hidden inline-block ring-1 ring-white/50 shrink-0">
                                <CambodiaFlagSvg className="w-full h-full object-cover" />
                              </span>
                            ) : null}
                            <span>{game.flagTitle || game.badge}</span>
                          </span>
                        </div>
                      ) : null}
                    </div>
  
                    {/* Game Name Title */}
                    <div className="w-full px-0.5">
                      <h3 className="font-extrabold text-purple-300 group-hover:text-purple-100 text-[10px] sm:text-xs leading-snug uppercase tracking-wide truncate transition-colors text-center">
                        {game.name}
                      </h3>
                    </div>
  
                    {/* Action Pill Button - Disabled and Unclickable when Closed/Paused */}
                    <button
                      type="button"
                      disabled={isInactive}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isInactive) {
                          handleGameClick(game);
                        }
                      }}
                      className={`w-full py-1 sm:py-1.5 px-2 rounded-xl font-black text-[10px] sm:text-xs shadow-md transition-all flex items-center justify-center ${
                        isInactive
                          ? effectiveStatus === 'Closed'
                            ? 'bg-rose-950/40 text-rose-300/80 border border-rose-900/60 cursor-not-allowed pointer-events-none'
                            : effectiveStatus === 'Maintenance'
                            ? 'bg-purple-950/40 text-purple-300/80 border border-purple-900/60 cursor-not-allowed pointer-events-none'
                            : effectiveStatus === 'Coming Soon'
                            ? 'bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed pointer-events-none'
                            : 'bg-amber-950/40 text-amber-300/80 border border-amber-900/60 cursor-not-allowed pointer-events-none'
                          : 'bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 active:scale-95 text-white shadow-purple-950/60 cursor-pointer'
                      }`}
                    >
                      {isInactive
                        ? effectiveStatus === 'Closed'
                          ? 'ðŸ”´ Closed'
                          : effectiveStatus === 'Maintenance'
                          ? 'ðŸ›ï¸  Maintenance'
                          : effectiveStatus === 'Coming Soon'
                          ? 'â ³ Coming Soon'
                          : 'â ¸ï¸  Paused'
                        : t('card_btn_topup')}
                    </button>
                  </div>"""


new_card = """                  <div
                    key={game.id}
                    onClick={isInactive ? (e) => { e.preventDefault(); e.stopPropagation(); } : () => handleGameClick(game)}
                    className={`group relative rounded-[20px] p-2 transition-all duration-300 flex flex-col justify-between items-center text-center select-none ${
                      isInactive
                        ? 'opacity-60 cursor-not-allowed grayscale-[40%]'
                        : 'hover:scale-[1.02] cursor-pointer'
                    } ${
                      !isInactive && isMLBB ? 'bg-[#181335]/60 ring-1 ring-purple-500/50 shadow-[0_0_20px_rgba(109,40,217,0.15)]' : 'bg-transparent'
                    }`}
                  >
                    {/* Game Artwork Box with Rounded Corners */}
                    <div className="relative aspect-square w-full rounded-[16px] overflow-hidden bg-slate-900/50 mb-3 border border-slate-800/40">
                      <img
                        src={game.image}
                        alt={game.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = game.localFallbackImage || '/mlbb-logo.png';
                        }}
                        className={`w-full h-full object-cover transition-transform duration-500 ${
                          isInactive ? '' : 'group-hover:scale-105'
                        }`}
                      />
  
                      {/* Top Right Server Badge or Status Indicator */}
                      {isInactive ? (
                        <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-sm ${
                              effectiveStatus === 'Closed'
                                ? 'bg-rose-500/30 text-rose-200 border border-rose-500/50'
                                : effectiveStatus === 'Maintenance'
                                ? 'bg-purple-500/30 text-purple-200 border border-purple-400/50'
                                : effectiveStatus === 'Coming Soon'
                                ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400/50'
                                : 'bg-amber-500/30 text-amber-200 border border-amber-400/50'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${effectiveStatus === 'Closed' ? 'bg-rose-400' : 'bg-amber-400'}`}></span>
                            <span>{effectiveStatus === 'Closed' ? 'CLOSED' : effectiveStatus === 'Maintenance' ? 'MAINTENANCE' : effectiveStatus === 'Coming Soon' ? 'COMING SOON' : 'PAUSED'}</span>
                          </span>
                        </div>
                      ) : (game.badge || game.flagTitle) ? (
                        <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-sm ${
                              game.badgeColor === 'gold' || isMLBB
                                ? 'bg-amber-400 text-slate-900 shadow-amber-500/30'
                                : game.badgeColor === 'emerald'
                                ? 'bg-emerald-500 text-white'
                                : game.badgeColor === 'purple'
                                ? 'bg-purple-600 text-white'
                                : 'bg-cyan-500 text-black'
                            }`}
                          >
                            {game.flagImage ? (
                              <span className="w-3 h-3 rounded-full overflow-hidden inline-block shrink-0">
                                <img src={game.flagImage} alt="Flag" className="w-full h-full object-cover" />
                              </span>
                            ) : (game.badge?.includes('áž áŸ’áž˜áŸ‚ážš') || game.flagType === 'kh') ? (
                              <span className="w-3 h-3 rounded-full overflow-hidden inline-block shrink-0">
                                <CambodiaFlagSvg className="w-full h-full object-cover" />
                              </span>
                            ) : null}
                            <span>{game.flagTitle || game.badge}</span>
                          </span>
                        </div>
                      ) : null}
                    </div>
  
                    {/* Game Name Title */}
                    <div className="w-full px-1 mb-2.5">
                      <h3 className={`font-black text-[11px] sm:text-[13px] leading-snug uppercase tracking-wider truncate transition-colors text-center ${
                        isInactive ? 'text-slate-400' : 'text-slate-200 group-hover:text-white'
                      }`}>
                        {game.name}
                      </h3>
                    </div>
  
                    {/* Action Pill Button */}
                    <button
                      type="button"
                      disabled={isInactive}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isInactive) {
                          handleGameClick(game);
                        }
                      }}
                      className={`w-full py-1.5 sm:py-2 px-3 rounded-full font-black text-[11px] sm:text-xs transition-all flex items-center justify-center shadow-sm ${
                        isInactive
                          ? effectiveStatus === 'Closed'
                            ? 'bg-rose-950/20 text-rose-500/70 border border-rose-900/30 cursor-not-allowed pointer-events-none'
                            : effectiveStatus === 'Maintenance'
                            ? 'bg-purple-950/20 text-purple-500/70 border border-purple-900/30 cursor-not-allowed pointer-events-none'
                            : effectiveStatus === 'Coming Soon'
                            ? 'bg-slate-900/30 text-slate-500/70 border border-slate-800/50 cursor-not-allowed pointer-events-none'
                            : 'bg-amber-950/20 text-amber-500/70 border border-amber-900/30 cursor-not-allowed pointer-events-none'
                          : 'bg-[#7a3bf2] hover:bg-[#6c34d6] active:bg-[#5b2cb6] text-white shadow-purple-500/20 hover:shadow-purple-500/40 cursor-pointer'
                      }`}
                    >
                      {isInactive
                        ? effectiveStatus === 'Closed'
                          ? 'Closed'
                          : effectiveStatus === 'Maintenance'
                          ? 'Maintenance'
                          : effectiveStatus === 'Coming Soon'
                          ? 'Coming Soon'
                          : 'Paused'
                        : 'áž”áž‰áŸ’áž…áž¼áž›'
                      }
                    </button>
                  </div>"""

if old_card_full in text:
    text = text.replace(old_card_full, new_card)
    with open(r'd:\TopUP\frontend\src\components\GameSelection.js', 'w', encoding='utf8') as f:
        f.write(text)
    print("Replaced card logic!")
else:
    print("Could not find exact block. Let me write a regex.")
    
