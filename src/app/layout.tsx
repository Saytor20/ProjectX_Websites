import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import EnhancedEditorComponent from '@/dev/EnhancedEditorComponent'

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
        
        {/* Development-only enhanced editor component - TypeScript transpiled */}
        {process.env.NODE_ENV === 'development' && (
          <>
            <link rel="stylesheet" href="/dev/inspector.css" />
            <EnhancedEditorComponent />
          </>
        )}
      </body>
    </html>
  )
}