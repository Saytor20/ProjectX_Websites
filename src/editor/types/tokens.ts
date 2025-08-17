// Phase 3: Enhanced Token System Type Definitions
export interface TokenSchema {
  colors: ColorTokens;
  fonts: FontTokens;
  spacing: SpacingTokens;
  typography: TypographyTokens;
  shadows: ShadowTokens;
  borders: BorderTokens;
  layout: LayoutTokens;
  animations: AnimationTokens;
  semantic: SemanticTokens;
}

export interface ColorTokens {
  primary: string;
  secondary: string;
  accent: string;
  neutral: NeutralColorScale;
  semantic: SemanticColors;
  gradients?: GradientTokens;
  overlays?: OverlayTokens;
}

export interface NeutralColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950?: string;
}

export interface SemanticColors {
  success: string;
  warning: string;
  error: string;
  info: string;
  muted: string;
}

export interface GradientTokens {
  primary: string;
  secondary: string;
  accent: string;
  hero: string;
  overlay: string;
}

export interface OverlayTokens {
  light: string;
  medium: string;
  dark: string;
  modal: string;
}

export interface FontTokens {
  sans: string[] | string;
  serif: string[] | string;
  mono: string[] | string;
  display?: string[] | string;
  body?: string[] | string;
  heading?: string[] | string;
}

export interface SpacingTokens {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
  '5xl'?: string;
  '6xl'?: string;
}

export interface TypographyTokens {
  scale: number;
  lineHeight: LineHeightScale;
  fontWeight: FontWeightScale;
  letterSpacing: LetterSpacingScale;
  headings: HeadingScale;
  body: BodyTextScale;
}

export interface LineHeightScale {
  tight: string;
  normal: string;
  relaxed: string;
  loose: string;
}

export interface FontWeightScale {
  thin: string;
  light: string;
  normal: string;
  medium: string;
  semibold: string;
  bold: string;
  extrabold: string;
  black: string;
}

export interface LetterSpacingScale {
  tight: string;
  normal: string;
  wide: string;
  wider: string;
  widest: string;
}

export interface HeadingScale {
  h1: string;
  h2: string;
  h3: string;
  h4: string;
  h5: string;
  h6: string;
}

export interface BodyTextScale {
  xs: string;
  sm: string;
  base: string;
  lg: string;
  xl: string;
}

export interface ShadowTokens {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  inner: string;
  inset: string;
}

export interface BorderTokens {
  radius: BorderRadiusScale;
  width: BorderWidthScale;
  style: BorderStyleTokens;
}

export interface BorderRadiusScale {
  none: string;
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  full: string;
}

export interface BorderWidthScale {
  none: string;
  thin: string;
  medium: string;
  thick: string;
  '2': string;
  '4': string;
  '8': string;
}

export interface BorderStyleTokens {
  solid: string;
  dashed: string;
  dotted: string;
  double: string;
  groove: string;
  ridge: string;
}

export interface LayoutTokens {
  maxWidth: MaxWidthScale;
  breakpoints: BreakpointScale;
  zIndex: ZIndexScale;
  container: ContainerTokens;
}

export interface MaxWidthScale {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
  '5xl': string;
  '6xl': string;
  '7xl': string;
  full: string;
}

