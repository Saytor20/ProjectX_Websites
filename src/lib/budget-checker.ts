/**
 * Performance Budget Checker
 * 
 * Enforces CSS ≤50KB and JS ≤15-20KB gzipped per skin
 * Validates performance constraints and provides detailed reporting
 */

import fs from 'fs/promises';
import path from 'path';
import { gzipSync } from 'zlib';

// Budget configuration
export interface PerformanceBudget {
  maxCSSSize: number;          // CSS size limit in bytes
  maxCSSGzippedSize: number;   // CSS gzipped size limit  
  maxJSSize: number;           // JS size limit in bytes
  maxJSGzippedSize: number;    // JS gzipped size limit
  maxImageSize: number;        // Individual image size limit
  maxTotalImages: number;      // Total images size limit
}

// Default budgets based on requirements
export const DEFAULT_BUDGET: PerformanceBudget = {
  maxCSSSize: 50 * 1024,        // 50KB CSS
  maxCSSGzippedSize: 15 * 1024, // 15KB gzipped CSS
  maxJSSize: 20 * 1024,         // 20KB JS  
  maxJSGzippedSize: 15 * 1024,  // 15KB gzipped JS
  maxImageSize: 500 * 1024,     // 500KB per image
  maxTotalImages: 2 * 1024 * 1024, // 2MB total images
};

// Budget check result
export interface BudgetCheckResult {
  passed: boolean;
  violations: BudgetViolation[];
  stats: ResourceStats;
  recommendations: string[];
}

// Individual violation
export interface BudgetViolation {
  type: 'css' | 'js' | 'image';
  message: string;
  current: number;
  limit: number;
  severity: 'warning' | 'error';
}

// Resource statistics
export interface ResourceStats {
  css: {
    size: number;
    gzippedSize: number;
    files: number;
  };
  js: {
    size: number;
    gzippedSize: number;  
    files: number;
  };
  images: {
    totalSize: number;
    count: number;
    largest: { file: string; size: number } | null;
  };
}

// Main budget checker class
export class BudgetChecker {
  private budget: PerformanceBudget;

  constructor(budget: PerformanceBudget = DEFAULT_BUDGET) {
    this.budget = budget;
  }

  // Check CSS budget
  async checkCSS(cssContent: string, filename?: string): Promise<BudgetCheckResult> {
    const violations: BudgetViolation[] = [];
    const recommendations: string[] = [];

    // Calculate sizes
    const size = Buffer.byteLength(cssContent, 'utf8');
    const gzippedSize = gzipSync(cssContent).length;

    // Check raw size
    if (size > this.budget.maxCSSSize) {
      violations.push({
        type: 'css',
        message: `CSS file ${filename || 'unknown'} exceeds size limit`,
        current: size,
        limit: this.budget.maxCSSSize,
        severity: 'error'
      });
      recommendations.push('Remove unused CSS rules or split into multiple files');
    }

    // Check gzipped size  
    if (gzippedSize > this.budget.maxCSSGzippedSize) {
      violations.push({
        type: 'css',
        message: `CSS file ${filename || 'unknown'} exceeds gzipped size limit`,
        current: gzippedSize,
        limit: this.budget.maxCSSGzippedSize,
        severity: 'error'
      });
      recommendations.push('Enable CSS minification and remove duplicate styles');
    }

    // Performance warnings
    if (size > this.budget.maxCSSSize * 0.8) {
      recommendations.push('Consider using CSS-in-JS or splitting styles by component');
    }

    if (cssContent.includes('@import')) {
      recommendations.push('Avoid @import statements - they block parallel loading');
    }

    const stats: ResourceStats = {
      css: {
        size,
        gzippedSize,
        files: 1
      },
      js: { size: 0, gzippedSize: 0, files: 0 },
      images: { totalSize: 0, count: 0, largest: null }
    };

    return {
      passed: violations.length === 0,
      violations,
      stats,
      recommendations
    };
  }

