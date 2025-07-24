import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Brain, Zap, Shield, Plus, Sparkles } from 'lucide-react';

interface EnhancedAgentFormData {
  name: string;
  type: string;
  description: string;
  schedule_cron: string;
  thinking_model: string;
  max_thinking_depth: number;
  enable_multitasking: boolean;
  max_parallel_tasks: number;
  security_level: string;
  config: Record<string, any>;
}

const agentTypes = [
  { value: 'social_media_poster', label: 'Social Media AI', description: 'Advanced content creation with trend analysis' },
  { value: 'inventory_monitor', label: 'Smart Inventory Monitor', description: 'Predictive stock management with ML' },
  { value: 'customer_service', label: 'AI Customer Service', description: 'Multi-language support with sentiment analysis' },
  { value: 'price_tracker', label: 'Dynamic Price Tracker', description: 'Real-time competitor analysis and pricing strategy' },
  { value: 'trend_analyzer', label: 'Trend Intelligence', description: 'Market trend prediction with multi-source analysis' },
  { value: 'email_marketer', label: 'Email Marketing AI', description: 'Personalized campaigns with behavioral targeting' },
];

const thinkingModels = [
  { value: 'gpt-4.1-2025-04-14', label: 'GPT-4.1 (Flagship)', description: 'Most advanced reasoning' },
  { value: 'o3-2025-04-16', label: 'O3 (Reasoning)', description: 'Multi-step problem solving' },
  { value: 'o4-mini-2025-04-16', label: 'O4 Mini (Fast)', description: 'Efficient reasoning' },
];

const securityLevels = [
  { value: 'standard', label: 'Standard', description: 'Basic security protocols' },
  { value: 'enhanced', label: 'Enhanced', description: 'Advanced threat detection' },
  { value: 'maximum', label: 'Maximum', description: 'Military-grade security' },
];

const scheduleOptions = [
  { value: '*/15 * * * *', label: 'Every 15 minutes', description: 'High frequency monitoring' },
  { value: '0 * * * *', label: 'Every hour', description: 'Regular updates' },
  { value: '0 */6 * * *', label: 'Every 6 hours', description: 'Standard monitoring' },
  { value: '0 */12 * * *', label: 'Every 12 hours', description: 'Bi-daily checks' },
  { value: '0 0 * * *', label: 'Daily', description: 'Once per day' },
];

