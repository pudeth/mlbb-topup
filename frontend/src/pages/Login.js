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
    <div className="min-h-[calc(100dvh-32px)] w-full flex items-center justify-center bg-[#07090E] text-slate-100 p-3 sm:p-6 lg:p-10 relative overflow-hidden select-none">
      {/* Ambient background glows */}
      <div className="fixed top-1/4 left-1/4 w-[500px] h-[500px] bg-amber-500/[0.07] rounded-full blur-[160px] pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-500/[0.07] rounded-full blur-[160px] pointer-events-none" />
      <div className="fixed inset-0 bg-gaming-grid pointer-events-none opacity-30" />

      {/* Full-Display Executive Admin Portal Card */}
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 rounded-2xl sm:rounded-3xl border border-slate-800/90 bg-[#0B0F19]/95 backdrop-blur-2xl shadow-2xl relative z-10 overflow-hidden">
        
        {/* Left Side: System Showcase & Branding (Full Display on Desktop, Clean Logo on Mobile) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 via-[#0d1424] to-[#07090E] p-3.5 sm:p-6 lg:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800/80 relative">
          {/* Subtle accent glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Logo & Title */}
          <div className="space-y-4 lg:space-y-6 relative z-10 w-full flex flex-col items-center lg:items-start text-center lg:text-left">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 rounded-xl sm:rounded-2xl bg-slate-900 border border-slate-700/60 p-1.5 sm:p-2 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-md">
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
                  <span className="text-lg sm:text-xl lg:text-2xl font-black tracking-wider text-white group-hover:text-amber-400 transition-colors">
                    {branding.storeName || 'Tin-Topup'}
                  </span>
                  <span className="bg-amber-400 text-slate-950 text-[9px] sm:text-[10px] font-black px-1.5 sm:px-2 py-0.5 rounded uppercase tracking-wider">
                    ADMIN
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs text-slate-400 font-semibold tracking-wide">
                  {branding.tagline || 'Official Diamond Hub'}
                </p>
              </div>
            </Link>

            {/* System Status Indicators (Hidden on Mobile, Visible on Desktop) */}
            <div className="hidden lg:block space-y-2.5 pt-2 w-full">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <span>⚡</span>
                <span>System Architecture Status</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800/80">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold text-white">Core Dispatch Engine</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">OPERATIONAL</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800/80">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-xs font-bold text-white">Bakong KHQR Gateway</span>
                  </div>
                  <span className="text-[10px] text-cyan-400 font-mono font-bold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">0% FEE LIVE</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800/80">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="text-xs font-bold text-white">Auto Top-Up Bot</span>
                  </div>
                  <span className="text-[10px] text-amber-400 font-mono font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">10-SEC READY</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Security Assurance (Hidden on Mobile, Visible on Desktop) */}
          <div className="hidden lg:flex pt-8 text-xs text-slate-400 relative z-10 items-center gap-2">
            <span className="text-base">🛡️</span>
            <span>Restricted Administrator Access. Enterprise Hub v2.5.</span>
          </div>
        </div>

        {/* Right Side: Admin Authentication Form */}
        <div className="lg:col-span-7 p-4 sm:p-8 lg:p-12 flex flex-col justify-center space-y-3.5 sm:space-y-6">
          {/* Header text shown on larger screens */}
          <div className="hidden lg:block">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2.5">
              <span>👑</span>
              <span>Admin Authentication Portal</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Sign In to Admin Hub
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Authorized access only. Enter administrative credentials to manage store operations.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2.5 animate-fadeIn">
              <span className="text-base shrink-0">⚠️</span>
              <div className="flex-1 font-semibold">{error}</div>
            </div>
          )}

          <form className="space-y-3 sm:space-y-4" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-[11px] sm:text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
                Admin Email <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-xs sm:text-sm">
                  ✉️
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#111728] border border-slate-700/80 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white placeholder-slate-500 text-xs sm:text-sm rounded-xl pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 transition-all outline-none"
                  placeholder="Enter administrator email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-[11px] sm:text-xs font-bold text-slate-300 mb-1 uppercase tracking-wider">
                Password <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 text-xs sm:text-sm">
                  🔑
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-[#111728] border border-slate-700/80 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white placeholder-slate-500 text-xs sm:text-sm rounded-xl pl-9 sm:pl-10 pr-10 py-2.5 sm:py-3 transition-all outline-none"
                  placeholder="Enter administrator password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white text-xs transition-colors cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded bg-[#111728] border-slate-700 text-amber-500 focus:ring-amber-500 cursor-pointer accent-amber-500"
                />
                <span className="text-[11px] sm:text-xs font-medium text-slate-400 hover:text-slate-300">
                  Keep administrator session active
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 sm:py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 active:from-amber-500 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Authenticating Admin...</span>
                  </>
                ) : (
                  <>
                    <span>⚡</span>
                    <span>Sign In to Admin Dashboard</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Return link */}
          <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-400 pt-1.5 border-t border-slate-800/60">
            <div className="flex items-center gap-1.5">
              <span>🔒</span>
              <span>256-Bit SSL Encrypted Session</span>
            </div>
            <Link to="/" className="text-slate-400 hover:text-amber-400 transition-colors font-medium flex items-center gap-1">
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
