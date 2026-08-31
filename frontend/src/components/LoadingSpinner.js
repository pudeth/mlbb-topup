import React from 'react';

/**
 * Modern High-Tech Gaming Loading Spinner & Animation
 */
const LoadingSpinner = ({ size = 'md', text = 'Loading...', subtitle = '', diamond = true }) => {
  const sizeConfig = {
    sm: { container: 'p-3', ring: 'w-8 h-8', diamond: 'w-4 h-4 text-xs' },
    md: { container: 'p-6', ring: 'w-16 h-16 sm:w-20 sm:h-20', diamond: 'w-8 h-8 text-lg sm:text-xl' },
    lg: { container: 'p-8', ring: 'w-24 h-24 sm:w-28 sm:h-28', diamond: 'w-12 h-12 text-2xl sm:text-3xl' },
  }[size] || { container: 'p-6', ring: 'w-16 h-16 sm:w-20 sm:h-20', diamond: 'w-8 h-8 text-lg sm:text-xl' };

  return (
    <div className={`flex flex-col items-center justify-center text-center animate-fadeIn ${sizeConfig.container}`}>
      {/* Outer Cyber Glow Rings */}
      <div className="relative flex items-center justify-center">
        {/* Ambient background bloom */}
        <div className="absolute w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-cyan-500/30 via-blue-600/20 to-amber-500/30 blur-2xl pointer-events-none animate-pulse-slow"></div>

        {/* Counter-rotating Outer Dash Ring */}
        <div className={`rounded-full border-2 border-dashed border-cyan-500/40 border-t-cyan-400 animate-spin [animation-duration:3s] ${sizeConfig.ring}`}></div>

        {/* Fast Glowing Inner Gradient Ring */}
        <div className="absolute inset-1 rounded-full border-2 border-transparent border-t-amber-400 border-r-cyan-400 animate-spin [animation-duration:1s]"></div>

        {/* Center Floating Diamond Gem */}
        {diamond && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-slate-900 via-cyan-950 to-slate-900 border border-cyan-400/50 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.6)] animate-bounce [animation-duration:2s]">
              <span className="text-base sm:text-lg filter drop-shadow">💎</span>
            </div>
          </div>
        )}
      </div>

      {/* Primary Loading Text */}
      {text && (
        <div className="mt-5 space-y-1">
          <p className="text-sm sm:text-base font-black bg-gradient-to-r from-cyan-300 via-white to-amber-300 bg-clip-text text-transparent tracking-wide animate-pulse">
            {text}
          </p>
          {subtitle && (
            <p className="text-[11px] sm:text-xs text-slate-400 font-medium">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Mini Cyber Wave Line */}
      <div className="mt-3 flex items-center gap-1.5 justify-center">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping [animation-delay:0ms]"></span>
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping [animation-delay:200ms]"></span>
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping [animation-delay:400ms]"></span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
