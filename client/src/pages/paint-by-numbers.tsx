import { useState, useRef, useEffect } from "react";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { ArrowLeft, Download, RotateCcw, Check } from "lucide-react";
import { useLocation } from "wouter";
import { useSound } from "@/lib/sounds";
import { CelebrationModal } from "@/components/Confetti";

const COLOR_LEGEND = [
  { number: 1, color: "#FF6B6B", name: "Kırmızı" },
  { number: 2, color: "#4BC0C0", name: "Mavi" },
  { number: 3, color: "#FFCD56", name: "Sarı" },
  { number: 4, color: "#228B22", name: "Yeşil" },
  { number: 5, color: "#FF8E53", name: "Turuncu" },
  { number: 6, color: "#9966FF", name: "Mor" },
];

const SIMPLE_PATTERNS = [
  {
    id: "flower",
    name: "Çiçek",
    grid: [
      [0, 0, 3, 3, 3, 0, 0],
      [0, 3, 1, 1, 1, 3, 0],
      [3, 1, 3, 3, 3, 1, 3],
      [3, 1, 3, 3, 3, 1, 3],
      [3, 1, 3, 3, 3, 1, 3],
      [0, 3, 1, 1, 1, 3, 0],
      [0, 0, 4, 4, 4, 0, 0],
      [0, 0, 4, 4, 4, 0, 0],
    ],
  },
  {
    id: "butterfly",
    name: "Kelebek",
    grid: [
      [1, 1, 0, 0, 0, 1, 1],
      [1, 5, 1, 0, 1, 5, 1],
      [1, 5, 5, 2, 5, 5, 1],
      [1, 1, 5, 2, 5, 1, 1],
      [0, 0, 0, 2, 0, 0, 0],
      [0, 0, 0, 2, 0, 0, 0],
    ],
  },
  {
    id: "house",
    name: "Ev",
    grid: [
      [0, 0, 1, 1, 1, 0, 0],
      [0, 1, 1, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1],
      [3, 3, 3, 3, 3, 3, 3],
      [3, 2, 2, 3, 3, 3, 3],
      [3, 2, 2, 3, 5, 5, 3],
      [3, 2, 2, 3, 5, 5, 3],
    ],
  },
];

export default function PaintByNumbers() {
  const { t } = useI18n();
  const [, setLocation] = useLocation();
  const { playColorSelect, playCelebration } = useSound();
  const [selectedPattern, setSelectedPattern] = useState(SIMPLE_PATTERNS[0]);
  const [selectedColor, setSelectedColor] = useState<number>(1);
  const [coloredCells, setColoredCells] = useState<{ [key: string]: string }>({});
  const [showCelebration, setShowCelebration] = useState(false);
  const [patternSelectMode, setPatternSelectMode] = useState(true);

  const cellSize = 40;
  const gridWidth = selectedPattern.grid[0].length * cellSize;
  const gridHeight = selectedPattern.grid.length * cellSize;

  const handleCellClick = (row: number, col: number) => {
    const cellNumber = selectedPattern.grid[row][col];
    if (cellNumber === 0) return;

    const key = `${row}-${col}`;
    
    if (cellNumber === selectedColor) {
      const colorHex = COLOR_LEGEND.find(c => c.number === selectedColor)?.color || "#ccc";
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
        if (cell !== 0) {
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

  const selectPattern = (pattern: typeof SIMPLE_PATTERNS[0]) => {
    setSelectedPattern(pattern);
    setColoredCells({});
    setPatternSelectMode(false);
  };

  if (patternSelectMode) {
    return (
      <MobileLayout headerTitle={t("paintByNumbers.title") || "Sayılarla Boya"}>
        <div className="px-4 py-6 space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-bold mb-2">
              {t("paintByNumbers.selectPattern") || "Desen Seç"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t("paintByNumbers.selectPatternDesc") || "Boyamak için bir desen seç"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {SIMPLE_PATTERNS.map((pattern) => (
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
                            fill={cell === 0 ? "transparent" : COLOR_LEGEND.find(c => c.number === cell)?.color || "#ccc"}
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
        title={t("paintByNumbers.complete") || "Tebrikler!"}
        subtitle={t("paintByNumbers.completeDesc") || "Resmi tamamladın!"}
        buttonText={t("paintByNumbers.continue") || "Devam"}
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
                      fill={isColored || (cell === 0 ? "#fff" : "#f5f5f5")}
                      stroke="#ddd"
                      strokeWidth={1}
                      className={cell !== 0 ? "cursor-pointer" : ""}
                    />
                    {cell !== 0 && !isColored && (
                      <text
                        x={ci * cellSize + cellSize / 2}
                        y={ri * cellSize + cellSize / 2 + 5}
                        textAnchor="middle"
                        fontSize={14}
                        fontWeight="bold"
                        fill="#666"
                      >
                        {cell}
                      </text>
                    )}
                    {isColored && (
                      <text
                        x={ci * cellSize + cellSize / 2}
                        y={ri * cellSize + cellSize / 2 + 4}
                        textAnchor="middle"
                        fontSize={12}
                        fill="white"
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
            {t("paintByNumbers.selectNumber") || "Numara seç ve aynı numaralı kutulara dokun"}
          </p>
          
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {COLOR_LEGEND.map((item) => (
              <motion.button
                key={item.number}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedColor(item.number)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all ${
                  selectedColor === item.number
                    ? "border-gray-800 scale-110 shadow-md"
                    : "border-gray-200"
                }`}
                style={{ backgroundColor: item.color }}
                data-testid={`color-${item.number}`}
              >
                <span className="w-6 h-6 bg-white rounded-full flex items-center justify-center font-bold text-sm">
                  {item.number}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
