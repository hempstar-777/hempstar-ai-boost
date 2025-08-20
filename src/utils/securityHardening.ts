
// Intelligent security utilities for single-user application
import { supabase } from '@/integrations/supabase/client';

class SecurityHardening {
  private static readonly AUTHORIZED_USER_EMAIL = 'creator@hempstar.ai';
  private static readonly SECURITY_SALT = 'hempstar-security-2025';
  private static securityInitialized = false;
  
  // Smart anti-debugging - only trigger on actual threats
  static initAntiDebugging() {
    // Only enable in production, not during development
    if (window.location.hostname === 'localhost' || window.location.hostname.includes('lovable.app')) {
      console.log('🛡️ Development mode - Security monitoring active but non-blocking');
      return;
    }

    // Monitor for suspicious activity patterns, not normal developer tools usage
    let suspiciousActivity = 0;
    const suspiciousThreshold = 5;
    
    // Track rapid repeated attempts to access developer tools
    let devToolsAttempts = 0;
    document.addEventListener('keydown', (e) => {
      if (
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'C' || e.key === 'J')) ||
        (e.ctrlKey && e.key === 'U') ||
        e.key === 'F12'
      ) {
        devToolsAttempts++;
        if (devToolsAttempts > 10) { // Only after many rapid attempts
          suspiciousActivity++;
          console.warn('🛡️ Rapid developer tool access detected');
        }
      }
    });

    // Only disable right-click in suspicious circumstances
    document.addEventListener('contextmenu', (e) => {
      if (suspiciousActivity > suspiciousThreshold) {
        e.preventDefault();
        this.logSecurityEvent('Suspicious context menu access after security warnings');
      }
    });

    // Reset suspicious activity counter periodically
    setInterval(() => {
      devToolsAttempts = Math.max(0, devToolsAttempts - 1);
      suspiciousActivity = Math.max(0, suspiciousActivity - 1);
    }, 30000);
  }

  // Code obfuscation for sensitive operations
  static obfuscateString(str: string): string {
    return btoa(encodeURIComponent(str)).split('').reverse().join('');
  }

  static deobfuscateString(str: string): string {
    return decodeURIComponent(atob(str.split('').reverse().join('')));
  }

  // Environment validation - allow legitimate environments
  static validateEnvironment(): boolean {
    const validDomains = [
      'lovable.app', 
      'localhost', 
      '127.0.0.1',
      window.location.hostname
    ];
    
    const currentDomain = window.location.hostname;
    
    // Allow all Lovable and localhost environments
    if (validDomains.some(domain => 
      currentDomain.includes(domain) || 
      domain === currentDomain ||
      currentDomain.endsWith('.lovable.app')
    )) {
      return true;
    }

    console.warn('🛡️ Unknown domain detected:', currentDomain);
    return true; // Don't block, just log for now
  }

  // Smart user verification - support multiple auth methods
  static async verifyAuthorizedUser(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Allow the specific creator email or Google OAuth with that email
      if (user && (
        user.email === this.AUTHORIZED_USER_EMAIL ||
        (user.user_metadata?.email === this.AUTHORIZED_USER_EMAIL) ||
        (user.identities?.some(identity => 
          identity.identity_data?.email === this.AUTHORIZED_USER_EMAIL
        ))
      )) {
        console.log('🛡️ VIP Creator verified');
        return true;
      }

      // Log unauthorized attempts but don't immediately block
      if (user) {
        console.warn('🛡️ User authenticated but not authorized:', user.email);
        this.logSecurityEvent(`Unauthorized user: ${user.email}`);
      }

      return false;
    } catch (error) {
      console.error('🛡️ User verification error:', error);
      return false;
    }
  }

  // Generate user fingerprint for additional verification
  private static generateUserFingerprint(): string {
    try {
      const fingerprint = [
        navigator.userAgent.substring(0, 50), // Partial UA to avoid blocking updates
        navigator.language,
        screen.width + 'x' + screen.height,
        this.SECURITY_SALT
      ].join('|');
      
      return btoa(fingerprint).substring(0, 32);
    } catch (error) {
      console.warn('🛡️ Fingerprint generation failed:', error);
      return 'fallback-fingerprint';
    }
  }

  // Gentle security response - log but don't break the app
  private static handleSecurityBreach(reason: string) {
    console.warn('🛡️ Security event:', reason);
    
    // Log the security event but don't break the app
    this.logSecurityEvent(reason);
    
    // Only clear data for severe breaches
    if (reason.includes('injection') || reason.includes('automation')) {
      localStorage.removeItem('user_security_fingerprint');
    }
    
    // Don't redirect or break the interface - just monitor
  }

  // Security event logging
  private static async logSecurityEvent(reason: string) {
    try {
      await supabase.from('audit_logs').insert({
        user_id: 'security-monitor',
        action: 'security_event',
        resource_type: 'application',
        details: {
          reason,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent.substring(0, 100),
          url: window.location.href,
          referrer: document.referrer
        }
      });
    } catch (error) {
      console.warn('🛡️ Failed to log security event:', error);
    }
  }

  // Initialize security suite with smart defaults
  static initializeSecuritySuite() {
    if (this.securityInitialized) {
      return;
    }

    console.log('🛡️ Initializing intelligent security suite...');

    // Validate environment
    if (!this.validateEnvironment()) {
      console.warn('🛡️ Environment validation failed, monitoring only');
    }

    // Initialize smart anti-debugging
    this.initAntiDebugging();

    // Verify authorized user
    this.verifyAuthorizedUser();

    // Periodic security checks (less frequent to avoid interference)
    setInterval(() => {
      this.verifyAuthorizedUser();
    }, 120000); // Check every 2 minutes instead of 30 seconds

    this.securityInitialized = true;
    console.log('🛡️ Intelligent security suite initialized');
  }
}

export default SecurityHardening;
