import React from 'react';
import { useLanguage } from '../context/LanguageContext';

/**
 * Ultra-High-Quality Vector Payment Acceptance Marks
 * Featuring exclusively: ABA and KHQR
 */
export const WeAcceptPayments = ({ className = "" }) => {
  const { language } = useLanguage();

  return (
    <div
      className={`flex flex-wrap items-center gap-1.5 select-none min-h-[18px] ${className}`}
      title="We accept: ABA, KHQR"
    >
      {/* Label: We accept */}
      <span className="text-slate-300 font-semibold text-[11px] sm:text-[12px] tracking-tight shrink-0 mr-0.5 leading-none">
        {language === 'km' ? 'យើងទទួលយក៖' : 'We accept:'}
      </span>

      {/* 1. ABA' Badge */}
      <svg
        viewBox="0 0 32 20"
        className="h-[18px] w-auto shrink-0"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="ABA Bank"
      >
        <rect width="32" height="20" rx="3.5" fill="#005B7F" />
        <text
          x="13.5"
          y="14"
          fill="#FFFFFF"
          fontSize="9.5"
          fontWeight="900"
          fontFamily="system-ui, -apple-system, sans-serif"
          textAnchor="middle"
          letterSpacing="0.4"
        >
          ABA
        </text>
        <rect x="24.5" y="6" width="2" height="4.5" rx="0.6" fill="#E21A1A" />
      </svg>

      {/* 2. KHQR Badge */}
      <svg
        viewBox="0 0 32 20"
        className="h-[18px] w-auto shrink-0"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="KHQR"
      >
        <rect width="32" height="20" rx="3.5" fill="#E21A1A" />
        <text
          x="16"
          y="14.2"
          fill="#FFFFFF"
          fontSize="9"
          fontWeight="900"
          fontFamily="system-ui, -apple-system, sans-serif"
          textAnchor="middle"
          letterSpacing="0.3"
        >
          KHQR
        </text>
      </svg>
    </div>
  );
};

export default WeAcceptPayments;
