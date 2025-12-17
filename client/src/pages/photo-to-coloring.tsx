import { useState, useRef } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import { useMutation } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { motion } from "framer-motion";
import { Camera, Upload, Wand2, ArrowLeft, Download, Palette, Loader2 } from "lucide-react";

export default function PhotoToColoring() {
  const { t } = useI18n();
  const [, setLocation] = useLocation();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const convertMutation = useMutation({
    mutationFn: async (imageData: string) => {
      const res = await fetch("/api/photo-to-coloring", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageData }),
      });
      if (!res.ok) throw new Error("Dönüştürme başarısız");
      return res.json();
    },
    onSuccess: (data) => {
      setResultImage(data.imageUrl);
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setSelectedImage(result);
      setResultImage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleConvert = () => {
    if (selectedImage) {
      convertMutation.mutate(selectedImage);
    }
  };

  const downloadResult = () => {
    if (!resultImage) return;
    const link = document.createElement("a");
    link.download = `boyama-sayfasi-${Date.now()}.png`;
    link.href = resultImage;
    link.click();
  };

  return (
    <MobileLayout headerTitle={t("photoToColoring.title") || "Fotoğraftan Boyama"}>
      <div className="px-4 py-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 mx-auto mb-4 flex items-center justify-center">
            <Camera className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold mb-2">
            {t("photoToColoring.subtitle") || "Fotoğrafını Boyama Sayfasına Çevir"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t("photoToColoring.desc") || "Herhangi bir fotoğrafı AI ile çizgi resme dönüştür"}
          </p>
        </motion.div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileSelect}
          className="hidden"
          data-testid="input-photo"
        />

        {!selectedImage ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card 
              className="border-dashed border-2 cursor-pointer hover:border-primary transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <CardContent className="py-12 text-center">
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="font-bold mb-1">
                  {t("photoToColoring.uploadTitle") || "Fotoğraf Yükle"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("photoToColoring.uploadDesc") || "Galerinden seç veya fotoğraf çek"}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold text-center mb-2 text-muted-foreground">
                  {t("photoToColoring.original") || "Orijinal"}
                </p>
                <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                  <img
                    src={selectedImage}
                    alt="Original"
                    className="w-full h-full object-cover"
                    data-testid="img-original"
                  />
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-center mb-2 text-muted-foreground">
                  {t("photoToColoring.result") || "Boyama Sayfası"}
                </p>
                <div className="aspect-square rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                  {convertMutation.isPending ? (
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
                      <p className="text-xs text-muted-foreground">
                        {t("photoToColoring.converting") || "Dönüştürülüyor..."}
                      </p>
                    </div>
                  ) : resultImage ? (
                    <img
                      src={resultImage}
                      alt="Result"
                      className="w-full h-full object-contain bg-white"
                      data-testid="img-result"
                    />
                  ) : (
                    <Wand2 className="w-8 h-8 text-muted-foreground/30" />
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setSelectedImage(null);
                  setResultImage(null);
                }}
                data-testid="button-reset"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t("photoToColoring.newPhoto") || "Yeni Fotoğraf"}
              </Button>
              {!resultImage ? (
                <Button
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500"
                  onClick={handleConvert}
                  disabled={convertMutation.isPending}
                  data-testid="button-convert"
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  {t("photoToColoring.convert") || "Dönüştür"}
                </Button>
              ) : (
                <Button
                  className="flex-1"
                  onClick={downloadResult}
                  data-testid="button-download"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {t("photoToColoring.download") || "İndir"}
                </Button>
              )}
            </div>

            {resultImage && (
              <Link href={`/coloring/photo-${Date.now()}`}>
                <Button className="w-full bg-green-500 hover:bg-green-600" data-testid="button-color">
                  <Palette className="w-4 h-4 mr-2" />
                  {t("photoToColoring.startColoring") || "Boyamaya Başla"}
                </Button>
              </Link>
            )}
          </motion.div>
        )}

        {convertMutation.isError && (
          <div className="text-center text-red-500 text-sm">
            {t("photoToColoring.error") || "Bir hata oluştu, tekrar deneyin"}
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
