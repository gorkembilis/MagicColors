import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Puzzle, Plus, Play, Trash2, Trophy, Clock, ArrowLeft, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { packs } from "@/lib/mock-data";

interface PuzzleData {
  id: number;
  title: string;
  imageUrl: string;
  difficulty: number;
  isCompleted: boolean;
  bestTime: number | null;
  createdAt: string;
}

export default function Puzzles() {
  const [, navigate] = useLocation();
  const { t } = useI18n();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(3);

  const { data: puzzles = [], isLoading } = useQuery<PuzzleData[]>({
    queryKey: ["/api/puzzles"],
    queryFn: async () => {
      const res = await fetch("/api/puzzles", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch puzzles");
      return res.json();
    },
    enabled: !!user,
  });

  const { data: myArt = [] } = useQuery({
    queryKey: ["/api/my-art"],
    queryFn: async () => {
      const res = await fetch("/api/my-art", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch art");
      return res.json();
    },
    enabled: !!user && showCreateDialog,
  });

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

  const deletePuzzleMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/puzzles/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete puzzle");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/puzzles"] });
    },
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getDifficultyLabel = (diff: number) => {
    if (diff === 3) return t("puzzle.difficulty.easy");
    if (diff === 4) return t("puzzle.difficulty.medium");
    return t("puzzle.difficulty.hard");
  };

  const allPackImages = packs.flatMap((pack) =>
    pack.images.slice(0, 4).map((img) => ({
      url: img.url,
      title: img.title,
      packId: pack.id,
    }))
  );

  const handleCreatePuzzle = () => {
    if (!selectedImage) return;
    createPuzzleMutation.mutate({
      title: selectedImage.title,
      imageUrl: selectedImage.url,
      difficulty: selectedDifficulty,
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <Puzzle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl font-bold mb-2">{t("profile.loginRequired")}</h2>
          <p className="text-gray-500 mb-4">{t("profile.loginDesc")}</p>
          <Button onClick={() => navigate("/auth")} data-testid="button-login">
            {t("profile.login")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 pb-24">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b px-4 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-bold text-lg">{t("puzzle.title")}</h1>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setShowCreateDialog(true)}
            className="text-pink-500"
            data-testid="button-create-puzzle"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="p-4 max-w-lg mx-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
          </div>
        ) : puzzles.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
              <Puzzle className="h-12 w-12 text-purple-400" />
            </div>
            <h2 className="text-lg font-semibold mb-2">{t("puzzle.empty")}</h2>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500"
              data-testid="button-create-first-puzzle"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t("puzzle.createFromImage")}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {puzzles.map((puzzle) => (
              <motion.div
                key={puzzle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <div className="relative aspect-square">
                  <img
                    src={puzzle.imageUrl}
                    alt={puzzle.title}
                    className="w-full h-full object-cover"
                  />
                  {puzzle.isCompleted && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      {t("puzzle.completed")}
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                    {getDifficultyLabel(puzzle.difficulty)}
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm truncate mb-2">{puzzle.title}</h3>
                  {puzzle.bestTime && (
                    <div className="flex items-center gap-1 text-xs text-yellow-600 mb-2">
                      <Trophy className="h-3 w-3" />
                      <span>{formatTime(puzzle.bestTime)}</span>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500"
                      onClick={() => navigate(`/puzzle/${puzzle.id}`)}
                      data-testid={`button-play-puzzle-${puzzle.id}`}
                    >
                      <Play className="h-3 w-3 mr-1" />
                      {t("puzzle.play")}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deletePuzzleMutation.mutate(puzzle.id)}
                      data-testid={`button-delete-puzzle-${puzzle.id}`}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>{t("puzzle.selectImage")}</DialogTitle>
          </DialogHeader>
          
          <p className="text-sm text-gray-500 mb-4">{t("puzzle.selectImageDesc")}</p>

          <div className="flex gap-2 mb-4">
            {[3, 4, 5].map((diff) => (
              <Button
                key={diff}
                variant={selectedDifficulty === diff ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDifficulty(diff)}
                className={selectedDifficulty === diff ? "bg-gradient-to-r from-purple-500 to-pink-500" : ""}
                data-testid={`button-difficulty-${diff}`}
              >
                {getDifficultyLabel(diff)}
              </Button>
            ))}
          </div>

          <Tabs defaultValue="packs" className="flex-1 overflow-hidden flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="packs" data-testid="tab-from-packs">
                {t("puzzle.fromPacks")}
              </TabsTrigger>
              <TabsTrigger value="myart" data-testid="tab-from-myart">
                {t("puzzle.fromMyArt")}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="packs" className="flex-1 overflow-y-auto mt-4">
              <div className="grid grid-cols-3 gap-2">
                {allPackImages.map((img, idx) => (
                  <div
                    key={`${img.packId}-${idx}`}
                    className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                      selectedImage?.url === img.url
                        ? "border-pink-500 ring-2 ring-pink-300"
                        : "border-transparent"
                    }`}
                    onClick={() => setSelectedImage(img)}
                    data-testid={`image-select-${idx}`}
                  >
                    <img
                      src={img.url}
                      alt={img.title}
                      className="w-full h-full object-cover"
                    />
                    {selectedImage?.url === img.url && (
                      <div className="absolute inset-0 bg-pink-500/20 flex items-center justify-center">
                        <Check className="h-6 w-6 text-pink-500" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="myart" className="flex-1 overflow-y-auto mt-4">
              {myArt.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>{t("gallery.empty.desc")}</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {myArt.map((art: any) => (
                    <div
                      key={art.id}
                      className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                        selectedImage?.url === art.imageUrl
                          ? "border-pink-500 ring-2 ring-pink-300"
                          : "border-transparent"
                      }`}
                      onClick={() => setSelectedImage({ url: art.imageUrl, title: art.prompt })}
                      data-testid={`myart-select-${art.id}`}
                    >
                      <img
                        src={art.imageUrl}
                        alt={art.prompt}
                        className="w-full h-full object-cover"
                      />
                      {selectedImage?.url === art.imageUrl && (
                        <div className="absolute inset-0 bg-pink-500/20 flex items-center justify-center">
                          <Check className="h-6 w-6 text-pink-500" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="flex gap-3 mt-4 pt-4 border-t">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setShowCreateDialog(false);
                setSelectedImage(null);
              }}
              data-testid="button-cancel-create"
            >
              <X className="h-4 w-4 mr-2" />
              İptal
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500"
              onClick={handleCreatePuzzle}
              disabled={!selectedImage || createPuzzleMutation.isPending}
              data-testid="button-confirm-create"
            >
              {createPuzzleMutation.isPending ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <Puzzle className="h-4 w-4 mr-2" />
                  {t("puzzle.create")}
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
