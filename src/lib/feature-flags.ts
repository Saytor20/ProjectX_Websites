export interface FeatureFlags {
  VISUAL_EDITOR_V2: boolean;
  LEGACY_EDITOR: boolean;
  MOVEABLE_INTERACTIONS: boolean;
  SELECTO_MULTISELECT: boolean;
  GUIDES_SNAPPING: boolean;
  PERFORMANCE_MONITORING: boolean;
  // Phase 2 flags
  TIPTAP_TEXT_EDITING: boolean;
  UPPY_MEDIA_MANAGEMENT: boolean;
  BACKGROUND_SYSTEM: boolean;
}

export const getFeatureFlags = (): FeatureFlags => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return {
    VISUAL_EDITOR_V2: isDevelopment && process.env.ENABLE_EDITOR_V2 !== 'false',
    LEGACY_EDITOR: isDevelopment && process.env.ENABLE_LEGACY_EDITOR !== 'false',
    MOVEABLE_INTERACTIONS: isDevelopment && process.env.ENABLE_MOVEABLE !== 'false',
    SELECTO_MULTISELECT: isDevelopment && process.env.ENABLE_SELECTO !== 'false',
    GUIDES_SNAPPING: isDevelopment && process.env.ENABLE_GUIDES !== 'false',
    PERFORMANCE_MONITORING: process.env.ENABLE_PERF_MONITORING === 'true',
    // Phase 2 flags
    TIPTAP_TEXT_EDITING: isDevelopment && process.env.ENABLE_TIPTAP !== 'false',
    UPPY_MEDIA_MANAGEMENT: isDevelopment && process.env.ENABLE_UPPY !== 'false',
    BACKGROUND_SYSTEM: isDevelopment && process.env.ENABLE_BACKGROUNDS !== 'false',
  };
};

export const useFeatureFlag = (flag: keyof FeatureFlags): boolean => {
  return getFeatureFlags()[flag];
};