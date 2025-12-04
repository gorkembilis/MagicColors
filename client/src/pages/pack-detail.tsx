import { useRoute, Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { packs } from "@/lib/mock-data";
import { ArrowLeft, Lock, Printer, Crown } from "lucide-react";
import { motion } from "framer-motion";
import NotFound from "@/pages/not-found";
import { PremiumModal } from "@/components/premium-modal";

export default function PackDetail() {
  const [, params] = useRoute("/pack/:id");
  const packId = params?.id;
  const pack = packs.find(p => p.id === packId);

  if (!pack) return <NotFound />;

  // Mock images for the pack
  const images = Array.from({ length: pack.count }).map((_, i) => ({
    id: `${pack.id}-${i + 1}`,
    url: pack.cover, // Reusing cover for now
    title: `${pack.title} #${i + 1}`
  }));

  // Mock locked state (simulate user is on free plan)
  const isLocked = pack.isPremium; 

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
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
      
      <div className="container px-4 py-8 md:px-6">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Link href="/">
              <Button variant="ghost" className="mb-2 -ml-4 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Packs
              </Button>
            </Link>
            <h1 className="text-3xl font-extrabold md:text-4xl flex items-center gap-3">
              {pack.title}
              {pack.isPremium && <Crown className="h-8 w-8 text-secondary" />}
            </h1>
            <p className="text-muted-foreground">
              {pack.count} coloring pages ready to print
            </p>
          </div>

          {isLocked && (
            <Card className="bg-gradient-to-r from-secondary/20 to-orange-400/20 border-secondary/50 p-4 flex items-center gap-4">
              <div className="bg-secondary rounded-full p-2 text-white">
                <Crown className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-foreground">Premium Collection</p>
                <p className="text-xs text-muted-foreground">Unlock all {pack.count} pages</p>
              </div>
              <PremiumModal>
                <Button className="ml-auto bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold rounded-full">
                  Unlock Now
                </Button>
              </PremiumModal>
            </Card>
          )}
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
        >
          {images.map((image, idx) => (
            <motion.div key={image.id} variants={item}>
              {isLocked && idx > 1 ? (
                <PremiumModal>
                  <Card className={`group relative cursor-pointer overflow-hidden border-none shadow-sm transition-all hover:-translate-y-1 hover:shadow-md bg-white opacity-75`}>
                    <div className="aspect-[3/4] overflow-hidden">
                      <img 
                        src={image.url} 
                        alt={image.title}
                        className={`h-full w-full object-cover transition-all duration-500 group-hover:scale-110 blur-sm grayscale`}
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[2px]">
                        <div className="rounded-full bg-black/60 p-3 text-white backdrop-blur-md">
                          <Lock className="h-6 w-6" />
                        </div>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="truncate text-sm font-bold text-center">{image.title}</p>
                    </div>
                  </Card>
                </PremiumModal>
              ) : (
                <Link href={`/view/${image.id}?packId=${pack.id}`}>
                  <Card className={`group relative cursor-pointer overflow-hidden border-none shadow-sm transition-all hover:-translate-y-1 hover:shadow-md bg-white`}>
                    <div className="aspect-[3/4] overflow-hidden">
                      <img 
                        src={image.url} 
                        alt={image.title}
                        className={`h-full w-full object-cover transition-all duration-500 group-hover:scale-110 grayscale contrast-125`}
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-primary/20 opacity-0 transition-opacity group-hover:opacity-100">
                        <Button size="sm" className="rounded-full font-bold" variant="secondary">
                          <Printer className="mr-2 h-4 w-4" /> View
                        </Button>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="truncate text-sm font-bold text-center">{image.title}</p>
                    </div>
                  </Card>
                </Link>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
