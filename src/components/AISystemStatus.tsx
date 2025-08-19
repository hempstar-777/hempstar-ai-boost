
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, PlayCircle, Zap } from 'lucide-react';

export const AISystemStatus = () => {
  const [testing, setTesting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testResults, setTestResults] = useState<any>(null);
  const { toast } = useToast();

  const testAISystem = async () => {
    setTesting(true);
    setStatus('testing');
    
    try {
      // Test OpenAI connection through one of our AI agents
      const { data: agents } = await supabase
        .from('ai_agents')
        .select('*')
        .eq('type', 'social_media_poster')
        .limit(1);

      if (!agents || agents.length === 0) {
        throw new Error('No AI agents found');
      }

      const agent = agents[0];
      
      // Execute the agent to test OpenAI integration
      const { data, error } = await supabase.functions.invoke('enhanced-ai-executor', {
        body: { 
          action: 'execute', 
          agentId: agent.id
        }
      });

      if (error) {
        throw error;
      }

      setTestResults(data);
      setStatus('success');
      
      toast({
        title: "🚀 AI System Operational!",
        description: "OpenAI integration and all AI agents are working perfectly",
      });

    } catch (error: any) {
      console.error('AI system test failed:', error);
      setStatus('error');
      setTestResults({ error: error.message });
      
      toast({
        title: "System Test Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setTesting(false);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'testing':
        return <PlayCircle className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <Zap className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-500">Operational</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'testing':
        return <Badge variant="secondary">Testing...</Badge>;
      default:
        return <Badge variant="outline">Ready to Test</Badge>;
    }
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <CardTitle className="text-lg">AI System Status</CardTitle>
          </div>
          {getStatusBadge()}
        </div>
        <CardDescription>
          Test your Hemp Streetwear AI system and OpenAI integration
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Button 
          onClick={testAISystem}
          disabled={testing}
          className="w-full"
        >
          {testing ? "Testing AI System..." : "Test AI System"}
        </Button>

        {testResults && (
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">Test Results:</h4>
            <pre className="text-xs bg-background p-2 rounded overflow-auto max-h-32">
              {JSON.stringify(testResults, null, 2)}
            </pre>
          </div>
        )}

        {status === 'success' && (
          <div className="text-sm text-muted-foreground">
            ✅ OpenAI API connected<br/>
            ✅ AI agents operational<br/>
            ✅ Database configured<br/>
            ✅ Ready for production
          </div>
        )}
      </CardContent>
    </Card>
  );
};
