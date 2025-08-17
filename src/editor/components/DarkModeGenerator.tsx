'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Dialog, Transition, Tab } from '@headlessui/react';
import { 
  MoonIcon,
  SunIcon,
  XMarkIcon,
  SwatchIcon,
  AdjustmentsHorizontalIcon,
  EyeIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
  ArrowPathIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';
import chroma from 'chroma-js';
import type { TokenSchema, ColorTokens } from '../types/tokens';

interface DarkModeGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  lightTokens: TokenSchema;
  onDarkTokensGenerated: (darkTokens: TokenSchema) => void;
  currentTheme: string;
}

interface ContrastLevel {
  name: string;
  level: 'AA' | 'AAA';
  ratio: number;
}

interface ColorMapping {
  lightColor: string;
  darkColor: string;
  contrast: number;
  isAccessible: boolean;
  suggestions: string[];
}

interface DarkModeSettings {
  contrastLevel: 'AA' | 'AAA';
  saturationAdjustment: number;
  lightnessStrategy: 'invert' | 'adaptive' | 'manual';
  preserveHue: boolean;
  enhanceAccents: boolean;
  softShadows: boolean;
  customMappings: Record<string, string>;
}

const CONTRAST_LEVELS: ContrastLevel[] = [
  { name: 'Standard (AA)', level: 'AA', ratio: 4.5 },
  { name: 'Enhanced (AAA)', level: 'AAA', ratio: 7.0 }
];

const LIGHTNESS_STRATEGIES = [
  { id: 'invert', name: 'Simple Invert', description: 'Invert lightness values directly' },
  { id: 'adaptive', name: 'Adaptive', description: 'Smart lightness adjustment based on color theory' },
  { id: 'manual', name: 'Manual Control', description: 'Fine-tune each color manually' }
];

