
import { supabase } from '@/integrations/supabase/client';
import { SecurityValidation } from './securityValidation';

export class SecureSessionManager {
  private static readonly SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours
  private static readonly MAX_CONCURRENT_SESSIONS = 3;

  // Enhanced session validation
  static async validateSession(): Promise<boolean> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        return false;
      }

      // Check session age
      const sessionAge = Date.now() - new Date(session.user.created_at).getTime();
      if (sessionAge > this.SESSION_TIMEOUT) {
        console.warn('🛡️ Session expired, requiring re-authentication');
        await this.secureSignOut();
        return false;
      }

      // Validate user ID format
      if (!SecurityValidation.isValidUUID(session.user.id)) {
        console.error('🛡️ Invalid session user ID format');
        await this.secureSignOut();
        return false;
      }

      // Log session validation
      await SecurityValidation.logSecurityEvent(
        session.user.id,
        'session_validated',
        {
          session_age_minutes: Math.floor(sessionAge / (1000 * 60)),
          user_email: session.user.email
        }
      );

      return true;
    } catch (error) {
      console.error('🛡️ Session validation error:', error);
      return false;
    }
  }

  // Secure sign out with cleanup
  static async secureSignOut(): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        await SecurityValidation.logSecurityEvent(
          user.id,
          'secure_signout',
          { timestamp: new Date().toISOString() }
        );
      }

      // Clear all client-side storage
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear cookies if any
      document.cookie.split(";").forEach(cookie => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      });

      await supabase.auth.signOut();
    } catch (error) {
      console.error('🛡️ Secure sign out error:', error);
    }
  }

  // Monitor for suspicious session activity
  static monitorSessionActivity(): void {
    let lastActivity = Date.now();
    let suspiciousActivityCount = 0;

    // Monitor for rapid tab switching or unusual patterns
    document.addEventListener('visibilitychange', () => {
      const now = Date.now();
      if (now - lastActivity < 100) { // Very rapid switching
        suspiciousActivityCount++;
        if (suspiciousActivityCount > 10) {
          this.handleSuspiciousActivity('rapid_tab_switching');
        }
      }
      lastActivity = now;
    });

    // Monitor for suspicious key combinations
    document.addEventListener('keydown', (e) => {
      const suspiciousCombos = [
        { ctrl: true, shift: true, key: 'I' }, // Dev tools
        { ctrl: true, shift: true, key: 'C' }, // Console
        { ctrl: true, shift: true, key: 'J' }, // Console
        { key: 'F12' } // Dev tools
      ];

      const isMatch = suspiciousCombos.some(combo => 
        Object.entries(combo).every(([prop, value]) => 
          prop === 'key' ? e.key === value : e[prop as keyof KeyboardEvent] === value
        )
      );

      if (isMatch) {
        suspiciousActivityCount++;
        if (suspiciousActivityCount > 5) {
          this.handleSuspiciousActivity('dev_tools_access');
        }
      }
    });

    // Reset suspicious activity count periodically
    setInterval(() => {
      suspiciousActivityCount = Math.max(0, suspiciousActivityCount - 1);
    }, 60000); // Every minute
  }

  private static async handleSuspiciousActivity(activityType: string): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      await SecurityValidation.logSecurityEvent(
        user?.id || null,
        'suspicious_activity',
        {
          activity_type: activityType,
          timestamp: new Date().toISOString(),
          user_agent: navigator.userAgent.substring(0, 200)
        }
      );

      console.warn('🛡️ Suspicious activity detected:', activityType);
    } catch (error) {
      console.error('🛡️ Failed to log suspicious activity:', error);
    }
  }
}
