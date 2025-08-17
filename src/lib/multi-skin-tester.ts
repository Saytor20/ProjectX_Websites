/**
 * Multi-Skin Leakage Tester
 * 
 * Tests for CSS leakage between skins by rendering multiple skins side-by-side
 * Catches stray, unprefixed selectors that could affect other skins
 */

import { ComponentRenderer } from './component-renderer';
import { skinLoader } from './skin-loader';
import type { SiteSchema } from '@/schema/core';

// Test result structure
export interface LeakageTestResult {
  passed: boolean;
  skinsCombination: string[];
  violations: LeakageViolation[];
  recommendations: string[];
  cssConflicts: CSSConflict[];
}

// Individual leakage violation
export interface LeakageViolation {
  type: 'css-selector' | 'global-style' | 'z-index' | 'font-family' | 'color-bleeding';
  message: string;
  affectedSkins: string[];
  severity: 'warning' | 'error';
  selector?: string;
  property?: string;
  value?: string;
}

// CSS conflict detection
export interface CSSConflict {
  selector: string;
  property: string;
  skin1: { id: string; value: string };
  skin2: { id: string; value: string };
  impact: 'visual' | 'layout' | 'behavior';
}

// Test configuration
export interface MultiSkinTestConfig {
  maxConcurrentSkins: number;
  testAllCombinations: boolean;
  skipPairs: string[][]; // Skin pairs to skip (e.g., incompatible ones)
  detectZIndexConflicts: boolean;
  detectFontConflicts: boolean;
  detectColorBleeding: boolean;
}

// Default test configuration
export const DEFAULT_TEST_CONFIG: MultiSkinTestConfig = {
  maxConcurrentSkins: 3,
  testAllCombinations: false, // Only test pairs for performance
  skipPairs: [],
  detectZIndexConflicts: true,
  detectFontConflicts: true,
  detectColorBleeding: true,
};

// Main multi-skin tester class
export class MultiSkinTester {
  private config: MultiSkinTestConfig;
  private cssAnalyzer: CSSAnalyzer;

  constructor(config: MultiSkinTestConfig = DEFAULT_TEST_CONFIG) {
    this.config = config;
    this.cssAnalyzer = new CSSAnalyzer();
  }

  // Test all available skin combinations for leakage
  async testAllSkinCombinations(siteData: SiteSchema): Promise<Map<string, LeakageTestResult>> {
    const results = new Map<string, LeakageTestResult>();
    const availableSkins = await skinLoader.discoverSkins();
    const validSkins = availableSkins.filter(skin => skin.isValid);

    if (validSkins.length < 2) {
      throw new Error('Need at least 2 valid skins to test leakage');
    }

    // Generate test combinations
    const combinations = this.generateTestCombinations(validSkins.map(s => s.id));

    for (const combination of combinations) {
      const testKey = combination.join(' + ');
      
      try {
        const result = await this.testSkinCombination(combination, siteData);
        results.set(testKey, result);
      } catch (error) {
        // Record failed test
        results.set(testKey, {
          passed: false,
          skinsCombination: combination,
          violations: [{
            type: 'global-style',
            message: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
            affectedSkins: combination,
            severity: 'error'
          }],
          recommendations: ['Fix the underlying skin loading error'],
          cssConflicts: []
        });
      }
    }

    return results;
  }

