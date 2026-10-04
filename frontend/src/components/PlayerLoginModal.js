import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { topupAPI, authAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export const PlayerLoginModal = ({ isOpen, onClose, onSuccess }) => {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    playerId: '',
    serverId: '',
  });
  const [checkingName, setCheckingName] = useState(false);
  const [verifiedName, setVerifiedName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [pasted, setPasted] = useState(false);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setError('');
      setSuccessMsg('');
      try {
        const stored = JSON.parse(localStorage.getItem('player_account') || 'null');
        if (stored) {
          setFormData({
            playerId: stored.playerId || '',
            serverId: stored.serverId || '',
          });
          setVerifiedName(stored.realName || '');
        }
      } catch {}
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Handle clipboard paste with auto-detect
  const handlePastePlayerId = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim()) {
          const raw = text.trim();
          // Extract bracket or separator format: 12345678 (1234)
          const bracketMatch = raw.match(/(\d{5,12})\s*[[({]\s*(\d{3,7})\s*[)\]}]/i);
          const sepMatch = raw.match(/(\d{6,12})\s*[-/_|\s,]\s*(\d{3,7})(?:\D|$)/i);
          
          if (bracketMatch) {
            setFormData({ playerId: bracketMatch[1], serverId: bracketMatch[2] });
          } else if (sepMatch) {
            setFormData({ playerId: sepMatch[1], serverId: sepMatch[2] });
          } else {
            setFormData(prev => ({ ...prev, playerId: raw }));
          }
          setVerifiedName('');
          setError('');
          setPasted(true);
          setTimeout(() => setPasted(false), 2000);
        }
      }
    } catch (err) {
      console.warn('Clipboard read error:', err);
    }
  };

  // Real-Name Check
  const handleCheckPlayerName = async () => {
    const pId = formData.playerId.trim();
    const sId = formData.serverId.trim();
    if (!pId) {
      setError(language === 'km' ? 'សូមបញ្ចូល Player ID' : 'Please enter Player ID');
      return;
    }

    setCheckingName(true);
    setError('');
    try {
      const res = await topupAPI.checkAccount(pId, sId);
      if (res?.data?.valid && res?.data?.name) {
        setVerifiedName(res.data.name);
      } else {
        setError(res?.data?.error || (language === 'km' ? 'រកមិនឃើញឈ្មោះ Player នេះទេ' : 'Player account not found'));
      }
    } catch (err) {
      setError(language === 'km' ? 'មិនអាចផ្ទៀងផ្ទាត់ Player ID បានទេ' : 'Unable to verify Player ID');
    } finally {
      setCheckingName(false);
    }
  };

  // Submit Player Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    const pId = formData.playerId.trim();
    const sId = formData.serverId.trim() || 'Global';

    if (!pId) {
      setError(language === 'km' ? 'សូមបញ្ចូល Player ID' : 'Please enter Player ID');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      // Step 1: Auto-verify real-name if not yet checked
      let realName = verifiedName;
      if (!realName) {
        try {
          const checkRes = await topupAPI.checkAccount(pId, sId);
          if (checkRes?.data?.valid && checkRes?.data?.name) {
            realName = checkRes.data.name;
            setVerifiedName(realName);
          }
        } catch (e) {}
      }

      if (!realName) {
        realName = `Player_${pId}`;
      }

      // Step 2: Dedicated player-login
      const playerAuthPayload = {
        playerId: pId,
        serverId: sId,
        realName: realName,
      };

      let authResult = null;
      try {
        const authRes = await authAPI.playerLogin(playerAuthPayload);
        authResult = authRes.data;
      } catch (authErr) {
        const email = `${pId}_${sId}@player.tin-topup.com`.toLowerCase();
        const password = sId;
        try {
          const regRes = await authAPI.register({
            name: realName,
            email: email,
            password: password,
          });
          authResult = regRes.data;
        } catch (regErr) {
          try {
            const loginRes = await authAPI.login({
              email: email,
              password: password,
            });
            authResult = loginRes.data;
          } catch (loginErr) {}
        }
      }

      if (authResult?.token) {
        localStorage.setItem('token', authResult.token);
      }
      if (authResult?.user || authResult?.name) {
        localStorage.setItem('user', JSON.stringify(authResult.user || {
          userId: authResult.userId,
          name: authResult.name || realName,
          email: authResult.email,
          playerId: pId,
          serverId: sId,
          role: authResult.role || 'User',
        }));
      }

      const newPlayerAccount = {
        playerId: pId,
        serverId: sId,
        realName: realName,
      };
      localStorage.setItem('player_account', JSON.stringify(newPlayerAccount));

      // Trigger sync across components
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('player-login-success', { detail: newPlayerAccount }));

      setSuccessMsg(language === 'km' ? 'ចូលគណនីជោគជ័យ!' : 'Logged in successfully!');

      if (onSuccess) {
        onSuccess(newPlayerAccount);
      }

      setTimeout(() => {
        onClose();
      }, 700);

    } catch (err) {
      setError(language === 'km' ? 'មានបញ្ហាក្នុងការភ្ជាប់គណនី សូមព្យាយាមម្តងទៀត' : 'Failed to connect player account. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn select-none font-khmer">
      {/* Modal Backdrop Dismiss Area */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Modal Card Container */}
      <div className="relative w-full max-w-md rounded-3xl p-5 sm:p-7 bg-gradient-to-b from-[#0c152e] via-[#091024] to-[#060b18] border border-sky-500/40 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(14,165,233,0.25)] z-10 overflow-hidden animate-scaleUp">
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 bg-sky-500/20 blur-3xl pointer-events-none" />

        {/* Close Button (Top Right) */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer z-20 border border-slate-700/60 active:scale-95"
          title="Close"
        >
          ✕
        </button>

        {/* Card Header Badge */}
        <div className="flex items-center justify-center mb-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 via-sky-500 to-blue-600 p-0.5 shadow-[0_0_20px_rgba(34,211,238,0.5)] flex items-center justify-center">
            <div className="w-full h-full bg-[#070e22] rounded-[14px] flex items-center justify-center text-xl">
              💳
            </div>
          </div>
        </div>

        {/* Title & Subtitle */}
        <h2 className="text-xl sm:text-2xl font-black text-center text-white tracking-tight leading-snug">
          {language === 'km' ? 'ចូលគណនីអ្នកលេង' : 'Player Login'}
        </h2>
        <p className="text-xs text-center text-slate-400 mt-1 mb-5 leading-relaxed">
          {language === 'km'
            ? 'បញ្ចូល Player ID និង Server ID ដើម្បីភ្ជាប់គណនី និងមើលប្រវត្តិបញ្ជាទិញ'
            : 'Enter your Player ID and Server ID to access your account & view all orders'}
        </p>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-300 text-xs flex items-center gap-2 animate-shake">
            <span>⚠️</span>
            <span className="flex-1">{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
            <span>✓</span>
            <span className="flex-1 font-bold">{successMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* 1. Player ID Field */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
              {language === 'km' ? '1. លេខសម្គាល់អ្នកលេង (Player ID)' : '1. Player ID'}
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                inputMode="numeric"
                required
                placeholder="e.g. 12345678"
                value={formData.playerId}
                onChange={(e) => {
                  setFormData({ ...formData, playerId: e.target.value });
                  setVerifiedName('');
                  setError('');
                }}
                className="w-full h-11 px-3.5 pr-20 rounded-xl bg-[#070c1b] border border-slate-700/80 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white font-mono text-sm placeholder-slate-600 transition-all outline-none"
              />
              <button
                type="button"
                onClick={handlePastePlayerId}
                className="absolute right-2 h-7 px-2.5 rounded-lg bg-sky-500/15 hover:bg-sky-500/30 border border-sky-400/30 hover:border-sky-400/60 text-sky-300 hover:text-white text-[10.5px] font-bold flex items-center gap-1 transition-all cursor-pointer active:scale-95"
                title="Paste from clipboard"
              >
                {pasted ? (
                  <span className="text-emerald-400 font-black">✓ Pasted</span>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                    </svg>
                    <span>Paste</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 2. Server ID Field */}
          <div>
            <label className="block text-[11px] font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
              {language === 'km' ? '2. លេខតំបន់ម៉ាស៊ីនបម្រើ (Server / Zone ID)' : '2. Server / Zone ID'}
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                required
                placeholder="e.g. 2042"
                value={formData.serverId}
                onChange={(e) => {
                  setFormData({ ...formData, serverId: e.target.value });
                  setVerifiedName('');
                  setError('');
                }}
                className="w-full h-11 px-3.5 pr-10 rounded-xl bg-[#070c1b] border border-slate-700/80 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white font-mono text-sm placeholder-slate-600 transition-all outline-none"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                🌐
              </span>
            </div>
          </div>

          {/* Live Check Player Real-Name Preview Button */}
          <div className="flex items-center justify-between pt-0.5">
            <button
              type="button"
              onClick={handleCheckPlayerName}
              disabled={checkingName || !formData.playerId}
              className="text-[11px] font-bold text-sky-400 hover:text-cyan-300 flex items-center gap-1 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <span>{checkingName ? '⏳ ពិនិត្យ...' : '🔍 ពិនិត្យឈ្មោះ (Check Name)'}</span>
            </button>

            {verifiedName && (
              <span className="text-[11px] font-black text-emerald-400 flex items-center gap-1 bg-emerald-950/40 px-2 py-0.5 rounded-lg border border-emerald-500/30 truncate max-w-[180px]">
                <span>✓</span>
                <span className="truncate">{verifiedName}</span>
              </span>
            )}
          </div>

          {/* Verified Account Preview Card */}
          {verifiedName && (
            <div className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-950/30 to-cyan-950/30 border border-emerald-500/40 flex items-center justify-between animate-fadeIn">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-emerald-400/20 text-emerald-400 flex items-center justify-center font-black text-xs">
                  👑
                </div>
                <div>
                  <div className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider">
                    {language === 'km' ? 'ឈ្មោះអ្នកលេង' : 'Player Username'}
                  </div>
                  <div className="text-xs font-black text-emerald-300 truncate max-w-[150px]">
                    {verifiedName}
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded-md border border-cyan-500/30">
                Zone: {formData.serverId || 'Global'}
              </span>
            </div>
          )}

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 py-3 px-4 rounded-xl font-black text-sm text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                <span>{language === 'km' ? 'កំពុងភ្ជាប់គណនី...' : 'Connecting Account...'}</span>
              </>
            ) : (
              <>
                <span>🚀</span>
                <span>{language === 'km' ? 'ចូលគណនីអ្នកលេង' : 'Access & View History'}</span>
              </>
            )}
          </button>
        </form>

        {/* Footer Policy & Admin Access Link */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
          <span>{language === 'km' ? 'ចូលដោយសុវត្ថិភាព 100%' : '100% Safe Player Sync'}</span>
          <Link
            to="/login"
            onClick={onClose}
            className="text-slate-400 hover:text-amber-400 font-semibold transition-colors"
          >
            Admin Portal →
          </Link>
        </div>

      </div>
    </div>
  );
};
