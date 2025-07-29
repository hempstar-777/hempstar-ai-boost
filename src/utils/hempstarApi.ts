// HempStar Store Integration
export interface HempStarProduct {
  id: string;
  name: string;
  image: string;
  category: string;
  price?: string;
  description?: string;
}

// Mock function to simulate fetching real products from hempstar.store
export const fetchHempStarProducts = async (storeUrl: string): Promise<HempStarProduct[]> => {
  // In a real implementation, this would scrape or use an API
  // For now, we'll return realistic HempStar products
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "hemp-leaf-tee-black",
          name: "Hemp Leaf Embroidered Tee - Black",
          image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop",
          category: "T-Shirts",
          price: "$29.99",
          description: "Classic black tee with embroidered hemp leaf logo"
        },
        {
          id: "classic-hemp-hoodie",
          name: "Classic Hemp Logo Hoodie",
          image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop",
          category: "Hoodies",
          price: "$59.99",
          description: "Comfortable hoodie with HempStar branding"
        },
        {
          id: "hemp-culture-tank",
          name: "Hemp Culture Tank Top",
          image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=500&fit=crop",
          category: "Tank Tops",
          price: "$24.99",
          description: "Lightweight tank with hemp culture design"
        },
        {
          id: "streetwear-zip-hoodie",
          name: "Hemp Streetwear Zip Hoodie",
          image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop",
          category: "Hoodies",
          price: "$69.99",
          description: "Premium zip hoodie for street style"
        },
        {
          id: "hemp-beanie",
          name: "HempStar Organic Beanie",
          image: "https://images.unsplash.com/photo-1544966503-7e22ec0e1a3a?w=400&h=500&fit=crop",
          category: "Accessories",
          price: "$19.99",
          description: "Organic hemp fiber beanie with logo"
        },
        {
          id: "sustainability-tee",
          name: "Sustainability Awareness Tee",
          image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop",
          category: "T-Shirts",
          price: "$32.99",
          description: "Eco-friendly message tee"
        }
      ]);
    }, 1500); // Simulate API delay
  });
};

export const validateStoreUrl = (url: string): boolean => {
  // Simple validation for store URLs
  const validPatterns = [
    /^hempstar\.store$/i,
    /^.*\.myshopify\.com$/i,
    /^.*\.shopify\.com$/i,
    /^.*\.(com|net|org|store)$/i
  ];
  
  return validPatterns.some(pattern => pattern.test(url.replace(/^https?:\/\//, '')));
};