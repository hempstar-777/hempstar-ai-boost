
import React, { useState } from 'react';
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
  // Make the Sheet controlled for reliability on mobile and various browsers
  const [open, setOpen] = useState(false);

  const handleNavClick = (id: string) => {
    console.log('[Nav] switching to page:', id);
    onPageChange(id);
    setOpen(false); // close drawer after selection
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {/* High-visibility floating crown button, fixed top-left */}
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label="Open navigation menu"
          onClick={() => setOpen(true)}
          className="
            fixed top-4 left-4 z-[1000]
            w-12 h-12 rounded-full
            bg-background/90 border border-hemp-primary/30
            text-hemp-primary shadow-xl backdrop-blur
            hover:bg-background
          "
        >
          <Crown className="h-6 w-6" />
        </Button>
      </SheetTrigger>

      {/* Left drawer with scrollable content */}
      <SheetContent
        side="left"
        className="w-[86vw] max-w-[320px] bg-gradient-hemp p-0"
      >
        <div className="p-6">
          <SheetHeader className="pb-4">
            <SheetTitle className="text-2xl font-black text-hemp-dark flex items-center">
              <Crown className="w-7 h-7 mr-2 text-hemp-primary" />
              🌿 HEMP EMPIRE
            </SheetTitle>
            <p className="text-hemp-dark/70 text-sm">
              Navigate your autonomous business empire
            </p>
          </SheetHeader>
        </div>

        <div className="px-4 pb-4">
          <div className="space-y-3 max-h-[calc(100vh-180px)] overflow-y-auto pr-1">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = currentPage === item.id;

              return (
                <Button
                  key={item.id}
                  variant={isActive ? 'default' : 'ghost'}
                  className={`w-full justify-start h-auto p-4 text-left ${
                    isActive
                      ? 'bg-hemp-primary text-white shadow-lg'
                      : 'hover:bg-hemp-primary/10 text-hemp-dark'
                  }`}
                  onClick={() => handleNavClick(item.id)}
                >
                  <div className="flex items-start space-x-3">
                    <IconComponent className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div className="text-left">
                      <div className="font-semibold text-sm leading-tight">
                        {item.title}
                      </div>
                      <div
                        className={`text-xs mt-1 leading-tight ${
                          isActive ? 'text-white/80' : 'text-hemp-dark/60'
                        }`}
                      >
                        {item.description}
                      </div>
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>

          <div className="mt-4 p-4 bg-hemp-primary/10 rounded-lg">
            <div className="text-xs text-hemp-dark/70 text-center">
              <Crown className="w-4 h-4 inline mr-1" />
              <strong>Autonomous Mode:</strong> Your AI works 24/7
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
