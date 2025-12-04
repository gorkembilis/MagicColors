import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { Sparkles } from "lucide-react";

interface MobileLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  headerTitle?: ReactNode;
  headerAction?: ReactNode;
}

export function MobileLayout({ 
  children, 
  showHeader = true, 
  headerTitle,
  headerAction 
}: MobileLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background pb-20">
      {showHeader && (
        <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md">
          <div className="flex items-center gap-2">
            {!headerTitle && (
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
