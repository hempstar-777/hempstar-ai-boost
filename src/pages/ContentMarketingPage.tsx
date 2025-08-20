
import React from 'react';
import { ContentDashboard } from "@/components/content/ContentDashboard";
import { BehaviorDashboard } from "@/components/behavior/BehaviorDashboard";

export const ContentMarketingPage: React.FC = () => {
  return (
    <main className="container mx-auto px-4 py-8 space-y-8">
      <h2 className="text-2xl font-bold text-hemp-dark">📱 Content & Marketing</h2>
      <ContentDashboard />
      <BehaviorDashboard />
    </main>
  );
};

export default ContentMarketingPage;
