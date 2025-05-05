import { NextRequest, NextResponse } from 'next/server';
import { LumaAI } from 'lumaai';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const generationId = searchParams.get('id');

    if (!generationId) {
      return NextResponse.json(
        { error: 'Generation ID is required' },
        { status: 400 }
      );
    }

    // Initialize Luma AI client
    const client = new LumaAI({
      authToken: process.env.LUMAAI_API_KEY,
    });

    // Get generation by ID
    const generation = await client.generations.get(generationId);

    return NextResponse.json({
      id: generation.id,
      state: generation.state,
      imageUrl: generation.assets?.image || null,
    });
  } catch (error: any) {
    console.error('Error checking generation status:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to check generation status' },
      { status: 500 }
    );
  }
} 