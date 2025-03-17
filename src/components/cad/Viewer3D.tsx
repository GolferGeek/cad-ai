import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, PerspectiveCamera } from '@react-three/drei';
import { Suspense } from 'react';

interface Viewer3DProps {
  children?: React.ReactNode;
}

export default function Viewer3D({ children }: Viewer3DProps) {
  return (
    <div className="w-full h-full min-h-[400px] bg-gray-900 rounded-lg overflow-hidden">
      <Canvas shadows>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[5, 5, 5]} />
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[10, 10, 10]}
            intensity={1}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <Grid
            infiniteGrid
            cellSize={1}
            cellThickness={0.5}
            sectionSize={3}
            sectionThickness={1}
            sectionColor="#2080ff"
            fadeDistance={30}
          />
          {children}
          <OrbitControls />
        </Suspense>
      </Canvas>
    </div>
  );
} 