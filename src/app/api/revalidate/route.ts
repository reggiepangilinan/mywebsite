import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

/**
 * On-Demand Revalidation API Endpoint
 * 
 * This endpoint allows triggering revalidation of specific pages or content
 * when called from Contentful webhooks or manual requests.
 * 
 * Usage:
 * - POST /api/revalidate
 * - Requires secret token for security
 * - Supports revalidating specific paths or tags
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { secret, path, tag, type = 'path' } = body

    // Security: Verify the secret token
    const expectedSecret = process.env.REVALIDATION_SECRET
    if (!expectedSecret) {
      return NextResponse.json(
        { error: 'Revalidation not configured - missing REVALIDATION_SECRET' },
        { status: 500 }
      )
    }

    if (secret !== expectedSecret) {
      return NextResponse.json(
        { error: 'Invalid secret token' },
        { status: 401 }
      )
    }

    const startTime = Date.now()
    const results: string[] = []

    // Revalidate by path (specific pages)
    if (type === 'path') {
      const pathsToRevalidate = Array.isArray(path) ? path : [path]
      
      for (const pathToRevalidate of pathsToRevalidate) {
        if (pathToRevalidate) {
          revalidatePath(pathToRevalidate)
          results.push(`Revalidated path: ${pathToRevalidate}`)
        }
      }
    }

    // Revalidate by tag (cache tags)
    if (type === 'tag') {
      const tagsToRevalidate = Array.isArray(tag) ? tag : [tag]
      
      for (const tagToRevalidate of tagsToRevalidate) {
        if (tagToRevalidate) {
          revalidateTag(tagToRevalidate)
          results.push(`Revalidated tag: ${tagToRevalidate}`)
        }
      }
    }

    // Handle specific content types from Contentful webhooks
    if (type === 'contentful') {
      const { contentType, slug } = body

      if (contentType === 'blogPost' && slug) {
        // Revalidate specific blog post
        revalidatePath(`/blog/${slug}`)
        results.push(`Revalidated blog post: /blog/${slug}`)
        
        // Also revalidate blog list to show updated content
        revalidatePath('/blog')
        results.push('Revalidated blog list: /blog')
        
        // Revalidate sitemaps and robots.txt
        revalidatePath('/sitemap.xml')
        revalidatePath('/sitemap-isr.xml')
        revalidatePath('/robots.txt')
        results.push('Revalidated sitemaps and robots.txt')
      } else if (contentType === 'blogPost') {
        // If no slug provided, revalidate all blog content
        revalidatePath('/blog', 'layout') // Revalidate all blog pages
        results.push('Revalidated all blog content')
        
        // Revalidate sitemaps and robots.txt
        revalidatePath('/sitemap.xml')
        revalidatePath('/sitemap-isr.xml')
        revalidatePath('/robots.txt')
        results.push('Revalidated sitemaps and robots.txt')
      }
    }

    // Default: revalidate common pages if no specific target
    if (results.length === 0) {
      revalidatePath('/blog')
      revalidatePath('/sitemap.xml')
      revalidatePath('/sitemap-isr.xml')
      revalidatePath('/robots.txt')
      results.push('Revalidated default paths: /blog, sitemaps, robots.txt')
    }

    const duration = Date.now() - startTime

    // Log the revalidation event
    console.log(`[REVALIDATION] ${new Date().toISOString()} - ${results.join(', ')} (${duration}ms)`)

    return NextResponse.json({
      success: true,
      message: 'Revalidation completed',
      results,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('[REVALIDATION ERROR]', error)
    
    return NextResponse.json(
      { 
        error: 'Revalidation failed', 
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

// GET method for testing and status checks
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')

  // Security check for GET requests too
  const expectedSecret = process.env.REVALIDATION_SECRET
  if (!expectedSecret) {
    return NextResponse.json(
      { error: 'Revalidation not configured' },
      { status: 500 }
    )
  }

  if (secret !== expectedSecret) {
    return NextResponse.json(
      { error: 'Invalid or missing secret' },
      { status: 401 }
    )
  }

  return NextResponse.json({
    status: 'Revalidation endpoint is active',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    usage: {
      post: '/api/revalidate',
      methods: ['POST', 'GET'],
      examples: [
        {
          description: 'Revalidate specific blog post',
          body: {
            secret: 'your-secret-here',
            type: 'contentful',
            contentType: 'blogPost',
            slug: 'your-blog-post-slug'
          }
        },
        {
          description: 'Revalidate specific path',
          body: {
            secret: 'your-secret-here',
            type: 'path',
            path: '/blog/some-post'
          }
        },
        {
          description: 'Revalidate all blog content',
          body: {
            secret: 'your-secret-here',
            type: 'contentful',
            contentType: 'blogPost'
          }
        }
      ]
    }
  })
}
