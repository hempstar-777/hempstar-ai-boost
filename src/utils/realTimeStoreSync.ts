
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
    console.log('🔄 Attempting to sync with hempstar.store (Wix)...');
    
    try {
      // This will be replaced with actual Wix API integration
      console.log('⚠️ Wix API connection not yet configured');
      console.log('Need Wix API credentials to fetch real product data');
      
      // For now, return empty array until Wix connection is established
      this.products = [];
      this.lastSync = new Date();
      this.isConnected = false;
      
      return this.products;

    } catch (error) {
      console.error('❌ Error connecting to Wix store:', error);
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
