import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Zap, TrendingUp, Globe, Brain } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen bg-gradient-dark overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-20">
        <img 
          src={heroImage} 
          alt="AI Marketing Dashboard" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-hemp-primary/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-hemp-accent/30 rounded-full blur-lg animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-hemp-primary/15 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-16 flex flex-col items-center text-center">
        {/* Badge */}
        <Badge className="mb-6 bg-hemp-primary/20 text-hemp-accent border-hemp-primary/40 hover:bg-hemp-primary/30 transition-all">
          <Zap className="w-4 h-4 mr-2" />
          AI-Powered Marketing Revolution
        </Badge>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-hemp bg-clip-text text-transparent leading-tight">
          EXPLODE YOUR
          <br />
          <span className="text-hemp-light">HEMP STREETWEAR</span>
          <br />
          WORLDWIDE
        </h1>

        {/* Subheading */}
        <p className="text-xl md:text-2xl text-hemp-light/80 mb-8 max-w-3xl leading-relaxed">
          Revolutionary AI marketing toolkit designed to drive massive traffic to 
          <span className="text-hemp-accent font-bold"> hempstar.store</span> and 
          dominate the global streetwear scene
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <Button size="lg" className="bg-hemp-primary hover:bg-hemp-accent text-hemp-dark font-bold px-8 py-4 text-lg animate-glow-pulse">
            Launch AI Marketing
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button variant="outline" size="lg" className="border-hemp-primary text-hemp-accent hover:bg-hemp-primary/10 px-8 py-4 text-lg">
            View Demo
          </Button>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl">
          <Card className="bg-card/40 backdrop-blur-sm border-hemp-primary/30 p-6 hover:bg-card/60 transition-all hover:shadow-lg hover:shadow-hemp-primary/20">
            <TrendingUp className="w-8 h-8 text-hemp-accent mb-4" />
            <h3 className="text-lg font-bold text-hemp-light mb-2">Traffic Explosion</h3>
            <p className="text-hemp-light/70 text-sm">AI-driven SEO and viral content generation to flood your site with visitors</p>
          </Card>
          
          <Card className="bg-card/40 backdrop-blur-sm border-hemp-primary/30 p-6 hover:bg-card/60 transition-all hover:shadow-lg hover:shadow-hemp-primary/20">
            <Globe className="w-8 h-8 text-hemp-accent mb-4" />
            <h3 className="text-lg font-bold text-hemp-light mb-2">Global Reach</h3>
            <p className="text-hemp-light/70 text-sm">Target hemp streetwear enthusiasts across all continents simultaneously</p>
          </Card>
          
          <Card className="bg-card/40 backdrop-blur-sm border-hemp-primary/30 p-6 hover:bg-card/60 transition-all hover:shadow-lg hover:shadow-hemp-primary/20">
            <Brain className="w-8 h-8 text-hemp-accent mb-4" />
            <h3 className="text-lg font-bold text-hemp-light mb-2">AI Everything</h3>
            <p className="text-hemp-light/70 text-sm">Content creation, image generation, analytics, and social media automation</p>
          </Card>
        </div>
      </div>
    </section>
  );
};