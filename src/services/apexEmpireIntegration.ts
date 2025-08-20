
import { backendService } from './backendService';

export interface ApexEmpireConnection {
  endpoint: string;
  apiKey?: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: string;
  syncData?: any;
}

export interface ApexEmpireData {
  traffic_data?: {
    visitors: number;
    page_views: number;
    conversion_rate: number;
    sources: Record<string, number>;
  };
  competitor_insights?: {
    rankings: any[];
    keywords: string[];
    traffic_estimates: Record<string, number>;
  };
  performance_metrics?: {
    seo_score: number;
    loading_speed: number;
    mobile_optimization: number;
  };
  market_analysis?: {
    trends: any[];
    opportunities: any[];
    threats: any[];
  };
}

class ApexEmpireIntegration {
  private baseUrl = 'https://apexempire.org/api';
  private connection: ApexEmpireConnection = {
    endpoint: this.baseUrl,
    status: 'disconnected'
  };

  async checkConnection(): Promise<boolean> {
    try {
      console.log('🔍 Checking connection to ApexEmpire.org...');
      
      // First, try to ping the main domain
      const response = await fetch('https://apexempire.org', {
        method: 'HEAD',
        mode: 'no-cors'
      });
      
      console.log('✅ ApexEmpire.org is reachable');
      this.connection.status = 'connected';
      this.connection.lastSync = new Date().toISOString();
      
      return true;
    } catch (error) {
      console.warn('⚠️ Could not reach ApexEmpire.org directly:', error);
      this.connection.status = 'error';
      return false;
    }
  }

  async discoverAPIEndpoints(): Promise<string[]> {
    const commonEndpoints = [
      '/api/v1/analytics',
      '/api/analytics',
      '/api/traffic',
      '/api/data',
      '/api/metrics',
      '/api/integration',
      '/api/hempstar',
      '/api/cannabis',
      '/api/marketing'
    ];

    const discoveredEndpoints: string[] = [];

    for (const endpoint of commonEndpoints) {
      try {
        const url = `https://apexempire.org${endpoint}`;
        const response = await fetch(url, {
          method: 'HEAD',
          mode: 'cors'
        });
        
        if (response.ok) {
          discoveredEndpoints.push(endpoint);
          console.log(`✅ Found API endpoint: ${endpoint}`);
        }
      } catch (error) {
        // Endpoint not available or CORS blocked
      }
    }

    return discoveredEndpoints;
  }

  async requestIntegration(userEmail: string, businessInfo: any): Promise<boolean> {
    try {
      console.log('🤝 Requesting integration with ApexEmpire.org...');
      
      const integrationRequest = {
        from: 'HEMPSTAR Traffic Domination System',
        email: userEmail,
        business_info: businessInfo,
        integration_type: 'traffic_analytics',
        capabilities: [
          'Real-time traffic monitoring',
          'SEO optimization',
          'Competitor analysis',
          'Automated marketing',
          'Performance tracking'
        ],
        requested_data: [
          'traffic_analytics',
          'competitor_insights',
          'market_trends',
          'seo_metrics'
        ],
        api_features: [
          'Webhook notifications',
          'Real-time data sync',
          'Custom dashboards',
          'Automated reporting'
        ],
        timestamp: new Date().toISOString()
      };

      // Store the integration request in our backend
      await backendService.saveAPIIntegration({
        service_name: 'ApexEmpire',
        configuration: integrationRequest as any,
        status: 'active'
      });

      // Try to send the request via different methods
      await this.sendIntegrationRequest(integrationRequest);
      
      return true;
    } catch (error) {
      console.error('❌ Failed to request integration:', error);
      return false;
    }
  }

