#!/usr/bin/env ts-node

/**
 * Safety Guardrails - Phase C
 * Ensures only safe file modifications and preserves data structure integrity
 */

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { spawn, spawnSync } from 'child_process';

interface SafetyCheck {
  name: string;
  description: string;
  check: () => Promise<boolean>;
  fix?: () => Promise<void>;
}

class SafetyGuardrails {
  private projectRoot: string;
  private allowedPaths: string[];
  private restrictedPaths: string[];

  constructor() {
    this.projectRoot = process.cwd();
    this.allowedPaths = [
      'skins/**/tokens.json',
      'skins/**/skin.css', 
      'skins/**/tokens.css',
      'public/skins/**/skin.css',
      'public/dev/**/*'
    ];
    this.restrictedPaths = [
      'restaurant_data/**/*',
      'src/components/**/*.tsx',
      'src/lib/**/*',
      'package.json',
      'tsconfig.json',
      'next.config.ts'
    ];
  }

  async runAllChecks(): Promise<boolean> {
    console.log(chalk.blue.bold('🛡️  Running Safety Guardrails...'));
    console.log('');

    const checks: SafetyCheck[] = [
      {
        name: 'Git Status Check',
        description: 'Ensure we\'re on a design branch for safety',
        check: this.checkGitBranch.bind(this)
      },
      {
        name: 'File Scope Validation',
        description: 'Verify only allowed files are modified',
        check: this.checkModifiedFiles.bind(this)
      },
      {
        name: 'Data Structure Integrity',
        description: 'Ensure restaurant data remains untouched',
        check: this.checkDataIntegrity.bind(this)
      },
      {
        name: 'CSS Budget Compliance',
        description: 'Verify CSS files stay under 50KB limit',
        check: this.checkCSSBudget.bind(this)
      },
      {
        name: 'Token Schema Validation',
        description: 'Ensure all tokens.json files are valid',
        check: this.checkTokenSchema.bind(this)
      }
    ];

    let allPassed = true;
    
    for (const check of checks) {
      process.stdout.write(chalk.cyan(`  ${check.name}... `));
      
      try {
        const passed = await check.check();
        if (passed) {
          console.log(chalk.green('✅'));
        } else {
          console.log(chalk.red('❌'));
          console.log(chalk.red(`    ${check.description}`));
          allPassed = false;
        }
      } catch (error) {
        console.log(chalk.red('❌'));
        console.log(chalk.red(`    Error: ${error}`));
        allPassed = false;
      }
    }

    console.log('');
    if (allPassed) {
      console.log(chalk.green.bold('✅ All safety checks passed'));
    } else {
      console.log(chalk.red.bold('❌ Some safety checks failed'));
    }

    return allPassed;
  }

  private async checkGitBranch(): Promise<boolean> {
    const result = spawnSync('git', ['branch', '--show-current'], { 
      encoding: 'utf-8',
      cwd: this.projectRoot 
    });
    
    if (result.error) {
      return false; // Not a git repo or git not available
    }

    const currentBranch = result.stdout.trim();
    
    // Allow main branch or design/* branches
    return currentBranch === 'main' || currentBranch.startsWith('design/');
  }

  private async checkModifiedFiles(): Promise<boolean> {
    const result = spawnSync('git', ['status', '--porcelain'], { 
      encoding: 'utf-8',
      cwd: this.projectRoot 
    });
    
    if (result.error) {
      return true; // If git is not available, skip this check
    }

    const modifiedFiles = result.stdout
      .split('\n')
      .filter(line => line.trim())
      .map(line => line.substring(3)); // Remove git status prefix

    // Check if any modified files are in restricted paths
    for (const file of modifiedFiles) {
      const isRestricted = this.restrictedPaths.some(pattern => {
        const regex = new RegExp(pattern.replace('**', '.*').replace('*', '[^/]*'));
        return regex.test(file);
      });

      if (isRestricted) {
        console.log(chalk.yellow(`\n    Warning: Modified restricted file: ${file}`));
        return false;
      }
    }

    return true;
  }

  private async checkDataIntegrity(): Promise<boolean> {
    const restaurantDataDir = path.join(this.projectRoot, 'restaurant_data');
    
    if (!fs.existsSync(restaurantDataDir)) {
      return false;
    }

    // Check if any restaurant data files have been modified
    const result = spawnSync('git', ['status', '--porcelain', 'restaurant_data/'], { 
      encoding: 'utf-8',
      cwd: this.projectRoot 
    });

    if (result.error) {
      return true; // Skip if git not available
    }

    const modifiedDataFiles = result.stdout.trim();
    if (modifiedDataFiles) {
      console.log(chalk.yellow('\n    Warning: Restaurant data files have been modified'));
      return false;
    }

    return true;
  }

