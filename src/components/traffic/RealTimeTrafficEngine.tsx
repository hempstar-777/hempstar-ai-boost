
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Activity, 
  Zap, 
  TrendingUp, 
  Users, 
  Eye, 
  MousePointer,
  Target,
  Rocket,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface TrafficEngine {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'paused' | 'boosting' | 'offline';
  currentTraffic: number;
  targetTraffic: number;
  conversionRate: number;
  isRealTime: boolean;
}

const initialEngines: TrafficEngine[] = [
  {
    id: '1',
    name: 'SEO Traffic Booster',
    type: 'seo',
    status: 'active',
    currentTraffic: 1247,
    targetTraffic: 2000,
    conversionRate: 3.2,
    isRealTime: true
  },
  {
    id: '2',
    name: 'Social Media Storm',
    type: 'social',
    status: 'boosting',
    currentTraffic: 2891,
    targetTraffic: 4000,
    conversionRate: 5.8,
    isRealTime: true
  },
  {
    id: '3',
    name: 'PPC Accelerator',
    type: 'ppc',
    status: 'active',
    currentTraffic: 756,
    targetTraffic: 1500,
    conversionRate: 7.2,
    isRealTime: true
  },
  {
    id: '4',
    name: 'Influencer Network',
    type: 'influencer', 
    status: 'paused',
    currentTraffic: 423,
    targetTraffic: 1000,
    conversionRate: 4.5,
    isRealTime: false
  }
];

