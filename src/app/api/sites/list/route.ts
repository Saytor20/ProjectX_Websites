import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const generatedSitesPath = path.join(process.cwd(), 'generated_sites');
    
    // Check if generated_sites directory exists
    if (!fs.existsSync(generatedSitesPath)) {
      return NextResponse.json([]);
    }
    
    // Read directory contents
    const entries = fs.readdirSync(generatedSitesPath, { withFileTypes: true });
    
    // Filter for directories that contain index.html
    const sites = entries
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name)
      .filter(name => {
        const indexPath = path.join(generatedSitesPath, name, 'index.html');
        return fs.existsSync(indexPath);
      })
      .sort();
    
    return NextResponse.json(sites);
  } catch (error) {
    console.error('Error listing sites:', error);
    return NextResponse.json([], { status: 500 });
  }
}