  private async checkCSSBudget(): Promise<boolean> {
    const skinsDir = path.join(this.projectRoot, 'skins');
    const publicSkinsDir = path.join(this.projectRoot, 'public', 'skins');
    
    let allUnderBudget = true;
    const maxSizeKB = 50;

    // Check source skin.css files
    if (fs.existsSync(skinsDir)) {
      const skinDirs = fs.readdirSync(skinsDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

      for (const skinName of skinDirs) {
        const skinCSSPath = path.join(skinsDir, skinName, 'skin.css');
        if (fs.existsSync(skinCSSPath)) {
          const stats = fs.statSync(skinCSSPath);
          const sizeKB = stats.size / 1024;
          
          if (sizeKB > maxSizeKB) {
            console.log(chalk.yellow(`\n    Warning: ${skinName}/skin.css exceeds ${maxSizeKB}KB (${sizeKB.toFixed(1)}KB)`));
            allUnderBudget = false;
          }
        }
      }
    }

    // Check processed skin.css files
    if (fs.existsSync(publicSkinsDir)) {
      const skinDirs = fs.readdirSync(publicSkinsDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

      for (const skinName of skinDirs) {
        const skinCSSPath = path.join(publicSkinsDir, skinName, 'skin.css');
        if (fs.existsSync(skinCSSPath)) {
          const stats = fs.statSync(skinCSSPath);
          const sizeKB = stats.size / 1024;
          
          if (sizeKB > maxSizeKB) {
            console.log(chalk.yellow(`\n    Warning: public/skins/${skinName}/skin.css exceeds ${maxSizeKB}KB (${sizeKB.toFixed(1)}KB)`));
            allUnderBudget = false;
          }
        }
      }
    }

    return allUnderBudget;
  }

  private async checkTokenSchema(): Promise<boolean> {
    const skinsDir = path.join(this.projectRoot, 'skins');
    
    if (!fs.existsSync(skinsDir)) {
      return false;
    }

    const skinDirs = fs.readdirSync(skinsDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    let allValid = true;

    for (const skinName of skinDirs) {
      const tokensPath = path.join(skinsDir, skinName, 'tokens.json');
      
      if (fs.existsSync(tokensPath)) {
        try {
          const tokensContent = fs.readFileSync(tokensPath, 'utf-8');
          const tokens = JSON.parse(tokensContent);
          
          // Basic validation - check required fields
          if (!tokens.meta || !tokens.colors) {
            console.log(chalk.yellow(`\n    Warning: ${skinName}/tokens.json missing required fields`));
            allValid = false;
          }
        } catch (error) {
          console.log(chalk.yellow(`\n    Warning: ${skinName}/tokens.json is invalid JSON`));
          allValid = false;
        }
      }
    }

    return allValid;
  }

  async createDesignBranch(skinName: string): Promise<boolean> {
    const branchName = `design/${skinName}`;
    
    console.log(chalk.blue(`🌿 Creating design branch: ${branchName}`));
    
    const result = spawnSync('git', ['checkout', '-b', branchName], { 
      encoding: 'utf-8',
      cwd: this.projectRoot 
    });

    if (result.error) {
      console.error(chalk.red('Failed to create branch'));
      return false;
    }

    console.log(chalk.green(`✅ Created and switched to branch: ${branchName}`));
    return true;
  }

  async commitChanges(message: string): Promise<boolean> {
    console.log(chalk.blue('📝 Committing changes...'));
    
    // Add only allowed files
    const addResult = spawnSync('git', ['add', 'skins/', 'public/skins/', 'public/dev/'], { 
      encoding: 'utf-8',
      cwd: this.projectRoot 
    });

    if (addResult.error) {
      console.error(chalk.red('Failed to stage files'));
      return false;
    }

    // Commit with descriptive message
    const commitResult = spawnSync('git', ['commit', '-m', message], { 
      encoding: 'utf-8',
      cwd: this.projectRoot 
    });

    if (commitResult.error) {
      console.error(chalk.red('Failed to commit changes'));
      return false;
    }

    console.log(chalk.green('✅ Changes committed successfully'));
    return true;
  }
}

// Main execution
async function main() {
  const guardrails = new SafetyGuardrails();
  
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'check':
      const passed = await guardrails.runAllChecks();
      process.exit(passed ? 0 : 1);
      break;
      
    case 'branch':
      const skinName = args[1];
      if (!skinName) {
        console.error(chalk.red('Error: Please provide a skin name'));
        process.exit(1);
      }
      const created = await guardrails.createDesignBranch(skinName);
      process.exit(created ? 0 : 1);
      break;
      
    case 'commit':
      const message = args[1] || 'Update design tokens and styles';
      const committed = await guardrails.commitChanges(message);
      process.exit(committed ? 0 : 1);
      break;
      
    default:
      console.log(chalk.blue.bold('Safety Guardrails Commands:'));
      console.log('  check  - Run all safety checks');
      console.log('  branch <skin-name> - Create design branch for skin');
      console.log('  commit [message] - Commit changes safely');
      break;
  }
}

if (require.main === module) {
  main().catch(console.error);
}

export { SafetyGuardrails };