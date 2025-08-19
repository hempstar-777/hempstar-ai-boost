
import React from 'react';
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
  Target
} from 'lucide-react';

const realTimeMetrics = [
  { label: "Live Visitors", value: "3,247", change: "+34%", icon: Users, color: "text-blue-600" },
  { label: "Sales Rate", value: "6.8%", change: "+1.2%", icon: ShoppingCart, color: "text-green-600" },
  { label: "Revenue Today", value: "$12,847", change: "+45%", icon: DollarSign, color: "text-purple-600" },
  { label: "Traffic Sources", value: "23,891", change: "+89%", icon: Eye, color: "text-orange-600" },
  { label: "Social Reach", value: "156K", change: "+127%", icon: Globe, color: "text-pink-600" },
  { label: "Conversion Goals", value: "18/20", change: "+3", icon: Target, color: "text-emerald-600" }
];

export const TrafficMetrics = () => {
  return (
    <Card className="bg-gradient-hemp border-0">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-black text-hemp-dark flex items-center justify-center">
          <TrendingUp className="w-8 h-8 mr-3" />
          HEMPSTAR.STORE DOMINATION DASHBOARD
        </CardTitle>
        <p className="text-hemp-dark/80 font-semibold">
          Real-time customer acquisition & sales explosion metrics
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {realTimeMetrics.map((metric, index) => (
            <div key={index} className="bg-hemp-dark/10 rounded-xl p-4 text-center hover:bg-hemp-dark/15 transition-colors">
              <metric.icon className={`w-6 h-6 ${metric.color} mx-auto mb-2`} />
              <div className="text-xl font-black text-hemp-dark">{metric.value}</div>
              <div className="text-xs font-medium text-hemp-dark/70 mb-2">{metric.label}</div>
              <Badge className="bg-green-500/20 text-green-700 border-green-500/40 text-xs">
                <ArrowUpRight className="w-2 h-2 mr-1" />
                {metric.change}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
