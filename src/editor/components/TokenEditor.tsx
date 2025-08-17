'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Dialog, Transition, Tab, Combobox } from '@headlessui/react';
import { 
  CogIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  CheckIcon,
  ArrowPathIcon,
  DocumentDuplicateIcon,
  TrashIcon,
  PlusIcon,
  FunnelIcon,
  EyeIcon,
  EyeSlashIcon,
  ChevronRightIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { HexColorPicker } from 'react-colorful';
import chroma from 'chroma-js';
import type { 
  TokenSchema,
  TokenCategory,
  TokenEditOperation,
  TokenValidationResult,
  TokenValidationError,
  TokenFilter,
  TokenPreview
} from '../types/tokens';

interface TokenEditorProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: string;
  tokens: TokenSchema;
  onTokensUpdate: (tokens: TokenSchema) => void;
  onSaveTokens: () => void;
}

interface FlattenedToken {
  path: string;
  value: any;
  type: string;
  category: string;
  description?: string;
  cssProperty?: string;
}

export const TokenEditor: React.FC<TokenEditorProps> = ({
  isOpen,
  onClose,
  currentTheme,
  tokens,
  onTokensUpdate,
  onSaveTokens
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<any>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [validationErrors, setValidationErrors] = useState<TokenValidationError[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['colors']));
  const [showPreview, setShowPreview] = useState(true);
  const [tokenHistory, setTokenHistory] = useState<TokenEditOperation[]>([]);

  // Define token categories with metadata
  const tokenCategories: TokenCategory[] = [
    {
      id: 'colors',
      name: 'Colors',
      description: 'Brand colors, semantic colors, and neutral scales',
      icon: 'SwatchIcon',
      tokens: tokens.colors || {}
    },
    {
      id: 'typography',
      name: 'Typography',
      description: 'Font families, sizes, weights, and text styling',
      icon: 'PaintBrushIcon',
      tokens: tokens.typography || {}
    },
    {
      id: 'spacing',
      name: 'Spacing',
      description: 'Padding, margins, and layout spacing values',
      icon: 'AdjustmentsHorizontalIcon',
      tokens: tokens.spacing || {}
    },
    {
      id: 'shadows',
      name: 'Shadows',
      description: 'Box shadows and elevation effects',
      icon: 'SparklesIcon',
      tokens: tokens.shadows || {}
    },
    {
      id: 'borders',
      name: 'Borders',
      description: 'Border radius, width, and style properties',
      icon: 'Square3Stack3DIcon',
      tokens: tokens.borders || {}
    },
    {
      id: 'layout',
      name: 'Layout',
      description: 'Breakpoints, max widths, and layout constraints',
      icon: 'RectangleGroupIcon',
      tokens: tokens.layout || {}
    },
    {
      id: 'animations',
      name: 'Animations',
      description: 'Duration, easing, and keyframe definitions',
      icon: 'PlayIcon',
      tokens: tokens.animations || {}
    }
  ];

  const tabs = [
    { 
      id: 'browser', 
      name: 'Token Browser',
      description: 'Browse and edit design tokens by category'
    },
    { 
      id: 'validation', 
      name: 'Validation',
      description: 'Validate token structure and values'
    },
    { 
      id: 'preview', 
      name: 'Live Preview',
      description: 'Preview token changes in real-time'
    },
    { 
      id: 'export', 
      name: 'Export/Import',
      description: 'Export tokens or import from file'
    }
  ];

  // Flatten tokens for searching and filtering
  const flattenedTokens = useMemo(() => {
    const flatten = (obj: any, prefix = '', category = ''): FlattenedToken[] => {
      const result: FlattenedToken[] = [];
      
      for (const [key, value] of Object.entries(obj)) {
        const path = prefix ? `${prefix}.${key}` : key;
        
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          result.push(...flatten(value, path, category || key));
        } else {
          result.push({
            path,
            value,
            type: getTokenType(value),
            category: category || key,
            cssProperty: getCSSProperty(path),
            description: getTokenDescription(path)
          });
        }
      }
      
      return result;
    };

    return flatten(tokens);
  }, [tokens]);

  // Filter tokens based on search and category
  const filteredTokens = useMemo(() => {
    let filtered = flattenedTokens;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(token => 
        token.path.toLowerCase().includes(query) ||
        token.category.toLowerCase().includes(query) ||
        token.value?.toString().toLowerCase().includes(query)
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(token => token.category === selectedCategory);
    }

    return filtered;
  }, [flattenedTokens, searchQuery, selectedCategory]);

  const getTokenType = (value: any): string => {
    if (typeof value === 'string') {
      if (value.match(/^#[0-9A-Fa-f]{6}$/)) return 'color';
      if (value.match(/^\d+(\.\d+)?(px|rem|em|%|vw|vh)$/)) return 'size';
      if (value.includes(',')) return 'font';
      return 'string';
    }
    if (typeof value === 'number') return 'number';
    if (Array.isArray(value)) return 'array';
    return 'object';
  };

  const getCSSProperty = (path: string): string => {
    const propertyMap: Record<string, string> = {
      'colors.primary': 'color',
      'colors.secondary': 'color',
      'colors.accent': 'color',
      'spacing.sm': 'padding',
      'spacing.md': 'padding',
      'spacing.lg': 'padding',
      'typography.fontSize': 'font-size',
      'typography.fontWeight': 'font-weight',
      'shadows.sm': 'box-shadow',
      'shadows.md': 'box-shadow',
      'borders.radius': 'border-radius'
    };
    
    return propertyMap[path] || 'custom-property';
  };

  const getTokenDescription = (path: string): string => {
    const descriptions: Record<string, string> = {
      'colors.primary': 'Primary brand color used for buttons and links',
      'colors.secondary': 'Secondary color for supporting elements',
      'colors.accent': 'Accent color for highlights and emphasis',
      'spacing.sm': 'Small spacing for tight layouts',
      'spacing.md': 'Medium spacing for standard layouts',
      'spacing.lg': 'Large spacing for loose layouts',
      'typography.fontSize.base': 'Base font size for body text',
      'shadows.sm': 'Small shadow for subtle elevation',
      'borders.radius.md': 'Medium border radius for rounded corners'
    };
    
    return descriptions[path] || '';
  };

  const validateTokens = (): TokenValidationResult => {
    const errors: TokenValidationError[] = [];
    
    // Validate color format
    flattenedTokens.forEach(token => {
      if (token.type === 'color') {
        try {
          chroma(token.value);
        } catch {
          errors.push({
            path: token.path,
            message: 'Invalid color format',
            value: token.value,
            expected: 'Valid hex, rgb, or named color'
          });
        }
      }
      
      // Validate size format
      if (token.type === 'size' && typeof token.value === 'string') {
        if (!token.value.match(/^\d+(\.\d+)?(px|rem|em|%|vw|vh)$/)) {
          errors.push({
            path: token.path,
            message: 'Invalid size format',
            value: token.value,
            expected: 'Number with unit (px, rem, em, %, vw, vh)'
          });
        }
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings: []
    };
  };

  const updateToken = (path: string, newValue: any) => {
    const pathParts = path.split('.');
    const newTokens = JSON.parse(JSON.stringify(tokens));
    
    let current = newTokens;
    for (let i = 0; i < pathParts.length - 1; i++) {
      if (!current[pathParts[i]]) {
        current[pathParts[i]] = {};
      }
      current = current[pathParts[i]];
    }
    
    const oldValue = current[pathParts[pathParts.length - 1]];
    current[pathParts[pathParts.length - 1]] = newValue;
    
    // Add to history
    const operation: TokenEditOperation = {
      type: 'set',
      path,
      value: newValue,
      timestamp: Date.now()
    };
    setTokenHistory(prev => [...prev.slice(-19), operation]);
    
    onTokensUpdate(newTokens);
    setHasUnsavedChanges(true);
    
    // Validate after update
    const validation = validateTokens();
    setValidationErrors(validation.errors);
  };

  const deleteToken = (path: string) => {
    const pathParts = path.split('.');
    const newTokens = JSON.parse(JSON.stringify(tokens));
    
    let current = newTokens;
    for (let i = 0; i < pathParts.length - 1; i++) {
      current = current[pathParts[i]];
    }
    
    delete current[pathParts[pathParts.length - 1]];
    
    const operation: TokenEditOperation = {
      type: 'delete',
      path,
      timestamp: Date.now()
    };
    setTokenHistory(prev => [...prev.slice(-19), operation]);
    
    onTokensUpdate(newTokens);
    setHasUnsavedChanges(true);
  };

  const duplicateToken = (path: string) => {
    const token = flattenedTokens.find(t => t.path === path);
    if (!token) return;
    
    const newPath = `${path}_copy`;
    updateToken(newPath, token.value);
  };

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const renderTokenValue = (token: FlattenedToken) => {
    const { type, value, path } = token;
    const isSelected = selectedToken === path;
    const isEditing = editingValue !== null && selectedToken === path;

    return (
      <div
        key={path}
        className={`group flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer hover:bg-gray-50 ${
          isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
        }`}
        onClick={() => setSelectedToken(isSelected ? null : path)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900 truncate">{path.split('.').pop()}</span>
            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
              {type}
            </span>
          </div>
          <div className="text-sm text-gray-500 truncate">{path}</div>
          {token.description && (
            <div className="text-xs text-gray-400 mt-1">{token.description}</div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Value Preview */}
          <div className="flex items-center gap-2">
            {type === 'color' && (
              <div
                className="w-6 h-6 rounded border border-gray-300"
                style={{ backgroundColor: value }}
                title={value}
              />
            )}
            <span className="font-mono text-sm text-gray-700 max-w-32 truncate">
              {Array.isArray(value) ? value.join(', ') : value.toString()}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedToken(path);
                setEditingValue(value);
              }}
              className="p-1 text-gray-400 hover:text-blue-600 rounded"
              title="Edit token"
            >
              <CogIcon className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                duplicateToken(path);
              }}
              className="p-1 text-gray-400 hover:text-green-600 rounded"
              title="Duplicate token"
            >
              <DocumentDuplicateIcon className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Delete token "${path}"?`)) {
                  deleteToken(path);
                }
              }}
              className="p-1 text-gray-400 hover:text-red-600 rounded"
              title="Delete token"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Inline Editor */}
        {isEditing && (
          <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">Edit {path}</h4>
                <button
                  onClick={() => {
                    setEditingValue(null);
                    setSelectedToken(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>

              {type === 'color' ? (
                <div className="space-y-3">
                  <HexColorPicker
                    color={editingValue}
                    onChange={setEditingValue}
                  />
                  <input
                    type="text"
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
                    placeholder="#000000"
                  />
                </div>
              ) : type === 'array' ? (
                <textarea
                  value={Array.isArray(editingValue) ? editingValue.join('\n') : editingValue}
                  onChange={(e) => setEditingValue(e.target.value.split('\n'))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
                  rows={4}
                  placeholder="One item per line"
                />
              ) : (
                <input
                  type={type === 'number' ? 'number' : 'text'}
                  value={editingValue}
                  onChange={(e) => setEditingValue(type === 'number' ? parseFloat(e.target.value) : e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
                  placeholder="Enter value..."
                />
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    updateToken(path, editingValue);
                    setEditingValue(null);
                    setSelectedToken(null);
                  }}
                  className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingValue(null);
                    setSelectedToken(null);
                  }}
                  className="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const exportTokens = () => {
    const blob = new Blob([JSON.stringify(tokens, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentTheme}-tokens.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Validate tokens on mount and token changes
  useEffect(() => {
    const validation = validateTokens();
    setValidationErrors(validation.errors);
  }, [tokens]);

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
              <Dialog.Panel className="w-full max-w-6xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div>
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-semibold text-gray-900 flex items-center gap-2"
                    >
                      <CogIcon className="w-5 h-5" />
                      Advanced Token Editor
                    </Dialog.Title>
                    <p className="text-sm text-gray-600 mt-1">
                      Advanced design token editing for {currentTheme}
                      {hasUnsavedChanges && (
                        <span className="ml-2 text-orange-600">• Unsaved changes</span>
                      )}
                      {validationErrors.length > 0 && (
                        <span className="ml-2 text-red-600">• {validationErrors.length} validation errors</span>
                      )}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowPreview(!showPreview)}
                      className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        showPreview
                          ? 'bg-blue-100 text-blue-700 border border-blue-300'
                          : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      {showPreview ? <EyeIcon className="w-4 h-4 mr-1" /> : <EyeSlashIcon className="w-4 h-4 mr-1" />}
                      {showPreview ? 'Hide Preview' : 'Show Preview'}
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
                        <div className="text-center">
                          <div className="font-medium">{tab.name}</div>
                          <div className="text-xs text-gray-500 mt-1">{tab.description}</div>
                        </div>
                      </Tab>
                    ))}
                  </Tab.List>

                  <Tab.Panels className="flex-1 overflow-y-auto max-h-96">
                    {/* Token Browser Tab */}
                    <Tab.Panel className="p-6">
                      <div className="space-y-4">
                        {/* Search and Filters */}
                        <div className="flex items-center gap-4">
                          <div className="flex-1 relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                              type="text"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder="Search tokens..."
                              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          
                          <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="all">All Categories</option>
                            {tokenCategories.map(category => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Token Categories */}
                        <div className="space-y-4">
                          {tokenCategories
                            .filter(category => selectedCategory === 'all' || selectedCategory === category.id)
                            .map(category => {
                              const categoryTokens = filteredTokens.filter(token => 
                                token.category === category.id
                              );
                              
                              if (categoryTokens.length === 0) return null;
                              
                              const isExpanded = expandedCategories.has(category.id);
                              
                              return (
                                <div key={category.id} className="border border-gray-200 rounded-lg">
                                  <button
                                    onClick={() => toggleCategory(category.id)}
                                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="flex items-center gap-2">
                                        {isExpanded ? (
                                          <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                                        ) : (
                                          <ChevronRightIcon className="w-4 h-4 text-gray-500" />
                                        )}
                                        <h3 className="font-medium text-gray-900">{category.name}</h3>
                                      </div>
                                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                                        {categoryTokens.length} tokens
                                      </span>
                                    </div>
                                  </button>
                                  
                                  {isExpanded && (
                                    <div className="p-4 pt-0 space-y-2">
                                      <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                                      <div className="space-y-2 relative">
                                        {categoryTokens.map(token => renderTokenValue(token))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </Tab.Panel>

                    {/* Validation Tab */}
                    <Tab.Panel className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-gray-900">Token Validation</h3>
                          <button
                            onClick={() => {
                              const validation = validateTokens();
                              setValidationErrors(validation.errors);
                            }}
                            className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            <ArrowPathIcon className="w-4 h-4 mr-2" />
                            Re-validate
                          </button>
                        </div>

                        {validationErrors.length === 0 ? (
                          <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <CheckIcon className="w-5 h-5 text-green-600" />
                            <span className="text-green-800 font-medium">All tokens are valid!</span>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {validationErrors.map((error, index) => (
                              <div
                                key={index}
                                className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg"
                              >
                                <ExclamationTriangleIcon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                  <div className="font-medium text-red-800">{error.path}</div>
                                  <div className="text-red-700 text-sm">{error.message}</div>
                                  <div className="text-red-600 text-xs mt-1">
                                    Current: <code className="bg-red-100 px-1 rounded">{error.value}</code>
                                    {error.expected && (
                                      <span> • Expected: {error.expected}</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Token Statistics */}
                        <div className="grid grid-cols-3 gap-4 mt-6">
                          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="text-2xl font-bold text-blue-800">{flattenedTokens.length}</div>
                            <div className="text-blue-700 text-sm">Total Tokens</div>
                          </div>
                          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="text-2xl font-bold text-green-800">{tokenCategories.length}</div>
                            <div className="text-green-700 text-sm">Categories</div>
                          </div>
                          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                            <div className="text-2xl font-bold text-orange-800">{validationErrors.length}</div>
                            <div className="text-orange-700 text-sm">Validation Errors</div>
                          </div>
                        </div>
                      </div>
                    </Tab.Panel>

                    {/* Live Preview Tab */}
                    <Tab.Panel className="p-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">Live Token Preview</h3>
                        <p className="text-sm text-gray-600">
                          Preview how your tokens will look when applied to components.
                        </p>

                        {/* Color Preview */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-800">Colors</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {flattenedTokens
                              .filter(token => token.type === 'color')
                              .slice(0, 8)
                              .map(token => (
                                <div key={token.path} className="text-center">
                                  <div
                                    className="w-full h-16 rounded-lg border border-gray-300 mb-2"
                                    style={{ backgroundColor: token.value }}
                                  />
                                  <div className="text-xs font-medium text-gray-900">{token.path.split('.').pop()}</div>
                                  <div className="text-xs text-gray-500 font-mono">{token.value}</div>
                                </div>
                              ))}
                          </div>
                        </div>

                        {/* Typography Preview */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-gray-800">Typography</h4>
                          <div className="space-y-3">
                            {['h1', 'h2', 'h3', 'body'].map(level => {
                              const sizeToken = flattenedTokens.find(t => t.path.includes(`fontSize.${level}`) || t.path.includes('headings'));
                              const fontToken = flattenedTokens.find(t => t.path.includes('fontFamily'));
                              
                              return (
                                <div key={level} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                  <div
                                    className="font-medium"
                                    style={{
                                      fontSize: sizeToken?.value || '1rem',
                                      fontFamily: Array.isArray(fontToken?.value) 
                                        ? fontToken.value.join(', ')
                                        : fontToken?.value || 'system-ui'
                                    }}
                                  >
                                    {level.toUpperCase()} Sample Text
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {sizeToken?.value || 'No size token'}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </Tab.Panel>

                    {/* Export/Import Tab */}
                    <Tab.Panel className="p-6">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">Export Tokens</h3>
                          <p className="text-sm text-gray-600 mb-4">
                            Export your current token configuration as JSON for backup or sharing.
                          </p>
                          <button
                            onClick={exportTokens}
                            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                          >
                            <DocumentDuplicateIcon className="w-4 h-4 mr-2" />
                            Export as JSON
                          </button>
                        </div>

                        <div className="border-t pt-6">
                          <h3 className="text-lg font-medium text-gray-900 mb-2">Import Tokens</h3>
                          <p className="text-sm text-gray-600 mb-4">
                            Import token configuration from a JSON file. This will replace your current tokens.
                          </p>
                          <input
                            type="file"
                            accept=".json"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  try {
                                    const importedTokens = JSON.parse(event.target?.result as string);
                                    onTokensUpdate(importedTokens);
                                    setHasUnsavedChanges(true);
                                    alert('Tokens imported successfully!');
                                  } catch (error) {
                                    alert('Error importing tokens. Please check the file format.');
                                  }
                                };
                                reader.readAsText(file);
                              }
                            }}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          />
                        </div>

                        {hasUnsavedChanges && (
                          <div className="border-t pt-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Save Changes</h3>
                            <p className="text-sm text-gray-600 mb-4">
                              You have unsaved changes. Save them to apply to your theme.
                            </p>
                            <div className="flex gap-3">
                              <button
                                onClick={() => {
                                  onSaveTokens();
                                  setHasUnsavedChanges(false);
                                }}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                              >
                                <CheckIcon className="w-4 h-4 mr-2" />
                                Save Changes
                              </button>
                              <button
                                onClick={() => {
                                  // Reset to original tokens (this would need to be implemented)
                                  setHasUnsavedChanges(false);
                                }}
                                className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                              >
                                <ArrowPathIcon className="w-4 h-4 mr-2" />
                                Discard Changes
                              </button>
                            </div>
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