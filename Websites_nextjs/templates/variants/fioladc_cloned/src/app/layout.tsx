import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Fine Dining Restaurant - Michelin Starred Experience',
  description: 'Experience exceptional cuisine at our Michelin-starred restaurant. Featuring seasonal ingredients, expert craftsmanship, and an unforgettable fine dining atmosphere in the heart of the city.',
  keywords: 'fine dining, michelin star, italian restaurant, luxury dining, seasonal cuisine, tasting menu, wine pairing',
  authors: [{ name: 'Fine Dining Restaurant' }],
  creator: 'Fine Dining Restaurant',
  publisher: 'Fine Dining Restaurant',
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
    title: 'Fine Dining Restaurant - Michelin Starred Experience',
    description: 'Experience exceptional cuisine at our Michelin-starred restaurant. Featuring seasonal ingredients, expert craftsmanship, and an unforgettable fine dining atmosphere.',
    siteName: 'Fine Dining Restaurant',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Fine Dining Restaurant',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fine Dining Restaurant - Michelin Starred Experience',
    description: 'Experience exceptional cuisine at our Michelin-starred restaurant. Featuring seasonal ingredients and expert craftsmanship.',
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
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      </head>
      <body className="fiola-minimalist">
        {children}
      </body>
    </html>
  )
}