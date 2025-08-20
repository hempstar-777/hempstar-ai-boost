
import React from 'react';
import { TrafficMetrics } from "@/components/traffic/TrafficMetrics";
import { LiveStoreMonitor } from "@/components/LiveStoreMonitor";
import { SIDashboard } from "@/components/SIDashboard";

export const MusicStorePage: React.FC = () => {
  return (
    <main className="container mx-auto px-4 py-8 space-y-8">
      <h2 className="text-2xl font-bold text-hemp-dark">🎵 Music & Store Dashboard</h2>
      <TrafficMetrics />
      <div className="grid gap-8">
        <LiveStoreMonitor />
        <SIDashboard />
      </div>
    </main>
  );
};

export default MusicStorePage;
