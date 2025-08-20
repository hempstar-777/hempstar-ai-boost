
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  DollarSign, 
  Users, 
  ShoppingCart,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  Zap,
  Activity,
  CheckCircle,
  AlertTriangle,
  Clock,
  BarChart3
} from 'lucide-react';

interface AutonomousAgent {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'paused' | 'working';
  confidence: number;
  dailyActions: number;
  weeklyRevenue: number;
  lastAction: string;
  nextAction: string;
}

const autonomousAgents: AutonomousAgent[] = [
  {
    id: 'social-manager',
    name: 'Social Media AI Manager',
    type: 'social_campaigns',
    status: 'active',
    confidence: 94,
    dailyActions: 47,
    weeklyRevenue: 2840,
    lastAction: 'Posted viral hemp fashion reel on Instagram (+847 engagement)',
    nextAction: 'Creating TikTok trend analysis in 23 min'
  },
  {
    id: 'ad-optimizer',
    name: 'Ad Campaign Optimizer',
    type: 'paid_advertising',
    status: 'working',
    confidence: 91,
    dailyActions: 156,
    weeklyRevenue: 8920,
    lastAction: 'Increased Google Ads budget by 40% for high-converting keywords',
    nextAction: 'Testing new Facebook ad creative in 8 min'
  },
  {
    id: 'email-ai',
    name: 'Email Marketing AI',
    type: 'email_campaigns',
    status: 'active',
    confidence: 87,
    dailyActions: 23,
    weeklyRevenue: 1560,
    lastAction: 'Sent personalized cart recovery emails to 340 customers',
    nextAction: 'Preparing weekly newsletter with trend insights'
  },
  {
    id: 'price-optimizer',
    name: 'Dynamic Pricing AI',
    type: 'pricing_strategy',
    status: 'active',
    confidence: 96,
    dailyActions: 89,
    weeklyRevenue: 4720,
    lastAction: 'Adjusted 23 product prices based on competitor analysis',
    nextAction: 'Analyzing demand patterns for weekend pricing'
  },
  {
    id: 'inventory-ai',
    name: 'Inventory Management AI',
    type: 'inventory_optimization',
    status: 'active',
    confidence: 92,
    dailyActions: 34,
    weeklyRevenue: 3200,
    lastAction: 'Ordered 500 units of trending hemp hoodies',
    nextAction: 'Monitoring stock levels for flash sale preparation'
  },
  {
    id: 'content-creator',
    name: 'Content Creation AI',
    type: 'content_marketing',
    status: 'working',
    confidence: 89,
    dailyActions: 67,
    weeklyRevenue: 1890,
    lastAction: 'Generated 12 blog posts about sustainable fashion trends',
    nextAction: 'Creating video scripts for YouTube channel'
  }
];

