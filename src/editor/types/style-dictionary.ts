// Phase 3: Style Dictionary Integration Type Definitions
import type { TokenSchema, TokenBuildResult, TokenTransform } from './tokens';

export interface StyleDictionaryIntegration {
  config: StyleDictionaryConfig;
  transforms: StyleDictionaryTransform[];
  formats: StyleDictionaryFormat[];
  actions: StyleDictionaryAction[];
}

export interface StyleDictionaryConfig {
  source: string[];
  platforms: Record<string, StyleDictionaryPlatform>;
  transform?: Record<string, any>;
  format?: Record<string, any>;
  action?: Record<string, any>;
  hooks?: StyleDictionaryHooks;
  log?: {
    warnings?: 'error' | 'warn' | 'disabled';
    verbosity?: 'default' | 'silent' | 'verbose';
  };
}

export interface StyleDictionaryPlatform {
  transformGroup?: string;
  transforms?: string[];
  buildPath: string;
  files?: StyleDictionaryFile[];
  actions?: string[];
  prefix?: string;
  options?: PlatformOptions;
}

export interface StyleDictionaryFile {
  destination: string;
  format: string;
  selector?: string;
  layer?: string;
  options?: FileOptions;
  filter?: (token: DesignToken) => boolean;
}

export interface PlatformOptions {
  basePxFontSize?: number;
  fontFamilyFormat?: 'css' | 'string';
  outputReferences?: boolean;
  showFileHeader?: boolean;
  fileHeader?: string;
}

export interface FileOptions {
  showFileHeader?: boolean;
  fileHeader?: string;
  outputReferences?: boolean;
  selector?: string;
  layer?: string;
  prefix?: string;
  suffix?: string;
  formatting?: {
    indentation?: string;
    separator?: string;
    suffix?: string;
  };
}

export interface StyleDictionaryTransform {
  name: string;
  type: 'name' | 'attribute' | 'value';
  matcher?: (token: DesignToken) => boolean;
  transformer: (token: DesignToken, options?: any) => any;
}

export interface StyleDictionaryFormat {
  name: string;
  formatter: (dictionary: Dictionary, file: StyleDictionaryFile, options?: any) => string;
}

export interface StyleDictionaryAction {
  name: string;
  do: (dictionary: Dictionary, config: StyleDictionaryConfig) => void;
  undo?: (dictionary: Dictionary, config: StyleDictionaryConfig) => void;
}

export interface StyleDictionaryHooks {
  parsers?: Record<string, (content: string) => DesignToken[]>;
  preprocessors?: Record<string, (dictionary: Dictionary) => Dictionary>;
  transformGroups?: Record<string, string[]>;
  fileHeaders?: Record<string, (defaultMessage: string[]) => string[]>;
  filters?: Record<string, (token: DesignToken) => boolean>;
}

export interface DesignToken {
  name: string;
  value: any;
  original: {
    value: any;
  };
  filePath: string;
  isSource: boolean;
  attributes?: TokenAttributes;
  path: string[];
  type?: string;
  comment?: string;
  themeable?: boolean;
  deprecated?: boolean;
  metadata?: Record<string, any>;
}

export interface TokenAttributes {
  category?: string;
  type?: string;
  item?: string;
  subitem?: string;
  state?: string;
  [key: string]: any;
}

export interface Dictionary {
  tokens: Record<string, any>;
  allTokens: DesignToken[];
  properties: Record<string, any>; // Legacy property name
  allProperties: DesignToken[]; // Legacy property name
  usesReference: (value: any) => boolean;
  getReferences: (value: any) => DesignToken[];
}

// Custom transforms for our token system
export interface CustomTransforms {
  'color/css': ColorTransform;
  'size/css': SizeTransform;
  'font/css': FontTransform;
  'shadow/css': ShadowTransform;
  'name/kebab': NameTransform;
  'name/camel': NameTransform;
  'name/constant': NameTransform;
}

export interface ColorTransform extends StyleDictionaryTransform {
  transformer: (token: DesignToken) => string;
}

export interface SizeTransform extends StyleDictionaryTransform {
  transformer: (token: DesignToken) => string;
}

export interface FontTransform extends StyleDictionaryTransform {
  transformer: (token: DesignToken) => string;
}

export interface ShadowTransform extends StyleDictionaryTransform {
  transformer: (token: DesignToken) => string;
}

export interface NameTransform extends StyleDictionaryTransform {
  transformer: (token: DesignToken) => string;
}

