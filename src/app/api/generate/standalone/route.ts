import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import fs from 'fs/promises'

const execAsync = promisify(exec)

export async function POST(request: NextRequest) {
  try {
    const { 
      templateId, 
      restaurantId, 
      restaurantFile, 
      deploymentType = 'dev',
      generateStatic = false,
      buildProduction = false 
    } = await request.json()
    
    if (!templateId || !restaurantId || !restaurantFile) {
      return NextResponse.json(
        { error: 'Missing required parameters: templateId, restaurantId, restaurantFile' },
        { status: 400 }
      )
    }

    // Validate restaurant file exists
    const restaurantPath = path.join(process.cwd(), 'data/restaurants', restaurantFile)
    try {
      await fs.access(restaurantPath)
    } catch {
      return NextResponse.json(
        { error: `Restaurant data file not found: ${restaurantFile}` },
        { status: 404 }
      )
    }

    // Validate standalone template exists
    const templatePath = path.join(process.cwd(), templateId)
    try {
      await fs.access(templatePath)
      await fs.access(path.join(templatePath, 'package.json'))
    } catch {
      return NextResponse.json(
        { error: `Standalone template not found: ${templateId}` },
        { status: 404 }
      )
    }

    // Read restaurant data
    const restaurantData = JSON.parse(await fs.readFile(restaurantPath, 'utf8'))
    const restaurantName = restaurantData.restaurant_info?.name || restaurantId
    
    // Start the standalone template server
    const standalonePort = 3001
    const devUrl = `http://localhost:${standalonePort}/${restaurantId}`
    
    try {
      // Kill any existing process on port 3001
      await execAsync(`lsof -ti:${standalonePort} | xargs kill -9 || true`)
      
      // Start foodera-site on port 3001
      console.log(`🚀 Starting ${templateId} on port ${standalonePort}...`)
      const startCommand = `cd "${templatePath}" && PORT=${standalonePort} npm run dev`
      
      // Start the process in background (don't wait for it)
      exec(startCommand, (error, stdout, stderr) => {
        if (error) {
          console.error(`Failed to start ${templateId}:`, error)
        } else {
          console.log(`✅ ${templateId} started on port ${standalonePort}`)
        }
      })
      
      // Wait a moment for the server to start
      await new Promise(resolve => setTimeout(resolve, 3000))
      
    } catch (startError) {
      console.error('Failed to start standalone template:', startError)
      // Continue anyway - might already be running
    }

    let result = {
      success: true,
      message: `Template ${templateId} ${deploymentType === 'dev' ? 'running' : deploymentType === 'static' ? 'being built as static export' : 'being built for production'} for ${restaurantName}`,
      templateId,
      restaurantId,
      restaurantName,
      devUrl,
      type: 'standalone',
      deploymentType,
      generateStatic,
      buildProduction,
      generatedAt: new Date().toISOString(),
      instructions: deploymentType === 'dev' 
        ? `Access the ${templateId} template at ${devUrl}`
        : deploymentType === 'static'
        ? `Static site will be built and available for download`
        : `Production build will be optimized and ready for deployment`
    }

    // If static generation requested, build the site
    if (generateStatic) {
      try {
        console.log(`🔨 Building static site for ${templateId}...`)
        
        // Change to template directory and build
        const buildCommand = `cd "${templatePath}" && npm run build`
        const { stdout, stderr } = await execAsync(buildCommand)
        
        if (stderr && !stderr.includes('Warning')) {
          throw new Error(`Build failed: ${stderr}`)
        }
        
        // Copy built site to generated_sites
        const outputDir = path.join(process.cwd(), 'generated_sites', `${restaurantName}-${templateId}`)
        const sourceDir = path.join(templatePath, 'out')
        
        await execAsync(`rm -rf "${outputDir}" && cp -r "${sourceDir}" "${outputDir}"`)
        
        result.message = `Static site generated successfully for ${restaurantName}`
        
        console.log(`✅ Static site generated: ${outputDir}`)
        
      } catch (buildError) {
        console.error('Static build error:', buildError)
        result.message = `Development preview ready, but static build failed: ${buildError instanceof Error ? buildError.message : 'Unknown error'}`
      }
    }

    // If production build requested
    if (buildProduction) {
      try {
        console.log(`🏗️ Building production version for ${templateId}...`)
        
        // Change to template directory and build for production
        const buildCommand = `cd "${templatePath}" && npm run build`
        const { stdout, stderr } = await execAsync(buildCommand)
        
        if (stderr && !stderr.includes('Warning')) {
          throw new Error(`Production build failed: ${stderr}`)
        }
        
        // Copy built site to generated_sites
        const outputDir = path.join(process.cwd(), 'generated_sites', `${restaurantName}-${templateId}-production`)
        const sourceDir = path.join(templatePath, '.next')
        
        await execAsync(`rm -rf "${outputDir}" && cp -r "${sourceDir}" "${outputDir}"`)
        
        result.message = `Production build completed successfully for ${restaurantName} (at ${outputDir})`
        
        console.log(`✅ Production build generated: ${outputDir}`)
        
      } catch (buildError) {
        console.error('Production build error:', buildError)
        result.message = `Development preview ready, but production build failed: ${buildError instanceof Error ? buildError.message : 'Unknown error'}`
      }
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('Standalone generation error:', error)
    
    return NextResponse.json(
      { 
        error: 'Standalone template generation failed', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}