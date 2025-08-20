
import React from 'react';
import { AIAgentDashboard } from "@/components/AIAgentDashboard";
import { ContentGenerator } from "@/components/ContentGenerator";
import VoiceInterface from "@/components/VoiceInterface";
import { VirtualTryOn } from "@/components/VirtualTryOn";

export const AIToolsPage: React.FC = () => {
  return (
    <main className="container mx-auto px-4 py-8 space-y-8">
      <h2 className="text-2xl font-bold text-hemp-dark">🤖 AI Tools</h2>
      <AIAgentDashboard />
      <div className="grid gap-8">
        <ContentGenerator />
        <div className="grid md:grid-cols-2 gap-8">
          <VoiceInterface />
          <VirtualTryOn />
        </div>
      </div>
    </main>
  );
};

export default AIToolsPage;
