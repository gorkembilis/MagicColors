import { useRoute, Link } from "wouter";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { packs } from "@/lib/mock-data";
import { ArrowLeft, Lock, Printer, Crown } from "lucide-react";
import { motion } from "framer-motion";
import NotFound from "@/pages/not-found";
import { PremiumModal } from "@/components/premium-modal";
import { useI18n } from "@/lib/i18n";

export default function PackDetail() {
  const [, params] = useRoute("/pack/:id");
  const packId = params?.id;
  const pack = packs.find(p => p.id === packId);
  const { t } = useI18n();

  if (!pack) return <NotFound />;

  const images = Array.from({ length: pack.count }).map((_, i) => ({
    id: `${pack.id}-${i + 1}`,
    url: pack.cover,
    title: `${t(`pack.${pack.id}`)} #${i + 1}`
  }));

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
    <MobileLayout 
      headerTitle={t(`pack.${pack.id}`)}
      headerAction={
        <Link href="/">
           <Button variant="ghost" size="icon" className="-mr-2">
             {/* Placeholder for maybe a filter or sort icon */}
           </Button>
        </Link>
      }
    >
      <div className="px-4 py-6">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-4 pl-0 text-muted-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" /> {t('pack.back')}
            </Button>
          </Link>

          {isLocked && (
            <Card className="bg-gradient-to-r from-secondary/20 to-orange-400/20 border-secondary/50 p-4 flex items-center gap-3 shadow-sm">
              <div className="bg-secondary rounded-full p-2 text-white shrink-0">
                <Crown className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-foreground text-sm">{t('pack.premiumLabel')}</p>
                <p className="text-[10px] text-muted-foreground truncate">{t('pack.premiumDesc')}</p>
              </div>
              <PremiumModal>
                <Button size="sm" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold rounded-full px-3 h-8 text-xs">
                  {t('pack.unlock')}
                </Button>
              </PremiumModal>
            </Card>
          )}
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 gap-3"
        >
          {images.map((image, idx) => (
            <motion.div key={image.id} variants={item}>
              {isLocked && idx > 1 ? (
                <PremiumModal>
                  <Card className="group relative border-none shadow-sm bg-white opacity-75 active:scale-95 transition-transform">
                    <div className="aspect-[3/4] overflow-hidden rounded-t-xl">
                      <img 
                        src={image.url} 
                        alt={image.title}
                        className="h-full w-full object-cover blur-[2px] grayscale"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[1px]">
                        <div className="rounded-full bg-black/60 p-2 text-white backdrop-blur-md">
                          <Lock className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <p className="truncate text-xs font-bold text-center">{image.title}</p>
                    </div>
                  </Card>
                </PremiumModal>
              ) : (
                <Link href={`/view/${image.id}?packId=${pack.id}`}>
                  <Card className="group relative border-none shadow-sm bg-white active:scale-95 transition-transform">
                    <div className="aspect-[3/4] overflow-hidden rounded-t-xl">
                      <img 
                        src={image.url} 
                        alt={image.title}
                        className="h-full w-full object-cover grayscale contrast-125"
                      />
                    </div>
                    <div className="p-2">
                      <p className="truncate text-xs font-bold text-center">{image.title}</p>
                    </div>
                  </Card>
                </Link>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </MobileLayout>
  );
}
