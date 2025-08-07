import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/theme/ThemeProvider';
import '@/theme/variables.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Modern Restaurant - Contemporary Dining Experience',
  description: 'Experience contemporary dining with warm, vibrant flavors and modern culinary techniques in a welcoming atmosphere.',
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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" 
          rel="stylesheet" 
        />
        <meta name="theme-color" content="#dc2626" />
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