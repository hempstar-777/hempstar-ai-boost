
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Eye, 
  ShoppingCart, 
  CreditCard,
  ArrowDown,
  TrendingUp
} from 'lucide-react';

const funnelSteps = [
  {
    stage: "Traffic Generated",
    count: 12847,
    percentage: 100,
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-500/20"
  },
  {
    stage: "Product Views", 
    count: 8934,
    percentage: 69.5,
    icon: Eye,
    color: "text-purple-600",
    bgColor: "bg-purple-500/20"
  },
  {
    stage: "Added to Cart",
    count: 2847,
    percentage: 22.2,
    icon: ShoppingCart, 
    color: "text-orange-600",
    bgColor: "bg-orange-500/20"
  },
  {
    stage: "Completed Purchase",
    count: 934,
    percentage: 7.3,
    icon: CreditCard,
    color: "text-green-600", 
    bgColor: "bg-green-500/20"
  }
];

export const ConversionFunnel = () => {
  return (
    <Card className="border-hemp-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-hemp-primary" />
            Conversion Funnel Analysis
          </div>
          <Badge className="bg-green-500/20 text-green-700 border-green-500/40">
            7.3% CONVERSION RATE 🔥
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {funnelSteps.map((step, index) => (
          <div key={index} className="space-y-2">
            <div className={`p-4 rounded-lg ${step.bgColor} relative overflow-hidden`}>
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center space-x-3">
                  <step.icon className={`w-6 h-6 ${step.color}`} />
                  <div>
                    <div className="font-semibold">{step.stage}</div>
                    <div className="text-sm text-muted-foreground">
                      {step.count.toLocaleString()} visitors
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-xl font-black ${step.color}`}>
                    {step.percentage}%
                  </div>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="mt-2 w-full bg-white/30 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-1000 ${step.color.replace('text-', 'bg-')}`}
                  style={{ width: `${step.percentage}%` }}
                ></div>
              </div>
            </div>
            
            {index < funnelSteps.length - 1 && (
              <div className="flex justify-center">
                <ArrowDown className="w-4 h-4 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}
        
        <div className="mt-6 p-4 bg-gradient-hemp/20 rounded-lg text-center">
          <div className="text-lg font-black text-hemp-primary">
            $38,492 Revenue Generated Today!
          </div>
          <div className="text-sm text-muted-foreground">
            Your embroidered streetwear empire is crushing it! 🚀
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
