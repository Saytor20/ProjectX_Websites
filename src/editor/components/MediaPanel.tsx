'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Uppy from '@uppy/core';
import Dashboard from '@uppy/dashboard';
import XHRUpload from '@uppy/xhr-upload';
import ImageEditor from '@uppy/image-editor';
import Webcam from '@uppy/webcam';
import { DashboardModal } from '@uppy/react';
import { useEditorContext } from '../EditorApp';

import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';
import '@uppy/image-editor/dist/style.min.css';
import '@uppy/webcam/dist/style.min.css';

interface MediaPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onImageSelect?: (imageUrl: string) => void;
  selectedElement?: HTMLElement | null;
}

interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: string;
}

export const MediaPanel: React.FC<MediaPanelProps> = ({
  isOpen,
  onClose,
  onImageSelect,
  selectedElement
}) => {
  const { addToHistory } = useEditorContext();
  const [uppy] = useState(() => {
    return new Uppy({
      restrictions: {
        maxFileSize: 10 * 1024 * 1024, // 10MB
        allowedFileTypes: ['image/*'],
        maxNumberOfFiles: 10,
      },
      autoProceed: false,
    });
  });

  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  // Configure Uppy plugins
  useEffect(() => {
    uppy
      .use(Dashboard, {
        inline: false,
        target: 'body',
        showProgressDetails: true,
        note: 'Images only, up to 10 files, 10 MB each',
        metaFields: [
          { id: 'name', name: 'Name', placeholder: 'File name' },
          { id: 'caption', name: 'Caption', placeholder: 'Describe what the image shows' },
        ],
        browserBackButtonClose: true,
      })
      .use(XHRUpload, {
        endpoint: '/api/upload/image',
        formData: true,
        fieldName: 'file',
        headers: {
          'Accept': 'application/json',
        },
      })
      .use(ImageEditor, {
        quality: 0.8,
      })
      .use(Webcam, {
        showVideoSourceDropdown: true,
        showRecordingLength: true,
      });

    // Handle successful uploads
    uppy.on('upload-success', (file, response) => {
      if (response.body && response.body.url) {
        const newFile: MediaFile = {
          id: file.id,
          name: file.name,
          url: response.body.url,
          type: file.type,
          size: file.size,
          uploadedAt: new Date().toISOString(),
        };

        setMediaFiles(prev => [newFile, ...prev]);

        // Auto-select uploaded image if an element is selected
        if (selectedElement && onImageSelect) {
          onImageSelect(response.body.url);
        }
      }
    });

    // Handle upload errors
    uppy.on('upload-error', (file, error, response) => {
      console.error('Upload error:', error);
      alert(`Upload failed: ${error.message}`);
    });

    return () => {
      // Clean up Uppy instance
      uppy.destroy();
    };
  }, [uppy, selectedElement, onImageSelect]);

  // Load existing media files
  const loadMediaFiles = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/media/gallery');
      if (response.ok) {
        const files = await response.json();
        setMediaFiles(files);
      }
    } catch (error) {
      console.error('Failed to load media files:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load media files when panel opens
  useEffect(() => {
    if (isOpen) {
      loadMediaFiles();
    }
  }, [isOpen, loadMediaFiles]);

  // Replace image in selected element
  const replaceImage = useCallback((imageUrl: string, element?: HTMLElement) => {
    const targetElement = element || selectedElement;
    if (!targetElement) return;

    let imageElement: HTMLImageElement | null = null;

    // Find the image element
    if (targetElement.tagName === 'IMG') {
      imageElement = targetElement as HTMLImageElement;
    } else {
      imageElement = targetElement.querySelector('img');
    }

    if (!imageElement) {
      // If no img element, try to set background image
      const previousBackground = targetElement.style.backgroundImage;
      const beforeState = {
        id: `history-${Date.now()}`,
        elementId: targetElement.id || `element-${Date.now()}`,
        beforeState: {
          position: { x: 0, y: 0 },
          size: { width: targetElement.offsetWidth, height: targetElement.offsetHeight },
          rotation: 0,
          styles: { backgroundImage: previousBackground },
        },
        afterState: {
          position: { x: 0, y: 0 },
          size: { width: targetElement.offsetWidth, height: targetElement.offsetHeight },
          rotation: 0,
          styles: { backgroundImage: `url(${imageUrl})` },
        },
        type: 'image' as const,
        timestamp: Date.now(),
      };

      targetElement.style.backgroundImage = `url(${imageUrl})`;
      targetElement.style.backgroundSize = 'cover';
      targetElement.style.backgroundPosition = 'center';
      
      addToHistory(beforeState);
      return;
    }

    // Replace image src
    const previousSrc = imageElement.src;
    const beforeState = {
      id: `history-${Date.now()}`,
      elementId: imageElement.id || targetElement.id || `element-${Date.now()}`,
      beforeState: {
        position: { x: 0, y: 0 },
        size: { width: imageElement.offsetWidth, height: imageElement.offsetHeight },
        rotation: 0,
        styles: {},
        imageSrc: previousSrc,
      },
      afterState: {
        position: { x: 0, y: 0 },
        size: { width: imageElement.offsetWidth, height: imageElement.offsetHeight },
        rotation: 0,
        styles: {},
        imageSrc: imageUrl,
      },
      type: 'image' as const,
      timestamp: Date.now(),
    };

    imageElement.src = imageUrl;
    addToHistory(beforeState);

    if (onImageSelect) {
      onImageSelect(imageUrl);
    }
  }, [selectedElement, onImageSelect, addToHistory]);

  // Delete media file
  const deleteMediaFile = useCallback(async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      const response = await fetch(`/api/media/delete/${fileId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMediaFiles(prev => prev.filter(file => file.id !== fileId));
      } else {
        alert('Failed to delete image');
      }
    } catch (error) {
      console.error('Failed to delete media file:', error);
      alert('Failed to delete image');
    }
  }, []);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="media-panel-backdrop"
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 10000,
        }}
      />

      {/* Media Panel */}
      <div
        className="media-panel"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90vw',
          maxWidth: '800px',
          height: '80vh',
          background: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          zIndex: 10001,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div className="media-panel-header">
          <h3>Media Library</h3>
          <div className="media-panel-actions">
            <button
              className="upload-btn"
              onClick={() => {
                const dashboard = uppy.getPlugin('Dashboard');
                if (dashboard && 'openModal' in dashboard) {
                  (dashboard as any).openModal();
                }
              }}
            >
              📁 Upload Images
            </button>
            <button className="close-btn" onClick={onClose}>
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="media-panel-content">
          {isLoading ? (
            <div className="loading-state">
              <div className="spinner">⟳</div>
              <p>Loading media files...</p>
            </div>
          ) : mediaFiles.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📷</div>
              <h4>No images yet</h4>
              <p>Upload your first image to get started</p>
              <button
                className="upload-btn-large"
                onClick={() => {
                  const dashboard = uppy.getPlugin('Dashboard');
                  if (dashboard && 'openModal' in dashboard) {
                    (dashboard as any).openModal();
                  }
                }}
              >
                Upload Images
              </button>
            </div>
          ) : (
            <div className="media-grid">
              {mediaFiles.map((file) => (
                <div
                  key={file.id}
                  className={`media-item ${selectedFile === file.id ? 'selected' : ''}`}
                  onClick={() => setSelectedFile(file.id)}
                >
                  <div className="media-item-image">
                    <img src={file.url} alt={file.name} loading="lazy" />
                    <div className="media-item-overlay">
                      <button
                        className="use-image-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          replaceImage(file.url);
                          onClose();
                        }}
                        title="Use this image"
                      >
                        ✓ Use
                      </button>
                      <button
                        className="delete-image-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteMediaFile(file.id);
                        }}
                        title="Delete image"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <div className="media-item-info">
                    <p className="media-item-name">{file.name}</p>
                    <p className="media-item-size">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="media-panel-footer">
          <p>
            {selectedElement ? 
              'Select an image to replace the current one' : 
              'Select an image to use in your design'
            }
          </p>
        </div>
      </div>

      {/* Uppy Dashboard Modal */}
      <DashboardModal
        uppy={uppy}
        open={false}
        onRequestClose={() => {
          const dashboard = uppy.getPlugin('Dashboard');
          if (dashboard && 'closeModal' in dashboard) {
            (dashboard as any).closeModal();
          }
        }}
        plugins={['Dashboard']}
      />

      <style jsx>{`
        .media-panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #e5e7eb;
          background: #f9fafb;
          border-radius: 12px 12px 0 0;
        }

        .media-panel-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #111827;
        }

        .media-panel-actions {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .upload-btn {
          padding: 8px 16px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: background 0.2s;
        }

        .upload-btn:hover {
          background: #2563eb;
        }

        .close-btn {
          padding: 8px;
          background: #f3f4f6;
          color: #6b7280;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 16px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-btn:hover {
          background: #e5e7eb;
          color: #374151;
        }

        .media-panel-content {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #6b7280;
        }

        .spinner {
          font-size: 24px;
          animation: spin 1s linear infinite;
          margin-bottom: 12px;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          text-align: center;
          color: #6b7280;
        }

        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
          opacity: 0.5;
        }

        .empty-state h4 {
          margin: 0 0 8px 0;
          font-size: 18px;
          color: #374151;
        }

        .empty-state p {
          margin: 0 0 24px 0;
          font-size: 14px;
        }

        .upload-btn-large {
          padding: 12px 24px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 500;
          transition: background 0.2s;
        }

        .upload-btn-large:hover {
          background: #2563eb;
        }

        .media-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 16px;
        }

        .media-item {
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.2s;
          background: white;
        }

        .media-item:hover {
          border-color: #3b82f6;
          transform: translateY(-2px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .media-item.selected {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        }

        .media-item-image {
          position: relative;
          aspect-ratio: 1;
          overflow: hidden;
        }

        .media-item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.2s;
        }

        .media-item:hover .media-item-image img {
          transform: scale(1.05);
        }

        .media-item-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .media-item:hover .media-item-overlay {
          opacity: 1;
        }

        .use-image-btn {
          padding: 6px 12px;
          background: #10b981;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 500;
        }

        .use-image-btn:hover {
          background: #059669;
        }

        .delete-image-btn {
          padding: 6px 8px;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }

        .delete-image-btn:hover {
          background: #dc2626;
        }

        .media-item-info {
          padding: 12px;
        }

        .media-item-name {
          margin: 0 0 4px 0;
          font-size: 14px;
          font-weight: 500;
          color: #111827;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .media-item-size {
          margin: 0;
          font-size: 12px;
          color: #6b7280;
        }

        .media-panel-footer {
          padding: 16px 20px;
          border-top: 1px solid #e5e7eb;
          background: #f9fafb;
          border-radius: 0 0 12px 12px;
          text-align: center;
        }

        .media-panel-footer p {
          margin: 0;
          font-size: 14px;
          color: #6b7280;
        }
      `}</style>
    </>
  );
};