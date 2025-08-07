import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/theme/ThemeProvider';
import '@/theme/variables.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'BBQ Smokehouse - Authentic Barbecue Experience',
  description: 'Experience authentic barbecue with slow-smoked meats, rustic flavors, and warm hospitality in our cozy smokehouse.',
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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=SF+Pro+Display:wght@300;400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
        <meta name="theme-color" content="#92400e" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
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