import React from 'react';

// Gaming Avatar Presets
export const GAMING_AVATAR_PRESETS = [
  {
    id: 'crown',
    label: 'Mythic King',
    title: 'MYTHIC KING',
    category: 'ranks',
    icon: '👑',
    badge: 'ROYAL',
    borderGradient: 'from-amber-300 via-yellow-500 to-orange-600',
    glowColor: 'rgba(245,158,11,0.55)',
    bg: 'from-[#2e1a05] via-[#1a0e02] to-[#0a0501]',
    badgeColor: 'bg-amber-400 text-slate-950',
    tag: 'Champion',
  },
  {
    id: 'ninja',
    label: 'Shadow Assassin',
    title: 'SHADOW ASSASSIN',
    category: 'roles',
    icon: '🥷',
    badge: 'ASSASSIN',
    borderGradient: 'from-purple-400 via-fuchsia-500 to-indigo-600',
    glowColor: 'rgba(192,38,211,0.5)',
    bg: 'from-[#220836] via-[#140421] to-[#08020d]',
    badgeColor: 'bg-fuchsia-500 text-white',
    tag: 'Hyper Carry',
  },
  {
    id: 'duelist',
    label: 'Blade Master',
    title: 'BLADE MASTER',
    category: 'roles',
    icon: '⚔️',
    badge: 'DUELIST',
    borderGradient: 'from-rose-500 via-red-500 to-amber-500',
    glowColor: 'rgba(244,63,94,0.5)',
    bg: 'from-[#2b0810] via-[#18040a] to-[#0a0103]',
    badgeColor: 'bg-rose-500 text-white',
    tag: 'Fighter',
  },
  {
    id: 'sniper',
    label: 'Deadly Marksman',
    title: 'DEADLY MARKSMAN',
    category: 'roles',
    icon: '🎯',
    badge: 'MARKSMAN',
    borderGradient: 'from-emerald-400 via-teal-500 to-cyan-500',
    glowColor: 'rgba(16,185,129,0.5)',
    bg: 'from-[#03241c] via-[#021410] to-[#010a08]',
    badgeColor: 'bg-emerald-400 text-slate-950',
    tag: 'Gold Laner',
  },
  {
    id: 'mage',
    label: 'Arcane Mage',
    title: 'ARCANE MAGE',
    category: 'roles',
    icon: '🧙',
    badge: 'BURST MAGE',
    borderGradient: 'from-violet-400 via-indigo-500 to-purple-600',
    glowColor: 'rgba(139,92,246,0.5)',
    bg: 'from-[#1b0939] via-[#0f0422] to-[#06020f]',
    badgeColor: 'bg-violet-400 text-slate-950',
    tag: 'Mid Laner',
  },
  {
    id: 'tank',
    label: 'Titan Guardian',
    title: 'TITAN GUARDIAN',
    category: 'roles',
    icon: '🛡️',
    badge: 'DEFENDER',
    borderGradient: 'from-sky-400 via-blue-600 to-cyan-600',
    glowColor: 'rgba(56,189,248,0.5)',
    bg: 'from-[#061c3b] via-[#030f21] to-[#01060e]',
    badgeColor: 'bg-sky-400 text-slate-950',
    tag: 'Roamer',
  },
  {
    id: 'shield',
    aliasOf: 'tank',
    label: 'Tank Shield',
    title: 'TANK SHIELD',
    category: 'roles',
    icon: '🛡️',
    badge: 'TANK',
    borderGradient: 'from-sky-400 via-blue-600 to-cyan-600',
    glowColor: 'rgba(56,189,248,0.5)',
    bg: 'from-[#061c3b] via-[#030f21] to-[#01060e]',
    badgeColor: 'bg-sky-400 text-slate-950',
    tag: 'Roamer',
  },
  {
    id: 'dragon',
    label: 'Dragon Slayer',
    title: 'DRAGON SLAYER',
    category: 'ranks',
    icon: '🐉',
    badge: 'MYTHIC BEAST',
    borderGradient: 'from-amber-400 via-red-500 to-yellow-600',
    glowColor: 'rgba(239,68,68,0.5)',
    bg: 'from-[#2b0c06] via-[#1a0603] to-[#0a0201]',
    badgeColor: 'bg-gradient-to-r from-red-500 to-amber-500 text-white',
    tag: 'Immortal',
  },
  {
    id: 'mecha',
    label: 'Cyber Mecha',
    title: 'CYBER CYBORG',
    category: 'cyber',
    icon: '🤖',
    badge: 'CYBER HUD',
    borderGradient: 'from-cyan-300 via-sky-400 to-blue-500',
    glowColor: 'rgba(6,182,212,0.5)',
    bg: 'from-[#04202c] via-[#02131b] to-[#01090d]',
    badgeColor: 'bg-cyan-400 text-slate-950',
    tag: 'Sci-Fi',
  },
  {
    id: 'fire',
    label: 'Inferno Phoenix',
    title: 'INFERNO PHOENIX',
    category: 'elements',
    icon: '🔥',
    badge: 'INFERNO',
    borderGradient: 'from-orange-400 via-rose-500 to-red-600',
    glowColor: 'rgba(249,115,22,0.55)',
    bg: 'from-[#2d0f04] via-[#1a0802] to-[#0b0301]',
    badgeColor: 'bg-orange-500 text-white',
    tag: 'Burn Aura',
  },
  {
    id: 'lightning',
    label: 'Volt Speedster',
    title: 'LIGHTNING BOLT',
    category: 'elements',
    icon: '⚡',
    badge: 'HYPER VOLT',
    borderGradient: 'from-yellow-300 via-amber-400 to-orange-500',
    glowColor: 'rgba(250,204,21,0.55)',
    bg: 'from-[#261d03] via-[#171101] to-[#080600]',
    badgeColor: 'bg-yellow-400 text-slate-950',
    tag: 'Overload',
  },
  {
    id: 'crystal',
    label: 'VIP Diamond',
    title: 'VIP DIAMOND',
    category: 'cyber',
    icon: '💎',
    badge: 'ROYAL VIP',
    borderGradient: 'from-cyan-300 via-blue-400 to-purple-500',
    glowColor: 'rgba(56,189,248,0.55)',
    bg: 'from-[#0b1c3d] via-[#061126] to-[#020612]',
    badgeColor: 'bg-gradient-to-r from-cyan-400 to-purple-500 text-white',
    tag: 'Diamond VIP',
  },
  {
    id: 'wolf',
    label: 'Apex Wolf',
    title: 'APEX PREDATOR',
    category: 'ranks',
    icon: '🐺',
    badge: 'LONE WOLF',
    borderGradient: 'from-slate-300 via-sky-400 to-indigo-600',
    glowColor: 'rgba(148,163,184,0.5)',
    bg: 'from-[#0e172a] via-[#090f1d] to-[#03060c]',
    badgeColor: 'bg-slate-300 text-slate-950',
    tag: 'Hunter',
  },
  {
    id: 'reaper',
    label: 'Dark Reaper',
    title: 'DARK REAPER',
    category: 'cyber',
    icon: '💀',
    badge: 'DARK LORD',
    borderGradient: 'from-purple-500 via-slate-600 to-rose-700',
    glowColor: 'rgba(147,51,234,0.5)',
    bg: 'from-[#170826] via-[#0e0417] to-[#05010a]',
    badgeColor: 'bg-purple-600 text-white',
    tag: 'Nightmare',
  },
  {
    id: 'cosmic',
    label: 'Cosmic Starlight',
    title: 'STARLIGHT COSMIC',
    category: 'elements',
    icon: '🌟',
    badge: 'STARLIGHT',
    borderGradient: 'from-pink-400 via-purple-500 to-indigo-500',
    glowColor: 'rgba(236,72,153,0.5)',
    bg: 'from-[#290826] via-[#170415] to-[#080108]',
    badgeColor: 'bg-gradient-to-r from-pink-500 to-purple-600 text-white',
    tag: 'Cosmic Pass',
  },
  {
    id: 'initial',
    label: 'Player Letter',
    title: 'CUSTOM BADGE',
    category: 'roles',
    icon: '👤',
    badge: 'CUSTOM',
    borderGradient: 'from-sky-400 via-blue-500 to-indigo-600',
    glowColor: 'rgba(14,165,233,0.4)',
    bg: 'from-[#081838] via-[#050e21] to-[#020610]',
    badgeColor: 'bg-sky-500 text-white',
    tag: 'Player UID',
  },
];

