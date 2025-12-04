import { Link } from "wouter";
import { Crown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PremiumModal } from "@/components/premium-modal";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/">
          <a className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Sparkles className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground font-display">
              Magic<span className="text-primary">Colors</span>
            </span>
          </a>
        </Link>

        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            className="hidden sm:flex border-2 border-primary/20 hover:border-primary/50 hover:bg-primary/5 text-primary font-bold rounded-full"
          >
            My Gallery
          </Button>
          
          <PremiumModal>
            <Button 
              className="bg-gradient-to-r from-secondary to-orange-400 hover:from-secondary/90 hover:to-orange-400/90 text-secondary-foreground font-bold rounded-full shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              <Crown className="mr-2 h-4 w-4" />
              Go Premium
            </Button>
          </PremiumModal>
        </div>
      </div>
    </nav>
  );
}
