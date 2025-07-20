import { HeroSection } from "@/components/HeroSection";
import { AIToolsSection } from "@/components/AIToolsSection";
import { ContentGenerator } from "@/components/ContentGenerator";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <AIToolsSection />
      <ContentGenerator />
    </div>
  );
};

export default Index;
