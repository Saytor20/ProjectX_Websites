#!/usr/bin/env ts-node

/**
 * Token Builder Script - Phase B Enhanced with Style Dictionary (Phase 3)
 * Reads tokens.json and generates tokens.css for each skin
 * Supports hot reload, automatic CSS variable generation, and Style Dictionary integration
 */

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import StyleDictionary from 'style-dictionary';
import chroma from 'chroma-js';
import type { 
  StyleDictionaryConfig,
  DesignToken,
  Dictionary 
} from '../src/editor/types/style-dictionary';

interface TokenColors {
  primary?: string;
  primaryHover?: string;
  secondary?: string;
  accent?: string;
  background?: string;
  surface?: string;
  text?: {
    primary?: string;
    secondary?: string;
    muted?: string;
    inverse?: string;
  };
  border?: {
    default?: string;
    light?: string;
    dark?: string;
  };
  status?: {
    success?: string;
    warning?: string;
    error?: string;
    info?: string;
  };
}

interface TokenTypography {
  fontFamily?: {
    sans?: string[] | string;
    serif?: string[] | string;
    mono?: string[] | string;
    display?: string[] | string;
  };
  fontSize?: Record<string, string>;
  fontWeight?: Record<string, number | string>;
  lineHeight?: Record<string, string>;
}

interface TokenSpacing {
  [key: string]: string;
}

interface TokenBorderRadius {
  [key: string]: string;
}

interface TokenShadows {
  [key: string]: string;
}

interface TokenAnimation {
  transition?: Record<string, string>;
  easing?: Record<string, string>;
}

interface TokenComponents {
  [componentName: string]: Record<string, any>;
}

interface TokenStructure {
  colors?: TokenColors;
  typography?: TokenTypography;
  spacing?: TokenSpacing;
  borderRadius?: TokenBorderRadius;
  shadows?: TokenShadows;
  animation?: TokenAnimation;
  components?: TokenComponents;
}

class TokenBuilder {
  private skinsDir: string;
  private processedCount = 0;
  private useStyleDictionary: boolean;

  constructor(useStyleDictionary = true) {
    this.skinsDir = path.join(process.cwd(), 'skins');
    this.useStyleDictionary = useStyleDictionary;
    this.setupStyleDictionary();
  }

  private setupStyleDictionary(): void {
    if (!this.useStyleDictionary) return;

    // Register custom transforms
    StyleDictionary.registerTransform({
      name: 'color/css-scoped',
      type: 'value',
      filter: (token: DesignToken) => token.type === 'color',
      transform: (token: DesignToken) => {
        try {
          return chroma(token.value).css();
        } catch {
          return token.value;
        }
      }
    });

    StyleDictionary.registerTransform({
      name: 'size/css-rem',
      type: 'value',
      filter: (token: DesignToken) => 
        token.type === 'dimension' || token.path.includes('spacing') || token.path.includes('fontSize'),
      transform: (token: DesignToken) => {
        if (typeof token.value === 'string' && token.value.endsWith('px')) {
          const px = parseFloat(token.value);
          return `${px / 16}rem`;
        }
        return token.value;
      }
    });

    StyleDictionary.registerTransform({
      name: 'font/css-family',
      type: 'value',
      filter: (token: DesignToken) => 
        token.path.includes('fontFamily') || token.type === 'fontFamily',
      transform: (token: DesignToken) => {
        if (Array.isArray(token.value)) {
          return token.value
            .map(font => font.includes(' ') ? `"${font}"` : font)
            .join(', ');
        }
        return token.value;
      }
    });

    StyleDictionary.registerTransform({
      name: 'shadow/css-multiple',
      type: 'value',
      filter: (token: DesignToken) => 
        token.path.includes('shadow') || token.type === 'shadow',
      transform: (token: DesignToken) => {
        if (typeof token.value === 'object' && token.value.x !== undefined) {
          const { x, y, blur, spread, color, inset } = token.value;
          return `${inset ? 'inset ' : ''}${x}px ${y}px ${blur}px ${spread}px ${color}`;
        }
        return token.value;
      }
    });

    // Register custom format for CSS scoped variables
    StyleDictionary.registerFormat({
      name: 'css/scoped-variables',
      // @ts-ignore - StyleDictionary types are complex and causing build issues
      format: function({ dictionary, file }: any) {
        const { selector = ':root' } = file.options || {};
        
        const cssVars = dictionary.allTokens
          .map(token => `  --${token.name}: ${token.value};`)
          .join('\n');

        return `/**
 * Auto-generated CSS Custom Properties with Style Dictionary
 * Skin: ${file.destination.includes('/') ? file.destination.split('/')[0] : 'unknown'}
 * Generated: ${new Date().toISOString()}
 * Do not edit manually - use tokens.json instead
 */

${selector} {
${cssVars}
}
`;
      }
    });

    // Register custom format for scoped CSS
    StyleDictionary.registerFormat({
      name: 'css/scoped-skin',
      // @ts-ignore - StyleDictionary types are complex and causing build issues
      format: function({ dictionary, file }: any) {
        const { skinId } = file.options || {};
        const selector = `[data-skin="${skinId}"]`;
        
        const cssVars = dictionary.allTokens
          .map(token => `  --${token.name}: ${token.value};`)
          .join('\n');

        return `/**
 * Scoped CSS Variables for Skin: ${skinId}
 * Generated: ${new Date().toISOString()}
 */

${selector} {
${cssVars}
}
`;
      }
    });
  }

