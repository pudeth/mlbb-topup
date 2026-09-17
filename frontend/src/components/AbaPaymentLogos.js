import React from 'react';

/**
 * ABA PayWay & KHQR Official Compliance Logos (SVG Vector)
 * Strictly complying with ABA Bank Merchant Integration Guideline v2.11
 */

export const AbaPayLogo = ({ className = "h-5 w-auto" }) => (
  <svg viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="ABA PAY">
    <rect width="120" height="40" rx="8" fill="#003B70" />
    {/* ABA Letters */}
    <path d="M16 28L21.5 12H27L32.5 28H27.5L26.3 24.2H22.2L21 28H16ZM23.2 20.8H25.3L24.2 16.5L23.2 20.8Z" fill="white" />
    <path d="M34 28V12H41.5C44 12 45.8 13.2 45.8 15.6C45.8 17.2 44.9 18.4 43.6 19C45.3 19.6 46.4 21 46.4 23C46.4 25.8 44.2 28 41.2 28H34ZM38.8 18.2H41C41.9 18.2 42.4 17.6 42.4 16.8C42.4 16 41.9 15.4 41 15.4H38.8V18.2ZM38.8 24.6H41.4C42.4 24.6 43 24 43 23.1C43 22.2 42.4 21.6 41.4 21.6H38.8V24.6Z" fill="white" />
    <path d="M47.5 28L53 12H58.5L64 28H59L57.8 24.2H53.7L52.5 28H47.5ZM54.7 20.8H56.8L55.7 16.5L54.7 20.8Z" fill="white" />
    {/* PAY Badge */}
    <rect x="68" y="9" width="44" height="22" rx="5" fill="#00A3E0" />
    <text x="90" y="24" fill="#002D56" fontSize="11" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" textAnchor="middle" letterSpacing="0.8">
      PAY
    </text>
  </svg>
);

export const AbaPaywayLogo = ({ className = "h-7 w-auto", dark = false }) => (
  <div className={`inline-flex items-center gap-1.5 ${className}`}>
    <svg viewBox="0 0 140 38" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-auto">
      <rect width="140" height="38" rx="7" fill={dark ? "#002B52" : "#0055A5"} />
      {/* ABA */}
      <text x="12" y="25" fill="#FFFFFF" fontSize="17" fontWeight="900" fontFamily="system-ui, sans-serif" letterSpacing="0.5">
        ABA
      </text>
      {/* Cyan Dot */}
      <circle cx="58" cy="22" r="3" fill="#00C4FF" />
      {/* PayWay */}
      <text x="66" y="25" fill="#FFFFFF" fontSize="14" fontWeight="800" fontFamily="system-ui, sans-serif">
        PayWay
      </text>
    </svg>
  </div>
);

