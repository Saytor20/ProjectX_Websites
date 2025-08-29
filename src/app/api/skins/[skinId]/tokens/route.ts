import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ skinId: string }> }
) {
  try {
    const { skinId } = await context.params
    const tokensPath = path.join(process.cwd(), 'skins', skinId, 'tokens.json')
    
    // Try to read tokens file
    let tokensContent: string
    try {
      tokensContent = await fs.readFile(tokensPath, 'utf8')
    } catch (error) {
      // File doesn't exist - return empty CSS comment
      return new NextResponse(
        `/* No tokens defined for skin: ${skinId} */`,
        {
          status: 200,
          headers: {
            'Content-Type': 'text/css',
            'Cache-Control': 'public, max-age=3600'
          }
        }
      )
    }

    // Parse tokens JSON
    let tokens: Record<string, any>
    try {
      tokens = JSON.parse(tokensContent)
    } catch (error) {
      console.error(`Invalid JSON in tokens file for skin ${skinId}:`, error)
      return new NextResponse(
        `/* Invalid tokens file for skin: ${skinId} */`,
        {
          status: 200,
          headers: {
            'Content-Type': 'text/css',
            'Cache-Control': 'public, max-age=3600'
          }
        }
      )
    }

    // Convert tokens to CSS variables
    const cssVariables = convertTokensToCSS(tokens)
    const css = `[data-skin="${skinId}"] {\n${cssVariables}}\n`

    return new NextResponse(css, {
      status: 200,
      headers: {
        'Content-Type': 'text/css',
        'Cache-Control': 'public, max-age=3600'
      }
    })
  } catch (error) {
    console.error('Error serving tokens:', error)
    return new NextResponse(
      '/* Error loading tokens */',
      {
        status: 200,
        headers: {
          'Content-Type': 'text/css',
          'Cache-Control': 'public, max-age=3600'
        }
      }
    )
  }
}

function convertTokensToCSS(tokens: Record<string, any>, prefix = ''): string {
  let css = ''
  
  for (const [key, value] of Object.entries(tokens)) {
    const variableName = prefix ? `${prefix}-${key}` : key
    
    if (typeof value === 'object' && value !== null) {
      // Recursively handle nested objects
      css += convertTokensToCSS(value, variableName)
    } else {
      // Convert to kebab-case and add CSS variable
      const kebabName = variableName.replace(/([A-Z])/g, '-$1').toLowerCase()
      css += `  --${kebabName}: ${value};\n`
    }
  }
  
  return css
}