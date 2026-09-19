import re

with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'r', encoding='utf8') as f:
    text = f.read()

# 1. Update Display Layout Toggles
pattern_toggles = re.compile(r'\{\/\* View Layout Switcher \(Tiles vs Large Icons vs List\) \*\/\}.*?<div className="min-h-\[300px\]">', re.DOTALL)

new_toggles = """{/* View Layout Switcher (Tiles vs Large Icons vs List) */}
                <div className="flex items-center gap-0.5 p-1 bg-slate-950/40 rounded-xl border border-slate-800/60 shadow-inner">
                  <button
                    type="button"
                    onClick={() => setLayoutMode('tiles')}
                    className={`py-1.5 px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      layoutMode === 'tiles'
                        ? 'bg-cyan-950/30 text-cyan-400 border border-cyan-500/30 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 border border-transparent'
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
                        ? 'bg-cyan-950/30 text-cyan-400 border border-cyan-500/30 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 border border-transparent'
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
                        ? 'bg-cyan-950/30 text-cyan-400 border border-cyan-500/30 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 border border-transparent'
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

# 2. Update Tiles View to match exactly the screenshot
pattern_tiles = re.compile(r'// ==================== MODE 1: TILES VIEW \(2-3 COLUMNS\) ====================.*?// ==================== MODE 2: LARGE ICONS / GRID VIEW ====================', re.DOTALL)

new_tiles = """// ==================== MODE 1: TILES VIEW (2-3 COLUMNS) ====================
                  if (layoutMode === 'tiles') {
                    return (
                      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {filtered.map((pkg) => {
                          const isSelected = selectedProduct.productId === pkg.productId;
  
                          return (
                            <div
                              key={pkg.productId}
                              onClick={() => setSelectedProduct(pkg)}
                              className={`group relative rounded-[20px] p-3 cursor-pointer select-none transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                                isSelected
                                  ? 'bg-[#1a1133] border border-[#563b9e] shadow-[0_0_20px_rgba(109,40,217,0.15)]'
                                  : 'bg-[#0f1523] border border-[#1e293b] hover:bg-[#141b2d] hover:border-[#334155]'
                              }`}
                            >
                              {/* Top Row: Icon & Tag */}
                              <div className="flex items-start justify-between mb-3 relative z-10">
                                <ProductPackageImage pkg={pkg} size="md" className="group-hover:scale-105 transition-transform duration-300 drop-shadow-md" />
                                
                                {pkg.tag && (
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider shadow-sm truncate max-w-[60%] ${
                                    pkg.tag.includes('ticket') || pkg.tag.includes('Starter')
                                      ? 'bg-cyan-950/40 text-[#38bdf8] border border-[#0284c7]'
                                      : pkg.tag.includes('arura') || pkg.tag.includes('BEST') || pkg.tag.includes('Bonus')
                                      ? 'bg-amber-950/40 text-amber-400 border border-amber-600/60'
                                      : 'bg-emerald-950/40 text-emerald-400 border border-emerald-600/60'
                                  }`}>
                                    {pkg.tag}
                                  </span>
                                )}
                              </div>
  
                              {/* Middle: Name */}
                              <div className="mb-4 relative z-10">
                                <span className="font-black text-xs sm:text-[13px] leading-tight line-clamp-2 text-white">
                                  {pkg.name}
                                </span>
                              </div>
  
                              {/* Bottom: Price Pill */}
                              <div className={`mt-auto relative z-10 flex items-center justify-between px-3 py-1.5 rounded-[12px] transition-all ${
                                isSelected ? 'bg-[#140b2e] border border-[#4c2d96]/30' : 'bg-[#0a0d16] border border-transparent'
                              }`}>
                                <span className={`text-[10px] font-mono font-medium ${isSelected ? 'text-[#a855f7]' : 'text-slate-500'}`}>
                                  ~{Math.round(pkg.price * 4100).toLocaleString()} ៛
                                </span>
                                <span className={`font-black text-sm font-mono ${isSelected ? 'text-[#22c55e]' : 'text-white'}`}>
                                  ${pkg.price.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  }
  
                  // ==================== MODE 2: LARGE ICONS / GRID VIEW ===================="""

text, count = pattern_tiles.subn(new_tiles, text)
print(f"Replaced {count} instances of tiles view.")

with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'w', encoding='utf8') as f:
    f.write(text)
