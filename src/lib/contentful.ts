/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient, Entry, EntrySkeletonType, Asset } from 'contentful'
import { createClient as createManagementClient } from 'contentful-management'
import { Document } from '@contentful/rich-text-types'
import { logAppEvent } from './app-logger'

// Check if environment variables are available
const spaceId = process.env.CONTENTFUL_SPACE_ID
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN

const client =
  spaceId && accessToken
    ? createClient({
        space: spaceId,
        accessToken: accessToken,
      })
    : null

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

export async function getBlogPosts(
  limit = 10,
  skip = 0
): Promise<BlogPostsResponse> {
  if (!client) {
    await logAppEvent(
      'Contentful',
      'Client not configured - returning empty blog posts'
    )
    return {
      items: [],
      total: 0,
    }
  }

  try {
    await logAppEvent(
      'Contentful',
      `Fetching blog posts - limit: ${limit}, skip: ${skip}`
    )

    const response = await client.getEntries<BlogPostSkeleton>({
      content_type: 'blogPost',
      limit,
      skip,
      order: '-fields.publishDate' as any,
      include: 2, // Include linked assets (featured images)
    })

    await logAppEvent(
      'Contentful',
      `Blog posts fetched successfully - ${response.items.length} items, total: ${response.total}`
    )

    return {
      items: response.items,
      total: response.total,
    }
  } catch (error) {
    await logAppEvent('Error', 'Failed to fetch blog posts', {
      error: error instanceof Error ? error.message : error,
    })
    return {
      items: [],
      total: 0,
    }
  }
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  if (!client) {
    console.error(
      'Contentful client not configured - returning null for blog post'
    )
    return null
  }

  try {
    logAppEvent('Contentful', `Fetching blog post (regular) - slug: ${slug}`)

    const response = await client.getEntries<BlogPostSkeleton>({
      content_type: 'blogPost',
      'fields.slug[match]': slug,
      limit: 1,
      include: 2, // Include linked assets (featured images)
    } as any)

    if (response.items.length === 0) {
      logAppEvent('Contentful', `Blog post not found - slug: ${slug}`)
      return null
    }

    logAppEvent(
      'Contentful',
      `Blog post fetched successfully - slug: ${slug}, title: ${response.items[0].fields.title}`
    )

    return response.items[0]
  } catch (error) {
    logAppEvent('Error', `Failed to fetch blog post - slug: ${slug}`, error)
    return null
  }
}

// Alternative version that uses fetch with Next.js cache control
export async function getBlogPostForISR(
  slug: string
): Promise<BlogPost | null> {
  if (!client) {
    await logAppEvent(
      'Contentful',
      'Client not configured - returning null for blog post'
    )
    return null
  }

  try {
    await logAppEvent(
      'ISR',
      `Fetching blog post with ISR using SDK - slug: ${slug}`
    )

    // Use the Contentful SDK but with Next.js cache control
    const response = await client.getEntries<BlogPostSkeleton>({
      content_type: 'blogPost',
      'fields.slug[match]': slug,
      limit: 1,
      include: 2, // Include linked assets (featured images)
    } as any)

    if (response.items.length === 0) {
      await logAppEvent(
        'ISR',
        `Blog post not found via SDK ISR - slug: ${slug}`
      )
      return null
    }

    await logAppEvent(
      'ISR',
      `Blog post fetched successfully via SDK ISR - slug: ${slug}, title: ${response.items[0].fields.title}`
    )

    return response.items[0]
  } catch (error) {
    await logAppEvent(
      'Error',
      `Failed to fetch blog post with ISR SDK for slug ${slug}`,
      {
        error: error instanceof Error ? error.message : error,
      }
    )
    await logAppEvent(
      'ISR',
      `Falling back to regular getBlogPost - slug: ${slug}`
    )
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

// Management API for deletion operations
export async function deleteAllBlogPosts(
  spaceId: string,
  managementToken: string
): Promise<{ success: boolean; deletedCount: number; errors: string[] }> {
  try {
    await logAppEvent('Bulk', 'Starting bulk deletion of all blog posts')

    const managementClient = createManagementClient({
      accessToken: managementToken,
    })

    const space = await managementClient.getSpace(spaceId)
    const environment = await space.getEnvironment('master')

    // Get all blog post entries
    const entries = await environment.getEntries({
      content_type: 'blogPost',
      limit: 1000, // Contentful max limit
    })

    await logAppEvent(
      'Bulk',
      `Found ${entries.items.length} blog posts to delete`
    )

    const errors: string[] = []
    let deletedCount = 0

    // Delete each entry
    for (const entry of entries.items) {
      try {
        // First unpublish if published
        if (entry.isPublished()) {
          await entry.unpublish()
          await logAppEvent(
            'Bulk',
            `Unpublished entry: ${entry.fields.title?.['en-US'] || entry.sys.id}`
          )
        }

        // Then delete
        await entry.delete()
        deletedCount++
        await logAppEvent(
          'Bulk',
          `Deleted entry: ${entry.fields.title?.['en-US'] || entry.sys.id}`
        )
      } catch (error) {
        const errorMsg = `Failed to delete entry ${entry.sys.id}: ${error instanceof Error ? error.message : error}`
        errors.push(errorMsg)
        await logAppEvent('Error', errorMsg)
      }
    }

    await logAppEvent(
      'Bulk',
      `Bulk deletion completed - ${deletedCount} deleted, ${errors.length} errors`
    )

    return {
      success: errors.length === 0,
      deletedCount,
      errors,
    }
  } catch (error) {
    const errorMsg = `Bulk deletion failed: ${error instanceof Error ? error.message : error}`
    await logAppEvent('Error', errorMsg)
    return {
      success: false,
      deletedCount: 0,
      errors: [errorMsg],
    }
  }
}