  // Check JavaScript budget
  async checkJS(jsContent: string, filename?: string): Promise<BudgetCheckResult> {
    const violations: BudgetViolation[] = [];
    const recommendations: string[] = [];

    // Calculate sizes
    const size = Buffer.byteLength(jsContent, 'utf8');
    const gzippedSize = gzipSync(jsContent).length;

    // Check raw size
    if (size > this.budget.maxJSSize) {
      violations.push({
        type: 'js',
        message: `JavaScript file ${filename || 'unknown'} exceeds size limit`,
        current: size,
        limit: this.budget.maxJSSize,
        severity: 'error'
      });
      recommendations.push('Remove unused code or implement code splitting');
    }

    // Check gzipped size
    if (gzippedSize > this.budget.maxJSGzippedSize) {
      violations.push({
        type: 'js',
        message: `JavaScript file ${filename || 'unknown'} exceeds gzipped size limit`,
        current: gzippedSize,
        limit: this.budget.maxJSGzippedSize,
        severity: 'error'
      });
      recommendations.push('Enable JavaScript minification and tree shaking');
    }

    // Check for performance anti-patterns
    if (jsContent.includes('eval(')) {
      recommendations.push('Avoid eval() - it prevents optimization and is a security risk');
    }

    if (jsContent.includes('document.write')) {
      recommendations.push('Avoid document.write() - it blocks page rendering');
    }

    if (jsContent.match(/setInterval|setTimeout.*\d{1,3}\)/)) {
      recommendations.push('Use requestAnimationFrame for animations instead of timers');
    }

    const stats: ResourceStats = {
      css: { size: 0, gzippedSize: 0, files: 0 },
      js: {
        size,
        gzippedSize,
        files: 1
      },
      images: { totalSize: 0, count: 0, largest: null }
    };

    return {
      passed: violations.length === 0,
      violations,
      stats,
      recommendations
    };
  }

  // Check skin budget (comprehensive check)
  async checkSkinBudget(skinPath: string): Promise<BudgetCheckResult> {
    const violations: BudgetViolation[] = [];
    const recommendations: string[] = [];
    let totalStats: ResourceStats = {
      css: { size: 0, gzippedSize: 0, files: 0 },
      js: { size: 0, gzippedSize: 0, files: 0 },
      images: { totalSize: 0, count: 0, largest: null }
    };

    try {
      // Check CSS files
      const cssFiles = ['skin.css'];
      for (const cssFile of cssFiles) {
        const cssPath = path.join(skinPath, cssFile);
        try {
          const cssContent = await fs.readFile(cssPath, 'utf8');
          const cssResult = await this.checkCSS(cssContent, cssFile);
          
          violations.push(...cssResult.violations);
          recommendations.push(...cssResult.recommendations);
          totalStats.css.size += cssResult.stats.css.size;
          totalStats.css.gzippedSize += cssResult.stats.css.gzippedSize;
          totalStats.css.files += 1;
        } catch (error) {
          // CSS file not found - that's ok for some files
        }
      }

      // Check JavaScript files
      const jsFiles = ['behavior.ts', 'behavior.js'];
      for (const jsFile of jsFiles) {
        const jsPath = path.join(skinPath, jsFile);
        try {
          const jsContent = await fs.readFile(jsPath, 'utf8');
          const jsResult = await this.checkJS(jsContent, jsFile);
          
          violations.push(...jsResult.violations);
          recommendations.push(...jsResult.recommendations);
          totalStats.js.size += jsResult.stats.js.size;
          totalStats.js.gzippedSize += jsResult.stats.js.gzippedSize;
          totalStats.js.files += 1;
        } catch (error) {
          // JS file not found - that's ok, behavior is optional
        }
      }

      // Check for JS when none is needed
      if (totalStats.js.size === 0) {
        recommendations.push('✅ No JavaScript found - excellent for performance!');
      } else if (totalStats.js.size < this.budget.maxJSSize * 0.1) {
        recommendations.push('✅ Minimal JavaScript usage - good for performance!');
      }

      // Overall recommendations
      if (violations.length === 0) {
        recommendations.push('✅ All performance budgets passed!');
      }

      // Add skin-specific recommendations
      if (totalStats.css.size > this.budget.maxCSSSize * 0.9) {
        recommendations.push('Consider using CSS custom properties for theming instead of full CSS overwrites');
      }

    } catch (error) {
      violations.push({
        type: 'css',
        message: `Failed to check skin budget: ${error instanceof Error ? error.message : 'Unknown error'}`,
        current: 0,
        limit: 0,
        severity: 'error'
      });
    }

    return {
      passed: violations.length === 0,
      violations,
      stats: totalStats,
      recommendations: [...new Set(recommendations)] // Remove duplicates
    };
  }

  // Check multiple skins for budget compliance
  async checkAllSkins(skinsDirectory: string): Promise<Map<string, BudgetCheckResult>> {
    const results = new Map<string, BudgetCheckResult>();

    try {
      const entries = await fs.readdir(skinsDirectory, { withFileTypes: true });
      const skinDirs = entries.filter(entry => entry.isDirectory());

      for (const dir of skinDirs) {
        const skinPath = path.join(skinsDirectory, dir.name);
        const result = await this.checkSkinBudget(skinPath);
        results.set(dir.name, result);
      }
    } catch (error) {
      // If skins directory doesn't exist, return empty results
    }

    return results;
  }

  // Generate budget report
  formatBudgetReport(skinId: string, result: BudgetCheckResult): string {
    const lines: string[] = [];
    lines.push(`\n📊 Performance Budget Report: ${skinId}`);
    lines.push('═'.repeat(50));
    
    // Overall status
    lines.push(`Status: ${result.passed ? '✅ PASSED' : '❌ FAILED'}`);
    
    // Resource statistics  
    lines.push('\n📈 Resource Statistics:');
    if (result.stats.css.files > 0) {
      lines.push(`  CSS: ${this.formatSize(result.stats.css.size)} (${this.formatSize(result.stats.css.gzippedSize)} gzipped)`);
    }
    if (result.stats.js.files > 0) {
      lines.push(`  JS:  ${this.formatSize(result.stats.js.size)} (${this.formatSize(result.stats.js.gzippedSize)} gzipped)`);
    }
    
    // Budget limits
    lines.push('\n📏 Budget Limits:');
    lines.push(`  CSS: ${this.formatSize(this.budget.maxCSSSize)} (${this.formatSize(this.budget.maxCSSGzippedSize)} gzipped)`);
    lines.push(`  JS:  ${this.formatSize(this.budget.maxJSSize)} (${this.formatSize(this.budget.maxJSGzippedSize)} gzipped)`);
    
    // Violations
    if (result.violations.length > 0) {
      lines.push('\n❌ Budget Violations:');
      for (const violation of result.violations) {
        const icon = violation.severity === 'error' ? '🚨' : '⚠️';
        lines.push(`  ${icon} ${violation.message}`);
        lines.push(`     Current: ${this.formatSize(violation.current)} | Limit: ${this.formatSize(violation.limit)}`);
      }
    }
    
    // Recommendations
    if (result.recommendations.length > 0) {
      lines.push('\n💡 Recommendations:');
      for (const rec of result.recommendations) {
        lines.push(`  • ${rec}`);
      }
    }
    
    lines.push('\n' + '═'.repeat(50));
    return lines.join('\n');
  }

  // Format bytes as human-readable size
  private formatSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  }

  // Update budget configuration
  setBudget(budget: Partial<PerformanceBudget>): void {
    this.budget = { ...this.budget, ...budget };
  }

  // Get current budget
  getBudget(): PerformanceBudget {
    return { ...this.budget };
  }
}

