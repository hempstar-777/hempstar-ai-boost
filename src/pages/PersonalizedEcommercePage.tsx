import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalizationEngine } from "@/components/personalization/PersonalizationEngine";
import { SEOOptimizer } from "@/components/seo/SEOOptimizer";
import { useToast } from "@/hooks/use-toast";
import { 
  Store, 
  Users, 
  Heart, 
  Search, 
  TrendingUp, 
  Mail, 
  Share2, 
  Gift,
  Palette,
  Shirt,
  Image as ImageIcon,
  User,
  Crown,
  Zap
} from "lucide-react";

export const PersonalizedEcommercePage: React.FC = () => {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Mock auth state
  const [userId] = useState('user-123'); // Mock user ID
  const [email, setEmail] = useState('');

  // Mock store stats
  const storeStats = {
    totalProducts: 127,
    activeCustomers: 2850,
    conversionRate: 3.2,
    avgOrderValue: 89.50,
    loyaltyMembers: 340,
    wishlistItems: 1250
  };

  const handleEmailSignup = () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Welcome to Hempstar.Store!",
      description: "Check your email for a special welcome discount.",
    });
    setEmail('');
  };

  const handleShareProduct = (productName: string) => {
    toast({
      title: "Shared Successfully",
      description: `Shared "${productName}" on social media.`,
    });
  };

  return (
    <main className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-hemp bg-clip-text text-transparent">
          🎨 Welcome to Hempstar.Store
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover unique artist-designed fashion, sustainable hemp clothing, and one-of-a-kind artwork. 
          Where creativity meets conscious living.
        </p>
      </div>

      {/* Store Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="text-center">
          <CardContent className="pt-4">
            <div className="flex items-center justify-center mb-2">
              <Store className="h-6 w-6 text-hemp-primary" />
            </div>
            <div className="text-2xl font-bold">{storeStats.totalProducts}</div>
            <div className="text-xs text-muted-foreground">Unique Products</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-4">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-6 w-6 text-hemp-primary" />
            </div>
            <div className="text-2xl font-bold">{storeStats.activeCustomers}</div>
            <div className="text-xs text-muted-foreground">Art Lovers</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-4">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="h-6 w-6 text-hemp-primary" />
            </div>
            <div className="text-2xl font-bold">{storeStats.conversionRate}%</div>
            <div className="text-xs text-muted-foreground">Conversion</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-4">
            <div className="flex items-center justify-center mb-2">
              <Crown className="h-6 w-6 text-hemp-primary" />
            </div>
            <div className="text-2xl font-bold">${storeStats.avgOrderValue}</div>
            <div className="text-xs text-muted-foreground">Avg Order</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-4">
            <div className="flex items-center justify-center mb-2">
              <Gift className="h-6 w-6 text-hemp-primary" />
            </div>
            <div className="text-2xl font-bold">{storeStats.loyaltyMembers}</div>
            <div className="text-xs text-muted-foreground">VIP Members</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-4">
            <div className="flex items-center justify-center mb-2">
              <Heart className="h-6 w-6 text-hemp-primary" />
            </div>
            <div className="text-2xl font-bold">{storeStats.wishlistItems}</div>
            <div className="text-xs text-muted-foreground">Wishlisted</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="personalization" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personalization">Personalization</TabsTrigger>
          <TabsTrigger value="seo">SEO Tools</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
        </TabsList>

        <TabsContent value="personalization" className="space-y-6">
          <PersonalizationEngine userId={userId} isAuthenticated={isAuthenticated} />
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <SEOOptimizer />
        </TabsContent>

        <TabsContent value="marketing" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Email Marketing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Marketing
                </CardTitle>
                <CardDescription>
                  Build your community of art enthusiasts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gradient-glow rounded-lg">
                  <h4 className="font-semibold text-hemp-light mb-2">Join the Artist Community</h4>
                  <p className="text-sm text-hemp-light/80 mb-3">
                    Get exclusive previews of new collections and artist collaborations
                  </p>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-hemp-light/10 border-hemp-light/20 text-hemp-light placeholder-hemp-light/60"
                    />
                    <Button 
                      onClick={handleEmailSignup}
                      className="bg-hemp-light text-hemp-dark hover:bg-hemp-light/90"
                    >
                      Join
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h5 className="font-medium text-sm">Campaign Ideas:</h5>
                  <div className="grid grid-cols-1 gap-2">
                    <Button variant="outline" size="sm" className="justify-start text-xs">
                      <Palette className="h-3 w-3 mr-2" />
                      New Artist Spotlight Series
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start text-xs">
                      <Gift className="h-3 w-3 mr-2" />
                      Seasonal Collection Launch
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start text-xs">
                      <Crown className="h-3 w-3 mr-2" />
                      VIP Early Access Events
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Media & Sharing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  Social Media Tools
                </CardTitle>
                <CardDescription>
                  Amplify your reach across social platforms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    className="h-auto p-3 flex-col"
                    onClick={() => handleShareProduct('Hemp Canvas Collection')}
                  >
                    <ImageIcon className="h-5 w-5 mb-1" />
                    <span className="text-xs">Share on Instagram</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto p-3 flex-col"
                    onClick={() => handleShareProduct('Streetwear Drop')}
                  >
                    <Shirt className="h-5 w-5 mb-1" />
                    <span className="text-xs">Share on Pinterest</span>
                  </Button>
                </div>

                <div className="space-y-2">
                  <h5 className="font-medium text-sm">Content Suggestions:</h5>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>• Behind-the-scenes artist collaboration videos</p>
                    <p>• Customer styling posts with your pieces</p>
                    <p>• Sustainability story content</p>
                    <p>• Artist interview series</p>
                  </div>
                </div>

                <Button className="w-full text-xs">
                  <Zap className="h-3 w-3 mr-2" />
                  Generate Social Media Content
                </Button>
              </CardContent>
            </Card>

            {/* Referral Program */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Artist & Influencer Referral Program
                </CardTitle>
                <CardDescription>
                  Partner with creators to expand your reach
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <Palette className="h-8 w-8 mx-auto mb-2 text-hemp-primary" />
                    <h4 className="font-medium mb-1">Artist Partners</h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      20% commission on referred sales
                    </p>
                    <Button size="sm" variant="outline">
                      Invite Artists
                    </Button>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <User className="h-8 w-8 mx-auto mb-2 text-hemp-primary" />
                    <h4 className="font-medium mb-1">Influencers</h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      15% commission + exclusive pieces
                    </p>
                    <Button size="sm" variant="outline">
                      Partner Up
                    </Button>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Gift className="h-8 w-8 mx-auto mb-2 text-hemp-primary" />
                    <h4 className="font-medium mb-1">Customers</h4>
                    <p className="text-xs text-muted-foreground mb-2">
                      $10 credit for each referral
                    </p>
                    <Button size="sm" variant="outline">
                      Share & Earn
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="community" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Loyalty */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5" />
                  VIP Art Lover Program
                </CardTitle>
                <CardDescription>
                  Reward your most passionate customers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">Current Members</h4>
                    <Badge variant="secondary">{storeStats.loyaltyMembers}</Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Canvas Collectors</span>
                      <span className="text-muted-foreground">156 members</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Streetwear Enthusiasts</span>
                      <span className="text-muted-foreground">124 members</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Art Patrons</span>
                      <span className="text-muted-foreground">60 members</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h5 className="font-medium text-sm">Member Benefits:</h5>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>• Early access to new artist collaborations</p>
                    <p>• Exclusive artist meet-and-greet events</p>
                    <p>• 15% discount on all purchases</p>
                    <p>• Free shipping on all orders</p>
                    <p>• Birthday month special offers</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User-Generated Content */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Community Showcase
                </CardTitle>
                <CardDescription>
                  Celebrate your customers' style
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-hemp-primary/20 flex items-center justify-center">
                        <User className="h-3 w-3 text-hemp-primary" />
                      </div>
                      <span className="text-sm font-medium">@artlover_jane</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      "Absolutely love my new hemp canvas piece! The artist's vision really speaks to me. 🎨"
                    </p>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-hemp-primary/20 flex items-center justify-center">
                        <User className="h-3 w-3 text-hemp-primary" />
                      </div>
                      <span className="text-sm font-medium">@streetstyle_mike</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      "The hoodie quality is incredible! Sustainable fashion that actually looks amazing. 👕"
                    </p>
                  </div>
                </div>

                <Button className="w-full text-xs">
                  <Share2 className="h-3 w-3 mr-2" />
                  Feature Customer Posts
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default PersonalizedEcommercePage;