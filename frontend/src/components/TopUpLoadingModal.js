import React, { useState, useEffect } from 'react';
import DiamondTierGraphic from './DiamondTierGraphic';
import { useLanguage } from '../context/LanguageContext';

const TopUpLoadingModal = ({
  selectedProduct,
  verifiedAccount,
  formData,
}) => {
  const { t, language } = useLanguage();
  const [progress, setProgress] = useState(25);
  const [activeStep, setActiveStep] = useState(1);

  // Progressive simulation for smooth visual feedback
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setProgress(60);
      setActiveStep(2);
    }, 600);

    const timer2 = setTimeout(() => {
      setProgress(90);
      setActiveStep(3);
    }, 1400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const diamondAmount = selectedProduct?.diamondAmount || selectedProduct?.amount || 50;
  const price = selectedProduct?.price || 0;

  const stepsData = {
    km: [
      { id: 1, label: 'ផ្ទៀងផ្ទាត់គណនី MLBB', sub: 'Player ID & Server ID ត្រឹមត្រូវ' },
      { id: 2, label: 'កំពុងបង្កើត Bakong KHQR', sub: 'ប្រព័ន្ធទូទាត់ស្វ័យប្រវត្តគ្មានថ្លៃសេវា' },
      { id: 3, label: 'ត្រៀមដឹកជញ្ជូន ១០ វិនាទី', sub: 'បញ្ចូលផ្ទាល់ចូលទៅក្នុងហ្គេម' },
    ],
    en: [
      { id: 1, label: 'Verifying MLBB Account', sub: 'Player ID & Zone ID validated' },
      { id: 2, label: 'Generating Bakong KHQR', sub: 'Zero-fee instant dynamic QR code' },
      { id: 3, label: 'Ready for 10s Delivery', sub: 'Direct delivery to in-game mail' },
    ],
    zh: [
      { id: 1, label: '核对 MLBB 游戏账号', sub: '已确认玩家 ID 与区服 ID' },
      { id: 2, label: '正在生成 Bakong KHQR', sub: '0 手续费实时动态收据二维码' },
      { id: 3, label: '准备 10 秒极速直充', sub: '支付后直接到账游戏内邮箱' },
    ],
  };

  const steps = stepsData[language] || stepsData.km;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-fadeIn">
      {/* Background ambient lighting orbs */}
      <div className="absolute w-80 h-80 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none -top-10 -left-10 animate-pulse-slow"></div>
      <div className="absolute w-80 h-80 rounded-full bg-amber-500/15 blur-3xl pointer-events-none -bottom-10 -right-10 animate-pulse-slow"></div>

      {/* Main Glassmorphic Modal Box */}
      <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-950/95 border border-cyan-500/30 p-6 sm:p-7 shadow-[0_0_50px_rgba(6,182,212,0.25)] overflow-hidden">
        
        {/* Top Glowing Edge Line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>

        {/* Center Cyber Hologram Portal Animation */}
        <div className="relative flex flex-col items-center justify-center pt-2 pb-4">
          
          <div className="relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28">
            {/* Outer Slow Ambient Ring */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-500/30 animate-spin [animation-duration:8s]"></div>
            
            {/* Fast Glowing Hexagon / Ring */}
            <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-amber-400 border-r-cyan-400 animate-spin [animation-duration:1.2s] shadow-[0_0_20px_rgba(6,182,212,0.4)]"></div>
            
            {/* Counter-Spin Violet Ring */}
            <div className="absolute inset-4 rounded-full border border-dashed border-purple-500/50 animate-spin [animation-duration:4s] [animation-direction:reverse]"></div>

            {/* Pulsing Tier Diamond Illustration in Center */}
            <div className="relative z-10 scale-90 animate-bounce [animation-duration:2.5s]">
              <DiamondTierGraphic amount={diamondAmount} size="sm" />
            </div>

            {/* Sparkle Glints */}
            <span className="absolute -top-1 right-2 text-xs text-amber-300 animate-ping">✨</span>
            <span className="absolute bottom-1 left-2 text-xs text-cyan-300 animate-ping [animation-delay:400ms]">⚡</span>
          </div>

          {/* Heading with Neon Gradient */}
          <div className="mt-3 text-center space-y-1">
            <h3 className="text-lg sm:text-xl font-black bg-gradient-to-r from-cyan-300 via-white to-amber-300 bg-clip-text text-transparent tracking-wide">
              {language === 'km' ? 'កំពុងបង្កើត KHQR ស្វ័យប្រវត្តិ...' : (t('generating_khqr') || 'Generating Bakong KHQR...')}
            </h3>
            <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{language === 'km' ? 'ប្រព័ន្ធកំពុងដំណើរការទូទាត់ភ្លាមៗ' : 'Real-time automated checkout'}</span>
            </p>
          </div>
        </div>

        {/* Selected Package Details Pill */}
        <div className="my-4 p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-lg">
              💎
            </div>
            <div>
              <div className="text-xs sm:text-sm font-extrabold text-white">
                {diamondAmount.toLocaleString()} {t('diamonds_unit')}
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-400 font-mono">
                {verifiedAccount ? `${verifiedAccount.username}` : `ID: ${formData?.playerID || 'MLBB'}`}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm sm:text-base font-black text-amber-400">
              ${price.toFixed(2)}
            </div>
            <div className="text-[9px] text-slate-500">
              ~{Math.round(price * 4100).toLocaleString()} ៛
            </div>
          </div>
        </div>

        {/* Dynamic Step Pipeline Checklist */}
        <div className="space-y-2 mb-4">
          {steps.map((s, idx) => {
            const isDone = activeStep > s.id;
            const isCurrent = activeStep === s.id;

            return (
              <div
                key={s.id}
                className={`p-2.5 rounded-xl transition-all duration-300 flex items-center gap-3 ${
                  isCurrent
                    ? 'bg-cyan-500/10 border border-cyan-500/30 shadow-sm'
                    : isDone
                    ? 'bg-slate-950/40 border border-emerald-500/20'
                    : 'bg-slate-950/20 border border-slate-850 opacity-50'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 ${
                    isDone
                      ? 'bg-emerald-500 text-slate-950'
                      : isCurrent
                      ? 'bg-cyan-400 text-slate-950 animate-pulse'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isDone ? '✓' : isCurrent ? '⚡' : idx + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <div className={`text-xs font-bold ${isCurrent ? 'text-cyan-300' : isDone ? 'text-white' : 'text-slate-400'}`}>
                    {s.label}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {s.sub}
                  </div>
                </div>

                {isCurrent && (
                  <div className="w-3.5 h-3.5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin shrink-0"></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Glowing Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
            <span>{language === 'km' ? 'ដំណើរការ' : 'Progress'}</span>
            <span className="text-cyan-400 font-mono">{progress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden p-[1px] border border-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-sky-400 to-amber-400 transition-all duration-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Bottom Trust Guarantee Badge */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-center gap-3 text-[10px] text-slate-400 font-semibold">
          <span className="flex items-center gap-1 text-emerald-400">
            <span>🛡️</span> {language === 'km' ? 'Bakong KHQR ផ្លូវការ' : 'Official Bakong KHQR'}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-cyan-400">
            <span>⚡</span> {language === 'km' ? 'ដឹកជញ្ជូន ១០ វិនាទី' : '10s Auto Top-Up'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TopUpLoadingModal;
