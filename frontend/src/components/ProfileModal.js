import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { topupAPI } from '../services/api';
import GamerAvatar, { GAMING_AVATAR_PRESETS, getGamerAvatarPreset } from './GamerAvatar';

export const ProfileModal = ({ isOpen, onClose }) => {
  const { user, playerAccount, updateProfile } = useAuth();
  const { language } = useLanguage();

  const [formData, setFormData] = useState({
    name: '',
    playerId: '',
    serverId: '',
    phone: '',
    email: '',
    password: '',
    avatar: 'initial'
  });

  const [checkingName, setCheckingName] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [avatarFilter, setAvatarFilter] = useState('all');

  // Sync form with current user/player data on open
  useEffect(() => {
    if (isOpen) {
      const pId = playerAccount?.playerId || user?.playerId || '';
      const sId = playerAccount?.serverId || user?.serverId || '';
      const rName = playerAccount?.realName || user?.name || (pId ? `Player_${pId}` : '');
      const av = playerAccount?.avatar || user?.avatar || 'initial';
      const ph = playerAccount?.phone || user?.phone || '';
      const em = user?.email || (pId && sId ? `${pId}_${sId}@player.tin-topup.com` : '');

      setFormData({
        name: rName,
        playerId: pId,
        serverId: sId,
        phone: ph,
        email: em,
        password: '',
        avatar: av
      });
      setSaveSuccess(false);
      setSaveError('');
    }
  }, [isOpen, playerAccount, user]);

  if (!isOpen) return null;

  // Auto-verify real name with Moonton API
  const handleCheckMoontonName = async () => {
    const pId = formData.playerId.trim();
    const sId = formData.serverId.trim();
    if (!pId) {
      setSaveError(language === 'km' ? 'សូមបញ្ចូល Player ID ជាមុន' : 'Please enter Player ID first');
      return;
    }

    setCheckingName(true);
    setSaveError('');
    try {
      const res = await topupAPI.checkAccount(pId, sId);
      if (res?.data?.valid && res?.data?.name) {
        setFormData(prev => ({ ...prev, name: res.data.name }));
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setSaveError(res?.data?.error || (language === 'km' ? 'រកមិនឃើញឈ្មោះគណនីនេះទេ' : 'Player account not found'));
      }
    } catch (err) {
      setSaveError(language === 'km' ? 'មិនអាចផ្ទៀងផ្ទាត់ Player ID បានទេ' : 'Failed to verify account with Moonton');
    } finally {
      setCheckingName(false);
    }
  };

  const handleCopyId = () => {
    if (!formData.playerId) return;
    navigator.clipboard.writeText(formData.playerId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError('');
    setSaveSuccess(false);

    try {
      const res = await updateProfile({
        name: formData.name.trim(),
        realName: formData.name.trim(),
        playerId: formData.playerId.trim(),
        serverId: formData.serverId.trim() || 'Global',
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        password: formData.password ? formData.password.trim() : undefined,
        avatar: formData.avatar
      });

      if (res.success) {
        setSaveSuccess(true);
        setTimeout(() => {
          setSaveSuccess(false);
          onClose();
        }, 1200);
      } else {
        setSaveError(res.error || (language === 'km' ? 'ការរក្សាទុកមិនបានជោគជ័យ' : 'Failed to save changes'));
      }
    } catch (err) {
      setSaveError(err.message || 'An unexpected error occurred');
    } finally {
      setSaving(false);
    }
  };

  const currentPreset = getGamerAvatarPreset(formData.avatar);

  const displayPresets = GAMING_AVATAR_PRESETS.filter(p => !p.aliasOf).filter(p => {
    if (avatarFilter === 'all') return true;
    if (avatarFilter === 'roles') return p.category === 'roles';
    if (avatarFilter === 'ranks') return p.category === 'ranks';
    if (avatarFilter === 'elements') return p.category === 'elements' || p.category === 'cyber';
    return true;
  });

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md select-none font-khmer animate-fadeIn">
      {/* Background click to close */}
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#0c152d] via-[#091024] to-[#060b18] border border-sky-500/40 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(14,165,233,0.2)] overflow-hidden z-10 flex flex-col max-h-[90vh]">
        
        {/* Top Header Glow Bar */}
        <div className="relative px-5 py-4 sm:px-6 sm:py-5 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/40">
          <div className="flex items-center gap-3">
            <GamerAvatar avatarId={formData.avatar} name={formData.name} size="md" showGlow={true} />
            <div>
              <h2 className="text-base sm:text-lg font-black text-white leading-tight">
                {language === 'km' ? 'ការកំណត់ Profile អ្នកលេង' : 'Player Profile Settings'}
              </h2>
              <span className="text-[10px] sm:text-[11px] text-cyan-400 font-semibold flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {formData.serverId ? `Zone ${formData.serverId} • Active` : 'Active Player'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* Gaming Avatar Selector Studio */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <span>🎮</span>
                <span>{language === 'km' ? 'ជ្រើសរើសរូបតំណាងហ្គេម (Gaming Avatar)' : 'Choose Gaming Avatar'}</span>
              </label>
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                {currentPreset.label}
              </span>
            </div>

            {/* Live Gamer Profile Preview Card */}
            <div className="relative rounded-2xl p-3.5 sm:p-4 bg-gradient-to-r from-[#0c1a36] via-[#081329] to-[#040b1a] border border-sky-500/40 shadow-[0_8px_25px_rgba(14,165,233,0.2)] overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <GamerAvatar avatarId={formData.avatar} name={formData.name} size="lg" showGlow={true} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${currentPreset.badgeColor} shadow-sm`}>
                        {currentPreset.badge}
                      </span>
                      <span className="text-[9.5px] font-bold text-amber-300 font-mono">
                        ★ {currentPreset.tag}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-black text-white truncate mt-1">
                      {formData.name || 'Guest Player'}
                    </h3>
                    <p className="text-[10px] sm:text-[11px] text-cyan-300 font-mono flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>ID: {formData.playerId || '12345678'}</span>
                      <span>•</span>
                      <span>Zone: {formData.serverId || 'Global'}</span>
                    </p>
                  </div>
                </div>
                <div className="hidden xs:flex flex-col items-end text-right shrink-0">
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider font-bold">Gaming Title</span>
                  <span className="text-xs font-black text-white drop-shadow">{currentPreset.title}</span>
                </div>
              </div>
            </div>

            {/* Gaming Category Filter Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-950/80 rounded-xl border border-slate-800/80 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setAvatarFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold transition-all whitespace-nowrap cursor-pointer ${
                  avatarFilter === 'all'
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🔥 {language === 'km' ? 'ទាំងអស់' : 'All Gaming'}
              </button>
              <button
                type="button"
                onClick={() => setAvatarFilter('roles')}
                className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold transition-all whitespace-nowrap cursor-pointer ${
                  avatarFilter === 'roles'
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🎮 {language === 'km' ? 'Esports & តួនាទី' : 'Esports & Roles'}
              </button>
              <button
                type="button"
                onClick={() => setAvatarFilter('ranks')}
                className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold transition-all whitespace-nowrap cursor-pointer ${
                  avatarFilter === 'ranks'
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🏆 {language === 'km' ? 'Mythic & ចំណាត់ថ្នាក់' : 'Mythic & Ranks'}
              </button>
              <button
                type="button"
                onClick={() => setAvatarFilter('elements')}
                className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold transition-all whitespace-nowrap cursor-pointer ${
                  avatarFilter === 'elements'
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ⚡ {language === 'km' ? 'ធាតុ & Cyber' : 'Elements & Cyber'}
              </button>
            </div>

            {/* Gaming Avatar Grid */}
            <div className="grid grid-cols-2 xs:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
              {displayPresets.map((p) => {
                const isSelected = formData.avatar === p.id || (p.aliasOf && formData.avatar === p.aliasOf);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, avatar: p.id })}
                    className={`relative p-2 rounded-xl border transition-all text-left flex items-center gap-2 group cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-br from-[#10244c] to-[#07132a] border-cyan-400 ring-2 ring-cyan-400/40 shadow-[0_0_15px_rgba(34,211,238,0.4)] scale-[1.02]'
                        : 'bg-slate-900/80 hover:bg-slate-800/90 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <GamerAvatar avatarId={p.id} name={formData.name} size="sm" showGlow={isSelected} />
                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-black text-white truncate group-hover:text-cyan-300 transition-colors leading-tight">
                        {p.label}
                      </div>
                      <div className="text-[9px] text-slate-400 font-semibold truncate leading-tight mt-0.5">
                        {p.badge}
                      </div>
                    </div>
                    {isSelected && (
                      <span className="w-3.5 h-3.5 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center text-[9px] font-black shrink-0">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Success Banner */}
          {saveSuccess && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
              <span>✓</span>
              <span>{language === 'km' ? 'បានរក្សាទុកព័ត៌មានដោយជោគជ័យ!' : 'Profile updated successfully!'}</span>
            </div>
          )}

          {/* Error Banner */}
          {saveError && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 animate-shake">
              <span>⚠️</span>
              <span>{saveError}</span>
            </div>
          )}

          <form id="profile-edit-form" onSubmit={handleSubmit} className="space-y-4">
            
            {/* Player Name / Real In-Game Name */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  {language === 'km' ? 'ឈ្មោះអ្នកលេង (In-Game Name / Username)' : 'Player Name / Username'}
                </label>
                <button
                  type="button"
                  onClick={handleCheckMoontonName}
                  disabled={checkingName || !formData.playerId}
                  className="text-[10px] font-bold text-sky-400 hover:text-cyan-300 flex items-center gap-1 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <span>{checkingName ? '⏳ ពិនិត្យ...' : '🔍 ពិនិត្យឈ្មោះ Moonton ស្វ័យប្រវត្តិ'}</span>
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. ProGamer99"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#070c1b] border border-slate-700/80 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white font-bold text-xs sm:text-sm placeholder-slate-600 transition-all outline-none"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs">
                  🎮
                </span>
              </div>
            </div>

            {/* Two Column Grid for IDs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Player ID Field */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  {language === 'km' ? 'Player ID (លេខសម្គាល់)' : 'Player ID'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    placeholder="e.g. 1225368571"
                    value={formData.playerId}
                    onChange={(e) => setFormData({ ...formData, playerId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070c1b] border border-slate-700/80 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white font-mono text-xs sm:text-sm placeholder-slate-600 transition-all outline-none pr-8"
                  />
                  <button
                    type="button"
                    onClick={handleCopyId}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-300 text-xs p-1 cursor-pointer transition-colors"
                    title="Copy Player ID"
                  >
                    {copiedId ? '✓' : '📋'}
                  </button>
                </div>
              </div>

              {/* Zone / Server ID Field */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  {language === 'km' ? 'Server / Zone ID' : 'Zone / Server ID'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    placeholder="e.g. 11446"
                    value={formData.serverId}
                    onChange={(e) => setFormData({ ...formData, serverId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070c1b] border border-slate-700/80 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white font-mono text-xs sm:text-sm placeholder-slate-600 transition-all outline-none"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs">
                    🌐
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Phone / Telegram Handle */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                {language === 'km' ? 'លេខទូរស័ព្ទ ឬ Telegram (សម្រាប់ជំនួយ)' : 'Phone or Telegram Handle (Optional)'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. 012 345 678 or @mytelegram"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#070c1b] border border-slate-700/80 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white text-xs sm:text-sm placeholder-slate-600 transition-all outline-none"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs">
                  📱
                </span>
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                {language === 'km' ? 'អាសយដ្ឋាន Email' : 'Email Address'}
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="player@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#070c1b] border border-slate-700/80 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white text-xs sm:text-sm placeholder-slate-600 transition-all outline-none font-mono"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs">
                  ✉️
                </span>
              </div>
            </div>

            {/* New Password (Optional) */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                {language === 'km' ? 'ពាក្យសម្ងាត់ថ្មី (Password ទុកទំនេរប្រសិនបើមិនចង់ប្តូរ)' : 'New Password (Leave blank to keep current)'}
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#070c1b] border border-slate-700/80 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white text-xs sm:text-sm placeholder-slate-600 transition-all outline-none"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs">
                  🔒
                </span>
              </div>
            </div>

          </form>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-800/80 bg-slate-950/60 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
          >
            {language === 'km' ? 'បោះបង់' : 'Cancel'}
          </button>

          <button
            type="submit"
            form="profile-edit-form"
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs shadow-[0_0_15px_rgba(34,211,238,0.4)] flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-60"
          >
            {saving ? (
              <>
                <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                <span>{language === 'km' ? 'កំពុងរក្សាទុក...' : 'Saving...'}</span>
              </>
            ) : (
              <>
                <span>💾</span>
                <span>{language === 'km' ? 'រក្សាទុកការផ្លាស់ប្តូរ' : 'Save Changes'}</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProfileModal;
