import { HeroSection } from "@/components/HeroSection";
import { AIToolsSection } from "@/components/AIToolsSection";
import { ContentGenerator } from "@/components/ContentGenerator";
import { VirtualTryOn } from "@/components/VirtualTryOn";
import { AIAgentDashboard } from "@/components/AIAgentDashboard";
import { AIAgentSetup } from "@/components/AIAgentSetup";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <AIToolsSection />
      <ContentGenerator />
      <VirtualTryOn />
      <AIAgentDashboard />
    </div>
  );
};

export default Index;
