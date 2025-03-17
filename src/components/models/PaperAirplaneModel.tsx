'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { ModelParser, ModelInfo, ModelRenderer, PaperAirplaneParameters, ModelParameters } from './ModelTypes';
import ModelRegistry from './ModelFactory';

// Paper Airplane Parser
export const PaperAirplaneParser: ModelParser = {
  canParse: (modelData: string): boolean => {
    // Comprehensive pattern to match all variations of paper airplane descriptions
    const isMatch = /paper\s*(air)?plane|origami\s*plane|folded\s*plane|simple\s*plane|\bplane\b(?!t)|delta\s*wing|paper\s*(glider|dart)|paper\s*(model|craft)|\baircraft\b.*paper/i.test(modelData);
    
    // Enhanced check for any airplane specifications
    const containsAirplaneKeywords = modelData.toLowerCase().includes('wingspan') || 
                                       modelData.toLowerCase().includes('delta wing') || 
                                       modelData.toLowerCase().includes('glider') ||
                                       modelData.toLowerCase().includes('paper') && 
                                       (modelData.toLowerCase().includes('plane') || 
                                        modelData.toLowerCase().includes('aircraft') || 
                                        modelData.toLowerCase().includes('wing'));
    
    const result = isMatch || containsAirplaneKeywords;
    console.log(`Paper airplane parser ${result ? 'CAN' : 'CANNOT'} parse: ${modelData.substring(0, 50)}...`);
    return result;
  },
  
  parse: (modelData: string): ModelInfo => {
    console.log("Paper airplane parser activated for: ", modelData);
    try {
      // Parse paper airplane parameters
      const wingspanMatch = modelData.match(/(\d+)\s*mm\s*wingspan/i);
      const lengthMatch = modelData.match(/(\d+)\s*mm\s*length/i);
      
      // Determine airplane type
      let planeType: 'dart' | 'glider' | 'stunt' | 'delta' = 'dart'; // default
      
      if (/glider|long\s*range/i.test(modelData)) {
        planeType = 'glider';
      } else if (/stunt|trick|acrobatic/i.test(modelData)) {
        planeType = 'stunt';
      } else if (/delta|wing|triangular/i.test(modelData)) {
        planeType = 'delta';
      }
      
      // Determine color
      let paperColor = '#ffffff'; // default white
      if (/red\s*paper|paper\s*red/i.test(modelData)) {
        paperColor = '#f44336';
      } else if (/blue\s*paper|paper\s*blue/i.test(modelData)) {
        paperColor = '#2196f3';
      } else if (/green\s*paper|paper\s*green/i.test(modelData)) {
        paperColor = '#4caf50';
      } else if (/yellow\s*paper|paper\s*yellow/i.test(modelData)) {
        paperColor = '#ffeb3b';
      }
      
      return {
        type: 'paperAirplane',
        parameters: {
          wingspan: wingspanMatch ? parseInt(wingspanMatch[1], 10) : 200,
          length: lengthMatch ? parseInt(lengthMatch[1], 10) : 250,
          type: planeType,
          paperColor
        }
      };
    } catch (error) {
      console.error('Error parsing paper airplane data:', error);
      return { 
        type: 'paperAirplane', 
        parameters: { 
          wingspan: 200, 
          length: 250, 
          type: 'dart',
          paperColor: '#ffffff'
        } 
      };
    }
  }
};

// Create a dart paper airplane geometry
function createDartAirplaneGeometry(wingspan: number, length: number): THREE.BufferGeometry {
  // Normalize dimensions
  const normalizedWingspan = wingspan / 200;
  const normalizedLength = length / 200;
  
  // Create geometry for a dart paper airplane
  const halfWingspan = normalizedWingspan / 2;
  const points = [
    // Nose point
    new THREE.Vector3(normalizedLength / 2, 0, 0),
    
    // Right wing tip
    new THREE.Vector3(-normalizedLength / 6, 0, halfWingspan),
    
    // Tail right
    new THREE.Vector3(-normalizedLength / 2, 0, normalizedWingspan / 4),
    
    // Tail center
    new THREE.Vector3(-normalizedLength / 2, 0, 0),
    
    // Tail left
    new THREE.Vector3(-normalizedLength / 2, 0, -normalizedWingspan / 4),
    
    // Left wing tip
    new THREE.Vector3(-normalizedLength / 6, 0, -halfWingspan),
    
    // Center fold line - slightly elevated
    new THREE.Vector3(0, normalizedWingspan / 10, 0)
  ];
  
  // Define faces as triangles
  const indices = [
    // Right wing
    0, 1, 6,  // Nose to right wing tip to center fold
    1, 2, 6,  // Right wing tip to tail right to center fold
    2, 3, 6,  // Tail right to tail center to center fold
    
    // Left wing
    0, 6, 5,  // Nose to center fold to left wing tip
    5, 6, 4,  // Left wing tip to center fold to tail left
    4, 6, 3   // Tail left to center fold to tail center
  ];
  
  // Create the geometry
  const geometry = new THREE.BufferGeometry();
  
  // Set vertices
  const vertices = new Float32Array(points.length * 3);
  for (let i = 0; i < points.length; i++) {
    vertices[i * 3] = points[i].x;
    vertices[i * 3 + 1] = points[i].y;
    vertices[i * 3 + 2] = points[i].z;
  }
  
  // Add attributes
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  
  // Calculate normals
  geometry.computeVertexNormals();
  
  return geometry;
}

