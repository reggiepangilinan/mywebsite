'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface BlogListImageProps {
  src: string
  alt: string
  href: string
  className?: string
  width?: number
  height?: number
}

// Static blur placeholder to avoid hydration issues
const STATIC_BLUR_DATA_URL =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='

export default function BlogListImage({
  src,
  alt,
  href,
  className,
  width = 800,
  height = 400,
}: BlogListImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  // Optimize Contentful image URL for blog list (smaller size)
  const optimizedSrc = src.includes('ctfassets.net')
    ? `${src}?w=${Math.min(width, 800)}&h=${Math.min(height, 400)}&fit=fill&f=center&q=75&fm=webp`
    : src

  // Fallback to original if optimization fails
  const [useOriginal, setUseOriginal] = useState(false)
  const [disableOptimization, setDisableOptimization] = useState(false)
  const finalSrc = useOriginal ? src : optimizedSrc

  if (hasError) {
    return (
      <Link href={href} className={className}>
        <div
          style={{
            width: '100%',
            height: `${height}px`,
            backgroundColor: '#f3f4f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            color: '#6b7280',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🖼️</div>
            <div style={{ fontSize: '0.875rem' }}>Image unavailable</div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={href} className={className}>
      <Image
        src={finalSrc}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${isLoaded ? 'loaded' : ''}`}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        placeholder="blur"
        blurDataURL={disableOptimization ? undefined : STATIC_BLUR_DATA_URL}
        unoptimized={disableOptimization}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          if (!useOriginal) {
            // Try with original URL if optimized fails
            setUseOriginal(true)
          } else if (!disableOptimization) {
            // Try with Next.js optimization disabled
            setDisableOptimization(true)
            setUseOriginal(false)
          } else {
            // If everything fails, show error state
            setHasError(true)
          }
        }}
        style={{
          objectFit: 'cover',
          transition: 'opacity 0.3s ease',
          opacity: isLoaded ? 1 : 0.8,
        }}
      />
    </Link>
  )
}
