import React, { useRef, useState, useEffect } from 'react';
import { Sparkles, Trash2, Download, Star, Palette, Stamp } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSound, speakText } from '../utils/audio';

interface MagicDoodleProps {
  soundEnabled: boolean;
  onEarnStar: () => void;
}

export const MagicDoodleModule: React.FC<MagicDoodleProps> = ({ soundEnabled, onEarnStar }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState('#ec4899'); // default pink
  const [brushSize, setBrushSize] = useState(12);
  const [activeTool, setActiveTool] = useState<'brush' | 'stamp' | 'rainbow'>('brush');
  const [selectedStamp, setSelectedStamp] = useState('⭐');
  const [hasDrawn, setHasDrawn] = useState(false);

  const colors = [
    { name: 'Pink', hex: '#ec4899' },
    { name: 'Red', hex: '#ef4444' },
    { name: 'Orange', hex: '#f97316' },
    { name: 'Yellow', hex: '#eab308' },
    { name: 'Green', hex: '#10b981' },
    { name: 'Sky Blue', hex: '#0ea5e9' },
    { name: 'Purple', hex: '#8b5cf6' },
    { name: 'Black', hex: '#1e293b' },
  ];

  const stamps = ['⭐', '🚀', '🐱', '🌸', '🦖', '🍦', '🎈', '❤️'];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set background to clean white
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCanvasCoordinates(e);

    if (activeTool === 'stamp') {
      ctx.font = `${brushSize * 3.5}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(selectedStamp, x, y);
      playSound('pop');
      if (!hasDrawn) {
        setHasDrawn(true);
        onEarnStar();
      }
      return;
    }

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = brushSize;

    if (activeTool === 'rainbow') {
      const hue = Math.floor(Math.random() * 360);
      ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
    } else {
      ctx.strokeStyle = currentColor;
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || activeTool === 'stamp') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCanvasCoordinates(e);

    if (activeTool === 'rainbow') {
      const hue = (Date.now() / 10) % 360;
      ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
    }

    ctx.lineTo(x, y);
    ctx.stroke();

    if (!hasDrawn) {
      setHasDrawn(true);
      onEarnStar();
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.closePath();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    playSound('pop');
    speakText('Clean fresh canvas!', soundEnabled);
  };

  const downloadDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `kid-masterpiece-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    playSound('cheer');
    confetti({ particleCount: 50, spread: 60 });
    speakText('Saved your beautiful drawing!', soundEnabled);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-3 sm:p-4 border border-purple-100 flex flex-wrap items-center justify-between gap-2 shadow-sm">
        <div>
          <h2 className="text-base sm:text-lg font-black text-purple-900 flex items-center gap-1.5">
            <span>✨</span> Kids Magic Doodle & Canvas
          </h2>
          <p className="text-xs text-purple-700 font-medium">Draw with your finger on phone screen or place fun stickers!</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={clearCanvas}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-1 shadow-sm"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
          <button
            onClick={downloadDrawing}
            className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm shadow-purple-200"
          >
            <Download className="w-3.5 h-3.5" />
            Save Drawing
          </button>
        </div>
      </div>

      {/* Control Toolbox */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        {/* Tool selector */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => {
              setActiveTool('brush');
              playSound('tap');
            }}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
              activeTool === 'brush' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            Brush
          </button>
          <button
            onClick={() => {
              setActiveTool('rainbow');
              playSound('tap');
            }}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
              activeTool === 'rainbow' ? 'bg-gradient-to-r from-rose-500 via-amber-500 to-indigo-500 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Rainbow
          </button>
          <button
            onClick={() => {
              setActiveTool('stamp');
              playSound('tap');
            }}
            className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
              activeTool === 'stamp' ? 'bg-pink-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Stamp className="w-3.5 h-3.5" />
            Stamps
          </button>
        </div>

        {/* Color Palette or Stamps depending on tool */}
        {activeTool === 'stamp' ? (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {stamps.map(s => (
              <button
                key={s}
                onClick={() => {
                  setSelectedStamp(s);
                  playSound('pop');
                }}
                className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center border-2 transition-all ${
                  selectedStamp === s ? 'border-pink-500 bg-pink-100 scale-110' : 'border-slate-200 bg-slate-50'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {colors.map(c => (
              <button
                key={c.hex}
                onClick={() => {
                  setCurrentColor(c.hex);
                  playSound('tap');
                }}
                className={`w-7 h-7 rounded-full transition-transform border-2 ${
                  currentColor === c.hex && activeTool === 'brush' ? 'scale-125 border-slate-900 shadow-md' : 'border-white scale-100'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>
        )}

        {/* Brush Size */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Size:</span>
          {[6, 12, 22].map(sz => (
            <button
              key={sz}
              onClick={() => setBrushSize(sz)}
              className={`w-7 h-7 rounded-xl flex items-center justify-center border text-xs font-bold ${
                brushSize === sz ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {sz === 6 ? 'S' : sz === 12 ? 'M' : 'L'}
            </button>
          ))}
        </div>
      </div>

      {/* Drawing Canvas (Mobile touch gestures enabled with touch-action none) */}
      <div className="bg-white rounded-3xl p-2 border-2 border-purple-200 shadow-inner overflow-hidden flex justify-center">
        <canvas
          ref={canvasRef}
          width={800}
          height={480}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          style={{ touchAction: 'none' }}
          className="w-full max-w-full h-[320px] sm:h-[420px] rounded-2xl bg-white cursor-crosshair border border-slate-100"
        />
      </div>
    </div>
  );
};
