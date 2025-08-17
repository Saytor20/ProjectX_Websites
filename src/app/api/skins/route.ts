import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

interface SkinMeta {
  id: string
  name: string
  version: string
  description: string
}

export async function GET(request: NextRequest) {
  try {
    const skinsDirectory = path.join(process.cwd(), 'skins')
    
    // Check if skins directory exists
    const dirExists = await fs.access(skinsDirectory).then(() => true).catch(() => false)
    if (!dirExists) {
      return NextResponse.json(
        { error: 'Skins directory not found' },
        { status: 404 }
      )
    }

    // Read all directories in skins folder
    const skinDirs = await fs.readdir(skinsDirectory, { withFileTypes: true })
    const availableSkins: SkinMeta[] = []

    for (const dir of skinDirs) {
      if (dir.isDirectory()) {
        const skinId = dir.name
        const tokensPath = path.join(skinsDirectory, skinId, 'tokens.json')
        const templatePath = path.join(skinsDirectory, skinId, 'template.json')
        
        try {
          // Try to read template.json first (preferred)
          let skinData: any = null
          
          if (await fs.access(templatePath).then(() => true).catch(() => false)) {
            const templateContent = await fs.readFile(templatePath, 'utf8')
            skinData = JSON.parse(templateContent)
            
            availableSkins.push({
              id: skinId,
              name: skinData.name || skinId,
              version: skinData.version || '1.0.0',
              description: skinData.description || `${skinId} template`
            })
          } else if (await fs.access(tokensPath).then(() => true).catch(() => false)) {
            // Fallback to tokens.json
            const tokensContent = await fs.readFile(tokensPath, 'utf8')
            const tokensData = JSON.parse(tokensContent)
            
            if (tokensData.meta) {
              availableSkins.push({
                id: skinId,
                name: tokensData.meta.name || skinId,
                version: tokensData.meta.version || '1.0.0',
                description: tokensData.meta.description || `${skinId} template`
              })
            }
          }
        } catch (error) {
          console.warn(`Failed to load skin metadata for ${skinId}:`, error)
          // Add basic entry even if metadata fails to load
          availableSkins.push({
            id: skinId,
            name: skinId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            version: '1.0.0',
            description: `${skinId} template`
          })
        }
      }
    }

    // Sort skins alphabetically
    availableSkins.sort((a, b) => a.name.localeCompare(b.name))

    return NextResponse.json({
      success: true,
      skins: availableSkins,
      total: availableSkins.length
    })

  } catch (error) {
    console.error('Error loading skins:', error)
    return NextResponse.json(
      { error: 'Failed to load skins' },
      { status: 500 }
    )
  }
}