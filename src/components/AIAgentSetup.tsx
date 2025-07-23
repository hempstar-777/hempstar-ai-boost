import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Bot } from "lucide-react";

type AgentType = 'social_media_poster' | 'inventory_monitor' | 'customer_service' | 'price_tracker' | 'trend_analyzer' | 'email_marketer';
type AgentStatus = 'active' | 'paused' | 'stopped' | 'error';

interface AgentFormData {
  name: string;
  type: AgentType;
  description: string;
  schedule_cron: string;
  config: any;
}

const agentTypes = [
  {
    value: 'social_media_poster',
    label: 'Social Media Poster',
    description: 'Automatically creates and schedules social media content'
  },
  {
    value: 'inventory_monitor',
    label: 'Inventory Monitor',
    description: 'Monitors stock levels and alerts when items are low'
  },
  {
    value: 'customer_service',
    label: 'Customer Service Bot',
    description: 'Handles customer inquiries and support tickets'
  },
  {
    value: 'price_tracker',
    label: 'Price Tracker',
    description: 'Monitors competitor prices and market trends'
  },
  {
    value: 'trend_analyzer',
    label: 'Trend Analyzer',
    description: 'Analyzes fashion trends and market insights'
  },
  {
    value: 'email_marketer',
    label: 'Email Marketer',
    description: 'Creates and manages email marketing campaigns'
  }
];

const scheduleOptions = [
  { value: '0 */1 * * *', label: 'Every Hour' },
  { value: '0 */6 * * *', label: 'Every 6 Hours' },
  { value: '0 */12 * * *', label: 'Every 12 Hours' },
  { value: '0 0 * * *', label: 'Daily at Midnight' },
  { value: '0 9 * * *', label: 'Daily at 9 AM' },
  { value: '0 9 * * 1', label: 'Weekly on Monday at 9 AM' }
];

export const AIAgentSetup = ({ onAgentCreated }: { onAgentCreated?: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<AgentFormData>({
    name: '',
    type: 'social_media_poster',
    description: '',
    schedule_cron: '0 */6 * * *',
    config: {}
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('ai_agents')
        .insert([{
          name: formData.name,
          type: formData.type,
          description: formData.description,
          schedule_cron: formData.schedule_cron,
          config: formData.config,
          status: 'active',
          next_run_at: new Date().toISOString()
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "AI Agent created successfully",
      });

      // Reset form
      setFormData({
        name: '',
        type: 'social_media_poster',
        description: '',
        schedule_cron: '0 */6 * * *',
        config: {}
      });
      
      setIsOpen(false);
      onAgentCreated?.();
      
    } catch (error) {
      console.error('Error creating agent:', error);
      toast({
        title: "Error",
        description: "Failed to create AI agent",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateConfig = (key: string, value: string) => {
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
              <Label htmlFor="prompt">Content Prompt</Label>
              <Textarea
                id="prompt"
                placeholder="Describe what kind of content to generate..."
                value={formData.config.prompt || ''}
                onChange={(e) => updateConfig('prompt', e.target.value)}
              />
            </div>
          </div>
        );
      case 'inventory_monitor':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="threshold">Low Stock Threshold</Label>
              <Input
                id="threshold"
                type="number"
                placeholder="5"
                value={formData.config.threshold || ''}
                onChange={(e) => updateConfig('threshold', e.target.value)}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Create New AI Agent
      </Button>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bot className="w-5 h-5 mr-2" />
          Create AI Agent
        </CardTitle>
        <CardDescription>
          Set up a new autonomous AI agent for your streetwear business
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Agent Name</Label>
            <Input
              id="name"
              required
              placeholder="Instagram Content Creator"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="type">Agent Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as AgentType }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select agent type" />
              </SelectTrigger>
              <SelectContent>
                {agentTypes.map(type => (
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
            <Input
              id="description"
              placeholder="Brief description of what this agent will do"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="schedule">Schedule</Label>
            <Select
              value={formData.schedule_cron}
              onValueChange={(value) => setFormData(prev => ({ ...prev, schedule_cron: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {scheduleOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {renderConfigFields()}

          <div className="flex space-x-2 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Creating...' : 'Create Agent'}
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