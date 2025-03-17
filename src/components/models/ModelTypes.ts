import { Object3D } from 'three';
import { ReactNode } from 'react';

// Base interface for all model parameters
export interface ModelParameters {
  [key: string]: any;
}

// Interface for gear parameters
export interface GearParameters extends ModelParameters {
  teethCount: number;
  diameter: number;
  thickness: number;
}

// Interface for box parameters
export interface BoxParameters extends ModelParameters {
  width: number;
  height: number;
  depth: number;
  rounded?: boolean;
}

// Interface for cylinder parameters
export interface CylinderParameters extends ModelParameters {
  radius: number;
  height: number;
  segments?: number;
}

// Interface for paper airplane parameters
export interface PaperAirplaneParameters extends ModelParameters {
  wingspan: number;
  length: number;
  type: 'dart' | 'glider' | 'stunt' | 'delta';
  paperColor?: string;
}

// Model info interface returned by parsers
export interface ModelInfo {
  type: string;
  parameters: ModelParameters;
}

// Interface for model parsers
export interface ModelParser {
  canParse: (modelData: string) => boolean;
  parse: (modelData: string) => ModelInfo;
}

// Interface for model renderers
export interface ModelRenderer {
  type: string;
  render: (parameters: ModelParameters) => ReactNode;
} 