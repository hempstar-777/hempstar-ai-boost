import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const HEMPSTAR_API_KEY = Deno.env.get('HEMPSTAR_API_KEY');
    
    if (!HEMPSTAR_API_KEY) {
      throw new Error('HEMPSTAR_API_KEY not configured');
    }

    console.log('🔄 Fetching products from hempstar.store...');

    // Fetch products from HempStar API
    const response = await fetch('https://www.hempstar.store/_functions/api/products', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${HEMPSTAR_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('❌ HempStar API error:', response.status, response.statusText);
      throw new Error(`HempStar API error: ${response.status}`);
    }

    const products = await response.json();
    console.log(`✅ Successfully fetched ${products.length || 0} products`);

    return new Response(
      JSON.stringify({
        success: true,
        products: products,
        synced_at: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('❌ Sync error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
