import { NextRequest, NextResponse } from 'next/server';
import { generateCadDesign, isApiKeyConfigured } from '@/utils/openai';

export async function POST(request: NextRequest) {
  try {
    // Check if the API key is configured
    if (!isApiKeyConfigured()) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }

    // Parse the request body
    const body = await request.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Generate the CAD design
    const result = await generateCadDesign(prompt);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    // Return the result
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in CAD design API:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 