import OpenAI from 'openai';

// Initialize the OpenAI client with the API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

/**
 * Validates if the OpenAI API key is configured
 * @returns boolean indicating if API key is available
 */
export const isApiKeyConfigured = (): boolean => {
  return Boolean(process.env.OPENAI_API_KEY);
};

/**
 * Generates a CAD design based on text description
 * @param prompt - User's text description of the desired CAD design
 * @returns An object containing the generated 3D model data
 */
export async function generateCadDesign(prompt: string) {
  try {
    if (!isApiKeyConfigured()) {
      throw new Error('OpenAI API key is not configured');
    }

    // Use the OpenAI API to generate a response
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo', // You may want to use a specific model for 3D design
      messages: [
        {
          role: 'system',
          content: `You are a CAD design assistant that generates 3D models based on text descriptions. 
          
For each design request, provide a response in the following format:

MODEL SPECIFICATIONS:
- Type: [type of part, e.g., gear, bracket, enclosure]
- Dimensions: [key dimensions in mm]
- Features: [list key features]

PARAMETERS:
- [parameter1]: [value] [unit]
- [parameter2]: [value] [unit]
- ...

DESCRIPTION:
[A few sentences describing the design and its function]

For gears specifically, always include these parameters:
- Teeth Count: [number] teeth
- Diameter: [number] mm diameter
- Thickness: [number] mm thick
- Bore Diameter: [number] mm
- Pressure Angle: [number] degrees

Make reasonable assumptions for any unspecified parameters based on standard engineering practices.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: .6,
      max_tokens: 4000,
    });

    // Process the response to extract 3D model data
    const generatedText = response.choices[0]?.message?.content || '';
    
    // For now, just return the raw response
    return {
      success: true,
      modelData: generatedText,
      raw: response
    };
  } catch (error) {
    console.error('Error generating CAD design:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export default openai; 