// Supplier Gateway Service with Dynamic Multi-Provider Management & Cloud Sync
// Enables Admins to effortlessly add, switch, edit, and configure custom upstream providers
// (e.g. FazerCards, Khmer TopUp, Smile One, LapakGaming, UniPin, Moonton Partner, or Custom REST APIs)

export const DEFAULT_PROVIDERS = [
  {
    id: 'FazerCards',
    name: 'FazerCards Reseller',
    subtitle: 'Global Wholesale Catalog (api.fzr.cards)',
    icon: '🎮',
    badge: 'WHOLESALE',
    badgeColor: 'purple',
    apiUrl: 'https://api.fzr.cards/api/v2',
    apiKey: 'fc_5f79a0016d5d87bd1e83ea4f',
    balanceUSD: 0.01,
    docsUrl: 'https://reseller.fazercards.com/en/catalog/mobile-legends',
    refillUrl: 'https://reseller.fazercards.com/panel/balance',
    isDefault: true,
    category: 'Reseller API'
  },
  {
    id: 'KhmerTopUp',
    name: 'Khmer TopUp',
    subtitle: 'Direct Cambodia MLBB (khmer-topup.com)',
    icon: '🇰🇭',
    badge: 'DIRECT KH',
    badgeColor: 'cyan',
    apiUrl: 'https://khmer-topup.com/api/v1/orders',
    apiKey: 'kt_28c2640c86717199395d973670cf039a30ba2716',
    balanceUSD: 3.00,
    docsUrl: 'https://khmer-topup.com/tl/api-docs',
    refillUrl: 'https://khmer-topup.com/wallet',
    isDefault: true,
    category: 'Direct Provider'
  }
];

export const PROVIDER_PRESETS = [
  {
    id: 'smile_one',
    name: 'Smile One',
    subtitle: 'Official Moonton Global Partner (smile.one)',
    icon: '🌐',
    badge: 'GLOBAL API',
    badgeColor: 'emerald',
    apiUrl: 'https://www.smile.one/smilecoin/api/createorder',
    docsUrl: 'https://www.smile.one/developer',
    refillUrl: 'https://www.smile.one/customer/order',
    keyPlaceholder: 'so_sec_...',
    category: 'Global Aggregator'
  },
  {
    id: 'lapakgaming',
    name: 'LapakGaming',
    subtitle: 'Southeast Asia VIP Top-Up API (lapakgaming.com)',
    icon: '⚡',
    badge: 'FAST VIP',
    badgeColor: 'amber',
    apiUrl: 'https://api.lapakgaming.com/v1/orders',
    docsUrl: 'https://developer.lapakgaming.com',
    refillUrl: 'https://www.lapakgaming.com/id-id/deposit',
    keyPlaceholder: 'lg_api_...',
    category: 'Regional Gateway'
  },
  {
    id: 'unipin',
    name: 'UniPin Direct',
    subtitle: 'UniPin Global Digital Voucher & Direct Reload',
    icon: '💎',
    badge: 'UNIPIN',
    badgeColor: 'blue',
    apiUrl: 'https://api.unipin.com/v1/reload',
    docsUrl: 'https://developer.unipin.com',
    refillUrl: 'https://www.unipin.com/wallet',
    keyPlaceholder: 'uni_live_...',
    category: 'Direct Provider'
  },
  {
    id: 'moonton_partner',
    name: 'Moonton Direct Partner',
    subtitle: 'Direct Moonton Gateway / Server API Handshake',
    icon: '🚀',
    badge: 'DIRECT MOONTON',
    badgeColor: 'gold',
    apiUrl: 'https://api.mobilelegends.com/gateway/v1/topup',
    docsUrl: 'https://partner.mobilelegends.com/docs',
    refillUrl: 'https://partner.mobilelegends.com/billing',
    keyPlaceholder: 'mt_partner_...',
    category: 'Direct Developer'
  },
  {
    id: 'custom_rest',
    name: 'Custom REST Gateway',
    subtitle: 'Generic JSON REST API / Webhook Integration',
    icon: '🛠️',
    badge: 'CUSTOM REST',
    badgeColor: 'slate',
    apiUrl: 'https://api.yourprovider.com/v1/recharge',
    docsUrl: 'https://yourprovider.com/docs',
    refillUrl: 'https://yourprovider.com/wallet',
    keyPlaceholder: 'api_key_or_bearer_token...',
    category: 'Custom Gateway'
  }
];

