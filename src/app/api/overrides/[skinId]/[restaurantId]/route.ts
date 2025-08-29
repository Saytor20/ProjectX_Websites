import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

function generateCSSPatch(editorId: string, styles: Record<string, string>): string {
  const selector = `[data-editor-id="${editorId}"]`
  const cssRules = Object.entries(styles)
    .map(([property, value]) => `  ${property}: ${value};`)
    .join('\n')
  return `${selector} {\n${cssRules}\n}`
}

async function ensureDir(dir: string) {
  try {
    await fs.mkdir(dir, { recursive: true })
  } catch {}
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ skinId: string, restaurantId: string }> }
) {
  const { skinId, restaurantId } = await context.params
  try {
    const filePath = path.join(process.cwd(), 'generated_sites', 'overrides', skinId, `${restaurantId}.css`)
    const content = await fs.readFile(filePath, 'utf8')
    return new NextResponse(content, { headers: { 'Content-Type': 'text/css', 'Cache-Control': 'no-cache' } })
  } catch (e) {
    // Not found: return empty CSS with 200 so link doesn't error
    return new NextResponse('/* no overrides */', { headers: { 'Content-Type': 'text/css' } })
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ skinId: string, restaurantId: string }> }
) {
  try {
    const { skinId, restaurantId } = await context.params
    const body = await request.json()
    const patches = Array.isArray(body?.patches) ? body.patches as Array<{ id: string, styles: Record<string, string> }> : []
    const css = patches.map(p => generateCSSPatch(p.id, p.styles)).join('\n\n')

    const dir = path.join(process.cwd(), 'generated_sites', 'overrides', skinId)
    await ensureDir(dir)
    const filePath = path.join(dir, `${restaurantId}.css`)
    await fs.writeFile(filePath, css || '/* empty */', 'utf8')

    return NextResponse.json({ success: true, filePath })
  } catch (error) {
    console.error('Failed to save overrides:', error)
    return NextResponse.json({ success: false, error: 'Failed to save overrides' }, { status: 500 })
  }
}

