
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Crown, Brain, TrendingUp, BarChart3, Zap, Music, Store, Target } from 'lucide-react';

interface NavItem {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  {
    id: 'autonomous-ai',
    title: '🤖 Autonomous AI Empire',
    description: '24/7 AI doing campaigns, ads, marketing automatically',
    icon: Brain
  },
  {
    id: 'music-store',
    title: '🎵 Music & Store Dashboard',
    description: 'Spotify integration, sales, inventory management',
    icon: Music
  },
  {
    id: 'content-marketing',
    title: '📱 Content & Marketing',
    description: 'Social media, content creation, brand management',
    icon: Target
  },
  {
    id: 'analytics-traffic',
    title: '📊 Analytics & Traffic',
    description: 'Website analytics, traffic monitoring, performance',
    icon: BarChart3
  },
  {
    id: 'ai-tools',
    title: '🛠️ AI Tools & Setup',
    description: 'AI agent configuration, automation setup',
    icon: Zap
  },
  {
    id: 'automation-results',
    title: '📈 Automation Results',
    description: 'Live results from your autonomous AI systems',
    icon: TrendingUp
  }
];

interface AppNavDrawerProps {
  currentPage: string;
  onPageChange: (pageId: string) => void;
}

export const AppNavDrawer: React.FC<AppNavDrawerProps> = ({ currentPage, onPageChange }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className="fixed top-4 left-4 z-50 bg-hemp-primary/10 border-hemp-primary/20 hover:bg-hemp-primary/20 shadow-lg"
        >
          <Crown className="h-6 w-6 text-hemp-primary" />
        </Button>
      </SheetTrigger>
      
      <SheetContent side="left" className="w-80 bg-gradient-hemp">
        <SheetHeader className="pb-6">
          <SheetTitle className="text-2xl font-black text-hemp-dark flex items-center">
            <Crown className="w-8 h-8 mr-2 text-hemp-primary" />
            🌿 HEMP EMPIRE
          </SheetTitle>
          <p className="text-hemp-dark/70 text-sm">
            Navigate your autonomous business empire
          </p>
        </SheetHeader>
        
        <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start h-auto p-4 text-left ${
                  isActive 
                    ? 'bg-hemp-primary text-white shadow-lg' 
                    : 'hover:bg-hemp-primary/10 text-hemp-dark'
                }`}
                onClick={() => onPageChange(item.id)}
              >
                <div className="flex items-start space-x-3">
                  <IconComponent className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <div className="font-semibold text-sm leading-tight">
                      {item.title}
                    </div>
                    <div className={`text-xs mt-1 leading-tight ${
                      isActive ? 'text-white/80' : 'text-hemp-dark/60'
                    }`}>
                      {item.description}
                    </div>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-hemp-primary/10 rounded-lg">
          <div className="text-xs text-hemp-dark/70 text-center">
            <Crown className="w-4 h-4 inline mr-1" />
            <strong>Autonomous Mode:</strong> Your AI works 24/7
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
