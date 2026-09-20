import React from 'react';

/**
 * Premium 3D Brand Logo & Metallic Title Component
 * Features:
 * - 3D Cyber-Gold Beveled Avatar Frame with glowing ambient reflection & specular sheen
 * - Dual-tone Chiseled Gold & Prismatic Chrome Gradient Typography
 * - Holographic Cyber Badge ("PRO" / "VIP") with neon energy aura & spark
 * - Real-time Status Radar Telemetry & Version Pill ("Enterprise Hub v2.5")
 */
export const BrandLogo = ({
  branding = {},
  size = 'md', // 'sm' | 'md' | 'lg'
  showSubtitle = true,
  className = ''
}) => {
  const storeName = branding.storeName || 'Tin-Topup';
  const badgeText = branding.badgeText || 'PRO';
  const versionText = branding.versionText || 'Enterprise Hub v2.5';
  const logoImage = branding.logoImage || '/tin-logo.png';

  // Smart two-tone title splitting:
  // e.g. "Tin-Topup" -> "Tin" (gold) + "-" (cyan) + "Topup" (chrome)
  // e.g. "Tin Topup" -> "Tin" (gold) + " " + "Topup" (chrome)
  const renderStyledTitle = () => {
    if (storeName.includes('-')) {
      const parts = storeName.split('-');
      return (
        <span className="inline-flex items-center">
          <span className="bg-gradient-to-b from-[#FFFFFF] via-[#FDE047] to-[#D97706] bg-clip-text text-transparent font-black tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {parts[0]}
          </span>
          <span className="text-cyan-400/90 font-light mx-[1px] drop-shadow-[0_0_8px_rgba(34,211,238,0.7)]">-</span>
          <span className="bg-gradient-to-b from-[#FFFFFF] via-[#F1F5F9] to-[#CBD5E1] group-hover:from-[#FFFFFF] group-hover:via-[#A5F3FC] group-hover:to-[#38BDF8] bg-clip-text text-transparent font-black tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-all duration-300">
            {parts.slice(1).join('-')}
          </span>
        </span>
      );
    }
    if (storeName.includes(' ')) {
      const parts = storeName.split(' ');
      return (
        <span className="inline-flex items-center">
          <span className="bg-gradient-to-b from-[#FFFFFF] via-[#FDE047] to-[#D97706] bg-clip-text text-transparent font-black tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {parts[0]}
          </span>
          <span className="mx-0.5">&nbsp;</span>
          <span className="bg-gradient-to-b from-[#FFFFFF] via-[#F1F5F9] to-[#CBD5E1] group-hover:from-[#FFFFFF] group-hover:via-[#A5F3FC] group-hover:to-[#38BDF8] bg-clip-text text-transparent font-black tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-all duration-300">
            {parts.slice(1).join(' ')}
          </span>
        </span>
      );
    }
    return (
      <span className="bg-gradient-to-b from-[#FFFFFF] via-[#FDE047] to-[#D97706] bg-clip-text text-transparent font-black tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
        {storeName}
      </span>
    );
  };

  // Parse version suffix (e.g. "v2.5") from "Enterprise Hub v2.5"
  const versionMatch = versionText.match(/v[\d.]+/i);
  const versionTag = versionMatch ? versionMatch[0] : null;
  const versionLabel = versionTag ? versionText.replace(versionTag, '').trim() : versionText;

  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  const avatarSize = isSmall
    ? 'w-9 h-9 sm:w-10 sm:h-10 rounded-[14px]'
    : isLarge
    ? 'w-12 h-12 sm:w-14 sm:h-14 rounded-[20px]'
    : 'w-11 h-11 sm:w-12 sm:h-12 rounded-[16px]';

  const outerFrameSize = isSmall
    ? 'p-[1.5px] rounded-[16px]'
    : isLarge
    ? 'p-[2px] rounded-[22px]'
    : 'p-[2px] rounded-[18px]';

  const titleSize = isSmall
    ? 'text-base sm:text-lg'
    : isLarge
    ? 'text-xl sm:text-2xl'
    : 'text-lg sm:text-xl';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* 3D Cyber-Gold Beveled Avatar Frame */}
      <div
        className={`relative ${outerFrameSize} shrink-0 bg-gradient-to-tr from-amber-500 via-yellow-300 to-cyan-400 shadow-[0_0_18px_rgba(245,158,11,0.35),0_0_10px_rgba(56,189,248,0.25)] group-hover:shadow-[0_0_26px_rgba(245,158,11,0.6),0_0_16px_rgba(56,189,248,0.45)] group-hover:scale-105 transition-all duration-300`}
      >
        <div className={`relative ${avatarSize} overflow-hidden bg-gradient-to-b from-[#141b2e] via-[#0d1222] to-[#070a14] p-1 flex items-center justify-center`}>
          {/* Radial Ambient Backlight */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.25)_0%,transparent_70%)] pointer-events-none" />

          {/* Diagonal Glass Reflection Sheen */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

          <img
            src={logoImage}
            alt={storeName}
            className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] group-hover:scale-110 transition-transform duration-300 relative z-10"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/tin-logo.png';
            }}
          />
        </div>
      </div>

      {/* Brand Name Typography & Status Telemetry */}
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-2 leading-none">
          <span className={`${titleSize} font-black tracking-wide flex items-center`}>
            {renderStyledTitle()}
          </span>

          {/* 3D Holographic Cyber Tag */}
          {badgeText && (
            <span className="relative inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full font-black text-[9px] tracking-widest uppercase bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-[0_0_12px_rgba(6,182,212,0.5),inset_0_1px_0_rgba(255,255,255,0.4)] border border-cyan-300/60 group-hover:shadow-[0_0_18px_rgba(6,182,212,0.8)] group-hover:scale-105 transition-all duration-300">
              <span className="text-[8px] text-amber-300 animate-pulse">⚡</span>
              <span>{badgeText}</span>
            </span>
          )}
        </div>

        {/* Subtitle Telemetry */}
        {showSubtitle && (
          <div className="flex items-center gap-1.5 mt-1">
            {/* Live Radar Ping Dot */}
            <span className="relative flex h-2 w-2 items-center justify-center shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
            </span>

            <div className="flex items-center gap-1 font-mono">
              <span className="text-[10px] sm:text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400 group-hover:text-slate-200 transition-colors">
                {versionLabel}
              </span>
              {versionTag && (
                <span className="px-1.5 py-0.2 rounded bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[8.5px] font-black tracking-widest uppercase">
                  {versionTag}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandLogo;
