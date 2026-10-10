// Hybrid Cryptography Client (RSA-2048 + AES-256-CBC)
// Secures API requests and responses from DevTools inspection

const DEFAULT_SERVER_PUBLIC_KEY_PEM = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2RhPsoJtXAcDWhTWdA/y
dLa1eYlsJjYCpBIyBjcFeLBnXVMfoOzBGA1FiwdctUiSC2Od9Ac+HMGWfSo95KfH
xGx9yaHGgbLuKrALxecwG4v2Q1fArdQnmPs08NVS7AHrnga13YEe9z5YHicisVFv
3PDRIfQVNx2F+ZxhIejsXSy6izqFYgrMecLX8Aqq+z85IAra0wI+hPTo5bTkU2lD
Z3obHFPY8anSH6Vyrx6fYSqYBrtzWe4jMV+BqJZcWssCCIv8GG/QnReBAB6zKOuZ
0BA73IKyMHiIVJM8V8c03+mWGmy+bpSKwDCWWdmtRYjx1cWoNbLXNMXo85jxV3K5
9QIDAQAB
-----END PUBLIC KEY-----`;

let cachedRsaPublicKey = null;

// Helpers: Base64 and ArrayBuffer conversions
export const arrayBufferToBase64 = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

export const base64ToArrayBuffer = (base64) => {
  const binary = window.atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
};

const pemToDer = (pem) => {
  const clean = pem
    .replace(/-----BEGIN [^-]+-----/g, '')
    .replace(/-----END [^-]+-----/g, '')
    .replace(/\s+/g, '');
  return base64ToArrayBuffer(clean);
};

// Check if modern Web Crypto API is available in current browser
export const isCryptoSupported = () => {
  return typeof window !== 'undefined' &&
    window.crypto &&
    window.crypto.subtle &&
    typeof window.crypto.subtle.importKey === 'function';
};

// Import and cache RSA Public Key
export const getRsaPublicKey = async (pemString = DEFAULT_SERVER_PUBLIC_KEY_PEM) => {
  if (cachedRsaPublicKey) return cachedRsaPublicKey;
  if (!isCryptoSupported()) return null;

  try {
    const der = pemToDer(pemString);
    cachedRsaPublicKey = await window.crypto.subtle.importKey(
      'spki',
      der,
      { name: 'RSA-OAEP', hash: 'SHA-256' },
      false,
      ['encrypt']
    );
    return cachedRsaPublicKey;
  } catch (err) {
    console.warn('[Crypto] Failed to import RSA public key:', err);
    return null;
  }
};

// Generate random 256-bit AES key and 16-byte IV
export const generateAesKeyAndIv = () => {
  const rawKey = new Uint8Array(32);
  const iv = new Uint8Array(16);
  window.crypto.getRandomValues(rawKey);
  window.crypto.getRandomValues(iv);
  return { rawKey, iv };
};

// Encrypt AES key using RSA-OAEP SHA-256
export const encryptAesKeyWithRsa = async (rawAesKey) => {
  const rsaKey = await getRsaPublicKey();
  if (!rsaKey) throw new Error('RSA public key not available');

  const encryptedBuffer = await window.crypto.subtle.encrypt(
    { name: 'RSA-OAEP' },
    rsaKey,
    rawAesKey
  );
  return arrayBufferToBase64(encryptedBuffer);
};

// Encrypt payload (data object or string) with AES-256-CBC
export const encryptWithAes = async (data, rawAesKey, iv) => {
  const cryptoKey = await window.crypto.subtle.importKey(
    'raw',
    rawAesKey,
    { name: 'AES-CBC' },
    false,
    ['encrypt']
  );

  const text = typeof data === 'string' ? data : JSON.stringify(data);
  const encoded = new TextEncoder().encode(text);

  const cipherBuffer = await window.crypto.subtle.encrypt(
    { name: 'AES-CBC', iv },
    cryptoKey,
    encoded
  );

  return arrayBufferToBase64(cipherBuffer);
};

// Decrypt AES-256-CBC ciphertext
export const decryptWithAes = async (base64Cipher, rawAesKey, base64Iv) => {
  const cryptoKey = await window.crypto.subtle.importKey(
    'raw',
    rawAesKey,
    { name: 'AES-CBC' },
    false,
    ['decrypt']
  );

  const cipherBuffer = base64ToArrayBuffer(base64Cipher);
  const ivBuffer = base64ToArrayBuffer(base64Iv);

  const decryptedBuffer = await window.crypto.subtle.decrypt(
    { name: 'AES-CBC', iv: new Uint8Array(ivBuffer) },
    cryptoKey,
    cipherBuffer
  );

  const text = new TextDecoder().decode(decryptedBuffer);
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

// Prepare encrypted envelope for outgoing request
export const prepareEncryptedRequest = async (data) => {
  if (!isCryptoSupported()) return { data, rawKey: null };

  const { rawKey, iv } = generateAesKeyAndIv();
  const encKey = await encryptAesKeyWithRsa(rawKey);
  const encData = await encryptWithAes(data, rawKey, iv);

  return {
    envelope: {
      _enc: true,
      key: encKey,
      iv: arrayBufferToBase64(iv),
      data: encData
    },
    rawKey
  };
};

// Prepare encrypted header for GET/DELETE
export const prepareEncryptedHeaders = async () => {
  if (!isCryptoSupported()) return { headers: {}, rawKey: null };

  const { rawKey } = generateAesKeyAndIv();
  const encKey = await encryptAesKeyWithRsa(rawKey);

  return {
    headers: {
      'X-Encrypted-Key': encKey,
      'X-Encrypted': '1'
    },
    rawKey
  };
};
