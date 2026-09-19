import re

with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'r', encoding='utf8') as f:
    text = f.read()

text = re.sub(
    r'className=\{\`py-1 px-2\.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all \ncursor-pointer \$\{\n\s*layoutMode === \'tiles\'\n\s*\? \'bg-slate-800 text-cyan-300 border border-slate-700 shadow-sm\'\n\s*: \'text-slate-400 hover:text-white\'\n\s*\}\`\}',
    r"className={`py-1.5 px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${\n                      layoutMode === 'tiles'\n                        ? 'bg-[#1a2538] text-[#38bdf8] border border-[#38bdf8]/40 shadow-sm'\n                        : 'text-slate-400 hover:text-white border border-transparent'\n                    }`}",
    text
)

text = re.sub(
    r'className=\{\`py-1 px-2\.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all \ncursor-pointer \$\{\n\s*layoutMode === \'grid\'\n\s*\? \'bg-slate-800 text-cyan-300 border border-slate-700 shadow-sm\'\n\s*: \'text-slate-400 hover:text-white\'\n\s*\}\`\}',
    r"className={`py-1.5 px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${\n                      layoutMode === 'grid'\n                        ? 'bg-[#1a2538] text-[#38bdf8] border border-[#38bdf8]/40 shadow-sm'\n                        : 'text-slate-400 hover:text-white border border-transparent'\n                    }`}",
    text
)

text = re.sub(
    r'className=\{\`py-1 px-2\.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all \ncursor-pointer \$\{\n\s*layoutMode === \'list\'\n\s*\? \'bg-slate-800 text-cyan-300 border border-slate-700 shadow-sm\'\n\s*: \'text-slate-400 hover:text-white\'\n\s*\}\`\}',
    r"className={`py-1.5 px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${\n                      layoutMode === 'list'\n                        ? 'bg-[#1a2538] text-[#38bdf8] border border-[#38bdf8]/40 shadow-sm'\n                        : 'text-slate-400 hover:text-white border border-transparent'\n                    }`}",
    text
)

with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'w', encoding='utf8') as f:
    f.write(text)

print("Toggles buttons updated using regex!")
