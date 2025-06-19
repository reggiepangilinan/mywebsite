// Example: Client-Rendered Blog List (NOT IMPLEMENTED - for comparison only)
// This shows what the blog list would look like if we used client-rendering

'use client'
import { useEffect, useState } from 'react'
import AnimatedSection from '@/components/AnimatedSection'
import Link from 'next/link'
import Image from 'next/image'
import { blogConfig } from '@/config/blog'
import { joinUrl } from '@/lib/url-utils'
import styles from './blog.module.css'

interface BlogPost {
  sys: { id: string }
  fields: {
    title: string
    subtitle?: string
    slug: string
    excerpt: string
    featuredImage?: unknown
    publishDate: string
    tags?: string[]
    author?: string
  }
}

export default function ClientRenderedBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // This would require an API route at /api/blog-posts
        const response = await fetch('/api/blog-posts')
        if (!response.ok) throw new Error('Failed to fetch posts')
        
        const data = await response.json()
        setPosts(data.items)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load posts')
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  // Loading state - bad for SEO, shows empty page initially
  if (loading) {
    return (
      <main className={styles.main}>
        <div className="container">
          <h1 className={styles.title}>Blog Posts</h1>
          <div className={styles.loading}>
            <p>Loading blog posts...</p>
            {/* Could add skeleton loaders here */}
          </div>
        </div>
      </main>
    )
  }

  // Error state
  if (error) {
    return (
      <main className={styles.main}>
        <div className="container">
          <h1 className={styles.title}>Blog Posts</h1>
          <div className={styles.error}>
            <p>Error loading posts: {error}</p>
            <button onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        </div>
      </main>
    )
  }

  // Rest of component would be similar to server-rendered version
  // but with client-side state management

  return (
    <main className={styles.main}>
      <div className="container">
        <AnimatedSection delay={0}>
          <h1 className={styles.title}>Blog Posts</h1>
        </AnimatedSection>
        
        <div className={styles.content}>
          <AnimatedSection delay={200}>
            <p className={styles.intro}>
              Technical insights, tutorials, and thoughts on software engineering, leadership, and technology.
            </p>
          </AnimatedSection>

          {posts.length > 0 ? (
            <div className={styles.postsSection}>
              {posts.map((post, index) => {
                // Render posts similar to server version
                return (
                  <AnimatedSection key={post.sys.id} delay={400 + (index * 100)}>
                    <article className={styles.postItem}>
                      {/* Post content */}
                    </article>
                  </AnimatedSection>
                )
              })}
            </div>
          ) : (
            <AnimatedSection delay={400}>
              <div className={styles.emptyState}>
                <h2>No Posts Found</h2>
                <p>Blog posts are being prepared. Check back soon!</p>
              </div>
            </AnimatedSection>
          )}
        </div>
      </div>
    </main>
  )
}

/*
REQUIRED API ROUTE for client-rendered approach:
// src/app/api/blog-posts/route.ts

import { getBlogPosts } from '@/lib/contentful'

export async function GET() {
  try {
    const { items: posts } = await getBlogPosts()
    return Response.json({ 
      items: posts,
      total: posts.length 
    })
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    )
  }
}

COST IMPACT:
- Every blog list page visit = 2 Vercel function invocations
  1. Blog page render (returns empty shell)
  2. API route call (fetches and returns data)
- Current approach = 1 Vercel function invocation per visit
- 100% increase in function invocations
- Worse SEO (search engines see empty page)
- Worse performance (loading state + content shift)
*/
