import React from 'react';
import abaKhqrImg from '../assets/aba-khqr-logo.png';
import abaLogoImg from '../assets/aba-logo.png';
import khqrLogoImg from '../assets/khqr-logo.png';

/**
 * ABA PayWay & KHQR Official Compliance Logos
 * Strictly complying with ABA Bank Merchant Integration Guideline v2.11
 */

export { abaKhqrImg, abaLogoImg, khqrLogoImg };

export const AbaKhqrLogo = ({ className = "h-6 w-auto", style = {}, alt = "ABA KHQR" }) => (
  <img
    src={abaKhqrImg}
    alt={alt}
    className={`inline-block object-contain shrink-0 rounded-md shadow-sm ${className}`}
    style={{ verticalAlign: 'middle', ...style }}
    onError={(e) => {
      if (e.target.src !== `${process.env.PUBLIC_URL || ''}/images/aba-khqr-logo.png`) {
        e.target.src = `${process.env.PUBLIC_URL || ''}/images/aba-khqr-logo.png`;
      }
    }}
  />
);

export const AbaPayLogo = ({ className = "h-5 w-auto", style = {} }) => (
  <svg viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} shrink-0`} style={{ maxHeight: '24px', width: 'auto', display: 'inline-block', verticalAlign: 'middle', ...style }} aria-label="ABA PAY">
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

export const AbaPaywayLogo = ({ className = "h-7 w-auto", dark = false, style = {} }) => (
  <div className={`inline-flex items-center gap-1.5 shrink-0 ${className}`} style={{ maxHeight: '28px', ...style }}>
    <svg viewBox="0 0 140 38" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-auto" style={{ maxHeight: '28px' }}>
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

export const AbaLogo = ({ className = "h-5 w-auto", style = {} }) => (
  <img
    src={abaLogoImg}
    alt="ABA"
    className={`inline-block object-contain shrink-0 rounded-md shadow-sm ${className}`}
    style={{ maxHeight: '24px', width: 'auto', verticalAlign: 'middle', ...style }}
    onError={(e) => {
      if (e.target.src !== `${process.env.PUBLIC_URL || ''}/images/aba-logo.png`) {
        e.target.src = `${process.env.PUBLIC_URL || ''}/images/aba-logo.png`;
      }
    }}
  />
);

export const KhqrLogo = ({ className = "h-5 w-auto", style = {} }) => (
  <img
    src={khqrLogoImg}
    alt="KHQR"
    className={`inline-block object-contain shrink-0 rounded-md shadow-sm ${className}`}
    style={{ maxHeight: '24px', width: 'auto', verticalAlign: 'middle', ...style }}
    onError={(e) => {
      if (e.target.src !== `${process.env.PUBLIC_URL || ''}/images/khqr-logo.png`) {
        e.target.src = `${process.env.PUBLIC_URL || ''}/images/khqr-logo.png`;
      }
    }}
  />
);

/**
 * Authentic Red KHQR Voucher Header
 * Strictly matching User & Official NBC KHQR Figma Specifications
 */
export const KhqrVoucherHeader = () => (
  <div className="relative w-full overflow-hidden select-none bg-white">
    <svg
      viewBox="2.20496 2.20502 28.66504 7.34863"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto block"
    >
      {/* Red banner background with 45-degree ribbon cut on right */}
      <path
        d="M30.87 2.20502V9.55365L28.5126 7.19427H2.20496V2.20502H30.87Z"
        fill="#E21A1A"
      />
      {/* Official White KHQR Typography strictly matching user SVG */}
      <g fill="white">
        <path d="M17.435 4.55882V5.03676H16.9654C16.9184 5.03676 16.8832 5.00091 16.8832 4.95312V4.55882C16.8832 4.51103 16.9184 4.47518 16.9654 4.47518H17.3411C17.3998 4.46324 17.435 4.51103 17.435 4.55882Z" />
        <path d="M13.7104 4.6662L14.3677 3.99725H14.6841L13.98 4.71405L14.7202 5.50311H14.3911L13.7104 4.79803V5.50311H13.4399V3.99725H13.7104V4.6662ZM15.2007 4.63007H15.9526V3.99725H16.2104V5.50311H15.9526V4.84589H15.2007V5.50311H14.9312V3.99725H15.2007V4.63007ZM18.9351 3.99725C19.3459 3.9973 19.6743 4.33203 19.6743 4.75018H19.4399C19.4399 4.46346 19.2168 4.23656 18.9351 4.23651C18.712 4.23651 18.5241 4.37984 18.4536 4.59491C18.442 4.64267 18.4302 4.70247 18.4302 4.75018V5.50311H18.4185C18.2893 5.50311 18.1948 5.39506 18.1948 5.27557V4.75018C18.1948 4.54706 18.2775 4.34376 18.4302 4.20038C18.5711 4.06896 18.7472 3.99725 18.9351 3.99725ZM19.6743 5.50311H19.3462L19.2632 5.41913L19.0874 5.23944L18.8413 4.98846H19.1694L19.6743 5.50311ZM17.7378 3.99725C17.8549 3.9975 17.9602 4.09277 17.9604 4.22382V5.34784L17.7261 5.10858V4.39178C17.7261 4.30814 17.655 4.23651 17.5728 4.23651H16.8687C16.7865 4.23651 16.7163 4.30814 16.7163 4.39178V5.10858C16.7164 5.19215 16.7865 5.26385 16.8687 5.26385H17.5728L17.8081 5.49042H16.7163C16.5989 5.49042 16.4927 5.39523 16.4927 5.26385V4.22382C16.4929 4.1045 16.5873 3.99725 16.7163 3.99725H17.7378Z" />
      </g>
    </svg>
  </div>
);

/**
 * Official ABA PayWay Voucher Header
 */
export const AbaPaywayVoucherHeader = () => (
  <div className="relative w-full bg-gradient-to-r from-[#003B70] to-[#0055A5] py-3 px-4 flex items-center justify-between rounded-t-2xl overflow-hidden shadow-inner">
    <div className="flex items-center gap-2.5">
      <AbaKhqrLogo className="h-7 w-7 rounded-md border border-white/20 shadow-sm" />
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

export const VisaLogo = ({ className = "h-5 w-auto", style = {} }) => (
  <svg viewBox="0 0 60 22" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} shrink-0`} style={{ maxHeight: '20px', width: 'auto', display: 'inline-block', verticalAlign: 'middle', ...style }} aria-label="Visa">
    <rect width="60" height="22" rx="4" fill="#FFFFFF" />
    <path d="M23.1 3.5L18.4 18.5H14.8L12.1 6.8C11.9 6 11.7 5.7 11 5.3C9.8 4.6 8.1 4.1 6.8 3.8L7.1 2.5H13.6C14.7 2.5 15.6 3.3 15.8 4.6L17.2 13.5L20.9 2.5H24.5M30.6 12.8C30.6 8.8 25.1 8.6 25.2 6.6C25.2 6 25.8 5.4 27 5.2C27.6 5.1 29.3 5.1 31.1 6L31.8 2.8C30.8 2.4 29.5 2.1 27.9 2.1C23.6 2.1 20.6 4.4 20.6 7.7C20.6 10.2 22.8 11.6 24.5 12.5C26.3 13.4 26.9 14 26.9 14.8C26.9 16.1 25.3 16.6 23.9 16.6C22.1 16.6 21 16.3 19.5 15.6L18.8 18.9C20.1 19.5 22.3 20 24.6 20C29.2 20 32.2 17.7 32.2 14.2M42.2 18.5H45.8L43.6 2.5H40.2C39.4 2.5 38.7 3 38.4 3.7L32.8 18.5H36.6L37.4 16.3H41.8L42.2 18.5ZM38.4 13.4L40.2 8.3L41.2 13.4H38.4ZM56.8 2.5L53.9 18.5H50.5L53.4 2.5H56.8Z" fill="#1434CB" />
    <path d="M12.1 6.8L9.9 2.5H6.8L6.6 3.6C8.8 4.2 10.8 5 12.1 6.8Z" fill="#F7B600" />
  </svg>
);

