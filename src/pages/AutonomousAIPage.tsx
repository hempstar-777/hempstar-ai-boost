
import React from 'react';
import { AutonomousAIDashboard } from '@/components/autonomous/AutonomousAIDashboard';

export const AutonomousAIPage = () => {
  return (
    <div className="min-h-screen bg-gradient-hemp p-4">
      <div className="container mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-black text-hemp-dark mb-2">
            🤖 AUTONOMOUS AI EMPIRE
          </h1>
          <p className="text-xl text-hemp-dark/80 font-semibold">
            Your AI agents work 24/7 while you sleep - marketing, ads, campaigns, all automated
          </p>
        </div>
        
        <AutonomousAIDashboard />
      </div>
    </div>
  );
};

export default AutonomousAIPage;