  async buildAll(): Promise<void> {
    console.log(chalk.blue.bold('🎨 Building design tokens...'));
    
    if (!fs.existsSync(this.skinsDir)) {
      console.error(chalk.red(`Skins directory not found: ${this.skinsDir}`));
      process.exit(1);
    }

    const skinDirs = fs.readdirSync(this.skinsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    for (const skinName of skinDirs) {
      await this.buildSkinTokens(skinName);
    }

    console.log(chalk.green.bold(`✅ Built tokens for ${this.processedCount} skins`));
  }

  async buildSkinTokens(skinName: string): Promise<void> {
    const skinDir = path.join(this.skinsDir, skinName);
    const tokensFile = path.join(skinDir, 'tokens.json');
    const outputFile = path.join(skinDir, 'tokens.css');

    if (!fs.existsSync(tokensFile)) {
      console.log(chalk.yellow(`⚠️  No tokens.json found for ${skinName}, skipping...`));
      return;
    }

    try {
      if (this.useStyleDictionary) {
        await this.buildWithStyleDictionary(skinName, skinDir, tokensFile, outputFile);
      } else {
        // Fallback to legacy token processing
        const tokensContent = fs.readFileSync(tokensFile, 'utf-8');
        const tokens: TokenStructure = JSON.parse(tokensContent);
        
        const css = this.generateCSSFromTokens(tokens, skinName);
        fs.writeFileSync(outputFile, css, 'utf-8');
      }
      
      this.processedCount++;
      console.log(chalk.green(`  ✅ ${skinName} → tokens.css ${this.useStyleDictionary ? '(Style Dictionary)' : '(Legacy)'}`));
    } catch (error) {
      console.error(chalk.red(`  ❌ Error processing ${skinName}:`), error);
      
      // Fallback to legacy processing on Style Dictionary error
      if (this.useStyleDictionary) {
        console.log(chalk.yellow(`  🔄 Falling back to legacy processing for ${skinName}...`));
        try {
          const tokensContent = fs.readFileSync(tokensFile, 'utf-8');
          const tokens: TokenStructure = JSON.parse(tokensContent);
          
          const css = this.generateCSSFromTokens(tokens, skinName);
          fs.writeFileSync(outputFile, css, 'utf-8');
          
          console.log(chalk.green(`  ✅ ${skinName} → tokens.css (Legacy fallback)`));
        } catch (fallbackError) {
          console.error(chalk.red(`  ❌ Legacy fallback also failed for ${skinName}:`), fallbackError);
        }
      }
    }
  }

  private async buildWithStyleDictionary(
    skinName: string, 
    skinDir: string, 
    tokensFile: string, 
    outputFile: string
  ): Promise<void> {
    // Create Style Dictionary configuration
    const config = {
      source: [tokensFile],
      platforms: {
        css: {
          transformGroup: 'css',
          transforms: [
            'attribute/cti',
            'name/cti/kebab',
            'color/css-scoped',
            'size/css-rem',
            'font/css-family',
            'shadow/css-multiple'
          ],
          buildPath: skinDir + '/',
          files: [
            {
              destination: 'tokens.css',
              format: 'css/scoped-variables',
              options: {
                selector: ':root',
                skinId: skinName
              }
            }
          ]
        },
        'css-scoped': {
          transformGroup: 'css',
          transforms: [
            'attribute/cti',
            'name/cti/kebab',
            'color/css-scoped',
            'size/css-rem',
            'font/css-family',
            'shadow/css-multiple'
          ],
          buildPath: skinDir + '/',
          files: [
            {
              destination: 'tokens-scoped.css',
              format: 'css/scoped-skin',
              options: {
                skinId: skinName
              }
            }
          ]
        }
      }
    };

    // Build with Style Dictionary
    // @ts-ignore - StyleDictionary API has changed in newer versions
    const StyleDictionaryExtended = StyleDictionary.extend ? StyleDictionary.extend(config) : new StyleDictionary(config);
    await StyleDictionaryExtended.buildAllPlatforms();

    // Generate performance metrics
    const tokensContent = fs.readFileSync(tokensFile, 'utf-8');
    const tokens = JSON.parse(tokensContent);
    const tokenCount = this.countTokens(tokens);
    const cssContent = fs.readFileSync(outputFile, 'utf-8');
    const cssSize = Buffer.byteLength(cssContent, 'utf-8');

    // Log performance info
    console.log(chalk.gray(`    📊 ${tokenCount} tokens → ${this.formatBytes(cssSize)}`));
  }

  private countTokens(obj: any, count = 0): number {
    for (const value of Object.values(obj)) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        count = this.countTokens(value, count);
      } else {
        count++;
      }
    }
    return count;
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  private generateCSSFromTokens(tokens: TokenStructure, skinName: string): string {
    const lines: string[] = [];
    
    lines.push(`/**`);
    lines.push(` * Auto-generated CSS Custom Properties`);
    lines.push(` * Generated from tokens.json for skin: ${skinName}`);
    lines.push(` * Do not edit manually - use tokens.json instead`);
    lines.push(` */`);
    lines.push('');
    lines.push(':root {');

    // Colors
    if (tokens.colors) {
      lines.push('  /* Colors */');
      
      if (tokens.colors.primary) lines.push(`  --color-primary: ${tokens.colors.primary};`);
      if (tokens.colors.primaryHover) lines.push(`  --color-primary-hover: ${tokens.colors.primaryHover};`);
      if (tokens.colors.secondary) lines.push(`  --color-secondary: ${tokens.colors.secondary};`);
      if (tokens.colors.accent) lines.push(`  --color-accent: ${tokens.colors.accent};`);
      if (tokens.colors.background) lines.push(`  --color-background: ${tokens.colors.background};`);
      if (tokens.colors.surface) lines.push(`  --color-surface: ${tokens.colors.surface};`);

      // Text colors
      if (tokens.colors.text) {
        lines.push('  /* Text Colors */');
        if (tokens.colors.text.primary) lines.push(`  --color-text-primary: ${tokens.colors.text.primary};`);
        if (tokens.colors.text.secondary) lines.push(`  --color-text-secondary: ${tokens.colors.text.secondary};`);
        if (tokens.colors.text.muted) lines.push(`  --color-text-muted: ${tokens.colors.text.muted};`);
        if (tokens.colors.text.inverse) lines.push(`  --color-text-inverse: ${tokens.colors.text.inverse};`);
      }

      // Border colors
      if (tokens.colors.border) {
        lines.push('  /* Border Colors */');
        if (tokens.colors.border.default) lines.push(`  --color-border: ${tokens.colors.border.default};`);
        if (tokens.colors.border.light) lines.push(`  --color-border-light: ${tokens.colors.border.light};`);
        if (tokens.colors.border.dark) lines.push(`  --color-border-dark: ${tokens.colors.border.dark};`);
      }

      // Status colors
      if (tokens.colors.status) {
        lines.push('  /* Status Colors */');
        if (tokens.colors.status.success) lines.push(`  --color-success: ${tokens.colors.status.success};`);
        if (tokens.colors.status.warning) lines.push(`  --color-warning: ${tokens.colors.status.warning};`);
        if (tokens.colors.status.error) lines.push(`  --color-error: ${tokens.colors.status.error};`);
        if (tokens.colors.status.info) lines.push(`  --color-info: ${tokens.colors.status.info};`);
      }

      lines.push('');
    }

    // Typography
    if (tokens.typography) {
      lines.push('  /* Typography */');
      
      if (tokens.typography.fontFamily) {
        Object.entries(tokens.typography.fontFamily).forEach(([key, value]) => {
          if (value) {
            const fontValue = Array.isArray(value) 
              ? value.map(f => f.includes(' ') ? `"${f}"` : f).join(', ')
              : value;
            lines.push(`  --font-${key}: ${fontValue};`);
          }
        });
      }

      if (tokens.typography.fontSize) {
        lines.push('  /* Font Sizes */');
        Object.entries(tokens.typography.fontSize).forEach(([key, value]) => {
          lines.push(`  --font-size-${key}: ${value};`);
        });
      }

      if (tokens.typography.fontWeight) {
        lines.push('  /* Font Weights */');
        Object.entries(tokens.typography.fontWeight).forEach(([key, value]) => {
          lines.push(`  --font-weight-${key}: ${value};`);
        });
      }

      if (tokens.typography.lineHeight) {
        lines.push('  /* Line Heights */');
        Object.entries(tokens.typography.lineHeight).forEach(([key, value]) => {
          lines.push(`  --line-height-${key}: ${value};`);
        });
      }

      lines.push('');
    }

    // Spacing
    if (tokens.spacing) {
      lines.push('  /* Spacing */');
      Object.entries(tokens.spacing).forEach(([key, value]) => {
        lines.push(`  --space-${key}: ${value};`);
      });
      lines.push('');
    }

    // Border radius
    if (tokens.borderRadius) {
      lines.push('  /* Border Radius */');
      Object.entries(tokens.borderRadius).forEach(([key, value]) => {
        lines.push(`  --radius-${key}: ${value};`);
      });
      lines.push('');
    }

    // Shadows
    if (tokens.shadows) {
      lines.push('  /* Shadows */');
      Object.entries(tokens.shadows).forEach(([key, value]) => {
        lines.push(`  --shadow-${key}: ${value};`);
      });
      lines.push('');
    }

    // Animation
    if (tokens.animation) {
      if (tokens.animation.transition) {
        lines.push('  /* Transitions */');
        Object.entries(tokens.animation.transition).forEach(([key, value]) => {
          lines.push(`  --transition-${key}: ${value};`);
        });
      }
      
      if (tokens.animation.easing) {
        lines.push('  /* Easing */');
        Object.entries(tokens.animation.easing).forEach(([key, value]) => {
          lines.push(`  --easing-${key}: ${value};`);
        });
      }
      lines.push('');
    }

    // Components
    if (tokens.components) {
      lines.push('  /* Component Tokens */');
      Object.entries(tokens.components).forEach(([componentName, componentTokens]) => {
        Object.entries(componentTokens).forEach(([key, value]) => {
          lines.push(`  --${componentName}-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`);
        });
      });
      lines.push('');
    }

    lines.push('}');
    lines.push('');

    return lines.join('\n');
  }
}

// Main execution
async function main() {
  const builder = new TokenBuilder();
  await builder.buildAll();
}

if (require.main === module) {
  main().catch(console.error);
}

export { TokenBuilder };