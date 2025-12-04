import { MobileLayout } from "@/components/layout/MobileLayout";
import { Card } from "@/components/ui/card";
import { Download, Share2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useLocation } from "wouter";

export default function Gallery() {
  const { t } = useI18n();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const { data: savedArt, isLoading, error } = useQuery({
    queryKey: ["/api/my-art"],
  });

  useEffect(() => {
    if (error && isUnauthorizedError(error as Error)) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [error]);

  if (isLoading) {
    return (
      <MobileLayout headerTitle={t('gallery.title')}>
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </MobileLayout>
    );
  }

  const images = (savedArt as any[]) || [];

  return (
    <MobileLayout headerTitle={t('gallery.title')}>
      <div className="p-4">
        {images.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
              <Download className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-bold text-lg">{t('gallery.empty.title')}</h3>
            <p className="text-muted-foreground mb-6 max-w-[200px]">{t('gallery.empty.desc')}</p>
            <Button 
              className="rounded-full px-8 font-bold"
              onClick={() => setLocation("/")}
              data-testid="button-create-now"
            >
              {t('gallery.createNow')}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {images.map((art: any) => (
              <Card key={art.id} className="overflow-hidden border-none shadow-sm" data-testid={`card-art-${art.id}`}>
                <div className="aspect-square relative bg-muted">
                  <img 
                    src={art.imageUrl} 
                    alt={art.prompt} 
                    className="h-full w-full object-contain"
                    data-testid={`img-art-${art.id}`}
                  />
                </div>
                <div className="p-3">
                  <p className="text-xs font-medium text-muted-foreground mb-2 truncate" data-testid={`text-prompt-${art.id}`}>
                    {art.prompt}
                  </p>
                  <div className="flex justify-between gap-2">
                    <Button 
                      size="icon" 
                      variant="outline" 
                      className="h-8 w-8 rounded-full"
                      data-testid={`button-print-${art.id}`}
                      onClick={() => {
                        const printWindow = window.open('', '_blank');
                        printWindow?.document.write(`<img src="${art.imageUrl}" style="max-width: 100%; height: auto;" />`);
                        printWindow?.print();
                      }}
                    >
                      <Printer className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="outline" 
                      className="h-8 w-8 rounded-full"
                      data-testid={`button-share-${art.id}`}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
