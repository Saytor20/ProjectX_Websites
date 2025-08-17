import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

interface TemplateInfo {
  id: string
  name: string
  type: 'skin' | 'standalone'
  description: string
  preview: string
  features: string[]
  backgrounds?: string[]
}

export async function GET(request: NextRequest) {
  try {
    const templates: TemplateInfo[] = []
    
    // Load skin templates from skins directory
    const skinsDir = path.join(process.cwd(), 'skins')
    if (await fs.access(skinsDir).then(() => true).catch(() => false)) {
      const skinDirs = await fs.readdir(skinsDir, { withFileTypes: true })
      
      for (const dir of skinDirs) {
        if (dir.isDirectory()) {
          const skinId = dir.name
          const tokensPath = path.join(skinsDir, skinId, 'tokens.json')
          
          try {
            const tokensContent = await fs.readFile(tokensPath, 'utf8')
            const tokensData = JSON.parse(tokensContent)
            
            templates.push({
              id: skinId,
              name: tokensData.meta?.name || skinId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
              type: 'skin',
              description: tokensData.meta?.description || `${skinId} skin template`,
              preview: generateSkinPreview(skinId, tokensData),
              features: [
                'Component-based design',
                'CSS scoping',
                'Real-time preview',
                'Token-based theming'
              ],
              backgrounds: getAvailableBackgrounds()
            })
          } catch (error) {
            console.warn(`Failed to load skin ${skinId}:`, error)
          }
        }
      }
    }
    
    // Load standalone templates
    const standaloneTemplates = [
      {
        id: 'foodera-site',
        name: 'Foodera Modern',
        path: 'foodera-site'
      }
    ]
    
    for (const template of standaloneTemplates) {
      const templatePath = path.join(process.cwd(), template.path)
      
      if (await fs.access(templatePath).then(() => true).catch(() => false)) {
        templates.push({
          id: template.id,
          name: template.name,
          type: 'standalone',
          description: 'Complete Next.js application with unique design system',
          preview: generateStandalonePreviewUrl(template.id),
          features: [
            'Full Next.js application',
            'Custom design system',
            'Advanced components',
            'Independent deployment'
          ],
          backgrounds: getAvailableBackgrounds()
        })
      }
    }
    
    return NextResponse.json({
      success: true,
      templates,
      total: templates.length,
      backgroundOptions: getAvailableBackgrounds()
    })
    
  } catch (error) {
    console.error('Error loading templates:', error)
    return NextResponse.json(
      { error: 'Failed to load templates' },
      { status: 500 }
    )
  }
}

function generateSkinPreview(skinId: string, tokensData: any) {
  const primaryColor = tokensData.colors?.primary || '#007bff'
  const secondaryColor = tokensData.colors?.secondary || '#6c757d'
  const backgroundColor = tokensData.colors?.background || '#ffffff'
  const textColor = tokensData.colors?.text || '#333333'
  
  return `
    <div class="skin-preview" style="
      background: ${backgroundColor};
      color: ${textColor};
      border: 2px solid ${primaryColor};
      border-radius: 8px;
      padding: 1rem;
      min-height: 200px;
      position: relative;
      overflow: hidden;
    ">
      <div style="
        background: ${primaryColor};
        color: white;
        padding: 0.5rem 1rem;
        margin: -1rem -1rem 1rem -1rem;
        font-weight: bold;
      ">
        ${skinId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </div>
      
      <div style="margin-bottom: 1rem;">
        <div style="
          background: ${secondaryColor};
          color: white;
          padding: 0.5rem;
          border-radius: 4px;
          margin-bottom: 0.5rem;
        ">Navigation Bar</div>
        
        <div style="
          background: linear-gradient(135deg, ${primaryColor}20, ${secondaryColor}20);
          padding: 1rem;
          border-radius: 4px;
          margin-bottom: 0.5rem;
        ">
          <strong>Hero Section</strong><br>
          <small>Restaurant showcase area</small>
        </div>
        
        <div style="
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
        ">
          <div style="
            background: ${primaryColor}10;
            padding: 0.5rem;
            border-radius: 4px;
            border-left: 3px solid ${primaryColor};
          ">Menu Items</div>
          <div style="
            background: ${secondaryColor}10;
            padding: 0.5rem;
            border-radius: 4px;
            border-left: 3px solid ${secondaryColor};
          ">Gallery</div>
        </div>
      </div>
    </div>
  `
}

function generateStandalonePreviewUrl(templateId: string) {
  return `/api/templates/preview?template=${templateId}`
}

function getAvailableBackgrounds() {
  return [
    {
      id: 'default',
      name: 'Default',
      type: 'solid',
      value: '#f8f9fa'
    },
    {
      id: 'gradient-warm',
      name: 'Warm Gradient',
      type: 'gradient',
      value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      id: 'gradient-cool',
      name: 'Cool Gradient',
      type: 'gradient',
      value: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)'
    },
    {
      id: 'gradient-sunset',
      name: 'Sunset Gradient',
      type: 'gradient',
      value: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    },
    {
      id: 'pattern-dots',
      name: 'Dot Pattern',
      type: 'pattern',
      value: 'radial-gradient(circle, #ddd 1px, transparent 1px)',
      size: '20px 20px'
    },
    {
      id: 'image-restaurant',
      name: 'Restaurant Background',
      type: 'image',
      value: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
    }
  ]
}