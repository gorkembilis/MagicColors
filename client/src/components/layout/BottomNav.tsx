import { Link, useLocation } from "wouter";
import { Home, Palette, Puzzle, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

export function BottomNav() {
  const [location] = useLocation();
  const { t } = useI18n();

  const isActive = (path: string) => {
    return location === path || (path !== "/" && location.startsWith(path));
  };

  const isColoringActive = () => {
    const isHomeColoring = (location === "/" || location.startsWith("/?")) && !location.includes("tab=puzzle");
    return isHomeColoring ||
           location.includes("tab=coloring") ||
           location.startsWith("/pack") || 
           location.startsWith("/view") || 
           location.startsWith("/coloring") ||
           location.startsWith("/generate");
  };

  const isPuzzleActive = () => {
    return location.includes("tab=puzzle") || location.startsWith("/puzzle");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white/90 backdrop-blur-lg pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="flex h-16 items-center justify-around px-2">
        <Link
          href="/"
          className={cn(
            "flex flex-col items-center justify-center gap-1 p-2 transition-colors",
            isActive("/") && location === "/" ? "text-primary" : "text-muted-foreground hover:text-primary/70"
          )}
          data-testid="nav-home"
        >
          <Home className={cn("h-6 w-6", isActive("/") && location === "/" && "fill-current")} />
          <span className="text-[10px] font-bold">{t('nav.home')}</span>
        </Link>

        <Link
          href="/?tab=coloring"
          className={cn(
            "flex flex-col items-center justify-center gap-1 p-2 transition-colors",
            isColoringActive() ? "text-primary" : "text-muted-foreground hover:text-primary/70"
          )}
          data-testid="nav-coloring"
        >
          <Palette className={cn("h-6 w-6", isColoringActive() && "fill-current")} />
          <span className="text-[10px] font-bold">{t('nav.coloring')}</span>
        </Link>

        <Link
          href="/?tab=puzzle"
          className={cn(
            "flex flex-col items-center justify-center gap-1 p-2 transition-colors",
            isPuzzleActive() ? "text-primary" : "text-muted-foreground hover:text-primary/70"
          )}
          data-testid="nav-puzzles"
        >
          <Puzzle className={cn("h-6 w-6", isPuzzleActive() && "fill-current")} />
          <span className="text-[10px] font-bold">{t('nav.puzzles')}</span>
        </Link>

        <Link
          href="/profile"
          className={cn(
            "flex flex-col items-center justify-center gap-1 p-2 transition-colors",
            isActive("/profile") ? "text-primary" : "text-muted-foreground hover:text-primary/70"
          )}
          data-testid="nav-profile"
        >
          <User className={cn("h-6 w-6", isActive("/profile") && "fill-current")} />
          <span className="text-[10px] font-bold">{t('nav.profile')}</span>
        </Link>
      </div>
      {/* iPhone Home Indicator Spacer */}
      <div className="h-safe-bottom w-full bg-transparent" /> 
    </div>
  );
}
