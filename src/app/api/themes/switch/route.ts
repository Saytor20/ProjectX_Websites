import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const { themeId } = await request.json();
    
    if (!themeId) {
      return NextResponse.json(
        { success: false, error: 'Theme ID is required' },
        { status: 400 }
      );
    }
    
    // Verify theme exists
    const skinsDir = join(process.cwd(), 'skins');
    const themeDir = join(skinsDir, themeId);
    
    try {
      await readFile(join(themeDir, 'skin.css'), 'utf-8');
    } catch {
      return NextResponse.json(
        { success: false, error: 'Theme not found' },
        { status: 404 }
      );
    }
    
    // For development, we'll return success and let the client handle the switch
    // In production, this might update a database or configuration file
    
    return NextResponse.json({
      success: true,
      themeId,
      message: 'Theme switched successfully',
      cssUrl: `/skins/${themeId}/skin.css`,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error switching theme:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to switch theme',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}