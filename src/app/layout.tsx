import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { EditorLoader } from './EditorLoader'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Restaurant Website Generator',
  description: 'Component kit + skin system for restaurant websites',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        
        {/* Visual Editor V2 - React-based */}
        <EditorLoader />
        
        {process.env.NODE_ENV === 'development' && (
          <>
            {/* Legacy editor (can be disabled via feature flags) */}
            <link rel="stylesheet" href="/dev/inspector.css" />
            <link rel="stylesheet" href="/dev/phase-d-editor.css" />
            <script 
              src="/dev/inspector.js" 
              type="module"
              async
            />
            <script 
              src="/dev/phase-d-editor-functional.js" 
              type="module"
              async
            />
          </>
        )}
      </body>
    </html>
  )
}