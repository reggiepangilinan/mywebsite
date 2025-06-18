import { NextResponse } from 'next/server'
import { SITE_CONFIG } from '@/config/site'

export async function GET() {
  const { robots } = SITE_CONFIG
  
  // Generate robots.txt content
  const robotsContent = [
    `User-agent: ${robots.userAgent}`,
    '',
    // Allow rules
    ...robots.allow.map(path => `Allow: ${path}`),
    '',
    // Disallow rules
    ...robots.disallow.map(path => `Disallow: ${path}`),
    '',
    // Crawl delay (if specified)
    ...(robots.crawlDelay ? [`Crawl-delay: ${robots.crawlDelay}`, ''] : []),
    // Sitemap location
    `Sitemap: ${SITE_CONFIG.url}/sitemap.xml`,
    '',
    '# This robots.txt is dynamically generated',
    `# Last updated: ${new Date().toISOString().split('T')[0]}`,
  ].join('\n')

  return new NextResponse(robotsContent, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400', // Cache for 1 day
    },
  })
}