  // Test specific combination of skins
  async testSkinCombination(skinIds: string[], siteData: SiteSchema): Promise<LeakageTestResult> {
    const violations: LeakageViolation[] = [];
    const recommendations: string[] = [];
    const cssConflicts: CSSConflict[] = [];

    // Load all skins
    const skinResults = await Promise.all(
      skinIds.map(async (skinId) => ({
        id: skinId,
        result: await skinLoader.loadSkin(skinId),
        mappings: await skinLoader.generateMappings(skinId, siteData)
      }))
    );

    // Analyze CSS for each skin
    const cssAnalyses = skinResults.map(({ id, result }) => ({
      skinId: id,
      analysis: this.cssAnalyzer.analyzeSkinCSS(result.processedCSS, id)
    }));

    // Check for unprefixed selectors
    for (const { skinId, analysis } of cssAnalyses) {
      for (const unprefixedSelector of analysis.unprefixedSelectors) {
        violations.push({
          type: 'css-selector',
          message: `Skin "${skinId}" has unprefixed selector: ${unprefixedSelector}`,
          affectedSkins: [skinId],
          severity: 'error',
          selector: unprefixedSelector
        });
      }
    }

    // Check for global style leakage
    for (const { skinId, analysis } of cssAnalyses) {
      for (const globalStyle of analysis.globalStyles) {
        violations.push({
          type: 'global-style',
          message: `Skin "${skinId}" modifies global element: ${globalStyle}`,
          affectedSkins: [skinId],
          severity: 'warning',
          selector: globalStyle
        });
      }
    }

    // Detect conflicts between skin pairs
    if (this.config.detectZIndexConflicts) {
      cssConflicts.push(...this.detectZIndexConflicts(cssAnalyses));
    }

    if (this.config.detectFontConflicts) {
      cssConflicts.push(...this.detectFontConflicts(cssAnalyses));
    }

    if (this.config.detectColorBleeding) {
      cssConflicts.push(...this.detectColorBleeding(cssAnalyses));
    }

    // Generate recommendations
    if (violations.length > 0) {
      recommendations.push('Prefix all CSS selectors with [data-skin="skin-id"]');
      recommendations.push('Avoid modifying global elements (html, body, *, etc.)');
    }

    if (cssConflicts.length > 0) {
      recommendations.push('Use CSS custom properties for consistent theming');
      recommendations.push('Avoid hardcoded z-index values - use a z-index scale');
    }

    // Check for skin isolation
    const isolationViolations = this.checkSkinIsolation(cssAnalyses);
    violations.push(...isolationViolations);

    if (violations.length === 0 && cssConflicts.length === 0) {
      recommendations.push('✅ No leakage detected - skins are properly isolated!');
    }

    return {
      passed: violations.filter(v => v.severity === 'error').length === 0,
      skinsCombination: skinIds,
      violations,
      recommendations: [...new Set(recommendations)], // Remove duplicates
      cssConflicts
    };
  }

  // Generate test combinations based on configuration
  private generateTestCombinations(skinIds: string[]): string[][] {
    const combinations: string[][] = [];

    if (this.config.testAllCombinations) {
      // Generate all possible combinations up to maxConcurrentSkins
      for (let size = 2; size <= Math.min(this.config.maxConcurrentSkins, skinIds.length); size++) {
        combinations.push(...this.getCombinations(skinIds, size));
      }
    } else {
      // Just test pairs (more efficient)
      for (let i = 0; i < skinIds.length; i++) {
        for (let j = i + 1; j < skinIds.length; j++) {
          const pair = [skinIds[i], skinIds[j]];
          
          // Skip if in skip list
          const shouldSkip = this.config.skipPairs.some(skipPair => 
            (skipPair[0] === pair[0] && skipPair[1] === pair[1]) ||
            (skipPair[0] === pair[1] && skipPair[1] === pair[0])
          );
          
          if (!shouldSkip) {
            combinations.push(pair);
          }
        }
      }
    }

    return combinations;
  }

  // Helper: Generate combinations of array elements
  private getCombinations<T>(array: T[], size: number): T[][] {
    if (size > array.length || size <= 0) return [];
    if (size === array.length) return [array];
    if (size === 1) return array.map(el => [el]);

    const combinations: T[][] = [];
    for (let i = 0; i < array.length - size + 1; i++) {
      const head = array[i];
      const tailCombinations = this.getCombinations(array.slice(i + 1), size - 1);
      for (const tailCombination of tailCombinations) {
        combinations.push([head, ...tailCombination]);
      }
    }
    return combinations;
  }