// Singleton instance
export const budgetChecker = new BudgetChecker();

// Utility functions
export async function checkSkinPerformance(skinPath: string): Promise<BudgetCheckResult> {
  return budgetChecker.checkSkinBudget(skinPath);
}

export async function validateAllSkinsPerformance(skinsDirectory: string): Promise<{
  passed: boolean;
  results: Map<string, BudgetCheckResult>;
  summary: string;
}> {
  const results = await budgetChecker.checkAllSkins(skinsDirectory);
  let passed = true;
  const violations: string[] = [];

  for (const [skinId, result] of results) {
    if (!result.passed) {
      passed = false;
      violations.push(`${skinId}: ${result.violations.length} violation(s)`);
    }
  }

  const summary = passed 
    ? `✅ All ${results.size} skins passed performance budgets`
    : `❌ ${violations.length} skins failed: ${violations.join(', ')}`;

  return { passed, results, summary };
}

export function createStrictBudget(): PerformanceBudget {
  return {
    maxCSSSize: 30 * 1024,        // 30KB CSS (stricter)
    maxCSSGzippedSize: 10 * 1024, // 10KB gzipped CSS
    maxJSSize: 10 * 1024,         // 10KB JS (stricter)
    maxJSGzippedSize: 8 * 1024,   // 8KB gzipped JS  
    maxImageSize: 250 * 1024,     // 250KB per image
    maxTotalImages: 1 * 1024 * 1024, // 1MB total images
  };
}