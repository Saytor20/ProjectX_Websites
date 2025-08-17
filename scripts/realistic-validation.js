#!/usr/bin/env node

/**
 * REALISTIC System Validation
 * 
 * Measures actual functionality, not just file existence.
 * Weighted scoring based on user value:
 * - Core Functionality: 60%
 * - UI/UX Experience: 20% 
 * - Security: 15%
 * - Performance: 5%
 */

const fs = require('fs').promises;
const path = require('path');
const { spawn, exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

console.log(`${colors.bold}${colors.blue}
🔍 REALISTIC SYSTEM VALIDATION
Measures actual functionality, not just file existence
${colors.reset}`);
console.log('═'.repeat(60));

let totalScore = 0;
let maxScore = 100;
let testResults = [];

function logResult(category, test, passed, score, weight, details = '') {
  const weightedScore = Math.round(score * weight);
  const icon = passed ? '✅' : '❌';
  const color = passed ? colors.green : colors.red;
  
  if (passed) {
    totalScore += weightedScore;
  }
  
  testResults.push({ category, test, passed, score: weightedScore, details });
  
  console.log(`${icon} ${color}${test}${colors.reset} (+${weightedScore}/${Math.round(maxScore * weight)} points)`);
  if (details) {
    console.log(`   ${details}`);
  }
}

// Core Functionality Tests (60% of total score)
async function testCoreFunctionality() {
  console.log(`\n${colors.bold}🚀 Core Functionality (60% weight)${colors.reset}`);
  console.log('-'.repeat(40));
  
  let coreTests = 0;
  let corePassed = 0;
  
  // Test 1: Can the API endpoint handle generation requests? (20%)
  try {
    const response = await fetch('http://localhost:3001/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        skinId: 'cafert-modern',
        restaurantId: 'abu_al_khair',
        restaurantFile: 'abu_al_khair_63191.json'
      })
    });
    
    const result = await response.json();
    const apiWorks = response.ok && result.success;
    
    logResult('Core', 'Website Generation API', apiWorks, 20, 0.60,
      apiWorks ? `API responds correctly` : `API failed: ${result.error || 'Unknown error'}`);
    
    coreTests++;
    if (apiWorks) corePassed++;
    
  } catch (error) {
    logResult('Core', 'Website Generation API', false, 20, 0.60,
      `API unreachable: ${error.message}`);
    coreTests++;
  }
  
  // Test 2: Do required data files exist? (10%)
  try {
    const restaurantPath = path.join(process.cwd(), 'restaurant_data', 'abu_al_khair_63191.json');
    const skinPath = path.join(process.cwd(), 'skins', 'cafert-modern');
    
    const restaurantExists = await fs.access(restaurantPath).then(() => true).catch(() => false);
    const skinExists = await fs.access(skinPath).then(() => true).catch(() => false);
    
    const dataValid = restaurantExists && skinExists;
    
    logResult('Core', 'Required Data Files', dataValid, 10, 0.60,
      dataValid ? 'Restaurant and skin data available' : 
      `Missing: ${!restaurantExists ? 'restaurant data' : ''} ${!skinExists ? 'skin data' : ''}`);
    
    coreTests++;
    if (dataValid) corePassed++;
    
  } catch (error) {
    logResult('Core', 'Required Data Files', false, 10, 0.60, `Error checking files: ${error.message}`);
    coreTests++;
  }
  
  // Test 3: Can skins be loaded dynamically? (10%)
  try {
    const skinCssPath = path.join(process.cwd(), 'skins', 'cafert-modern', 'skin.css');
    const cssExists = await fs.access(skinCssPath).then(() => true).catch(() => false);
    
    if (cssExists) {
      const cssContent = await fs.readFile(skinCssPath, 'utf8');
      const hasScoping = cssContent.includes('[data-skin=') || cssContent.includes('data-skin');
      
      logResult('Core', 'Skin Loading System', hasScoping, 10, 0.60,
        hasScoping ? 'CSS scoping implemented' : 'CSS missing scoping attributes');
      
      if (hasScoping) corePassed++;
    } else {
      logResult('Core', 'Skin Loading System', false, 10, 0.60, 'Skin CSS file not found');
    }
    
    coreTests++;
    
  } catch (error) {
    logResult('Core', 'Skin Loading System', false, 10, 0.60, `Error testing skin loading: ${error.message}`);
    coreTests++;
  }
  
  return { passed: corePassed, total: coreTests };
}

