import { v4 as uuidv4 } from 'uuid';
import { SceneObject } from '@/components/cad/Scene';
import { Design } from '@/components/gallery/DesignGallery';

// Mock function to generate a random color
const getRandomColor = (): string => {
  const colors = [
    '#1e88e5', // blue
    '#e91e63', // pink
    '#4caf50', // green
    '#ff9800', // orange
    '#9c27b0', // purple
    '#f44336', // red
    '#2196f3', // light blue
    '#009688', // teal
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Mock function to generate a random position
const getRandomPosition = (): [number, number, number] => {
  return [
    (Math.random() - 0.5) * 4,
    (Math.random() - 0.5) * 4,
    (Math.random() - 0.5) * 4,
  ];
};

// Mock function to generate a random object
const generateRandomObject = (): SceneObject => {
  const types = ['box', 'sphere', 'cylinder'] as const;
  const type = types[Math.floor(Math.random() * types.length)];
  
  return {
    id: uuidv4(),
    type,
    position: getRandomPosition(),
    color: getRandomColor(),
    wireframe: Math.random() > 0.8, // 20% chance of wireframe
  };
};

// Mock function to generate a design based on a prompt
const generateDesign = (prompt: string): Design => {
  // In a real implementation, this would call an AI service
  // For now, we'll just generate random objects
  const objectCount = Math.floor(Math.random() * 5) + 1; // 1-5 objects
  const objects: SceneObject[] = [];
  
  for (let i = 0; i < objectCount; i++) {
    objects.push(generateRandomObject());
  }
  
  return {
    id: uuidv4(),
    title: `Design for: ${prompt}`,
    objects,
    votes: 0,
  };
};

// Mock function to generate multiple designs for a prompt
export const generateDesigns = async (prompt: string, count: number = 3): Promise<Design[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const designs: Design[] = [];
  for (let i = 0; i < count; i++) {
    designs.push(generateDesign(prompt));
  }
  
  return designs;
};

// In a real implementation, this would be a database or API call
let savedDesigns: Design[] = [];

// Mock function to save designs
export const saveDesigns = (designs: Design[]): void => {
  savedDesigns = [...savedDesigns, ...designs];
};

// Mock function to get all saved designs
export const getSavedDesigns = (): Design[] => {
  return savedDesigns;
};

// Mock function to vote for a design
export const voteForDesign = (id: string): Design[] => {
  savedDesigns = savedDesigns.map(design => 
    design.id === id 
      ? { ...design, votes: design.votes + 1 } 
      : design
  );
  
  return savedDesigns;
}; 