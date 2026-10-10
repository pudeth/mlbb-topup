// Hybrid Cryptography Client (RSA-2048 + AES-256-CBC)
// Secures API requests and responses without exposing _enc or iv properties in DevTools

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

export const isCryptoSupported = () => {
  return typeof window !== 'undefined' &&
    window.crypto &&
    window.crypto.subtle &&
    typeof window.crypto.subtle.importKey === 'function';
};

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

export const generateAesKeyAndIv = () => {
  const rawKey = new Uint8Array(32);
  const iv = new Uint8Array(16);
  window.crypto.getRandomValues(rawKey);
  window.crypto.getRandomValues(iv);
  return { rawKey, iv };
};

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

// Encrypt payload combining IV (16 bytes) + AES Ciphertext into a single Base64 string
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

  const cipherArray = new Uint8Array(cipherBuffer);
  const combined = new Uint8Array(16 + cipherArray.byteLength);
  combined.set(iv, 0);
  combined.set(cipherArray, 16);

  return arrayBufferToBase64(combined.buffer);
};

// Decrypt combined Base64 ciphertext (extracts IV from first 16 bytes)
export const decryptWithAes = async (base64Combined, rawAesKey) => {
  const cryptoKey = await window.crypto.subtle.importKey(
    'raw',
    rawAesKey,
    { name: 'AES-CBC' },
    false,
    ['decrypt']
  );

  const combinedBuffer = base64ToArrayBuffer(base64Combined);
  const combinedBytes = new Uint8Array(combinedBuffer);

  if (combinedBytes.byteLength < 16) {
    throw new Error('Encrypted payload too short');
  }

  const iv = combinedBytes.subarray(0, 16);
  const cipherBytes = combinedBytes.subarray(16);

  const decryptedBuffer = await window.crypto.subtle.decrypt(
    { name: 'AES-CBC', iv },
    cryptoKey,
    cipherBytes
  );

  const text = new TextDecoder().decode(decryptedBuffer);
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

export const prepareEncryptedRequest = async (data) => {
  if (!isCryptoSupported()) return { data, rawKey: null };

  const { rawKey, iv } = generateAesKeyAndIv();
  const encKey = await encryptAesKeyWithRsa(rawKey);
  const encData = await encryptWithAes(data, rawKey, iv);

  return {
    headers: {
      'X-Encrypted-Key': encKey,
      'X-Encrypted': '1'
    },
    envelope: {
      data: encData
    },
    rawKey
  };
};

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
