import re

with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'r', encoding='utf8') as f:
    text = f.read()

pattern_toggles = re.compile(r'\{\/\* View Layout Switcher \(Tiles vs Large Icons vs List\) \*\/\}.*?<\/div>\s*<\/div>\s*\{\/\* Product Grid / List Display \*\/\}\s*<div className="min-h-\[300px\]">', re.DOTALL)

new_toggles = """{/* View Layout Switcher (Tiles vs Large Icons vs List) */}
                <div className="flex items-center gap-1 p-1 bg-[#0b0f19] rounded-xl border border-slate-800 shadow-inner">
                  <button
                    type="button"
                    onClick={() => setLayoutMode('tiles')}
                    className={`py-1.5 px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      layoutMode === 'tiles'
                        ? 'bg-[#1a2538] text-[#38bdf8] border border-[#38bdf8]/40 shadow-sm'
                        : 'text-slate-400 hover:text-white border border-transparent'
                    }`}
                    title="Tiles View"
                  >
                    <span>âŠž</span>
                    <span className="text-[11px] font-semibold">{t('layout_tiles')}</span>
                  </button>
  
                  <button
                    type="button"
                    onClick={() => setLayoutMode('grid')}
                    className={`py-1.5 px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      layoutMode === 'grid'
                        ? 'bg-[#1a2538] text-[#38bdf8] border border-[#38bdf8]/40 shadow-sm'
                        : 'text-slate-400 hover:text-white border border-transparent'
                    }`}
                    title="Large Icons View"
                  >
                    <span>ðŸ”²</span>
                    <span className="text-[11px] font-semibold">{t('layout_large_icons')}</span>
                  </button>
  
                  <button
                    type="button"
                    onClick={() => setLayoutMode('list')}
                    className={`py-1.5 px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      layoutMode === 'list'
                        ? 'bg-[#1a2538] text-[#38bdf8] border border-[#38bdf8]/40 shadow-sm'
                        : 'text-slate-400 hover:text-white border border-transparent'
                    }`}
                    title="Compact List View"
                  >
                    <span>â‰¡</span>
                    <span className="text-[11px] font-semibold">{t('layout_list')}</span>
                  </button>
                </div>
              </div>
  
              {/* Product Grid / List Display */}
              <div className="min-h-[300px]">"""

text, count = pattern_toggles.subn(new_toggles, text)
print(f"Replaced {count} instances of toggles.")

with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'w', encoding='utf8') as f:
    f.write(text)
