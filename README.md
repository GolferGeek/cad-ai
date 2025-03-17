# CAD-AI: 3D Model Generation with AI

A modern web application for generating 3D CAD designs using AI. Describe what you want, and the app will generate a 3D model that you can view and interact with.

## Features

- **AI-Powered Design Generation**: Simply describe what you want, and our AI will create a 3D model
- **Interactive 3D Viewer**: Rotate, zoom, and inspect your models from any angle
- **Multiple Model Types**: Support for various shapes including gears, boxes, cylinders, and paper airplanes
- **Modern UI**: Clean, responsive interface built with Material UI

## Supported Model Types

### Basic Shapes
- **Gears**: Generate customizable gears with specified teeth count, diameter, and thickness
- **Boxes/Cubes**: Create rectangular prisms with customizable dimensions
- **Cylinders**: Generate cylindrical shapes with customizable radius and height

### Complex Shapes
- **Paper Airplanes**: Create various types of paper airplane models
  - **Dart**: Classic paper airplane design
  - **Delta**: Triangular wing design for stability
  - **Glider**: Long-wing design for distance
  - **Stunt**: Design optimized for tricks and maneuvers

## How to Use

1. Enter a description of the CAD model you want to generate
2. Click "Generate CAD Design"
3. Wait for the AI to process your request
4. View and interact with the 3D model in the viewer

## Example Prompts

Try these example prompts to see what the system can do:

### Gears
- "A gear with 20 teeth, 80mm diameter, and 15mm thickness"
- "Create a small sprocket with 12 teeth and 30mm diameter"

### Boxes
- "A rectangular box 100mm wide, 50mm tall, and 75mm deep"
- "A cube with 60mm sides and rounded edges"

### Cylinders
- "A cylinder with 40mm radius and 120mm height"
- "Create a thin disc with 80mm diameter and 5mm thickness"

### Paper Airplanes
- "A paper airplane with 250mm wingspan"
- "A delta wing paper airplane made from blue paper"
- "A long-range glider paper airplane with 300mm wingspan"
- "A stunt paper airplane made from red paper with 200mm length"

## Troubleshooting

### Paper Airplane Not Rendering Correctly

If your paper airplane request results in the wrong model type (like a cylinder):

1. **Be Specific**: Always include the phrase "paper airplane" in your prompt
2. **Specify Type**: Include the airplane type ("dart", "delta", "glider", or "stunt")
3. **Example**: Instead of "a simple plane", try "a simple paper airplane"
4. **Refresh**: If the issue persists, try refreshing the page and submitting a new request

## Technical Details

### Model Creation Architecture

The application uses a modular architecture for model creation:

1. **Model Registry**: Central system that manages all available model types
2. **Model Parsers**: Analyze text prompts to determine model type and parameters
3. **Model Renderers**: Generate 3D representations based on extracted parameters

### Adding New Model Types

The system is designed to be extensible. To add a new model type:

1. Define a parameter interface in `ModelTypes.ts`
2. Create a parser to extract parameters from text
3. Create a renderer to visualize the model in 3D
4. Register both with the `ModelRegistry`

### 3D Rendering

The application uses Three.js for 3D rendering through React Three Fiber, providing:

- Realistic lighting and materials
- Interactive camera controls
- Grid for sense of scale and orientation
- Environment mapping for reflections

## Developing Complex Models

For complex models like paper airplanes, the system uses:

1. **BufferGeometry**: For creating custom mesh geometries
2. **Triangulation**: Breaking down complex surfaces into triangular faces
3. **Normal Calculation**: For proper lighting of custom geometries
4. **Double-sided Materials**: To ensure visibility from all angles

## Future Enhancements

Planned improvements include:

- STL/OBJ export support
- More advanced shape types (screws, brackets, joints)
- Texture and material customization
- Assembly support for multi-part models
- Animation for mechanical parts

## Getting Started for Developers

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Environment Setup

Create a `.env.local` file in the root directory with your OpenAI API key:

```
OPENAI_API_KEY=your_api_key_here
```

## License

[MIT](LICENSE)
