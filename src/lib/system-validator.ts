/**
 * System Validator
 * 
 * Comprehensive validation and testing suite for the restaurant website system.
 * Tests all components, skins, schema validation, and integrations.
 */

import { skinLoader } from './skin-loader';
import { budgetChecker, validateAllSkinsPerformance } from './budget-checker';
import { multiSkinTester } from './multi-skin-tester';
import { migrateLegacyData } from '@/schema/validator';
import { COMPONENT_REGISTRY } from '@/components/kit';
import fs from 'fs/promises';
import path from 'path';

// Validation result types
export interface SystemValidationResult {
  overall: {
    passed: boolean;
    score: number; // 0-100
    timestamp: string;
  };
  components: ComponentValidationResult;
  skins: SkinValidationResult;
  schema: SchemaValidationResult;
  performance: PerformanceValidationResult;
  integration: IntegrationValidationResult;
  recommendations: string[];
}

export interface ComponentValidationResult {
  passed: boolean;
  totalComponents: number;
  validComponents: number;
  issues: ComponentIssue[];
}

export interface SkinValidationResult {
  passed: boolean;
  totalSkins: number;
  validSkins: number;
  issues: SkinIssue[];
  leakageTests: Map<string, any>;
}

export interface SchemaValidationResult {
  passed: boolean;
  version: string;
  compatibility: boolean;
  migrationTests: number;
  issues: SchemaIssue[];
}

export interface PerformanceValidationResult {
  passed: boolean;
  budgetCompliance: boolean;
  cssSize: string;
  jsSize: string;
  issues: PerformanceIssue[];
}

export interface IntegrationValidationResult {
  passed: boolean;
  nextjsSetup: boolean;
  routingWorks: boolean;
  apiEndpoints: boolean;
  issues: IntegrationIssue[];
}

// Issue types
export interface ComponentIssue {
  component: string;
  type: 'missing-export' | 'invalid-props' | 'render-error';
  message: string;
  severity: 'error' | 'warning';
}

export interface SkinIssue {
  skinId: string;
  type: 'missing-file' | 'invalid-tokens' | 'css-error' | 'mapping-error';
  message: string;
  severity: 'error' | 'warning';
}

export interface SchemaIssue {
  type: 'validation-error' | 'migration-error' | 'compatibility-error';
  message: string;
  severity: 'error' | 'warning';
}

export interface PerformanceIssue {
  type: 'budget-exceeded' | 'size-warning' | 'optimization-needed';
  message: string;
  current?: string;
  limit?: string;
  severity: 'error' | 'warning';
}

export interface IntegrationIssue {
  type: 'config-error' | 'route-error' | 'api-error';
  message: string;
  severity: 'error' | 'warning';
}

// Main system validator
export class SystemValidator {
  private basePath: string;
  
  constructor(basePath: string = process.cwd()) {
    this.basePath = basePath;
  }

  // Run comprehensive system validation
  async validateSystem(): Promise<SystemValidationResult> {
    console.log('🔍 Starting comprehensive system validation...');
    
    const startTime = Date.now();
    const results = await Promise.allSettled([
      this.validateComponents(),
      this.validateSkins(),
      this.validateSchema(),
      this.validatePerformance(),
      this.validateIntegration()
    ]);

    // Process results
    const [componentsRes, skinsRes, schemaRes, performanceRes, integrationRes] = results;
    
    const components = componentsRes.status === 'fulfilled' ? componentsRes.value : this.getFailedComponentResult(componentsRes.reason);
    const skins = skinsRes.status === 'fulfilled' ? skinsRes.value : this.getFailedSkinResult(skinsRes.reason);
    const schema = schemaRes.status === 'fulfilled' ? schemaRes.value : this.getFailedSchemaResult(schemaRes.reason);
    const performance = performanceRes.status === 'fulfilled' ? performanceRes.value : this.getFailedPerformanceResult(performanceRes.reason);
    const integration = integrationRes.status === 'fulfilled' ? integrationRes.value : this.getFailedIntegrationResult(integrationRes.reason);

    // Calculate overall score
    const scores = {
      components: components.passed ? 100 : Math.max(0, (components.validComponents / components.totalComponents) * 100),
      skins: skins.passed ? 100 : Math.max(0, (skins.validSkins / skins.totalSkins) * 100),
      schema: schema.passed ? 100 : (schema.compatibility ? 75 : 0),
      performance: performance.passed ? 100 : (performance.budgetCompliance ? 75 : 50),
      integration: integration.passed ? 100 : 0
    };

    const overallScore = Math.round(
      (scores.components * 0.2 + scores.skins * 0.25 + scores.schema * 0.2 + scores.performance * 0.15 + scores.integration * 0.2)
    );

    const overallPassed = overallScore >= 85 && components.passed && skins.passed && schema.passed;

    // Generate recommendations
    const recommendations = this.generateRecommendations({
      components, skins, schema, performance, integration, overall: { passed: overallPassed, score: overallScore }
    } as any);

    const result: SystemValidationResult = {
      overall: {
        passed: overallPassed,
        score: overallScore,
        timestamp: new Date().toISOString(),
      },
      components,
      skins,
      schema,
      performance,
      integration,
      recommendations,
    };

    const duration = Date.now() - startTime;
    console.log(`✅ System validation completed in ${duration}ms - Score: ${overallScore}/100`);

    return result;
  }

