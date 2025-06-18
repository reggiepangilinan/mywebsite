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
    const response = await client.getEntries<BlogPostSkeleton>({
      content_type: 'blogPost',
      limit,
      skip,
      order: '-fields.publishDate' as any,
    })

    return {
      items: response.items,
      total: response.total,
    }
  } catch (error) {
    console.error('Error fetching blog posts:', error)
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
    const response = await client.getEntries<BlogPostSkeleton>({
      content_type: 'blogPost',
      'fields.slug[match]': slug,
      limit: 1,
    } as any)

    if (response.items.length === 0) {
      return null
    }

    return response.items[0]
  } catch (error) {
    console.error('Error fetching blog post:', error)
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
    // Use Contentful's REST API directly with fetch for better ISR control
    const spaceId = process.env.CONTENTFUL_SPACE_ID
    const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN
    
    if (!spaceId || !accessToken) {
      return null
    }

    const url = `https://cdn.contentful.com/spaces/${spaceId}/entries?content_type=blogPost&fields.slug[match]=${slug}&limit=1&access_token=${accessToken}`
    
    const response = await fetch(url, {
      next: { 
        revalidate: 300,
        tags: [`blog-post-${slug}`]
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.items.length === 0) {
      return null
    }

    return data.items[0] as BlogPost
  } catch (error) {
    console.error('Error fetching blog post with ISR:', error)
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
