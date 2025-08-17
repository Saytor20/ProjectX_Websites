import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { command } = await request.json();
    
    if (!command) {
      return NextResponse.json(
        { error: 'Command is required' },
        { status: 400 }
      );
    }
    
    // Whitelist of allowed commands for security
    const allowedCommands = [
      'tokens:build',
      'skins:build', 
      'safety:check',
      'validate'
    ];
    
    if (!allowedCommands.includes(command)) {
      return NextResponse.json(
        { error: `Command not allowed: ${command}` },
        { status: 403 }
      );
    }
    
    const result = await runCommand(command);
    
    return NextResponse.json({
      success: true,
      command,
      output: result.output,
      exitCode: result.exitCode,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error running command:', error);
    return NextResponse.json(
      { error: 'Failed to run command', details: error.message },
      { status: 500 }
    );
  }
}

function runCommand(command: string): Promise<{ output: string; exitCode: number }> {
  return new Promise((resolve, reject) => {
    const workingDir = process.cwd();
    
    const child = spawn('npm', ['run', command], {
      cwd: workingDir,
      stdio: 'pipe',
      shell: true
    });
    
    let output = '';
    let errorOutput = '';
    
    child.stdout?.on('data', (data) => {
      output += data.toString();
    });
    
    child.stderr?.on('data', (data) => {
      errorOutput += data.toString();
    });
    
    child.on('close', (code) => {
      const combinedOutput = output + (errorOutput ? '\n--- Errors ---\n' + errorOutput : '');
      resolve({
        output: combinedOutput,
        exitCode: code || 0
      });
    });
    
    child.on('error', (error) => {
      reject(error);
    });
    
    // Timeout after 30 seconds
    setTimeout(() => {
      child.kill();
      reject(new Error('Command timed out after 30 seconds'));
    }, 30000);
  });
}