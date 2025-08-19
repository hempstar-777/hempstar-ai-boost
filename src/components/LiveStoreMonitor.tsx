
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { realTimeSync, type LiveProductData, type StoreInsights } from '@/utils/realTimeStoreSync';
import { 
  Store, 
  RefreshCw, 
  TrendingUp, 
  Package, 
  DollarSign, 
  Eye,
  Zap,
  Target,
  Globe,
  ShoppingCart
} from 'lucide-react';

export const LiveStoreMonitor = () => {
  const [products, setProducts] = useState<LiveProductData[]>([]);
  const [insights, setInsights] = useState<StoreInsights | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const { toast } = useToast();

  const syncStore = async () => {
    setIsLoading(true);
    try {
      const liveProducts = await realTimeSync.syncWithStore();
      setProducts(liveProducts);
      setInsights(realTimeSync.getStoreInsights());
      setLastSync(realTimeSync.getLastSyncTime());
      
      toast({
        title: "🚀 Store Sync Complete!",
        description: `Found ${liveProducts.length} products ready to drive sales`,
      });
    } catch (error) {
      toast({
        title: "Sync Error", 
        description: "Failed to sync with store",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    syncStore();
  }, []);

  const boostTraffic = () => {
    toast({
      title: "🎯 Traffic Boost Activated!",
      description: "Launching marketing campaigns to drive customers to hempstar.store",
    });
  };

  return (
    <div className="space-y-6">
      {/* Store Status Header */}
      <Card className="border-hemp-primary/20 bg-gradient-hemp">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-black text-hemp-dark flex items-center justify-center">
            <Store className="w-8 h-8 mr-3" />
            HEMPSTAR.STORE LIVE MONITOR
          </CardTitle>
          <CardDescription className="text-hemp-dark/80">
            Real-time inventory tracking and traffic driving system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="text-hemp-dark">
              <div className="text-sm opacity-80">Last Sync</div>
              <div className="font-bold">
                {lastSync ? lastSync.toLocaleTimeString() : 'Never'}
              </div>
            </div>
            <Button 
              onClick={syncStore}
              disabled={isLoading}
              className="bg-hemp-dark hover:bg-hemp-dark/90 text-hemp-light"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-hemp-light border-t-transparent rounded-full mr-2"></div>
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Sync Store
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Store Insights */}
      {insights && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-hemp-primary/20">
            <CardContent className="p-6 text-center">
              <Package className="w-8 h-8 text-hemp-primary mx-auto mb-2" />
              <div className="text-2xl font-black text-hemp-primary">{insights.totalProducts}</div>
              <div className="text-sm text-muted-foreground">Total Products</div>
            </CardContent>
          </Card>
          
          <Card className="border-hemp-accent/20">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-hemp-accent mx-auto mb-2" />
              <div className="text-2xl font-black text-hemp-accent capitalize">{insights.stockLevel}</div>
              <div className="text-sm text-muted-foreground">Stock Level</div>
            </CardContent>
          </Card>

          <Card className="border-green-500/20">
            <CardContent className="p-6 text-center">
              <Eye className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-black text-green-600">{insights.hempProducts}</div>
              <div className="text-sm text-muted-foreground">Hemp Items</div>
            </CardContent>
          </Card>

          <Card className="border-blue-500/20">
            <CardContent className="p-6 text-center">
              <ShoppingCart className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-black text-blue-600">{insights.polyesterProducts}</div>
              <div className="text-sm text-muted-foreground">Embroidered Items</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Product Showcase */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="w-5 h-5 mr-2 text-hemp-primary" />
            Premium Streetwear Collection
          </CardTitle>
          <CardDescription>
            Quality embroidered designs ready to boost your sales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.slice(0, 6).map((product, index) => (
              <Card key={index} className="border-hemp-primary/10 hover:border-hemp-primary/30 transition-colors">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-sm">{product.name}</h3>
                      <Badge className="bg-hemp-primary/20 text-hemp-primary border-hemp-primary/40">
                        {product.price}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-muted-foreground">{product.description}</p>
                    
                    <div className="flex justify-between items-center">
                      <Badge variant="outline" className="text-xs">
                        {product.material}
                      </Badge>
                      <Badge className={`text-xs ${product.inStock ? 'bg-green-500/20 text-green-700' : 'bg-red-500/20 text-red-700'}`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1">
                      {product.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center text-xs text-muted-foreground">
                          <Zap className="w-3 h-3 text-hemp-accent mr-1" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Traffic Booster */}
      <Card className="border-hemp-primary/40 bg-gradient-to-br from-hemp-primary/10 to-hemp-accent/10">
        <CardContent className="text-center py-12">
          <Globe className="w-16 h-16 text-hemp-primary mx-auto mb-6" />
          <h3 className="text-3xl font-black mb-4">
            READY TO DOMINATE THE INTERNET?
          </h3>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Drive massive traffic to hempstar.store and turn visitors into customers with AI-powered marketing
          </p>
          <Button 
            size="lg"
            onClick={boostTraffic}
            className="bg-gradient-to-r from-hemp-primary to-hemp-accent hover:from-hemp-accent hover:to-hemp-primary text-hemp-dark font-black px-12 py-4 text-lg"
          >
            <Zap className="mr-2 w-5 h-5" />
            BOOST TRAFFIC NOW
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
