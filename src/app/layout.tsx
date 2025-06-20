import type { Metadata } from 'next'
import { Inter, Roboto } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ThemeProvider } from '@/components/ThemeProvider'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import SkipLink from '@/components/SkipLink'
import { SITE_CONFIG } from '@/config/site'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const roboto = Roboto({
  weight: ['300', '400', '500', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
})

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} - Welcome to my portfolio and blog`,
  description: SITE_CONFIG.description,
  keywords: [...SITE_CONFIG.keywords],
  authors: [{ name: SITE_CONFIG.author }],
  creator: SITE_CONFIG.author,
  publisher: SITE_CONFIG.author,

  // Open Graph metadata for social sharing
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_CONFIG.url,
    siteName: `${SITE_CONFIG.name} - Portfolio`,
    title: `${SITE_CONFIG.name} - Engineering Leader & Full Stack Developer`,
    description:
      'Engineering Leadership & Full Stack Development. I build scalable solutions for the web using React, Next.js, TypeScript, and Azure.',
    images: [
      {
        url: `${SITE_CONFIG.url}${SITE_CONFIG.images.profile}`,
        width: 400,
        height: 400,
        alt: `${SITE_CONFIG.name} - Engineering Leader & Full Stack Developer`,
        type: 'image/webp',
      },
    ],
  },

  // Twitter Card metadata
  twitter: {
    card: 'summary',
    site: SITE_CONFIG.social.twitter,
    creator: SITE_CONFIG.social.twitter,
    title: `${SITE_CONFIG.name} - Engineering Leader & Full Stack Developer`,
    description:
      'Engineering Leadership & Full Stack Development. I build scalable solutions for the web using React, Next.js, TypeScript, and Azure.',
    images: [`${SITE_CONFIG.url}${SITE_CONFIG.images.profile}`],
  },

  // Additional metadata
  metadataBase: new URL(SITE_CONFIG.url),
  alternates: {
    canonical: SITE_CONFIG.url,
  },

  // Robots and indexing
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

  // Verification (add your verification codes if you have them)
  verification: {
    google: 'your-google-verification-code', // Replace with actual code
    // yandex: "your-yandex-verification-code",
    // yahoo: "your-yahoo-verification-code",
  },

  // Icons and favicon - comprehensive setup for Google and other search engines
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/favicon.svg',
        color: '#3b82f6',
      },
    ],
  },

  // Web App Manifest
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Resource hints for better performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Favicon and icons - comprehensive setup for search engines */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link rel="mask-icon" href="/favicon.svg" color="#3b82f6" />

        {/* Additional icon sizes for various use cases */}
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/icon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="512x512"
          href="/icon-512x512.png"
        />

        {/* Web App Manifest */}
        <link rel="manifest" href="/manifest.json" />

        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || 'dark';
                  const html = document.documentElement;
                  html.setAttribute('data-theme', theme);
                  html.style.colorScheme = theme;
                  html.style.visibility = 'visible';
                  // Apply critical styles immediately
                  html.style.backgroundColor = theme === 'dark' ? '#0a0a0a' : '#ffffff';
                  html.style.color = theme === 'dark' ? '#ededed' : '#333333';
                } catch (e) {
                  const html = document.documentElement;
                  html.setAttribute('data-theme', 'dark');
                  html.style.colorScheme = 'dark';
                  html.style.visibility = 'visible';
                  html.style.backgroundColor = '#0a0a0a';
                  html.style.color = '#ededed';
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${inter.className} ${roboto.variable}`}
        suppressHydrationWarning
      >
        <SkipLink href="#main-content">Skip to main content</SkipLink>
        <ErrorBoundary>
          <ThemeProvider>
            <div className="page-wrapper">
              <Header />
              <main className="main-content" id="main-content">
                {children}
              </main>
              <Footer />
            </div>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
