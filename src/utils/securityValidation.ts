import { supabase } from '@/integrations/supabase/client';

export class SecurityValidation {
  private static readonly MAX_STRING_LENGTH = 10000;
  private static readonly ALLOWED_MIME_TYPES = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf', 'text/plain', 'application/json'
  ];

  // Enhanced input sanitization
  static sanitizeInput(input: unknown): string {
    if (typeof input !== 'string') {
      throw new Error('Input must be a string');
    }

    if (input.length > this.MAX_STRING_LENGTH) {
      throw new Error(`Input too long. Maximum ${this.MAX_STRING_LENGTH} characters allowed`);
    }

    // Remove potentially dangerous patterns
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '[SCRIPT_REMOVED]')
      .replace(/javascript:/gi, 'javascript_removed:')
      .replace(/on\w+\s*=/gi, 'event_removed=')
      .replace(/data:(?!image\/[a-z]+;base64,)[^;]*;base64,/gi, '[DATA_URL_REMOVED]')
      .trim();
  }

  // Validate UUID format
  static isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  // Validate email format
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  // Validate URL format
  static isValidURL(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  }

  // Password strength validation
  static validatePasswordStrength(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < 12) {
      errors.push('Password must be at least 12 characters long');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return { valid: errors.length === 0, errors };
  }

  // Rate limiting check - using localStorage as fallback until DB tables are ready
  static async checkRateLimit(userId: string, endpoint: string, maxRequests: number = 10): Promise<boolean> {
    try {
      // For now, use a simple in-memory/localStorage rate limiting
      const key = `rate_limit_${userId}_${endpoint}`;
      const now = Date.now();
      const windowStart = now - (60 * 60 * 1000); // 1 hour window
      
      // Get existing rate limit data from localStorage
      const stored = localStorage.getItem(key);
      let rateLimitData = stored ? JSON.parse(stored) : { requests: [], windowStart: now };
      
      // Clean old requests outside the window
      rateLimitData.requests = rateLimitData.requests.filter((timestamp: number) => timestamp > windowStart);
      
      // Check if rate limit exceeded
      if (rateLimitData.requests.length >= maxRequests) {
        console.warn('🛡️ Rate limit exceeded for', endpoint);
        return false;
      }
      
      // Add current request
      rateLimitData.requests.push(now);
      localStorage.setItem(key, JSON.stringify(rateLimitData));
      
      return true;
    } catch (error) {
      console.error('Rate limiting error:', error);
      return true; // Allow on error to prevent blocking legitimate users
    }
  }

  // Log security events - using console logging until DB table is ready
  static async logSecurityEvent(
    userId: string | null,
    eventType: string,
    details: Record<string, unknown> = {},
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    try {
      const logEntry = {
        user_id: userId,
        event_type: eventType,
        details,
        ip_address: ipAddress,
        user_agent: userAgent?.substring(0, 500),
        timestamp: new Date().toISOString()
      };
      
      // Log to console for now
      console.log('🛡️ Security Event:', logEntry);
      
      // Store in localStorage for debugging
      const key = 'security_events';
      const stored = localStorage.getItem(key);
      const events = stored ? JSON.parse(stored) : [];
      events.push(logEntry);
      
      // Keep only last 100 events
      if (events.length > 100) {
        events.splice(0, events.length - 100);
      }
      
      localStorage.setItem(key, JSON.stringify(events));
    } catch (error) {
      console.warn('Failed to log security event:', error);
    }
  }

  // Validate file upload security
  static validateFileUpload(file: File): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      errors.push('File size must be less than 10MB');
    }

    // Check MIME type
    if (!this.ALLOWED_MIME_TYPES.includes(file.type)) {
      errors.push('File type not allowed');
    }

    // Check file name
    if (!/^[a-zA-Z0-9._-]+$/.test(file.name)) {
      errors.push('File name contains invalid characters');
    }

    return { valid: errors.length === 0, errors };
  }
}
