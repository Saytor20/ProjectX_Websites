/**
 * JavaScript Policy Enforcer
 * 
 * Enforces approved JavaScript libraries policy for production security.
 * Only allows React, Next.js, Swiper, and Headless UI components.
 */

export interface PolicyViolation {
  package: string;
  version?: string;
  reason: string;
  severity: 'error' | 'warning';
  suggestion?: string;
}

export interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

export class JavaScriptPolicyEnforcer {
  private readonly approvedLibraries = new Set([
    'swiper',               // Carousel/slider functionality
    '@headlessui/react',    // Accessible UI primitives  
    'react',                // Core framework
    'react-dom',            // DOM rendering
    'next',                 // Framework core
    'zod',                  // Schema validation
    'postcss',              // CSS processing
    'postcss-prefix-selector', // CSS scoping
    'sharp',                // Image optimization
    'js-yaml',              // YAML parsing for configs
    'chalk',                // CLI colors
    'commander',            // CLI framework
    'inquirer',             // CLI prompts
    'ora',                  // CLI spinners
  ]);

  private readonly approvedDevLibraries = new Set([
    '@types/node',
    '@types/react', 
    '@types/react-dom',
    '@types/js-yaml',
    '@types/inquirer',
    'typescript',
    'eslint',
    'eslint-config-next',
    '@typescript-eslint/eslint-plugin',
    '@typescript-eslint/parser',
    'autoprefixer',
    'tailwindcss',
    'jest',
    '@types/jest',
    'playwright',
    '@axe-core/playwright',
    'cssnano',
    'critters',
  ]);

  private readonly blockedPatterns = [
    /jquery/i,
    /lodash/i, 
    /moment/i,
    /bootstrap\.js/i,
    /analytics/i,
    /tracking/i,
    /google-analytics/i,
    /gtag/i,
    /@mui/i,          // Block Material-UI
    /@emotion/i,      // Block Emotion
    /styled-components/i,
    /framer-motion/i,
    /react-spring/i,
  ];

  private readonly replacementSuggestions = new Map([
    ['@mui/material', 'Use @headlessui/react for accessible components'],
    ['@emotion/react', 'Use native CSS with PostCSS processing'],
    ['@emotion/styled', 'Use CSS modules or Tailwind CSS'],
    ['jquery', 'Use native DOM methods or React refs'],
    ['lodash', 'Use native JavaScript methods'],
    ['moment', 'Use native Date or date-fns (if approved)'],
    ['bootstrap', 'Use Tailwind CSS or custom CSS'],
    ['framer-motion', 'Use CSS animations with Swiper for carousels'],
  ]);

  /**
   * Validates package.json against approved library policy
   */
  validatePackageJson(packageJson: PackageJson): PolicyViolation[] {
    const violations: PolicyViolation[] = [];

    // Check dependencies
    if (packageJson.dependencies) {
      for (const [pkg, version] of Object.entries(packageJson.dependencies)) {
        const violation = this.validatePackage(pkg, version, false);
        if (violation) {
          violations.push(violation);
        }
      }
    }

    // Check devDependencies  
    if (packageJson.devDependencies) {
      for (const [pkg, version] of Object.entries(packageJson.devDependencies)) {
        const violation = this.validatePackage(pkg, version, true);
        if (violation) {
          violations.push(violation);
        }
      }
    }

    return violations;
  }

  /**
   * Validates a single package
   */
  private validatePackage(packageName: string, version: string, isDev: boolean): PolicyViolation | null {
    const approvedSet = isDev ? this.approvedDevLibraries : this.approvedLibraries;
    
    // Check exact matches first
    if (approvedSet.has(packageName)) {
      return null;
    }

    // Check if it's a TypeScript definition for an approved package
    if (packageName.startsWith('@types/')) {
      const basePackage = packageName.replace('@types/', '');
      if (this.approvedLibraries.has(basePackage) || this.approvedDevLibraries.has(basePackage)) {
        return null;
      }
    }

    // Check blocked patterns
    const blockedPattern = this.blockedPatterns.find(pattern => pattern.test(packageName));
    if (blockedPattern) {
      return {
        package: packageName,
        version,
        reason: 'Package matches blocked pattern and is not allowed for security/performance reasons',
        severity: 'error',
        suggestion: this.replacementSuggestions.get(packageName) || 'Remove this dependency'
      };
    }

    // Package not in approved list
    return {
      package: packageName,
      version,
      reason: 'Package not in approved library allowlist',
      severity: 'error',
      suggestion: this.replacementSuggestions.get(packageName) || 'Use approved alternatives or request approval'
    };
  }

  /**
   * Strips JavaScript from HTML templates for security
   */
  stripTemplateJS(htmlContent: string): string {
    let processed = htmlContent;

    // Remove all <script> tags (both with src and inline)
    processed = processed.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // Remove inline event handlers (onclick, onload, etc.)
    processed = processed.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');

    // Remove javascript: URLs
    processed = processed.replace(/href\s*=\s*["']javascript:[^"']*["']/gi, '');

    // Remove style attributes (handled by CSS scoping)
    processed = processed.replace(/\s*style\s*=\s*["'][^"']*["']/gi, '');

    return processed;
  }

