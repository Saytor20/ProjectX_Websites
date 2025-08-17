import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import type { ThemeExportData, ThemeImportResult } from '../../../../editor/types/theme';

export async function POST(request: NextRequest) {
  try {
    const importData: ThemeExportData = await request.json();
    
    // Validate import data structure
    const validationResult = validateImportData(importData);
    if (!validationResult.isValid) {
      return NextResponse.json({
        success: false,
        errors: validationResult.errors,
        warnings: validationResult.warnings
      } satisfies ThemeImportResult, { status: 400 });
    }
    
    const themeId = importData.metadata.id;
    const skinsDir = join(process.cwd(), 'skins');
    const themeDir = join(skinsDir, themeId);
    
    // Check if theme already exists
    if (existsSync(themeDir)) {
      return NextResponse.json({
        success: false,
        errors: [`Theme '${themeId}' already exists. Please choose a different ID or delete the existing theme.`],
        warnings: []
      } satisfies ThemeImportResult, { status: 409 });
    }
    
    try {
      // Create theme directory
      await mkdir(themeDir, { recursive: true });
      
      // Write template.json
      const templateData = {
        id: importData.metadata.id,
        name: importData.metadata.name,
        version: importData.metadata.version,
        description: importData.metadata.description,
        author: importData.metadata.author,
        tags: importData.metadata.tags,
        category: importData.metadata.category,
        preview: 'preview.jpg',
        colors: extractColorsFromTokens(importData.tokens),
        typography: extractTypographyFromTokens(importData.tokens),
        features: importData.metadata.features,
        suitable_for: [`Imported ${importData.metadata.category} theme`],
        created: importData.metadata.createdAt,
        updated: new Date().toISOString()
      };
      
      await writeFile(
        join(themeDir, 'template.json'),
        JSON.stringify(templateData, null, 2),
        'utf-8'
      );
      
      // Write tokens.json
      await writeFile(
        join(themeDir, 'tokens.json'),
        JSON.stringify(importData.tokens, null, 2),
        'utf-8'
      );
      
      // Write CSS if provided
      if ((importData as any).css) {
        await writeFile(
          join(themeDir, 'skin.css'),
          (importData as any).css,
          'utf-8'
        );
      }
      
      // Write mapping if provided
      if ((importData as any).mapping) {
        await writeFile(
          join(themeDir, 'map.yml'),
          (importData as any).mapping,
          'utf-8'
        );
      }
      
      return NextResponse.json({
        success: true,
        theme: importData.metadata,
        warnings: validationResult.warnings
      } satisfies ThemeImportResult);
      
    } catch (error) {
      console.error('Error writing theme files:', error);
      return NextResponse.json({
        success: false,
        errors: ['Failed to write theme files to disk'],
        warnings: []
      } satisfies ThemeImportResult, { status: 500 });
    }
    
  } catch (error) {
    console.error('Error importing theme:', error);
    return NextResponse.json({
      success: false,
      errors: ['Failed to process import data'],
      warnings: []
    } satisfies ThemeImportResult, { status: 500 });
  }
}

function validateImportData(data: any): { isValid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check required fields
  if (!data.metadata) {
    errors.push('Missing metadata');
  } else {
    if (!data.metadata.id) errors.push('Missing theme ID');
    if (!data.metadata.name) errors.push('Missing theme name');
    if (!data.metadata.version) warnings.push('Missing version, using default');
    if (!data.metadata.category) warnings.push('Missing category, using default');
  }
  
  if (!data.tokens) {
    errors.push('Missing tokens');
  } else {
    // Validate token structure
    if (!data.tokens.colors) warnings.push('Missing colors in tokens');
    if (!data.tokens.typography) warnings.push('Missing typography in tokens');
    if (!data.tokens.spacing) warnings.push('Missing spacing in tokens');
  }
  
  if (!data.version) {
    warnings.push('Missing export version');
  }
  
  // Check for theme ID conflicts (basic validation)
  if (data.metadata?.id && !/^[a-z0-9-]+$/.test(data.metadata.id)) {
    errors.push('Theme ID must contain only lowercase letters, numbers, and hyphens');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

function extractColorsFromTokens(tokens: any): any {
  const colors: any = {};
  
  if (tokens.colors) {
    colors.primary = tokens.colors.primary || '#000000';
    colors.secondary = tokens.colors.secondary || '#666666';
    colors.accent = tokens.colors.accent || '#0066cc';
  }
  
  return colors;
}

function extractTypographyFromTokens(tokens: any): any {
  const typography: any = {};
  
  if (tokens.typography?.fontFamily) {
    const fonts = tokens.typography.fontFamily;
    typography.headings = Array.isArray(fonts.serif) ? fonts.serif[0] : fonts.serif || 'serif';
    typography.body = Array.isArray(fonts.sans) ? fonts.sans[0] : fonts.sans || 'sans-serif';
  }
  
  return typography;
}