import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { 
  Wand2, 
  Image, 
  TrendingUp, 
  MessageSquare, 
  BarChart3, 
  Users, 
  Mail,
  Sparkles,
  Target,
  Zap,
  Play
} from "lucide-react";

const aiTools = [
  {
    icon: Wand2,
    title: "AI Content Generator",
    description: "Create viral social media posts, SEO blog content, and marketing copy that converts hemp streetwear browsers into buyers",
    features: ["Viral Social Posts", "SEO Articles", "Product Descriptions", "Email Campaigns"],
    status: "Hot",
    color: "hemp-accent"
  },
  {
    icon: Image,
    title: "AI Visual Creator", 
    description: "Generate stunning marketing visuals, product mockups, and social media graphics for your hemp streetwear brand",
    features: ["Product Mockups", "Social Graphics", "Ad Creatives", "Brand Assets"],
    status: "New",
    color: "hemp-primary"
  },
  {
    icon: TrendingUp,
    title: "Traffic Booster AI",
    description: "Advanced SEO optimization and trend analysis to drive massive organic traffic to hempstar.store",
    features: ["SEO Optimization", "Keyword Research", "Trend Analysis", "Competitor Tracking"],
    status: "Trending",
    color: "hemp-accent"
  },
  {
    icon: MessageSquare,
    title: "AI Social Manager",
    description: "Automate your social media presence with AI-powered posting, engagement, and community management",
    features: ["Auto Posting", "Engagement AI", "Hashtag Research", "Community Growth"],
    status: "Essential",
    color: "hemp-primary"
  },
  {
    icon: BarChart3,
    title: "Analytics Intelligence",
    description: "Real-time traffic analysis, conversion tracking, and AI-powered insights to optimize your global reach",
    features: ["Traffic Analytics", "Conversion Tracking", "ROI Analysis", "Growth Insights"],
    status: "Pro",
    color: "hemp-accent"
  },
  {
    icon: Users,
    title: "Audience AI",
    description: "Identify and target your ideal hemp streetwear customers worldwide with precision AI targeting",
    features: ["Audience Research", "Demographic Analysis", "Behavior Tracking", "Targeting Optimization"],
    status: "Advanced",
    color: "hemp-primary"
  }
];

export const AIToolsSection = () => {
  const { toast } = useToast();
  const [isDeploying, setIsDeploying] = useState(false);

  const deployAllAITools = async () => {
    setIsDeploying(true);
    
    try {
      toast({
        title: "Deploying AI Tools",
        description: "Activating all AI marketing tools for global hemp streetwear domination..."
      });

      // Get all active agents and execute them
      const { data: agents, error } = await supabase
        .from('ai_agents')
        .select('*')
        .eq('status', 'active');

      if (error) throw error;

      if (!agents || agents.length === 0) {
        toast({
          title: "No Active Agents",
          description: "Set up AI agents first in the dashboard below",
          variant: "destructive"
        });
        return;
      }

      // Execute all agents in parallel
      const promises = agents.map(agent => 
        supabase.functions.invoke('enhanced-ai-executor', {
          body: { agentId: agent.id, action: 'execute' }
        })
      );

      const results = await Promise.allSettled(promises);
      
      let successCount = 0;
      let failureCount = 0;

      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && !result.value.error) {
          successCount++;
        } else {
          failureCount++;
          console.error(`Agent ${agents[index].name} failed:`, result);
        }
      });

      if (successCount > 0) {
        toast({
          title: "AI Tools Deployed Successfully! 🚀",
          description: `${successCount} AI tools activated. HempStar is now dominating the web!`,
        });
      } else {
        toast({
          title: "Deployment Failed",
          description: "All AI tools failed to activate. Check your configuration.",
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error('Error deploying AI tools:', error);
      toast({
        title: "Deployment Error",
        description: "Failed to activate AI tools. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-hemp-primary/20 text-hemp-accent border-hemp-primary/40">
            <Sparkles className="w-4 h-4 mr-2" />
            AI Marketing Arsenal
          </Badge>
          
          <h2 className="text-4xl md:text-6xl font-black mb-6 text-foreground">
            WEAPONS OF MASS
            <br />
            <span className="bg-gradient-hemp bg-clip-text text-transparent">
              TRAFFIC DESTRUCTION
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Deploy cutting-edge AI tools designed specifically to explode your hemp streetwear brand 
            across every corner of the internet and drive insane traffic to hempstar.store
          </p>
        </div>

        {/* AI Tools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {aiTools.map((tool, index) => (
            <Card 
              key={index} 
              className="group relative bg-card/40 backdrop-blur-sm border-hemp-primary/20 p-8 hover:bg-card/60 transition-all duration-300 hover:shadow-xl hover:shadow-hemp-primary/20 hover:border-hemp-primary/40"
            >
              {/* Status Badge */}
              <Badge 
                className={`absolute top-4 right-4 bg-${tool.color}/20 text-${tool.color} border-${tool.color}/40`}
              >
                {tool.status}
              </Badge>

              {/* Icon */}
              <div className={`w-16 h-16 bg-${tool.color}/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-${tool.color}/30 transition-all`}>
                <tool.icon className={`w-8 h-8 text-${tool.color}`} />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-foreground mb-4">
                {tool.title}
              </h3>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {tool.description}
              </p>

              {/* Features */}
              <div className="space-y-2 mb-6">
                {tool.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                    <Zap className="w-3 h-3 text-hemp-accent mr-2" />
                    {feature}
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <Button 
                className="w-full bg-hemp-primary hover:bg-hemp-accent text-hemp-dark font-bold"
                size="lg"
              >
                <Target className="w-4 h-4 mr-2" />
                Launch Tool
              </Button>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <Card className="bg-gradient-hemp p-12 border-0">
            <h3 className="text-3xl md:text-4xl font-black text-hemp-dark mb-4">
              READY TO DOMINATE THE GLOBAL HEMP STREETWEAR SCENE?
            </h3>
            <p className="text-xl text-hemp-dark/80 mb-8 max-w-2xl mx-auto">
              Deploy all AI tools simultaneously and watch hempstar.store explode across the worldwide web
            </p>
            <Button 
              size="lg" 
              className="bg-hemp-dark hover:bg-hemp-dark/90 text-hemp-light font-bold px-12 py-4 text-lg"
              onClick={deployAllAITools}
              disabled={isDeploying}
            >
              {isDeploying ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-hemp-light border-t-transparent rounded-full mr-2"></div>
                  DEPLOYING...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 w-5 h-5" />
                  ACTIVATE ALL AI TOOLS
                </>
              )}
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
};