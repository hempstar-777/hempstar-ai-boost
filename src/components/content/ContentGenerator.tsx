
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Wand2, 
  Copy, 
  Download, 
  Share, 
  Sparkles,
  RefreshCw,
  ThumbsUp,
  TrendingUp
} from 'lucide-react';

const contentPrompts = {
  blog_post: [
    "Write a viral blog post about the future of sustainable streetwear and hemp fashion",
    "Create an engaging article about embroidery trends taking over street style",
    "Generate a comprehensive guide to choosing eco-friendly streetwear",
    "Write about the intersection of street art and embroidered fashion"
  ],
  social_media: [
    "Create 5 Instagram captions for embroidered hemp hoodies that will go viral",
    "Generate TikTok script ideas for showcasing embroidery processes",
    "Write Twitter threads about sustainable fashion that spark conversations",
    "Create engaging Facebook posts about streetwear sustainability"
  ],
  product_description: [
    "Write compelling product descriptions for premium hemp streetwear collection",
    "Create sales copy for limited edition embroidered hoodies",
    "Generate descriptions that highlight sustainability and style",
    "Write product copy that converts browsers into buyers"
  ],
  email_marketing: [
    "Create a welcome email sequence for new hempstar.store subscribers",
    "Generate abandoned cart recovery emails with hemp streetwear theme",
    "Write product launch emails for new embroidered collections",
    "Create seasonal marketing emails that drive sales"
  ],
  ad_copy: [
    "Generate high-converting Facebook ad copy for hemp streetwear",
    "Create Google Ads that target sustainable fashion keywords",
    "Write TikTok ad scripts for Gen Z streetwear audience",
    "Generate retargeting ad copy that brings customers back"
  ]
};