// Helper to resolve preset by ID with fallback
export const getGamerAvatarPreset = (id) => {
  if (!id) return GAMING_AVATAR_PRESETS[0];
  const found = GAMING_AVATAR_PRESETS.find((p) => p.id === id);
  if (found) {
    if (found.aliasOf) {
      return GAMING_AVATAR_PRESETS.find((p) => p.id === found.aliasOf) || found;
    }
    return found;
  }
  return GAMING_AVATAR_PRESETS[0];
};

// Reusable GamerAvatar Component
export const GamerAvatar = ({
  avatarId = 'crown',
  name = 'Player',
  size = 'md', // 'xs', 'sm', 'md', 'lg', 'xl'
  showGlow = true,
  ring = true,
  className = '',
  onClick,
}) => {
  const preset = getGamerAvatarPreset(avatarId);

  // Size mapping
  const sizeMap = {
    xs: {
      box: 'w-6 h-6',
      inner: 'w-5 h-5 rounded-md',
      frame: 'p-[1.5px] rounded-lg',
      text: 'text-[11px] font-black',
      iconText: 'text-[10px]',
    },
    sm: {
      box: 'w-8 h-8',
      inner: 'w-7 h-7 rounded-lg',
      frame: 'p-[1.5px] rounded-xl',
      text: 'text-xs font-black',
      iconText: 'text-sm',
    },
    md: {
      box: 'w-11 h-11',
      inner: 'w-10 h-10 rounded-xl',
      frame: 'p-[2px] rounded-2xl',
      text: 'text-base font-black',
      iconText: 'text-xl',
    },
    lg: {
      box: 'w-14 h-14',
      inner: 'w-[50px] h-[50px] rounded-2xl',
      frame: 'p-[2px] rounded-[18px]',
      text: 'text-xl font-black',
      iconText: 'text-2xl',
    },
    xl: {
      box: 'w-20 h-20 sm:w-24 sm:h-24',
      inner: 'w-[72px] h-[72px] sm:w-[88px] sm:h-[88px] rounded-2xl',
      frame: 'p-[2.5px] rounded-[22px]',
      text: 'text-2xl sm:text-3xl font-black',
      iconText: 'text-3xl sm:text-4xl',
    },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const letter = (name || 'P').charAt(0).toUpperCase();

  return (
    <div
      onClick={onClick}
      style={{
        boxShadow: showGlow ? `0 0 16px ${preset.glowColor}` : undefined,
      }}
      className={`relative ${currentSize.box} shrink-0 bg-gradient-to-tr ${preset.borderGradient} ${currentSize.frame} flex items-center justify-center transition-all duration-300 select-none ${
        onClick ? 'cursor-pointer active:scale-95 hover:scale-105' : ''
      } ${className}`}
    >
      {/* Inner background container */}
      <div
        className={`w-full h-full ${currentSize.inner} bg-gradient-to-b ${preset.bg} flex items-center justify-center overflow-hidden relative shadow-inner`}
      >
        {/* Subtle cyber background grid flare */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)',
            backgroundSize: '6px 6px',
          }}
        />

        {preset.id === 'initial' ? (
          <span
            className={`${currentSize.text} text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-sky-300 drop-shadow`}
          >
            {letter}
          </span>
        ) : preset.image ? (
          <img
            src={preset.image}
            alt={preset.label}
            className="w-full h-full object-cover select-none drop-shadow"
            onError={(e) => {
              e.target.style.display = 'none';
              if (e.target.nextSibling) {
                e.target.nextSibling.style.display = 'flex';
              }
            }}
          />
        ) : null}

        {/* Fallback emoji if no image or image failed */}
        {preset.id !== 'initial' && (!preset.image || preset.fallbackIcon) && (
          <span
            style={{ display: preset.image ? 'none' : 'flex' }}
            className={`${currentSize.iconText} items-center justify-center filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]`}
          >
            {preset.icon || preset.fallbackIcon}
          </span>
        )}

        {/* Gloss shine sweep overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Cyber corner accents on large and xl sizes */}
      {(size === 'lg' || size === 'xl') && (
        <>
          <span className="absolute -top-0.5 -left-0.5 w-1.5 h-1.5 border-t border-l border-white/80 rounded-tl" />
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 border-t border-r border-white/80 rounded-tr" />
          <span className="absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5 border-b border-l border-white/80 rounded-bl" />
          <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 border-b border-r border-white/80 rounded-br" />
        </>
      )}
    </div>
  );
};

export default GamerAvatar;
