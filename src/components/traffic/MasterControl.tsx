
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Zap, 
  Crown, 
  Flame,
  Rocket
} from 'lucide-react';

interface MasterControlProps {
  onMasterLaunch: () => void;
  isDeploying: boolean;
}

export const MasterControl = ({ onMasterLaunch, isDeploying }: MasterControlProps) => {
  return (
    <Card className="border-hemp-primary/60 bg-gradient-to-br from-hemp-primary/20 to-hemp-accent/20 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-r from-hemp-primary/10 via-transparent to-hemp-accent/10 animate-pulse"></div>
      <CardContent className="text-center py-16 relative z-10">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Crown className="w-20 h-20 text-hemp-primary animate-bounce" />
            <Flame className="w-8 h-8 text-hemp-accent absolute -top-2 -right-2 animate-pulse" />
          </div>
        </div>
        
        <h3 className="text-4xl font-black mb-4 bg-gradient-to-r from-hemp-primary to-hemp-accent bg-clip-text text-transparent">
          MASTER TRAFFIC DOMINATION
        </h3>
        
        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto font-semibold">
          Deploy ALL traffic engines simultaneously and watch hempstar.store EXPLODE across the internet! 
          Turn your embroidered streetwear into the most talked-about brand online!
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
          <div className="bg-hemp-dark/10 rounded-lg p-4">
            <div className="text-2xl font-black text-hemp-primary">∞</div>
            <div className="text-sm text-muted-foreground">Traffic Sources</div>
          </div>
          <div className="bg-hemp-dark/10 rounded-lg p-4">
            <div className="text-2xl font-black text-hemp-accent">24/7</div>
            <div className="text-sm text-muted-foreground">Auto Marketing</div>
          </div>
          <div className="bg-hemp-dark/10 rounded-lg p-4">
            <div className="text-2xl font-black text-green-600">∞%</div>
            <div className="text-sm text-muted-foreground">ROI Explosion</div>
          </div>
        </div>
        
        <Button 
          size="lg"
          onClick={onMasterLaunch}
          disabled={isDeploying}
          className="bg-gradient-to-r from-hemp-primary via-hemp-accent to-hemp-primary hover:from-hemp-accent hover:via-hemp-primary hover:to-hemp-accent text-hemp-dark font-black px-16 py-6 text-xl animate-pulse hover:animate-bounce transition-all duration-300 shadow-2xl hover:shadow-hemp-primary/50"
        >
          {isDeploying ? (
            <>
              <div className="animate-spin w-6 h-6 border-3 border-hemp-dark border-t-transparent rounded-full mr-3"></div>
              CONQUERING THE INTERNET...
            </>
          ) : (
            <>
              <Rocket className="mr-3 w-6 h-6" />
              ACTIVATE INTERNET DOMINATION
              <Zap className="ml-3 w-6 h-6" />
            </>
          )}
        </Button>
        
        <p className="mt-4 text-sm text-muted-foreground font-medium">
          Warning: This will make hempstar.store LEGENDARY! 🔥
        </p>
      </CardContent>
    </Card>
  );
};
