import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(request: NextRequest) {
  try {
    // Path to the exe file in the public directory
    const filePath = join(process.cwd(), 'public', 'dta', 'galaxy.exe');
    
    // Read the file
    const fileBuffer = await readFile(filePath);
    
    // Create response with proper headers for download
    const response = new NextResponse(fileBuffer);
    
    // Set headers to force download
    response.headers.set('Content-Type', 'application/octet-stream');
    response.headers.set('Content-Disposition', 'attachment; filename="BonusGalaxy.exe"');
    response.headers.set('Content-Length', fileBuffer.length.toString());
    response.headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    
    return response;
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'File not found or unable to download' },
      { status: 404 }
    );
  }
}
