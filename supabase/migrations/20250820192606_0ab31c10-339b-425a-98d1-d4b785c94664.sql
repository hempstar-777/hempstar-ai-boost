
-- Fix critical RLS policy issues and improve database security

-- 1. Fix overly permissive policies
DROP POLICY IF EXISTS "System can manage referrals" ON public.referrals;
DROP POLICY IF EXISTS "System can manage affiliate stats" ON public.affiliate_stats;
DROP POLICY IF EXISTS "System can update template purchases" ON public.template_purchases;
DROP POLICY IF EXISTS "update_own_subscription" ON public.subscribers;
DROP POLICY IF EXISTS "insert_subscription" ON public.subscribers;

-- Create more restrictive policies for referrals
CREATE POLICY "Users can view their own referrals" ON public.referrals
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.affiliates 
    WHERE affiliates.id = referrals.affiliate_id 
    AND affiliates.user_id = auth.uid()
  )
);

-- Service role can manage referrals (for webhooks/automation)
CREATE POLICY "Service role can manage referrals" ON public.referrals
FOR ALL USING (
  auth.jwt() ->> 'role' = 'service_role'
);

-- Create more restrictive policies for affiliate stats
CREATE POLICY "Users can view their own affiliate stats" ON public.affiliate_stats
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.affiliates 
    WHERE affiliates.id = affiliate_stats.affiliate_id 
    AND affiliates.user_id = auth.uid()
  )
);

CREATE POLICY "Service role can manage affiliate stats" ON public.affiliate_stats
FOR ALL USING (
  auth.jwt() ->> 'role' = 'service_role'
);

-- Fix template purchases - only allow service role updates
CREATE POLICY "Service role can update template purchases" ON public.template_purchases
FOR UPDATE USING (
  auth.jwt() ->> 'role' = 'service_role'
);

-- Fix subscribers table - restrict access properly
CREATE POLICY "Users can view own subscription" ON public.subscribers
FOR SELECT USING (
  user_id = auth.uid() OR email = auth.email()
);

CREATE POLICY "Users can create subscription" ON public.subscribers
FOR INSERT WITH CHECK (
  user_id = auth.uid() OR email = auth.email()
);

CREATE POLICY "Service role can manage subscriptions" ON public.subscribers
FOR ALL USING (
  auth.jwt() ->> 'role' = 'service_role'
);

-- 2. Add user_id constraints where missing
ALTER TABLE public.customer_behaviors ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.visitor_sessions ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.traffic_analytics ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.performance_metrics ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.content_calendar ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.competitor_data ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.automation_rules ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.traffic_alerts ALTER COLUMN user_id SET NOT NULL;

-- 3. Create audit trail for sensitive operations
CREATE TABLE IF NOT EXISTS public.security_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  event_type TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own security events" ON public.security_events
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can log security events" ON public.security_events
FOR INSERT WITH CHECK (true);

-- 4. Add rate limiting table
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  endpoint TEXT NOT NULL,
  requests_count INTEGER DEFAULT 1,
  window_start TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, endpoint, window_start)
);

ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own rate limits" ON public.rate_limits
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can manage rate limits" ON public.rate_limits
FOR ALL USING (true);

-- 5. Create function to validate UUIDs
CREATE OR REPLACE FUNCTION public.is_valid_uuid(input_text TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN input_text ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 6. Add validation triggers for critical tables
CREATE OR REPLACE FUNCTION public.validate_user_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Validate user_id is a proper UUID
  IF NEW.user_id IS NOT NULL AND NOT public.is_valid_uuid(NEW.user_id::TEXT) THEN
    RAISE EXCEPTION 'Invalid user_id format';
  END IF;
  
  -- Ensure user_id matches authenticated user for INSERT
  IF TG_OP = 'INSERT' AND NEW.user_id != auth.uid() THEN
    RAISE EXCEPTION 'user_id must match authenticated user';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply validation triggers to key tables
DROP TRIGGER IF EXISTS validate_traffic_analytics_user ON public.traffic_analytics;
CREATE TRIGGER validate_traffic_analytics_user
  BEFORE INSERT OR UPDATE ON public.traffic_analytics
  FOR EACH ROW EXECUTE FUNCTION public.validate_user_data();

DROP TRIGGER IF EXISTS validate_visitor_sessions_user ON public.visitor_sessions;
CREATE TRIGGER validate_visitor_sessions_user
  BEFORE INSERT OR UPDATE ON public.visitor_sessions
  FOR EACH ROW EXECUTE FUNCTION public.validate_user_data();

-- 7. Add password policy function
CREATE OR REPLACE FUNCTION public.validate_password_strength(password TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Minimum 12 characters
  IF LENGTH(password) < 12 THEN
    RETURN FALSE;
  END IF;
  
  -- Must contain uppercase
  IF password !~ '[A-Z]' THEN
    RETURN FALSE;
  END IF;
  
  -- Must contain lowercase
  IF password !~ '[a-z]' THEN
    RETURN FALSE;
  END IF;
  
  -- Must contain number
  IF password !~ '[0-9]' THEN
    RETURN FALSE;
  END IF;
  
  -- Must contain special character
  IF password !~ '[^A-Za-z0-9]' THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 8. Clean up old security hardening that may be too aggressive
UPDATE public.ai_agents 
SET security_level = 'standard' 
WHERE security_level = 'maximum';