export const EnhancedAIAgentSetup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<EnhancedAgentFormData>({
    name: '',
    type: '',
    description: '',
    schedule_cron: '0 */6 * * *',
    thinking_model: 'gpt-4.1-2025-04-14',
    max_thinking_depth: 3,
    enable_multitasking: false,
    max_parallel_tasks: 3,
    security_level: 'enhanced',
    config: {},
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('ai_agents')
        .insert([{
          name: formData.name,
          type: formData.type as any,
          description: formData.description,
          schedule_cron: formData.schedule_cron,
          thinking_model: formData.thinking_model,
          max_thinking_depth: formData.max_thinking_depth,
          enable_multitasking: formData.enable_multitasking,
          max_parallel_tasks: formData.max_parallel_tasks,
          security_level: formData.security_level,
          config: formData.config as any,
          status: 'active' as any,
          next_run_at: new Date().toISOString(),
        }]);

      if (error) throw error;

      toast({
        title: "Enhanced AI Agent Created",
        description: `${formData.name} is now active with advanced capabilities`,
      });

      setIsOpen(false);
      setFormData({
        name: '',
        type: '',
        description: '',
        schedule_cron: '0 */6 * * *',
        thinking_model: 'gpt-4.1-2025-04-14',
        max_thinking_depth: 3,
        enable_multitasking: false,
        max_parallel_tasks: 3,
        security_level: 'enhanced',
        config: {},
      });
    } catch (error: any) {
      toast({
        title: "Creation Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateConfig = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      config: { ...prev.config, [key]: value }
    }));
  };

  const renderConfigFields = () => {
    switch (formData.type) {
      case 'social_media_poster':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="prompt">AI Content Prompt</Label>
              <Textarea
                id="prompt"
                placeholder="Create engaging posts about streetwear trends and hemp products..."
                value={formData.config.prompt || ''}
                onChange={(e) => updateConfig('prompt', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="platforms">Target Platforms</Label>
              <Input
                id="platforms"
                placeholder="instagram,twitter,facebook"
                value={formData.config.platforms || ''}
                onChange={(e) => updateConfig('platforms', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        );
      case 'inventory_monitor':
        return (
          <div>
            <Label htmlFor="threshold">Low Stock Threshold</Label>
            <Input
              id="threshold"
              type="number"
              placeholder="10"
              value={formData.config.threshold || ''}
              onChange={(e) => updateConfig('threshold', parseInt(e.target.value))}
              className="mt-1"
            />
          </div>
        );
      default:
        return null;
    }
  };

  if (!isOpen) {
    return (
      <Button 
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <Plus className="mr-2 h-4 w-4" />
        Create Enhanced AI Agent
        <Sparkles className="ml-2 h-4 w-4" />
      </Button>
    );
  }

  return (
    <Card className="border-primary/20 shadow-2xl bg-gradient-to-br from-background to-background/50">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <Brain className="h-6 w-6 text-primary" />
          <CardTitle className="text-xl">Enhanced AI Agent Setup</CardTitle>
        </div>
        <CardDescription>
          Create an AI agent with advanced multi-level thinking and security features
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Configuration */}
          <div className="grid gap-4">
            <div>
              <Label htmlFor="name">Agent Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="My Enhanced AI Agent"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="type">Agent Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select agent type" />
                </SelectTrigger>
                <SelectContent>
                  {agentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-sm text-muted-foreground">{type.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this agent does..."
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="schedule">Execution Schedule</Label>
              <Select value={formData.schedule_cron} onValueChange={(value) => setFormData(prev => ({ ...prev, schedule_cron: value }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {scheduleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-muted-foreground">{option.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* AI Configuration */}
          <div className="border-t pt-6">
            <div className="flex items-center space-x-2 mb-4">
              <Brain className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">AI Intelligence Settings</h3>
            </div>
            
            <div className="grid gap-4">
              <div>
                <Label htmlFor="thinking_model">Thinking Model</Label>
                <Select value={formData.thinking_model} onValueChange={(value) => setFormData(prev => ({ ...prev, thinking_model: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {thinkingModels.map((model) => (
                      <SelectItem key={model.value} value={model.value}>
                        <div>
                          <div className="font-medium">{model.label}</div>
                          <div className="text-sm text-muted-foreground">{model.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="thinking_depth">Thinking Depth: {formData.max_thinking_depth}</Label>
                <Slider
                  value={[formData.max_thinking_depth]}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, max_thinking_depth: value[0] }))}
                  max={10}
                  min={1}
                  step={1}
                  className="mt-2"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Higher values enable deeper reasoning but use more resources
                </p>
              </div>
            </div>
          </div>

          {/* Multitasking Configuration */}
          <div className="border-t pt-6">
            <div className="flex items-center space-x-2 mb-4">
              <Zap className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Multitasking Settings</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="multitasking"
                  checked={formData.enable_multitasking}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enable_multitasking: checked }))}
                />
                <Label htmlFor="multitasking">Enable Parallel Task Execution</Label>
              </div>

              {formData.enable_multitasking && (
                <div>
                  <Label htmlFor="parallel_tasks">Max Parallel Tasks: {formData.max_parallel_tasks}</Label>
                  <Slider
                    value={[formData.max_parallel_tasks]}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, max_parallel_tasks: value[0] }))}
                    max={10}
                    min={1}
                    step={1}
                    className="mt-2"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Security Configuration */}
          <div className="border-t pt-6">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Security Level</h3>
            </div>
            
            <Select value={formData.security_level} onValueChange={(value) => setFormData(prev => ({ ...prev, security_level: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {securityLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    <div>
                      <div className="font-medium">{level.label}</div>
                      <div className="text-sm text-muted-foreground">{level.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Type-specific Configuration */}
          {formData.type && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Agent Configuration</h3>
              {renderConfigFields()}
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              {isLoading ? "Creating..." : "Create Enhanced Agent"}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};