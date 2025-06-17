/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Image from 'next/image'
import { getBlogPost, getAllBlogSlugs } from '@/lib/contentful'
import AnimatedSection from '@/components/AnimatedSection'
import styles from './blog-post.module.css'

// Enable ISR with revalidation every hour
export const revalidate = 3600

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  try {
    const slugs = await getAllBlogSlugs()
    
    // If no slugs, return a single placeholder to satisfy static export
    if (slugs.length === 0) {
      return [{ slug: 'placeholder' }]
    }
    
    return slugs.map((slug) => ({
      slug,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    // Return placeholder for static export compatibility
    return [{ slug: 'placeholder' }]
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
  const post = await getBlogPost(slug)

  if (!post) {
    notFound()
  }

  const fields = post.fields as any

  console.log('Rendering blog post:', fields);    // Debugging line to check fields
  const { title, subtitle, content, featuredImage, publishDate, tags, author } = fields

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getImageUrl = () => {
    if (!featuredImage?.fields?.file?.url) return null
    return `https:${featuredImage.fields.file.url}`
  }

  const imageUrl = getImageUrl()
  const imageAlt = featuredImage?.fields?.title || title

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <AnimatedSection>
          <article className={styles.article}>
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
              <div className={styles.meta}>
                <time dateTime={publishDate} className={styles.date}>
                  {formatDate(publishDate)}
                </time>
                {author && <span className={styles.author}>by {author}</span>}
              </div>
              
              <h1 className={styles.title}>{title}</h1>
              
              {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
              
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
                <div>
                  <p>Rich text content from Contentful needs additional processing.</p>
                  <p>Please ensure your content field in Contentful is set to &ldquo;Long text&rdquo; rather than &ldquo;Rich text&rdquo; for HTML content, or implement a rich text renderer.</p>
                </div>
              )}
            </div>
          </article>
        </AnimatedSection>
      </div>
    </main>
  )
}
