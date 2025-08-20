
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { SecurityValidation } from '@/utils/securityValidation';

// Enhanced backend service with security features
class SecureBackendService {
  private async getCurrentUserId(): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    
    // Validate UUID format
    if (!SecurityValidation.isValidUUID(user.id)) {
      throw new Error('Invalid user ID format');
    }
    
    return user.id;
  }

  private async checkRateLimit(operation: string): Promise<void> {
    const userId = await this.getCurrentUserId();
    const rateLimitOk = await SecurityValidation.checkRateLimit(userId, operation, 100);
    
    if (!rateLimitOk) {
      throw new Error(`Rate limit exceeded for ${operation}`);
    }
  }

  private validateInput(data: any): any {
    if (typeof data === 'object' && data !== null) {
      const validated: any = {};
      
      for (const [key, value] of Object.entries(data)) {
        if (typeof value === 'string') {
          validated[key] = SecurityValidation.sanitizeInput(value);
        } else if (typeof value === 'number' && isFinite(value)) {
          validated[key] = value;
        } else if (typeof value === 'boolean') {
          validated[key] = value;
        } else if (value === null || value === undefined) {
          validated[key] = value;
        } else if (typeof value === 'object') {
          validated[key] = this.validateInput(value);
        }
      }
      
      return validated;
    }
    
    return data;
  }

  // Enhanced traffic analytics with security
  async saveTrafficAnalytics(data: any) {
    await this.checkRateLimit('save_traffic_analytics');
    const userId = await this.getCurrentUserId();
    const validatedData = this.validateInput(data);
    
    const { data: result, error } = await supabase
      .from('traffic_analytics')
      .insert([{ ...validatedData, user_id: userId }])
      .select()
      .single();
    
    if (error) {
      await SecurityValidation.logSecurityEvent(
        userId,
        'traffic_analytics_save_failed',
        { error: error.message, data: validatedData }
      );
      throw error;
    }
    
    return result;
  }

  async getTrafficAnalytics(dateRange?: { start: string; end: string }) {
    await this.checkRateLimit('get_traffic_analytics');
    const userId = await this.getCurrentUserId();
    
    let query = supabase
      .from('traffic_analytics')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(1000); // Prevent excessive data retrieval

    if (dateRange) {
      // Validate date format
      if (!dateRange.start.match(/^\d{4}-\d{2}-\d{2}$/) || 
          !dateRange.end.match(/^\d{4}-\d{2}-\d{2}$/)) {
        throw new Error('Invalid date format');
      }
      
      query = query
        .gte('date', dateRange.start)
        .lte('date', dateRange.end);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  // Enhanced visitor sessions with security
  async createVisitorSession(sessionData: any) {
    await this.checkRateLimit('create_visitor_session');
    const userId = await this.getCurrentUserId();
    const validatedData = this.validateInput(sessionData);
    
    // Additional validation for session data
    if (validatedData.visitor_ip) {
      // Basic IP validation
      const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
      if (!ipRegex.test(validatedData.visitor_ip)) {
        delete validatedData.visitor_ip; // Remove invalid IP
      }
    }
    
    const { data, error } = await supabase
      .from('visitor_sessions')
      .insert([{ ...validatedData, user_id: userId }])
      .select()
      .single();
    
    if (error) {
      await SecurityValidation.logSecurityEvent(
        userId,
        'visitor_session_create_failed',
        { error: error.message }
      );
      throw error;
    }
    
    return data;
  }

  // Enhanced alert creation with security
  async createAlert(alertData: any) {
    await this.checkRateLimit('create_alert');
    const userId = await this.getCurrentUserId();
    const validatedData = this.validateInput(alertData);
    
    // Validate alert severity
    const allowedSeverities = ['info', 'warning', 'error', 'critical'];
    if (!allowedSeverities.includes(validatedData.severity)) {
      validatedData.severity = 'info';
    }
    
    const { data, error } = await supabase
      .from('traffic_alerts')
      .insert([{ ...validatedData, user_id: userId }])
      .select()
      .single();
    
    if (error) {
      await SecurityValidation.logSecurityEvent(
        userId,
        'alert_create_failed',
        { error: error.message, alert_type: validatedData.alert_type }
      );
      throw error;
    }
    
    return data;
  }

  // Get security events for the current user
  async getSecurityEvents(limit: number = 50) {
    await this.checkRateLimit('get_security_events');
    const userId = await this.getCurrentUserId();
    
    const { data, error } = await supabase
      .from('security_events')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(Math.min(limit, 100)); // Cap at 100 records
    
    if (error) throw error;
    return data || [];
  }
}

export const secureBackendService = new SecureBackendService();
