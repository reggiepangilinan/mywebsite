'use client'

import { ReactNode } from 'react'
import { useBlogScrollAnimation } from '@/hooks/useBlogScrollAnimation'
import styles from './BlogAnimatedSection.module.css'

interface BlogAnimatedSectionProps {
  children: ReactNode
  delay?: number
  className?: string
  priority?: boolean // For content that should appear immediately
}

export default function BlogAnimatedSection({
  children,
  delay = 0,
  className = '',
  priority = false,
}: BlogAnimatedSectionProps) {
  const { ref, isVisible } = useBlogScrollAnimation(priority)

  return (
    <section
      ref={ref}
      className={`${styles.blogAnimatedSection} ${isVisible ? styles.visible : ''} ${className}`}
      style={{
        animationDelay: `${delay}ms`,
        // Ensure content is immediately visible on very small screens
        ...(typeof window !== 'undefined' &&
          window.innerWidth <= 480 && {
            opacity: 1,
            transform: 'none',
          }),
      }}
    >
      {children}
    </section>
  )
}
