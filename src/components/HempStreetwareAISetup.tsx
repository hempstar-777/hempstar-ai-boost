
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, TrendingUp, Instagram, ShoppingCart, MessageCircle, Mail } from 'lucide-react';

const hempStreetwareAgents = [
  {
    name: 'Hemp Trend Analyzer',
    type: 'trend_analyzer',
    description: 'Analyzes hemp streetwear trends, competitor pricing, and market opportunities',
    schedule_cron: '0 */6 * * *',
    config: {
      keywords: 'hemp streetwear, hemp fashion, streetwear brands, sustainable fashion',
      analysis_depth: 'comprehensive',
      competitor_tracking: true,
      price_monitoring: true
    }
  },
  {
    name: 'Instagram Content Creator',
    type: 'social_media_poster',
    description: 'Creates viral hemp streetwear content for Instagram with trend analysis',
    schedule_cron: '0 9,15,21 * * *',
    config: {
      prompt: 'Create engaging Instagram posts about hemp streetwear trends, sustainability, and street fashion. Focus on viral content that appeals to Gen Z and millennials interested in sustainable fashion.',
      platforms: 'instagram',
      hashtags: '#hempstreetware #sustainablefashion #streetwear #hemp #ecofashion',
      content_types: ['product_showcase', 'trend_analysis', 'lifestyle', 'behind_the_scenes']
    }
  },
  {
    name: 'Customer Service AI',
    type: 'customer_service',
    description: 'Handles customer inquiries about hemp products, sizing, and sustainability',
    schedule_cron: '*/30 * * * *',
    config: {
      knowledge_base: 'hemp_products',
      response_tone: 'friendly_expert',
      languages: ['en'],
      escalation_keywords: ['complaint', 'refund', 'quality_issue']
    }
  },
  {
    name: 'Inventory Monitor Pro',
    type: 'inventory_monitor',
    description: 'Monitors hemp streetwear inventory with predictive restocking',
    schedule_cron: '0 */3 * * *',
    config: {
      threshold: 15,
      categories: ['hemp_hoodies', 'hemp_tees', 'hemp_accessories'],
      predictive_analytics: true,
      seasonal_adjustments: true
    }
  },
  {
    name: 'Email Marketing AI',
    type: 'email_marketer',
    description: 'Creates personalized email campaigns for hemp streetwear customers',
    schedule_cron: '0 10 * * 1,3,5',
    config: {
      campaign_types: ['product_launches', 'sustainability_education', 'style_guides'],
      personalization_level: 'high',
      segment_targeting: true
    }
  }
];

export const HempStreetwareAISetup = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const { toast } = useToast();

  const createHempAIAgents = async () => {
    setIsCreating(true);
    
    try {
      const agentPromises = hempStreetwareAgents.map(agent => 
        supabase.from('ai_agents').insert([{
          name: agent.name,
          type: agent.type as any,
          description: agent.description,
          schedule_cron: agent.schedule_cron,
          thinking_model: 'gpt-4.1-2025-04-14',
          max_thinking_depth: 5,
          enable_multitasking: true,
          max_parallel_tasks: 3,
          security_level: 'enhanced',
          config: agent.config as any,
          status: 'active' as any,
          next_run_at: new Date().toISOString(),
        }])
      );

      const results = await Promise.allSettled(agentPromises);
      const successCount = results.filter(r => r.status === 'fulfilled').length;
      
      toast({
        title: "Hemp Streetwear AI Agents Created!",
        description: `Successfully created ${successCount} specialized AI agents for your hemp streetwear brand`,
      });
    } catch (error: any) {
      toast({
        title: "Creation Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const deployAllAgents = async () => {
    setIsDeploying(true);
    
    try {
      // Get all active agents
      const { data: agents, error: fetchError } = await supabase
        .from('ai_agents')
        .select('*')
        .eq('status', 'active');

      if (fetchError) throw fetchError;

      if (!agents || agents.length === 0) {
        toast({
          title: "No Active Agents",
          description: "Create AI agents first, then deploy them",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Deploying AI Arsenal",
        description: `Activating ${agents.length} AI agents for your hemp streetwear empire...`,
      });

      // Execute all agents in parallel
      const deployPromises = agents.map(agent => 
        supabase.functions.invoke('enhanced-ai-executor', {
          body: { agentId: agent.id, action: 'execute' }
        })
      );

      const results = await Promise.allSettled(deployPromises);
      const successCount = results.filter(r => r.status === 'fulfilled' && !r.value.error).length;
      const failureCount = results.length - successCount;

      if (successCount > 0) {
        toast({
          title: "🚀 AI Arsenal Deployed!",
          description: `${successCount} AI agents are now working for your hemp streetwear brand${failureCount > 0 ? `, ${failureCount} need attention` : ''}`,
        });
      } else {
        toast({
          title: "Deployment Issues",
          description: "Some agents failed to deploy. Check the Activity Logs for details.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Deployment Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <CardTitle className="text-xl">Hemp Streetwear AI Suite</CardTitle>
          </div>
          <CardDescription>
            Deploy specialized AI agents optimized for your hemp streetwear brand
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {hempStreetwareAgents.map((agent, index) => {
              const icons = {
                trend_analyzer: TrendingUp,
                social_media_poster: Instagram,
                customer_service: MessageCircle,
                inventory_monitor: ShoppingCart,
                email_marketer: Mail,
              };
              const IconComponent = icons[agent.type as keyof typeof icons] || Sparkles;
              
              return (
                <Card key={index} className="border-primary/10">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-2">
                      <IconComponent className="h-4 w-4 text-primary" />
                      <CardTitle className="text-sm">{agent.name}</CardTitle>
                    </div>
                    <CardDescription className="text-xs">
                      {agent.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              onClick={createHempAIAgents}
              disabled={isCreating}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 flex-1"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {isCreating ? "Creating AI Agents..." : "Create Hemp AI Agents"}
            </Button>
            
            <Button 
              onClick={deployAllAgents}
              disabled={isDeploying}
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground flex-1"
            >
              {isDeploying ? "Deploying..." : "Deploy All Agents"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
