'use client'

import styles from './blog-post.module.css'

export default function BlogPostSkeleton() {
  return (
    <div className={styles.main}>
      <div className="container">
        <div className={styles.blogPostSection}>
          <header className={styles.header}>
            {/* Title skeleton */}
            <div
              className={`${styles.contentSkeleton} ${styles.titleSkeleton}`}
            ></div>

            {/* Subtitle skeleton */}
            <div
              className={`${styles.contentSkeleton} ${styles.subtitleSkeleton}`}
            ></div>

            {/* Meta skeleton */}
            <div
              className={`${styles.contentSkeleton} ${styles.metaSkeleton}`}
            ></div>
          </header>

          {/* Featured image skeleton */}
          <div className={styles.featuredImageContainer}>
            <div
              className={styles.contentSkeleton}
              style={{
                width: '100%',
                height: '400px',
                borderRadius: 'var(--radius-xl)',
              }}
            ></div>
          </div>

          {/* Content skeleton */}
          <div className={styles.content}>
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className={`${styles.contentSkeleton} ${styles.contentLineSkeleton}`}
                style={{ animationDelay: `${i * 0.1}s` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
