// Cloudinary Image Hosting Service & Upload Helper

const CLOUDINARY_CONFIG_KEY = 'mlbb_cloudinary_config_v1';

export const getCloudinaryConfig = () => {
  try {
    const saved = localStorage.getItem(CLOUDINARY_CONFIG_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {}
  
  return {
    cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || '',
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

/**
 * Upload an image file directly to Cloudinary CDN
 * @param {File|Blob|string} file - The file or base64 data to upload
 * @param {string} folder - Optional folder tag in Cloudinary
 * @returns {Promise<{ url: string, publicId: string, success: boolean }>}
 */
export const uploadToCloudinary = async (file, folder = 'mlbb_topup') => {
  const config = getCloudinaryConfig();
  const cloudName = config.cloudName || 'deth-topup';
  const uploadPreset = config.uploadPreset || 'mlbb_topup';

  try {
    if (!cloudName) {
      throw new Error('Cloudinary Cloud Name not set. Using local base64 fallback.');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    if (folder) {
      formData.append('folder', folder);
    }

    const uploadUrl = 'https://api.cloudinary.com/v1_1/' + cloudName + '/image/upload';
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData?.error?.message || ('Cloudinary upload failed (HTTP ' + response.status + ')'));
    }

    const data = await response.json();
    return {
      success: true,
      url: data.secure_url || data.url,
      publicId: data.public_id,
      format: data.format,
      width: data.width,
      height: data.height,
    };
  } catch (error) {
    console.warn('Cloudinary upload notice:', error.message);
    
    // Fallback: If Cloudinary fails or is not configured yet, use local base64 data URL
    if (file instanceof File || file instanceof Blob) {
      const dataUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
      return {
        success: true,
        url: dataUrl,
        isFallback: true,
        warning: error.message,
      };
    }

    return {
      success: false,
      error: error.message,
    };
  }
};
