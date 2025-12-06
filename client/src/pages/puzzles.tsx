import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Puzzle, Plus, Play, Trash2, Trophy, ArrowLeft, X, Check, Wand2, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { puzzlePacks, PuzzleDifficulty } from "@/lib/puzzle-data";

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
  
  const [activeTab, setActiveTab] = useState<"packs" | "myPuzzles" | "ai">("packs");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(3);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: puzzles = [], isLoading } = useQuery<PuzzleData[]>({
    queryKey: ["/api/puzzles"],
    queryFn: async () => {
      const res = await fetch("/api/puzzles", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch puzzles");
      return res.json();
    },
    enabled: !!user,
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

  const difficultyColors: Record<PuzzleDifficulty, string> = {
    easy: "bg-green-100 text-green-700 border-green-200",
    medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
    hard: "bg-red-100 text-red-700 border-red-200"
  };

  const handleCreateFromPack = (imageUrl: string, title: string) => {
    if (!user) {
      navigate("/auth");
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

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim() || !user) return;
    
    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate-puzzle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ prompt: aiPrompt, difficulty: selectedDifficulty }),
      });
      
      if (!res.ok) throw new Error("Failed to generate puzzle");
      
      const puzzle = await res.json();
      queryClient.invalidateQueries({ queryKey: ["/api/puzzles"] });
      navigate(`/puzzle/${puzzle.id}`);
    } catch (error) {
      console.error("Error generating puzzle:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-cyan-50 dark:from-slate-900 dark:to-slate-800 pb-24">
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b px-4 py-3">
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
          <div className="w-10" />
        </div>
      </header>

      <div className="px-4 pt-4 max-w-lg mx-auto">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="packs" data-testid="tab-packs">
              {t("puzzle.packs")}
            </TabsTrigger>
            <TabsTrigger value="myPuzzles" data-testid="tab-my-puzzles">
              {t("puzzle.myPuzzles")}
            </TabsTrigger>
            <TabsTrigger value="ai" data-testid="tab-ai">
              <Wand2 className="h-4 w-4 mr-1" />
              AI
            </TabsTrigger>
          </TabsList>

          <TabsContent value="packs" className="mt-0">
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 gap-3"
            >
              {puzzlePacks.map((pack) => (
                <motion.div key={pack.id} variants={item}>
                  <Card 
                    className="group cursor-pointer overflow-hidden border-none shadow-sm transition-all hover:-translate-y-1 hover:shadow-md bg-white dark:bg-slate-800 active:scale-95 duration-100"
                    onClick={() => navigate(`/puzzle-pack/${pack.id}`)}
                    data-testid={`puzzle-pack-${pack.id}`}
                  >
                    <div className="relative aspect-square overflow-hidden rounded-t-xl">
                      <img 
                        src={pack.cover} 
                        alt={t(`puzzlePack.${pack.id}`)}
                        className="h-full w-full object-cover"
                      />
                      {pack.isPremium && !user?.isPremium && (
                        <div className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-yellow-400 backdrop-blur-sm">
                          <Lock className="h-3 w-3" />
                        </div>
                      )}
                      {pack.isPremium && user?.isPremium && (
                        <div className="absolute right-2 top-2 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-lg border border-white">
                          Premium
                        </div>
                      )}
                      {!pack.isPremium && (
                        <div className="absolute right-2 top-2 rounded-full bg-green-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-lg border border-white animate-pulse">
                          {t('home.packs.free')}
                        </div>
                      )}
                      <div className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold border ${difficultyColors[pack.difficulty]}`}>
                        {t(`difficulty.${pack.difficulty}`)}
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <h3 className="mb-0.5 text-sm font-bold leading-none truncate">{t(`puzzlePack.${pack.id}`)}</h3>
                      <p className="text-[10px] text-muted-foreground">{pack.count} {t("puzzle.puzzles")}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="myPuzzles" className="mt-0">
            {!user ? (
              <div className="text-center py-12">
                <Puzzle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-xl font-bold mb-2">{t("profile.loginRequired")}</h2>
                <p className="text-muted-foreground mb-4">{t("profile.loginDesc")}</p>
                <Button onClick={() => navigate("/auth")} data-testid="button-login">
                  {t("profile.login")}
                </Button>
              </div>
            ) : isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
              </div>
            ) : puzzles.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-indigo-100 to-cyan-100 dark:from-indigo-900 dark:to-cyan-900 rounded-full flex items-center justify-center">
                  <Puzzle className="h-12 w-12 text-indigo-400 dark:text-indigo-300" />
                </div>
                <h2 className="text-lg font-semibold mb-2">{t("puzzle.empty")}</h2>
                <p className="text-muted-foreground text-sm mb-4">{t("puzzle.emptyDesc")}</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {puzzles.map((puzzle) => (
                  <motion.div
                    key={puzzle.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden"
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
                          className="flex-1 bg-gradient-to-r from-indigo-500 to-cyan-500"
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
          </TabsContent>

          <TabsContent value="ai" className="mt-0">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <Wand2 className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-lg font-bold mb-2">{t("puzzle.aiGenerate")}</h2>
                <p className="text-sm text-muted-foreground">{t("puzzle.aiGenerateDesc")}</p>
              </div>

              {!user ? (
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">{t("profile.loginDesc")}</p>
                  <Button onClick={() => navigate("/auth")} data-testid="button-login-ai">
                    {t("profile.login")}
                  </Button>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">{t("puzzle.aiPromptLabel")}</label>
                    <Input
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder={t("puzzle.aiPromptPlaceholder")}
                      className="w-full"
                      data-testid="input-ai-prompt"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">{t("puzzle.selectDifficulty")}</label>
                    <div className="flex gap-2">
                      {[3, 4, 5].map((diff) => (
                        <Button
                          key={diff}
                          variant={selectedDifficulty === diff ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedDifficulty(diff)}
                          className={selectedDifficulty === diff ? "bg-gradient-to-r from-indigo-500 to-cyan-500 flex-1" : "flex-1"}
                          data-testid={`button-difficulty-${diff}`}
                        >
                          {getDifficultyLabel(diff)}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-indigo-500 to-cyan-500"
                    onClick={handleAiGenerate}
                    disabled={!aiPrompt.trim() || isGenerating}
                    data-testid="button-generate-puzzle"
                  >
                    {isGenerating ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        {t("puzzle.generating")}
                      </div>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4 mr-2" />
                        {t("puzzle.generateButton")}
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

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
              data-testid="button-cancel-create"
            >
              <X className="h-4 w-4 mr-2" />
              {t("common.cancel")}
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-indigo-500 to-cyan-500"
              onClick={handleCreatePuzzle}
              disabled={!selectedImage || createPuzzleMutation.isPending}
              data-testid="button-confirm-create"
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
