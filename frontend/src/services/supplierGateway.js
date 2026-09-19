// Supplier Gateway Service with Persistent Active Provider Pinning & Cloud Sync
// Guarantees that once an admin switches the active provider (e.g. KhmerTopUp or FazerCards),
// it stays pinned and stands all the way across browser closes, page refreshes, and server restarts.

export const DEFAULT_PROVIDER_SETTINGS = {
  activeProvider: 'FazerCards',
  environment: 'Production',
  autoDispatchOnPayment: true,
  autoFailoverEnabled: true,
  merchantId: 'peakmao007',
  apiKey: 'fc_5f79a0016d5d87bd1e83ea4f',
  fazerCardsApiKey: 'fc_5f79a0016d5d87bd1e83ea4f',
  khmerTopUpApiKey: 'kt_6d38a3a5940e970221cc62fa306ae96044736364',
  webhookUrl: 'https://mlbb-backend-api.onrender.com/api/supplier/webhook',
  balanceUSD: 18.50,
  fazerCardsBalanceUSD: 18.50,
  khmerTopUpBalanceUSD: 1.25,
  status: 'Connected & Active',
  updatedAt: new Date().toISOString()
};

const STORAGE_SETTINGS_KEY = 'admin_provider_settings';
const STORAGE_ACTIVE_KEY = 'admin_active_provider_pinned';
const EVENT_NAME = 'providerSettingsUpdated';

const getApiUrls = () => {
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return [
      'http://localhost:5000/api/admin',
      'http://localhost:5000/api',
      'http://localhost:5001/api',
      'https://mlbb-backend-api.onrender.com/api/admin',
      'https://mlbb-backend-api.onrender.com/api',
      'https://mlbb-khqr-api.onrender.com/api'
    ];
  }
  return [
    'https://mlbb-backend-api.onrender.com/api/admin',
    'https://mlbb-backend-api.onrender.com/api',
    'https://mlbb-khqr-api.onrender.com/api',
    'http://localhost:5001/api'
  ];
};

/**
 * Get current provider settings synchronously from local storage.
 * The pinned active provider is ALWAYS prioritized so refreshing or closing the page never resets it.
 */
export const getStoredProviderSettings = () => {
  try {
    const pinnedActive = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_ACTIVE_KEY) : null;
    const saved = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_SETTINGS_KEY) : null;
    let parsed = null;

    if (saved) {
      try {
        parsed = JSON.parse(saved);
      } catch (e) {}
    }

    const merged = { ...DEFAULT_PROVIDER_SETTINGS, ...(parsed || {}) };

    // If an active provider was pinned by admin, strictly preserve it
    if (pinnedActive) {
      merged.activeProvider = String(pinnedActive).toLowerCase().includes('khmer') ? 'KhmerTopUp' : 'FazerCards';
    } else if (merged.activeProvider) {
      merged.activeProvider = String(merged.activeProvider).toLowerCase().includes('khmer') ? 'KhmerTopUp' : 'FazerCards';
    }

    const isKhmer = merged.activeProvider === 'KhmerTopUp';
    merged.apiKey = isKhmer ? (merged.khmerTopUpApiKey || DEFAULT_PROVIDER_SETTINGS.khmerTopUpApiKey) : (merged.fazerCardsApiKey || DEFAULT_PROVIDER_SETTINGS.fazerCardsApiKey);
    merged.balanceUSD = isKhmer ? (merged.khmerTopUpBalanceUSD ?? 1.25) : (merged.fazerCardsBalanceUSD ?? 18.50);

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
  const normalized = String(targetProvider).toLowerCase().includes('khmer') ? 'KhmerTopUp' : 'FazerCards';
  const current = getStoredProviderSettings();

  const isKhmer = normalized === 'KhmerTopUp';
  const targetKey = isKhmer
    ? (current.khmerTopUpApiKey || DEFAULT_PROVIDER_SETTINGS.khmerTopUpApiKey)
    : (current.fazerCardsApiKey || DEFAULT_PROVIDER_SETTINGS.fazerCardsApiKey);
  const targetBal = isKhmer
    ? (current.khmerTopUpBalanceUSD ?? 1.25)
    : (current.fazerCardsBalanceUSD ?? 18.50);

  const updated = {
    ...current,
    activeProvider: normalized,
    ActiveProvider: normalized,
    apiKey: targetKey,
    balanceUSD: targetBal,
    updatedAt: new Date().toISOString()
  };

  // 1. Immediately pin locally so refresh or close never reverts
  try {
    localStorage.setItem(STORAGE_ACTIVE_KEY, normalized);
    localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(updated));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(EVENT_NAME));
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
      body: JSON.stringify({ provider: normalized })
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
  const activeNormalized = settings.activeProvider
    ? (String(settings.activeProvider).toLowerCase().includes('khmer') ? 'KhmerTopUp' : 'FazerCards')
    : current.activeProvider;

  const merged = {
    ...current,
    ...settings,
    activeProvider: activeNormalized,
    ActiveProvider: activeNormalized,
    updatedAt: new Date().toISOString()
  };

  try {
    localStorage.setItem(STORAGE_ACTIVE_KEY, activeNormalized);
    localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(merged));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(EVENT_NAME));
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
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(`${cleanBase}/provider-settings?_t=${Date.now()}`, {
        cache: 'no-store',
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const settings = data?.settings || data;
        if (settings && (settings.activeProvider || settings.ActiveProvider || settings.fazerCardsBalanceUSD !== undefined || settings.balanceUSD !== undefined)) {
          const rawRemoteActive = settings.activeProvider || settings.ActiveProvider;
          const remoteActive = rawRemoteActive
            ? (String(rawRemoteActive).toLowerCase().includes('khmer') ? 'KhmerTopUp' : 'FazerCards')
            : null;

          // Pinned active provider takes precedence so refresh or close never reverts user's choice
          const finalActive = pinnedActive
            ? (String(pinnedActive).toLowerCase().includes('khmer') ? 'KhmerTopUp' : 'FazerCards')
            : (remoteActive || local.activeProvider);

          const fzrBal = settings.fazerCardsBalanceUSD ?? settings.FazerCardsBalanceUSD ?? local.fazerCardsBalanceUSD;
          const ktBal = settings.khmerTopUpBalanceUSD ?? settings.KhmerTopUpBalanceUSD ?? local.khmerTopUpBalanceUSD;
          const isKhmer = finalActive === 'KhmerTopUp';

          const merged = {
            ...local,
            ...settings,
            activeProvider: finalActive,
            ActiveProvider: finalActive,
            fazerCardsBalanceUSD: fzrBal,
            khmerTopUpBalanceUSD: ktBal,
            balanceUSD: isKhmer ? ktBal : fzrBal,
            apiKey: isKhmer
              ? (settings.khmerTopUpApiKey || settings.KhmerTopUpApiKey || local.khmerTopUpApiKey)
              : (settings.fazerCardsApiKey || settings.FazerCardsApiKey || local.fazerCardsApiKey)
          };

          try {
            if (pinnedActive) localStorage.setItem(STORAGE_ACTIVE_KEY, finalActive);
            localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(merged));
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new Event(EVENT_NAME));
            }
          } catch (e) {}

          return merged;
        }
      }
    } catch (_) {}
  }

  return local;
};
