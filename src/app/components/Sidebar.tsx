import { X, Grid3x3, Target, Trash2 } from 'lucide-react';
import { Vector } from '../App';

interface SidebarProps {
  vectors: Vector[];
  showGrid: boolean;
  showResultant: boolean;
  onToggleGrid: () => void;
  onToggleResultant: () => void;
  onClearAll: () => void;
  onDeleteVector: (id: string) => void;
  resultant: { x: number; y: number; z: number };
}

export function Sidebar({
  vectors,
  showGrid,
  showResultant,
  onToggleGrid,
  onToggleResultant,
  onClearAll,
  onDeleteVector,
  resultant,
}: SidebarProps) {
  const resultantMagnitude = Math.sqrt(
    resultant.x ** 2 + resultant.y ** 2 + resultant.z ** 2
  );

  return (
    <div className="w-80 bg-[#1a1a1a] border-r border-[#2a2a2a] flex flex-col">
      {/* Controls Section */}
      <div className="p-4 border-b border-[#2a2a2a]">
        <h2 className="text-sm font-semibold mb-4 text-gray-300">Controls</h2>

        <div className="space-y-2">
          <button
            onClick={onToggleGrid}
            className="w-full flex items-center gap-2 px-3 py-2 bg-[#2a2a2a] hover:bg-[#333] rounded transition-colors text-sm"
          >
            <Grid3x3 size={16} />
            <span>{showGrid ? 'Hide' : 'Show'} Grid</span>
          </button>

          <button
            onClick={onToggleResultant}
            className="w-full flex items-center gap-2 px-3 py-2 bg-[#2a2a2a] hover:bg-[#333] rounded transition-colors text-sm"
          >
            <Target size={16} />
            <span>{showResultant ? 'Hide' : 'Show'} Resultant</span>
          </button>

          <button
            onClick={onClearAll}
            className="w-full flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 rounded transition-colors text-sm"
            disabled={vectors.length === 0}
          >
            <Trash2 size={16} />
            <span>Clear All Vectors</span>
          </button>
        </div>
      </div>

      {/* Resultant Vector Info */}
      {showResultant && vectors.length > 0 && (
        <div className="p-4 border-b border-[#2a2a2a] bg-[#1f1f1f]">
          <h3 className="text-sm font-semibold mb-2 text-green-400">Resultant Vector</h3>
          <div className="space-y-1 text-xs text-gray-400">
            <div className="flex justify-between">
              <span>X:</span>
              <span className="text-white font-mono">{resultant.x.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Y:</span>
              <span className="text-white font-mono">{resultant.y.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Z:</span>
              <span className="text-white font-mono">{resultant.z.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-[#2a2a2a]">
              <span>Magnitude:</span>
              <span className="text-white font-mono">{resultantMagnitude.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Vectors List */}
      <div className="flex-1 overflow-y-auto p-4">
        <h2 className="text-sm font-semibold mb-3 text-gray-300">
          Vectors ({vectors.length})
        </h2>

        {vectors.length === 0 ? (
          <p className="text-xs text-gray-500">No vectors created yet</p>
        ) : (
          <div className="space-y-2">
            {vectors.map((vector, index) => (
              <div
                key={vector.id}
                className="bg-[#2a2a2a] rounded p-3 hover:bg-[#333] transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: vector.color }}
                    />
                    <span className="text-sm font-medium">Vector {index + 1}</span>
                  </div>
                  <button
                    onClick={() => onDeleteVector(vector.id)}
                    className="text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
                <div className="space-y-0.5 text-xs text-gray-400">
                  <div className="flex justify-between">
                    <span>X:</span>
                    <span className="text-white font-mono">{vector.x.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Y:</span>
                    <span className="text-white font-mono">{vector.y.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Z:</span>
                    <span className="text-white font-mono">{vector.z.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-[#3a3a3a] mt-1">
                    <span>Magnitude:</span>
                    <span className="text-white font-mono">{vector.magnitude.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
