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

/**
 * Upload an image file directly to Cloudinary CDN
 * @param {File|Blob|string} file - The file or base64 data to upload
 * @param {string} folder - Optional folder tag in Cloudinary
 * @returns {Promise<{ url: string, publicId: string, success: boolean }>}
 */
export const uploadToCloudinary = async (file, folder = 'profile-photos') => {
  const config = getCloudinaryConfig();
  const cloudName = config.cloudName || 'dpz7vpmf8';
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
    console.warn('Cloudinary upload error:', error.message);
    let msg = error.message;
    if (msg.includes('whitelisted for unsigned') || msg.includes('not found')) {
      msg = 'Upload Preset required: In your Cloudinary Settings -> Upload, click "Add upload preset" and set Signing Mode to "Unsigned".';
    }
    return {
      success: false,
      error: msg,
    };
  }
};
