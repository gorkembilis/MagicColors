import { useState } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { ArrowLeft, RotateCcw, Volume2 } from "lucide-react";
import { useSound } from "@/lib/sounds";
import { CelebrationModal } from "@/components/Confetti";

const ALPHABET_COLORS: { [key: string]: string } = {
  A: "#FF6B6B",
  B: "#4BC0C0",
  C: "#FFCD56",
  Ç: "#228B22",
  D: "#FF8E53",
  E: "#9966FF",
  F: "#FF6384",
  G: "#36A2EB",
  Ğ: "#8B4513",
  H: "#00CED1",
  I: "#FFD700",
  İ: "#FF4500",
  J: "#32CD32",
  K: "#1E90FF",
  L: "#FF69B4",
  M: "#FFA07A",
  N: "#20B2AA",
  O: "#DDA0DD",
  Ö: "#87CEEB",
  P: "#F0E68C",
  R: "#E6E6FA",
  S: "#98FB98",
  Ş: "#DEB887",
  T: "#FFDAB9",
  U: "#B0E0E6",
  Ü: "#D8BFD8",
  V: "#F5DEB3",
  Y: "#FFFACD",
  Z: "#E0FFFF",
};

const ALPHABET_PATTERNS = [
  {
    id: "star",
    name: "Yıldız",
    grid: [
      ["", "", "", "A", "", "", ""],
      ["", "", "A", "A", "A", "", ""],
      ["A", "A", "A", "B", "A", "A", "A"],
      ["", "A", "B", "B", "B", "A", ""],
      ["", "A", "B", "B", "B", "A", ""],
      ["", "", "A", "A", "A", "", ""],
      ["", "A", "", "", "", "A", ""],
    ],
  },
  {
    id: "heart",
    name: "Kalp",
    grid: [
      ["", "A", "A", "", "A", "A", ""],
      ["A", "A", "A", "A", "A", "A", "A"],
      ["A", "A", "A", "A", "A", "A", "A"],
      ["", "A", "A", "A", "A", "A", ""],
      ["", "", "A", "A", "A", "", ""],
      ["", "", "", "A", "", "", ""],
    ],
  },
  {
    id: "fish",
    name: "Balık",
    grid: [
      ["", "", "", "B", "B", "", "", ""],
      ["", "", "B", "C", "C", "B", "", ""],
      ["B", "B", "B", "C", "E", "C", "B", ""],
      ["B", "B", "B", "C", "C", "C", "B", ""],
      ["", "", "B", "C", "C", "B", "", ""],
      ["", "", "", "B", "B", "", "", ""],
    ],
  },
];

