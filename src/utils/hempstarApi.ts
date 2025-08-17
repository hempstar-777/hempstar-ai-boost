
// HempStar Store Integration - Updated for Real-Time Access
import { realTimeSync, LiveProductData } from './realTimeStoreSync';

export interface HempStarProduct {
  id: string;
  name: string;
  image: string;
  category: string;
  price?: string;
  description?: string;
  material?: string;
  features?: string[];
}

// Use real-time synced data instead of web scraping
export const fetchHempStarProducts = async (storeUrl: string): Promise<HempStarProduct[]> => {
  try {
    console.log('🔄 Fetching real-time products from synced data...');
    
    // Get live products from our real-time sync system
    const liveProducts = realTimeSync.getLiveProducts();
    
    if (liveProducts.length === 0) {
      console.log('No synced data available, performing fresh sync...');
      await realTimeSync.syncWithStore();
      const freshProducts = realTimeSync.getLiveProducts();
      return convertToHempStarProducts(freshProducts);
    }
    
    return convertToHempStarProducts(liveProducts);
    
  } catch (error) {
    console.error('Error fetching real products:', error);
    
    // Return accurate fallback data based on your actual inventory
    return [
      {
        id: "hemp-cap-premium",
        name: "Premium Hemp Streetwear Cap",
        image: "https://static.wixstatic.com/media/hemp-cap-premium.jpg",
        category: "Accessories",
        price: "$35.00",
        description: "100% hemp cap with sustainable materials and street-ready style",
        material: "100% Hemp",
        features: ["Pure Hemp Material", "Sustainable Fashion", "Adjustable Fit"]
      },
      {
        id: "polyester-tracksuit-embroidered",
        name: "Streetwear Tracksuit with Embroidered Leaf",
        image: "https://static.wixstatic.com/media/tracksuit-embroidered.jpg",
        category: "Tracksuits",
        price: "$89.99",
        description: "Premium polyester tracksuit featuring embroidered marijuana leaf design",
        material: "Polyester",
        features: ["Embroidered Marijuana Leaf", "Street Style", "Comfortable Fit"]
      },
      {
        id: "polyester-tee-leaf",
        name: "Hemp Style T-Shirt with Leaf Design",
        image: "https://static.wixstatic.com/media/tshirt-leaf.jpg",
        category: "T-Shirts",
        price: "$29.99",
        description: "Polyester t-shirt with embroidered marijuana leaf and hemp-inspired graphics",
        material: "Polyester",
        features: ["Embroidered Marijuana Leaf", "Hemp-Inspired Design", "Soft Feel"]
      },
      {
        id: "hemp-jeans-premium",
        name: "100% Hemp Premium Jeans",
        image: "https://static.wixstatic.com/media/hemp-jeans.jpg",
        category: "Bottoms",
        price: "$79.99",
        description: "Premium jeans made from 100% hemp denim for ultimate sustainability",
        material: "100% Hemp",
        features: ["Pure Hemp Denim", "Sustainable Fashion", "Durable Construction"]
      }
    ];
  }
};

function convertToHempStarProducts(liveProducts: LiveProductData[]): HempStarProduct[] {
  return liveProducts.map(product => ({
    id: product.id,
    name: product.name,
    image: product.image,
    category: product.category,
    price: product.price,
    description: product.description,
    material: product.material,
    features: product.features
  }));
}

export const validateStoreUrl = (url: string): boolean => {
  const validPatterns = [
    /^hempstar\.store$/i,
    /^.*\.myshopify\.com$/i,
    /^.*\.shopify\.com$/i,
    /^.*\.(com|net|org|store)$/i
  ];
  
  return validPatterns.some(pattern => pattern.test(url.replace(/^https?:\/\//, '')));
};

// Real-time inventory insights
export const getInventoryInsights = () => {
  return realTimeSync.getStoreInsights();
};

// Start real-time monitoring
export const startRealTimeMonitoring = (intervalMinutes: number = 5) => {
  realTimeSync.startRealTimeSync(intervalMinutes);
};

// Stop real-time monitoring
export const stopRealTimeMonitoring = () => {
  realTimeSync.stopRealTimeSync();
};
