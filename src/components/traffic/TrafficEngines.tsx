
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Search, 
  TrendingUp, 
  Globe, 
  Target, 
  Zap, 
  Rocket,
  Brain,
  Network,
  Megaphone,
  ShoppingBag
} from 'lucide-react';

const trafficEngines = [
  {
    icon: Search,
    title: "SEO Domination Engine",
    description: "Generate viral content about streetwear embroidery and hemp fashion to flood search results with hempstar.store",
    impact: "500% organic traffic surge",
    color: "hemp-primary",
    status: "VIRAL",
    features: ["Streetwear SEO mastery", "Hemp fashion content", "Embroidery trend articles", "Search domination tactics"]
  },
  {
    icon: Megaphone,
    title: "Social Media Tsunami",
    description: "Blast engaging embroidered design content across ALL platforms to create unstoppable brand awareness",
    impact: "1000% social engagement explosion",
    color: "hemp-accent", 
    status: "EXPLOSIVE",
    features: ["Instagram takeover", "TikTok viral content", "Facebook bombing", "Twitter storms"]
  },
  {
    icon: Globe,
    title: "Internet Invasion Protocol",
    description: "Deploy across Reddit, forums, and communities to make hempstar.store the #1 streetwear embroidery destination",
    impact: "2000% reach amplification",
    color: "hemp-primary",
    status: "UNSTOPPABLE",
    features: ["Reddit infiltration", "Forum conquest", "Community takeover", "Viral spread tactics"]
  },
  {
    icon: Brain,
    title: "AI Customer Hunter",
    description: "Use advanced AI to track, target and convert visitors with personalized embroidered streetwear recommendations",
    impact: "400% conversion explosion",
    color: "hemp-accent",
    status: "GENIUS", 
    features: ["Smart visitor tracking", "AI recommendations", "Behavior prediction", "Sales optimization"]
  },
  {
    icon: Network,
    title: "Influencer Magnet System",
    description: "Automatically connect with streetwear influencers to showcase your embroidered designs to millions",
    impact: "800% influencer reach",
    color: "hemp-primary",
    status: "MAGNETIC",
    features: ["Influencer discovery", "Auto outreach", "Brand partnerships", "Viral collaborations"]
  },
  {
    icon: ShoppingBag,
    title: "Shopping Platform Blitz",
    description: "Dominate Google Shopping, Amazon, eBay and all marketplaces with your embroidered streetwear collection",
    impact: "600% marketplace sales",
    color: "hemp-accent",
    status: "BLITZING",
    features: ["Google Shopping optimization", "Amazon presence", "eBay domination", "Marketplace conquest"]
  }
];

interface TrafficEnginesProps {
  onEngineActivate: (engineTitle: string) => void;
  isDeploying: boolean;
  activeEngine: string | null;
}

export const TrafficEngines = ({ onEngineActivate, isDeploying, activeEngine }: TrafficEnginesProps) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {trafficEngines.map((engine, index) => (
        <Card key={index} className="group border-hemp-primary/20 hover:border-hemp-primary/60 transition-all duration-300 hover:shadow-2xl hover:shadow-hemp-primary/20 hover:scale-105">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 bg-${engine.color}/20 rounded-xl flex items-center justify-center group-hover:animate-pulse`}>
                  <engine.icon className={`w-6 h-6 text-${engine.color}`} />
                </div>
                <div>
                  <CardTitle className="text-lg">{engine.title}</CardTitle>
                  <Badge className={`bg-${engine.color}/20 text-${engine.color} border-${engine.color}/40 mt-1 font-black animate-pulse`}>
                    {engine.status}
                  </Badge>
                </div>
              </div>
              <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-700 border-green-500/40 font-black">
                {engine.impact}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <p className="text-muted-foreground font-medium">{engine.description}</p>
            
            <div className="space-y-2">
              {engine.features.map((feature, featureIndex) => (
                <div key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                  <Zap className="w-3 h-3 text-hemp-accent mr-2 animate-pulse" />
                  {feature}
                </div>
              ))}
            </div>

            <Button 
              onClick={() => onEngineActivate(engine.title)}
              disabled={isDeploying}
              className={`w-full bg-gradient-to-r from-${engine.color} to-hemp-accent hover:from-hemp-accent hover:to-${engine.color} text-hemp-dark font-black group-hover:animate-bounce`}
            >
              {activeEngine === engine.title && isDeploying ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-hemp-dark border-t-transparent rounded-full mr-2"></div>
                  ACTIVATING...
                </>
              ) : (
                <>
                  <Rocket className="w-4 h-4 mr-2" />
                  LAUNCH ENGINE
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
