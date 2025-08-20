
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

  // Rate limiting check
  static async checkRateLimit(userId: string, endpoint: string, maxRequests: number = 10): Promise<boolean> {
    try {
      const windowStart = new Date();
      windowStart.setMinutes(windowStart.getMinutes() - 60); // 1 hour window

      const { data, error } = await supabase
        .from('rate_limits')
        .select('requests_count')
        .eq('user_id', userId)
        .eq('endpoint', endpoint)
        .gte('window_start', windowStart.toISOString())
        .single();

      if (error && error.code !== 'PGRST116') { // Not found is OK
        console.warn('Rate limit check failed:', error);
        return false; // Fail safe - deny on error
      }

      if (data && data.requests_count >= maxRequests) {
        return false; // Rate limit exceeded
      }

      // Update or insert rate limit record
      await supabase
        .from('rate_limits')
        .upsert({
          user_id: userId,
          endpoint,
          requests_count: (data?.requests_count || 0) + 1,
          window_start: new Date().toISOString()
        });

      return true;
    } catch (error) {
      console.error('Rate limiting error:', error);
      return false; // Fail safe
    }
  }

  // Log security events
  static async logSecurityEvent(
    userId: string | null,
    eventType: string,
    details: Record<string, unknown> = {},
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    try {
      await supabase
        .from('security_events')
        .insert({
          user_id: userId,
          event_type: eventType,
          details,
          ip_address: ipAddress,
          user_agent: userAgent?.substring(0, 500) // Limit user agent length
        });
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
