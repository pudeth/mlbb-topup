import re

with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'r', encoding='utf8') as f:
    text = f.read()

text = text.replace(
    '<div className="flex items-center gap-1 p-0.5 bg-slate-950 rounded-xl border border-slate-800">',
    '<div className="flex items-center gap-1 p-1 bg-[#0b0f19] rounded-xl border border-slate-800 shadow-inner">'
)

text = text.replace(
    """className={`py-1 px-2.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                      layoutMode === 'tiles'
                        ? 'bg-slate-800 text-cyan-300 border border-slate-700 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}""",
    """className={`py-1.5 px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      layoutMode === 'tiles'
                        ? 'bg-[#1a2538] text-[#38bdf8] border border-[#38bdf8]/40 shadow-sm'
                        : 'text-slate-400 hover:text-white border border-transparent'
                    }`}"""
)

text = text.replace(
    """className={`py-1 px-2.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                      layoutMode === 'grid'
                        ? 'bg-slate-800 text-cyan-300 border border-slate-700 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}""",
    """className={`py-1.5 px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      layoutMode === 'grid'
                        ? 'bg-[#1a2538] text-[#38bdf8] border border-[#38bdf8]/40 shadow-sm'
                        : 'text-slate-400 hover:text-white border border-transparent'
                    }`}"""
)

text = text.replace(
    """className={`py-1 px-2.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                      layoutMode === 'list'
                        ? 'bg-slate-800 text-cyan-300 border border-slate-700 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}""",
    """className={`py-1.5 px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      layoutMode === 'list'
                        ? 'bg-[#1a2538] text-[#38bdf8] border border-[#38bdf8]/40 shadow-sm'
                        : 'text-slate-400 hover:text-white border border-transparent'
                    }`}"""
)

with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'w', encoding='utf8') as f:
    f.write(text)

print("Replaced manually.")