export const DEFAULT_PROVIDER_SETTINGS = {
  activeProvider: 'KhmerTopUp',
  environment: 'Production',
  autoDispatchOnPayment: true,
  autoFailoverEnabled: true,
  merchantId: 'peakmao007',
  apiKey: 'kt_28c2640c86717199395d973670cf039a30ba2716',
  fazerCardsApiKey: 'fc_5f79a0016d5d87bd1e83ea4f',
  fazerCardsTokens: [
    {
      id: 'default_fzr_token',
      name: 'Primary Token (Default)',
      token: 'fc_5f79a0016d5d87bd1e83ea4f',
      isActive: false,
      balanceUSD: 0.01,
      createdAt: '2026-01-01T00:00:00.000Z'
    }
  ],
  khmerTopUpApiKey: 'kt_28c2640c86717199395d973670cf039a30ba2716',
  providers: DEFAULT_PROVIDERS,
  webhookUrl: 'https://mlbb-backend-api.onrender.com/api/supplier/webhook',
  balanceUSD: 3.00,
  fazerCardsBalanceUSD: 0.01,
  khmerTopUpBalanceUSD: 3.00,
  status: 'Connected & Active',
  updatedAt: new Date().toISOString()
};

const STORAGE_SETTINGS_KEY = 'admin_provider_settings_v2';
const LEGACY_STORAGE_SETTINGS_KEY = 'admin_provider_settings';
const STORAGE_ACTIVE_KEY = 'admin_active_provider_pinned';
const EVENT_NAME = 'providerSettingsUpdated';

const getApiUrls = () => {
  const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const base = process.env.REACT_APP_API_URL || (isLocal ? 'http://localhost:5000/api' : 'https://mlbb-backend-api.onrender.com/api');
  const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;

  return [
    `${cleanBase}/admin`,
    cleanBase
  ];
};

/**
 * Get current provider settings synchronously from local storage.
 * The pinned active provider is ALWAYS prioritized so refreshing or closing the page never resets it.
 */
