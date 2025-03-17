// Export model types and interfaces
export * from './ModelTypes';

// Export model factory
export { default as ModelRegistry } from './ModelFactory';

// Export model renderers
export * from './GearModel';
export * from './BoxModel';
export * from './CylinderModel';
export * from './PaperAirplaneModel';

// Initialize all model renderers
// Order matters - parsers are registered in this order
// More specific models should be registered first
console.log("Loading and registering models in this order:");

// We need to explicitly import these in the correct priority order
import './PaperAirplaneModel'; // Paper airplanes first (most specific)
console.log("1. PaperAirplaneModel loaded");

import './GearModel';
console.log("2. GearModel loaded");

import './BoxModel';
console.log("3. BoxModel loaded");

import './CylinderModel'; // Cylinders last (most generic)
console.log("4. CylinderModel loaded"); 