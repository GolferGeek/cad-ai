import { useState } from 'react';
import Viewer3D from '../cad/Viewer3D';
import Scene, { SceneObject } from '../cad/Scene';

interface DesignCardProps {
  id: string;
  title: string;
  objects: SceneObject[];
  votes: number;
  onVote: (id: string) => void;
  onSelect: (id: string) => void;
  isSelected: boolean;
}

export default function DesignCard({ 
  id, 
  title, 
  objects, 
  votes, 
  onVote, 
  onSelect,
  isSelected
}: DesignCardProps) {
  const [selectedObjectId, setSelectedObjectId] = useState<string | undefined>(undefined);

  return (
    <div 
      className={`border rounded-lg overflow-hidden ${
        isSelected 
          ? 'border-blue-500 ring-2 ring-blue-500' 
          : 'border-gray-200 dark:border-gray-700'
      }`}
      onClick={() => onSelect(id)}
    >
      <div className="h-48">
        <Viewer3D>
          <Scene 
            objects={objects} 
            onSelectObject={setSelectedObjectId}
            selectedObjectId={selectedObjectId}
          />
        </Viewer3D>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900 dark:text-white">{title}</h3>
        <div className="flex justify-between items-center mt-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onVote(id);
            }}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>{votes}</span>
          </button>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {objects.length} objects
          </span>
        </div>
      </div>
    </div>
  );
} 