/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { Suspense } from 'react'
import { SITE_CONFIG } from '@/config/site'
import {
  getBlogPost,
  getBlogPostForISR,
  getAllBlogSlugs,
} from '@/lib/contentful'
import { resolveRichTextAssets } from '@/lib/rich-text-asset-resolver'
import { generatePageMetadata } from '@/lib/seo'
import AnimatedSection from '@/components/AnimatedSection'
import RichTextRenderer from '@/components/RichTextRenderer'
import { blogConfig } from '@/config/blog'
import { logAppEvent } from '@/lib/app-logger'
import { ISR_CONFIG } from '@/config/isr'
import BlogPostImage from './BlogPostImage'
import styles from './blog-post.module.css'

// Enable ISR with configurable revalidation
// NOTE: This value must match ISR_CONFIG.BLOG_POST_REVALIDATE (currently 300)
export const revalidate = 3600 // 1 hour - update ISR_CONFIG.BLOG_POST_REVALIDATE when changing

// Allow new blog posts to be generated dynamically
export const dynamicParams = true

// Ensure this page uses ISR, not static generation
export const dynamic = 'force-static'

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  try {
    const slugs = await getAllBlogSlugs()

    // If no slugs, return empty array to allow dynamic generation
    if (slugs.length === 0) {
      return []
    }

    return slugs.map((slug) => ({
      slug,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    // Return empty array to allow dynamic generation
    return []
  }
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    return generatePageMetadata({
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
      url: `/blog/${slug}`,
    })
  }

  const fields = post.fields as any
  const { title, subtitle, excerpt, featuredImage, publishDate, tags, author } =
    fields

  const description = subtitle ? `${subtitle} - ${excerpt}` : excerpt

  const getMetaImageUrl = () => {
    if (!featuredImage?.fields?.file?.url) return SITE_CONFIG.images.ogDefault
    const url = featuredImage.fields.file.url
    return url.startsWith('//') ? `https:${url}` : url
  }

  const imageUrl = getMetaImageUrl()

  return generatePageMetadata({
    title,
    description,
    keywords: tags || [],
    author: author || SITE_CONFIG.author,
    publishDate,
    image: imageUrl,
    url: `/blog/${slug}`,
    type: 'article',
  })
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params

  // Validate revalidate matches config
  ISR_CONFIG.validatePageRevalidate('blog-post', revalidate)

  await logAppEvent(
    'Page',
    `Individual blog post render started - slug: ${slug}`
  )

  // Use ISR-specific function with fetch and Next.js cache control
  const post = await getBlogPostForISR(slug)

  if (!post) {
    await logAppEvent(
      'Page',
      `Blog post not found, returning 404 - slug: ${slug}`
    )
    notFound()
  }

  await logAppEvent(
    'Page',
    `Individual blog post render completed - slug: ${slug}, title: ${post.fields.title}`
  )

  const fields = post.fields as any

  const { title, subtitle, content, featuredImage, publishDate, tags, author } =
    fields

  // Resolve rich text assets for production compatibility
  const resolvedContent =
    typeof content === 'string' ? content : await resolveRichTextAssets(content)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      'en-US',
      blogConfig.dateFormat
    )
  }

  const getImageUrl = () => {
    if (!featuredImage?.fields?.file?.url) return null
    const url = featuredImage.fields.file.url
    return url.startsWith('//') ? `https:${url}` : url
  }

  const getImageDimensions = () => {
    const file = featuredImage?.fields?.file
    return {
      width: file?.details?.image?.width || 1200,
      height: file?.details?.image?.height || 600,
    }
  }

  const imageUrl = getImageUrl()
  const hasFeaturedImage = !!imageUrl
  const imageAlt =
    featuredImage?.fields?.title || featuredImage?.fields?.description || title
  const imageCaption = featuredImage?.fields?.description
  const { width, height } = getImageDimensions()

  return (
    <main className={styles.main}>
      <div className="container">
        <AnimatedSection
          className={`${styles.blogPostSection} ${styles.immediateContent}`}
        >
          <header className={styles.header}>
            <div className={`${styles.progressiveContent} ${styles.visible}`}>
              <h1 className={styles.title} data-title={title}>
                {title}
              </h1>
            </div>

            {subtitle && (
              <div
                className={`${styles.progressiveContent} ${styles.visible}`}
                style={{ animationDelay: '0.1s' }}
              >
                <p className={styles.subtitle}>{subtitle}</p>
              </div>
            )}

            <div
              className={`${styles.progressiveContent} ${styles.visible}`}
              style={{ animationDelay: '0.2s' }}
            >
              <div className={styles.meta}>
                <time dateTime={publishDate} className={styles.date}>
                  {formatDate(publishDate)}
                </time>
                {author && <span className={styles.author}>by {author}</span>}
              </div>
            </div>

            {tags && tags.length > 0 && (
              <div
                className={`${styles.progressiveContent} ${styles.visible}`}
                style={{ animationDelay: '0.3s' }}
              >
                <div className={styles.tags}>
                  {tags.map((tag: string) => (
                    <span key={tag} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </header>

          {hasFeaturedImage && (
            <Suspense
              fallback={
                <div className={styles.featuredImageContainer}>
                  <div
                    className={styles.contentSkeleton}
                    style={{
                      width: '100%',
                      height: `${Math.min(height, 600)}px`, // Use actual image height, capped at 600px
                      borderRadius: 'var(--radius-xl)',
                    }}
                  ></div>
                </div>
              }
            >
              <BlogPostImage
                src={imageUrl}
                alt={imageAlt}
                width={width}
                height={height}
                caption={imageCaption}
              />
            </Suspense>
          )}

          <div
            className={`${styles.content} ${styles.progressiveContent} ${styles.visible}`}
            style={{ animationDelay: '0.4s' }}
          >
            {typeof resolvedContent === 'string' ? (
              <div dangerouslySetInnerHTML={{ __html: resolvedContent }} />
            ) : (
              <RichTextRenderer content={resolvedContent} />
            )}
          </div>
        </AnimatedSection>
      </div>
    </main>
  )
}
