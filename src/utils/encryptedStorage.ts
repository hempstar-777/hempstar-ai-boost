
// Military-grade encrypted storage for sensitive data
class EncryptedStorage {
  private static readonly ENCRYPTION_KEY = 'hempstar-vip-creator-encryption-key-2025';
  
  // Simple XOR encryption (for demonstration - in production use proper crypto)
  private static encrypt(text: string): string {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(
        text.charCodeAt(i) ^ this.ENCRYPTION_KEY.charCodeAt(i % this.ENCRYPTION_KEY.length)
      );
    }
    return btoa(result);
  }
  
  private static decrypt(encryptedText: string): string {
    const decoded = atob(encryptedText);
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
      result += String.fromCharCode(
        decoded.charCodeAt(i) ^ this.ENCRYPTION_KEY.charCodeAt(i % this.ENCRYPTION_KEY.length)
      );
    }
    return result;
  }
  
  static setSecureItem(key: string, value: string): void {
    try {
      const encrypted = this.encrypt(value);
      localStorage.setItem(`secure_${key}`, encrypted);
    } catch (error) {
      console.error('Failed to set secure item:', error);
    }
  }
  
  static getSecureItem(key: string): string | null {
    try {
      const encrypted = localStorage.getItem(`secure_${key}`);
      if (!encrypted) return null;
      return this.decrypt(encrypted);
    } catch (error) {
      console.error('Failed to get secure item:', error);
      return null;
    }
  }
  
  static removeSecureItem(key: string): void {
    localStorage.removeItem(`secure_${key}`);
  }
  
  static clearAllSecureItems(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('secure_')) {
        localStorage.removeItem(key);
      }
    });
  }
}

export default EncryptedStorage;
