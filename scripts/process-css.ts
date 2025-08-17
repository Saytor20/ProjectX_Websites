#!/usr/bin/env tsx

/**
 * CSS Processing Script for Restaurant Website Generator
 * 
 * Processes skin CSS files using the CSS scoper system to ensure proper isolation
 * and generates processed files in the public/skins directory.
 */

import { scopeCSSFile, checkCSSBudget, type ProcessingResult } from '../src/lib/css-scoper';
import fs from 'fs/promises';
import path from 'path';

const PROJECT_ROOT = '/Users/mohammadalmusaiteer/Project Shawrma-Website temp/Websites_nextjs';
const SKINS_DIR = path.join(PROJECT_ROOT, 'skins');
const PUBLIC_SKINS_DIR = path.join(PROJECT_ROOT, 'public/skins');

interface SkinConfig {
  id: string;
  name: string;
  inputPath: string;
  outputPath: string;
}

const SKINS_TO_PROCESS: SkinConfig[] = [
  {
    id: 'bistly-modern',
    name: 'Bistly Modern',
    inputPath: path.join(SKINS_DIR, 'bistly-modern/skin.css'),
    outputPath: path.join(PUBLIC_SKINS_DIR, 'bistly-modern/skin.css'),
  },
  {
    id: 'conbiz-premium',
    name: 'Conbiz Premium',
    inputPath: path.join(SKINS_DIR, 'conbiz-premium/skin.css'),
    outputPath: path.join(PUBLIC_SKINS_DIR, 'conbiz-premium/skin.css'),
  },
  {
    id: 'mehu-fresh',
    name: 'Mehu Fresh',
    inputPath: path.join(SKINS_DIR, 'mehu-fresh/skin.css'),
    outputPath: path.join(PUBLIC_SKINS_DIR, 'mehu-fresh/skin.css'),
  },
];

async function ensureDirectoryExists(dirPath: string): Promise<void> {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
    console.log(`📁 Created directory: ${dirPath}`);
  }
}

async function processSkinCSS(skin: SkinConfig): Promise<ProcessingResult> {
  console.log(`\n🎨 Processing ${skin.name} (${skin.id})...`);
  
  // Ensure output directory exists
  await ensureDirectoryExists(path.dirname(skin.outputPath));
  
  // Check if input file exists
  try {
    await fs.access(skin.inputPath);
  } catch {
    throw new Error(`Input CSS file not found: ${skin.inputPath}`);
  }
  
  // Process CSS with scoping
  const result = await scopeCSSFile(
    skin.inputPath,
    skin.outputPath,
    skin.id,
    {
      scopeKeyframes: true,
      scopeVariables: true,
      addContainment: true,
      minify: true,
      enforceNaming: true,
    }
  );
  
  // Report results
  console.log(`✅ ${skin.name} processed successfully:`);
  console.log(`   - Rules processed: ${result.stats.rulesProcessed}`);
  console.log(`   - Keyframes scoped: ${result.stats.keyframesScoped}`);
  console.log(`   - Variables scoped: ${result.stats.variablesScoped}`);
  console.log(`   - Animations updated: ${result.stats.animationsUpdated}`);
  console.log(`   - Size: ${(result.stats.size / 1024).toFixed(2)}KB`);
  console.log(`   - Size (gzipped): ${(result.stats.sizeGzipped! / 1024).toFixed(2)}KB`);
  console.log(`   - Hash: ${result.hash}`);
  
  if (result.conflicts.length > 0) {
    console.log(`⚠️ Conflicts detected:`);
    result.conflicts.forEach(conflict => {
      console.log(`   - ${conflict.severity.toUpperCase()}: ${conflict.message}`);
    });
  }
  
  if (result.warnings.length > 0) {
    console.log(`📝 Warnings:`);
    result.warnings.forEach(warning => {
      console.log(`   - ${warning}`);
    });
  }
  
  return result;
}

