import re

with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'r', encoding='utf8') as f:
    text = f.read()

pattern_list = re.compile(r'// ==================== MODE 3: COMPACT LIST ROWS ====================.*?return \(\s*<div className="space-y-2">.*?</div>\s*\);\s*\}\)\(\)\}\s*</div>', re.DOTALL)

new_list = """// ==================== MODE 3: COMPACT LIST ROWS ====================
                  return (
                    <div className="space-y-2.5">
                      {filtered.map((pkg) => {
                        const isSelected = selectedProduct.productId === pkg.productId;
  
                        return (
                          <div
                            key={pkg.productId}
                            onClick={() => setSelectedProduct(pkg)}
                            className={`group relative flex items-center justify-between p-3 rounded-[20px] cursor-pointer select-none transition-all duration-300 overflow-hidden ${
                              isSelected
                                ? 'bg-[#1a1133] border border-[#563b9e] shadow-[0_0_20px_rgba(109,40,217,0.15)]'
                                : 'bg-[#0f1523] border border-[#1e293b] hover:bg-[#141b2d] hover:border-[#334155]'
                            }`}
                          >
                            <div className="flex items-center gap-4 relative z-10">
                              <ProductPackageImage pkg={pkg} size="sm" className="group-hover:scale-105 transition-transform duration-300 drop-shadow-md ml-1" />
                              <div className="flex flex-col justify-center gap-1">
                                <div className="flex items-center gap-2.5">
                                  <span className="font-black text-[13px] sm:text-[15px] leading-none text-white">
                                    {pkg.name}
                                  </span>
                                  {pkg.tag && (
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-wider ${
                                      isSelected 
                                        ? 'bg-[#3b275f] text-[#c084fc]' 
                                        : 'bg-[#1e293b] text-slate-400'
                                    }`}>
                                      {pkg.tag}
                                    </span>
                                  )}
                                </div>
                                <span className={`text-[10.5px] font-mono leading-none ${isSelected ? 'text-[#a855f7]' : 'text-slate-500'}`}>
                                  ~{Math.round(pkg.price * 4100).toLocaleString()} ៛
                                </span>
                              </div>
                            </div>
                            
                            <div className={`relative z-10 px-4 py-2 rounded-[14px] flex items-center justify-center min-w-[70px] transition-colors ${
                              isSelected ? 'bg-[#140b2e] border border-[#4c2d96]/30' : 'bg-[#0a0d16] border border-transparent'
                            }`}>
                              <span className={`font-black text-[15px] font-mono leading-none ${isSelected ? 'text-[#22c55e]' : 'text-white'}`}>
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

text, count = pattern_list.subn(new_list, text)
print(f"Replaced {count} instances.")

with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'w', encoding='utf8') as f:
    f.write(text)
