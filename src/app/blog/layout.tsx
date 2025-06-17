import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog - Reggie Pangilinan',
  description: 'Technical insights, tutorials, and thoughts on software engineering, leadership, and technology.',
  openGraph: {
    title: 'Blog - Reggie Pangilinan',
    description: 'Technical insights, tutorials, and thoughts on software engineering, leadership, and technology.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Reggie Pangilinan - Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog - Reggie Pangilinan',
    description: 'Technical insights, tutorials, and thoughts on software engineering, leadership, and technology.',
    images: ['/og-image.png'],
  },
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
