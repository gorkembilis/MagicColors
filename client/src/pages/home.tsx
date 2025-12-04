import { useState } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { packs } from "@/lib/mock-data";
import { Wand2, Lock, ArrowRight } from "lucide-react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";

export default function Home() {
  const [, setLocation] = useLocation();
  const [prompt, setPrompt] = useState("");

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      setLocation(`/generate?prompt=${encodeURIComponent(prompt)}`);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <MobileLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-8 pb-12">
        <div className="text-center relative z-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight text-foreground">
              Create Your Own <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-accent">
                Coloring Pages
              </span>
            </h1>
          </motion.div>

          <motion.form 
            onSubmit={handleGenerate}
            className="relative mx-auto max-w-md mt-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="relative flex flex-col gap-3">
               <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Wand2 className="h-5 w-5" />
                </div>
                <Input 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Unicorn on the moon..." 
                  className="h-14 rounded-2xl border-2 border-border bg-white pl-12 pr-4 text-lg shadow-sm transition-all focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                />
               </div>
              <Button 
                type="submit" 
                size="lg" 
                className="w-full h-14 rounded-2xl bg-primary font-bold text-lg hover:bg-primary/90 shadow-md"
              >
                Create Magic ✨
              </Button>
            </div>
          </motion.form>
        </div>

        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 -z-10 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 -z-10 h-64 w-64 translate-x-1/2 translate-y-1/2 rounded-full bg-primary/20 blur-3xl" />
      </section>

      {/* Packs Section */}
      <section className="px-4 pb-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Explore Packs</h2>
            <p className="text-xs text-muted-foreground">Ready-to-print collections</p>
          </div>
          <Button variant="ghost" size="sm" className="h-8 text-xs font-bold text-primary px-2">
            View All <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 gap-3"
        >
          {packs.map((pack) => (
            <motion.div key={pack.id} variants={item}>
              <Link href={`/pack/${pack.id}`}>
                <Card className="group cursor-pointer overflow-hidden border-none shadow-sm transition-all hover:-translate-y-1 hover:shadow-md bg-white active:scale-95 duration-100">
                  <div className="relative aspect-square overflow-hidden rounded-t-xl">
                    <img 
                      src={pack.cover} 
                      alt={pack.title}
                      className="h-full w-full object-cover"
                    />
                    {pack.isPremium && (
                      <div className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-secondary backdrop-blur-sm">
                        <Lock className="h-3 w-3" />
                      </div>
                    )}
                    {!pack.isPremium && (
                      <div className="absolute right-2 top-2 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold text-secondary-foreground shadow-sm">
                        FREE
                      </div>
                    )}
                  </div>
                  <CardContent className="p-3">
                    <h3 className="mb-0.5 text-sm font-bold leading-none truncate">{pack.title}</h3>
                    <p className="text-[10px] text-muted-foreground">{pack.count} pages</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </MobileLayout>
  );
}
