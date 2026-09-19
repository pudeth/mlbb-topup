import re

with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'r', encoding='utf8') as f:
    text = f.read()

pattern = re.compile(r'// ==================== MODE 3: COMPACT LIST ROWS ====================.*?return \(\s*<div className="space-y-1\.5">.*?</div>\s*\);\s*\}\)\(\)\}\s*</div>', re.DOTALL)

new_list = """// ==================== MODE 3: COMPACT LIST ROWS ====================
                  return (
                    <div className="space-y-2">
                      {filtered.map((pkg) => {
                        const isSelected = selectedProduct.productId === pkg.productId;
  
                        return (
                          <div
                            key={pkg.productId}
                            onClick={() => setSelectedProduct(pkg)}
                            className={`group relative flex items-center justify-between p-3 rounded-[16px] cursor-pointer select-none transition-all duration-300 overflow-hidden active:scale-[0.98] ${
                              isSelected
                                ? 'bg-[#181335]/80 border-transparent ring-1 ring-purple-500/60 shadow-[0_0_20px_rgba(109,40,217,0.15)] scale-[1.01]'
                                : 'bg-slate-900/40 border border-slate-800/50 hover:bg-slate-800/40 hover:border-slate-700/60'
                            }`}
                          >
                            {isSelected && <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent pointer-events-none" />}
                            
                            <div className="flex items-center gap-3.5 relative z-10">
                              <ProductPackageImage pkg={pkg} size="sm" className="group-hover:scale-110 transition-transform duration-300 drop-shadow-sm" />
                              <div className="flex flex-col justify-center">
                                <div className="flex items-center gap-2">
                                  <span className={`font-black text-xs sm:text-sm transition-colors ${isSelected ? 'text-white' : 'text-slate-300 group-hover:text-slate-200'}`}>
                                    {pkg.name}
                                  </span>
                                  {pkg.tag && (
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider shadow-sm ${
                                      isSelected ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'bg-slate-800 text-slate-400'
                                    }`}>
                                      {pkg.tag}
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-slate-500 font-mono mt-0.5">
                                  ~{Math.round(pkg.price * 4100).toLocaleString()} ៛
                                </span>
                              </div>
                            </div>
                            
                            <div className={`relative z-10 px-3 py-1.5 rounded-xl transition-colors ${
                              isSelected ? 'bg-purple-950/40 border border-purple-500/30' : 'bg-slate-950/50 border border-slate-800/60'
                            }`}>
                              <span className={`font-black text-sm font-mono ${isSelected ? 'text-emerald-400' : 'text-slate-300 group-hover:text-emerald-400/80'}`}>
                                ${pkg.price.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>"""

text, count = pattern.subn(new_list, text)
print(f"Replaced {count} instances.")

with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'w', encoding='utf8') as f:
    f.write(text)
