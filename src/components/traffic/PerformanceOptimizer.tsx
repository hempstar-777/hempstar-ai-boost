
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import {
  Gauge,
  Cpu,
  HardDrive,
  Wifi,
  Zap,
  TrendingUp,
  Settings,
  CheckCircle,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

interface PerformanceMetric {
  name: string;
  value: number;
  target: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  icon: React.ComponentType<any>;
}

interface OptimizationTask {
  id: string;
  name: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'easy' | 'moderate' | 'complex';
  status: 'pending' | 'running' | 'completed';
  progress: number;
}

export const PerformanceOptimizer = () => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([
    {
      name: 'Page Load Speed',
      value: 2.3,
      target: 2.0,
      unit: 's',
      status: 'warning',
      trend: 'down',
      icon: Gauge
    },
    {
      name: 'Server Response',
      value: 180,
      target: 200,
      unit: 'ms',
      status: 'good',
      trend: 'stable',
      icon: Cpu
    },
    {
      name: 'Cache Hit Rate',
      value: 87,
      target: 90,
      unit: '%',
      status: 'warning',
      trend: 'up',
      icon: HardDrive
    },
    {
      name: 'Network Latency',
      value: 45,
      target: 50,
      unit: 'ms',
      status: 'good',
      trend: 'stable',
      icon: Wifi
    }
  ]);

  const [optimizations, setOptimizations] = useState<OptimizationTask[]>([
    {
      id: '1',
      name: 'Image Compression',
      description: 'Optimize and compress images to reduce load times',
      impact: 'high',
      effort: 'easy',
      status: 'completed',
      progress: 100
    },
    {
      id: '2',
      name: 'CDN Configuration',
      description: 'Implement global CDN for faster content delivery',
      impact: 'high',
      effort: 'moderate',
      status: 'running',
      progress: 65
    },
    {
      id: '3',
      name: 'Database Indexing',
      description: 'Optimize database queries with proper indexing',
      impact: 'medium',
      effort: 'moderate',
      status: 'pending',
      progress: 0
    },
    {
      id: '4',
      name: 'Code Minification',
      description: 'Minify CSS and JavaScript files',
      impact: 'medium',
      effort: 'easy',
      status: 'completed',
      progress: 100
    },
    {
      id: '5',
      name: 'Lazy Loading',
      description: 'Implement lazy loading for images and components',
      impact: 'high',
      effort: 'moderate',
      status: 'pending',
      progress: 0
    }
  ]);

  const [isOptimizing, setIsOptimizing] = useState(false);
  const { toast } = useToast();

  // Simulate real-time performance updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => 
        prev.map(metric => ({
          ...metric,
          value: Math.max(0, metric.value + (Math.random() - 0.5) * 0.1),
          status: metric.value <= metric.target ? 'good' : 
                 metric.value <= metric.target * 1.2 ? 'warning' : 'critical'
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const runOptimization = async (taskId: string) => {
    setOptimizations(prev => 
      prev.map(opt => 
        opt.id === taskId 
          ? { ...opt, status: 'running', progress: 0 }
          : opt
      )
    );

    // Simulate optimization progress
    const progressInterval = setInterval(() => {
      setOptimizations(prev => 
        prev.map(opt => {
          if (opt.id === taskId && opt.status === 'running') {
            const newProgress = Math.min(100, opt.progress + Math.random() * 15);
            const status = newProgress >= 100 ? 'completed' : 'running';
            
            if (status === 'completed') {
              toast({
                title: "✅ Optimization Complete!",
                description: `${opt.name} has been successfully optimized`,
              });
            }
            
            return { ...opt, progress: newProgress, status };
          }
          return opt;
        })
      );
    }, 500);

    setTimeout(() => {
      clearInterval(progressInterval);
    }, 5000);
  };

  const runFullOptimization = async () => {
    setIsOptimizing(true);
    
    const pendingTasks = optimizations.filter(opt => opt.status === 'pending');
    for (const task of pendingTasks) {
      await runOptimization(task.id);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    setTimeout(() => {
      setIsOptimizing(false);
      toast({
        title: "🚀 Full Optimization Complete!",
        description: "All performance optimizations have been applied",
      });
    }, 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 border-green-200 bg-green-50';
      case 'warning': return 'text-yellow-600 border-yellow-200 bg-yellow-50';
      case 'critical': return 'text-red-600 border-red-200 bg-red-50';
      default: return 'text-gray-600 border-gray-200 bg-gray-50';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-500/20 text-red-700 border-red-500/40';
      case 'medium': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/40';
      case 'low': return 'bg-green-500/20 text-green-700 border-green-500/40';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/40';
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'easy': return 'bg-green-500/20 text-green-700 border-green-500/40';
      case 'moderate': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/40';
      case 'complex': return 'bg-red-500/20 text-red-700 border-red-500/40';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/40';
    }
  };

  const overallScore = Math.round(
    metrics.reduce((sum, metric) => {
      const score = metric.value <= metric.target ? 100 : 
                   Math.max(0, 100 - ((metric.value - metric.target) / metric.target) * 100);
      return sum + score;
    }, 0) / metrics.length
  );

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <Card className="border-hemp-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Gauge className="w-6 h-6 mr-2 text-hemp-primary" />
              Performance Dashboard
            </div>
            <Badge className={`${overallScore >= 90 ? 'bg-green-500/20 text-green-700 border-green-500/40' : 
                              overallScore >= 70 ? 'bg-yellow-500/20 text-yellow-700 border-yellow-500/40' : 
                              'bg-red-500/20 text-red-700 border-red-500/40'}`}>
              {overallScore}/100 SCORE
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {metrics.map((metric, index) => {
              const IconComponent = metric.icon;
              return (
                <Card key={index} className={`border-2 ${getStatusColor(metric.status)}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <IconComponent className="w-5 h-5" />
                      <Badge variant="outline" className="text-xs">
                        {metric.trend === 'up' && <TrendingUp className="w-3 h-3" />}
                        {metric.trend === 'down' && <TrendingUp className="w-3 h-3 rotate-180" />}
                        {metric.trend === 'stable' && <div className="w-3 h-0.5 bg-current"></div>}
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold">{metric.value.toFixed(metric.unit === 's' ? 1 : 0)}{metric.unit}</div>
                    <div className="text-sm text-muted-foreground">{metric.name}</div>
                    <div className="text-xs text-muted-foreground">Target: {metric.target}{metric.unit}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          <Button
            onClick={runFullOptimization}
            disabled={isOptimizing}
            size="lg"
            className="bg-gradient-to-r from-hemp-primary to-hemp-accent hover:from-hemp-accent hover:to-hemp-primary"
          >
            {isOptimizing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Optimizing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Run Full Optimization
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Optimization Tasks */}
      <Card className="border-hemp-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2 text-hemp-primary" />
            Optimization Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {optimizations.map((task) => (
              <div key={task.id} className="p-4 border rounded-lg hover:border-hemp-primary/40 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h4 className="font-semibold mr-3">{task.name}</h4>
                      <Badge className={getImpactColor(task.impact)}>
                        {task.impact.toUpperCase()} IMPACT
                      </Badge>
                      <Badge className={`ml-2 ${getEffortColor(task.effort)}`}>
                        {task.effort.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                    
                    {task.status === 'running' && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{Math.round(task.progress)}%</span>
                        </div>
                        <Progress value={task.progress} className="h-2" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center ml-4">
                    {task.status === 'completed' && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    {task.status === 'running' && (
                      <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
                    )}
                    {task.status === 'pending' && (
                      <Button
                        size="sm"
                        onClick={() => runOptimization(task.id)}
                        variant="outline"
                      >
                        Start
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
