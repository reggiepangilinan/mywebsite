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

// Generate a simple blur placeholder
const generateBlurPlaceholder = () => {
  const canvas = document.createElement('canvas')
  canvas.width = 8
  canvas.height = 6
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.fillStyle = '#f3f4f6'
    ctx.fillRect(0, 0, 8, 6)
  }
  return canvas.toDataURL()
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
  const [blurDataURL, setBlurDataURL] = useState<string>('')

  // Generate blur placeholder on client side
  useState(() => {
    if (typeof window !== 'undefined') {
      setBlurDataURL(generateBlurPlaceholder())
    }
  })

  // Optimize Contentful image URL
  const optimizedSrc = src.includes('ctfassets.net')
    ? `${src}?w=${Math.min(width, 1200)}&h=${Math.min(height, 800)}&fit=fill&f=webp&q=80`
    : src

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
        src={optimizedSrc}
        alt={alt}
        width={width}
        height={height}
        className={`${styles.featuredImage} ${isLoaded ? styles.loaded : ''}`}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
        placeholder={blurDataURL ? 'blur' : 'empty'}
        blurDataURL={blurDataURL}
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
