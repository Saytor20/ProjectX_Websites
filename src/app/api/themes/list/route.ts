import { NextRequest, NextResponse } from 'next/server';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import type { ThemeMetadata } from '../../../../editor/types/theme';

export async function GET(request: NextRequest) {
  try {
    const skinsDir = join(process.cwd(), 'skins');
    
    // Read all skin directories
    const skinDirs = await readdir(skinsDir, { withFileTypes: true });
    const themes: ThemeMetadata[] = [];
    
    for (const dir of skinDirs) {
      if (dir.isDirectory()) {
        try {
          const templatePath = join(skinsDir, dir.name, 'template.json');
          const templateContent = await readFile(templatePath, 'utf-8');
          const templateData = JSON.parse(templateContent);
          
          // Transform template data to ThemeMetadata format
          const theme: ThemeMetadata = {
            id: templateData.id || dir.name,
            name: templateData.name || dir.name,
            description: templateData.description || 'No description available',
            category: templateData.category || 'modern',
            author: templateData.author || 'Unknown',
            version: templateData.version || '1.0.0',
            features: templateData.features || [],
            tags: templateData.tags || [],
            previewImages: {
              thumbnail: `/skins/${dir.name}/preview.jpg`,
              hero: `/skins/${dir.name}/hero-preview.jpg`,
              mobile: `/skins/${dir.name}/mobile-preview.jpg`
            },
            isCustom: false,
            createdAt: templateData.created || new Date().toISOString(),
            updatedAt: templateData.updated || new Date().toISOString()
          };
          
          themes.push(theme);
        } catch (error) {
          console.warn(`Failed to read template.json for ${dir.name}:`, error);
          
          // Fallback: create basic metadata from directory name
          const theme: ThemeMetadata = {
            id: dir.name,
            name: dir.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            description: `${dir.name} theme`,
            category: 'modern',
            author: 'Unknown',
            version: '1.0.0',
            features: [],
            tags: [dir.name],
            previewImages: {
              thumbnail: `/skins/${dir.name}/preview.jpg`
            },
            isCustom: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          themes.push(theme);
        }
      }
    }
    
    // Sort themes by category and name
    themes.sort((a, b) => {
      if (a.category !== b.category) {
        const categoryOrder = ['premium', 'modern', 'classic', 'minimal', 'elegant', 'bold'];
        const aIndex = categoryOrder.indexOf(a.category);
        const bIndex = categoryOrder.indexOf(b.category);
        if (aIndex !== -1 && bIndex !== -1) {
          return aIndex - bIndex;
        }
        if (aIndex !== -1) return -1;
        if (bIndex !== -1) return 1;
        return a.category.localeCompare(b.category);
      }
      return a.name.localeCompare(b.name);
    });
    
    return NextResponse.json({
      success: true,
      themes,
      total: themes.length,
      categories: [...new Set(themes.map(t => t.category))],
      tags: [...new Set(themes.flatMap(t => t.tags))]
    });
    
  } catch (error) {
    console.error('Error loading themes:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load themes',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}