// Create a delta wing paper airplane geometry
function createDeltaAirplaneGeometry(wingspan: number, length: number): THREE.BufferGeometry {
  // Normalize dimensions
  const normalizedWingspan = wingspan / 200;
  const normalizedLength = length / 200;
  
  // Create geometry for a delta wing paper airplane
  const halfWingspan = normalizedWingspan / 2;
  const points = [
    // Nose point
    new THREE.Vector3(normalizedLength / 2, 0, 0),
    
    // Right wing tip
    new THREE.Vector3(-normalizedLength / 5, 0, halfWingspan),
    
    // Tail right
    new THREE.Vector3(-normalizedLength / 2, 0, normalizedWingspan / 8),
    
    // Tail center
    new THREE.Vector3(-normalizedLength / 2, 0, 0),
    
    // Tail left
    new THREE.Vector3(-normalizedLength / 2, 0, -normalizedWingspan / 8),
    
    // Left wing tip
    new THREE.Vector3(-normalizedLength / 5, 0, -halfWingspan),
    
    // Center fold line - elevated
    new THREE.Vector3(0, normalizedWingspan / 15, 0)
  ];
  
  // Define faces as triangles - similar to dart but with different proportions
  const indices = [
    // Right wing
    0, 1, 6,
    1, 2, 6,
    2, 3, 6,
    
    // Left wing
    0, 6, 5,
    5, 6, 4,
    4, 6, 3
  ];
  
  // Create the geometry
  const geometry = new THREE.BufferGeometry();
  
  // Set vertices
  const vertices = new Float32Array(points.length * 3);
  for (let i = 0; i < points.length; i++) {
    vertices[i * 3] = points[i].x;
    vertices[i * 3 + 1] = points[i].y;
    vertices[i * 3 + 2] = points[i].z;
  }
  
  // Add attributes
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  
  // Calculate normals
  geometry.computeVertexNormals();
  
  return geometry;
}

// Create a glider paper airplane geometry
function createGliderAirplaneGeometry(wingspan: number, length: number): THREE.BufferGeometry {
  // Normalize dimensions
  const normalizedWingspan = wingspan / 200;
  const normalizedLength = length / 200;
  
  // Create geometry for a glider paper airplane (longer wings, more stable)
  const halfWingspan = normalizedWingspan / 2;
  
  // More points for a more complex shape
  const points = [
    // Nose point
    new THREE.Vector3(normalizedLength / 2, 0, 0),
    
    // Right wing front
    new THREE.Vector3(normalizedLength / 4, 0, halfWingspan / 2),
    
    // Right wing tip
    new THREE.Vector3(0, 0, halfWingspan),
    
    // Right wing rear
    new THREE.Vector3(-normalizedLength / 4, 0, halfWingspan / 2),
    
    // Tail right
    new THREE.Vector3(-normalizedLength / 2, 0, normalizedWingspan / 6),
    
    // Tail center
    new THREE.Vector3(-normalizedLength / 2, 0, 0),
    
    // Tail left
    new THREE.Vector3(-normalizedLength / 2, 0, -normalizedWingspan / 6),
    
    // Left wing rear
    new THREE.Vector3(-normalizedLength / 4, 0, -halfWingspan / 2),
    
    // Left wing tip
    new THREE.Vector3(0, 0, -halfWingspan),
    
    // Left wing front
    new THREE.Vector3(normalizedLength / 4, 0, -halfWingspan / 2),
    
    // Center fold - elevated
    new THREE.Vector3(0, normalizedWingspan / 12, 0)
  ];
  
  // Define faces as triangles
  const indices = [
    // Right wing front
    0, 1, 10,
    1, 2, 10,
    
    // Right wing back
    2, 3, 10,
    3, 4, 10,
    4, 5, 10,
    
    // Left wing front
    0, 10, 9,
    9, 10, 8,
    
    // Left wing back
    8, 10, 7,
    7, 10, 6,
    6, 10, 5
  ];
  
  // Create the geometry
  const geometry = new THREE.BufferGeometry();
  
  // Set vertices
  const vertices = new Float32Array(points.length * 3);
  for (let i = 0; i < points.length; i++) {
    vertices[i * 3] = points[i].x;
    vertices[i * 3 + 1] = points[i].y;
    vertices[i * 3 + 2] = points[i].z;
  }
  
  // Add attributes
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  
  // Calculate normals
  geometry.computeVertexNormals();
  
  return geometry;
}

