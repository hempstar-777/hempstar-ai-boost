-- Enable realtime for ai_agents table
ALTER TABLE public.ai_agents REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.ai_agents;

-- Enable realtime for agent_logs table  
ALTER TABLE public.agent_logs REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.agent_logs;