
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
  hash: string;
};

const navItems: NavItem[] = [
  { id: "music", label: "Music & Store", emoji: "🎵", hash: "#music" },
  { id: "content", label: "Content & Marketing", emoji: "📱", hash: "#content" },
  { id: "analytics", label: "Analytics & Traffic", emoji: "📊", hash: "#analytics" },
  { id: "tools", label: "AI Tools", emoji: "🤖", hash: "#tools" },
  { id: "results", label: "Autonomy Results", emoji: "🧠", hash: "#results" },
];

function navigateTo(hash: string) {
  if (typeof window === "undefined") return;
  if (window.location.hash === hash) {
    // Force hashchange for same-hash navigation
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  } else {
    window.location.hash = hash;
  }
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
            <SheetDescription>Browse all pages</SheetDescription>
          </SheetHeader>
        </div>

        <nav className="p-2 max-h-[calc(100svh-64px)] overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.id}>
                <SheetClose asChild>
                  <button
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-muted/60 transition-colors flex items-center gap-2"
                    onClick={() => navigateTo(item.hash)}
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
