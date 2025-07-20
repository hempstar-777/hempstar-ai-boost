import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Wand2, 
  Copy, 
  Download, 
  Share2, 
  Sparkles,
  Target,
  Globe,
  TrendingUp
} from "lucide-react";

const contentTypes = [
  { value: "social-post", label: "Viral Social Media Post" },
  { value: "seo-blog", label: "SEO Blog Article" },
  { value: "product-desc", label: "Product Description" },
  { value: "email-campaign", label: "Email Campaign" },
  { value: "ad-copy", label: "Advertisement Copy" },
  { value: "hashtags", label: "Trending Hashtags" }
];

const platforms = [
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "twitter", label: "Twitter/X" },
  { value: "facebook", label: "Facebook" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "youtube", label: "YouTube" }
];

export const ContentGenerator = () => {
  const [contentType, setContentType] = useState("");
  const [platform, setPlatform] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateContent = async () => {
    if (!contentType) {
      toast({
        title: "Select Content Type",
        description: "Please choose what type of content you want to generate",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI content generation
    setTimeout(() => {
      const sampleContent = {
        "social-post": `🔥 STREETWEAR REVOLUTION ALERT! 🔥

The hemp streetwear game just got DEADLY with HempStar! 🌿✨

Our polyester threads with embroidered hemp leaf designs are taking the streets by storm worldwide! 

🌍 Global shipping available
🔥 Limited edition drops
💯 Streetwear culture meets hemp vibes

Tag a friend who needs to level up their streetwear game! 👇

#HempStar #StreetWear #HempFashion #StreetStyle #LimitedEdition #GlobalFashion #HempLife #UrbanFashion #StreetCulture #FashionRevolution`,

        "seo-blog": `# The Ultimate Guide to Hemp Streetwear: Why HempStar is Leading the Global Revolution

## Introduction: The Rise of Hemp-Inspired Fashion

Hemp streetwear is exploding across the global fashion scene, and HempStar.store is at the forefront of this revolutionary movement. Our unique polyester garments featuring embroidered hemp leaf designs represent the perfect fusion of urban street culture and hemp appreciation.

## Why Hemp Streetwear is Taking Over

### Global Appeal and Cultural Significance
Hemp-inspired fashion resonates with diverse audiences worldwide, from streetwear enthusiasts to cannabis culture advocates. Our designs capture this zeitgeist perfectly.

### Quality That Speaks Volumes
While our garments are crafted from premium polyester for durability and comfort, the meticulously embroidered hemp leaf designs add authentic cultural significance that streetwear lovers crave.

### Worldwide Accessibility
HempStar.store ships globally, making our exclusive hemp streetwear accessible to fashion-forward individuals across all continents.

## The HempStar Difference

Our commitment to quality, authentic design, and global accessibility sets us apart in the competitive streetwear market. Every piece tells a story of urban culture meeting hemp appreciation.

## Conclusion

Join the global hemp streetwear revolution. Visit HempStar.store today and discover why fashion enthusiasts worldwide are choosing our unique designs to express their street style and hemp culture appreciation.`,

        "product-desc": `🔥 HEMP LEAF EMBROIDERED STREETWEAR TEE 🔥

PRODUCT FEATURES:
• Premium polyester construction for ultimate comfort & durability
• Meticulously embroidered hemp leaf design - NO cheap prints!
• Authentic streetwear cut and fit
• Available in multiple colorways
• Unisex sizing for universal appeal

WHY YOU NEED THIS:
✅ Stand out in the streetwear scene
✅ Rep hemp culture with style
✅ Premium quality that lasts
✅ Global shipping available
✅ Limited edition designs

PERFECT FOR:
• Street style enthusiasts
• Hemp culture advocates  
• Fashion-forward individuals
• Urban lifestyle lovers
• Collectors of unique streetwear

🌍 WORLDWIDE SHIPPING
📦 Fast processing & delivery
💯 100% satisfaction guaranteed

Order now before this limited edition sells out!`,

        "email-campaign": `Subject: 🔥 Your Hemp Streetwear Game is About to EXPLODE 🔥

Hey Streetwear Enthusiast,

The streets are talking, and they're all saying one thing: HempStar is THE name in hemp streetwear right now.

Our polyester threads with embroidered hemp leaf designs aren't just clothing - they're statements. Statements that you're ahead of the curve, that you appreciate both street culture and hemp vibes.

🌟 What Makes Us Different:
• Authentic embroidered designs (not cheap prints)
• Premium polyester for all-day comfort
• Global shipping to rep your style anywhere
• Limited edition drops you won't find elsewhere

🔥 Limited Time: Free worldwide shipping on orders over $75

The streetwear scene is evolving, and hemp culture is leading the charge. Don't get left behind.

Shop now at HempStar.store before your size sells out.

Stay Fresh,
The HempStar Team

P.S. Follow us for exclusive drops and streetwear inspo that'll keep you ahead of the trends.`,

        "ad-copy": `🌿 HEMP STREETWEAR REVOLUTION 🌿

Ready to DOMINATE the streetwear scene?

HempStar's embroidered hemp leaf designs on premium polyester are taking the global fashion world by storm!

✨ Premium Quality | 🌍 Worldwide Shipping | 🔥 Limited Editions

Join thousands of streetwear enthusiasts worldwide who rep HempStar.

👆 SHOP NOW - Limited Stock!`,

        "hashtags": `#HempStar #HempStreetWear #StreetWear #HempFashion #UrbanFashion #StreetStyle #HempLife #StreetCulture #FashionRevolution #GlobalFashion #LimitedEdition #StreetWearAddict #HempCulture #UrbanStyle #StreetWearCommunity #FashionForward #HempApparel #StreetWearDaily #GlobalStreetWear #HempVibes #UrbanWear #StreetFashion #HempClothing #StreetWearBrand #GlobalStyle #HempDesign #UrbanCulture #StreetWearTrends #HempStyle #FashionDrops`
      };

      setGeneratedContent(sampleContent[contentType] || "Generated content will appear here...");
      setIsGenerating(false);
      
      toast({
        title: "Content Generated!",
        description: "Your AI-powered content is ready to drive traffic to hempstar.store"
      });
    }, 2000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard"
    });
  };

  return (
    <section className="py-20 bg-card/20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-hemp-primary/20 text-hemp-accent border-hemp-primary/40">
            <Wand2 className="w-4 h-4 mr-2" />
            AI Content Generator
          </Badge>
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-foreground">
            CREATE VIRAL CONTENT
            <br />
            <span className="bg-gradient-hemp bg-clip-text text-transparent">
              IN SECONDS
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Generate high-converting content that drives massive traffic to hempstar.store
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Input Panel */}
          <Card className="p-8 bg-card/40 backdrop-blur-sm border-hemp-primary/20">
            <h3 className="text-2xl font-bold mb-6 text-foreground">Content Settings</h3>
            
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-foreground mb-3 block">Content Type</label>
                <Select value={contentType} onValueChange={setContentType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose content type" />
                  </SelectTrigger>
                  <SelectContent>
                    {contentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-3 block">Platform (Optional)</label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {platforms.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-3 block">
                  Custom Instructions (Optional)
                </label>
                <Textarea
                  placeholder="Add specific requirements, tone, or focus areas for your content..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <Button
                onClick={generateContent}
                disabled={isGenerating}
                className="w-full bg-hemp-primary hover:bg-hemp-accent text-hemp-dark font-bold py-4 text-lg"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="mr-2 w-5 h-5 animate-spin" />
                    Generating Content...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 w-5 h-5" />
                    Generate Content
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Output Panel */}
          <Card className="p-8 bg-card/40 backdrop-blur-sm border-hemp-primary/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-foreground">Generated Content</h3>
              {generatedContent && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={copyToClipboard}>
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="min-h-[400px] bg-muted/20 rounded-lg p-6 border border-hemp-primary/10">
              {generatedContent ? (
                <pre className="whitespace-pre-wrap text-sm text-foreground leading-relaxed">
                  {generatedContent}
                </pre>
              ) : (
                <div className="text-center text-muted-foreground py-20">
                  <Target className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Your generated content will appear here</p>
                  <p className="text-sm">Select content type and click generate</p>
                </div>
              )}
            </div>

            {generatedContent && (
              <div className="flex flex-wrap gap-2 mt-6">
                <Badge className="bg-hemp-primary/20 text-hemp-accent">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  High Converting
                </Badge>
                <Badge className="bg-hemp-primary/20 text-hemp-accent">
                  <Globe className="w-3 h-3 mr-1" />
                  Global Ready
                </Badge>
                <Badge className="bg-hemp-primary/20 text-hemp-accent">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI Optimized
                </Badge>
              </div>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
};