import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { getTemplate } from '../../../../templates/registry';

export async function POST(request: NextRequest) {
  try {
    const { templateId, restaurantId, restaurantFile, displayConfig } = await request.json();
    
    if (!templateId || !restaurantId || !restaurantFile) {
      return NextResponse.json(
        { error: 'Missing required parameters: templateId, restaurantId, restaurantFile' },
        { status: 400 }
      );
    }

    // Validate restaurant file exists
    const restaurantPath = path.join(process.cwd(), 'restaurant_data', restaurantFile);
    try {
      await fs.access(restaurantPath);
    } catch {
      return NextResponse.json(
        { error: `Restaurant data file not found: ${restaurantFile}` },
        { status: 404 }
      );
    }

    // Validate template exists
    const tpl = getTemplate(String(templateId));
    if (!tpl) {
      return NextResponse.json(
        { error: `Template not found: ${templateId}` },
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
      templateId,
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
      templateId,
      restaurantId,
      restaurantName,
      type: 'template',
      previewUrl: `/restaurant/${restaurantId}?template=${encodeURIComponent(String(templateId))}&preview=true`
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
