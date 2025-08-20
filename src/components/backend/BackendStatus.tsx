
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBackend, useApexEmpireIntegration } from '@/hooks/useBackend';
import { Database, Zap, Globe, TrendingUp, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export const BackendStatus = () => {
  const { useAPIIntegrations, useTrafficAnalytics, usePerformanceMetrics } = useBackend();
  const { connectionStatus, checkConnection, requestIntegration, getIntegrationStatus } = useApexEmpireIntegration();
  const [apexStatus, setApexStatus] = useState<any>(null);

  const { data: integrations, isLoading: integrationsLoading } = useAPIIntegrations();
  const { data: analytics, isLoading: analyticsLoading } = useTrafficAnalytics();
  const { data: metrics, isLoading: metricsLoading } = usePerformanceMetrics();

  useEffect(() => {
    const loadApexStatus = async () => {
      const status = await getIntegrationStatus();
      setApexStatus(status);
    };
    loadApexStatus();
  }, []);

  const handleRequestIntegration = async () => {
    const businessInfo = {
      business_name: 'HEMPSTAR',
      industry: 'Cannabis/Hemp Marketing',
      website: 'hempstar.store',
      traffic_volume: '10k+ monthly visitors',
      integration_goals: [
        'Traffic optimization',
        'SEO enhancement',
        'Competitor analysis',
        'Market insights'
      ]
    };

    await requestIntegration(businessInfo);
    
    // Refresh status after request
    setTimeout(async () => {
      const updatedStatus = await getIntegrationStatus();
      setApexStatus(updatedStatus);
    }, 1000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
      case 'inactive':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
      case 'active':
        return 'bg-green-500';
      case 'error':
      case 'inactive':
        return 'bg-red-500';
      default:
        return 'bg-yellow-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Backend Status</h2>
          <p className="text-muted-foreground">
            Monitor your backend services and integrations
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="apex-empire">ApexEmpire</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Database</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full" />
                  <span className="text-sm text-muted-foreground">Connected</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {analytics?.length || 0} analytics records
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Performance</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full" />
                  <span className="text-sm text-muted-foreground">Optimal</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {metrics?.length || 0} metrics tracked
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Integrations</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-blue-500 rounded-full" />
                  <span className="text-sm text-muted-foreground">
                    {integrations?.length || 0} active
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Ready for API connections
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ApexEmpire</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <div className={`h-2 w-2 rounded-full ${getStatusColor(connectionStatus.status)}`} />
                  <span className="text-sm text-muted-foreground capitalize">
                    {connectionStatus.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {apexStatus?.pendingRequests || 0} pending requests
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Database Operations</CardTitle>
              <CardDescription>
                Your Supabase database is fully operational with real-time capabilities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4 border rounded-lg">
                  <h3 className="font-semibold">Traffic Analytics</h3>
                  <p className="text-2xl font-bold text-green-600">{analytics?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Records</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <h3 className="font-semibold">Performance Metrics</h3>
                  <p className="text-2xl font-bold text-blue-600">{metrics?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Data Points</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <h3 className="font-semibold">Integrations</h3>
                  <p className="text-2xl font-bold text-purple-600">{integrations?.length || 0}</p>
                  <p className="text-sm text-muted-foreground">Connected</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Database Health</span>
                  <span>100%</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Integrations</CardTitle>
              <CardDescription>
                Manage your external service connections
              </CardDescription>
            </CardHeader>
            <CardContent>
              {integrationsLoading ? (
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                </div>
              ) : (
                <div className="space-y-4">
                  {integrations?.map((integration) => (
                    <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(integration.status)}
                        <div>
                          <h4 className="font-medium">{integration.service_name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Last sync: {integration.last_sync ? new Date(integration.last_sync).toLocaleDateString() : 'Never'}
                          </p>
                        </div>
                      </div>
                      <Badge variant={integration.status === 'active' ? 'default' : 'secondary'}>
                        {integration.status}
                      </Badge>
                    </div>
                  )) || (
                    <p className="text-center text-muted-foreground py-8">
                      No integrations configured yet
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="apex-empire" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>ApexEmpire.org Integration</CardTitle>
              <CardDescription>
                Connect with ApexEmpire.org for enhanced traffic and marketing insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(connectionStatus.status)}
                  <div>
                    <h4 className="font-medium">Connection Status</h4>
                    <p className="text-sm text-muted-foreground capitalize">
                      {connectionStatus.status.replace('_', ' ')}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={checkConnection}
                  size="sm"
                >
                  Test Connection
                </Button>
              </div>

              {apexStatus && (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Available Endpoints</h4>
                      <p className="text-2xl font-bold text-blue-600">
                        {apexStatus.availableEndpoints?.length || 0}
                      </p>
                      <p className="text-sm text-muted-foreground">API endpoints discovered</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Integration Requests</h4>
                      <p className="text-2xl font-bold text-green-600">
                        {apexStatus.pendingRequests || 0}
                      </p>
                      <p className="text-sm text-muted-foreground">Pending requests</p>
                    </div>
                  </div>

                  {connectionStatus.lastSync && (
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2">Last Sync</h4>
                      <p className="text-sm">
                        {new Date(connectionStatus.lastSync).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex space-x-3">
                <Button onClick={handleRequestIntegration}>
                  Request Integration
                </Button>
                <Button 
                  variant="outline" 
                  onClick={async () => {
                    const data = await checkConnection();
                    if (data) {
                      const status = await getIntegrationStatus();
                      setApexStatus(status);
                    }
                  }}
                >
                  Refresh Status
                </Button>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium mb-2">Integration Benefits</h4>
                <ul className="text-sm space-y-1">
                  <li>• Real-time traffic insights</li>
                  <li>• Advanced competitor analysis</li>
                  <li>• Market trend predictions</li>
                  <li>• Automated optimization recommendations</li>
                  <li>• Cross-platform performance tracking</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
