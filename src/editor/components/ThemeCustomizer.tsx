'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, Transition, Tab } from '@headlessui/react';
import { 
  SwatchIcon, 
  XMarkIcon, 
  EyeIcon, 
  CheckIcon,
  ArrowPathIcon,
  DocumentArrowDownIcon,
  PaintBrushIcon,
  AdjustmentsHorizontalIcon,
  SparklesIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline';
import { HexColorPicker } from 'react-colorful';
import chroma from 'chroma-js';
import type { 
  ThemeCustomization, 
  TokenUpdate 
} from '../types/theme';
import { useThemes } from '../hooks/useThemes';

interface ThemeCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: string;
  onTokenUpdate: (update: TokenUpdate) => void;
  onSaveCustomTheme: (customization: ThemeCustomization) => void;
}

interface ColorControl {
  id: string;
  label: string;
  description: string;
  tokenPath: string;
  value: string;
}

interface TypographyControl {
  id: string;
  label: string;
  type: 'font-family' | 'font-size' | 'font-weight' | 'line-height';
  tokenPath: string;
  value: string | number;
  options?: { label: string; value: string | number }[];
}

interface SpacingControl {
  id: string;
  label: string;
  tokenPath: string;
  value: string;
  min: number;
  max: number;
  step: number;
  unit: 'px' | 'rem' | 'em';
}

