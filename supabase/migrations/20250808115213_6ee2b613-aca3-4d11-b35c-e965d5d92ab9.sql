-- Remove overly permissive policy on ai_agents
DO $$
BEGIN
  EXECUTE 'DROP POLICY IF EXISTS "Allow all access to ai_agents" ON public.ai_agents';
EXCEPTION WHEN others THEN
  RAISE NOTICE 'Could not drop policy: %', SQLERRM;
END$$;