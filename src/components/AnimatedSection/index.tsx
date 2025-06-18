'use client'

import { ReactNode } from 'react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import styles from './AnimatedSection.module.css'

interface AnimatedSectionProps {
  children: ReactNode
  delay?: number
  className?: string
}

export default function AnimatedSection({ 
  children, 
  delay = 0, 
  className = '' 
}: AnimatedSectionProps) {
  const { ref, isVisible } = useScrollAnimation(0.1, '-100px')

  return (
    <section
      ref={ref}
      className={`${styles.animatedSection} ${isVisible ? styles.visible : ''} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </section>
  )
}
