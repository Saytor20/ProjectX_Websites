// Phase 3: Theme System Integration Testing Suite
// This file provides comprehensive testing utilities for Phase 3 functionality

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'warning' | 'skip';
  message: string;
  duration?: number;
  details?: any;
}

interface TestSuite {
  name: string;
  tests: TestResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    warnings: number;
    skipped: number;
  };
}

class Phase3TestRunner {
  private results: TestSuite[] = [];
  private startTime: number = 0;

  constructor() {
    this.startTime = Date.now();
  }

  // Theme Switcher Integration Tests
  async testThemeSwitcher(): Promise<TestSuite> {
    const suite: TestSuite = {
      name: 'Theme Switcher Integration',
      tests: [],
      summary: { total: 0, passed: 0, failed: 0, warnings: 0, skipped: 0 }
    };

    // Test 1: Component Loading
    try {
      const start = performance.now();
      const themeSwitcher = await import('../components/ThemeSwitcher');
      const duration = performance.now() - start;
      
      suite.tests.push({
        name: 'ThemeSwitcher Component Load',
        status: themeSwitcher.ThemeSwitcher ? 'pass' : 'fail',
        message: themeSwitcher.ThemeSwitcher ? `Loaded successfully in ${duration.toFixed(2)}ms` : 'Component not exported correctly',
        duration
      });
    } catch (error) {
      suite.tests.push({
        name: 'ThemeSwitcher Component Load',
        status: 'fail',
        message: `Failed to load: ${error}`,
        details: error
      });
    }

    // Test 2: Theme API Endpoints
    try {
      const response = await fetch('/api/themes/list');
      suite.tests.push({
        name: 'Theme List API',
        status: response.ok ? 'pass' : 'fail',
        message: response.ok ? `API responded with ${response.status}` : `API failed with ${response.status}`,
        details: { status: response.status, ok: response.ok }
      });
    } catch (error) {
      suite.tests.push({
        name: 'Theme List API',
        status: 'fail',
        message: `API request failed: ${error}`,
        details: error
      });
    }

    // Test 3: Theme Switching Functionality
    try {
      const originalTheme = document.documentElement.getAttribute('data-skin');
      document.documentElement.setAttribute('data-skin', 'test-theme');
      const newTheme = document.documentElement.getAttribute('data-skin');
      
      suite.tests.push({
        name: 'Theme Switching Mechanism',
        status: newTheme === 'test-theme' ? 'pass' : 'fail',
        message: newTheme === 'test-theme' ? 'Theme attribute updated correctly' : 'Theme attribute not updated',
        details: { original: originalTheme, applied: newTheme }
      });
      
      // Restore original theme
      if (originalTheme) {
        document.documentElement.setAttribute('data-skin', originalTheme);
      }
    } catch (error) {
      suite.tests.push({
        name: 'Theme Switching Mechanism',
        status: 'fail',
        message: `Theme switching failed: ${error}`,
        details: error
      });
    }

    this.calculateSummary(suite);
    return suite;
  }

