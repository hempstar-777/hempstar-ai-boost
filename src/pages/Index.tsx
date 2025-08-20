
import { useEffect, useMemo, useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import AppNavDrawer from "@/components/navigation/AppNavDrawer";

import MusicStorePage from "./MusicStorePage";
import ContentMarketingPage from "./ContentMarketingPage";
import AnalyticsTrafficPage from "./AnalyticsTrafficPage";
import AIToolsPage from "./AIToolsPage";
import AutomationResultsPage from "./AutomationResultsPage";

type PageKey = 'music' | 'content' | 'analytics' | 'tools' | 'results';

function getPageFromHash(): PageKey {
  const hash = (typeof window !== 'undefined' ? window.location.hash.replace('#', '') : '').toLowerCase();
  const valid: PageKey[] = ['music', 'content', 'analytics', 'tools', 'results'];
  return (valid.includes(hash as PageKey) ? (hash as PageKey) : 'music');
}

const Index = () => {
  const [page, setPage] = useState<PageKey>(getPageFromHash());

  useEffect(() => {
    const onHashChange = () => setPage(getPageFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const PageComponent = useMemo(() => {
    switch (page) {
      case 'music': return <MusicStorePage />;
      case 'content': return <ContentMarketingPage />;
      case 'analytics': return <AnalyticsTrafficPage />;
      case 'tools': return <AIToolsPage />;
      case 'results': return <AutomationResultsPage />;
      default: return <MusicStorePage />;
    }
  }, [page]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-hemp-light via-hemp-secondary to-hemp-primary">
      {/* Sticky header with hamburger menu */}
      <header className="sticky top-0 z-50 border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-14 flex items-center gap-3">
          <AppNavDrawer />
          <span className="text-sm text-muted-foreground capitalize">
            {page === 'music' && 'Music & Store'}
            {page === 'content' && 'Content & Marketing'}
            {page === 'analytics' && 'Analytics & Traffic'}
            {page === 'tools' && 'AI Tools'}
            {page === 'results' && 'Autonomy Results'}
          </span>
        </div>
      </header>

      <HeroSection />

      {PageComponent}
    </div>
  );
};

export default Index;
