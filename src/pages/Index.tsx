
import { HeroSection } from "@/components/HeroSection";
import { AIToolsSection } from "@/components/AIToolsSection";
import { AIAgentDashboard } from "@/components/AIAgentDashboard";
import { EnhancedAIAgentSetup } from "@/components/EnhancedAIAgentSetup";
import { HempStreetwareAISetup } from "@/components/HempStreetwareAISetup";
import { ContentGenerator } from "@/components/ContentGenerator";
import { VirtualTryOn } from "@/components/VirtualTryOn";
import { VoiceInterface } from "@/components/VoiceInterface";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      
      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Hemp Streetwear AI Suite */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Next-Gen Hemp Streetwear AI</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Deploy specialized AI agents optimized for your hemp streetwear brand with advanced thinking capabilities
            </p>
          </div>
          <HempStreetwareAISetup />
        </section>

        {/* Enhanced AI Agent Setup */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Custom AI Agent Creation</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Create custom AI agents with advanced multi-level thinking and security features
            </p>
          </div>
          <EnhancedAIAgentSetup />
        </section>

        {/* AI Agent Dashboard */}
        <section>
          <AIAgentDashboard />
        </section>

        {/* AI Tools Section */}
        <section>
          <AIToolsSection />
        </section>

        {/* Content Generator */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">AI Content Generator</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Generate viral content for your hemp streetwear brand
            </p>
          </div>
          <ContentGenerator />
        </section>

        {/* Virtual Try-On */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Virtual Try-On Experience</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Let customers try on your hemp streetwear virtually
            </p>
          </div>
          <VirtualTryOn />
        </section>
      </div>

      {/* Voice Interface */}
      <VoiceInterface />
    </div>
  );
};

export default Index;
