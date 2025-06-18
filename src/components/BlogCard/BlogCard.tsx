/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link'
import Image from 'next/image'
import { BlogPost } from '@/lib/contentful'
import styles from './BlogCard.module.css'

interface BlogCardProps {
  post: BlogPost
}

export default function BlogCard({ post }: BlogCardProps) {
  const fields = post.fields as any
  const { title, subtitle, slug, excerpt, featuredImage, publishDate, tags, author } = fields

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getImageUrl = () => {
    if (!featuredImage) return null
    if (featuredImage.fields?.file?.url) {
      return `https:${featuredImage.fields.file.url}`
    }
    return null
  }

  const imageUrl = getImageUrl()
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
              unoptimized
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
          
          <p className={styles.excerpt}>{excerpt}</p>
          
          {tags && tags.length > 0 && (
            <div className={styles.tags}>
              {tags.map((tag: string) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          <div className={styles.readMore}>
            Read more →
          </div>
        </div>
      </Link>
    </article>
  )
}
