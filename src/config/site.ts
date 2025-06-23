/**
 * Site configuration for SEO, contact information, and sitemap generation
 *
 * This configuration file contains all site-wide settings that can be easily
 * modified without affecting the rendering strategy or requiring code changes.
 */

export const SITE_CONFIG = {
  /** Base URL of the website */
  url: 'https://reggiepangilinan.com',
  /** Site owner's name */
  name: 'Reggie Pangilinan',
  /** Content author name */
  author: 'Reggie Pangilinan',
  /** Site meta description for SEO */
  description:
    'Personal portfolio and blog of Reggie Pangilinan - Software Developer',
  /** SEO keywords array */
  keywords: [
    'Reggie Pangilinan',
    'Engineering Leader',
    'Full Stack Developer',
    'React',
    'Next.js',
    'TypeScript',
    'Azure',
    'Software Architecture',
  ],

  /**
   * Contact configuration
   *
   * Used by contact forms, email links, and other contact-related components.
   * Changes here will automatically update all contact references across the site.
   *
   * @example
   * // Usage in components:
   * import { SITE_CONFIG } from '@/config/site'
   *
   * const emailUrl = `mailto:${SITE_CONFIG.contact.email}?subject=${encodeURIComponent(SITE_CONFIG.contact.defaultEmailSubject)}`
   */
  contact: {
    /** Primary contact email address */
    email: 'me@reggiepangilinan.com',
    /**
     * Default email subject line for contact forms and mailto links
     * The trailing " - " allows users to add their specific topic
     */
    defaultEmailSubject: 'Hey, I was on your website! - ',
  },

  /**
   * Social media configuration
   *
   * Static social media URLs and handles used throughout the site.
   * These are build-time constants and don't affect rendering strategy.
   */
  social: {
    /** Twitter/X handle (with @) */
    twitter: '@reggiepangilinan',
    /** GitHub profile URL */
    github: 'https://github.com/reggiepangilinan',
    /** LinkedIn profile URL */
    linkedin: 'https://linkedin.com/in/reggiepangilinan',
  },

  /**
   * Static image paths configuration
   *
   * Centralized image paths for consistent usage across components.
   * All paths are relative to the public directory.
   */
  images: {
    /** Profile photo path */
    profile: '/profile.webp',
    /** Default Open Graph image */
    ogDefault: '/og-image.png',
  },

  /**
   * Static pages configuration for sitemap generation
   *
   * Defines how static pages should be handled in the sitemap.xml file.
   * Each entry specifies SEO-related metadata for search engines.
   *
   * @see https://www.sitemaps.org/protocol.html
   */
  staticPages: [
    {
      /** Page path relative to site root */
      path: '/',
      /** How frequently the page content changes */
      changefreq: 'monthly' as const,
      /** Priority relative to other pages (0.0 to 1.0) */
      priority: 1.0,
      /** Last modification date (null = use current date) */
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

  /**
   * Blog configuration for dynamic content
   *
   * Defines default SEO settings for blog posts and the blog section.
   * Individual blog posts will inherit these settings unless overridden.
   */
  blog: {
    /** Blog description for meta tags and SEO */
    description:
      'Technical insights, tutorials, and thoughts on software engineering, leadership, and technology.',
    /** Default change frequency for blog posts */
    changefreq: 'weekly' as const,
    /** Default priority for blog posts */
    priority: 0.7,
    // Individual posts will use their publish date as lastmod
  },

  /**
   * Robots.txt configuration
   *
   * Controls how search engine crawlers interact with the site.
   * These settings are used to generate the robots.txt file.
   *
   * @see https://developers.google.com/search/docs/crawling-indexing/robots/robots_txt
   */
  robots: {
    /** Target user agent (typically '*' for all crawlers) */
    userAgent: '*',
    /** Paths that crawlers are allowed to access */
    allow: ['/'],
    /** Paths that crawlers should not access */
    disallow: ['/dev-info', '/api'],
    /** Optional delay between crawler requests (in seconds) */
    crawlDelay: undefined, // Optional crawl delay in seconds
  },

  /**
   * Guard system configuration for detecting hardcoded values
   *
   * This configuration defines what values should be detected by the
   * ESLint rules and scanner scripts to ensure SITE_CONFIG usage.
   */
  guards: {
    /** Values that should be replaced with SITE_CONFIG properties */
    patterns: {
      /** Domain patterns that should use SITE_CONFIG.url */
      domains: [
        'reggiepangilinan.com',
        'https://reggiepangilinan.com',
        'http://reggiepangilinan.com',
      ],
      /** Email patterns that should use SITE_CONFIG.contact.email */
      emails: ['me@reggiepangilinan.com'],
      /** Name patterns that should use SITE_CONFIG.name or SITE_CONFIG.author */
      names: ['Reggie Pangilinan'],
      /** Social handle patterns that should use SITE_CONFIG.social.* */
      socialHandles: ['@reggiepangilinan'],
      /** Social URL patterns that should use SITE_CONFIG.social.* */
      socialUrls: [
        'github.com/reggiepangilinan',
        'https://github.com/reggiepangilinan',
        'linkedin.com/in/reggiepangilinan',
        'https://linkedin.com/in/reggiepangilinan',
      ],
      /** Image path patterns that should use SITE_CONFIG.images.* */
      imagePaths: ['/profile.webp', '/og-image.png'],
    },
    /** Files and directories to exclude from pattern detection */
    excludes: [
      'node_modules',
      '.next',
      'build',
      'dist',
      '.git',
      'src/config/site.ts', // Allow hardcoded values in the config file itself
      'eslint.config.mjs', // Allow in eslint config
      'scripts/check-hardcoded-values.js', // Allow in scanner script
      'scripts/guard-config.js', // Allow in auto-generated guard config
      'scripts/sync-guard-config.js', // Allow in sync script
      'scripts/validate-guard-patterns.js', // Allow in validation script
      'docs/', // Allow in documentation
      'public/',
      'README.md',
    ],
    /** Content exclusions - don't flag if these strings are present in the same line */
    contentExclusions: [
      'CV -', // Don't flag CV filenames
      'Resume -', // Don't flag resume filenames
    ],
  },
} as const

/**
 * Type definition for the site configuration
 *
 * This ensures type safety when importing and using SITE_CONFIG
 * throughout the application.
 */
export type SiteConfig = typeof SITE_CONFIG
