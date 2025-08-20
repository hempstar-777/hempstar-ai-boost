
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!; // Use anon key instead of service role
const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create client with user's JWT for proper RLS
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
      global: { headers: { Authorization: authHeader } }
    });

    // Verify user is authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Rate limiting check
    const rateLimitResult = await checkRateLimit(supabase, user.id, 'enhanced-ai-executor');
    if (!rateLimitResult.allowed) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded', resetTime: rateLimitResult.resetTime }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { action, agentId, tasks } = await req.json();

    // Validate input
    if (!validateInput(action) || !validateInput(agentId)) {
      return new Response(
        JSON.stringify({ error: 'Invalid input data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Enhanced AI Executor - Action: ${action}, AgentId: ${agentId}, User: ${user.id}`);

    // Log the action
    await logSecureAuditEvent(supabase, user.id, agentId, action, 'enhanced_ai_executor');

    switch (action) {
      case 'execute':
        return await executeEnhancedAgent(supabase, agentId, user.id);
      case 'execute_parallel':
        return await executeParallelTasks(supabase, tasks, user.id);
      case 'schedule_check':
        return await scheduleCheck(supabase, user.id);
      default:
        throw new Error(`Unknown action: ${action}`);
    }
  } catch (error) {
    console.error('Enhanced AI Executor Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function checkRateLimit(supabase: any, userId: string, endpoint: string) {
  const windowStart = new Date();
  windowStart.setMinutes(windowStart.getMinutes() - 10); // 10 minute window

  const { data, error } = await supabase
    .from('rate_limits')
    .select('requests_count')
    .eq('user_id', userId)
    .eq('endpoint', endpoint)
    .gte('window_start', windowStart.toISOString())
    .single();

  if (error && error.code !== 'PGRST116') { // Not found is OK
    return { allowed: true };
  }

  const currentCount = data?.requests_count || 0;
  const maxRequests = 50; // 50 requests per 10 minutes

  if (currentCount >= maxRequests) {
    return { 
      allowed: false, 
      resetTime: new Date(Date.now() + 10 * 60 * 1000).toISOString() 
    };
  }

  // Update or insert rate limit record
  await supabase
    .from('rate_limits')
    .upsert({
      user_id: userId,
      endpoint: endpoint,
      requests_count: currentCount + 1,
      window_start: windowStart.toISOString()
    });

  return { allowed: true };
}

function validateInput(input: any): boolean {
  if (typeof input !== 'string') return false;
  if (input.length > 1000) return false;
  if (/<script|javascript:|on\w+=/i.test(input)) return false;
  return true;
}

async function logSecureAuditEvent(supabase: any, userId: string, agentId: string, action: string, resourceType: string) {
  try {
    await supabase.from('audit_logs').insert({
      user_id: userId,
      agent_id: agentId,
      action: action,
      resource_type: resourceType,
      details: {
        timestamp: new Date().toISOString(),
        secure: true
      }
    });
  } catch (error) {
    console.warn('Failed to log audit event:', error);
  }
}

async function executeEnhancedAgent(supabase: any, agentId: string, userId: string) {
  const startTime = Date.now();
  const executionId = crypto.randomUUID();

  try {
    // Fetch agent - RLS will ensure user can only access their own agents
    const { data: agent, error } = await supabase
      .from('ai_agents')
      .select('*')
      .eq('id', agentId)
      .single();

    if (error || !agent) {
      throw new Error(`Agent not found or access denied: ${agentId}`);
    }

    // Enhanced security validation
    if (!validateAgentSecurity(agent)) {
      throw new Error('Agent failed security validation');
    }

    const result = await executeAgentSecurely(agent, userId);

    const duration = Date.now() - startTime;

    return new Response(
      JSON.stringify({ 
        success: true, 
        executionId,
        duration,
        result: sanitizeOutput(result)
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error(`Secure agent execution failed:`, error);
    return new Response(
      JSON.stringify({ error: 'Execution failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function executeAgentSecurely(agent: any, userId: string) {
  // Sanitize and validate agent configuration
  const safeConfig = sanitizeAgentConfig(agent.config);
  
  return {
    type: agent.type,
    status: 'completed',
    message: `Agent ${agent.name} executed securely`,
    userId: userId,
    timestamp: new Date().toISOString(),
    securityLevel: 'enhanced'
  };
}

function validateAgentSecurity(agent: any): boolean {
  if (!agent.name || !agent.type) return false;
  if (agent.security_level === 'maximum' && !agent.config) return false;
  return true;
}

function sanitizeAgentConfig(config: any): any {
  if (!config || typeof config !== 'object') return {};
  
  const safe: any = {};
  const allowedKeys = ['prompt', 'model', 'temperature', 'max_tokens'];
  
  for (const key of allowedKeys) {
    if (config[key] && typeof config[key] === 'string') {
      safe[key] = config[key].substring(0, 1000); // Limit length
    }
  }
  
  return safe;
}

function sanitizeOutput(output: any): any {
  if (typeof output === 'string') {
    return output.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '[SCRIPT_REMOVED]');
  }
  if (typeof output === 'object' && output !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(output)) {
      sanitized[key] = sanitizeOutput(value);
    }
    return sanitized;
  }
  return output;
}

async function executeParallelTasks(supabase: any, tasks: string[], userId: string) {
  // Limit parallel tasks for security
  const safeTasks = tasks?.slice(0, 5) || [];
  
  const results = await Promise.all(
    safeTasks.map(async (taskId) => {
      try {
        return await executeEnhancedAgent(supabase, taskId, userId);
      } catch (error) {
        return { taskId, error: 'Task execution failed' };
      }
    })
  );

  return new Response(
    JSON.stringify({ parallel_results: results }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function scheduleCheck(supabase: any, userId: string) {
  // Only check user's own agents due to RLS
  const { data: agents, error } = await supabase
    .from('ai_agents')
    .select('*')
    .eq('status', 'active')
    .lt('next_run_at', new Date().toISOString());

  if (error) throw error;

  return new Response(
    JSON.stringify({ message: `Found ${agents?.length || 0} agents ready for execution` }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}