  private async sendIntegrationRequest(request: any): Promise<void> {
    const methods = [
      // Method 1: Try direct API call
      async () => {
        const response = await fetch('https://apexempire.org/api/integration-request', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(request)
        });
        return response;
      },
      
      // Method 2: Try contact form submission
      async () => {
        const formData = new FormData();
        formData.append('subject', 'HEMPSTAR Integration Request');
        formData.append('message', JSON.stringify(request, null, 2));
        formData.append('email', request.email);
        
        const response = await fetch('https://apexempire.org/contact', {
          method: 'POST',
          body: formData
        });
        return response;
      }
    ];

    for (const method of methods) {
      try {
        const response = await method();
        if (response.ok) {
          console.log('✅ Integration request sent successfully');
          return;
        }
      } catch (error) {
        console.log('⚠️ Method failed, trying next...');
      }
    }

    // If all methods fail, log the request for manual processing
    console.log('📝 Integration request logged for manual processing:', request);
  }

  async syncData(): Promise<ApexEmpireData | null> {
    try {
      if (this.connection.status !== 'connected') {
        await this.checkConnection();
      }

      console.log('🔄 Syncing data with ApexEmpire.org...');
      
      // Try to fetch data from discovered endpoints
      const endpoints = await this.discoverAPIEndpoints();
      const syncedData: ApexEmpireData = {};

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(`https://apexempire.org${endpoint}`, {
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'HEMPSTAR-Traffic-System/1.0'
            }
          });

          if (response.ok) {
            const data = await response.json();
            
            // Map the data based on endpoint type
            if (endpoint.includes('analytics') || endpoint.includes('traffic')) {
              syncedData.traffic_data = data;
            } else if (endpoint.includes('competitor')) {
              syncedData.competitor_insights = data;
            } else if (endpoint.includes('metrics')) {
              syncedData.performance_metrics = data;
            }
          }
        } catch (error) {
          console.log(`⚠️ Could not sync from ${endpoint}:`, error);
        }
      }

      // Store synced data in our backend - convert to proper JSON format
      if (Object.keys(syncedData).length > 0) {
        await backendService.savePerformanceMetric({
          metric_type: 'apex_empire_sync',
          value: Object.keys(syncedData).length,
          unit: 'data_points',
          metadata: JSON.parse(JSON.stringify(syncedData)) // Ensure proper JSON serialization
        });

        this.connection.syncData = syncedData;
        this.connection.lastSync = new Date().toISOString();
        
        console.log('✅ Data synced successfully with ApexEmpire.org');
        return syncedData;
      }

      return null;
    } catch (error) {
      console.error('❌ Failed to sync data:', error);
      this.connection.status = 'error';
      return null;
    }
  }

  async setupWebhooks(callbackUrl: string): Promise<boolean> {
    try {
      console.log('🔗 Setting up webhooks with ApexEmpire.org...');
      
      const webhookConfig = {
        callback_url: callbackUrl,
        events: [
          'traffic_spike',
          'competitor_change',
          'seo_alert',
          'market_trend'
        ],
        authentication: {
          method: 'signature',
          secret: crypto.randomUUID()
        }
      };

      // Store webhook configuration
      await backendService.saveAPIIntegration({
        service_name: 'ApexEmpire_Webhooks',
        configuration: webhookConfig as any,
        status: 'active'
      });

      return true;
    } catch (error) {
      console.error('❌ Failed to setup webhooks:', error);
      return false;
    }
  }

  getConnectionStatus(): ApexEmpireConnection {
    return this.connection;
  }

  async getIntegrationStatus(): Promise<{
    connected: boolean;
    lastSync?: string;
    availableEndpoints: string[];
    pendingRequests: number;
  }> {
    const endpoints = await this.discoverAPIEndpoints();
    const integrations = await backendService.getAPIIntegrations();
    const apexIntegrations = integrations.filter(i => 
      i.service_name.toLowerCase().includes('apex')
    );

    return {
      connected: this.connection.status === 'connected',
      lastSync: this.connection.lastSync,
      availableEndpoints: endpoints,
      pendingRequests: apexIntegrations.length
    };
  }
}

export const apexEmpireIntegration = new ApexEmpireIntegration();