export const getStoredProviderSettings = () => {
  try {
    const pinnedActive = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_ACTIVE_KEY) : null;
    let saved = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_SETTINGS_KEY) : null;
    if (!saved && typeof localStorage !== 'undefined') {
      saved = localStorage.getItem(LEGACY_STORAGE_SETTINGS_KEY);
    }

    let parsed = null;
    if (saved) {
      try {
        parsed = JSON.parse(saved);
      } catch (e) {}
    }

    const merged = { ...DEFAULT_PROVIDER_SETTINGS, ...(parsed || {}) };

    // Ensure providers list exists and includes default providers
    let provList = Array.isArray(merged.providers) && merged.providers.length > 0
      ? [...merged.providers]
      : [...DEFAULT_PROVIDERS];

    // Ensure FazerCards and KhmerTopUp exist in provList
    if (!provList.some(p => p.id === 'FazerCards')) {
      provList.unshift(DEFAULT_PROVIDERS[0]);
    }
    if (!provList.some(p => p.id === 'KhmerTopUp')) {
      provList.splice(1, 0, DEFAULT_PROVIDERS[1]);
    }

    // Sanitize stale legacy defaults if present
    if (merged.khmerTopUpBalanceUSD === 1.25 || merged.khmerTopUpBalanceUSD === 1.45 || merged.khmerTopUpBalanceUSD === 0.49) {
      merged.khmerTopUpBalanceUSD = 3.00;
    }
    if (merged.khmerTopUpApiKey === 'kt_6d38a3a5940e970221cc62fa306ae96044736364') {
      merged.khmerTopUpApiKey = 'kt_28c2640c86717199395d973670cf039a30ba2716';
    }
    if (merged.fazerCardsBalanceUSD === 18.50) {
      merged.fazerCardsBalanceUSD = 0.01;
    }

    // Keep FazerCards and KhmerTopUp balances synchronized with top-level fields
    provList = provList.map(p => {
      if (p.id === 'FazerCards') {
        const bal = merged.fazerCardsBalanceUSD !== undefined ? Number(merged.fazerCardsBalanceUSD) : 0.01;
        return {
          ...p,
          apiKey: merged.fazerCardsApiKey || p.apiKey,
          balanceUSD: bal === 18.50 ? 0.01 : bal
        };
      }
      if (p.id === 'KhmerTopUp') {
        const bal = merged.khmerTopUpBalanceUSD !== undefined ? Number(merged.khmerTopUpBalanceUSD) : 3.00;
        const curKey = (merged.khmerTopUpApiKey && merged.khmerTopUpApiKey !== 'kt_6d38a3a5940e970221cc62fa306ae96044736364')
          ? merged.khmerTopUpApiKey
          : ((p.apiKey && p.apiKey !== 'kt_6d38a3a5940e970221cc62fa306ae96044736364') ? p.apiKey : 'kt_28c2640c86717199395d973670cf039a30ba2716');
        return {
          ...p,
          apiKey: curKey,
          balanceUSD: (bal === 1.25 || bal === 1.45 || bal === 0.49) ? 3.00 : bal
        };
      }
      return p;
    });

    merged.providers = provList;

    // Resolve active provider
    if (pinnedActive) {
      const match = provList.find(p => p.id === pinnedActive || p.name?.toLowerCase() === String(pinnedActive).toLowerCase());
      if (match) {
        merged.activeProvider = match.id;
      } else {
        merged.activeProvider = String(pinnedActive).toLowerCase().includes('khmer') ? 'KhmerTopUp' : 'FazerCards';
      }
    }

    // Active provider object
    const activeObj = provList.find(p => p.id === merged.activeProvider) || provList[0];
    merged.apiKey = activeObj.apiKey || merged.apiKey;
    merged.balanceUSD = activeObj.balanceUSD !== undefined ? Number(activeObj.balanceUSD) : Number(merged.balanceUSD ?? 0.49);

    // Ensure fazerCardsTokens keyring exists and contains at least default token
    if (!merged.fazerCardsTokens || !Array.isArray(merged.fazerCardsTokens) || merged.fazerCardsTokens.length === 0) {
      const currentFzr = merged.fazerCardsApiKey || DEFAULT_PROVIDER_SETTINGS.fazerCardsApiKey;
      merged.fazerCardsTokens = [
        {
          id: 'default_fzr_token',
          name: 'Primary Token (Default)',
          token: currentFzr,
          isActive: true,
          balanceUSD: merged.fazerCardsBalanceUSD ?? 18.50,
          createdAt: new Date().toISOString()
        }
      ];
    } else {
      // Ensure the active key matches an active token in the list
      const activeTok = merged.fazerCardsTokens.find(t => t.isActive);
      if (activeTok && !merged.fazerCardsApiKey) {
        merged.fazerCardsApiKey = activeTok.token;
      } else if (merged.fazerCardsApiKey && !merged.fazerCardsTokens.some(t => t.token === merged.fazerCardsApiKey)) {
        merged.fazerCardsTokens.forEach(t => { t.isActive = false; });
        merged.fazerCardsTokens.push({
          id: 'token_' + Date.now().toString(36),
          name: `Token #${merged.fazerCardsTokens.length + 1}`,
          token: merged.fazerCardsApiKey,
          isActive: true,
          balanceUSD: merged.fazerCardsBalanceUSD ?? 18.50,
          createdAt: new Date().toISOString()
        });
      }
    }

    return merged;
  } catch (err) {
    console.warn('Error reading provider settings from storage:', err);
    return DEFAULT_PROVIDER_SETTINGS;
  }
};

/**
 * Pin and switch the active supplier provider.
 * Writes immediately to localStorage, fires sync events, and broadcasts to cloud APIs.
 */
