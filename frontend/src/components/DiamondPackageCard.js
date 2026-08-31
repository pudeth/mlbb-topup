import React from 'react';
import DiamondTierGraphic from './DiamondTierGraphic';
import { useLanguage } from '../context/LanguageContext';

export const getTierMetadata = (amount) => {
  const num = parseInt(amount, 10) || 50;

  if (num < 100) {
    return {
      tierName: 'Starter Pack',
      tierNameKm: 'កញ្ចប់សាកល្បង',
      bonus: null,
      tag: null,
      theme: 'cyan',
      cardBg: 'from-cyan-950/40 via-slate-900 to-slate-950',
      borderGlow: 'hover:border-cyan-500/50',
      accentColor: 'text-cyan-400',
      badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    };
  }
  if (num < 200) {
    return {
      tierName: 'Handful Pack',
      tierNameKm: 'កញ្ចប់តូច',
      bonus: '+10 Bonus',
      tag: null,
      theme: 'blue',
      cardBg: 'from-blue-950/40 via-slate-900 to-slate-950',
      borderGlow: 'hover:border-blue-500/50',
      accentColor: 'text-blue-400',
      badgeBg: 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950',
    };
  }
  if (num < 300) {
    return {
      tierName: 'Gem Pouch',
      tierNameKm: 'កញ្ចប់កូនថង់',
      bonus: '+25 Bonus',
      tag: 'POPULAR 🔥',
      theme: 'emerald',
      cardBg: 'from-emerald-950/30 via-slate-900 to-slate-950',
      borderGlow: 'hover:border-emerald-500/50',
      accentColor: 'text-emerald-400',
      badgeBg: 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950',
    };
  }
  if (num < 500) {
    return {
      tierName: 'Overflowing Sack',
      tierNameKm: 'កញ្ចប់ពេញនិយម',
      bonus: '+45 Bonus',
      tag: 'HOT 🔥',
      theme: 'amber',
      cardBg: 'from-amber-950/30 via-slate-900 to-slate-950',
      borderGlow: 'hover:border-amber-500/50',
      accentColor: 'text-amber-400',
      badgeBg: 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950',
    };
  }
  if (num < 1000) {
    return {
      tierName: 'Treasure Coffer',
      tierNameKm: 'ប្រអប់កំណប់',
      bonus: '+65 Bonus',
      tag: 'BEST VALUE ⭐',
      theme: 'orange',
      cardBg: 'from-orange-950/30 via-slate-900 to-slate-950',
      borderGlow: 'hover:border-orange-500/50',
      accentColor: 'text-orange-400',
      badgeBg: 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950',
    };
  }
  if (num < 2000) {
    return {
      tierName: 'Royal Chest',
      tierNameKm: 'ហឹបមាសរាជវង្ស',
      bonus: '+150 Bonus',
      tag: 'BEST SELLER 🏆',
      theme: 'purple',
      cardBg: 'from-purple-950/40 via-slate-900 to-slate-950',
      borderGlow: 'hover:border-purple-500/50',
      accentColor: 'text-purple-400',
      badgeBg: 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950',
    };
  }
  if (num < 4000) {
    return {
      tierName: 'Grand Treasury',
      tierNameKm: 'ឃ្លាំងមហាសម្បត្តិ',
      bonus: '+450 Bonus',
      tag: 'VIP PRO 👑',
      theme: 'fuchsia',
      cardBg: 'from-fuchsia-950/40 via-slate-900 to-slate-950',
      borderGlow: 'hover:border-fuchsia-500/50',
      accentColor: 'text-fuchsia-400',
      badgeBg: 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950',
    };
  }
  return {
    tierName: 'Mythic Vault',
    tierNameKm: 'មហាកំណប់ទេវតា',
    bonus: '+1,000 Bonus',
    tag: 'ULTIMATE ⚡',
    theme: 'mythic',
    cardBg: 'from-cyan-950/50 via-purple-950/40 to-slate-950',
    borderGlow: 'hover:border-cyan-400',
    accentColor: 'text-amber-300',
    badgeBg: 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950',
  };
};

