import re

with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'r', encoding='utf8') as f:
    text = f.read()

# 1. Update left column container
text = text.replace(
    'className="bg-[#0B0F19] border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-4"',
    'className="bg-slate-900/30 border border-slate-800/50 rounded-[24px] p-4 sm:p-5 shadow-2xl backdrop-blur-md space-y-5"'
)

# 2. Update image container
text = text.replace(
    'className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-950 border \nborder-slate-800 shadow-xl group"',
    'className="relative aspect-square w-full rounded-[16px] overflow-hidden bg-slate-950 border border-slate-800/40 shadow-inner group"'
)
text = text.replace(
    'className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl group"',
    'className="relative aspect-square w-full rounded-[16px] overflow-hidden bg-slate-950 border border-slate-800/40 shadow-inner group"'
)

# 3. Update back button
text = text.replace(
    'className="absolute top-3 left-3 w-8 h-8 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white \nflex items-center justify-center font-bold border border-slate-700 shadow-md cursor-pointer transition-all z-10"',
    'className="absolute top-3 left-3 w-8 h-8 rounded-full bg-slate-950/60 hover:bg-slate-900/80 backdrop-blur-md text-slate-300 hover:text-white flex items-center justify-center font-bold border border-slate-700/50 shadow-md cursor-pointer transition-all z-10"'
)
text = text.replace(
    'className="absolute top-3 left-3 w-8 h-8 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white flex items-center justify-center font-bold border border-slate-700 shadow-md cursor-pointer transition-all z-10"',
    'className="absolute top-3 left-3 w-8 h-8 rounded-full bg-slate-950/60 hover:bg-slate-900/80 backdrop-blur-md text-slate-300 hover:text-white flex items-center justify-center font-bold border border-slate-700/50 shadow-md cursor-pointer transition-all z-10"'
)

# 4. Update title and API badge
text = text.replace(
    'className="text-lg sm:text-xl font-black text-white leading-tight"',
    'className="text-xl sm:text-2xl font-black text-white leading-none tracking-wide uppercase"'
)
text = text.replace(
    'className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border \nborder-emerald-500/40 text-[10px] font-black uppercase tracking-wider"',
    'className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-black uppercase tracking-widest shadow-sm"'
)
text = text.replace(
    'className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black uppercase tracking-wider"',
    'className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-black uppercase tracking-widest shadow-sm"'
)

# 5. Update input styling
text = text.replace(
    'className="w-full bg-[#111728] border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white \nfont-mono placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 \ntransition-all shadow-inner"',
    'className="w-full bg-slate-950/50 border border-slate-700/60 rounded-xl px-4 py-3.5 text-sm font-mono text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/50 transition-all shadow-inner"'
)
text = text.replace(
    'className="w-full bg-[#111728] border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all shadow-inner"',
    'className="w-full bg-slate-950/50 border border-slate-700/60 rounded-xl px-4 py-3.5 text-sm font-mono text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/50 transition-all shadow-inner"'
)
text = text.replace(
    'className="w-full bg-[#111728] border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white \nfont-mono placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-all shadow-inner"',
    'className="w-full bg-slate-950/50 border border-slate-700/60 rounded-xl px-4 py-3.5 text-sm font-mono text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/50 transition-all shadow-inner"'
)
text = text.replace(
    'className="w-full bg-[#111728] border border-slate-700 rounded-2xl px-4 py-3 text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-all shadow-inner"',
    'className="w-full bg-slate-950/50 border border-slate-700/60 rounded-xl px-4 py-3.5 text-sm font-mono text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/50 transition-all shadow-inner"'
)

with open(r'd:\TopUP\frontend\src\pages\TopUp.js', 'w', encoding='utf8') as f:
    f.write(text)

print("Styles updated.")
