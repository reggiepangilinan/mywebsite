import { Metadata } from 'next'
import { SITE_CONFIG } from '@/config/site'

export const metadata: Metadata = {
  title: `Blog - ${SITE_CONFIG.name}`,
  description:
    'Technical insights, tutorials, and thoughts on software engineering, leadership, and technology.',
  openGraph: {
    title: `Blog - ${SITE_CONFIG.name}`,
    description:
      'Technical insights, tutorials, and thoughts on software engineering, leadership, and technology.',
    images: [
      {
        url: `${SITE_CONFIG.url}${SITE_CONFIG.images.ogDefault}`,
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.name} - Blog`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Blog - ${SITE_CONFIG.name}`,
    description:
      'Technical insights, tutorials, and thoughts on software engineering, leadership, and technology.',
    images: [`${SITE_CONFIG.url}${SITE_CONFIG.images.ogDefault}`],
  },
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
