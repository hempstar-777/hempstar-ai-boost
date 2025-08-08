-- Enable realtime for ai_agents and agent_logs safely
DO $$
BEGIN
  -- Set REPLICA IDENTITY FULL to capture old row data on updates
  EXECUTE 'ALTER TABLE public.ai_agents REPLICA IDENTITY FULL';
EXCEPTION WHEN others THEN
  IF SQLSTATE = '42P01' THEN -- undefined_table
    RAISE NOTICE 'Table public.ai_agents does not exist, skipping.';
  ELSE
    RAISE NOTICE 'Skipping due to: %', SQLERRM;
  END IF;
END$$;

DO $$
BEGIN
  EXECUTE 'ALTER TABLE public.agent_logs REPLICA IDENTITY FULL';
EXCEPTION WHEN others THEN
  IF SQLSTATE = '42P01' THEN
    RAISE NOTICE 'Table public.agent_logs does not exist, skipping.';
  ELSE
    RAISE NOTICE 'Skipping due to: %', SQLERRM;
  END IF;
END$$;

-- Add tables to supabase_realtime publication if not already present
DO $$
DECLARE
  rel_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'ai_agents'
  ) INTO rel_exists;
  IF NOT rel_exists THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_agents';
  END IF;
END$$;

DO $$
DECLARE
  rel_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'agent_logs'
  ) INTO rel_exists;
  IF NOT rel_exists THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.agent_logs';
  END IF;
END$$;