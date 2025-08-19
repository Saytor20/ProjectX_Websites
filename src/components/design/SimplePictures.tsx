'use client'

import { useState, useRef } from 'react'

interface SimplePicturesProps {
  isActive: boolean
  onImageAdd: (image: any) => void
}

export default function SimplePictures({ isActive, onImageAdd }: SimplePicturesProps) {
  const [showDialog, setShowDialog] = useState(true)
  const [imageUrl, setImageUrl] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isActive) return null

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0]
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const imageData = {
        id: `img_${Date.now()}`,
        url: e.target?.result as string,
        name: file.name,
        type: 'upload'
      }
      onImageAdd(imageData)
      // Don't close dialog, let user add more images
    }
    reader.readAsDataURL(file)
  }

  const handleUrlAdd = () => {
    if (!imageUrl.trim()) return

    const imageData = {
      id: `img_${Date.now()}`,
      url: imageUrl,
      name: 'External Image',
      type: 'url'
    }
    onImageAdd(imageData)
    setImageUrl('')
    // Don't close dialog, let user add more images
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    handleFileSelect(e.dataTransfer.files)
  }

  return (
    <>
      <style jsx>{`
        .picture-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.1);
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .picture-dialog {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          max-width: 400px;
          width: 90%;
        }

        .dialog-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 20px;
          text-align: center;
          color: #333;
        }

        .upload-options {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .upload-area {
          border: 2px dashed #ddd;
          border-radius: 8px;
          padding: 40px 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
          background: ${dragActive ? '#f0f8ff' : '#fafafa'};
          border-color: ${dragActive ? '#3498db' : '#ddd'};
        }

        .upload-area:hover {
          border-color: #3498db;
          background: #f0f8ff;
        }

        .upload-icon {
          font-size: 32px;
          margin-bottom: 8px;
        }

        .upload-text {
          font-size: 14px;
          color: #666;
          margin-bottom: 4px;
        }

        .upload-hint {
          font-size: 12px;
          color: #999;
        }

        .divider {
          text-align: center;
          margin: 16px 0;
          color: #999;
          font-size: 12px;
          position: relative;
        }

        .divider::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: #eee;
          z-index: -1;
        }

        .divider span {
          background: white;
          padding: 0 12px;
        }

        .url-input-group {
          display: flex;
          gap: 8px;
        }

        .url-input {
          flex: 1;
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 13px;
        }

        .url-input:focus {
          outline: none;
          border-color: #3498db;
        }

        .add-url-btn {
          padding: 10px 16px;
          background: #3498db;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
          white-space: nowrap;
        }

        .add-url-btn:hover {
          background: #2980b9;
        }

        .dialog-actions {
          display: flex;
          gap: 12px;
          margin-top: 20px;
        }

        .btn {
          flex: 1;
          padding: 10px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
        }

        .btn-cancel {
          background: #f8f9fa;
          color: #666;
        }

        .btn-cancel:hover {
          background: #e9ecef;
        }

        .hidden-input {
          display: none;
        }
      `}</style>

      <div className="picture-overlay">
        <div className="picture-dialog">
          <h3 className="dialog-title">Add Picture</h3>
          
          <div className="upload-options">
            {/* File Upload */}
            <div 
              className="upload-area"
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault()
                setDragActive(true)
              }}
              onDragLeave={() => setDragActive(false)}
            >
              <div className="upload-icon">📁</div>
              <div className="upload-text">Click to browse or drag & drop</div>
              <div className="upload-hint">JPG, PNG, GIF up to 10MB</div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden-input"
              onChange={(e) => handleFileSelect(e.target.files)}
            />

            {/* URL Input */}
            <div className="divider">
              <span>OR</span>
            </div>

            <div className="url-input-group">
              <input
                type="url"
                placeholder="Enter image URL..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="url-input"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleUrlAdd()
                  }
                }}
              />
              <button
                onClick={handleUrlAdd}
                className="add-url-btn"
                disabled={!imageUrl.trim()}
              >
                Add
              </button>
            </div>
          </div>

          <div className="dialog-actions">
            <button
              className="btn btn-cancel"
              onClick={() => {
                // Don't actually close, since we want to keep dialog open while tool is active
                // Instead, let parent handle tool switching
              }}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </>
  )
}