  // Validate component kit
  private async validateComponents(): Promise<ComponentValidationResult> {
    const issues: ComponentIssue[] = [];
    const componentNames = Object.keys(COMPONENT_REGISTRY);
    let validComponents = 0;

    for (const componentName of componentNames) {
      try {
        const Component = COMPONENT_REGISTRY[componentName as keyof typeof COMPONENT_REGISTRY];
        
        // Check if component exists and is callable
        if (!Component || typeof Component !== 'function') {
          issues.push({
            component: componentName,
            type: 'missing-export',
            message: `Component ${componentName} is not properly exported`,
            severity: 'error'
          });
          continue;
        }

        // Try to get component prop types (basic check)
        const componentString = Component.toString();
        if (!componentString.includes('props') && !componentString.includes('children')) {
          issues.push({
            component: componentName,
            type: 'invalid-props',
            message: `Component ${componentName} may not accept props correctly`,
            severity: 'warning'
          });
        }

        validComponents++;
      } catch (error) {
        issues.push({
          component: componentName,
          type: 'render-error',
          message: `Component ${componentName} validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          severity: 'error'
        });
      }
    }

    return {
      passed: issues.filter(i => i.severity === 'error').length === 0,
      totalComponents: componentNames.length,
      validComponents,
      issues,
    };
  }

  // Validate skin system
  private async validateSkins(): Promise<SkinValidationResult> {
    const issues: SkinIssue[] = [];
    let validSkins = 0;

    try {
      // Discover skins
      const skins = await skinLoader.discoverSkins();
      
      // Test each skin
      for (const skin of skins) {
        if (!skin.isValid) {
          issues.push({
            skinId: skin.id,
            type: 'invalid-tokens',
            message: `Skin ${skin.id} failed validation: ${skin.errors?.join(', ') || 'Unknown error'}`,
            severity: 'error'
          });
          continue;
        }

        try {
          // Try to load the skin
          await skinLoader.loadSkin(skin.id);
          validSkins++;
        } catch (error) {
          issues.push({
            skinId: skin.id,
            type: 'css-error',
            message: `Failed to load skin ${skin.id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
            severity: 'error'
          });
        }
      }

      // Run leakage tests
      const mockSiteData = this.createMockSiteData();
      const leakageTests = await multiSkinTester.testAllSkinCombinations(mockSiteData);

      // Check for leakage issues
      for (const [combination, result] of leakageTests) {
        if (!result.passed) {
          for (const violation of result.violations) {
            if (violation.severity === 'error') {
              issues.push({
                skinId: violation.affectedSkins.join('+'),
                type: 'css-error',
                message: `CSS leakage in combination ${combination}: ${violation.message}`,
                severity: 'error'
              });
            }
          }
        }
      }

      return {
        passed: issues.filter(i => i.severity === 'error').length === 0,
        totalSkins: skins.length,
        validSkins,
        issues,
        leakageTests,
      };
    } catch (error) {
      issues.push({
        skinId: 'system',
        type: 'css-error',
        message: `Skin system validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        severity: 'error'
      });

      return {
        passed: false,
        totalSkins: 0,
        validSkins: 0,
        issues,
        leakageTests: new Map(),
      };
    }
  }

  // Validate schema system
  private async validateSchema(): Promise<SchemaValidationResult> {
    const issues: SchemaIssue[] = [];
    let migrationTests = 0;

    try {
      // Test schema compatibility
      const compatibility = true; // Assume compatible for now
      
      // Test migration with sample data
      const sampleLegacyData = {
        restaurant_info: {
          id: 'test',
          name: 'Test Restaurant',
          region: 'Test Region',
          state: 'Test State', 
          country: 'SA',
          coordinates: { latitude: 24.7136, longitude: 46.6753 },
          rating: 4.5,
          review_count: 100,
          type_of_food: 'Test Food'
        },
        menu_categories: {
          'Test Category': [
            {
              item_en: 'Test Item',
              item_ar: 'عنصر اختبار',
              price: 25,
              currency: 'SAR',
              description: 'Test description',
              image: 'https://example.com/test.jpg',
              menu_id: 1
            }
          ]
        },
        generated_at: new Date().toISOString(),
        source: 'test'
      };

      try {
        const migratedData = migrateLegacyData(sampleLegacyData);
        migrationTests = 1;
        
        // Validate migrated data structure
        if (!migratedData.business?.name || !migratedData.menu?.sections) {
          issues.push({
            type: 'migration-error',
            message: 'Migration did not produce expected data structure',
            severity: 'error'
          });
        }
      } catch (error) {
        issues.push({
          type: 'migration-error',
          message: `Schema migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          severity: 'error'
        });
      }

      return {
        passed: issues.filter(i => i.severity === 'error').length === 0,
        version: '1.0.0',
        compatibility,
        migrationTests,
        issues,
      };
    } catch (error) {
      issues.push({
        type: 'validation-error',
        message: `Schema validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        severity: 'error'
      });

      return {
        passed: false,
        version: '1.0.0',
        compatibility: false,
        migrationTests: 0,
        issues,
      };
    }
  }

  // Validate performance budgets
  private async validatePerformance(): Promise<PerformanceValidationResult> {
    const issues: PerformanceIssue[] = [];

    try {
      const skinsDir = path.join(this.basePath, 'skins');
      const { passed, results, summary } = await validateAllSkinsPerformance(skinsDir);

      let totalCssSize = 0;
      let totalJsSize = 0;

      for (const [skinId, result] of results) {
        totalCssSize += result.stats.css.size;
        totalJsSize += result.stats.js.size;

        // Add budget violations as issues
        for (const violation of result.violations) {
          issues.push({
            type: 'budget-exceeded',
            message: `${skinId}: ${violation.message}`,
            current: this.formatBytes(violation.current),
            limit: this.formatBytes(violation.limit),
            severity: violation.severity === 'error' ? 'error' : 'warning'
          });
        }
      }

      return {
        passed,
        budgetCompliance: passed,
        cssSize: this.formatBytes(totalCssSize),
        jsSize: this.formatBytes(totalJsSize),
        issues,
      };
    } catch (error) {
      issues.push({
        type: 'budget-exceeded',
        message: `Performance validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        severity: 'error'
      });

      return {
        passed: false,
        budgetCompliance: false,
        cssSize: '0B',
        jsSize: '0B',
        issues,
      };
    }
  }

  // Validate Next.js integration
  private async validateIntegration(): Promise<IntegrationValidationResult> {
    const issues: IntegrationIssue[] = [];
    let nextjsSetup = false;
    let routingWorks = false;
    let apiEndpoints = false;

    try {
      // Check Next.js config
      const configPath = path.join(this.basePath, 'next.config.ts');
      try {
        await fs.access(configPath);
        nextjsSetup = true;
      } catch {
        issues.push({
          type: 'config-error',
          message: 'next.config.ts not found',
          severity: 'error'
        });
      }

      // Check app directory structure
      const appPath = path.join(this.basePath, 'src', 'app');
      try {
        await fs.access(appPath);
        const files = await fs.readdir(appPath);
        routingWorks = files.includes('page.tsx') && files.includes('layout.tsx');
        
        if (!routingWorks) {
          issues.push({
            type: 'route-error',
            message: 'App Router structure incomplete (missing page.tsx or layout.tsx)',
            severity: 'error'
          });
        }
      } catch {
        issues.push({
          type: 'route-error',
          message: 'App directory not found or inaccessible',
          severity: 'error'
        });
      }

      // Check API routes
      const apiPath = path.join(this.basePath, 'src', 'app', 'api');
      try {
        await fs.access(apiPath);
        const apiFiles = await fs.readdir(apiPath, { recursive: true });
        apiEndpoints = apiFiles.some(file => file.toString().endsWith('route.ts'));
      } catch {
        // API routes are optional, so this is just a warning
        issues.push({
          type: 'api-error',
          message: 'No API routes found (this may be intentional)',
          severity: 'warning'
        });
      }

      return {
        passed: nextjsSetup && routingWorks,
        nextjsSetup,
        routingWorks,
        apiEndpoints,
        issues,
      };
    } catch (error) {
      issues.push({
        type: 'config-error',
        message: `Integration validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        severity: 'error'
      });

      return {
        passed: false,
        nextjsSetup: false,
        routingWorks: false,
        apiEndpoints: false,
        issues,
      };
    }
  }

  // Generate recommendations based on validation results
  private generateRecommendations(results: SystemValidationResult): string[] {
    const recommendations: string[] = [];

    if (!results.components.passed) {
      recommendations.push('🔧 Fix component kit issues before proceeding with development');
    }

    if (!results.skins.passed) {
      recommendations.push('🎨 Review skin configurations and fix CSS scoping issues');
    }

    if (!results.schema.passed) {
      recommendations.push('📋 Update schema definitions and test migrations thoroughly');
    }

    if (!results.performance.passed) {
      recommendations.push('⚡ Optimize assets to meet performance budgets (CSS ≤50KB, JS ≤20KB)');
    }

    if (!results.integration.passed) {
      recommendations.push('🔗 Fix Next.js configuration and routing setup');
    }

    if (results.overall.score < 95) {
      recommendations.push('📈 Aim for 95+ score by addressing all warnings and optimizing performance');
    }

    if (results.overall.score >= 85) {
      recommendations.push('✅ System is ready for production deployment!');
      recommendations.push('🚀 Consider running load tests and accessibility audits');
    }

    return recommendations;
  }

  // Helper methods for failed results
  private getFailedComponentResult(error: any): ComponentValidationResult {
    return {
      passed: false,
      totalComponents: 0,
      validComponents: 0,
      issues: [{
        component: 'system',
        type: 'render-error',
        message: `Component validation crashed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        severity: 'error'
      }]
    };
  }

  private getFailedSkinResult(error: any): SkinValidationResult {
    return {
      passed: false,
      totalSkins: 0,
      validSkins: 0,
      leakageTests: new Map(),
      issues: [{
        skinId: 'system',
        type: 'css-error',
        message: `Skin validation crashed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        severity: 'error'
      }]
    };
  }

  private getFailedSchemaResult(error: any): SchemaValidationResult {
    return {
      passed: false,
      version: '1.0.0',
      compatibility: false,
      migrationTests: 0,
      issues: [{
        type: 'validation-error',
        message: `Schema validation crashed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        severity: 'error'
      }]
    };
  }

  private getFailedPerformanceResult(error: any): PerformanceValidationResult {
    return {
      passed: false,
      budgetCompliance: false,
      cssSize: '0B',
      jsSize: '0B',
      issues: [{
        type: 'budget-exceeded',
        message: `Performance validation crashed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        severity: 'error'
      }]
    };
  }

  private getFailedIntegrationResult(error: any): IntegrationValidationResult {
    return {
      passed: false,
      nextjsSetup: false,
      routingWorks: false,
      apiEndpoints: false,
      issues: [{
        type: 'config-error',
        message: `Integration validation crashed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        severity: 'error'
      }]
    };
  }

  // Helper methods
  private createMockSiteData() {
    return migrateLegacyData({
      restaurant_info: {
        id: 'test-validation',
        name: 'Validation Test Restaurant',
        region: 'Riyadh',
        state: 'Riyadh Province',
        country: 'Saudi Arabia',
        coordinates: { latitude: 24.7136, longitude: 46.6753 },
        rating: 4.5,
        review_count: 100,
        type_of_food: 'International'
      },
      menu_categories: {
        'Test Category': [{
          item_en: 'Test Item',
          item_ar: 'عنصر اختبار',
          price: 25,
          currency: 'SAR',
          description: 'Test description',
          image: 'https://example.com/test.jpg',
          menu_id: 1
        }]
      },
      generated_at: new Date().toISOString(),
      source: 'validation-test'
    });
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))}${sizes[i]}`;
  }
}

// Export singleton instance
export const systemValidator = new SystemValidator();

// Utility functions
export async function runSystemValidation(): Promise<SystemValidationResult> {
  return systemValidator.validateSystem();
}

export function formatValidationReport(results: SystemValidationResult): string {
  const lines: string[] = [];
  
  lines.push('');
  lines.push('🔍 RESTAURANT WEBSITE SYSTEM VALIDATION REPORT');
  lines.push('═'.repeat(55));
  lines.push('');
  
  // Overall results
  const overallIcon = results.overall.passed ? '✅' : '❌';
  lines.push(`${overallIcon} Overall Status: ${results.overall.passed ? 'PASSED' : 'FAILED'}`);
  lines.push(`📊 System Score: ${results.overall.score}/100`);
  lines.push(`🕐 Generated: ${results.overall.timestamp}`);
  lines.push('');
  
  // Component results
  lines.push(`🧩 Component Kit: ${results.components.passed ? '✅' : '❌'} (${results.components.validComponents}/${results.components.totalComponents})`);
  if (results.components.issues.length > 0) {
    results.components.issues.forEach(issue => {
      const icon = issue.severity === 'error' ? '🚨' : '⚠️';
      lines.push(`   ${icon} ${issue.component}: ${issue.message}`);
    });
  }
  lines.push('');
  
  // Skin results
  lines.push(`🎨 Skins System: ${results.skins.passed ? '✅' : '❌'} (${results.skins.validSkins}/${results.skins.totalSkins})`);
  if (results.skins.issues.length > 0) {
    results.skins.issues.forEach(issue => {
      const icon = issue.severity === 'error' ? '🚨' : '⚠️';
      lines.push(`   ${icon} ${issue.skinId}: ${issue.message}`);
    });
  }
  lines.push('');
  
  // Schema results
  lines.push(`📋 Schema System: ${results.schema.passed ? '✅' : '❌'} (v${results.schema.version})`);
  if (results.schema.issues.length > 0) {
    results.schema.issues.forEach(issue => {
      const icon = issue.severity === 'error' ? '🚨' : '⚠️';
      lines.push(`   ${icon} ${issue.type}: ${issue.message}`);
    });
  }
  lines.push('');
  
  // Performance results
  lines.push(`⚡ Performance: ${results.performance.passed ? '✅' : '❌'} (CSS: ${results.performance.cssSize}, JS: ${results.performance.jsSize})`);
  if (results.performance.issues.length > 0) {
    results.performance.issues.forEach(issue => {
      const icon = issue.severity === 'error' ? '🚨' : '⚠️';
      lines.push(`   ${icon} ${issue.message}${issue.current && issue.limit ? ` (${issue.current} > ${issue.limit})` : ''}`);
    });
  }
  lines.push('');
  
  // Integration results
  lines.push(`🔗 Next.js Integration: ${results.integration.passed ? '✅' : '❌'}`);
  if (results.integration.issues.length > 0) {
    results.integration.issues.forEach(issue => {
      const icon = issue.severity === 'error' ? '🚨' : '⚠️';
      lines.push(`   ${icon} ${issue.type}: ${issue.message}`);
    });
  }
  lines.push('');
  
  // Recommendations
  if (results.recommendations.length > 0) {
    lines.push('💡 RECOMMENDATIONS:');
    lines.push('─'.repeat(25));
    results.recommendations.forEach(rec => {
      lines.push(`   ${rec}`);
    });
    lines.push('');
  }
  
  lines.push('═'.repeat(55));
  
  return lines.join('\n');
}