import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, Play, Lock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { puzzlePacks, PuzzleDifficulty } from "@/lib/puzzle-data";

export default function PuzzlePack() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { t } = useI18n();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(3);

  const pack = puzzlePacks.find((p) => p.id === id);

  const createPuzzleMutation = useMutation({
    mutationFn: async (data: { title: string; imageUrl: string; difficulty: number }) => {
      const res = await fetch("/api/puzzles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create puzzle");
      return res.json();
    },
    onSuccess: (puzzle) => {
      queryClient.invalidateQueries({ queryKey: ["/api/puzzles"] });
      setShowCreateDialog(false);
      setSelectedImage(null);
      navigate(`/puzzle/${puzzle.id}`);
    },
  });

  const getDifficultyLabel = (diff: number) => {
    if (diff === 3) return t("puzzle.difficulty.easy");
    if (diff === 4) return t("puzzle.difficulty.medium");
    return t("puzzle.difficulty.hard");
  };

  const difficultyColors: Record<PuzzleDifficulty, string> = {
    easy: "bg-green-100 text-green-700",
    medium: "bg-yellow-100 text-yellow-700",
    hard: "bg-red-100 text-red-700"
  };

  const handleImageClick = (imageUrl: string, title: string) => {
    if (!user) {
      navigate("/auth");
      return;
    }
    
    if (pack?.isPremium && !user?.isPremium) {
      navigate("/premium");
      return;
    }
    
    setSelectedImage({ url: imageUrl, title });
    setShowCreateDialog(true);
  };

  const handleCreatePuzzle = () => {
    if (!selectedImage) return;
    createPuzzleMutation.mutate({
      title: selectedImage.title,
      imageUrl: selectedImage.url,
      difficulty: selectedDifficulty,
    });
  };

  if (!pack) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>{t("common.notFound")}</p>
      </div>
    );
  }

  const isLocked = pack.isPremium && !user?.isPremium;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const item = {
    hidden: { scale: 0.9, opacity: 0 },
    show: { scale: 1, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-cyan-50 dark:from-slate-900 dark:to-slate-800 pb-8">
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b">
        <div className="flex items-center gap-3 px-4 py-3 max-w-lg mx-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/puzzles")}
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-bold text-lg">{t(`puzzlePack.${pack.id}`)}</h1>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-0.5 rounded-full ${difficultyColors[pack.difficulty]}`}>
                {t(`difficulty.${pack.difficulty}`)}
              </span>
              <span className="text-xs text-muted-foreground">{pack.count} {t("puzzle.puzzles")}</span>
            </div>
          </div>
        </div>
      </header>

      {isLocked && (
        <div className="mx-4 mt-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-4 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-white/20">
              <Lock className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold">{t("puzzle.premiumPack")}</h3>
              <p className="text-sm opacity-90">{t("puzzle.unlockToPlay")}</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate("/premium")}
              className="bg-white text-orange-600 hover:bg-white/90"
            >
              {t("pack.unlock")}
            </Button>
          </div>
        </div>
      )}

      <main className="p-4 max-w-lg mx-auto">
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 gap-3"
        >
          {pack.images.map((image) => (
            <motion.div
              key={image.id}
              variants={item}
              className="relative"
            >
              <div
                className={`aspect-square rounded-xl overflow-hidden bg-white dark:bg-slate-800 shadow-sm cursor-pointer transition-transform hover:scale-[1.02] active:scale-95 ${
                  isLocked ? "opacity-70" : ""
                }`}
                onClick={() => handleImageClick(image.url, image.title)}
                data-testid={`puzzle-image-${image.id}`}
              >
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover"
                />
                {isLocked && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Lock className="h-8 w-8 text-white" />
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                  <p className="text-white text-sm font-medium truncate">{image.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </main>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{t("puzzle.selectDifficulty")}</DialogTitle>
          </DialogHeader>
          
          {selectedImage && (
            <div className="aspect-square rounded-lg overflow-hidden mb-4">
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex gap-2 mb-4">
            {[3, 4, 5].map((diff) => (
              <Button
                key={diff}
                variant={selectedDifficulty === diff ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDifficulty(diff)}
                className={selectedDifficulty === diff ? "bg-gradient-to-r from-indigo-500 to-cyan-500 flex-1" : "flex-1"}
                data-testid={`dialog-difficulty-${diff}`}
              >
                {getDifficultyLabel(diff)}
              </Button>
            ))}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setShowCreateDialog(false);
                setSelectedImage(null);
              }}
              data-testid="button-cancel"
            >
              <X className="h-4 w-4 mr-2" />
              {t("common.cancel")}
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-indigo-500 to-cyan-500"
              onClick={handleCreatePuzzle}
              disabled={!selectedImage || createPuzzleMutation.isPending}
              data-testid="button-start-puzzle"
            >
              {createPuzzleMutation.isPending ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  {t("puzzle.play")}
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
