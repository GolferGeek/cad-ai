import { Box, Sphere, Cylinder } from './BasicShapes';

export interface SceneObject {
  id: string;
  type: 'box' | 'sphere' | 'cylinder';
  position: [number, number, number];
  color: string;
  wireframe?: boolean;
}

interface SceneProps {
  objects: SceneObject[];
  onSelectObject?: (id: string) => void;
  selectedObjectId?: string;
}

export default function Scene({ objects, onSelectObject, selectedObjectId }: SceneProps) {
  const renderObject = (obj: SceneObject) => {
    const isSelected = selectedObjectId === obj.id;
    const props = {
      key: obj.id,
      position: obj.position,
      color: obj.color,
      wireframe: obj.wireframe,
      selected: isSelected,
      onClick: () => onSelectObject && onSelectObject(obj.id)
    };

    switch (obj.type) {
      case 'box':
        return <Box {...props} />;
      case 'sphere':
        return <Sphere {...props} />;
      case 'cylinder':
        return <Cylinder {...props} />;
      default:
        return null;
    }
  };

  return (
    <>
      {objects.map(renderObject)}
    </>
  );
} 