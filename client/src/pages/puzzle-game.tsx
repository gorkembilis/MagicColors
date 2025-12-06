import { useState, useEffect, useCallback } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Shuffle, CheckCircle, Trophy, Clock, Move } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

interface PuzzlePiece {
  id: number;
  currentPos: number;
  correctPos: number;
}

export default function PuzzleGame() {
  const [, params] = useRoute("/puzzle/:id");
  const [, navigate] = useLocation();
  const { t } = useI18n();
  const queryClient = useQueryClient();
  
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isNewRecord, setIsNewRecord] = useState(false);
  
  const puzzleId = params?.id ? parseInt(params.id) : null;

  const { data: puzzle, isLoading } = useQuery({
    queryKey: ["/api/puzzles", puzzleId],
    queryFn: async () => {
      const res = await fetch(`/api/puzzles/${puzzleId}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch puzzle");
      return res.json();
    },
    enabled: !!puzzleId,
  });

  const updatePuzzleMutation = useMutation({
    mutationFn: async (data: { isCompleted: boolean; bestTime?: number }) => {
      const res = await fetch(`/api/puzzles/${puzzleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update puzzle");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/puzzles"] });
      queryClient.invalidateQueries({ queryKey: ["/api/puzzles", puzzleId] });
    },
  });

  const gridSize = puzzle?.difficulty === 3 ? 3 : puzzle?.difficulty === 4 ? 4 : 5;
  const totalPieces = gridSize * gridSize;

  const initializePuzzle = useCallback(() => {
    const newPieces: PuzzlePiece[] = [];
    for (let i = 0; i < totalPieces; i++) {
      newPieces.push({ id: i, currentPos: i, correctPos: i });
    }
    setPieces(newPieces);
    setMoves(0);
    setTime(0);
    setIsRunning(false);
    setIsSolved(false);
    setShowCelebration(false);
    setSelectedPiece(null);
  }, [totalPieces]);

  const shufflePuzzle = useCallback(() => {
    const shuffled = [...pieces];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tempPos = shuffled[i].currentPos;
      shuffled[i].currentPos = shuffled[j].currentPos;
      shuffled[j].currentPos = tempPos;
    }
    setPieces(shuffled);
    setMoves(0);
    setTime(0);
    setIsRunning(true);
    setIsSolved(false);
    setShowCelebration(false);
  }, [pieces]);

  const checkSolved = useCallback((currentPieces: PuzzlePiece[]) => {
    return currentPieces.every((p) => p.currentPos === p.correctPos);
  }, []);

  const handlePieceClick = (clickedPiece: PuzzlePiece) => {
    if (isSolved) return;

    if (selectedPiece === null) {
      setSelectedPiece(clickedPiece.id);
    } else {
      if (selectedPiece === clickedPiece.id) {
        setSelectedPiece(null);
        return;
      }

      const newPieces = pieces.map((p) => {
        if (p.id === selectedPiece) {
          return { ...p, currentPos: clickedPiece.currentPos };
        }
        if (p.id === clickedPiece.id) {
          return { ...p, currentPos: pieces.find((x) => x.id === selectedPiece)!.currentPos };
        }
        return p;
      });

      setPieces(newPieces);
      setMoves((m) => m + 1);
      setSelectedPiece(null);

      if (!isRunning) {
        setIsRunning(true);
      }

      if (checkSolved(newPieces)) {
        setIsSolved(true);
        setIsRunning(false);
        
        const newRecord = !puzzle?.bestTime || time < puzzle.bestTime;
        setIsNewRecord(newRecord);
        
        updatePuzzleMutation.mutate({
          isCompleted: true,
          bestTime: newRecord ? time : undefined,
        });
        
        setTimeout(() => setShowCelebration(true), 300);
      }
    }
  };

  useEffect(() => {
    if (puzzle && pieces.length === 0) {
      initializePuzzle();
    }
  }, [puzzle, pieces.length, initializePuzzle]);

  useEffect(() => {
    if (pieces.length > 0 && !isRunning && !isSolved && moves === 0 && time === 0) {
      const timer = setTimeout(() => {
        shufflePuzzle();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [pieces.length, isRunning, isSolved, moves, time, shufflePuzzle]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && !isSolved) {
      interval = setInterval(() => {
        setTime((t) => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, isSolved]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getPieceStyle = (piece: PuzzlePiece) => {
    const row = Math.floor(piece.correctPos / gridSize);
    const col = piece.correctPos % gridSize;
    const size = 100 / gridSize;
    
    return {
      backgroundImage: `url(${puzzle?.imageUrl})`,
      backgroundSize: `${gridSize * 100}%`,
      backgroundPosition: `${col * (100 / (gridSize - 1))}% ${row * (100 / (gridSize - 1))}%`,
      width: `${size}%`,
      height: `${size}%`,
    };
  };

  const getPiecePosition = (currentPos: number) => {
    const row = Math.floor(currentPos / gridSize);
    const col = currentPos % gridSize;
    return {
      left: `${(col / gridSize) * 100}%`,
      top: `${(row / gridSize) * 100}%`,
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!puzzle) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Puzzle bulunamadı</p>
          <Button onClick={() => navigate("/puzzles")} data-testid="button-back">
            {t("puzzle.back")}
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
            onClick={() => navigate("/puzzles")}
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-bold text-lg">{puzzle.title}</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="p-4 max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-4 bg-white rounded-xl p-3 shadow-sm">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-purple-500" />
            <span data-testid="text-time">{formatTime(time)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Move className="h-4 w-4 text-pink-500" />
            <span data-testid="text-moves">{moves} {t("puzzle.moves")}</span>
          </div>
          {puzzle.bestTime && (
            <div className="flex items-center gap-2 text-sm text-yellow-600">
              <Trophy className="h-4 w-4" />
              <span>{formatTime(puzzle.bestTime)}</span>
            </div>
          )}
        </div>

        <div 
          className="relative aspect-square bg-white rounded-xl shadow-lg overflow-hidden mb-4"
          style={{ touchAction: "none" }}
        >
          {pieces.map((piece) => (
            <motion.div
              key={piece.id}
              className={`absolute cursor-pointer transition-all ${
                selectedPiece === piece.id ? "ring-4 ring-pink-500 z-10" : ""
              } ${piece.currentPos === piece.correctPos ? "opacity-100" : "opacity-95"}`}
              style={{
                ...getPieceStyle(piece),
                ...getPiecePosition(piece.currentPos),
              }}
              onClick={() => handlePieceClick(piece)}
              whileTap={{ scale: 0.95 }}
              layout
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              data-testid={`puzzle-piece-${piece.id}`}
            >
              <div className="absolute inset-0 border border-white/30" />
            </motion.div>
          ))}
        </div>

        <div className="flex gap-3">
          <Button
            onClick={shufflePuzzle}
            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500"
            data-testid="button-shuffle"
          >
            <Shuffle className="h-4 w-4 mr-2" />
            {t("puzzle.shuffle")}
          </Button>
        </div>
      </main>

      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCelebration(false)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">{t("puzzle.congratulations")}</h2>
              <p className="text-gray-600 mb-4">{t("puzzle.completedDesc")}</p>
              
              <div className="flex justify-center gap-6 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{formatTime(time)}</p>
                  <p className="text-sm text-gray-500">{t("puzzle.time")}</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-pink-600">{moves}</p>
                  <p className="text-sm text-gray-500">{t("puzzle.moves")}</p>
                </div>
              </div>
              
              {isNewRecord && (
                <div className="bg-yellow-100 text-yellow-800 rounded-lg py-2 px-4 mb-4 flex items-center justify-center gap-2">
                  <Trophy className="h-5 w-5" />
                  <span className="font-medium">{t("puzzle.newRecord")}</span>
                </div>
              )}
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate("/puzzles")}
                  data-testid="button-back-to-puzzles"
                >
                  {t("puzzle.back")}
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500"
                  onClick={() => {
                    setShowCelebration(false);
                    initializePuzzle();
                    setTimeout(shufflePuzzle, 100);
                  }}
                  data-testid="button-play-again"
                >
                  {t("puzzle.playAgain")}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
