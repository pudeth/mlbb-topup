import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ordersAPI, authAPI, topupAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDateTime } from '../utils/dateTime';
import { getLocalOrders, saveLocalOrder, mergeOrders } from '../utils/orderStorage';
import GamerAvatar from '../components/GamerAvatar';

// Bulletproof resolver for active player account
export const getStoredPlayerAccount = () => {
  try {
    const saved = localStorage.getItem('player_account');
    if (saved) {
      const p = JSON.parse(saved);
      if (p && (p.playerId || p.playerID)) {
        return {
          playerId: String(p.playerId || p.playerID).trim(),
          serverId: String(p.serverId || p.serverID || 'Global').trim(),
          realName: p.realName || p.name || `Player_${p.playerId || p.playerID}`
        };
      }
    }

    const userStr = localStorage.getItem('user');
    if (userStr) {
      const u = JSON.parse(userStr);
      let pId = u.playerId || u.playerID || '';
      let sId = u.serverId || u.serverID || '';

      // If pId not explicit, extract from email (e.g. 1225368571_11446@player.tin-topup.com)
      if (!pId && u.email) {
        const emailMatch = u.email.match(/^(\d+)_([^_@]+)@/);
        if (emailMatch) {
          pId = emailMatch[1];
          sId = emailMatch[2];
        }
      }

      // If still not found, extract from name if Player_12345678
      if (!pId && u.name) {
        const nameMatch = u.name.match(/Player_(\d+)/i);
        if (nameMatch) {
          pId = nameMatch[1];
        }
      }

      if (pId) {
        const resolved = {
          playerId: String(pId).trim(),
          serverId: String(sId || 'Global').trim(),
          realName: u.name || `Player_${pId}`
        };
        try {
          localStorage.setItem('player_account', JSON.stringify(resolved));
        } catch {}
        return resolved;
      }
    }
  } catch (err) {
    console.warn('Failed to resolve stored player account:', err);
  }
  return null;
};

