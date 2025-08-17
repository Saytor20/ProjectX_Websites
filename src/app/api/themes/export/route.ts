import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import type { ThemeExportData } from '../../../../editor/types/theme';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const themeId = searchParams.get('themeId');
    
    if (!themeId) {
      return NextResponse.json(
        { success: false, error: 'Theme ID is required' },
        { status: 400 }
      );
    }
    
    const skinsDir = join(process.cwd(), 'skins');
    const themeDir = join(skinsDir, themeId);
    
    // Read theme metadata
    let metadata;
    try {
      const templateContent = await readFile(join(themeDir, 'template.json'), 'utf-8');
      metadata = JSON.parse(templateContent);
    } catch {
      return NextResponse.json(
        { success: false, error: 'Theme metadata not found' },
        { status: 404 }
      );
    }
    
    // Read theme tokens
    let tokens;
    try {
      const tokensContent = await readFile(join(themeDir, 'tokens.json'), 'utf-8');
      tokens = JSON.parse(tokensContent);
    } catch {
      return NextResponse.json(
        { success: false, error: 'Theme tokens not found' },
        { status: 404 }
      );
    }
    
    // Read theme CSS
    let css;
    try {
      css = await readFile(join(themeDir, 'skin.css'), 'utf-8');
    } catch {
      console.warn(`CSS not found for theme ${themeId}`);
      css = '';
    }
    
    // Read component mapping
    let mapping;
    try {
      const mappingContent = await readFile(join(themeDir, 'map.yml'), 'utf-8');
      mapping = mappingContent;
    } catch {
      console.warn(`Mapping not found for theme ${themeId}`);
      mapping = '';
    }
    
    // Create export data
    const exportData: ThemeExportData = {
      metadata: {
        id: metadata.id || themeId,
        name: metadata.name || themeId,
        description: metadata.description || '',
        category: metadata.category || 'modern',
        author: metadata.author || 'Unknown',
        version: metadata.version || '1.0.0',
        features: metadata.features || [],
        tags: metadata.tags || [],
        previewImages: {
          thumbnail: `/skins/${themeId}/preview.jpg`
        },
        isCustom: false,
        createdAt: metadata.created || new Date().toISOString(),
        updatedAt: metadata.updated || new Date().toISOString()
      },
      tokens,
      version: '1.0.0',
      exportedAt: new Date().toISOString()
    };
    
    // Add additional data for complete export
    const completeExport = {
      ...exportData,
      css,
      mapping,
      exportType: 'complete',
      compatibility: {
        minVersion: '1.0.0',
        maxVersion: '2.0.0'
      }
    };
    
    return NextResponse.json({
      success: true,
      exportData: completeExport,
      filename: `${themeId}-theme-${new Date().toISOString().split('T')[0]}.json`
    });
    
  } catch (error) {
    console.error('Error exporting theme:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to export theme',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}