export const switchActiveProvider = async (targetProvider) => {
  const current = getStoredProviderSettings();
  const provList = current.providers || DEFAULT_PROVIDERS;

  const found = provList.find(p =>
    p.id === targetProvider ||
    p.name?.toLowerCase() === String(targetProvider).toLowerCase()
  ) || (String(targetProvider).toLowerCase().includes('khmer') ? provList.find(p => p.id === 'KhmerTopUp') : provList[0]);

  const activeId = found ? found.id : 'FazerCards';
  const targetKey = found?.apiKey || current.apiKey;
  const targetBal = found?.balanceUSD !== undefined ? found.balanceUSD : current.balanceUSD;

  const updated = {
    ...current,
    activeProvider: activeId,
    ActiveProvider: activeId,
    apiKey: targetKey,
    balanceUSD: targetBal,
    updatedAt: new Date().toISOString()
  };

  // 1. Immediately pin locally so refresh or close never reverts
  try {
    localStorage.setItem(STORAGE_ACTIVE_KEY, activeId);
    localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(updated));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(EVENT_NAME));
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: updated }));
      window.dispatchEvent(new Event('storage'));
    }
  } catch (e) {
    console.warn('Error persisting switched provider to localStorage:', e);
  }

  // 2. Broadcast in parallel to all backend candidate endpoints
  const endpoints = getApiUrls();
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  for (const base of endpoints) {
    const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;

    fetch(`${cleanBase}/provider/switch`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ provider: activeId })
    }).catch(() => {});

    fetch(`${cleanBase}/provider-settings`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ settings: updated, ...updated })
    }).catch(() => {});
  }

  return updated;
};

/**
 * Save full supplier settings model and persist locally and in cloud.
 */
export const saveStoredProviderSettings = async (settings) => {
  if (!settings) return;
  const current = getStoredProviderSettings();
  const activeNormalized = settings.activeProvider || current.activeProvider || 'KhmerTopUp';

  let ktKey = settings.khmerTopUpApiKey || current.khmerTopUpApiKey || 'kt_28c2640c86717199395d973670cf039a30ba2716';
  if (activeNormalized === 'KhmerTopUp' && settings.apiKey) {
    ktKey = settings.apiKey.trim();
  } else if (settings.apiKey && settings.apiKey.startsWith('kt_')) {
    ktKey = settings.apiKey.trim();
  }

  const merged = {
    ...current,
    ...settings,
    activeProvider: activeNormalized,
    ActiveProvider: activeNormalized,
    khmerTopUpApiKey: ktKey,
    apiKey: activeNormalized === 'KhmerTopUp' ? ktKey : (settings.apiKey || current.apiKey),
    updatedAt: new Date().toISOString()
  };

  // Keep FazerCards and KhmerTopUp in providers list strictly aligned with top-level balances and credentials
  if (Array.isArray(merged.providers)) {
    merged.providers = merged.providers.map(p => {
      if (p.id === 'FazerCards') {
        const fc = merged.fazerCardsBalanceUSD !== undefined ? Number(merged.fazerCardsBalanceUSD) : p.balanceUSD;
        return { ...p, balanceUSD: fc, apiKey: merged.fazerCardsApiKey || p.apiKey };
      }
      if (p.id === 'KhmerTopUp') {
        const kt = merged.khmerTopUpBalanceUSD !== undefined ? Number(merged.khmerTopUpBalanceUSD) : p.balanceUSD;
        return { ...p, balanceUSD: kt, apiKey: ktKey };
      }
      return p;
    });
  }

  try {
    localStorage.setItem(STORAGE_ACTIVE_KEY, activeNormalized);
    localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(merged));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(EVENT_NAME));
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: merged }));
      window.dispatchEvent(new Event('storage'));
    }
  } catch (e) {}

  const endpoints = getApiUrls();
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  for (const base of endpoints) {
    const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;

    fetch(`${cleanBase}/provider-settings`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ settings: merged, ...merged })
    }).catch(() => {});

    fetch(`${cleanBase}/provider/switch`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ provider: activeNormalized })
    }).catch(() => {});
  }

  return merged;
};

/**
 * Add a new custom provider gateway.
 */
