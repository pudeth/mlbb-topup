import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { topupAPI, ordersAPI } from '../services/api';
import GamerAvatar, { GAMING_AVATAR_PRESETS, getGamerAvatarPreset } from '../components/GamerAvatar';

const Profile = () => {
  const { user, playerAccount, updateProfile, logout, isAuthenticated } = useAuth();
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

  const [ordersCount, setOrdersCount] = useState(0);
  const [checkingName, setCheckingName] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [avatarFilter, setAvatarFilter] = useState('all');

  useEffect(() => {
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

    if (pId) {
      ordersAPI.getByPlayer(pId, sId)
        .then(res => {
          if (Array.isArray(res.data)) setOrdersCount(res.data.length);
        })
        .catch(() => {});
    }
  }, [playerAccount, user]);

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
        setTimeout(() => setSaveSuccess(false), 3000);
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

  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen bg-[#070b16] text-white pt-10 pb-24 px-4 font-khmer flex items-center justify-center">
        <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900/90 border border-slate-800 text-center space-y-4 shadow-2xl">
          <div className="text-4xl">👤</div>
          <h2 className="text-xl font-black">{language === 'km' ? 'សូមចូលគណនីជាមុន' : 'Please Login First'}</h2>
          <p className="text-xs text-slate-400">
            {language === 'km' ? 'អ្នកត្រូវចូលគណនីដើម្បីកែប្រែព័ត៌មាន Profile របស់អ្នក' : 'You must be logged in to view and edit your profile information'}
          </p>
          <Link
            to="/order-history"
            className="inline-block w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black text-xs shadow-lg"
          >
            {language === 'km' ? 'ចូលគណនី (Login)' : 'Go to Login'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b16] text-white pt-4 pb-28 px-3 sm:px-6 lg:px-8 font-khmer select-none">
      {/* Background ambient glow */}
      <div className="fixed top-12 left-1/3 w-96 h-96 bg-cyan-500/[0.07] rounded-full blur-[130px] pointer-events-none" />
      <div className="fixed bottom-20 right-1/4 w-96 h-96 bg-indigo-500/[0.06] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-2xl mx-auto relative z-10 space-y-6">
        
        {/* Navigation Breadcrumb Bar */}
        <div className="flex items-center justify-between">
          <Link
            to="/topup"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-bold text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-all cursor-pointer"
          >
            <span>←</span>
            <span>{language === 'km' ? 'ទៅកាន់ទំព័រទិញ' : 'Back to Top-Up'}</span>
          </Link>

          <Link
            to="/order-history"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition-all"
          >
            <span>📋</span>
            <span>{language === 'km' ? 'ប្រវត្តិបញ្ជាទិញ' : 'Order History'}</span>
          </Link>
        </div>

        {/* Profile Card Header */}
        <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#0c152d] via-[#091024] to-[#060b18] border border-sky-500/35 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(14,165,233,0.15)] overflow-hidden">
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 border-b border-slate-800/80 pb-6 mb-6">
            <GamerAvatar avatarId={formData.avatar} name={formData.name} size="xl" showGlow={true} />

            <div className="text-center sm:text-left min-w-0 flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-white truncate">
                  {formData.name || 'Player'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[10px] font-bold text-emerald-400">
                  ✓ Verified Player
                </span>
              </div>

              <div className="text-xs text-sky-300 font-mono mt-1.5 flex items-center justify-center sm:justify-start gap-2">
                <span>Player ID: {formData.playerId || 'N/A'}</span>
                {formData.serverId && <span>• Server: {formData.serverId}</span>}
              </div>

              <div className="mt-3 flex items-center justify-center sm:justify-start gap-2">
                <button
                  type="button"
                  onClick={logout}
                  className="px-3 py-1 rounded-xl bg-rose-950/40 border border-rose-500/40 hover:bg-rose-900/50 text-rose-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>🚪</span>
                  <span>{language === 'km' ? 'ចាកចេញ' : 'Sign Out'}</span>
                </button>
              </div>
            </div>

            {/* Quick Stats Pill */}
            <div className="bg-[#070c1b] border border-slate-800 p-3 rounded-2xl text-center shrink-0 w-full sm:w-auto">
              <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
                {language === 'km' ? 'បញ្ជាទិញសរុប' : 'Total Orders'}
              </span>
              <span className="text-xl font-black text-cyan-400 font-mono">
                {ordersCount}
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
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
              <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-60 overflow-y-auto pr-1">
                {displayPresets.map((p) => {
                  const isSelected = formData.avatar === p.id || (p.aliasOf && formData.avatar === p.aliasOf);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, avatar: p.id })}
                      className={`relative p-2.5 rounded-xl border transition-all text-left flex items-center gap-2 group cursor-pointer ${
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

            {/* Player In-Game Name */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  {language === 'km' ? 'ឈ្មោះអ្នកលេង (In-Game Name)' : 'Player Name / Username'}
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
                  className="w-full px-3.5 py-3 rounded-xl bg-[#070c1b] border border-slate-700/80 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white font-bold text-sm placeholder-slate-600 transition-all outline-none"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs">
                  🎮
                </span>
              </div>
            </div>

            {/* IDs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  {language === 'km' ? 'Player ID' : 'Player ID'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    placeholder="e.g. 1225368571"
                    value={formData.playerId}
                    onChange={(e) => setFormData({ ...formData, playerId: e.target.value })}
                    className="w-full px-3.5 py-3 rounded-xl bg-[#070c1b] border border-slate-700/80 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white font-mono text-sm placeholder-slate-600 transition-all outline-none pr-8"
                  />
                  <button
                    type="button"
                    onClick={handleCopyId}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-300 text-xs p-1 cursor-pointer"
                    title="Copy"
                  >
                    {copiedId ? '✓' : '📋'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  {language === 'km' ? 'Zone / Server ID' : 'Zone / Server ID'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    placeholder="e.g. 11446"
                    value={formData.serverId}
                    onChange={(e) => setFormData({ ...formData, serverId: e.target.value })}
                    className="w-full px-3.5 py-3 rounded-xl bg-[#070c1b] border border-slate-700/80 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white font-mono text-sm placeholder-slate-600 transition-all outline-none"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs">
                    🌐
                  </span>
                </div>
              </div>
            </div>

            {/* Phone or Telegram */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                {language === 'km' ? 'លេខទូរស័ព្ទ ឬ Telegram (សម្រាប់ជំនួយ)' : 'Phone or Telegram Handle'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. 012 345 678 or @mytelegram"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-3 rounded-xl bg-[#070c1b] border border-slate-700/80 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white text-sm placeholder-slate-600 transition-all outline-none"
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
                  className="w-full px-3.5 py-3 rounded-xl bg-[#070c1b] border border-slate-700/80 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white text-sm placeholder-slate-600 transition-all outline-none font-mono"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs">
                  ✉️
                </span>
              </div>
            </div>

            {/* New Password */}
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
                  className="w-full px-3.5 py-3 rounded-xl bg-[#070c1b] border border-slate-700/80 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white text-sm placeholder-slate-600 transition-all outline-none"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs">
                  🔒
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="w-full py-3.5 px-4 rounded-xl font-black text-sm text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                    <span>{language === 'km' ? 'កំពុងរក្សាទុក...' : 'Saving Changes...'}</span>
                  </>
                ) : (
                  <>
                    <span>💾</span>
                    <span>{language === 'km' ? 'រក្សាទុកការផ្លាស់ប្តូរ' : 'Save Changes'}</span>
                  </>
                )}
              </button>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
};

export default Profile;
