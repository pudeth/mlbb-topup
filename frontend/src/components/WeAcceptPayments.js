import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import abaLogoHd from '../assets/aba-logo-hd.png';
import khqrLogoHd from '../assets/khqr-logo-hd.png';
import abaLogoImg from '../assets/aba-logo.png';
import khqrLogoImg from '../assets/khqr-logo.png';

/**
 * Ultra-High-Quality Official Payment Acceptance Marks
 * Featuring exclusively: Official ABA and KHQR logos in crisp HD resolution & enhanced size
 */
export const WeAcceptPayments = ({ className = "", size = "md" }) => {
  const { language } = useLanguage();

  const imgHeightClass =
    size === "lg"
      ? "h-[30px] sm:h-[34px]"
      : size === "sm"
      ? "h-[22px] sm:h-[24px]"
      : "h-[26px] sm:h-[28px]";

  return (
    <div
      className={`flex flex-wrap items-center gap-2 sm:gap-2.5 select-none ${className}`}
      title="We accept: ABA, KHQR"
    >
      {/* Label: We accept */}
      <span className="text-slate-200 font-bold text-xs sm:text-sm tracking-tight shrink-0 mr-0.5 leading-none font-khmer flex items-center">
        {language === 'km' ? 'យើងទទួលយក៖' : 'We accept:'}
      </span>

      {/* 1. Official ABA Logo Badge (Ultra HD) */}
      <div className="relative inline-flex items-center group">
        <img
          src={abaLogoHd}
          srcSet={`${abaLogoImg} 118w, ${abaLogoHd} 472w`}
          sizes="(max-width: 640px) 44px, 48px"
          alt="ABA Bank"
          className={`${imgHeightClass} w-auto shrink-0 object-contain rounded-[6px] shadow-md border border-white/10 transition-transform duration-200 group-hover:scale-105 select-none`}
          loading="eager"
          decoding="async"
          onError={(e) => {
            if (e.target.src !== `${process.env.PUBLIC_URL || ''}/images/aba-logo-hd.png`) {
              e.target.src = `${process.env.PUBLIC_URL || ''}/images/aba-logo-hd.png`;
            }
          }}
        />
      </div>

      {/* 2. Official KHQR Logo Badge (Ultra HD) */}
      <div className="relative inline-flex items-center group">
        <img
          src={khqrLogoHd}
          srcSet={`${khqrLogoImg} 118w, ${khqrLogoHd} 472w`}
          sizes="(max-width: 640px) 44px, 48px"
          alt="KHQR"
          className={`${imgHeightClass} w-auto shrink-0 object-contain rounded-[6px] shadow-md border border-white/10 transition-transform duration-200 group-hover:scale-105 select-none`}
          loading="eager"
          decoding="async"
          onError={(e) => {
            if (e.target.src !== `${process.env.PUBLIC_URL || ''}/images/khqr-logo-hd.png`) {
              e.target.src = `${process.env.PUBLIC_URL || ''}/images/khqr-logo-hd.png`;
            }
          }}
        />
      </div>
    </div>
  );
};

export default WeAcceptPayments;
