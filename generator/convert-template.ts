#!/usr/bin/env node
import * as fs from 'fs'
import * as path from 'path'
import { execSync } from 'child_process'

// Simple template converter for static HTML templates
// Converts templates like bistly into our skin system format

interface TemplateConfig {
  name: string
  sourceDir: string
  outputDir: string
  cssFiles: string[]
  htmlFile: string
}

const BISTLY_CONFIG: TemplateConfig = {
  name: 'bistly-modern',
  sourceDir: '/Users/mohammadalmusaiteer/Downloads/Main_File/bistly',
  outputDir: './skins/bistly-modern',
  cssFiles: [
    'assets/css/common-style.css',
    'assets/css/pages/home-restaurant.css'
  ],
  htmlFile: 'index.html'
}

function extractDesignTokens(cssContent: string): any {
  const tokens = {
    colors: {},
    fonts: {},
    spacing: {}
  }
  
  // Extract CSS variables from :root
  const rootMatch = cssContent.match(/:root\s*\{([^}]+)\}/s)
  if (rootMatch) {
    const rootContent = rootMatch[1]
    
    // Extract color variables
    const colorMatches = rootContent.matchAll(/--([^:]+):\s*([^;]+);/g)
    for (const match of colorMatches) {
      const [, name, value] = match
      const cleanName = name.trim().replace(/-/g, '_')
      const cleanValue = value.trim()
      
      if (cleanValue.startsWith('#') || cleanValue.startsWith('rgb') || cleanValue.includes('color')) {
        tokens.colors[cleanName] = cleanValue
      } else if (cleanValue.includes('font') || cleanValue.includes('serif') || cleanValue.includes('sans')) {
        tokens.fonts[cleanName] = cleanValue.replace(/['"]/g, '')
      }
    }
  }
  
  // Set reasonable defaults if not found
  if (Object.keys(tokens.colors).length === 0) {
    tokens.colors = {
      primary: '#D0965C',
      secondary: '#2D4443',
      accent: '#FBFBFB',
      text: '#2D4443',
      heading: '#2D4443',
      border: '#E9E9E9'
    }
  }
  
  if (Object.keys(tokens.fonts).length === 0) {
    tokens.fonts = {
      heading: 'Marcellus, serif',
      body: 'Roboto, sans-serif'
    }
  }
  
  tokens.spacing = {
    xs: '0.25rem',
    sm: '0.5rem', 
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem'
  }
  
  return tokens
}

function createBasicMapping(): any {
  return {
    layout: [
      {
        as: 'RawHTML',
        props: {
          id: 'header',
          html: '<!-- Header will be extracted here -->'
        }
      },
      {
        as: 'RawHTML', 
        props: {
          id: 'hero',
          html: '<!-- Hero section will be extracted here -->'
        }
      },
      {
        as: 'RawHTML',
        props: {
          id: 'main-content',
          html: '<!-- Main content will be extracted here -->'
        }
      },
      {
        as: 'RawHTML',
        props: {
          id: 'footer', 
          html: '<!-- Footer will be extracted here -->'
        }
      }
    ]
  }
}

function extractHTMLSections(htmlContent: string): Record<string, string> {
  const sections: Record<string, string> = {}
  
  // Extract header section
  const headerMatch = htmlContent.match(/<header[^>]*>(.*?)<\/header>/s)
  if (headerMatch) {
    sections.header = headerMatch[0]
  }
  
  // Extract main hero section
  const heroMatch = htmlContent.match(/<section[^>]*class="[^"]*hero[^"]*"[^>]*>(.*?)<\/section>/s)
  if (heroMatch) {
    sections.hero = heroMatch[0]
  }
  
  // Extract footer
  const footerMatch = htmlContent.match(/<footer[^>]*>(.*?)<\/footer>/s)
  if (footerMatch) {
    sections.footer = footerMatch[0]
  }
  
  // Extract main content (everything between header and footer)
  let mainContent = htmlContent
  if (headerMatch) {
    mainContent = mainContent.replace(headerMatch[0], '')
  }
  if (footerMatch) {
    mainContent = mainContent.replace(footerMatch[0], '')
  }
  
  // Remove html/body tags and keep main sections
  mainContent = mainContent.replace(/<\/?(html|head|body)[^>]*>/gi, '')
  mainContent = mainContent.replace(/<title[^>]*>.*?<\/title>/gi, '')
  mainContent = mainContent.replace(/<meta[^>]*>/gi, '')
  mainContent = mainContent.replace(/<link[^>]*>/gi, '')
  mainContent = mainContent.replace(/<script[^>]*>.*?<\/script>/gs, '')
  
  sections['main-content'] = mainContent.trim()
  
  return sections
}

function scopeCSS(css: string, skinId: string): string {
  // Simple CSS scoping - prefix selectors with [data-skin="skinId"]
  const lines = css.split('\n')
  const scopedLines: string[] = []
  
  for (const line of lines) {
    const trimmed = line.trim()
    
    // Skip empty lines, comments, and at-rules
    if (!trimmed || trimmed.startsWith('/*') || trimmed.startsWith('@') || trimmed.startsWith(':root')) {
      scopedLines.push(line)
      continue
    }
    
    // If line contains a selector (ends with { or has ,)
    if (trimmed.includes('{') || trimmed.endsWith(',')) {
      // Simple scoping - add data attribute prefix
      let scoped = line
      
      // Split by comma for multiple selectors
      if (trimmed.includes(',')) {
        const selectors = trimmed.split(',')
        const scopedSelectors = selectors.map(sel => {
          const cleanSel = sel.trim()
          if (cleanSel && !cleanSel.startsWith('[data-skin') && !cleanSel.startsWith('@')) {
            return `[data-skin="${skinId}"] ${cleanSel}`
          }
          return cleanSel
        })
        scoped = scopedSelectors.join(', ')
        if (trimmed.endsWith('{')) {
          scoped += ' {'
        }
      } else if (trimmed.includes('{')) {
        const [selector, rest] = trimmed.split('{', 2)
        const cleanSelector = selector.trim()
        if (cleanSelector && !cleanSelector.startsWith('[data-skin') && !cleanSelector.startsWith('@')) {
          scoped = `[data-skin="${skinId}"] ${cleanSelector} { ${rest}`
        }
      }
      
      scopedLines.push(scoped)
    } else {
      scopedLines.push(line)
    }
  }
  
  return scopedLines.join('\n')
}

function convertTemplate(config: TemplateConfig): void {
  console.log(`Converting template: ${config.name}`)
  
  try {
    // Create output directory
    if (!fs.existsSync(config.outputDir)) {
      fs.mkdirSync(config.outputDir, { recursive: true })
    }
    
    // Read and combine CSS files
    let combinedCSS = ''
    for (const cssFile of config.cssFiles) {
      const cssPath = path.join(config.sourceDir, cssFile)
      if (fs.existsSync(cssPath)) {
        const css = fs.readFileSync(cssPath, 'utf-8')
        combinedCSS += css + '\n\n'
        console.log(`Added CSS: ${cssFile}`)
      } else {
        console.warn(`CSS file not found: ${cssPath}`)
      }
    }
    
    // Read HTML file
    const htmlPath = path.join(config.sourceDir, config.htmlFile)
    if (!fs.existsSync(htmlPath)) {
      throw new Error(`HTML file not found: ${htmlPath}`)
    }
    
    const htmlContent = fs.readFileSync(htmlPath, 'utf-8')
    console.log(`Read HTML file: ${config.htmlFile}`)
    
    // Extract design tokens
    const tokens = extractDesignTokens(combinedCSS)
    console.log(`Extracted ${Object.keys(tokens.colors).length} color tokens`)
    
    // Extract HTML sections
    const sections = extractHTMLSections(htmlContent)
    console.log(`Extracted ${Object.keys(sections).length} HTML sections`)
    
    // Scope CSS
    const scopedCSS = scopeCSS(combinedCSS, config.name)
    
    // Create mapping with actual HTML content
    const mapping = createBasicMapping()
    for (const section of mapping.layout) {
      const sectionId = section.props.id
      if (sections[sectionId]) {
        section.props.html = sections[sectionId]
      }
    }
    
    // Write files
    fs.writeFileSync(path.join(config.outputDir, 'skin.css'), scopedCSS)
    fs.writeFileSync(path.join(config.outputDir, 'tokens.json'), JSON.stringify(tokens, null, 2))
    fs.writeFileSync(path.join(config.outputDir, 'map.yml'), 
      `# Converted from ${config.name}\n` + 
      `layout:\n` +
      mapping.layout.map(item => 
        `  - as: ${item.as}\n` +
        `    props:\n` +
        `      id: ${item.props.id}\n` +
        `      html: |\n${item.props.html.split('\n').map(line => '        ' + line).join('\n')}`
      ).join('\n\n')
    )
    
    // Create template metadata
    const templateMeta = {
      name: config.name,
      title: 'Bistly Modern Restaurant',
      description: 'Converted from Bistly HTML template',
      author: 'Template Converter',
      version: '1.0.0',
      type: 'restaurant',
      converted: new Date().toISOString()
    }
    
    fs.writeFileSync(path.join(config.outputDir, 'template.json'), JSON.stringify(templateMeta, null, 2))
    
    console.log(`✅ Template converted successfully to: ${config.outputDir}`)
    console.log(`📝 Files created:`)
    console.log(`   - skin.css (${Math.round(scopedCSS.length/1024)}KB)`)
    console.log(`   - tokens.json`)  
    console.log(`   - map.yml`)
    console.log(`   - template.json`)
    
  } catch (error) {
    console.error(`❌ Error converting template:`, error)
    process.exit(1)
  }
}

// CLI interface
function main() {
  const args = process.argv.slice(2)
  const templateName = args[0] || 'bistly'
  
  if (templateName === 'bistly') {
    convertTemplate(BISTLY_CONFIG)
  } else {
    console.error(`Unknown template: ${templateName}`)
    console.log('Available templates: bistly')
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}

export { convertTemplate, BISTLY_CONFIG }