export interface BreakpointScale {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

export interface ZIndexScale {
  auto: string;
  behind: string;
  base: string;
  docked: string;
  dropdown: string;
  sticky: string;
  banner: string;
  overlay: string;
  modal: string;
  popover: string;
  skipLink: string;
  toast: string;
  tooltip: string;
}

export interface ContainerTokens {
  padding: string;
  maxWidth: string;
  center: boolean;
}

export interface AnimationTokens {
  duration: DurationScale;
  easing: EasingTokens;
  keyframes: KeyframeTokens;
}

export interface DurationScale {
  fast: string;
  normal: string;
  slow: string;
  slower: string;
}

export interface EasingTokens {
  linear: string;
  ease: string;
  easeIn: string;
  easeOut: string;
  easeInOut: string;
  bounce: string;
  elastic: string;
}

export interface KeyframeTokens {
  fadeIn: string;
  fadeOut: string;
  slideIn: string;
  slideOut: string;
  pulse: string;
  bounce: string;
  spin: string;
}

export interface SemanticTokens {
  text: TextSemanticTokens;
  background: BackgroundSemanticTokens;
  border: BorderSemanticTokens;
  interactive: InteractiveSemanticTokens;
}

export interface TextSemanticTokens {
  primary: string;
  secondary: string;
  muted: string;
  inverse: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface BackgroundSemanticTokens {
  primary: string;
  secondary: string;
  tertiary: string;
  surface: string;
  overlay: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface BorderSemanticTokens {
  primary: string;
  secondary: string;
  muted: string;
  inverse: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface InteractiveSemanticTokens {
  default: string;
  hover: string;
  active: string;
  focus: string;
  disabled: string;
  selected: string;
}

// Token validation and processing types
export interface TokenValidationRule {
  path: string;
  type: 'string' | 'number' | 'array' | 'object' | 'color' | 'size' | 'font';
  required: boolean;
  validator?: (value: any) => boolean;
  errorMessage?: string;
}

export interface TokenValidationResult {
  isValid: boolean;
  errors: TokenValidationError[];
  warnings: TokenValidationWarning[];
}

export interface TokenValidationError {
  path: string;
  message: string;
  value: any;
  expected: string;
}

export interface TokenValidationWarning {
  path: string;
  message: string;
  suggestion?: string;
}

export interface TokenTransform {
  type: 'color' | 'size' | 'font' | 'spacing' | 'shadow';
  platform: 'web' | 'mobile' | 'desktop';
  transform: (value: any) => string;
}

export interface TokenBuildResult {
  css: string;
  scss: string;
  js: string;
  json: string;
  errors: string[];
  warnings: string[];
  size: {
    css: number;
    js: number;
  };
}

export interface StyleDictionaryConfig {
  source: string[];
  platforms: {
    web: StyleDictionaryPlatform;
    mobile?: StyleDictionaryPlatform;
  };
  transform: Record<string, TokenTransform>;
}

export interface StyleDictionaryPlatform {
  transformGroup: string;
  buildPath: string;
  files: StyleDictionaryFile[];
}

export interface StyleDictionaryFile {
  destination: string;
  format: string;
  selector?: string;
  options?: Record<string, any>;
}

// Token editing and management types
export interface TokenEditOperation {
  type: 'set' | 'delete' | 'rename' | 'move';
  path: string;
  value?: any;
  newPath?: string;
  timestamp: number;
}

export interface TokenHistory {
  operations: TokenEditOperation[];
  currentIndex: number;
  maxOperations: number;
}

export interface TokenCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  tokens: Record<string, any>;
  subcategories?: TokenCategory[];
}

export interface TokenEditor {
  categories: TokenCategory[];
  activeCategory: string;
  activeToken?: string;
  searchQuery: string;
  filters: TokenFilter[];
  history: TokenHistory;
  isEditing: boolean;
  hasUnsavedChanges: boolean;
}

export interface TokenFilter {
  type: 'category' | 'type' | 'modified' | 'custom';
  value: string;
  active: boolean;
}

export interface TokenPreview {
  path: string;
  value: any;
  cssProperty: string;
  preview: string;
  examples: TokenExample[];
}

export interface TokenExample {
  component: string;
  usage: string;
  cssRule: string;
}

export interface TokenDiff {
  path: string;
  oldValue: any;
  newValue: any;
  type: 'added' | 'modified' | 'removed';
}

export interface TokenConflict {
  path: string;
  localValue: any;
  themeValue: any;
  resolution: 'local' | 'theme' | 'merge';
}

export interface TokenMergeResult {
  merged: Record<string, any>;
  conflicts: TokenConflict[];
  applied: TokenDiff[];
}