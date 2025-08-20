
import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIAgentDashboard } from "@/components/AIAgentDashboard";
import { LiveStoreMonitor } from "@/components/LiveStoreMonitor";
import { SalesAnalytics } from "@/components/SalesAnalytics";
import { CompetitorTracker } from "@/components/CompetitorTracker";
import { ContentGenerator } from "@/components/ContentGenerator";
import { VoiceInterface } from "@/components/VoiceInterface";
import { VirtualTryOn } from "@/components/VirtualTryOn";
import { SIDashboard } from "@/components/SIDashboard";
import { TrafficBooster } from "@/components/TrafficBooster";
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";
import { ContentDashboard } from "@/components/content/ContentDashboard";
import { BehaviorDashboard } from "@/components/behavior/BehaviorDashboard";

const Index = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gradient-to-br from-hemp-light via-hemp-secondary to-hemp-primary">
      <HeroSection />
      
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 gap-2 bg-white/10 backdrop-blur-md border border-hemp-primary/20">
            <TabsTrigger value="overview" className="text-hemp-dark font-semibold">Overview</TabsTrigger>
            <TabsTrigger value="analytics" className="text-hemp-dark font-semibold">Analytics</TabsTrigger>
            <TabsTrigger value="content" className="text-hemp-dark font-semibold">Content</TabsTrigger>
            <TabsTrigger value="behavior" className="text-hemp-dark font-semibold">Behavior</TabsTrigger>
            <TabsTrigger value="ai-agents" className="text-hemp-dark font-semibold">AI Agents</TabsTrigger>
            <TabsTrigger value="traffic" className="text-hemp-dark font-semibold">Traffic</TabsTrigger>
            <TabsTrigger value="store" className="text-hemp-dark font-semibold">Store</TabsTrigger>
            <TabsTrigger value="tools" className="text-hemp-dark font-semibold">Tools</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8 mt-8">
            <SIDashboard />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-8 mt-8">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="content" className="space-y-8 mt-8">
            <ContentDashboard />
          </TabsContent>

          <TabsContent value="behavior" className="space-y-8 mt-8">
            <BehaviorDashboard />
          </TabsContent>

          <TabsContent value="ai-agents" className="space-y-8 mt-8">
            <AIAgentDashboard />
          </TabsContent>

          <TabsContent value="traffic" className="space-y-8 mt-8">
            <TrafficBooster />
          </TabsContent>

          <TabsContent value="store" className="space-y-8 mt-8">
            <div className="grid gap-8">
              <LiveStoreMonitor />
              <div className="grid md:grid-cols-2 gap-8">
                <SalesAnalytics />
                <CompetitorTracker />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tools" className="space-y-8 mt-8">
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
