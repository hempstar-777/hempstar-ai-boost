-- Create profiles table for user management
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, role)
  VALUES (NEW.id, NEW.email, 'admin');
  RETURN NEW;
END;
$$;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update ai_agents table to require authentication
ALTER TABLE public.ai_agents ENABLE ROW LEVEL SECURITY;

-- Create policy for ai_agents (only authenticated users can manage)
CREATE POLICY "Authenticated users can manage agents" 
ON public.ai_agents 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Update agent_logs table security
ALTER TABLE public.agent_logs DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all access to agent_logs" ON public.agent_logs;
ALTER TABLE public.agent_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view logs" 
ON public.agent_logs 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "System can insert logs" 
ON public.agent_logs 
FOR INSERT 
WITH CHECK (true);

-- Add enhanced agent configuration fields
ALTER TABLE public.ai_agents 
ADD COLUMN IF NOT EXISTS thinking_model TEXT DEFAULT 'gpt-4.1-2025-04-14',
ADD COLUMN IF NOT EXISTS max_thinking_depth INTEGER DEFAULT 3,
ADD COLUMN IF NOT EXISTS enable_multitasking BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS max_parallel_tasks INTEGER DEFAULT 3,
ADD COLUMN IF NOT EXISTS security_level TEXT DEFAULT 'standard';

-- Create trigger for updated_at timestamp
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();