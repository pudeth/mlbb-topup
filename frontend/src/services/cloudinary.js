// Cloudinary Image Hosting Service & Upload Helper

const CLOUDINARY_CONFIG_KEY = 'mlbb_cloudinary_config_v1';

export const getCloudinaryConfig = () => {
  try {
    const saved = localStorage.getItem(CLOUDINARY_CONFIG_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        cloudName: 'dpz7vpmf8',
        apiKey: '617524462118688',
        apiSecret: 'PpQ_E0PPEKBZS7gSinrBWSYaI5M',
        uploadPreset: 'mlbb_topup',
        ...parsed,
      };
    }
  } catch (e) {}
  
  return {
    cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'dpz7vpmf8',
    apiKey: process.env.REACT_APP_CLOUDINARY_API_KEY || '617524462118688',
    apiSecret: process.env.REACT_APP_CLOUDINARY_API_SECRET || 'PpQ_E0PPEKBZS7gSinrBWSYaI5M',
    uploadPreset: process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || 'mlbb_topup',
    autoUpload: true,
  };
};

export const saveCloudinaryConfig = (config) => {
  try {
    localStorage.setItem(CLOUDINARY_CONFIG_KEY, JSON.stringify(config));
  } catch (e) {}
  return config;
};

const sha1 = async (str) => {
  try {
    const enc = new TextEncoder();
    const hash = await window.crypto.subtle.digest('SHA-1', enc.encode(str));
    return Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  } catch (e) {
    return null;
  }
};

/**
 * Upload an image file directly to Cloudinary CDN with automatic API signing
 * @param {File|Blob|string} file - The file or base64 data to upload
 * @param {string} folder - Optional folder tag in Cloudinary (e.g. 'profile-photos')
 * @returns {Promise<{ url: string, publicId?: string, success: boolean, isCloudinary?: boolean, error?: string }>}
 */
export const uploadToCloudinary = async (file, folder = 'profile-photos') => {
  const config = getCloudinaryConfig();
  const cloudName = config.cloudName || 'dpz7vpmf8';
  const apiKey = config.apiKey || '617524462118688';
  const apiSecret = config.apiSecret || 'PpQ_E0PPEKBZS7gSinrBWSYaI5M';

  try {
    if (!cloudName) {
      throw new Error('Cloudinary Cloud Name not set.');
    }

    const timestamp = Math.round(Date.now() / 1000).toString();
    const formData = new FormData();
    formData.append('file', file);

    // Direct Signed Upload via Cloudinary HMAC-SHA1 signature (100% reliable, zero presets needed)
    if (apiKey && apiSecret) {
      let paramsToSign = '';
      if (folder) {
        paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
      } else {
        paramsToSign = `timestamp=${timestamp}`;
      }
      const signature = await sha1(paramsToSign + apiSecret);
      formData.append('api_key', apiKey);
      formData.append('timestamp', timestamp);
      formData.append('signature', signature);
      if (folder) {
        formData.append('folder', folder);
      }
    } else {
      formData.append('upload_preset', config.uploadPreset || 'mlbb_topup');
      if (folder) {
        formData.append('folder', folder);
      }
    }

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.error?.message || `Cloudinary upload failed (HTTP ${response.status})`);
    }

    const data = await response.json();
    return {
      success: true,
      url: data.secure_url || data.url,
      publicId: data.public_id,
      format: data.format,
      width: data.width,
      height: data.height,
      isCloudinary: true,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error.message);
    return {
      success: false,
      error: error.message,
    };
  }
};
