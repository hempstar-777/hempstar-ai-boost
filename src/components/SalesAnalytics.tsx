
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  ShoppingCart,
  Globe,
  Target,
  Zap,
  ArrowUpRight,
  Calendar,
  Map
} from 'lucide-react';

const salesData = {
  today: {
    revenue: 12847,
    orders: 87,
    conversion: 4.2,
    traffic: 20847
  },
  week: {
    revenue: 67432,
    orders: 456,
    conversion: 3.8,
    traffic: 124853
  },
  month: {
    revenue: 287394,
    orders: 1923,
    conversion: 4.1,
    traffic: 589247
  }
};

const topProducts = [
  { name: "HUMMIES (Yellow)", sales: 234, revenue: 58260, trend: "+23%" },
  { name: "Hemp Streetwear Hoodie", sales: 189, revenue: 17010, trend: "+45%" },
  { name: "Sustainable Street Tee", sales: 156, revenue: 5460, trend: "+12%" },
  { name: "Hemp Joggers", sales: 134, revenue: 9110, trend: "+34%" },
  { name: "HUMMIES (Blue)", sales: 127, revenue: 31630, trend: "+18%" }
];

const customerSegments = [
  { segment: "Hemp Enthusiasts", count: 1847, value: "$234,590", growth: "+67%" },
  { segment: "Streetwear Collectors", count: 934, value: "$156,780", growth: "+45%" },
  { segment: "Sustainability Advocates", count: 723, value: "$98,450", growth: "+89%" },
  { segment: "Fashion Forward", count: 612, value: "$134,220", growth: "+34%" }
];

const geoData = [
  { country: "United States", revenue: 145890, orders: 967, share: "51%" },
  { country: "Canada", revenue: 67234, orders: 445, share: "23%" },
  { country: "United Kingdom", revenue: 43567, orders: 289, share: "15%" },
  { country: "Australia", revenue: 23456, orders: 156, share: "8%" },
  { country: "Germany", revenue: 7847, orders: 66, share: "3%" }
];

export const SalesAnalytics = () => {
  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month'>('today');
  const { toast } = useToast();

  const generateReport = () => {
    toast({
      title: "📊 Generating Advanced Analytics",
      description: "Creating comprehensive sales intelligence report for hempstar.store",
    });

    setTimeout(() => {
      toast({
        title: "✅ Report Generated!",
        description: "Your sales intelligence report is ready with actionable insights",
      });
    }, 2000);
  };

  const currentData = salesData[timeframe];

  return (
    <div className="space-y-8">
      {/* Key Metrics Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card className="border-hemp-primary/20 bg-gradient-to-br from-hemp-primary/10 to-hemp-primary/5">
          <CardContent className="p-6 text-center">
            <DollarSign className="w-8 h-8 text-hemp-primary mx-auto mb-3" />
            <div className="text-3xl font-black text-hemp-primary">
              ${currentData.revenue.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground capitalize">{timeframe} Revenue</div>
            <Badge className="mt-2 bg-green-500/20 text-green-700 border-green-500/40">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              +34%
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-hemp-accent/20 bg-gradient-to-br from-hemp-accent/10 to-hemp-accent/5">
          <CardContent className="p-6 text-center">
            <ShoppingCart className="w-8 h-8 text-hemp-accent mx-auto mb-3" />
            <div className="text-3xl font-black text-hemp-accent">
              {currentData.orders.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground capitalize">{timeframe} Orders</div>
            <Badge className="mt-2 bg-green-500/20 text-green-700 border-green-500/40">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              +28%
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-blue-500/5">
          <CardContent className="p-6 text-center">
            <Target className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <div className="text-3xl font-black text-blue-600">
              {currentData.conversion}%
            </div>
            <div className="text-sm text-muted-foreground">Conversion Rate</div>
            <Badge className="mt-2 bg-green-500/20 text-green-700 border-green-500/40">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              +0.8%
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-purple-500/5">
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <div className="text-3xl font-black text-purple-600">
              {currentData.traffic.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground capitalize">{timeframe} Traffic</div>
            <Badge className="mt-2 bg-green-500/20 text-green-700 border-green-500/40">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              +67%
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Timeframe Selector */}
      <div className="flex justify-center">
        <div className="flex bg-muted rounded-lg p-1">
          {(['today', 'week', 'month'] as const).map((period) => (
            <Button
              key={period}
              variant={timeframe === period ? "default" : "ghost"}
              size="sm"
              onClick={() => setTimeframe(period)}
              className={timeframe === period ? "bg-hemp-primary hover:bg-hemp-accent text-hemp-dark" : ""}
            >
              <Calendar className="w-4 h-4 mr-2" />
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="products" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="products">Top Products</TabsTrigger>
          <TabsTrigger value="customers">Customer Segments</TabsTrigger>
          <TabsTrigger value="geography">Geographic Data</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-hemp-primary" />
                Best Performing Hemp Products
              </CardTitle>
              <CardDescription>Top sellers driving hempstar.store revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-hemp-primary/10 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-hemp-primary/20 rounded-full flex items-center justify-center text-sm font-bold text-hemp-primary">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-semibold">{product.name}</div>
                        <div className="text-sm text-muted-foreground">{product.sales} sales</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">${product.revenue.toLocaleString()}</div>
                      <Badge className="bg-green-500/20 text-green-700 border-green-500/40">
                        {product.trend}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-hemp-accent" />
                Customer Intelligence
              </CardTitle>
              <CardDescription>Key customer segments and their behavior</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {customerSegments.map((segment, index) => (
                  <Card key={index} className="border-hemp-primary/10">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">{segment.segment}</h3>
                        <Badge className="bg-hemp-primary/20 text-hemp-primary border-hemp-primary/40">
                          {segment.growth}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Customers</span>
                          <span className="font-medium">{segment.count.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Value</span>
                          <span className="font-bold text-hemp-primary">{segment.value}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geography" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="w-5 h-5 mr-2 text-blue-600" />
                Global Hemp Streetwear Reach
              </CardTitle>
              <CardDescription>Revenue by geographic region</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {geoData.map((geo, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-hemp-primary/10 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Map className="w-5 h-5 text-hemp-primary" />
                      <div>
                        <div className="font-semibold">{geo.country}</div>
                        <div className="text-sm text-muted-foreground">{geo.orders} orders</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">${geo.revenue.toLocaleString()}</div>
                      <Badge className="bg-hemp-primary/20 text-hemp-primary border-hemp-primary/40">
                        {geo.share}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Center */}
      <Card className="border-hemp-primary/20 bg-gradient-hemp">
        <CardContent className="text-center py-12">
          <BarChart3 className="w-16 h-16 text-hemp-dark mx-auto mb-6" />
          <h3 className="text-3xl font-black text-hemp-dark mb-4">
            UNLOCK DEEPER INSIGHTS
          </h3>
          <p className="text-xl text-hemp-dark/80 mb-8 max-w-2xl mx-auto">
            Generate advanced AI-powered reports with predictive analytics and actionable recommendations
          </p>
          <Button 
            size="lg"
            onClick={generateReport}
            className="bg-hemp-dark hover:bg-hemp-dark/90 text-hemp-light font-black px-12 py-4 text-lg"
          >
            <Zap className="mr-2 w-5 h-5" />
            GENERATE AI REPORT
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
