'use client';

import dynamic from 'next/dynamic';

// Dynamic import of EditorShell with SSR disabled
const EditorShell = dynamic(
  () => import('@/editor/EditorShell'),
  { ssr: false }
);

export default function EditorProvider() {
  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return <EditorShell />;
}