
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  Clock,
  Zap,
  AlertCircle
} from 'lucide-react';

interface BehaviorInsight {
  id: string;
  pattern_type: string;
  pattern_data: any;
  confidence_score: number;
  created_at: string;
  active: boolean;
}

export const BehaviorInsights = () => {
  const [insights, setInsights] = useState<BehaviorInsight[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    try {
      const { data, error } = await supabase
        .from('behavior_insights')
        .select('*')
        .eq('active', true)
        .order('confidence_score', { ascending: false });

      if (error) throw error;
      setInsights(data || []);
    } catch (error) {
      console.error('Error loading insights:', error);
    }
  };

  const generateInsights = async () => {
    setIsAnalyzing(true);
    try {
      // Simulate AI analysis with predefined insights
      const mockInsights = [
        {
          pattern_type: 'high_exit_rate',
          pattern_data: {
            page: '/checkout',
            exit_rate: 73,
            recommendation: 'Simplify checkout process',
            impact: 'Could increase conversions by 15%'
          },
          confidence_score: 0.89
        },
        {
          pattern_type: 'popular_content',
          pattern_data: {
            content: 'Hemp Streetwear Collection',
            engagement_score: 94,
            recommendation: 'Feature this content more prominently',
            impact: 'Could boost traffic by 22%'
          },
          confidence_score: 0.92
        },
        {
          pattern_type: 'device_preference',
          pattern_data: {
            mobile_usage: 68,
            conversion_gap: 'Mobile converts 23% less',
            recommendation: 'Optimize mobile experience',
            impact: 'Could increase mobile sales by 30%'
          },
          confidence_score: 0.85
        },
        {
          pattern_type: 'time_based_behavior',
          pattern_data: {
            peak_hours: '2PM-6PM',
            conversion_rate: '8.4% during peak',
            recommendation: 'Schedule campaigns during peak hours',
            impact: 'Could improve ROI by 18%'
          },
          confidence_score: 0.78
        }
      ];

      for (const insight of mockInsights) {
        await supabase
          .from('behavior_insights')
          .insert([insight]);
      }

      await loadInsights();
    } catch (error) {
      console.error('Error generating insights:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getInsightIcon = (patternType: string) => {
    switch (patternType) {
      case 'high_exit_rate': return AlertCircle;
      case 'popular_content': return TrendingUp;
      case 'device_preference': return Users;
      case 'time_based_behavior': return Clock;
      default: return Brain;
    }
  };

  const getInsightBadge = (patternType: string) => {
    switch (patternType) {
      case 'high_exit_rate':
        return <Badge className="bg-red-500/20 text-red-700 border-red-500/40">🚨 EXIT RISK</Badge>;
      case 'popular_content':
        return <Badge className="bg-green-500/20 text-green-700 border-green-500/40">🔥 HOT CONTENT</Badge>;
      case 'device_preference':
        return <Badge className="bg-blue-500/20 text-blue-700 border-blue-500/40">📱 DEVICE</Badge>;
      case 'time_based_behavior':
        return <Badge className="bg-purple-500/20 text-purple-700 border-purple-500/40">⏰ TIMING</Badge>;
      default:
        return <Badge variant="outline">{patternType.toUpperCase()}</Badge>;
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="border-hemp-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Brain className="w-5 h-5 mr-2 text-hemp-primary" />
            AI Behavior Insights
          </div>
          <Button
            onClick={generateInsights}
            disabled={isAnalyzing}
            size="sm"
          >
            <Zap className="w-4 h-4 mr-2" />
            {isAnalyzing ? 'Analyzing...' : 'Generate Insights'}
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-muted/30 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-hemp-primary">12</div>
            <div className="text-sm text-muted-foreground">Active Insights</div>
          </div>
          <div className="bg-muted/30 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-hemp-primary">87%</div>
            <div className="text-sm text-muted-foreground">Avg Confidence</div>
          </div>
          <div className="bg-muted/30 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-hemp-primary">+24%</div>
            <div className="text-sm text-muted-foreground">Conversion Lift</div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-hemp-dark">Behavioral Patterns Detected</h4>
          {insights.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <Brain className="w-8 h-8 mx-auto mb-2" />
              No insights generated yet. Click "Generate Insights" to analyze visitor behavior.
            </div>
          ) : (
            insights.map((insight) => {
              const InsightIcon = getInsightIcon(insight.pattern_type);
              return (
                <div key={insight.id} className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <InsightIcon className="w-5 h-5 text-hemp-primary" />
                      <div>
                        <div className="font-medium capitalize">
                          {insight.pattern_type.replace('_', ' ')}
                        </div>
                        <div className={`text-sm font-semibold ${getConfidenceColor(insight.confidence_score)}`}>
                          {Math.round(insight.confidence_score * 100)}% Confidence
                        </div>
                      </div>
                    </div>
                    {getInsightBadge(insight.pattern_type)}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="font-medium text-hemp-dark">
                      💡 {insight.pattern_data.recommendation}
                    </div>
                    <div className="text-green-600 font-semibold">
                      📈 {insight.pattern_data.impact}
                    </div>
                    {insight.pattern_data.page && (
                      <div className="text-muted-foreground">
                        📍 Page: {insight.pattern_data.page}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="p-4 bg-gradient-hemp/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Target className="w-5 h-5 mr-2 text-hemp-primary" />
              <div>
                <div className="font-bold text-hemp-primary">Smart Recommendations Active</div>
                <div className="text-sm text-muted-foreground">
                  AI continuously analyzes visitor behavior to optimize conversions
                </div>
              </div>
            </div>
            <ShoppingCart className="w-8 h-8 text-hemp-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
