/**
 * ISR + On-Demand Revalidation API Route
 * 
 * Enables on-demand revalidation for individual restaurant sites
 * without requiring a full rebuild of the entire system
 */

import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { skinLoader } from '@/lib/skin-loader'
import { migrateLegacyData } from '@/schema/validator'
import fs from 'fs/promises'
import path from 'path'

// API route for on-demand revalidation
export async function POST(request: NextRequest) {
  try {
    // Verify authorization (in production, use proper auth)
    const authorization = request.headers.get('authorization')
    if (!authorization || authorization !== `Bearer ${process.env.REVALIDATION_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { type, target, skinId, restaurantId } = body

    switch (type) {
      case 'restaurant':
        // Revalidate specific restaurant page
        if (!restaurantId) {
          return NextResponse.json(
            { error: 'restaurantId is required for restaurant revalidation' },
            { status: 400 }
          )
        }

        // Revalidate the restaurant page and its related paths
        revalidatePath(`/restaurant/${restaurantId}`)
        revalidatePath(`/api/restaurant/${restaurantId}`)
        revalidateTag(`restaurant-${restaurantId}`)

        return NextResponse.json({
          success: true,
          revalidated: [`/restaurant/${restaurantId}`],
          timestamp: new Date().toISOString()
        })

      case 'skin':
        // Revalidate all pages using a specific skin
        if (!skinId) {
          return NextResponse.json(
            { error: 'skinId is required for skin revalidation' },
            { status: 400 }
          )
        }

        // Clear skin cache
        skinLoader.clearCache()
        
        // Revalidate skin-related paths
        revalidateTag(`skin-${skinId}`)
        revalidatePath('/') // Main page that shows skin selection
        
        return NextResponse.json({
          success: true,
          revalidated: [`skin-${skinId}`, '/'],
          timestamp: new Date().toISOString()
        })

      case 'all':
        // Full cache clear and revalidation
        skinLoader.clearCache()
        revalidatePath('/', 'layout') // This revalidates all pages
        
        return NextResponse.json({
          success: true,
          revalidated: ['all pages'],
          timestamp: new Date().toISOString()
        })

      case 'path':
        // Revalidate specific path
        if (!target) {
          return NextResponse.json(
            { error: 'target path is required for path revalidation' },
            { status: 400 }
          )
        }

        revalidatePath(target)
        
        return NextResponse.json({
          success: true,
          revalidated: [target],
          timestamp: new Date().toISOString()
        })

      case 'tag':
        // Revalidate by tag
        if (!target) {
          return NextResponse.json(
            { error: 'target tag is required for tag revalidation' },
            { status: 400 }
          )
        }

        revalidateTag(target)
        
        return NextResponse.json({
          success: true,
          revalidated: [`tag:${target}`],
          timestamp: new Date().toISOString()
        })

      default:
        return NextResponse.json(
          { error: 'Invalid revalidation type. Use: restaurant, skin, all, path, or tag' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Revalidation error:', error)
    return NextResponse.json(
      { 
        error: 'Revalidation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// GET endpoint for revalidation status and info
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const action = searchParams.get('action')

  try {
    switch (action) {
      case 'status':
        // Return revalidation system status
        return NextResponse.json({
          system: 'ISR + On-Demand Revalidation',
          status: 'active',
          features: [
            'Per-restaurant revalidation',
            'Per-skin revalidation', 
            'Path-based revalidation',
            'Tag-based revalidation',
            'Full cache clearing'
          ],
          timestamp: new Date().toISOString()
        })

      case 'cache-info':
        // Return cache information
        const availableSkins = await skinLoader.discoverSkins()
        const restaurantFiles = await getRestaurantFiles()
        
        return NextResponse.json({
          skins: {
            total: availableSkins.length,
            valid: availableSkins.filter(s => s.isValid).length,
            cached: 'dynamic' // Skin loader manages its own cache
          },
          restaurants: {
            total: restaurantFiles.length,
            lastUpdated: new Date().toISOString()
          },
          cache: {
            type: 'Next.js ISR + Custom',
            revalidation: 'on-demand'
          }
        })

      default:
        return NextResponse.json({
          error: 'Invalid action. Use: status or cache-info'
        }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to get revalidation info',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Helper function to get restaurant files
async function getRestaurantFiles(): Promise<string[]> {
  try {
    const restaurantDir = path.join(process.cwd(), 'restaurant_data')
    const files = await fs.readdir(restaurantDir)
    return files.filter(file => 
      file.endsWith('.json') && 
      !file.includes('_processing_summary')
    )
  } catch (error) {
    return []
  }
}