import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  Eye, 
  Target,
  Palette,
  Shirt,
  Image,
  DollarSign,
  ArrowUpRight,
  Calendar,
  MessageSquare,
  Lightbulb
} from "lucide-react";
import { RevenueChart } from "@/components/analytics/RevenueChart";
import { ConversionFunnel } from "@/components/analytics/ConversionFunnel";

export const AdminInsightsPage: React.FC = () => {
  const { toast } = useToast();
  const [notes, setNotes] = useState("");
  const [selectedTimeframe, setSelectedTimeframe] = useState("7d");

  // Mock data - would be replaced with real Supabase queries
  const dashboardData = {
    totalRevenue: 12450,
    revenueGrowth: 23.5,
    totalVisitors: 3420,
    visitorGrowth: 18.2,
    conversionRate: 3.2,
    conversionGrowth: 5.8,
    avgOrderValue: 89.50,
    topProducts: [
      { name: "Artist Canvas - Abstract Hemp", sales: 45, revenue: 2250, category: "canvas" },
      { name: "Hemp Streetwear Hoodie", sales: 38, revenue: 1900, category: "clothing" },
      { name: "Sculptural Art Piece", sales: 12, revenue: 1800, category: "sculpture" },
      { name: "Designer T-Shirt Collection", sales: 67, revenue: 1340, category: "clothing" }
    ],
    trafficSources: [
      { source: "Instagram", visitors: 1250, conversion: 4.2 },
      { source: "Organic Search", visitors: 980, conversion: 3.8 },
      { source: "Direct", visitors: 750, conversion: 2.9 },
      { source: "Pinterest", visitors: 440, conversion: 3.1 }
    ],
    aiSuggestions: [
      {
        type: "traffic",
        message: "Instagram traffic is down 15% - consider posting the new artist collaboration",
        priority: "high"
      },
      {
        type: "inventory",
        message: "Canvas art pieces are selling 3x faster than clothing - increase artist partnerships",
        priority: "medium"
      },
      {
        type: "seo",
        message: "Add alt text to 12 product images to improve search visibility",
        priority: "low"
      }
    ]
  };

  const handleGenerateContent = async (contentType: string) => {
    toast({
      title: "Content Generation Started",
      description: `Generating ${contentType} content for hempstar.store...`,
    });
    
    // Would integrate with AI agents here
    setTimeout(() => {
      toast({
        title: "Content Ready",
        description: `${contentType} content has been generated and is ready for review.`,
      });
    }, 3000);
  };

  const handleSaveNotes = () => {
    // Would save to Supabase here
    toast({
      title: "Notes Saved",
      description: "Your personal notes have been saved successfully.",
    });
  };

  return (
    <main className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-hemp bg-clip-text text-transparent">
            🎨 Admin Insights - Hempstar.Store
          </h1>
          <p className="text-muted-foreground mt-2">
            Your personal command center for traffic, sales, and artist collaborations
          </p>
        </div>
        <div className="flex items-center gap-4">
          <select 
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-3 py-2 bg-card border rounded-md text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-glow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-hemp-light">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-hemp-light" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-hemp-light">${dashboardData.totalRevenue}</div>
            <div className="flex items-center text-xs text-hemp-light/80">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +{dashboardData.revenueGrowth}% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalVisitors}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +{dashboardData.visitorGrowth}% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.conversionRate}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +{dashboardData.conversionGrowth}% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${dashboardData.avgOrderValue}</div>
            <p className="text-xs text-muted-foreground">Per transaction</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="traffic">Traffic</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
          <TabsTrigger value="personal">Personal</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
                <CardDescription>Track your sales performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <RevenueChart />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conversion Funnel</CardTitle>
                <CardDescription>See where visitors drop off</CardDescription>
              </CardHeader>
              <CardContent>
                <ConversionFunnel />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Top Performing Products
              </CardTitle>
              <CardDescription>Your best-selling artist collaborations and designs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.topProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-hemp-primary/20 flex items-center justify-center">
                        {product.category === 'canvas' && <Image className="h-4 w-4 text-hemp-primary" />}
                        {product.category === 'clothing' && <Shirt className="h-4 w-4 text-hemp-primary" />}
                        {product.category === 'sculpture' && <Palette className="h-4 w-4 text-hemp-primary" />}
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.sales} sales</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${product.revenue}</p>
                      <Badge variant="outline" className="mt-1">
                        {product.category}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Traffic Sources Analysis
              </CardTitle>
              <CardDescription>Where your art lovers are discovering you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.trafficSources.map((source) => (
                  <div key={source.source} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{source.source}</span>
                      <div className="text-right">
                        <span className="text-sm font-semibold">{source.visitors} visitors</span>
                        <span className="text-xs text-muted-foreground ml-2">({source.conversion}% conv.)</span>
                      </div>
                    </div>
                    <Progress value={(source.visitors / 3420) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  AI Recommendations
                </CardTitle>
                <CardDescription>Smart suggestions to boost your sales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.aiSuggestions.map((suggestion, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <Badge variant={suggestion.priority === 'high' ? 'destructive' : suggestion.priority === 'medium' ? 'default' : 'secondary'}>
                            {suggestion.priority} priority
                          </Badge>
                          <p className="mt-2 text-sm">{suggestion.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content Generation Tools</CardTitle>
                <CardDescription>AI-powered content for your store</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={() => handleGenerateContent('product descriptions')}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Generate Product Descriptions
                </Button>
                <Button 
                  onClick={() => handleGenerateContent('social media posts')}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Image className="h-4 w-4 mr-2" />
                  Create Social Media Posts
                </Button>
                <Button 
                  onClick={() => handleGenerateContent('SEO content')}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Optimize SEO Content
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Personal Notes & Ideas
              </CardTitle>
              <CardDescription>Your private space for planning and inspiration</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Jot down ideas for new artist collaborations, promotion strategies, or store improvements..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[200px] mb-4"
              />
              <Button onClick={handleSaveNotes} className="w-full">
                Save Notes
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Fast access to common tasks</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-auto p-4 flex-col">
                <Palette className="h-6 w-6 mb-2" />
                <span>New Artist Collab</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex-col">
                <Eye className="h-6 w-6 mb-2" />
                <span>Review Orders</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex-col">
                <TrendingUp className="h-6 w-6 mb-2" />
                <span>Export Analytics</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex-col">
                <Users className="h-6 w-6 mb-2" />
                <span>Customer Insights</span>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default AdminInsightsPage;