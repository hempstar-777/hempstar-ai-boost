
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  ShoppingBag,
  Music,
  Shirt,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

interface RealVisitor {
  id: string;
  source: 'store' | 'spotify' | 'social';
  activity: string;
  timestamp: string;
  location?: string;
  device?: string;
  status: 'listening' | 'browsing' | 'purchasing' | 'sharing';
}

export const LiveTrafficMonitor = () => {
  const [realVisitors, setRealVisitors] = useState<RealVisitor[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const connectRealData = () => {
    // This will be replaced with actual API connections
    setIsConnected(true);
    setLastUpdate(new Date());
    setRealVisitors([
      {
        id: 'pending-1',
        source: 'store',
        activity: 'Waiting for Wix connection...',
        timestamp: new Date().toISOString(),
        status: 'browsing'
      },
      {
        id: 'pending-2', 
        source: 'spotify',
        activity: 'Waiting for Spotify API...',
        timestamp: new Date().toISOString(),
        status: 'listening'
      }
    ]);
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'store': return Shirt;
      case 'spotify': return Music;
      case 'social': return Globe;
      default: return Eye;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'listening':
        return <Badge className="bg-green-500/20 text-green-700 border-green-500/40">🎵 LISTENING</Badge>;
      case 'purchasing':
        return <Badge className="bg-blue-500/20 text-blue-700 border-blue-500/40 animate-pulse">💰 BUYING</Badge>;
      case 'browsing':
        return <Badge className="bg-purple-500/20 text-purple-700 border-purple-500/40">👀 BROWSING</Badge>;
      case 'sharing':
        return <Badge className="bg-pink-500/20 text-pink-700 border-pink-500/40">📱 SHARING</Badge>;
      default:
        return <Badge variant="outline">UNKNOWN</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card className="border-hemp-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Eye className="w-5 h-5 mr-2 text-hemp-primary" />
              Real-Time Activity Monitor
            </div>
            {!isConnected ? (
              <Button onClick={connectRealData} className="bg-hemp-primary hover:bg-hemp-primary/90">
                <RefreshCw className="w-4 h-4 mr-2" />
                Connect Real Data
              </Button>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">
                  Waiting for API connections
                </span>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        
        {!isConnected ? (
          <CardContent>
            <div className="text-center py-8">
              <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Real Data Connected</h3>
              <p className="text-muted-foreground mb-4">
                Connect your Spotify, Wix store, and social accounts to see real customer activity
              </p>
            </div>
          </CardContent>
        ) : (
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {realVisitors.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">Waiting for real visitor data...</p>
                </div>
              ) : (
                realVisitors.map((visitor) => {
                  const SourceIcon = getSourceIcon(visitor.source);
                  
                  return (
                    <div key={visitor.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <SourceIcon className="w-4 h-4 text-muted-foreground" />
                        <div className="space-y-1">
                          <div className="text-sm font-medium">{visitor.activity}</div>
                          <div className="text-xs text-muted-foreground capitalize">
                            Source: {visitor.source}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {getStatusBadge(visitor.status)}
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(visitor.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Real Data Sources Setup */}
      <Card className="border-hemp-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="w-5 h-5 mr-2 text-hemp-primary" />
            Required Data Connections
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <Music className="w-5 h-5 text-green-600" />
                <div>
                  <div className="font-medium">Spotify for Artists</div>
                  <div className="text-sm text-muted-foreground">Track real streams and listeners</div>
                </div>
              </div>
              <Badge variant="outline">Setup Needed</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <Shirt className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-medium">Wix Store (hempstar.store)</div>
                  <div className="text-sm text-muted-foreground">Real product sales and visitors</div>
                </div>
              </div>
              <Badge variant="outline">Setup Needed</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-purple-600" />
                <div>
                  <div className="font-medium">Social Media APIs</div>
                  <div className="text-sm text-muted-foreground">Track shares, mentions, and engagement</div>
                </div>
              </div>
              <Badge variant="outline">Setup Needed</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
