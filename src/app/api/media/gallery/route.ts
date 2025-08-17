import { NextRequest, NextResponse } from 'next/server';
import { readdir, stat } from 'fs/promises';
import { join } from 'path';

export async function GET(request: NextRequest) {
  try {
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    
    // Check if uploads directory exists
    try {
      await stat(uploadsDir);
    } catch {
      // Directory doesn't exist, return empty array
      return NextResponse.json([]);
    }

    const files = await readdir(uploadsDir);
    const imageFiles = files.filter(file => {
      const ext = file.toLowerCase();
      return ext.endsWith('.jpg') || ext.endsWith('.jpeg') || 
             ext.endsWith('.png') || ext.endsWith('.gif') || 
             ext.endsWith('.webp') || ext.endsWith('.svg');
    });

    const mediaFiles = await Promise.all(
      imageFiles.map(async (filename) => {
        const filePath = join(uploadsDir, filename);
        const stats = await stat(filePath);
        
        return {
          id: filename.replace(/\.[^/.]+$/, ''), // Remove extension for ID
          name: filename,
          url: `/uploads/${filename}`,
          type: `image/${filename.split('.').pop()}`,
          size: stats.size,
          uploadedAt: stats.mtime.toISOString(),
        };
      })
    );

    // Sort by upload date (newest first)
    mediaFiles.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

    return NextResponse.json(mediaFiles);
  } catch (error) {
    console.error('Failed to load media gallery:', error);
    return NextResponse.json(
      { error: 'Failed to load media files' },
      { status: 500 }
    );
  }
}