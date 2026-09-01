import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useStoreBranding } from '../services/storeBranding';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { branding } = useStoreBranding();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (!agreeTerms) {
      setError('Please agree to the Terms and Conditions');
      return;
    }

    setLoading(true);

    const result = await register(formData.name, formData.email, formData.password);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Failed to create account. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-[#07090E] text-slate-100 py-6 sm:py-10 px-4 sm:px-6 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="fixed top-1/3 right-1/4 w-96 h-96 bg-amber-500/[0.08] rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-1/3 left-1/4 w-96 h-96 bg-cyan-500/[0.08] rounded-full blur-[140px] pointer-events-none" />
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
            Create an Account
          </h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Join thousands of gamers for instant diamond delivery & member perks
          </p>
        </div>

        {/* Register Card Container */}
        <div className="bg-[#0B0F19]/95 backdrop-blur-2xl border border-slate-800 border-t-2 border-t-amber-500/60 rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] space-y-5 animate-scaleUp">
          
          {/* Error Message */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2.5 shadow-md animate-fadeIn">
              <span className="text-lg shrink-0">⚠️</span>
              <div className="flex-1 font-semibold">{error}</div>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Full Name <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 text-sm">
                  👤
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-[#111728] border border-slate-700/80 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white placeholder-slate-500 text-xs sm:text-sm rounded-xl pl-10 pr-4 py-3 transition-all outline-none"
                  placeholder="e.g. Alex Hunter"
                />
              </div>
            </div>

            {/* Email Address */}
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
                  placeholder="name@example.com"
                />
              </div>
            </div>

            {/* Password */}
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
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-[#111728] border border-slate-700/80 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white placeholder-slate-500 text-xs sm:text-sm rounded-xl pl-10 pr-11 py-3 transition-all outline-none"
                  placeholder="Minimum 6 characters"
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

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                Confirm Password <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 text-sm">
                  🔒
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-[#111728] border border-slate-700/80 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white placeholder-slate-500 text-xs sm:text-sm rounded-xl pl-10 pr-4 py-3 transition-all outline-none"
                  placeholder="Re-enter your password"
                />
              </div>
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 rounded bg-[#111728] border-slate-700 text-amber-500 focus:ring-amber-500 focus:ring-offset-slate-900 cursor-pointer accent-amber-500"
              />
              <label htmlFor="terms" className="text-xs text-slate-400 cursor-pointer select-none">
                I agree to the{' '}
                <a href="#terms" className="text-amber-400 hover:underline">
                  Terms of Service
                </a>{' '}
                & Privacy Policy
              </label>
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
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>✨</span>
                    <span>Create Free Account</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Already have an account */}
          <div className="text-center pt-2 border-t border-slate-800/60 text-xs text-slate-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-bold text-amber-400 hover:text-amber-300 transition-colors ml-1"
            >
              Sign In Here →
            </Link>
          </div>
        </div>

        {/* Security & Trust Footer */}
        <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 text-center">
          <div className="flex items-center gap-1.5">
            <span>🛡️</span>
            <span>Verified Secure Platform</span>
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

export default Register;

