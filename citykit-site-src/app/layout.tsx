import type { Metadata } from 'next';
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-space',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'CityKit — World Cities npm Package',
  description: '49,992 cities. 242 countries. Zero dependencies. Search, filter, and calculate distances between world cities in Node.js and TypeScript.',
  keywords: ['npm', 'cities', 'world cities', 'geocoding', 'distance', 'typescript', 'nodejs', 'novaedge'],
  openGraph: {
    title: 'CityKit — World Cities npm Package',
    description: '49,992 cities. 242 countries. Zero dependencies.',
    url: 'https://citykit.novaedgedigitallabs.tech',
    siteName: 'CityKit',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
