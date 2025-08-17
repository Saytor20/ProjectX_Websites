'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Tldraw, TLUiOverrides, TLComponents, Editor, TLShapeId, TLRecord, createTLStore } from '@tldraw/tldraw';
import { motion, AnimatePresence } from 'framer-motion';
import '@tldraw/tldraw/tldraw.css';

/**
 * Shape Manager - Advanced shape tools and canvas editing integration
 * Provides drawing tools, shape library, and DOM + Canvas hybrid editing
 */

interface ShapeManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onShapeCreated?: (shape: any) => void;
  onShapeExported?: (exportData: any) => void;
}

interface ShapeTemplate {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  shapes: TLRecord[];
  description: string;
}

interface ExportOptions {
  format: 'svg' | 'png' | 'json' | 'component';
  quality: number;
  background: boolean;
  padding: number;
}

const shapeTemplates: ShapeTemplate[] = [
  {
    id: 'restaurant-icons',
    name: 'Restaurant Icons',
    category: 'icons',
    thumbnail: '/shapes/restaurant-icons.svg',
    description: 'Common restaurant and food service icons',
    shapes: []
  },
  {
    id: 'menu-layouts',
    name: 'Menu Layouts',
    category: 'layouts',
    thumbnail: '/shapes/menu-layouts.svg',
    description: 'Pre-designed menu section layouts',
    shapes: []
  },
  {
    id: 'decorative-elements',
    name: 'Decorative Elements',
    category: 'decorative',
    thumbnail: '/shapes/decorative-elements.svg',
    description: 'Borders, dividers, and decorative shapes',
    shapes: []
  },
  {
    id: 'callout-boxes',
    name: 'Callout Boxes',
    category: 'ui',
    thumbnail: '/shapes/callout-boxes.svg',
    description: 'Information boxes and callouts',
    shapes: []
  }
];

