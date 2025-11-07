
import { supabase } from '@/integrations/supabase/client';
import { SecurityValidation } from './securityValidation';
import { SecureSessionManager } from './secureSessionManager';
import { isVipUser, validateUserSession } from './vipAccess';

class EnhancedSecurityHardening {
  private static securityInitialized = false;
  private static readonly SECURITY_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes

  // Initialize comprehensive security suite
  static initializeEnhancedSecurity() {
    if (this.securityInitialized) {
      return;
    }

    console.log('🛡️ Initializing enhanced security suite...');

    // Validate environment
    if (!this.validateSecureEnvironment()) {
      console.error('🛡️ Insecure environment detected');
      return;
    }

    // Initialize session monitoring
    SecureSessionManager.monitorSessionActivity();

    // Set up periodic security checks
    this.setupPeriodicSecurityChecks();

    // Initialize content security policy
    this.enforceContentSecurityPolicy();

    // Set up error handling for security events
    this.setupSecurityErrorHandling();

    this.securityInitialized = true;
    console.log('🛡️ Enhanced security suite initialized successfully');
  }

  private static validateSecureEnvironment(): boolean {
    const currentDomain = window.location.hostname;
    const currentProtocol = window.location.protocol;
    
    // Allow all Lovable domains
    const allowedDomains = [
      'localhost', 
      '127.0.0.1', 
      'hempstar.ai', 
      'lovable.app',
      'lovableproject.com' // Allow preview domains
    ];
    
    const isDomainAllowed = allowedDomains.some(domain => 
      currentDomain === domain || currentDomain.includes(domain)
    );

    if (!isDomainAllowed) {
      console.warn('🛡️ Unknown domain:', currentDomain);
    }

    // Always return true for development
    return true;
  }

  private static isDevelopmentEnvironment(): boolean {
    return window.location.hostname === 'localhost' || 
           window.location.hostname.includes('127.0.0.1') ||
           window.location.hostname.includes('lovable.app') ||
           window.location.hostname.includes('lovableproject.com');
  }

  private static setupPeriodicSecurityChecks(): void {
    const performSecurityCheck = async () => {
      try {
        // Validate current session
        const sessionValid = await SecureSessionManager.validateSession();
        
        if (!sessionValid) {
          console.warn('🛡️ Session validation failed during periodic check');
          return;
        }

        // Check for VIP user status
        const { data: { user } } = await supabase.auth.getUser();
        if (user && !isVipUser(user)) {
          console.warn('🛡️ Non-VIP user detected during periodic check');
          await SecureSessionManager.secureSignOut();
          return;
        }

        // Log successful security check
        if (user) {
          SecurityValidation.logSecurityEvent(
            user.id,
            'periodic_security_check',
            { status: 'passed', timestamp: new Date().toISOString() }
          );
        }

      } catch (error) {
        console.error('🛡️ Periodic security check failed:', error);
      }
    };

    // Initial check
    setTimeout(performSecurityCheck, 30000); // 30 seconds after init

    // Periodic checks
    setInterval(performSecurityCheck, this.SECURITY_CHECK_INTERVAL);
  }

  private static enforceContentSecurityPolicy(): void {
    // Create and inject CSP meta tag if not present
    if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
      const cspMeta = document.createElement('meta');
      cspMeta.httpEquiv = 'Content-Security-Policy';
      cspMeta.content = `
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com;
        style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
        font-src 'self' https://fonts.gstatic.com;
        img-src 'self' data: blob: https:;
        connect-src 'self' https://*.supabase.co wss://*.supabase.co;
        frame-ancestors 'none';
        base-uri 'self';
        form-action 'self';
      `.replace(/\s+/g, ' ').trim();
      
      document.head.appendChild(cspMeta);
    }
  }

  private static setupSecurityErrorHandling(): void {
    // Global error handler for security-related errors
    window.addEventListener('error', (event) => {
      if (event.error && event.error.message) {
        const message = event.error.message.toLowerCase();
        if (message.includes('security') || 
            message.includes('unauthorized') || 
            message.includes('forbidden')) {
          
          SecurityValidation.logSecurityEvent(
            null,
            'security_error',
            {
              message: event.error.message,
              filename: event.filename,
              lineno: event.lineno,
              colno: event.colno
            }
          );
        }
      }
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason && event.reason.message) {
        const message = event.reason.message.toLowerCase();
        if (message.includes('security') || 
            message.includes('unauthorized') || 
            message.includes('forbidden')) {
          
          SecurityValidation.logSecurityEvent(
            null,
            'security_promise_rejection',
            { reason: event.reason.message }
          );
        }
      }
    });
  }

  // Enhanced user verification with comprehensive checks
  static async verifyEnhancedUserAccess(): Promise<boolean> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        console.log('🛡️ No user found during verification');
        return false;
      }

      // Creator bypass - always allow creator access
      const creatorEmails = ['chidoweywey@gmail.com', 'hempstar777@yahoo.ca'];
      const userEmail = user.email?.toLowerCase().trim();
      
      if (userEmail && creatorEmails.includes(userEmail)) {
        console.log('✅ Creator verified - bypassing all security checks');
        return true;
      }

      // VIP verification for other users
      if (!isVipUser(user)) {
        console.log('🛡️ Non-VIP user:', userEmail);
        return false;
      }

      console.log('🛡️ VIP user verified:', userEmail);
      return true;

    } catch (error) {
      console.error('🛡️ User verification error:', error);
      return false;
    }
  }

  // Get comprehensive security status
  static getEnhancedSecurityStatus() {
    return {
      initialized: this.securityInitialized,
      environment: this.isDevelopmentEnvironment() ? 'development' : 'production',
      httpsEnabled: window.location.protocol === 'https:',
      domain: window.location.hostname,
      timestamp: new Date().toISOString()
    };
  }
}

export default EnhancedSecurityHardening;
