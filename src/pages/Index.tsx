
import React, { useState } from 'react';
import { AppNavDrawer } from '@/components/navigation/AppNavDrawer';
import { AutonomousAIPage } from './AutonomousAIPage';
import { MusicStorePage } from './MusicStorePage';
import { ContentMarketingPage } from './ContentMarketingPage';
import { AnalyticsTrafficPage } from './AnalyticsTrafficPage';
import { AIToolsPage } from './AIToolsPage';
import { AutomationResultsPage } from './AutomationResultsPage';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('autonomous-ai');

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'autonomous-ai':
        return <AutonomousAIPage />;
      case 'music-store':
        return <MusicStorePage />;
      case 'content-marketing':
        return <ContentMarketingPage />;
      case 'analytics-traffic':
        return <AnalyticsTrafficPage />;
      case 'ai-tools':
        return <AIToolsPage />;
      case 'automation-results':
        return <AutomationResultsPage />;
      default:
        return <AutonomousAIPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hemp">
      <AppNavDrawer currentPage={currentPage} onPageChange={setCurrentPage} />
      
      <main className="w-full">
        {renderCurrentPage()}
      </main>
    </div>
  );
};

export default Index;
