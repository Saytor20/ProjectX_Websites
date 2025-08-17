import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { scopeCSSString } from '@/lib/css-scoper';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ skinId: string }> }
) {
  try {
    const { skinId } = await context.params;
    
    // Read source CSS
    const cssPath = path.join(process.cwd(), 'skins', skinId, 'skin.css');
    const sourceCSS = await fs.readFile(cssPath, 'utf8');
    
    // Process CSS on-demand with scoping
    const result = await scopeCSSString(sourceCSS, skinId, {
      scopeKeyframes: true,
      scopeVariables: true,
      addContainment: true,
      minify: false, // Keep readable for development
      enforceNaming: true,
    });
    
    // Return processed CSS with proper headers
    return new NextResponse(result.css, {
      headers: {
        'Content-Type': 'text/css',
        'Cache-Control': 'no-cache', // Disable caching for development
      },
    });
    
  } catch (error) {
    const { skinId } = await context.params;
    console.error(`Failed to process CSS for skin ${skinId}:`, error);
    return new NextResponse(
      `/* Error loading CSS for skin ${skinId} */`,
      { 
        status: 500,
        headers: { 'Content-Type': 'text/css' }
      }
    );
  }
}