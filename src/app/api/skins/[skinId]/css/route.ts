import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { scopeCSS } from '@/lib/css-scoper';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ skinId: string }> }
) {
  try {
    const { skinId } = await context.params;
    
    // Read source CSS
    const cssPath = path.join(process.cwd(), 'skins', skinId, 'skin.css');
    const sourceCSS = await fs.readFile(cssPath, 'utf8');
    
    // Use centralized CSS scoping utility
    const scopedCSS = scopeCSS(sourceCSS, {
      skinId,
      prefix: 'data-skin',
      excludeSelectors: ['@media', '@keyframes', '@supports'],
      includeKeyframes: true
    });
    
    // Return processed CSS with proper headers
    return new NextResponse(scopedCSS, {
      headers: {
        'Content-Type': 'text/css',
        'Cache-Control': 'no-cache',
      },
    });
    
  } catch (error) {
    const { skinId } = await context.params;
    console.error(`Failed to load CSS for skin ${skinId}:`, error);
    return new NextResponse(
      `/* Error loading CSS for skin ${skinId} */`,
      { 
        status: 500,
        headers: { 'Content-Type': 'text/css' }
      }
    );
  }
}