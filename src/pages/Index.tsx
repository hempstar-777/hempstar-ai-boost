
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/HeroSection";
import { AIToolsSection } from "@/components/AIToolsSection";
import { AIAgentDashboard } from "@/components/AIAgentDashboard";
import { SIDashboard } from "@/components/SIDashboard";
import { UserProfile } from "@/components/UserProfile";
import { StartupInitializer } from "@/components/StartupInitializer";
import { useAuth } from "@/components/AuthProvider";
import { Brain, Zap, BarChart3, User, ExternalLink } from "lucide-react";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <StartupInitializer />
      
      {/* Header */}
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Hempstar AI
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {user && (
                <div className="text-sm text-muted-foreground">
                  Welcome back, {user.email?.split('@')[0]}
                </div>
              )}
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open('https://hempstar.store', '_blank')}
                className="flex items-center space-x-2"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Visit Store</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="overview" className="flex items-center">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="ai-agents" className="flex items-center">
              <Brain className="w-4 h-4 mr-2" />
              AI Agents
            </TabsTrigger>
            <TabsTrigger value="si-control" className="flex items-center">
              <Zap className="w-4 h-4 mr-2" />
              SI Control
            </TabsTrigger>
            <TabsTrigger value="tools" className="flex items-center">
              <Brain className="w-4 h-4 mr-2" />
              AI Tools
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <HeroSection />
            
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="mr-2 h-5 w-5 text-primary" />
                    AI Agents Active
                  </CardTitle>
                  <CardDescription>
                    Autonomous agents running your hemp store operations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">4</div>
                  <p className="text-sm text-muted-foreground">
                    Content creation, inventory, customer service, and trend analysis
                  </p>
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="mr-2 h-5 w-5 text-primary" />
                    SI Intelligence
                  </CardTitle>
                  <CardDescription>
                    Synthetic Intelligence learning and adapting
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">Active</div>
                  <p className="text-sm text-muted-foreground">
                    Real-time learning and decision making
                  </p>
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-gradient-to-br from-background to-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5 text-primary" />
                    Store Integration
                  </CardTitle>
                  <CardDescription>
                    Connected to hempstar.store
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">Live</div>
                  <p className="text-sm text-muted-foreground">
                    Real-time inventory and sales monitoring
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ai-agents">
            <AIAgentDashboard />
          </TabsContent>

          <TabsContent value="si-control">
            <SIDashboard />
          </TabsContent>

          <TabsContent value="tools">
            <AIToolsSection />
          </TabsContent>

          <TabsContent value="profile" className="max-w-md mx-auto">
            <UserProfile />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
