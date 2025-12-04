import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Download, Printer, Share2, ArrowLeft, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Generator() {
  const [location, setLocation] = useLocation();
  const [status, setStatus] = useState<'generating' | 'complete'>('generating');
  const [progress, setProgress] = useState(0);
  
  // Parse prompt from URL
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
          return prev + 2; // 5 seconds approx
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [status]);

  // Mock generated image (using one of our assets but pretending it's new)
  // In a real app, this would be the AI output
  const resultImage = "https://images.unsplash.com/photo-1535591273668-578e31182c4f?q=80&w=1000&auto=format&fit=crop"; // Using a generic image for now, could use local assets too

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container max-w-4xl px-4 py-8">
        <Button 
          variant="ghost" 
          className="mb-6 pl-0 hover:bg-transparent text-muted-foreground hover:text-foreground"
          onClick={() => setLocation("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Button>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Left Column: Visualization */}
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-white shadow-xl border-4 border-white">
            {status === 'generating' ? (
              <div className="flex h-full flex-col items-center justify-center bg-muted/30 p-8 text-center">
                <div className="relative mb-8 h-32 w-32">
                  <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
                  <div className="absolute inset-4 rounded-full bg-primary/10" />
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-white shadow-sm">
                    <Sparkles className="h-12 w-12 animate-pulse text-primary" />
                  </div>
                </div>
                <h3 className="mb-2 text-2xl font-bold text-primary animate-pulse">Creating Magic...</h3>
                <p className="text-muted-foreground font-medium">"{prompt}"</p>
                
                <div className="mt-8 w-full max-w-xs">
                  <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                    <div 
                      className="h-full bg-primary transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs font-bold text-muted-foreground text-right">{progress}%</p>
                </div>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative h-full w-full group"
              >
                <img 
                  src={resultImage} 
                  alt="Generated coloring page" 
                  className="h-full w-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-8">
                  <p className="text-white font-bold bg-black/20 backdrop-blur-md px-4 py-2 rounded-full">Preview Color</p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column: Controls */}
          <div className="flex flex-col justify-center">
            <div className="mb-8">
              <h1 className="mb-2 text-3xl font-extrabold text-foreground md:text-4xl">
                {status === 'generating' ? "Wait for it..." : "It's Ready!"}
              </h1>
              <p className="text-lg text-muted-foreground">
                {status === 'generating' 
                  ? "Our AI artist is sketching your request. This will just take a moment." 
                  : "Here is your custom coloring page based on your prompt."}
              </p>
            </div>

            {status === 'complete' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <Card className="p-4 border-primary/20 bg-primary/5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-primary shadow-sm">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-primary">Prompt Used</p>
                      <p className="text-sm font-medium text-foreground line-clamp-1">{prompt}</p>
                    </div>
                  </div>
                </Card>

                <div className="grid grid-cols-2 gap-3">
                  <Button size="lg" className="w-full gap-2 rounded-xl font-bold" variant="outline">
                    <Download className="h-4 w-4" /> PDF
                  </Button>
                  <Button size="lg" className="w-full gap-2 rounded-xl font-bold bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                    <Printer className="h-4 w-4" /> Print
                  </Button>
                </div>
                
                <Button size="lg" variant="ghost" className="w-full gap-2 font-bold text-muted-foreground hover:text-foreground">
                  <Share2 className="h-4 w-4" /> Share with friends
                </Button>

                <div className="mt-8 border-t pt-8">
                  <h3 className="mb-4 font-bold">Not quite right?</h3>
                  <Button 
                    variant="secondary" 
                    className="w-full rounded-xl bg-muted hover:bg-muted/80 text-foreground"
                    onClick={() => setStatus('generating')}
                  >
                    Try Again (Regenerate)
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
