
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { syntheticIntelligence } from '@/utils/syntheticIntelligence';
import { Activity, Clock, Cpu, Play, RefreshCw, Server, ShieldCheck } from 'lucide-react';

type ExecResult = {
  message?: string;
  executed?: number;
  results?: any;
  parallel_results?: any;
  error?: string;
};

export const AutomationResultsPage: React.FC = () => {
  const [enhancedResult, setEnhancedResult] = useState<ExecResult | null>(null);
  const [agentResult, setAgentResult] = useState<ExecResult | null>(null);
  const [siInsights, setSiInsights] = useState<any[] | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const runEnhancedScheduleCheck = async () => {
    setLoading('enhanced');
    console.log('Invoking enhanced-ai-executor schedule_check');
    const { data, error } = await supabase.functions.invoke('enhanced-ai-executor', {
      body: { action: 'schedule_check' },
    });
    if (error) {
      console.error(error);
      setEnhancedResult({ error: error.message });
    } else {
      setEnhancedResult(data as ExecResult);
    }
    setLoading(null);
  };

  const runAgentScheduleCheck = async () => {
    setLoading('agent');
    console.log('Invoking ai-agent-executor schedule_check');
    const { data, error } = await supabase.functions.invoke('ai-agent-executor', {
      body: { action: 'schedule_check' },
    });
    if (error) {
      console.error(error);
      setAgentResult({ error: error.message });
    } else {
      setAgentResult(data as ExecResult);
    }
    setLoading(null);
  };

  const runSIDemoNow = async () => {
    setLoading('si');
    console.log('Running SyntheticIntelligence simulateRealtimeData');
    await syntheticIntelligence.simulateRealtimeData();
    const agents = syntheticIntelligence.getAllAgents();
    const insights = agents.map(a => ({
      id: a.id,
      name: a.name,
      confidence: a.confidence,
      lastUpdate: a.lastUpdate,
      recentInsight: syntheticIntelligence.getAgentInsights(a.id),
    }));
    setSiInsights(insights);
    setLoading(null);
  };

  return (
    <main className="container mx-auto px-4 py-8 space-y-8">
      <h2 className="text-2xl font-bold text-hemp-dark">🧠 Autonomous AI — Results</h2>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Server className="w-5 h-5" /> Enhanced AI Executor</CardTitle>
            <CardDescription>Checks secured agents ready to run (RLS-aware)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={runEnhancedScheduleCheck} disabled={loading === 'enhanced'}>
              <RefreshCw className="w-4 h-4 mr-2" />
              {loading === 'enhanced' ? 'Checking...' : 'Check Schedules'}
            </Button>
            <div className="text-sm text-muted-foreground">
              {enhancedResult ? JSON.stringify(enhancedResult) : 'No results yet'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Cpu className="w-5 h-5" /> AI Agent Executor</CardTitle>
            <CardDescription>Scans active agents and runs them as needed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={runAgentScheduleCheck} disabled={loading === 'agent'}>
              <Clock className="w-4 h-4 mr-2" />
              {loading === 'agent' ? 'Checking...' : 'Check Schedules'}
            </Button>
            <div className="text-sm text-muted-foreground">
              {agentResult ? JSON.stringify(agentResult) : 'No results yet'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Activity className="w-5 h-5" /> SI Demo Insights</CardTitle>
            <CardDescription>Run a quick local demo and view SI agent insights</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={runSIDemoNow} disabled={loading === 'si'}>
              <Play className="w-4 h-4 mr-2" />
              {loading === 'si' ? 'Running...' : 'Run Demo Now'}
            </Button>
            <div className="space-y-2 text-sm">
              {!siInsights && <div className="text-muted-foreground">No insights yet</div>}
              {siInsights && siInsights.map((s) => (
                <div key={s.id} className="p-3 rounded-md bg-muted/40">
                  <div className="font-medium">{s.name}</div>
                  <div className="text-muted-foreground">Confidence: {(s.confidence * 100).toFixed(0)}% • Updated: {new Date(s.lastUpdate).toLocaleString()}</div>
                  <div className="text-xs mt-1">
                    {s.recentInsight ? JSON.stringify(s.recentInsight) : 'No recent insight'}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-xs text-muted-foreground flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> For 24/7 autonomy, set up a database cron to call these functions regularly.
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default AutomationResultsPage;
