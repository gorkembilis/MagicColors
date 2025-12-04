import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Crown, Check, Star, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";

export default function Premium() {
  const { t } = useI18n();
  return (
    <MobileLayout headerTitle={t('premium.title')}>
      <div className="p-4 pb-8">
        {/* Header Banner */}
        <div className="rounded-3xl bg-gradient-to-br from-secondary via-orange-400 to-pink-500 p-6 text-white shadow-lg mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-white/20 blur-2xl" />
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-24 w-24 rounded-full bg-white/20 blur-2xl" />
          
          <div className="relative z-10 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm shadow-inner border border-white/30">
              <Crown className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold mb-2">{t('premium.banner.title')}</h1>
            <p className="text-white/90 text-sm font-medium mb-6">
              {t('premium.banner.desc')}
            </p>
            <Button className="w-full bg-white text-secondary font-extrabold rounded-xl h-12 shadow-lg hover:bg-white/90">
              {t('premium.trial')}
            </Button>
            <p className="mt-3 text-[10px] text-white/70">
              {t('premium.price')}
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-4 mb-8">
          <h3 className="font-bold text-lg px-2">{t('nav.premium')}</h3>
          
          <Card className="p-4 border-none shadow-sm flex items-center gap-4 bg-white">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold">{t('premium.feat.ai')}</h4>
              <p className="text-xs text-muted-foreground">{t('premium.feat.ai.desc')}</p>
            </div>
          </Card>

          <Card className="p-4 border-none shadow-sm flex items-center gap-4 bg-white">
            <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
              <Star className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold">{t('premium.feat.packs')}</h4>
              <p className="text-xs text-muted-foreground">{t('premium.feat.packs.desc')}</p>
            </div>
          </Card>

          <Card className="p-4 border-none shadow-sm flex items-center gap-4 bg-white">
            <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
              <Check className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold">{t('premium.feat.ads')}</h4>
              <p className="text-xs text-muted-foreground">{t('premium.feat.ads.desc')}</p>
            </div>
          </Card>
        </div>

        {/* Restore Purchase */}
        <div className="text-center">
          <Button variant="ghost" size="sm" className="text-muted-foreground text-xs">
            {t('premium.restore')}
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
}