export const ContentGenerator = () => {
  const [contentType, setContentType] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateContent = async (prompt?: string) => {
    setIsGenerating(true);
    
    try {
      const selectedPrompt = prompt || customPrompt || getRandomPrompt();
      
      // Call OpenAI through Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: { 
          prompt: selectedPrompt,
          contentType: contentType || 'blog_post',
          brand: 'hempstar.store',
          style: 'streetwear embroidered hemp fashion'
        }
      });

      if (error) throw error;

      setGeneratedContent(data.content);
      
      toast({
        title: "🔥 Content Generated!",
        description: "Your viral content is ready to dominate the internet!",
      });
    } catch (error) {
      console.error('Content generation error:', error);
      
      // Fallback content generation
      setGeneratedContent(generateFallbackContent(customPrompt || getRandomPrompt()));
      
      toast({
        title: "Content Generated (Fallback)",
        description: "Generated amazing content using our backup system!",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getRandomPrompt = () => {
    const prompts = contentPrompts[contentType as keyof typeof contentPrompts] || contentPrompts.blog_post;
    return prompts[Math.floor(Math.random() * prompts.length)];
  };

  const generateFallbackContent = (prompt: string) => {
    const fallbackContent = {
      blog_post: `# The Hemp Revolution is Here: Why Embroidered Streetwear is Taking Over

The streets are speaking, and they're saying one thing loud and clear: sustainable fashion is the future. At hempstar.store, we're not just following trends – we're creating them.

## Why Hemp + Streetwear = Pure Fire 🔥

Hemp isn't just eco-friendly; it's the most durable, comfortable, and stylish material for modern streetwear. When you combine that with intricate embroidery and street-inspired designs, you get something revolutionary.

### The Embroidery Advantage

Our embroidered designs aren't just decoration – they're wearable art. Each piece tells a story, represents a movement, and makes a statement that fast fashion never could.

**Key Benefits:**
- 3x more durable than cotton
- Gets softer with every wash  
- Naturally antimicrobial
- Carbon negative production
- Unique embroidered designs

## Join the Movement

Ready to upgrade your wardrobe and your values? Visit hempstar.store and discover why hemp streetwear is the future of fashion.

*#SustainableFashion #HempWear #StreetStyle #EcoFriendly*`,

      social_media: `🔥 VIRAL SOCIAL MEDIA CONTENT FOR HEMPSTAR.STORE 🔥

📸 INSTAGRAM CAPTIONS:
1. "Your outfit should speak before you do. Our embroidered hemp hoodies are fluent in street style 💚 #HempWear #StreetStyle"

2. "Sustainable + Fire = Your new favorite hoodie. Hemp hits different when it's this fresh 🌱✨ #SustainableFashion"

3. "Fast fashion is so last season. Hemp streetwear is forever 🔄 Drop a 🔥 if you're ready to upgrade"

🎵 TIKTOK SCRIPTS:
- "POV: You found streetwear that doesn't destroy the planet"
- "Hemp vs Cotton durability test – the results will shock you"
- "Embroidery process that hits different"

🐦 TWITTER THREADS:
"Why hemp streetwear is about to explode: A thread 🧵
1/ Hemp grows faster than any other textile crop
2/ It gets softer with every wash (unlike cotton)
3/ Our embroidery adds art to sustainability..."`,

      product_description: `🔥 PREMIUM HEMP STREETWEAR COLLECTION 🔥

**ORGANIC HEMP EMBROIDERED HOODIE - URBAN LEGEND SERIES**

This isn't just a hoodie – it's a statement. Crafted from 100% organic hemp and featuring our signature street art embroidery, this piece represents the future of sustainable streetwear.

✨ **Why You Need This:**
- Premium hemp gets softer every wash
- Intricate embroidered designs that turn heads
- Zero harmful chemicals or synthetic materials
- Built to last decades, not seasons
- Ethically made with fair wages

🎯 **Perfect For:**
- Making a statement without saying a word
- Comfort that doesn't compromise your values  
- Standing out in a crowd of fast fashion
- Supporting sustainable street culture

**Limited Edition - Only 100 pieces made**

*Join the hemp revolution. Order now and be part of the movement.*`,

      email_marketing: `Subject: Welcome to the Hemp Revolution 🌱🔥

Hey Future-Forward Fashion Lover,

Welcome to hempstar.store – where sustainability meets street style in the most fire way possible.

You just joined a movement that's bigger than fashion. You're part of a community that believes looking good shouldn't cost the Earth.

**What makes us different?**
✅ 100% organic hemp (gets softer every wash)
✅ Hand-embroidered street art designs
✅ Zero fast fashion BS
✅ Built to last decades

**Your Welcome Bonus:** Use code HEMP20 for 20% off your first order

**What's Next?**
→ Check out our limited edition drops
→ Follow our embroidery process on social
→ Join 50k+ hemp heads changing fashion

Ready to upgrade your wardrobe AND your values?

Stay Fresh,
The HempStar Team

P.S. – Our next drop sells out in minutes. You're on the VIP list now 😉`,

      ad_copy: `🔥 HIGH-CONVERTING AD COPY FOR HEMPSTAR.STORE 🔥

**FACEBOOK/INSTAGRAM ADS:**

Headline: "Finally, Streetwear That Doesn't Suck for the Planet"
Text: "Tired of flimsy fast fashion? Our hemp streetwear gets better with age – literally. Premium materials + street art embroidery + zero guilt = your new favorite brand. Limited stock."
CTA: "Shop Hemp Streetwear"

**GOOGLE ADS:**

Headline: "Premium Hemp Streetwear | Embroidered Designs"
Description: "Sustainable streetwear that hits different. Organic hemp hoodies with custom embroidery. Free shipping on orders $75+."

**TIKTOK ADS:**

Hook: "This hoodie will last longer than your relationships"
Content: Quick cuts showing hemp durability, embroidery process, satisfied customers
CTA: "Get yours before we sell out (again)"

**RETARGETING:**

"Still thinking about that hemp hoodie? It's thinking about you too 👀 
10% off if you complete your order in the next 24 hours. Use code COMEBACK10"`
    };

    return fallbackContent[contentType as keyof typeof fallbackContent] || fallbackContent.blog_post;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard. Go make it viral! 🔥",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="border-hemp-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl font-black text-hemp-primary">
            <Wand2 className="w-8 h-8 mr-3" />
            AI Content Generator
          </CardTitle>
          <CardDescription className="text-lg font-semibold">
            Generate viral content that makes hempstar.store legendary across the internet
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold">Content Type</label>
              <Select value={contentType} onValueChange={setContentType}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose content type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blog_post">🔥 Viral Blog Posts</SelectItem>
                  <SelectItem value="social_media">📱 Social Media Fire</SelectItem>
                  <SelectItem value="product_description">🛍️ Product Descriptions</SelectItem>
                  <SelectItem value="email_marketing">📧 Email Marketing</SelectItem>
                  <SelectItem value="ad_copy">🎯 Ad Copy That Converts</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold">Custom Prompt (Optional)</label>
              <Textarea 
                placeholder="Enter your own content prompt or leave blank for AI suggestions..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="resize-none"
                rows={3}
              />
            </div>
          </div>

          {contentType && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs">Quick Prompts:</Badge>
                {contentPrompts[contentType as keyof typeof contentPrompts]?.slice(0, 2).map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => generateContent(prompt)}
                    disabled={isGenerating}
                    className="text-xs"
                  >
                    {prompt.substring(0, 40)}...
                  </Button>
                ))}
              </div>

              <Button 
                onClick={() => generateContent()}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-hemp-primary to-hemp-accent hover:from-hemp-accent hover:to-hemp-primary text-hemp-dark font-black text-lg py-6"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    GENERATING VIRAL CONTENT...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    GENERATE CONTENT THAT CONVERTS
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {generatedContent && (
        <Card className="border-hemp-accent/40">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center text-hemp-accent">
                <TrendingUp className="w-5 h-5 mr-2" />
                Generated Content Ready to Go Viral!
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
                <Button variant="outline" size="sm">
                  <Share className="w-4 h-4 mr-1" />
                  Share
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="bg-muted/30 rounded-lg p-6 max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm font-medium leading-relaxed">
                {generatedContent}
              </pre>
            </div>
            
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="flex items-center gap-4">
                <Badge className="bg-green-500/20 text-green-700 border-green-500/40">
                  <ThumbsUp className="w-3 h-3 mr-1" />
                  Ready to Convert
                </Badge>
                <Badge className="bg-hemp-primary/20 text-hemp-primary border-hemp-primary/40">
                  Viral Potential: HIGH 🔥
                </Badge>
              </div>
              
              <Button 
                onClick={() => generateContent()}
                variant="outline" 
                size="sm"
                disabled={isGenerating}
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Generate New
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
