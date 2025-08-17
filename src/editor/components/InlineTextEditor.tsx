'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Underline from '@tiptap/extension-underline';
import { useEditorContext } from '../EditorApp';

interface InlineTextEditorProps {
  element: HTMLElement;
  onClose: () => void;
}

interface ContentToolbarProps {
  editor: any;
}

const ContentToolbar: React.FC<ContentToolbarProps> = ({ editor }) => {
  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="text-toolbar">
      <div className="toolbar-group">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'is-active' : ''}
          title="Bold"
        >
          <strong>B</strong>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'is-active' : ''}
          title="Italic"
        >
          <em>I</em>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive('underline') ? 'is-active' : ''}
          title="Underline"
        >
          <u>U</u>
        </button>
      </div>

      <div className="toolbar-group">
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}
          title="Align Left"
        >
          ⇤
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}
          title="Align Center"
        >
          ⇔
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}
          title="Align Right"
        >
          ⇥
        </button>
      </div>

      <div className="toolbar-group">
        <button
          onClick={setLink}
          className={editor.isActive('link') ? 'is-active' : ''}
          title="Add Link"
        >
          🔗
        </button>
        <input
          type="color"
          onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
          value={editor.getAttributes('textStyle').color || '#000000'}
          title="Text Color"
        />
      </div>

      <div className="toolbar-group">
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
          title="Heading 1"
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
          title="Heading 2"
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={editor.isActive('paragraph') ? 'is-active' : ''}
          title="Paragraph"
        >
          P
        </button>
      </div>
    </div>
  );
};

export const InlineTextEditor: React.FC<InlineTextEditorProps> = ({
  element,
  onClose
}) => {
  const { addToHistory } = useEditorContext();
  const [initialContent, setInitialContent] = useState('');
  const editorRef = useRef<HTMLDivElement>(null);

  // Get the initial content from the element
  useEffect(() => {
    const content = element.innerHTML || element.textContent || '';
    setInitialContent(content);
  }, [element]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'editor-link',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
        style: 'min-height: 50px; padding: 8px;',
      },
    },
    onUpdate: ({ editor }) => {
      // Auto-save content changes
      const newContent = editor.getHTML();
      if (newContent !== initialContent) {
        updateElementContent(newContent);
      }
    },
  });

  const updateElementContent = useCallback((newContent: string) => {
    if (!element) return;

    // Store history state before change
    const beforeState = {
      id: `history-${Date.now()}`,
      elementId: element.id || `element-${Date.now()}`,
      beforeState: {
        position: { x: 0, y: 0 },
        size: { width: element.offsetWidth, height: element.offsetHeight },
        rotation: 0,
        styles: {},
        content: element.innerHTML,
      },
      afterState: {
        position: { x: 0, y: 0 },
        size: { width: element.offsetWidth, height: element.offsetHeight },
        rotation: 0,
        styles: {},
        content: newContent,
      },
      type: 'content' as const,
      timestamp: Date.now(),
    };

    // Update the element content
    element.innerHTML = newContent;

    // Add to history
    addToHistory(beforeState);
  }, [element, addToHistory]);

  const handleSave = useCallback(() => {
    if (!editor) return;

    const content = editor.getHTML();
    updateElementContent(content);
    onClose();
  }, [editor, updateElementContent, onClose]);

  const handleCancel = useCallback(() => {
    if (!element) return;

    // Restore original content
    element.innerHTML = initialContent;
    onClose();
  }, [element, initialContent, onClose]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleCancel();
      } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleSave();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleCancel, handleSave]);

  // Position the editor overlay
  const getElementRect = useCallback(() => {
    if (!element) return { top: 0, left: 0, width: 200, height: 100 };

    const rect = element.getBoundingClientRect();
    return {
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
      width: Math.max(rect.width, 200),
      height: Math.max(rect.height, 100),
    };
  }, [element]);

  const elementRect = getElementRect();

  return (
    <div className="inline-text-editor-overlay">
      {/* Backdrop */}
      <div 
        className="editor-backdrop"
        onClick={handleCancel}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.3)',
          zIndex: 10000,
        }}
      />

      {/* Editor Container */}
      <div
        ref={editorRef}
        className="editor-container"
        style={{
          position: 'absolute',
          top: elementRect.top - 60, // Space for toolbar
          left: elementRect.left,
          width: elementRect.width,
          minWidth: 300,
          zIndex: 10001,
          background: '#ffffff',
          border: '2px solid #3b82f6',
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Toolbar */}
        <div className="editor-header">
          <ContentToolbar editor={editor} />
          <div className="editor-actions">
            <button onClick={handleSave} className="save-btn">
              ✓ Save
            </button>
            <button onClick={handleCancel} className="cancel-btn">
              ✕ Cancel
            </button>
          </div>
        </div>

        {/* Editor Content */}
        <div 
          className="editor-content"
          style={{
            minHeight: elementRect.height,
            maxHeight: '400px',
            overflowY: 'auto',
          }}
        >
          <EditorContent editor={editor} />
        </div>

        {/* Helper Text */}
        <div className="editor-footer">
          <small>Press Escape to cancel, Ctrl+Enter to save</small>
        </div>
      </div>

      <style jsx>{`
        .text-toolbar {
          display: flex;
          gap: 8px;
          padding: 8px;
          background: #f8f9fa;
          border-bottom: 1px solid #e9ecef;
          border-radius: 8px 8px 0 0;
        }

        .toolbar-group {
          display: flex;
          gap: 4px;
          padding: 0 8px;
          border-right: 1px solid #e9ecef;
        }

        .toolbar-group:last-child {
          border-right: none;
        }

        .text-toolbar button {
          padding: 6px 8px;
          border: 1px solid #d1d5db;
          background: #ffffff;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          line-height: 1;
          transition: all 0.2s;
        }

        .text-toolbar button:hover {
          background: #f3f4f6;
          border-color: #9ca3af;
        }

        .text-toolbar button.is-active {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        .text-toolbar input[type="color"] {
          width: 32px;
          height: 32px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          cursor: pointer;
        }

        .editor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #f8f9fa;
          border-radius: 8px 8px 0 0;
        }

        .editor-actions {
          display: flex;
          gap: 8px;
          padding: 8px;
        }

        .save-btn {
          padding: 6px 12px;
          background: #10b981;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }

        .save-btn:hover {
          background: #059669;
        }

        .cancel-btn {
          padding: 6px 12px;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }

        .cancel-btn:hover {
          background: #dc2626;
        }

        .editor-footer {
          padding: 8px;
          background: #f8f9fa;
          border-top: 1px solid #e9ecef;
          border-radius: 0 0 8px 8px;
          text-align: center;
          color: #6b7280;
        }

        .editor-content {
          background: white;
        }

        /* Tiptap editor styles */
        .ProseMirror {
          outline: none;
          padding: 12px;
          border: none;
          background: white;
        }

        .ProseMirror p {
          margin: 0.5em 0;
        }

        .ProseMirror h1, .ProseMirror h2, .ProseMirror h3 {
          margin: 0.8em 0 0.4em 0;
          font-weight: bold;
        }

        .ProseMirror h1 {
          font-size: 1.5em;
        }

        .ProseMirror h2 {
          font-size: 1.3em;
        }

        .editor-link {
          color: #3b82f6;
          text-decoration: underline;
        }

        .editor-link:hover {
          color: #1d4ed8;
        }
      `}</style>
    </div>
  );
};