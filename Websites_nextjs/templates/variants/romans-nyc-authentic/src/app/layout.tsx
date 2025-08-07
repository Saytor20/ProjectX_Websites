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
  title: "Roman's - Neighborhood Italian Restaurant in Brooklyn",
  description: 'Ingredient-driven neighborhood Italian restaurant in Fort Greene, Brooklyn. Farm-to-table dining featuring the highest quality imported Italian ingredients alongside organic local produce.',
  keywords: 'italian restaurant, brooklyn, fort greene, farm to table, neighborhood dining, fresh ingredients, sustainable restaurant',
  authors: [{ name: "Roman's Brooklyn" }],
  creator: "Roman's Brooklyn",
  publisher: "Roman's Brooklyn",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://romansnyc.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: "Roman's - Neighborhood Italian Restaurant in Brooklyn",
    description: 'Ingredient-driven neighborhood Italian restaurant in Fort Greene, Brooklyn. Farm-to-table dining featuring the highest quality imported Italian ingredients alongside organic local produce.',
    siteName: "Roman's Brooklyn",
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: "Roman's - Brooklyn Italian Restaurant",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Roman's - Neighborhood Italian Restaurant in Brooklyn",
    description: 'Ingredient-driven neighborhood Italian restaurant in Fort Greene, Brooklyn. Farm-to-table dining featuring the highest quality imported Italian ingredients alongside organic local produce.',
    images: ['/twitter-image.jpg'],
    creator: '@romansbrooklyn',
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
        <meta name="theme-color" content="#8B4513" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      </head>
      <body className="rustic-serif">
        {children}
      </body>
    </html>
  )
}