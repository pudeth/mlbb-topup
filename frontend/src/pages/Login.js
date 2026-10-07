import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useStoreBranding } from '../services/storeBranding';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isAdmin } = useAuth();
  const { branding } = useStoreBranding();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from || '/admin';

  // If already logged in as Admin, redirect directly to admin dashboard
  useEffect(() => {
    if (isAuthenticated && isAdmin && isAdmin()) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error || 'Invalid administrator credentials. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-[#040816] text-slate-100 p-3 sm:p-6 lg:p-8 relative overflow-hidden select-none">
      {/* Ambient Cyber Neon Background Glows */}
      <div className="fixed -top-40 -left-40 w-[600px] h-[600px] bg-blue-600/[0.18] rounded-full blur-[160px] pointer-events-none" />
      <div className="fixed -bottom-40 -right-40 w-[600px] h-[600px] bg-sky-500/[0.14] rounded-full blur-[160px] pointer-events-none" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[550px] bg-blue-700/[0.09] rounded-full blur-[180px] pointer-events-none" />
      <div className="fixed inset-0 bg-gaming-grid pointer-events-none opacity-25" />

      {/* Decorative Cyber Gaming Diagonal Lines (Desktop) */}
      <div className="hidden xl:block absolute top-12 left-12 w-48 h-48 border-l border-t border-blue-500/20 rounded-tl-3xl pointer-events-none" />
      <div className="hidden xl:block absolute bottom-12 right-12 w-48 h-48 border-r border-b border-blue-500/20 rounded-br-3xl pointer-events-none" />

      {/* Executive Admin Portal Card */}
      <div className="max-w-md lg:max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 rounded-[24px] sm:rounded-[32px] border border-blue-500/35 bg-[#070E22]/95 backdrop-blur-2xl shadow-[0_0_50px_rgba(37,99,235,0.25)] relative z-10 overflow-hidden my-auto transition-all duration-300">
        
        {/* ========================================================= */}
        {/* Left Side: System Showcase (Desktop Only: hidden on mobile) */}
        {/* ========================================================= */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-b from-[#0B1736]/95 via-[#08122B]/95 to-[#050D20] p-6 lg:p-8 flex-col justify-between border-r border-blue-500/25 relative overflow-hidden">
          {/* Subtle accent glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Logo & Title */}
          <div className="space-y-4 relative z-10 w-full flex flex-col items-start text-left">
            <Link to="/" className="inline-flex items-center gap-3.5 group">
              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-slate-900 border border-blue-400/40 p-1 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(59,130,246,0.35)] overflow-hidden">
                <img
                  src={branding.logoImage || '/tin-logo.png'}
                  alt={branding.storeName || 'Tin-Topup'}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/tin-logo.png';
                  }}
                />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-black tracking-wide text-white group-hover:text-sky-300 transition-colors">
                    Tin-<span className="bg-gradient-to-r from-sky-400 to-blue-400 bg-clip-text text-transparent">Topup</span>
                  </span>
                  <span className="bg-[#FBBF24] text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                    ADMIN
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-semibold tracking-wide mt-0.5">
                  {branding.tagline || 'Official Diamond Hub'}
                </p>
              </div>
            </Link>

            {/* System Status Indicators */}
            <div className="space-y-2.5 pt-1 w-full text-left">
              <div className="text-[11px] font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>SYSTEM ARCHITECTURE STATUS</span>
              </div>

              <div className="space-y-2">
                {/* 1. Core Dispatch Engine */}
                <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-2xl bg-[#091530]/80 border border-blue-500/25 hover:border-blue-400/50 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-sm">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
                        <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
                        <line x1="6" y1="6" x2="6.01" y2="6" />
                        <line x1="6" y1="18" x2="6.01" y2="18" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Core Dispatch Engine</div>
                      <div className="text-[10px] text-slate-400">High performance &amp; stable</div>
                    </div>
                  </div>
                  <span className="text-[9px] font-black tracking-wider text-emerald-300 bg-emerald-500/15 px-2.5 py-1 rounded-full border border-emerald-500/30 shrink-0 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>OPERATIONAL</span>
                  </span>
                </div>

                {/* 2. Bakong KHQR Gateway */}
                <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-2xl bg-[#091530]/80 border border-blue-500/25 hover:border-blue-400/50 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0 shadow-sm">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Bakong KHQR Gateway</div>
                      <div className="text-[10px] text-slate-400">Secure &amp; reliable payment</div>
                    </div>
                  </div>
                  <span className="text-[9px] font-black tracking-wider text-sky-300 bg-sky-500/15 px-2.5 py-1 rounded-full border border-sky-500/30 shrink-0 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                    <span>99% LIVE</span>
                  </span>
                </div>

                {/* 3. Auto Top-Up Bot */}
                <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-2xl bg-[#091530]/80 border border-blue-500/25 hover:border-blue-400/50 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-sm">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="10" rx="2" />
                        <circle cx="12" cy="5" r="2" />
                        <path d="M12 7v4" />
                        <line x1="8" y1="16" x2="8.01" y2="16" />
                        <line x1="16" y1="16" x2="16.01" y2="16" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Auto Top-Up Bot</div>
                      <div className="text-[10px] text-slate-400">24/7 Service</div>
                    </div>
                  </div>
                  <span className="text-[9px] font-black tracking-wider text-amber-300 bg-amber-500/15 px-2.5 py-1 rounded-full border border-amber-500/30 shrink-0 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    <span>10-SEC READY</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Visual: 3D Controller with Diamonds */}
          <div className="relative pt-4 w-full flex flex-col items-center">
            <div className="relative w-full max-w-[340px] overflow-hidden rounded-2xl flex items-center justify-center">
              <img
                src="/images/admin_login_controller_clean.png"
                alt="Gaming Controller with Diamonds"
                className="w-full h-auto max-h-[140px] object-contain drop-shadow-[0_10px_20px_rgba(59,130,246,0.35)]"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>

            {/* Bottom Security Assurance Badge */}
            <div className="w-full pt-3 text-[11px] text-slate-400 relative z-10 flex items-center justify-start gap-2">
              <svg className="w-4 h-4 text-sky-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
              <span>Restricted Administrator Access. Enterprise Hub v2.5.</span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* Right Side: Admin Authentication Form (Responsive & Compact) */}
        {/* ========================================================= */}
        <div className="lg:col-span-7 p-4 sm:p-7 lg:p-10 flex flex-col justify-center space-y-3.5 sm:space-y-4.5">
          
          {/* Mobile-Only Sleek Brand Header (Hidden on Desktop) */}
          <div className="lg:hidden flex items-center justify-between pb-3 border-b border-blue-500/20">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-xl bg-slate-900 border border-blue-400/40 p-1 flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
                <img
                  src={branding.logoImage || '/tin-logo.png'}
                  alt={branding.storeName || 'Tin-Topup'}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/tin-logo.png';
                  }}
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-black text-white">
                    Tin-<span className="bg-gradient-to-r from-sky-400 to-blue-400 bg-clip-text text-transparent">Topup</span>
                  </span>
                  <span className="bg-[#FBBF24] text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase">
                    ADMIN
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium block">
                  {branding.tagline || 'Official Diamond Hub'}
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-500/10 border border-blue-400/25 text-[10px] font-bold text-sky-300">
              <span>👑</span>
              <span>PORTAL</span>
            </div>
          </div>

          {/* Desktop Title & Portal Tag */}
          <div className="hidden lg:block">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-500/15 border border-blue-400/30 text-sky-300 text-xs font-bold uppercase tracking-wider mb-2 shadow-sm">
              <span className="text-amber-400 text-sm">👑</span>
              <span>ADMIN AUTHENTICATION PORTAL</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight">
              Sign In to <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-blue-500 bg-clip-text text-transparent">Admin Hub</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Authorized access only. Enter your credentials to manage store operations.
            </p>
          </div>

          {/* Mobile Title (Compact) */}
          <div className="lg:hidden text-left">
            <h2 className="text-xl font-black text-white tracking-tight">
              Sign In to <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-blue-500 bg-clip-text text-transparent">Admin Hub</span>
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Enter administrator email and password to manage store.
            </p>
          </div>

          {/* Quick Switch to Player Login (Compact on Mobile) */}
          <Link
            to="/order-history"
            className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-[#091530]/85 border border-blue-500/30 hover:border-blue-400/60 text-sky-200 hover:text-white flex items-center justify-between transition-all group shadow-sm"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400 shrink-0 group-hover:scale-105 transition-transform shadow-sm">
                <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div className="text-left min-w-0">
                <div className="text-xs font-bold text-white group-hover:text-sky-300 truncate">
                  Player Login (ID Player &amp; ID Server)
                </div>
                <div className="text-[10px] text-slate-400 font-medium truncate">
                  ចូលគណនីអ្នកលេងតាម Player ID →
                </div>
              </div>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-blue-600/30 hover:bg-blue-600 border border-blue-400/40 text-blue-200 group-hover:text-white transition-all shrink-0 ml-2 shadow-sm flex items-center gap-1">
              <span>Switch</span>
              <span>→</span>
            </span>
          </Link>

          {/* Error Banner */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2 animate-fadeIn shadow-md">
              <span className="text-sm shrink-0">⚠️</span>
              <div className="flex-1 font-semibold">{error}</div>
            </div>
          )}

          <form className="space-y-3 sm:space-y-3.5" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-[10px] sm:text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                ADMIN EMAIL <span className="text-rose-400">*</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-sky-400 transition-colors">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#081124] border border-blue-500/30 hover:border-blue-500/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/25 text-white placeholder-slate-500 text-xs sm:text-sm rounded-xl pl-9 sm:pl-10 pr-4 py-2.5 sm:py-2.5 transition-all outline-none shadow-inner"
                  placeholder="Enter administrator email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-[10px] sm:text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                PASSWORD <span className="text-rose-400">*</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-sky-400 transition-colors">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-[#081124] border border-blue-500/30 hover:border-blue-500/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-500/25 text-white placeholder-slate-500 text-xs sm:text-sm rounded-xl pl-9 sm:pl-10 pr-10 py-2.5 sm:py-2.5 transition-all outline-none shadow-inner"
                  placeholder="Enter administrator password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-sky-300 transition-colors cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded bg-[#081124] border-blue-500/40 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
                />
                <span className="text-[11px] sm:text-xs font-medium text-slate-400 hover:text-slate-300">
                  Keep administrator session active
                </span>
              </label>
            </div>

            {/* Submit Button (Electric Blue Neon) */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 sm:py-3 px-5 rounded-xl bg-gradient-to-r from-[#0066FF] via-[#0080FF] to-[#00A3FF] hover:from-[#0052EE] hover:to-[#0090FF] active:scale-[0.99] text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(0,128,255,0.45)] hover:shadow-[0_0_35px_rgba(0,140,255,0.65)] flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>AUTHENTICATING ADMIN...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 text-white shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <polyline points="9 12 11 14 15 10" />
                    </svg>
                    <span>SIGN IN TO ADMIN DASHBOARD</span>
                    <span className="text-sm">→</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer Security & Return Link */}
          <div className="flex items-center justify-between gap-2 text-[10px] sm:text-[11px] text-slate-400 pt-1.5 border-t border-blue-500/20">
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>256-Bit SSL Encrypted</span>
            </div>
            <Link
              to="/"
              className="text-slate-400 hover:text-sky-300 transition-colors font-medium flex items-center gap-1 shrink-0"
            >
              <span>←</span>
              <span>Return to Storefront</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
