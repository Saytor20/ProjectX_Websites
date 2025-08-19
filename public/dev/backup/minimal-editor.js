// Minimal Editor - Simple fallback if main editor doesn't load
console.log('🔄 Loading Minimal Editor...');

// Create a simple editor button immediately
function createMinimalEditor() {
  // Don't create if main editor button already exists
  if (document.getElementById('simple-editor-toggle')) {
    console.log('✅ Main editor button found, skipping minimal editor');
    return;
  }
  
  // Remove any existing minimal button
  const existingButton = document.getElementById('minimal-editor-btn');
  if (existingButton) existingButton.remove();
  
  // Create button
  const button = document.createElement('button');
  button.id = 'minimal-editor-btn';
  button.innerHTML = '🎨 Simple Editor';
  button.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 10000;
    padding: 15px 25px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 8px 25px rgba(0,0,0,0.2);
    transition: all 0.3s ease;
    font-family: system-ui, -apple-system, sans-serif;
  `;
  
  // Hover effects
  button.onmouseover = () => {
    button.style.transform = 'scale(1.05) translateY(-2px)';
    button.style.boxShadow = '0 12px 35px rgba(0,0,0,0.3)';
  };
  
  button.onmouseout = () => {
    button.style.transform = 'scale(1) translateY(0)';
    button.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
  };
  
  // Click handler
  button.onclick = () => {
    if (window.simpleEditor) {
      // Use main editor if available
      window.simpleEditor.toggleEditor();
    } else {
      // Fallback functionality
      alert('🎨 Simple Editor\n\nEditor functionality:\n• Click elements to select them\n• Use browser developer tools for editing\n• Changes are temporary (refresh to reset)\n\nMain editor is loading...');
      
      // Try to load main editor
      if (!document.querySelector('script[src="/dev/simple-editor.js"]')) {
        const script = document.createElement('script');
        script.src = '/dev/simple-editor.js';
        script.onload = () => {
          console.log('✅ Main editor loaded successfully');
          button.innerHTML = '✏️ Edit';
          button.style.background = '#3b82f6';
        };
        script.onerror = () => {
          console.error('❌ Failed to load main editor');
          button.innerHTML = '⚠️ Editor Error';
          button.style.background = '#ef4444';
        };
        document.head.appendChild(script);
      }
    }
  };
  
  // Add to page
  document.body.appendChild(button);
  console.log('✅ Minimal Editor button created');
}

// Initialize immediately if DOM is ready, otherwise wait
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createMinimalEditor);
} else {
  createMinimalEditor();
}

// Also try after a short delay to ensure it shows up
setTimeout(createMinimalEditor, 1000);