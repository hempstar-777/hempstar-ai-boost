import { supabase } from "@/integrations/supabase/client";

export const testOpenAIConnection = async () => {
  try {
    console.log("Testing OpenAI API key...");
    
    const { data, error } = await supabase.functions.invoke('enhanced-ai-executor', {
      body: { 
        action: 'execute', 
        agentId: '51f59d31-140f-409d-9f9c-c84178c5a767' // Instagram Content Creator
      }
    });

    if (error) {
      console.error('OpenAI API test failed:', error);
      return { success: false, error: error.message };
    }

    console.log('OpenAI API test result:', data);
    return { success: true, data };
  } catch (error) {
    console.error('OpenAI API test error:', error);
    return { success: false, error: error.message };
  }
};