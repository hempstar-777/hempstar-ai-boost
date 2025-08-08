import { HeroSection } from "@/components/HeroSection";
import { AIToolsSection } from "@/components/AIToolsSection";
import { ContentGenerator } from "@/components/ContentGenerator";
import { VirtualTryOn } from "@/components/VirtualTryOn";
import { AIAgentDashboard } from "@/components/AIAgentDashboard";
import { EnhancedAIAgentSetup } from "@/components/EnhancedAIAgentSetup";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Shield, LogOut, User } from "lucide-react";
import VoiceInterface from "@/components/VoiceInterface";

const Index = () => {
  const { signOut, user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Secure Header */}
      <div className="border-b border-primary/20 bg-gradient-to-r from-background to-background/50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Hempstar AI Control Center
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{user?.email}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={signOut}
              className="border-primary/20 hover:bg-primary/10"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Secure Logout
            </Button>
          </div>
        </div>
      </div>

      <HeroSection />
      <AIToolsSection />
      <ContentGenerator />
      <VirtualTryOn />
      
      {/* Enhanced AI Agent Management Section */}
      <section className="py-16 bg-gradient-to-br from-background via-background/50 to-primary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Enhanced AI Agent Management
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Create and manage AI agents with multi-level thinking, multitasking capabilities, and military-grade security
            </p>
          </div>
          
          <div className="flex justify-center mb-8">
            <EnhancedAIAgentSetup />
          </div>
          
          <AIAgentDashboard />
        </div>
      </section>

      {/* Voice interface floating controls */}
      <VoiceInterface />
    </div>
  );
};

export default Index;
