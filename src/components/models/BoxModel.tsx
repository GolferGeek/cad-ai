'use client';

import { ModelParser, ModelInfo, ModelRenderer, BoxParameters, ModelParameters } from './ModelTypes';
import ModelRegistry from './ModelFactory';

// Box Parser
export const BoxParser: ModelParser = {
  canParse: (modelData: string): boolean => {
    return /box|cube|rectangular|cuboid/i.test(modelData);
  },
  
  parse: (modelData: string): ModelInfo => {
    try {
      // Parse box parameters
      const widthMatch = modelData.match(/(\d+)\s*mm\s*(width|wide)/i);
      const heightMatch = modelData.match(/(\d+)\s*mm\s*(height|high|tall)/i);
      const depthMatch = modelData.match(/(\d+)\s*mm\s*(depth|deep|length|long)/i);
      const roundedMatch = /rounded|chamfered|beveled/i.test(modelData);
      
      return {
        type: 'box',
        parameters: {
          width: widthMatch ? parseInt(widthMatch[1], 10) : 50,
          height: heightMatch ? parseInt(heightMatch[1], 10) : 50,
          depth: depthMatch ? parseInt(depthMatch[1], 10) : 50,
          rounded: roundedMatch
        }
      };
    } catch (error) {
      console.error('Error parsing box data:', error);
      return { 
        type: 'box', 
        parameters: { 
          width: 50, 
          height: 50, 
          depth: 50,
          rounded: false
        } 
      };
    }
  }
};

// Box Renderer
export const BoxRenderer: ModelRenderer = {
  type: 'box',
  
  render: (parameters: ModelParameters) => {
    // Cast to BoxParameters and provide defaults if properties are missing
    const params = parameters as BoxParameters;
    const width = params.width || 50;
    const height = params.height || 50;
    const depth = params.depth || 50;
    const rounded = params.rounded || false;
    
    // Normalize dimensions for display
    const normalizedWidth = width / 50;
    const normalizedHeight = height / 50;
    const normalizedDepth = depth / 50;
    
    return (
      <mesh>
        {rounded ? (
          <boxGeometry 
            args={[normalizedWidth, normalizedHeight, normalizedDepth, 4, 4, 4]} 
          />
        ) : (
          <boxGeometry 
            args={[normalizedWidth, normalizedHeight, normalizedDepth]} 
          />
        )}
        <meshStandardMaterial 
          color="#2196f3" 
          metalness={0.1}
          roughness={0.5}
        />
      </mesh>
    );
  }
};

// Register the box parser and renderer
ModelRegistry.registerParser(BoxParser);
ModelRegistry.registerRenderer(BoxRenderer);