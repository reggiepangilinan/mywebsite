'use client'
import Image from 'next/image'
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
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      sizes={sizes}
      unoptimized
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
