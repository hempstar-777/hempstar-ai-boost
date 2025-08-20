
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
  ShoppingCart,
  AlertCircle,
  ExternalLink
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
      const liveProducts = await realTimeSync.syncWithWixStore();
      setProducts(liveProducts);
      setInsights(realTimeSync.getStoreInsights());
      setLastSync(realTimeSync.getLastSyncTime());
      
      if (liveProducts.length === 0) {
        toast({
          title: "⚠️ Wix Connection Needed",
          description: "Connect your Wix store to see real product data",
        });
      } else {
        toast({
          title: "🚀 Store Sync Complete!",
          description: `Found ${liveProducts.length} real products from hempstar.store`,
        });
      }
    } catch (error) {
      toast({
        title: "Connection Error", 
        description: "Need Wix API credentials to connect to hempstar.store",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    syncStore();
  }, []);

  const openStore = () => {
    window.open('https://hempstar.store', '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Store Status Header */}
      <Card className="border-hemp-primary/20 bg-gradient-hemp">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-black text-hemp-dark flex items-center justify-center">
            <Store className="w-8 h-8 mr-3" />
            HEMPSTAR.STORE REAL-TIME MONITOR
          </CardTitle>
          <CardDescription className="text-hemp-dark/80">
            Live connection to your Wix streetwear store
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="text-hemp-dark">
              <div className="text-sm opacity-80">Connection Status</div>
              <div className="font-bold flex items-center">
                <AlertCircle className="w-4 h-4 mr-2 text-yellow-600" />
                Wix API Setup Needed
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                onClick={openStore}
                variant="outline"
                className="border-hemp-dark text-hemp-dark hover:bg-hemp-dark hover:text-hemp-light"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Visit Store
              </Button>
              <Button 
                onClick={syncStore}
                disabled={isLoading}
                className="bg-hemp-dark hover:bg-hemp-dark/90 text-hemp-light"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-hemp-light border-t-transparent rounded-full mr-2"></div>
                    Connecting...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Connect Wix
                  </>
                )}
              </Button>
            </div>
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
              <div className="text-sm text-muted-foreground">Real Products</div>
            </CardContent>
          </Card>
          
          <Card className="border-hemp-accent/20">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-hemp-accent mx-auto mb-2" />
              <div className="text-2xl font-black text-hemp-accent capitalize">{insights.connectionStatus}</div>
              <div className="text-sm text-muted-foreground">Connection</div>
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
              <div className="text-sm text-muted-foreground">Other Items</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Connection Setup */}
      <Card className="border-yellow-500/40 bg-yellow-500/5">
        <CardHeader>
          <CardTitle className="flex items-center text-yellow-800">
            <AlertCircle className="w-5 h-5 mr-2" />
            Wix Store Connection Required
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-yellow-700">
              To display real products from hempstar.store, we need to connect to your Wix store API.
            </p>
            <div className="bg-yellow-100 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">Next Steps:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-700">
                <li>Get your Wix API credentials from your store dashboard</li>
                <li>Configure the API connection in this app</li>
                <li>Start seeing real product data, sales, and inventory</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real Product Showcase (when connected) */}
      {products.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2 text-hemp-primary" />
              Live Hempstar Products
            </CardTitle>
            <CardDescription>
              Real products from your Wix store
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, index) => (
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
                      
                      {product.realSales && (
                        <div className="text-xs text-green-600 font-medium">
                          Real Sales: {product.realSales}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
