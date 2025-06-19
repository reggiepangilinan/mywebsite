import { getBlogPosts } from '@/lib/contentful'
import AnimatedSection from '@/components/AnimatedSection'
import Link from 'next/link'
import Image from 'next/image'
import { blogConfig } from '@/config/blog'
import { joinUrl } from '@/lib/url-utils'
import styles from '../../blog.module.css'
import PaginationControls from '@/components/PaginationControls'
import { notFound } from 'next/navigation'

// Use ISR for paginated pages (pages 2+) for cost efficiency
export const revalidate = 3600 // 1 hour

const POSTS_PER_PAGE = blogConfig.postsPerPage

export default async function BlogPagePaginated({
  params,
}: {
  params: Promise<{ page: string }>
}) {
  const resolvedParams = await params
  const pageNumber = parseInt(resolvedParams.page)

  // Validate page number
  if (isNaN(pageNumber) || pageNumber < 2) {
    notFound()
  }

  const skip = (pageNumber - 1) * POSTS_PER_PAGE
  const { items: posts, total } = await getBlogPosts(POSTS_PER_PAGE, skip)

  // If page number is too high, return 404
  const totalPages = Math.ceil(total / POSTS_PER_PAGE)
  if (pageNumber > totalPages && total > 0) {
    notFound()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      'en-US',
      blogConfig.dateFormat
    )
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
    <main className={styles.main}>
      <div className="container">
        <AnimatedSection delay={0}>
          <h1 className={styles.title}>Blog Posts - Page {pageNumber}</h1>
        </AnimatedSection>

        <div className={styles.content}>
          <AnimatedSection delay={200}>
            <p className={styles.intro}>
              Technical insights, tutorials, and thoughts on software
              engineering, leadership, and technology.
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

                const imageUrl = getImageUrl(featuredImage)

                return (
                  <AnimatedSection key={post.sys.id} delay={400 + index * 100}>
                    <article className={styles.postCard}>
                      {imageUrl && (
                        <div className={styles.postImageWrapper}>
                          <Image
                            src={imageUrl}
                            alt={title}
                            width={400}
                            height={200}
                            className={styles.postImage}
                            unoptimized
                          />
                        </div>
                      )}

                      <div className={styles.postContent}>
                        <Link
                          href={joinUrl('/blog', slug)}
                          className={styles.titleLink}
                        >
                          <h2 className={styles.postTitle}>{title}</h2>
                        </Link>

                        {subtitle && (
                          <p className={styles.postSubtitle}>{subtitle}</p>
                        )}

                        <div className={styles.postMeta}>
                          <time dateTime={publishDate} className={styles.date}>
                            {formatDate(publishDate)}
                          </time>
                          {author && (
                            <span className={styles.author}>by {author}</span>
                          )}
                        </div>

                        <p className={styles.postExcerpt}>
                          {truncateText(excerpt, blogConfig.excerptMaxLength)}
                        </p>

                        {excerpt.length > blogConfig.excerptMaxLength && (
                          <Link
                            href={joinUrl('/blog', slug)}
                            className={styles.readMore}
                          >
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
                <h2>No posts found</h2>
                <p>This page doesn&apos;t contain any blog posts.</p>
                <Link href="/blog" className={styles.backToFirst}>
                  ← Back to first page
                </Link>
              </div>
            </AnimatedSection>
          )}

          {/* Pagination Controls - Bottom */}
          <AnimatedSection delay={500}>
            <PaginationControls
              currentPage={pageNumber}
              totalPages={totalPages}
              totalPosts={total}
              postsPerPage={POSTS_PER_PAGE}
              basePath="/blog"
            />
          </AnimatedSection>
        </div>
      </div>
    </main>
  )
}

// Generate static params for known pages (helps with prerendering)
export async function generateStaticParams() {
  try {
    const { total } = await getBlogPosts(1, 0) // Just get total count
    const totalPages = Math.ceil(total / POSTS_PER_PAGE)

    // Generate params for first 5 pages (most commonly accessed)
    const pages = Math.min(totalPages, 5)
    const params = []

    for (let i = 2; i <= pages; i++) {
      params.push({ page: i.toString() })
    }

    return params
  } catch (error) {
    console.error('Error generating static params for blog pagination:', error)
    return []
  }
}

// Generate metadata for each page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>
}) {
  const resolvedParams = await params
  const pageNumber = parseInt(resolvedParams.page)

  return {
    title: `Blog Posts - Page ${pageNumber} | Reggie Pangilinan`,
    description: `Browse technical insights, tutorials, and thoughts on software engineering, leadership, and technology. Page ${pageNumber} of blog posts.`,
    robots: pageNumber > 3 ? 'noindex, follow' : 'index, follow', // Don't index deep pages
  }
}
