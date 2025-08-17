
import React from "react";
import { HeroSection } from "@/components/HeroSection";
import { EnhancedAIAgentSetup } from "@/components/EnhancedAIAgentSetup";
import { AIToolsSection } from "@/components/AIToolsSection";
import VoiceInterface from "@/components/VoiceInterface";
import { TrafficBooster } from "@/components/TrafficBooster";
import { CompetitorTracker } from "@/components/CompetitorTracker";
import { SalesAnalytics } from "@/components/SalesAnalytics";
import { LiveStoreMonitor } from "@/components/LiveStoreMonitor";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-hemp-light via-white to-hemp-accent/20">
      <HeroSection />
      
      {/* Real-Time Store Monitor - Priority Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-hemp-dark mb-4">
              🔴 LIVE Store Monitor
            </h2>
            <p className="text-xl text-hemp-dark/80 max-w-3xl mx-auto">
              Real-time access to your actual hempstar.store inventory. Track materials, pricing, and stock levels as they change.
            </p>
          </div>
          <LiveStoreMonitor />
        </div>
      </section>

      {/* Voice Interface */}
      <section className="py-16 px-4 bg-hemp-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-hemp-dark mb-8">
            Voice Control Center
          </h2>
          <VoiceInterface />
        </div>
      </section>

      {/* Enhanced AI Agent Setup */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <EnhancedAIAgentSetup />
        </div>
      </section>

      {/* Traffic & Sales Boosters */}
      <section className="py-16 px-4 bg-hemp-accent/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-hemp-dark mb-4">
              🚀 Traffic & Sales Arsenal
            </h2>
            <p className="text-xl text-hemp-dark/80 max-w-3xl mx-auto">
              Real-time competitor tracking, SEO optimization, and sales intelligence for hempstar.store domination.
            </p>
          </div>
          
          <div className="grid gap-8">
            <TrafficBooster />
            <CompetitorTracker />
            <SalesAnalytics />
          </div>
        </div>
      </section>

      {/* AI Tools Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <AIToolsSection />
        </div>
      </section>
    </div>
  );
};

export default Index;
