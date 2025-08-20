
-- Create table for tracking customer behavior
CREATE TABLE public.customer_behaviors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  session_id TEXT NOT NULL,
  page_url TEXT NOT NULL,
  action_type TEXT NOT NULL,
  action_data JSONB DEFAULT '{}'::jsonb,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_agent TEXT,
  referrer TEXT,
  device_type TEXT,
  location_data JSONB DEFAULT '{}'::jsonb
);

-- Create table for behavior patterns and insights
CREATE TABLE public.behavior_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pattern_type TEXT NOT NULL,
  pattern_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  confidence_score DECIMAL(3,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  active BOOLEAN DEFAULT true
);

-- Create table for automated behavior-based actions
CREATE TABLE public.behavior_actions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trigger_pattern TEXT NOT NULL,
  action_type TEXT NOT NULL,
  action_config JSONB NOT NULL DEFAULT '{}'::jsonb,
  executions_count INTEGER DEFAULT 0,
  success_rate DECIMAL(5,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  enabled BOOLEAN DEFAULT true
);

-- Enable Row Level Security
ALTER TABLE public.customer_behaviors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.behavior_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.behavior_actions ENABLE ROW LEVEL SECURITY;

-- Create policies for customer_behaviors
CREATE POLICY "Users can insert behavior data" 
  ON public.customer_behaviors 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can view all behavior data" 
  ON public.customer_behaviors 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

-- Create policies for behavior_insights
CREATE POLICY "Authenticated users can view insights" 
  ON public.behavior_insights 
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "System can manage insights" 
  ON public.behavior_insights 
  FOR ALL 
  USING (auth.uid() IS NOT NULL);

-- Create policies for behavior_actions
CREATE POLICY "Authenticated users can manage actions" 
  ON public.behavior_actions 
  FOR ALL 
  USING (auth.uid() IS NOT NULL);

-- Create indexes for better performance
CREATE INDEX idx_customer_behaviors_session ON public.customer_behaviors(session_id);
CREATE INDEX idx_customer_behaviors_timestamp ON public.customer_behaviors(timestamp);
CREATE INDEX idx_customer_behaviors_action_type ON public.customer_behaviors(action_type);
CREATE INDEX idx_behavior_insights_pattern_type ON public.behavior_insights(pattern_type);
CREATE INDEX idx_behavior_insights_active ON public.behavior_insights(active);
