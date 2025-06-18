import { NextResponse } from 'next/server'
import { SITE_CONFIG } from '@/config/site'
import { getBlogPosts } from '@/lib/contentful'
import { ISR_CONFIG } from '@/config/isr'

// ISR configuration for cost efficiency
export const revalidate = 21600 // 6 hours - much more cost effective

export async function GET() {
  try {
    // Get all blog posts for dynamic sitemap entries
    const { items: blogPosts } = await getBlogPosts()
    
    // Helper function to format date for sitemap
    const formatDate = (date: string | Date | null | undefined) => {
      if (!date) return new Date().toISOString().split('T')[0]
      return new Date(date).toISOString().split('T')[0]
    }
    
    // Get the most recent blog post date for blog list page
    const latestBlogDate = blogPosts.length > 0 
      ? String(blogPosts[0].fields.publishDate || new Date().toISOString())
      : new Date().toISOString()
    
    // Generate sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${SITE_CONFIG.staticPages.map(page => {
  const lastmod = page.path === '/blog' 
    ? formatDate(latestBlogDate)
    : formatDate(page.lastmod)
  
  return `  <url>
    <loc>${SITE_CONFIG.url}${page.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
}).join('\n')}
${blogPosts.map(post => `  <url>
    <loc>${SITE_CONFIG.url}/blog/${post.fields.slug}</loc>
    <lastmod>${formatDate(String(post.fields.publishDate || new Date().toISOString()))}</lastmod>
    <changefreq>${SITE_CONFIG.blog.changefreq}</changefreq>
    <priority>${SITE_CONFIG.blog.priority}</priority>
  </url>`).join('\n')}
</urlset>
<!-- Generated with ISR every ${ISR_CONFIG.formatDuration(revalidate)} for cost efficiency -->`

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        // ISR handles caching, but add edge cache too
        'Cache-Control': 'public, max-age=21600, s-maxage=21600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('Error generating sitemap:', error)
    
    // Fallback sitemap with just static pages
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${SITE_CONFIG.staticPages.map(page => `  <url>
    <loc>${SITE_CONFIG.url}${page.path}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>
<!-- Fallback sitemap - Contentful unavailable -->`

    return new NextResponse(fallbackSitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=10800, s-maxage=10800', // 3 hour cache on error
      },
    })
  }
}
