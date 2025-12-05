import { useState, useRef, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { ArrowLeft, Eraser, Undo2, Download, Share2, Trash2 } from "lucide-react";
import { packs } from "@/lib/mock-data";
import { motion } from "framer-motion";

const COLORS = [
  "#FF6B6B", "#FF8E53", "#FFCD56", "#4BC0C0", "#36A2EB", 
  "#9966FF", "#FF6384", "#C9CBCF", "#4D5360", "#FFFFFF",
  "#8B4513", "#228B22", "#FF1493", "#00CED1", "#FFD700"
];

const BRUSH_SIZES = [4, 8, 16, 24, 32];

export default function Coloring() {
  const [, params] = useRoute("/coloring/:id");
  const [, setLocation] = useLocation();
  const { t } = useI18n();
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState(COLORS[0]);
  const [brushSize, setBrushSize] = useState(16);
  const [isEraser, setIsEraser] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

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
    const ctx = canvas.getContext("2d");
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
    const ctx = canvas?.getContext("2d");
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
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const newIndex = historyIndex - 1;
    ctx.putImageData(history[newIndex], 0, 0);
    setHistoryIndex(newIndex);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !image) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      saveToHistory();
    };
    img.src = image.url;
  };

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

  const startDrawing = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    const { x, y } = getCoordinates(e);
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = brushSize;
    ctx.strokeStyle = isEraser ? "#FFFFFF" : currentColor;
  };

  const draw = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveToHistory();
    }
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `magiccolors-${imageId}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
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
      <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLocation(`/view/${imageId}`)}
          data-testid="button-back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="font-bold text-lg">{t("coloring.title")}</h1>
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

      <div 
        ref={containerRef}
        className="flex-1 flex items-center justify-center p-4 overflow-hidden"
      >
        <canvas
          ref={canvasRef}
          className="bg-white shadow-lg rounded-lg touch-none"
          style={{ maxWidth: "100%", maxHeight: "100%" }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          data-testid="canvas-coloring"
        />
      </div>

      <div className="bg-white shadow-lg p-4 space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Button
            variant={isEraser ? "default" : "outline"}
            size="icon"
            className="shrink-0"
            onClick={() => setIsEraser(!isEraser)}
            data-testid="button-eraser"
          >
            <Eraser className="h-5 w-5" />
          </Button>
          
          {COLORS.map((color) => (
            <motion.button
              key={color}
              whileTap={{ scale: 0.9 }}
              className={`shrink-0 w-10 h-10 rounded-full border-2 transition-all ${
                currentColor === color && !isEraser
                  ? "border-gray-800 scale-110"
                  : "border-gray-200"
              }`}
              style={{ backgroundColor: color }}
              onClick={() => {
                setCurrentColor(color);
                setIsEraser(false);
              }}
              data-testid={`color-${color.replace("#", "")}`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground shrink-0">{t("coloring.brushSize")}:</span>
          <div className="flex gap-2">
            {BRUSH_SIZES.map((size) => (
              <Button
                key={size}
                variant={brushSize === size ? "default" : "outline"}
                size="sm"
                onClick={() => setBrushSize(size)}
                data-testid={`brush-size-${size}`}
              >
                {size}
              </Button>
            ))}
          </div>
        </div>

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
      </div>
    </div>
  );
}
