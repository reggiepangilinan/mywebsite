'use client'

import { useState } from 'react'
import Image from 'next/image'
import { optimizeContentfulImage } from '@/lib/contentful-image-optimizer'
import styles from './blog-post.module.css'

interface BlogPostImageProps {
  src: string
  alt: string
  width: number
  height: number
  caption?: string
}

// Static blur placeholder to avoid hydration issues
const STATIC_BLUR_DATA_URL =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='

export default function BlogPostImage({
  src,
  alt,
  width,
  height,
  caption,
}: BlogPostImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  // Optimize Contentful image URL with modern formats
  const optimizedSrc = src.includes('ctfassets.net')
    ? optimizeContentfulImage(src, {
        width: Math.min(width, 1200),
        quality: 85,
        format: 'webp', // Use WebP for better compression
        fit: 'fill',
      })
    : src

  // Fallback to original if optimization fails
  const [useOriginal, setUseOriginal] = useState(false)
  const [disableOptimization, setDisableOptimization] = useState(false)
  const finalSrc = useOriginal ? src : optimizedSrc

  if (hasError) {
    return (
      <div className={styles.imageError}>
        <div className={styles.imageErrorIcon}>🖼️</div>
        <div className={styles.imageErrorText}>
          Failed to load image
          <br />
          <small>{alt}</small>
          <br />
          <small style={{ fontSize: '10px', opacity: 0.7 }}>
            URL: {finalSrc}
          </small>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.featuredImageContainer}>
      <Image
        src={finalSrc}
        alt={alt}
        width={width}
        height={height}
        className={`${styles.featuredImage} ${isLoaded ? styles.loaded : ''}`}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
        placeholder={!disableOptimization ? 'blur' : 'empty'}
        blurDataURL={disableOptimization ? undefined : STATIC_BLUR_DATA_URL}
        unoptimized={disableOptimization}
        priority
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          if (!useOriginal) {
            // Try with original URL if optimized fails
            setUseOriginal(true)
          } else if (!disableOptimization) {
            // Try with Next.js optimization disabled
            setDisableOptimization(true)
            setUseOriginal(false) // Reset to try optimized URL again but unoptimized
          } else {
            // If everything fails, mark as error
            setHasError(true)
          }
        }}
      />
      {caption && isLoaded && (
        <figcaption className={styles.imageCaption}>{caption}</figcaption>
      )}
    </div>
  )
}
