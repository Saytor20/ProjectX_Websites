/**
 * CSS Design Token Defaults
 * These tokens provide consistent spacing, sizing, and styling across templates
 */

export interface DesignTokens {
  spacing: Record<string, string>;
  radius: Record<string, string>;
  typography: Record<string, string>;
  colors: Record<string, string>;
  shadows: Record<string, string>;
  transitions: Record<string, string>;
}

export const defaultTokens: DesignTokens = {
  spacing: {
    '--gap': '1rem',
    '--gap-xs': '0.25rem',
    '--gap-sm': '0.5rem',
    '--gap-md': '1rem',
    '--gap-lg': '1.5rem',
    '--gap-xl': '2rem',
    '--gap-2xl': '3rem',
    '--gap-3xl': '4rem',
    '--padY': '1rem',
    '--padY-sm': '0.5rem',
    '--padY-md': '1rem',
    '--padY-lg': '1.5rem',
    '--padY-xl': '2rem',
    '--padY-2xl': '3rem',
    '--padX': '1rem',
    '--padX-sm': '0.5rem',
    '--padX-md': '1rem',
    '--padX-lg': '1.5rem',
    '--padX-xl': '2rem',
    '--padX-2xl': '3rem',
  },
  radius: {
    '--radius': '0.375rem',
    '--radius-sm': '0.25rem',
    '--radius-md': '0.375rem',
    '--radius-lg': '0.5rem',
    '--radius-xl': '0.75rem',
    '--radius-2xl': '1rem',
    '--radius-full': '9999px',
  },
  typography: {
    '--font-sans': 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    '--font-serif': 'Georgia, Cambria, "Times New Roman", Times, serif',
    '--font-mono': 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
    '--text-xs': '0.75rem',
    '--text-sm': '0.875rem',
    '--text-base': '1rem',
    '--text-lg': '1.125rem',
    '--text-xl': '1.25rem',
    '--text-2xl': '1.5rem',
    '--text-3xl': '1.875rem',
    '--text-4xl': '2.25rem',
    '--text-5xl': '3rem',
    '--leading-tight': '1.25',
    '--leading-normal': '1.5',
    '--leading-relaxed': '1.75',
  },
  colors: {
    '--color-primary': '#B38E6A',
    '--color-secondary': '#534931',
    '--color-accent': '#E5DCD2',
    '--color-background': '#ffffff',
    '--color-foreground': '#111111',
    '--color-muted': '#6b7280',
    '--color-border': '#e5e7eb',
  },
  shadows: {
    '--shadow-sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    '--shadow': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    '--shadow-md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    '--shadow-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    '--shadow-xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '--shadow-2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  },
  transitions: {
    '--transition-fast': '150ms ease',
    '--transition-base': '250ms ease',
    '--transition-slow': '350ms ease',
    '--transition-colors': 'color 250ms ease, background-color 250ms ease, border-color 250ms ease',
    '--transition-transform': 'transform 250ms ease',
    '--transition-all': 'all 250ms ease',
  },
};

/**
 * Converts design tokens to CSS custom properties
 */
export function tokensToCSS(tokens: DesignTokens = defaultTokens): string {
  const lines: string[] = [':root {'];
  
  Object.entries(tokens).forEach(([category, values]) => {
    lines.push(`  /* ${category} */`);
    Object.entries(values).forEach(([key, value]) => {
      lines.push(`  ${key}: ${value};`);
    });
    lines.push('');
  });
  
  lines.push('}');
  return lines.join('\n');
}

/**
 * Merges custom tokens with defaults
 */
export function mergeTokens(custom: Partial<DesignTokens>): DesignTokens {
  return {
    spacing: { ...defaultTokens.spacing, ...custom.spacing },
    radius: { ...defaultTokens.radius, ...custom.radius },
    typography: { ...defaultTokens.typography, ...custom.typography },
    colors: { ...defaultTokens.colors, ...custom.colors },
    shadows: { ...defaultTokens.shadows, ...custom.shadows },
    transitions: { ...defaultTokens.transitions, ...custom.transitions },
  };
}