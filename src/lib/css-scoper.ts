// CSS scoping utilities for skin isolation

export interface ScopingOptions {
  skinId: string
  prefix?: string
  excludeSelectors?: string[]
  includeKeyframes?: boolean
}

// Scope CSS selectors to prevent cross-skin contamination
export function scopeCSS(css: string, options: ScopingOptions): string {
  const { skinId, prefix = 'data-skin', excludeSelectors = [], includeKeyframes = true } = options
  const scopeAttribute = `[${prefix}="${skinId}"]`
  
  // Split CSS into rules and handle each separately
  const lines = css.split('\n')
  const scopedLines: string[] = []
  
  let insideRule = false
  let insideKeyframes = false
  let currentRule = ''
  let braceCount = 0
  
  for (const line of lines) {
    const trimmedLine = line.trim()
    
    // Skip empty lines and comments
    if (!trimmedLine || trimmedLine.startsWith('/*') || trimmedLine.startsWith('//')) {
      scopedLines.push(line)
      continue
    }
    
    // Handle keyframes
    if (trimmedLine.includes('@keyframes') || trimmedLine.includes('@-webkit-keyframes')) {
      if (includeKeyframes) {
        scopedLines.push(line)
        insideKeyframes = true
      }
      continue
    }
    
    if (insideKeyframes) {
      scopedLines.push(line)
      if (trimmedLine === '}') {
        insideKeyframes = false
      }
      continue
    }
    
    // Handle media queries and other at-rules
    if (trimmedLine.startsWith('@')) {
      scopedLines.push(line)
      continue
    }
    
    // Count braces
    braceCount += (line.match(/{/g) || []).length
    braceCount -= (line.match(/}/g) || []).length
    
    // Check if we're starting a new rule
    if (!insideRule && trimmedLine.includes('{')) {
      insideRule = true
      currentRule = trimmedLine.split('{')[0].trim()
      
      // Scope the selector
      const scopedSelector = scopeSelector(currentRule, scopeAttribute, excludeSelectors)
      scopedLines.push(`${scopedSelector} {`)
      
      // If there's content after the opening brace, add it
      const afterBrace = trimmedLine.split('{')[1]
      if (afterBrace && afterBrace.trim()) {
        scopedLines.push(`  ${afterBrace}`)
      }
    } else if (insideRule) {
      // Inside a rule - just add the line
      scopedLines.push(line)
      
      // Check if rule is ending
      if (braceCount === 0) {
        insideRule = false
        currentRule = ''
      }
    } else {
      // Selector line without opening brace
      currentRule += ' ' + trimmedLine
    }
  }
  
  return scopedLines.join('\n')
}

// Scope individual selector
function scopeSelector(selector: string, scopeSelector: string, excludeSelectors: string[]): string {
  // Skip selectors that should not be scoped
  for (const exclude of excludeSelectors) {
    if (selector.includes(exclude)) {
      return selector
    }
  }
  
  // Skip root selectors
  if (selector.includes(':root') || selector.includes('html') || selector.includes('body')) {
    return selector
  }
  
  // Split multiple selectors
  const selectors = selector.split(',').map(s => s.trim())
  
  const scopedSelectors = selectors.map(sel => {
    // Skip pseudo-selectors and complex selectors that shouldn't be scoped
    if (sel.startsWith('::') || sel.startsWith('@') || sel.includes('::before') || sel.includes('::after')) {
      return sel
    }
    
    // Add scope to the beginning of the selector
    if (sel.startsWith('.') || sel.startsWith('#') || sel.match(/^[a-zA-Z]/)) {
      return `${scopeSelector} ${sel}`
    }
    
    return sel
  })
  
  return scopedSelectors.join(', ')
}

// Extract and validate CSS
export function validateCSS(css: string): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = []
  const warnings: string[] = []
  
  // Check for basic syntax issues
  const openBraces = (css.match(/{/g) || []).length
  const closeBraces = (css.match(/}/g) || []).length
  
  if (openBraces !== closeBraces) {
    errors.push(`Mismatched braces: ${openBraces} opening, ${closeBraces} closing`)
  }
  
  // Check for unscoped global selectors (potential leakage)
  const lines = css.split('\n')
  for (const [index, line] of lines.entries()) {
    const trimmedLine = line.trim()
    
    // Check for global selectors that could cause leakage
    if (trimmedLine.match(/^(body|html|\.container|\.row|\.col|\.btn)\s*{/)) {
      warnings.push(`Line ${index + 1}: Potentially global selector "${trimmedLine}"`)
    }
    
    // Check for !important usage (code smell)
    if (trimmedLine.includes('!important')) {
      warnings.push(`Line ${index + 1}: Usage of !important`)
    }
  }
  
  // Check CSS size
  const sizeKB = css.length / 1024
  if (sizeKB > 50) {
    warnings.push(`CSS size is ${Math.round(sizeKB)}KB (recommended: <50KB)`)
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

// Minify CSS for production
export function minifyCSS(css: string): string {
  return css
    // Remove comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Remove extra whitespace
    .replace(/\s+/g, ' ')
    // Remove whitespace around braces and semicolons
    .replace(/\s*{\s*/g, '{')
    .replace(/\s*}\s*/g, '}')
    .replace(/\s*;\s*/g, ';')
    .replace(/\s*,\s*/g, ',')
    .replace(/\s*:\s*/g, ':')
    // Remove trailing semicolons
    .replace(/;}/g, '}')
    // Trim
    .trim()
}

// Extract CSS variables for token system
export function extractCSSVariables(css: string): Record<string, string> {
  const variables: Record<string, string> = {}
  const variableRegex = /--([\w-]+):\s*([^;]+);/g
  
  let match
  while ((match = variableRegex.exec(css)) !== null) {
    const [, name, value] = match
    variables[name] = value.trim()
  }
  
  return variables
}

// Replace CSS variables with token values
export function applyTokens(css: string, tokens: Record<string, any>): string {
  let processedCSS = css
  
  // Replace CSS custom properties
  for (const [key, value] of Object.entries(tokens)) {
    const variableName = key.startsWith('--') ? key : `--${key}`
    const regex = new RegExp(`${variableName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g')
    processedCSS = processedCSS.replace(regex, String(value))
  }
  
  return processedCSS
}

// Performance metrics for CSS
export function getCSSMetrics(css: string): Record<string, number> {
  const sizeBytes = css.length
  const sizeKB = Math.round(sizeBytes / 1024 * 10) / 10
  
  const selectors = (css.match(/[^{}]+(?={)/g) || []).length
  const rules = (css.match(/{[^}]*}/g) || []).length
  const mediaQueries = (css.match(/@media[^{]+{/g) || []).length
  const keyframes = (css.match(/@keyframes[^{]+{/g) || []).length
  
  return {
    sizeBytes,
    sizeKB,
    selectors,
    rules,
    mediaQueries,
    keyframes
  }
}