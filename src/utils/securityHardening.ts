
// Military-grade security utilities for single-user application
import { supabase } from '@/integrations/supabase/client';

// Advanced obfuscation utilities
class SecurityHardening {
  private static readonly AUTHORIZED_USER_HASH = 'vip-creator-2025-hash-verification';
  private static readonly SECURITY_SALT = 'hempstar-military-grade-salt-2025';
  
  // Anti-debugging measures
  static initAntiDebugging() {
    // Detect developer tools
    let devtools = {
      open: false,
      orientation: null as string | null
    };
    
    const threshold = 160;
    setInterval(() => {
      if (window.outerHeight - window.innerHeight > threshold || 
          window.outerWidth - window.innerWidth > threshold) {
        if (!devtools.open) {
          devtools.open = true;
          this.handleSecurityBreach('Developer tools detected');
        }
      } else {
        devtools.open = false;
      }
    }, 500);

    // Disable right-click context menu
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.handleSecurityBreach('Context menu access attempt');
    });

    // Disable common developer shortcuts
    document.addEventListener('keydown', (e) => {
      if (
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'C' || e.key === 'J')) ||
        (e.ctrlKey && e.key === 'U') ||
        e.key === 'F12'
      ) {
        e.preventDefault();
        this.handleSecurityBreach('Developer shortcut attempt');
      }
    });

    // Anti-copy protection
    document.addEventListener('selectstart', (e) => e.preventDefault());
    document.addEventListener('dragstart', (e) => e.preventDefault());
  }

  // Code obfuscation for sensitive operations
  static obfuscateString(str: string): string {
    return btoa(encodeURIComponent(str)).split('').reverse().join('');
  }

  static deobfuscateString(str: string): string {
    return decodeURIComponent(atob(str.split('').reverse().join('')));
  }

  // Integrity verification
  static verifyApplicationIntegrity(): boolean {
    const scriptTags = document.getElementsByTagName('script');
    const expectedScriptCount = scriptTags.length;
    
    // Check for unexpected script injections
    for (let i = 0; i < scriptTags.length; i++) {
      const script = scriptTags[i];
      if (script.src && !script.src.includes(window.location.origin) && 
          !script.src.includes('lovable.app') && 
          !script.src.includes('supabase.co')) {
        this.handleSecurityBreach('Unauthorized script injection detected');
        return false;
      }
    }
    
    return true;
  }

  // Environment validation
  static validateEnvironment(): boolean {
    // Check if running in expected environment
    const validDomains = ['lovable.app', 'localhost', window.location.hostname];
    const currentDomain = window.location.hostname;
    
    if (!validDomains.some(domain => currentDomain.includes(domain) || domain === currentDomain)) {
      this.handleSecurityBreach('Invalid domain access attempt');
      return false;
    }

    // Check for automation/bot detection
    if (navigator.webdriver || 
        (window as any).callPhantom || 
        (window as any)._phantom || 
        (window as any).Buffer) {
      this.handleSecurityBreach('Automation tool detected');
      return false;
    }

    return true;
  }

  // Advanced user verification
  static async verifyAuthorizedUser(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user || user.email !== 'creator@hempstar.ai') {
        this.handleSecurityBreach('Unauthorized user access attempt');
        return false;
      }

      // Additional verification layer
      const userFingerprint = this.generateUserFingerprint();
      const storedFingerprint = localStorage.getItem('user_security_fingerprint');
      
      if (!storedFingerprint) {
        localStorage.setItem('user_security_fingerprint', userFingerprint);
      } else if (storedFingerprint !== userFingerprint) {
        this.handleSecurityBreach('User fingerprint mismatch');
        return false;
      }

      return true;
    } catch (error) {
      this.handleSecurityBreach('User verification failed');
      return false;
    }
  }

  // Generate unique user fingerprint
  private static generateUserFingerprint(): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Security fingerprint', 2, 2);
    }
    
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      canvas.toDataURL(),
      this.SECURITY_SALT
    ].join('|');
    
    return btoa(fingerprint).substring(0, 32);
  }

  // Security breach handler
  private static handleSecurityBreach(reason: string) {
    console.warn('Security breach detected:', reason);
    
    // Log the security event
    this.logSecurityEvent(reason);
    
    // Clear sensitive data
    localStorage.clear();
    sessionStorage.clear();
    
    // Redirect to safe state
    if (window.location.pathname !== '/') {
      window.location.href = '/';
    }
    
    // Display security warning
    document.body.innerHTML = `
      <div style="
        position: fixed; 
        top: 0; 
        left: 0; 
        width: 100%; 
        height: 100%; 
        background: #000; 
        color: #ff0000; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        font-family: monospace; 
        font-size: 24px; 
        z-index: 99999;
      ">
        SECURITY BREACH DETECTED<br>
        ACCESS DENIED<br>
        INCIDENT LOGGED
      </div>
    `;
  }

  // Security event logging
  private static async logSecurityEvent(reason: string) {
    try {
      await supabase.from('audit_logs').insert({
        user_id: 'vip-creator-2025',
        action: 'security_breach',
        resource_type: 'application',
        details: {
          reason,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href,
          referrer: document.referrer
        }
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }

  // Initialize all security measures
  static initializeSecuritySuite() {
    // Validate environment first
    if (!this.validateEnvironment()) {
      return;
    }

    // Initialize anti-debugging
    this.initAntiDebugging();

    // Verify application integrity
    if (!this.verifyApplicationIntegrity()) {
      return;
    }

    // Verify authorized user
    this.verifyAuthorizedUser();

    // Set up periodic security checks
    setInterval(() => {
      this.verifyApplicationIntegrity();
      this.verifyAuthorizedUser();
    }, 30000); // Check every 30 seconds

    console.log('🛡️ Military-grade security suite initialized');
  }
}

export default SecurityHardening;
