// Site configuration for SEO and sitemap generation
export const SITE_CONFIG = {
  url: 'https://reggiepangilinan.com',
  name: 'Reggie Pangilinan',
  description: 'Personal portfolio and blog of Reggie Pangilinan - Software Developer',
  
  // Static pages configuration
  staticPages: [
    {
      path: '/',
      changefreq: 'monthly' as const,
      priority: 1.0,
      lastmod: null, // Will use current date
    },
    {
      path: '/about',
      changefreq: 'monthly' as const,
      priority: 0.8,
      lastmod: null,
    },
    {
      path: '/blog',
      changefreq: 'weekly' as const,
      priority: 0.9,
      lastmod: null, // Will be updated with latest blog post date
    },
  ],
  
  // Blog configuration
  blog: {
    changefreq: 'weekly' as const,
    priority: 0.7,
    // Individual posts will use their publish date as lastmod
  },
  
  // Robots.txt configuration
  robots: {
    userAgent: '*',
    allow: ['/'],
    disallow: ['/dev-info', '/api'],
    crawlDelay: undefined, // Optional crawl delay in seconds
  }
} as const

export type SiteConfig = typeof SITE_CONFIG