export default function ShapeManager({ 
  isOpen, 
  onClose, 
  onShapeCreated, 
  onShapeExported 
}: ShapeManagerProps) {
  const [editor, setEditor] = useState<Editor | null>(null);
  const [activeTab, setActiveTab] = useState<'draw' | 'templates' | 'export'>('draw');
  const [selectedShapes, setSelectedShapes] = useState<TLShapeId[]>([]);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'svg',
    quality: 1,
    background: false,
    padding: 0
  });
  const [isExporting, setIsExporting] = useState(false);

  // Custom UI overrides for the tldraw editor
  const uiOverrides: TLUiOverrides = {
    tools(editor, tools) {
      // Add custom tools
      return {
        ...tools,
        restaurant: {
          id: 'restaurant',
          label: 'Restaurant',
          icon: 'restaurant',
          kbd: 'r',
          readonlyOk: false,
          onSelect: () => {
            editor.setCurrentTool('select');
            // Add restaurant-specific shapes
          }
        }
      };
    },
    toolbar(editor, toolbar, { tools }) {
      // Customize toolbar
      return [
        ...toolbar.slice(0, 4),
        tools.restaurant,
        ...toolbar.slice(4)
      ];
    }
  };

  // Custom components for tldraw
  const components: TLComponents = {
    Toolbar: (props) => {
      return (
        <div className="tl-toolbar">
          {/* Custom toolbar implementation */}
          <div className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-lg">
            <button
              onClick={() => editor?.setCurrentTool('select')}
              className="p-2 rounded hover:bg-gray-100"
              title="Select"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/>
              </svg>
            </button>
            <button
              onClick={() => editor?.setCurrentTool('draw')}
              className="p-2 rounded hover:bg-gray-100"
              title="Draw"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 19l7-7 3 3-7 7-3-3z"/>
                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
                <path d="M2 2l7.586 7.586"/>
              </svg>
            </button>
            <button
              onClick={() => editor?.setCurrentTool('geo')}
              className="p-2 rounded hover:bg-gray-100"
              title="Rectangle"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              </svg>
            </button>
            <button
              onClick={() => editor?.setCurrentTool('arrow')}
              className="p-2 rounded hover:bg-gray-100"
              title="Arrow"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12,5 19,12 12,19"/>
              </svg>
            </button>
            <button
              onClick={() => editor?.setCurrentTool('text')}
              className="p-2 rounded hover:bg-gray-100"
              title="Text"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polyline points="4,7 4,4 20,4 20,7"/>
                <line x1="9" y1="20" x2="15" y2="20"/>
                <line x1="12" y1="4" x2="12" y2="20"/>
              </svg>
            </button>
          </div>
        </div>
      );
    }
  };

  // Handle editor mount
  const handleMount = useCallback((editor: Editor) => {
    setEditor(editor);
    
    // Set up event listeners
    editor.on('change', (change) => {
      const selectedShapeIds = editor.getSelectedShapeIds();
      setSelectedShapes(selectedShapeIds);
    });

    // Load templates if available
    loadShapeTemplates(editor);
  }, []);

  // Load shape templates into the editor
  const loadShapeTemplates = async (editor: Editor) => {
    try {
      // This would load actual shape data in a real implementation
      console.log('Loading shape templates...');
    } catch (error) {
      console.error('Failed to load shape templates:', error);
    }
  };

  // Handle shape export
  const handleExport = async () => {
    if (!editor || selectedShapes.length === 0) return;

    setIsExporting(true);
    try {
      const { format, quality, background, padding } = exportOptions;
      
      let exportData;
      
      switch (format) {
        case 'svg':
          exportData = await editor.getSvg(selectedShapes, {
            background,
            padding,
            darkMode: false
          });
          break;
          
        case 'png':
          exportData = await editor.getSvg(selectedShapes, {
            background,
            padding,
            darkMode: false
          });
          // Convert SVG to PNG would happen here
          break;
          
        case 'json':
          exportData = {
            shapes: selectedShapes.map(id => editor.getShape(id)),
            timestamp: Date.now(),
            format: 'tldraw-json'
          };
          break;
          
        case 'component':
          exportData = await generateReactComponent(editor, selectedShapes);
          break;
      }

      if (exportData && onShapeExported) {
        onShapeExported({
          format,
          data: exportData,
          shapes: selectedShapes,
          options: exportOptions
        });
      }

      // Download the export
      downloadExport(exportData, format);
      
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // Generate React component from shapes
  const generateReactComponent = async (editor: Editor, shapeIds: TLShapeId[]) => {
    const shapes = shapeIds.map(id => editor.getShape(id));
    const svgString = await editor.getSvg(shapeIds, {
      background: false,
      padding: 0
    });

    if (!svgString) return null;

    const componentName = `GeneratedShape${Date.now()}`;
    
    return `
import React from 'react';

interface ${componentName}Props {
  className?: string;
  style?: React.CSSProperties;
  width?: number;
  height?: number;
}

export default function ${componentName}({ 
  className = '', 
  style = {}, 
  width = 100, 
  height = 100 
}: ${componentName}Props) {
  return (
    <div className={\`generated-shape \${className}\`} style={style}>
      ${svgString.outerHTML}
    </div>
  );
}

// Shape metadata
export const shapeMetadata = {
  name: '${componentName}',
  shapes: ${JSON.stringify(shapes, null, 2)},
  createdAt: '${new Date().toISOString()}',
  type: 'tldraw-component'
};
    `;
  };

  // Download export data
  const downloadExport = (data: any, format: string) => {
    let blob: Blob;
    let filename: string;

    switch (format) {
      case 'svg':
        blob = new Blob([data.outerHTML], { type: 'image/svg+xml' });
        filename = `shapes-${Date.now()}.svg`;
        break;
        
      case 'png':
        // PNG blob would be created here
        blob = new Blob([data], { type: 'image/png' });
        filename = `shapes-${Date.now()}.png`;
        break;
        
      case 'json':
        blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        filename = `shapes-${Date.now()}.json`;
        break;
        
      case 'component':
        blob = new Blob([data], { type: 'text/typescript' });
        filename = `GeneratedShape${Date.now()}.tsx`;
        break;
        
      default:
        return;
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Insert template into editor
  const insertTemplate = (template: ShapeTemplate) => {
    if (!editor) return;

    try {
      // This would insert the actual template shapes
      console.log('Inserting template:', template.name);
      
      // For now, create a sample rectangle as placeholder
      editor.createShape({
        type: 'geo',
        x: 100,
        y: 100,
        props: {
          w: 200,
          h: 100,
          geo: 'rectangle',
          color: 'blue',
          fill: 'semi',
          label: template.name
        }
      });

      if (onShapeCreated) {
        onShapeCreated({
          template: template.name,
          shapes: ['placeholder-shape'],
          timestamp: Date.now()
        });
      }
    } catch (error) {
      console.error('Failed to insert template:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl w-[95%] h-[90%] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold text-gray-900">Shape Tools</h2>
              
              {/* Tab Navigation */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                {[
                  { id: 'draw', label: 'Draw', icon: '✏️' },
                  { id: 'templates', label: 'Templates', icon: '📚' },
                  { id: 'export', label: 'Export', icon: '💾' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                      activeTab === tab.id
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {selectedShapes.length > 0 && (
                <span className="text-sm text-gray-500">
                  {selectedShapes.length} shape{selectedShapes.length === 1 ? '' : 's'} selected
                </span>
              )}
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar */}
            <div className="w-80 border-r bg-gray-50 flex flex-col">
              {activeTab === 'draw' && (
                <DrawTab editor={editor} />
              )}
              
              {activeTab === 'templates' && (
                <TemplatesTab 
                  templates={shapeTemplates}
                  onInsertTemplate={insertTemplate}
                />
              )}
              
              {activeTab === 'export' && (
                <ExportTab
                  options={exportOptions}
                  onOptionsChange={setExportOptions}
                  onExport={handleExport}
                  isExporting={isExporting}
                  hasSelection={selectedShapes.length > 0}
                />
              )}
            </div>

            {/* Main Canvas */}
            <div className="flex-1 relative">
              <Tldraw
                onMount={handleMount}
                overrides={uiOverrides}
                components={components}
                hideUi={false}
                inferDarkMode={false}
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Draw Tab - Drawing tools and controls
 */
interface DrawTabProps {
  editor: Editor | null;
}

function DrawTab({ editor }: DrawTabProps) {
  const [brushSize, setBrushSize] = useState(4);
  const [opacity, setOpacity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('#000000');

  const colors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080'
  ];

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    if (editor) {
      editor.setStyleForSelectedShapes('color', color);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Drawing Tools</h3>
        
        {/* Color Palette */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
          <div className="grid grid-cols-5 gap-2">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => handleColorChange(color)}
                className={`w-8 h-8 rounded border-2 ${
                  selectedColor === color ? 'border-blue-500' : 'border-gray-300'
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>

        {/* Brush Size */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brush Size: {brushSize}px
          </label>
          <input
            type="range"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Opacity */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Opacity: {Math.round(opacity * 100)}%
          </label>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            value={opacity}
            onChange={(e) => setOpacity(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-2">Quick Actions</h4>
        <div className="space-y-2">
          <button
            onClick={() => editor?.selectAll()}
            className="w-full px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
          >
            Select All
          </button>
          <button
            onClick={() => editor?.deleteShapes(editor.getSelectedShapeIds())}
            className="w-full px-3 py-2 text-sm bg-red-50 text-red-700 rounded hover:bg-red-100"
          >
            Delete Selected
          </button>
          <button
            onClick={() => editor?.undo()}
            className="w-full px-3 py-2 text-sm bg-gray-50 text-gray-700 rounded hover:bg-gray-100"
          >
            Undo
          </button>
          <button
            onClick={() => editor?.redo()}
            className="w-full px-3 py-2 text-sm bg-gray-50 text-gray-700 rounded hover:bg-gray-100"
          >
            Redo
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Templates Tab - Shape templates and library
 */
interface TemplatesTabProps {
  templates: ShapeTemplate[];
  onInsertTemplate: (template: ShapeTemplate) => void;
}

function TemplatesTab({ templates, onInsertTemplate }: TemplatesTabProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const categories = Array.from(new Set(templates.map(t => t.category)));
  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Shape Templates</h3>
        
        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Template Grid */}
      <div className="space-y-3">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 cursor-pointer transition-colors"
            onClick={() => onInsertTemplate(template)}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                <span className="text-xl">🎨</span>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{template.name}</h4>
                <p className="text-sm text-gray-600">{template.description}</p>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded mt-1 inline-block">
                  {template.category}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">📦</div>
          <p>No templates found</p>
        </div>
      )}
    </div>
  );
}

/**
 * Export Tab - Export options and controls
 */
interface ExportTabProps {
  options: ExportOptions;
  onOptionsChange: (options: ExportOptions) => void;
  onExport: () => void;
  isExporting: boolean;
  hasSelection: boolean;
}

function ExportTab({ 
  options, 
  onOptionsChange, 
  onExport, 
  isExporting, 
  hasSelection 
}: ExportTabProps) {
  const updateOption = (key: keyof ExportOptions, value: any) => {
    onOptionsChange({ ...options, [key]: value });
  };

  return (
    <div className="p-4 space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Export Options</h3>
        
        {/* Format Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
          <select
            value={options.format}
            onChange={(e) => updateOption('format', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="svg">SVG Vector</option>
            <option value="png">PNG Image</option>
            <option value="json">JSON Data</option>
            <option value="component">React Component</option>
          </select>
        </div>

        {/* Quality (for PNG) */}
        {options.format === 'png' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quality: {Math.round(options.quality * 100)}%
            </label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={options.quality}
              onChange={(e) => updateOption('quality', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        )}

        {/* Background */}
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={options.background}
              onChange={(e) => updateOption('background', e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">Include background</span>
          </label>
        </div>

        {/* Padding */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Padding: {options.padding}px
          </label>
          <input
            type="range"
            min="0"
            max="50"
            value={options.padding}
            onChange={(e) => updateOption('padding', parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Export Button */}
      <div>
        <button
          onClick={onExport}
          disabled={!hasSelection || isExporting}
          className={`w-full px-4 py-3 text-sm font-medium rounded-md transition-colors ${
            hasSelection && !isExporting
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isExporting ? 'Exporting...' : 'Export Selected Shapes'}
        </button>
        
        {!hasSelection && (
          <p className="text-xs text-gray-500 mt-2 text-center">
            Select shapes to enable export
          </p>
        )}
      </div>

      {/* Export Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Export Information</h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• SVG: Vector format, scalable</li>
          <li>• PNG: Raster format, good for images</li>
          <li>• JSON: Data format for importing</li>
          <li>• Component: React component code</li>
        </ul>
      </div>
    </div>
  );
}