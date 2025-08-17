import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const site = searchParams.get('site');
    
    if (!site) {
      return new NextResponse('Site parameter required', { status: 400 });
    }
    
    // Sanitize site name to prevent directory traversal
    const safeSiteName = site.replace(/[^a-zA-Z0-9\-_\s]/g, '');
    const sitePath = path.join(process.cwd(), 'generated_sites', safeSiteName);
    
    // Check if site directory exists
    if (!fs.existsSync(sitePath)) {
      return new NextResponse('Site not found', { status: 404 });
    }
    
    // Look for index.html
    const indexPath = path.join(sitePath, 'index.html');
    if (!fs.existsSync(indexPath)) {
      return new NextResponse('Site index not found', { status: 404 });
    }
    
    // Read and serve the HTML content
    const htmlContent = fs.readFileSync(indexPath, 'utf-8');
    
    // Update relative paths to work with the preview endpoint
    const updatedHtml = htmlContent
      .replace(/href="\/_next/g, `href="/api/preview/assets?site=${encodeURIComponent(safeSiteName)}&path=_next`)
      .replace(/src="\/_next/g, `src="/api/preview/assets?site=${encodeURIComponent(safeSiteName)}&path=_next`)
      .replace(/href="\/images/g, `href="/api/preview/assets?site=${encodeURIComponent(safeSiteName)}&path=images`)
      .replace(/src="\/images/g, `src="/api/preview/assets?site=${encodeURIComponent(safeSiteName)}&path=images`);
    
    return new NextResponse(updatedHtml, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Preview error:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}