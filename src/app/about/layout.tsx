import type { Metadata } from 'next'
import { SITE_CONFIG } from '@/config/site'

export const metadata: Metadata = {
  title: `About Me - ${SITE_CONFIG.name}`,
  description:
    'Learn about my engineering leadership journey, technical skills, and professional experience across enterprise environments. Specializing in React, Next.js, TypeScript, and Azure.',

  openGraph: {
    title: `About ${SITE_CONFIG.name} - Engineering Leadership & Fullstack Development`,
    description:
      'Seasoned engineering leader delivering performant, scalable, and user-centric digital platforms across enterprise environments. Expert in React, Next.js, TypeScript, and Azure.',
    url: `${SITE_CONFIG.url}/about`,
    images: [
      {
        url: `${SITE_CONFIG.url}${SITE_CONFIG.images.profile}`,
        width: 400,
        height: 400,
        alt: `${SITE_CONFIG.name} - About Me`,
        type: 'image/webp',
      },
    ],
  },

  twitter: {
    title: `About ${SITE_CONFIG.name} - Engineering Leadership & Fullstack Development`,
    description:
      'Seasoned engineering leader delivering performant, scalable, and user-centric digital platforms across enterprise environments.',
    images: [`${SITE_CONFIG.url}${SITE_CONFIG.images.profile}`],
  },

  alternates: {
    canonical: `${SITE_CONFIG.url}/about`,
  },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