const DiamondPackageCard = ({
  pkg,
  isSelected = false,
  onSelect,
  compact = false,
  showBuyText = true,
}) => {
  const { t, language } = useLanguage();
  const amount = pkg.diamondAmount || pkg.amount || 50;
  const price = typeof pkg.price === 'number' ? pkg.price : parseFloat(pkg.price?.toString().replace('$', '') || '0');
  const meta = getTierMetadata(amount);

  // Bonus override if provided in pkg object
  const bonusText = pkg.bonus !== undefined ? pkg.bonus : meta.bonus;
  const rielPrice = Math.round(price * 4100).toLocaleString();

  return (
    <div
      onClick={() => onSelect && onSelect(pkg)}
      className={`group relative rounded-2xl p-3.5 sm:p-4 cursor-pointer transition-all duration-300 flex flex-col justify-between select-none overflow-hidden ${
        isSelected
          ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.35)] scale-[1.02] -translate-y-1'
          : `bg-gradient-to-b ${meta.cardBg} border border-slate-800/90 ${meta.borderGlow} hover:bg-slate-850 hover:-translate-y-0.5 hover:shadow-lg`
      }`}
    >
      {/* Top Banner Tag (e.g. HOT, BEST VALUE) */}
      {meta.tag && !bonusText && (
        <div className="absolute top-2 left-2 z-10">
          <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-slate-900/90 border border-slate-700 text-cyan-400 shadow-sm">
            {meta.tag}
          </span>
        </div>
      )}

      {/* Bonus Pill Badge (Top-Right) */}
      {bonusText && (
        <div className="absolute top-2.5 right-2.5 z-10 animate-pulse-slow">
          <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full shadow-[0_2px_8px_rgba(245,158,11,0.5)] flex items-center gap-1">
            <span>✨</span>
            <span>{bonusText}</span>
          </div>
        </div>
      )}

      {/* Visual Diamond Tier Graphic Section */}
      <div className="flex flex-col items-center justify-center pt-2 pb-1 relative">
        {/* Subtle Ambient Radial Light behind Tier Graphic */}
        <div
          className={`absolute w-16 h-16 sm:w-20 sm:h-20 rounded-full blur-xl pointer-events-none opacity-40 transition-opacity group-hover:opacity-70 ${
            amount >= 2500
              ? 'bg-gradient-to-tr from-pink-500 to-cyan-500'
              : amount >= 625
              ? 'bg-gradient-to-tr from-purple-500 to-amber-500'
              : 'bg-cyan-500'
          }`}
        />

        <div className="relative z-10 transition-transform duration-300 group-hover:scale-110">
          <DiamondTierGraphic amount={amount} size={compact ? 'sm' : 'md'} />
        </div>
      </div>

      {/* Diamond Count & Label */}
      <div className="text-center my-1.5 relative z-10">
        <div className="flex items-center justify-center gap-1">
          <span className="text-xl sm:text-2xl font-black text-white tracking-tight group-hover:text-amber-300 transition-colors">
            {amount.toLocaleString()}
          </span>
        </div>
        <div className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          {t('diamonds_unit') || (language === 'km' ? 'គ្រាប់ពេជ្រ' : 'Diamonds')}
        </div>
      </div>

      {/* Bottom Price & Buy / Select Button */}
      <div className="pt-2.5 mt-1 border-t border-slate-800/80 flex items-center justify-between gap-1 relative z-10">
        <div>
          <div className="text-sm sm:text-base font-black text-amber-400 tracking-tight">
            ${price.toFixed(2)}
          </div>
          <div className="text-[9px] sm:text-[10px] text-slate-500 font-mono">
            ~{rielPrice} ៛
          </div>
        </div>

        {/* Action Button: "ទិញ →" / "Select ✓" */}
        <div className="shrink-0">
          {isSelected ? (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 font-black text-[10px] sm:text-xs shadow-[0_0_10px_rgba(245,158,11,0.5)]">
              <span>✓</span>
              <span className="hidden xs:inline">{language === 'km' ? 'បានរើស' : 'Selected'}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 group-hover:bg-cyan-500 group-hover:text-slate-950 text-cyan-400 font-extrabold text-[10px] sm:text-xs transition-all duration-200 shadow-sm">
              <span>{language === 'km' ? 'ទិញ' : (t('sec_buy_btn') || 'Buy')}</span>
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiamondPackageCard;
