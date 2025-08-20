
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  backendService, 
  type TrafficAnalyticsInsert, 
  type VisitorSessionInsert, 
  type TrafficAlertInsert,
  type AutomationRuleInsert,
  type PerformanceMetricInsert,
  type CompetitorDataInsert,
  type ContentCalendarInsert,
  type APIIntegrationInsert
} from '@/services/backendService';
import { apexEmpireIntegration, ApexEmpireData } from '@/services/apexEmpireIntegration';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/hooks/use-toast';

export const useBackend = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Traffic Analytics
  const useTrafficAnalytics = (dateRange?: { start: string; end: string }) => {
    return useQuery({
      queryKey: ['traffic-analytics', dateRange],
      queryFn: () => backendService.getTrafficAnalytics(dateRange),
      enabled: !!user,
    });
  };

  const useSaveTrafficAnalytics = () => {
    return useMutation({
      mutationFn: (data: Omit<TrafficAnalyticsInsert, 'user_id'>) => backendService.saveTrafficAnalytics(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['traffic-analytics'] });
        toast({
          title: "Analytics Saved",
          description: "Traffic analytics data has been saved successfully.",
        });
      },
      onError: (error) => {
        console.error('Save traffic analytics error:', error);
        toast({
          title: "Error",
          description: "Failed to save traffic analytics data.",
          variant: "destructive",
        });
      },
    });
  };

  // Visitor Sessions
  const useVisitorSessions = (limit?: number) => {
    return useQuery({
      queryKey: ['visitor-sessions', limit],
      queryFn: () => backendService.getVisitorSessions(limit),
      enabled: !!user,
    });
  };

  const useCreateVisitorSession = () => {
    return useMutation({
      mutationFn: (session: Omit<VisitorSessionInsert, 'user_id'>) => backendService.createVisitorSession(session),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['visitor-sessions'] });
      },
      onError: (error) => {
        console.error('Create visitor session error:', error);
      },
    });
  };

  // Traffic Alerts
  const useTrafficAlerts = (unreadOnly?: boolean) => {
    return useQuery({
      queryKey: ['traffic-alerts', unreadOnly],
      queryFn: () => backendService.getAlerts(unreadOnly),
      enabled: !!user,
    });
  };

  const useCreateAlert = () => {
    return useMutation({
      mutationFn: (alert: Omit<TrafficAlertInsert, 'user_id'>) => backendService.createAlert(alert),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['traffic-alerts'] });
        toast({
          title: "Alert Created",
          description: "New traffic alert has been created.",
        });
      },
      onError: (error) => {
        console.error('Create alert error:', error);
      },
    });
  };

  // Performance Metrics
  const usePerformanceMetrics = (metricType?: string, limit?: number) => {
    return useQuery({
      queryKey: ['performance-metrics', metricType, limit],
      queryFn: () => backendService.getPerformanceMetrics(metricType, limit),
      enabled: !!user,
    });
  };

  const useSavePerformanceMetric = () => {
    return useMutation({
      mutationFn: (metric: Omit<PerformanceMetricInsert, 'user_id'>) => backendService.savePerformanceMetric(metric),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['performance-metrics'] });
      },
      onError: (error) => {
        console.error('Save performance metric error:', error);
      },
    });
  };

  // Automation Rules
  const useAutomationRules = () => {
    return useQuery({
      queryKey: ['automation-rules'],
      queryFn: () => backendService.getAutomationRules(),
      enabled: !!user,
    });
  };

  const useCreateAutomationRule = () => {
    return useMutation({
      mutationFn: (rule: Omit<AutomationRuleInsert, 'user_id' | 'executions_count'>) => backendService.createAutomationRule(rule),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['automation-rules'] });
        toast({
          title: "Automation Rule Created",
          description: "New automation rule has been created successfully.",
        });
      },
      onError: (error) => {
        console.error('Create automation rule error:', error);
      },
    });
  };

  // Competitor Data
  const useCompetitorData = () => {
    return useQuery({
      queryKey: ['competitor-data'],
      queryFn: () => backendService.getCompetitorData(),
      enabled: !!user,
    });
  };

  const useSaveCompetitorData = () => {
    return useMutation({
      mutationFn: (competitor: Omit<CompetitorDataInsert, 'user_id'>) => backendService.saveCompetitorData(competitor),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['competitor-data'] });
        toast({
          title: "Competitor Data Saved",
          description: "Competitor analysis data has been saved.",
        });
      },
      onError: (error) => {
        console.error('Save competitor data error:', error);
      },
    });
  };

  // Content Calendar
  const useContentCalendar = (month?: string) => {
    return useQuery({
      queryKey: ['content-calendar', month],
      queryFn: () => backendService.getContentCalendar(month),
      enabled: !!user,
    });
  };

  const useCreateContentItem = () => {
    return useMutation({
      mutationFn: (content: Omit<ContentCalendarInsert, 'user_id'>) => backendService.createContentItem(content),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['content-calendar'] });
        toast({
          title: "Content Scheduled",
          description: "Content item has been added to your calendar.",
        });
      },
      onError: (error) => {
        console.error('Create content item error:', error);
      },
    });
  };

  // API Integrations
  const useAPIIntegrations = () => {
    return useQuery({
      queryKey: ['api-integrations'],
      queryFn: () => backendService.getAPIIntegrations(),
      enabled: !!user,
    });
  };

  return {
    // Traffic Analytics
    useTrafficAnalytics,
    useSaveTrafficAnalytics,
    
    // Visitor Sessions
    useVisitorSessions,
    useCreateVisitorSession,
    
    // Traffic Alerts
    useTrafficAlerts,
    useCreateAlert,
    
    // Performance Metrics
    usePerformanceMetrics,
    useSavePerformanceMetric,
    
    // Automation Rules
    useAutomationRules,
    useCreateAutomationRule,
    
    // Competitor Data
    useCompetitorData,
    useSaveCompetitorData,
    
    // Content Calendar
    useContentCalendar,
    useCreateContentItem,
    
    // API Integrations
    useAPIIntegrations,
  };
};

