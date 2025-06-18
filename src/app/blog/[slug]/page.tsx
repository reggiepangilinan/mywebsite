/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Image from 'next/image'
import { getBlogPost, getBlogPostForISR, getAllBlogSlugs } from '@/lib/contentful'
import AnimatedSection from '@/components/AnimatedSection'
import RichTextRenderer from '@/components/RichTextRenderer'
import { blogConfig } from '@/config/blog'
import { logISREvent } from '@/lib/isr-logger'
import { ISR_CONFIG } from '@/config/isr'
import styles from './blog-post.module.css'

// Enable ISR with configurable revalidation
// NOTE: This value must match ISR_CONFIG.BLOG_POST_REVALIDATE (currently 300)
export const revalidate = 300 // 5 minutes - update ISR_CONFIG.BLOG_POST_REVALIDATE when changing

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

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)
  
  if (!post) {
    return {
      title: 'Post Not Found - Reggie Pangilinan',
      description: 'The requested blog post could not be found.',
    }
  }

  const fields = post.fields as any
  const { title, subtitle, excerpt, featuredImage } = fields

  const description = subtitle ? `${subtitle} - ${excerpt}` : excerpt

  const imageUrl = featuredImage?.fields?.file?.url 
    ? `https:${featuredImage.fields.file.url}`
    : '/og-image.png'

  return {
    title: `${title} - Reggie Pangilinan`,
    description: description,
    openGraph: {
      title: `${title} - Reggie Pangilinan`,
      description: excerpt,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} - Reggie Pangilinan`,
      description: excerpt,
      images: [imageUrl],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  
  // Validate revalidate matches config
  ISR_CONFIG.validatePageRevalidate('blog-post', revalidate)
  
  await logISREvent(`Individual blog post render started - slug: ${slug}`)
  
  // Use ISR-specific function with fetch and Next.js cache control
  const post = await getBlogPostForISR(slug)

  if (!post) {
    await logISREvent(`Blog post not found, returning 404 - slug: ${slug}`)
    notFound()
  }
  
  await logISREvent(`Individual blog post render completed - slug: ${slug}, title: ${post.fields.title}`)

  const fields = post.fields as any

  const { title, subtitle, content, featuredImage, publishDate, tags, author } = fields

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', blogConfig.dateFormat)
  }

  const getImageUrl = () => {
    if (!featuredImage?.fields?.file?.url) return null
    return `https:${featuredImage.fields.file.url}`
  }

  const imageUrl = getImageUrl()
  const imageAlt = featuredImage?.fields?.title || title

  return (
    <main className={styles.main}>
      <div className="container">
        <AnimatedSection>
          {imageUrl && (
            <div className={styles.featuredImage}>
              <Image
                src={imageUrl}
                alt={imageAlt}
                width={1200}
                height={600}
                className={styles.image}
                unoptimized
                priority
              />
            </div>
          )}
          
          <header className={styles.header}>
            <h1 className={styles.title} data-title={title}>{title}</h1>
            
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
            
            <div className={styles.meta}>
              <time dateTime={publishDate} className={styles.date}>
                {formatDate(publishDate)}
              </time>
              {author && <span className={styles.author}>by {author}</span>}
            </div>
            
            {tags && tags.length > 0 && (
              <div className={styles.tags}>
                {tags.map((tag: string) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>
          
          <div className={styles.content}>
            {typeof content === 'string' ? (
              <div dangerouslySetInnerHTML={{ __html: content }} />
            ) : (
              <RichTextRenderer content={content} />
            )}
          </div>
        </AnimatedSection>
      </div>
    </main>
  )
}
