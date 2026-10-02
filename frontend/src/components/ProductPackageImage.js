import React from 'react';

// Renders the high-res 3D artwork for a product package
export const ProductPackageImage = ({
  pkg,
  size = 'md', // 'sm', 'md', 'lg'
  className = ''
}) => {
  if (!pkg) return null;

  // 1. If admin uploaded a custom package image
  if (pkg.customImage || pkg.image) {
    const imgSrc = pkg.customImage || pkg.image;
    const sizeClasses =
      size === 'xs'
        ? 'w-7 h-7 sm:w-8 sm:h-8'
        : size === 'sm'
        ? 'w-6 h-6 sm:w-7 sm:h-7'
        : size === 'lg'
        ? 'w-12 h-12 sm:w-14 sm:h-14'
        : 'w-8 h-8 sm:w-10 sm:h-10';

    return (
      <div className={`relative inline-flex items-center justify-center shrink-0 drop-shadow-md ${sizeClasses} ${className}`}>
        <img
          src={imgSrc}
          alt={pkg.name || 'Product'}
          className="w-full h-full object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      </div>
    );
  }

  // 2. Identify package type
  const isPass =
    pkg.isPass ||
    (pkg.name && (pkg.name.toLowerCase().includes('pass') || pkg.name.toLowerCase().includes('wdp') || pkg.name.toLowerCase().includes('weekly')));

  // Size dimensions
  const dims =
    size === 'xs'
      ? 'w-7 h-7 sm:w-8 sm:h-8'
      : size === 'sm'
      ? 'w-6 h-6 sm:w-7 sm:h-7'
      : size === 'lg'
      ? 'w-12 h-12 sm:w-14 sm:h-14'
      : 'w-8 h-8 sm:w-10 sm:h-10';

  // 3. Weekly Diamond Pass 3D Artwork
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

  // 4. Diamond Packages: 3D Golden Treasure Chest with Diamonds & Coins
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
