// src/lib/hivemind.ts

const HIVEMIND_URL = 'http://localhost:8080';

interface HiveMindEvent {
  action: string;
  data: any;
}

async function sendToHiveMind(event: HiveMindEvent) {
  try {
    const response = await fetch(`${HIVEMIND_URL}/api/events/publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'user_action',
        source: 'lovable-hempstar',
        data: {
          action: event.action,
          ...event.data,
          timestamp: new Date().toISOString(),
        },
      }),
    });
    
    const result = await response.json();
    console.log('✅ HiveMind event sent:', result);
    return result;
  } catch (error) {
    console.error('❌ HiveMind error:', error);
    return { success: false, error };
  }
}

// Easy-to-use helper functions
export const hivemind = {
  // Track when someone places an order
  trackOrder: async (orderData: {
    order_id: string;
    user_id: string;
    amount: number;
    items: any[];
  }) => {
    return sendToHiveMind({
      action: 'order_placed',
      data: orderData,
    });
  },

  // Track when someone signs up
  trackSignup: async (userData: {
    user_id: string;
    email: string;
  }) => {
    return sendToHiveMind({
      action: 'user_signup',
      data: userData,
    });
  },

  // Track when someone views a product
  trackProductView: async (productId: string, userId: string) => {
    return sendToHiveMind({
      action: 'product_viewed',
      data: { product_id: productId, user_id: userId },
    });
  },

  // Track when cart is updated
  trackCartUpdate: async (cartData: {
    user_id: string;
    items_count: number;
    total: number;
  }) => {
    return sendToHiveMind({
      action: 'cart_updated',
      data: cartData,
    });
  },

  // Register the Lovable app with HiveMind
  registerApp: async () => {
    try {
      const response = await fetch(`${HIVEMIND_URL}/api/apps/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: 'lovable-hempstar',
          name: 'Hempstar Store (Lovable)',
          type: 'web',
          version: '1.0.0',
          capabilities: ['ecommerce', 'products', 'orders'],
        }),
      });
      
      const result = await response.json();
      console.log('✅ Registered with HiveMind:', result);
      return result;
    } catch (error) {
      console.error('❌ Registration failed:', error);
      return { success: false, error };
    }
  },
};