export default function PaintByAlphabet() {
  const { t, language } = useI18n();
  const { playColorSelect, playCelebration } = useSound();
  const [selectedPattern, setSelectedPattern] = useState(ALPHABET_PATTERNS[0]);
  const [selectedLetter, setSelectedLetter] = useState<string>("A");
  const [coloredCells, setColoredCells] = useState<{ [key: string]: string }>({});
  const [showCelebration, setShowCelebration] = useState(false);
  const [patternSelectMode, setPatternSelectMode] = useState(true);

  const cellSize = 45;
  const gridWidth = selectedPattern.grid[0].length * cellSize;
  const gridHeight = selectedPattern.grid.length * cellSize;

  const usedLetters = Array.from(new Set(selectedPattern.grid.flat().filter(l => l !== "")));

  const speakLetter = (letter: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      return;
    }
    try {
      const utterance = new SpeechSynthesisUtterance(letter);
      utterance.lang = language === "tr" ? "tr-TR" : "en-US";
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.log('Speech synthesis not available');
    }
  };

  const handleCellClick = (row: number, col: number) => {
    const cellLetter = selectedPattern.grid[row][col];
    if (cellLetter === "") return;

    const key = `${row}-${col}`;
    
    if (cellLetter === selectedLetter) {
      const colorHex = ALPHABET_COLORS[selectedLetter] || "#ccc";
      setColoredCells(prev => ({ ...prev, [key]: colorHex }));
      playColorSelect();
      checkCompletion({ ...coloredCells, [key]: colorHex });
    }
  };

  const checkCompletion = (cells: { [key: string]: string }) => {
    let totalCells = 0;
    let coloredCount = 0;

    selectedPattern.grid.forEach((row, ri) => {
      row.forEach((cell, ci) => {
        if (cell !== "") {
          totalCells++;
          if (cells[`${ri}-${ci}`]) {
            coloredCount++;
          }
        }
      });
    });

    if (coloredCount === totalCells) {
      playCelebration();
      setShowCelebration(true);
    }
  };

  const resetCanvas = () => {
    setColoredCells({});
  };

  const selectPattern = (pattern: typeof ALPHABET_PATTERNS[0]) => {
    setSelectedPattern(pattern);
    setColoredCells({});
    setPatternSelectMode(false);
    const letters = Array.from(new Set(pattern.grid.flat().filter(l => l !== "")));
    setSelectedLetter(letters[0] || "A");
  };

  if (patternSelectMode) {
    return (
      <MobileLayout headerTitle={t("paintByAlphabet.title") || "Alfabeyle Boya"}>
        <div className="px-4 py-6 space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-bold mb-2">
              {t("paintByAlphabet.selectPattern") || "Desen Seç"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("paintByAlphabet.selectPatternDesc") || "Harflerle boyamak için bir desen seç"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {ALPHABET_PATTERNS.map((pattern) => (
              <motion.div
                key={pattern.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => selectPattern(pattern)}
                className="cursor-pointer"
              >
                <div className="bg-white rounded-xl p-4 shadow-md border-2 border-transparent hover:border-primary transition-colors">
                  <div className="aspect-square bg-gray-50 rounded-lg mb-2 flex items-center justify-center overflow-hidden">
                    <svg
                      width={pattern.grid[0].length * 12}
                      height={pattern.grid.length * 12}
                    >
                      {pattern.grid.map((row, ri) =>
                        row.map((cell, ci) => (
                          <rect
                            key={`${ri}-${ci}`}
                            x={ci * 12}
                            y={ri * 12}
                            width={12}
                            height={12}
                            fill={cell === "" ? "transparent" : ALPHABET_COLORS[cell] || "#ccc"}
                            stroke="#ddd"
                            strokeWidth={0.5}
                          />
                        ))
                      )}
                    </svg>
                  </div>
                  <p className="text-center font-bold text-sm">{pattern.name}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <CelebrationModal
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        title={t("paintByAlphabet.complete") || "Harika!"}
        subtitle={t("paintByAlphabet.completeDesc") || "Tüm harfleri boyadın!"}
        buttonText={t("paintByAlphabet.continue") || "Devam"}
      />
      
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setPatternSelectMode(true)}
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-bold">{selectedPattern.name}</h1>
          <Button variant="ghost" size="icon" onClick={resetCanvas} data-testid="button-reset">
            <RotateCcw className="h-5 w-5" />
          </Button>
        </header>

        <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
          <svg
            width={gridWidth}
            height={gridHeight}
            className="bg-white shadow-lg rounded-lg"
          >
            {selectedPattern.grid.map((row, ri) =>
              row.map((cell, ci) => {
                const key = `${ri}-${ci}`;
                const isColored = coloredCells[key];
                
                return (
                  <g key={key} onClick={() => handleCellClick(ri, ci)}>
                    <rect
                      x={ci * cellSize}
                      y={ri * cellSize}
                      width={cellSize}
                      height={cellSize}
                      fill={isColored || (cell === "" ? "#fff" : "#f5f5f5")}
                      stroke="#ddd"
                      strokeWidth={1}
                      className={cell !== "" ? "cursor-pointer" : ""}
                    />
                    {cell !== "" && !isColored && (
                      <text
                        x={ci * cellSize + cellSize / 2}
                        y={ri * cellSize + cellSize / 2 + 6}
                        textAnchor="middle"
                        fontSize={16}
                        fontWeight="bold"
                        fill="#666"
                      >
                        {cell}
                      </text>
                    )}
                    {isColored && (
                      <text
                        x={ci * cellSize + cellSize / 2}
                        y={ri * cellSize + cellSize / 2 + 5}
                        textAnchor="middle"
                        fontSize={14}
                        fill="white"
                        fontWeight="bold"
                      >
                        ✓
                      </text>
                    )}
                  </g>
                );
              })
            )}
          </svg>
        </div>

        <div className="bg-white shadow-lg p-4 space-y-4">
          <p className="text-center text-sm font-medium text-muted-foreground">
            {t("paintByAlphabet.selectLetter") || "Harf seç ve aynı harfli kutulara dokun"}
          </p>
          
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {usedLetters.map((letter) => (
              <motion.button
                key={letter}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setSelectedLetter(letter);
                  speakLetter(letter);
                }}
                className={`flex items-center justify-center w-14 h-14 rounded-xl border-2 text-lg font-bold transition-all ${
                  selectedLetter === letter
                    ? "border-gray-800 scale-110 shadow-md"
                    : "border-gray-200"
                }`}
                style={{ backgroundColor: ALPHABET_COLORS[letter] || "#ccc" }}
                data-testid={`letter-${letter}`}
              >
                <span className="text-white drop-shadow-md">{letter}</span>
              </motion.button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            className="mx-auto flex"
            onClick={() => speakLetter(selectedLetter)}
          >
            <Volume2 className="w-4 h-4 mr-2" />
            {t("paintByAlphabet.pronounce") || "Harfi Söyle"}
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
}
