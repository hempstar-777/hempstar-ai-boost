
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  MapPin, 
  Clock, 
  ShoppingBag,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';

const liveVisitors = [
  {
    id: 1,
    location: "Los Angeles, CA",
    page: "/embroidered-hoodies",
    time: "2s ago",
    device: "mobile",
    status: "shopping"
  },
  {
    id: 2,
    location: "New York, NY", 
    page: "/streetwear-collection",
    time: "8s ago",
    device: "desktop",
    status: "browsing"
  },
  {
    id: 3,
    location: "Miami, FL",
    page: "/checkout",
    time: "12s ago", 
    device: "mobile",
    status: "buying"
  },
  {
    id: 4,
    location: "Chicago, IL",
    page: "/embroidered-tees",
    time: "18s ago",
    device: "tablet",
    status: "shopping"
  },
  {
    id: 5,
    location: "Austin, TX",
    page: "/product/hemp-streetwear-hoodie",
    time: "25s ago",
    device: "desktop", 
    status: "viewing"
  }
];

const getDeviceIcon = (device: string) => {
  switch (device) {
    case 'mobile': return Smartphone;
    case 'tablet': return Tablet;
    default: return Monitor;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'buying':
      return <Badge className="bg-green-500/20 text-green-700 border-green-500/40">🔥 BUYING</Badge>;
    case 'shopping':
      return <Badge className="bg-blue-500/20 text-blue-700 border-blue-500/40">🛍️ SHOPPING</Badge>;
    case 'browsing':
      return <Badge className="bg-purple-500/20 text-purple-700 border-purple-500/40">👀 BROWSING</Badge>;
    default:
      return <Badge variant="outline">VIEWING</Badge>;
  }
};

export const LiveVisitorTracker = () => {
  const [visitorCount, setVisitorCount] = useState(47);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisitorCount(prev => prev + Math.floor(Math.random() * 3) - 1);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="border-hemp-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Eye className="w-5 h-5 mr-2 text-hemp-primary" />
            Live Visitor Tracking
          </div>
          <Badge className="bg-green-500/20 text-green-700 border-green-500/40 animate-pulse">
            {visitorCount} LIVE NOW
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {liveVisitors.map((visitor) => {
          const DeviceIcon = getDeviceIcon(visitor.device);
          
          return (
            <div key={visitor.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <DeviceIcon className="w-4 h-4 text-muted-foreground" />
                <div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3 h-3 text-muted-foreground" />
                    <span className="text-sm font-medium">{visitor.location}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{visitor.page}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {getStatusBadge(visitor.status)}
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="w-3 h-3 mr-1" />
                  {visitor.time}
                </div>
              </div>
            </div>
          );
        })}
        
        <div className="mt-4 p-3 bg-gradient-hemp/20 rounded-lg text-center">
          <div className="text-lg font-black text-hemp-primary">🚀 Traffic Exploding!</div>
          <div className="text-sm text-muted-foreground">
            Your embroidered streetwear is taking over the internet
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