const OrderHistory = () => {
  const { language } = useLanguage();
  const { playerAccount, loginPlayer, logout, user } = useAuth();

  const [effectivePlayer, setEffectivePlayer] = useState(() => playerAccount || getStoredPlayerAccount());

  useEffect(() => {
    const p = playerAccount || getStoredPlayerAccount();
    if (p) {
      setEffectivePlayer(p);
      if (!playerAccount && loginPlayer) {
        loginPlayer(p);
      }
    } else {
      setEffectivePlayer(null);
    }
  }, [playerAccount, loginPlayer]);

  // Lookup form state
  const [formData, setFormData] = useState({
    playerId: '',
    serverId: ''
  });
  const [checkingName, setCheckingName] = useState(false);
  const [verifiedName, setVerifiedName] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [pastedPlayerId, setPastedPlayerId] = useState(false);
  const [pastedServerId, setPastedServerId] = useState(false);

  // Orders state
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState('');
  const [filterTab, setFilterTab] = useState('all'); // 'all', 'completed', 'processing'
  const [copiedId, setCopiedId] = useState(null);

  // Clean up any legacy recent lookups
  useEffect(() => {
    try {
      localStorage.removeItem('recent_player_lookups');
    } catch {}
  }, []);

  // Dedicated Paste for Player ID (intelligently detects combined Player ID + Server ID too)
  const handlePastePlayerId = async () => {
    try {
      let text = '';
      if (navigator.clipboard && navigator.clipboard.readText) {
        text = await navigator.clipboard.readText();
      }
      if (!text || !text.trim()) return;
      const clean = text.trim();

      const bracketMatch = clean.match(/(?:id\s*:\s*)?(\d{5,12})\s*[[({]\s*(\d{3,7})\s*[)\]}]/i) ||
                           clean.match(/(\d+)\s*[[({]\s*(\d+)\s*[)\]}]/);
      const sepMatch = clean.match(/^(\d{5,12})\s*[-/_|\s,]\s*(\d{3,7})$/);

      if (bracketMatch) {
        setFormData({ playerId: bracketMatch[1], serverId: bracketMatch[2] });
        setFormError('');
        setVerifiedName('');
      } else if (sepMatch) {
        setFormData({ playerId: sepMatch[1], serverId: sepMatch[2] });
        setFormError('');
        setVerifiedName('');
      } else {
        const digitsOnly = clean.replace(/\D/g, '');
        setFormData(prev => ({ ...prev, playerId: digitsOnly || clean }));
        setFormError('');
        setVerifiedName('');
      }
      setPastedPlayerId(true);
      setTimeout(() => setPastedPlayerId(false), 2000);
    } catch (err) {
      console.warn('Clipboard read error:', err);
    }
  };

  // Dedicated Paste for Server ID
  const handlePasteServerId = async () => {
    try {
      let text = '';
      if (navigator.clipboard && navigator.clipboard.readText) {
        text = await navigator.clipboard.readText();
      }
      if (!text || !text.trim()) return;
      const clean = text.trim();
      const bracketMatch = clean.match(/[[({](\d+)[)\]}]/);
      let val = '';
      if (bracketMatch) {
        val = bracketMatch[1];
      } else {
        val = clean.replace(/\D/g, '');
      }
      setFormData(prev => ({ ...prev, serverId: val || clean }));
      setFormError('');
      setVerifiedName('');
      setPastedServerId(true);
      setTimeout(() => setPastedServerId(false), 2000);
    } catch (err) {
      console.warn('Clipboard read error:', err);
    }
  };

  // Quick Paste Combined ID & Server
  const handleQuickPaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text) return;
      const clean = text.trim();
      const match = clean.match(/^(\d+)[\s_([+(\d+)[)\]]?$/);
      if (match) {
        setFormData({ playerId: match[1], serverId: match[2] });
        setFormError('');
        setVerifiedName('');
      } else if (/^\d+$/.test(clean)) {
        setFormData(prev => ({ ...prev, playerId: clean }));
        setFormError('');
      } else {
        const numbers = clean.match(/\d+/g);
        if (numbers && numbers.length >= 2) {
          setFormData({ playerId: numbers[0], serverId: numbers[1] });
          setFormError('');
          setVerifiedName('');
        }
      }
    } catch (err) {
      console.warn('Clipboard read error:', err);
    }
  };

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

  // Fetch orders for active player - always loads local first, then merges remote
  const loadOrdersForPlayer = useCallback(async (pId, sId) => {
    setLoadingOrders(true);
    setOrdersError('');

    // 1. Load local orders immediately so UI shows instantly (never empty)
    const cleanP = pId ? String(pId).trim() : '';
    const localOrders = cleanP ? getLocalOrders(cleanP) : getLocalOrders();
    const allDeviceOrders = getLocalOrders();

    let initialOrders = localOrders;
    if (initialOrders.length === 0 && cleanP) {
      const pDigits = cleanP.replace(/\D/g, '');
      if (pDigits && pDigits.length >= 4) {
        const digitMatched = allDeviceOrders.filter(o => {
          const oDigits = String(o.playerId || o.playerID || '').replace(/\D/g, '');
          return oDigits && (oDigits === pDigits || oDigits.startsWith(pDigits) || pDigits.startsWith(oDigits));
        });
        if (digitMatched.length > 0) initialOrders = digitMatched;
      }
    }

    if (initialOrders.length === 0 && !cleanP && allDeviceOrders.length > 0) {
      initialOrders = allDeviceOrders;
    }

    if (initialOrders.length > 0) {
      setOrders(initialOrders);
    }

    try {
      // 2. Fetch remote orders (server has authoritative data)
      let remoteOrders = [];
      if (cleanP) {
        try {
          const res = await ordersAPI.getByPlayer(cleanP, sId);
          if (Array.isArray(res.data) && res.data.length > 0) {
            remoteOrders = res.data;
          }
        } catch (e) {}

        // Fallback: my-orders endpoint if user is logged in
        if (remoteOrders.length === 0) {
          try {
            const res = await ordersAPI.getMyOrders();
            if (Array.isArray(res.data)) {
              const pDigits = cleanP.replace(/\D/g, '');
              remoteOrders = res.data.filter(o => {
                const oDigits = String(o.playerID || o.playerId || '').replace(/\D/g, '');
                return oDigits === pDigits || String(o.playerID || o.playerId).trim() === cleanP;
              });
            }
          } catch (err2) {}
        }
      }

      // 3. Merge remote + local so nothing is ever lost
      const merged = mergeOrders(remoteOrders, initialOrders.length > 0 ? initialOrders : allDeviceOrders);

      // 4. Save any remote orders that weren't in local storage
      remoteOrders.forEach(o => saveLocalOrder(o));

      // 5. Update state with merged list
      setOrders(merged.length > 0 ? merged : initialOrders);
    } catch (err) {
      // On complete failure, still show what we have locally
      if (initialOrders.length === 0) {
        setOrdersError(language === 'km' ? 'មិនអាចទាញយកទិន្នន័យបញ្ជាទិញបានទេ' : 'Failed to load order history');
      }
    } finally {
      setLoadingOrders(false);
    }
  }, [language]);

  // Listen for real-time order updates (e.g. from TopUp.js after payment)
  useEffect(() => {
    const handleOrderUpdate = () => {
      const activePId = effectivePlayer?.playerId;
      const fresh = activePId ? getLocalOrders(activePId) : getLocalOrders();
      if (fresh.length > 0) {
        setOrders(prev => mergeOrders([], [...fresh, ...prev]));
      }
    };
    window.addEventListener('orders-updated', handleOrderUpdate);
    return () => window.removeEventListener('orders-updated', handleOrderUpdate);
  }, [effectivePlayer]);

  // Load orders if effectivePlayer is already active or if device has local orders
  useEffect(() => {
    if (effectivePlayer?.playerId) {
      loadOrdersForPlayer(effectivePlayer.playerId, effectivePlayer.serverId);
    } else {
      const deviceOrders = getLocalOrders();
      if (deviceOrders.length > 0) {
        setOrders(deviceOrders);
      }
    }
  }, [effectivePlayer, loadOrdersForPlayer]);

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

      const storedUser = {
        ...(authResult?.user || {}),
        userId: authResult?.userId || authResult?.user?.userId,
        name: realName || authResult?.name || authResult?.user?.name,
        email: authResult?.email || authResult?.user?.email,
        playerId: pId,
        serverId: sId,
        role: authResult?.role || authResult?.user?.role || 'User'
      };

      const newPlayerAccount = {
        playerId: pId,
        serverId: sId,
        realName: realName
      };

      // Atomically update global auth state (Navbar, Sidebar, OrderHistory sync simultaneously)
      loginPlayer(newPlayerAccount, authResult?.token, storedUser);
      setEffectivePlayer(newPlayerAccount);

      // Step 3: Fetch orders immediately
      await loadOrdersForPlayer(pId, sId);

    } catch (err) {
      setFormError(language === 'km' ? 'មានបញ្ហាក្នុងការភ្ជាប់គណនី សូមព្យាយាមម្តងទៀត' : 'Failed to connect player account. Please try again.');
    } finally {
      setSubmitting(false);
    }
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

  // Reusable Order Card Renderer
  const renderOrderCard = (order) => {
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
        key={order.orderId || `${order.createdAt}_${order.playerId}`}
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
                <span>{order.createdAt ? formatDateTime(order.createdAt, { seconds: true }) : 'Recent'}</span>
                <span className="text-slate-600">•</span>
                <span className="text-sky-300 font-semibold">{order.gameName || 'Mobile Legends'}</span>
                {order.playerId && (
                  <>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-400">ID: {order.playerId}</span>
                  </>
                )}
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
  };

  return (
    <div className="min-h-screen bg-[#070b16] text-white pt-4 pb-24 px-3 sm:px-6 lg:px-8 font-khmer select-none">
      {/* Background ambient lighting */}
      <div className="fixed top-10 left-1/4 w-96 h-96 bg-cyan-500/[0.06] rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-20 right-1/4 w-96 h-96 bg-amber-500/[0.05] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* ======================================================== */}
        {/* VIEW 1: FULL PORTAL INTERFACE - PLAYER ORDER HISTORY     */}
        {/* ======================================================== */}
        {!effectivePlayer ? (
          <div className="py-6 sm:py-10 max-w-2xl mx-auto w-full animate-fadeIn">
            {/* Main Access Form Portal */}
            <div className="relative rounded-3xl p-5 sm:p-8 bg-gradient-to-b from-[#0c152e] via-[#091024] to-[#060b18] border border-sky-500/35 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(14,165,233,0.15)] overflow-hidden">
                
                {/* Card top banner badge & Quick Paste Button */}
                <div className="flex items-center justify-between gap-3 mb-5 border-b border-slate-800/80 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-400 via-sky-500 to-blue-600 p-0.5 shadow-[0_0_16px_rgba(34,211,238,0.5)] flex items-center justify-center">
                      <div className="w-full h-full bg-[#070e22] rounded-[14px] flex items-center justify-center text-lg">
                        💳
                      </div>
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-white leading-tight">
                        {language === 'km' ? 'ចូលមើលគណនីអ្នកលេង' : 'Player Account Access'}
                      </h2>
                      <span className="text-[10px] text-slate-400">
                        {language === 'km' ? 'ផ្ទៀងផ្ទាត់ដោយស្វ័យប្រវត្តិតាមរយៈ Player ID' : 'Instant lookup via Player & Server ID'}
                      </span>
                    </div>
                  </div>

                  {/* Quick Paste Combined Button */}
                  <button
                    type="button"
                    onClick={handleQuickPaste}
                    className="px-3 py-1.5 rounded-xl bg-sky-950/70 hover:bg-sky-900/80 border border-sky-500/40 text-sky-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer active:scale-95 shrink-0"
                    title="Paste combined ID like 1225368571 (11446)"
                  >
                    <span>📋</span>
                    <span className="hidden sm:inline">{language === 'km' ? 'បិទភ្ជាប់ស្វ័យប្រវត្តិ' : 'Quick Paste'}</span>
                  </button>
                </div>

                {/* Form Error Banner */}
                {formError && (
                  <div className="mb-4 p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 animate-shake">
                    <span>⚠️</span>
                    <span>{formError}</span>
                  </div>
                )}

                <form onSubmit={handlePlayerLogin} className="space-y-4">
                  {/* Two-Column Grid for Player ID & Server ID */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    
                    {/* Player ID Field */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
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
                          className="w-full pl-3.5 pr-24 py-3 rounded-xl bg-[#070c1b] border border-slate-700/80 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white font-mono text-sm placeholder-slate-600 transition-all outline-none"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                          {formData.playerId && (
                            <button
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({ ...prev, playerId: '' }));
                                setVerifiedName('');
                              }}
                              className="w-5 h-5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
                              title="Clear"
                            >
                              ×
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={handlePastePlayerId}
                            className="h-7 px-2.5 rounded-lg bg-sky-500/15 hover:bg-sky-500/30 border border-sky-400/30 hover:border-sky-400/60 text-sky-300 hover:text-white text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-sm"
                            title={language === 'km' ? 'បិទភ្ជាប់ (Paste Player ID)' : 'Paste Player ID'}
                          >
                            {pastedPlayerId ? (
                              <>
                                <svg className="w-3.5 h-3.5 text-emerald-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M20 6L9 17l-5-5" />
                                </svg>
                                <span className="text-emerald-400 font-extrabold text-[10px]">{language === 'km' ? 'បានបិទ' : 'Pasted'}</span>
                              </>
                            ) : (
                              <>
                                <svg className="w-3.5 h-3.5 text-sky-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                                </svg>
                                <span className="font-extrabold text-[10.5px]">{language === 'km' ? 'បិទភ្ជាប់' : 'Paste'}</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Server ID Field */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                        {language === 'km' ? '2. លេខតំបន់ (Server / Zone ID)' : '2. Server / Zone ID'}
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
                          className="w-full pl-3.5 pr-24 py-3 rounded-xl bg-[#070c1b] border border-slate-700/80 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white font-mono text-sm placeholder-slate-600 transition-all outline-none"
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                          {formData.serverId && (
                            <button
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({ ...prev, serverId: '' }));
                                setVerifiedName('');
                              }}
                              className="w-5 h-5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
                              title="Clear"
                            >
                              ×
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={handlePasteServerId}
                            className="h-7 px-2.5 rounded-lg bg-sky-500/15 hover:bg-sky-500/30 border border-sky-400/30 hover:border-sky-400/60 text-sky-300 hover:text-white text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-sm"
                            title={language === 'km' ? 'បិទភ្ជាប់ (Paste Server ID)' : 'Paste Server ID'}
                          >
                            {pastedServerId ? (
                              <>
                                <svg className="w-3.5 h-3.5 text-emerald-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M20 6L9 17l-5-5" />
                                </svg>
                                <span className="text-emerald-400 font-extrabold text-[10px]">{language === 'km' ? 'បានបិទ' : 'Pasted'}</span>
                              </>
                            ) : (
                              <>
                                <svg className="w-3.5 h-3.5 text-sky-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                                </svg>
                                <span className="font-extrabold text-[10.5px]">{language === 'km' ? 'បិទភ្ជាប់' : 'Paste'}</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
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
                      <span>{checkingName ? '⏳ កំពុងពិនិត្យឈ្មោះ Moonton...' : '🔍 ពិនិត្យឈ្មោះអ្នកលេង (Check Real-Name)'}</span>
                    </button>

                    {verifiedName && (
                      <span className="text-[11px] font-black text-emerald-400 flex items-center gap-1 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                        <span>✓</span>
                        <span className="truncate max-w-[150px]">{verifiedName}</span>
                      </span>
                    )}
                  </div>

                  {/* Verified Account Preview Card */}
                  {verifiedName && (
                    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/30 to-cyan-950/30 border border-emerald-500/40 flex items-center justify-between animate-fadeIn shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-400/20 text-emerald-400 flex items-center justify-center font-black text-sm border border-emerald-500/30">
                          👑
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            {language === 'km' ? 'ឈ្មោះអ្នកលេង (Verified Name)' : 'Verified Player IGN'}
                          </div>
                          <div className="text-xs sm:text-sm font-black text-emerald-300">
                            {verifiedName}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-500/30">
                        Zone: {formData.serverId || 'Global'}
                      </span>
                    </div>
                  )}

                  {/* Submit Action Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full mt-3 py-4 px-4 rounded-2xl font-black text-sm text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 active:scale-[0.98] transition-all shadow-[0_0_25px_rgba(34,211,238,0.4)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                        <span>{language === 'km' ? 'កំពុងភ្ជាប់គណនី...' : 'Connecting Account...'}</span>
                      </>
                    ) : (
                      <>
                        <span className="text-base">🚀</span>
                        <span>{language === 'km' ? 'ចូលមើលប្រវត្តិបញ្ជាទិញទាំងអស់' : 'Access & View History'}</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Policy note */}
                <div className="mt-5 pt-4 border-t border-slate-800/80 text-center">
                  <span className="text-[10.5px] text-slate-400">
                    {language === 'km'
                      ? 'គណនីត្រូវបានបង្កើតដោយស្វ័យប្រវត្តិតាមឈ្មោះ Player (Username) និង Server ID (Password)'
                      : 'Your account is automatically created with your Player Name (Username) and Server ID (Password).'}
                  </span>
                </div>
              </div>

              {/* If there are any device orders found locally before player login, show them immediately below the form! */}
              {orders.length > 0 && (
                <div className="mt-8 space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base">📱</span>
                      <h3 className="text-sm font-black text-slate-200">
                        {language === 'km' ? 'ការបញ្ជាទិញថ្មីៗនៅលើឧបករណ៍នេះ' : 'Recent Purchases on this Device'}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                        {orders.length}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {language === 'km' ? 'រកឃើញដោយស្វ័យប្រវត្តិ' : 'Auto-detected'}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {orders.slice(0, 10).map((order) => renderOrderCard(order))}
                  </div>
                </div>
              )}
          </div>
        ) : (
          /* ======================================================== */
          /* VIEW 2: ACTIVE PLAYER ORDER HISTORY DASHBOARD            */
          /* ======================================================== */
          <div className="space-y-4 sm:space-y-6">

            {/* Active Player Info Header Banner */}
            <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#0d1733] via-[#0a1126] to-[#070b18] border border-sky-500/30 shadow-[0_10px_30px_rgba(0,0,0,0.6),0_0_20px_rgba(14,165,233,0.1)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn">
              <div className="flex items-center gap-3.5 min-w-0">
                <GamerAvatar
                  avatarId={effectivePlayer?.avatar || user?.avatar}
                  name={effectivePlayer?.realName || user?.name || effectivePlayer?.playerId}
                  size="md"
                  showGlow={true}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-black text-white truncate">
                      {effectivePlayer?.realName || user?.name || 'Player'}
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Active
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-xs font-mono text-slate-300">
                    <span className="text-cyan-300 font-bold">ID: {effectivePlayer?.playerId}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-400">Zone: {effectivePlayer?.serverId || 'Global'}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Sync / Refresh, Top Up & Switch */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => loadOrdersForPlayer(effectivePlayer?.playerId, effectivePlayer?.serverId)}
                  disabled={loadingOrders}
                  className="px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-sky-400/50 text-slate-200 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-sm disabled:opacity-50"
                  title="Reload and sync orders"
                >
                  <span className={loadingOrders ? 'animate-spin' : ''}>🔄</span>
                  <span>{language === 'km' ? 'ផ្ទុកទិន្នន័យឡើងវិញ' : 'Sync Orders'}</span>
                </button>

                <Link
                  to="/topup"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00E599] to-[#00F5B8] text-slate-950 font-black text-xs shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <span>💎</span>
                  <span>{language === 'km' ? 'ទិញពេជ្របន្ថែម' : 'Top Up Now'}</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setEffectivePlayer(null);
                  }}
                  className="px-3 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-rose-300 hover:text-rose-100 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                  title="Switch to another player ID"
                >
                  <span>🚪</span>
                  <span>{language === 'km' ? 'ប្តូរ ID' : 'Switch ID'}</span>
                </button>
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
                    onClick={() => loadOrdersForPlayer(effectivePlayer?.playerId, effectivePlayer?.serverId)}
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
                    ? `មិនទាន់មានប្រវត្តិទិញពេជ្រសម្រាប់ Player ID ${effectivePlayer?.playerId || ''} នៅឡើយទេ។ ចាប់ផ្តើមការបញ្ជាទិញដំបូងរបស់អ្នកឥឡូវនេះ!`
                    : `No top-up history found for Player ID ${effectivePlayer?.playerId || ''}. Start your first order now!`}
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
                {filteredOrders.map((order) => renderOrderCard(order))}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};

export default OrderHistory;
