
import { supabase } from '@/integrations/supabase/client';

export interface TrafficAnalytics {
  id?: string;
  user_id?: string;
  date: string;
  visitors: number;
  page_views: number;
  bounce_rate: number;
  avg_session_duration: number;
  conversion_rate: number;
  traffic_sources: Record<string, number>;
}

export interface VisitorSession {
  id?: string;
  user_id?: string;
  session_id: string;
  visitor_ip?: string;
  user_agent?: string;
  referrer?: string;
  landing_page?: string;
  country?: string;
  city?: string;
  device_type?: string;
  browser?: string;
  started_at?: string;
  ended_at?: string;
  page_views: number;
  actions: any[];
}

export interface TrafficAlert {
  id?: string;
  user_id?: string;
  alert_type: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'success';
  data: Record<string, any>;
  read: boolean;
}

export interface AutomationRule {
  id?: string;
  user_id?: string;
  name: string;
  trigger_type: string;
  trigger_conditions: Record<string, any>;
  actions: Record<string, any>;
  enabled: boolean;
  executions_count: number;
  last_execution?: string;
}

export interface PerformanceMetric {
  id?: string;
  user_id?: string;
  metric_type: string;
  value: number;
  unit?: string;
  timestamp?: string;
  metadata: Record<string, any>;
}

export interface CompetitorData {
  id?: string;
  user_id?: string;
  competitor_name: string;
  website_url: string;
  traffic_estimate?: number;
  ranking_keywords: string[];
  social_metrics: Record<string, any>;
  last_updated?: string;
}

export interface ContentCalendar {
  id?: string;
  user_id?: string;
  title: string;
  content_type: string;
  platform: string;
  scheduled_date: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  content_data: Record<string, any>;
}

export interface APIIntegration {
  id?: string;
  user_id?: string;
  service_name: string;
  api_key_encrypted?: string;
  configuration: Record<string, any>;
  status: 'active' | 'inactive' | 'error';
  last_sync?: string;
}

class BackendService {
  // Traffic Analytics
  async saveTrafficAnalytics(data: TrafficAnalytics) {
    const { data: result, error } = await supabase
      .from('traffic_analytics')
      .insert([data])
      .select()
      .single();
    
    if (error) throw error;
    return result;
  }

  async getTrafficAnalytics(dateRange?: { start: string; end: string }) {
    let query = supabase
      .from('traffic_analytics')
      .select('*')
      .order('date', { ascending: false });

    if (dateRange) {
      query = query
        .gte('date', dateRange.start)
        .lte('date', dateRange.end);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  // Visitor Sessions
  async createVisitorSession(session: VisitorSession) {
    const { data, error } = await supabase
      .from('visitor_sessions')
      .insert([session])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateVisitorSession(sessionId: string, updates: Partial<VisitorSession>) {
    const { data, error } = await supabase
      .from('visitor_sessions')
      .update(updates)
      .eq('session_id', sessionId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getVisitorSessions(limit: number = 100) {
    const { data, error } = await supabase
      .from('visitor_sessions')
      .select('*')
      .order('started_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  }

  // Traffic Alerts
  async createAlert(alert: Omit<TrafficAlert, 'id' | 'user_id'>) {
    const { data, error } = await supabase
      .from('traffic_alerts')
      .insert([alert])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getAlerts(unreadOnly: boolean = false) {
    let query = supabase
      .from('traffic_alerts')
      .select('*')
      .order('created_at', { ascending: false });

    if (unreadOnly) {
      query = query.eq('read', false);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async markAlertAsRead(alertId: string) {
    const { data, error } = await supabase
      .from('traffic_alerts')
      .update({ read: true })
      .eq('id', alertId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Automation Rules
  async createAutomationRule(rule: Omit<AutomationRule, 'id' | 'user_id' | 'executions_count'>) {
    const { data, error } = await supabase
      .from('automation_rules')
      .insert([{ ...rule, executions_count: 0 }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getAutomationRules() {
    const { data, error } = await supabase
      .from('automation_rules')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async updateAutomationRule(ruleId: string, updates: Partial<AutomationRule>) {
    const { data, error } = await supabase
      .from('automation_rules')
      .update(updates)
      .eq('id', ruleId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Performance Metrics
  async savePerformanceMetric(metric: Omit<PerformanceMetric, 'id' | 'user_id'>) {
    const { data, error } = await supabase
      .from('performance_metrics')
      .insert([metric])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getPerformanceMetrics(metricType?: string, limit: number = 100) {
    let query = supabase
      .from('performance_metrics')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (metricType) {
      query = query.eq('metric_type', metricType);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  // Competitor Data
  async saveCompetitorData(competitor: Omit<CompetitorData, 'id' | 'user_id'>) {
    const { data, error } = await supabase
      .from('competitor_data')
      .insert([competitor])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getCompetitorData() {
    const { data, error } = await supabase
      .from('competitor_data')
      .select('*')
      .order('last_updated', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  // Content Calendar
  async createContentItem(content: Omit<ContentCalendar, 'id' | 'user_id'>) {
    const { data, error } = await supabase
      .from('content_calendar')
      .insert([content])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getContentCalendar(month?: string) {
    let query = supabase
      .from('content_calendar')
      .select('*')
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
    return data;
  }

  // API Integrations
  async saveAPIIntegration(integration: Omit<APIIntegration, 'id' | 'user_id'>) {
    const { data, error } = await supabase
      .from('api_integrations')
      .insert([integration])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getAPIIntegrations() {
    const { data, error } = await supabase
      .from('api_integrations')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async updateAPIIntegration(integrationId: string, updates: Partial<APIIntegration>) {
    const { data, error } = await supabase
      .from('api_integrations')
      .update(updates)
      .eq('id', integrationId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}

export const backendService = new BackendService();
