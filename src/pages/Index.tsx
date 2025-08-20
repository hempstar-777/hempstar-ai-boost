
import React, { useState } from 'react';
import { AppNavDrawer } from '@/components/navigation/AppNavDrawer';
import { SecurityStatusIndicator } from '@/components/security/SecurityStatusIndicator';
import { AutonomousAIPage } from './AutonomousAIPage';
import { MusicStorePage } from './MusicStorePage';
import { ContentMarketingPage } from './ContentMarketingPage';
import { AnalyticsTrafficPage } from './AnalyticsTrafficPage';
import { AIToolsPage } from './AIToolsPage';
import { AutomationResultsPage } from './AutomationResultsPage';
import { SecurityPage } from './SecurityPage';

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
      case 'security':
        return <SecurityPage />;
      default:
        return <AutonomousAIPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hemp">
      <AppNavDrawer currentPage={currentPage} onPageChange={setCurrentPage} />
      
      {/* Security Status Bar */}
      <div className="fixed top-4 right-4 z-50">
        <SecurityStatusIndicator />
      </div>
      
      <main className="w-full">
        {renderCurrentPage()}
      </main>
    </div>
  );
};

export default Index;
