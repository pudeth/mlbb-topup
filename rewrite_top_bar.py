import re

with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'r', encoding='utf8') as f:
    text = f.read()

pattern_top_bar = re.compile(r'<div className="mb-6 space-y-2">.*?<div className="flex items-center gap-2\.5 overflow-x-auto pb-2 scrollbar-none">.*?</div>\s*</div>', re.DOTALL)

new_top_bar = """<div className="mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
              <span className="text-purple-400">ðŸŽ®</span> SELECT GAME OR SERVICE:
            </span>
            <span className="text-[10px] text-amber-500/80 font-black uppercase tracking-wider bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
              {allGames.length} Upstream Titles Available
            </span>
          </div>
  
          <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 scrollbar-none">
            {allGames.map((game) => {
              const isSelected = selectedGame.id === game.id;
              return (
                <button
                  key={game.id}
                  onClick={() => handleSelectGame(game)}
                  className={`flex items-center gap-2.5 p-1.5 pr-4 rounded-full border transition-all duration-300 shrink-0 select-none cursor-pointer ${
                    isSelected
                      ? 'bg-[#181335]/80 border-purple-500/60 text-white shadow-[0_0_15px_rgba(109,40,217,0.2)] scale-[1.02]'
                      : 'bg-slate-900/40 border-slate-800/60 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 hover:border-slate-700/80'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-full overflow-hidden shrink-0 transition-transform duration-300 ${isSelected ? 'shadow-md border border-purple-500/40 scale-105' : 'border border-slate-700/40'}`}>
                    <img
                      src={game.image}
                      alt={game.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = game.localFallbackImage || '/mlbb-logo.png';
                      }}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-left">
                    <span className={`text-[11px] font-black block truncate max-w-[130px] sm:max-w-[160px] uppercase tracking-wide transition-colors ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                      {game.name}
                    </span>
                    <span className={`text-[9px] block uppercase font-bold tracking-widest ${isSelected ? 'text-purple-300/80' : 'text-slate-500'}`}>
                      {game.currency}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>"""

text, count = pattern_top_bar.subn(new_top_bar, text)
print(f"Replaced {count} instances of top bar.")

with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'w', encoding='utf8') as f:
    f.write(text)
