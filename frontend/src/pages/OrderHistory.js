import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ordersAPI, authAPI, topupAPI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import LoadingSpinner from '../components/LoadingSpinner';

const OrderHistory = () => {
  const { language } = useLanguage();

  // Authentication & Player State
  const [playerAccount, setPlayerAccount] = useState(() => {
    try {
      const saved = localStorage.getItem('player_account');
      if (saved) return JSON.parse(saved);
      const user = localStorage.getItem('user');
      if (user) {
        const u = JSON.parse(user);
        if (u.playerId || u.playerID) {
          return {
            playerId: u.playerId || u.playerID,
            serverId: u.serverId || u.serverID || 'Global',
            realName: u.name || u.username || 'Player'
          };
        }
      }
    } catch (e) {}
    return null;
  });

  // Lookup form state
  const [formData, setFormData] = useState({
    playerId: '',
    serverId: ''
  });
  const [checkingName, setCheckingName] = useState(false);
  const [verifiedName, setVerifiedName] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Orders state
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState('');
  const [filterTab, setFilterTab] = useState('all'); // 'all', 'completed', 'processing'
  const [copiedId, setCopiedId] = useState(null);

  // Check player real-name from Moonton / API
  const handleCheckPlayerName = async () => {
    const pId = formData.playerId.trim();
    const sId = formData.serverId.trim();
    if (!pId) {
      setFormError(language === 'km' ? 'សូមបញ្ចូល Player ID' : 'Please enter Player ID');
      return;
    }

    setCheckingName(true);
    setFormError('');
    try {
      const res = await topupAPI.checkAccount(pId, sId);
      if (res?.data?.valid && res?.data?.name) {
        setVerifiedName(res.data.name);
      } else {
        setFormError(res?.data?.error || (language === 'km' ? 'រកមិនឃើញឈ្មោះ Player នេះទេ' : 'Player account not found'));
      }
    } catch (err) {
      setFormError(language === 'km' ? 'មិនអាចផ្ទៀងផ្ទាត់ Player ID បានទេ' : 'Unable to verify Player ID');
    } finally {
      setCheckingName(false);
    }
  };

  // Fetch orders for active player
  const loadOrdersForPlayer = useCallback(async (pId, sId) => {
    if (!pId) return;
    setLoadingOrders(true);
    setOrdersError('');

    try {
      // 1. Try fetching by player endpoint
      let playerOrders = [];
      try {
        const res = await ordersAPI.getByPlayer(pId, sId);
        if (Array.isArray(res.data)) {
          playerOrders = res.data;
        }
      } catch (e) {
        // Fallback to my-orders if authenticated
        try {
          const res = await ordersAPI.getMyOrders();
          if (Array.isArray(res.data)) {
            playerOrders = res.data.filter(o => 
              String(o.playerID || o.playerId) === String(pId)
            );
          }
        } catch (err2) {}
      }

      setOrders(playerOrders);
    } catch (err) {
      setOrdersError(language === 'km' ? 'មិនអាចទាញយកទិន្នន័យបញ្ជាទិញបានទេ' : 'Failed to load order history');
    } finally {
      setLoadingOrders(false);
    }
  }, [language]);

  // Load orders if playerAccount is already active
  useEffect(() => {
    if (playerAccount?.playerId) {
      loadOrdersForPlayer(playerAccount.playerId, playerAccount.serverId);
    }
  }, [playerAccount, loadOrdersForPlayer]);

  // Submit Lookup / Player Login
  const handlePlayerLogin = async (e) => {
    e.preventDefault();
    const pId = formData.playerId.trim();
    const sId = formData.serverId.trim() || 'Global';

    if (!pId) {
      setFormError(language === 'km' ? 'សូមបញ្ចូល Player ID' : 'Please enter Player ID');
      return;
    }

    setSubmitting(true);
    setFormError('');

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

      // Default realName if verification service is unavailable
      if (!realName) {
        realName = `Player_${pId}`;
      }

      // Step 2: Authenticate using real-name player = username and ID server = password
      const playerAuthPayload = {
        playerId: pId,
        serverId: sId,
        realName: realName
      };

      let authResult = null;

      // Try dedicated player-login endpoint
      try {
        const authRes = await authAPI.playerLogin(playerAuthPayload);
        authResult = authRes.data;
      } catch (authErr) {
        // Fallback: standard login or register
        const email = `${pId}_${sId}@player.tin-topup.com`.toLowerCase();
        const password = sId;

        try {
          const regRes = await authAPI.register({
            name: realName, // real-name player = username
            email: email,
            password: password // ID server = password
          });
          authResult = regRes.data;
        } catch (regErr) {
          try {
            const loginRes = await authAPI.login({
              email: email,
              password: password
            });
            authResult = loginRes.data;
          } catch (loginErr) {}
        }
      }

      // Store token and user if returned
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
          role: authResult.role || 'User'
        }));
      }

      // Save player account state
      const newPlayerAccount = {
        playerId: pId,
        serverId: sId,
        realName: realName
      };
      setPlayerAccount(newPlayerAccount);
      localStorage.setItem('player_account', JSON.stringify(newPlayerAccount));

      // Step 3: Fetch orders immediately
      await loadOrdersForPlayer(pId, sId);

    } catch (err) {
      setFormError(language === 'km' ? 'មានបញ្ហាក្នុងការភ្ជាប់គណនី សូមព្យាយាមម្តងទៀត' : 'Failed to connect player account. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Switch / Logout Player
  const handleSwitchPlayer = () => {
    localStorage.removeItem('player_account');
    setPlayerAccount(null);
    setOrders([]);
    setVerifiedName('');
    setFormData({ playerId: '', serverId: '' });
  };

  // Copy Order ID
  const handleCopyOrderId = (id) => {
    navigator.clipboard.writeText(String(id));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter orders
  const filteredOrders = orders.filter(o => {
    const isCompleted = o.topupStatus === 'Completed' || (o.paymentStatus === 'Paid' && o.topupStatus !== 'Failed');
    if (filterTab === 'completed') return isCompleted;
    if (filterTab === 'processing') return !isCompleted && o.topupStatus !== 'Failed';
    return true;
  });

  // Calculate quick stats
  const totalCompleted = orders.filter(o => o.topupStatus === 'Completed').length;

  return (
    <div className="min-h-screen bg-[#070b16] text-white pt-4 pb-24 px-3 sm:px-6 lg:px-8 font-khmer select-none">
      {/* Background ambient lighting */}
      <div className="fixed top-10 left-1/4 w-96 h-96 bg-cyan-500/[0.06] rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-20 right-1/4 w-96 h-96 bg-amber-500/[0.05] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">

        {/* ======================================================== */}
        {/* VIEW 1: PLAYER ID & SERVER ID ACCESS / LOGIN SCREEN */}
        {/* ======================================================== */}
        {!playerAccount ? (
          <div className="py-6 sm:py-10 max-w-lg mx-auto">
            {/* Top Navigation Pill */}
            <div className="flex items-center justify-between mb-6">
              <Link
                to="/topup"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-bold text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-all cursor-pointer"
              >
                <span>←</span>
                <span>{language === 'km' ? 'ទៅកាន់ទំព័រទិញ' : 'Back to Top-Up'}</span>
              </Link>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-[11px] font-bold text-cyan-300 shadow-sm">
                <span>🛡️</span>
                <span>{language === 'km' ? 'ប្រព័ន្ធស្វែងរកដោយសុវត្ថិភាព' : 'Secure Player Sync'}</span>
              </span>
            </div>

            {/* Portal Card */}
            <div className="relative rounded-3xl p-5 sm:p-8 bg-gradient-to-b from-[#0c152e] via-[#091024] to-[#060b18] border border-sky-500/35 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(14,165,233,0.15)] overflow-hidden">
              {/* Card top banner badge */}
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-400 via-sky-500 to-blue-600 p-0.5 shadow-[0_0_16px_rgba(34,211,238,0.5)] flex items-center justify-center">
                  <div className="w-full h-full bg-[#070e22] rounded-[14px] flex items-center justify-center text-lg">
                    💳
                  </div>
                </div>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-center text-white tracking-tight leading-snug">
                {language === 'km' ? 'ប្រវត្តិបញ្ជាទិញហ្គេម' : 'Player Order History'}
              </h1>
              <p className="text-xs sm:text-sm text-center text-slate-400 mt-1 mb-6">
                {language === 'km'
                  ? 'បញ្ចូល Player ID និង Server ID ដើម្បីបង្កើតគណនី និងមើលប្រវត្តិបញ្ជាទិញទាំងអស់'
                  : 'Enter your Player ID and Server ID to access your account & view all orders'}
              </p>

              {formError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 animate-shake">
                  <span>⚠️</span>
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handlePlayerLogin} className="space-y-4">
                {/* Player ID Field */}
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                    {language === 'km' ? '1. លេខសម្គាល់អ្នកលេង (Player ID)' : '1. Player ID'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="numeric"
                      required
                      placeholder="e.g. 12345678"
                      value={formData.playerId}
                      onChange={(e) => {
                        setFormData({ ...formData, playerId: e.target.value });
                        setVerifiedName('');
                        setFormError('');
                      }}
                      className="w-full px-3.5 py-3 rounded-xl bg-[#070c1b] border border-slate-700/80 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white font-mono text-sm placeholder-slate-600 transition-all outline-none"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs">
                      🆔
                    </span>
                  </div>
                </div>

                {/* Server ID Field */}
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                    {language === 'km' ? '2. លេខតំបន់ម៉ាស៊ីនបម្រើ (Server ID / Zone)' : '2. Server / Zone ID'}
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
                        setFormError('');
                      }}
                      className="w-full px-3.5 py-3 rounded-xl bg-[#070c1b] border border-slate-700/80 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white font-mono text-sm placeholder-slate-600 transition-all outline-none"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs">
                      🌐
                    </span>
                  </div>
                </div>

                {/* Live Check Player Real-Name Preview Button */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={handleCheckPlayerName}
                    disabled={checkingName || !formData.playerId}
                    className="text-[11px] font-bold text-sky-400 hover:text-cyan-300 flex items-center gap-1 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <span>{checkingName ? '⏳ កំពុងពិនិត្យឈ្មោះ...' : '🔍 ពិនិត្យឈ្មោះអ្នកលេង (Check Real-Name)'}</span>
                  </button>

                  {verifiedName && (
                    <span className="text-[11px] font-black text-emerald-400 flex items-center gap-1 bg-emerald-950/40 px-2 py-0.5 rounded-lg border border-emerald-500/30">
                      <span>✓</span>
                      <span className="truncate max-w-[150px]">{verifiedName}</span>
                    </span>
                  )}
                </div>

                {/* Verified Account Preview Card */}
                {verifiedName && (
                  <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-950/30 to-cyan-950/30 border border-emerald-500/40 flex items-center justify-between animate-fadeIn">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-400/20 text-emerald-400 flex items-center justify-center font-black text-xs">
                        👑
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          {language === 'km' ? 'ឈ្មោះអ្នកលេង (Username)' : 'Real-Name Player (Username)'}
                        </div>
                        <div className="text-xs font-black text-emerald-300">
                          {verifiedName}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded-md border border-cyan-500/30">
                      Pass: {formData.serverId}
                    </span>
                  </div>
                )}

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-2 py-3.5 px-4 rounded-xl font-black text-sm text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                      <span>{language === 'km' ? 'កំពុងភ្ជាប់គណនី...' : 'Connecting Account...'}</span>
                    </>
                  ) : (
                    <>
                      <span>🚀</span>
                      <span>{language === 'km' ? 'ចូលមើលប្រវត្តិបញ្ជាទិញ' : 'Access & View History'}</span>
                    </>
                  )}
                </button>
              </form>

              {/* Policy note */}
              <div className="mt-5 pt-4 border-t border-slate-800/80 text-center">
                <span className="text-[10px] text-slate-500">
                  {language === 'km'
                    ? 'គណនីត្រូវបានបង្កើតដោយស្វ័យប្រវត្តិជាមួយឈ្មោះ Player (Username) និង Server ID (Password)'
                    : 'Account is automatically created with your Player Name (Username) and Server ID (Password)'}
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* ======================================================== */
          /* VIEW 2: ACTIVE PLAYER ORDER HISTORY DASHBOARD            */
          /* ======================================================== */
          <div className="space-y-4 sm:space-y-6">

            {/* Clean Action Controls Bar */}
            <div className="flex items-center justify-between gap-3 pt-1 pb-2">
              <Link
                to="/topup"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-bold text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-all cursor-pointer"
              >
                <span>←</span>
                <span>{language === 'km' ? 'ទៅកាន់ទំព័រទិញ' : 'Back to Top-Up'}</span>
              </Link>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => loadOrdersForPlayer(playerAccount.playerId, playerAccount.serverId)}
                  disabled={loadingOrders}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-400/60 text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                  title="Refresh Orders"
                >
                  <span className={loadingOrders ? 'animate-spin' : ''}>🔄</span>
                  <span>{language === 'km' ? 'ផ្ទុកឡើងវិញ' : 'Refresh'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSwitchPlayer}
                  className="px-3 py-1.5 rounded-xl bg-rose-950/40 border border-rose-500/40 hover:bg-rose-900/50 text-xs font-bold text-rose-300 flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Switch Player Account"
                >
                  <span>🚪</span>
                  <span>{language === 'km' ? 'ប្តូរ Player' : 'Switch'}</span>
                </button>

                <Link
                  to="/topup"
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#00E599] to-[#00F5B8] text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-sm hover:scale-105 active:scale-95 transition-all"
                >
                  <span>💎</span>
                  <span>{language === 'km' ? 'ទិញបន្ថែម' : 'New Top-Up'}</span>
                </Link>
              </div>
            </div>

            {/* Filter Tabs & Count */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="inline-flex items-center p-1 bg-slate-950/80 rounded-2xl border border-slate-800 shadow-inner gap-1">
                <button
                  type="button"
                  onClick={() => setFilterTab('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    filterTab === 'all'
                      ? 'bg-gradient-to-r from-sky-500/25 to-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm'
                      : 'text-slate-400 hover:text-white border border-transparent'
                  }`}
                >
                  {language === 'km' ? 'ទាំងអស់' : 'All'} ({orders.length})
                </button>

                <button
                  type="button"
                  onClick={() => setFilterTab('completed')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    filterTab === 'completed'
                      ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-400/40 shadow-sm'
                      : 'text-slate-400 hover:text-white border border-transparent'
                  }`}
                >
                  {language === 'km' ? 'ជោគជ័យ' : 'Completed'} ({totalCompleted})
                </button>

                <button
                  type="button"
                  onClick={() => setFilterTab('processing')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    filterTab === 'processing'
                      ? 'bg-amber-500/25 text-amber-300 border border-amber-400/40 shadow-sm'
                      : 'text-slate-400 hover:text-white border border-transparent'
                  }`}
                >
                  {language === 'km' ? 'កំពុងដំណើរការ' : 'Processing'} ({orders.length - totalCompleted})
                </button>
              </div>

              {orders.length > 0 && (
                <span className="text-xs font-mono font-bold text-slate-400">
                  {language === 'km' ? 'បង្ហាញ' : 'Showing'} {filteredOrders.length} {language === 'km' ? 'កញ្ចប់' : 'orders'}
                </span>
              )}
            </div>

            {/* Orders List Rendering */}
            {loadingOrders ? (
              <div className="py-16 text-center">
                <LoadingSpinner text={language === 'km' ? 'កំពុងផ្ទុកប្រវត្តិបញ្ជាទិញ...' : 'Loading your orders...'} />
              </div>
            ) : ordersError ? (
              <div className="p-6 rounded-2xl bg-rose-950/30 border border-rose-500/40 text-rose-300 text-center text-xs">
                <span>⚠️ {ordersError}</span>
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={() => loadOrdersForPlayer(playerAccount.playerId, playerAccount.serverId)}
                    className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold hover:bg-slate-800"
                  >
                    {language === 'km' ? 'ព្យាយាមម្តងទៀត' : 'Try Again'}
                  </button>
                </div>
              </div>
            ) : filteredOrders.length === 0 ? (
              /* Empty state */
              <div className="py-16 px-4 rounded-3xl bg-slate-950/60 border border-slate-800 text-center">
                <div className="text-4xl sm:text-5xl mb-3">📦</div>
                <h3 className="text-base sm:text-lg font-black text-white">
                  {language === 'km' ? 'មិនទាន់មានការបញ្ជាទិញនៅឡើយទេ' : 'No Orders Found'}
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-5">
                  {language === 'km'
                    ? `មិនទាន់មានប្រវត្តិទិញពេជ្រសម្រាប់ Player ID ${playerAccount.playerId} នៅឡើយទេ។ ចាប់ផ្តើមការបញ្ជាទិញដំបូងរបស់អ្នកឥឡូវនេះ!`
                    : `No top-up history found for Player ID ${playerAccount.playerId}. Start your first order now!`}
                </p>
                <Link
                  to="/topup"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00E599] to-[#00F5B8] text-slate-950 font-black text-xs shadow-lg hover:scale-105 active:scale-95 transition-all"
                >
                  <span>💎</span>
                  <span>{language === 'km' ? 'បញ្ចូលពេជ្រឥឡូវនេះ' : 'Make First Top-Up'}</span>
                </Link>
              </div>
            ) : (
              /* Active Orders Cards */
              <div className="space-y-3">
                {filteredOrders.map((order) => {
                  const isCompleted = order.topupStatus === 'Completed';
                  const isProcessing = order.topupStatus === 'Processing' || order.topupStatus === 'AwaitingBalance';
                  const isFailed = order.topupStatus === 'Failed' || order.paymentStatus === 'Failed';
                  const isPass = (order.productName || '').toLowerCase().includes('pass');

                  const statusConfig = isCompleted
                    ? {
                        label: language === 'km' ? 'ជោគជ័យ' : 'Completed',
                        cls: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 shadow-[0_0_10px_rgba(52,211,153,0.3)]',
                        icon: '✓'
                      }
                    : isFailed
                      ? {
                          label: language === 'km' ? 'បរាជ័យ' : 'Failed',
                          cls: 'bg-rose-950/80 text-rose-300 border-rose-500/50 shadow-[0_0_10px_rgba(244,63,94,0.3)]',
                          icon: '✕'
                        }
                      : {
                          label: isProcessing ? (language === 'km' ? 'កំពុងផ្ញើពេជ្រ' : 'Processing') : (language === 'km' ? 'រង់ចាំទូទាត់' : 'Pending'),
                          cls: 'bg-amber-950/80 text-amber-300 border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.3)]',
                          icon: '⚡'
                        };

                  return (
                    <div
                      key={order.orderId}
                      className="group relative rounded-2xl p-3.5 sm:p-4 bg-gradient-to-r from-[#0d1428] via-[#091020] to-[#060a14] border border-slate-800/90 hover:border-sky-500/50 hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.8),0_0_15px_rgba(56,189,248,0.15)] transition-all duration-200"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        
                        {/* Left: Artwork / Game & Order Title */}
                        <div className="flex items-center gap-3 min-w-0">
                          {/* 3D Package Gem / Pass Art */}
                          <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-slate-950/80 border border-slate-800 p-1 flex items-center justify-center shrink-0">
                            <span className="text-2xl">
                              {isPass ? '🎟️' : '💎'}
                            </span>
                          </div>

                          <div className="min-w-0">
                            {/* Order ID & Status */}
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                onClick={() => handleCopyOrderId(order.orderId)}
                                className="font-mono text-xs sm:text-sm font-black text-white hover:text-cyan-300 flex items-center gap-1 cursor-pointer transition-colors"
                                title="Click to Copy Order ID"
                              >
                                <span>#{order.orderId}</span>
                                <span className="text-[10px] text-slate-500">
                                  {copiedId === order.orderId ? '✓' : '📋'}
                                </span>
                              </span>

                              {/* Status Badge */}
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black border uppercase tracking-wider ${statusConfig.cls}`}>
                                <span>{statusConfig.icon}</span>
                                <span>{statusConfig.label}</span>
                              </span>
                            </div>

                            {/* Package Name & Diamond count */}
                            <div className="text-xs sm:text-sm font-bold text-slate-200 mt-1 truncate">
                              {order.productName || `${order.diamondAmount} Diamonds`}
                            </div>

                            {/* Date & Game */}
                            <div className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 flex items-center gap-2 font-mono">
                              <span>{order.createdAt ? new Date(order.createdAt).toLocaleString() : 'Recent'}</span>
                              <span className="text-slate-600">•</span>
                              <span className="text-sky-300 font-semibold">{order.gameName || 'Mobile Legends'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Right: Amount & View Details Button */}
                        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/80">
                          <div className="text-left sm:text-right">
                            <div className="font-mono font-black text-sm sm:text-base text-[#00F5B8] drop-shadow-[0_0_8px_rgba(0,245,184,0.3)]">
                              ${parseFloat(order.amount || 0).toFixed(2)}
                            </div>
                            <div className="text-[9px] font-mono text-slate-400">
                              ~{Math.round((parseFloat(order.amount) || 0) * 4100).toLocaleString()} ៛
                            </div>
                          </div>

                          <Link
                            to={`/order-status/${order.orderId}`}
                            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 text-xs font-bold text-cyan-300 hover:text-white flex items-center gap-1 transition-all shadow-sm"
                          >
                            <span>{language === 'km' ? 'មើលវិក្កយបត្រ' : 'Details'}</span>
                            <span className="text-[10px]">→</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};

export default OrderHistory;
