
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RealTimeTrafficEngine } from './traffic/RealTimeTrafficEngine';
import { LiveTrafficMonitor } from './traffic/LiveTrafficMonitor';
import { TrafficAlerts } from './traffic/TrafficAlerts';
import { AutomationEngine } from './traffic/AutomationEngine';
import { PerformanceOptimizer } from './traffic/PerformanceOptimizer';
import { MasterControl } from './traffic/MasterControl';
import { useToast } from '@/hooks/use-toast';
import { 
  Activity, 
  Eye, 
  Bell, 
  Bot,
  Gauge,
  Crown
} from 'lucide-react';

export const TrafficBooster = () => {
  const { toast } = useToast();
  const [isDeploying, setIsDeploying] = React.useState(false);

  const handleMasterLaunch = async () => {
    setIsDeploying(true);
    
    // Simulate deployment process
    setTimeout(() => {
      toast({
        title: "🚀 INTERNET DOMINATION ACTIVATED!",
        description: "All traffic engines are now operating at maximum capacity! Hempstar.store is about to EXPLODE!",
      });
      setIsDeploying(false);
    }, 3000);
  };

  return (
    <Card className="bg-gradient-hemp border-0">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-black text-hemp-dark flex items-center justify-center">
          <Activity className="w-8 h-8 mr-3" />
          HEMPSTAR TRAFFIC DOMINATION SYSTEM
        </CardTitle>
        <CardDescription className="text-hemp-dark/80 font-semibold text-lg">
          AI-powered traffic generation with real-time monitoring, automation, and performance optimization
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-8">
        {/* Master Control */}
        <MasterControl 
          onMasterLaunch={handleMasterLaunch}
          isDeploying={isDeploying}
        />

        {/* Traffic System Tabs */}
        <Tabs defaultValue="engines" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-hemp-dark/10">
            <TabsTrigger value="engines" className="flex items-center">
              <Activity className="w-4 h-4 mr-2" />
              Engines
            </TabsTrigger>
            <TabsTrigger value="monitor" className="flex items-center">
              <Eye className="w-4 h-4 mr-2" />
              Monitor
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center">
              <Bell className="w-4 h-4 mr-2" />
              Alerts
            </TabsTrigger>
            <TabsTrigger value="automation" className="flex items-center">
              <Bot className="w-4 h-4 mr-2" />
              Automation
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center">
              <Gauge className="w-4 h-4 mr-2" />
              Performance
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="engines" className="mt-6">
            <RealTimeTrafficEngine />
          </TabsContent>
          
          <TabsContent value="monitor" className="mt-6">
            <LiveTrafficMonitor />
          </TabsContent>
          
          <TabsContent value="alerts" className="mt-6">
            <TrafficAlerts />
          </TabsContent>

          <TabsContent value="automation" className="mt-6">
            <AutomationEngine />
          </TabsContent>

          <TabsContent value="performance" className="mt-6">
            <PerformanceOptimizer />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
