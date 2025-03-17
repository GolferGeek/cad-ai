import { ModelInfo, ModelParameters, ModelParser, ModelRenderer } from './ModelTypes';

// ModelRegistry to store all available parsers and renderers
class ModelRegistry {
  private static parsers: ModelParser[] = [];
  private static renderers: ModelRenderer[] = [];

  // Register a new parser
  public static registerParser(parser: ModelParser): void {
    ModelRegistry.parsers.push(parser);
  }

  // Register a new renderer
  public static registerRenderer(renderer: ModelRenderer): void {
    ModelRegistry.renderers.push(renderer);
  }

  // Parse model data into model info
  public static parseModelData(modelData: string): ModelInfo {
    if (!modelData) {
      return { type: 'unknown', parameters: {} };
    }

    console.log("Parsing model data:", modelData);
    console.log(`Number of registered parsers: ${ModelRegistry.parsers.length}`);
    
    // Log all registered parsers for debugging
    ModelRegistry.parsers.forEach((parser, index) => {
      console.log(`Parser ${index}: ${parser.canParse(modelData) ? 'can parse' : 'cannot parse'} the input`);
    });

    // Try structured format first (Type: xyz)
    const typeMatch = modelData.match(/Type:\s*([a-zA-Z0-9\s]+)/i);
    if (typeMatch) {
      const type = typeMatch[1].toLowerCase().trim();
      
      // Find a parser for this type
      for (const parser of ModelRegistry.parsers) {
        if (parser.canParse(modelData)) {
          return parser.parse(modelData);
        }
      }
      
      // If no specific parser found but we know the type
      return { type, parameters: {} };
    }

    // Try each parser - higher priority
    for (const parser of ModelRegistry.parsers) {
      if (parser.canParse(modelData)) {
        const result = parser.parse(modelData);
        console.log(`Parser matched: ${result.type}`);
        
        // Add extra logging of the found model type
        console.log(`>> Selected model type: ${result.type}`);
        console.log(`>> With parameters: ${JSON.stringify(result.parameters)}`);
        
        return result;
      }
    }

    // Special case for paper airplanes (since they might just have the word "plane")
    if (/\b(plane|aircraft|wing|origami|glider|paper)\b/i.test(modelData) && 
        !/\b(engine|motor|jet|combustion)\b/i.test(modelData)) {
      console.log("Paper airplane fallback matched");
      return { type: 'paperAirplane', parameters: { 
        wingspan: 200, 
        length: 250, 
        type: 'dart',
        paperColor: '#ffffff' 
      }};
    }

    // Default fallback - try to detect common types
    if (/gear|sprocket|cog/i.test(modelData)) {
      return { type: 'gear', parameters: {} };
    } else if (/box|cube|rectangular|cuboid/i.test(modelData)) {
      return { type: 'box', parameters: {} };
    } else if (/cylinder|tube|pipe|rod/i.test(modelData)) {
      return { type: 'cylinder', parameters: {} };
    } else if (/sphere|ball|globe/i.test(modelData)) {
      return { type: 'sphere', parameters: {} };
    } else if (/bracket|mount|support/i.test(modelData)) {
      return { type: 'bracket', parameters: {} };
    } else if (/enclosure|case|container/i.test(modelData)) {
      return { type: 'enclosure', parameters: {} };
    }

    return { type: 'unknown', parameters: {} };
  }

  // Find a renderer for a specific model type
  public static getRenderer(type: string): ModelRenderer | null {
    const renderer = ModelRegistry.renderers.find(renderer => renderer.type === type);
    console.log(`Looking for renderer for type: ${type}, found: ${renderer ? 'yes' : 'no'}`);
    return renderer || null;
  }

  // Get all supported model types
  public static getSupportedTypes(): string[] {
    return ModelRegistry.renderers.map(renderer => renderer.type);
  }
}

// Export the registry
export default ModelRegistry; 