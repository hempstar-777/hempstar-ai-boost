
import React, { useState } from 'react';
import { AppNavDrawer } from '@/components/navigation/AppNavDrawer';
import { SecurityStatusIndicator } from '@/components/security/SecurityStatusIndicator';
import { AutonomousAIPage } from './AutonomousAIPage';
import { MusicStorePage } from './MusicStorePage';
import { ContentMarketingPage } from './ContentMarketingPage';
import { AnalyticsTrafficPage } from './AnalyticsTrafficPage';
import { AIToolsPage } from './AIToolsPage';
import { AutomationResultsPage } from './AutomationResultsPage';
import SecurityPage from './SecurityPage';
import { AdminInsightsPage } from './AdminInsightsPage';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('admin-insights');

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'admin-insights':
        return <AdminInsightsPage />;
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
        return <AdminInsightsPage />;
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
