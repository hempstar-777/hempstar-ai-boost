
import React, { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const StartupInitializer = () => {
  const { toast } = useToast();

  useEffect(() => {
    initializeDefaultAgents();
  }, []);

  const initializeDefaultAgents = async () => {
    try {
      // Check if agents already exist
      const { data: existingAgents } = await supabase
        .from('ai_agents')
        .select('id')
        .limit(1);

      if (existingAgents && existingAgents.length > 0) {
        console.log('AI agents already initialized');
        return;
      }

      // Create default AI agents
      const defaultAgents = [
        {
          name: 'Instagram Content Creator',
          type: 'social_media_poster',
          description: 'Creates engaging Instagram posts for hemp streetwear products',
          config: {
            prompt: 'Create trendy Instagram posts for HempStar streetwear brand featuring hemp clothing. Focus on sustainability, style, and street culture.',
            platforms: 'instagram'
          },
          schedule_cron: '0 */6 * * *',
          thinking_model: 'gpt-4.1-2025-04-14',
          max_thinking_depth: 3,
          security_level: 'enhanced'
        },
        {
          name: 'Smart Inventory Monitor',
          type: 'inventory_monitor',
          description: 'Monitors hemp product inventory and alerts on low stock',
          config: {
            threshold: 10,
            categories: ['hemp-tshirts', 'hemp-hoodies', 'accessories']
          },
          schedule_cron: '0 */2 * * *',
          thinking_model: 'gpt-4.1-2025-04-14',
          max_thinking_depth: 2,
          enable_multitasking: true,
          max_parallel_tasks: 3,
          security_level: 'enhanced'
        },
        {
          name: 'Customer Service AI',
          type: 'customer_service',
          description: 'Handles customer inquiries about hemp products and orders',
          config: {
            response_tone: 'friendly_professional',
            knowledge_base: 'hemp_streetwear'
          },
          schedule_cron: '*/15 * * * *',
          thinking_model: 'o3-2025-04-16',
          max_thinking_depth: 4,
          security_level: 'maximum'
        },
        {
          name: 'Hemp Market Trend Analyzer',
          type: 'trend_analyzer',
          description: 'Analyzes hemp fashion trends and market opportunities',
          config: {
            markets: ['streetwear', 'sustainable_fashion', 'hemp_products'],
            analysis_depth: 'comprehensive'
          },
          schedule_cron: '0 0 */3 * *',
          thinking_model: 'o3-2025-04-16',
          max_thinking_depth: 5,
          enable_multitasking: true,
          max_parallel_tasks: 4,
          security_level: 'enhanced'
        }
      ];

      const { error } = await supabase
        .from('ai_agents')
        .insert(defaultAgents);

      if (error) {
        console.error('Error creating default agents:', error);
        return;
      }

      console.log('Default AI agents initialized successfully');
      
      toast({
        title: "System Initialized",
        description: "Default AI agents have been created and are ready to use",
      });

    } catch (error) {
      console.error('Failed to initialize default agents:', error);
    }
  };

  return null; // This component doesn't render anything
};