export const DarkModeGenerator: React.FC<DarkModeGeneratorProps> = ({
  isOpen,
  onClose,
  lightTokens,
  onDarkTokensGenerated,
  currentTheme
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [settings, setSettings] = useState<DarkModeSettings>({
    contrastLevel: 'AA',
    saturationAdjustment: 0,
    lightnessStrategy: 'adaptive',
    preserveHue: true,
    enhanceAccents: false,
    softShadows: true,
    customMappings: {}
  });
  const [generatedTokens, setGeneratedTokens] = useState<TokenSchema | null>(null);
  const [colorMappings, setColorMappings] = useState<Record<string, ColorMapping>>({});
  const [previewMode, setPreviewMode] = useState<'light' | 'dark' | 'comparison'>('comparison');
  const [validationResults, setValidationResults] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const tabs = [
    { 
      id: 'generator', 
      name: 'Generator',
      icon: SparklesIcon,
      description: 'Generate dark mode variants'
    },
    { 
      id: 'settings', 
      name: 'Settings',
      icon: AdjustmentsHorizontalIcon,
      description: 'Configure generation parameters'
    },
    { 
      id: 'preview', 
      name: 'Preview',
      icon: EyeIcon,
      description: 'Preview light and dark themes'
    },
    { 
      id: 'accessibility', 
      name: 'Accessibility',
      icon: LightBulbIcon,
      description: 'Contrast and accessibility validation'
    }
  ];

  // Calculate optimal dark color based on light color and settings
  const generateDarkColor = (lightColor: string, colorType: 'primary' | 'secondary' | 'neutral' | 'semantic' = 'primary'): string => {
    try {
      const color = chroma(lightColor);
      const lightness = color.get('hsl.l');
      const saturation = color.get('hsl.s');
      const hue = color.get('hsl.h') || 0;

      let newLightness: number;
      let newSaturation = saturation;

      // Apply saturation adjustment
      newSaturation = Math.max(0, Math.min(1, saturation + (settings.saturationAdjustment / 100)));

      switch (settings.lightnessStrategy) {
        case 'invert':
          newLightness = 1 - lightness;
          break;
        
        case 'adaptive':
          // Smart adaptive strategy based on color theory
          if (colorType === 'neutral') {
            // For neutral colors, use simple inversion with softening
            newLightness = lightness > 0.5 ? 0.1 + (0.3 * (1 - lightness)) : 0.7 + (0.2 * lightness);
          } else if (colorType === 'primary' || colorType === 'secondary') {
            // For brand colors, maintain character while ensuring readability
            if (lightness > 0.6) {
              newLightness = 0.2 + (0.3 * (1 - lightness));
            } else if (lightness < 0.3) {
              newLightness = 0.6 + (0.3 * lightness);
            } else {
              newLightness = lightness > 0.45 ? lightness - 0.3 : lightness + 0.3;
            }
          } else {
            // Semantic colors (success, warning, error)
            newLightness = lightness > 0.5 ? lightness - 0.4 : lightness + 0.4;
          }
          
          // Enhance accents if enabled
          if (settings.enhanceAccents && colorType === 'primary') {
            newSaturation = Math.min(1, newSaturation + 0.1);
          }
          break;
        
        case 'manual':
          // Use custom mappings if available, fallback to adaptive
          const customMapping = settings.customMappings[lightColor];
          if (customMapping) {
            return customMapping;
          }
          newLightness = lightness > 0.5 ? 0.3 : 0.7;
          break;
      }

      // Ensure the color maintains accessibility standards
      const darkColor = chroma.hsl(settings.preserveHue ? hue : hue + 10, newSaturation, newLightness);
      
      // Validate contrast against common background colors
      const darkBackground = chroma('#1a1a1a');
      const lightBackground = chroma('#ffffff');
      
      const contrastRequired = settings.contrastLevel === 'AAA' ? 7.0 : 4.5;
      const contrastAgainstDark = chroma.contrast(darkColor, darkBackground);
      
      if (contrastAgainstDark < contrastRequired) {
        // Adjust lightness to meet contrast requirements
        const adjustedLightness = newLightness < 0.5 
          ? Math.min(0.9, newLightness + 0.2)
          : Math.max(0.1, newLightness - 0.2);
        
        return chroma.hsl(settings.preserveHue ? hue : hue + 10, newSaturation, adjustedLightness).hex();
      }

      return darkColor.hex();
    } catch (error) {
      console.warn(`Failed to generate dark color for ${lightColor}:`, error);
      return lightColor;
    }
  };

  // Generate complete dark mode token set
  const generateDarkModeTokens = (): TokenSchema => {
    const darkTokens: TokenSchema = JSON.parse(JSON.stringify(lightTokens));

    // Generate dark colors
    if (darkTokens.colors) {
      // Primary brand colors
      if (darkTokens.colors.primary) {
        darkTokens.colors.primary = generateDarkColor(darkTokens.colors.primary, 'primary');
      }
      if (darkTokens.colors.secondary) {
        darkTokens.colors.secondary = generateDarkColor(darkTokens.colors.secondary, 'secondary');
      }
      if (darkTokens.colors.accent) {
        darkTokens.colors.accent = generateDarkColor(darkTokens.colors.accent, 'primary');
      }

      // Neutral color scale
      if (darkTokens.colors.neutral) {
        const neutralEntries = Object.entries(darkTokens.colors.neutral);
        const newNeutral: any = {};
        
        neutralEntries.forEach(([key, value]) => {
          if (typeof value === 'string') {
            // Invert the neutral scale for dark mode
            const oppositeKey = String(1000 - parseInt(key));
            newNeutral[key] = generateDarkColor(value, 'neutral');
          }
        });
        
        darkTokens.colors.neutral = newNeutral;
      }

      // Semantic colors
      if (darkTokens.colors.semantic) {
        Object.keys(darkTokens.colors.semantic).forEach(key => {
          const semanticColor = (darkTokens.colors!.semantic as any)[key];
          if (typeof semanticColor === 'string') {
            (darkTokens.colors!.semantic as any)[key] = generateDarkColor(semanticColor, 'semantic');
          }
        });
      }

      // Background and surface colors
      if ('background' in darkTokens.colors) {
        (darkTokens.colors as any).background = '#1a1a1a';
      }
      if ('surface' in darkTokens.colors) {
        (darkTokens.colors as any).surface = '#2a2a2a';
      }
      if ('text' in darkTokens.colors) {
        (darkTokens.colors as any).text = '#f0f0f0';
      }
    }

    // Adjust shadows for dark mode
    if (darkTokens.shadows && settings.softShadows) {
      Object.keys(darkTokens.shadows).forEach(key => {
        const shadow = (darkTokens.shadows as any)[key];
        if (typeof shadow === 'string' && shadow !== 'none') {
          // Make shadows softer and lighter for dark mode
          const softShadow = shadow
            .replace(/rgba?\([^)]+\)/g, (match) => {
              // Reduce opacity and adjust color for dark backgrounds
              return match.includes('rgba') 
                ? match.replace(/,\s*[\d.]+\)/, ', 0.3)')
                : 'rgba(0, 0, 0, 0.5)';
            });
          (darkTokens.shadows as any)[key] = softShadow;
        }
      });
    }

    // Adjust borders if present
    if ('borders' in darkTokens && darkTokens.borders) {
      // Keep border styles and radii the same, but we might adjust colors elsewhere
    }

    return darkTokens;
  };

  // Calculate color mappings and accessibility information
  const calculateColorMappings = (lightTokens: TokenSchema, darkTokens: TokenSchema) => {
    const mappings: Record<string, ColorMapping> = {};

    const processColors = (lightColors: any, darkColors: any, prefix = '') => {
      Object.entries(lightColors).forEach(([key, lightValue]) => {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        
        if (typeof lightValue === 'string' && typeof darkColors[key] === 'string') {
          try {
            const lightColor = chroma(lightValue);
            const darkColor = chroma(darkColors[key]);
            const background = chroma('#1a1a1a'); // Dark background
            
            const contrast = chroma.contrast(darkColor, background);
            const isAccessible = contrast >= CONTRAST_LEVELS.find(level => level.level === settings.contrastLevel)!.ratio;
            
            const suggestions: string[] = [];
            if (!isAccessible) {
              suggestions.push('Increase lightness for better contrast');
              if (contrast < 3) {
                suggestions.push('Consider using a completely different color');
              }
            }

            mappings[fullKey] = {
              lightColor: lightValue,
              darkColor: darkColors[key],
              contrast,
              isAccessible,
              suggestions
            };
          } catch (error) {
            // Skip invalid colors
          }
        } else if (typeof lightValue === 'object' && typeof darkColors[key] === 'object') {
          processColors(lightValue, darkColors[key], fullKey);
        }
      });
    };

    if (lightTokens.colors && darkTokens.colors) {
      processColors(lightTokens.colors, darkTokens.colors, 'colors');
    }

    return mappings;
  };

  // Validate generated tokens
  const validateDarkModeTokens = (tokens: TokenSchema): string[] => {
    const issues: string[] = [];
    const requiredContrast = CONTRAST_LEVELS.find(level => level.level === settings.contrastLevel)!.ratio;

    Object.entries(colorMappings).forEach(([key, mapping]) => {
      if (!mapping.isAccessible) {
        issues.push(`${key}: Contrast ratio ${mapping.contrast.toFixed(2)} below required ${requiredContrast}`);
      }
    });

    return issues;
  };

  // Generate tokens when settings change
  useEffect(() => {
    if (lightTokens) {
      setIsGenerating(true);
      
      // Small delay to show loading state
      setTimeout(() => {
        const darkTokens = generateDarkModeTokens();
        setGeneratedTokens(darkTokens);
        
        const mappings = calculateColorMappings(lightTokens, darkTokens);
        setColorMappings(mappings);
        
        const validation = validateDarkModeTokens(darkTokens);
        setValidationResults(validation);
        
        setIsGenerating(false);
      }, 100);
    }
  }, [lightTokens, settings]);

  const handleSettingChange = (key: keyof DarkModeSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const applyDarkModeTokens = () => {
    if (generatedTokens) {
      onDarkTokensGenerated(generatedTokens);
      onClose();
    }
  };

  const resetSettings = () => {
    setSettings({
      contrastLevel: 'AA',
      saturationAdjustment: 0,
      lightnessStrategy: 'adaptive',
      preserveHue: true,
      enhanceAccents: false,
      softShadows: true,
      customMappings: {}
    });
  };

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div>
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-semibold text-gray-900 flex items-center gap-2"
                    >
                      <MoonIcon className="w-5 h-5" />
                      Dark Mode Generator
                    </Dialog.Title>
                    <p className="text-sm text-gray-600 mt-1">
                      Generate accessible dark theme variants with proper contrast ratios
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {generatedTokens && (
                      <button
                        onClick={applyDarkModeTokens}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        <CheckIcon className="w-4 h-4 mr-2" />
                        Apply Dark Mode
                      </button>
                    )}
                    
                    <button
                      type="button"
                      className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                      onClick={onClose}
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                {/* Tabs */}
                <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
                  <Tab.List className="flex border-b border-gray-200 bg-gray-50">
                    {tabs.map((tab, index) => (
                      <Tab
                        key={tab.id}
                        className={({ selected }) =>
                          `flex-1 px-6 py-4 text-sm font-medium focus:outline-none transition-colors ${
                            selected
                              ? 'border-b-2 border-blue-500 text-blue-600 bg-white'
                              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                          }`
                        }
                      >
                        <div className="flex items-center justify-center gap-2">
                          <tab.icon className="w-4 h-4" />
                          {tab.name}
                        </div>
                      </Tab>
                    ))}
                  </Tab.List>

                  <Tab.Panels className="flex-1 overflow-y-auto max-h-96">
                    {/* Generator Tab */}
                    <Tab.Panel className="p-6">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Generation</h3>
                          <p className="text-sm text-gray-600 mb-4">
                            Generate a dark mode variant of your current theme with smart defaults.
                          </p>
                        </div>

                        {isGenerating ? (
                          <div className="text-center py-8">
                            <SparklesIcon className="w-8 h-8 text-blue-600 mx-auto mb-3 animate-spin" />
                            <p className="text-gray-600">Generating dark mode tokens...</p>
                          </div>
                        ) : generatedTokens ? (
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                              <CheckIcon className="w-5 h-5 text-green-600" />
                              <span className="text-green-800 font-medium">Dark mode tokens generated successfully!</span>
                            </div>

                            {validationResults.length > 0 && (
                              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                  <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />
                                  <span className="font-medium text-yellow-800">Accessibility Warnings</span>
                                </div>
                                <ul className="text-sm text-yellow-700 space-y-1">
                                  {validationResults.map((issue, index) => (
                                    <li key={index}>• {issue}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            <div className="grid grid-cols-3 gap-4">
                              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                                <div className="text-2xl font-bold text-blue-800">
                                  {Object.keys(colorMappings).length}
                                </div>
                                <div className="text-blue-700 text-sm">Colors Generated</div>
                              </div>
                              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                                <div className="text-2xl font-bold text-green-800">
                                  {Object.values(colorMappings).filter(m => m.isAccessible).length}
                                </div>
                                <div className="text-green-700 text-sm">Accessible Colors</div>
                              </div>
                              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg text-center">
                                <div className="text-2xl font-bold text-orange-800">
                                  {validationResults.length}
                                </div>
                                <div className="text-orange-700 text-sm">Issues Found</div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <MoonIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-600">Configure settings and generate dark mode</p>
                          </div>
                        )}
                      </div>
                    </Tab.Panel>

                    {/* Settings Tab */}
                    <Tab.Panel className="p-6">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-4">Generation Settings</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Contrast Level */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Accessibility Level
                            </label>
                            <select
                              value={settings.contrastLevel}
                              onChange={(e) => handleSettingChange('contrastLevel', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              {CONTRAST_LEVELS.map(level => (
                                <option key={level.level} value={level.level}>
                                  {level.name} ({level.ratio}:1)
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Lightness Strategy */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Lightness Strategy
                            </label>
                            <select
                              value={settings.lightnessStrategy}
                              onChange={(e) => handleSettingChange('lightnessStrategy', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              {LIGHTNESS_STRATEGIES.map(strategy => (
                                <option key={strategy.id} value={strategy.id}>
                                  {strategy.name}
                                </option>
                              ))}
                            </select>
                            <p className="text-xs text-gray-500 mt-1">
                              {LIGHTNESS_STRATEGIES.find(s => s.id === settings.lightnessStrategy)?.description}
                            </p>
                          </div>
                        </div>

                        {/* Saturation Adjustment */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Saturation Adjustment: {settings.saturationAdjustment}%
                          </label>
                          <input
                            type="range"
                            min="-50"
                            max="50"
                            value={settings.saturationAdjustment}
                            onChange={(e) => handleSettingChange('saturationAdjustment', parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Less Saturated</span>
                            <span>More Saturated</span>
                          </div>
                        </div>

                        {/* Checkboxes */}
                        <div className="space-y-4">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="preserveHue"
                              checked={settings.preserveHue}
                              onChange={(e) => handleSettingChange('preserveHue', e.target.checked)}
                              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            />
                            <label htmlFor="preserveHue" className="ml-2 text-sm text-gray-700">
                              Preserve color hues (recommended)
                            </label>
                          </div>

                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="enhanceAccents"
                              checked={settings.enhanceAccents}
                              onChange={(e) => handleSettingChange('enhanceAccents', e.target.checked)}
                              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            />
                            <label htmlFor="enhanceAccents" className="ml-2 text-sm text-gray-700">
                              Enhance accent colors for dark backgrounds
                            </label>
                          </div>

                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="softShadows"
                              checked={settings.softShadows}
                              onChange={(e) => handleSettingChange('softShadows', e.target.checked)}
                              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            />
                            <label htmlFor="softShadows" className="ml-2 text-sm text-gray-700">
                              Generate softer shadows for dark mode
                            </label>
                          </div>
                        </div>

                        {/* Reset Button */}
                        <div className="pt-4 border-t">
                          <button
                            onClick={resetSettings}
                            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                          >
                            <ArrowPathIcon className="w-4 h-4 mr-2" />
                            Reset to Defaults
                          </button>
                        </div>
                      </div>
                    </Tab.Panel>

                    {/* Preview Tab */}
                    <Tab.Panel className="p-6">
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-gray-900">Theme Preview</h3>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setPreviewMode('light')}
                              className={`p-2 rounded-md ${previewMode === 'light' ? 'bg-yellow-100 text-yellow-700' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                              <SunIcon className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => setPreviewMode('dark')}
                              className={`p-2 rounded-md ${previewMode === 'dark' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                              <MoonIcon className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => setPreviewMode('comparison')}
                              className={`p-2 rounded-md ${previewMode === 'comparison' ? 'bg-blue-100 text-blue-700' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                              <SwatchIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        {/* Color Comparison */}
                        {generatedTokens && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {previewMode !== 'dark' && (
                              <div className="p-4 bg-white border border-gray-200 rounded-lg">
                                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                                  <SunIcon className="w-4 h-4" />
                                  Light Theme
                                </h4>
                                <div className="space-y-2">
                                  {Object.entries(lightTokens.colors || {}).slice(0, 5).map(([key, value]) => (
                                    <div key={key} className="flex items-center gap-3">
                                      <div
                                        className="w-6 h-6 rounded border border-gray-300"
                                        style={{ backgroundColor: typeof value === 'string' ? value : '#ccc' }}
                                      />
                                      <span className="text-sm text-gray-700 capitalize">{key}</span>
                                      <span className="text-xs font-mono text-gray-500">
                                        {typeof value === 'string' ? value : 'object'}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {previewMode !== 'light' && (
                              <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg">
                                <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                                  <MoonIcon className="w-4 h-4" />
                                  Dark Theme
                                </h4>
                                <div className="space-y-2">
                                  {Object.entries(generatedTokens.colors || {}).slice(0, 5).map(([key, value]) => (
                                    <div key={key} className="flex items-center gap-3">
                                      <div
                                        className="w-6 h-6 rounded border border-gray-600"
                                        style={{ backgroundColor: typeof value === 'string' ? value : '#ccc' }}
                                      />
                                      <span className="text-sm text-gray-200 capitalize">{key}</span>
                                      <span className="text-xs font-mono text-gray-400">
                                        {typeof value === 'string' ? value : 'object'}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </Tab.Panel>

                    {/* Accessibility Tab */}
                    <Tab.Panel className="p-6">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-4">Accessibility Analysis</h3>
                          <p className="text-sm text-gray-600 mb-4">
                            Review contrast ratios and accessibility compliance for generated colors.
                          </p>
                        </div>

                        {Object.keys(colorMappings).length > 0 ? (
                          <div className="space-y-3">
                            {Object.entries(colorMappings).map(([key, mapping]) => (
                              <div
                                key={key}
                                className={`p-4 border rounded-lg ${
                                  mapping.isAccessible 
                                    ? 'border-green-200 bg-green-50' 
                                    : 'border-red-200 bg-red-50'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium text-gray-900">{key}</span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600">
                                      {mapping.contrast.toFixed(2)}:1
                                    </span>
                                    {mapping.isAccessible ? (
                                      <CheckIcon className="w-4 h-4 text-green-600" />
                                    ) : (
                                      <ExclamationTriangleIcon className="w-4 h-4 text-red-600" />
                                    )}
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-4 mb-2">
                                  <div className="flex items-center gap-2">
                                    <div
                                      className="w-4 h-4 rounded border border-gray-300"
                                      style={{ backgroundColor: mapping.lightColor }}
                                    />
                                    <span className="text-xs font-mono">{mapping.lightColor}</span>
                                  </div>
                                  <span className="text-gray-400">→</span>
                                  <div className="flex items-center gap-2">
                                    <div
                                      className="w-4 h-4 rounded border border-gray-300"
                                      style={{ backgroundColor: mapping.darkColor }}
                                    />
                                    <span className="text-xs font-mono">{mapping.darkColor}</span>
                                  </div>
                                </div>

                                {mapping.suggestions.length > 0 && (
                                  <div className="text-xs text-gray-600">
                                    <strong>Suggestions:</strong> {mapping.suggestions.join(', ')}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <LightBulbIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-600">Generate dark mode tokens to see accessibility analysis</p>
                          </div>
                        )}
                      </div>
                    </Tab.Panel>
                  </Tab.Panels>
                </Tab.Group>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};