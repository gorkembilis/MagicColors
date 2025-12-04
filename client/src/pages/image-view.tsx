import { useRoute, Link } from "wouter";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { packs } from "@/lib/mock-data";
import { ArrowLeft, Printer, Download, Share2, X } from "lucide-react";
import { motion } from "framer-motion";
import NotFound from "@/pages/not-found";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";

function AdBanner() {
  const [visible, setVisible] = useState(true);
  const { t } = useI18n();
  if (!visible) return null;
  
  return (
    <div className="bg-gray-100 border-t border-gray-200 p-2 text-center relative">
      <button 
        onClick={() => setVisible(false)}
        className="absolute top-1 right-1 text-gray-400 p-1"
      >
        <X className="h-3 w-3" />
      </button>
      <p className="text-[10px] font-bold text-gray-500 mb-1">{t('view.ad.label')}</p>
      <div className="h-12 bg-white w-full flex items-center justify-center text-gray-400 border border-dashed border-gray-300 rounded text-xs">
        Toy Advertisement
      </div>
    </div>
  );
}

export default function ImageView() {
  const [, params] = useRoute("/view/:id");
  const imageId = params?.id;
  const { t } = useI18n();
  
  const packId = imageId?.split("-")[0];
  const pack = packs.find(p => p.id === packId);
  
  if (!imageId || !pack) return <NotFound />;

  const imageUrl = pack.cover; 
  const title = `${t(`pack.${pack.id}`)} - Page ${imageId.split("-")[1]}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <MobileLayout showHeader={false}>
      <div className="flex flex-col h-[calc(100vh-80px)] bg-black">
        {/* Header Overlay */}
        <div className="absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-start bg-gradient-to-b from-black/60 to-transparent">
          <Link href={`/pack/${packId}`}>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full">
             <Share2 className="h-6 w-6" />
          </Button>
        </div>

        {/* Image Area - Zoomable/Pannable feel */}
        <div className="flex-1 flex items-center justify-center overflow-hidden bg-neutral-900">
          <motion.img 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            src={imageUrl} 
            alt={title}
            className="max-h-full max-w-full object-contain grayscale contrast-125"
          />
        </div>

        {/* Bottom Controls */}
        <div className="bg-white rounded-t-3xl p-6 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.3)] z-20 relative">
          <div className="mx-auto w-12 h-1.5 bg-muted rounded-full mb-6" />
          
          <h1 className="text-lg font-extrabold mb-4 text-center">{title}</h1>
          
          {!pack.isPremium && <div className="mb-4"><AdBanner /></div>}

          <div className="grid grid-cols-2 gap-4">
             <Button 
                size="lg" 
                className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-lg font-bold shadow-lg"
                onClick={handlePrint}
              >
                <Printer className="mr-2 h-5 w-5" /> {t('view.printNow')}
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full h-14 rounded-2xl border-2 text-lg font-bold"
              >
                <Download className="mr-2 h-5 w-5" /> {t('view.downloadPdf')}
              </Button>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
