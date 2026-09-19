with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'r', encoding='utf8') as f:
    text = f.read()

start_marker = "{/* View Layout Switcher (Tiles vs Large Icons vs List) */}"
end_marker = "{/* Products Display Container */}"

start_idx = text.find(start_marker)
end_idx = text.find(end_marker)

if start_idx != -1 and end_idx != -1:
    new_block = """{/* View Layout Switcher (Tiles vs Large Icons vs List) */}
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
                    title="List Rows View"
                  >
                    <span>â˜°</span>
                    <span className="text-[11px] font-semibold">{t('layout_list')}</span>
                  </button>
                </div>
              </div>
  
              """
    text = text[:start_idx] + new_block + text[end_idx:]
    
    with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'w', encoding='utf8') as f:
        f.write(text)
    print("Successfully replaced toggles block.")
else:
    print("Markers not found.")
