import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import mime from 'mime-types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const site = searchParams.get('site');
    const assetPath = searchParams.get('path');
    
    if (!site || !assetPath) {
      return new NextResponse('Site and path parameters required', { status: 400 });
    }
    
    // Sanitize inputs to prevent directory traversal
    const safeSiteName = site.replace(/[^a-zA-Z0-9\-_\s]/g, '');
    const safeAssetPath = assetPath.replace(/\.\./g, ''); // Remove .. for security
    
    const fullAssetPath = path.join(process.cwd(), 'generated_sites', safeSiteName, safeAssetPath);
    
    // Ensure the path is within the site directory (security check)
    const sitePath = path.join(process.cwd(), 'generated_sites', safeSiteName);
    const resolvedPath = path.resolve(fullAssetPath);
    const resolvedSitePath = path.resolve(sitePath);
    
    if (!resolvedPath.startsWith(resolvedSitePath)) {
      return new NextResponse('Access denied', { status: 403 });
    }
    
    // Check if file exists
    if (!fs.existsSync(fullAssetPath)) {
      return new NextResponse('Asset not found', { status: 404 });
    }
    
    // Read file
    const fileContent = fs.readFileSync(fullAssetPath);
    
    // Determine content type
    const mimeType = mime.lookup(fullAssetPath) || 'application/octet-stream';
    
    return new NextResponse(fileContent, {
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Asset serving error:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}