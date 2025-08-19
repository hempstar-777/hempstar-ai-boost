
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { DollarSign, TrendingUp } from 'lucide-react';

const revenueData = [
  { day: 'Mon', revenue: 2400, visitors: 1200 },
  { day: 'Tue', revenue: 3200, visitors: 1800 },
  { day: 'Wed', revenue: 5100, visitors: 2400 },
  { day: 'Thu', revenue: 7800, visitors: 3200 },
  { day: 'Fri', revenue: 9200, visitors: 4100 },
  { day: 'Sat', revenue: 12500, visitors: 5600 },
  { day: 'Sun', revenue: 15300, visitors: 6800 }
];

const trafficSources = [
  { source: 'SEO', value: 35, color: '#10B981' },
  { source: 'Social Media', value: 28, color: '#3B82F6' },
  { source: 'Direct', value: 20, color: '#8B5CF6' },
  { source: 'Influencers', value: 12, color: '#F59E0B' },
  { source: 'Shopping Ads', value: 5, color: '#EF4444' }
];

export const RevenueChart = () => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="border-hemp-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center text-hemp-primary">
            <DollarSign className="w-5 h-5 mr-2" />
            Revenue Explosion This Week
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#059669" 
                strokeWidth={3}
                dot={{ fill: '#059669', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
          
          <div className="mt-4 text-center">
            <div className="text-2xl font-black text-green-600">$55,500</div>
            <div className="text-sm text-muted-foreground">Total Weekly Revenue</div>
            <div className="flex items-center justify-center mt-1">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-green-600 font-semibold">+287% vs last week</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-hemp-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center text-hemp-accent">
            Traffic Source Domination
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trafficSources.map((source, index) => (
              <div key={index} className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: source.color }}></div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-semibold">{source.source}</span>
                    <span className="text-sm font-bold">{source.value}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${source.value}%`, 
                        backgroundColor: source.color 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <div className="text-xl font-black text-hemp-primary">24,800</div>
            <div className="text-sm text-muted-foreground">Total Visitors This Week</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
