import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/Tabs';
import { Sidebar } from './components/Sidebar';
import { Simulation2D } from './components/Simulation2D';
import { Simulation3D } from './components/Simulation3D';
import { VectorCreation } from './components/VectorCreation';

export interface Vector {
  id: string;
  magnitude: number;
  angle: number;
  x: number;
  y: number;
  z: number;
  color: string;
}

export default function App() {
  const [vectors, setVectors] = useState<Vector[]>([]);
  const [showGrid, setShowGrid] = useState(true);
  const [showResultant, setShowResultant] = useState(true);
  const [activeTab, setActiveTab] = useState('2d');

  const addVector = (vector: Omit<Vector, 'id' | 'color'>) => {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    const newVector: Vector = {
      ...vector,
      id: Math.random().toString(36).substr(2, 9),
      color: colors[vectors.length % colors.length],
    };
    setVectors([...vectors, newVector]);
  };

  const deleteVector = (id: string) => {
    setVectors(vectors.filter(v => v.id !== id));
  };

  const clearAll = () => {
    setVectors([]);
  };

  const calculateResultant = (): { x: number; y: number; z: number } => {
    return vectors.reduce(
      (acc, v) => ({
        x: acc.x + v.x,
        y: acc.y + v.y,
        z: acc.z + v.z,
      }),
      { x: 0, y: 0, z: 0 }
    );
  };

  const resultant = calculateResultant();

  return (
    <div className="h-screen w-screen bg-[#0f0f0f] text-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="h-14 bg-[#1a1a1a] border-b border-[#2a2a2a] flex items-center px-4">
        <h1 className="text-lg font-semibold">Vector Physics Simulator</h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          vectors={vectors}
          showGrid={showGrid}
          showResultant={showResultant}
          onToggleGrid={() => setShowGrid(!showGrid)}
          onToggleResultant={() => setShowResultant(!showResultant)}
          onClearAll={clearAll}
          onDeleteVector={deleteVector}
          resultant={resultant}
        />

        {/* Main Area */}
        <div className="flex-1 flex flex-col bg-[#0f0f0f]">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="bg-[#1a1a1a] border-b border-[#2a2a2a] px-4">
              <TabsList className="bg-transparent h-12">
                <TabsTrigger value="2d" className="data-[state=active]:bg-[#2a2a2a] data-[state=active]:text-white">
                  2D Mode
                </TabsTrigger>
                <TabsTrigger value="3d" className="data-[state=active]:bg-[#2a2a2a] data-[state=active]:text-white">
                  3D Mode
                </TabsTrigger>
                <TabsTrigger value="create" className="data-[state=active]:bg-[#2a2a2a] data-[state=active]:text-white">
                  Vector Creation
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="2d" className="flex-1 m-0">
              <Simulation2D
                vectors={vectors}
                showGrid={showGrid}
                showResultant={showResultant}
                resultant={resultant}
              />
            </TabsContent>

            <TabsContent value="3d" className="flex-1 m-0">
              <Simulation3D
                vectors={vectors}
                showResultant={showResultant}
                resultant={resultant}
              />
            </TabsContent>

            <TabsContent value="create" className="flex-1 m-0">
              <VectorCreation onAddVector={addVector} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
