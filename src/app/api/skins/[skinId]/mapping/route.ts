import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ skinId: string }> }
) {
  try {
    const { skinId } = await params
    
    if (!skinId) {
      return NextResponse.json(
        { error: 'Skin ID is required' },
        { status: 400 }
      )
    }
    
    const skinDirectory = path.join(process.cwd(), 'skins', skinId)
    const mapPath = path.join(skinDirectory, 'map.yml')
    
    // Check if mapping file exists
    const mapExists = await fs.access(mapPath).then(() => true).catch(() => false)
    if (!mapExists) {
      return NextResponse.json(
        { error: `Mapping file not found for skin: ${skinId}` },
        { status: 404 }
      )
    }
    
    // Read the mapping file
    const mapContent = await fs.readFile(mapPath, 'utf8')
    
    return new NextResponse(mapContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/yaml',
        'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
      }
    })
    
  } catch (error) {
    console.error(`Error loading mapping for skin ${(await params).skinId}:`, error)
    return NextResponse.json(
      { error: 'Failed to load skin mapping' },
      { status: 500 }
    )
  }
}