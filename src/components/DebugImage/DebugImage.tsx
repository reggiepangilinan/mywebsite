'use client'
import Image from 'next/image'
import { optimizeContentfulImage } from '@/lib/contentful-image-optimizer'
import { logToLocalStorage } from '@/lib/production-logger'

interface DebugImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  sizes?: string
}

export default function DebugImage({
  src,
  alt,
  width,
  height,
  className,
  sizes,
}: DebugImageProps) {
  // Optimize Contentful images with modern formats
  const optimizedSrc = src.includes('ctfassets.net')
    ? optimizeContentfulImage(src, {
        width: Math.min(width, 1200),
        quality: 85,
        format: 'webp',
      })
    : src

  return (
    <Image
      src={optimizedSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      sizes={sizes}
      unoptimized={!src.includes('ctfassets.net')} // Enable optimization only for Contentful images
      onError={(e) => {
        logToLocalStorage('richtext-image-error', {
          src,
          error: e.currentTarget.src,
          naturalWidth: e.currentTarget.naturalWidth,
          naturalHeight: e.currentTarget.naturalHeight,
        })
      }}
      onLoad={() => {
        logToLocalStorage('richtext-image-success', { src })
      }}
    />
  )
}
