import type { Metadata } from 'next'
import { Inter, DM_Serif_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const dmSerif = DM_Serif_Display({ 
  subsets: ['latin'],
  weight: '400',
  variable: '--font-dm-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Neighborhood Italian Restaurant | Farm to Table Brooklyn',
  description: 'Ingredient-driven neighborhood Italian restaurant featuring the highest quality imported Italian ingredients alongside organic meat, dairy, and produce sourced from local farms. Authentic Brooklyn dining experience.',
  keywords: 'Italian restaurant, Brooklyn, Fort Greene, farm to table, neighborhood dining, sustainable restaurant, organic ingredients, Italian imports',
  authors: [{ name: 'Neighborhood Italian Restaurant' }],
  creator: 'Neighborhood Italian Restaurant',
  publisher: 'Neighborhood Italian Restaurant',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://restaurant.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Neighborhood Italian Restaurant | Farm to Table Brooklyn',
    description: 'Ingredient-driven neighborhood Italian restaurant featuring the highest quality imported Italian ingredients alongside organic local produce.',
    siteName: 'Neighborhood Italian Restaurant',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Neighborhood Italian Restaurant',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Neighborhood Italian Restaurant | Farm to Table Brooklyn',
    description: 'Ingredient-driven neighborhood Italian restaurant featuring organic local produce and imported Italian ingredients.',
    images: ['/twitter-image.jpg'],
    creator: '@restaurant',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${dmSerif.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#2B1810" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      </head>
      <body className="romans-neighborhood">
        {children}
      </body>
    </html>
  )
}