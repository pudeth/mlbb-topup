import React from 'react';

// Popular gaming country flags catalog
export const POPULAR_FLAGS = [
  { id: 'kh', name: 'Cambodia', local: 'កម្ពុជា', t1: 'សេវើខ្មែរ 5v5', t2: '5V5', t3: 'SERVER' },
  { id: 'ph', name: 'Philippines', local: 'Pilipinas', t1: 'PH SERVER', t2: '5V5', t3: 'OFFICIAL' },
  { id: 'id', name: 'Indonesia', local: 'Indonesia', t1: 'ID SERVER', t2: '5V5', t3: 'FAST' },
  { id: 'my', name: 'Malaysia', local: 'Malaysia', t1: 'MY SERVER', t2: '5V5', t3: 'DIRECT' },
  { id: 'sg', name: 'Singapore', local: 'Singapore', t1: 'SG SERVER', t2: '5V5', t3: 'INSTANT' },
  { id: 'th', name: 'Thailand', local: 'ไทย', t1: 'TH SERVER', t2: '5V5', t3: 'OFFICIAL' },
  { id: 'vn', name: 'Vietnam', local: 'Việt Nam', t1: 'VN SERVER', t2: '5V5', t3: 'VIP' },
  { id: 'mm', name: 'Myanmar', local: 'မြန်မာ', t1: 'MM SERVER', t2: '5V5', t3: 'DIRECT' },
  { id: 'br', name: 'Brazil', local: 'Brasil', t1: 'BR SERVER', t2: '5V5', t3: 'FAST' },
  { id: 'global', name: 'Global Server', local: 'Worldwide', t1: 'GLOBAL UC', t2: '⚡', t3: 'DIRECT' },
  { id: 'custom', name: 'Custom Upload', local: 'Custom File', t1: 'CUSTOM', t2: '', t3: 'SERVER' },
  { id: 'none', name: 'No Badge', local: 'Disabled', t1: '', t2: '', t3: '' },
];

export const MORE_WORLD_FLAGS = [
  { id: 'us', name: 'United States', t1: 'US SERVER', t2: 'NA', t3: 'OFFICIAL' },
  { id: 'jp', name: 'Japan', t1: 'JP SERVER', t2: 'ASIA', t3: 'DIRECT' },
  { id: 'kr', name: 'South Korea', t1: 'KR SERVER', t2: 'ASIA', t3: 'FAST' },
  { id: 'la', name: 'Laos', t1: 'LAOS SERVER', t2: 'SEA', t3: 'DIRECT' },
  { id: 'in', name: 'India', t1: 'IN SERVER', t2: 'SA', t3: 'OFFICIAL' },
  { id: 'cn', name: 'China', t1: 'CN SERVER', t2: 'ASIA', t3: 'FAST' },
  { id: 'gb', name: 'United Kingdom', t1: 'UK SERVER', t2: 'EU', t3: 'DIRECT' },
  { id: 'de', name: 'Germany', t1: 'DE SERVER', t2: 'EU', t3: 'OFFICIAL' },
  { id: 'fr', name: 'France', t1: 'FR SERVER', t2: 'EU', t3: 'DIRECT' },
  { id: 'ru', name: 'Russia', t1: 'RU SERVER', t2: 'CIS', t3: 'FAST' },
  { id: 'tr', name: 'Turkey', t1: 'TR SERVER', t2: 'MENA', t3: 'DIRECT' },
  { id: 'sa', name: 'Saudi Arabia', t1: 'SA SERVER', t2: 'MENA', t3: 'OFFICIAL' },
  { id: 'ae', name: 'UAE (Dubai)', t1: 'UAE SERVER', t2: 'MENA', t3: 'FAST' },
];

export const ALL_FLAG_OPTIONS = [
  ...POPULAR_FLAGS,
  ...MORE_WORLD_FLAGS,
];

// Accurate Cambodia Flag using official flag-icons package
export const CambodiaFlagSvg = ({ className = "w-full h-full" }) => (
  <span className={`fi fi-kh ${className} inline-block bg-center bg-cover rounded-xs`} />
);

let flagUniqueCounter = 0;

/**
 * Universal 3D Spherical Full-Frame Country Flag Orb
 * Fills 100% edge-to-edge of the circular frame for ALL countries (Cambodia, Philippines, Myanmar, etc.)
 * Pure vector rendering, zero shadow box, with clean crystal glass sheen highlight.
 */
