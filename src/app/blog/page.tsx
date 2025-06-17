import { getBlogPosts } from '@/lib/contentful'
import BlogCard from '@/components/BlogCard'
import AnimatedSection from '@/components/AnimatedSection'
import styles from './blog.module.css'

// Enable ISR with revalidation every hour
export const revalidate = 3600

export default async function BlogPage() {
  const { items: posts } = await getBlogPosts()

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <AnimatedSection>
          <div className={styles.header}>
            <h1 className={styles.title}>Blog</h1>
            <p className={styles.subtitle}>
              Technical insights, tutorials, and thoughts on software engineering, leadership, and technology.
            </p>
          </div>
        </AnimatedSection>

        {posts.length > 0 ? (
          <AnimatedSection delay={0.2}>
            <div className={styles.grid}>
              {posts.map((post) => (
                <BlogCard key={post.sys.id} post={post} />
              ))}
            </div>
          </AnimatedSection>
        ) : (
          <AnimatedSection delay={0.2}>
            <div className={styles.emptyState}>
              <h2>Coming Soon</h2>
              <p>Blog posts are being prepared. Check back soon for technical insights and tutorials!</p>
            </div>
          </AnimatedSection>
        )}
      </div>
    </main>
  )
}
