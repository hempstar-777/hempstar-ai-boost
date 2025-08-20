
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Eye, 
  ArrowUpRight,
  TrendingUp,
  Globe,
  Target,
  Music,
  Shirt
} from 'lucide-react';

interface RealMetrics {
  label: string;
  value: string;
  source: string;
  lastUpdated: string;
  icon: React.ComponentType<any>;
  color: string;
  status: 'connected' | 'pending' | 'error';
}

export const TrafficMetrics = () => {
  const [realMetrics, setRealMetrics] = useState<RealMetrics[]>([
    { 
      label: "Spotify Streams", 
      value: "Connecting...", 
      source: "Spotify API",
      lastUpdated: "Never",
      icon: Music, 
      color: "text-green-600",
      status: 'pending'
    },
    { 
      label: "Store Visitors", 
      value: "Connecting...", 
      source: "hempstar.store",
      lastUpdated: "Never",
      icon: Users, 
      color: "text-blue-600",
      status: 'pending'
    },
    { 
      label: "Streetwear Sales", 
      value: "Connecting...", 
      source: "Wix Store",
      lastUpdated: "Never",
      icon: Shirt, 
      color: "text-purple-600",
      status: 'pending'
    },
    { 
      label: "Revenue Today", 
      value: "Connecting...", 
      source: "Wix Payments",
      lastUpdated: "Never",
      icon: DollarSign, 
      color: "text-green-600",
      status: 'pending'
    },
    { 
      label: "Social Reach", 
      value: "Connecting...", 
      source: "Social APIs",
      lastUpdated: "Never",
      icon: Globe, 
      color: "text-pink-600",
      status: 'pending'
    },
    { 
      label: "Conversion Rate", 
      value: "Connecting...", 
      source: "Analytics",
      lastUpdated: "Never",
      icon: Target, 
      color: "text-emerald-600",
      status: 'pending'
    }
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-500/20 text-green-700 border-green-500/40 text-xs">LIVE</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-700 border-yellow-500/40 text-xs">SETUP NEEDED</Badge>;
      case 'error':
        return <Badge className="bg-red-500/20 text-red-700 border-red-500/40 text-xs">ERROR</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">UNKNOWN</Badge>;
    }
  };

  return (
    <Card className="bg-gradient-hemp border-0">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-black text-hemp-dark flex items-center justify-center">
          <TrendingUp className="w-8 h-8 mr-3" />
          HEMPSTAR REAL-TIME DASHBOARD
        </CardTitle>
        <p className="text-hemp-dark/80 font-semibold">
          Live data from your music streams and streetwear sales
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {realMetrics.map((metric, index) => (
            <div key={index} className="bg-hemp-dark/10 rounded-xl p-4 text-center hover:bg-hemp-dark/15 transition-colors">
              <metric.icon className={`w-6 h-6 ${metric.color} mx-auto mb-2`} />
              <div className="text-xl font-black text-hemp-dark">{metric.value}</div>
              <div className="text-xs font-medium text-hemp-dark/70 mb-2">{metric.label}</div>
              <div className="space-y-1">
                {getStatusBadge(metric.status)}
                <div className="text-xs text-hemp-dark/60">
                  Source: {metric.source}
                </div>
                <div className="text-xs text-hemp-dark/50">
                  Updated: {metric.lastUpdated}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
          <div className="flex items-center mb-2">
            <Target className="w-5 h-5 text-yellow-600 mr-2" />
            <h3 className="font-bold text-yellow-800">Real Data Connections Needed</h3>
          </div>
          <p className="text-sm text-yellow-700">
            Connect your Spotify artist account, Wix store, and social media to see real-time metrics for your Hempstar brand.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
