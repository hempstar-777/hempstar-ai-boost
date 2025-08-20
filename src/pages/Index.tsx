
import { HeroSection } from "@/components/HeroSection";
import { AIAgentDashboard } from "@/components/AIAgentDashboard";
import { LiveStoreMonitor } from "@/components/LiveStoreMonitor";
import { SalesAnalytics } from "@/components/SalesAnalytics";
import { CompetitorTracker } from "@/components/CompetitorTracker";
import { ContentGenerator } from "@/components/ContentGenerator";
import VoiceInterface from "@/components/VoiceInterface";
import { VirtualTryOn } from "@/components/VirtualTryOn";
import { SIDashboard } from "@/components/SIDashboard";
import { TrafficBooster } from "@/components/TrafficBooster";
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";
import { ContentDashboard } from "@/components/content/ContentDashboard";
import { BehaviorDashboard } from "@/components/behavior/BehaviorDashboard";
import { TrafficMetrics } from "@/components/traffic/TrafficMetrics";
import AppNavDrawer from "@/components/navigation/AppNavDrawer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-hemp-light via-hemp-secondary to-hemp-primary">
      {/* Sticky header with hamburger menu */}
      <header className="sticky top-0 z-50 border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-14 flex items-center gap-3">
          <AppNavDrawer />
          <span className="text-sm text-muted-foreground">Menu</span>
        </div>
      </header>

      <HeroSection />

      <main className="container mx-auto px-4 py-8 space-y-16">
        {/* Music & Store Dashboard */}
        <section id="section-dashboard" className="space-y-8">
          <h2 className="text-2xl font-bold text-hemp-dark">🎵 Music & Store Dashboard</h2>
          <TrafficMetrics />
          <div className="grid gap-8">
            <LiveStoreMonitor />
            <SIDashboard />
          </div>
        </section>

        {/* Content & Marketing */}
        <section id="section-content" className="space-y-8">
          <h2 className="text-2xl font-bold text-hemp-dark">📱 Content & Marketing</h2>
          <ContentDashboard />
          <BehaviorDashboard />
        </section>

        {/* Analytics & Traffic */}
        <section id="section-analytics" className="space-y-8">
          <h2 className="text-2xl font-bold text-hemp-dark">📊 Analytics & Traffic</h2>
          <AnalyticsDashboard />
          <TrafficBooster />
          <div className="grid md:grid-cols-2 gap-8">
            <SalesAnalytics />
            <CompetitorTracker />
          </div>
        </section>

        {/* AI Tools */}
        <section id="section-tools" className="space-y-8">
          <h2 className="text-2xl font-bold text-hemp-dark">🤖 AI Tools</h2>
          <AIAgentDashboard />
          <div className="grid gap-8">
            <ContentGenerator />
            <div className="grid md:grid-cols-2 gap-8">
              <VoiceInterface />
              <VirtualTryOn />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
