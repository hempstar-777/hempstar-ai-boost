
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  Bot, 
  Zap, 
  TrendingUp, 
  Target, 
  Brain,
  Settings,
  CheckCircle,
  AlertTriangle,
  Clock,
  BarChart3
} from 'lucide-react';

interface AutomationRule {
  id: string;
  name: string;
  trigger: {
    type: 'traffic_drop' | 'conversion_low' | 'time_based' | 'competitor_activity';
    threshold: number;
    timeframe: string;
  };
  action: {
    type: 'boost_engine' | 'increase_budget' | 'send_alert' | 'optimize_targeting';
    parameters: any;
  };
  enabled: boolean;
  lastTriggered?: string;
  successRate: number;
  impactScore: number;
}

const initialRules: AutomationRule[] = [
  {
    id: '1',
    name: 'Traffic Drop Auto-Boost',
    trigger: {
      type: 'traffic_drop',
      threshold: 20,
      timeframe: '15min'
    },
    action: {
      type: 'boost_engine',
      parameters: { engines: ['seo', 'social'], duration: 30 }
    },
    enabled: true,
    successRate: 85,
    impactScore: 92
  },
  {
    id: '2',
    name: 'Low Conversion Optimizer',
    trigger: {
      type: 'conversion_low',
      threshold: 2.5,
      timeframe: '1hour'
    },
    action: {
      type: 'optimize_targeting',
      parameters: { adjustBudget: true, pauseLowPerformers: true }
    },
    enabled: true,
    successRate: 78,
    impactScore: 88
  },
  {
    id: '3',
    name: 'Peak Hours Amplifier',
    trigger: {
      type: 'time_based',
      threshold: 0,
      timeframe: 'peak_hours'
    },
    action: {
      type: 'increase_budget',
      parameters: { multiplier: 1.5, engines: ['ppc', 'social'] }
    },
    enabled: true,
    successRate: 94,
    impactScore: 96
  },
  {
    id: '4',
    name: 'Competitor Alert System',
    trigger: {
      type: 'competitor_activity',
      threshold: 15,
      timeframe: '30min'
    },
    action: {
      type: 'send_alert',
      parameters: { urgency: 'high', channels: ['email', 'dashboard'] }
    },
    enabled: false,
    successRate: 72,
    impactScore: 65
  }
];

export const AutomationEngine = () => {
  const [rules, setRules] = useState<AutomationRule[]>(initialRules);
  const [isRunning, setIsRunning] = useState(true);
  const [lastExecution, setLastExecution] = useState(new Date());
  const [executionCount, setExecutionCount] = useState(47);
  const { toast } = useToast();

  // Simulate automation execution
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setLastExecution(new Date());
      setExecutionCount(prev => prev + 1);
      
      // Simulate rule triggers
      const enabledRules = rules.filter(rule => rule.enabled);
      if (enabledRules.length > 0 && Math.random() > 0.85) {
        const triggeredRule = enabledRules[Math.floor(Math.random() * enabledRules.length)];
        handleRuleTrigger(triggeredRule);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isRunning, rules]);

  const handleRuleTrigger = (rule: AutomationRule) => {
    setRules(prev => 
      prev.map(r => 
        r.id === rule.id 
          ? { ...r, lastTriggered: new Date().toISOString() }
          : r
      )
    );

    toast({
      title: "🤖 Automation Triggered!",
      description: `${rule.name} executed successfully`,
    });
  };

  const toggleRule = (ruleId: string) => {
    setRules(prev => 
      prev.map(rule => 
        rule.id === ruleId 
          ? { ...rule, enabled: !rule.enabled }
          : rule
      )
    );
  };

  const getTriggerIcon = (type: string) => {
    switch (type) {
      case 'traffic_drop': return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'conversion_low': return <Target className="w-4 h-4 text-orange-500" />;
      case 'time_based': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'competitor_activity': return <BarChart3 className="w-4 h-4 text-purple-500" />;
      default: return <Bot className="w-4 h-4" />;
    }
  };

  const getImpactColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* System Status */}
      <Card className="border-hemp-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Brain className="w-6 h-6 mr-2 text-hemp-primary" />
              Automation Engine
            </div>
            <Badge className={`${isRunning ? 'bg-green-500/20 text-green-700 border-green-500/40' : 'bg-gray-500/20 text-gray-700 border-gray-500/40'} animate-pulse`}>
              {isRunning ? 'ACTIVE' : 'PAUSED'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-black text-hemp-primary">{rules.filter(r => r.enabled).length}</div>
              <div className="text-sm text-muted-foreground">Active Rules</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-hemp-accent">{executionCount}</div>
              <div className="text-sm text-muted-foreground">Total Executions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-green-600">
                {Math.round(rules.reduce((sum, r) => sum + r.successRate, 0) / rules.length)}%
              </div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Last Execution</div>
              <div className="text-xs">{lastExecution.toLocaleTimeString()}</div>
            </div>
          </div>
          
          <div className="flex gap-4">
            <Button
              onClick={() => setIsRunning(!isRunning)}
              variant={isRunning ? 'destructive' : 'default'}
            >
              {isRunning ? 'Pause Automation' : 'Start Automation'}
            </Button>
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Configure Rules
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Automation Rules */}
      <div className="grid gap-4 md:grid-cols-2">
        {rules.map((rule) => (
          <Card key={rule.id} className={`border-2 ${
            rule.enabled 
              ? 'border-hemp-primary/40 bg-hemp-primary/5' 
              : 'border-muted/50 bg-muted/20'
          }`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  {getTriggerIcon(rule.trigger.type)}
                  <span className="ml-2">{rule.name}</span>
                </CardTitle>
                <Switch
                  checked={rule.enabled}
                  onCheckedChange={() => toggleRule(rule.id)}
                />
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              {/* Trigger Info */}
              <div className="bg-muted/30 p-3 rounded-lg">
                <div className="text-sm font-medium mb-1">Trigger Condition</div>
                <div className="text-xs text-muted-foreground">
                  When {rule.trigger.type.replace('_', ' ')} {
                    rule.trigger.type !== 'time_based' 
                      ? `${rule.trigger.threshold > 0 ? 'drops below' : 'exceeds'} ${rule.trigger.threshold}${rule.trigger.type === 'conversion_low' ? '%' : ''}`
                      : 'during peak hours'
                  } over {rule.trigger.timeframe}
                </div>
              </div>

              {/* Action Info */}
              <div className="bg-hemp-primary/10 p-3 rounded-lg">
                <div className="text-sm font-medium mb-1">Automated Action</div>
                <div className="text-xs text-muted-foreground capitalize">
                  {rule.action.type.replace('_', ' ')}
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center">
                  <div className="text-lg font-bold text-hemp-primary">{rule.successRate}%</div>
                  <div className="text-xs text-muted-foreground">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-bold ${getImpactColor(rule.impactScore)}`}>
                    {rule.impactScore}
                  </div>
                  <div className="text-xs text-muted-foreground">Impact Score</div>
                </div>
              </div>

              {/* Last Triggered */}
              {rule.lastTriggered && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                  Last triggered: {new Date(rule.lastTriggered).toLocaleTimeString()}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
