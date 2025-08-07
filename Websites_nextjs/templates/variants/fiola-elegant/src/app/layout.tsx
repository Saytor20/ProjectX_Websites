import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/theme/ThemeProvider';
import '@/theme/variables.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Fiola Elegant - Fine Dining Experience',
  description: 'Experience timeless elegance with our traditional fine dining cuisine, crafted with classical techniques and premium ingredients.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="bg-[var(--color-background)] text-[var(--color-on-surface)]">
        <ThemeProvider>
          <Header fixed transparent />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}