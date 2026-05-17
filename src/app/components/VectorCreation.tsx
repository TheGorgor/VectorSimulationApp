import { useState } from 'react';
import { Plus } from 'lucide-react';

interface VectorCreationProps {
  onAddVector: (vector: {
    magnitude: number;
    angle: number;
    x: number;
    y: number;
    z: number;
  }) => void;
}

export function VectorCreation({ onAddVector }: VectorCreationProps) {
  const [mode, setMode] = useState<'components' | 'magnitude'>('components');
  const [x, setX] = useState('0');
  const [y, setY] = useState('0');
  const [z, setZ] = useState('0');
  const [magnitude, setMagnitude] = useState('0');
  const [angle, setAngle] = useState('0');

  const handleAddVector = () => {
    if (mode === 'components') {
      const xVal = parseFloat(x) || 0;
      const yVal = parseFloat(y) || 0;
      const zVal = parseFloat(z) || 0;
      const mag = Math.sqrt(xVal ** 2 + yVal ** 2 + zVal ** 2);
      const ang = Math.atan2(yVal, xVal) * (180 / Math.PI);

      onAddVector({
        x: xVal,
        y: yVal,
        z: zVal,
        magnitude: mag,
        angle: ang,
      });
    } else {
      const mag = parseFloat(magnitude) || 0;
      const ang = parseFloat(angle) || 0;
      const angRad = ang * (Math.PI / 180);

      onAddVector({
        x: mag * Math.cos(angRad),
        y: mag * Math.sin(angRad),
        z: parseFloat(z) || 0,
        magnitude: mag,
        angle: ang,
      });
    }

    // Reset inputs
    setX('0');
    setY('0');
    setZ('0');
    setMagnitude('0');
    setAngle('0');
  };

  return (
    <div className="h-full w-full flex items-center justify-center bg-[#0f0f0f]">
      <div className="w-full max-w-2xl p-8">
        <h2 className="text-2xl font-semibold mb-6">Create Vector</h2>

        {/* Mode Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode('components')}
            className={`flex-1 px-4 py-2 rounded transition-colors ${
              mode === 'components'
                ? 'bg-blue-600 text-white'
                : 'bg-[#2a2a2a] text-gray-400 hover:bg-[#333]'
            }`}
          >
            Component Form (X, Y, Z)
          </button>
          <button
            onClick={() => setMode('magnitude')}
            className={`flex-1 px-4 py-2 rounded transition-colors ${
              mode === 'magnitude'
                ? 'bg-blue-600 text-white'
                : 'bg-[#2a2a2a] text-gray-400 hover:bg-[#333]'
            }`}
          >
            Magnitude & Angle (2D)
          </button>
        </div>

        {/* Input Fields */}
        <div className="bg-[#1a1a1a] rounded-lg p-6 space-y-4">
          {mode === 'components' ? (
            <>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  X Component
                </label>
                <input
                  type="number"
                  value={x}
                  onChange={(e) => setX(e.target.value)}
                  className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="0.0"
                  step="0.1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Y Component
                </label>
                <input
                  type="number"
                  value={y}
                  onChange={(e) => setY(e.target.value)}
                  className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="0.0"
                  step="0.1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Z Component
                </label>
                <input
                  type="number"
                  value={z}
                  onChange={(e) => setZ(e.target.value)}
                  className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="0.0"
                  step="0.1"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Magnitude
                </label>
                <input
                  type="number"
                  value={magnitude}
                  onChange={(e) => setMagnitude(e.target.value)}
                  className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="0.0"
                  step="0.1"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Angle (degrees)
                </label>
                <input
                  type="number"
                  value={angle}
                  onChange={(e) => setAngle(e.target.value)}
                  className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="0.0"
                  step="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Z Component (optional)
                </label>
                <input
                  type="number"
                  value={z}
                  onChange={(e) => setZ(e.target.value)}
                  className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="0.0"
                  step="0.1"
                />
              </div>
            </>
          )}

          <button
            onClick={handleAddVector}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded flex items-center justify-center gap-2 transition-colors mt-6"
          >
            <Plus size={20} />
            Add Vector
          </button>
        </div>

        {/* Info Panel */}
        <div className="mt-6 bg-[#1a1a1a] rounded-lg p-4">
          <h3 className="text-sm font-semibold mb-2 text-gray-300">Preview</h3>
          {mode === 'components' ? (
            <div className="space-y-1 text-sm text-gray-400">
              <div className="flex justify-between">
                <span>Magnitude:</span>
                <span className="text-white font-mono">
                  {Math.sqrt(
                    (parseFloat(x) || 0) ** 2 +
                      (parseFloat(y) || 0) ** 2 +
                      (parseFloat(z) || 0) ** 2
                  ).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Angle (2D):</span>
                <span className="text-white font-mono">
                  {(Math.atan2(parseFloat(y) || 0, parseFloat(x) || 0) * (180 / Math.PI)).toFixed(2)}°
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-1 text-sm text-gray-400">
              <div className="flex justify-between">
                <span>X Component:</span>
                <span className="text-white font-mono">
                  {((parseFloat(magnitude) || 0) * Math.cos((parseFloat(angle) || 0) * (Math.PI / 180))).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Y Component:</span>
                <span className="text-white font-mono">
                  {((parseFloat(magnitude) || 0) * Math.sin((parseFloat(angle) || 0) * (Math.PI / 180))).toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 text-xs text-gray-500">
          <p>
            Create vectors using component form (X, Y, Z coordinates) or magnitude and angle form.
            Switch between 2D and 3D modes to visualize your vectors in different coordinate systems.
          </p>
        </div>
      </div>
    </div>
  );
}
