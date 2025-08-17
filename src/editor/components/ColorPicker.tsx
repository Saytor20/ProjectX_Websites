'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { HexColorPicker, HsvaColor, hsvaToHex, hexToHsva } from 'react-colorful';
import { 
  SwatchIcon, 
  EyeDropperIcon, 
  ClipboardDocumentIcon,
  CheckIcon,
  ArrowPathIcon,
  PaletteIcon
} from '@heroicons/react/24/outline';
import chroma from 'chroma-js';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
  disabled?: boolean;
  presetColors?: string[];
  showPresets?: boolean;
  showVariants?: boolean;
  showFormats?: boolean;
  onPreview?: (color: string) => void;
  onPreviewEnd?: () => void;
}

interface ColorFormat {
  name: string;
  value: string;
  format: 'hex' | 'rgb' | 'hsl' | 'hsv';
}

const defaultPresetColors = [
  '#FF5733', '#FFC300', '#DAF7A6', '#33FF57', '#3357FF',
  '#8E33FF', '#FF33E1', '#FF3333', '#33FFF5', '#F5FF33',
  '#000000', '#333333', '#666666', '#999999', '#CCCCCC', '#FFFFFF'
];

export const ColorPicker: React.FC<ColorPickerProps> = ({
  color,
  onChange,
  label,
  disabled = false,
  presetColors = defaultPresetColors,
  showPresets = true,
  showVariants = true,
  showFormats = true,
  onPreview,
  onPreviewEnd
}) => {
  const [hsva, setHsva] = useState<HsvaColor>({ h: 0, s: 0, v: 0, a: 1 });
  const [inputValue, setInputValue] = useState(color);
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Update internal state when color prop changes
  useEffect(() => {
    try {
      const newHsva = hexToHsva(color);
      setHsva(newHsva);
      setInputValue(color);
    } catch (error) {
      console.warn('Invalid color provided:', color);
    }
  }, [color]);

  // Generate color variants
  const generateVariants = useCallback((baseColor: string) => {
    try {
      const chroma_color = chroma(baseColor);
      return {
        tints: [
          chroma_color.mix('white', 0.8).hex(),
          chroma_color.mix('white', 0.6).hex(),
          chroma_color.mix('white', 0.4).hex(),
          chroma_color.mix('white', 0.2).hex(),
        ],
        base: baseColor,
        shades: [
          chroma_color.mix('black', 0.2).hex(),
          chroma_color.mix('black', 0.4).hex(),
          chroma_color.mix('black', 0.6).hex(),
          chroma_color.mix('black', 0.8).hex(),
        ]
      };
    } catch {
      return null;
    }
  }, []);

  // Generate color formats
  const generateFormats = useCallback((hexColor: string): ColorFormat[] => {
    try {
      const chroma_color = chroma(hexColor);
      const rgb = chroma_color.rgb();
      const hsl = chroma_color.hsl();
      const hsv = chroma_color.hsv();

      return [
        { name: 'HEX', value: hexColor.toUpperCase(), format: 'hex' },
        { 
          name: 'RGB', 
          value: `rgb(${Math.round(rgb[0])}, ${Math.round(rgb[1])}, ${Math.round(rgb[2])})`, 
          format: 'rgb' 
        },
        { 
          name: 'HSL', 
          value: `hsl(${Math.round(hsl[0] || 0)}, ${Math.round(hsl[1] * 100)}%, ${Math.round(hsl[2] * 100)}%)`, 
          format: 'hsl' 
        },
        { 
          name: 'HSV', 
          value: `hsv(${Math.round(hsv[0] || 0)}, ${Math.round(hsv[1] * 100)}%, ${Math.round(hsv[2] * 100)}%)`, 
          format: 'hsv' 
        }
      ];
    } catch {
      return [{ name: 'HEX', value: hexColor, format: 'hex' }];
    }
  }, []);

  const handleColorChange = (newHsva: HsvaColor) => {
    setHsva(newHsva);
    const hexColor = hsvaToHex(newHsva);
    setInputValue(hexColor);
    
    if (isPreviewMode && onPreview) {
      onPreview(hexColor);
    } else {
      onChange(hexColor);
    }
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    
    // Validate and convert to hex if possible
    try {
      const normalizedColor = value.startsWith('#') ? value : `#${value}`;
      if (/^#[0-9A-F]{6}$/i.test(normalizedColor)) {
        const newHsva = hexToHsva(normalizedColor);
        setHsva(newHsva);
        
        if (isPreviewMode && onPreview) {
          onPreview(normalizedColor);
        } else {
          onChange(normalizedColor);
        }
      }
    } catch (error) {
      // Invalid color, keep input but don't update picker
    }
  };

  const handlePresetClick = (presetColor: string) => {
    handleInputChange(presetColor);
  };

  const copyToClipboard = async (text: string, format: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedFormat(format);
      setTimeout(() => setCopiedFormat(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const togglePreviewMode = () => {
    if (isPreviewMode) {
      setIsPreviewMode(false);
      if (onPreviewEnd) {
        onPreviewEnd();
      }
    } else {
      setIsPreviewMode(true);
      if (onPreview) {
        onPreview(inputValue);
      }
    }
  };

  const resetColor = () => {
    handleInputChange('#000000');
  };

  const variants = generateVariants(inputValue);
  const formats = generateFormats(inputValue);

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <Popover className="relative">
        {({ open }) => (
          <>
            <Popover.Button
              disabled={disabled}
              className={`inline-flex items-center gap-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                disabled
                  ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                  : open
                  ? 'bg-white border-blue-300 text-gray-900'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              <div
                className="w-6 h-6 rounded border border-gray-300"
                style={{ backgroundColor: inputValue }}
              />
              <span className="font-mono text-sm">{inputValue}</span>
              <SwatchIcon className="w-4 h-4" />
            </Popover.Button>

            <Transition
              enter="transition duration-200 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Popover.Panel className="absolute left-0 z-10 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 min-w-[320px]">
                <div className="space-y-4">
                  {/* Color Picker */}
                  <div className="space-y-3">
                    <HexColorPicker
                      color={hsva}
                      onChange={handleColorChange}
                      style={{ width: '100%', height: '200px' }}
                    />
                    
                    {/* Input and Controls */}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => handleInputChange(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                        placeholder="#000000"
                      />
                      
                      {onPreview && (
                        <button
                          onClick={togglePreviewMode}
                          className={`p-2 rounded-md transition-colors ${
                            isPreviewMode
                              ? 'bg-blue-100 text-blue-600 border border-blue-300'
                              : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
                          }`}
                          title={isPreviewMode ? 'End Preview' : 'Start Preview'}
                        >
                          <EyeDropperIcon className="w-4 h-4" />
                        </button>
                      )}
                      
                      <button
                        onClick={resetColor}
                        className="p-2 bg-gray-100 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
                        title="Reset Color"
                      >
                        <ArrowPathIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Color Variants */}
                  {showVariants && variants && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700 flex items-center gap-1">
                        <PaletteIcon className="w-4 h-4" />
                        Color Variants
                      </h4>
                      <div className="space-y-2">
                        {/* Tints */}
                        <div className="flex gap-1">
                          {variants.tints.map((tint, index) => (
                            <button
                              key={`tint-${index}`}
                              onClick={() => handlePresetClick(tint)}
                              className="w-8 h-8 rounded border border-gray-300 hover:scale-110 transition-transform"
                              style={{ backgroundColor: tint }}
                              title={`Tint ${index + 1}: ${tint}`}
                            />
                          ))}
                          {/* Base color */}
                          <button
                            onClick={() => handlePresetClick(variants.base)}
                            className="w-8 h-8 rounded border-2 border-gray-600 hover:scale-110 transition-transform"
                            style={{ backgroundColor: variants.base }}
                            title={`Base: ${variants.base}`}
                          />
                          {/* Shades */}
                          {variants.shades.map((shade, index) => (
                            <button
                              key={`shade-${index}`}
                              onClick={() => handlePresetClick(shade)}
                              className="w-8 h-8 rounded border border-gray-300 hover:scale-110 transition-transform"
                              style={{ backgroundColor: shade }}
                              title={`Shade ${index + 1}: ${shade}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Preset Colors */}
                  {showPresets && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700">Preset Colors</h4>
                      <div className="grid grid-cols-8 gap-1">
                        {presetColors.map((presetColor, index) => (
                          <button
                            key={index}
                            onClick={() => handlePresetClick(presetColor)}
                            className="w-8 h-8 rounded border border-gray-300 hover:scale-110 transition-transform"
                            style={{ backgroundColor: presetColor }}
                            title={presetColor}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Color Formats */}
                  {showFormats && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700">Color Formats</h4>
                      <div className="space-y-1">
                        {formats.map((format) => (
                          <div
                            key={format.format}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded border"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-gray-600 w-8">
                                {format.name}
                              </span>
                              <code className="text-xs font-mono text-gray-800">
                                {format.value}
                              </code>
                            </div>
                            <button
                              onClick={() => copyToClipboard(format.value, format.format)}
                              className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                              title={`Copy ${format.name} value`}
                            >
                              {copiedFormat === format.format ? (
                                <CheckIcon className="w-4 h-4 text-green-600" />
                              ) : (
                                <ClipboardDocumentIcon className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
};