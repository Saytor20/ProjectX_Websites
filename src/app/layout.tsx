import type { Metadata } from 'next'
import EditorProvider from './EditorProvider'
import './globals.css'

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
      <body style={{ fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}>
        {children}
        <EditorProvider />
      </body>
    </html>
  )
}
