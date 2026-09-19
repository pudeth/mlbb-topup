import React from 'react';

// Accurate Cambodia Flag SVG — real proportions, accurate Angkor Wat silhouette
export const CambodiaFlagSvg = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 90 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Blue top stripe */}
    <rect width="90" height="15" fill="#032EA1" />
    {/* Red middle stripe */}
    <rect y="15" width="90" height="30" fill="#E00025" />
    {/* Blue bottom stripe */}
    <rect y="45" width="90" height="15" fill="#032EA1" />

    {/* Angkor Wat — white silhouette, centered in red band */}
    <g fill="#FFFFFF" transform="translate(45,30) scale(1,-1) translate(-45,-30)">
      {/* Base platform / ground line */}
      <rect x="18" y="44" width="54" height="2.5" />

      {/* Outer wall / causeway platform */}
      <rect x="20" y="41.5" width="50" height="2.5" />

      {/* Left far tower */}
      <rect x="21" y="34" width="5" height="7.5" />
      <polygon points="21,34 23.5,29 26,34" />

      {/* Left mid tower */}
      <rect x="30" y="32" width="6" height="9.5" />
      <polygon points="30,32 33,26 36,32" />

      {/* Center main tower (tallest) */}
      <rect x="40" y="28" width="10" height="13.5" />
      <polygon points="40,28 45,19 50,28" />
      {/* center tower top finial */}
      <polygon points="43.5,19 45,15.5 46.5,19" />

      {/* Right mid tower */}
      <rect x="54" y="32" width="6" height="9.5" />
      <polygon points="54,32 57,26 60,32" />

      {/* Right far tower */}
      <rect x="64" y="34" width="5" height="7.5" />
      <polygon points="64,34 66.5,29 69,34" />

      {/* Connecting gallery roofline (left) */}
      <rect x="26" y="38" width="14" height="3.5" />
      {/* Connecting gallery roofline (right) */}
      <rect x="50" y="38" width="14" height="3.5" />
    </g>
  </svg>
);

// Cyber Metallic Cambodia Flag / Server Badge Frame
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
      {/* Flag orb with golden ring */}
      <div className="relative w-9 h-9 rounded-xl overflow-hidden ring-2 ring-amber-400 shadow-md shrink-0 flex items-center justify-center bg-slate-950">
        {flagImage ? (
          <img src={flagImage} alt="Server Flag" className="w-full h-full object-cover" />
        ) : (
          <CambodiaFlagSvg className="w-full h-full" />
        )}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/20 pointer-events-none" />
      </div>

      {/* Text */}
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
    <div className="w-5 h-5 rounded-full overflow-hidden ring-1 ring-amber-300 shrink-0">
      {flagImage ? (
        <img src={flagImage} alt="Server Flag" className="w-full h-full object-cover" />
      ) : (
        <CambodiaFlagSvg className="w-full h-full" />
      )}
    </div>
    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-amber-300">
      {label}
    </span>
  </div>
);

export default CambodiaFlagFrame;
