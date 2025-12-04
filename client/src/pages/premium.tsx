import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Crown, Check, Star, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function Premium() {
  return (
    <MobileLayout headerTitle="Premium Access">
      <div className="p-4 pb-8">
        {/* Header Banner */}
        <div className="rounded-3xl bg-gradient-to-br from-secondary via-orange-400 to-pink-500 p-6 text-white shadow-lg mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-white/20 blur-2xl" />
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-24 w-24 rounded-full bg-white/20 blur-2xl" />
          
          <div className="relative z-10 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm shadow-inner border border-white/30">
              <Crown className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold mb-2">Unlock Everything</h1>
            <p className="text-white/90 text-sm font-medium mb-6">
              Get unlimited access to all packs, AI tools, and remove all ads.
            </p>
            <Button className="w-full bg-white text-secondary font-extrabold rounded-xl h-12 shadow-lg hover:bg-white/90">
              Start 7-Day Free Trial
            </Button>
            <p className="mt-3 text-[10px] text-white/70">
              Then $4.99/month. Cancel anytime.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-4 mb-8">
          <h3 className="font-bold text-lg px-2">Why Go Premium?</h3>
          
          <Card className="p-4 border-none shadow-sm flex items-center gap-4 bg-white">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold">Unlimited AI Creation</h4>
              <p className="text-xs text-muted-foreground">Create as many custom pages as you want.</p>
            </div>
          </Card>

          <Card className="p-4 border-none shadow-sm flex items-center gap-4 bg-white">
            <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
              <Star className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold">Unlock All Packs</h4>
              <p className="text-xs text-muted-foreground">Princesses, Space, Superheroes & more.</p>
            </div>
          </Card>

          <Card className="p-4 border-none shadow-sm flex items-center gap-4 bg-white">
            <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
              <Check className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold">No More Ads</h4>
              <p className="text-xs text-muted-foreground">A completely distraction-free experience.</p>
            </div>
          </Card>
        </div>

        {/* Restore Purchase */}
        <div className="text-center">
          <Button variant="ghost" size="sm" className="text-muted-foreground text-xs">
            Restore Purchases
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
}
