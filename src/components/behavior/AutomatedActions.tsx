
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { 
  Zap, 
  Mail, 
  MessageCircle, 
  Percent, 
  Gift,
  Settings,
  Activity,
  CheckCircle,
  Clock
} from 'lucide-react';

interface BehaviorAction {
  id: string;
  trigger_pattern: string;
  action_type: string;
  action_config: any;
  executions_count: number;
  success_rate: number;
  enabled: boolean;
  created_at: string;
}

export const AutomatedActions = () => {
  const [actions, setActions] = useState<BehaviorAction[]>([]);
  const [isCreatingActions, setIsCreatingActions] = useState(false);

  useEffect(() => {
    loadActions();
  }, []);

  const loadActions = async () => {
    try {
      const { data, error } = await supabase
        .from('behavior_actions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setActions(data || []);
    } catch (error) {
      console.error('Error loading actions:', error);
    }
  };

  const createAutomatedActions = async () => {
    setIsCreatingActions(true);
    try {
      const automatedActions = [
        {
          trigger_pattern: 'cart_abandonment',
          action_type: 'email_reminder',
          action_config: {
            delay_minutes: 30,
            subject: 'Your hemp streetwear is waiting!',
            discount: 10,
            template: 'cart_recovery'
          },
          enabled: true
        },
        {
          trigger_pattern: 'high_engagement',
          action_type: 'popup_offer',
          action_config: {
            trigger_score: 80,
            offer_type: 'discount',
            discount_percent: 15,
            message: 'You love our hemp collection! Here\'s 15% off'
          },
          enabled: true
        },
        {
          trigger_pattern: 'exit_intent',
          action_type: 'retention_popup',
          action_config: {
            message: 'Wait! Don\'t miss out on sustainable streetwear',
            offer: 'Free shipping on orders over $50',
            delay_seconds: 2
          },
          enabled: true
        },
        {
          trigger_pattern: 'repeat_visitor',
          action_type: 'loyalty_offer',
          action_config: {
            visit_threshold: 3,
            reward_type: 'vip_access',
            message: 'Welcome back! You\'re now a VIP member'
          },
          enabled: true
        },
        {
          trigger_pattern: 'mobile_user',
          action_type: 'app_promotion',
          action_config: {
            message: 'Get our mobile app for exclusive deals',
            incentive: '20% off first app purchase'
          },
          enabled: false
        }
      ];

      for (const action of automatedActions) {
        await supabase
          .from('behavior_actions')
          .insert([action]);
      }

      await loadActions();
    } catch (error) {
      console.error('Error creating actions:', error);
    } finally {
      setIsCreatingActions(false);
    }
  };

  const toggleAction = async (actionId: string, enabled: boolean) => {
    try {
      const { error } = await supabase
        .from('behavior_actions')
        .update({ enabled })
        .eq('id', actionId);

      if (error) throw error;
      await loadActions();
    } catch (error) {
      console.error('Error toggling action:', error);
    }
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'email_reminder': return Mail;
      case 'popup_offer': return Gift;
      case 'retention_popup': return MessageCircle;
      case 'loyalty_offer': return CheckCircle;
      case 'app_promotion': return Activity;
      default: return Zap;
    }
  };

  const getActionBadge = (actionType: string) => {
    switch (actionType) {
      case 'email_reminder':
        return <Badge className="bg-blue-500/20 text-blue-700 border-blue-500/40">📧 EMAIL</Badge>;
      case 'popup_offer':
        return <Badge className="bg-green-500/20 text-green-700 border-green-500/40">🎁 OFFER</Badge>;
      case 'retention_popup':
        return <Badge className="bg-orange-500/20 text-orange-700 border-orange-500/40">💬 POPUP</Badge>;
      case 'loyalty_offer':
        return <Badge className="bg-purple-500/20 text-purple-700 border-purple-500/40">👑 LOYALTY</Badge>;
      case 'app_promotion':
        return <Badge className="bg-indigo-500/20 text-indigo-700 border-indigo-500/40">📱 APP</Badge>;
      default:
        return <Badge variant="outline">{actionType.toUpperCase()}</Badge>;
    }
  };

  const getTriggerBadge = (triggerPattern: string) => {
    switch (triggerPattern) {
      case 'cart_abandonment':
        return <Badge variant="destructive">🛒 CART EXIT</Badge>;
      case 'high_engagement':
        return <Badge className="bg-green-500 text-white">🔥 ENGAGED</Badge>;
      case 'exit_intent':
        return <Badge className="bg-orange-500 text-white">🚪 EXIT</Badge>;
      case 'repeat_visitor':
        return <Badge className="bg-purple-500 text-white">🔄 REPEAT</Badge>;
      case 'mobile_user':
        return <Badge className="bg-blue-500 text-white">📱 MOBILE</Badge>;
      default:
        return <Badge variant="outline">{triggerPattern}</Badge>;
    }
  };

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 70) return 'text-green-600';
    if (rate >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="border-hemp-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Zap className="w-5 h-5 mr-2 text-hemp-primary" />
            Automated Marketing Actions
          </div>
          <Button
            onClick={createAutomatedActions}
            disabled={isCreatingActions}
            size="sm"
          >
            <Settings className="w-4 h-4 mr-2" />
            {isCreatingActions ? 'Creating...' : 'Setup Actions'}
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-muted/30 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-hemp-primary">{actions.filter(a => a.enabled).length}</div>
            <div className="text-sm text-muted-foreground">Active Actions</div>
          </div>
          <div className="bg-muted/30 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-hemp-primary">1,247</div>
            <div className="text-sm text-muted-foreground">Total Triggers</div>
          </div>
          <div className="bg-muted/30 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-hemp-primary">62%</div>
            <div className="text-sm text-muted-foreground">Success Rate</div>
          </div>
          <div className="bg-muted/30 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-hemp-primary">+$12K</div>
            <div className="text-sm text-muted-foreground">Revenue Impact</div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-hemp-dark">Automated Response Rules</h4>
          {actions.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <Zap className="w-8 h-8 mx-auto mb-2" />
              No automated actions configured. Click "Setup Actions" to create smart responses.
            </div>
          ) : (
            actions.map((action) => {
              const ActionIcon = getActionIcon(action.action_type);
              return (
                <div key={action.id} className={`p-4 rounded-lg border-2 ${
                  action.enabled 
                    ? 'bg-green-50/50 border-green-200/50' 
                    : 'bg-muted/30 border-muted/50'
                }`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <ActionIcon className="w-5 h-5 text-hemp-primary" />
                      <div>
                        <div className="font-medium capitalize">
                          {action.action_type.replace('_', ' ')}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Triggered {action.executions_count} times
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={action.enabled}
                        onCheckedChange={(enabled) => toggleAction(action.id, enabled)}
                      />
                      {getActionBadge(action.action_type)}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Trigger:</span>
                      {getTriggerBadge(action.trigger_pattern)}
                    </div>
                    <div className={`text-sm font-semibold ${getSuccessRateColor(action.success_rate)}`}>
                      {action.success_rate}% Success Rate
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    {action.action_config.message || action.action_config.subject || 'Automated response configured'}
                  </div>
                  
                  {action.action_config.discount && (
                    <div className="mt-2 flex items-center">
                      <Percent className="w-4 h-4 mr-1 text-green-600" />
                      <span className="text-sm font-medium text-green-600">
                        {action.action_config.discount}% discount included
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="p-4 bg-gradient-hemp/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-hemp-primary" />
              <div>
                <div className="font-bold text-hemp-primary">24/7 Automated Marketing</div>
                <div className="text-sm text-muted-foreground">
                  Smart actions respond to visitor behavior in real-time
                </div>
              </div>
            </div>
            <Activity className="w-8 h-8 text-hemp-primary animate-pulse" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
