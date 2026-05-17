import { useRef, useEffect, useState } from 'react';
import { RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import { Vector } from '../App';

interface Simulation3DProps {
  vectors: Vector[];
  showResultant: boolean;
  resultant: { x: number; y: number; z: number };
}

export function Simulation3D({ vectors, showResultant, resultant }: Simulation3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState({ x: 0.3, y: 0.5 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  const scale = 15 * zoom;

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

    // Project 3D point to 2D
    const project = (x: number, y: number, z: number) => {
      // Rotate around Y axis
      let x1 = x * Math.cos(rotation.y) - z * Math.sin(rotation.y);
      let z1 = x * Math.sin(rotation.y) + z * Math.cos(rotation.y);

      // Rotate around X axis
      let y1 = y * Math.cos(rotation.x) - z1 * Math.sin(rotation.x);
      let z2 = y * Math.sin(rotation.x) + z1 * Math.cos(rotation.x);

      // Perspective
      const perspective = 300;
      const p = perspective / (perspective + z2);

      return {
        x: centerX + x1 * scale * p,
        y: centerY - y1 * scale * p,
        z: z2,
      };
    };

    // Draw grid on XZ plane
    ctx.strokeStyle = '#2a2a2a';
    ctx.lineWidth = 1;

    for (let i = -5; i <= 5; i++) {
      const start = project(i * 2, 0, -10);
      const end = project(i * 2, 0, 10);
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();

      const start2 = project(-10, 0, i * 2);
      const end2 = project(10, 0, i * 2);
      ctx.beginPath();
      ctx.moveTo(start2.x, start2.y);
      ctx.lineTo(end2.x, end2.y);
      ctx.stroke();
    }

    // Draw axes
    const origin = project(0, 0, 0);

    // X-axis (red)
    const xAxis = project(10, 0, 0);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(xAxis.x, xAxis.y);
    ctx.stroke();
    drawArrowhead(ctx, origin.x, origin.y, xAxis.x, xAxis.y, '#ef4444');
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 14px monospace';
    ctx.fillText('X', xAxis.x + 10, xAxis.y);

    // Y-axis (green)
    const yAxis = project(0, 10, 0);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(yAxis.x, yAxis.y);
    ctx.stroke();
    drawArrowhead(ctx, origin.x, origin.y, yAxis.x, yAxis.y, '#10b981');
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 14px monospace';
    ctx.fillText('Y', yAxis.x + 10, yAxis.y);

    // Z-axis (blue)
    const zAxis = project(0, 0, 10);
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(zAxis.x, zAxis.y);
    ctx.stroke();
    drawArrowhead(ctx, origin.x, origin.y, zAxis.x, zAxis.y, '#3b82f6');
    ctx.fillStyle = '#3b82f6';
    ctx.font = 'bold 14px monospace';
    ctx.fillText('Z', zAxis.x + 10, zAxis.y);

    // Draw vectors
    vectors.forEach((vector, index) => {
      const start = project(0, 0, 0);
      const end = project(vector.x, vector.y, vector.z);

      ctx.strokeStyle = vector.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
      drawArrowhead(ctx, start.x, start.y, end.x, end.y, vector.color);

      ctx.fillStyle = vector.color;
      ctx.font = '11px monospace';
      ctx.fillText(`V${index + 1}`, end.x + 8, end.y - 8);
    });

    // Draw resultant
    if (showResultant && vectors.length > 0) {
      const start = project(0, 0, 0);
      const end = project(resultant.x, resultant.y, resultant.z);

      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
      drawArrowhead(ctx, start.x, start.y, end.x, end.y, '#10b981');

      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 12px monospace';
      ctx.fillText('R', end.x + 8, end.y - 8);
    }
  }, [vectors, showResultant, resultant, zoom, rotation, pan]);

  const drawArrowhead = (
    ctx: CanvasRenderingContext2D,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    color: string
  ) => {
    const headlen = 10;
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx);

    ctx.fillStyle = color;
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
    if (e.button === 2 || e.shiftKey) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    } else {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      setRotation({
        x: rotation.x + deltaY * 0.01,
        y: rotation.y + deltaX * 0.01,
      });
      setDragStart({ x: e.clientX, y: e.clientY });
    } else if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsPanning(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(Math.max(0.1, Math.min(5, zoom * delta)));
  };

  const resetView = () => {
    setZoom(1);
    setRotation({ x: 0.3, y: 0.5 });
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="h-full w-full relative bg-[#0f0f0f]">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onContextMenu={(e) => e.preventDefault()}
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
          title="Reset Camera"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      {/* Instructions */}
      <div className="absolute top-4 left-4 bg-[#1a1a1a]/90 backdrop-blur-sm px-4 py-2 rounded text-xs text-gray-400">
        <div>Left-click & drag to rotate • Shift+drag to pan • Scroll to zoom</div>
      </div>
    </div>
  );
}
