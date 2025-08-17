
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  TrendingDown, 
  TrendingUp, 
  DollarSign, 
  Eye, 
  Target,
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';

interface CompetitorData {
  name: string;
  product: string;
  currentPrice: number;
  previousPrice: number;
  change: number;
  changePercent: string;
  status: 'higher' | 'lower' | 'equal';
  lastUpdated: string;
  recommendation: string;
}

const competitorData: CompetitorData[] = [
  {
    name: "Hemp Haven",
    product: "Hemp Streetwear Hoodie",
    currentPrice: 89.99,
    previousPrice: 94.99,
    change: -5.00,
    changePercent: "-5.3%",
    status: 'lower',
    lastUpdated: '2 min ago',
    recommendation: 'Consider lowering price by $3-5 to maintain competitive edge'
  },
  {
    name: "Green Street Co",
    product: "Sustainable Street Tee",
    currentPrice: 34.99,
    previousPrice: 29.99,
    change: 5.00,
    changePercent: "+16.7%",
    status: 'higher',
    lastUpdated: '5 min ago',
    recommendation: 'Opportunity to increase price by $2-4 while remaining competitive'
  },
  {
    name: "EcoWear Urban",
    product: "Hemp Sneakers",
    currentPrice: 129.99,
    previousPrice: 129.99,
    change: 0,
    changePercent: "0%",
    status: 'equal',
    lastUpdated: '1 min ago',
    recommendation: 'Stable pricing - maintain current strategy'
  },
  {
    name: "Natural Threads",
    product: "Hemp Joggers",
    currentPrice: 67.99,
    previousPrice: 59.99,
    change: 8.00,
    changePercent: "+13.3%",
    status: 'higher',
    lastUpdated: '3 min ago',
    recommendation: 'Strong opportunity to capture market share with competitive pricing'
  }
];

export const CompetitorTracker = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const { toast } = useToast();

  const startTracking = async () => {
    setIsTracking(true);
    
    toast({
      title: "🎯 Competitor Tracking Activated",
      description: "Now monitoring 47 hemp streetwear competitors in real-time",
    });

    // Simulate real-time updates
    const interval = setInterval(() => {
      setLastUpdate(new Date());
      
      // Random chance to show price change notification
      if (Math.random() > 0.7) {
        const competitor = competitorData[Math.floor(Math.random() * competitorData.length)];
        toast({
          title: "⚡ Price Alert!",
          description: `${competitor.name} changed pricing - ${competitor.recommendation}`,
        });
      }
    }, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  };

  const getStatusColor = (status: CompetitorData['status']) => {
    switch (status) {
      case 'higher': return 'text-green-600 bg-green-500/20 border-green-500/40';
      case 'lower': return 'text-red-600 bg-red-500/20 border-red-500/40';
      case 'equal': return 'text-blue-600 bg-blue-500/20 border-blue-500/40';
    }
  };

  const getStatusIcon = (status: CompetitorData['status']) => {
    switch (status) {
      case 'higher': return TrendingUp;
      case 'lower': return TrendingDown;
      case 'equal': return CheckCircle;
    }
  };

  const getRecommendationIcon = (status: CompetitorData['status']) => {
    switch (status) {
      case 'higher': return Target;
      case 'lower': return AlertTriangle;
      case 'equal': return CheckCircle;
    }
  };

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card className="border-hemp-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Eye className="w-5 h-5 mr-2 text-hemp-primary" />
                Hemp Streetwear Competitor Intelligence
              </CardTitle>
              <CardDescription>
                Real-time price monitoring and competitive analysis
              </CardDescription>
            </div>
            <Button 
              onClick={startTracking}
              disabled={isTracking}
              className="bg-hemp-primary hover:bg-hemp-accent text-hemp-dark"
            >
              {isTracking ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Tracking Live
                </>
              ) : (
                <>
                  <Target className="w-4 h-4 mr-2" />
                  Start Tracking
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        
        {isTracking && (
          <CardContent>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                Live monitoring active
              </div>
              <div>Last updated: {lastUpdate.toLocaleTimeString()}</div>
              <Badge className="bg-hemp-primary/20 text-hemp-primary border-hemp-primary/40">
                47 Competitors Tracked
              </Badge>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Competitor Data Grid */}
      <div className="grid gap-4">
        {competitorData.map((competitor, index) => {
          const StatusIcon = getStatusIcon(competitor.status);
          const RecommendationIcon = getRecommendationIcon(competitor.status);
          
          return (
            <Card key={index} className="border-hemp-primary/10 hover:border-hemp-primary/20 transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">${competitor.currentPrice}</div>
                      <div className="text-sm text-muted-foreground">{competitor.product}</div>
                    </div>
                    
                    <div>
                      <div className="font-semibold">{competitor.name}</div>
                      <div className="flex items-center space-x-2 mt-1">
                        <StatusIcon className="w-4 h-4" />
                        <Badge className={`text-xs ${getStatusColor(competitor.status)}`}>
                          {competitor.changePercent}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {competitor.lastUpdated}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Previous</div>
                      <div className="font-medium">${competitor.previousPrice}</div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Change</div>
                      <div className={`font-bold ${
                        competitor.change > 0 ? 'text-green-600' : 
                        competitor.change < 0 ? 'text-red-600' : 'text-blue-600'
                      }`}>
                        {competitor.change > 0 ? '+' : ''}${competitor.change.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <RecommendationIcon className="w-4 h-4 mt-0.5 text-hemp-primary flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium">AI Recommendation</div>
                      <div className="text-sm text-muted-foreground">{competitor.recommendation}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-green-500/20 bg-green-500/5">
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">12</div>
            <div className="text-sm text-muted-foreground">Pricing Opportunities</div>
          </CardContent>
        </Card>
        
        <Card className="border-red-500/20 bg-red-500/5">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-600">3</div>
            <div className="text-sm text-muted-foreground">Price Threats</div>
          </CardContent>
        </Card>
        
        <Card className="border-hemp-primary/20 bg-hemp-primary/5">
          <CardContent className="p-6 text-center">
            <DollarSign className="w-8 h-8 text-hemp-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-hemp-primary">$847</div>
            <div className="text-sm text-muted-foreground">Est. Daily Revenue Impact</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
