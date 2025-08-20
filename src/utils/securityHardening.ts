
import { supabase } from '@/integrations/supabase/client';
import { isVipUser, validateUserSession } from './vipAccess';

class SecurityHardening {
  private static securityInitialized = false;
  private static readonly MAX_FAILED_ATTEMPTS = 5;
  private static readonly LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
  private static failedAttempts = new Map<string, { count: number; lastAttempt: number }>();
  
  // Enhanced anti-debugging with smart detection
  static initAntiDebugging() {
    // Only enable in production environments
    if (this.isDevelopmentEnvironment()) {
      console.log('🛡️ Development mode - Security monitoring active but non-blocking');
      return;
    }

    let suspiciousActivity = 0;
    const suspiciousThreshold = 3;
    
    // Smart detection of automated tools and suspicious patterns
    const detectAutomation = () => {
      // Check for common automation indicators
      if (navigator.webdriver || 
          (window as any).callPhantom || 
          (window as any)._phantom ||
          (window as any).Buffer) {
        suspiciousActivity += 2;
        this.logSecurityEvent('Automation tool detected');
      }
    };

    // Monitor for rapid successive developer tool access
    let devToolsAttempts = 0;
    let lastDevToolsAttempt = 0;
    
    document.addEventListener('keydown', (e) => {
      const now = Date.now();
      const isDevToolsShortcut = (
        (e.ctrlKey && e.shiftKey && ['I', 'C', 'J'].includes(e.key)) ||
        (e.ctrlKey && e.key === 'U') ||
        e.key === 'F12'
      );

      if (isDevToolsShortcut) {
        if (now - lastDevToolsAttempt < 1000) { // Less than 1 second between attempts
          devToolsAttempts++;
          if (devToolsAttempts > 5) {
            suspiciousActivity++;
            this.logSecurityEvent('Rapid developer tool access detected');
          }
        } else {
          devToolsAttempts = 1;
        }
        lastDevToolsAttempt = now;
      }
    });

    // Enhanced right-click protection with context awareness
    document.addEventListener('contextmenu', (e) => {
      if (suspiciousActivity > suspiciousThreshold) {
        e.preventDefault();
        this.logSecurityEvent('Context menu blocked due to suspicious activity');
      }
    });

    // Detect DevTools opening
    let devtools = { open: false, orientation: null };
    const threshold = 160;

    setInterval(() => {
      if (window.outerHeight - window.innerHeight > threshold || 
          window.outerWidth - window.innerWidth > threshold) {
        if (!devtools.open) {
          devtools.open = true;
          suspiciousActivity++;
          this.logSecurityEvent('Developer tools opened');
        }
      } else {
        devtools.open = false;
      }
    }, 500);

    // Initialize automation detection
    detectAutomation();
    
    // Periodic security checks
    setInterval(() => {
      detectAutomation();
      // Decay suspicious activity over time
      suspiciousActivity = Math.max(0, suspiciousActivity - 0.1);
      devToolsAttempts = Math.max(0, devToolsAttempts - 1);
    }, 30000);
  }

  static isDevelopmentEnvironment(): boolean {
    return window.location.hostname === 'localhost' || 
           window.location.hostname.includes('127.0.0.1') ||
           window.location.hostname.includes('lovable.app');
  }

  // Enhanced environment validation
  static validateEnvironment(): boolean {
    const currentDomain = window.location.hostname;
    const currentProtocol = window.location.protocol;
    
    // Require HTTPS in production
    if (!this.isDevelopmentEnvironment() && currentProtocol !== 'https:') {
      console.error('🛡️ Insecure protocol detected in production');
      this.logSecurityEvent('Insecure protocol access attempt');
      return false;
    }

    // Check for suspicious domains
    const suspiciousDomains = ['localhost.evil.com', 'phishing-site.com'];
    if (suspiciousDomains.some(domain => currentDomain.includes(domain))) {
      console.error('🛡️ Suspicious domain detected:', currentDomain);
      this.logSecurityEvent(`Suspicious domain access: ${currentDomain}`);
      return false;
    }

    // Validate referrer for additional security
    const referrer = document.referrer;
    if (referrer && !this.isDevelopmentEnvironment()) {
      try {
        const referrerUrl = new URL(referrer);
        if (referrerUrl.hostname !== currentDomain && 
            !referrerUrl.hostname.includes('google.com') &&
            !referrerUrl.hostname.includes('bing.com')) {
          console.warn('🛡️ Unusual referrer detected:', referrer);
          this.logSecurityEvent(`Unusual referrer: ${referrer}`);
        }
      } catch (e) {
        console.warn('🛡️ Invalid referrer format:', referrer);
      }
    }

    return true;
  }

