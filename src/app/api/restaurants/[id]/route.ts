import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: restaurantId } = await params
    const restaurantPath = path.join(process.cwd(), 'data/restaurants', `${restaurantId}.json`)
    
    // Check if file exists
    try {
      await fs.access(restaurantPath)
    } catch {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      )
    }
    
    // Read and parse restaurant data
    const content = await fs.readFile(restaurantPath, 'utf8')
    const data = JSON.parse(content)
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error loading restaurant data:', error)
    return NextResponse.json(
      { error: 'Failed to load restaurant data' },
      { status: 500 }
    )
  }
}