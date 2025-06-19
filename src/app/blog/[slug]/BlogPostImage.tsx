'use client'

import { useState } from 'react'
import Image from 'next/image'
import styles from './blog-post.module.css'

interface BlogPostImageProps {
  src: string
  alt: string
  width: number
  height: number
  caption?: string
}

export default function BlogPostImage({
  src,
  alt,
  width,
  height,
  caption,
}: BlogPostImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return (
      <div className={styles.imageError}>
        <div className={styles.imageErrorIcon}>🖼️</div>
        <div className={styles.imageErrorText}>
          Failed to load image
          <br />
          <small>{alt}</small>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.featuredImageContainer}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`${styles.featuredImage} ${isLoaded ? styles.loaded : ''}`}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
        unoptimized
        priority
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
      />
      {caption && isLoaded && (
        <figcaption className={styles.imageCaption}>{caption}</figcaption>
      )}
    </div>
  )
}
