'use client';

import { ModelParser, ModelInfo, ModelRenderer, CylinderParameters, ModelParameters } from './ModelTypes';
import ModelRegistry from './ModelFactory';

// Cylinder Parser
export const CylinderParser: ModelParser = {
  canParse: (modelData: string): boolean => {
    // Exclude matches if they contain paper airplane keywords
    if (/paper\s*(air)?plane|origami|folded\s*plane|delta\s*wing/i.test(modelData)) {
      console.log("Cylinder parser is skipping paper airplane input");
      return false;
    }
    return /cylinder|tube|pipe|rod/i.test(modelData);
  },
  
  parse: (modelData: string): ModelInfo => {
    try {
      // Parse cylinder parameters
      const radiusMatch = modelData.match(/(\d+)\s*mm\s*(radius)/i);
      const diameterMatch = modelData.match(/(\d+)\s*mm\s*(diameter)/i);
      const heightMatch = modelData.match(/(\d+)\s*mm\s*(height|high|tall)/i);
      const lengthMatch = modelData.match(/(\d+)\s*mm\s*(length|long)/i);
      
      // Calculate radius from diameter if provided, otherwise use radius or default
      let radius = 25; // default radius
      if (diameterMatch) {
        radius = parseInt(diameterMatch[1], 10) / 2;
      } else if (radiusMatch) {
        radius = parseInt(radiusMatch[1], 10);
      }
      
      // Use height or length, whichever is provided, default if neither
      const height = heightMatch 
        ? parseInt(heightMatch[1], 10) 
        : (lengthMatch ? parseInt(lengthMatch[1], 10) : 100);
      
      return {
        type: 'cylinder',
        parameters: {
          radius,
          height,
          segments: 32
        }
      };
    } catch (error) {
      console.error('Error parsing cylinder data:', error);
      return { 
        type: 'cylinder', 
        parameters: { 
          radius: 25, 
          height: 100,
          segments: 32
        } 
      };
    }
  }
};

// Cylinder Renderer
export const CylinderRenderer: ModelRenderer = {
  type: 'cylinder',
  
  render: (parameters: ModelParameters) => {
    // Cast to CylinderParameters and provide defaults if properties are missing
    const params = parameters as CylinderParameters;
    const radius = params.radius || 25;
    const height = params.height || 100;
    const segments = params.segments || 32;
    
    // Normalize dimensions for display
    const normalizedRadius = radius / 50;
    const normalizedHeight = height / 50;
    
    return (
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry 
          args={[normalizedRadius, normalizedRadius, normalizedHeight, segments]} 
        />
        <meshStandardMaterial 
          color="#4caf50" 
          metalness={0.2}
          roughness={0.4}
        />
      </mesh>
    );
  }
};

// Register the cylinder parser and renderer
ModelRegistry.registerParser(CylinderParser);
ModelRegistry.registerRenderer(CylinderRenderer); 