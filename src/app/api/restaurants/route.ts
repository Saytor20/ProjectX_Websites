import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

interface RestaurantData {
  id: string
  name: string
  file: string
  region?: string
  type_of_food?: string
  menu_categories: Record<string, any[]>
}

interface RestaurantOption {
  id: string
  name: string
  file: string
}

export async function GET(request: NextRequest) {
  try {
    const restaurantDataDir = path.join(process.cwd(), 'data/restaurants')
    
    // Check if restaurant_data directory exists
    const dirExists = await fs.access(restaurantDataDir).then(() => true).catch(() => false)
    if (!dirExists) {
      return NextResponse.json(
        { error: 'Restaurant data directory not found' },
        { status: 404 }
      )
    }

    // Read all JSON files in restaurant_data directory
    const files = await fs.readdir(restaurantDataDir)
    const jsonFiles = files.filter(file => file.endsWith('.json') && !file.startsWith('_'))
    
    const restaurants: RestaurantOption[] = []

    for (const file of jsonFiles) {
      try {
        const filePath = path.join(restaurantDataDir, file)
        const content = await fs.readFile(filePath, 'utf8')
        const restaurantData = JSON.parse(content)
        
        if (restaurantData.restaurant_info?.name) {
          restaurants.push({
            id: file.replace('.json', ''),
            name: restaurantData.restaurant_info.name,
            file: file
          })
        }
      } catch (error) {
        console.warn(`Failed to parse restaurant data for ${file}:`, error)
        // Still add basic entry for problematic files
        const id = file.replace('.json', '')
        restaurants.push({
          id,
          name: id.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          file
        })
      }
    }

    // Sort restaurants alphabetically
    restaurants.sort((a, b) => a.name.localeCompare(b.name))

    return NextResponse.json({
      success: true,
      restaurants,
      total: restaurants.length
    })

  } catch (error) {
    console.error('Error loading restaurants:', error)
    return NextResponse.json(
      { error: 'Failed to load restaurants' },
      { status: 500 }
    )
  }
}

// GET specific restaurant data
export async function POST(request: NextRequest) {
  try {
    const { filename } = await request.json()
    
    if (!filename) {
      return NextResponse.json(
        { error: 'Filename is required' },
        { status: 400 }
      )
    }

    const filePath = path.join(process.cwd(), 'data/restaurants', filename)
    
    const fileExists = await fs.access(filePath).then(() => true).catch(() => false)
    if (!fileExists) {
      return NextResponse.json(
        { error: 'Restaurant data file not found' },
        { status: 404 }
      )
    }

    const content = await fs.readFile(filePath, 'utf8')
    const restaurantData = JSON.parse(content)

    return NextResponse.json({
      success: true,
      data: restaurantData
    })

  } catch (error) {
    console.error('Error loading restaurant data:', error)
    return NextResponse.json(
      { error: 'Failed to load restaurant data' },
      { status: 500 }
    )
  }
}