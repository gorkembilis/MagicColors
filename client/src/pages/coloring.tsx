import { useState, useRef, useEffect, useCallback } from "react";
import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { useSound } from "@/lib/sounds";
import { CelebrationModal } from "@/components/Confetti";
import { ArrowLeft, Undo2, Download, Share2, Trash2, Check, Droplet } from "lucide-react";
import { packs } from "@/lib/mock-data";
import { motion } from "framer-motion";

const COLORS = [
  "#FF6B6B", "#FF8E53", "#FFCD56", "#4BC0C0", "#36A2EB", 
  "#9966FF", "#FF6384", "#C9CBCF", "#4D5360", "#FFFFFF",
  "#8B4513", "#228B22", "#FF1493", "#00CED1", "#FFD700",
  "#FF4500", "#32CD32", "#1E90FF", "#FF69B4", "#FFA07A"
];

export default function Coloring() {
  const [, params] = useRoute("/coloring/:id");
  const [, setLocation] = useLocation();
  const { t } = useI18n();
  const { playColorSelect, playCelebration, playClick } = useSound();
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentColor, setCurrentColor] = useState(COLORS[0]);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [showCelebration, setShowCelebration] = useState(false);
  const [isFilling, setIsFilling] = useState(false);

  const imageId = params?.id;
  
  const findImage = () => {
    for (const pack of packs) {
      const found = pack.images.find(img => img.id === imageId);
      if (found) return found;
    }
    return null;
  };

  const image = findImage();

  useEffect(() => {
    if (!image || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const aspectRatio = img.width / img.height;
      let drawWidth = containerWidth;
      let drawHeight = containerWidth / aspectRatio;

      if (drawHeight > containerHeight) {
        drawHeight = containerHeight;
        drawWidth = containerHeight * aspectRatio;
      }

      canvas.width = drawWidth;
      canvas.height = drawHeight;
      setCanvasSize({ width: drawWidth, height: drawHeight });

      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, drawWidth, drawHeight);
      ctx.drawImage(img, 0, 0, drawWidth, drawHeight);
      
      saveToHistory();
      setImageLoaded(true);
    };
    img.src = image.url;
  }, [image]);

  const saveToHistory = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { willReadFrequently: true });
    if (!canvas || !ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(imageData);
    
    if (newHistory.length > 50) {
      newHistory.shift();
    }
    
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex <= 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { willReadFrequently: true });
    if (!canvas || !ctx) return;

    const newIndex = historyIndex - 1;
    ctx.putImageData(history[newIndex], 0, 0);
    setHistoryIndex(newIndex);
    playClick();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { willReadFrequently: true });
    if (!canvas || !ctx || !image) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      saveToHistory();
      playClick();
    };
    img.src = image.url;
  };

  const hexToRgb = (hex: string): [number, number, number] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result 
      ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
      : [0, 0, 0];
  };

  const colorMatch = (
    data: Uint8ClampedArray, 
    idx: number, 
    targetR: number, 
    targetG: number, 
    targetB: number, 
    tolerance: number
  ): boolean => {
    return (
      Math.abs(data[idx] - targetR) <= tolerance &&
      Math.abs(data[idx + 1] - targetG) <= tolerance &&
      Math.abs(data[idx + 2] - targetB) <= tolerance
    );
  };

  const floodFill = useCallback((startX: number, startY: number, fillColor: string) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { willReadFrequently: true });
    if (!canvas || !ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    const x = Math.floor(startX);
    const y = Math.floor(startY);

    if (x < 0 || x >= width || y < 0 || y >= height) return;

    const startIdx = (y * width + x) * 4;
    const targetR = data[startIdx];
    const targetG = data[startIdx + 1];
    const targetB = data[startIdx + 2];

    const [fillR, fillG, fillB] = hexToRgb(fillColor);

    if (targetR === fillR && targetG === fillG && targetB === fillB) return;

    const isBlackLine = targetR < 50 && targetG < 50 && targetB < 50;
    if (isBlackLine) return;

    const tolerance = 32;
    const stack: [number, number][] = [[x, y]];
    const visited = new Set<string>();

    while (stack.length > 0) {
      const [cx, cy] = stack.pop()!;
      const key = `${cx},${cy}`;

      if (visited.has(key)) continue;
      if (cx < 0 || cx >= width || cy < 0 || cy >= height) continue;

      const idx = (cy * width + cx) * 4;

      if (!colorMatch(data, idx, targetR, targetG, targetB, tolerance)) continue;

      visited.add(key);

      data[idx] = fillR;
      data[idx + 1] = fillG;
      data[idx + 2] = fillB;
      data[idx + 3] = 255;

      stack.push([cx + 1, cy]);
      stack.push([cx - 1, cy]);
      stack.push([cx, cy + 1]);
      stack.push([cx, cy - 1]);
    }

    ctx.putImageData(imageData, 0, 0);
  }, []);

  const getCoordinates = (e: React.TouchEvent | React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ("touches" in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY
      };
    } else {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      };
    }
  };

  const handleCanvasClick = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    if (isFilling) return;
    
    setIsFilling(true);
    const { x, y } = getCoordinates(e);
    
    requestAnimationFrame(() => {
      floodFill(x, y, currentColor);
      saveToHistory();
      playColorSelect();
      setIsFilling(false);
    });
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `magiccolors-${imageId}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handleFinish = () => {
    playCelebration();
    setShowCelebration(true);
  };

  const shareImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b!), "image/png");
      });

      if (navigator.share && navigator.canShare({ files: [new File([blob], "test.png", { type: "image/png" })] })) {
        const file = new File([blob], `magiccolors-${imageId}.png`, { type: "image/png" });
        await navigator.share({
          files: [file],
          title: t("share.title"),
          text: t("share.text")
        });
      } else {
        downloadImage();
      }
    } catch (error) {
      downloadImage();
    }
  };

  if (!image) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>{t("coloring.notFound")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <CelebrationModal 
        isOpen={showCelebration} 
        onClose={() => setShowCelebration(false)}
        title={t("coloring.celebration")}
        subtitle={t("coloring.celebrationDesc")}
        buttonText={t("coloring.continue")}
      />
      <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLocation(`/view/${imageId}`)}
          data-testid="button-back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <Droplet className="h-5 w-5 text-primary" />
          <h1 className="font-bold text-lg">{t("coloring.title")}</h1>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={undo}
            disabled={historyIndex <= 0}
            data-testid="button-undo"
          >
            <Undo2 className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={clearCanvas}
            data-testid="button-clear"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Fill Instruction */}
      <div className="bg-primary/10 px-4 py-2 text-center">
        <p className="text-sm text-primary font-medium flex items-center justify-center gap-2">
          <Droplet className="h-4 w-4" />
          {t("coloring.tapToFill") || "Boyamak için bölgeye dokun"}
        </p>
      </div>

      <div 
        ref={containerRef}
        className="flex-1 flex items-center justify-center p-4 overflow-hidden"
      >
        <canvas
          ref={canvasRef}
          className={`bg-white shadow-lg rounded-lg touch-none ${isFilling ? 'opacity-90' : ''}`}
          style={{ maxWidth: "100%", maxHeight: "100%" }}
          onClick={handleCanvasClick}
          onTouchEnd={handleCanvasClick}
          data-testid="canvas-coloring"
        />
      </div>

      <div className="bg-white shadow-lg p-4 space-y-4">
        {/* Color Palette */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {COLORS.map((color) => (
            <motion.button
              key={color}
              whileTap={{ scale: 0.9 }}
              className={`shrink-0 w-11 h-11 rounded-full border-2 transition-all shadow-sm ${
                currentColor === color
                  ? "border-gray-800 scale-110 ring-2 ring-primary ring-offset-2"
                  : "border-gray-200"
              }`}
              style={{ backgroundColor: color }}
              onClick={() => {
                setCurrentColor(color);
                playColorSelect();
              }}
              data-testid={`color-${color.replace("#", "")}`}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            className="flex-1"
            variant="outline"
            onClick={downloadImage}
            data-testid="button-download"
          >
            <Download className="h-4 w-4 mr-2" />
            {t("coloring.download")}
          </Button>
          <Button
            className="flex-1"
            onClick={shareImage}
            data-testid="button-share"
          >
            <Share2 className="h-4 w-4 mr-2" />
            {t("coloring.share")}
          </Button>
        </div>
        
        <Button
          className="w-full bg-green-500 hover:bg-green-600"
          onClick={handleFinish}
          data-testid="button-finish"
        >
          <Check className="h-4 w-4 mr-2" />
          {t("coloring.finish")}
        </Button>
      </div>
    </div>
  );
}
