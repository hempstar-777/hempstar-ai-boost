
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Brain, 
  Activity, 
  TrendingUp, 
  Users, 
  Package, 
  DollarSign,
  Zap,
  Eye,
  Target,
  BarChart3
} from 'lucide-react';
import { syntheticIntelligence, SIAgent } from '@/utils/syntheticIntelligence';

export const SIDashboard = () => {
  const [agents, setAgents] = useState<SIAgent[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [insights, setInsights] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = () => {
    const allAgents = syntheticIntelligence.getAllAgents();
    setAgents(allAgents);
    
    // Load insights for each agent
    const agentInsights = allAgents.map(agent => 
      syntheticIntelligence.getAgentInsights(agent.id)
    ).filter(Boolean);
    setInsights(agentInsights);
  };

  const startSI = async () => {
    setIsRunning(true);
    toast({
      title: "SI System Activated",
      description: "Synthetic Intelligence agents are now learning and making decisions",
    });

    // Start real-time data simulation
    const interval = setInterval(async () => {
      await syntheticIntelligence.simulateRealtimeData();
      loadAgents();
    }, 3000);

    // Store interval for cleanup
    (window as any).siInterval = interval;
  };

  const stopSI = () => {
    setIsRunning(false);
    if ((window as any).siInterval) {
      clearInterval((window as any).siInterval);
    }
    toast({
      title: "SI System Paused",
      description: "Synthetic Intelligence agents have been paused",
      variant: "destructive",
    });
  };

  const getAgentIcon = (type: string) => {
    switch (type) {
      case 'predictive': return TrendingUp;
      case 'learning': return Users;
      case 'adaptive': return Package;
      case 'autonomous': return DollarSign;
      default: return Brain;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-primary" />
              <CardTitle className="text-xl">Synthetic Intelligence Control</CardTitle>
            </div>
            <div className="flex space-x-2">
              {!isRunning ? (
                <Button onClick={startSI} className="bg-primary hover:bg-primary/90">
                  <Zap className="mr-2 h-4 w-4" />
                  Activate SI
                </Button>
              ) : (
                <Button onClick={stopSI} variant="destructive">
                  <Activity className="mr-2 h-4 w-4" />
                  Pause SI
                </Button>
              )}
            </div>
          </div>
          <CardDescription>
            Advanced AI agents that learn, adapt, and make autonomous decisions for your business
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="agents" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="agents">AI Agents</TabsTrigger>
          <TabsTrigger value="insights">Live Insights</TabsTrigger>
          <TabsTrigger value="decisions">Decision Log</TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {agents.map((agent) => {
              const IconComponent = getAgentIcon(agent.type);
              const recentDecisions = agent.decisionHistory.slice(-5);
              
              return (
                <Card key={agent.id} className="border-primary/10">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <IconComponent className="h-5 w-5 text-primary" />
                        <CardTitle className="text-sm">{agent.name}</CardTitle>
                      </div>
                      <Badge variant={agent.type === 'autonomous' ? 'default' : 'secondary'}>
                        {agent.type}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs">
                      {agent.capabilities.join(' • ')}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Confidence Level</span>
                        <span className={getConfidenceColor(agent.confidence)}>
                          {(agent.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={agent.confidence * 100} className="h-2" />
                    </div>
                    
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Decisions:</span>
                        <span>{agent.decisionHistory.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Learning Iterations:</span>
                        <span>{agent.learningModel.iterations}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Update:</span>
                        <span>{new Date(agent.lastUpdate).toLocaleTimeString()}</span>
                      </div>
                    </div>

                    {recentDecisions.length > 0 && (
                      <div className="text-xs">
                        <div className="text-muted-foreground mb-1">Latest Decision:</div>
                        <div className="bg-muted/50 p-2 rounded text-xs">
                          {recentDecisions[recentDecisions.length - 1].decision}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {insights.map((insight, index) => (
              <Card key={index} className="border-primary/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center">
                    <Eye className="mr-2 h-4 w-4 text-primary" />
                    {insight.agent}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Success Rate:</span>
                    <span className={insight.recentSuccessRate >= 0.7 ? 'text-green-600' : 'text-yellow-600'}>
                      {(insight.recentSuccessRate * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Confidence:</span>
                    <span className={getConfidenceColor(insight.confidence)}>
                      {(insight.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total Decisions:</span>
                    <span>{insight.totalDecisions}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Model Training:</span>
                    <span>{insight.modelIterations} iterations</span>
                  </div>
                  
                  {insight.lastDecision && (
                    <div className="mt-3 p-2 bg-muted/50 rounded text-xs">
                      <div className="font-medium mb-1">Latest Action:</div>
                      <div>{insight.lastDecision.decision}</div>
                      <div className="text-muted-foreground mt-1">
                        Confidence: {(insight.lastDecision.confidence * 100).toFixed(1)}%
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="decisions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Target className="mr-2 h-5 w-5 text-primary" />
                Recent AI Decisions
              </CardTitle>
              <CardDescription>
                Real-time decision log from all SI agents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {agents.flatMap(agent => 
                  agent.decisionHistory.slice(-3).map(decision => ({
                    ...decision,
                    agentName: agent.name,
                    agentType: agent.type
                  }))
                )
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .slice(0, 15)
                .map((decision, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {decision.agentType}
                        </Badge>
                        <span className="font-medium text-sm">{decision.agentName}</span>
                      </div>
                      <div className="text-sm mt-1">{decision.decision}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(decision.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${getConfidenceColor(decision.confidence)}`}>
                        {(decision.confidence * 100).toFixed(1)}%
                      </div>
                      <Badge 
                        variant={
                          decision.outcome === 'success' ? 'default' : 
                          decision.outcome === 'failure' ? 'destructive' : 'secondary'
                        }
                        className="text-xs mt-1"
                      >
                        {decision.outcome}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {isRunning && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-green-600 animate-pulse" />
              <span className="text-sm text-green-700 font-medium">
                SI System Active - Learning and optimizing in real-time
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
