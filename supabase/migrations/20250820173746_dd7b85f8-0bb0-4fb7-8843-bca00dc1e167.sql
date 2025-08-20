
-- Fix user roles and permissions
-- 1. Create proper user role enum if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('admin', 'moderator', 'user');
    END IF;
END $$;

-- 2. Update profiles table to default to 'user' role instead of 'admin'
ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'user';

-- 3. Create security definer function to check user roles safely
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role user_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $function$
  SELECT exists (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
      AND (expires_at IS NULL OR expires_at > now())
  )
$function$;

-- 4. Fix subscribers table RLS - restrict updates to system only
DROP POLICY IF EXISTS "update_own_subscription" ON public.subscribers;
CREATE POLICY "System can update subscriptions" 
  ON public.subscribers 
  FOR UPDATE 
  USING (false);

-- 5. Restrict customer_behaviors to only allow authenticated inserts with user_id
DROP POLICY IF EXISTS "Users can insert behavior data" ON public.customer_behaviors;
CREATE POLICY "Authenticated users can insert their own behavior data" 
  ON public.customer_behaviors 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id AND auth.uid() IS NOT NULL);

-- 6. Fix audit_logs to only allow system inserts with valid UUIDs
DROP POLICY IF EXISTS "System can insert audit logs" ON public.audit_logs;
CREATE POLICY "System can insert audit logs with valid user_id" 
  ON public.audit_logs 
  FOR INSERT 
  WITH CHECK (
    user_id IS NOT NULL AND 
    user_id != '' AND
    user_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
  );

-- 7. Add rate limiting table for API calls
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  endpoint text NOT NULL,
  requests_count integer DEFAULT 1,
  window_start timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, endpoint, window_start)
);

ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own rate limits" 
  ON public.rate_limits 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "System can manage rate limits" 
  ON public.rate_limits 
  FOR ALL 
  USING (true);

-- 8. Create input validation function
CREATE OR REPLACE FUNCTION public.validate_input(input_text text, max_length integer DEFAULT 1000)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- Check for basic XSS patterns
  IF input_text ~* '<script|javascript:|on\w+=' THEN
    RETURN false;
  END IF;
  
  -- Check length
  IF length(input_text) > max_length THEN
    RETURN false;
  END IF;
  
  RETURN true;
END;
$function$;
