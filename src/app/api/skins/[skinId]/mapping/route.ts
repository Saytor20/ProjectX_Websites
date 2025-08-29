import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { loadSkinMapping } from '@/lib/mapping-dsl'

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
    
    // Use the existing loadSkinMapping function to parse and return JSON
    const mappings = await loadSkinMapping(skinId)
    
    return NextResponse.json(mappings, {
      status: 200,
      headers: {
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