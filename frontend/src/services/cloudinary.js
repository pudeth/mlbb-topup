// Cloudinary Image Hosting Service & Upload Helper

const CLOUDINARY_CONFIG_KEY = 'mlbb_cloudinary_config_v1';

export const getCloudinaryConfig = () => {
  try {
    const saved = localStorage.getItem(CLOUDINARY_CONFIG_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { cloudName: 'dpz7vpmf8', uploadPreset: 'mlbb_topup', ...parsed };
    }
  } catch (e) {}
  
  return {
    cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'dpz7vpmf8',
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

const fileToDataUrl = (file) => {
  return new Promise((resolve) => {
    if (typeof file === 'string') {
      return resolve(file);
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
};

/**
 * Upload an image file directly to Cloudinary CDN with local fallback
 * @param {File|Blob|string} file - The file or base64 data to upload
 * @param {string} folder - Optional folder tag in Cloudinary (e.g. 'event_banners')
 * @returns {Promise<{ url: string, publicId?: string, success: boolean, isCloudinary?: boolean, isFallback?: boolean, error?: string }>}
 */
export const uploadToCloudinary = async (file, folder = 'event_banners') => {
  const config = getCloudinaryConfig();
  const cloudName = config.cloudName || 'dpz7vpmf8';
  const uploadPreset = config.uploadPreset || 'mlbb_topup';

  try {
    if (!cloudName) {
      throw new Error('Cloudinary Cloud Name not set.');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    if (folder) {
      formData.append('folder', folder);
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
    console.warn('Cloudinary upload error:', error.message);
    let msg = error.message;
    if (msg.includes('whitelisted for unsigned') || msg.includes('not found') || msg.includes('Upload preset must be specified')) {
      msg = 'Cloudinary Notice: Unsigned upload preset required. Using optimized local storage for this banner image.';
    }

    // Local data URL fallback so the admin is NEVER blocked from updating banner image!
    const dataUrl = await fileToDataUrl(file);
    if (dataUrl) {
      return {
        success: true,
        url: dataUrl,
        isFallback: true,
        error: msg,
      };
    }

    return {
      success: false,
      error: msg,
    };
  }
};
