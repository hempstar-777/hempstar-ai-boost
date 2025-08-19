
import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { AIToolsSection } from "@/components/AIToolsSection";
import { AIAgentDashboard } from "@/components/AIAgentDashboard";
import { EnhancedAIAgentSetup } from "@/components/EnhancedAIAgentSetup";
import { HempStreetwareAISetup } from "@/components/HempStreetwareAISetup";
import { VirtualTryOn } from "@/components/VirtualTryOn";
import { ContentGenerator } from "@/components/ContentGenerator";
import { TrafficBooster } from "@/components/TrafficBooster";
import { CompetitorTracker } from "@/components/CompetitorTracker";
import { SalesAnalytics } from "@/components/SalesAnalytics";
import { LiveStoreMonitor } from "@/components/LiveStoreMonitor";
import { SIDashboard } from "@/components/SIDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VoiceInterface from "@/components/VoiceInterface";

const Index = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="si-control" className="w-full">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="si-control">SI Control</TabsTrigger>
            <TabsTrigger value="live-monitor">Live Store</TabsTrigger>
            <TabsTrigger value="ai-agents">AI Agents</TabsTrigger>
            <TabsTrigger value="traffic">Traffic</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="competitors">Competitors</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="tools">AI Tools</TabsTrigger>
          </TabsList>

          <TabsContent value="si-control" className="space-y-6">
            <SIDashboard />
          </TabsContent>

          <TabsContent value="live-monitor" className="space-y-6">
            <LiveStoreMonitor />
          </TabsContent>

          <TabsContent value="ai-agents" className="space-y-6">
            <AIAgentDashboard />
            <HempStreetwareAISetup />
            <EnhancedAIAgentSetup />
          </TabsContent>

          <TabsContent value="traffic" className="space-y-6">
            <TrafficBooster />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <SalesAnalytics />
          </TabsContent>

          <TabsContent value="competitors" className="space-y-6">
            <CompetitorTracker />
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <ContentGenerator />
            <VirtualTryOn />
          </TabsContent>

          <TabsContent value="tools" className="space-y-6">
            <AIToolsSection />
          </TabsContent>
        </Tabs>
      </div>

      <VoiceInterface onSpeakingChange={setIsSpeaking} />
    </div>
  );
};

export default Index;