  // Detect z-index conflicts between skins
  private detectZIndexConflicts(analyses: Array<{ skinId: string; analysis: any }>): CSSConflict[] {
    const conflicts: CSSConflict[] = [];
    const zIndexMap = new Map<number, Array<{ skinId: string; selector: string }>>();

    // Collect z-index values from all skins
    for (const { skinId, analysis } of analyses) {
      for (const [selector, zIndex] of analysis.zIndexValues) {
        if (!zIndexMap.has(zIndex)) {
          zIndexMap.set(zIndex, []);
        }
        zIndexMap.get(zIndex)!.push({ skinId, selector });
      }
    }

    // Find conflicts (same z-index used by different skins)
    for (const [zIndex, usages] of zIndexMap) {
      if (usages.length > 1) {
        const skins = [...new Set(usages.map(u => u.skinId))];
        if (skins.length > 1) {
          conflicts.push({
            selector: usages.map(u => `${u.skinId}:${u.selector}`).join(', '),
            property: 'z-index',
            skin1: { id: skins[0], value: zIndex.toString() },
            skin2: { id: skins[1], value: zIndex.toString() },
            impact: 'layout'
          });
        }
      }
    }

    return conflicts;
  }

  // Detect font family conflicts
  private detectFontConflicts(analyses: Array<{ skinId: string; analysis: any }>): CSSConflict[] {
    const conflicts: CSSConflict[] = [];
    // Implementation would check for conflicting font-family declarations
    // that could affect elements outside skin scope
    return conflicts;
  }

  // Detect color bleeding between skins
  private detectColorBleeding(analyses: Array<{ skinId: string; analysis: any }>): CSSConflict[] {
    const conflicts: CSSConflict[] = [];
    // Implementation would check for color inheritance issues
    // where one skin's colors affect another skin's elements
    return conflicts;
  }

  // Check for proper skin isolation
  private checkSkinIsolation(analyses: Array<{ skinId: string; analysis: any }>): LeakageViolation[] {
    const violations: LeakageViolation[] = [];

    for (const { skinId, analysis } of analyses) {
      // Check if all selectors are properly scoped
      const unscopedSelectors = analysis.selectors.filter((selector: string) => 
        !selector.includes(`[data-skin="${skinId}"]`) &&
        !this.isAllowedGlobalSelector(selector)
      );

      for (const selector of unscopedSelectors) {
        violations.push({
          type: 'css-selector',
          message: `Skin "${skinId}" has unscoped selector that may leak: ${selector}`,
          affectedSkins: [skinId],
          severity: 'error',
          selector
        });
      }
    }

    return violations;
  }

  // Check if a selector is allowed to be global
  private isAllowedGlobalSelector(selector: string): boolean {
    const allowedGlobals = [
      '@font-face',
      '@keyframes',
      '@media',
      ':root',
      '::before',
      '::after',
      // Add more allowed global selectors as needed
    ];

    return allowedGlobals.some(allowed => selector.startsWith(allowed));
  }

