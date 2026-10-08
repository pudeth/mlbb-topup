import React from 'react';
import tinTopupTitleImg from '../assets/tin-topup-title.png';

/**
 * Premium 3D Brand Logo & Metallic Title Component
 * Features:
 * - Frameless Avatar Emblem with natural drop shadow
 * - High-Impact 3D Official Title Artwork ("Tin-Topup PRO / Enterprise Hub v2.5")
 */
export const BrandLogo = ({
  branding = {},
  size = 'md', // 'sm' | 'md' | 'lg'
  showSubtitle = true,
  hideTitle = false,
  className = ''
}) => {
  const storeName = branding.storeName || 'Tin-Topup';
  const badgeText = branding.badgeText || 'PRO';
  const versionText = branding.versionText || 'Enterprise Hub v2.5';
  const logoImage = branding.logoImage || '/tin-logo.png';

  const isStandardTinBrand =
    !branding.storeName ||
    storeName.toLowerCase() === 'tin-topup' ||
    storeName.toLowerCase() === 'tin topup';

  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  const avatarSize = isSmall
    ? 'w-9 h-9 sm:w-10 sm:h-10'
    : isLarge
    ? 'w-13 h-13 sm:w-15 sm:h-15'
    : 'w-10 h-10 sm:w-11 sm:h-11';

  const titleHeightClass = isSmall
    ? 'h-[32px] sm:h-[36px]'
    : isLarge
    ? 'h-[46px] sm:h-[54px]'
    : 'h-[38px] sm:h-[42px]';

  // Smart two-tone title splitting fallback for customized store names
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
    return (
      <span className="bg-gradient-to-b from-[#FFFFFF] via-[#FDE047] to-[#D97706] bg-clip-text text-transparent font-black tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
        {storeName}
      </span>
    );
  };

  return (
    <div className={`flex items-center select-none ${hideTitle ? 'gap-0' : 'gap-2.5 sm:gap-3'} ${className}`}>
      {/* Frameless Brand Logo Avatar */}
      <div className={`relative ${avatarSize} shrink-0 flex items-center justify-center`}>
        <img
          src={logoImage}
          alt={storeName}
          className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.65)] group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/tin-logo.png';
          }}
        />
      </div>

      {/* Brand Name: 3D Official Artwork or Dynamic Fallback */}
      <div className={`transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${hideTitle ? 'max-w-0 w-0 min-w-0 opacity-0 -translate-x-3 pointer-events-none' : 'max-w-xs min-w-0 opacity-100 translate-x-0'}`}>
        {isStandardTinBrand ? (
          <div className={`flex items-center transition-all duration-300 ${hideTitle ? 'w-0 min-w-0 overflow-hidden opacity-0' : 'shrink-0'}`}>
            <img
              src={tinTopupTitleImg}
              alt={storeName}
              className={`${titleHeightClass} w-auto object-contain select-none filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] group-hover:scale-[1.02] transition-transform duration-300 ${hideTitle ? 'w-0 opacity-0' : ''}`}
              onError={(e) => {
                if (e.target.src !== `${process.env.PUBLIC_URL || ''}/images/tin-topup-title.png`) {
                  e.target.src = `${process.env.PUBLIC_URL || ''}/images/tin-topup-title.png`;
                }
              }}
            />
          </div>
        ) : (
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2 leading-none">
              <span className="text-lg sm:text-xl font-black tracking-wide flex items-center">
                {renderStyledTitle()}
              </span>
              {badgeText && (
                <span className="relative inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full font-black text-[9px] tracking-widest uppercase bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-[0_0_12px_rgba(6,182,212,0.5)] border border-cyan-300/60">
                  <span className="text-[8px] text-amber-300 animate-pulse">⚡</span>
                  <span>{badgeText}</span>
                </span>
              )}
            </div>
            {showSubtitle && (
              <div className="flex items-center gap-1.5 mt-1 font-mono text-[10px] sm:text-[10.5px] font-extrabold uppercase text-slate-400">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>{versionText}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandLogo;
