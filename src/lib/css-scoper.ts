/**
 * CSS Scoping System - Production Grade
 * 
 * Automatically prefixes CSS rules with [data-skin="id"] to prevent style leakage.
 * Provides complete namespace isolation with keyframes and custom properties scoping.
 * Includes conflict detection and performance optimization.
 */

import postcss, { Root, Rule, AtRule, Declaration, Plugin } from 'postcss';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { gzipSync } from 'zlib';

// Scoping options
export interface ScopingOptions {
  skinId: string;
  prefix?: string;
  scopeKeyframes?: boolean;
  scopeVariables?: boolean;
  preserveGlobals?: string[];
  minify?: boolean;
  addContainment?: boolean;
  enforceNaming?: boolean;
}

// CSS processing result
export interface ProcessingResult {
  css: string;
  sourceMap?: string;
  hash: string;
  stats: {
    rulesProcessed: number;
    keyframesScoped: number;
    variablesScoped: number;
    animationsUpdated: number;
    size: number;
    sizeGzipped?: number;
  };
  conflicts: ConflictWarning[];
  warnings: string[];
}

// Conflict warning
export interface ConflictWarning {
  type: 'global-selector' | 'unscoped-keyframes' | 'dangerous-selector' | 'css-injection';
  selector?: string;
  property?: string;
  message: string;
  severity: 'warning' | 'error';
  line?: number;
}

// Multi-skin test result
export interface MultiSkinTestResult {
  passed: boolean;
  violations: SkinLeakageViolation[];
  tested: string[];
}

// Skin leakage violation
export interface SkinLeakageViolation {
  type: 'css-leakage' | 'keyframes-conflict' | 'variable-collision';
  affectedSkins: string[];
  selector?: string;
  property?: string;
  message: string;
  severity: 'warning' | 'error';
}

// CSS Scoper class
export class CSSScoper {
  private options: Required<ScopingOptions>;
  private conflicts: ConflictWarning[] = [];
  private warnings: string[] = [];
  private stats = {
    rulesProcessed: 0,
    keyframesScoped: 0,
    variablesScoped: 0,
    animationsUpdated: 0,
  };

  constructor(options: ScopingOptions) {
    this.options = {
      prefix: '[data-skin]',
      scopeKeyframes: true,
      scopeVariables: true,
      preserveGlobals: ['html', 'body', '*', '::before', '::after'],
      minify: true,
      addContainment: true,
      enforceNaming: true,
      ...options,
    };
  }

