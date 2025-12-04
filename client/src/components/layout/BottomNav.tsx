import { Link, useLocation } from "wouter";
import { Home, Wand2, Crown, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

export function BottomNav() {
  const [location] = useLocation();
  const { t } = useI18n();

  const isActive = (path: string) => {
    return location === path || (path !== "/" && location.startsWith(path));
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
        >
          <Home className={cn("h-6 w-6", isActive("/") && location === "/" && "fill-current")} />
          <span className="text-[10px] font-bold">{t('nav.home')}</span>
        </Link>

        <Link
          href="/generate"
          className={cn(
            "flex flex-col items-center justify-center gap-1 p-2 transition-colors",
            isActive("/generate") ? "text-primary" : "text-muted-foreground hover:text-primary/70"
          )}
        >
          <div className={cn(
            "rounded-full p-1 transition-all",
            isActive("/generate") ? "bg-primary/10" : ""
          )}>
            <Wand2 className={cn("h-6 w-6", isActive("/generate") && "text-primary")} />
          </div>
          <span className="text-[10px] font-bold">{t('nav.create')}</span>
        </Link>

        <Link
          href="/gallery"
          className={cn(
            "flex flex-col items-center justify-center gap-1 p-2 transition-colors",
            isActive("/gallery") ? "text-primary" : "text-muted-foreground hover:text-primary/70"
          )}
        >
          <ImageIcon className={cn("h-6 w-6", isActive("/gallery") && "fill-current")} />
          <span className="text-[10px] font-bold">{t('nav.gallery')}</span>
        </Link>

        <Link
          href="/premium"
          className={cn(
            "flex flex-col items-center justify-center gap-1 p-2 transition-colors",
            isActive("/premium") ? "text-secondary" : "text-muted-foreground hover:text-secondary/70"
          )}
        >
          <Crown className={cn("h-6 w-6", isActive("/premium") && "fill-current")} />
          <span className="text-[10px] font-bold">{t('nav.premium')}</span>
        </Link>
      </div>
      {/* iPhone Home Indicator Spacer */}
      <div className="h-safe-bottom w-full bg-transparent" /> 
    </div>
  );
}