async function verifyProcessedFiles(): Promise<void> {
  console.log(`\n🔍 Verifying processed files...`);
  
  for (const skin of SKINS_TO_PROCESS) {
    try {
      const stats = await fs.stat(skin.outputPath);
      const sizeMB = (stats.size / 1024 / 1024).toFixed(3);
      console.log(`✅ ${skin.id}: ${sizeMB}MB`);
      
      // Quick validation - ensure CSS contains scoped selectors
      const content = await fs.readFile(skin.outputPath, 'utf8');
      const scopedSelectorCount = (content.match(new RegExp(`\\[data-skin="${skin.id}"\\]`, 'g')) || []).length;
      console.log(`   - Scoped selectors: ${scopedSelectorCount}`);
      
      if (scopedSelectorCount === 0) {
        console.warn(`⚠️ Warning: No scoped selectors found in ${skin.id}`);
      }
      
    } catch (error) {
      console.error(`❌ ${skin.id}: File not found or not accessible`);
    }
  }
}

async function validateBudgetCompliance(results: ProcessingResult[]): Promise<void> {
  console.log(`\n📊 Checking performance budget compliance...`);
  
  const budgetCheck = checkCSSBudget(results, {
    maxSize: 50000, // 50KB per file
    maxGzippedSize: 15000, // 15KB gzipped per file
  });
  
  if (budgetCheck.compliant) {
    console.log(`✅ All files comply with performance budget`);
  } else {
    console.log(`❌ Budget violations detected:`);
    budgetCheck.violations.forEach(violation => {
      console.log(`   - ${violation}`);
    });
  }
  
  // Calculate total sizes
  const totalSize = results.reduce((sum, result) => sum + result.stats.size, 0);
  const totalGzipped = results.reduce((sum, result) => sum + (result.stats.sizeGzipped || 0), 0);
  
  console.log(`📈 Total sizes:`);
  console.log(`   - Total: ${(totalSize / 1024).toFixed(2)}KB`);
  console.log(`   - Total (gzipped): ${(totalGzipped / 1024).toFixed(2)}KB`);
}

async function generateProcessingReport(results: ProcessingResult[]): Promise<void> {
  const reportPath = path.join(PROJECT_ROOT, 'public/skins/processing-report.json');
  
  const report = {
    timestamp: new Date().toISOString(),
    processedSkins: SKINS_TO_PROCESS.map((skin, index) => ({
      id: skin.id,
      name: skin.name,
      ...results[index].stats,
      hash: results[index].hash,
      conflicts: results[index].conflicts.length,
      warnings: results[index].warnings.length,
    })),
    summary: {
      totalSkins: results.length,
      totalSize: results.reduce((sum, result) => sum + result.stats.size, 0),
      totalGzippedSize: results.reduce((sum, result) => sum + (result.stats.sizeGzipped || 0), 0),
      totalConflicts: results.reduce((sum, result) => sum + result.conflicts.length, 0),
      totalWarnings: results.reduce((sum, result) => sum + result.warnings.length, 0),
    },
  };
  
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2), 'utf8');
  console.log(`\n📄 Processing report saved: ${reportPath}`);
}

async function main(): Promise<void> {
  console.log(`🚀 Starting CSS processing for restaurant website generator...`);
  console.log(`📁 Project root: ${PROJECT_ROOT}`);
  console.log(`📂 Input directory: ${SKINS_DIR}`);
  console.log(`📂 Output directory: ${PUBLIC_SKINS_DIR}`);
  
  try {
    // Ensure public skins directory exists
    await ensureDirectoryExists(PUBLIC_SKINS_DIR);
    
    // Process all skins
    const results: ProcessingResult[] = [];
    
    for (const skin of SKINS_TO_PROCESS) {
      try {
        const result = await processSkinCSS(skin);
        results.push(result);
      } catch (error) {
        console.error(`❌ Failed to process ${skin.id}:`, error);
        process.exit(1);
      }
    }
    
    // Verify all files were created
    await verifyProcessedFiles();
    
    // Check budget compliance
    await validateBudgetCompliance(results);
    
    // Generate processing report
    await generateProcessingReport(results);
    
    console.log(`\n🎉 CSS processing completed successfully!`);
    console.log(`   - Processed ${results.length} skins`);
    console.log(`   - Output directory: ${PUBLIC_SKINS_DIR}`);
    
  } catch (error) {
    console.error(`❌ CSS processing failed:`, error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ Unhandled error:', error);
    process.exit(1);
  });
}

export { main as processCSS };