  // Process CSS string with production-grade isolation
  async processCSS(css: string, filename?: string): Promise<ProcessingResult> {
    const startTime = Date.now();
    
    // Reset tracking for this processing
    this.conflicts = [];
    this.warnings = [];
    this.stats = {
      rulesProcessed: 0,
      keyframesScoped: 0,
      variablesScoped: 0,
      animationsUpdated: 0,
    };

    try {
      // Pre-validation: Check for dangerous patterns
      this.validateCSSInput(css);

      const plugins: Plugin[] = [
        this.createKeyframesNamespacePlugin(),
        this.createCustomPropsNamespacePlugin(),
        this.createSelectorScopingPlugin(),
        this.createAnimationUpdaterPlugin(),
      ];

      if (this.options.addContainment) {
        plugins.push(this.createContainmentPlugin());
      }

      if (this.options.minify) {
        // Use cssnano for minification (imported dynamically)
        const cssnano = await import('cssnano');
        const cssnanoPlugin = cssnano.default({ preset: 'default' });
        plugins.push(cssnanoPlugin as any); // Type compatibility fix
      }

      const result = await postcss(plugins).process(css, {
        from: filename,
        to: filename?.replace(/\.css$/, '.scoped.css'),
        map: { inline: false },
      });

      const processedCSS = result.css;
      const hash = this.generateHash(processedCSS);
      
      // Calculate sizes
      const size = Buffer.byteLength(processedCSS, 'utf8');
      const gzippedSize = gzipSync(processedCSS).length;

      // Check budget compliance (50KB limit)
      if (size > 50000) {
        this.conflicts.push({
          type: 'dangerous-selector',
          message: `CSS size ${Math.round(size/1024)}KB exceeds 50KB budget`,
          severity: 'error'
        });
      }

      const duration = Date.now() - startTime;
      console.log(`🎨 CSS processed [${this.options.skinId}] in ${duration}ms:`, {
        size: `${(size / 1024).toFixed(2)}KB`,
        gzipped: `${(gzippedSize / 1024).toFixed(2)}KB`,
        conflicts: this.conflicts.length,
        ...this.stats,
      });

      return {
        css: processedCSS,
        sourceMap: result.map?.toString(),
        hash,
        stats: {
          ...this.stats,
          size,
          sizeGzipped: gzippedSize,
        },
        conflicts: this.conflicts,
        warnings: this.warnings,
      };
    } catch (error) {
      throw new Error(`CSS processing failed for ${this.options.skinId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Process CSS file
  async processFile(filePath: string): Promise<ProcessingResult> {
    try {
      const css = await fs.readFile(filePath, 'utf8');
      return this.processCSS(css, filePath);
    } catch (error) {
      throw new Error(`Failed to read CSS file ${filePath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Validate CSS input for dangerous patterns
  private validateCSSInput(css: string): void {
    // Check for JavaScript injection attempts
    const dangerousPatterns = [
      { pattern: /javascript:/i, message: 'JavaScript URLs not allowed in CSS' },
      { pattern: /expression\s*\(/i, message: 'CSS expressions not allowed' },
      { pattern: /-moz-binding/i, message: 'XBL bindings not allowed' },
      { pattern: /behavior\s*:/i, message: 'CSS behaviors not allowed' },
      { pattern: /@import.*javascript:/i, message: 'JavaScript imports not allowed' },
    ];

    for (const { pattern, message } of dangerousPatterns) {
      if (pattern.test(css)) {
        this.conflicts.push({
          type: 'css-injection',
          message,
          severity: 'error'
        });
      }
    }
  }

  // PostCSS Plugin: Namespace keyframes animations
  private createKeyframesNamespacePlugin(): Plugin {
    const skinId = this.options.skinId;
    
    return {
      postcssPlugin: 'namespace-keyframes',
      AtRule: {
        keyframes: (atRule: AtRule) => {
          const originalName = atRule.params.trim();
          const namespacedName = `${skinId}-${originalName}`;
          
          atRule.params = namespacedName;
          this.stats.keyframesScoped++;
        }
      }
    };
  }

  // PostCSS Plugin: Namespace custom properties
  private createCustomPropsNamespacePlugin(): Plugin {
    const skinId = this.options.skinId;
    
    return {
      postcssPlugin: 'namespace-custom-properties',
      Rule: (rule: Rule) => {
        // Move :root declarations to skin scope
        if (rule.selector === ':root') {
          rule.selector = `[data-skin="${skinId}"]`;
        }
        
        // Namespace all custom property declarations and references
        rule.walkDecls((decl: Declaration) => {
          if (decl.prop.startsWith('--')) {
            // Namespace property name
            const originalProp = decl.prop;
            const namespacedProp = `--${skinId}-${originalProp.slice(2)}`;
            decl.prop = namespacedProp;
            this.stats.variablesScoped++;
          }
          
          // Update var() references to use namespaced properties
          if (decl.value.includes('var(--')) {
            decl.value = decl.value.replace(
              /var\((--[\w-]+)([^)]*)\)/g,
              (match, prop, fallback) => {
                if (prop.startsWith(`--${skinId}-`)) {
                  return match; // Already namespaced
                }
                return `var(--${skinId}-${prop.slice(2)}${fallback})`;
              }
            );
          }
        });
      }
    };
  }

  // PostCSS Plugin: Scope selectors with data-skin attribute
  private createSelectorScopingPlugin(): Plugin {
    const scope = `[data-skin="${this.options.skinId}"]`;
    const preserveGlobals = this.options.preserveGlobals;
    
    return {
      postcssPlugin: 'scope-selectors',
      Rule: (rule: Rule) => {
        // Skip already scoped rules
        if (rule.selector.includes(scope)) {
          return;
        }

        // Check for dangerous selectors
        if (rule.selector.includes('*') && !rule.selector.includes('[data-')) {
          this.conflicts.push({
            type: 'dangerous-selector',
            selector: rule.selector,
            message: 'Universal selector may affect other templates',
            severity: 'warning'
          });
        }

        // Split and process each selector
        const selectors = rule.selector.split(',').map(s => s.trim());
        const scopedSelectors = selectors.map(selector => {
          // Check if selector should be preserved globally
          const isGlobal = preserveGlobals.some(global => 
            selector === global || selector.startsWith(`${global}:`)
          );
          
          if (isGlobal) {
            return selector;
          }

          // Handle :root specially
          if (selector === ':root') {
            return this.options.scopeVariables ? scope : selector;
          }

          // Handle complex selectors
          if (selector.includes(',')) {
            return selector.split(',')
              .map(s => `${scope} ${s.trim()}`)
              .join(', ');
          }

          // Add scope prefix
          if (selector.startsWith(':') || selector.startsWith('::')) {
            return `${scope}${selector}`;
          }

          return `${scope} ${selector}`;
        });

        rule.selector = scopedSelectors.join(', ');
        this.stats.rulesProcessed++;
      }
    };
  }

  // PostCSS Plugin: Update animation property references
  private createAnimationUpdaterPlugin(): Plugin {
    const skinId = this.options.skinId;
    
    return {
      postcssPlugin: 'update-animation-refs',
      Declaration: (decl: Declaration) => {
        if (decl.prop === 'animation' || decl.prop === 'animation-name') {
          // Split animation values and namespace each animation name
          const animationValues = decl.value.split(',').map(value => {
            const trimmed = value.trim();
            
            // Skip built-in animation keywords
            const builtInKeywords = ['none', 'inherit', 'initial', 'unset'];
            if (builtInKeywords.includes(trimmed)) {
              return trimmed;
            }
            
            // Extract animation name (first word)
            const parts = trimmed.split(/\s+/);
            const animationName = parts[0];
            
            // Skip if already namespaced
            if (animationName.startsWith(`${skinId}-`)) {
              return trimmed;
            }
            
            // Namespace the animation name
            const namespacedName = `${skinId}-${animationName}`;
            parts[0] = namespacedName;
            
            return parts.join(' ');
          });
          
          decl.value = animationValues.join(', ');
          this.stats.animationsUpdated++;
        }
      }
    };
  }

  // PostCSS Plugin: Add CSS containment for performance
  private createContainmentPlugin(): Plugin {
    const scope = `[data-skin="${this.options.skinId}"]`;
    
    return {
      postcssPlugin: 'add-containment',
      Once: (root: Root) => {
        // Add containment rule for performance isolation
        const containmentRule = postcss.rule({ 
          selector: scope 
        });
        
        // Add containment properties
        containmentRule.append({
          prop: 'contain',
          value: 'layout style paint'
        });
        
        containmentRule.append({
          prop: 'isolation',
          value: 'isolate'
        });
        
        root.prepend(containmentRule);
      }
    };
  }

  // Create PostCSS plugin for scoping (legacy method - kept for compatibility)
  private createScopingPlugin(stats: any) {
    const skinSelector = `[data-skin="${this.options.skinId}"]`;
    
    return {
      postcssPlugin: 'skin-scoper',
      Root: (root: Root) => {
        this.processCSSRoot(root, skinSelector, stats);
      },
    };
  }

  // Process CSS root
  private processCSSRoot(root: Root, skinSelector: string, stats: any) {
    root.walkRules((rule: Rule) => {
      if (this.shouldScopeRule(rule)) {
        this.scopeRule(rule, skinSelector);
        stats.rulesProcessed++;
      }
    });

    root.walkAtRules((atRule: AtRule) => {
      if (atRule.name === 'keyframes' && this.options.scopeKeyframes) {
        this.scopeKeyframes(atRule);
        stats.keyframesScoped++;
      } else if (atRule.name === 'media') {
        // Process rules inside media queries
        atRule.walkRules((rule: Rule) => {
          if (this.shouldScopeRule(rule)) {
            this.scopeRule(rule, skinSelector);
            stats.rulesProcessed++;
          }
        });
      }
    });

    // Scope CSS custom properties
    root.walkDecls((decl: Declaration) => {
      if (decl.prop.startsWith('--') && this.options.scopeVariables) {
        this.scopeVariable(decl);
        stats.variablesScoped++;
      }
    });
  }

  // Check if rule should be scoped
  private shouldScopeRule(rule: Rule): boolean {
    // Skip rules that are already scoped
    if (rule.selector.includes(`[data-skin="${this.options.skinId}"]`)) {
      return false;
    }

    // Skip global selectors if they should be preserved
    const selectors = rule.selector.split(',').map(s => s.trim());
    const hasOnlyGlobals = selectors.every(selector => 
      this.options.preserveGlobals.some(global => 
        selector === global || selector.startsWith(`${global}:`)
      )
    );

    if (hasOnlyGlobals) {
      return false;
    }

    // Skip :root selector for CSS variables (unless explicitly scoping variables)
    if (rule.selector.includes(':root') && !this.options.scopeVariables) {
      return false;
    }

    return true;
  }

  // Scope a CSS rule
  private scopeRule(rule: Rule, skinSelector: string) {
    const selectors = rule.selector.split(',').map(s => s.trim());
    const scopedSelectors = selectors.map(selector => {
      // Handle different selector types
      if (selector === ':root') {
        return this.options.scopeVariables ? `${skinSelector}` : selector;
      }

      // Skip if selector is in preserve list
      if (this.options.preserveGlobals.some(global => 
        selector === global || selector.startsWith(`${global}:`)
      )) {
        return selector;
      }

      // Handle pseudo-elements and pseudo-classes
      if (selector.startsWith('::') || selector.startsWith(':')) {
        return `${skinSelector}${selector}`;
      }

      // Handle descendant selectors
      if (selector.includes(' ')) {
        return `${skinSelector} ${selector}`;
      }

      // Handle child selectors
      if (selector.includes('>')) {
        const parts = selector.split('>').map(p => p.trim());
        return `${skinSelector} ${parts.join(' > ')}`;
      }

      // Handle adjacent selectors
      if (selector.includes('+')) {
        return `${skinSelector} ${selector}`;
      }

      // Handle sibling selectors
      if (selector.includes('~')) {
        return `${skinSelector} ${selector}`;
      }

      // Handle class and ID selectors
      if (selector.startsWith('.') || selector.startsWith('#')) {
        return `${skinSelector} ${selector}`;
      }

      // Handle element selectors
      return `${skinSelector} ${selector}`;
    });

    rule.selector = scopedSelectors.join(', ');
  }

  // Scope keyframes
  private scopeKeyframes(atRule: AtRule) {
    const originalName = atRule.params;
    const scopedName = `${this.options.skinId}-${originalName}`;
    atRule.params = scopedName;

    // Update references to this keyframe throughout the CSS
    atRule.root()?.walkDecls(decl => {
      if (decl.prop === 'animation' || decl.prop === 'animation-name') {
        if (decl.value.includes(originalName)) {
          decl.value = decl.value.replace(
            new RegExp(`\\b${originalName}\\b`, 'g'),
            scopedName
          );
        }
      }
    });
  }

  // Scope CSS custom properties
  private scopeVariable(decl: Declaration) {
    // CSS variables are naturally scoped to their containing selector
    // If the containing rule gets scoped, the variables are automatically scoped
    // No additional processing needed
  }

  // Generate CSS hash for caching
  private generateHash(css: string): string {
    return crypto
      .createHash('sha256')
      .update(css)
      .digest('hex')
      .substring(0, 12);
  }

  // Validate scoped CSS
  validateScopedCSS(css: string): { isValid: boolean; violations: string[] } {
    const violations: string[] = [];
    
    try {
      const root = postcss.parse(css);
      const skinSelector = `[data-skin="${this.options.skinId}"]`;

      root.walkRules(rule => {
        // Check if rule is properly scoped
        if (!rule.selector.includes(skinSelector) && this.shouldScopeRule(rule)) {
          violations.push(`Unscoped rule: ${rule.selector}`);
        }

        // Check for potential global leakage
        const dangerousSelectors = ['html', 'body', '*'];
        const hasGlobalSelector = dangerousSelectors.some(sel => 
          rule.selector.includes(sel) && !rule.selector.includes(skinSelector)
        );
        
        if (hasGlobalSelector) {
          violations.push(`Potential global leakage: ${rule.selector}`);
        }
      });

      return {
        isValid: violations.length === 0,
        violations,
      };
    } catch (error) {
      violations.push(`CSS parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return {
        isValid: false,
        violations,
      };
    }
  }

  // Extract used selectors for optimization
  extractUsedSelectors(css: string): string[] {
    const selectors: string[] = [];
    
    try {
      const root = postcss.parse(css);
      
      root.walkRules(rule => {
        rule.selector.split(',').forEach(selector => {
          selectors.push(selector.trim());
        });
      });
    } catch (error) {
      console.warn('Failed to extract selectors:', error);
    }
    
    return [...new Set(selectors)]; // Remove duplicates
  }
}

// Utility functions
export async function scopeCSSFile(
  inputPath: string,
  outputPath: string,
  skinId: string,
  options: Partial<ScopingOptions> = {}
): Promise<ProcessingResult> {
  const scoper = new CSSScoper({ skinId, ...options });
  const result = await scoper.processFile(inputPath);
  
  // Write scoped CSS
  await fs.writeFile(outputPath, result.css, 'utf8');
  
  // Write source map if available
  if (result.sourceMap) {
    await fs.writeFile(`${outputPath}.map`, result.sourceMap, 'utf8');
  }
  
  return result;
}

export async function scopeCSSString(
  css: string,
  skinId: string,
  options: Partial<ScopingOptions> = {}
): Promise<ProcessingResult> {
  const scoper = new CSSScoper({ skinId, ...options });
  return scoper.processCSS(css);
}

// Batch process multiple CSS files
export async function batchScopeCSS(
  files: { input: string; output: string }[],
  skinId: string,
  options: Partial<ScopingOptions> = {}
): Promise<ProcessingResult[]> {
  const scoper = new CSSScoper({ skinId, ...options });
  const results: ProcessingResult[] = [];

  for (const { input, output } of files) {
    try {
      const result = await scoper.processFile(input);
      await fs.writeFile(output, result.css, 'utf8');
      
      if (result.sourceMap) {
        await fs.writeFile(`${output}.map`, result.sourceMap, 'utf8');
      }
      
      results.push(result);
    } catch (error) {
      console.error(`Failed to process ${input}:`, error);
    }
  }

  return results;
}

// Check CSS budget compliance
export function checkCSSBudget(
  results: ProcessingResult[],
  budget: { maxSize?: number; maxGzippedSize?: number } = {}
): { compliant: boolean; violations: string[] } {
  const violations: string[] = [];
  let totalSize = 0;
  let totalGzippedSize = 0;

  for (const result of results) {
    totalSize += result.stats.size;
    totalGzippedSize += result.stats.sizeGzipped || 0;
  }

  if (budget.maxSize && totalSize > budget.maxSize) {
    violations.push(
      `CSS size budget exceeded: ${(totalSize / 1024).toFixed(2)}KB > ${(budget.maxSize / 1024).toFixed(2)}KB`
    );
  }

  if (budget.maxGzippedSize && totalGzippedSize > budget.maxGzippedSize) {
    violations.push(
      `CSS gzipped size budget exceeded: ${(totalGzippedSize / 1024).toFixed(2)}KB > ${(budget.maxGzippedSize / 1024).toFixed(2)}KB`
    );
  }

  return {
    compliant: violations.length === 0,
    violations,
  };
}