/**
 * Contentful Image Optimization Utilities
 * Provides helpers for optimizing Contentful images with modern formats
 */

export interface ImageOptimizationOptions {
  width?: number
  height?: number
  quality?: number
  format?: 'webp' | 'avif' | 'jpg' | 'png'
  fit?: 'pad' | 'fill' | 'scale' | 'crop' | 'thumb'
  focus?:
    | 'center'
    | 'top'
    | 'right'
    | 'left'
    | 'bottom'
    | 'top_right'
    | 'top_left'
    | 'bottom_right'
    | 'bottom_left'
    | 'face'
    | 'faces'
}

/**
 * Optimizes a Contentful image URL with modern formats and compression
 * @param url - Original Contentful image URL
 * @param options - Optimization options
 * @returns Optimized image URL
 */
export function optimizeContentfulImage(
  url: string,
  options: ImageOptimizationOptions = {}
): string {
  if (!url || !url.includes('ctfassets.net')) {
    return url
  }

  const {
    width,
    height,
    quality = 80,
    format = 'webp', // Default to WebP for better compression
    fit = 'fill',
    focus = 'center',
  } = options

  const params = new URLSearchParams()

  // Add dimensions
  if (width) params.append('w', width.toString())
  if (height) params.append('h', height.toString())

  // Add quality
  params.append('q', quality.toString())

  // Add format (WebP/AVIF support)
  params.append('fm', format)

  // Add fitting and focus
  params.append('fit', fit)
  if (focus && fit === 'crop') {
    params.append('f', focus)
  }

  // Add progressive loading for JPEG fallbacks
  if (format === 'jpg') {
    params.append('fl', 'progressive')
  }

  return `${url}?${params.toString()}`
}

/**
 * Generates multiple image formats for better browser support
 * @param url - Original Contentful image URL
 * @param options - Base optimization options
 * @returns Object with URLs for different formats
 */
export function generateImageFormats(
  url: string,
  options: Omit<ImageOptimizationOptions, 'format'> = {}
) {
  if (!url || !url.includes('ctfassets.net')) {
    return {
      avif: url,
      webp: url,
      jpg: url,
      original: url,
    }
  }

  return {
    avif: optimizeContentfulImage(url, { ...options, format: 'avif' }),
    webp: optimizeContentfulImage(url, { ...options, format: 'webp' }),
    jpg: optimizeContentfulImage(url, { ...options, format: 'jpg' }),
    original: url,
  }
}

/**
 * Generates responsive image sizes for Contentful images
 * @param url - Original Contentful image URL
 * @param baseOptions - Base optimization options
 * @returns Object with different sizes optimized
 */
export function generateResponsiveImages(
  url: string,
  baseOptions: Omit<ImageOptimizationOptions, 'width'> = {}
) {
  const sizes = [480, 768, 1024, 1200, 1920]

  return sizes.reduce(
    (acc, width) => {
      acc[`${width}w`] = optimizeContentfulImage(url, {
        ...baseOptions,
        width,
        format: 'webp', // Use WebP for responsive images
      })
      return acc
    },
    {} as Record<string, string>
  )
}

/**
 * Creates optimized srcSet for Next.js Image component
 * @param url - Original Contentful image URL
 * @param options - Base optimization options
 * @returns srcSet string for responsive images
 */
export function createOptimizedSrcSet(
  url: string,
  options: Omit<ImageOptimizationOptions, 'width'> = {}
): string {
  if (!url || !url.includes('ctfassets.net')) {
    return ''
  }

  const sizes = [480, 768, 1024, 1200, 1920]

  return sizes
    .map((width) => {
      const optimizedUrl = optimizeContentfulImage(url, {
        ...options,
        width,
        format: 'webp',
      })
      return `${optimizedUrl} ${width}w`
    })
    .join(', ')
}
