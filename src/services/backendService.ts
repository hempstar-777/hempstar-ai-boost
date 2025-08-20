
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

// Use Supabase generated types for better type safety
type TrafficAnalytics = Database['public']['Tables']['traffic_analytics']['Row'];
type TrafficAnalyticsInsert = Database['public']['Tables']['traffic_analytics']['Insert'];
type VisitorSession = Database['public']['Tables']['visitor_sessions']['Row'];
type VisitorSessionInsert = Database['public']['Tables']['visitor_sessions']['Insert'];
type TrafficAlert = Database['public']['Tables']['traffic_alerts']['Row'];
type TrafficAlertInsert = Database['public']['Tables']['traffic_alerts']['Insert'];
type AutomationRule = Database['public']['Tables']['automation_rules']['Row'];
type AutomationRuleInsert = Database['public']['Tables']['automation_rules']['Insert'];
type PerformanceMetric = Database['public']['Tables']['performance_metrics']['Row'];
type PerformanceMetricInsert = Database['public']['Tables']['performance_metrics']['Insert'];
type CompetitorData = Database['public']['Tables']['competitor_data']['Row'];
type CompetitorDataInsert = Database['public']['Tables']['competitor_data']['Insert'];
type ContentCalendar = Database['public']['Tables']['content_calendar']['Row'];
type ContentCalendarInsert = Database['public']['Tables']['content_calendar']['Insert'];
type APIIntegration = Database['public']['Tables']['api_integrations']['Row'];
type APIIntegrationInsert = Database['public']['Tables']['api_integrations']['Insert'];

class BackendService {
  private async getCurrentUserId(): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    return user.id;
  }

  // Traffic Analytics
  async saveTrafficAnalytics(data: Omit<TrafficAnalyticsInsert, 'user_id'>) {
    const userId = await this.getCurrentUserId();
    const { data: result, error } = await supabase
      .from('traffic_analytics')
      .insert([{ ...data, user_id: userId }])
      .select()
      .single();
    
    if (error) throw error;
    return result;
  }

  async getTrafficAnalytics(dateRange?: { start: string; end: string }): Promise<TrafficAnalytics[]> {
    const userId = await this.getCurrentUserId();
    let query = supabase
      .from('traffic_analytics')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (dateRange) {
      query = query
        .gte('date', dateRange.start)
        .lte('date', dateRange.end);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  // Visitor Sessions
  async createVisitorSession(session: Omit<VisitorSessionInsert, 'user_id'>) {
    const userId = await this.getCurrentUserId();
    const { data, error } = await supabase
      .from('visitor_sessions')
      .insert([{ ...session, user_id: userId }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateVisitorSession(sessionId: string, updates: Partial<Omit<VisitorSessionInsert, 'user_id'>>) {
    const userId = await this.getCurrentUserId();
    const { data, error } = await supabase
      .from('visitor_sessions')
      .update(updates)
      .eq('session_id', sessionId)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getVisitorSessions(limit: number = 100): Promise<VisitorSession[]> {
    const userId = await this.getCurrentUserId();
    const { data, error } = await supabase
      .from('visitor_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('started_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  }

  // Traffic Alerts
  async createAlert(alert: Omit<TrafficAlertInsert, 'user_id'>) {
    const userId = await this.getCurrentUserId();
    const { data, error } = await supabase
      .from('traffic_alerts')
      .insert([{ ...alert, user_id: userId }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getAlerts(unreadOnly: boolean = false): Promise<TrafficAlert[]> {
    const userId = await this.getCurrentUserId();
    let query = supabase
      .from('traffic_alerts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (unreadOnly) {
      query = query.eq('read', false);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  async markAlertAsRead(alertId: string) {
    const userId = await this.getCurrentUserId();
    const { data, error } = await supabase
      .from('traffic_alerts')
      .update({ read: true })
      .eq('id', alertId)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Automation Rules
  async createAutomationRule(rule: Omit<AutomationRuleInsert, 'user_id' | 'executions_count'>) {
    const userId = await this.getCurrentUserId();
    const { data, error } = await supabase
      .from('automation_rules')
      .insert([{ ...rule, user_id: userId, executions_count: 0 }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getAutomationRules(): Promise<AutomationRule[]> {
    const userId = await this.getCurrentUserId();
    const { data, error } = await supabase
      .from('automation_rules')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async updateAutomationRule(ruleId: string, updates: Partial<Omit<AutomationRuleInsert, 'user_id'>>) {
    const userId = await this.getCurrentUserId();
    const { data, error } = await supabase
      .from('automation_rules')
      .update(updates)
      .eq('id', ruleId)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Performance Metrics
  async savePerformanceMetric(metric: Omit<PerformanceMetricInsert, 'user_id'>) {
    const userId = await this.getCurrentUserId();
    const { data, error } = await supabase
      .from('performance_metrics')
      .insert([{ ...metric, user_id: userId }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getPerformanceMetrics(metricType?: string, limit: number = 100): Promise<PerformanceMetric[]> {
    const userId = await this.getCurrentUserId();
    let query = supabase
      .from('performance_metrics')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (metricType) {
      query = query.eq('metric_type', metricType);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  // Competitor Data
  async saveCompetitorData(competitor: Omit<CompetitorDataInsert, 'user_id'>) {
    const userId = await this.getCurrentUserId();
    const { data, error } = await supabase
      .from('competitor_data')
      .insert([{ ...competitor, user_id: userId }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getCompetitorData(): Promise<CompetitorData[]> {
    const userId = await this.getCurrentUserId();
    const { data, error } = await supabase
      .from('competitor_data')
      .select('*')
      .eq('user_id', userId)
      .order('last_updated', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  // Content Calendar
  async createContentItem(content: Omit<ContentCalendarInsert, 'user_id'>) {
    const userId = await this.getCurrentUserId();
    const { data, error } = await supabase
      .from('content_calendar')
      .insert([{ ...content, user_id: userId }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getContentCalendar(month?: string): Promise<ContentCalendar[]> {
    const userId = await this.getCurrentUserId();
    let query = supabase
      .from('content_calendar')
      .select('*')
      .eq('user_id', userId)
      .order('scheduled_date', { ascending: true });

    if (month) {
      const startOfMonth = `${month}-01`;
      const endOfMonth = `${month}-31`;
      query = query
        .gte('scheduled_date', startOfMonth)
        .lte('scheduled_date', endOfMonth);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  // API Integrations
  async saveAPIIntegration(integration: Omit<APIIntegrationInsert, 'user_id'>) {
    const userId = await this.getCurrentUserId();
    const { data, error } = await supabase
      .from('api_integrations')
      .insert([{ ...integration, user_id: userId }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getAPIIntegrations(): Promise<APIIntegration[]> {
    const userId = await this.getCurrentUserId();
    const { data, error } = await supabase
      .from('api_integrations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async updateAPIIntegration(integrationId: string, updates: Partial<Omit<APIIntegrationInsert, 'user_id'>>) {
    const userId = await this.getCurrentUserId();
    const { data, error } = await supabase
      .from('api_integrations')
      .update(updates)
      .eq('id', integrationId)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}

export const backendService = new BackendService();

// Export types for use in other files
export type {
  TrafficAnalytics,
  TrafficAnalyticsInsert,
  VisitorSession,
  VisitorSessionInsert,
  TrafficAlert,
  TrafficAlertInsert,
  AutomationRule,
  AutomationRuleInsert,
  PerformanceMetric,
  PerformanceMetricInsert,
  CompetitorData,
  CompetitorDataInsert,
  ContentCalendar,
  ContentCalendarInsert,
  APIIntegration,
  APIIntegrationInsert,
};