  /**
   * Validates that no JavaScript is embedded in CSS
   */
  validateCSSSecurity(cssContent: string): PolicyViolation[] {
    const violations: PolicyViolation[] = [];
    
    const dangerousPatterns = [
      { pattern: /javascript:/i, reason: 'JavaScript URLs in CSS are not allowed' },
      { pattern: /expression\s*\(/i, reason: 'CSS expressions are not allowed' },
      { pattern: /-moz-binding/i, reason: 'XBL bindings are not allowed' },
      { pattern: /behavior\s*:/i, reason: 'CSS behaviors are not allowed' },
      { pattern: /@import.*javascript:/i, reason: 'JavaScript imports in CSS are not allowed' },
    ];

    for (const { pattern, reason } of dangerousPatterns) {
      if (pattern.test(cssContent)) {
        violations.push({
          package: 'CSS Security',
          reason,
          severity: 'error'
        });
      }
    }

    return violations;
  }

  /**
   * Generates a security report for the current project
   */
  generateSecurityReport(packageJson: PackageJson, templateFiles: string[] = []): {
    passed: boolean;
    violations: PolicyViolation[];
    approvedPackages: string[];
    recommendations: string[];
  } {
    const violations = this.validatePackageJson(packageJson);
    const approvedPackages: string[] = [];

    // Collect approved packages
    if (packageJson.dependencies) {
      for (const pkg of Object.keys(packageJson.dependencies)) {
        if (this.approvedLibraries.has(pkg) || pkg.startsWith('@types/')) {
          approvedPackages.push(pkg);
        }
      }
    }

    const recommendations: string[] = [];

    // Generate recommendations based on violations
    violations.forEach(violation => {
      if (violation.suggestion) {
        recommendations.push(`${violation.package}: ${violation.suggestion}`);
      }
    });

    // Add general security recommendations
    if (recommendations.length === 0) {
      recommendations.push('✅ All packages comply with security policy');
      recommendations.push('Consider enabling dependabot for security updates');
      recommendations.push('Regularly audit dependencies with npm audit');
    }

    return {
      passed: violations.filter(v => v.severity === 'error').length === 0,
      violations,
      approvedPackages,
      recommendations
    };
  }

  /**
   * Returns the list of approved libraries for documentation
   */
  getApprovedLibraries(): {
    runtime: string[];
    development: string[];
    blocked: string[];
  } {
    return {
      runtime: Array.from(this.approvedLibraries).sort(),
      development: Array.from(this.approvedDevLibraries).sort(),
      blocked: this.blockedPatterns.map(p => p.toString())
    };
  }
}

// Export singleton instance
export const jsPolicyEnforcer = new JavaScriptPolicyEnforcer();

// Utility functions for build integration
export async function validateProjectSecurity(packageJsonPath: string): Promise<PolicyViolation[]> {
  try {
    const fs = await import('fs/promises');
    const packageContent = await fs.readFile(packageJsonPath, 'utf8');
    const packageJson: PackageJson = JSON.parse(packageContent);
    
    return jsPolicyEnforcer.validatePackageJson(packageJson);
  } catch (error) {
    return [{
      package: 'build-system',
      reason: `Failed to validate package.json: ${error instanceof Error ? error.message : 'Unknown error'}`,
      severity: 'error'
    }];
  }
}

export function formatSecurityReport(report: ReturnType<typeof JavaScriptPolicyEnforcer.prototype.generateSecurityReport>): string {
  const lines: string[] = [];
  
  lines.push('');
  lines.push('🔒 JAVASCRIPT SECURITY POLICY REPORT');
  lines.push('═'.repeat(50));
  lines.push('');
  
  // Overall status
  lines.push(`Status: ${report.passed ? '✅ PASSED' : '❌ FAILED'}`);
  lines.push(`Approved Packages: ${report.approvedPackages.length}`);
  lines.push(`Policy Violations: ${report.violations.length}`);
  lines.push('');

  // List approved packages
  if (report.approvedPackages.length > 0) {
    lines.push('✅ Approved Packages:');
    report.approvedPackages.forEach(pkg => {
      lines.push(`   • ${pkg}`);
    });
    lines.push('');
  }

  // List violations
  if (report.violations.length > 0) {
    lines.push('❌ Policy Violations:');
    report.violations.forEach(violation => {
      const icon = violation.severity === 'error' ? '🚨' : '⚠️';
      lines.push(`   ${icon} ${violation.package}: ${violation.reason}`);
      if (violation.suggestion) {
        lines.push(`      → ${violation.suggestion}`);
      }
    });
    lines.push('');
  }

  // Recommendations
  if (report.recommendations.length > 0) {
    lines.push('💡 Recommendations:');
    report.recommendations.forEach(rec => {
      lines.push(`   • ${rec}`);
    });
    lines.push('');
  }

  lines.push('═'.repeat(50));
  
  return lines.join('\n');
}