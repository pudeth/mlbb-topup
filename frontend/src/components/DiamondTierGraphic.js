import React from 'react';

/**
 * High-definition SVG illustrations for MLBB Diamond Tiers
 * Visual progression: Single Gem -> Gem Trio -> Gem Pouch -> Overflowing Sack -> Treasure Box -> Royal Chest -> Grand Treasury -> Mythic Vault
 */
export const DiamondTierGraphic = ({ amount = 50, size = 'md', className = '' }) => {
  const num = parseInt(amount, 10) || 50;

  // Determine size classes
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14 sm:w-16 sm:h-16',
    lg: 'w-20 h-20 sm:w-24 sm:h-24',
    xl: 'w-28 h-28 sm:w-32 sm:h-32',
  }[size] || 'w-14 h-14 sm:w-16 sm:h-16';

  // Tier 1: 50 Diamonds - Single Brilliant Diamond Gem
  if (num < 100) {
    return (
      <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_12px_rgba(6,182,212,0.6)]">
          <defs>
            <radialGradient id="gemGlow1" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#0284c7" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="facetTop1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e0f2fe" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
            <linearGradient id="facetLeft1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <linearGradient id="facetCenter1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#7dd3fc" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>
            <linearGradient id="facetRight1" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#bae6fd" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
          </defs>

          {/* Ambient Glow */}
          <circle cx="50" cy="52" r="42" fill="url(#gemGlow1)" />

          {/* Main Diamond Facets */}
          <g transform="translate(0, 5)">
            {/* Crown Table (Top center) */}
            <polygon points="32,22 68,22 78,38 22,38" fill="url(#facetTop1)" />
            {/* Top Triangles */}
            <polygon points="32,22 50,14 68,22" fill="#f0f9ff" />
            <polygon points="22,38 32,22 50,14 14,28" fill="#bae6fd" />
            <polygon points="68,22 78,38 86,28 50,14" fill="#7dd3fc" />
            
            {/* Pavilion Facets (Bottom) */}
            <polygon points="22,38 50,86 36,38" fill="url(#facetLeft1)" />
            <polygon points="36,38 50,86 64,38" fill="url(#facetCenter1)" />
            <polygon points="64,38 50,86 78,38" fill="url(#facetRight1)" />
            <polygon points="22,38 14,28 32,38" fill="#0369a1" opacity="0.6" />
            <polygon points="78,38 86,28 68,38" fill="#0284c7" opacity="0.6" />

            {/* Specular Glint Reflection */}
            <polygon points="36,24 64,24 58,32 30,32" fill="#ffffff" opacity="0.75" />
            <polygon points="40,38 50,70 46,38" fill="#ffffff" opacity="0.5" />
          </g>

          {/* Sparkle Star 1 */}
          <path d="M78 20 Q78 26 84 26 Q78 26 78 32 Q78 26 72 26 Q78 26 78 20" fill="#ffffff" />
          {/* Sparkle Star 2 */}
          <path d="M22 62 Q22 66 26 66 Q22 66 22 70 Q22 66 18 66 Q22 66 22 62" fill="#38bdf8" />
        </svg>
      </div>
    );
  }

  // Tier 2: 110 Diamonds - Trio of Sparkling Diamonds
  if (num < 200) {
    return (
      <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_14px_rgba(56,189,248,0.65)]">
          <defs>
            <radialGradient id="gemGlow2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
              <stop offset="70%" stopColor="#1d4ed8" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="gemGrad2A" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e0f2fe" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0369a1" />
            </linearGradient>
            <linearGradient id="gemGrad2B" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f0f9ff" />
              <stop offset="50%" stopColor="#67e8f9" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
          </defs>

          <circle cx="50" cy="50" r="45" fill="url(#gemGlow2)" />

          {/* Left Background Diamond */}
          <g transform="translate(14, 28) scale(0.65)">
            <polygon points="20,18 60,18 75,32 5,32" fill="#38bdf8" opacity="0.8" />
            <polygon points="5,32 40,75 75,32" fill="#0369a1" opacity="0.9" />
            <polygon points="20,32 40,75 60,32" fill="#0284c7" />
            <polygon points="24,20 56,20 50,26 16,26" fill="#ffffff" opacity="0.6" />
          </g>

          {/* Right Background Diamond */}
          <g transform="translate(48, 22) scale(0.7)">
            <polygon points="20,18 60,18 75,32 5,32" fill="#7dd3fc" opacity="0.8" />
            <polygon points="5,32 40,75 75,32" fill="#0284c7" opacity="0.9" />
            <polygon points="20,32 40,75 60,32" fill="#0369a1" />
            <polygon points="24,20 56,20 50,26 16,26" fill="#ffffff" opacity="0.6" />
          </g>

          {/* Foreground Center Diamond (Bigger) */}
          <g transform="translate(24, 25) scale(0.9)">
            <polygon points="16,22 44,22 56,36 4,36" fill="url(#gemGrad2B)" />
            <polygon points="16,22 30,12 44,22" fill="#ffffff" />
            <polygon points="4,36 30,76 18,36" fill="#0284c7" />
            <polygon points="18,36 30,76 42,36" fill="url(#gemGrad2A)" />
            <polygon points="42,36 30,76 56,36" fill="#0369a1" />
            <polygon points="20,24 40,24 35,30 12,30" fill="#ffffff" opacity="0.8" />
            <polygon points="25,36 30,64 27,36" fill="#ffffff" opacity="0.5" />
          </g>

          {/* Sparkle Glints */}
          <path d="M78 18 Q78 24 84 24 Q78 24 78 30 Q78 24 72 24 Q78 24 78 18" fill="#ffffff" />
          <path d="M20 30 Q20 34 24 34 Q20 34 20 38 Q20 34 16 34 Q20 34 20 30" fill="#bae6fd" />
          <circle cx="82" cy="68" r="2.5" fill="#38bdf8" />
        </svg>
      </div>
    );
  }

  // Tier 3: 240 Diamonds - Adventurer's Gem Pouch
  if (num < 300) {
    return (
      <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_16px_rgba(16,185,129,0.55)]">
          <defs>
            <radialGradient id="gemGlow3" cx="50%" cy="45%" r="50%">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="pouchGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="50%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="goldRibbon" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>

          <circle cx="50" cy="50" r="46" fill="url(#gemGlow3)" />

          {/* Diamonds spilling out of pouch top */}
          <g transform="translate(28, 12) scale(0.65)">
            <polygon points="12,18 42,18 50,30 4,30" fill="#bae6fd" />
            <polygon points="4,30 27,65 50,30" fill="#0284c7" />
            <polygon points="16,30 27,65 38,30" fill="#38bdf8" />
            <polygon points="16,20 38,20 34,26 10,26" fill="#ffffff" opacity="0.8" />
          </g>
          <g transform="translate(48, 10) scale(0.55)">
            <polygon points="12,18 42,18 50,30 4,30" fill="#e0f2fe" />
            <polygon points="4,30 27,65 50,30" fill="#0369a1" />
            <polygon points="16,30 27,65 38,30" fill="#67e8f9" />
          </g>

          {/* Leather Pouch Body */}
          <path
            d="M28,45 C28,34 36,36 50,36 C64,36 72,34 72,45 C72,48 76,56 78,68 C80,82 72,90 50,90 C28,90 20,82 22,68 C24,56 28,48 28,45 Z"
            fill="url(#pouchGrad1)"
            stroke="#475569"
            strokeWidth="2"
          />

          {/* Pouch Tie Rope / Golden Ribbon */}
          <path d="M26,44 Q50,52 74,44" fill="none" stroke="url(#goldRibbon)" strokeWidth="4" strokeLinecap="round" />
          <circle cx="50" cy="48" r="4" fill="#fbbf24" stroke="#b45309" strokeWidth="1.5" />
          {/* Hanging Cord tassels */}
          <path d="M50,52 Q46,62 42,68" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M50,52 Q54,64 56,70" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />

          {/* Pouch Crest Badge / Gem in front */}
          <polygon points="45,62 55,62 58,68 42,68" fill="#38bdf8" />
          <polygon points="42,68 50,80 58,68" fill="#0284c7" />

          {/* Sparkle Glints */}
          <path d="M78 20 Q78 25 83 25 Q78 25 78 30 Q78 25 73 25 Q78 25 78 20" fill="#ffffff" />
          <path d="M18 42 Q18 46 22 46 Q18 46 18 50 Q18 46 14 46 Q18 46 18 42" fill="#34d399" />
        </svg>
      </div>
    );
  }

  // Tier 4: 370 Diamonds - Overflowing Velvet Gem Sack
  if (num < 500) {
    return (
      <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_18px_rgba(245,158,11,0.65)]">
          <defs>
            <radialGradient id="gemGlow4" cx="50%" cy="40%" r="50%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.85" />
              <stop offset="60%" stopColor="#0284c7" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="sackVelvet" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#831843" />
              <stop offset="50%" stopColor="#500724" />
              <stop offset="100%" stopColor="#1e1b4b" />
            </linearGradient>
            <linearGradient id="goldCord" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
          </defs>

          <circle cx="50" cy="46" r="46" fill="url(#gemGlow4)" />

          {/* Burst of Diamonds at Top */}
          <g transform="translate(18, 8) scale(0.55)">
            <polygon points="12,18 42,18 50,30 4,30" fill="#e0f2fe" />
            <polygon points="4,30 27,65 50,30" fill="#0284c7" />
            <polygon points="16,30 27,65 38,30" fill="#38bdf8" />
          </g>
          <g transform="translate(36, 4) scale(0.7)">
            <polygon points="12,18 42,18 50,30 4,30" fill="#f0f9ff" />
            <polygon points="4,30 27,65 50,30" fill="#0369a1" />
            <polygon points="16,30 27,65 38,30" fill="#67e8f9" />
            <polygon points="16,20 38,20 34,26 10,26" fill="#ffffff" opacity="0.9" />
          </g>
          <g transform="translate(56, 8) scale(0.55)">
            <polygon points="12,18 42,18 50,30 4,30" fill="#bae6fd" />
            <polygon points="4,30 27,65 50,30" fill="#0284c7" />
            <polygon points="16,30 27,65 38,30" fill="#38bdf8" />
          </g>

          {/* Velvet Sack Body */}
          <path
            d="M24,42 C24,30 35,32 50,32 C65,32 76,30 76,42 C78,48 84,58 84,72 C84,88 74,92 50,92 C26,92 16,88 16,72 C16,58 22,48 24,42 Z"
            fill="url(#sackVelvet)"
            stroke="#fb7185"
            strokeWidth="1.5"
          />

          {/* Golden Cord & Brooch */}
          <path d="M22,40 Q50,48 78,40" fill="none" stroke="url(#goldCord)" strokeWidth="4.5" strokeLinecap="round" />
          <polygon points="46,42 54,42 57,48 43,48" fill="#fbbf24" stroke="#92400e" strokeWidth="1" />
          <polygon points="43,48 50,56 57,48" fill="#f59e0b" />
          
          {/* Diamonds Scattered at Base */}
          <g transform="translate(14, 76) scale(0.4)">
            <polygon points="12,18 42,18 50,30 4,30" fill="#bae6fd" />
            <polygon points="4,30 27,65 50,30" fill="#0284c7" />
          </g>
          <g transform="translate(68, 74) scale(0.45)">
            <polygon points="12,18 42,18 50,30 4,30" fill="#e0f2fe" />
            <polygon points="4,30 27,65 50,30" fill="#38bdf8" />
          </g>

          {/* Multiple Sparkle Stars */}
          <path d="M82 18 Q82 25 88 25 Q82 25 82 32 Q82 25 76 25 Q82 25 82 18" fill="#fbbf24" />
          <path d="M12 26 Q12 31 16 31 Q12 31 12 36 Q12 31 8 31 Q12 31 12 26" fill="#38bdf8" />
        </svg>
      </div>
    );
  }

  // Tier 5: 625 Diamonds - Ornate Treasure Box of Diamonds
  if (num < 1000) {
    return (
      <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_20px_rgba(249,115,22,0.65)]">
          <defs>
            <radialGradient id="gemGlow5" cx="50%" cy="38%" r="52%">
              <stop offset="0%" stopColor="#fb923c" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="chestWood" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#78350f" />
              <stop offset="50%" stopColor="#451a03" />
              <stop offset="100%" stopColor="#1c0a00" />
            </linearGradient>
            <linearGradient id="chestGoldTrim" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
          </defs>

          <circle cx="50" cy="46" r="48" fill="url(#gemGlow5)" />

          {/* Gleaming Mountain of Diamonds Inside Box */}
          <g transform="translate(18, 14) scale(0.48)">
            <polygon points="12,18 42,18 50,30 4,30" fill="#bae6fd" />
            <polygon points="4,30 27,65 50,30" fill="#0284c7" />
          </g>
          <g transform="translate(32, 8) scale(0.68)">
            <polygon points="14,20 44,20 54,34 4,34" fill="#ffffff" />
            <polygon points="14,20 29,10 44,20" fill="#f0f9ff" />
            <polygon points="4,34 29,72 54,34" fill="#0369a1" />
            <polygon points="16,34 29,72 42,34" fill="#38bdf8" />
            <polygon points="18,22 40,22 36,28 12,28" fill="#ffffff" opacity="0.9" />
          </g>
          <g transform="translate(56, 12) scale(0.52)">
            <polygon points="12,18 42,18 50,30 4,30" fill="#e0f2fe" />
            <polygon points="4,30 27,65 50,30" fill="#0284c7" />
            <polygon points="16,30 27,65 38,30" fill="#67e8f9" />
          </g>

          {/* Treasure Box Lid (Open Angle) */}
          <path
            d="M16,34 L28,16 Q50,12 72,16 L84,34 Q50,28 16,34 Z"
            fill="url(#chestWood)"
            stroke="url(#chestGoldTrim)"
            strokeWidth="2.5"
          />
          {/* Lid Center Band */}
          <path d="M46,13 L46,31 L54,31 L54,13 Z" fill="url(#chestGoldTrim)" />

          {/* Treasure Box Base */}
          <path
            d="M14,40 L18,84 Q50,88 82,84 L86,40 Q50,46 14,40 Z"
            fill="url(#chestWood)"
            stroke="#92400e"
            strokeWidth="2"
          />

          {/* Gold Edge Straps on Base */}
          <path d="M14,40 L18,84 L26,84 L22,41 Z" fill="url(#chestGoldTrim)" />
          <path d="M86,40 L82,84 L74,84 L78,41 Z" fill="url(#chestGoldTrim)" />
          <path d="M46,43 L46,86 L54,86 L54,43 Z" fill="url(#chestGoldTrim)" />

          {/* Keyhole Plate */}
          <circle cx="50" cy="56" r="6" fill="#fbbf24" stroke="#78350f" strokeWidth="1.5" />
          <circle cx="50" cy="55" r="2" fill="#1c1917" />
          <polygon points="49,55 51,55 52,60 48,60" fill="#1c1917" />

          {/* Sparkles */}
          <path d="M86 16 Q86 23 92 23 Q86 23 86 30 Q86 23 80 23 Q86 23 86 16" fill="#fef08a" />
          <path d="M10 24 Q10 29 14 29 Q10 29 10 34 Q10 29 6 29 Q10 29 10 24" fill="#38bdf8" />
        </svg>
      </div>
    );
  }

  // Tier 6: 1250 Diamonds - Royal Golden Treasure Chest
  if (num < 2000) {
    return (
      <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_22px_rgba(168,85,247,0.7)]">
          <defs>
            <radialGradient id="gemGlow6" cx="50%" cy="35%" r="55%">
              <stop offset="0%" stopColor="#c084fc" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="royalGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="30%" stopColor="#fbbf24" />
              <stop offset="70%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
            <linearGradient id="royalPurple" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#581c87" />
              <stop offset="100%" stopColor="#1e1b4b" />
            </linearGradient>
          </defs>

          <circle cx="50" cy="45" r="48" fill="url(#gemGlow6)" />

          {/* Mountain of Diamonds Overflowing */}
          <g transform="translate(12, 10) scale(0.55)">
            <polygon points="12,18 42,18 50,30 4,30" fill="#bae6fd" />
            <polygon points="4,30 27,65 50,30" fill="#0284c7" />
            <polygon points="16,30 27,65 38,30" fill="#38bdf8" />
          </g>
          <g transform="translate(28, 2) scale(0.8)">
            <polygon points="14,20 44,20 54,34 4,34" fill="#ffffff" />
            <polygon points="14,20 29,8 44,20" fill="#e0f2fe" />
            <polygon points="4,34 29,72 54,34" fill="#0284c7" />
            <polygon points="16,34 29,72 42,34" fill="#38bdf8" />
            <polygon points="18,22 40,22 36,28 12,28" fill="#ffffff" opacity="0.95" />
          </g>
          <g transform="translate(60, 8) scale(0.6)">
            <polygon points="12,18 42,18 50,30 4,30" fill="#e0f2fe" />
            <polygon points="4,30 27,65 50,30" fill="#0369a1" />
            <polygon points="16,30 27,65 38,30" fill="#67e8f9" />
          </g>

          {/* Chest Open Top / Lid Arch */}
          <path
            d="M12,32 L26,10 Q50,4 74,10 L88,32 Q50,24 12,32 Z"
            fill="url(#royalPurple)"
            stroke="url(#royalGold)"
            strokeWidth="3"
          />
          {/* Gold Ribs on Lid */}
          <path d="M46,6 L46,27 L54,27 L54,6 Z" fill="url(#royalGold)" />

          {/* Chest Base */}
          <path
            d="M10,36 L14,86 Q50,92 86,86 L90,36 Q50,44 10,36 Z"
            fill="url(#royalPurple)"
            stroke="url(#royalGold)"
            strokeWidth="2.5"
          />

          {/* Golden Corner Plates & Straps */}
          <path d="M10,36 L14,86 L24,87 L20,38 Z" fill="url(#royalGold)" />
          <path d="M90,36 L86,86 L76,87 L80,38 Z" fill="url(#royalGold)" />
          <path d="M45,40 L45,89 L55,89 L55,40 Z" fill="url(#royalGold)" />

          {/* Royal Lion / Crown Gem Emblem */}
          <circle cx="50" cy="55" r="7" fill="url(#royalGold)" stroke="#78350f" strokeWidth="1" />
          <polygon points="46,54 54,54 50,60" fill="#38bdf8" />
          <polygon points="45,51 50,47 55,51" fill="#ffffff" />

          {/* Gold Coins Spilling at Floor */}
          <ellipse cx="20" cy="85" rx="5" ry="2.5" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
          <ellipse cx="28" cy="87" rx="6" ry="3" fill="#f59e0b" stroke="#b45309" strokeWidth="1" />
          <ellipse cx="78" cy="86" rx="6" ry="3" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />

          {/* Sparkles */}
          <path d="M88 12 Q88 20 96 20 Q88 20 88 28 Q88 20 80 20 Q88 20 88 12" fill="#fbbf24" />
          <path d="M6 18 Q6 24 12 24 Q6 24 6 30 Q6 24 0 24 Q6 24 6 18" fill="#e0f2fe" />
          <path d="M50 0 Q50 6 56 6 Q50 6 50 12 Q50 6 44 6 Q50 6 50 0" fill="#ffffff" />
        </svg>
      </div>
    );
  }

  // Tier 7: 2500 Diamonds - Grand Treasury & Giant Diamond Vault
  if (num < 4000) {
    return (
      <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_24px_rgba(236,72,153,0.75)]">
          <defs>
            <radialGradient id="gemGlow7" cx="50%" cy="35%" r="55%">
              <stop offset="0%" stopColor="#f472b6" stopOpacity="0.9" />
              <stop offset="45%" stopColor="#a855f7" stopOpacity="0.6" />
              <stop offset="85%" stopColor="#38bdf8" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="treasuryGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fffbeb" />
              <stop offset="30%" stopColor="#fde047" />
              <stop offset="70%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#854d0e" />
            </linearGradient>
            <linearGradient id="crystalShine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#a5f3fc" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
          </defs>

          <circle cx="50" cy="45" r="48" fill="url(#gemGlow7)" />

          {/* Floating Crown Above Treasury */}
          <path
            d="M32,12 L38,18 L50,8 L62,18 L68,12 L65,22 L35,22 Z"
            fill="url(#treasuryGold)"
            stroke="#78350f"
            strokeWidth="1.5"
          />
          <circle cx="50" cy="7" r="2.5" fill="#ec4899" />
          <circle cx="32" cy="11" r="2" fill="#38bdf8" />
          <circle cx="68" cy="11" r="2" fill="#38bdf8" />

          {/* Massive Cluster of Diamonds */}
          <g transform="translate(18, 14) scale(0.65)">
            <polygon points="12,18 42,18 50,30 4,30" fill="#bae6fd" />
            <polygon points="4,30 27,65 50,30" fill="#0284c7" />
            <polygon points="16,30 27,65 38,30" fill="#38bdf8" />
          </g>
          <g transform="translate(30, 8) scale(0.85)">
            <polygon points="14,20 44,20 54,34 4,34" fill="url(#crystalShine)" />
            <polygon points="14,20 29,6 44,20" fill="#ffffff" />
            <polygon points="4,34 29,72 54,34" fill="#0369a1" />
            <polygon points="16,34 29,72 42,34" fill="#38bdf8" />
            <polygon points="18,22 40,22 36,28 12,28" fill="#ffffff" opacity="0.95" />
          </g>
          <g transform="translate(54, 14) scale(0.65)">
            <polygon points="12,18 42,18 50,30 4,30" fill="#e0f2fe" />
            <polygon points="4,30 27,65 50,30" fill="#0284c7" />
            <polygon points="16,30 27,65 38,30" fill="#67e8f9" />
          </g>

          {/* Giant Treasury Coffer */}
          <path
            d="M8,36 L12,88 Q50,96 88,88 L92,36 Q50,46 8,36 Z"
            fill="#1e1b4b"
            stroke="url(#treasuryGold)"
            strokeWidth="3"
          />

          {/* Gilded Columns & Crest */}
          <path d="M8,36 L12,88 L24,89 L19,38 Z" fill="url(#treasuryGold)" />
          <path d="M92,36 L88,88 L76,89 L81,38 Z" fill="url(#treasuryGold)" />
          <path d="M44,42 L44,92 L56,92 L56,42 Z" fill="url(#treasuryGold)" />

          {/* Grand Diamond Crest */}
          <polygon points="44,52 56,52 60,60 40,60" fill="#f472b6" />
          <polygon points="40,60 50,72 60,60" fill="#db2777" />
          <polygon points="45,54 55,54 52,58 42,58" fill="#ffffff" opacity="0.8" />

          {/* Overflowing Diamond Crystals & Coins at base */}
          <g transform="translate(6, 76) scale(0.4)">
            <polygon points="12,18 42,18 50,30 4,30" fill="#e0f2fe" />
            <polygon points="4,30 27,65 50,30" fill="#38bdf8" />
          </g>
          <g transform="translate(76, 76) scale(0.4)">
            <polygon points="12,18 42,18 50,30 4,30" fill="#f0abfc" />
            <polygon points="4,30 27,65 50,30" fill="#c084fc" />
          </g>

          {/* Multi Sparkles */}
          <path d="M90 8 Q90 18 100 18 Q90 18 90 28 Q90 18 80 18 Q90 18 90 8" fill="#fde047" />
          <path d="M6 14 Q6 22 14 22 Q6 22 6 30 Q6 22 -2 22 Q6 22 6 14" fill="#38bdf8" />
        </svg>
      </div>
    );
  }

  // Tier 8: 5000+ Diamonds - Mythic Celestial Diamond Vault
  return (
    <div className={`relative flex items-center justify-center ${sizeClasses} ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_28px_rgba(6,182,212,0.9)] animate-pulse-slow">
        <defs>
          <radialGradient id="mythicAura" cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="1" />
            <stop offset="35%" stopColor="#ec4899" stopOpacity="0.75" />
            <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="mythicGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="25%" stopColor="#fef08a" />
            <stop offset="60%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
          <linearGradient id="mythicDiamond" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="30%" stopColor="#67e8f9" />
            <stop offset="70%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
        </defs>

        {/* Radiant Celestial Halo */}
        <circle cx="50" cy="45" r="48" fill="url(#mythicAura)" />

        {/* Celestial Angel / Dragon Wings behind Vault */}
        <path
          d="M50,30 Q30,10 6,18 Q12,38 30,42 Z"
          fill="url(#mythicGold)"
          opacity="0.9"
        />
        <path
          d="M50,30 Q70,10 94,18 Q88,38 70,42 Z"
          fill="url(#mythicGold)"
          opacity="0.9"
        />

        {/* Floating Crown with Big Center Jewel */}
        <path
          d="M30,8 L36,16 L50,4 L64,16 L70,8 L66,20 L34,20 Z"
          fill="url(#mythicGold)"
          stroke="#78350f"
          strokeWidth="1.5"
        />
        <circle cx="50" cy="3.5" r="3.5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />
        <circle cx="30" cy="7" r="2.5" fill="#ec4899" />
        <circle cx="70" cy="7" r="2.5" fill="#ec4899" />

        {/* Endless Spilling Mountain of Sparkling Diamonds */}
        <g transform="translate(10, 8) scale(0.65)">
          <polygon points="12,18 42,18 50,30 4,30" fill="#ffffff" />
          <polygon points="4,30 27,65 50,30" fill="#0284c7" />
          <polygon points="16,30 27,65 38,30" fill="#38bdf8" />
        </g>
        <g transform="translate(26, 2) scale(0.95)">
          <polygon points="14,20 44,20 54,34 4,34" fill="url(#mythicDiamond)" />
          <polygon points="14,20 29,4 44,20" fill="#ffffff" />
          <polygon points="4,34 29,72 54,34" fill="#0369a1" />
          <polygon points="16,34 29,72 42,34" fill="#67e8f9" />
          <polygon points="18,22 40,22 36,28 12,28" fill="#ffffff" />
          <polygon points="25,34 29,66 26,34" fill="#ffffff" opacity="0.85" />
        </g>
        <g transform="translate(62, 8) scale(0.65)">
          <polygon points="12,18 42,18 50,30 4,30" fill="#e0f2fe" />
          <polygon points="4,30 27,65 50,30" fill="#0284c7" />
          <polygon points="16,30 27,65 38,30" fill="#38bdf8" />
        </g>

        {/* Celestial Vault Base */}
        <path
          d="M6,36 L10,88 Q50,98 90,88 L94,36 Q50,46 6,36 Z"
          fill="#0f172a"
          stroke="url(#mythicGold)"
          strokeWidth="3.5"
        />

        {/* Gold Filigree Columns */}
        <path d="M6,36 L10,88 L24,89 L18,38 Z" fill="url(#mythicGold)" />
        <path d="M94,36 L90,88 L76,89 L82,38 Z" fill="url(#mythicGold)" />
        <path d="M43,42 L43,94 L57,94 L57,42 Z" fill="url(#mythicGold)" />

        {/* Center Mega Diamond Crystal Shield */}
        <polygon points="42,50 58,50 63,60 37,60" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />
        <polygon points="37,60 50,76 63,60" fill="#0284c7" />
        <polygon points="44,52 56,52 52,58 40,58" fill="#ffffff" />

        {/* Multi Sparkles & Stars */}
        <path d="M92 4 Q92 16 104 16 Q92 16 92 28 Q92 16 80 16 Q92 16 92 4" fill="#ffffff" />
        <path d="M4 10 Q4 20 14 20 Q4 20 4 30 Q4 20 -6 20 Q4 20 4 10" fill="#fef08a" />
        <path d="M50 -4 Q50 4 58 4 Q50 4 50 12 Q50 4 42 4 Q50 4 50 -4" fill="#38bdf8" />
      </svg>
    </div>
  );
};

export default DiamondTierGraphic;
