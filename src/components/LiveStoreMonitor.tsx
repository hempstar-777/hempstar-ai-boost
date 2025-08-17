
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  RefreshCw, 
  Package, 
  Leaf, 
  Shirt,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { realTimeSync, LiveProductData, StoreInsights } from '@/utils/realTimeStoreSync';

export const LiveStoreMonitor = () => {
  const [products, setProducts] = useState<LiveProductData[]>([]);
  const [insights, setInsights] = useState<StoreInsights | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [isAutoSync, setIsAutoSync] = useState(false);
  const { toast } = useToast();

  const syncNow = async () => {
    setIsLoading(true);
    try {
      const liveProducts = await realTimeSync.syncWithStore();
      setProducts(liveProducts);
      setInsights(realTimeSync.getStoreInsights());
      setLastSync(realTimeSync.getLastSyncTime());
      
      toast({
        title: "🔄 Real-Time Sync Complete",
        description: `Synced ${liveProducts.length} live products from hempstar.store`,
      });
    } catch (error) {
      toast({
        title: "❌ Sync Error",
        description: "Failed to sync with hempstar.store. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAutoSync = () => {
    if (isAutoSync) {
      realTimeSync.stopRealTimeSync();
      setIsAutoSync(false);
      toast({
        title: "⏹️ Auto-Sync Stopped",
        description: "Real-time monitoring has been disabled",
      });
    } else {
      realTimeSync.startRealTimeSync(2); // Sync every 2 minutes
      setIsAutoSync(true);
      toast({
        title: "🚀 Auto-Sync Started",
        description: "Now monitoring hempstar.store every 2 minutes",
      });
    }
  };

  useEffect(() => {
    // Load initial data
    syncNow();
  }, []);

  const getMaterialColor = (material: string) => {
    if (material.includes('Hemp')) return 'bg-green-500/20 text-green-700 border-green-500/40';
    if (material.includes('Polyester')) return 'bg-blue-500/20 text-blue-700 border-blue-500/40';
    return 'bg-gray-500/20 text-gray-700 border-gray-500/40';
  };

  const getMaterialIcon = (material: string) => {
    if (material.includes('Hemp')) return <Leaf className="w-4 h-4" />;
    return <Shirt className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card className="border-hemp-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2 text-hemp-primary" />
                Live HempStar.Store Monitor
              </CardTitle>
              <CardDescription>
                Real-time product tracking and inventory insights
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button 
                onClick={syncNow}
                disabled={isLoading}
                variant="outline"
                size="sm"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                Sync Now
              </Button>
              <Button 
                onClick={toggleAutoSync}
                className={isAutoSync ? "bg-green-600 hover:bg-green-700" : ""}
                size="sm"
              >
                {isAutoSync ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Auto-Sync ON
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4 mr-2" />
                    Enable Auto-Sync
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        {lastSync && (
          <CardContent>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${isAutoSync ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                {isAutoSync ? 'Live monitoring active' : 'Manual sync only'}
              </div>
              <div>Last sync: {lastSync.toLocaleTimeString()}</div>
              {insights && (
                <Badge className="bg-hemp-primary/20 text-hemp-primary border-hemp-primary/40">
                  {insights.totalProducts} Products Live
                </Badge>
              )}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Store Insights */}
      {insights && (
        <div className="grid md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Package className="w-8 h-8 mx-auto mb-2 text-hemp-primary" />
              <div className="text-2xl font-bold">{insights.totalProducts}</div>
              <div className="text-sm text-muted-foreground">Total Products</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Leaf className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold text-green-600">{insights.hempProducts}</div>
              <div className="text-sm text-muted-foreground">100% Hemp Items</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Shirt className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-blue-600">{insights.polyesterProducts}</div>
              <div className="text-sm text-muted-foreground">Polyester + Embroidered</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-hemp-primary" />
              <div className="text-2xl font-bold capitalize">{insights.stockLevel}</div>
              <div className="text-sm text-muted-foreground">Stock Level</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Live Product Grid */}
      <div className="grid gap-4">
        <h3 className="text-lg font-semibold">Live Product Inventory</h3>
        {products.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <Card key={product.id} className="border-hemp-primary/10 hover:border-hemp-primary/20 transition-all">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-semibold text-sm">{product.name}</div>
                      <div className="text-lg font-bold text-hemp-primary">{product.price}</div>
                    </div>
                    {getMaterialIcon(product.material)}
                  </div>
                  
                  <div className="space-y-2">
                    <Badge className={`text-xs ${getMaterialColor(product.material)}`}>
                      {product.material}
                    </Badge>
                    
                    <div className="text-xs text-muted-foreground">
                      {product.category}
                    </div>
                    
                    {product.features.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {product.features.map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <div className="text-lg font-semibold mb-2">No Products Synced</div>
              <div className="text-muted-foreground mb-4">
                Click "Sync Now" to load real-time data from hempstar.store
              </div>
              <Button onClick={syncNow} disabled={isLoading}>
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Package className="w-4 h-4 mr-2" />
                )}
                Sync Store Data
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