export const AutonomousAIDashboard = () => {
  const [agents, setAgents] = useState<AutonomousAgent[]>(autonomousAgents);
  const [isSystemActive, setIsSystemActive] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalActions, setTotalActions] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Calculate totals
    const revenue = agents.reduce((sum, agent) => sum + agent.weeklyRevenue, 0);
    const actions = agents.reduce((sum, agent) => sum + agent.dailyActions, 0);
    setTotalRevenue(revenue);
    setTotalActions(actions);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => ({
        ...agent,
        dailyActions: agent.dailyActions + Math.floor(Math.random() * 3),
        confidence: Math.min(99, agent.confidence + (Math.random() - 0.5) * 2)
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, [agents]);

  const toggleSystemStatus = () => {
    const newStatus = !isSystemActive;
    setIsSystemActive(newStatus);
    
    toast({
      title: newStatus ? "🚀 Autonomous AI Activated" : "⏸️ Autonomous AI Paused",
      description: newStatus 
        ? "All AI agents are now working autonomously 24/7" 
        : "AI agents have been paused",
    });
  };

  const getAgentIcon = (type: string) => {
    switch (type) {
      case 'social_campaigns': return Instagram;
      case 'paid_advertising': return Target;
      case 'email_campaigns': return Mail;
      case 'pricing_strategy': return DollarSign;
      case 'inventory_optimization': return ShoppingCart;
      case 'content_marketing': return BarChart3;
      default: return Brain;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-700 border-green-500/40';
      case 'working': return 'bg-blue-500/20 text-blue-700 border-blue-500/40 animate-pulse';
      case 'paused': return 'bg-gray-500/20 text-gray-700 border-gray-500/40';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/40';
    }
  };

  return (
    <div className="space-y-6">
      {/* System Status */}
      <Card className="border-hemp-primary/20 bg-gradient-to-br from-background to-hemp-primary/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="w-8 h-8 text-hemp-primary" />
              <div>
                <CardTitle className="text-2xl">🤖 Autonomous AI Empire</CardTitle>
                <p className="text-muted-foreground">AI agents working 24/7 to grow your business</p>
              </div>
            </div>
            <Button
              onClick={toggleSystemStatus}
              variant={isSystemActive ? "destructive" : "default"}
              size="lg"
            >
              {isSystemActive ? (
                <>
                  <Activity className="w-5 h-5 mr-2" />
                  Pause All AI
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  Activate AI
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-hemp-primary/10 rounded-lg">
              <div className="text-3xl font-black text-hemp-primary">${totalRevenue.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Weekly AI Revenue</div>
            </div>
            <div className="text-center p-4 bg-hemp-accent/10 rounded-lg">
              <div className="text-3xl font-black text-hemp-accent">{totalActions}</div>
              <div className="text-sm text-muted-foreground">Daily AI Actions</div>
            </div>
            <div className="text-center p-4 bg-green-500/10 rounded-lg">
              <div className="text-3xl font-black text-green-600">{agents.filter(a => a.status === 'active').length}</div>
              <div className="text-sm text-muted-foreground">Active Agents</div>
            </div>
            <div className="text-center p-4 bg-blue-500/10 rounded-lg">
              <div className="text-3xl font-black text-blue-600">97%</div>
              <div className="text-sm text-muted-foreground">System Uptime</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Agents Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => {
          const IconComponent = getAgentIcon(agent.type);
          return (
            <Card key={agent.id} className="border-hemp-primary/10">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <IconComponent className="w-5 h-5 text-hemp-primary" />
                    <CardTitle className="text-lg">{agent.name}</CardTitle>
                  </div>
                  <Badge className={getStatusColor(agent.status)}>
                    {agent.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Confidence Level */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>AI Confidence</span>
                    <span className="font-bold text-hemp-primary">{agent.confidence}%</span>
                  </div>
                  <Progress value={agent.confidence} className="h-2" />
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-muted/30 p-2 rounded">
                    <div className="text-lg font-bold text-hemp-primary">{agent.dailyActions}</div>
                    <div className="text-xs text-muted-foreground">Daily Actions</div>
                  </div>
                  <div className="bg-muted/30 p-2 rounded">
                    <div className="text-lg font-bold text-green-600">${agent.weeklyRevenue}</div>
                    <div className="text-xs text-muted-foreground">Weekly Revenue</div>
                  </div>
                </div>

                {/* Last Action */}
                <div className="space-y-2">
                  <div className="text-xs font-medium text-hemp-dark">Latest Action:</div>
                  <div className="text-xs bg-green-50 p-2 rounded border-l-2 border-green-500">
                    <CheckCircle className="w-3 h-3 inline mr-1 text-green-600" />
                    {agent.lastAction}
                  </div>
                </div>

                {/* Next Action */}
                <div className="space-y-2">
                  <div className="text-xs font-medium text-hemp-dark">Next Action:</div>
                  <div className="text-xs bg-blue-50 p-2 rounded border-l-2 border-blue-500">
                    <Clock className="w-3 h-3 inline mr-1 text-blue-600" />
                    {agent.nextAction}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Real-time Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="w-5 h-5 mr-2 text-hemp-primary" />
            Live AI Activity Feed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {[
              "🎯 Ad Optimizer: Increased conversion rate by 23% on hemp hoodie campaign",
              "📧 Email AI: Sent 347 personalized newsletters, 42% open rate",
              "📱 Social Manager: Posted trending content, gained 156 new followers",
              "💰 Pricing AI: Optimized 18 product prices, revenue up 8%",
              "📦 Inventory AI: Auto-ordered bestselling items before stockout",
              "✍️ Content Creator: Published 3 SEO articles, ranking #2 for 'hemp fashion'",
              "🔍 Trend Analyzer: Identified emerging eco-fashion trend, adjusting strategy",
              "🛒 Sales AI: Converted 23 cart abandoners with personalized offers"
            ].map((activity, index) => (
              <div key={index} className="flex items-center p-3 bg-muted/30 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                <span className="text-sm">{activity}</span>
                <span className="text-xs text-muted-foreground ml-auto">
                  {Math.floor(Math.random() * 60)} sec ago
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Status Banner */}
      {isSystemActive && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div>
                  <div className="font-bold text-green-700">🚀 Autonomous AI System Active</div>
                  <div className="text-sm text-green-600">
                    Your AI empire is running campaigns, optimizing ads, managing inventory, and growing revenue 24/7
                  </div>
                </div>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
