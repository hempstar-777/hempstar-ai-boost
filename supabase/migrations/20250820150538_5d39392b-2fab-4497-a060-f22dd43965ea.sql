
-- Create tables for real traffic analytics data
CREATE TABLE IF NOT EXISTS traffic_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  date DATE NOT NULL,
  visitors INTEGER DEFAULT 0,
  page_views INTEGER DEFAULT 0,
  bounce_rate DECIMAL(5,2) DEFAULT 0,
  avg_session_duration INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0,
  traffic_sources JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for visitor sessions
CREATE TABLE IF NOT EXISTS visitor_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  session_id TEXT NOT NULL,
  visitor_ip TEXT,
  user_agent TEXT,
  referrer TEXT,
  landing_page TEXT,
  country TEXT,
  city TEXT,
  device_type TEXT,
  browser TEXT,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  page_views INTEGER DEFAULT 1,
  actions JSONB DEFAULT '[]'
);

-- Create table for real-time alerts
CREATE TABLE IF NOT EXISTS traffic_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  alert_type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  severity TEXT DEFAULT 'info',
  data JSONB DEFAULT '{}',
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for automation rules
CREATE TABLE IF NOT EXISTS automation_rules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  trigger_type TEXT NOT NULL,
  trigger_conditions JSONB NOT NULL,
  actions JSONB NOT NULL,
  enabled BOOLEAN DEFAULT true,
  executions_count INTEGER DEFAULT 0,
  last_execution TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for performance metrics
CREATE TABLE IF NOT EXISTS performance_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  metric_type TEXT NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  unit TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- Create table for competitor tracking
CREATE TABLE IF NOT EXISTS competitor_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  competitor_name TEXT NOT NULL,
  website_url TEXT NOT NULL,
  traffic_estimate INTEGER,
  ranking_keywords JSONB DEFAULT '[]',
  social_metrics JSONB DEFAULT '{}',
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for content calendar
CREATE TABLE IF NOT EXISTS content_calendar (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  content_type TEXT NOT NULL,
  platform TEXT NOT NULL,
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'draft',
  content_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for external API integrations
CREATE TABLE IF NOT EXISTS api_integrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  service_name TEXT NOT NULL,
  api_key_encrypted TEXT,
  configuration JSONB DEFAULT '{}',
  status TEXT DEFAULT 'active',
  last_sync TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE traffic_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE traffic_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitor_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_calendar ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_integrations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage their own traffic analytics" ON traffic_analytics
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own visitor sessions" ON visitor_sessions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own alerts" ON traffic_alerts
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own automation rules" ON automation_rules
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own performance metrics" ON performance_metrics
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own competitor data" ON competitor_data
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own content calendar" ON content_calendar
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own API integrations" ON api_integrations
  FOR ALL USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_traffic_analytics_user_date ON traffic_analytics(user_id, date);
CREATE INDEX idx_visitor_sessions_user_started ON visitor_sessions(user_id, started_at);
CREATE INDEX idx_traffic_alerts_user_created ON traffic_alerts(user_id, created_at);
CREATE INDEX idx_performance_metrics_user_timestamp ON performance_metrics(user_id, timestamp);