export const UniversalSphericalFlag = ({
  flagType = 'kh',
  flagImage = null,
  className = "w-full h-full"
}) => {
  const normType = (flagType || 'kh').toLowerCase();
  const instanceId = React.useMemo(() => ++flagUniqueCounter, []);
  const clipId = `sphereClip_${normType}_${instanceId}`;
  const glintId = `sphereGlint_${normType}_${instanceId}`;

  // 1. Custom uploaded flag image
  if (flagImage) {
    return (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id={clipId}>
            <circle cx="50" cy="50" r="50" />
          </clipPath>
          <radialGradient id={glintId} cx="35%" cy="25%" r="60%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.38" />
            <stop offset="25%" stopColor="#FFFFFF" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g clipPath={`url(#${clipId})`}>
          <image
            href={flagImage}
            x="0"
            y="0"
            width="100"
            height="100"
            preserveAspectRatio="xMidYMid slice"
          />
          <circle cx="50" cy="50" r="50" fill={`url(#${glintId})`} pointerEvents="none" />
        </g>
      </svg>
    );
  }

  // 2. Global Esports server sphere
  if (normType === 'global') {
    return (
      <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id={clipId}>
            <circle cx="50" cy="50" r="50" />
          </clipPath>
          <radialGradient id={glintId} cx="35%" cy="25%" r="60%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
            <stop offset="25%" stopColor="#FFFFFF" stopOpacity="0.12" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`globalBg_${instanceId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="50%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#4338ca" />
          </linearGradient>
        </defs>
        <g clipPath={`url(#${clipId})`}>
          <rect width="100" height="100" fill={`url(#globalBg_${instanceId})`} />
          <circle cx="50" cy="50" r="36" fill="none" stroke="#FFFFFF" strokeWidth="3.2" opacity="0.85" />
          <line x1="14" y1="50" x2="86" y2="50" stroke="#FFFFFF" strokeWidth="3.2" opacity="0.85" />
          <ellipse cx="50" cy="50" rx="18" ry="36" fill="none" stroke="#FFFFFF" strokeWidth="3.2" opacity="0.85" />
          <circle cx="50" cy="50" r="50" fill={`url(#${glintId})`} pointerEvents="none" />
        </g>
      </svg>
    );
  }

  // 3. Official Country Flag SVG (KH, PH, MM, ID, MY, SG, TH, VN, etc.)
  const flagSrc = normType === 'kh' ? '/kh.svg' : `/flags/4x3/${normType}.svg`;

  return (
    <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id={clipId}>
          <circle cx="50" cy="50" r="50" />
        </clipPath>
        {/* Soft Clean Glass Highlight - zero dark shadows */}
        <radialGradient id={glintId} cx="35%" cy="25%" r="60%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
          <stop offset="25%" stopColor="#FFFFFF" stopOpacity="0.1" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g clipPath={`url(#${clipId})`}>
        {/* Full-Frame Flag SVG - 100% edge-to-edge spherical filling */}
        <image
          href={flagSrc}
          x="0"
          y="0"
          width="100"
          height="100"
          preserveAspectRatio="xMidYMid slice"
        />
        {/* Light Clean Shine Overlay Only */}
        <circle cx="50" cy="50" r="50" fill={`url(#${glintId})`} pointerEvents="none" />
      </g>
    </svg>
  );
};

/**
 * 3D Spherical Cambodia Flag Orb Component (Kept for backwards compatibility)
 */
export const CambodiaSphericalFlag = ({ className = "w-full h-full" }) => (
  <UniversalSphericalFlag flagType="kh" className={className} />
);

/**
 * Dynamic Universal Flag Medallion
 * Renders any chosen country flag, custom image, or global esports icon inside the badge frame medallion
 */
export const DynamicFlagMedallion = ({ flagType = 'kh', flagImage = null, className = "w-full h-full" }) => {
  return <UniversalSphericalFlag flagType={flagType} flagImage={flagImage} className={className} />;
};

/**
 * MLBB Esports Server Badge Frame with 3 Selectable Layouts:
 * - 'gold_cyber' (Layout 1): Classic MLBB 3D chiseled gold frame template with flag medallion and 3 text lines
 * - 'cyber_pill' (Layout 2): Modern sleek glass capsule ribbon with cyber neon accents
 * - 'esports_shield' (Layout 3): Compact tournament shield crest with golden bezel
 */
export const CambodiaFlagFrame = ({
  title = "សេវើខ្មែរ 5v5",
  subtitle = "5V5",
  sub = "SERVER",
  flagType = "kh",
  flagImage = null,
  isFullBadgePng = false,
  badgeStyle = "gold_cyber", // 'gold_cyber' | 'cyber_pill' | 'esports_shield'
  className = ""
}) => {
  // Sanitize title: strip emoji flag regional indicators (e.g. 🇵🇭 which render as letters PH) and collapse duplicates
  const sanitizedTitle = (title || '')
    .replace(/[\uD83C][\uDDE6-\uDDFF]{2}/g, '')
    .replace(/\bPH\s+PH\b/gi, 'PH')
    .replace(/\bID\s+ID\b/gi, 'ID')
    .replace(/\bKH\s+KH\b/gi, 'KH')
    .replace(/\bMM\s+MM\b/gi, 'MM')
    .trim() || 'សេវើខ្មែរ 5v5';

  // If user explicitly requests full badge PNG or provides a custom transparent PNG
  if (isFullBadgePng && flagImage) {
    return (
      <div className={`relative inline-block overflow-hidden ${className}`}>
        <img src={flagImage} alt={sanitizedTitle || "Server Badge"} className="h-10 sm:h-12 md:h-14 w-auto object-contain" />
      </div>
    );
  }

  // ----------------------------------------------------
  // LAYOUT 2: Cyber Glass Pill Ribbon (Sleek Modern Capsule)
  // ----------------------------------------------------
  if (badgeStyle === 'cyber_pill') {
    return (
      <div
        className={`relative inline-flex items-center gap-1.5 px-2 py-0.5 sm:py-1 rounded-full bg-slate-950/90 border border-amber-400/80 backdrop-blur-md select-none transition-transform duration-300 hover:scale-[1.03] ${className}`}
        style={{ maxWidth: '175px' }}
      >
        {/* Left Flag Orb */}
        <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full ring-1 ring-amber-300 shrink-0 overflow-hidden flex items-center justify-center">
          <DynamicFlagMedallion flagType={flagType} flagImage={flagImage} />
        </div>

        {/* Title */}
        <span className="font-black text-[9px] sm:text-[10px] tracking-wider uppercase truncate text-amber-300 font-khmer">
          {sanitizedTitle}
        </span>

        {/* Subtitle / Tag */}
        {sub && (
          <span className="px-1.5 py-0.2 rounded-md bg-cyan-950/90 text-cyan-300 border border-cyan-500/50 text-[7px] sm:text-[8px] font-black font-mono tracking-widest uppercase shrink-0">
            {sub}
          </span>
        )}
      </div>
    );
  }

  // ----------------------------------------------------
  // LAYOUT 3: Esports Tournament Shield Crest
  // ----------------------------------------------------
  if (badgeStyle === 'esports_shield') {
    return (
      <div
        className={`relative inline-flex items-center gap-1.5 p-1 pr-2 rounded-xl bg-gradient-to-r from-[#10192e] via-[#0b1222] to-[#121c33] border border-amber-400/90 select-none transition-transform duration-300 hover:scale-[1.03] ${className}`}
      >
        {/* Shield Hex / Circle Medallion */}
        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full ring-1.5 ring-amber-400/80 overflow-hidden shrink-0 flex items-center justify-center bg-slate-900">
          <DynamicFlagMedallion flagType={flagType} flagImage={flagImage} />
        </div>

        {/* Stacked Text Labels */}
        <div className="flex flex-col text-left leading-tight">
          <span className="font-black text-[9px] sm:text-[10px] uppercase tracking-wide text-amber-300 font-khmer truncate">
            {sanitizedTitle}
          </span>
          <div className="flex items-center gap-1">
            {subtitle && (
              <span className="text-[7px] font-black text-amber-400 font-mono">
                {subtitle}
              </span>
            )}
            <span className="text-[7px] font-black tracking-widest text-cyan-400 font-mono uppercase">
              {sub || 'SERVER'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // LAYOUT 1: Authentic MLBB 3D Chiseled Gold Frame (Default)
  // ----------------------------------------------------
  return (
    <div
      className={`relative inline-block select-none transition-transform duration-300 hover:scale-[1.03] ${className}`}
      style={{
        width: 'clamp(105px, 14vw, 150px)',
        aspectRatio: '1024 / 397'
      }}
    >
      {/* 1. Dynamic Country Flag Medallion inside the circular bezel */}
      <div
        className="absolute rounded-full overflow-hidden flex items-center justify-center z-0"
        style={{
          left: '10.3%',
          top: '16.1%',
          width: '22.6%',
          height: '57.8%'
        }}
      >
        <DynamicFlagMedallion flagType={flagType} flagImage={flagImage} />
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
          fontSize: 'clamp(7.5px, 0.95vw, 11px)',
          letterSpacing: '0.02em',
          background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF4B8 22%, #FBBF24 52%, #D97706 78%, #78350F 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 1px 0px #78350F)'
        }}
      >
        {sanitizedTitle}
      </div>

      {/* 4. Glowing Cyan Capsule Text ("SERVER") */}
      <div
        className="absolute z-20 flex items-center justify-center text-center font-black font-mono uppercase whitespace-nowrap pointer-events-none"
        style={{
          left: '58.5%',
          top: '70.8%',
          transform: 'translate(-50%, -50%)',
          width: '42%',
          fontSize: 'clamp(5px, 0.62vw, 7px)',
          letterSpacing: '0.2em',
          color: '#7DD3FC',
          textShadow: '0 0 5px rgba(56, 189, 248, 0.95)'
        }}
      >
        {sub}
      </div>
    </div>
  );
};

// Compact Corner Flag Badge
export const CambodiaCornerBadge = ({ flagType = "kh", flagImage = null, label = "សេវើខ្មែរ 🇰🇭", className = "" }) => (
  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950/95 border border-amber-400/90 backdrop-blur-md ${className}`}>
    <div className="w-5 h-5 rounded-full overflow-hidden ring-1 ring-amber-300 shrink-0 flex items-center justify-center">
      <DynamicFlagMedallion flagType={flagType} flagImage={flagImage} />
    </div>
    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-amber-300">
      {label}
    </span>
  </div>
);

export default CambodiaFlagFrame;
