
-- Create profiles table for user management
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create AI agents table
CREATE TABLE IF NOT EXISTS public.ai_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  config JSONB DEFAULT '{}',
  thinking_model TEXT DEFAULT 'gpt-4.1-2025-04-14',
  max_thinking_depth INTEGER DEFAULT 3,
  enable_multitasking BOOLEAN DEFAULT false,
  max_parallel_tasks INTEGER DEFAULT 2,
  security_level TEXT DEFAULT 'standard',
  schedule_cron TEXT,
  status TEXT DEFAULT 'active',
  last_run_at TIMESTAMP WITH TIME ZONE,
  next_run_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create agent logs table
CREATE TABLE IF NOT EXISTS public.agent_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES public.ai_agents(id),
  execution_id UUID,
  status TEXT NOT NULL,
  message TEXT,
  data JSONB DEFAULT '{}',
  duration_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create agent execution locks table
CREATE TABLE IF NOT EXISTS public.agent_execution_locks (
  agent_id UUID PRIMARY KEY REFERENCES public.ai_agents(id),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_execution_locks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for ai_agents (admin access)
CREATE POLICY "Authenticated users can view agents" ON public.ai_agents
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage agents" ON public.ai_agents
  FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for agent_logs
CREATE POLICY "Authenticated users can view logs" ON public.agent_logs
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "System can insert logs" ON public.agent_logs
  FOR INSERT WITH CHECK (true);

-- RLS Policies for execution locks
CREATE POLICY "System can manage locks" ON public.agent_execution_locks
  FOR ALL USING (true);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON public.ai_agents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
