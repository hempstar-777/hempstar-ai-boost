-- 1) Create agent_execution_locks table for concurrency control
create table if not exists public.agent_execution_locks (
  agent_id uuid primary key,
  expires_at timestamptz not null
);

-- Enable RLS (service role in Edge Functions bypasses RLS)
alter table public.agent_execution_locks enable row level security;

-- Helpful index for quick expiration cleanup
create index if not exists idx_agent_execution_locks_expires_at
  on public.agent_execution_locks (expires_at);

-- 2) Enable reliable realtime by ensuring full row data and publication membership
alter table public.ai_agents replica identity full;
alter table public.agent_logs replica identity full;

-- Add tables to supabase_realtime publication (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
      AND schemaname = 'public' 
      AND tablename = 'ai_agents'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_agents';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
      AND schemaname = 'public' 
      AND tablename = 'agent_logs'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.agent_logs';
  END IF;
END
$$;

-- 3) Ensure required extensions for scheduling HTTP calls
create extension if not exists pg_net with schema extensions;
create extension if not exists pg_cron with schema extensions;

-- Recreate cron job to call the enhanced-ai-executor every minute
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'enhanced_ai_executor_every_minute') THEN
    PERFORM cron.unschedule('enhanced_ai_executor_every_minute');
  END IF;
END
$$;

select cron.schedule(
  'enhanced_ai_executor_every_minute',
  '* * * * *',
  $$
  select
    net.http_post(
      url := 'https://amlwclyglkucfkuhjqps.functions.supabase.co/functions/v1/enhanced-ai-executor',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbHdjbHlnbGt1Y2ZrdWhqcXBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwMzA2OTMsImV4cCI6MjA2ODYwNjY5M30.zhd3gebWjOZXohYU4hJrbuN1O5a5RGYeKAZmubWjNOE"}'::jsonb,
      body := '{"action": "schedule_check"}'::jsonb
    )
  $$
);