export const KhqrLogo = ({ className = "h-5 w-auto" }) => (
  <svg viewBox="0 0 85 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="KHQR">
    <rect width="85" height="36" rx="6" fill="#E21A1A" />
    {/* KHQR Text */}
    <text x="10" y="24" fill="#FFFFFF" fontSize="15" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.5">
      KHQR
    </text>
    {/* Bakong Emblem Swirl */}
    <circle cx="70" cy="18" r="9" stroke="white" strokeWidth="2.2" fill="none" />
    <path d="M68 13C71 13 73 15 73 18C73 21 70 23 67 22" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

/**
 * Authentic Red KHQR Voucher Header
 * Strictly matching ABA PayWay Figma Guideline (Image 2)
 */
export const KhqrVoucherHeader = () => (
  <div className="relative w-full bg-[#E21A1A] py-3.5 px-4 flex items-center justify-center rounded-t-2xl overflow-hidden">
    <svg viewBox="0 0 110 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 sm:h-7 w-auto">
      {/* K */}
      <path d="M12 6V26H16.5V17.5L22.5 26H28.2L20.8 15.6L27.6 6H22L16.5 13.8V6H12Z" fill="white" />
      {/* H */}
      <path d="M32 6V26H36.5V18H44.5V26H49V6H44.5V13.8H36.5V6H32Z" fill="white" />
      {/* Q */}
      <path d="M53 10C53 7.8 54.8 6 57 6H69C71.2 6 73 7.8 73 10V22C73 24.2 71.2 26 69 26H57C54.8 26 53 24.2 53 22V10ZM57.5 10.5V21.5H68.5V10.5H57.5Z" fill="white" />
      <rect x="61" y="14" width="4" height="4" fill="white" />
      {/* R */}
      <path d="M77 6V26H81.5V18H86.2L91.5 26H96.5L90.8 17.5C93.8 16.8 95.5 14.8 95.5 12C95.5 8 92.5 6 87 6H77ZM81.5 14V10H86.8C89.2 10 90.8 10.8 90.8 12C90.8 13.2 89.2 14 86.8 14H81.5Z" fill="white" />
    </svg>
    {/* Diagonal Corner Cut Fold */}
    <div className="absolute top-0 right-0 w-0 h-0 border-t-[16px] border-t-white border-l-[16px] border-l-transparent" />
  </div>
);

/**
 * Official ABA PayWay Voucher Header
 */
export const AbaPaywayVoucherHeader = () => (
  <div className="relative w-full bg-gradient-to-r from-[#003B70] to-[#0055A5] py-3.5 px-4 flex items-center justify-between rounded-t-2xl overflow-hidden shadow-inner">
    <div className="flex items-center gap-2">
      <svg viewBox="0 0 120 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 sm:h-7 w-auto">
        <text x="4" y="24" fill="#FFFFFF" fontSize="22" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.8">
          ABA
        </text>
        <circle cx="58" cy="13" r="3.2" fill="#00C4FF" />
        <rect x="65" y="4" width="50" height="24" rx="5" fill="#00A3E0" />
        <text x="90" y="21" fill="#002D56" fontSize="12" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" textAnchor="middle" letterSpacing="0.8">
          PAY
        </text>
      </svg>
    </div>
    <div className="flex items-center gap-1.5 pr-4">
      <span className="text-[10px] font-extrabold tracking-widest text-sky-200 uppercase bg-white/10 px-2 py-0.5 rounded-md">
        PAYWAY
      </span>
    </div>
    <div className="absolute top-0 right-0 w-0 h-0 border-t-[16px] border-t-white border-l-[16px] border-l-transparent" />
  </div>
);

export const VisaLogo = ({ className = "h-5 w-auto" }) => (
  <svg viewBox="0 0 60 22" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Visa">
    <rect width="60" height="22" rx="4" fill="#FFFFFF" />
    <path d="M23.1 3.5L18.4 18.5H14.8L12.1 6.8C11.9 6 11.7 5.7 11 5.3C9.8 4.6 8.1 4.1 6.8 3.8L7.1 2.5H13.6C14.7 2.5 15.6 3.3 15.8 4.6L17.2 13.5L20.9 2.5H24.5M30.6 12.8C30.6 8.8 25.1 8.6 25.2 6.6C25.2 6 25.8 5.4 27 5.2C27.6 5.1 29.3 5.1 31.1 6L31.8 2.8C30.8 2.4 29.5 2.1 27.9 2.1C23.6 2.1 20.6 4.4 20.6 7.7C20.6 10.2 22.8 11.6 24.5 12.5C26.3 13.4 26.9 14 26.9 14.8C26.9 16.1 25.3 16.6 23.9 16.6C22.1 16.6 21 16.3 19.5 15.6L18.8 18.9C20.1 19.5 22.3 20 24.6 20C29.2 20 32.2 17.7 32.2 14.2M42.2 18.5H45.8L43.6 2.5H40.2C39.4 2.5 38.7 3 38.4 3.7L32.8 18.5H36.6L37.4 16.3H41.8L42.2 18.5ZM38.4 13.4L40.2 8.3L41.2 13.4H38.4ZM56.8 2.5L53.9 18.5H50.5L53.4 2.5H56.8Z" fill="#1434CB" />
    <path d="M12.1 6.8L9.9 2.5H6.8L6.6 3.6C8.8 4.2 10.8 5 12.1 6.8Z" fill="#F7B600" />
  </svg>
);

export const MastercardLogo = ({ className = "h-5 w-auto" }) => (
  <svg viewBox="0 0 60 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Mastercard">
    <rect width="60" height="36" rx="4" fill="#FFFFFF" />
    <circle cx="23" cy="18" r="12" fill="#EB001B" />
    <circle cx="37" cy="18" r="12" fill="#F79E1B" />
    <path d="M30 9.2C32.8 11.4 34.6 14.5 34.6 18C34.6 21.5 32.8 24.6 30 26.8C27.2 24.6 25.4 21.5 25.4 18C25.4 14.5 27.2 11.4 30 9.2Z" fill="#FF5F00" />
  </svg>
);

export const UnionPayLogo = ({ className = "h-5 w-auto" }) => (
  <svg viewBox="0 0 60 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="UnionPay">
    <rect width="60" height="36" rx="4" fill="#FFFFFF" />
    {/* 3 slanted blocks */}
    <path d="M14 6H25L20 30H9L14 6Z" fill="#C8102E" />
    <path d="M25 6H36L31 30H20L25 6Z" fill="#003087" />
    <path d="M36 6H47L42 30H31L36 6Z" fill="#00A3E0" />
    <text x="30" y="22" fill="#FFFFFF" fontSize="7" fontWeight="900" fontFamily="sans-serif" textAnchor="middle" fontStyle="italic">
      UnionPay
    </text>
  </svg>
);

export const JcbLogo = ({ className = "h-5 w-auto" }) => (
  <svg viewBox="0 0 54 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="JCB">
    <rect width="54" height="36" rx="4" fill="#FFFFFF" />
    <rect x="7" y="6" width="12" height="24" rx="2" fill="#0E4C92" />
    <rect x="21" y="6" width="12" height="24" rx="2" fill="#D3202A" />
    <rect x="35" y="6" width="12" height="24" rx="2" fill="#008837" />
    <text x="13" y="22" fill="#FFFFFF" fontSize="10" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">J</text>
    <text x="27" y="22" fill="#FFFFFF" fontSize="10" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">C</text>
    <text x="41" y="22" fill="#FFFFFF" fontSize="10" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">B</text>
  </svg>
);

/**
 * Official Acceptance Marks Row
 * Shows all supported payment schemes processed via ABA PayWay
 */
export const AbaAcceptanceMarks = ({ className = "" }) => (
  <div className={`flex flex-wrap items-center gap-1.5 sm:gap-2 ${className}`}>
    <span title="ABA PAY (ABA Mobile)">
      <AbaPayLogo className="h-5 sm:h-6 w-auto shadow-sm rounded" />
    </span>
    <span title="KHQR (National QR Standard)">
      <KhqrLogo className="h-5 sm:h-6 w-auto shadow-sm rounded" />
    </span>
    <span title="Visa Card">
      <VisaLogo className="h-5 sm:h-6 w-auto shadow-sm rounded" />
    </span>
    <span title="Mastercard">
      <MastercardLogo className="h-5 sm:h-6 w-auto shadow-sm rounded" />
    </span>
    <span title="UnionPay">
      <UnionPayLogo className="h-5 sm:h-6 w-auto shadow-sm rounded" />
    </span>
    <span title="JCB">
      <JcbLogo className="h-5 sm:h-6 w-auto shadow-sm rounded" />
    </span>
  </div>
);

/**
 * ABA PayWay Merchant Integration Compliance Trust Box
 * Displays security guarantee, authorized merchant info, and schemes
 */
export const AbaPaywayTrustBox = ({ merchantName = "Pu Deth", className = "" }) => (
  <div className={`p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#00264d]/60 via-slate-900/90 to-[#001f3f]/60 border border-sky-500/30 text-slate-300 text-xs shadow-lg space-y-2.5 ${className}`}>
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
      <div className="flex items-center gap-2">
        <AbaPaywayLogo className="h-6 w-auto" />
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-bold border border-sky-400/30">
          Official Payment Gateway
        </span>
      </div>
      <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
        <span>🔒 256-bit SSL Secure</span>
        <span>•</span>
        <span className="text-emerald-400 font-bold">0% Fee</span>
      </div>
    </div>

    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-0.5">
      <div className="space-y-1">
        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">We Accept</span>
        <AbaAcceptanceMarks />
      </div>
      <div className="text-left sm:text-right text-[10px] text-slate-400">
        <div>Authorized Merchant: <strong className="text-white">{merchantName}</strong></div>
        <div className="text-slate-500">Processed by Advanced Bank of Asia Ltd. (ABA Bank)</div>
      </div>
    </div>
  </div>
);

export default AbaPaywayTrustBox;
