/**
 * Content Security Policy Enforcer
 * 
 * Validates and enforces CSP compliance for templates and builds.
 * Ensures no inline scripts or unsafe practices.
 */

export interface CSPViolation {
  type: 'inline-script' | 'inline-style' | 'unsafe-eval' | 'external-source' | 'event-handler';
  element?: string;
  content?: string;
  line?: number;
  severity: 'error' | 'warning';
  message: string;
}

export interface CSPValidationResult {
  passed: boolean;
  violations: CSPViolation[];
  recommendations: string[];
}

export class CSPEnforcer {
  private readonly allowedImageSources = new Set([
    'images.unsplash.com',
    'www.unsplash.com'
  ]);

  private readonly allowedFontSources = new Set([
    'fonts.googleapis.com',
    'fonts.gstatic.com'
  ]);

  private readonly allowedScriptSources = new Set([
    'cdn.jsdelivr.net'
  ]);

  private readonly productionCSP = {
    'default-src': "'self'",
    'script-src': "'self' https://cdn.jsdelivr.net",
    'style-src': "'self' https://fonts.googleapis.com",
    'img-src': "'self' https://images.unsplash.com data:",
    'font-src': "'self' https://fonts.gstatic.com",
    'connect-src': "'self'",
    'frame-src': "'none'",
    'object-src': "'none'",
    'base-uri': "'self'",
    'form-action': "'self'",
    'upgrade-insecure-requests': ""
  };

  /**
   * Validates HTML content against CSP requirements
   */
  validateHTML(htmlContent: string, filename?: string): CSPValidationResult {
    const violations: CSPViolation[] = [];
    const lines = htmlContent.split('\n');

    lines.forEach((line, index) => {
      const lineNumber = index + 1;

      // Check for inline scripts
      if (this.hasInlineScript(line)) {
        violations.push({
          type: 'inline-script',
          content: line.trim(),
          line: lineNumber,
          severity: 'error',
          message: 'Inline scripts are not allowed in production'
        });
      }

      // Check for inline event handlers
      const eventHandler = this.findEventHandler(line);
      if (eventHandler) {
        violations.push({
          type: 'event-handler',
          element: eventHandler.element,
          content: eventHandler.handler,
          line: lineNumber,
          severity: 'error',
          message: `Event handler ${eventHandler.handler} should be moved to external script`
        });
      }

      // Check for inline styles
      if (this.hasInlineStyle(line)) {
        violations.push({
          type: 'inline-style',
          content: line.trim(),
          line: lineNumber,
          severity: 'error',
          message: 'Inline styles should be moved to external CSS files'
        });
      }

      // Check for unsafe external sources
      const unsafeSource = this.findUnsafeSource(line);
      if (unsafeSource) {
        violations.push({
          type: 'external-source',
          content: unsafeSource.url,
          line: lineNumber,
          severity: 'error',
          message: `External source ${unsafeSource.url} is not in approved allowlist`
        });
      }
    });

    const recommendations = this.generateRecommendations(violations);

    return {
      passed: violations.filter(v => v.severity === 'error').length === 0,
      violations,
      recommendations
    };
  }

  /**
   * Validates CSS content for security issues
   */
  validateCSS(cssContent: string): CSPValidation {
    const violations: CSPViolation[] = [];

    // Check for JavaScript in CSS
    const jsPatterns = [
      { pattern: /javascript:/i, message: 'JavaScript URLs in CSS are not allowed' },
      { pattern: /expression\s*\(/i, message: 'CSS expressions are security risks' },
      { pattern: /-moz-binding/i, message: 'XBL bindings are not allowed' },
      { pattern: /behavior\s*:/i, message: 'CSS behaviors are not allowed' },
    ];

    for (const { pattern, message } of jsPatterns) {
      if (pattern.test(cssContent)) {
        violations.push({
          type: 'unsafe-eval',
          severity: 'error',
          message
        });
      }
    }

    return {
      passed: violations.length === 0,
      violations,
      recommendations: violations.length === 0 ? 
        ['✅ CSS is CSP compliant'] : 
        ['Remove JavaScript from CSS content']
    };
  }

  /**
   * Processes HTML to make it CSP compliant
   */
  processHTMLForCSP(htmlContent: string): string {
    let processed = htmlContent;

    // Remove inline scripts
    processed = processed.replace(/<script(?![^>]*src=)[^>]*>[\s\S]*?<\/script>/gi, '');

    // Remove inline event handlers
    const eventHandlers = [
      'onclick', 'onload', 'onmouseover', 'onmouseout', 'onsubmit', 
      'onchange', 'onfocus', 'onblur', 'onkeydown', 'onkeyup'
    ];
    
    for (const handler of eventHandlers) {
      const regex = new RegExp(`\\s*${handler}\\s*=\\s*["'][^"']*["']`, 'gi');
      processed = processed.replace(regex, '');
    }

    // Remove style attributes
    processed = processed.replace(/\s*style\s*=\s*["'][^"']*["']/gi, '');

    // Remove javascript: URLs
    processed = processed.replace(/href\s*=\s*["']javascript:[^"']*["']/gi, '');

    // Add CSP meta tag if not present
    if (!processed.includes('Content-Security-Policy')) {
      const cspValue = Object.entries(this.productionCSP)
        .filter(([_, value]) => value !== "")
        .map(([key, value]) => `${key} ${value}`)
        .join('; ');

      const metaTag = `<meta http-equiv="Content-Security-Policy" content="${cspValue}">`;
      processed = processed.replace('<head>', `<head>\n    ${metaTag}`);
    }

    return processed;
  }

  /**
   * Validates external URLs against allowlists
   */
  validateExternalUrl(url: string, type: 'script' | 'style' | 'img' | 'font'): boolean {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname;

      switch (type) {
        case 'script':
          return this.allowedScriptSources.has(domain);
        case 'style':
        case 'font':
          return this.allowedFontSources.has(domain);
        case 'img':
          return this.allowedImageSources.has(domain);
        default:
          return false;
      }
    } catch {
      return false;
    }
  }

