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
  title: 'Fiola DC - Michelin Starred Fine Dining Experience',
  description: 'Experience exceptional Italian cuisine at our Michelin-starred restaurant. Featuring seasonal ingredients, expert craftsmanship, and an unforgettable fine dining atmosphere.',
  keywords: 'fine dining, michelin star, italian restaurant, luxury dining, seasonal cuisine, chef experience',
  authors: [{ name: 'Fiola DC' }],
  creator: 'Fiola DC',
  publisher: 'Fiola DC',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://fioladc.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Fiola DC - Michelin Starred Fine Dining Experience',
    description: 'Experience exceptional Italian cuisine at our Michelin-starred restaurant. Featuring seasonal ingredients, expert craftsmanship, and an unforgettable fine dining atmosphere.',
    siteName: 'Fiola DC',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Fiola DC - Michelin Starred Restaurant',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fiola DC - Michelin Starred Fine Dining Experience',
    description: 'Experience exceptional Italian cuisine at our Michelin-starred restaurant. Featuring seasonal ingredients, expert craftsmanship, and an unforgettable fine dining atmosphere.',
    images: ['/twitter-image.jpg'],
    creator: '@fioladc',
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
  verification: {
    google: 'your-google-verification-code',
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
        <meta name="theme-color" content="#0F0F0F" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      </head>
      <body className="luxury-serif">
        {children}
      </body>
    </html>
  )
}