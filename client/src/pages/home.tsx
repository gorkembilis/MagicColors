import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { packs } from "@/lib/mock-data";
import { Wand2, Lock, ArrowRight, Search } from "lucide-react";
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
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-16 pb-24 md:px-6 md:pt-24 lg:pt-32">
        <div className="mx-auto max-w-4xl text-center relative z-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-6 rounded-full bg-accent/10 px-4 py-1.5 text-sm font-bold text-accent-foreground hover:bg-accent/20 border-none">
              ✨ AI-Powered Magic for Kids
            </Badge>
            <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight md:text-6xl lg:text-7xl text-foreground">
              Turn Ideas into <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-accent">
                Coloring Pages
              </span>
            </h1>
            <p className="mb-10 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
              Type whatever you want to color, and watch our magic AI draw it for you in seconds!
            </p>
          </motion.div>

          <motion.form 
            onSubmit={handleGenerate}
            className="relative mx-auto max-w-2xl"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="relative flex items-center">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Wand2 className="h-6 w-6" />
              </div>
              <Input 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A unicorn eating ice cream on the moon..." 
                className="h-16 rounded-full border-2 border-border bg-white pl-14 pr-36 text-lg shadow-lg transition-all focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/20"
              />
              <Button 
                type="submit" 
                size="lg" 
                className="absolute right-2 top-2 bottom-2 rounded-full bg-primary font-bold text-lg hover:bg-primary/90 px-8"
              >
                Create
              </Button>
            </div>
          </motion.form>
        </div>

        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 -z-10 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 -z-10 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-primary/20 blur-3xl" />
      </section>

      {/* Packs Section */}
      <section className="container px-4 py-16 md:px-6">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Explore Packs</h2>
            <p className="text-muted-foreground">Ready-to-print collections for every interest</p>
          </div>
          <Button variant="ghost" className="hidden sm:flex font-bold text-primary">
            View All <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4"
        >
          {packs.map((pack) => (
            <motion.div key={pack.id} variants={item}>
              <Link href={`/pack/${pack.id}`}>
                <Card className="group cursor-pointer overflow-hidden border-none shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg bg-white">
                  <div className="relative aspect-square overflow-hidden rounded-t-xl">
                    <img 
                      src={pack.cover} 
                      alt={pack.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {pack.isPremium && (
                      <div className="absolute right-2 top-2 rounded-full bg-black/60 p-2 text-secondary backdrop-blur-sm">
                        <Lock className="h-4 w-4" />
                      </div>
                    )}
                    {!pack.isPremium && (
                      <div className="absolute right-2 top-2 rounded-full bg-secondary px-2 py-1 text-xs font-bold text-secondary-foreground shadow-sm">
                        FREE
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="mb-1 text-lg font-bold leading-none">{pack.title}</h3>
                    <p className="text-sm text-muted-foreground">{pack.count} pages</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
