import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function POST(request: NextRequest) {
  try {
    const { skinId, restaurantId, restaurantFile, displayConfig } = await request.json();
    
    if (!skinId || !restaurantId || !restaurantFile) {
      return NextResponse.json(
        { error: 'Missing required parameters: skinId, restaurantId, restaurantFile' },
        { status: 400 }
      );
    }

    // Validate restaurant file exists
    const restaurantPath = path.join(process.cwd(), 'data/restaurants', restaurantFile);
    try {
      await fs.access(restaurantPath);
    } catch {
      return NextResponse.json(
        { error: `Restaurant data file not found: ${restaurantFile}` },
        { status: 404 }
      );
    }

    // Validate skin exists
    const skinPath = path.join(process.cwd(), 'skins', skinId);
    try {
      await fs.access(skinPath);
    } catch {
      return NextResponse.json(
        { error: `Skin not found: ${skinId}` },
        { status: 404 }
      );
    }

    // Read the restaurant data
    const restaurantData = JSON.parse(await fs.readFile(restaurantPath, 'utf8'));
    const restaurantName = restaurantData.restaurant_info?.name || restaurantId;
    
    // For now, return success with the preview data
    // The actual static generation will be implemented later
    const stats = {
      restaurantName,
      skinId,
      generatedAt: new Date().toISOString(),
      previewMode: true,
      message: 'Preview generated successfully - static site generation coming soon',
      displayConfig,
    };

    console.log(`✅ Preview generation successful:`, stats);

    return NextResponse.json({
      success: true,
      message: `Preview generated successfully for ${restaurantName}`,
      data: stats,
      skinId,
      restaurantId,
      restaurantName,
      type: 'skin'
      // No external previewUrl for skin templates - they show inline preview
    });

  } catch (error) {
    console.error('Generation error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { error: 'Website generation failed', details: errorMessage },
      { status: 500 }
    );
  }
}

// Handle preflight OPTIONS request
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}