export const MastercardLogo = ({ className = "h-5 w-auto", style = {} }) => (
  <svg viewBox="0 0 60 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} shrink-0`} style={{ maxHeight: '20px', width: 'auto', display: 'inline-block', verticalAlign: 'middle', ...style }} aria-label="Mastercard">
    <rect width="60" height="36" rx="4" fill="#FFFFFF" />
    <circle cx="23" cy="18" r="12" fill="#EB001B" />
    <circle cx="37" cy="18" r="12" fill="#F79E1B" />
    <path d="M30 9.2C32.8 11.4 34.6 14.5 34.6 18C34.6 21.5 32.8 24.6 30 26.8C27.2 24.6 25.4 21.5 25.4 18C25.4 14.5 27.2 11.4 30 9.2Z" fill="#FF5F00" />
  </svg>
);

export const UnionPayLogo = ({ className = "h-5 w-auto", style = {} }) => (
  <svg viewBox="0 0 60 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} shrink-0`} style={{ maxHeight: '20px', width: 'auto', display: 'inline-block', verticalAlign: 'middle', ...style }} aria-label="UnionPay">
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

export const JcbLogo = ({ className = "h-5 w-auto", style = {} }) => (
  <svg viewBox="0 0 54 36" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${className} shrink-0`} style={{ maxHeight: '20px', width: 'auto', display: 'inline-block', verticalAlign: 'middle', ...style }} aria-label="JCB">
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
  <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
    <span title="ABA KHQR" className="inline-flex items-center p-0.5 rounded-md bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
      <AbaKhqrLogo className="h-4.5 sm:h-5 w-auto" />
    </span>
    <span title="ABA PAY" className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
      <AbaPayLogo className="h-4 sm:h-4.5 w-auto" />
    </span>
    <span title="KHQR" className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
      <KhqrLogo className="h-4 sm:h-4.5 w-auto" />
    </span>
  </div>
);

/**
 * ABA PayWay Merchant Integration Compliance Trust Box
 * Displays security guarantee, authorized merchant info, and schemes
 */
export const AbaPaywayTrustBox = ({ merchantName = "Pu Deth", className = "" }) => (
  <div className={`rounded-2xl bg-gradient-to-r from-[#091120]/90 via-[#0d182e]/90 to-[#091120]/90 border border-sky-500/25 p-3 sm:p-3.5 shadow-lg space-y-2.5 backdrop-blur-sm ${className}`}>
    {/* Top Row: Official Gateway & Security Badges */}
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
      <div className="flex items-center gap-2">
        <AbaPaywayLogo className="h-5 sm:h-6 w-auto" />
        <span className="text-[10px] sm:text-[10.5px] px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-300 font-bold border border-sky-400/30">
          Official Payment Gateway
        </span>
      </div>
      <div className="flex items-center gap-2 text-[10.5px] sm:text-[11px] font-mono text-slate-400">
        <span className="flex items-center gap-1 text-slate-300">
          <span>🔒</span> 256-bit SSL Secure
        </span>
        <span className="text-slate-600">•</span>
        <span className="text-emerald-400 font-bold">0% Fee</span>
      </div>
    </div>

    {/* Bottom Row: Acceptance Marks & Merchant Endorsement */}
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pt-0.5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2.5 w-full sm:w-auto">
        <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider shrink-0">
          We Accept:
        </span>
        <AbaAcceptanceMarks />
      </div>
      <div className="text-left sm:text-right text-[10.5px] text-slate-400 w-full sm:w-auto border-t sm:border-t-0 border-slate-800/60 pt-2 sm:pt-0">
        <div>Authorized Merchant: <strong className="text-white font-bold">{merchantName}</strong></div>
        <div className="text-[10px] text-slate-500">Processed by Advanced Bank of Asia Ltd. (ABA Bank)</div>
      </div>
    </div>
  </div>
);

export default AbaPaywayTrustBox;
