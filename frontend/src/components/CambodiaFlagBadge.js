import React from 'react';

// Precision Vector Cambodia Flag SVG with Angkor Wat Temple
export const CambodiaFlagSvg = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="khBlueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#0B3C9B" />
        <stop offset="100%" stopColor="#03256C" />
      </linearGradient>
      <linearGradient id="khRedGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#EA1E3A" />
        <stop offset="100%" stopColor="#C40F27" />
      </linearGradient>
      <filter id="angkorGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000000" floodOpacity="0.4" />
      </filter>
    </defs>

    {/* Top Blue Stripe */}
    <rect width="60" height="10" fill="url(#khBlueGrad)" />

    {/* Middle Red Stripe */}
    <rect y="10" width="60" height="20" fill="url(#khRedGrad)" />

    {/* Bottom Blue Stripe */}
    <rect y="30" width="60" height="10" fill="url(#khBlueGrad)" />

    {/* Angkor Wat Temple Silhouette */}
    <g fill="#FFFFFF" filter="url(#angkorGlow)" transform="translate(14, 11) scale(0.8)">
      <path d="M20 1L23.5 8H16.5L20 1Z" />
      <rect x="18" y="8" width="4" height="13" />

      <path d="M12 5L15 10H9L12 5Z" />
      <rect x="10.5" y="10" width="3" height="11" />

      <path d="M28 5L31 10H25L28 5Z" />
      <rect x="26.5" y="10" width="3" height="11" />

      <path d="M5 8L7.5 12H2.5L5 8Z" />
      <rect x="4" y="12" width="2" height="9" />

      <path d="M35 8L37.5 12H32.5L35 8Z" />
      <rect x="34" y="12" width="2" height="9" />

      <rect x="2" y="18.5" width="36" height="2.5" rx="0.5" />
      <rect x="0" y="21" width="40" height="3" rx="0.5" />
    </g>
  </svg>
);

// Cyber Metallic Cambodia Flag / Server Badge Frame (Matching Reference Screenshot)
export const CambodiaFlagFrame = ({
  title = "សេវើខ្មែរ",
  subtitle = "5V5",
  sub = "SERVER",
  flagImage = null,
  isFullBadgePng = false,
  className = ""
}) => {
  // If user uploaded a full badge PNG, render it directly
  if (isFullBadgePng && flagImage) {
    return (
      <div className={`relative inline-block rounded-2xl overflow-hidden shadow-2xl ${className}`}>
        <img src={flagImage} alt={title || "Server Badge"} className="h-10 sm:h-12 w-auto object-contain" />
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2 p-1.5 pr-3 rounded-2xl bg-[#090D18]/95 border-2 border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.45)] backdrop-blur-xl select-none ${className}`}
    >
      {/* 3D Round Flag Orb Frame with Golden Ring */}
      <div className="relative w-8 h-8 rounded-xl overflow-hidden ring-2 ring-amber-400 shadow-md shrink-0 flex items-center justify-center bg-slate-950">
        {flagImage ? (
          <img src={flagImage} alt="Server Flag" className="w-full h-full object-cover" />
        ) : (
          <CambodiaFlagSvg className="w-full h-full object-cover scale-110" />
        )}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/30 pointer-events-none" />
      </div>

      {/* 3-Line Text Stack matching reference screenshot */}
      <div className="text-left flex flex-col justify-center leading-tight">
        <div className="text-[11px] sm:text-xs font-black text-amber-300 drop-shadow-sm tracking-wide">
          {title}
        </div>
        {subtitle && (
          <div className="text-[10px] sm:text-[11px] font-black text-amber-300/90 tracking-wide">
            {subtitle}
          </div>
        )}
        {sub && (
          <div className="text-[8px] sm:text-[9px] text-cyan-400 font-extrabold tracking-widest uppercase opacity-95">
            {sub}
          </div>
        )}
      </div>
    </div>
  );
};

// Compact Corner Flag Badge
export const CambodiaCornerBadge = ({ flagImage = null, label = "សេវើខ្មែរ 🇰🇭", className = "" }) => (
  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950/95 border border-amber-400/90 shadow-[0_0_12px_rgba(245,158,11,0.4)] backdrop-blur-md ${className}`}>
    <div className="w-4 h-4 rounded-full overflow-hidden ring-1 ring-amber-300 shrink-0">
      {flagImage ? (
        <img src={flagImage} alt="Server Flag" className="w-full h-full object-cover" />
      ) : (
        <CambodiaFlagSvg className="w-full h-full object-cover" />
      )}
    </div>
    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-amber-300">
      {label}
    </span>
  </div>
);

export default CambodiaFlagFrame;
