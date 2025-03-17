import { useState } from 'react';

interface ShapeProps {
  position?: [number, number, number];
  color?: string;
  wireframe?: boolean;
  selected?: boolean;
  onClick?: () => void;
}

export function Box({ 
  position = [0, 0, 0], 
  color = '#1e88e5', 
  wireframe = false,
  selected = false,
  onClick
}: ShapeProps) {
  const [hovered, setHovered] = useState(false);
  
  return (
    <mesh
      position={position}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial 
        color={hovered || selected ? '#2196f3' : color} 
        wireframe={wireframe}
        emissive={selected ? '#2196f3' : 'black'}
        emissiveIntensity={selected ? 0.5 : 0}
      />
    </mesh>
  );
}

export function Sphere({ 
  position = [0, 0, 0], 
  color = '#e91e63', 
  wireframe = false,
  selected = false,
  onClick
}: ShapeProps) {
  const [hovered, setHovered] = useState(false);
  
  return (
    <mesh
      position={position}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial 
        color={hovered || selected ? '#f06292' : color} 
        wireframe={wireframe}
        emissive={selected ? '#f06292' : 'black'}
        emissiveIntensity={selected ? 0.5 : 0}
      />
    </mesh>
  );
}

export function Cylinder({ 
  position = [0, 0, 0], 
  color = '#4caf50', 
  wireframe = false,
  selected = false,
  onClick
}: ShapeProps) {
  const [hovered, setHovered] = useState(false);
  
  return (
    <mesh
      position={position}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <cylinderGeometry args={[0.5, 0.5, 1, 32]} />
      <meshStandardMaterial 
        color={hovered || selected ? '#66bb6a' : color} 
        wireframe={wireframe}
        emissive={selected ? '#66bb6a' : 'black'}
        emissiveIntensity={selected ? 0.5 : 0}
      />
    </mesh>
  );
} 