export const useApexEmpireIntegration = () => {
  const [connectionStatus, setConnectionStatus] = useState(apexEmpireIntegration.getConnectionStatus());
  const { user } = useAuth();
  const { toast } = useToast();

  const checkConnection = async () => {
    const isConnected = await apexEmpireIntegration.checkConnection();
    setConnectionStatus(apexEmpireIntegration.getConnectionStatus());
    
    if (isConnected) {
      toast({
        title: "ApexEmpire Connection",
        description: "Successfully connected to ApexEmpire.org!",
      });
    } else {
      toast({
        title: "Connection Issue",
        description: "Could not establish connection to ApexEmpire.org",
        variant: "destructive",
      });
    }
    
    return isConnected;
  };

  const requestIntegration = async (businessInfo: any) => {
    if (!user?.email) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to request integration.",
        variant: "destructive",
      });
      return false;
    }

    const success = await apexEmpireIntegration.requestIntegration(user.email, businessInfo);
    
    if (success) {
      toast({
        title: "Integration Requested",
        description: "Your integration request has been sent to ApexEmpire.org!",
      });
    } else {
      toast({
        title: "Request Failed",
        description: "Failed to send integration request. Please try again.",
        variant: "destructive",
      });
    }
    
    return success;
  };

  const syncData = async (): Promise<ApexEmpireData | null> => {
    const data = await apexEmpireIntegration.syncData();
    setConnectionStatus(apexEmpireIntegration.getConnectionStatus());
    
    if (data) {
      toast({
        title: "Data Synced",
        description: "Successfully synced data with ApexEmpire.org!",
      });
    }
    
    return data;
  };

  const getIntegrationStatus = async () => {
    return await apexEmpireIntegration.getIntegrationStatus();
  };

  useEffect(() => {
    // Auto-check connection on mount
    if (user) {
      checkConnection();
    }
  }, [user]);

  return {
    connectionStatus,
    checkConnection,
    requestIntegration,
    syncData,
    getIntegrationStatus,
  };
};