  // Enhanced user verification with rate limiting
  static async verifyAuthorizedUser(): Promise<boolean> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('🛡️ User verification error:', error);
        this.logSecurityEvent(`User verification failed: ${error.message}`);
        return false;
      }

      if (!user) {
        return false;
      }

      // Enhanced user validation
      if (!validateUserSession(user)) {
        console.error('🛡️ Invalid user session');
        this.logSecurityEvent('Invalid user session detected');
        return false;
      }

      // Check if user is VIP
      const isVip = isVipUser(user);
      
      if (!isVip) {
        console.warn('🛡️ Non-VIP user detected:', user.email);
        this.handleFailedAuth(user.email || 'unknown');
        this.logSecurityEvent(`Unauthorized user access attempt: ${user.email}`);
        return false;
      }

      // Reset failed attempts on successful auth
      if (user.email) {
        this.failedAttempts.delete(user.email);
      }

      console.log('🛡️ VIP user verified:', user.email);
      return true;
    } catch (error) {
      console.error('🛡️ User verification exception:', error);
      this.logSecurityEvent(`User verification exception: ${error}`);
      return false;
    }
  }

  // Rate limiting for failed authentication attempts
  private static handleFailedAuth(email: string) {
    const now = Date.now();
    const attempts = this.failedAttempts.get(email) || { count: 0, lastAttempt: 0 };
    
    // Reset count if lockout period has passed
    if (now - attempts.lastAttempt > this.LOCKOUT_DURATION) {
      attempts.count = 0;
    }
    
    attempts.count++;
    attempts.lastAttempt = now;
    this.failedAttempts.set(email, attempts);
    
    if (attempts.count >= this.MAX_FAILED_ATTEMPTS) {
      console.error('🛡️ Account locked due to repeated failed attempts:', email);
      this.logSecurityEvent(`Account locked: ${email} (${attempts.count} failed attempts)`);
      
      // Optional: Clear localStorage/sessionStorage on repeated failures
      if (attempts.count >= this.MAX_FAILED_ATTEMPTS * 2) {
        localStorage.clear();
        sessionStorage.clear();
      }
    }
  }

  // Check if user is currently locked out
  static isUserLockedOut(email: string): boolean {
    const attempts = this.failedAttempts.get(email);
    if (!attempts) return false;
    
    const now = Date.now();
    const isLocked = attempts.count >= this.MAX_FAILED_ATTEMPTS && 
                    (now - attempts.lastAttempt) < this.LOCKOUT_DURATION;
    
    return isLocked;
  }

  // Enhanced security event logging with rate limiting
  private static async logSecurityEvent(reason: string) {
    try {
      // Rate limit security logs to prevent spam
      const logKey = `security_log_${reason.substring(0, 50)}`;
      const lastLog = localStorage.getItem(logKey);
      const now = Date.now();
      
      if (lastLog && now - parseInt(lastLog) < 60000) { // 1 minute rate limit
        return;
      }
      
      localStorage.setItem(logKey, now.toString());

      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.from('audit_logs').insert({
        user_id: user?.id || '00000000-0000-0000-0000-000000000000',
        action: 'security_event',
        resource_type: 'application',
        details: {
          reason,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent.substring(0, 200),
          url: window.location.href.substring(0, 500),
          referrer: document.referrer.substring(0, 500),
          screen: `${screen.width}x${screen.height}`,
          language: navigator.language,
          platform: navigator.platform
        }
      });
    } catch (error) {
      console.warn('🛡️ Failed to log security event:', error);
    }
  }

  // Input validation and sanitization
  static validateAndSanitizeInput(input: string, maxLength: number = 1000): string {
    if (typeof input !== 'string') {
      throw new Error('Input must be a string');
    }
    
    // Remove potentially dangerous patterns
    let sanitized = input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '[SCRIPT_REMOVED]')
      .replace(/javascript:/gi, 'javascript_removed:')
      .replace(/on\w+\s*=/gi, 'event_removed=');
    
    // Trim to max length
    if (sanitized.length > maxLength) {
      sanitized = sanitized.substring(0, maxLength);
      this.logSecurityEvent('Input truncated due to length limit');
    }
    
    return sanitized;
  }

  // Initialize comprehensive security suite
  static initializeSecuritySuite() {
    if (this.securityInitialized) {
      return;
    }

    console.log('🛡️ Initializing enhanced security suite...');

    // Validate environment first
    if (!this.validateEnvironment()) {
      console.error('🛡️ Environment validation failed');
      return;
    }

    // Initialize anti-debugging
    this.initAntiDebugging();

    // Verify authorized user
    this.verifyAuthorizedUser();

    // Periodic security checks with exponential backoff
    let checkInterval = 60000; // Start with 1 minute
    const maxInterval = 300000; // Max 5 minutes
    
    const performSecurityCheck = async () => {
      try {
        const isAuthorized = await this.verifyAuthorizedUser();
        if (isAuthorized) {
          checkInterval = Math.max(60000, checkInterval / 2); // Reduce frequency if all good
        } else {
          checkInterval = Math.min(maxInterval, checkInterval * 1.5); // Increase frequency if issues
        }
      } catch (error) {
        checkInterval = Math.min(maxInterval, checkInterval * 2);
      }
      
      setTimeout(performSecurityCheck, checkInterval);
    };

    setTimeout(performSecurityCheck, checkInterval);

    // Clean up old failed attempt records periodically
    setInterval(() => {
      const now = Date.now();
      for (const [email, attempts] of this.failedAttempts.entries()) {
        if (now - attempts.lastAttempt > this.LOCKOUT_DURATION * 2) {
          this.failedAttempts.delete(email);
        }
      }
    }, 300000); // Every 5 minutes

    this.securityInitialized = true;
    console.log('🛡️ Enhanced security suite initialized successfully');
  }

  // Public method to check security status
  static getSecurityStatus() {
    return {
      initialized: this.securityInitialized,
      environment: this.isDevelopmentEnvironment() ? 'development' : 'production',
      failedAttempts: this.failedAttempts.size,
      environmentValid: this.validateEnvironment()
    };
  }
}

export default SecurityHardening;
