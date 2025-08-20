
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

type NavItem = {
  id: string;
  label: string;
  emoji?: string;
};

const navItems: NavItem[] = [
  { id: "section-dashboard", label: "Music & Store Dashboard", emoji: "🎵" },
  { id: "section-content", label: "Content & Marketing", emoji: "📱" },
  { id: "section-analytics", label: "Analytics & Traffic", emoji: "📊" },
  { id: "section-tools", label: "AI Tools", emoji: "🤖" },
];

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function AppNavDrawer() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Open navigation"
          className="h-10 w-10"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-[85vw] sm:w-[380px] p-0">
        <div className="border-b">
          <SheetHeader className="px-4 py-3">
            <SheetTitle className="text-base">Navigation</SheetTitle>
            <SheetDescription>Browse all sections</SheetDescription>
          </SheetHeader>
        </div>

        <nav className="p-2 max-h-[calc(100svh-64px)] overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.id}>
                <SheetClose asChild>
                  <button
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-muted/60 transition-colors flex items-center gap-2"
                    onClick={() => scrollToSection(item.id)}
                  >
                    <span className="text-lg">{item.emoji}</span>
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                </SheetClose>
              </li>
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export default AppNavDrawer;
