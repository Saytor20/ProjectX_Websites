'use client';

import { useEffect, useState } from 'react';
import { getFeatureFlags } from '../lib/feature-flags';

export const EditorLoader = () => {
  const [EditorApp, setEditorApp] = useState<React.ComponentType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const featureFlags = getFeatureFlags();

  useEffect(() => {
    if (featureFlags.VISUAL_EDITOR_V2 && !EditorApp && !isLoading) {
      setIsLoading(true);
      
      // Dynamically import the editor to reduce initial bundle size
      import('../editor/EditorApp').then(({ EditorApp: ImportedEditorApp }) => {
        setEditorApp(() => ImportedEditorApp);
        setIsLoading(false);
      }).catch((error) => {
        console.error('Failed to load Visual Editor V2:', error);
        setIsLoading(false);
      });
    }
  }, [featureFlags.VISUAL_EDITOR_V2, EditorApp, isLoading]);

  // Don't render anything if visual editor v2 is disabled
  if (!featureFlags.VISUAL_EDITOR_V2) {
    return null;
  }

  // Show loading state
  if (isLoading) {
    return (
      <div 
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '4px',
          fontSize: '12px',
          zIndex: 10000
        }}
      >
        Loading Visual Editor...
      </div>
    );
  }

  // Render the editor app if loaded
  if (EditorApp) {
    return <EditorApp />;
  }

  return null;
};