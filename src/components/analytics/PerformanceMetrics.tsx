
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Eye, 
  MousePointer,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const performanceData = [
  {
    engine: "SEO Domination Engine",
    visitors: 1247,
    conversions: 89,
    revenue: "$3,245",
    trend: "+156%",
    status: "EXPLOSIVE",
    color: "text-green-600"
  },
  {
    engine: "Social Media Tsunami", 
    visitors: 2891,
    conversions: 203,
    revenue: "$7,821",
    trend: "+289%",
    status: "VIRAL",
    color: "text-blue-600"
  },
  {
    engine: "Internet Invasion Protocol",
    visitors: 3456,
    conversions: 234,
    revenue: "$9,567",
    trend: "+342%", 
    status: "UNSTOPPABLE",
    color: "text-purple-600"
  },
  {
    engine: "AI Customer Hunter",
    visitors: 892,
    conversions: 156,
    revenue: "$4,123",
    trend: "+78%",
    status: "GENIUS",
    color: "text-orange-600"
  },
  {
    engine: "Influencer Magnet System",
    visitors: 1678,
    conversions: 134,
    revenue: "$5,234",
    trend: "+198%",
    status: "MAGNETIC", 
    color: "text-pink-600"
  },
  {
    engine: "Shopping Platform Blitz",
    visitors: 2134,
    conversions: 287,
    revenue: "$8,912",
    trend: "+267%",
    status: "BLITZING",
    color: "text-emerald-600"
  }
];

export const PerformanceMetrics = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-black bg-gradient-to-r from-hemp-primary to-hemp-accent bg-clip-text text-transparent">
          HEMPSTAR.STORE PERFORMANCE DOMINATION
        </h3>
        <p className="text-muted-foreground font-semibold">
          Real-time analytics showing which engines are crushing it for your embroidered streetwear empire
        </p>
      </div>

      <div className="grid gap-4">
        {performanceData.map((engine, index) => (
          <Card key={index} className="border-hemp-primary/20 hover:border-hemp-primary/60 transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold">{engine.engine}</CardTitle>
                <Badge className="bg-hemp-primary/20 text-hemp-primary border-hemp-primary/40 font-black animate-pulse">
                  {engine.status}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Users className="w-4 h-4 text-blue-600 mr-1" />
                  </div>
                  <div className="text-lg font-black">{engine.visitors}</div>
                  <div className="text-xs text-muted-foreground">Visitors</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <ShoppingCart className="w-4 h-4 text-green-600 mr-1" />
                  </div>
                  <div className="text-lg font-black">{engine.conversions}</div>
                  <div className="text-xs text-muted-foreground">Sales</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <DollarSign className="w-4 h-4 text-purple-600 mr-1" />
                  </div>
                  <div className="text-lg font-black">{engine.revenue}</div>
                  <div className="text-xs text-muted-foreground">Revenue</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <TrendingUp className="w-4 h-4 text-emerald-600 mr-1" />
                  </div>
                  <div className={`text-lg font-black ${engine.color}`}>{engine.trend}</div>
                  <div className="text-xs text-muted-foreground">Growth</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