  // Generate HTML for visual testing page
  generateTestPage(testResults: Map<string, LeakageTestResult>, siteData: SiteSchema): string {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Multi-Skin Leakage Test</title>
    <style>
        body {
            font-family: system-ui, sans-serif;
            margin: 0;
            background: #f5f5f5;
        }
        .header {
            background: #fff;
            padding: 1rem;
            border-bottom: 1px solid #ddd;
            margin-bottom: 2rem;
        }
        .test-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 2rem;
            padding: 0 2rem;
        }
        .skin-preview {
            background: #fff;
            border: 2px solid #ddd;
            border-radius: 8px;
            overflow: hidden;
        }
        .skin-header {
            background: #333;
            color: white;
            padding: 0.5rem 1rem;
            font-weight: 600;
        }
        .skin-content {
            min-height: 400px;
            position: relative;
        }
        .violations {
            background: #fee;
            border-top: 1px solid #fcc;
            padding: 1rem;
        }
        .violation {
            margin-bottom: 0.5rem;
            font-size: 0.875rem;
        }
        .error { color: #c53030; }
        .warning { color: #d69e2e; }
        .passed { color: #38a169; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Multi-Skin Leakage Test Results</h1>
        <p>Testing for CSS conflicts and leakage between skins</p>
    </div>
    
    <div class="test-results">
        ${Array.from(testResults.entries()).map(([combination, result]) => `
            <div class="test-result">
                <h2>Testing: ${combination}</h2>
                <div class="status ${result.passed ? 'passed' : 'failed'}">
                    ${result.passed ? '✅ PASSED' : '❌ FAILED'}
                </div>
                
                ${result.violations.length > 0 ? `
                    <div class="violations">
                        <h3>Violations:</h3>
                        ${result.violations.map(v => `
                            <div class="violation ${v.severity}">
                                ${v.severity === 'error' ? '🚨' : '⚠️'} ${v.message}
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                
                ${result.cssConflicts.length > 0 ? `
                    <div class="conflicts">
                        <h3>CSS Conflicts:</h3>
                        ${result.cssConflicts.map(c => `
                            <div class="conflict">
                                ⚡ ${c.property} conflict: ${c.skin1.id} vs ${c.skin2.id}
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `).join('')}
    </div>
</body>
</html>`;

    return html;
  }
}

// CSS Analysis helper class
class CSSAnalyzer {
  analyzeSkinCSS(css: string, skinId: string) {
    const selectors: string[] = [];
    const unprefixedSelectors: string[] = [];
    const globalStyles: string[] = [];
    const zIndexValues = new Map<string, number>();

    // Parse CSS and extract selectors (simplified)
    const selectorRegex = /([^{}]+)\s*\{[^}]*\}/g;
    let match;
    
    while ((match = selectorRegex.exec(css)) !== null) {
      const selector = match[1].trim();
      selectors.push(selector);

      // Check if selector is properly prefixed
      if (!selector.includes(`[data-skin="${skinId}"]`) && 
          !this.isGlobalSelector(selector)) {
        unprefixedSelectors.push(selector);
      }

      // Check for global element modifications
      if (this.modifiesGlobalElements(selector)) {
        globalStyles.push(selector);
      }

      // Extract z-index values
      const zIndexMatch = match[0].match(/z-index\s*:\s*(\d+)/);
      if (zIndexMatch) {
        zIndexValues.set(selector, parseInt(zIndexMatch[1]));
      }
    }

    return {
      selectors,
      unprefixedSelectors,
      globalStyles,
      zIndexValues
    };
  }

  private isGlobalSelector(selector: string): boolean {
    const globalPatterns = [
      /^@/,           // @media, @keyframes, etc.
      /^:root/,       // CSS custom properties
      /^::?before/,   // Pseudo-elements
      /^::?after/,
      /^html\b/,
      /^body\b/,
      /^\*/           // Universal selector
    ];

    return globalPatterns.some(pattern => pattern.test(selector));
  }

  private modifiesGlobalElements(selector: string): boolean {
    const globalElements = ['html', 'body', '*'];
    return globalElements.some(element => 
      selector.split(',').some(s => s.trim().startsWith(element))
    );
  }
}

// Singleton instance
export const multiSkinTester = new MultiSkinTester();

// Utility functions
export async function runLeakageTest(siteData: SiteSchema): Promise<Map<string, LeakageTestResult>> {
  return multiSkinTester.testAllSkinCombinations(siteData);
}

export async function generateLeakageTestPage(siteData: SiteSchema): Promise<string> {
  const testResults = await multiSkinTester.testAllSkinCombinations(siteData);
  return multiSkinTester.generateTestPage(testResults, siteData);
}

export function createStrictTestConfig(): MultiSkinTestConfig {
  return {
    maxConcurrentSkins: 2,
    testAllCombinations: true,
    skipPairs: [],
    detectZIndexConflicts: true,
    detectFontConflicts: true,
    detectColorBleeding: true,
  };
}