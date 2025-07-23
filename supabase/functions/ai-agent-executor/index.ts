import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AgentConfig {
  openai_api_key?: string;
  instagram_token?: string;
  facebook_token?: string;
  twitter_token?: string;
  prompt?: string;
  webhook_url?: string;
  [key: string]: any;
}

interface AIAgent {
  id: string;
  name: string;
  type: 'social_media_poster' | 'inventory_monitor' | 'customer_service' | 'price_tracker' | 'trend_analyzer' | 'email_marketer';
  description: string;
  config: AgentConfig;
  schedule_cron: string;
  status: 'active' | 'paused' | 'stopped' | 'error';
  last_run_at?: string;
  next_run_at?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      'https://amlwclyglkucfkuhjqps.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbHdjbHlnbGt1Y2ZrdWhqcXBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwMzA2OTMsImV4cCI6MjA2ODYwNjY5M30.zhd3gebWjOZXohYU4hJrbuN1O5a5RGYeKAZmubWjNOE'
    );

    const { agentId, action } = await req.json();
    console.log(`Executing action: ${action} for agent: ${agentId}`);

    if (action === 'execute') {
      return await executeAgent(supabase, agentId);
    } else if (action === 'schedule_check') {
      return await scheduleCheck(supabase);
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in ai-agent-executor:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function executeAgent(supabase: any, agentId: string) {
  const startTime = Date.now();
  const executionId = crypto.randomUUID();
  
  try {
    // Log execution start
    await supabase.from('agent_logs').insert({
      agent_id: agentId,
      execution_id: executionId,
      status: 'started',
      message: 'Agent execution started'
    });

    // Get agent details
    const { data: agent, error: agentError } = await supabase
      .from('ai_agents')
      .select('*')
      .eq('id', agentId)
      .single();

    if (agentError || !agent) {
      throw new Error(`Agent not found: ${agentError?.message}`);
    }

    console.log(`Executing agent: ${agent.name} (${agent.type})`);

    let result;
    switch (agent.type) {
      case 'social_media_poster':
        result = await executeSocialMediaPoster(agent);
        break;
      case 'inventory_monitor':
        result = await executeInventoryMonitor(agent);
        break;
      case 'customer_service':
        result = await executeCustomerService(agent);
        break;
      case 'price_tracker':
        result = await executePriceTracker(agent);
        break;
      case 'trend_analyzer':
        result = await executeTrendAnalyzer(agent);
        break;
      case 'email_marketer':
        result = await executeEmailMarketer(agent);
        break;
      default:
        throw new Error(`Unknown agent type: ${agent.type}`);
    }

    // Update agent last run time
    await supabase
      .from('ai_agents')
      .update({ 
        last_run_at: new Date().toISOString(),
        status: 'active'
      })
      .eq('id', agentId);

    // Log success
    const duration = Date.now() - startTime;
    await supabase.from('agent_logs').insert({
      agent_id: agentId,
      execution_id: executionId,
      status: 'completed',
      message: 'Agent execution completed successfully',
      data: result,
      duration_ms: duration
    });

    return new Response(
      JSON.stringify({ success: true, result, duration: duration }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error(`Agent execution failed:`, error);
    
    // Update agent status to error
    await supabase
      .from('ai_agents')
      .update({ status: 'error' })
      .eq('id', agentId);

    // Log failure
    const duration = Date.now() - startTime;
    await supabase.from('agent_logs').insert({
      agent_id: agentId,
      execution_id: executionId,
      status: 'failed',
      message: error.message,
      duration_ms: duration
    });

    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function scheduleCheck(supabase: any) {
  try {
    // Get all active agents that need to run
    const { data: agents, error } = await supabase
      .from('ai_agents')
      .select('*')
      .eq('status', 'active')
      .lte('next_run_at', new Date().toISOString());

    if (error) {
      throw new Error(`Failed to fetch agents: ${error.message}`);
    }

    console.log(`Found ${agents?.length || 0} agents ready to execute`);

    const results = [];
    for (const agent of agents || []) {
      try {
        const result = await executeAgent(supabase, agent.id);
        results.push({ agentId: agent.id, success: true });
      } catch (error) {
        console.error(`Failed to execute agent ${agent.id}:`, error);
        results.push({ agentId: agent.id, success: false, error: error.message });
      }
    }

    return new Response(
      JSON.stringify({ executed: results.length, results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Schedule check failed:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

// Agent type implementations
async function executeSocialMediaPoster(agent: AIAgent) {
  console.log('Executing social media poster agent');
  
  const openaiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openaiKey) {
    throw new Error('OpenAI API key not configured');
  }

  // Generate content using OpenAI
  const prompt = agent.config.prompt || "Create an engaging social media post for a streetwear brand called HempStar. Make it trendy, authentic, and include relevant hashtags.";
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a social media expert for streetwear brands. Create engaging, authentic posts.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 500
    }),
  });

  const data = await response.json();
  const generatedContent = data.choices[0].message.content;

  return {
    action: 'social_media_post_generated',
    content: generatedContent,
    timestamp: new Date().toISOString()
  };
}

async function executeInventoryMonitor(agent: AIAgent) {
  console.log('Executing inventory monitor agent');
  
  // Simulate inventory check
  const lowStockItems = [
    { name: "Hemp Hoodie - Black", stock: 3, threshold: 5 },
    { name: "Organic T-Shirt - White", stock: 1, threshold: 10 }
  ];

  return {
    action: 'inventory_checked',
    low_stock_items: lowStockItems,
    total_items_checked: 25,
    timestamp: new Date().toISOString()
  };
}

async function executeCustomerService(agent: AIAgent) {
  console.log('Executing customer service agent');
  
  // Simulate responding to customer inquiries
  return {
    action: 'customer_service_responses',
    responses_sent: 3,
    avg_response_time: '2.5 minutes',
    satisfaction_score: 4.8,
    timestamp: new Date().toISOString()
  };
}

async function executePriceTracker(agent: AIAgent) {
  console.log('Executing price tracker agent');
  
  // Simulate competitor price monitoring
  const priceUpdates = [
    { competitor: "CompetitorA", product: "Hemp Hoodie", price: 79.99, change: -5.00 },
    { competitor: "CompetitorB", product: "Organic Tee", price: 34.99, change: +2.00 }
  ];

  return {
    action: 'prices_tracked',
    price_updates: priceUpdates,
    competitors_monitored: 5,
    timestamp: new Date().toISOString()
  };
}

async function executeTrendAnalyzer(agent: AIAgent) {
  console.log('Executing trend analyzer agent');
  
  const openaiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openaiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a fashion trend analyst. Analyze current streetwear trends.' },
        { role: 'user', content: 'What are the top 3 streetwear trends right now? Provide brief analysis.' }
      ],
      max_tokens: 300
    }),
  });

  const data = await response.json();
  const trends = data.choices[0].message.content;

  return {
    action: 'trends_analyzed',
    analysis: trends,
    trending_keywords: ['sustainable fashion', 'hemp clothing', 'vintage streetwear'],
    timestamp: new Date().toISOString()
  };
}

async function executeEmailMarketer(agent: AIAgent) {
  console.log('Executing email marketer agent');
  
  // Simulate email campaign analysis
  return {
    action: 'email_campaign_analyzed',
    campaigns_sent: 2,
    open_rate: '24.5%',
    click_rate: '3.2%',
    subscribers_added: 15,
    timestamp: new Date().toISOString()
  };
}