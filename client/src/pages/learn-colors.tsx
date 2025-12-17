import { useState, useEffect } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, Check, X, Star, Trophy, RefreshCw } from "lucide-react";
import { useSound } from "@/lib/sounds";

const COLORS = [
  { name: "Kırmızı", nameEn: "Red", hex: "#FF0000" },
  { name: "Mavi", nameEn: "Blue", hex: "#0000FF" },
  { name: "Sarı", nameEn: "Yellow", hex: "#FFFF00" },
  { name: "Yeşil", nameEn: "Green", hex: "#00FF00" },
  { name: "Turuncu", nameEn: "Orange", hex: "#FFA500" },
  { name: "Mor", nameEn: "Purple", hex: "#800080" },
  { name: "Pembe", nameEn: "Pink", hex: "#FFC0CB" },
  { name: "Kahverengi", nameEn: "Brown", hex: "#8B4513" },
  { name: "Siyah", nameEn: "Black", hex: "#000000" },
  { name: "Beyaz", nameEn: "White", hex: "#FFFFFF" },
];

export default function LearnColors() {
  const { t, language } = useI18n();
  const { playClick, playCelebration } = useSound();
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const [options, setOptions] = useState<typeof COLORS>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showResult, setShowResult] = useState<"correct" | "wrong" | null>(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const currentColor = COLORS[currentColorIndex];

  const generateOptions = () => {
    const correctAnswer = COLORS[currentColorIndex];
    const otherColors = COLORS.filter((_, i) => i !== currentColorIndex);
    const shuffledOthers = otherColors.sort(() => Math.random() - 0.5).slice(0, 3);
    const allOptions = [correctAnswer, ...shuffledOthers].sort(() => Math.random() - 0.5);
    setOptions(allOptions);
  };

  useEffect(() => {
    generateOptions();
  }, [currentColorIndex]);

  const speakColor = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      return;
    }
    try {
      const colorName = language === "tr" ? currentColor.name : currentColor.nameEn;
      const utterance = new SpeechSynthesisUtterance(colorName);
      utterance.lang = language === "tr" ? "tr-TR" : "en-US";
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.log('Speech synthesis not available');
    }
  };

  const handleAnswer = (selectedColor: typeof COLORS[0]) => {
    setTotalQuestions(prev => prev + 1);
    
    if (selectedColor.hex === currentColor.hex) {
      setShowResult("correct");
      setScore(prev => prev + 10 + streak * 2);
      setStreak(prev => prev + 1);
      playClick();
      
      setTimeout(() => {
        setShowResult(null);
        if (currentColorIndex < COLORS.length - 1) {
          setCurrentColorIndex(prev => prev + 1);
        } else {
          setGameComplete(true);
          playCelebration();
        }
      }, 1000);
    } else {
      setShowResult("wrong");
      setStreak(0);
      
      setTimeout(() => {
        setShowResult(null);
      }, 1000);
    }
  };

  const resetGame = () => {
    setCurrentColorIndex(0);
    setScore(0);
    setStreak(0);
    setTotalQuestions(0);
    setGameComplete(false);
    setShowResult(null);
  };

  if (gameComplete) {
    return (
      <MobileLayout headerTitle={t("learnColors.title") || "Renkleri Öğren"}>
        <div className="px-4 py-12 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
          >
            <div className="w-24 h-24 rounded-full bg-yellow-400 mx-auto mb-6 flex items-center justify-center">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">
              {t("learnColors.complete") || "Tebrikler!"}
            </h2>
            <p className="text-muted-foreground mb-4">
              {t("learnColors.allColorsLearned") || "Tüm renkleri öğrendin!"}
            </p>
            <div className="text-4xl font-bold text-primary mb-6">
              {score} {t("learnColors.points") || "Puan"}
            </div>
            <Button onClick={resetGame} size="lg" data-testid="button-play-again">
              <RefreshCw className="w-4 h-4 mr-2" />
              {t("learnColors.playAgain") || "Tekrar Oyna"}
            </Button>
          </motion.div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout headerTitle={t("learnColors.title") || "Renkleri Öğren"}>
      <div className="px-4 py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="font-bold">{score}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {currentColorIndex + 1} / {COLORS.length}
          </div>
          {streak > 1 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold"
            >
              🔥 {streak}
            </motion.div>
          )}
        </div>

        <motion.div
          key={currentColorIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-lg mb-4 font-medium">
            {t("learnColors.question") || "Bu renk hangisi?"}
          </p>
          
          <div className="relative">
            <motion.div
              whileTap={{ scale: 0.95 }}
              className="w-40 h-40 rounded-3xl mx-auto shadow-xl cursor-pointer"
              style={{ backgroundColor: currentColor.hex, border: currentColor.hex === "#FFFFFF" ? "2px solid #ddd" : "none" }}
              onClick={speakColor}
              data-testid="color-display"
            />
            <Button
              variant="outline"
              size="icon"
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full shadow-md"
              onClick={speakColor}
              data-testid="button-speak"
            >
              <Volume2 className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-3">
          {options.map((color, index) => (
            <motion.div
              key={color.hex}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Button
                variant="outline"
                className="w-full h-14 text-lg font-bold relative"
                onClick={() => handleAnswer(color)}
                disabled={showResult !== null}
                data-testid={`option-${color.nameEn.toLowerCase()}`}
              >
                <span
                  className="w-6 h-6 rounded-full mr-2 border"
                  style={{ backgroundColor: color.hex }}
                />
                {language === "tr" ? color.name : color.nameEn}
              </Button>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
            >
              <div className={`w-32 h-32 rounded-full flex items-center justify-center ${
                showResult === "correct" ? "bg-green-500" : "bg-red-500"
              }`}>
                {showResult === "correct" ? (
                  <Check className="w-16 h-16 text-white" />
                ) : (
                  <X className="w-16 h-16 text-white" />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MobileLayout>
  );
}
