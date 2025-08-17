import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    // Support both 'image' and 'file' field names (Uppy uses 'file')
    const file = (formData.get('file') || formData.get('image')) as File
    const targetElement = formData.get('targetElement') as string
    
    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (10MB limit to match Uppy)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 10MB.' },
        { status: 400 }
      )
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    await fs.mkdir(uploadsDir, { recursive: true })

    // Generate unique filename
    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '')
    const extension = path.extname(originalName)
    const baseName = path.basename(originalName, extension)
    const filename = `${baseName}-${timestamp}${extension}`
    const filePath = path.join(uploadsDir, filename)

    // Save file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await fs.writeFile(filePath, buffer)

    // Return the public URL
    const publicUrl = `/uploads/${filename}`

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
      targetElement,
      originalName: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Image upload error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to upload image',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Handle GET request to list uploaded images
export async function GET(request: NextRequest) {
  try {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    
    // Check if uploads directory exists
    const dirExists = await fs.access(uploadsDir).then(() => true).catch(() => false)
    if (!dirExists) {
      return NextResponse.json({
        success: true,
        images: [],
        total: 0
      })
    }

    // Read all files in uploads directory
    const files = await fs.readdir(uploadsDir, { withFileTypes: true })
    const imageFiles = files
      .filter(file => file.isFile() && /\.(jpg|jpeg|png|webp|gif)$/i.test(file.name))
      .map(file => ({
        filename: file.name,
        url: `/uploads/${file.name}`,
        uploadedAt: file.name.includes('-') ? 
          new Date(parseInt(file.name.split('-').pop()?.split('.')[0] || '0')).toISOString() : 
          new Date().toISOString()
      }))
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())

    return NextResponse.json({
      success: true,
      images: imageFiles,
      total: imageFiles.length
    })

  } catch (error) {
    console.error('Error listing images:', error)
    return NextResponse.json(
      { error: 'Failed to list uploaded images' },
      { status: 500 }
    )
  }
}

// Handle DELETE request to remove uploaded image
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filename = searchParams.get('filename')
    
    if (!filename) {
      return NextResponse.json(
        { error: 'No filename provided' },
        { status: 400 }
      )
    }

    const filePath = path.join(process.cwd(), 'public', 'uploads', filename)
    
    // Check if file exists
    const fileExists = await fs.access(filePath).then(() => true).catch(() => false)
    if (!fileExists) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    // Delete the file
    await fs.unlink(filePath)

    return NextResponse.json({
      success: true,
      message: `File ${filename} deleted successfully`
    })

  } catch (error) {
    console.error('Error deleting image:', error)
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    )
  }
}