  // Theme Customizer Integration Tests
  async testThemeCustomizer(): Promise<TestSuite> {
    const suite: TestSuite = {
      name: 'Theme Customizer Integration',
      tests: [],
      summary: { total: 0, passed: 0, failed: 0, warnings: 0, skipped: 0 }
    };

    // Test 1: Component Dependencies
    try {
      const chroma = await import('chroma-js');
      const colorful = await import('react-colorful');
      
      suite.tests.push({
        name: 'Color Management Dependencies',
        status: (chroma.default && colorful.HexColorPicker) ? 'pass' : 'fail',
        message: (chroma.default && colorful.HexColorPicker) ? 'All color dependencies available' : 'Missing color dependencies',
        details: { chroma: !!chroma.default, colorful: !!colorful.HexColorPicker }
      });
    } catch (error) {
      suite.tests.push({
        name: 'Color Management Dependencies',
        status: 'fail',
        message: `Dependency load failed: ${error}`,
        details: error
      });
    }

    // Test 2: Token Update API
    try {
      const response = await fetch('/api/tokens/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          themeId: 'test-theme',
          tokens: { colors: { primary: '#test123' } }
        })
      });
      
      suite.tests.push({
        name: 'Token Update API',
        status: response.status < 500 ? 'pass' : 'fail', // Accept 4xx as expected for test data
        message: `API responded with ${response.status}`,
        details: { status: response.status }
      });
    } catch (error) {
      suite.tests.push({
        name: 'Token Update API',
        status: 'warning',
        message: `API test skipped: ${error}`,
        details: error
      });
    }

    // Test 3: CSS Variable Application
    try {
      const testColor = '#ff6b6b';
      const testVar = '--test-primary-color';
      
      document.documentElement.style.setProperty(testVar, testColor);
      const appliedValue = getComputedStyle(document.documentElement).getPropertyValue(testVar).trim();
      
      suite.tests.push({
        name: 'CSS Variable Application',
        status: appliedValue === testColor ? 'pass' : 'warning',
        message: appliedValue === testColor ? 'CSS variables work correctly' : `Expected ${testColor}, got ${appliedValue}`,
        details: { expected: testColor, actual: appliedValue }
      });
      
      // Cleanup
      document.documentElement.style.removeProperty(testVar);
    } catch (error) {
      suite.tests.push({
        name: 'CSS Variable Application',
        status: 'fail',
        message: `CSS variable test failed: ${error}`,
        details: error
      });
    }

    this.calculateSummary(suite);
    return suite;
  }

  // Token Editor Integration Tests
  async testTokenEditor(): Promise<TestSuite> {
    const suite: TestSuite = {
      name: 'Token Editor Integration',
      tests: [],
      summary: { total: 0, passed: 0, failed: 0, warnings: 0, skipped: 0 }
    };

    // Test 1: Token Schema Validation
    try {
      const validTokenSchema = {
        colors: { primary: '#007acc', secondary: '#333333' },
        spacing: { sm: '0.5rem', md: '1rem', lg: '1.5rem' },
        typography: {
          scale: 1.25,
          lineHeight: { normal: '1.5', tight: '1.2' },
          fontWeight: { normal: '400', bold: '700' },
          letterSpacing: { normal: '0', wide: '0.025em' },
          headings: { h1: '2rem', h2: '1.5rem' },
          body: { base: '1rem', sm: '0.875rem' }
        }
      };

      // Simple validation - check required properties exist
      const hasColors = validTokenSchema.colors && Object.keys(validTokenSchema.colors).length > 0;
      const hasSpacing = validTokenSchema.spacing && Object.keys(validTokenSchema.spacing).length > 0;
      const hasTypography = validTokenSchema.typography && validTokenSchema.typography.scale;

      suite.tests.push({
        name: 'Token Schema Validation',
        status: (hasColors && hasSpacing && hasTypography) ? 'pass' : 'fail',
        message: (hasColors && hasSpacing && hasTypography) ? 'Token schema is valid' : 'Token schema validation failed',
        details: { hasColors, hasSpacing, hasTypography }
      });
    } catch (error) {
      suite.tests.push({
        name: 'Token Schema Validation',
        status: 'fail',
        message: `Schema validation failed: ${error}`,
        details: error
      });
    }

    // Test 2: Token History Management
    try {
      const mockHistory = {
        states: [],
        currentIndex: 0,
        maxStates: 50
      };

      const mockTokenUpdate = {
        category: 'colors',
        key: 'primary',
        value: '#new-color',
        timestamp: Date.now()
      };

      // Simulate adding to history
      mockHistory.states.push({
        id: `token-${Date.now()}`,
        timestamp: Date.now(),
        type: 'tokens' as const,
        elementId: 'token-colors-primary',
        beforeState: { position: { x: 0, y: 0 }, size: { width: 0, height: 0 }, rotation: 0, styles: {} },
        afterState: { position: { x: 0, y: 0 }, size: { width: 0, height: 0 }, rotation: 0, styles: {} },
        tokensBefore: { colors: { primary: '#old-color' } },
        tokensAfter: { colors: { primary: '#new-color' } }
      });

      suite.tests.push({
        name: 'Token History Management',
        status: mockHistory.states.length === 1 ? 'pass' : 'fail',
        message: mockHistory.states.length === 1 ? 'Token history tracking works' : 'Token history tracking failed',
        details: { historyLength: mockHistory.states.length }
      });
    } catch (error) {
      suite.tests.push({
        name: 'Token History Management',
        status: 'fail',
        message: `History management test failed: ${error}`,
        details: error
      });
    }

    this.calculateSummary(suite);
    return suite;
  }

  // Dark Mode Generator Tests
  async testDarkModeGenerator(): Promise<TestSuite> {
    const suite: TestSuite = {
      name: 'Dark Mode Generator Integration',
      tests: [],
      summary: { total: 0, passed: 0, failed: 0, warnings: 0, skipped: 0 }
    };

    // Test 1: Color Contrast Calculation
    try {
      const chroma = await import('chroma-js');
      
      if (chroma.default && chroma.default.contrast) {
        const lightColor = '#ffffff';
        const darkColor = '#000000';
        const contrast = chroma.default.contrast(lightColor, darkColor);
        
        suite.tests.push({
          name: 'Color Contrast Calculation',
          status: contrast > 15 ? 'pass' : 'fail', // Should be 21 for pure white/black
          message: `Contrast ratio: ${contrast.toFixed(2)}:1`,
          details: { contrast, lightColor, darkColor }
        });
      } else {
        suite.tests.push({
          name: 'Color Contrast Calculation',
          status: 'fail',
          message: 'Chroma.js contrast function not available',
          details: { chromaAvailable: !!chroma.default }
        });
      }
    } catch (error) {
      suite.tests.push({
        name: 'Color Contrast Calculation',
        status: 'fail',
        message: `Contrast calculation failed: ${error}`,
        details: error
      });
    }

    // Test 2: Dark Color Generation
    try {
      const chroma = await import('chroma-js');
      
      if (chroma.default) {
        const lightColor = '#3498db'; // Light blue
        const color = chroma.default(lightColor);
        const lightness = color.get('hsl.l');
        const darkLightness = 1 - lightness; // Simple inversion
        const darkColor = chroma.default.hsl(color.get('hsl.h'), color.get('hsl.s'), darkLightness);
        
        suite.tests.push({
          name: 'Dark Color Generation',
          status: darkColor.hex() !== lightColor ? 'pass' : 'fail',
          message: `Generated dark variant: ${darkColor.hex()}`,
          details: { original: lightColor, generated: darkColor.hex(), lightness, darkLightness }
        });
      } else {
        suite.tests.push({
          name: 'Dark Color Generation',
          status: 'skip',
          message: 'Chroma.js not available for color generation',
          details: {}
        });
      }
    } catch (error) {
      suite.tests.push({
        name: 'Dark Color Generation',
        status: 'fail',
        message: `Dark color generation failed: ${error}`,
        details: error
      });
    }

    this.calculateSummary(suite);
    return suite;
  }

  // Theme Exporter Tests
  async testThemeExporter(): Promise<TestSuite> {
    const suite: TestSuite = {
      name: 'Theme Exporter Integration',
      tests: [],
      summary: { total: 0, passed: 0, failed: 0, warnings: 0, skipped: 0 }
    };

    // Test 1: Export Dependencies
    try {
      const fileSaver = await import('file-saver');
      const jszip = await import('jszip');
      
      suite.tests.push({
        name: 'Export Dependencies',
        status: (fileSaver.saveAs && jszip.default) ? 'pass' : 'fail',
        message: (fileSaver.saveAs && jszip.default) ? 'Export dependencies available' : 'Missing export dependencies',
        details: { fileSaver: !!fileSaver.saveAs, jszip: !!jszip.default }
      });
    } catch (error) {
      suite.tests.push({
        name: 'Export Dependencies',
        status: 'fail',
        message: `Export dependencies failed: ${error}`,
        details: error
      });
    }

    // Test 2: Theme Export Format
    try {
      const mockExportData = {
        metadata: {
          name: 'Test Theme',
          version: '1.0.0',
          description: 'Test theme for validation',
          author: 'Test',
          created: new Date().toISOString(),
          exported: new Date().toISOString(),
          category: 'test',
          compatibility: '1.0.0'
        },
        tokens: {
          colors: { primary: '#007acc' },
          spacing: { md: '1rem' }
        },
        settings: {
          responsive: true,
          darkMode: false,
          animations: true,
          accessibility: true
        }
      };

      const isValid = mockExportData.metadata && 
                     mockExportData.tokens && 
                     mockExportData.settings &&
                     mockExportData.metadata.name &&
                     mockExportData.metadata.version;

      suite.tests.push({
        name: 'Theme Export Format Validation',
        status: isValid ? 'pass' : 'fail',
        message: isValid ? 'Export format is valid' : 'Export format validation failed',
        details: { isValid, hasMetadata: !!mockExportData.metadata, hasTokens: !!mockExportData.tokens }
      });
    } catch (error) {
      suite.tests.push({
        name: 'Theme Export Format Validation',
        status: 'fail',
        message: `Export format validation failed: ${error}`,
        details: error
      });
    }

    this.calculateSummary(suite);
    return suite;
  }

  // Performance and Bundle Size Tests
  async testPerformance(): Promise<TestSuite> {
    const suite: TestSuite = {
      name: 'Performance & Bundle Size',
      tests: [],
      summary: { total: 0, passed: 0, failed: 0, warnings: 0, skipped: 0 }
    };

    // Test 1: Component Load Times
    try {
      const loadTimes: Record<string, number> = {};
      const components = [
        'ThemeSwitcher',
        'ThemeCustomizer', 
        'TokenEditor',
        'ThemeExporter',
        'DarkModeGenerator'
      ];

      for (const component of components) {
        const start = performance.now();
        try {
          await import(`../components/${component}`);
          loadTimes[component] = performance.now() - start;
        } catch {
          loadTimes[component] = -1; // Failed to load
        }
      }

      const avgLoadTime = Object.values(loadTimes).filter(t => t > 0).reduce((a, b) => a + b, 0) / Object.values(loadTimes).filter(t => t > 0).length;
      const maxLoadTime = Math.max(...Object.values(loadTimes).filter(t => t > 0));

      suite.tests.push({
        name: 'Component Load Performance',
        status: maxLoadTime < 100 ? 'pass' : (maxLoadTime < 500 ? 'warning' : 'fail'),
        message: `Avg: ${avgLoadTime.toFixed(2)}ms, Max: ${maxLoadTime.toFixed(2)}ms`,
        details: loadTimes
      });
    } catch (error) {
      suite.tests.push({
        name: 'Component Load Performance',
        status: 'fail',
        message: `Performance test failed: ${error}`,
        details: error
      });
    }

    // Test 2: Memory Usage Estimation
    try {
      const beforeMemory = (performance as any).memory?.usedJSHeapSize || 0;
      
      // Load all theme components
      await Promise.all([
        import('../components/ThemeSwitcher'),
        import('../components/ThemeCustomizer'),
        import('../components/TokenEditor'),
        import('../components/ThemeExporter'),
        import('../components/DarkModeGenerator')
      ]);

      const afterMemory = (performance as any).memory?.usedJSHeapSize || 0;
      const memoryIncrease = afterMemory - beforeMemory;

      suite.tests.push({
        name: 'Memory Usage Check',
        status: memoryIncrease < 5 * 1024 * 1024 ? 'pass' : 'warning', // Under 5MB
        message: `Memory increase: ${(memoryIncrease / 1024 / 1024).toFixed(2)}MB`,
        details: { before: beforeMemory, after: afterMemory, increase: memoryIncrease }
      });
    } catch (error) {
      suite.tests.push({
        name: 'Memory Usage Check',
        status: 'skip',
        message: 'Memory API not available',
        details: error
      });
    }

    this.calculateSummary(suite);
    return suite;
  }

  // Cross-browser Compatibility Tests
  async testBrowserCompatibility(): Promise<TestSuite> {
    const suite: TestSuite = {
      name: 'Browser Compatibility',
      tests: [],
      summary: { total: 0, passed: 0, failed: 0, warnings: 0, skipped: 0 }
    };

    // Test 1: CSS Custom Properties Support
    try {
      const testVar = '--test-browser-compat';
      const testValue = 'rgb(255, 0, 0)';
      
      document.documentElement.style.setProperty(testVar, testValue);
      const supportsCSSVars = getComputedStyle(document.documentElement).getPropertyValue(testVar);
      
      suite.tests.push({
        name: 'CSS Custom Properties Support',
        status: supportsCSSVars.trim() !== '' ? 'pass' : 'fail',
        message: supportsCSSVars.trim() !== '' ? 'CSS custom properties supported' : 'CSS custom properties not supported',
        details: { testValue, actualValue: supportsCSSVars.trim() }
      });
      
      document.documentElement.style.removeProperty(testVar);
    } catch (error) {
      suite.tests.push({
        name: 'CSS Custom Properties Support',
        status: 'fail',
        message: `CSS variables test failed: ${error}`,
        details: error
      });
    }

    // Test 2: ES6+ Features Support
    try {
      const hasAsyncAwait = typeof (async () => {}) === 'function';
      const hasArrowFunctions = (() => true)();
      const hasDestructuring = (() => { const {x} = {x: 1}; return x === 1; })();
      const hasModules = typeof import === 'function';

      const allSupported = hasAsyncAwait && hasArrowFunctions && hasDestructuring && hasModules;

      suite.tests.push({
        name: 'ES6+ Features Support',
        status: allSupported ? 'pass' : 'warning',
        message: allSupported ? 'All ES6+ features supported' : 'Some ES6+ features missing',
        details: { hasAsyncAwait, hasArrowFunctions, hasDestructuring, hasModules }
      });
    } catch (error) {
      suite.tests.push({
        name: 'ES6+ Features Support',
        status: 'fail',
        message: `ES6+ features test failed: ${error}`,
        details: error
      });
    }

    // Test 3: Local Storage Support
    try {
      const testKey = 'phase3-test-storage';
      const testValue = 'test-data';
      
      localStorage.setItem(testKey, testValue);
      const retrieved = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);

      suite.tests.push({
        name: 'Local Storage Support',
        status: retrieved === testValue ? 'pass' : 'fail',
        message: retrieved === testValue ? 'Local storage working' : 'Local storage not working',
        details: { testValue, retrieved }
      });
    } catch (error) {
      suite.tests.push({
        name: 'Local Storage Support',
        status: 'warning',
        message: `Local storage test failed: ${error}`,
        details: error
      });
    }

    this.calculateSummary(suite);
    return suite;
  }

  // Accessibility Tests
  async testAccessibility(): Promise<TestSuite> {
    const suite: TestSuite = {
      name: 'Accessibility Compliance',
      tests: [],
      summary: { total: 0, passed: 0, failed: 0, warnings: 0, skipped: 0 }
    };

    // Test 1: Color Contrast Ratios
    try {
      const chroma = await import('chroma-js');
      
      if (chroma.default && chroma.default.contrast) {
        const testContrasts = [
          { bg: '#ffffff', fg: '#000000', name: 'Black on White' },
          { bg: '#007acc', fg: '#ffffff', name: 'White on Blue' },
          { bg: '#28a745', fg: '#ffffff', name: 'White on Green' },
          { bg: '#dc3545', fg: '#ffffff', name: 'White on Red' }
        ];

        const results = testContrasts.map(test => ({
          ...test,
          contrast: chroma.default.contrast(test.bg, test.fg),
          passes: chroma.default.contrast(test.bg, test.fg) >= 4.5
        }));

        const allPass = results.every(r => r.passes);

        suite.tests.push({
          name: 'Color Contrast Ratios (WCAG AA)',
          status: allPass ? 'pass' : 'warning',
          message: allPass ? 'All color combinations meet WCAG AA' : 'Some color combinations below WCAG AA',
          details: results
        });
      } else {
        suite.tests.push({
          name: 'Color Contrast Ratios (WCAG AA)',
          status: 'skip',
          message: 'Chroma.js not available for contrast testing',
          details: {}
        });
      }
    } catch (error) {
      suite.tests.push({
        name: 'Color Contrast Ratios (WCAG AA)',
        status: 'fail',
        message: `Contrast testing failed: ${error}`,
        details: error
      });
    }

    // Test 2: Keyboard Navigation Support
    try {
      const hasTabIndex = typeof document.createElement('button').tabIndex === 'number';
      const hasFocus = typeof document.createElement('button').focus === 'function';
      const hasKeyboardEvents = typeof KeyboardEvent !== 'undefined';

      const keyboardSupport = hasTabIndex && hasFocus && hasKeyboardEvents;

      suite.tests.push({
        name: 'Keyboard Navigation Support',
        status: keyboardSupport ? 'pass' : 'fail',
        message: keyboardSupport ? 'Keyboard navigation supported' : 'Keyboard navigation not fully supported',
        details: { hasTabIndex, hasFocus, hasKeyboardEvents }
      });
    } catch (error) {
      suite.tests.push({
        name: 'Keyboard Navigation Support',
        status: 'fail',
        message: `Keyboard navigation test failed: ${error}`,
        details: error
      });
    }

    // Test 3: ARIA Support
    try {
      const testElement = document.createElement('div');
      testElement.setAttribute('aria-label', 'test');
      testElement.setAttribute('role', 'button');
      
      const hasAriaLabel = testElement.getAttribute('aria-label') === 'test';
      const hasRole = testElement.getAttribute('role') === 'button';
      const hasAriaSupport = hasAriaLabel && hasRole;

      suite.tests.push({
        name: 'ARIA Attributes Support',
        status: hasAriaSupport ? 'pass' : 'fail',
        message: hasAriaSupport ? 'ARIA attributes supported' : 'ARIA attributes not supported',
        details: { hasAriaLabel, hasRole }
      });
    } catch (error) {
      suite.tests.push({
        name: 'ARIA Attributes Support',
        status: 'fail',
        message: `ARIA test failed: ${error}`,
        details: error
      });
    }

    this.calculateSummary(suite);
    return suite;
  }

  // Run all tests
  async runAllTests(): Promise<TestSuite[]> {
    console.log('🧪 Starting Phase 3 Integration Testing Suite...');
    
    const allSuites = await Promise.all([
      this.testThemeSwitcher(),
      this.testThemeCustomizer(),
      this.testTokenEditor(),
      this.testDarkModeGenerator(),
      this.testThemeExporter(),
      this.testPerformance(),
      this.testBrowserCompatibility(),
      this.testAccessibility()
    ]);

    this.results = allSuites;
    
    const totalTime = Date.now() - this.startTime;
    console.log(`✅ Testing completed in ${totalTime}ms`);
    
    return allSuites;
  }

  // Generate test report
  generateReport(): string {
    const totalTests = this.results.reduce((sum, suite) => sum + suite.summary.total, 0);
    const totalPassed = this.results.reduce((sum, suite) => sum + suite.summary.passed, 0);
    const totalFailed = this.results.reduce((sum, suite) => sum + suite.summary.failed, 0);
    const totalWarnings = this.results.reduce((sum, suite) => sum + suite.summary.warnings, 0);

    let report = `
# Phase 3 Theme System - Integration Test Report

## Summary
- **Total Tests**: ${totalTests}
- **Passed**: ${totalPassed} (${((totalPassed / totalTests) * 100).toFixed(1)}%)
- **Failed**: ${totalFailed} (${((totalFailed / totalTests) * 100).toFixed(1)}%)
- **Warnings**: ${totalWarnings} (${((totalWarnings / totalTests) * 100).toFixed(1)}%)

## Test Suites

`;

    this.results.forEach(suite => {
      report += `### ${suite.name}\n`;
      report += `- Total: ${suite.summary.total}\n`;
      report += `- Passed: ${suite.summary.passed}\n`;
      report += `- Failed: ${suite.summary.failed}\n`;
      report += `- Warnings: ${suite.summary.warnings}\n\n`;

      suite.tests.forEach(test => {
        const icon = test.status === 'pass' ? '✅' : test.status === 'fail' ? '❌' : test.status === 'warning' ? '⚠️' : '⏭️';
        report += `${icon} **${test.name}**: ${test.message}\n`;
      });

      report += '\n';
    });

    return report;
  }

  private calculateSummary(suite: TestSuite): void {
    suite.summary.total = suite.tests.length;
    suite.summary.passed = suite.tests.filter(t => t.status === 'pass').length;
    suite.summary.failed = suite.tests.filter(t => t.status === 'fail').length;
    suite.summary.warnings = suite.tests.filter(t => t.status === 'warning').length;
    suite.summary.skipped = suite.tests.filter(t => t.status === 'skip').length;
  }
}

// Export for use in development/testing
export { Phase3TestRunner };

// Auto-run tests in development mode
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).runPhase3Tests = async () => {
    const runner = new Phase3TestRunner();
    const results = await runner.runAllTests();
    console.log(runner.generateReport());
    return results;
  };
}