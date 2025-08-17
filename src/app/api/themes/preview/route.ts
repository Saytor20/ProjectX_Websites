import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import type { ThemePreviewConfig } from '../../../../editor/types/theme';

export async function POST(request: NextRequest) {
  try {
    const config: ThemePreviewConfig = await request.json();
    
    if (!config.themeId) {
      return NextResponse.json(
        { success: false, error: 'Theme ID is required' },
        { status: 400 }
      );
    }
    
    const skinsDir = join(process.cwd(), 'skins');
    const themeDir = join(skinsDir, config.themeId);
    
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
    let baseCss;
    try {
      baseCss = await readFile(join(themeDir, 'skin.css'), 'utf-8');
    } catch {
      return NextResponse.json(
        { success: false, error: 'Theme CSS not found' },
        { status: 404 }
      );
    }
    
    // Generate preview CSS with customizations
    let previewCss = baseCss;
    
    if (config.customizations) {
      const customCss = generateCustomizationCSS(config.customizations, tokens);
      previewCss = `${baseCss}\n\n/* Preview Customizations */\n${customCss}`;
    }
    
    // Apply viewport-specific styles
    const viewportCss = generateViewportCSS(config.viewport);
    if (viewportCss) {
      previewCss = `${previewCss}\n\n/* Viewport Preview */\n${viewportCss}`;
    }
    
    // Generate preview HTML structure
    const previewHtml = generatePreviewHTML(config, tokens);
    
    return NextResponse.json({
      success: true,
      preview: {
        css: previewCss,
        html: previewHtml,
        tokens: tokens,
        config: config
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error generating theme preview:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate theme preview',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

function generateCustomizationCSS(customizations: any, baseTokens: any): string {
  const cssRules: string[] = [];
  
  // Apply custom tokens as CSS variables
  if (customizations.customTokens) {
    const customVars = generateCSSVariables(customizations.customTokens);
    if (customVars) {
      cssRules.push(`:root {\n${customVars}\n}`);
    }
  }
  
  // Apply component customizations
  if (customizations.componentSettings) {
    for (const setting of customizations.componentSettings) {
      if (!setting.visibility) {
        cssRules.push(`[data-component="${setting.componentId}"] { display: none !important; }`);
      }
      
      if (setting.customStyles && Object.keys(setting.customStyles).length > 0) {
        const styles = Object.entries(setting.customStyles)
          .map(([prop, value]) => `  ${prop}: ${value};`)
          .join('\n');
        cssRules.push(`[data-component="${setting.componentId}"] {\n${styles}\n}`);
      }
    }
  }
  
  return cssRules.join('\n\n');
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

function generateViewportCSS(viewport: 'mobile' | 'tablet' | 'desktop'): string {
  switch (viewport) {
    case 'mobile':
      return `
/* Mobile Preview Styles */
.preview-container {
  max-width: 375px;
  margin: 0 auto;
}
      `.trim();
      
    case 'tablet':
      return `
/* Tablet Preview Styles */
.preview-container {
  max-width: 768px;
  margin: 0 auto;
}
      `.trim();
      
    case 'desktop':
      return `
/* Desktop Preview Styles */
.preview-container {
  max-width: 1200px;
  margin: 0 auto;
}
      `.trim();
      
    default:
      return '';
  }
}

function generatePreviewHTML(config: ThemePreviewConfig, tokens: any): string {
  const restaurantData = config.restaurant.data;
  const themeId = config.themeId;
  
  return `
<!DOCTYPE html>
<html lang="en" data-skin="${themeId}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Theme Preview - ${config.restaurant.name}</title>
  <style id="theme-preview-styles">
    /* Theme styles will be injected here */
  </style>
</head>
<body>
  <div class="preview-container">
    <!-- Header Section -->
    <header data-component="navbar" class="navbar">
      <div class="navbar-content">
        <div class="navbar-logo">
          <h1>${config.restaurant.name}</h1>
        </div>
        <nav class="navbar-nav">
          <a href="#home">Home</a>
          <a href="#menu">Menu</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>
    </header>
    
    <!-- Hero Section -->
    <section data-component="hero" class="hero">
      <div class="hero-content">
        <h1 class="hero-title">${config.restaurant.name}</h1>
        <p class="hero-subtitle">Experience the finest dining</p>
        <div class="hero-buttons">
          <button class="btn btn-primary">View Menu</button>
          <button class="btn btn-secondary">Book Table</button>
        </div>
      </div>
    </section>
    
    <!-- Menu Preview -->
    <section data-component="menu-list" class="menu-section">
      <div class="container">
        <h2>Our Menu</h2>
        <div class="menu-grid">
          <div class="menu-item">
            <div class="menu-item-image"></div>
            <h3>Sample Dish</h3>
            <p>Delicious description of our signature dish</p>
            <span class="price">$24.99</span>
          </div>
          <div class="menu-item">
            <div class="menu-item-image"></div>
            <h3>Another Dish</h3>
            <p>Another amazing culinary creation</p>
            <span class="price">$19.99</span>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Footer -->
    <footer data-component="footer" class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h3>Contact</h3>
            <p>123 Restaurant St.</p>
            <p>City, State 12345</p>
          </div>
          <div class="footer-section">
            <h3>Hours</h3>
            <p>Mon-Fri: 11am-10pm</p>
            <p>Sat-Sun: 10am-11pm</p>
          </div>
          <div class="footer-section">
            <h3>Follow Us</h3>
            <p>@${config.restaurant.name.toLowerCase().replace(/\s+/g, '')}</p>
          </div>
        </div>
      </div>
    </footer>
  </div>
  
  <script>
    // Basic preview interactions
    console.log('Theme preview loaded:', '${themeId}');
  </script>
</body>
</html>
  `.trim();
}