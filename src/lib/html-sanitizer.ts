// Simple HTML sanitizer for static template imports
// Uses allowlist approach for security

interface SanitizeOptions {
  allowedTags?: string[]
  allowedAttributes?: Record<string, string[]>
  removeScripts?: boolean
}

const DEFAULT_ALLOWED_TAGS = [
  'div', 'span', 'section', 'article', 'header', 'footer', 'main', 'nav',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'hr',
  'ul', 'ol', 'li', 'dl', 'dt', 'dd',
  'a', 'img', 'figure', 'figcaption',
  'table', 'thead', 'tbody', 'tr', 'td', 'th',
  'form', 'input', 'button', 'textarea', 'select', 'option',
  'strong', 'em', 'i', 'b', 'u', 'small', 'mark', 'del', 'ins',
  'blockquote', 'cite', 'q', 'abbr', 'time', 'code', 'pre'
]

const DEFAULT_ALLOWED_ATTRIBUTES: Record<string, string[]> = {
  '*': ['class', 'id', 'data-*'],
  'a': ['href', 'title', 'target', 'rel'],
  'img': ['src', 'alt', 'title', 'width', 'height', 'loading'],
  'form': ['action', 'method', 'enctype'],
  'input': ['type', 'name', 'value', 'placeholder', 'required', 'disabled'],
  'button': ['type', 'name', 'value', 'disabled'],
  'textarea': ['name', 'placeholder', 'rows', 'cols', 'required', 'disabled'],
  'select': ['name', 'required', 'disabled', 'multiple'],
  'option': ['value', 'selected', 'disabled'],
  'table': ['cellpadding', 'cellspacing', 'border'],
  'td': ['colspan', 'rowspan'],
  'th': ['colspan', 'rowspan', 'scope']
}

export function sanitizeHTML(html: string, options: SanitizeOptions = {}): string {
  const {
    allowedTags = DEFAULT_ALLOWED_TAGS,
    allowedAttributes = DEFAULT_ALLOWED_ATTRIBUTES,
    removeScripts = true
  } = options

  // Remove script tags and their content completely
  if (removeScripts) {
    html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    html = html.replace(/<link[^>]*rel=["']?stylesheet["']?[^>]*>/gi, '') // Keep only specific stylesheets
    html = html.replace(/on\w+="[^"]*"/gi, '') // Remove inline event handlers
    html = html.replace(/javascript:/gi, '') // Remove javascript: URLs
  }

  // Simple tag and attribute filtering
  // This is a basic implementation - in production you'd want a proper HTML parser
  const tagRegex = /<(\/?)([\w-]+)([^>]*)>/gi
  
  return html.replace(tagRegex, (match, slash, tagName, attributes) => {
    const tag = tagName.toLowerCase()
    
    // Check if tag is allowed
    if (!allowedTags.includes(tag)) {
      return '' // Remove disallowed tags
    }
    
    // Filter attributes
    const filteredAttributes = filterAttributes(attributes, tag, allowedAttributes)
    
    return `<${slash}${tag}${filteredAttributes}>`
  })
}

function filterAttributes(
  attributeString: string,
  tagName: string,
  allowedAttributes: Record<string, string[]>
): string {
  if (!attributeString || !attributeString.trim()) {
    return ''
  }
  
  const attrs = allowedAttributes[tagName] || []
  const globalAttrs = allowedAttributes['*'] || []
  const allowedForTag = [...attrs, ...globalAttrs]
  
  // Simple attribute parsing (not perfect but safe for controlled input)
  const attrRegex = /(\w+(?:-\w+)*)=["']([^"']*)["']/g
  const matches = []
  let match
  
  while ((match = attrRegex.exec(attributeString)) !== null) {
    const attrName = match[1]
    const attrValue = match[2]
    if (!attrName || attrValue === undefined) continue
    
    // Check if attribute is allowed
    const isAllowed = allowedForTag.some(pattern => {
      if (pattern === attrName) return true
      if (pattern.includes('*')) {
        const regex = new RegExp(pattern.replace('*', '.*'))
        return regex.test(attrName)
      }
      return false
    })
    
    if (isAllowed) {
      // Basic XSS prevention for attribute values
      const safeValue = attrValue
        .replace(/javascript:/gi, '')
        .replace(/on\w+/gi, '')
        .replace(/[<>]/g, '')
      
      matches.push(`${attrName}="${safeValue}"`)
    }
  }
  
  return matches.length > 0 ? ' ' + matches.join(' ') : ''
}

// Utility to extract and clean CSS from HTML
export function extractInlineStyles(html: string): { html: string; css: string } {
  const styleRegex = /<style[^>]*>(.*?)<\/style>/gis
  const styles: string[] = []
  
  // Extract style tags
  let cleanHtml = html.replace(styleRegex, (match, styleContent) => {
    styles.push(styleContent.trim())
    return ''
  })
  
  // Extract inline styles from elements
  const inlineStyleRegex = /style=["']([^"']*)["']/g
  const inlineStyles: string[] = []
  
  cleanHtml = cleanHtml.replace(inlineStyleRegex, (match, styleContent) => {
    inlineStyles.push(`.inline-${Date.now()} { ${styleContent} }`)
    return ''
  })
  
  const combinedCSS = [...styles, ...inlineStyles].join('\n')
  
  return {
    html: cleanHtml,
    css: combinedCSS
  }
}
