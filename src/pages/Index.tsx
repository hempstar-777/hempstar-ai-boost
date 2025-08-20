
import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gradient-to-br from-hemp-light via-hemp-secondary to-hemp-primary">
      <HeroSection />
      
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 gap-2 bg-white/10 backdrop-blur-md border border-hemp-primary/20 h-16">
            <TabsTrigger value="dashboard" className="text-hemp-dark font-bold text-lg">
              🎵 Music & Store Dashboard
            </TabsTrigger>
            <TabsTrigger value="content" className="text-hemp-dark font-bold text-lg">
              📱 Content & Marketing
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-hemp-dark font-bold text-lg">
              📊 Analytics & Traffic
            </TabsTrigger>
            <TabsTrigger value="tools" className="text-hemp-dark font-bold text-lg">
              🤖 AI Tools
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-8 mt-8">
            {/* Featured Music & Spotify Section */}
            <TrafficMetrics />
            
            {/* Store Overview */}
            <div className="grid gap-8">
              <LiveStoreMonitor />
              <SIDashboard />
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-8 mt-8">
            <ContentDashboard />
            <BehaviorDashboard />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-8 mt-8">
            <AnalyticsDashboard />
            <TrafficBooster />
            <div className="grid md:grid-cols-2 gap-8">
              <SalesAnalytics />
              <CompetitorTracker />
            </div>
          </TabsContent>

          <TabsContent value="tools" className="space-y-8 mt-8">
            <AIAgentDashboard />
            <div className="grid gap-8">
              <ContentGenerator />
              <div className="grid md:grid-cols-2 gap-8">
                <VoiceInterface />
                <VirtualTryOn />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
