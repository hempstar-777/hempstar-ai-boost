
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, contentType, brand, style } = await req.json();

    console.log('Generating content:', { contentType, brand, style });

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const systemPrompt = `You are a viral content creation expert specializing in sustainable streetwear and hemp fashion. You create content for ${brand}, a premium embroidered hemp streetwear brand that combines sustainability with street style.

Brand Identity:
- Premium hemp streetwear with custom embroidery
- Sustainable, eco-friendly, but still fire and trendy
- Target audience: Gen Z and Millennials who care about fashion AND the planet
- Tone: Confident, trendy, authentic, slightly rebellious
- Values: Sustainability, quality, street culture, artistic expression

Content Guidelines:
- Always mention hemp's benefits (durability, gets softer, eco-friendly)
- Highlight embroidery as wearable art
- Use street/urban language but keep it professional
- Include emojis strategically for social content
- Focus on the intersection of style and sustainability
- Make it shareable and engaging

Content Type: ${contentType}
Style Focus: ${style}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1500,
        temperature: 0.8,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('OpenAI API Error:', data);
      throw new Error(`OpenAI API error: ${data.error?.message || 'Unknown error'}`);
    }

    const content = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ 
        content,
        contentType,
        brand,
        generatedAt: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Content generation error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        fallback: true
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
