
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PerformanceMetrics } from './PerformanceMetrics';
import { RevenueChart } from './RevenueChart';
import { LiveVisitorTracker } from './LiveVisitorTracker';
import { ConversionFunnel } from './ConversionFunnel';
import { BarChart3, Activity } from 'lucide-react';

export const AnalyticsDashboard = () => {
  return (
    <Card className="bg-gradient-hemp border-0">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-black text-hemp-dark flex items-center justify-center">
          <BarChart3 className="w-8 h-8 mr-3" />
          HEMPSTAR.STORE ANALYTICS COMMAND CENTER
        </CardTitle>
        <CardDescription className="text-hemp-dark/80 font-semibold text-lg">
          Real-time performance tracking for your embroidered streetwear domination
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-8">
        {/* Performance Overview */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-hemp-dark flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Traffic Engine Performance
          </h3>
          <PerformanceMetrics />
        </div>

        {/* Revenue & Traffic Charts */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-hemp-dark">Revenue & Traffic Analysis</h3>
          <RevenueChart />
        </div>

        {/* Live Tracking & Conversion */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-hemp-dark">Live Visitor Activity</h3>
            <LiveVisitorTracker />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-hemp-dark">Conversion Analysis</h3>
            <ConversionFunnel />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
