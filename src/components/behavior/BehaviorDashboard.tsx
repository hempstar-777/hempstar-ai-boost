
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BehaviorTracker } from './BehaviorTracker';
import { BehaviorInsights } from './BehaviorInsights';
import { AutomatedActions } from './AutomatedActions';
import { Brain, Activity } from 'lucide-react';

export const BehaviorDashboard = () => {
  return (
    <Card className="bg-gradient-hemp border-0">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-black text-hemp-dark flex items-center justify-center">
          <Brain className="w-8 h-8 mr-3" />
          CUSTOMER BEHAVIOR TRACKING SYSTEM
        </CardTitle>
        <CardDescription className="text-hemp-dark/80 font-semibold text-lg">
          AI-powered visitor behavior analysis with automated marketing responses
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-8">
        {/* Behavior Tracking */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-hemp-dark flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Real-Time Behavior Monitoring
          </h3>
          <BehaviorTracker />
        </div>

        {/* AI Insights */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-hemp-dark">AI Behavioral Insights</h3>
          <BehaviorInsights />
        </div>

        {/* Automated Actions */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-hemp-dark">Smart Marketing Automation</h3>
          <AutomatedActions />
        </div>
      </CardContent>
    </Card>
  );
};
