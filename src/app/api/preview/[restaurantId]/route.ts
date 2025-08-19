import { NextRequest, NextResponse } from 'next/server'

// Clean preview API endpoint - redirects to main restaurant route for consistency
export async function GET(
  request: NextRequest,
  { params }: { params: { restaurantId: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const skinId = searchParams.get('skin')
    const device = searchParams.get('device') || 'desktop'
    
    if (!skinId) {
      return NextResponse.json({ error: 'Skin parameter required' }, { status: 400 })
    }

    // Instead of generating HTML here, redirect to the main restaurant route
    // This ensures both design and preview show identical content
    const redirectUrl = `/restaurant/${params.restaurantId}?skin=${skinId}&preview=true&device=${device}`
    
    return NextResponse.redirect(new URL(redirectUrl, request.url))

  } catch (error) {
    console.error('Preview redirect error:', error)
    return NextResponse.json({ error: 'Failed to redirect to preview' }, { status: 500 })
  }
}

