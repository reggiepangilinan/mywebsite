/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link'
import Image from 'next/image'
import { optimizeContentfulImage } from '@/lib/contentful-image-optimizer'
import { BlogPost } from '@/lib/contentful'
import { blogConfig } from '@/config/blog'
import styles from './BlogCard.module.css'

interface BlogCardProps {
  post: BlogPost
}

export default function BlogCard({ post }: BlogCardProps) {
  const fields = post.fields as any
  const {
    title,
    subtitle,
    slug,
    excerpt,
    featuredImage,
    publishDate,
    tags,
    author,
  } = fields

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength).trim() + '...'
  }

  const getOptimizedImageUrl = () => {
    if (!featuredImage) return null
    if (featuredImage.fields?.file?.url) {
      const baseUrl = `https:${featuredImage.fields.file.url}`
      return optimizeContentfulImage(baseUrl, {
        width: 400,
        height: 250,
        quality: 85,
        format: 'webp',
        fit: 'crop',
        focus: 'center',
      })
    }
    return null
  }

  const imageUrl = getOptimizedImageUrl()
  const imageAlt = featuredImage?.fields?.title || title

  return (
    <article className={styles.card}>
      <Link href={`/blog/${slug}`} className={styles.cardLink}>
        {imageUrl && (
          <div className={styles.imageContainer}>
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={styles.image}
              unoptimized={false} // Enable optimization for Contentful images
            />
          </div>
        )}

        <div className={styles.content}>
          <div className={styles.meta}>
            <time dateTime={publishDate} className={styles.date}>
              {formatDate(publishDate)}
            </time>
            {author && <span className={styles.author}>by {author}</span>}
          </div>

          <h2 className={styles.title}>{title}</h2>

          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}

          <p className={styles.excerpt}>
            {truncateText(excerpt, blogConfig.excerptMaxLength)}
          </p>

          {tags && tags.length > 0 && (
            <div className={styles.tags}>
              {tags.map((tag: string) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className={styles.readMore}>Read more →</div>
        </div>
      </Link>
    </article>
  )
}