export const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onTokenUpdate,
  onSaveCustomTheme
}) => {
  const { themes, getCurrentTheme } = useThemes();
  const [activeTab, setActiveTab] = useState(0);
  const [customName, setCustomName] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Color controls state
  const [colorControls, setColorControls] = useState<ColorControl[]>([
    {
      id: 'primary',
      label: 'Primary Color',
      description: 'Main brand color used for buttons and accents',
      tokenPath: 'colors.primary',
      value: '#B38E6A'
    },
    {
      id: 'secondary',
      label: 'Secondary Color',
      description: 'Supporting color for text and borders',
      tokenPath: 'colors.secondary',
      value: '#534931'
    },
    {
      id: 'accent',
      label: 'Accent Color',
      description: 'Highlight color for special elements',
      tokenPath: 'colors.accent',
      value: '#E5DCD2'
    },
    {
      id: 'background',
      label: 'Background Color',
      description: 'Main page background color',
      tokenPath: 'colors.background',
      value: '#FFFFFF'
    },
    {
      id: 'surface',
      label: 'Surface Color',
      description: 'Cards and elevated surface color',
      tokenPath: 'colors.surface',
      value: '#F7F7F7'
    }
  ]);

  // Typography controls state
  const [typographyControls, setTypographyControls] = useState<TypographyControl[]>([
    {
      id: 'font-sans',
      label: 'Sans-serif Font',
      type: 'font-family',
      tokenPath: 'typography.fontFamily.sans',
      value: 'Montserrat',
      options: [
        { label: 'Montserrat', value: 'Montserrat' },
        { label: 'Inter', value: 'Inter' },
        { label: 'Roboto', value: 'Roboto' },
        { label: 'Open Sans', value: 'Open Sans' },
        { label: 'Lato', value: 'Lato' },
        { label: 'Poppins', value: 'Poppins' }
      ]
    },
    {
      id: 'font-serif',
      label: 'Serif Font',
      type: 'font-family',
      tokenPath: 'typography.fontFamily.serif',
      value: 'Raleway',
      options: [
        { label: 'Raleway', value: 'Raleway' },
        { label: 'Playfair Display', value: 'Playfair Display' },
        { label: 'Merriweather', value: 'Merriweather' },
        { label: 'Lora', value: 'Lora' },
        { label: 'Crimson Text', value: 'Crimson Text' }
      ]
    },
    {
      id: 'font-size-base',
      label: 'Base Font Size',
      type: 'font-size',
      tokenPath: 'typography.fontSize.base',
      value: '1rem'
    },
    {
      id: 'font-size-lg',
      label: 'Large Font Size',
      type: 'font-size',
      tokenPath: 'typography.fontSize.lg',
      value: '1.125rem'
    },
    {
      id: 'line-height-normal',
      label: 'Normal Line Height',
      type: 'line-height',
      tokenPath: 'typography.lineHeight.normal',
      value: '1.5'
    }
  ]);

  // Spacing controls state
  const [spacingControls, setSpacingControls] = useState<SpacingControl[]>([
    {
      id: 'space-sm',
      label: 'Small Spacing',
      tokenPath: 'spacing.sm',
      value: '0.5rem',
      min: 0.25,
      max: 2,
      step: 0.125,
      unit: 'rem'
    },
    {
      id: 'space-md',
      label: 'Medium Spacing',
      tokenPath: 'spacing.md',
      value: '1rem',
      min: 0.5,
      max: 4,
      step: 0.25,
      unit: 'rem'
    },
    {
      id: 'space-lg',
      label: 'Large Spacing',
      tokenPath: 'spacing.lg',
      value: '1.5rem',
      min: 1,
      max: 6,
      step: 0.25,
      unit: 'rem'
    },
    {
      id: 'space-xl',
      label: 'Extra Large Spacing',
      tokenPath: 'spacing.xl',
      value: '2rem',
      min: 1.5,
      max: 8,
      step: 0.5,
      unit: 'rem'
    }
  ]);

  const tabs = [
    { 
      id: 'colors', 
      name: 'Colors', 
      icon: SwatchIcon,
      description: 'Customize brand colors and theme palette'
    },
    { 
      id: 'typography', 
      name: 'Typography', 
      icon: PaintBrushIcon,
      description: 'Adjust fonts, sizes, and text styling'
    },
    { 
      id: 'spacing', 
      name: 'Spacing', 
      icon: AdjustmentsHorizontalIcon,
      description: 'Control padding, margins, and layout spacing'
    },
    { 
      id: 'advanced', 
      name: 'Advanced', 
      icon: SparklesIcon,
      description: 'Advanced theming options and effects'
    }
  ];

  // Load current theme tokens on open
  useEffect(() => {
    if (isOpen && currentTheme) {
      loadThemeTokens(currentTheme);
    }
  }, [isOpen, currentTheme]);

  const loadThemeTokens = async (themeId: string) => {
    try {
      const response = await fetch(`/skins/${themeId}/tokens.json`);
      if (response.ok) {
        const tokens = await response.json();
        updateControlsFromTokens(tokens);
      }
    } catch (error) {
      console.error('Failed to load theme tokens:', error);
    }
  };

  const updateControlsFromTokens = (tokens: any) => {
    // Update color controls
    setColorControls(prev => prev.map(control => ({
      ...control,
      value: getNestedValue(tokens, control.tokenPath) || control.value
    })));

    // Update typography controls
    setTypographyControls(prev => prev.map(control => ({
      ...control,
      value: getNestedValue(tokens, control.tokenPath) || control.value
    })));

    // Update spacing controls
    setSpacingControls(prev => prev.map(control => ({
      ...control,
      value: getNestedValue(tokens, control.tokenPath) || control.value
    })));
  };

  const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  const handleColorChange = (controlId: string, newValue: string) => {
    setColorControls(prev => prev.map(control => 
      control.id === controlId 
        ? { ...control, value: newValue }
        : control
    ));

    const control = colorControls.find(c => c.id === controlId);
    if (control) {
      onTokenUpdate({
        category: 'colors',
        key: control.tokenPath.split('.').pop() || controlId,
        value: newValue,
        timestamp: Date.now()
      });
    }

    setHasUnsavedChanges(true);
    applyLivePreview();
  };

  const handleTypographyChange = (controlId: string, newValue: string | number) => {
    setTypographyControls(prev => prev.map(control => 
      control.id === controlId 
        ? { ...control, value: newValue }
        : control
    ));

    const control = typographyControls.find(c => c.id === controlId);
    if (control) {
      onTokenUpdate({
        category: 'typography',
        key: control.tokenPath.split('.').pop() || controlId,
        value: newValue,
        timestamp: Date.now()
      });
    }

    setHasUnsavedChanges(true);
    applyLivePreview();
  };

  const handleSpacingChange = (controlId: string, newValue: number) => {
    const control = spacingControls.find(c => c.id === controlId);
    if (!control) return;

    const valueWithUnit = `${newValue}${control.unit}`;
    
    setSpacingControls(prev => prev.map(c => 
      c.id === controlId 
        ? { ...c, value: valueWithUnit }
        : c
    ));

    onTokenUpdate({
      category: 'spacing',
      key: control.tokenPath.split('.').pop() || controlId,
      value: valueWithUnit,
      timestamp: Date.now()
    });

    setHasUnsavedChanges(true);
    applyLivePreview();
  };

  const applyLivePreview = () => {
    if (!previewMode) return;

    // Apply CSS variables for live preview
    const root = document.documentElement;
    
    colorControls.forEach(control => {
      root.style.setProperty(`--color-${control.id}`, control.value);
    });

    typographyControls.forEach(control => {
      const varName = control.tokenPath.replace(/\./g, '-');
      root.style.setProperty(`--${varName}`, control.value.toString());
    });

    spacingControls.forEach(control => {
      const varName = control.tokenPath.replace(/\./g, '-');
      root.style.setProperty(`--${varName}`, control.value);
    });
  };

  const togglePreviewMode = () => {
    setPreviewMode(!previewMode);
    if (!previewMode) {
      applyLivePreview();
    } else {
      // Reset live preview
      const root = document.documentElement;
      [...colorControls, ...spacingControls].forEach(control => {
        const varName = control.tokenPath.replace(/\./g, '-');
        root.style.removeProperty(`--${varName}`);
      });
    }
  };

  const resetToDefaults = () => {
    if (currentTheme) {
      loadThemeTokens(currentTheme);
      setHasUnsavedChanges(false);
    }
  };

  const handleSaveCustomTheme = () => {
    if (!customName.trim()) {
      alert('Please enter a name for your custom theme');
      return;
    }

    const customization: ThemeCustomization = {
      id: `custom-${Date.now()}`,
      themeId: currentTheme,
      name: customName.trim(),
      description: `Custom theme based on ${currentTheme}`,
      customTokens: {
        colors: Object.fromEntries(
          colorControls.map(c => [c.id, c.value])
        ),
        typography: Object.fromEntries(
          typographyControls.map(c => [c.tokenPath.split('.').pop() || c.id, c.value])
        ),
        spacing: Object.fromEntries(
          spacingControls.map(c => [c.tokenPath.split('.').pop() || c.id, c.value])
        )
      },
      componentSettings: [],
      responsiveSettings: {
        mobile: { hidden: [], styles: {} },
        tablet: { hidden: [], styles: {} },
        desktop: { hidden: [], styles: {} }
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSaveCustomTheme(customization);
    setHasUnsavedChanges(false);
    setCustomName('');
  };

  const generateColorVariants = (baseColor: string) => {
    try {
      const color = chroma(baseColor);
      return {
        lighter: color.brighten(1).hex(),
        light: color.brighten(0.5).hex(),
        base: baseColor,
        dark: color.darken(0.5).hex(),
        darker: color.darken(1).hex()
      };
    } catch {
      return null;
    }
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
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div>
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-semibold text-gray-900 flex items-center gap-2"
                    >
                      <AdjustmentsHorizontalIcon className="w-5 h-5" />
                      Theme Customizer
                    </Dialog.Title>
                    <p className="text-sm text-gray-600 mt-1">
                      Customize colors, typography, and spacing for {currentTheme}
                      {hasUnsavedChanges && (
                        <span className="ml-2 text-orange-600">• Unsaved changes</span>
                      )}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {/* Preview Toggle */}
                    <button
                      type="button"
                      onClick={togglePreviewMode}
                      className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        previewMode
                          ? 'bg-blue-100 text-blue-700 border border-blue-300'
                          : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      <EyeIcon className="w-4 h-4 mr-1" />
                      {previewMode ? 'Live Preview On' : 'Enable Preview'}
                    </button>
                    
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
                    {/* Colors Tab */}
                    <Tab.Panel className="p-6">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">Brand Colors</h3>
                          <p className="text-sm text-gray-600 mb-4">
                            Customize your theme's color palette to match your brand.
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {colorControls.map((control) => {
                            const variants = generateColorVariants(control.value);
                            
                            return (
                              <div key={control.id} className="space-y-3">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700">
                                    {control.label}
                                  </label>
                                  <p className="text-xs text-gray-500">{control.description}</p>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                  <div className="relative">
                                    <HexColorPicker
                                      color={control.value}
                                      onChange={(color) => handleColorChange(control.id, color)}
                                      style={{ width: '120px', height: '120px' }}
                                    />
                                  </div>
                                  
                                  <div className="flex-1 space-y-2">
                                    <input
                                      type="text"
                                      value={control.value}
                                      onChange={(e) => handleColorChange(control.id, e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                                      placeholder="#000000"
                                    />
                                    
                                    {variants && (
                                      <div className="flex gap-1">
                                        {Object.entries(variants).map(([variant, color]) => (
                                          <button
                                            key={variant}
                                            onClick={() => handleColorChange(control.id, color)}
                                            className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                                            style={{ backgroundColor: color }}
                                            title={`${variant}: ${color}`}
                                          />
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </Tab.Panel>

                    {/* Typography Tab */}
                    <Tab.Panel className="p-6">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">Typography Settings</h3>
                          <p className="text-sm text-gray-600 mb-4">
                            Adjust fonts, sizes, and text styling to enhance readability.
                          </p>
                        </div>
                        
                        <div className="space-y-6">
                          {typographyControls.map((control) => (
                            <div key={control.id} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  {control.label}
                                </label>
                                
                                {control.type === 'font-family' && control.options ? (
                                  <select
                                    value={control.value}
                                    onChange={(e) => handleTypographyChange(control.id, e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  >
                                    {control.options.map((option) => (
                                      <option key={option.value} value={option.value}>
                                        {option.label}
                                      </option>
                                    ))}
                                  </select>
                                ) : (
                                  <input
                                    type="text"
                                    value={control.value}
                                    onChange={(e) => handleTypographyChange(control.id, e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  />
                                )}
                              </div>
                              
                              <div className="flex items-end">
                                <div 
                                  className="text-lg p-3 border border-gray-200 rounded-md bg-gray-50 w-full"
                                  style={{
                                    fontFamily: control.type === 'font-family' ? control.value.toString() : undefined,
                                    fontSize: control.type === 'font-size' ? control.value.toString() : undefined,
                                    lineHeight: control.type === 'line-height' ? control.value.toString() : undefined
                                  }}
                                >
                                  Sample Text Preview
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Tab.Panel>

                    {/* Spacing Tab */}
                    <Tab.Panel className="p-6">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">Spacing Controls</h3>
                          <p className="text-sm text-gray-600 mb-4">
                            Adjust padding, margins, and layout spacing for better visual hierarchy.
                          </p>
                        </div>
                        
                        <div className="space-y-6">
                          {spacingControls.map((control) => {
                            const numericValue = parseFloat(control.value);
                            
                            return (
                              <div key={control.id} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {control.label}
                                  </label>
                                  
                                  <div className="space-y-2">
                                    <input
                                      type="range"
                                      min={control.min}
                                      max={control.max}
                                      step={control.step}
                                      value={numericValue}
                                      onChange={(e) => handleSpacingChange(control.id, parseFloat(e.target.value))}
                                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                    
                                    <div className="flex items-center gap-2">
                                      <input
                                        type="number"
                                        min={control.min}
                                        max={control.max}
                                        step={control.step}
                                        value={numericValue}
                                        onChange={(e) => handleSpacingChange(control.id, parseFloat(e.target.value))}
                                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                                      />
                                      <span className="text-sm text-gray-500">{control.unit}</span>
                                      <span className="text-sm font-mono text-gray-700">{control.value}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-end">
                                  <div className="w-full p-3 border border-gray-200 rounded-md bg-gray-50">
                                    <div 
                                      className="bg-blue-100 border border-blue-300 rounded"
                                      style={{
                                        padding: control.value,
                                        minHeight: '40px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                      }}
                                    >
                                      <span className="text-xs text-blue-700">
                                        {control.value} padding
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </Tab.Panel>

                    {/* Advanced Tab */}
                    <Tab.Panel className="p-6">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">Advanced Options</h3>
                          <p className="text-sm text-gray-600 mb-4">
                            Save your customizations or reset to defaults.
                          </p>
                        </div>
                        
                        <div className="space-y-4">
                          {/* Save Custom Theme */}
                          <div className="p-4 border border-gray-200 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">Save Custom Theme</h4>
                            <p className="text-sm text-gray-600 mb-3">
                              Save your customizations as a new theme for future use.
                            </p>
                            <div className="flex gap-3">
                              <input
                                type="text"
                                value={customName}
                                onChange={(e) => setCustomName(e.target.value)}
                                placeholder="Enter theme name..."
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                              <button
                                onClick={handleSaveCustomTheme}
                                disabled={!customName.trim() || !hasUnsavedChanges}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <BookmarkIcon className="w-4 h-4 mr-2" />
                                Save Theme
                              </button>
                            </div>
                          </div>
                          
                          {/* Reset Options */}
                          <div className="p-4 border border-gray-200 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">Reset Options</h4>
                            <p className="text-sm text-gray-600 mb-3">
                              Restore default values or export your current settings.
                            </p>
                            <div className="flex gap-3">
                              <button
                                onClick={resetToDefaults}
                                className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                              >
                                <ArrowPathIcon className="w-4 h-4 mr-2" />
                                Reset to Defaults
                              </button>
                              <button
                                onClick={() => {/* TODO: Implement export */}}
                                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                              >
                                <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
                                Export Settings
                              </button>
                            </div>
                          </div>
                        </div>
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