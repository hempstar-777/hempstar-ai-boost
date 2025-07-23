import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { 
  Bot, 
  Play, 
  Pause, 
  Settings, 
  Activity, 
  Clock, 
  TrendingUp,
  ShoppingCart,
  MessageCircle,
  DollarSign,
  Instagram,
  Mail
} from "lucide-react";

interface AIAgent {
  id: string;
  name: string;
  type: string;
  description: string;
  config: any;
  schedule_cron: string;
  status: 'active' | 'paused' | 'stopped' | 'error';
  last_run_at?: string;
  next_run_at?: string;
  created_at: string;
  updated_at: string;
}

interface AgentLog {
  id: string;
  agent_id: string;
  execution_id: string;
  status: string;
  message: string;
  data: any;
  duration_ms?: number;
  created_at: string;
}

const agentIcons = {
  social_media_poster: Instagram,
  inventory_monitor: ShoppingCart,
  customer_service: MessageCircle,
  price_tracker: DollarSign,
  trend_analyzer: TrendingUp,
  email_marketer: Mail,
};

export const AIAgentDashboard = () => {
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [executingAgents, setExecutingAgents] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    fetchAgents();
    fetchLogs();
  }, []);

  const fetchAgents = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_agents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAgents(data || []);
    } catch (error) {
      console.error('Error fetching agents:', error);
      toast({
        title: "Error",
        description: "Failed to fetch AI agents",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('agent_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  const executeAgent = async (agentId: string) => {
    setExecutingAgents(prev => new Set(prev).add(agentId));
    
    try {
      const response = await supabase.functions.invoke('ai-agent-executor', {
        body: { agentId, action: 'execute' }
      });

      if (response.error) throw response.error;

      toast({
        title: "Success",
        description: "Agent executed successfully",
      });

      // Refresh data
      fetchAgents();
      fetchLogs();
    } catch (error) {
      console.error('Error executing agent:', error);
      toast({
        title: "Error",
        description: "Failed to execute agent",
        variant: "destructive",
      });
    } finally {
      setExecutingAgents(prev => {
        const newSet = new Set(prev);
        newSet.delete(agentId);
        return newSet;
      });
    }
  };

  const toggleAgentStatus = async (agentId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    
    try {
      const { error } = await supabase
        .from('ai_agents')
        .update({ status: newStatus })
        .eq('id', agentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Agent ${newStatus === 'active' ? 'activated' : 'paused'}`,
      });

      fetchAgents();
    } catch (error) {
      console.error('Error updating agent status:', error);
      toast({
        title: "Error",
        description: "Failed to update agent status",
        variant: "destructive",
      });
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'paused': return 'secondary';
      case 'error': return 'destructive';
      default: return 'outline';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Agent Dashboard</h1>
          <p className="text-muted-foreground">Manage your autonomous AI agents</p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          <Bot className="w-4 h-4 mr-2" />
          {agents.filter(a => a.status === 'active').length} Active
        </Badge>
      </div>

      <Tabs defaultValue="agents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="logs">Activity Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="space-y-4">
          {agents.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bot className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No AI Agents Yet</h3>
                <p className="text-muted-foreground text-center">
                  Your autonomous AI agents will appear here once they're configured.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {agents.map((agent) => {
                const IconComponent = agentIcons[agent.type as keyof typeof agentIcons] || Bot;
                const isExecuting = executingAgents.has(agent.id);
                
                return (
                  <Card key={agent.id} className="relative">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <IconComponent className="w-5 h-5" />
                          <CardTitle className="text-lg">{agent.name}</CardTitle>
                        </div>
                        <Badge variant={getStatusVariant(agent.status)}>
                          {agent.status}
                        </Badge>
                      </div>
                      <CardDescription>{agent.description}</CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          Schedule: {agent.schedule_cron}
                        </div>
                        {agent.last_run_at && (
                          <div className="flex items-center">
                            <Activity className="w-4 h-4 mr-2" />
                            Last run: {formatTimestamp(agent.last_run_at)}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => executeAgent(agent.id)}
                          disabled={isExecuting}
                          className="flex-1"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          {isExecuting ? 'Running...' : 'Run Now'}
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleAgentStatus(agent.id, agent.status)}
                        >
                          {agent.status === 'active' ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </Button>
                        
                        <Button size="sm" variant="outline">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest agent execution logs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {logs.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No activity logs yet
                  </p>
                ) : (
                  logs.map((log) => {
                    const agent = agents.find(a => a.id === log.agent_id);
                    const statusColor = log.status === 'completed' ? 'text-green-600' : 
                                      log.status === 'failed' ? 'text-red-600' : 'text-blue-600';
                    
                    return (
                      <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${statusColor.replace('text-', 'bg-')}`}></div>
                          <div>
                            <p className="font-medium">{agent?.name || 'Unknown Agent'}</p>
                            <p className="text-sm text-muted-foreground">{log.message}</p>
                          </div>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          <p>{formatTimestamp(log.created_at)}</p>
                          {log.duration_ms && (
                            <p>{(log.duration_ms / 1000).toFixed(2)}s</p>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};