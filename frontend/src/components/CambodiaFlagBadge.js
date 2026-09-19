import React from 'react';

// Accurate Cambodia Flag using official flag-icons package
export const CambodiaFlagSvg = ({ className = "w-full h-full" }) => (
  <span className={`fi fi-kh ${className} inline-block bg-center bg-cover rounded-xs`} />
);

/**
 * MLBB Esports Cyber Metallic Cambodia Flag & Server Badge Frame
 * Faithfully matches the 3D chiseled gold frame, cyan crystal diamond,
 * royal crown filigree, 3D metallic typography, and glowing SERVER capsule.
 */
export const CambodiaFlagFrame = ({
  title = "សេវើខ្មែរ 5v5",
  subtitle = "5V5",
  sub = "SERVER",
  flagImage = null,
  isFullBadgePng = false,
  className = ""
}) => {
  // If user explicitly requests full badge PNG or provides a custom image
  if (isFullBadgePng && flagImage) {
    return (
      <div className={`relative inline-block overflow-hidden filter drop-shadow-[0_8px_20px_rgba(0,0,0,0.65)] ${className}`}>
        <img src={flagImage} alt={title || "Server Badge"} className="h-11 sm:h-14 md:h-16 w-auto object-contain" />
      </div>
    );
  }

  return (
    <div
      className={`relative inline-flex items-center select-none filter drop-shadow-[0_8px_24px_rgba(0,0,0,0.8)] transition-transform duration-300 hover:scale-[1.02] ${className}`}
      style={{ minHeight: '60px' }}
    >
      {/* ================= BACKGROUND CHISELED GOLD & NAVY PLATE ================= */}
      <div className="relative flex items-center pl-10 sm:pl-12 pr-4 sm:pr-6 py-2 sm:py-2.5 ml-5 sm:ml-6 rounded-r-xl overflow-visible">
        
        {/* Outer Gold Chamfered Bezel */}
        <div
          className="absolute inset-0 rounded-r-xl"
          style={{
            background: 'linear-gradient(135deg, #FDE68A 0%, #D97706 25%, #78350F 50%, #F59E0B 75%, #FDE68A 100%)',
            clipPath: 'polygon(0% 0%, calc(100% - 14px) 0%, 100% 14px, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0% 100%)',
            padding: '2.5px',
            boxShadow: '0 0 16px rgba(245, 158, 11, 0.35)'
          }}
        >
          {/* Inner Metallic Dark Sapphire Blue Plate */}
          <div
            className="w-full h-full relative"
            style={{
              background: 'radial-gradient(ellipse at 50% 25%, #13336B 0%, #081B3E 55%, #030B1C 100%)',
              clipPath: 'polygon(0% 0%, calc(100% - 12px) 0%, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0% 100%)'
            }}
          >
            {/* Top inner rim lighting */}
            <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />
            {/* Bottom cyan energy pulse flare */}
            <div className="absolute inset-x-4 bottom-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_8px_#38BDF8]" />
          </div>
        </div>

        {/* Outer Gold Chamfer Corner Facet (Right edge 3D corner) */}
        <div
          className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-7 bg-gradient-to-b from-amber-200 via-amber-500 to-amber-800 shadow-md pointer-events-none"
          style={{
            clipPath: 'polygon(0% 15%, 100% 50%, 0% 85%)'
          }}
        />

        {/* ================= TEXT & CROWN CONTENT ================= */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center pl-1 sm:pl-2">
          
          {/* Top Royal Crown with Filigree Wings */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-0.5">
            <span className="w-4 sm:w-6 h-[1px] bg-gradient-to-r from-transparent to-amber-300/80" />
            <svg
              className="w-3.5 h-3 sm:w-4 sm:h-3.5 fill-current text-amber-300 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
              viewBox="0 0 24 24"
            >
              <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
            </svg>
            <span className="w-4 sm:w-6 h-[1px] bg-gradient-to-l from-transparent to-amber-300/80" />
          </div>

          {/* Main 3D Metallic Gold Title */}
          <div
            className="font-black text-sm sm:text-base md:text-lg tracking-wide leading-none font-khmer px-1 select-none"
            style={{
              background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF4B8 22%, #FBBF24 55%, #D97706 78%, #78350F 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 2px 0px #78350F) drop-shadow(0 4px 8px rgba(0,0,0,0.85))'
            }}
          >
            {title}
          </div>

          {/* Bottom Glowing Cyan SERVER Capsule */}
          <div className="mt-1 sm:mt-1.5 flex items-center justify-center">
            <div
              className="relative px-3 sm:px-4 py-0.5 bg-[#030C1C]/90 border border-cyan-400/90 shadow-[0_0_10px_rgba(56,189,248,0.7),inset_0_0_6px_rgba(56,189,248,0.3)] flex items-center justify-center"
              style={{
                clipPath: 'polygon(7px 0%, calc(100% - 7px) 0%, 100% 50%, calc(100% - 7px) 100%, 7px 100%, 0% 50%)'
              }}
            >
              {/* Left / Right Neon Glints */}
              <span className="absolute left-1 w-1 h-1 rounded-full bg-cyan-300 shadow-[0_0_4px_#38BDF8]" />
              <span className="absolute right-1 w-1 h-1 rounded-full bg-cyan-300 shadow-[0_0_4px_#38BDF8]" />
              
              <span
                className="text-[9px] sm:text-[10px] font-black text-cyan-300 tracking-[0.2em] uppercase font-mono drop-shadow-[0_0_6px_rgba(56,189,248,0.9)]"
              >
                {sub}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= LEFT 3D GOLD MEDALLION & CAMBODIA FLAG ================= */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center">
        
        {/* Outer Faceted Armor Frame */}
        <div
          className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.9)]"
          style={{
            background: 'conic-gradient(from 180deg, #FDE68A, #D97706, #78350F, #F59E0B, #FFFBEB, #D97706, #78350F, #FDE68A)',
            padding: '3px'
          }}
        >
          {/* Top Cyan Diamond Crystal Gem */}
          <div
            className="absolute -top-1.5 sm:-top-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 z-30 filter drop-shadow-[0_0_8px_rgba(56,189,248,1)] flex items-center justify-center"
            style={{
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
              background: 'linear-gradient(135deg, #FFFFFF 0%, #BAE6FD 30%, #38BDF8 60%, #0284C7 100%)',
              border: '1px solid #E0F2FE'
            }}
          >
            {/* Inner jewel shine */}
            <div className="w-1.5 h-1.5 bg-white rounded-full opacity-80 animate-pulse" />
          </div>

          {/* Bottom Gold Pointed Chevron */}
          <div
            className="absolute -bottom-1 sm:-bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-2.5 z-30"
            style={{
              clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
              background: 'linear-gradient(180deg, #F59E0B 0%, #78350F 100%)'
            }}
          />

          {/* Middle Chiseled Groove Ring */}
          <div
            className="w-full h-full rounded-full p-[2px] flex items-center justify-center"
            style={{
              background: 'linear-gradient(180deg, #78350F 0%, #172554 50%, #78350F 100%)'
            }}
          >
            {/* Inner Golden Bezel Ring */}
            <div
              className="w-full h-full rounded-full p-[2px] flex items-center justify-center overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #FFFBEB 0%, #F59E0B 40%, #B45309 80%, #FFFBEB 100%)'
              }}
            >
              {/* Inner Spherical Convex Flag Orb with Glass Dome */}
              <div className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-slate-950 shadow-inner">
                
                {flagImage ? (
                  <img src={flagImage} alt="Flag" className="w-full h-full object-cover" />
                ) : (
                  <span className="fi fi-kh fis w-full h-full block bg-center bg-cover scale-110" />
                )}

                {/* 3D Convex Glass Dome Specular Reflection */}
                <div
                  className="absolute inset-0 pointer-events-none rounded-full"
                  style={{
                    background: 'radial-gradient(circle at 35% 25%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.15) 35%, transparent 60%)'
                  }}
                />
                {/* Spherical edge shadow (vignette) */}
                <div
                  className="absolute inset-0 pointer-events-none rounded-full shadow-[inset_0_0_8px_rgba(0,0,0,0.8)]"
                />
              </div>
            </div>
          </div>
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

