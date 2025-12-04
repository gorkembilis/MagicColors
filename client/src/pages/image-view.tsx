import { useRoute, Link } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { packs } from "@/lib/mock-data";
import { ArrowLeft, Printer, Download, Share2, Check, X } from "lucide-react";
import { motion } from "framer-motion";
import NotFound from "@/pages/not-found";
import { useState } from "react";

function AdBanner() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  
  return (
    <div className="bg-gray-100 border border-gray-300 p-4 rounded-lg text-center relative mb-6">
      <button 
        onClick={() => setVisible(false)}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
      >
        <X className="h-4 w-4" />
      </button>
      <p className="text-xs font-bold text-gray-500 mb-1">ADVERTISEMENT</p>
      <div className="h-24 bg-white w-full flex items-center justify-center text-gray-400 border border-dashed border-gray-300 rounded">
        Toy Advertisement Here
      </div>
      <p className="text-xs text-gray-400 mt-2">
        <Link href="/premium"><span className="underline cursor-pointer">Remove Ads with Premium</span></Link>
      </p>
    </div>
  );
}

export default function ImageView() {
  const [, params] = useRoute("/view/:id");
  const imageId = params?.id;
  
  // Parse packId from query params if available, or try to deduce
  const packId = imageId?.split("-")[0];
  const pack = packs.find(p => p.id === packId);
  
  if (!imageId || !pack) return <NotFound />;

  const imageUrl = pack.cover; // Reusing cover
  const title = `${pack.title} - Page ${imageId.split("-")[1]}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container max-w-5xl px-4 py-8">
        <div className="mb-6">
          <Link href={`/pack/${packId}`}>
            <Button variant="ghost" className="pl-0 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to {pack.title}
            </Button>
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Image Area */}
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-white shadow-xl border border-border print:shadow-none print:border-none"
            >
              <img 
                src={imageUrl} 
                alt={title}
                className="h-full w-full object-contain p-4 grayscale contrast-125 print:p-0"
              />
              
              <div className="absolute bottom-4 right-4 flex gap-2 print:hidden">
                <Button 
                  size="icon" 
                  variant="secondary" 
                  className="rounded-full shadow-lg h-12 w-12"
                  onClick={handlePrint}
                >
                  <Printer className="h-6 w-6" />
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Sidebar Controls - Hidden when printing */}
          <div className="space-y-6 print:hidden">
            <div>
              <h1 className="text-2xl font-extrabold mb-2">{title}</h1>
              <p className="text-muted-foreground">Ready to print on A4 or Letter size paper.</p>
            </div>

            {/* Ad Banner for "Free" users */}
            {!pack.isPremium && <AdBanner />}

            <Card className="p-6 border-none shadow-md bg-white">
              <div className="space-y-3">
                <Button 
                  size="lg" 
                  className="w-full justify-start text-lg font-bold h-14 rounded-xl bg-primary hover:bg-primary/90"
                  onClick={handlePrint}
                >
                  <Printer className="mr-3 h-5 w-5" /> Print Now
                </Button>
                <Button size="lg" variant="outline" className="w-full justify-start text-lg font-bold h-14 rounded-xl border-2">
                  <Download className="mr-3 h-5 w-5" /> Download PDF
                </Button>
              </div>
            </Card>

            <div className="rounded-xl bg-accent/10 p-6">
              <h3 className="font-bold text-accent-foreground mb-2">Parent Tips 💡</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-accent mt-0.5" />
                  Use thicker paper (cardstock) if using markers.
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-accent mt-0.5" />
                  Print two pages per sheet for smaller travel coloring.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