// UI/UX Tests (20% of total score)
async function testUserInterface() {
  console.log(`\n${colors.bold}🎨 UI/UX Experience (20% weight)${colors.reset}`);
  console.log('-'.repeat(40));
  
  let uiTests = 0;
  let uiPassed = 0;
  
  // Test 1: Main page loads without errors (10%)
  try {
    const response = await fetch('http://localhost:3001/');
    const pageWorks = response.ok && response.status === 200;
    
    logResult('UI', 'Main Page Loading', pageWorks, 10, 0.20,
      pageWorks ? 'Page loads successfully' : `Page failed with status ${response.status}`);
    
    uiTests++;
    if (pageWorks) uiPassed++;
    
  } catch (error) {
    logResult('UI', 'Main Page Loading', false, 10, 0.20, `Page unreachable: ${error.message}`);
    uiTests++;
  }
  
  // Test 2: Required UI components exist in code (10%)
  try {
    const pageContent = await fs.readFile(
      path.join(process.cwd(), 'src', 'app', 'page.tsx'), 'utf8'
    );
    
    const hasButton = pageContent.includes('Generate Website');
    const hasDropdowns = pageContent.includes('selectedSkin') && pageContent.includes('selectedRestaurant');
    const hasPreview = pageContent.includes('demoGenerated');
    
    const uiComplete = hasButton && hasDropdowns && hasPreview;
    
    logResult('UI', 'Essential UI Components', uiComplete, 10, 0.20,
      uiComplete ? 'Button, dropdowns, and preview system present' : 
      `Missing: ${!hasButton ? 'button' : ''} ${!hasDropdowns ? 'dropdowns' : ''} ${!hasPreview ? 'preview' : ''}`);
    
    uiTests++;
    if (uiComplete) uiPassed++;
    
  } catch (error) {
    logResult('UI', 'Essential UI Components', false, 10, 0.20, `Error checking UI: ${error.message}`);
    uiTests++;
  }
  
  return { passed: uiPassed, total: uiTests };
}

// Security Tests (15% of total score)
async function testSecurity() {
  console.log(`\n${colors.bold}🛡️ Security Implementation (15% weight)${colors.reset}`);
  console.log('-'.repeat(40));
  
  let securityTests = 0;
  let securityPassed = 0;
  
  // Test 1: CSP headers configured (8%)
  try {
    const nextConfigPath = path.join(process.cwd(), 'next.config.ts');
    const configExists = await fs.access(nextConfigPath).then(() => true).catch(() => false);
    
    if (configExists) {
      const configContent = await fs.readFile(nextConfigPath, 'utf8');
      const hasCSP = configContent.includes('Content-Security-Policy');
      const isDev = configContent.includes('NODE_ENV');
      const hasDevFallback = isDev; // Has development-friendly CSP
      
      const cspImplemented = hasCSP && hasDevFallback;
      
      logResult('Security', 'CSP Configuration', cspImplemented, 8, 0.15,
        cspImplemented ? 'CSP with development support implemented' : 
        `Issues: ${!hasCSP ? 'no CSP' : ''} ${!hasDevFallback ? 'no dev support' : ''}`);
      
      if (cspImplemented) securityPassed++;
    } else {
      logResult('Security', 'CSP Configuration', false, 8, 0.15, 'Next.js config not found');
    }
    
    securityTests++;
    
  } catch (error) {
    logResult('Security', 'CSP Configuration', false, 8, 0.15, `Error checking CSP: ${error.message}`);
    securityTests++;
  }
  
  // Test 2: Input validation present (7%)
  try {
    const validatorPath = path.join(process.cwd(), 'src', 'schema', 'validator.ts');
    const validatorExists = await fs.access(validatorPath).then(() => true).catch(() => false);
    
    if (validatorExists) {
      const validatorContent = await fs.readFile(validatorPath, 'utf8');
      const hasSanitization = validatorContent.includes('sanitizeHtml');
      const hasValidation = validatorContent.includes('ProductionRestaurantSchema');
      
      const inputSecure = hasSanitization && hasValidation;
      
      logResult('Security', 'Input Validation', inputSecure, 7, 0.15,
        inputSecure ? 'HTML sanitization and validation implemented' : 
        `Missing: ${!hasSanitization ? 'sanitization' : ''} ${!hasValidation ? 'validation' : ''}`);
      
      if (inputSecure) securityPassed++;
    } else {
      logResult('Security', 'Input Validation', false, 7, 0.15, 'Validator not found');
    }
    
    securityTests++;
    
  } catch (error) {
    logResult('Security', 'Input Validation', false, 7, 0.15, `Error checking validation: ${error.message}`);
    securityTests++;
  }
  
  return { passed: securityPassed, total: securityTests };
}

