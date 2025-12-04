import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Download, Printer, Share2, ArrowLeft, Sparkles, LogIn } from "lucide-react";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export default function Generator() {
  const [, setLocation] = useLocation();
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [hasStartedGenerating, setHasStartedGenerating] = useState(false);
  const { t } = useI18n();
  const { toast } = useToast();
  const { user, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  
  const params = new URLSearchParams(window.location.search);
  const prompt = params.get("prompt") || "A magical surprise";

  const generateMutation = useMutation({
    mutationFn: async (prompt: string) => {
      const res = await apiRequest("POST", "/api/generate", { prompt });
      return await res.json();
    },
    onSuccess: (data: any) => {
      setResultImage(data.imageUrl);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated && !hasStartedGenerating && !resultImage) {
      setHasStartedGenerating(true);
      generateMutation.mutate(prompt);
    }
  }, [isAuthLoading, isAuthenticated, hasStartedGenerating, resultImage, prompt]);

  const handleTryAgain = () => {
    setResultImage(null);
    setHasStartedGenerating(false);
  };

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  const isGenerating = generateMutation.isPending;
  const isComplete = resultImage !== null;

  if (isAuthLoading) {
    return (
      <MobileLayout showHeader={false}>
        <div className="flex flex-col min-h-[calc(100vh-80px)] items-center justify-center p-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </MobileLayout>
    );
  }

  if (!isAuthenticated) {
    return (
      <MobileLayout showHeader={false}>
        <div className="flex flex-col min-h-[calc(100vh-80px)] p-4">
          <Button 
            variant="ghost" 
            size="sm"
            className="self-start mb-4 pl-0 text-muted-foreground"
            onClick={() => setLocation("/")}
            data-testid="button-back"
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> {t('generator.back')}
          </Button>

          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <div className="relative mb-6 h-24 w-24">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-primary/10">
                <LogIn className="h-10 w-10 text-primary" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">{t('auth.loginRequired')}</h2>
            <p className="text-muted-foreground mb-6 max-w-xs">{t('auth.loginToCreate')}</p>
            <Button 
              size="lg" 
              className="rounded-2xl px-8 font-bold"
              onClick={handleLogin}
              data-testid="button-login"
            >
              <LogIn className="mr-2 h-4 w-4" /> {t('auth.login')}
            </Button>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout showHeader={false}>
      <div className="flex flex-col min-h-[calc(100vh-80px)] p-4">
        <Button 
          variant="ghost" 
          size="sm"
          className="self-start mb-4 pl-0 text-muted-foreground"
          onClick={() => setLocation("/")}
          data-testid="button-back"
        >
          <ArrowLeft className="mr-1 h-4 w-4" /> {t('generator.back')}
        </Button>

        <div className="flex-1 flex flex-col">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-white shadow-xl border-4 border-white mb-6">
            {isGenerating ? (
              <div className="flex h-full flex-col items-center justify-center bg-muted/30 p-8 text-center">
                <div className="relative mb-6 h-24 w-24">
                  <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
                  <div className="absolute inset-4 rounded-full bg-primary/10" />
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-white shadow-sm">
                    <Sparkles className="h-10 w-10 animate-pulse text-primary" />
                  </div>
                </div>
                <h3 className="mb-2 text-xl font-bold text-primary animate-pulse">{t('generator.creating')}</h3>
              </div>
            ) : isComplete ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full w-full"
              >
                <img 
                  src={resultImage} 
                  alt="Generated coloring page" 
                  className="h-full w-full object-contain"
                  data-testid="img-generated"
                />
              </motion.div>
            ) : null}
          </div>

          <div className="mt-auto">
            {isComplete && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    size="lg" 
                    className="w-full h-12 rounded-xl font-bold" 
                    variant="outline"
                    data-testid="button-download"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = resultImage!;
                      link.download = `coloring-page-${Date.now()}.png`;
                      link.click();
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" /> {t('generator.savePdf')}
                  </Button>
                  <Button 
                    size="lg" 
                    className="w-full h-12 rounded-xl font-bold bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                    data-testid="button-print"
                    onClick={() => {
                      const printWindow = window.open('', '_blank');
                      printWindow?.document.write(`<img src="${resultImage}" style="max-width: 100%; height: auto;" />`);
                      printWindow?.print();
                    }}
                  >
                    <Printer className="h-4 w-4 mr-2" /> {t('generator.print')}
                  </Button>
                </div>
                
                <Button 
                  size="lg" 
                  variant="ghost" 
                  className="w-full h-12 font-bold text-muted-foreground"
                  data-testid="button-share"
                >
                  <Share2 className="h-4 w-4 mr-2" /> {t('generator.share')}
                </Button>

                <Button 
                  variant="secondary" 
                  size="sm"
                  className="w-full mt-4 rounded-lg bg-muted text-muted-foreground h-10"
                  onClick={handleTryAgain}
                  data-testid="button-try-again"
                >
                  {t('generator.tryAgain')}
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
