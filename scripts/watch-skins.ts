#!/usr/bin/env ts-node

/**
 * Skin Watcher Script - Phase B
 * Watches skins files (tokens.json and skin.css) and rebuilds automatically
 * Supports hot reload during development
 */

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { TokenBuilder } from './build-tokens';
import { spawn } from 'child_process';

class SkinWatcher {
  private skinsDir: string;
  private tokenBuilder: TokenBuilder;
  private isProcessing = false;
  private debounceTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.skinsDir = path.join(process.cwd(), 'skins');
    this.tokenBuilder = new TokenBuilder();
  }

  async start(): Promise<void> {
    console.log(chalk.blue.bold('👀 Starting skin watcher...'));
    console.log(chalk.gray(`Watching: ${this.skinsDir}`));
    console.log(chalk.gray('Press Ctrl+C to stop'));
    console.log('');

    if (!fs.existsSync(this.skinsDir)) {
      console.error(chalk.red(`Skins directory not found: ${this.skinsDir}`));
      process.exit(1);
    }

    // Initial build
    await this.rebuild();

    // Watch for changes
    this.watchDirectory(this.skinsDir);

    // Keep process alive
    process.on('SIGINT', () => {
      console.log(chalk.yellow('\n👋 Stopping skin watcher...'));
      process.exit(0);
    });
  }

  private watchDirectory(dir: string): void {
    const watcher = fs.watch(dir, { recursive: true }, (eventType, filename) => {
      if (!filename) return;

      const fullPath = path.join(dir, filename);
      const isRelevantFile = filename.endsWith('tokens.json') || filename.endsWith('skin.css');

      if (isRelevantFile && fs.existsSync(fullPath)) {
        this.debouncedRebuild(filename);
      }
    });

    console.log(chalk.green('✅ Watching for changes...'));
  }

  private debouncedRebuild(changedFile: string): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(async () => {
      console.log(chalk.blue(`📝 ${changedFile} changed`));
      await this.rebuild();
    }, 300); // 300ms debounce
  }

  private async rebuild(): Promise<void> {
    if (this.isProcessing) return;
    
    this.isProcessing = true;
    
    try {
      const startTime = Date.now();
      
      // Build tokens
      console.log(chalk.cyan('🔄 Rebuilding tokens...'));
      await this.tokenBuilder.buildAll();
      
      // Process CSS (existing script)
      console.log(chalk.cyan('🔄 Processing CSS...'));
      await this.runProcessCSS();
      
      const duration = Date.now() - startTime;
      console.log(chalk.green(`✅ Rebuild complete (${duration}ms)`));
      console.log('');
      
    } catch (error) {
      console.error(chalk.red('❌ Rebuild failed:'), error);
    } finally {
      this.isProcessing = false;
    }
  }

  private runProcessCSS(): Promise<void> {
    return new Promise((resolve, reject) => {
      const child = spawn('npx', ['tsx', 'scripts/process-css.ts'], {
        stdio: 'pipe',
        cwd: process.cwd()
      });

      let output = '';
      child.stdout?.on('data', (data) => {
        output += data.toString();
      });

      child.stderr?.on('data', (data) => {
        output += data.toString();
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`process-css.ts exited with code ${code}\n${output}`));
        }
      });

      child.on('error', reject);
    });
  }
}

// Main execution
async function main() {
  const watcher = new SkinWatcher();
  await watcher.start();
}

if (require.main === module) {
  main().catch(console.error);
}

export { SkinWatcher };