// Create a stunt paper airplane geometry
function createStuntAirplaneGeometry(wingspan: number, length: number): THREE.BufferGeometry {
  // Normalize dimensions
  const normalizedWingspan = wingspan / 200;
  const normalizedLength = length / 200;
  
  // Create geometry for a stunt paper airplane (sharper angles, more agile)
  const halfWingspan = normalizedWingspan / 2;
  
  const points = [
    // Nose point - slightly elevated
    new THREE.Vector3(normalizedLength / 2, normalizedWingspan / 20, 0),
    
    // Right wing middle
    new THREE.Vector3(normalizedLength / 6, 0, halfWingspan / 2),
    
    // Right wing tip - slightly elevated
    new THREE.Vector3(-normalizedLength / 8, normalizedWingspan / 30, halfWingspan),
    
    // Right wing rear
    new THREE.Vector3(-normalizedLength / 3, 0, halfWingspan / 2),
    
    // Tail right
    new THREE.Vector3(-normalizedLength / 2, 0, normalizedWingspan / 5),
    
    // Tail center - slightly lowered for stability
    new THREE.Vector3(-normalizedLength / 2, -normalizedWingspan / 30, 0),
    
    // Tail left
    new THREE.Vector3(-normalizedLength / 2, 0, -normalizedWingspan / 5),
    
    // Left wing rear
    new THREE.Vector3(-normalizedLength / 3, 0, -halfWingspan / 2),
    
    // Left wing tip - slightly elevated
    new THREE.Vector3(-normalizedLength / 8, normalizedWingspan / 30, -halfWingspan),
    
    // Left wing middle
    new THREE.Vector3(normalizedLength / 6, 0, -halfWingspan / 2),
    
    // Center fold line - elevated
    new THREE.Vector3(0, normalizedWingspan / 10, 0)
  ];
  
  // Define faces as triangles
  const indices = [
    // Right wing front
    0, 1, 10,
    1, 2, 10,
    
    // Right wing back
    2, 3, 10,
    3, 4, 10,
    4, 5, 10,
    
    // Left wing front
    0, 10, 9,
    9, 10, 8,
    
    // Left wing back
    8, 10, 7,
    7, 10, 6,
    6, 10, 5
  ];
  
  // Create the geometry
  const geometry = new THREE.BufferGeometry();
  
  // Set vertices
  const vertices = new Float32Array(points.length * 3);
  for (let i = 0; i < points.length; i++) {
    vertices[i * 3] = points[i].x;
    vertices[i * 3 + 1] = points[i].y;
    vertices[i * 3 + 2] = points[i].z;
  }
  
  // Add attributes
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  
  // Calculate normals
  geometry.computeVertexNormals();
  
  return geometry;
}

// Paper Airplane Renderer
export const PaperAirplaneRenderer: ModelRenderer = {
  type: 'paperAirplane',
  
  render: (parameters: ModelParameters) => {
    // Cast to PaperAirplaneParameters and provide defaults if properties are missing
    const params = parameters as PaperAirplaneParameters;
    const wingspan = params.wingspan || 200;
    const length = params.length || 250;
    const type = params.type || 'dart';
    const paperColor = params.paperColor || '#ffffff';
    
    // Select geometry based on type
    const getGeometry = () => {
      switch (type) {
        case 'dart':
          return createDartAirplaneGeometry(wingspan, length);
        case 'delta':
          return createDeltaAirplaneGeometry(wingspan, length);
        case 'glider':
          return createGliderAirplaneGeometry(wingspan, length);
        case 'stunt':
          return createStuntAirplaneGeometry(wingspan, length);
        default:
          return createDartAirplaneGeometry(wingspan, length);
      }
    };
    
    return (
      <group rotation={[0, 0, 0]} position={[0, 0, 0]}>
        <mesh>
          <primitive object={getGeometry()} />
          <meshStandardMaterial 
            color={paperColor}
            side={THREE.DoubleSide} // Render both sides
            roughness={0.7}
            metalness={0.0}
            flatShading={true} // For a paper-like appearance
          />
        </mesh>
        {/* Add subtle fold lines for realism */}
        <lineSegments>
          <edgesGeometry args={[getGeometry()]} />
          <lineBasicMaterial color="#000000" transparent opacity={0.1} />
        </lineSegments>
      </group>
    );
  }
};

// Register the paper airplane parser and renderer
ModelRegistry.registerParser(PaperAirplaneParser);
ModelRegistry.registerRenderer(PaperAirplaneRenderer); 