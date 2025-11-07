
export interface LiveProductData {
  id: string;
  name: string;
  material: string;
  description: string;
  price: string;
  inStock: boolean;
  category: string;
  features: string[];
  image: string;
  realSales?: number;
  realViews?: number;
  lastUpdated: string;
}

export interface StoreInsights {
  totalProducts: number;
  hempProducts: number;
  polyesterProducts: number;
  stockLevel: 'high' | 'medium' | 'low';
  topSellingItems: string[];
  recentChanges: string[];
  connectionStatus: 'connected' | 'connecting' | 'error';
  lastSync: string;
}

export class RealTimeStoreSync {
  private static instance: RealTimeStoreSync;
  private products: LiveProductData[] = [];
  private lastSync: Date | null = null;
  private syncInterval: NodeJS.Timeout | null = null;
  private isConnected: boolean = false;

  static getInstance(): RealTimeStoreSync {
    if (!RealTimeStoreSync.instance) {
      RealTimeStoreSync.instance = new RealTimeStoreSync();
    }
    return RealTimeStoreSync.instance;
  }

  async syncWithWixStore(): Promise<LiveProductData[]> {
    console.log('🔄 Syncing with hempstar.store...');
    
    try {
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(`${SUPABASE_URL}/functions/v1/sync-hempstar-store`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Sync failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.products) {
        // Map HempStar products to our internal format
        this.products = data.products.map((product: any) => ({
          id: product.id || product._id,
          name: product.name || product.title,
          material: product.material || 'Hemp',
          description: product.description || '',
          price: product.price || '$0.00',
          inStock: product.inStock !== false,
          category: product.category || 'Apparel',
          features: product.features || [],
          image: product.image || product.images?.[0] || '',
          realSales: product.sales || 0,
          realViews: product.views || 0,
          lastUpdated: new Date().toISOString(),
        }));
        
        this.lastSync = new Date();
        this.isConnected = true;
        console.log(`✅ Successfully synced ${this.products.length} products`);
      } else {
        throw new Error('Invalid response format');
      }
      
      return this.products;

    } catch (error) {
      console.error('❌ Error syncing with HempStar store:', error);
      this.isConnected = false;
      throw error;
    }
  }

  // Legacy method for backward compatibility
  async syncWithStore(): Promise<LiveProductData[]> {
    return await this.syncWithWixStore();
  }

  getStoreInsights(): StoreInsights {
    const hempProducts = this.products.filter(p => p.material.toLowerCase().includes('hemp')).length;
    const polyesterProducts = this.products.filter(p => p.material.toLowerCase().includes('polyester')).length;
    
    return {
      totalProducts: this.products.length,
      hempProducts,
      polyesterProducts,
      stockLevel: this.products.length > 10 ? 'high' : this.products.length > 5 ? 'medium' : 'low',
      topSellingItems: this.products.slice(0, 3).map(p => p.name),
      recentChanges: this.isConnected ? 
        [`Last sync: ${this.lastSync?.toLocaleString()}`] : 
        ['Wix API connection needed', 'No real product data available'],
      connectionStatus: this.isConnected ? 'connected' : 'error',
      lastSync: this.lastSync?.toLocaleString() || 'Never'
    };
  }

  startRealTimeSync(intervalMinutes: number = 5): void {
    console.log(`🚀 Starting real-time Wix sync every ${intervalMinutes} minutes`);
    
    // Initial sync attempt
    this.syncWithWixStore();
    
    // Set up interval for continuous sync
    this.syncInterval = setInterval(() => {
      this.syncWithWixStore();
    }, intervalMinutes * 60 * 1000);
  }

  stopRealTimeSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      console.log('⏹️ Stopped real-time sync');
    }
  }

  getLiveProducts(): LiveProductData[] {
    return this.products;
  }

  getLastSyncTime(): Date | null {
    return this.lastSync;
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

// Export singleton instance
export const realTimeSync = RealTimeStoreSync.getInstance();
