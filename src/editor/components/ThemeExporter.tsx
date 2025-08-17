'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, Transition, Tab } from '@headlessui/react';
import { 
  XMarkIcon,
  DocumentArrowDownIcon,
  DocumentArrowUpIcon,
  ShareIcon,
  ClipboardDocumentIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  FolderOpenIcon,
  CloudArrowUpIcon,
  CloudArrowDownIcon,
  CubeIcon,
  SparklesIcon,
  SwatchIcon
} from '@heroicons/react/24/outline';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import type { 
  ThemeCustomization, 
  TokenSchema,
  ThemeMetadata 
} from '../types/theme';

interface ThemeExporterProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: string;
  themeMetadata?: ThemeMetadata;
  customization?: ThemeCustomization;
  tokens: TokenSchema;
  onImportTheme: (theme: any) => void;
  onCreateThemeFromExport: (exportData: ThemeExportData) => void;
}

interface ThemeExportData {
  metadata: {
    name: string;
    version: string;
    description: string;
    author: string;
    created: string;
    exported: string;
    category: string;
    tags: string[];
    compatibility: string;
    license: string;
  };
  tokens: TokenSchema;
  customization?: ThemeCustomization;
  assets?: {
    fonts: string[];
    images: string[];
    icons: string[];
  };
  components?: {
    mapping: Record<string, any>;
    overrides: Record<string, any>;
  };
  styles?: {
    css: string;
    scss?: string;
  };
  settings: {
    responsive: boolean;
    darkMode: boolean;
    animations: boolean;
    accessibility: boolean;
  };
}

interface ImportValidationResult {
  isValid: boolean;
  warnings: string[];
  errors: string[];
  data?: ThemeExportData;
}

