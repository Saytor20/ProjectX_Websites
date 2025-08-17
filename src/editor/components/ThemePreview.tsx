'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { 
  XMarkIcon, 
  CheckIcon, 
  ArrowPathIcon,
  DevicePhoneMobileIcon,
  DeviceTabletIcon,
  ComputerDesktopIcon,
  EyeIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import type { ThemePreviewConfig } from '../types/theme';

interface ThemePreviewProps {
  config: ThemePreviewConfig;
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
}

interface ViewportSize {
  name: string;
  width: number;
  height: number;
  icon: React.ComponentType<{ className?: string }>;
}

const viewportSizes: Record<string, ViewportSize> = {
  mobile: {
    name: 'Mobile',
    width: 375,
    height: 667,
    icon: DevicePhoneMobileIcon
  },
  tablet: {
    name: 'Tablet',
    width: 768,
    height: 1024,
    icon: DeviceTabletIcon
  },
  desktop: {
    name: 'Desktop',
    width: 1200,
    height: 800,
    icon: ComputerDesktopIcon
  }
};

export const ThemePreview: React.FC<ThemePreviewProps> = ({
  config,
  isOpen,
  onClose,
  onApply
}) => {
  const [currentViewport, setCurrentViewport] = useState<keyof typeof viewportSizes>(config.viewport || 'desktop');
  const [isLoading, setIsLoading] = useState(true);
  const [previewData, setPreviewData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [scale, setScale] = useState(1);

  // Calculate scale to fit preview in available space
  const calculateScale = useCallback(() => {
    const viewport = viewportSizes[currentViewport];
    const containerWidth = 800; // Available width in modal
    const containerHeight = 600; // Available height in modal
    
    const scaleX = containerWidth / viewport.width;
    const scaleY = containerHeight / viewport.height;
    
    return Math.min(scaleX, scaleY, 1);
  }, [currentViewport]);

  // Load theme preview data
  useEffect(() => {
    if (isOpen && config) {
      loadPreviewData();
    }
  }, [isOpen, config, currentViewport]);

  // Update scale when viewport changes
  useEffect(() => {
    setScale(calculateScale());
  }, [currentViewport, calculateScale]);

  const loadPreviewData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/themes/preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...config,
          viewport: currentViewport
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to load theme preview');
      }
      
      const data = await response.json();
      setPreviewData(data.preview);
      
      // Apply preview in iframe
      if (iframeRef.current) {
        await renderPreviewInIframe(data.preview);
      }
      
    } catch (error) {
      console.error('Error loading theme preview:', error);
      setError(error instanceof Error ? error.message : 'Failed to load preview');
    } finally {
      setIsLoading(false);
    }
  };

  const renderPreviewInIframe = async (preview: any) => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    // Create complete HTML document
    const htmlContent = `
<!DOCTYPE html>
<html lang="en" data-skin="${config.themeId}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Theme Preview - ${config.restaurant.name}</title>
  <style>
    /* Reset and base styles */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    
    /* Theme CSS */
    ${preview.css}
    
    /* Preview-specific styles */
    .preview-container {
      min-height: 100vh;
      width: 100%;
    }
    
    .navbar {
      background: var(--color-background, #ffffff);
      padding: 1rem 2rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    
    .navbar-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .navbar-logo h1 {
      color: var(--color-primary, #333);
      font-size: 1.5rem;
      font-weight: bold;
    }
    
    .navbar-nav {
      display: flex;
      gap: 2rem;
    }
    
    .navbar-nav a {
      color: var(--color-text-primary, #333);
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s;
    }
    
    .navbar-nav a:hover {
      color: var(--color-primary, #007bff);
    }
    
    .hero {
      background: linear-gradient(135deg, var(--color-primary, #007bff), var(--color-secondary, #6c757d));
      color: white;
      padding: 4rem 2rem;
      text-align: center;
    }
    
    .hero-content {
      max-width: 800px;
      margin: 0 auto;
    }
    
    .hero-title {
      font-size: 3rem;
      font-weight: bold;
      margin-bottom: 1rem;
    }
    
    .hero-subtitle {
      font-size: 1.25rem;
      margin-bottom: 2rem;
      opacity: 0.9;
    }
    
    .hero-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }
    
    .btn {
      padding: 0.75rem 2rem;
      border: none;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
      display: inline-block;
    }
    
    .btn-primary {
      background: var(--color-accent, #28a745);
      color: white;
    }
    
    .btn-primary:hover {
      background: var(--color-accent-hover, #218838);
      transform: translateY(-1px);
    }
    
    .btn-secondary {
      background: transparent;
      color: white;
      border: 2px solid white;
    }
    
    .btn-secondary:hover {
      background: white;
      color: var(--color-primary, #007bff);
    }
    
    .menu-section {
      padding: 4rem 2rem;
      background: var(--color-surface, #f8f9fa);
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .menu-section h2 {
      text-align: center;
      font-size: 2.5rem;
      color: var(--color-text-primary, #333);
      margin-bottom: 3rem;
    }
    
    .menu-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }
    
    .menu-item {
      background: var(--color-background, white);
      border-radius: 0.5rem;
      padding: 1.5rem;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      transition: transform 0.2s;
    }
    
    .menu-item:hover {
      transform: translateY(-2px);
    }
    
    .menu-item-image {
      width: 100%;
      height: 200px;
      background: linear-gradient(45deg, var(--color-primary, #007bff), var(--color-accent, #28a745));
      border-radius: 0.25rem;
      margin-bottom: 1rem;
    }
    
    .menu-item h3 {
      color: var(--color-text-primary, #333);
      font-size: 1.25rem;
      margin-bottom: 0.5rem;
    }
    
    .menu-item p {
      color: var(--color-text-secondary, #666);
      margin-bottom: 1rem;
    }
    
    .price {
      color: var(--color-primary, #007bff);
      font-size: 1.25rem;
      font-weight: bold;
    }
    
    .footer {
      background: var(--color-secondary, #333);
      color: var(--color-text-inverse, white);
      padding: 3rem 2rem 2rem;
    }
    
    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }
    
    .footer-section h3 {
      margin-bottom: 1rem;
      color: var(--color-accent, #28a745);
    }
    
    .footer-section p {
      opacity: 0.8;
    }
    
    /* Responsive design */
    @media (max-width: 768px) {
      .navbar-content {
        flex-direction: column;
        gap: 1rem;
      }
      
      .navbar-nav {
        gap: 1rem;
      }
      
      .hero-title {
        font-size: 2rem;
      }
      
      .hero-buttons {
        flex-direction: column;
        align-items: center;
      }
      
      .menu-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  ${preview.html}
  
  <script>
    // Prevent navigation in preview
    document.addEventListener('click', function(e) {
      if (e.target.tagName === 'A') {
        e.preventDefault();
      }
    });
    
    // Signal that preview is loaded
    window.parent.postMessage({ type: 'preview-loaded' }, '*');
  </script>
</body>
</html>
    `;

    doc.open();
    doc.write(htmlContent);
    doc.close();
  };

  const handleViewportChange = (viewport: keyof typeof viewportSizes) => {
    setCurrentViewport(viewport);
  };

  const handleRefresh = () => {
    loadPreviewData();
  };

  const handleOpenInNewTab = () => {
    if (previewData?.html) {
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        renderPreviewInIframe({ current: { contentDocument: newWindow.document } } as any);
      }
    }
  };

  const currentViewportSize = viewportSizes[currentViewport];

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
          <div className="flex min-h-full items-center justify-center p-4">
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
                      <EyeIcon className="w-5 h-5" />
                      Theme Preview
                    </Dialog.Title>
                    <p className="text-sm text-gray-600 mt-1">
                      {config.restaurant.name} - {config.themeId}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {/* Viewport Selection */}
                    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                      {(Object.keys(viewportSizes) as Array<keyof typeof viewportSizes>).map((viewport) => {
                        const size = viewportSizes[viewport];
                        const Icon = size.icon;
                        return (
                          <button
                            key={viewport}
                            onClick={() => handleViewportChange(viewport)}
                            className={`p-2 rounded-md transition-colors ${
                              currentViewport === viewport
                                ? 'bg-white shadow-sm text-blue-600'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                            title={`${size.name} (${size.width}×${size.height})`}
                          >
                            <Icon className="w-4 h-4" />
                          </button>
                        );
                      })}
                    </div>
                    
                    {/* Controls */}
                    <button
                      onClick={handleRefresh}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
                      title="Refresh Preview"
                    >
                      <ArrowPathIcon className="w-5 h-5" />
                    </button>
                    
                    <button
                      onClick={handleOpenInNewTab}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
                      title="Open in New Tab"
                    >
                      <ArrowTopRightOnSquareIcon className="w-5 h-5" />
                    </button>
                    
                    <button
                      onClick={onClose}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
                    >
                      <XMarkIcon className="w-6 w-6" />
                    </button>
                  </div>
                </div>

                {/* Preview Area */}
                <div className="p-6 bg-gray-100">
                  <div className="flex items-center justify-center">
                    {isLoading ? (
                      <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2 text-gray-600">Loading preview...</span>
                      </div>
                    ) : error ? (
                      <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                          <p className="text-red-600 mb-2">{error}</p>
                          <button
                            onClick={handleRefresh}
                            className="text-blue-600 hover:text-blue-800 underline"
                          >
                            Try Again
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div 
                        className="bg-white rounded-lg shadow-lg overflow-hidden"
                        style={{
                          width: currentViewportSize.width * scale,
                          height: currentViewportSize.height * scale,
                          transform: `scale(${scale})`,
                          transformOrigin: 'top left'
                        }}
                      >
                        <iframe
                          ref={iframeRef}
                          className="w-full h-full border-0"
                          style={{
                            width: currentViewportSize.width,
                            height: currentViewportSize.height,
                            transform: `scale(${1/scale})`,
                            transformOrigin: 'top left'
                          }}
                          title="Theme Preview"
                          sandbox="allow-scripts allow-same-origin"
                        />
                      </div>
                    )}
                  </div>
                  
                  {/* Preview Info */}
                  <div className="mt-4 text-center text-sm text-gray-600">
                    {currentViewportSize.name}: {currentViewportSize.width}×{currentViewportSize.height}px
                    {scale < 1 && ` (scaled to ${Math.round(scale * 100)}%)`}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
                  <div className="text-sm text-gray-600">
                    Preview theme changes before applying to your site
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={onClose}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={onApply}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    >
                      <CheckIcon className="w-4 h-4 mr-2" />
                      Apply Theme
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};