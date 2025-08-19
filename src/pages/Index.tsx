import { Toaster } from "@/components/ui/toaster";
import { HeroSection } from "@/components/HeroSection";
import { VirtualTryOn } from "@/components/VirtualTryOn";
import { TrafficBooster } from "@/components/TrafficBooster";
import { LiveStoreMonitor } from "@/components/LiveStoreMonitor";
import { SalesAnalytics } from "@/components/SalesAnalytics";
import { ContentGenerator } from "@/components/ContentGenerator";
import { CompetitorTracker } from "@/components/CompetitorTracker";
import VoiceInterface from "@/components/VoiceInterface";
import { AIToolsSection } from "@/components/AIToolsSection";
import { HempStreetwareAISetup } from "@/components/HempStreetwareAISetup";
import { SIDashboard } from "@/components/SIDashboard";
import { AIAgentDashboard } from "@/components/AIAgentDashboard";
import { EnhancedAIAgentSetup } from "@/components/EnhancedAIAgentSetup";
import { UserProfile } from "@/components/UserProfile";
import { StartupInitializer } from "@/components/StartupInitializer";
import { AISystemStatus } from "@/components/AISystemStatus";
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";
import { ContentDashboard } from "@/components/content/ContentDashboard";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-primary/5">
      <StartupInitializer />
      
      {/* Header */}
      <header className="border-b border-primary/20 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              HempStar AI
            </h1>
            <a 
              href="https://hempstar.store" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Visit Store →
            </a>
          </div>
          <UserProfile />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-12">
          {/* System Status */}
          <AISystemStatus />
          
          {/* Hero Section */}
          <HeroSection />

          {/* Performance Analytics Dashboard */}
          <AnalyticsDashboard />

          {/* Content Generation Dashboard */}
          <ContentDashboard />
          
          {/* AI Tools Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <VirtualTryOn />
            <TrafficBooster />
            <LiveStoreMonitor />
            <SalesAnalytics />
            <ContentGenerator />
            <CompetitorTracker />
          </div>

          {/* Enhanced AI Section */}
          <div className="space-y-8">
            <AIToolsSection />
            <HempStreetwareAISetup />
            <EnhancedAIAgentSetup />
          </div>

          {/* Dashboards */}
          <div className="grid gap-8 lg:grid-cols-2">
            <AIAgentDashboard />
            <SIDashboard />
          </div>

          {/* Voice Interface */}
          <VoiceInterface />
        </div>
      </div>

      <Toaster />
    </div>
  );
};

export default Index;
