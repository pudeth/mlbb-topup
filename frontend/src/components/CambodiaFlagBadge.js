import React from 'react';

// Accurate Cambodia Flag using official flag-icons package
export const CambodiaFlagSvg = ({ className = "w-full h-full" }) => (
  <span className={`fi fi-kh ${className} inline-block bg-center bg-cover rounded-xs`} />
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

  // Deduplicate title / subtitle if 5v5 is already in title
  const has5v5InTitle = /5v5/i.test(title);
  const displaySubtitle = has5v5InTitle && /5v5/i.test(subtitle) ? "" : subtitle;

  return (
    <div
      className={`inline-flex items-center gap-2.5 p-1.5 pr-3.5 rounded-2xl bg-[#090D18]/95 border-2 border-amber-400 shadow-[0_0_18px_rgba(251,191,36,0.45)] backdrop-blur-xl select-none ${className}`}
    >
      {/* Flag orb with golden ring */}
      <div className="relative w-10 h-10 rounded-xl overflow-hidden ring-2 ring-amber-400 shadow-md shrink-0 flex items-center justify-center bg-slate-950">
        {flagImage ? (
          <img src={flagImage} alt="Server Flag" className="w-full h-full object-cover" />
        ) : (
          <span className="fi fi-kh fis text-2xl w-full h-full flex items-center justify-center bg-center bg-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/20 pointer-events-none" />
      </div>

      {/* Text */}
      <div className="text-left flex flex-col justify-center leading-tight">
        <div className="text-xs sm:text-sm font-black text-amber-300 drop-shadow-sm tracking-wide font-khmer">
          {title}
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          {displaySubtitle && (
            <span className="text-[10px] sm:text-[11px] font-black text-white/90 tracking-wide font-mono">
              {displaySubtitle}
            </span>
          )}
          {displaySubtitle && sub && <span className="text-slate-500 text-[9px]">•</span>}
          {sub && (
            <span className="text-[9px] sm:text-[10px] text-cyan-400 font-black tracking-wider uppercase drop-shadow-xs">
              {sub}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// Compact Corner Flag Badge
export const CambodiaCornerBadge = ({ flagImage = null, label = "សេវើខ្មែរ 🇰🇭", className = "" }) => (
  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950/95 border border-amber-400/90 shadow-[0_0_12px_rgba(245,158,11,0.4)] backdrop-blur-md ${className}`}>
    <div className="w-5 h-5 rounded-full overflow-hidden ring-1 ring-amber-300 shrink-0 flex items-center justify-center">
      {flagImage ? (
        <img src={flagImage} alt="Server Flag" className="w-full h-full object-cover" />
      ) : (
        <span className="fi fi-kh fis w-full h-full block bg-center bg-cover" />
      )}
    </div>
    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-amber-300">
      {label}
    </span>
  </div>
);

export default CambodiaFlagFrame;
