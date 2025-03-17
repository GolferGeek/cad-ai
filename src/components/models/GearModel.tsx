'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { ModelParser, ModelInfo, ModelRenderer, GearParameters, ModelParameters } from './ModelTypes';
import ModelRegistry from './ModelFactory';

// Function to create gear geometry - moved from CadViewer
export function createGearGeometry(
  teethCount: number = 12,
  outerRadius: number = 1,
  thickness: number = 0.2,
  innerRadius: number = 0.3,
  toothDepth: number = 0.2
) {
  const shape = new THREE.Shape();

  // Inner circle (hole)
  shape.absarc(0, 0, innerRadius, 0, Math.PI * 2, false);

  // Outer circle with teeth
  const teethShape = new THREE.Shape();
  const angleStep = (Math.PI * 2) / teethCount;
  
  for (let i = 0; i < teethCount; i++) {
    const angle = i * angleStep;
    const nextAngle = (i + 0.5) * angleStep;
    const nextNextAngle = (i + 1) * angleStep;
    
    // Base of tooth
    const xBase = Math.cos(angle) * outerRadius;
    const yBase = Math.sin(angle) * outerRadius;
    
    // Tip of tooth
    const xTip = Math.cos(nextAngle) * (outerRadius + toothDepth);
    const yTip = Math.sin(nextAngle) * (outerRadius + toothDepth);
    
    // Next base
    const xNextBase = Math.cos(nextNextAngle) * outerRadius;
    const yNextBase = Math.sin(nextNextAngle) * outerRadius;
    
    if (i === 0) {
      teethShape.moveTo(xBase, yBase);
    }
    
    teethShape.lineTo(xTip, yTip);
    teethShape.lineTo(xNextBase, yNextBase);
  }
  
  const extrudeSettings = {
    steps: 1,
    depth: thickness,
    bevelEnabled: false,
  };
  
  const geometry = new THREE.ExtrudeGeometry(teethShape, extrudeSettings);
  return geometry;
}

// Gear Parser
export const GearParser: ModelParser = {
  canParse: (modelData: string): boolean => {
    return /gear|sprocket|cog/i.test(modelData);
  },
  
  parse: (modelData: string): ModelInfo => {
    try {
      // Parse gear parameters
      const teethMatch = modelData.match(/(\d+)\s*teeth/i);
      const diameterMatch = modelData.match(/(\d+)\s*mm\s*diameter/i);
      const thicknessMatch = modelData.match(/(\d+)\s*mm\s*thick/i);
      
      return {
        type: 'gear',
        parameters: {
          teethCount: teethMatch ? parseInt(teethMatch[1], 10) : 12,
          diameter: diameterMatch ? parseInt(diameterMatch[1], 10) : 50,
          thickness: thicknessMatch ? parseInt(thicknessMatch[1], 10) : 10
        }
      };
    } catch (error) {
      console.error('Error parsing gear data:', error);
      return { 
        type: 'gear', 
        parameters: { 
          teethCount: 12, 
          diameter: 50, 
          thickness: 10 
        } 
      };
    }
  }
};

// Gear Renderer
export const GearRenderer: ModelRenderer = {
  type: 'gear',
  
  render: (parameters: ModelParameters) => {
    // Cast to GearParameters and provide defaults if properties are missing
    const params = parameters as GearParameters;
    const teethCount = params.teethCount || 12;
    const diameter = params.diameter || 50;
    const thickness = params.thickness || 10;
    
    // Normalize dimensions for display
    const normalizedDiameter = diameter / 50;  // Normalize to make a 50mm gear have size 1
    const normalizedThickness = thickness / 50;
    
    return (
      <group rotation={[Math.PI / 2, 0, 0]}>
        <mesh>
          <primitive 
            object={createGearGeometry(
              teethCount, 
              normalizedDiameter / 2, 
              normalizedThickness, 
              normalizedDiameter / 6,
              normalizedDiameter / 10
            )} 
          />
          <meshStandardMaterial 
            color="#1976d2" 
            metalness={0.5}
            roughness={0.3}
          />
        </mesh>
      </group>
    );
  }
};

// Register the gear parser and renderer
ModelRegistry.registerParser(GearParser);
ModelRegistry.registerRenderer(GearRenderer); 