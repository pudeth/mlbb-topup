import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import abaLogoImg from '../assets/aba-logo.png';
import khqrLogoImg from '../assets/khqr-logo.png';

/**
 * Ultra-High-Quality Official Payment Acceptance Marks
 * Featuring exclusively: Official ABA and KHQR logos
 */
export const WeAcceptPayments = ({ className = "" }) => {
  const { language } = useLanguage();

  return (
    <div
      className={`flex flex-wrap items-center gap-2 select-none min-h-[18px] ${className}`}
      title="We accept: ABA, KHQR"
    >
      {/* Label: We accept */}
      <span className="text-slate-300 font-semibold text-[11px] sm:text-[12px] tracking-tight shrink-0 mr-0.5 leading-none font-khmer">
        {language === 'km' ? 'យើងទទួលយក៖' : 'We accept:'}
      </span>

      {/* 1. Official ABA Logo Badge */}
      <img
        src={abaLogoImg}
        alt="ABA Bank"
        className="h-[18px] sm:h-[19px] w-auto shrink-0 object-contain rounded-[4px] shadow-sm select-none"
        onError={(e) => {
          if (e.target.src !== `${process.env.PUBLIC_URL || ''}/images/aba-logo.png`) {
            e.target.src = `${process.env.PUBLIC_URL || ''}/images/aba-logo.png`;
          }
        }}
      />

      {/* 2. Official KHQR Logo Badge */}
      <img
        src={khqrLogoImg}
        alt="KHQR"
        className="h-[18px] sm:h-[19px] w-auto shrink-0 object-contain rounded-[4px] shadow-sm select-none"
        onError={(e) => {
          if (e.target.src !== `${process.env.PUBLIC_URL || ''}/images/khqr-logo.png`) {
            e.target.src = `${process.env.PUBLIC_URL || ''}/images/khqr-logo.png`;
          }
        }}
      />
    </div>
  );
};

export default WeAcceptPayments;
