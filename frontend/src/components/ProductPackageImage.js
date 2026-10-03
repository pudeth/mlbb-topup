import React from 'react';
import DiamondTierGraphic from './DiamondTierGraphic';

// Renders the high-res 3D artwork for a product package
export const ProductPackageImage = ({
  pkg,
  size = 'md', // 'xs', 'sm', 'md', 'lg'
  className = ''
}) => {
  if (!pkg) return null;

  // Standard container dimensions
  const dims =
    size === 'xs'
      ? 'w-7 h-7 sm:w-8 sm:h-8'
      : size === 'sm'
      ? 'w-6 h-6 sm:w-7 sm:h-7'
      : size === 'lg'
      ? 'w-12 h-12 sm:w-14 sm:h-14'
      : 'w-8 h-8 sm:w-10 sm:h-10';

  const custom = (pkg.customImage || pkg.image || '').trim();

  // 1. Explicit 3D Gem Preset
  if (
    custom === 'gem' ||
    custom === '3d_gem' ||
    custom === '3d-gem' ||
    custom === '/images/diamond-gem.png' ||
    custom === 'diamond'
  ) {
    return (
      <div className={`relative inline-flex items-center justify-center shrink-0 ${dims} ${className}`}>
        <DiamondTierGraphic
          amount={pkg.diamondAmount && !pkg.isPass ? pkg.diamondAmount : 50}
          size={size === 'xs' ? 'xs' : size}
          className="w-full h-full drop-shadow-[0_4px_12px_rgba(6,182,212,0.65)] hover:scale-105 transition-transform duration-300"
        />
      </div>
    );
  }

  // 2. Explicit Weekly Pass Preset
  if (custom === '/images/weekly-pass.png' || custom === 'weekly_pass' || custom === 'pass') {
    return (
      <div className={`relative inline-flex items-center justify-center shrink-0 ${dims} ${className}`}>
        <img
          src="/images/weekly-pass.png"
          alt={pkg.name || 'Weekly Diamond Pass'}
          className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(168,85,247,0.45)] hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      </div>
    );
  }

  // 3. Explicit Gold Chest Preset
  if (custom === '/images/treasure-chest.png' || custom === 'treasure_chest' || custom === 'chest') {
    return (
      <div className={`relative inline-flex items-center justify-center shrink-0 ${dims} ${className}`}>
        <img
          src="/images/treasure-chest.png"
          alt={pkg.name || 'Diamond Treasure Chest'}
          className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(251,191,36,0.45)] hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      </div>
    );
  }

  // 4. Custom uploaded image (URL, Data URI, or file path)
  if (custom && (custom.startsWith('http') || custom.startsWith('data:') || custom.startsWith('/'))) {
    return (
      <div className={`relative inline-flex items-center justify-center shrink-0 drop-shadow-md ${dims} ${className}`}>
        <img
          src={custom}
          alt={pkg.name || 'Product'}
          className="w-full h-full object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)] hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      </div>
    );
  }

  // 5. Default Fallbacks when no customImage is set
  const isPass =
    pkg.isPass ||
    (pkg.name && (pkg.name.toLowerCase().includes('pass') || pkg.name.toLowerCase().includes('wdp') || pkg.name.toLowerCase().includes('weekly')));

  if (isPass) {
    return (
      <div className={`relative inline-flex items-center justify-center shrink-0 ${dims} ${className}`}>
        <img
          src="/images/weekly-pass.png"
          alt="Weekly Diamond Pass"
          className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(168,85,247,0.45)] hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      </div>
    );
  }

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${dims} ${className}`}>
      <img
        src="/images/treasure-chest.png"
        alt="Diamond Treasure Chest"
        className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(251,191,36,0.45)] hover:scale-105 transition-transform duration-300"
        onError={(e) => {
          e.target.style.display = 'none';
        }}
      />
    </div>
  );
};

export default ProductPackageImage;