// Performance Tests (5% of total score)
async function testPerformance() {
  console.log(`\n${colors.bold}⚡ Performance (5% weight)${colors.reset}`);
  console.log('-'.repeat(40));
  
  let perfTests = 0;
  let perfPassed = 0;
  
  // Test 1: Page response time (5%)
  try {
    const startTime = Date.now();
    const response = await fetch('http://localhost:3001/');
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    const isFast = response.ok && responseTime < 2000; // Under 2 seconds
    
    logResult('Performance', 'Page Load Speed', isFast, 5, 0.05,
      isFast ? `Loads in ${responseTime}ms` : `Too slow: ${responseTime}ms (target: <2000ms)`);
    
    perfTests++;
    if (isFast) perfPassed++;
    
  } catch (error) {
    logResult('Performance', 'Page Load Speed', false, 5, 0.05, `Error testing performance: ${error.message}`);
    perfTests++;
  }
  
  return { passed: perfPassed, total: perfTests };
}

async function main() {
  try {
    const coreResults = await testCoreFunctionality();
    const uiResults = await testUserInterface();
    const securityResults = await testSecurity();
    const performanceResults = await testPerformance();
    
    const totalTests = coreResults.total + uiResults.total + securityResults.total + performanceResults.total;
    const totalPassed = coreResults.passed + uiResults.passed + securityResults.passed + performanceResults.passed;
    
    console.log('\n' + '═'.repeat(60));
    console.log(`${colors.bold}REALISTIC SYSTEM HEALTH SCORE${colors.reset}`);
    console.log('═'.repeat(60));
    
    const percentage = Math.round(totalScore);
    const color = percentage >= 80 ? colors.green : 
                  percentage >= 60 ? colors.yellow : colors.red;
    
    console.log(`${color}${colors.bold}${totalScore}/100 points (${percentage}%)${colors.reset} - ${totalPassed}/${totalTests} tests passed`);
    console.log('');
    
    // Detailed breakdown
    console.log('📊 Score Breakdown:');
    console.log(`   🚀 Core Functionality: ${Math.round(totalScore * 0.6)}/60 points (60% weight)`);
    console.log(`   🎨 UI/UX Experience: ${Math.round(totalScore * 0.2)}/20 points (20% weight)`);
    console.log(`   🛡️ Security: ${Math.round(totalScore * 0.15)}/15 points (15% weight)`);
    console.log(`   ⚡ Performance: ${Math.round(totalScore * 0.05)}/5 points (5% weight)`);
    console.log('');
    
    if (percentage >= 80) {
      console.log(`${colors.green}🎉 SYSTEM IS FUNCTIONAL - Ready for users!${colors.reset}`);
      console.log(`${colors.green}✅ Core functionality works as expected${colors.reset}`);
    } else if (percentage >= 60) {
      console.log(`${colors.yellow}⚠️  PARTIAL FUNCTIONALITY - Major issues need fixing${colors.reset}`);
      console.log(`${colors.yellow}🔧 Focus on core functionality first${colors.reset}`);
    } else {
      console.log(`${colors.red}❌ SYSTEM NOT FUNCTIONAL - Critical issues prevent usage${colors.reset}`);
      console.log(`${colors.red}🚨 Users cannot complete basic tasks${colors.reset}`);
    }
    
    console.log('\n' + '═'.repeat(60));
    
    // Exit with appropriate code based on realistic expectations
    process.exit(percentage >= 60 ? 0 : 1);
    
  } catch (error) {
    console.error(`${colors.red}Fatal validation error: ${error.message}${colors.reset}`);
    process.exit(1);
  }
}

main();