// Custom formats for our output needs
export interface CustomFormats {
  'css/variables': CSSVariablesFormat;
  'css/custom-properties': CSSCustomPropertiesFormat;
  'scss/variables': SCSSVariablesFormat;
  'javascript/es6': JavaScriptFormat;
  'json/nested': JSONFormat;
  'css/scoped': ScopedCSSFormat;
}

export interface CSSVariablesFormat extends StyleDictionaryFormat {
  formatter: (dictionary: Dictionary, file: StyleDictionaryFile) => string;
}

export interface CSSCustomPropertiesFormat extends StyleDictionaryFormat {
  formatter: (dictionary: Dictionary, file: StyleDictionaryFile) => string;
}

export interface SCSSVariablesFormat extends StyleDictionaryFormat {
  formatter: (dictionary: Dictionary, file: StyleDictionaryFile) => string;
}

export interface JavaScriptFormat extends StyleDictionaryFormat {
  formatter: (dictionary: Dictionary, file: StyleDictionaryFile) => string;
}

export interface JSONFormat extends StyleDictionaryFormat {
  formatter: (dictionary: Dictionary, file: StyleDictionaryFile) => string;
}

export interface ScopedCSSFormat extends StyleDictionaryFormat {
  formatter: (dictionary: Dictionary, file: StyleDictionaryFile) => string;
}

// Build process types
export interface StyleDictionaryBuildConfig {
  source: string[];
  platforms: string[];
  outputDir: string;
  cleanOutput: boolean;
  logLevel: 'verbose' | 'default' | 'silent';
  parallel: boolean;
}

export interface StyleDictionaryBuildResult {
  success: boolean;
  platforms: Record<string, PlatformBuildResult>;
  errors: BuildError[];
  warnings: BuildWarning[];
  timing: {
    total: number;
    platforms: Record<string, number>;
  };
  output: {
    files: string[];
    size: number;
  };
}

export interface PlatformBuildResult {
  platform: string;
  success: boolean;
  files: FileBuildResult[];
  errors: BuildError[];
  warnings: BuildWarning[];
  timing: number;
}

export interface FileBuildResult {
  destination: string;
  format: string;
  size: number;
  success: boolean;
  error?: string;
}

export interface BuildError {
  type: 'transform' | 'format' | 'file' | 'platform';
  message: string;
  file?: string;
  platform?: string;
  token?: string;
  stack?: string;
}

export interface BuildWarning {
  type: 'deprecated' | 'reference' | 'format' | 'performance';
  message: string;
  file?: string;
  token?: string;
  suggestion?: string;
}

// Integration with existing token system
export interface TokenIntegrationConfig {
  styleDictionary: StyleDictionaryConfig;
  existingTokens: TokenSchema;
  outputFormats: OutputFormat[];
  scoping: ScopingConfig;
  validation: ValidationConfig;
}

export interface OutputFormat {
  name: string;
  platform: string;
  destination: string;
  format: string;
  options?: FileOptions;
}

export interface ScopingConfig {
  enabled: boolean;
  selector: string;
  strategy: 'prefix' | 'wrap' | 'namespace';
  excludeGlobals: boolean;
}

export interface ValidationConfig {
  validateTokens: boolean;
  validateOutput: boolean;
  performanceChecks: boolean;
  accessibilityChecks: boolean;
  crossPlatformChecks: boolean;
}

// Hot reload integration types
export interface HotReloadConfig {
  enabled: boolean;
  debounceMs: number;
  watchPaths: string[];
  rebuildsOn: string[];
  notifyClients: boolean;
}

export interface HotReloadEvent {
  type: 'token-change' | 'build-complete' | 'build-error';
  timestamp: number;
  files: string[];
  platform?: string;
  error?: string;
  buildResult?: StyleDictionaryBuildResult;
}

// Performance monitoring types
export interface PerformanceMetrics {
  buildTime: number;
  fileCount: number;
  tokenCount: number;
  outputSize: number;
  platformTimes: Record<string, number>;
  memoryUsage: number;
}

export interface PerformanceBudget {
  maxBuildTime: number;
  maxOutputSize: number;
  maxMemoryUsage: number;
  maxFileCount: number;
}

export interface PerformanceReport {
  metrics: PerformanceMetrics;
  budget: PerformanceBudget;
  violations: PerformanceViolation[];
  recommendations: PerformanceRecommendation[];
}

export interface PerformanceViolation {
  metric: keyof PerformanceMetrics;
  actual: number;
  budget: number;
  severity: 'warning' | 'error';
}

export interface PerformanceRecommendation {
  type: 'optimization' | 'configuration' | 'architecture';
  message: string;
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
}