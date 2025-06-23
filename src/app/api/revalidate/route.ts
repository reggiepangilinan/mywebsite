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
 *
 * DEBUGGING: Enhanced logging for webhook troubleshooting
 */

// Helper function to validate and clean slug
function validateSlug(slug: unknown): string | null {
  if (!slug) return null

  const cleanSlug = String(slug).trim()
  if (!cleanSlug) return null

  // Remove leading/trailing slashes and validate format
  const normalizedSlug = cleanSlug.replace(/^\/+|\/+$/g, '')

  // Basic slug validation (alphanumeric, hyphens, underscores)
  if (!/^[a-zA-Z0-9\-_]+$/.test(normalizedSlug)) {
    console.warn(`[REVALIDATION] Invalid slug format: "${normalizedSlug}"`)
    return null
  }

  return normalizedSlug
}

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

    // Enhanced logging for debugging webhook issues
    console.log(`[REVALIDATION REQUEST] ${new Date().toISOString()}`)
    console.log(
      '[REVALIDATION REQUEST] Full payload:',
      JSON.stringify(body, null, 2)
    )

    const { secret, path, tag, type = 'path' } = body

    // Security: Verify the secret token
    const expectedSecret = process.env.REVALIDATION_SECRET
    if (!expectedSecret) {
      console.error(
        '[REVALIDATION ERROR] Missing REVALIDATION_SECRET environment variable'
      )
      return NextResponse.json(
        { error: 'Revalidation not configured - missing REVALIDATION_SECRET' },
        { status: 500 }
      )
    }

    if (secret !== expectedSecret) {
      console.error('[REVALIDATION ERROR] Invalid secret token provided')
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
      const { contentType, slug, entryId } = body

      console.log('[REVALIDATION] Contentful webhook processing:', {
        contentType,
        slug,
        entryId,
        hasSlug: !!slug,
        slugType: typeof slug,
      })

      if (contentType === 'blogPost' && slug) {
        // Validate and clean the slug
        const cleanSlug = validateSlug(slug)

        if (!cleanSlug) {
          console.error(
            '[REVALIDATION ERROR] Invalid slug provided for blog post:',
            slug
          )
          results.push('ERROR: Invalid slug provided for blog post')

          // Fallback: revalidate all blog content
          console.log(
            '[REVALIDATION] Falling back to revalidating all blog content'
          )
          revalidatePath('/blog', 'layout')
          results.push('Revalidated all blog content (fallback)')
        } else {
          // Revalidate specific blog post with multiple strategies
          console.log(
            `[REVALIDATION] Revalidating specific blog post: /blog/${cleanSlug}`
          )

          try {
            // Strategy 1: Revalidate the exact path
            revalidatePath(`/blog/${cleanSlug}`)
            results.push(`Revalidated blog post: /blog/${cleanSlug}`)

            // Strategy 2: Revalidate with page option for more thorough invalidation
            revalidatePath(`/blog/${cleanSlug}`, 'page')
            results.push(`Revalidated blog post (page): /blog/${cleanSlug}`)
          } catch (error) {
            console.error(
              `[REVALIDATION ERROR] Failed to revalidate blog post ${cleanSlug}:`,
              error
            )
            results.push(`ERROR: Failed to revalidate blog post ${cleanSlug}`)
          }

          // Also revalidate blog list to show updated content
          console.log('[REVALIDATION] Revalidating blog list: /blog')
          try {
            revalidatePath('/blog')
            revalidatePath('/blog', 'layout')
            results.push('Revalidated blog list: /blog')
          } catch (error) {
            console.error(
              '[REVALIDATION ERROR] Failed to revalidate blog list:',
              error
            )
            results.push('ERROR: Failed to revalidate blog list')
          }

          // Revalidate sitemaps and robots.txt
          console.log('[REVALIDATION] Revalidating sitemaps and robots.txt')
          try {
            revalidatePath('/sitemap.xml')
            revalidatePath('/sitemap-isr.xml')
            revalidatePath('/robots.txt')
            results.push('Revalidated sitemaps and robots.txt')
          } catch (error) {
            console.error(
              '[REVALIDATION ERROR] Failed to revalidate sitemaps:',
              error
            )
            results.push('ERROR: Failed to revalidate sitemaps')
          }
        }
      } else if (contentType === 'blogPost') {
        // If no slug provided, revalidate all blog content
        console.log(
          '[REVALIDATION] No slug provided, revalidating all blog content'
        )
        revalidatePath('/blog', 'layout') // Revalidate all blog pages
        results.push('Revalidated all blog content')

        // Revalidate sitemaps and robots.txt
        console.log('[REVALIDATION] Revalidating sitemaps and robots.txt')
        revalidatePath('/sitemap.xml')
        revalidatePath('/sitemap-isr.xml')
        revalidatePath('/robots.txt')
        results.push('Revalidated sitemaps and robots.txt')
      } else {
        console.log(
          '[REVALIDATION] Non-blog content or unknown content type:',
          contentType
        )
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

    // Log the revalidation event with summary
    console.log(
      `[REVALIDATION COMPLETE] ${new Date().toISOString()} - Duration: ${duration}ms`
    )
    console.log(`[REVALIDATION COMPLETE] Results: ${results.join(', ')}`)
    console.log(`[REVALIDATION COMPLETE] Total actions: ${results.length}`)

    return NextResponse.json({
      success: true,
      message: 'Revalidation completed',
      results,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[REVALIDATION ERROR]', error)

    return NextResponse.json(
      {
        error: 'Revalidation failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
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
            slug: 'your-blog-post-slug',
          },
        },
        {
          description: 'Revalidate specific path',
          body: {
            secret: 'your-secret-here',
            type: 'path',
            path: '/blog/some-post',
          },
        },
        {
          description: 'Revalidate all blog content',
          body: {
            secret: 'your-secret-here',
            type: 'contentful',
            contentType: 'blogPost',
          },
        },
      ],
    },
  })
}
