import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import type { ThemeCustomization } from '../../../../editor/types/theme';

export async function POST(request: NextRequest) {
  try {
    const customization: ThemeCustomization = await request.json();
    
    if (!customization.themeId) {
      return NextResponse.json(
        { success: false, error: 'Theme ID is required' },
        { status: 400 }
      );
    }
    
    // Verify base theme exists
    const skinsDir = join(process.cwd(), 'skins');
    const baseThemeDir = join(skinsDir, customization.themeId);
    
    try {
      await readFile(join(baseThemeDir, 'tokens.json'), 'utf-8');
    } catch {
      return NextResponse.json(
        { success: false, error: 'Base theme not found' },
        { status: 404 }
      );
    }
    
    // Generate CSS variables from custom tokens
    const cssVariables = generateCSSVariables(customization.customTokens);
    
    // Apply component customizations
    const componentStyles = generateComponentStyles(customization.componentSettings);
    
    // Apply responsive customizations
    const responsiveStyles = generateResponsiveStyles(customization.responsiveSettings);
    
    // Combine all customizations into CSS
    const customCSS = `
/* Theme Customizations - ${customization.name} */
/* Generated: ${new Date().toISOString()} */

:root {
${cssVariables}
}

/* Component Customizations */
${componentStyles}

/* Responsive Customizations */
${responsiveStyles}
    `.trim();
    
    // Return the generated CSS for client-side application
    return NextResponse.json({
      success: true,
      customization: {
        ...customization,
        updatedAt: new Date().toISOString()
      },
      customCSS,
      message: 'Theme customization applied successfully'
    });
    
  } catch (error) {
    console.error('Error applying theme customization:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to apply theme customization',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

function generateCSSVariables(tokens: Record<string, any>): string {
  const variables: string[] = [];
  
  function processTokens(obj: any, prefix = '') {
    for (const [key, value] of Object.entries(obj)) {
      const varName = prefix ? `${prefix}-${key}` : key;
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        processTokens(value, varName);
      } else {
        variables.push(`  --${varName}: ${value};`);
      }
    }
  }
  
  processTokens(tokens);
  return variables.join('\n');
}

function generateComponentStyles(componentSettings: any[]): string {
  if (!componentSettings?.length) return '';
  
  const styles: string[] = [];
  
  for (const setting of componentSettings) {
    if (!setting.visibility) {
      styles.push(`[data-component="${setting.componentId}"] { display: none !important; }`);
    }
    
    if (setting.customStyles && Object.keys(setting.customStyles).length > 0) {
      const customRules = Object.entries(setting.customStyles)
        .map(([property, value]) => `  ${property}: ${value};`)
        .join('\n');
      
      styles.push(`[data-component="${setting.componentId}"] {\n${customRules}\n}`);
    }
  }
  
  return styles.join('\n\n');
}

function generateResponsiveStyles(responsiveSettings: any): string {
  if (!responsiveSettings) return '';
  
  const styles: string[] = [];
  
  // Mobile styles
  if (responsiveSettings.mobile) {
    const mobileStyles = generateDeviceStyles(responsiveSettings.mobile);
    if (mobileStyles) {
      styles.push(`@media (max-width: 767px) {\n${mobileStyles}\n}`);
    }
  }
  
  // Tablet styles
  if (responsiveSettings.tablet) {
    const tabletStyles = generateDeviceStyles(responsiveSettings.tablet);
    if (tabletStyles) {
      styles.push(`@media (min-width: 768px) and (max-width: 1023px) {\n${tabletStyles}\n}`);
    }
  }
  
  // Desktop styles
  if (responsiveSettings.desktop) {
    const desktopStyles = generateDeviceStyles(responsiveSettings.desktop);
    if (desktopStyles) {
      styles.push(`@media (min-width: 1024px) {\n${desktopStyles}\n}`);
    }
  }
  
  return styles.join('\n\n');
}

function generateDeviceStyles(deviceSettings: any): string {
  const styles: string[] = [];
  
  // Hidden components
  if (deviceSettings.hidden?.length) {
    for (const componentId of deviceSettings.hidden) {
      styles.push(`  [data-component="${componentId}"] { display: none !important; }`);
    }
  }
  
  // Custom styles
  if (deviceSettings.styles) {
    for (const [componentId, componentStyles] of Object.entries(deviceSettings.styles)) {
      const customRules = Object.entries(componentStyles as Record<string, string>)
        .map(([property, value]) => `    ${property}: ${value};`)
        .join('\n');
      
      styles.push(`  [data-component="${componentId}"] {\n${customRules}\n  }`);
    }
  }
  
  return styles.join('\n');
}