
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Eye, 
  TrendingUp, 
  Globe, 
  Smartphone,
  Monitor,
  Tablet,
  MapPin,
  Clock,
  ShoppingBag
} from 'lucide-react';

interface LiveVisitor {
  id: string;
  location: string;
  page: string;
  timeOnSite: string;
  device: 'mobile' | 'desktop' | 'tablet';
  status: 'browsing' | 'shopping' | 'purchasing' | 'leaving';
  source: string;
}

interface TrafficMetric {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: React.ComponentType<any>;
}

const generateLiveVisitors = (): LiveVisitor[] => {
  const locations = ['New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ', 'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA'];
  const pages = ['/embroidered-hoodies', '/streetwear-collection', '/hemp-accessories', '/custom-designs', '/checkout', '/product/hemp-hoodie'];
  const devices: ('mobile' | 'desktop' | 'tablet')[] = ['mobile', 'desktop', 'tablet'];
  const statuses: ('browsing' | 'shopping' | 'purchasing' | 'leaving')[] = ['browsing', 'shopping', 'purchasing', 'leaving'];
  const sources = ['Google', 'Facebook', 'Instagram', 'Direct', 'Reddit', 'TikTok', 'Twitter'];

  return Array.from({ length: 15 }, (_, i) => ({
    id: `visitor-${i}`,
    location: locations[Math.floor(Math.random() * locations.length)],
    page: pages[Math.floor(Math.random() * pages.length)],
    timeOnSite: `${Math.floor(Math.random() * 300) + 30}s`,
    device: devices[Math.floor(Math.random() * devices.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    source: sources[Math.floor(Math.random() * sources.length)]
  }));
};

export const LiveTrafficMonitor = () => {
  const [liveVisitors, setLiveVisitors] = useState<LiveVisitor[]>(generateLiveVisitors());
  const [totalVisitors, setTotalVisitors] = useState(1247);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const metrics: TrafficMetric[] = [
    { label: "Live Visitors", value: totalVisitors.toString(), change: "+12%", trend: 'up', icon: Users },
    { label: "Page Views", value: "3,891", change: "+23%", trend: 'up', icon: Eye },
    { label: "Conversion Rate", value: "4.8%", change: "+0.7%", trend: 'up', icon: TrendingUp },
    { label: "Bounce Rate", value: "32%", change: "-5%", trend: 'down', icon: Globe }
  ];

  // Update visitors in real-time
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveVisitors(prevVisitors => {
        // Update existing visitors
        const updated = prevVisitors.map(visitor => ({
          ...visitor,
          timeOnSite: `${parseInt(visitor.timeOnSite) + Math.floor(Math.random() * 10) + 5}s`
        }));

        // Randomly add/remove visitors
        if (Math.random() > 0.7) {
          const newVisitors = generateLiveVisitors().slice(0, Math.floor(Math.random() * 3) + 1);
          return [...updated.slice(0, 12), ...newVisitors];
        }

        return updated;
      });

      setTotalVisitors(prev => prev + Math.floor(Math.random() * 10) - 5);
      setLastUpdate(new Date());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'mobile': return Smartphone;
      case 'tablet': return Tablet;
      default: return Monitor;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'purchasing':
        return <Badge className="bg-green-500/20 text-green-700 border-green-500/40 animate-pulse">💰 BUYING</Badge>;
      case 'shopping':
        return <Badge className="bg-blue-500/20 text-blue-700 border-blue-500/40">🛍️ SHOPPING</Badge>;
      case 'browsing':
        return <Badge className="bg-purple-500/20 text-purple-700 border-purple-500/40">👀 BROWSING</Badge>;
      case 'leaving':
        return <Badge className="bg-orange-500/20 text-orange-700 border-orange-500/40">👋 LEAVING</Badge>;
      default:
        return <Badge variant="outline">VIEWING</Badge>;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Real-time Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="border-hemp-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-black text-hemp-dark">{metric.value}</div>
                  <div className="text-xs text-muted-foreground">{metric.label}</div>
                </div>
                <metric.icon className="w-8 h-8 text-hemp-primary" />
              </div>
              <div className={`text-sm font-medium ${getTrendColor(metric.trend)} mt-2`}>
                {metric.change} from last hour
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Live Visitor Feed */}
      <Card className="border-hemp-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Eye className="w-5 h-5 mr-2 text-hemp-primary" />
              Live Visitor Activity
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-muted-foreground">
                Updated {lastUpdate.toLocaleTimeString()}
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {liveVisitors.map((visitor) => {
              const DeviceIcon = getDeviceIcon(visitor.device);
              
              return (
                <div key={visitor.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <DeviceIcon className="w-4 h-4 text-muted-foreground" />
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm font-medium">{visitor.location}</span>
                        <Badge variant="outline" className="text-xs">{visitor.source}</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">{visitor.page}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(visitor.status)}
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="w-3 h-3 mr-1" />
                      {visitor.timeOnSite}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Traffic Sources */}
      <Card className="border-hemp-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="w-5 h-5 mr-2 text-hemp-primary" />
            Top Traffic Sources (Last Hour)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { source: 'Google Search', visitors: 456, percentage: 38 },
              { source: 'Instagram', visitors: 234, percentage: 19 },
              { source: 'Direct Traffic', visitors: 189, percentage: 16 },
              { source: 'Facebook', visitors: 156, percentage: 13 },
              { source: 'TikTok', visitors: 98, percentage: 8 },
              { source: 'Reddit', visitors: 67, percentage: 6 }
            ].map((source, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-sm font-medium">{source.source}</div>
                  <Badge variant="outline">{source.visitors} visitors</Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-muted rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-hemp-primary to-hemp-accent h-2 rounded-full"
                      style={{ width: `${source.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">{source.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
