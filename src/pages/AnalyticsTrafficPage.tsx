
import React from 'react';
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";
import { TrafficBooster } from "@/components/TrafficBooster";
import { SalesAnalytics } from "@/components/SalesAnalytics";
import { CompetitorTracker } from "@/components/CompetitorTracker";

export const AnalyticsTrafficPage: React.FC = () => {
  return (
    <main className="container mx-auto px-4 py-8 space-y-8">
      <h2 className="text-2xl font-bold text-hemp-dark">📊 Analytics & Traffic</h2>
      <AnalyticsDashboard />
      <TrafficBooster />
      <div className="grid md:grid-cols-2 gap-8">
        <SalesAnalytics />
        <CompetitorTracker />
      </div>
    </main>
  );
};

export default AnalyticsTrafficPage;
