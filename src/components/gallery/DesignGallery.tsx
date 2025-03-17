import DesignCard from './DesignCard';
import { SceneObject } from '../cad/Scene';

export interface Design {
  id: string;
  title: string;
  objects: SceneObject[];
  votes: number;
}

interface DesignGalleryProps {
  designs: Design[];
  onVote: (id: string) => void;
  onSelect: (id: string) => void;
  selectedDesignId?: string;
}

export default function DesignGallery({ 
  designs, 
  onVote, 
  onSelect,
  selectedDesignId 
}: DesignGalleryProps) {
  if (designs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-gray-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">No designs yet</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Use the prompt above to generate some designs.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {designs.map((design) => (
        <DesignCard
          key={design.id}
          id={design.id}
          title={design.title}
          objects={design.objects}
          votes={design.votes}
          onVote={onVote}
          onSelect={onSelect}
          isSelected={design.id === selectedDesignId}
        />
      ))}
    </div>
  );
} 