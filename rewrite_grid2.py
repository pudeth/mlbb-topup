import re

with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'r', encoding='utf8') as f:
    text = f.read()

pattern_grid = re.compile(r'// ==================== MODE 2: LARGE ICONS / GRID VIEW ====================.*?// ==================== MODE 3: COMPACT LIST ROWS ====================', re.DOTALL)

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
                              className={`group relative rounded-[20px] p-3.5 cursor-pointer select-none transition-all duration-300 flex flex-col items-center text-center justify-between overflow-hidden ${
                                isSelected
                                  ? 'bg-[#21182c] border border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.15)]'
                                  : 'bg-[#0f1523] border border-[#1e293b] hover:bg-[#141b2d] hover:border-[#334155]'
                              }`}
                            >
                              {/* Top Badge */}
                              <div className="h-6 mb-1 w-full flex justify-center items-center relative z-10">
                                {pkg.tag && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-wider shadow-sm truncate max-w-[90%] bg-amber-950/40 text-amber-400 border border-amber-600/60">
                                    {pkg.tag}
                                  </span>
                                )}
                              </div>
  
                              <ProductPackageImage pkg={pkg} size="lg" className="mb-3 group-hover:scale-105 transition-transform duration-300 drop-shadow-md relative z-10" />
  
                              <span className="font-black text-[11.5px] sm:text-[13px] leading-snug mb-3 text-white relative z-10">
                                {pkg.name}
                              </span>
  
                              {/* Price Block */}
                              <div className={`mt-auto w-full flex flex-col items-center justify-center py-2 rounded-[14px] transition-all relative z-10 ${
                                isSelected ? 'bg-[#2a1723] border border-transparent' : 'bg-[#0a0d16] border border-transparent'
                              }`}>
                                <span className={`font-black text-sm sm:text-base font-mono leading-none mb-1 ${isSelected ? 'text-amber-400' : 'text-white'}`}>
                                  ${pkg.price.toFixed(2)}
                                </span>
                                <span className={`text-[9px] font-mono font-medium ${isSelected ? 'text-amber-600' : 'text-slate-500'}`}>
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

text, count = pattern_grid.subn(new_grid, text)
print(f"Replaced {count} instances.")

with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'w', encoding='utf8') as f:
    f.write(text)
