import re

with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'r', encoding='utf8') as f:
    text = f.read()

pattern = re.compile(r'// ==================== MODE 1: TILES VIEW \(2-3 COLUMNS\) ====================.*?// ==================== MODE 2: LARGE ICONS / GRID VIEW ====================', re.DOTALL)

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
                              className={`group relative rounded-[20px] p-3 cursor-pointer select-none transition-all duration-300 flex flex-col justify-between overflow-hidden active:scale-[0.98] ${
                                isSelected
                                  ? 'bg-[#181335]/80 border-transparent ring-1 ring-purple-500/60 shadow-[0_0_25px_rgba(109,40,217,0.2)] scale-[1.02]'
                                  : 'bg-slate-900/40 border border-slate-800/50 hover:bg-slate-800/40 hover:border-slate-700/60'
                              }`}
                            >
                              {isSelected && <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 pointer-events-none" />}
                              
                              {/* Top Row: Icon & Tag */}
                              <div className="flex items-start justify-between mb-3 relative z-10">
                                <ProductPackageImage pkg={pkg} size="md" className="group-hover:scale-110 transition-transform duration-300 drop-shadow-md" />
                                
                                {pkg.tag && (
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider shadow-sm truncate max-w-[50%] ${
                                    pkg.tag.includes('ticket')
                                      ? 'bg-purple-900/40 text-purple-300 border border-purple-700/50'
                                      : pkg.tag.includes('arura') || pkg.tag.includes('BEST') || pkg.tag.includes('Bonus')
                                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                                  }`}>
                                    {pkg.tag}
                                  </span>
                                )}
                              </div>
  
                              {/* Middle: Name */}
                              <div className="mb-3 relative z-10">
                                <span className={`font-black text-xs sm:text-sm leading-tight line-clamp-2 transition-colors ${isSelected ? 'text-white' : 'text-slate-300 group-hover:text-slate-200'}`}>
                                  {pkg.name}
                                </span>
                              </div>
  
                              {/* Bottom: Price Pill */}
                              <div className={`mt-auto relative z-10 flex items-center justify-between px-2.5 py-1.5 rounded-xl transition-all ${
                                isSelected ? 'bg-purple-950/40 border border-purple-500/30' : 'bg-slate-950/50 border border-slate-800/60'
                              }`}>
                                <span className={`text-[9px] sm:text-[10px] font-mono font-medium ${isSelected ? 'text-purple-300/80' : 'text-slate-500'}`}>
                                  ~{Math.round(pkg.price * 4100).toLocaleString()} ៛
                                </span>
                                <span className={`font-black text-xs sm:text-sm font-mono ${isSelected ? 'text-emerald-400' : 'text-slate-300 group-hover:text-emerald-400/80'}`}>
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

text, count = pattern.subn(new_tiles, text)
print(f"Replaced {count} instances.")

with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'w', encoding='utf8') as f:
    f.write(text)