export const ThemeExporter: React.FC<ThemeExporterProps> = ({
  isOpen,
  onClose,
  currentTheme,
  themeMetadata,
  customization,
  tokens,
  onImportTheme,
  onCreateThemeFromExport
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [exportFormat, setExportFormat] = useState<'json' | 'zip' | 'package'>('json');
  const [includeAssets, setIncludeAssets] = useState(true);
  const [includeCustomization, setIncludeCustomization] = useState(true);
  const [includeStyles, setIncludeStyles] = useState(false);
  const [exportMetadata, setExportMetadata] = useState({
    name: themeMetadata?.name || currentTheme,
    version: '1.0.0',
    description: themeMetadata?.description || `Exported theme based on ${currentTheme}`,
    author: '',
    category: themeMetadata?.category || 'general',
    tags: themeMetadata?.tags || [],
    license: 'MIT'
  });
  const [copySuccess, setCopySuccess] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importValidation, setImportValidation] = useState<ImportValidationResult | null>(null);
  const [previewData, setPreviewData] = useState<ThemeExportData | null>(null);

  const tabs = [
    { 
      id: 'export', 
      name: 'Export Theme',
      icon: DocumentArrowDownIcon,
      description: 'Export your current theme configuration'
    },
    { 
      id: 'import', 
      name: 'Import Theme',
      icon: DocumentArrowUpIcon,
      description: 'Import theme from file or URL'
    },
    { 
      id: 'share', 
      name: 'Share & Backup',
      icon: ShareIcon,
      description: 'Share themes and create backups'
    },
    { 
      id: 'packages', 
      name: 'Theme Packages',
      icon: CubeIcon,
      description: 'Create installable theme packages'
    }
  ];

  const generateExportData = (): ThemeExportData => {
    return {
      metadata: {
        ...exportMetadata,
        created: themeMetadata?.createdAt || new Date().toISOString(),
        exported: new Date().toISOString(),
        compatibility: '1.0.0'
      },
      tokens,
      customization: includeCustomization ? customization : undefined,
      assets: includeAssets ? {
        fonts: extractFontsFromTokens(tokens),
        images: [],
        icons: []
      } : undefined,
      components: {
        mapping: {},
        overrides: {}
      },
      styles: includeStyles ? {
        css: ''
      } : undefined,
      settings: {
        responsive: true,
        darkMode: false,
        animations: true,
        accessibility: true
      }
    };
  };

  const extractFontsFromTokens = (tokens: TokenSchema): string[] => {
    const fonts = new Set<string>();
    
    if (tokens.fonts) {
      Object.values(tokens.fonts).forEach(fontFamily => {
        if (Array.isArray(fontFamily)) {
          fontFamily.forEach(font => {
            if (typeof font === 'string' && !font.includes('system-ui') && !font.includes('sans-serif')) {
              fonts.add(font);
            }
          });
        } else if (typeof fontFamily === 'string' && !fontFamily.includes('system-ui')) {
          fonts.add(fontFamily);
        }
      });
    }
    
    return Array.from(fonts);
  };

  const validateImportData = (data: any): ImportValidationResult => {
    const warnings: string[] = [];
    const errors: string[] = [];

    // Check required fields
    if (!data.metadata) {
      errors.push('Missing metadata section');
    } else {
      if (!data.metadata.name) warnings.push('Theme name is missing');
      if (!data.metadata.version) warnings.push('Version is missing');
    }

    if (!data.tokens) {
      errors.push('Missing tokens section');
    } else {
      // Validate token structure
      const requiredTokenSections = ['colors', 'spacing'];
      requiredTokenSections.forEach(section => {
        if (!data.tokens[section]) {
          warnings.push(`Missing ${section} tokens`);
        }
      });
    }

    // Check for compatibility issues
    if (data.metadata?.compatibility && data.metadata.compatibility !== '1.0.0') {
      warnings.push('Theme may not be fully compatible with current version');
    }

    // Validate customization data if present
    if (data.customization && !data.customization.themeId) {
      warnings.push('Customization data may be invalid');
    }

    return {
      isValid: errors.length === 0,
      warnings,
      errors,
      data: errors.length === 0 ? data as ThemeExportData : undefined
    };
  };

  const exportAsJSON = async () => {
    setIsExporting(true);
    try {
      const exportData = generateExportData();
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      saveAs(blob, `${exportMetadata.name.replace(/\s+/g, '-').toLowerCase()}-theme.json`);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const exportAsZip = async () => {
    setIsExporting(true);
    try {
      const exportData = generateExportData();
      const zip = new JSZip();
      
      // Add main theme file
      zip.file('theme.json', JSON.stringify(exportData, null, 2));
      
      // Add README
      const readme = generateReadme(exportData);
      zip.file('README.md', readme);
      
      // Add package.json if creating a package
      if (exportFormat === 'package') {
        const packageJson = {
          name: `@themes/${exportMetadata.name.replace(/\s+/g, '-').toLowerCase()}`,
          version: exportMetadata.version,
          description: exportMetadata.description,
          main: 'theme.json',
          keywords: exportMetadata.tags,
          author: exportMetadata.author,
          license: exportMetadata.license
        };
        zip.file('package.json', JSON.stringify(packageJson, null, 2));
      }
      
      // Add tokens as separate files
      zip.file('tokens/colors.json', JSON.stringify(tokens.colors, null, 2));
      zip.file('tokens/typography.json', JSON.stringify(tokens.typography, null, 2));
      zip.file('tokens/spacing.json', JSON.stringify(tokens.spacing, null, 2));
      
      if (includeStyles && exportData.styles?.css) {
        zip.file('styles/theme.css', exportData.styles.css);
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const fileName = exportFormat === 'package' 
        ? `${exportMetadata.name.replace(/\s+/g, '-').toLowerCase()}-package.zip`
        : `${exportMetadata.name.replace(/\s+/g, '-').toLowerCase()}-theme.zip`;
      
      saveAs(content, fileName);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const generateReadme = (exportData: ThemeExportData): string => {
    return `# ${exportData.metadata.name}

${exportData.metadata.description}

## Theme Information
- **Version**: ${exportData.metadata.version}
- **Author**: ${exportData.metadata.author || 'Unknown'}
- **Category**: ${exportData.metadata.category}
- **License**: ${exportData.metadata.license}
- **Created**: ${new Date(exportData.metadata.created).toLocaleDateString()}
- **Exported**: ${new Date(exportData.metadata.exported).toLocaleDateString()}

## Features
${exportData.settings.responsive ? '✅' : '❌'} Responsive Design
${exportData.settings.darkMode ? '✅' : '❌'} Dark Mode Support
${exportData.settings.animations ? '✅' : '❌'} Animations
${exportData.settings.accessibility ? '✅' : '❌'} Accessibility Features

## Installation
1. Import the theme file into your design system
2. Apply the tokens to your components
3. Customize as needed

## Token Categories
${Object.keys(exportData.tokens).map(category => `- ${category}`).join('\n')}

## Fonts Used
${exportData.assets?.fonts.map(font => `- ${font}`).join('\n') || 'System fonts only'}

---
Generated by Theme Editor v1.0
`;
  };

  const copyToClipboard = async () => {
    try {
      const exportData = generateExportData();
      await navigator.clipboard.writeText(JSON.stringify(exportData, null, 2));
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      alert('Failed to copy to clipboard');
    }
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportFile(file);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        let data;
        
        if (file.type === 'application/json' || file.name.endsWith('.json')) {
          data = JSON.parse(content);
        } else {
          throw new Error('Unsupported file format');
        }
        
        const validation = validateImportData(data);
        setImportValidation(validation);
        
        if (validation.isValid && validation.data) {
          setPreviewData(validation.data);
        }
      } catch (error) {
        setImportValidation({
          isValid: false,
          warnings: [],
          errors: ['Invalid file format or corrupted data'],
          data: undefined
        });
      }
    };
    
    reader.readAsText(file);
  };

  const handleImportConfirm = () => {
    if (importValidation?.isValid && importValidation.data) {
      if (importValidation.data.customization) {
        onCreateThemeFromExport(importValidation.data);
      } else {
        onImportTheme(importValidation.data.tokens);
      }
      
      // Reset import state
      setImportFile(null);
      setImportValidation(null);
      setPreviewData(null);
      onClose();
    }
  };

  const renderExportOptions = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Export Configuration</h3>
        
        {/* Export Format */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'json', label: 'JSON File', icon: DocumentArrowDownIcon, desc: 'Simple JSON file' },
                { value: 'zip', label: 'ZIP Archive', icon: FolderOpenIcon, desc: 'With documentation' },
                { value: 'package', label: 'Theme Package', icon: CubeIcon, desc: 'Installable package' }
              ].map((format) => (
                <button
                  key={format.value}
                  onClick={() => setExportFormat(format.value as any)}
                  className={`p-3 border rounded-lg text-left transition-colors ${
                    exportFormat === format.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <format.icon className="w-5 h-5 mb-2" />
                  <div className="font-medium text-sm">{format.label}</div>
                  <div className="text-xs text-gray-500">{format.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Theme Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Theme Name</label>
              <input
                type="text"
                value={exportMetadata.name}
                onChange={(e) => setExportMetadata(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="My Custom Theme"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Version</label>
              <input
                type="text"
                value={exportMetadata.version}
                onChange={(e) => setExportMetadata(prev => ({ ...prev, version: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1.0.0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={exportMetadata.description}
              onChange={(e) => setExportMetadata(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Describe your theme..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
              <input
                type="text"
                value={exportMetadata.author}
                onChange={(e) => setExportMetadata(prev => ({ ...prev, author: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={exportMetadata.category}
                onChange={(e) => setExportMetadata(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="general">General</option>
                <option value="restaurant">Restaurant</option>
                <option value="cafe">Cafe</option>
                <option value="modern">Modern</option>
                <option value="classic">Classic</option>
                <option value="minimal">Minimal</option>
              </select>
            </div>
          </div>

          {/* Export Options */}
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="includeCustomization"
                checked={includeCustomization}
                onChange={(e) => setIncludeCustomization(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <label htmlFor="includeCustomization" className="ml-2 text-sm text-gray-700">
                Include customizations
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="includeAssets"
                checked={includeAssets}
                onChange={(e) => setIncludeAssets(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <label htmlFor="includeAssets" className="ml-2 text-sm text-gray-700">
                Include asset references
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="includeStyles"
                checked={includeStyles}
                onChange={(e) => setIncludeStyles(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <label htmlFor="includeStyles" className="ml-2 text-sm text-gray-700">
                Include compiled CSS styles
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Export Actions */}
      <div className="flex gap-3">
        <button
          onClick={exportFormat === 'json' ? exportAsJSON : exportAsZip}
          disabled={isExporting}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <DocumentArrowDownIcon className="w-4 h-4 mr-2" />
          {isExporting ? 'Exporting...' : `Export as ${exportFormat.toUpperCase()}`}
        </button>
        
        <button
          onClick={copyToClipboard}
          className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          {copySuccess ? (
            <CheckIcon className="w-4 h-4 mr-2" />
          ) : (
            <ClipboardDocumentIcon className="w-4 h-4 mr-2" />
          )}
          {copySuccess ? 'Copied!' : 'Copy JSON'}
        </button>
      </div>
    </div>
  );

  const renderImportInterface = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Import Theme</h3>
        
        {/* File Upload */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
          <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <label htmlFor="theme-file" className="cursor-pointer">
              <span className="mt-2 block text-sm font-medium text-gray-900">
                Drop theme file here or click to browse
              </span>
              <span className="mt-1 block text-xs text-gray-500">
                Supports JSON files and ZIP archives
              </span>
              <input
                id="theme-file"
                type="file"
                accept=".json,.zip"
                onChange={handleFileImport}
                className="sr-only"
              />
            </label>
          </div>
        </div>

        {/* Import Validation Results */}
        {importValidation && (
          <div className="space-y-4">
            {importValidation.errors.length > 0 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
                  <span className="font-medium text-red-800">Import Errors</span>
                </div>
                <ul className="text-sm text-red-700 space-y-1">
                  {importValidation.errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}

            {importValidation.warnings.length > 0 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium text-yellow-800">Warnings</span>
                </div>
                <ul className="text-sm text-yellow-700 space-y-1">
                  {importValidation.warnings.map((warning, index) => (
                    <li key={index}>• {warning}</li>
                  ))}
                </ul>
              </div>
            )}

            {importValidation.isValid && previewData && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <CheckIcon className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-800">Ready to Import</span>
                </div>
                
                <div className="space-y-2 text-sm text-green-700">
                  <div><strong>Theme:</strong> {previewData.metadata.name}</div>
                  <div><strong>Version:</strong> {previewData.metadata.version}</div>
                  <div><strong>Description:</strong> {previewData.metadata.description}</div>
                  {previewData.metadata.author && (
                    <div><strong>Author:</strong> {previewData.metadata.author}</div>
                  )}
                </div>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={handleImportConfirm}
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    <DocumentArrowUpIcon className="w-4 h-4 mr-2" />
                    Import Theme
                  </button>
                  <button
                    onClick={() => {
                      setImportFile(null);
                      setImportValidation(null);
                      setPreviewData(null);
                    }}
                    className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

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
                      <ShareIcon className="w-5 h-5" />
                      Theme Export & Import
                    </Dialog.Title>
                    <p className="text-sm text-gray-600 mt-1">
                      Export themes for sharing or import themes from files
                    </p>
                  </div>
                  
                  <button
                    type="button"
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
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
                    <Tab.Panel className="p-6">
                      {renderExportOptions()}
                    </Tab.Panel>

                    <Tab.Panel className="p-6">
                      {renderImportInterface()}
                    </Tab.Panel>

                    <Tab.Panel className="p-6">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-4">Share & Backup</h3>
                          <p className="text-sm text-gray-600 mb-4">
                            Create backups of your themes and share them with others.
                          </p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 border border-gray-200 rounded-lg">
                              <CloudArrowDownIcon className="w-8 h-8 text-blue-600 mb-3" />
                              <h4 className="font-medium text-gray-900 mb-2">Create Backup</h4>
                              <p className="text-sm text-gray-600 mb-3">
                                Save a complete backup of your current theme configuration.
                              </p>
                              <button
                                onClick={() => {
                                  setExportFormat('zip');
                                  setIncludeAssets(true);
                                  setIncludeCustomization(true);
                                  setIncludeStyles(true);
                                  exportAsZip();
                                }}
                                className="w-full px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                              >
                                Create Backup
                              </button>
                            </div>

                            <div className="p-4 border border-gray-200 rounded-lg">
                              <ShareIcon className="w-8 h-8 text-green-600 mb-3" />
                              <h4 className="font-medium text-gray-900 mb-2">Share Theme</h4>
                              <p className="text-sm text-gray-600 mb-3">
                                Export a clean theme file for sharing with others.
                              </p>
                              <button
                                onClick={() => {
                                  setExportFormat('json');
                                  setIncludeAssets(false);
                                  setIncludeCustomization(false);
                                  setIncludeStyles(false);
                                  exportAsJSON();
                                }}
                                className="w-full px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                              >
                                Share Theme
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Tab.Panel>

                    <Tab.Panel className="p-6">
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-4">Theme Packages</h3>
                          <p className="text-sm text-gray-600 mb-4">
                            Create installable theme packages with npm compatibility.
                          </p>
                          
                          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <h4 className="font-medium text-blue-900 mb-2">Package Features</h4>
                            <ul className="text-sm text-blue-800 space-y-1">
                              <li>• npm-compatible package.json</li>
                              <li>• Comprehensive documentation</li>
                              <li>• Organized token structure</li>
                              <li>• Installation instructions</li>
                              <li>• Version management</li>
                            </ul>
                          </div>

                          <button
                            onClick={() => {
                              setExportFormat('package');
                              exportAsZip();
                            }}
                            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                          >
                            <CubeIcon className="w-4 h-4 mr-2" />
                            Create Theme Package
                          </button>
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