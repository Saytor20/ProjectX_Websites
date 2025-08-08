import type { Metadata } from 'next';
import './styles.css';
import { ThemeProvider } from '@/theme/ThemeProvider';
import '@/theme/variables.css';

export const metadata: Metadata = {
  title: 'Azure Oasis - Airy Dining Experience',
  description:
    'An airy, calming restaurant experience with jacaranda-purple accents, glass cards, and generous negative space.',
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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#7C4DFF" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
      </head>
      <body className="bg-[var(--color-background)] text-[var(--color-on-surface)]">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

