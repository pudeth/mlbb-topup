import React from 'react';

// Accurate Cambodia Flag using official flag-icons package
export const CambodiaFlagSvg = ({ className = "w-full h-full" }) => (
  <span className={`fi fi-kh ${className} inline-block bg-center bg-cover rounded-xs`} />
);

/**
 * 3D Spherical Cambodia Flag Orb Component
 * Fills 100% of the circle with genuine Cambodian royal blue and red stripes,
 * centered Angkor Wat, 3D specular convex glass highlight, and depth vignette.
 */
export const CambodiaSphericalFlag = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <clipPath id="cambodiaSphereClip">
        <circle cx="50" cy="50" r="49.5" />
      </clipPath>
      {/* 3D Convex Glass Dome Specular Glint */}
      <radialGradient id="sphereGlint" cx="35%" cy="25%" r="60%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
        <stop offset="25%" stopColor="#FFFFFF" stopOpacity="0.22" />
        <stop offset="55%" stopColor="#FFFFFF" stopOpacity="0" />
      </radialGradient>
      {/* 3D Spherical Edge Shadow & Ambient Occlusion */}
      <radialGradient id="sphereEdgeDepth" cx="50%" cy="50%" r="50%">
        <stop offset="68%" stopColor="#000000" stopOpacity="0" />
        <stop offset="90%" stopColor="#000000" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0.75" />
      </radialGradient>
    </defs>

    <g clipPath="url(#cambodiaSphereClip)">
      {/* Full-Frame Cambodia Flag */}
      <image
        href="/kh.svg"
        x="0"
        y="0"
        width="100"
        height="100"
        preserveAspectRatio="xMidYMid slice"
      />
      {/* 3D Spherical Lighting Overlay */}
      <circle cx="50" cy="50" r="49.5" fill="url(#sphereGlint)" pointerEvents="none" />
      <circle cx="50" cy="50" r="49.5" fill="url(#sphereEdgeDepth)" pointerEvents="none" />
    </g>
  </svg>
);

/**
 * MLBB Esports Cyber Metallic Cambodia Flag & Server Badge Frame
 * Uses the authentic high-resolution frame template provided by the user,
 * perfectly aligning the official full-frame 3D Cambodia flag in the medallion,
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
        <img src={flagImage} alt={title || "Server Badge"} className="h-10 sm:h-12 md:h-14 w-auto object-contain" />
      </div>
    );
  }

  return (
    <div
      className={`relative inline-block select-none filter drop-shadow-[0_6px_20px_rgba(0,0,0,0.85)] transition-transform duration-300 hover:scale-[1.03] ${className}`}
      style={{
        width: 'clamp(155px, 22vw, 230px)',
        aspectRatio: '1024 / 397'
      }}
    >
      {/* 1. Full-Frame 3D Spherical Cambodia Flag inside the circular medallion */}
      <div
        className="absolute rounded-full overflow-hidden flex items-center justify-center z-0 shadow-lg"
        style={{
          left: '10.3%',
          top: '16.1%',
          width: '22.6%',
          height: '57.8%'
        }}
      >
        {flagImage ? (
          <img src={flagImage} alt="Server Flag" className="w-full h-full object-cover" />
        ) : (
          <CambodiaSphericalFlag className="w-full h-full block" />
        )}
      </div>

      {/* 2. Pristine 3D Chiseled Gold & Navy Frame Template */}
      <img
        src="/mlbb-server-frame-cutout.png"
        alt="MLBB Server Frame"
        className="relative z-10 w-full h-full object-contain pointer-events-none"
        draggable={false}
        onError={(e) => {
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
          fontSize: 'clamp(9.5px, 1.35vw, 15.5px)',
          letterSpacing: '0.02em',
          background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF4B8 22%, #FBBF24 52%, #D97706 78%, #78350F 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 1.5px 0px #78350F) drop-shadow(0 3px 6px rgba(0,0,0,0.9))'
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
          fontSize: 'clamp(6.5px, 0.85vw, 10px)',
          letterSpacing: '0.22em',
          color: '#7DD3FC',
          textShadow: '0 0 6px rgba(56, 189, 248, 0.95), 0 0 12px rgba(56, 189, 248, 0.6)'
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

