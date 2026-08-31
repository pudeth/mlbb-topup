import React from 'react';

const Support = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fadeIn">
      <div className="text-center mb-10">
        <span className="badge badge-purple text-xs mb-2">🎧 24/7 Customer Care</span>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Help & Support Center</h1>
        <p className="text-slate-400 text-sm mt-1">Get instant help with your MLBB diamond recharge orders</p>
      </div>

      {/* Direct Contact Channels (Telegram & Facebook) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-10 max-w-3xl mx-auto">
        {/* Card 1: Telegram */}
        <div className="card border border-slate-800 p-6 flex items-start gap-4 hover:border-sky-500/50 transition-all bg-[#0B0F19]/90 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-2xl text-sky-400 shrink-0 shadow-glow-cyan">
            ✈️
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white text-base mb-1">Telegram Live Chat</h3>
            <p className="text-xs text-slate-400 mb-3">Instant response from our support team 24/7</p>
            <a
              href="https://t.me/Peak_Deth"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition-all active:scale-95"
            >
              <span>Open Telegram (@Peak_Deth)</span>
              <span>→</span>
            </a>
          </div>
        </div>

        {/* Card 2: Facebook Official Page */}
        <div className="card border border-slate-800 p-6 flex items-start gap-4 hover:border-blue-500/50 transition-all bg-[#0B0F19]/90 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-2xl text-blue-400 shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            🌐
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white text-base mb-1">Facebook Official Page</h3>
            <p className="text-xs text-slate-400 mb-3">Follow & chat on our official Facebook page</p>
            <a
              href="https://www.facebook.com/share/1LaL3TxfWD/?mibextid=wwXIfr"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all active:scale-95"
            >
              <span>Open Facebook Page</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
