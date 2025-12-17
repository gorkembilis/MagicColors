import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { Sparkles, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

interface MobileLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  headerTitle?: ReactNode;
  headerAction?: ReactNode;
  showBackButton?: boolean;
}

export function MobileLayout({ 
  children, 
  showHeader = true, 
  headerTitle,
  headerAction,
  showBackButton = false
}: MobileLayoutProps) {
  const [, setLocation] = useLocation();

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      setLocation("/");
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background pb-20">
      {showHeader && (
        <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md">
          <div className="flex items-center gap-2">
            {(showBackButton || headerTitle) && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="h-8 w-8 mr-1"
                data-testid="button-back"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            {!headerTitle && !showBackButton && (
              <>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                  <Sparkles className="h-5 w-5" />
                </div>
                <span className="text-lg font-bold tracking-tight text-foreground font-display">
                  Magic<span className="text-primary">Colors</span>
                </span>
              </>
            )}
            {headerTitle && (
              <span className="text-lg font-bold tracking-tight">{headerTitle}</span>
            )}
          </div>
          <div>
            {headerAction}
          </div>
        </header>
      )}
      
      <main className="flex-1 overflow-x-hidden">
        {children}
      </main>
      
      <BottomNav />
    </div>
  );
}
