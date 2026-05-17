import { useRef, useEffect, useState } from 'react';
import { RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import { Vector } from '../App';

interface Simulation2DProps {
  vectors: Vector[];
  showGrid: boolean;
  showResultant: boolean;
  resultant: { x: number; y: number; z: number };
}

export function Simulation2D({ vectors, showGrid, showResultant, resultant }: Simulation2DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const scale = 20 * zoom;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2 + pan.x;
    const centerY = canvas.height / 2 + pan.y;

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = '#2a2a2a';
      ctx.lineWidth = 1;

      const gridSize = scale;
      const startX = (centerX % gridSize) - gridSize;
      const startY = (centerY % gridSize) - gridSize;

      for (let x = startX; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      for (let y = startY; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    }

    // Draw axes
    ctx.strokeStyle = '#4a4a4a';
    ctx.lineWidth = 2;

    // X-axis
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvas.width, centerY);
    ctx.stroke();

    // Y-axis
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, canvas.height);
    ctx.stroke();

    // Draw axis labels
    ctx.fillStyle = '#6a6a6a';
    ctx.font = '12px monospace';
    ctx.fillText('X', canvas.width - 20, centerY - 10);
    ctx.fillText('Y', centerX + 10, 20);

    // Draw vectors
    vectors.forEach((vector, index) => {
      const endX = centerX + vector.x * scale;
      const endY = centerY - vector.y * scale;

      drawArrow(ctx, centerX, centerY, endX, endY, vector.color);

      // Draw label
      ctx.fillStyle = vector.color;
      ctx.font = '11px monospace';
      ctx.fillText(`V${index + 1}`, endX + 8, endY - 8);
    });

    // Draw resultant vector
    if (showResultant && vectors.length > 0) {
      const endX = centerX + resultant.x * scale;
      const endY = centerY - resultant.y * scale;

      drawArrow(ctx, centerX, centerY, endX, endY, '#10b981', 3);

      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 12px monospace';
      ctx.fillText('R', endX + 8, endY - 8);
    }
  }, [vectors, showGrid, showResultant, resultant, zoom, pan]);

  const drawArrow = (
    ctx: CanvasRenderingContext2D,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    color: string,
    lineWidth = 2
  ) => {
    const headlen = 12;
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx);

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = lineWidth;

    // Draw line
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    // Draw arrowhead
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(
      toX - headlen * Math.cos(angle - Math.PI / 6),
      toY - headlen * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      toX - headlen * Math.cos(angle + Math.PI / 6),
      toY - headlen * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fill();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(Math.max(0.1, Math.min(5, zoom * delta)));
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="h-full w-full relative bg-[#0f0f0f]">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      />

      {/* Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <button
          onClick={() => setZoom(Math.min(5, zoom * 1.2))}
          className="w-10 h-10 bg-[#2a2a2a] hover:bg-[#333] rounded flex items-center justify-center transition-colors"
          title="Zoom In"
        >
          <ZoomIn size={18} />
        </button>
        <button
          onClick={() => setZoom(Math.max(0.1, zoom * 0.8))}
          className="w-10 h-10 bg-[#2a2a2a] hover:bg-[#333] rounded flex items-center justify-center transition-colors"
          title="Zoom Out"
        >
          <ZoomOut size={18} />
        </button>
        <button
          onClick={resetView}
          className="w-10 h-10 bg-[#2a2a2a] hover:bg-[#333] rounded flex items-center justify-center transition-colors"
          title="Reset View"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      {/* Instructions */}
      <div className="absolute top-4 left-4 bg-[#1a1a1a]/90 backdrop-blur-sm px-4 py-2 rounded text-xs text-gray-400">
        <div>Drag to pan • Scroll to zoom</div>
      </div>
    </div>
  );
}
