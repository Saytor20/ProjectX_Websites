'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, Transition, Tab } from '@headlessui/react';
import { 
  SwatchIcon, 
  XMarkIcon, 
  EyeIcon, 
  CheckIcon,
  StarIcon,
  TagIcon,
  SparklesIcon,
  SunIcon,
  MoonIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  DeviceTabletIcon
} from '@heroicons/react/24/outline';
import { 
  CheckIcon as CheckIconSolid,
  StarIcon as StarIconSolid 
} from '@heroicons/react/24/solid';
import type { 
  ThemeMetadata, 
  ThemeGalleryItem, 
  ThemeSearchFilters,
  ThemePreviewConfig 
} from '../types/theme';
import { useThemes } from '../hooks/useThemes';
import { ThemePreview } from './ThemePreview';

interface ThemeSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: string;
  onThemeChange: (themeId: string) => void;
}

const categoryColors = {
  modern: 'bg-blue-100 text-blue-800',
  classic: 'bg-amber-100 text-amber-800',
  minimal: 'bg-gray-100 text-gray-800',
  premium: 'bg-purple-100 text-purple-800',
  elegant: 'bg-rose-100 text-rose-800',
  bold: 'bg-orange-100 text-orange-800'
};

const categoryIcons = {
  modern: SparklesIcon,
  classic: StarIcon,
  minimal: SunIcon,
  premium: StarIconSolid,
  elegant: SwatchIcon,
  bold: TagIcon
};

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onThemeChange
}) => {
  const {
    themes,
    isLoading,
    searchFilters,
    updateSearchFilters,
    previewTheme,
    isPreviewMode,
    endPreview
  } = useThemes();

  const [selectedTab, setSelectedTab] = useState(0);
  const [previewConfig, setPreviewConfig] = useState<ThemePreviewConfig | null>(null);
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  const filteredThemes = themes.filter(theme => {
    if (searchFilters.searchQuery && 
        !theme.metadata.name.toLowerCase().includes(searchFilters.searchQuery.toLowerCase()) &&
        !theme.metadata.description.toLowerCase().includes(searchFilters.searchQuery.toLowerCase())) {
      return false;
    }
    
    if (searchFilters.categories.length > 0 && 
        !searchFilters.categories.includes(theme.metadata.category)) {
      return false;
    }
    
    if (searchFilters.tags.length > 0 && 
        !searchFilters.tags.some(tag => theme.metadata.tags.includes(tag))) {
      return false;
    }
    
    return true;
  });

  const categoryTabs = [
    { id: 'all', name: 'All Themes', count: filteredThemes.length },
    { id: 'modern', name: 'Modern', count: filteredThemes.filter(t => t.metadata.category === 'modern').length },
    { id: 'premium', name: 'Premium', count: filteredThemes.filter(t => t.metadata.category === 'premium').length },
    { id: 'minimal', name: 'Minimal', count: filteredThemes.filter(t => t.metadata.category === 'minimal').length },
    { id: 'classic', name: 'Classic', count: filteredThemes.filter(t => t.metadata.category === 'classic').length }
  ];

  const currentTabThemes = selectedTab === 0 
    ? filteredThemes 
    : filteredThemes.filter(t => t.metadata.category === categoryTabs[selectedTab].id);

  const handleThemePreview = (theme: ThemeGalleryItem) => {
    const config: ThemePreviewConfig = {
      themeId: theme.metadata.id,
      customizations: theme.customizations,
      restaurant: {
        id: 'preview',
        name: 'Preview Restaurant',
        data: {} // This would come from actual restaurant data
      },
      viewport: selectedDevice
    };
    
    setPreviewConfig(config);
    previewTheme(theme.metadata.id, config);
  };

  const handleThemeSelect = (theme: ThemeGalleryItem) => {
    onThemeChange(theme.metadata.id);
    onClose();
  };

  const handleSearchChange = (query: string) => {
    updateSearchFilters({ ...searchFilters, searchQuery: query });
  };

  const toggleCategory = (category: string) => {
    const newCategories = searchFilters.categories.includes(category)
      ? searchFilters.categories.filter(c => c !== category)
      : [...searchFilters.categories, category];
    updateSearchFilters({ ...searchFilters, categories: newCategories });
  };

  const DeviceIcon = ({ device }: { device: 'mobile' | 'tablet' | 'desktop' }) => {
    switch (device) {
      case 'mobile': return DevicePhoneMobileIcon;
      case 'tablet': return DeviceTabletIcon;
      case 'desktop': return ComputerDesktopIcon;
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
              <Dialog.Panel className="w-full max-w-7xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div>
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-semibold text-gray-900 flex items-center gap-2"
                    >
                      <SwatchIcon className="w-5 h-5" />
                      Theme Gallery
                    </Dialog.Title>
                    <p className="text-sm text-gray-600 mt-1">
                      Choose from {themes.length} professional themes with live preview
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {/* Device Selection */}
                    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                      {(['desktop', 'tablet', 'mobile'] as const).map((device) => {
                        const Icon = DeviceIcon({ device });
                        return (
                          <button
                            key={device}
                            onClick={() => setSelectedDevice(device)}
                            className={`p-2 rounded-md transition-colors ${
                              selectedDevice === device
                                ? 'bg-white shadow-sm text-blue-600'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                            title={`Preview in ${device} view`}
                          >
                            <Icon className="w-4 h-4" />
                          </button>
                        );
                      })}
                    </div>
                    
                    <button
                      type="button"
                      className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                      onClick={onClose}
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                {/* Search and Filters */}
                <div className="p-6 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Search themes..."
                        value={searchFilters.searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Sort by:</span>
                      <select
                        value={searchFilters.sortBy}
                        onChange={(e) => updateSearchFilters({ 
                          ...searchFilters, 
                          sortBy: e.target.value as any 
                        })}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="name">Name</option>
                        <option value="created">Created</option>
                        <option value="updated">Updated</option>
                        <option value="popularity">Popularity</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Category Filters */}
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(categoryColors).map((category) => {
                      const isActive = searchFilters.categories.includes(category);
                      const CategoryIcon = categoryIcons[category as keyof typeof categoryIcons];
                      
                      return (
                        <button
                          key={category}
                          onClick={() => toggleCategory(category)}
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            isActive
                              ? categoryColors[category as keyof typeof categoryColors]
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          <CategoryIcon className="w-3 h-3" />
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Category Tabs */}
                <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
                  <Tab.List className="flex border-b border-gray-200 bg-gray-50">
                    {categoryTabs.map((tab) => (
                      <Tab
                        key={tab.id}
                        className={({ selected }) =>
                          `px-6 py-3 text-sm font-medium focus:outline-none ${
                            selected
                              ? 'border-b-2 border-blue-500 text-blue-600 bg-white'
                              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                          }`
                        }
                      >
                        {tab.name} ({tab.count})
                      </Tab>
                    ))}
                  </Tab.List>

                  <Tab.Panels className="flex-1 overflow-y-auto max-h-96">
                    {categoryTabs.map((tab, tabIndex) => (
                      <Tab.Panel key={tab.id} className="p-6">
                        {isLoading ? (
                          <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <span className="ml-2 text-gray-600">Loading themes...</span>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {currentTabThemes.map((theme) => {
                              const isActive = theme.metadata.id === currentTheme;
                              const isHovered = hoveredTheme === theme.metadata.id;
                              const CategoryIcon = categoryIcons[theme.metadata.category as keyof typeof categoryIcons];
                              
                              return (
                                <div
                                  key={theme.metadata.id}
                                  className={`relative bg-white border-2 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-lg ${
                                    isActive 
                                      ? 'border-blue-500 ring-2 ring-blue-200' 
                                      : 'border-gray-200 hover:border-gray-300'
                                  }`}
                                  onMouseEnter={() => setHoveredTheme(theme.metadata.id)}
                                  onMouseLeave={() => setHoveredTheme(null)}
                                >
                                  {/* Preview Image */}
                                  <div className="aspect-video bg-gray-100 relative overflow-hidden">
                                    {theme.preview.thumbnailUrl ? (
                                      <img
                                        src={theme.preview.thumbnailUrl}
                                        alt={theme.metadata.name}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                        <SwatchIcon className="w-8 h-8 text-gray-400" />
                                      </div>
                                    )}
                                    
                                    {/* Active Indicator */}
                                    {isActive && (
                                      <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                                        <CheckIconSolid className="w-4 h-4" />
                                      </div>
                                    )}
                                    
                                    {/* Hover Actions */}
                                    {isHovered && (
                                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center gap-2">
                                        <button
                                          onClick={() => handleThemePreview(theme)}
                                          className="bg-white text-gray-900 px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
                                        >
                                          <EyeIcon className="w-4 h-4 inline mr-1" />
                                          Preview
                                        </button>
                                        <button
                                          onClick={() => handleThemeSelect(theme)}
                                          className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-600 transition-colors"
                                        >
                                          <CheckIcon className="w-4 h-4 inline mr-1" />
                                          Select
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                  
                                  {/* Theme Info */}
                                  <div className="p-4">
                                    <div className="flex items-start justify-between mb-2">
                                      <h4 className="font-semibold text-gray-900 text-sm">
                                        {theme.metadata.name}
                                      </h4>
                                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                        categoryColors[theme.metadata.category as keyof typeof categoryColors]
                                      }`}>
                                        <CategoryIcon className="w-3 h-3" />
                                        {theme.metadata.category}
                                      </span>
                                    </div>
                                    
                                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                                      {theme.metadata.description}
                                    </p>
                                    
                                    {/* Features */}
                                    <div className="flex flex-wrap gap-1 mb-3">
                                      {theme.metadata.features.slice(0, 2).map((feature, index) => (
                                        <span
                                          key={index}
                                          className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                                        >
                                          {feature}
                                        </span>
                                      ))}
                                      {theme.metadata.features.length > 2 && (
                                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                          +{theme.metadata.features.length - 2} more
                                        </span>
                                      )}
                                    </div>
                                    
                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => handleThemePreview(theme)}
                                        className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-md text-xs font-medium hover:bg-gray-200 transition-colors"
                                      >
                                        Preview
                                      </button>
                                      <button
                                        onClick={() => handleThemeSelect(theme)}
                                        className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                                          isActive
                                            ? 'bg-blue-100 text-blue-700 cursor-default'
                                            : 'bg-blue-500 text-white hover:bg-blue-600'
                                        }`}
                                        disabled={isActive}
                                      >
                                        {isActive ? 'Current' : 'Select'}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </Tab.Panel>
                    ))}
                  </Tab.Panels>
                </Tab.Group>

                {/* Theme Preview Modal */}
                {previewConfig && (
                  <ThemePreview
                    config={previewConfig}
                    isOpen={isPreviewMode}
                    onClose={endPreview}
                    onApply={() => {
                      handleThemeSelect(themes.find(t => t.metadata.id === previewConfig.themeId)!);
                      endPreview();
                    }}
                  />
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};