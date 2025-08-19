'use client'

import { useState } from 'react'

interface SimpleLinksProps {
  isActive: boolean
  onLinkCreate: (link: any) => void
}

export default function SimpleLinks({ isActive, onLinkCreate }: SimpleLinksProps) {
  const [showDialog, setShowDialog] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkText, setLinkText] = useState('')
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(null)

  if (!isActive) return null

  const handleElementClick = (e: React.MouseEvent) => {
    e.preventDefault()
    const target = e.target as HTMLElement
    
    // Skip if clicking on dialog
    if (target.closest('.link-dialog')) return

    setSelectedElement(target)
    setShowDialog(true)
    
    // Pre-fill with existing link if element is already a link
    if (target.tagName === 'A') {
      const href = target.getAttribute('href') || ''
      const text = target.textContent || ''
      setLinkUrl(href)
      setLinkText(text)
    } else {
      setLinkText(target.textContent || '')
      setLinkUrl('')
    }
  }

  const handleCreateLink = () => {
    if (!selectedElement || !linkUrl.trim()) return

    const linkData = {
      id: `link_${Date.now()}`,
      element: selectedElement,
      url: linkUrl,
      text: linkText,
      target: linkUrl.startsWith('http') ? '_blank' : '_self'
    }

    // Create or update the link
    if (selectedElement.tagName === 'A') {
      // Update existing link
      selectedElement.setAttribute('href', linkUrl)
      if (linkText) {
        selectedElement.textContent = linkText
      }
    } else {
      // Create new link
      const link = document.createElement('a')
      link.href = linkUrl
      link.textContent = linkText || selectedElement.textContent || 'Link'
      link.target = linkData.target
      link.style.color = '#3498db'
      link.style.textDecoration = 'underline'
      
      // Replace the element with the link
      if (selectedElement.parentNode) {
        selectedElement.parentNode.replaceChild(link, selectedElement)
      }
    }

    onLinkCreate(linkData)
    setShowDialog(false)
    setSelectedElement(null)
    setLinkUrl('')
    setLinkText('')
  }

  const handleRemoveLink = () => {
    if (!selectedElement || selectedElement.tagName !== 'A') return

    // Convert link back to text
    const textNode = document.createTextNode(selectedElement.textContent || '')
    if (selectedElement.parentNode) {
      selectedElement.parentNode.replaceChild(textNode, selectedElement)
    }

    setShowDialog(false)
    setSelectedElement(null)
    setLinkUrl('')
    setLinkText('')
  }

  return (
    <>
      <style jsx>{`
        .link-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          cursor: pointer;
          z-index: 10;
        }

        .link-dialog {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          max-width: 400px;
          width: 90%;
          z-index: 100;
        }

        .dialog-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 20px;
          text-align: center;
          color: #333;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-label {
          display: block;
          margin-bottom: 6px;
          font-size: 13px;
          font-weight: 500;
          color: #555;
        }

        .form-input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 13px;
          box-sizing: border-box;
        }

        .form-input:focus {
          outline: none;
          border-color: #3498db;
          box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.1);
        }

        .form-hint {
          font-size: 11px;
          color: #999;
          margin-top: 4px;
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
          transition: all 0.2s ease;
        }

        .btn-primary {
          background: #3498db;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #2980b9;
        }

        .btn-primary:disabled {
          background: #bdc3c7;
          cursor: not-allowed;
        }

        .btn-danger {
          background: #e74c3c;
          color: white;
        }

        .btn-danger:hover {
          background: #c0392b;
        }

        .btn-cancel {
          background: #f8f9fa;
          color: #666;
        }

        .btn-cancel:hover {
          background: #e9ecef;
        }

        .instructions {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.9);
          color: white;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 12px;
          text-align: center;
          z-index: 99;
        }
      `}</style>

      <div className="link-overlay" onClick={handleElementClick}>
        {/* Instructions */}
        <div className="instructions">
          Click on any text to add or edit links • Press Escape to exit
        </div>

        {/* Link Dialog */}
        {showDialog && (
          <div className="link-dialog">
            <h3 className="dialog-title">
              {selectedElement?.tagName === 'A' ? 'Edit Link' : 'Create Link'}
            </h3>
            
            <div className="form-group">
              <label className="form-label">Link URL</label>
              <input
                type="url"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="form-input"
                autoFocus
              />
              <div className="form-hint">
                Enter a full URL (with http:// or https://)
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Link Text</label>
              <input
                type="text"
                placeholder="Click here"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                className="form-input"
              />
              <div className="form-hint">
                Text that will be displayed (optional)
              </div>
            </div>

            <div className="dialog-actions">
              <button
                className="btn btn-cancel"
                onClick={() => setShowDialog(false)}
              >
                Cancel
              </button>
              
              {selectedElement?.tagName === 'A' && (
                <button
                  className="btn btn-danger"
                  onClick={handleRemoveLink}
                >
                  Remove Link
                </button>
              )}
              
              <button
                className="btn btn-primary"
                onClick={handleCreateLink}
                disabled={!linkUrl.trim()}
              >
                {selectedElement?.tagName === 'A' ? 'Update' : 'Create'} Link
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}