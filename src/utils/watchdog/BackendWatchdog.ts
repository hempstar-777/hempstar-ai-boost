import { BaseWatchdog } from './BaseWatchdog';
import { supabase } from '@/integrations/supabase/client';

export class BackendWatchdog extends BaseWatchdog {
  private consecutiveFailures = 0;
  private lastHealthCheck = 0;

  constructor() {
    super('Backend', 20000); // Check every 20 seconds
  }

  protected async performCheck(): Promise<void> {
    await this.checkSupabaseConnection();
    await this.checkEdgeFunctions();
    await this.checkDatabaseHealth();
    await this.monitorAPIErrors();
  }

  private async checkSupabaseConnection(): Promise<void> {
    try {
      const { data, error } = await supabase.from('ai_agents').select('id').limit(1);
      
      if (error) {
        this.consecutiveFailures++;
        await this.logIssue(`Supabase connection error: ${error.message}`, 'high');
        
        if (this.consecutiveFailures > 3) {
          await this.autoFix('Reset Supabase client', async () => {
            // Force reconnection by clearing any cached connections
            await supabase.auth.signOut();
            await supabase.auth.getSession();
          });
        }
      } else {
        this.consecutiveFailures = 0;
      }
    } catch (error) {
      await this.logIssue(`Supabase health check failed: ${error}`, 'medium');
    }
  }

  private async checkEdgeFunctions(): Promise<void> {
    try {
      // Only check protected edge functions when a user is authenticated
      const { data: authData } = await supabase.auth.getSession();
      if (!authData?.session) {
        return; // Skip to avoid 401s that trigger preview error modals
      }

      const { error } = await supabase.functions.invoke('enhanced-ai-executor', {
        body: { action: 'health_check' }
      });

      if (error) {
        await this.logIssue(`Edge function error: ${error.message}`, 'medium');
      }
    } catch (error) {
      await this.logIssue(`Edge function check failed: ${error}`, 'low');
    }
  }

  private async checkDatabaseHealth(): Promise<void> {
    const now = Date.now();
    if (now - this.lastHealthCheck < 60000) return; // Only check once per minute

    try {
      const startTime = Date.now();
      // Simple lightweight query to validate connectivity without PostgREST count syntax
      const { error } = await supabase
        .from('ai_agents')
        .select('id')
        .limit(1);

      const responseTime = Date.now() - startTime;

      if (responseTime > 5000) {
        await this.logIssue(`Slow database response: ${responseTime}ms`, 'medium');
      }

      if (error) {
        await this.logIssue(`Database health check failed: ${error.message}`, 'high');
      }

      this.lastHealthCheck = now;
    } catch (error) {
      await this.logIssue(`Database health check exception: ${error}`, 'medium');
    }
  }

  private async monitorAPIErrors(): Promise<void> {
    // Check for API error patterns in localStorage
    const errorLogs = Object.keys(localStorage).filter(key => 
      key.includes('error') || key.includes('failed')
    );

    if (errorLogs.length > 10) {
      await this.logIssue('High number of stored error logs detected', 'medium');
      
      await this.autoFix('Clean old error logs', async () => {
        errorLogs.forEach(key => {
          try {
            const data = localStorage.getItem(key);
            if (data) {
              const parsed = JSON.parse(data);
              // Keep only recent errors (last hour)
              const recent = parsed.filter((item: any) => {
                if (item.timestamp) {
                  return Date.now() - new Date(item.timestamp).getTime() < 60 * 60 * 1000;
                }
                return false;
              });
              
              if (recent.length > 0) {
                localStorage.setItem(key, JSON.stringify(recent));
              } else {
                localStorage.removeItem(key);
              }
            }
          } catch (e) {
            localStorage.removeItem(key);
          }
        });
      });
    }
  }
}
