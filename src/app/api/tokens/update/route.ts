import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { skin, tokens } = await request.json();
    
    if (!skin || !tokens) {
      return NextResponse.json(
        { error: 'Missing skin or tokens in request' },
        { status: 400 }
      );
    }
    
    // Path to the tokens file
    const tokensPath = path.join(process.cwd(), 'skins', skin, 'tokens.json');
    
    // Check if skin directory exists
    const skinDir = path.dirname(tokensPath);
    if (!fs.existsSync(skinDir)) {
      return NextResponse.json(
        { error: `Skin directory not found: ${skin}` },
        { status: 404 }
      );
    }
    
    // Read current tokens
    let currentTokens: any = {};
    if (fs.existsSync(tokensPath)) {
      const currentContent = fs.readFileSync(tokensPath, 'utf8');
      currentTokens = JSON.parse(currentContent);
    }
    
    // Merge with new tokens
    const updatedTokens = {
      ...currentTokens,
      ...tokens,
      meta: {
        ...(currentTokens.meta || {}),
        updated: new Date().toISOString()
      }
    };
    
    // Write updated tokens
    fs.writeFileSync(tokensPath, JSON.stringify(updatedTokens, null, 2));
    
    // Trigger rebuild by touching the file (the watcher will detect this)
    const now = new Date();
    fs.utimesSync(tokensPath, now, now);
    
    return NextResponse.json({
      success: true,
      message: 'Tokens updated successfully',
      skin,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error updating tokens:', error);
    return NextResponse.json(
      { error: 'Failed to update tokens' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const skin = searchParams.get('skin');
    
    if (!skin) {
      return NextResponse.json(
        { error: 'Skin parameter required' },
        { status: 400 }
      );
    }
    
    const tokensPath = path.join(process.cwd(), 'skins', skin, 'tokens.json');
    
    if (!fs.existsSync(tokensPath)) {
      return NextResponse.json(
        { error: `Tokens file not found for skin: ${skin}` },
        { status: 404 }
      );
    }
    
    const tokensContent = fs.readFileSync(tokensPath, 'utf8');
    const tokens = JSON.parse(tokensContent);
    
    return NextResponse.json({
      success: true,
      skin,
      tokens
    });
    
  } catch (error) {
    console.error('Error reading tokens:', error);
    return NextResponse.json(
      { error: 'Failed to read tokens' },
      { status: 500 }
    );
  }
}