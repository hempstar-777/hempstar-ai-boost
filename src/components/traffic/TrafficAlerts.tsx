
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  TrendingDown,
  Users,
  Zap,
  Target,
  Bell,
  X
} from 'lucide-react';

interface TrafficAlert {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  action?: string;
  dismissed: boolean;
  metric?: {
    label: string;
    value: string;
    change: string;
  };
}

const generateAlerts = (): TrafficAlert[] => [
  {
    id: '1',
    type: 'success',
    title: 'Traffic Surge Detected!',
    message: 'Instagram campaign driving +347% more visitors to embroidered hoodies collection',
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    dismissed: false,
    metric: { label: 'New Visitors', value: '1,247', change: '+347%' }
  },
  {
    id: '2',
    type: 'warning',
    title: 'Conversion Rate Drop',
    message: 'Checkout page conversion down 15% in last hour - investigate payment flow',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    action: 'Check Checkout',
    dismissed: false,
    metric: { label: 'Conversion Rate', value: '3.2%', change: '-15%' }
  },
  {
    id: '3',
    type: 'info',
    title: 'Peak Traffic Hours',
    message: 'Entering peak shopping hours - all traffic engines optimized for maximum performance',
    timestamp: new Date(Date.now() - 8 * 60 * 1000),
    dismissed: false
  },
  {
    id: '4',
    type: 'success',
    title: 'SEO Breakthrough!',
    message: 'Hemp streetwear keywords now ranking #1 on Google - traffic exploding!',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    dismissed: false,
    metric: { label: 'Organic Traffic', value: '892', change: '+156%' }
  },
  {
    id: '5',
    type: 'error',
    title: 'PPC Engine Offline',
    message: 'Google Ads campaign paused due to budget limit - missing potential sales',
    timestamp: new Date(Date.now() - 20 * 60 * 1000),
    action: 'Increase Budget',
    dismissed: false
  }
];

export const TrafficAlerts = () => {
  const [alerts, setAlerts] = useState<TrafficAlert[]>(generateAlerts());
  const { toast } = useToast();

  // Simulate new alerts
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newAlert: TrafficAlert = {
          id: Date.now().toString(),
          type: ['success', 'warning', 'info'][Math.floor(Math.random() * 3)] as any,
          title: [
            'Traffic Milestone Reached!',
            'New Viral Post Detected',
            'Competitor Activity Alert',
            'Customer Behavior Change'
          ][Math.floor(Math.random() * 4)],
          message: [
            'Streetwear collection reached 10K views this hour!',
            'TikTok post about hemp hoodies going viral - prepare for traffic surge!',
            'Competitor launched similar product - monitor pricing strategy',
            'Customers spending 23% more time on product pages'
          ][Math.floor(Math.random() * 4)],
          timestamp: new Date(),
          dismissed: false
        };

        setAlerts(prev => [newAlert, ...prev.slice(0, 9)]);
        
        toast({
          title: "🚨 New Traffic Alert",
          description: newAlert.title,
        });
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [toast]);

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, dismissed: true } : alert
      )
    );
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'error': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default: return <Bell className="w-5 h-5 text-blue-600" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'success': return 'border-green-500/40 bg-green-500/10';
      case 'warning': return 'border-yellow-500/40 bg-yellow-500/10';
      case 'error': return 'border-red-500/40 bg-red-500/10';
      default: return 'border-blue-500/40 bg-blue-500/10';
    }
  };

  const activeAlerts = alerts.filter(alert => !alert.dismissed);

  return (
    <Card className="border-hemp-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Bell className="w-5 h-5 mr-2 text-hemp-primary" />
            Traffic Alerts & Notifications
          </div>
          <Badge className="bg-hemp-primary/20 text-hemp-primary border-hemp-primary/40">
            {activeAlerts.length} Active
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {activeAlerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No active alerts. Your traffic engines are running smoothly!</p>
            </div>
          ) : (
            activeAlerts.map((alert) => (
              <div key={alert.id} className={`p-4 rounded-lg border ${getAlertColor(alert.type)} relative`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm">{alert.title}</h4>
                        <span className="text-xs text-muted-foreground">
                          {alert.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{alert.message}</p>
                      
                      {alert.metric && (
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {alert.metric.label}: {alert.metric.value}
                          </Badge>
                          <span className={`text-xs font-medium ${
                            alert.metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {alert.metric.change}
                          </span>
                        </div>
                      )}
                      
                      {alert.action && (
                        <Button size="sm" variant="outline" className="mt-2">
                          {alert.action}
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => dismissAlert(alert.id)}
                    className="h-6 w-6 p-0 hover:bg-background/80"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
        
        {activeAlerts.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAlerts(prev => prev.map(alert => ({ ...alert, dismissed: true })))}
              className="w-full"
            >
              Dismiss All Alerts
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
