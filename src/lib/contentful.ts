/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient, Entry, EntrySkeletonType, Asset } from 'contentful'
import { Document } from '@contentful/rich-text-types'

// Check if environment variables are available
const spaceId = process.env.CONTENTFUL_SPACE_ID
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN

const client = spaceId && accessToken ? createClient({
  space: spaceId,
  accessToken: accessToken,
}) : null

export interface BlogPostFields {
  title: string
  subtitle?: string
  slug: string
  excerpt: string
  content: string | Document
  featuredImage?: Asset
  publishDate: string
  tags?: string[]
  author?: string
}

export interface BlogPostSkeleton extends EntrySkeletonType {
  contentTypeId: 'blogPost'
  fields: BlogPostFields
}

export type BlogPost = Entry<BlogPostSkeleton>

export interface BlogPostsResponse {
  items: BlogPost[]
  total: number
}

export async function getBlogPosts(limit = 10, skip = 0): Promise<BlogPostsResponse> {
  if (!client) {
    console.log('Contentful client not configured - returning empty blog posts')
    return {
      items: [],
      total: 0,
    }
  }

  try {
    console.log(`[ISR] Fetching blog posts - limit: ${limit}, skip: ${skip}, timestamp: ${new Date().toISOString()}`)
    
    const response = await client.getEntries<BlogPostSkeleton>({
      content_type: 'blogPost',
      limit,
      skip,
      order: '-fields.publishDate' as any,
    })

    console.log(`[ISR] Blog posts fetched successfully - ${response.items.length} items, total: ${response.total}`)

    return {
      items: response.items,
      total: response.total,
    }
  } catch (error) {
    console.error('[ISR] Error fetching blog posts:', error)
    return {
      items: [],
      total: 0,
    }
  }
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  if (!client) {
    console.log('Contentful client not configured - returning null for blog post')
    return null
  }

  try {
    console.log(`[ISR] Fetching blog post (regular) - slug: ${slug}, timestamp: ${new Date().toISOString()}`)
    
    const response = await client.getEntries<BlogPostSkeleton>({
      content_type: 'blogPost',
      'fields.slug[match]': slug,
      limit: 1,
    } as any)

    if (response.items.length === 0) {
      console.log(`[ISR] Blog post not found - slug: ${slug}`)
      return null
    }

    console.log(`[ISR] Blog post fetched successfully - slug: ${slug}, title: ${response.items[0].fields.title}`)
    return response.items[0]
  } catch (error) {
    console.error(`[ISR] Error fetching blog post - slug: ${slug}:`, error)
    return null
  }
}

// Alternative version that uses fetch with Next.js cache control
export async function getBlogPostForISR(slug: string): Promise<BlogPost | null> {
  if (!client) {
    console.log('Contentful client not configured - returning null for blog post')
    return null
  }

  try {
    console.log(`[ISR] Fetching blog post with ISR fetch - slug: ${slug}, timestamp: ${new Date().toISOString()}`)
    
    // Use Contentful's REST API directly with fetch for better ISR control
    const spaceId = process.env.CONTENTFUL_SPACE_ID
    const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN
    
    if (!spaceId || !accessToken) {
      console.log(`[ISR] Missing Contentful credentials - falling back to regular client`)
      return getBlogPost(slug)
    }

    const url = `https://cdn.contentful.com/spaces/${spaceId}/entries?content_type=blogPost&fields.slug[match]=${slug}&limit=1&access_token=${accessToken}`
    
    console.log(`[ISR] Making fetch request with 5-minute revalidation - slug: ${slug}`)
    
    const startTime = Date.now()
    const response = await fetch(url, {
      next: { 
        revalidate: 300,
        tags: [`blog-post-${slug}`]
      }
    })
    const fetchTime = Date.now() - startTime

    console.log(`[ISR] Fetch completed in ${fetchTime}ms - slug: ${slug}, status: ${response.status}`)

    if (!response.ok) {
      console.error(`[ISR] Fetch failed with status ${response.status} - slug: ${slug}`)
      throw new Error(`Failed to fetch: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.items.length === 0) {
      console.log(`[ISR] Blog post not found via fetch - slug: ${slug}`)
      return null
    }

    console.log(`[ISR] Blog post fetched successfully via fetch - slug: ${slug}, title: ${data.items[0].fields.title}`)
    console.log(`[ISR] Cache will revalidate in 5 minutes for slug: ${slug}`)
    
    return data.items[0] as BlogPost
  } catch (error) {
    console.error(`[ISR] Error fetching blog post with ISR for slug ${slug}:`, error)
    console.log(`[ISR] Falling back to regular getBlogPost - slug: ${slug}`)
    // Fallback to regular client
    return getBlogPost(slug)
  }
}

export async function getAllBlogSlugs(): Promise<string[]> {
  if (!client) {
    console.log('Contentful client not configured - returning empty slugs')
    return []
  }

  try {
    const response = await client.getEntries<BlogPostSkeleton>({
      content_type: 'blogPost',
      select: ['fields.slug'],
    })

    return response.items.map((item) => item.fields.slug)
  } catch (error) {
    console.error('Error fetching blog slugs:', error)
    return []
  }
}
