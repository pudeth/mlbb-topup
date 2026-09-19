import re

with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'r', encoding='utf8') as f:
    text = f.read()

pattern = re.compile(r'// ==================== MODE 2: LARGE ICONS / GRID VIEW ====================.*?// ==================== MODE 3: COMPACT LIST ROWS ====================', re.DOTALL)

new_grid = """// ==================== MODE 2: LARGE ICONS / GRID VIEW ====================
                  if (layoutMode === 'grid') {
                    return (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {filtered.map((pkg) => {
                          const isSelected = selectedProduct.productId === pkg.productId;
  
                          return (
                            <div
                              key={pkg.productId}
                              onClick={() => setSelectedProduct(pkg)}
                              className={`group relative rounded-[20px] p-3.5 cursor-pointer select-none transition-all duration-300 flex flex-col items-center text-center justify-between overflow-hidden active:scale-[0.98] ${
                                isSelected
                                  ? 'bg-[#181335]/80 border-transparent ring-1 ring-amber-400/70 shadow-[0_0_25px_rgba(251,191,36,0.2)] scale-[1.02]'
                                  : 'bg-slate-900/40 border border-slate-800/50 hover:bg-slate-800/40 hover:border-slate-700/60'
                              }`}
                            >
                              {isSelected && <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 to-transparent pointer-events-none" />}
                              
                              {/* Top Badge */}
                              <div className="h-5 mb-2 w-full flex justify-center">
                                {pkg.tag && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider shadow-sm truncate max-w-[90%] bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                    {pkg.tag}
                                  </span>
                                )}
                              </div>
  
                              <ProductPackageImage pkg={pkg} size="lg" className="mb-3 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg" />
  
                              <span className={`font-black text-[11px] sm:text-xs leading-snug mb-3 transition-colors ${isSelected ? 'text-white' : 'text-slate-300 group-hover:text-slate-200'}`}>
                                {pkg.name}
                              </span>
  
                              {/* Price Block */}
                              <div className={`mt-auto w-full flex flex-col items-center py-1.5 rounded-xl transition-all ${
                                isSelected ? 'bg-amber-950/30 border border-amber-500/20' : 'bg-slate-950/50 border border-slate-800/60'
                              }`}>
                                <span className={`font-black text-sm sm:text-base font-mono leading-none mb-0.5 ${isSelected ? 'text-amber-400' : 'text-slate-300 group-hover:text-amber-400/80'}`}>
                                  ${pkg.price.toFixed(2)}
                                </span>
                                <span className={`text-[9px] font-mono font-medium ${isSelected ? 'text-amber-300/60' : 'text-slate-500'}`}>
                                  ~{Math.round(pkg.price * 4100).toLocaleString()} ៛
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  }
  
                  // ==================== MODE 3: COMPACT LIST ROWS ===================="""

text, count = pattern.subn(new_grid, text)
print(f"Replaced {count} instances.")

with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'w', encoding='utf8') as f:
    f.write(text)
