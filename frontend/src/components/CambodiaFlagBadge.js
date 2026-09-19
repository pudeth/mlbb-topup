import React from 'react';

// Accurate Cambodia Flag using official flag-icons package
export const CambodiaFlagSvg = ({ className = "w-full h-full" }) => (
  <span className={`fi fi-kh ${className} inline-block bg-center bg-cover rounded-xs`} />
);

/**
 * MLBB Esports Cyber Metallic Cambodia Flag & Server Badge Frame
 * Uses the authentic high-resolution frame template provided by the user,
 * perfectly aligning the official Cambodia flag in the 3D medallion,
 * with gold chrome typography and glowing cyan SERVER capsule.
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
      className={`relative inline-block select-none filter drop-shadow-[0_8px_24px_rgba(0,0,0,0.85)] transition-transform duration-300 hover:scale-[1.03] ${className}`}
      style={{
        width: 'clamp(200px, 24vw, 290px)',
        aspectRatio: '1024 / 397'
      }}
    >
      {/* 1. Underlying Cambodia Flag inside the circular medallion */}
      <div
        className="absolute rounded-full overflow-hidden flex items-center justify-center z-0"
        style={{
          left: '10.45%',
          top: '16.37%',
          width: '22.26%',
          height: '57.43%'
        }}
      >
        {flagImage ? (
          <img src={flagImage} alt="Server Flag" className="w-full h-full object-cover" />
        ) : (
          <span className="fi fi-kh fis w-full h-full block bg-center bg-cover scale-105" />
        )}

        {/* 3D Convex Glass Dome Specular Reflection Highlight */}
        <div
          className="absolute inset-0 pointer-events-none rounded-full"
          style={{
            background: 'radial-gradient(circle at 38% 26%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.12) 38%, transparent 65%)'
          }}
        />
        {/* Spherical edge shadow (vignette) */}
        <div className="absolute inset-0 pointer-events-none rounded-full shadow-[inset_0_0_8px_rgba(0,0,0,0.8)]" />
      </div>

      {/* 2. Pristine 3D Chiseled Gold & Navy Frame Template */}
      <img
        src="/mlbb-server-frame-cutout.png"
        alt="MLBB Server Frame"
        className="relative z-10 w-full h-full object-contain pointer-events-none"
        draggable={false}
        onError={(e) => {
          // Fallback to intact template if cutout is missing
          e.target.onerror = null;
          e.target.src = '/mlbb-server-frame-template.png';
        }}
      />

      {/* 3. Main 3D Metallic Gold Title */}
      <div
        className="absolute z-20 flex items-center justify-center text-center font-black font-khmer whitespace-nowrap pointer-events-none"
        style={{
          left: '58.5%',
          top: '44.5%',
          transform: 'translate(-50%, -50%)',
          width: '54%',
          fontSize: 'clamp(11px, 1.4vw, 17px)',
          letterSpacing: '0.02em',
          background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF4B8 22%, #FBBF24 52%, #D97706 78%, #78350F 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 2px 0px #78350F) drop-shadow(0 3px 6px rgba(0,0,0,0.9))'
        }}
      >
        {title}
      </div>

      {/* 4. Glowing Cyan Capsule Text ("SERVER") */}
      <div
        className="absolute z-20 flex items-center justify-center text-center font-black font-mono uppercase whitespace-nowrap pointer-events-none"
        style={{
          left: '58.5%',
          top: '70.8%',
          transform: 'translate(-50%, -50%)',
          width: '42%',
          fontSize: 'clamp(7.5px, 0.9vw, 11px)',
          letterSpacing: '0.24em',
          color: '#7DD3FC',
          textShadow: '0 0 8px rgba(56, 189, 248, 0.95), 0 0 16px rgba(56, 189, 248, 0.6)'
        }}
      >
        {sub}
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

