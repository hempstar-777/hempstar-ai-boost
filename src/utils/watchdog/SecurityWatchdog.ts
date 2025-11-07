
import { BaseWatchdog } from './BaseWatchdog';
import { supabase } from '@/integrations/supabase/client';
import { SecureSessionManager } from '../secureSessionManager';
import { SecurityValidation } from '../securityValidation';

export class SecurityWatchdog extends BaseWatchdog {
  private lastSessionCheck = 0;
  private failedAttempts = 0;

  constructor() {
    super('Security', 15000); // Check every 15 seconds
  }

  protected async performCheck(): Promise<void> {
    await this.checkSessionHealth();
    await this.checkDomainSecurity();
    await this.checkRateLimits();
    await this.checkSecurityEvents();
  }

  private async checkSessionHealth(): Promise<void> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        this.failedAttempts++;
        if (this.failedAttempts > 3) {
          await this.logIssue('Multiple session validation failures', 'high');
          await this.autoFix('Clear corrupted session data', async () => {
            localStorage.removeItem('supabase.auth.token');
            sessionStorage.clear();
            window.location.reload();
          });
        }
        return;
      }

      // Check session expiration - FIX: Use expires_at instead of created_at
      const now = Date.now();
      const expiresAt = session.expires_at ? session.expires_at * 1000 : now + (24 * 60 * 60 * 1000);
      
      if (now > expiresAt - (5 * 60 * 1000)) { // 5 minutes before expiry
        await this.autoFix('Refresh expiring session', async () => {
          await supabase.auth.refreshSession();
        });
      }

      this.failedAttempts = 0; // Reset on success
    } catch (error) {
      await this.logIssue(`Session check failed: ${error}`, 'medium');
    }
  }

  private async checkDomainSecurity(): Promise<void> {
    const currentDomain = window.location.hostname;
    
    // Allow staging/preview domains and production
    const allowedDomains = [
      'localhost',
      '127.0.0.1',
      'hempstar.ai',
      'lovable.app',
      'lovableproject.com',
      'sandbox.lovable.dev'
    ];
    
    const isDomainAllowed = allowedDomains.some(domain => 
      currentDomain === domain || currentDomain.endsWith(domain)
    );

    if (!isDomainAllowed) {
      await this.logIssue(`Suspicious domain detected: ${currentDomain}`, 'high');
      // Do not redirect automatically in preview; just log the issue
    }

    // Check HTTPS in production
    if (!currentDomain.includes('localhost') && 
        !currentDomain.includes('127.0.0.1') && 
        !currentDomain.includes('lovable.app') &&
        !currentDomain.includes('lovableproject.com') &&
        window.location.protocol !== 'https:') {
      await this.logIssue('Insecure HTTP connection in production', 'high');
    }
  }

  private async checkRateLimits(): Promise<void> {
    // Check if any rate limits are being hit
    const rateLimitKeys = Object.keys(localStorage).filter(key => 
      key.startsWith('rate_limit_')
    );

    for (const key of rateLimitKeys) {
      try {
        const data = JSON.parse(localStorage.getItem(key) || '{}');
        if (data.requests && data.requests.length > 80) { // Near limit
          await this.logIssue(`Rate limit approaching for ${key}`, 'medium');
        }
      } catch (error) {
        // Clean up corrupted rate limit data
        localStorage.removeItem(key);
      }
    }
  }

  private async checkSecurityEvents(): Promise<void> {
    try {
      const events = localStorage.getItem('security_events');
      if (events) {
        const parsedEvents = JSON.parse(events);
        const recentEvents = parsedEvents.filter((event: any) => {
          const eventTime = new Date(event.timestamp).getTime();
          return Date.now() - eventTime < 5 * 60 * 1000; // Last 5 minutes
        });

        const criticalEvents = recentEvents.filter((event: any) => 
          event.event_type.includes('suspicious') || 
          event.event_type.includes('unauthorized')
        );

        if (criticalEvents.length > 5) {
          await this.logIssue('Multiple critical security events detected', 'high');
        }
      }
    } catch (error) {
      await this.logIssue('Failed to check security events', 'low');
    }
  }
}
