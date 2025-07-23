-- Create enum for agent types
CREATE TYPE public.agent_type AS ENUM (
  'social_media_poster',
  'inventory_monitor', 
  'customer_service',
  'price_tracker',
  'trend_analyzer',
  'email_marketer'
);

-- Create enum for agent status
CREATE TYPE public.agent_status AS ENUM (
  'active',
  'paused',
  'stopped',
  'error'
);

-- Create AI agents table
CREATE TABLE public.ai_agents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type agent_type NOT NULL,
  description TEXT,
  config JSONB NOT NULL DEFAULT '{}',
  schedule_cron TEXT NOT NULL DEFAULT '0 */6 * * *', -- Default: every 6 hours
  status agent_status NOT NULL DEFAULT 'active',
  last_run_at TIMESTAMP WITH TIME ZONE,
  next_run_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create agent execution logs table
CREATE TABLE public.agent_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID NOT NULL REFERENCES public.ai_agents(id) ON DELETE CASCADE,
  execution_id UUID NOT NULL DEFAULT gen_random_uuid(),
  status TEXT NOT NULL, -- 'started', 'completed', 'failed'
  message TEXT,
  data JSONB DEFAULT '{}',
  duration_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_logs ENABLE ROW LEVEL SECURITY;

-- Create policies (for now, allow all access - we'll add authentication later)
CREATE POLICY "Allow all access to ai_agents" 
ON public.ai_agents 
FOR ALL 
USING (true);

CREATE POLICY "Allow all access to agent_logs" 
ON public.agent_logs 
FOR ALL 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_ai_agents_updated_at
BEFORE UPDATE ON public.ai_agents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_ai_agents_status ON public.ai_agents(status);
CREATE INDEX idx_ai_agents_next_run ON public.ai_agents(next_run_at) WHERE status = 'active';
CREATE INDEX idx_agent_logs_agent_id ON public.agent_logs(agent_id);
CREATE INDEX idx_agent_logs_created_at ON public.agent_logs(created_at DESC);