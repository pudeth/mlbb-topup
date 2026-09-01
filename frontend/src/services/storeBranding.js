import { useState, useEffect } from 'react';

// Store Branding Service & State Manager
export const DEFAULT_BRANDING = {
  storeName: 'Tin-Topup',
  storeNameHighlight: 'PRO',
  tagline: 'Official Diamond Hub',
  logoType: 'image', // 'emoji' or 'image'
  logoEmoji: '💎',
  logoImage: '/profile.jpg', // Custom uploaded image URL or base64 data URI
  badgeText: 'PRO',
  adminBadgeText: 'ADMIN',
  versionText: 'Enterprise Hub v2.5',
  themeColor: 'amber', // 'amber', 'cyan', 'purple', 'emerald'
  facebookPage: 'https://www.facebook.com/share/1LaL3TxfWD/?mibextid=wwXIfr',
  facebookPageName: 'Official Facebook Page',
  telegramUrl: 'https://t.me/Peak_Deth',
  telegramUsername: '@Peak_Deth',
};

const STORAGE_KEY = 'mlbb_topup_store_branding_v1';
const EVENT_NAME = 'storeBrandingUpdated';

export const getStoreBranding = () => {
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      const merged = { ...DEFAULT_BRANDING, ...parsed };
      // If cached had legacy default values without image, use new defaults
      if (!merged.logoImage || merged.storeName === 'MLBB TOPUP') {
        merged.logoImage = DEFAULT_BRANDING.logoImage;
        merged.logoType = DEFAULT_BRANDING.logoType;
        merged.storeName = DEFAULT_BRANDING.storeName;
      }
      return merged;
    }
  } catch (err) {
    console.warn('Error reading store branding from storage:', err);
  }
  return DEFAULT_BRANDING;
};

export const saveStoreBranding = (newBranding) => {
  try {
    const updated = { ...getStoreBranding(), ...newBranding };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    // Dispatch custom event for real-time reactive updates across all components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: updated }));
    }
    return updated;
  } catch (err) {
    console.warn('Error saving store branding:', err);
    return DEFAULT_BRANDING;
  }
};

export const resetStoreBranding = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: DEFAULT_BRANDING }));
    }
  } catch (err) {
    console.warn('Error resetting store branding:', err);
  }
  return DEFAULT_BRANDING;
};

// React hook to use store branding reactively
export const useStoreBranding = () => {
  const [branding, setBranding] = useState(getStoreBranding);

  useEffect(() => {
    const handleUpdate = (e) => {
      if (e.detail) {
        setBranding(e.detail);
      } else {
        setBranding(getStoreBranding());
      }
    };

    window.addEventListener(EVENT_NAME, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(EVENT_NAME, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const updateBranding = (updates) => {
    const result = saveStoreBranding(updates);
    setBranding(result);
    return result;
  };

  const resetBranding = () => {
    const result = resetStoreBranding();
    setBranding(result);
    return result;
  };

  return { branding, updateBranding, resetBranding };
};
