import CryptoJS from 'crypto-js';

// Get encryption key from environment or generate a fallback
const getEncryptionKey = () => {
  const envKey = import.meta.env.VITE_ENCRYPTION_KEY;
  if (envKey && envKey.length >= 32) {
    return envKey;
  }
  
  // Fallback key for development (NOT for production)
  console.warn('Using fallback encryption key. Set VITE_ENCRYPTION_KEY in production.');
  return 'dev-fallback-key-32-chars-long!!';
};

const ENCRYPTION_KEY = getEncryptionKey();

/**
 * Encrypts sensitive data before storing
 * @param {string} text - The text to encrypt
 * @returns {string} - Encrypted text
 */
export const encryptData = (text) => {
  if (!text) return text;
  
  try {
    const encrypted = CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    return text; // Return original text if encryption fails
  }
};

/**
 * Decrypts sensitive data after retrieving
 * @param {string} encryptedText - The encrypted text
 * @returns {string} - Decrypted text
 */
export const decryptData = (encryptedText) => {
  if (!encryptedText) return encryptedText;
  
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedText, ENCRYPTION_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted || encryptedText; // Return original if decryption fails
  } catch (error) {
    console.error('Decryption error:', error);
    return encryptedText; // Return encrypted text if decryption fails
  }
};

/**
 * Encrypts an array of strings
 * @param {string[]} array - Array of strings to encrypt
 * @returns {string[]} - Array of encrypted strings
 */
export const encryptArray = (array) => {
  if (!Array.isArray(array)) return array;
  return array.map(item => encryptData(item));
};

/**
 * Decrypts an array of strings
 * @param {string[]} encryptedArray - Array of encrypted strings
 * @returns {string[]} - Array of decrypted strings
 */
export const decryptArray = (encryptedArray) => {
  if (!Array.isArray(encryptedArray)) return encryptedArray;
  return encryptedArray.map(item => decryptData(item));
};

/**
 * Encrypts a dream entry object
 * @param {Object} dreamEntry - Dream entry object
 * @returns {Object} - Dream entry with encrypted sensitive fields
 */
export const encryptDreamEntry = (dreamEntry) => {
  if (!dreamEntry) return dreamEntry;
  
  return {
    ...dreamEntry,
    dreamText: encryptData(dreamEntry.dreamText),
    interpretation: encryptData(dreamEntry.interpretation),
    tags: encryptArray(dreamEntry.tags),
    emotions: encryptArray(dreamEntry.emotions)
  };
};

/**
 * Decrypts a dream entry object
 * @param {Object} encryptedDreamEntry - Encrypted dream entry object
 * @returns {Object} - Dream entry with decrypted sensitive fields
 */
export const decryptDreamEntry = (encryptedDreamEntry) => {
  if (!encryptedDreamEntry) return encryptedDreamEntry;
  
  return {
    ...encryptedDreamEntry,
    dreamText: decryptData(encryptedDreamEntry.dreamText),
    interpretation: decryptData(encryptedDreamEntry.interpretation),
    tags: decryptArray(encryptedDreamEntry.tags),
    emotions: decryptArray(encryptedDreamEntry.emotions)
  };
};

/**
 * Encrypts user email
 * @param {string} email - User email
 * @returns {string} - Encrypted email
 */
export const encryptEmail = (email) => {
  return encryptData(email);
};

/**
 * Decrypts user email
 * @param {string} encryptedEmail - Encrypted email
 * @returns {string} - Decrypted email
 */
export const decryptEmail = (encryptedEmail) => {
  return decryptData(encryptedEmail);
};

/**
 * Generates a secure hash for data integrity
 * @param {string} data - Data to hash
 * @returns {string} - SHA256 hash
 */
export const generateHash = (data) => {
  return CryptoJS.SHA256(data).toString();
};

/**
 * Validates data integrity using hash
 * @param {string} data - Original data
 * @param {string} hash - Hash to validate against
 * @returns {boolean} - True if data is valid
 */
export const validateHash = (data, hash) => {
  return generateHash(data) === hash;
};
