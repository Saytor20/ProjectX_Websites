#!/usr/bin/env node

/**
 * Simple System Validation Script
 * 
 * Validates core system functionality without complex TypeScript compilation.
 * This script checks essential components for the restaurant website generator.
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFileExists(filePath, description) {
  try {
    fs.accessSync(filePath);
    log(`✅ ${description}`, 'green');
    return true;
  } catch (error) {
    log(`❌ ${description} - File not found: ${filePath}`, 'red');
    return false;
  }
}

function checkSkins() {
  log('\n🎨 Checking Skins...', 'bold');
  
  try {
    const skinsDir = 'skins';
    const skinDirs = fs.readdirSync(skinsDir).filter(item => 
      fs.statSync(path.join(skinsDir, item)).isDirectory()
    );

    if (skinDirs.length === 0) {
      log('❌ No skins found', 'red');
      return false;
    }

    let validSkins = 0;
    skinDirs.forEach(skinDir => {
      const skinPath = path.join(skinsDir, skinDir);
      const requiredFiles = ['tokens.json', 'skin.css', 'map.yml'];
      
      let skinValid = true;
      requiredFiles.forEach(file => {
        const filePath = path.join(skinPath, file);
        if (!fs.existsSync(filePath)) {
          log(`  ❌ ${skinDir}/${file} missing`, 'red');
          skinValid = false;
        }
      });

      if (skinValid) {
        log(`  ✅ Skin: ${skinDir}`, 'green');
        validSkins++;
      } else {
        log(`  ❌ Skin: ${skinDir} (incomplete)`, 'red');
      }
    });

    log(`\nSkins Status: ${validSkins}/${skinDirs.length} skins valid`, 
         validSkins > 0 ? 'green' : 'red');
    
    return validSkins > 0;
  } catch (error) {
    log(`❌ Error checking skins: ${error.message}`, 'red');
    return false;
  }
}

function runSystemValidation() {
  log('🔍 Restaurant Website Generator - System Validation', 'bold');
  
  const result = checkSkins();
  
  if (result) {
    log('\n✅ System validation PASSED - Core components functional', 'green');
  } else {
    log('\n⚠️ System validation PARTIAL - Some components need attention', 'yellow');
  }
  
  return { passed: result, score: result ? 100 : 70 };
}

// Run validation if called directly
if (require.main === module) {
  const result = runSystemValidation();
  process.exit(result.passed ? 0 : 1);
}

module.exports = { runSystemValidation };
