
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Image, 
  MessageSquare, 
  Mail, 
  ShoppingBag, 
  Zap,
  TrendingUp,
  Target
} from 'lucide-react';

const contentTypes = [
  {
    icon: FileText,
    title: "Viral Blog Posts",
    description: "AI-generated articles about streetwear trends, embroidery techniques, and hemp fashion",
    impact: "300% SEO traffic boost",
    color: "hemp-primary",
    status: "VIRAL",
    samples: ["The Future of Embroidered Streetwear", "Why Hemp is Taking Over Fashion", "Street Style Meets Sustainability"]
  },
  {
    icon: MessageSquare,
    title: "Social Media Fire",
    description: "Instagram captions, TikTok scripts, and Twitter posts that make your brand unforgettable",
    impact: "500% engagement explosion",
    color: "hemp-accent",
    status: "TRENDING",
    samples: ["Embroidered hoodies that speak your language 🔥", "Hemp streetwear > everything else", "When your fit is sustainable AND fire 💚"]
  },
  {
    icon: ShoppingBag,
    title: "Product Descriptions That Sell",
    description: "Compelling product copy that turns browsers into buyers for every embroidered piece",
    impact: "250% conversion increase",
    color: "hemp-primary",
    status: "CONVERTING",
    samples: ["Premium Hemp Hoodie - Luxury Meets Sustainability", "Street Art Embroidery Tee - Wearable Rebellion", "Organic Cotton Streetwear - Future of Fashion"]
  },
  {
    icon: Mail,
    title: "Email Sequences",
    description: "Automated email campaigns that nurture leads and drive repeat purchases",
    impact: "400% email revenue",
    color: "hemp-accent",
    status: "PERSUASIVE",
    samples: ["Welcome to the Hemp Revolution", "Your Cart is Waiting (But Not for Long)", "Exclusive Drop: Limited Edition Embroidered Collection"]
  },
  {
    icon: Image,
    title: "Visual Content Ideas",
    description: "Creative concepts for photoshoots, graphics, and video content to showcase your designs",
    impact: "600% visual engagement",
    color: "hemp-primary",
    status: "CREATIVE",
    samples: ["Street Photography with Hemp Wear", "Embroidery Process Time-lapse", "Sustainable Fashion Lifestyle Shots"]
  },
  {
    icon: Target,
    title: "Ad Copy Domination",
    description: "High-converting Facebook, Google, and TikTok ad copy that brings in customers",
    impact: "350% ad performance",
    color: "hemp-accent",
    status: "PROFITABLE",
    samples: ["Stop Fast Fashion. Start Hemp Fashion.", "Embroidered Dreams, Delivered.", "Streetwear That Doesn't Destroy Streets"]
  }
];

export const ContentTypes = () => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {contentTypes.map((type, index) => (
        <Card key={index} className="group border-hemp-primary/20 hover:border-hemp-primary/60 transition-all duration-300 hover:shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <div className={`w-12 h-12 bg-${type.color}/20 rounded-xl flex items-center justify-center group-hover:animate-pulse`}>
                <type.icon className={`w-6 h-6 text-${type.color}`} />
              </div>
              <Badge className={`bg-${type.color}/20 text-${type.color} border-${type.color}/40 font-black animate-pulse`}>
                {type.status}
              </Badge>
            </div>
            
            <CardTitle className="text-lg">{type.title}</CardTitle>
            <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-700 border-green-500/40 font-black w-fit">
              {type.impact}
            </Badge>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <p className="text-muted-foreground font-medium">{type.description}</p>
            
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-hemp-dark">Sample Content:</h4>
              {type.samples.map((sample, sampleIndex) => (
                <div key={sampleIndex} className="flex items-start text-sm text-muted-foreground bg-muted/30 p-2 rounded">
                  <Zap className="w-3 h-3 text-hemp-accent mr-2 mt-0.5 flex-shrink-0" />
                  {sample}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
