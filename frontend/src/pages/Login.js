import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useStoreBranding } from '../services/storeBranding';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { branding } = useStoreBranding();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from || '/';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleQuickFill = (email, password) => {
    setFormData({ email, password });
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
      setError(result.error || 'Invalid email or password. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-[#07090E] text-slate-100 py-6 sm:py-10 px-4 sm:px-6 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="fixed top-1/3 left-1/4 w-96 h-96 bg-amber-500/[0.08] rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-1/3 right-1/4 w-96 h-96 bg-cyan-500/[0.08] rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed inset-0 bg-gaming-grid pointer-events-none opacity-25" />

      <div className="max-w-md w-full relative z-10 space-y-5 my-auto">
        
        {/* Brand Header */}
        <div className="text-center space-y-2.5">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="h-12 w-12 flex items-center justify-center shrink-0 group-hover:scale-105 transition-all">
              <img
                src={branding.logoImage || '/tin-logo.png'}
                alt={branding.storeName || 'Tin-TopUp'}
                className="w-full h-full object-contain drop-shadow-md"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/tin-logo.png';
                }}
              />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-wider text-white">
                  {branding.storeName || 'Tin-TopUp'}
                </span>
                {branding.badgeText && (
                  <span className="bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded tracking-widest uppercase">
                    {branding.badgeText}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-400 font-semibold tracking-wide uppercase">
                {branding.tagline || 'Official Diamond Hub'}
              </p>
            </div>
          </Link>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight pt-1">
            Welcome Back
          </h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Sign in to track orders, manage reseller credits & instant top-ups
          </p>
        </div>

        {/* Login Card Container */}
        <div className="bg-[#0B0F19]/95 backdrop-blur-2xl border border-slate-800 border-t-2 border-t-amber-500/60 rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] space-y-5 animate-scaleUp">
          
          {/* Error Message */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2.5 shadow-md animate-fadeIn">
              <span className="text-lg shrink-0">⚠️</span>
              <div className="flex-1 font-semibold">{error}</div>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Email Address <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 text-sm">
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
                  className="w-full bg-[#111728] border border-slate-700/80 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white placeholder-slate-500 text-xs sm:text-sm rounded-xl pl-10 pr-4 py-3 transition-all outline-none"
                  placeholder="admin@mlbbtopup.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Password <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 text-sm">
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
                  className="w-full bg-[#111728] border border-slate-700/80 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white placeholder-slate-500 text-xs sm:text-sm rounded-xl pl-10 pr-11 py-3 transition-all outline-none"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white text-xs transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#111728] border-slate-700 text-amber-500 focus:ring-amber-500 focus:ring-offset-slate-900 cursor-pointer accent-amber-500"
                />
                <span className="text-xs font-medium text-slate-400 hover:text-slate-300">
                  Remember me
                </span>
              </label>

              <Link
                to="/support"
                className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm uppercase tracking-wider shadow-glow-gold hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>⚡</span>
                    <span>Sign In to Account</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Demo Credentials Autofill */}
            <div className="pt-3 border-t border-slate-800/80">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-2 text-center">
                Quick Fill Test Credentials
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickFill('admin@mlbbtopup.com', 'Admin@123')}
                  className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold transition-all text-center"
                >
                  👑 Admin Login
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('customer@mlbbtopup.com', 'Customer@123')}
                  className="px-2.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-bold transition-all text-center"
                >
                  👤 Customer Login
                </button>
              </div>
            </div>
          </form>

          {/* Create Account Link */}
          <div className="text-center pt-2 border-t border-slate-800/60 text-xs text-slate-400">
            Don't have an account yet?{' '}
            <Link
              to="/register"
              className="font-bold text-amber-400 hover:text-amber-300 transition-colors ml-1"
            >
              Create Account →
            </Link>
          </div>
        </div>

        {/* Security & Trust Footer */}
        <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 text-center">
          <div className="flex items-center gap-1.5">
            <span>🔒</span>
            <span>256-Bit SSL Encrypted</span>
          </div>
          <span>•</span>
          <Link to="/" className="text-slate-400 hover:text-amber-400 transition-colors">
            ← Return to Storefront
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

