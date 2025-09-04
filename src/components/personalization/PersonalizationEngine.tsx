import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { 
  Heart, 
  Star, 
  Eye, 
  ShoppingCart, 
  Palette, 
  Shirt, 
  Image as ImageIcon,
  TrendingUp,
  User,
  Gift
} from "lucide-react";

interface UserPreferences {
  favoriteCategories: string[];
  priceRange: { min: number; max: number };
  artistPreferences: string[];
  stylePreferences: string[];
  visitHistory: any[];
}

interface RecommendedProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  artist: string;
  imageUrl: string;
  matchScore: number;
  reasons: string[];
}

interface PersonalizationEngineProps {
  userId?: string;
  isAuthenticated: boolean;
}

export const PersonalizationEngine: React.FC<PersonalizationEngineProps> = ({ 
  userId, 
  isAuthenticated 
}) => {
  const { toast } = useToast();
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock user preferences and recommendations - would come from Supabase
  const mockUserPreferences: UserPreferences = {
    favoriteCategories: ['canvas', 'clothing'],
    priceRange: { min: 25, max: 150 },
    artistPreferences: ['hemp_artist_collective', 'urban_canvas_creator'],
    stylePreferences: ['abstract', 'streetwear', 'nature_inspired'],
    visitHistory: [
      { productId: '1', category: 'canvas', timestamp: new Date() },
      { productId: '2', category: 'clothing', timestamp: new Date() }
    ]
  };

  const mockRecommendations: RecommendedProduct[] = [
    {
      id: '1',
      name: 'Abstract Hemp Canvas - Urban Flow',
      price: 89.99,
      category: 'canvas',
      artist: 'Hemp Artist Collective',
      imageUrl: '/placeholder-canvas.jpg',
      matchScore: 95,
      reasons: ['Matches your love for abstract art', 'Same artist as your previous purchase', 'Within your price range']
    },
    {
      id: '2',
      name: 'Streetwear Hoodie - Nature Vibes',
      price: 65.00,
      category: 'clothing',
      artist: 'Urban Canvas Creator',
      imageUrl: '/placeholder-hoodie.jpg',
      matchScore: 88,
      reasons: ['Perfect for streetwear lovers', 'Nature-inspired design you prefer', 'Popular with similar users']
    },
    {
      id: '3',
      name: 'Hemp Sculpture - Organic Forms',
      price: 120.00,
      category: 'sculpture',
      artist: 'Eco Art Studio',
      imageUrl: '/placeholder-sculpture.jpg',
      matchScore: 72,
      reasons: ['New category to explore', 'Organic style match', 'Limited edition piece']
    }
  ];

  useEffect(() => {
    if (isAuthenticated && userId) {
      loadUserPreferences();
      generatePersonalizedRecommendations();
    }
  }, [userId, isAuthenticated]);

  const loadUserPreferences = async () => {
    setIsLoading(true);
    try {
      // Would load from Supabase user behavior tracking
      setTimeout(() => {
        setUserPreferences(mockUserPreferences);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading user preferences:', error);
      setIsLoading(false);
    }
  };

  const generatePersonalizedRecommendations = async () => {
    try {
      // Would use AI/ML algorithms to generate recommendations
      setTimeout(() => {
        setRecommendations(mockRecommendations);
      }, 1500);
    } catch (error) {
      console.error('Error generating recommendations:', error);
    }
  };

  const handleProductInteraction = async (productId: string, action: 'view' | 'like' | 'add_to_cart') => {
    // Track user interaction for better future recommendations
    toast({
      title: "Preferences Updated",
      description: "We'll use this to improve your recommendations.",
    });
    
    // Would save to Supabase customer_behaviors table
    console.log(`User ${userId} performed ${action} on product ${productId}`);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'canvas': return <ImageIcon className="h-4 w-4" />;
      case 'clothing': return <Shirt className="h-4 w-4" />;
      case 'sculpture': return <Palette className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  if (!isAuthenticated) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personalized Experience
          </CardTitle>
          <CardDescription>
            Sign in to get personalized product recommendations based on your unique style preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full">
            Sign In for Personal Recommendations
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Back Section */}
      <Card className="bg-gradient-glow">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback className="bg-hemp-primary text-hemp-light">AL</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold text-hemp-light">Welcome back, Art Lover!</h3>
              <p className="text-hemp-light/80">
                We've curated some new pieces based on your unique taste
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Preferences Summary */}
      {userPreferences && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Your Style Profile
            </CardTitle>
            <CardDescription>Based on your browsing and purchase history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <h4 className="font-medium text-sm mb-2">Favorite Categories</h4>
                <div className="flex flex-wrap gap-1">
                  {userPreferences.favoriteCategories.map((category) => (
                    <Badge key={category} variant="secondary" className="text-xs">
                      {getCategoryIcon(category)}
                      <span className="ml-1 capitalize">{category}</span>
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-2">Price Range</h4>
                <Badge variant="outline" className="text-xs">
                  ${userPreferences.priceRange.min} - ${userPreferences.priceRange.max}
                </Badge>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-2">Style Preferences</h4>
                <div className="flex flex-wrap gap-1">
                  {userPreferences.stylePreferences.slice(0, 2).map((style) => (
                    <Badge key={style} variant="outline" className="text-xs capitalize">
                      {style.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Personalized Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Recommended Just for You
          </CardTitle>
          <CardDescription>
            Handpicked based on your preferences and similar art lovers' choices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((product) => (
              <div key={product.id} className="group cursor-pointer">
                <div className="relative bg-muted rounded-lg p-4 hover:bg-muted/80 transition-colors">
                  {/* Match Score Badge */}
                  <div className="absolute top-2 right-2 z-10">
                    <Badge variant="secondary" className="text-xs">
                      {product.matchScore}% match
                    </Badge>
                  </div>
                  
                  {/* Product Image Placeholder */}
                  <div className="aspect-square bg-gradient-hemp/20 rounded-md mb-4 flex items-center justify-center">
                    {getCategoryIcon(product.category)}
                  </div>
                  
                  {/* Product Info */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm line-clamp-2">{product.name}</h4>
                    <p className="text-xs text-muted-foreground">by {product.artist}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">${product.price}</span>
                      <Badge variant="outline" className="text-xs">
                        {getCategoryIcon(product.category)}
                        <span className="ml-1 capitalize">{product.category}</span>
                      </Badge>
                    </div>
                    
                    {/* Why Recommended */}
                    <div className="text-xs text-muted-foreground">
                      <p className="font-medium mb-1">Why we recommend this:</p>
                      <ul className="list-disc list-inside space-y-0.5">
                        {product.reasons.slice(0, 2).map((reason, index) => (
                          <li key={index}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 text-xs"
                        onClick={() => handleProductInteraction(product.id, 'view')}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleProductInteraction(product.id, 'like')}
                      >
                        <Heart className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1 text-xs"
                        onClick={() => handleProductInteraction(product.id, 'add_to_cart')}
                      >
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Loyalty Program Teaser */}
      <Card className="border-hemp-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-hemp-primary" />
            Art Lover Rewards
          </CardTitle>
          <CardDescription>
            Exclusive perks for our community of art enthusiasts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm mb-1">Your Status: <span className="font-medium">Canvas Collector</span></p>
              <p className="text-xs text-muted-foreground">
                Earn points with every purchase • Get early access to new artist drops
              </p>
            </div>
            <Button variant="outline" size="sm">
              View Rewards
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalizationEngine;