import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, Check, Sparkles, Star } from "lucide-react";
import { motion } from "framer-motion";

export function PremiumModal({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none shadow-2xl bg-background">
        <div className="relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 via-primary/10 to-accent/20 z-0" />
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-secondary/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />

          <div className="relative z-10 p-8 text-center">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-orange-400 shadow-xl"
            >
              <Crown className="h-10 w-10 text-white" />
            </motion.div>

            <DialogHeader>
              <DialogTitle className="text-center text-3xl font-extrabold tracking-tight mb-2">
                Unlock <span className="text-primary">Magic</span> Premium
              </DialogTitle>
              <p className="text-lg text-muted-foreground mx-auto max-w-md">
                Get unlimited access to all coloring packs and magical AI generations!
              </p>
            </DialogHeader>

            <div className="mt-8 grid gap-4 md:grid-cols-2 mb-8">
              <div className="rounded-2xl bg-white/50 p-4 text-left border border-white/60 shadow-sm">
                <h3 className="font-bold flex items-center gap-2 mb-2">
                  <Star className="h-5 w-5 text-secondary fill-secondary" /> Free
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> 4 Basic Packs</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> 3 AI Generations / day</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" /> Standard Quality</li>
                </ul>
              </div>
              <div className="rounded-2xl bg-white p-4 text-left border-2 border-secondary shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-secondary text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">RECOMMENDED</div>
                <h3 className="font-bold flex items-center gap-2 mb-2 text-foreground">
                  <Crown className="h-5 w-5 text-secondary fill-secondary" /> Premium
                </h3>
                <ul className="space-y-2 text-sm font-medium">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-secondary" /> Unlock All Packs (Princess, Space...)</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-secondary" /> Unlimited AI Magic</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-secondary" /> High-Res PDF Downloads</li>
                </ul>
              </div>
            </div>

            <Button size="lg" className="w-full text-lg font-bold h-14 rounded-xl bg-gradient-to-r from-secondary to-orange-400 hover:from-secondary/90 hover:to-orange-400/90 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
              Start 7-Day Free Trial <Sparkles className="ml-2 h-5 w-5" />
            </Button>
            <p className="mt-4 text-xs text-muted-foreground">
              Only $4.99/month after trial. Cancel anytime. No ads ever.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