export const addCustomProvider = async (providerData) => {
  if (!providerData || !providerData.name) {
    throw new Error('Provider name is required');
  }

  const current = getStoredProviderSettings();
  const provList = Array.isArray(current.providers) ? [...current.providers] : [...DEFAULT_PROVIDERS];

  const rawId = (providerData.id || providerData.name).toLowerCase().replace(/[^a-z0-9]/g, '_');
  const id = provList.some(p => p.id === rawId)
    ? `${rawId}_${Date.now().toString(36).slice(-4)}`
    : rawId;

  const newProvider = {
    id,
    name: providerData.name.trim(),
    subtitle: providerData.subtitle?.trim() || `${providerData.name} API Gateway`,
    icon: providerData.icon || '🌐',
    badge: providerData.badge || 'CUSTOM',
    badgeColor: providerData.badgeColor || 'emerald',
    apiUrl: providerData.apiUrl?.trim() || '',
    apiKey: providerData.apiKey?.trim() || '',
    merchantId: providerData.merchantId?.trim() || '',
    balanceUSD: parseFloat(providerData.balanceUSD || '0') || 0,
    docsUrl: providerData.docsUrl?.trim() || '',
    refillUrl: providerData.refillUrl?.trim() || '',
    category: providerData.category || 'Custom Gateway',
    isDefault: false,
    createdAt: new Date().toISOString()
  };

  provList.push(newProvider);
  const updated = {
    ...current,
    providers: provList,
    updatedAt: new Date().toISOString()
  };

  if (providerData.setActive) {
    updated.activeProvider = id;
    updated.ActiveProvider = id;
    updated.apiKey = newProvider.apiKey;
    updated.balanceUSD = newProvider.balanceUSD;
    try {
      localStorage.setItem(STORAGE_ACTIVE_KEY, id);
    } catch (e) {}
  }

  return await saveStoredProviderSettings(updated);
};

/**
 * Update an existing custom provider gateway.
 */
export const updateCustomProvider = async (id, providerData) => {
  const current = getStoredProviderSettings();
  const provList = (current.providers || DEFAULT_PROVIDERS).map(p => {
    if (p.id === id) {
      return {
        ...p,
        ...providerData,
        id: p.id,
        balanceUSD: providerData.balanceUSD !== undefined ? parseFloat(providerData.balanceUSD) : p.balanceUSD
      };
    }
    return p;
  });

  const updated = {
    ...current,
    providers: provList,
    updatedAt: new Date().toISOString()
  };

  if (current.activeProvider === id) {
    const activeP = provList.find(p => p.id === id);
    if (activeP) {
      updated.apiKey = activeP.apiKey || updated.apiKey;
      updated.balanceUSD = activeP.balanceUSD !== undefined ? activeP.balanceUSD : updated.balanceUSD;
    }
  }

  return await saveStoredProviderSettings(updated);
};

/**
 * Delete a custom provider gateway.
 */
export const deleteCustomProvider = async (id) => {
  const current = getStoredProviderSettings();
  let provList = (current.providers || DEFAULT_PROVIDERS).filter(p => p.id !== id);
  if (provList.length === 0) {
    provList = [...DEFAULT_PROVIDERS];
  }

  let nextActive = current.activeProvider;
  if (current.activeProvider === id) {
    nextActive = provList[0].id;
  }

  const nextActiveP = provList.find(p => p.id === nextActive) || provList[0];
  const updated = {
    ...current,
    providers: provList,
    activeProvider: nextActive,
    ActiveProvider: nextActive,
    apiKey: nextActiveP.apiKey || current.apiKey,
    balanceUSD: nextActiveP.balanceUSD !== undefined ? nextActiveP.balanceUSD : current.balanceUSD,
    updatedAt: new Date().toISOString()
  };

  try {
    localStorage.setItem(STORAGE_ACTIVE_KEY, nextActive);
  } catch (e) {}

  return await saveStoredProviderSettings(updated);
};

/**
 * Quick update of a provider's balance.
 */
