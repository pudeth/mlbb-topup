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
    ? 'w-10 h-10 sm:w-11 sm:h-11'
    : isLarge
    ? 'w-14 h-14 sm:w-16 sm:h-16'
    : 'w-11 h-11 sm:w-12 sm:h-12';

  const titleSize = isSmall
    ? 'text-base sm:text-lg'
    : isLarge
    ? 'text-xl sm:text-2xl'
    : 'text-lg sm:text-xl';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Frameless Brand Logo */}
      <div className={`relative ${avatarSize} shrink-0 flex items-center justify-center`}>
        <img
          src={logoImage}
          alt={storeName}
          className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/tin-logo.png';
          }}
        />
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
