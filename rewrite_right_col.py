import re

with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'r', encoding='utf8') as f:
    text = f.read()

text = text.replace(
    'className="bg-[#0B0F19] border border-slate-800 rounded-3xl p-3.5 sm:p-5 shadow-2xl space-y-3.5"',
    'className="bg-slate-900/30 border border-slate-800/50 rounded-[24px] p-3.5 sm:p-5 shadow-2xl backdrop-blur-md space-y-5"'
)

text = text.replace(
    'className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950/90 rounded-2xl border border-slate-800/90 \nshadow-inner"',
    'className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950/60 rounded-full border border-slate-800/40 shadow-inner"'
)

text = text.replace(
    'className={`py-2 px-2 rounded-xl text-xs font-bold transition-all text-center flex items-center \njustify-center gap-1 cursor-pointer ${',
    'className={`py-2 px-2 rounded-full text-[11px] sm:text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${'
)

text = text.replace(
    'bg-gradient-to-r from-amber-400 to-amber-500 text-black font-black shadow-md \nshadow-amber-500/20 scale-[1.02]',
    'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/30'
)

text = text.replace(
    'bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-black shadow-md shadow-cyan-500/20 \nscale-[1.02]',
    'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/30'
)

text = text.replace(
    'bg-gradient-to-r from-purple-400 to-pink-500 text-black font-black shadow-md \nshadow-purple-500/20 scale-[1.02]',
    'bg-[#7a3bf2] text-white font-black shadow-md shadow-purple-500/30'
)

with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'w', encoding='utf8') as f:
    f.write(text)

print("Right col tabs updated.")
