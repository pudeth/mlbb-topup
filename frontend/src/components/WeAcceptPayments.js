import React from 'react';
import { useLanguage } from '../context/LanguageContext';

/**
 * Ultra-High-Quality Vector Payment Acceptance Marks
 * Strictly matching Figma node (width: 326px, height: 18px, gap: 4px)
 * Featuring: ABA, KHQR, Visa, Mastercard, UnionPay, JCB, Alipay, WeChat Pay
 */
export const WeAcceptPayments = ({ className = "" }) => {
  const { language } = useLanguage();

  return (
    <div
      className={`inline-flex items-center gap-[4px] select-none ${className}`}
      style={{ height: '18px' }}
      title="We accept: ABA, KHQR, Visa, Mastercard, UnionPay, JCB, Alipay, WeChat Pay"
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

      {/* 3. VISA Badge */}
      <svg
        viewBox="0 0 32 20"
        className="h-[18px] w-auto shrink-0"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Visa"
      >
        <rect width="32" height="20" rx="3.5" fill="#1434CB" />
        <path
          d="M13.2 5.5l-2.6 8.8H8.5L7 7.5c-.1-.4-.2-.6-.6-.8-.7-.4-1.6-.7-2.4-.9l.2-.7h3.8c.6 0 1.1.4 1.2 1.1l.8 5.2 2.1-5.4h1.7zm4.3 5.4c0-2.3-3.2-2.5-3.2-3.6 0-.8.7-1.1 1.4-1.2.9-.1 1.9 0 2.9.5l.4-1.9c-.6-.2-1.3-.4-2.3-.4-2.5 0-4.2 1.3-4.2 3.2 0 1.4 1.2 2.3 2.3 2.8 1 .5 1.3.8 1.3 1.3 0 .7-.9 1-1.8 1-.9 0-2.2-.2-3-.6l-.4 2c.7.3 2 .6 3.3.6 2.7 0 4.4-1.3 4.4-3.3zm6.8 3.4h2.1L24.7 5.5h-2c-.4 0-.8.3-.9.7l-3.3 8.1h2.2l.4-1.2h2.6l.7 1.2zm-2.2-3l.9-2.9.5 2.9h-1.4z"
          fill="#FFFFFF"
        />
      </svg>

      {/* 4. Mastercard Badge */}
      <svg
        viewBox="0 0 32 20"
        className="h-[18px] w-auto shrink-0"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Mastercard"
      >
        <rect width="32" height="20" rx="3.5" fill="#000000" />
        <circle cx="12" cy="10" r="6" fill="#EB001B" />
        <circle cx="20" cy="10" r="6" fill="#F79E1B" />
        <path
          d="M16 5.8a6 6 0 0 1 0 8.4 6 6 0 0 1 0-8.4z"
          fill="#FF5F00"
        />
      </svg>

      {/* 5. UnionPay Badge */}
      <svg
        viewBox="0 0 32 20"
        className="h-[18px] w-auto shrink-0"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="UnionPay"
      >
        <rect width="32" height="20" rx="3.5" fill="#C8102E" />
        <path d="M12 0h12l-5 20H7l5-20z" fill="#003087" />
        <path d="M18 0h14l-5 20H13l5-20z" fill="#00A3E0" />
        <text
          x="16"
          y="10"
          fill="#FFFFFF"
          fontSize="4.6"
          fontWeight="900"
          fontStyle="italic"
          textAnchor="middle"
          fontFamily="system-ui, sans-serif"
        >
          UnionPay
        </text>
        <text
          x="16"
          y="15.5"
          fill="#FFFFFF"
          fontSize="5"
          fontWeight="900"
          fontStyle="italic"
          textAnchor="middle"
          fontFamily="sans-serif"
        >
          银联
        </text>
      </svg>

      {/* 6. JCB Badge */}
      <svg
        viewBox="0 0 32 20"
        className="h-[18px] w-auto shrink-0"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="JCB"
      >
        <rect width="32" height="20" rx="3.5" fill="#0A111F" />
        <rect x="2" y="2" width="8.5" height="16" rx="2" fill="#003B70" />
        <rect x="11.5" y="2" width="8.5" height="16" rx="2" fill="#D3202A" />
        <rect x="21" y="2" width="8.5" height="16" rx="2" fill="#008837" />
        <text
          x="6.2"
          y="13.2"
          fill="#FFFFFF"
          fontSize="7.5"
          fontWeight="900"
          fontFamily="sans-serif"
          textAnchor="middle"
        >
          J
        </text>
        <text
          x="15.7"
          y="13.2"
          fill="#FFFFFF"
          fontSize="7.5"
          fontWeight="900"
          fontFamily="sans-serif"
          textAnchor="middle"
        >
          C
        </text>
        <text
          x="25.2"
          y="13.2"
          fill="#FFFFFF"
          fontSize="7.5"
          fontWeight="900"
          fontFamily="sans-serif"
          textAnchor="middle"
        >
          B
        </text>
      </svg>

      {/* 7. Alipay Badge */}
      <svg
        viewBox="0 0 32 20"
        className="h-[18px] w-auto shrink-0"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Alipay"
      >
        <rect width="32" height="20" rx="3.5" fill="#00A0E9" />
        <text
          x="16"
          y="15"
          fill="#FFFFFF"
          fontSize="13"
          fontWeight="900"
          fontFamily="'PingFang SC', 'Microsoft YaHei', sans-serif"
          textAnchor="middle"
        >
          支
        </text>
      </svg>

      {/* 8. WeChat Pay Badge */}
      <svg
        viewBox="0 0 32 20"
        className="h-[18px] w-auto shrink-0"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="WeChat Pay"
      >
        <rect width="32" height="20" rx="3.5" fill="#07C160" />
        {/* White speech bubble */}
        <path
          d="M16 4C12.7 4 10 6.3 10 9.2c0 1.6.9 3.1 2.3 4.1l-.6 1.8 2-1c.7.2 1.5.3 2.3.3 3.3 0 6-2.3 6-5.2S19.3 4 16 4z"
          fill="#FFFFFF"
        />
        {/* Green checkmark inside */}
        <path
          d="M13.8 9.4l1.6 1.6 3.4-3.4"
          stroke="#07C160"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default WeAcceptPayments;