export const RealTimeTrafficEngine = () => {
  const [engines, setEngines] = useState<TrafficEngine[]>(initialEngines);
  const [totalTraffic, setTotalTraffic] = useState(0);
  const [isSystemActive, setIsSystemActive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const { toast } = useToast();

  // Simulate real-time traffic updates
  useEffect(() => {
    if (!isSystemActive) return;

    const interval = setInterval(() => {
      setEngines(prevEngines => 
        prevEngines.map(engine => {
          if (engine.status === 'active' || engine.status === 'boosting') {
            const variation = Math.random() * 100 - 50; // -50 to +50
            const newTraffic = Math.max(0, engine.currentTraffic + variation);
            const conversionVariation = (Math.random() - 0.5) * 0.5; // -0.25 to +0.25
            const newConversion = Math.max(0, engine.conversionRate + conversionVariation);
            
            return {
              ...engine,
              currentTraffic: Math.round(newTraffic),
              conversionRate: Math.round(newConversion * 10) / 10
            };
          }
          return engine;
        })
      );
      setLastUpdate(new Date());
    }, 2000);

    return () => clearInterval(interval);
  }, [isSystemActive]);

  // Calculate total traffic
  useEffect(() => {
    const total = engines.reduce((sum, engine) => sum + engine.currentTraffic, 0);
    setTotalTraffic(total);
  }, [engines]);

  const boostEngine = async (engineId: string) => {
    setEngines(prev => 
      prev.map(engine => 
        engine.id === engineId 
          ? { ...engine, status: 'boosting' as const }
          : engine
      )
    );

    toast({
      title: "🚀 Traffic Engine Boosted!",
      description: "Engine is now operating at maximum capacity!",
    });

    // Simulate boost effect
    setTimeout(() => {
      setEngines(prev => 
        prev.map(engine => 
          engine.id === engineId 
            ? { 
                ...engine, 
                status: 'active' as const,
                currentTraffic: Math.round(engine.currentTraffic * 1.5)
              }
            : engine
        )
      );
    }, 5000);
  };

  const toggleEngine = (engineId: string) => {
    setEngines(prev => 
      prev.map(engine => 
        engine.id === engineId 
          ? { 
              ...engine, 
              status: engine.status === 'active' ? 'paused' : 'active'
            }
          : engine
      )
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'boosting': return <Zap className="w-4 h-4 text-yellow-500 animate-pulse" />;
      case 'paused': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-700 border-green-500/40';
      case 'boosting': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/40 animate-pulse';
      case 'paused': return 'bg-orange-500/20 text-orange-700 border-orange-500/40';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/40';
    }
  };

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <Card className="border-hemp-primary/20 bg-gradient-to-r from-hemp-primary/10 to-hemp-accent/10">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Activity className="w-6 h-6 mr-2 text-hemp-primary" />
              Real-Time Traffic Engine System
            </div>
            <Badge className="bg-green-500/20 text-green-700 border-green-500/40 animate-pulse">
              LIVE {isSystemActive ? 'ACTIVE' : 'PAUSED'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-black text-hemp-primary">{totalTraffic.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Live Traffic</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-hemp-accent">{engines.filter(e => e.status === 'active' || e.status === 'boosting').length}</div>
              <div className="text-sm text-muted-foreground">Active Engines</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-green-600">
                {Math.round(engines.reduce((sum, e) => sum + e.conversionRate, 0) / engines.length * 10) / 10}%
              </div>
              <div className="text-sm text-muted-foreground">Avg Conversion</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Last Update</div>
              <div className="text-xs">{lastUpdate.toLocaleTimeString()}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Traffic Engines Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {engines.map((engine) => (
          <Card key={engine.id} className="border-hemp-primary/20 hover:border-hemp-primary/60 transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  {getStatusIcon(engine.status)}
                  <span className="ml-2">{engine.name}</span>
                </CardTitle>
                <Badge className={getStatusColor(engine.status)}>
                  {engine.status.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Traffic Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Traffic Progress</span>
                  <span>{engine.currentTraffic} / {engine.targetTraffic}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-hemp-primary to-hemp-accent h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((engine.currentTraffic / engine.targetTraffic) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-xl font-bold text-hemp-primary">
                    {engine.currentTraffic.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">Current</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-hemp-accent">
                    {engine.conversionRate}%
                  </div>
                  <div className="text-xs text-muted-foreground">Conversion</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-green-600">
                    {engine.isRealTime ? 'LIVE' : 'BATCH'}
                  </div>
                  <div className="text-xs text-muted-foreground">Mode</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={engine.status === 'active' ? 'outline' : 'default'}
                  onClick={() => toggleEngine(engine.id)}
                  className="flex-1"
                >
                  {engine.status === 'active' ? 'Pause' : 'Activate'}
                </Button>
                <Button
                  size="sm"
                  onClick={() => boostEngine(engine.id)}
                  disabled={engine.status === 'boosting'}
                  className="flex-1 bg-gradient-to-r from-hemp-primary to-hemp-accent hover:from-hemp-accent hover:to-hemp-primary"
                >
                  {engine.status === 'boosting' ? (
                    <>
                      <div className="animate-spin w-3 h-3 border-2 border-hemp-dark border-t-transparent rounded-full mr-1"></div>
                      Boosting...
                    </>
                  ) : (
                    <>
                      <Rocket className="w-3 h-3 mr-1" />
                      Boost
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* System Controls */}
      <Card className="border-hemp-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="w-5 h-5 mr-2 text-hemp-primary" />
            System Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <Button
              onClick={() => setIsSystemActive(!isSystemActive)}
              variant={isSystemActive ? 'destructive' : 'default'}
              size="lg"
            >
              {isSystemActive ? 'Pause All Engines' : 'Activate All Engines'}
            </Button>
            
            <Button
              onClick={() => {
                engines.forEach(engine => {
                  if (engine.status !== 'boosting') {
                    boostEngine(engine.id);
                  }
                });
                toast({
                  title: "🔥 MAXIMUM OVERDRIVE ACTIVATED!",
                  description: "All engines are now running at maximum capacity!",
                });
              }}
              size="lg"
              className="bg-gradient-to-r from-hemp-primary via-hemp-accent to-hemp-primary hover:from-hemp-accent hover:via-hemp-primary hover:to-hemp-accent animate-pulse"
            >
              <Zap className="w-4 h-4 mr-2" />
              BOOST ALL ENGINES
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
