import { useLocation } from "wouter";
import { Home, Palette, Puzzle, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

export function BottomNav() {
  const [location, setLocation] = useLocation();
  const { t } = useI18n();

  const getTabFromUrl = () => {
    if (typeof window === 'undefined') return null;
    return new URLSearchParams(window.location.search).get('tab');
  };

  const isHomeActive = location === "/" && !getTabFromUrl();
  
  const isColoringActive = 
    getTabFromUrl() === "coloring" ||
    location.startsWith("/pack") || 
    location.startsWith("/view") || 
    location.startsWith("/coloring") ||
    location.startsWith("/generate");

  const isPuzzleActive = 
    getTabFromUrl() === "puzzle" || 
    location.startsWith("/puzzle");

  const isProfileActive = location.startsWith("/profile");

  const NavItem = ({ 
    active, 
    icon: Icon, 
    label, 
    href,
    testId 
  }: {
    active: boolean;
    icon: typeof Home;
    label: string;
    href: string;
    testId: string;
  }) => (
    <a
      href={href}
      className={cn(
        "flex flex-col items-center justify-center gap-0.5 p-2 transition-all relative min-w-[60px]",
        active ? "text-primary" : "text-gray-400 hover:text-primary/70"
      )}
      data-testid={testId}
    >
      {active && (
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-full" />
      )}
      <div className={cn(
        "p-1.5 rounded-xl transition-all",
        active ? "bg-primary/10" : ""
      )}>
        <Icon className={cn("h-6 w-6", active && "fill-primary/20")} />
      </div>
      <span className={cn("text-[10px] font-bold", active && "text-primary")}>{label}</span>
    </a>
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white/95 backdrop-blur-lg pb-safe shadow-[0_-4px_12px_-1px_rgba(0,0,0,0.1)]">
      <div className="flex h-16 items-center justify-around px-2">
        <NavItem 
          active={isHomeActive}
          icon={Home}
          label={t('nav.home')}
          href="/"
          testId="nav-home"
        />
        <NavItem 
          active={isColoringActive}
          icon={Palette}
          label={t('nav.coloring')}
          href="/?tab=coloring"
          testId="nav-coloring"
        />
        <NavItem 
          active={isPuzzleActive}
          icon={Puzzle}
          label={t('nav.puzzles')}
          href="/?tab=puzzle"
          testId="nav-puzzles"
        />
        <NavItem 
          active={isProfileActive}
          icon={User}
          label={t('nav.profile')}
          href="/profile"
          testId="nav-profile"
        />
      </div>
      <div className="h-safe-bottom w-full bg-transparent" /> 
    </div>
  );
}
