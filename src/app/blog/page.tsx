import { getBlogPosts } from '@/lib/contentful'
import AnimatedSection from '@/components/AnimatedSection'
import BlogPageClient from '@/components/BlogPageClient'
import Link from 'next/link'
import Image from 'next/image'
import { blogConfig } from '@/config/blog'
import { logISREvent } from '@/lib/isr-logger'
import { ISR_CONFIG } from '@/config/isr'
import styles from './blog.module.css'

// Enable ISR with configurable revalidation
// NOTE: This value must match ISR_CONFIG.BLOG_LIST_REVALIDATE (currently 300)
export const revalidate = 300 // 5 minutes - update ISR_CONFIG.BLOG_LIST_REVALIDATE when changing

export default async function BlogPage() {
  // Validate revalidate matches config
  ISR_CONFIG.validatePageRevalidate('blog-list', revalidate)
  
  await logISREvent('Blog list page render started')
  
  const { items: posts } = await getBlogPosts()
  
  await logISREvent(`Blog list page data loaded - ${posts.length} posts found`)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', blogConfig.dateFormat)
  }

  const getImageUrl = (featuredImage: unknown) => {
    const image = featuredImage as { fields?: { file?: { url?: string } } }
    if (!image?.fields?.file?.url) return null
    return `https:${image.fields.file.url}`
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength).trim() + '...'
  }

  return (
    <BlogPageClient postCount={posts.length}>
      <main className={styles.main} id="blog-posts">
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
                const fields = post.fields as {
                  title: string
                  subtitle?: string
                  slug: string
                  excerpt: string
                  featuredImage?: unknown
                  publishDate: string
                  tags?: string[]
                  author?: string
                }
                const { title, subtitle, slug, excerpt, featuredImage, publishDate, tags, author } = fields
                const imageUrl = getImageUrl(featuredImage)
                const imageAlt = (featuredImage as { fields?: { title?: string } })?.fields?.title || title

                return (
                  <AnimatedSection key={post.sys.id} delay={400 + (index * 100)}>
                    <article className={styles.postItem}>
                      {imageUrl && (
                        <div className={styles.postImage}>
                          <Link href={`/blog/${slug}`} className={styles.postImageLink}>
                            <Image
                              src={imageUrl}
                              alt={imageAlt}
                              width={800}
                              height={400}
                              className={styles.image}
                              unoptimized
                            />
                          </Link>
                        </div>
                      )}
                      
                      <div className={styles.postContent}>
                        <Link href={`/blog/${slug}`} className={styles.titleLink}>
                          <h2 className={styles.postTitle}>{title}</h2>
                        </Link>
                        
                        {subtitle && <p className={styles.postSubtitle}>{subtitle}</p>}
                        
                        <div className={styles.postMeta}>
                          <time dateTime={publishDate} className={styles.date}>
                            {formatDate(publishDate)}
                          </time>
                          {author && <span className={styles.author}>by {author}</span>}
                        </div>
                        
                        <p className={styles.postExcerpt}>
                          {truncateText(excerpt, blogConfig.excerptMaxLength)}
                        </p>
                        
                        {excerpt.length > blogConfig.excerptMaxLength && (
                          <Link href={`/blog/${slug}`} className={styles.readMore}>
                            Read more
                          </Link>
                        )}
                        
                        {tags && tags.length > 0 && (
                          <div className={styles.postTags}>
                            {tags.map((tag: string) => (
                              <span key={tag} className={styles.tag}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </article>
                  </AnimatedSection>
                )
              })}
            </div>
          ) : (
            <AnimatedSection delay={400}>
              <div className={styles.emptyState}>
                <h2>Coming Soon</h2>
                <p>Blog posts are being prepared. Check back soon for technical insights and tutorials!</p>
              </div>
            </AnimatedSection>
          )}
        </div>
      </div>
    </main>
    </BlogPageClient>
  )
}