  /**
   * Generates CSP header value for Next.js configuration
   */
  getCSPHeaderValue(): string {
    return Object.entries(this.productionCSP)
      .filter(([_, value]) => value !== "")
      .map(([key, value]) => `${key} ${value}`)
      .join('; ');
  }

  // Private helper methods

  private hasInlineScript(line: string): boolean {
    // Check for script tags without src attribute
    const scriptTagMatch = line.match(/<script(?![^>]*src=)[^>]*>/i);
    return scriptTagMatch !== null;
  }

  private hasInlineStyle(line: string): boolean {
    // Check for <style> tags or style attributes
    return /<style[^>]*>/i.test(line) || /\s*style\s*=/i.test(line);
  }

  private findEventHandler(line: string): { element: string; handler: string } | null {
    const eventHandlerMatch = line.match(/(\w+)\s*=\s*["']([^"']*on\w+[^"']*)["']/i);
    if (eventHandlerMatch) {
      return {
        element: eventHandlerMatch[1],
        handler: eventHandlerMatch[2]
      };
    }
    return null;
  }

  private findUnsafeSource(line: string): { type: string; url: string } | null {
    // Check script sources
    const scriptMatch = line.match(/src\s*=\s*["'](https?:\/\/[^"']+)["']/i);
    if (scriptMatch && line.includes('<script')) {
      const url = scriptMatch[1];
      if (!this.validateExternalUrl(url, 'script')) {
        return { type: 'script', url };
      }
    }

    // Check image sources
    const imgMatch = line.match(/src\s*=\s*["'](https?:\/\/[^"']+)["']/i);
    if (imgMatch && line.includes('<img')) {
      const url = imgMatch[1];
      if (!this.validateExternalUrl(url, 'img')) {
        return { type: 'img', url };
      }
    }

    return null;
  }

  private generateRecommendations(violations: CSPViolation[]): string[] {
    const recommendations: string[] = [];
    
    const violationTypes = new Set(violations.map(v => v.type));

    if (violationTypes.has('inline-script')) {
      recommendations.push('Move all JavaScript to external .js files');
      recommendations.push('Use React event handlers instead of HTML attributes');
    }

    if (violationTypes.has('inline-style')) {
      recommendations.push('Move all styling to external CSS files or CSS modules');
      recommendations.push('Use CSS scoping with data attributes');
    }

    if (violationTypes.has('event-handler')) {
      recommendations.push('Replace HTML event handlers with React onClick handlers');
    }

    if (violationTypes.has('external-source')) {
      recommendations.push('Only use approved external sources for assets');
      recommendations.push('Consider hosting external resources locally');
    }

    if (recommendations.length === 0) {
      recommendations.push('✅ Content is CSP compliant');
    }

    return recommendations;
  }
}

// Export singleton instance
export const cspEnforcer = new CSPEnforcer();

// Utility functions
export function validateHTMLForCSP(htmlContent: string, filename?: string): CSPValidationResult {
  return cspEnforcer.validateHTML(htmlContent, filename);
}

export function makeCspCompliant(htmlContent: string): string {
  return cspEnforcer.processHTMLForCSP(htmlContent);
}

export function formatCSPReport(result: CSPValidationResult, filename?: string): string {
  const lines: string[] = [];
  
  lines.push('');
  lines.push(`🛡️ CSP VALIDATION REPORT${filename ? ` - ${filename}` : ''}`);
  lines.push('═'.repeat(50));
  lines.push('');
  
  // Overall status
  lines.push(`Status: ${result.passed ? '✅ PASSED' : '❌ FAILED'}`);
  lines.push(`Violations: ${result.violations.length}`);
  lines.push('');

  // List violations
  if (result.violations.length > 0) {
    lines.push('❌ CSP Violations:');
    result.violations.forEach(violation => {
      const icon = violation.severity === 'error' ? '🚨' : '⚠️';
      lines.push(`   ${icon} Line ${violation.line || '?'}: ${violation.message}`);
      if (violation.content) {
        lines.push(`      Content: ${violation.content.substring(0, 80)}...`);
      }
    });
    lines.push('');
  }

  // Recommendations
  if (result.recommendations.length > 0) {
    lines.push('💡 Recommendations:');
    result.recommendations.forEach(rec => {
      lines.push(`   • ${rec}`);
    });
    lines.push('');
  }

  lines.push('═'.repeat(50));
  
  return lines.join('\n');
}

type CSPValidation = CSPValidationResult;