export const updateProviderBalance = async (id, balanceUSD) => {
  const val = parseFloat(balanceUSD);
  if (isNaN(val) || val < 0) return getStoredProviderSettings();

  const current = getStoredProviderSettings();
  const provList = (current.providers || DEFAULT_PROVIDERS).map(p => {
    if (p.id === id || p.name?.toLowerCase() === String(id).toLowerCase()) {
      return { ...p, balanceUSD: val };
    }
    return p;
  });

  const updated = {
    ...current,
    providers: provList,
    updatedAt: new Date().toISOString()
  };

  if (id === 'FazerCards' || id?.toLowerCase()?.includes('fazer')) {
    updated.fazerCardsBalanceUSD = val;
  }
  if (id === 'KhmerTopUp' || id?.toLowerCase()?.includes('khmer')) {
    updated.khmerTopUpBalanceUSD = val;
  }
  if (current.activeProvider === id) {
    updated.balanceUSD = val;
  }

  return await saveStoredProviderSettings(updated);
};

/**
 * Fetch live provider settings and account balances from cloud / backend APIs.
 * Preserves the pinned active provider if set locally.
 */
export const fetchStoredProviderSettings = async () => {
  const local = getStoredProviderSettings();
  const pinnedActive = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_ACTIVE_KEY) : null;
  const endpoints = getApiUrls();

  for (const base of endpoints) {
    try {
      const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(`${cleanBase}/provider-settings?_t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const incoming = data?.settings || data;

        if (incoming && (incoming.activeProvider || incoming.ActiveProvider || incoming.providers)) {
          const cloudActive = incoming.activeProvider || incoming.ActiveProvider;
          const merged = {
            ...local,
            ...incoming,
            activeProvider: pinnedActive || cloudActive || local.activeProvider,
            ActiveProvider: pinnedActive || cloudActive || local.activeProvider,
          };

          // Merge providers from cloud and local
          let finalProviders = Array.isArray(merged.providers) && merged.providers.length > 0 ? [...merged.providers] : [...DEFAULT_PROVIDERS];
          if (Array.isArray(incoming.providers) && incoming.providers.length > 0) {
            const map = new Map();
            (local.providers || []).forEach(p => map.set(p.id, p));
            incoming.providers.forEach(p => map.set(p.id, { ...(map.get(p.id) || {}), ...p }));
            finalProviders = Array.from(map.values());
          }

          // Keep FazerCards and KhmerTopUp balances synchronized with incoming live balances
          finalProviders = finalProviders.map(p => {
            if (p.id === 'FazerCards') {
              const fc = incoming.fazerCardsBalanceUSD !== undefined ? Number(incoming.fazerCardsBalanceUSD) : (merged.fazerCardsBalanceUSD !== undefined ? Number(merged.fazerCardsBalanceUSD) : 0.01);
              return { ...p, balanceUSD: fc, apiKey: incoming.fazerCardsApiKey || merged.fazerCardsApiKey || p.apiKey };
            }
            if (p.id === 'KhmerTopUp') {
              const kt = incoming.khmerTopUpBalanceUSD !== undefined ? Number(incoming.khmerTopUpBalanceUSD) : (merged.khmerTopUpBalanceUSD !== undefined ? Number(merged.khmerTopUpBalanceUSD) : 3.00);
              const inKtKey = incoming.khmerTopUpApiKey;
              const safeKey = (inKtKey && inKtKey !== 'kt_6d38a3a5940e970221cc62fa306ae96044736364')
                ? inKtKey
                : (merged.khmerTopUpApiKey && merged.khmerTopUpApiKey !== 'kt_6d38a3a5940e970221cc62fa306ae96044736364' ? merged.khmerTopUpApiKey : (local.khmerTopUpApiKey || 'kt_28c2640c86717199395d973670cf039a30ba2716'));
              return { ...p, balanceUSD: kt, apiKey: safeKey };
            }
            return p;
          });
          merged.providers = finalProviders;

          if (merged.khmerTopUpApiKey === 'kt_6d38a3a5940e970221cc62fa306ae96044736364') {
            merged.khmerTopUpApiKey = local.khmerTopUpApiKey || 'kt_28c2640c86717199395d973670cf039a30ba2716';
          }

          if (incoming.khmerTopUpBalanceUSD !== undefined) merged.khmerTopUpBalanceUSD = Number(incoming.khmerTopUpBalanceUSD);
          if (incoming.fazerCardsBalanceUSD !== undefined) merged.fazerCardsBalanceUSD = Number(incoming.fazerCardsBalanceUSD);

          const activeItem = finalProviders.find(p => p.id === merged.activeProvider) || finalProviders[0];
          merged.balanceUSD = activeItem ? Number(activeItem.balanceUSD) : Number(merged.balanceUSD ?? 3.00);

          try {
            localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(merged));
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new Event(EVENT_NAME));
              window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: merged }));
            }
          } catch (e) {}

          return merged;
        }
      }
    } catch (_) {}
  }

  return local;
};

/**
 * Add a new FazerCards API key / token to the keyring while preserving all existing tokens.
 */
export const addStoredFazerCardsToken = async (token, name = '', setActive = true) => {
  if (!token) return getStoredProviderSettings();
  const clean = token.trim();
  const current = getStoredProviderSettings();
  const tokens = Array.isArray(current.fazerCardsTokens) ? [...current.fazerCardsTokens] : [];

  const existingIdx = tokens.findIndex(t => t.token === clean);
  const tokenLabel = name.trim() || `Token #${tokens.length + 1}`;

  if (existingIdx >= 0) {
    tokens[existingIdx].name = tokenLabel;
    if (setActive) {
      tokens.forEach((t, i) => { t.isActive = (i === existingIdx); });
    }
  } else {
    if (setActive) {
      tokens.forEach(t => { t.isActive = false; });
    }
    tokens.push({
      id: 'fzr_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6),
      name: tokenLabel,
      token: clean,
      isActive: setActive,
      balanceUSD: null,
      createdAt: new Date().toISOString()
    });
  }

  const updated = {
    ...current,
    fazerCardsTokens: tokens,
    ...(setActive ? {
      fazerCardsApiKey: clean,
      apiKey: current.activeProvider === 'FazerCards' ? clean : current.apiKey
    } : {})
  };

  return await saveStoredProviderSettings(updated);
};

/**
 * Switch active FazerCards token by ID or token string.
 */
export const switchStoredFazerCardsToken = async (idOrToken) => {
  if (!idOrToken) return getStoredProviderSettings();
  const current = getStoredProviderSettings();
  const tokens = Array.isArray(current.fazerCardsTokens) ? [...current.fazerCardsTokens] : [];

  const target = tokens.find(t => t.id === idOrToken || t.token === idOrToken);
  if (!target) return current;

  tokens.forEach(t => { t.isActive = (t.id === target.id); });

  const updated = {
    ...current,
    fazerCardsTokens: tokens,
    fazerCardsApiKey: target.token,
    apiKey: current.activeProvider === 'FazerCards' ? target.token : current.apiKey
  };

  return await saveStoredProviderSettings(updated);
};

/**
 * Delete a FazerCards token from the keyring.
 * Prevents deleting if it's the last remaining token.
 */
export const deleteStoredFazerCardsToken = async (id) => {
  if (!id) return getStoredProviderSettings();
  const current = getStoredProviderSettings();
  let tokens = Array.isArray(current.fazerCardsTokens) ? [...current.fazerCardsTokens] : [];
  if (tokens.length <= 1) return current;

  const target = tokens.find(t => t.id === id);
  if (!target) return current;

  const wasActive = target.isActive;
  tokens = tokens.filter(t => t.id !== id);

  if (wasActive && tokens.length > 0) {
    tokens[0].isActive = true;
  }

  const activeToken = tokens.find(t => t.isActive) || tokens[0];

  const updated = {
    ...current,
    fazerCardsTokens: tokens,
    fazerCardsApiKey: activeToken ? activeToken.token : current.fazerCardsApiKey,
    apiKey: current.activeProvider === 'FazerCards' ? (activeToken ? activeToken.token : current.apiKey) : current.apiKey
  };

  return await saveStoredProviderSettings(updated);
};
