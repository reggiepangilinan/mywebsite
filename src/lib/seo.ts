import { Metadata } from 'next';
import { SITE_CONFIG } from '@/config/site';
import { joinUrl } from '@/lib/url-utils';

interface GenerateMetadataProps {
  title?: string;
  description?: string;
  keywords?: string[];
  author?: string;
  publishDate?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
}

export function generatePageMetadata({
  title,
  description,
  keywords = [],
  author,
  publishDate,
  image,
  url,
  type = 'website'
}: GenerateMetadataProps = {}): Metadata {
  const baseUrl = SITE_CONFIG.url;
  const defaultImage = joinUrl(baseUrl, '/og-image.png');
  
  const pageTitle = title 
    ? `${title} | ${SITE_CONFIG.name}`
    : SITE_CONFIG.name;
  
  const pageDescription = description || SITE_CONFIG.description;
  const pageUrl = url ? `${baseUrl}${url}` : baseUrl;
  const pageImage = image ? `${baseUrl}${image}` : defaultImage;
  
  const allKeywords = [...SITE_CONFIG.keywords, ...keywords];

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: allKeywords,
    authors: [{ name: author || SITE_CONFIG.author }],
    creator: SITE_CONFIG.author,
    publisher: SITE_CONFIG.author,
    
    // Open Graph
    openGraph: {
      type,
      locale: 'en_US',
      url: pageUrl,
      siteName: SITE_CONFIG.name,
      title: pageTitle,
      description: pageDescription,
      images: [
        {
          url: pageImage,
          width: 1200,
          height: 630,
          alt: title || SITE_CONFIG.name,
          type: 'image/png',
        },
      ],
      ...(type === 'article' && {
        article: {
          publishedTime: publishDate,
          authors: [author || SITE_CONFIG.author],
        },
      }),
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      site: '@reggiepangilinan',
      creator: '@reggiepangilinan',
      title: pageTitle,
      description: pageDescription,
      images: [pageImage],
    },

    // Additional meta tags
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

    // Canonical URL
    alternates: {
      canonical: pageUrl,
    },

    // Additional structured data
    other: {
      'article:author': author || SITE_CONFIG.author,
      ...(publishDate && { 'article:published_time': publishDate }),
    },
  };
}

// JSON-LD structured data helpers
export function generateBlogPostJsonLd({
  title,
  description,
  author,
  publishDate,
  url,
  image,
}: {
  title: string;
  description: string;
  author: string;
  publishDate: string;
  url: string;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    author: {
      '@type': 'Person',
      name: author,
      url: SITE_CONFIG.url,
    },
    publisher: {
      '@type': 'Person',
      name: SITE_CONFIG.author,
      url: SITE_CONFIG.url,
    },
    datePublished: publishDate,
    dateModified: publishDate,
    url: `${SITE_CONFIG.url}${url}`,
    ...(image && {
      image: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.url}${image}`,
        width: 1200,
        height: 630,
      },
    }),
  };
}

export function generatePersonJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: SITE_CONFIG.author,
    url: SITE_CONFIG.url,
    sameAs: [
      'https://github.com/reggiepangilinan',
      'https://linkedin.com/in/reggiepangilinan',
    ],
    jobTitle: 'Engineering Leader & Full Stack Developer',
    worksFor: {
      '@type': 'Organization',
      name: 'Woolworths Group',
    },
  };
}
