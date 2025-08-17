import { NextRequest, NextResponse } from 'next/server';
import { unlink, readdir } from 'fs/promises';
import { join } from 'path';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    const { fileId } = await params;
    const uploadsDir = join(process.cwd(), 'public', 'uploads');

    // Find the actual filename with extension
    const files = await readdir(uploadsDir);
    const targetFile = files.find(file => 
      file.replace(/\.[^/.]+$/, '') === fileId
    );

    if (!targetFile) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    const filePath = join(uploadsDir, targetFile);
    await unlink(filePath);

    return NextResponse.json({ 
      success: true, 
      message: 'File deleted successfully' 
    });
  } catch (error) {
    console.error('Failed to delete file:', error);
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}