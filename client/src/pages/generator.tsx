import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Printer, Share2, ArrowLeft, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Generator() {
  const [location, setLocation] = useLocation();
  const [status, setStatus] = useState<'generating' | 'complete'>('generating');
  const [progress, setProgress] = useState(0);
  
  const params = new URLSearchParams(window.location.search);
  const prompt = params.get("prompt") || "A magical surprise";

  useEffect(() => {
    if (status === 'generating') {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setStatus('complete');
            return 100;
          }
          return prev + 2; 
        });
      }, 80); // Slightly faster for mobile feel
      return () => clearInterval(interval);
    }
  }, [status]);

  const resultImage = "https://images.unsplash.com/photo-1535591273668-578e31182c4f?q=80&w=1000&auto=format&fit=crop";

  return (
    <MobileLayout showHeader={false}>
      <div className="flex flex-col min-h-[calc(100vh-80px)] p-4">
        <Button 
          variant="ghost" 
          size="sm"
          className="self-start mb-4 pl-0 text-muted-foreground"
          onClick={() => setLocation("/")}
        >
          <ArrowLeft className="mr-1 h-4 w-4" /> Back
        </Button>

        <div className="flex-1 flex flex-col">
          {/* Image Area */}
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-white shadow-xl border-4 border-white mb-6">
            {status === 'generating' ? (
              <div className="flex h-full flex-col items-center justify-center bg-muted/30 p-8 text-center">
                <div className="relative mb-6 h-24 w-24">
                  <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
                  <div className="absolute inset-4 rounded-full bg-primary/10" />
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-white shadow-sm">
                    <Sparkles className="h-10 w-10 animate-pulse text-primary" />
                  </div>
                </div>
                <h3 className="mb-2 text-xl font-bold text-primary animate-pulse">Creating Magic...</h3>
                
                <div className="mt-6 w-full max-w-[200px]">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div 
                      className="h-full bg-primary transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full w-full"
              >
                <img 
                  src={resultImage} 
                  alt="Generated coloring page" 
                  className="h-full w-full object-cover grayscale contrast-125"
                />
              </motion.div>
            )}
          </div>

          {/* Controls */}
          <div className="mt-auto">
            {status === 'complete' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <div className="grid grid-cols-2 gap-3">
                  <Button size="lg" className="w-full h-12 rounded-xl font-bold" variant="outline">
                    <Download className="h-4 w-4 mr-2" /> Save PDF
                  </Button>
                  <Button size="lg" className="w-full h-12 rounded-xl font-bold bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                    <Printer className="h-4 w-4 mr-2" /> Print
                  </Button>
                </div>
                
                <Button size="lg" variant="ghost" className="w-full h-12 font-bold text-muted-foreground">
                  <Share2 className="h-4 w-4 mr-2" /> Share
                </Button>

                <Button 
                  variant="secondary" 
                  size="sm"
                  className="w-full mt-4 rounded-lg bg-muted text-muted-foreground h-10"
                  onClick={() => setStatus('generating')}
                >
                  Try Again (Regenerate)
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
