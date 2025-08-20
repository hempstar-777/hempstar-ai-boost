
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Eye, MousePointer, Clock, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface BehaviorEvent {
  id: string;
  session_id: string;
  page_url: string;
  action_type: string;
  action_data: any;
  timestamp: string;
  device_type: string;
}

export const BehaviorTracker = () => {
  const [recentEvents, setRecentEvents] = useState<BehaviorEvent[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());

  useEffect(() => {
    loadRecentEvents();
    if (isTracking) {
      startBehaviorTracking();
    }
  }, [isTracking]);

  const loadRecentEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('customer_behaviors')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(10);

      if (error) throw error;
      setRecentEvents(data || []);
    } catch (error) {
      console.error('Error loading behavior events:', error);
    }
  };

  const trackBehaviorEvent = async (actionType: string, actionData: any = {}) => {
    try {
      const behaviorData = {
        session_id: sessionId,
        page_url: window.location.pathname,
        action_type: actionType,
        action_data: actionData,
        user_agent: navigator.userAgent,
        referrer: document.referrer || null,
        device_type: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' : 'desktop'
      };

      const { error } = await supabase
        .from('customer_behaviors')
        .insert([behaviorData]);

      if (error) throw error;
      await loadRecentEvents();
    } catch (error) {
      console.error('Error tracking behavior:', error);
    }
  };

  const startBehaviorTracking = () => {
    // Track page view
    trackBehaviorEvent('page_view', { path: window.location.pathname });

    // Track clicks
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      trackBehaviorEvent('click', {
        element: target.tagName,
        class: target.className,
        text: target.textContent?.substring(0, 50)
      });
    };

    // Track scroll depth
    let maxScrollDepth = 0;
    const handleScroll = () => {
      const scrollDepth = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = Math.round(scrollDepth);
        if (maxScrollDepth % 25 === 0) { // Track at 25%, 50%, 75%, 100%
          trackBehaviorEvent('scroll_depth', { depth: maxScrollDepth });
        }
      }
    };

    // Track time on page
    const startTime = Date.now();
    const handleBeforeUnload = () => {
      const timeSpent = Date.now() - startTime;
      trackBehaviorEvent('time_on_page', { seconds: Math.round(timeSpent / 1000) });
    };

    document.addEventListener('click', handleClick);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'page_view': return Eye;
      case 'click': return MousePointer;
      case 'scroll_depth': return TrendingUp;
      case 'time_on_page': return Clock;
      default: return AlertTriangle;
    }
  };

  const getActionBadge = (actionType: string) => {
    switch (actionType) {
      case 'page_view':
        return <Badge className="bg-blue-500/20 text-blue-700 border-blue-500/40">👁️ VIEW</Badge>;
      case 'click':
        return <Badge className="bg-green-500/20 text-green-700 border-green-500/40">👆 CLICK</Badge>;
      case 'scroll_depth':
        return <Badge className="bg-purple-500/20 text-purple-700 border-purple-500/40">📊 SCROLL</Badge>;
      case 'time_on_page':
        return <Badge className="bg-orange-500/20 text-orange-700 border-orange-500/40">⏱️ TIME</Badge>;
      default:
        return <Badge variant="outline">{actionType.toUpperCase()}</Badge>;
    }
  };

  return (
    <Card className="border-hemp-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Eye className="w-5 h-5 mr-2 text-hemp-primary" />
            Behavior Tracking Engine
          </div>
          <div className="flex items-center space-x-2">
            {isTracking && (
              <Badge className="bg-green-500/20 text-green-700 border-green-500/40 animate-pulse">
                🔴 LIVE TRACKING
              </Badge>
            )}
            <Button
              onClick={() => setIsTracking(!isTracking)}
              variant={isTracking ? "destructive" : "default"}
              size="sm"
            >
              {isTracking ? 'Stop Tracking' : 'Start Tracking'}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-muted/30 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-hemp-primary">247</div>
            <div className="text-sm text-muted-foreground">Page Views</div>
          </div>
          <div className="bg-muted/30 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-hemp-primary">1,834</div>
            <div className="text-sm text-muted-foreground">Total Clicks</div>
          </div>
          <div className="bg-muted/30 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-hemp-primary">4:32</div>
            <div className="text-sm text-muted-foreground">Avg Time</div>
          </div>
          <div className="bg-muted/30 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-hemp-primary">78%</div>
            <div className="text-sm text-muted-foreground">Scroll Depth</div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-hemp-dark">Recent Behavior Events</h4>
          {recentEvents.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
              No behavior events tracked yet. Start tracking to see visitor interactions.
            </div>
          ) : (
            recentEvents.map((event) => {
              const ActionIcon = getActionIcon(event.action_type);
              return (
                <div key={event.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <ActionIcon className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{event.page_url}</div>
                      <div className="text-sm text-muted-foreground">
                        Session: {event.session_id.substring(0, 8)}...
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getActionBadge(event.action_type)}
                    <div className="text-xs text-muted-foreground">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {isTracking && (
          <div className="p-4 bg-gradient-hemp/20 rounded-lg text-center">
            <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-600" />
            <div className="font-bold text-hemp-primary">🚀 Behavior Tracking Active!</div>
            <div className="text-sm text-muted-foreground">
              Automatically capturing visitor interactions and building behavioral insights
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
