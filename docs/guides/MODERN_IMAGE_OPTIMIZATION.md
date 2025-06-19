# Modern Image Format Optimization

This guide documents the implementation of modern image format optimization (WebP/AVIF) for the website's Contentful images.

## Overview

The website now supports modern image formats like WebP and AVIF, which provide:

- **Better compression**: 25-50% smaller file sizes compared to JPEG/PNG
- **Faster loading**: Reduced data consumption and improved Core Web Vitals
- **Browser compatibility**: Automatic fallback to original formats for older browsers

## Implementation Details

### 1. Next.js Configuration (`next.config.ts`)

```typescript
images: {
  unoptimized: false, // Enable Next.js image optimization
  formats: ['image/webp', 'image/avif'], // Enable modern formats
  domains: ['images.ctfassets.net'],
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'images.ctfassets.net',
      port: '',
      pathname: '/**',
    },
  ],
}
```

### 2. Contentful Image Optimizer (`src/lib/contentful-image-optimizer.ts`)

New utility functions for optimizing Contentful images:

- `optimizeContentfulImage()` - Optimizes a single image with modern formats
- `generateImageFormats()` - Creates multiple format versions (AVIF, WebP, JPEG)
- `generateResponsiveImages()` - Creates responsive image sizes
- `createOptimizedSrcSet()` - Generates srcSet for Next.js Image component

### 3. Component Updates

#### BlogPostImage Component

- Now uses WebP format by default with 85% quality
- Maintains fallback handling for optimization failures
- Uses proper crop and focus parameters for featured images

#### BlogCard Component

- Optimized thumbnail images with 400x250 crop
- WebP format with center focus for consistent card layouts

#### DebugImage Component

- Removed `unoptimized` flag to enable Next.js optimization
- Uses WebP format for rich text embedded images

## Usage Examples

### Basic Image Optimization

```typescript
import { optimizeContentfulImage } from '@/lib/contentful-image-optimizer'

const optimizedUrl = optimizeContentfulImage(originalUrl, {
  width: 800,
  height: 600,
  quality: 85,
  format: 'webp',
  fit: 'crop',
  focus: 'center',
})
```

### Multiple Format Generation

```typescript
import { generateImageFormats } from '@/lib/contentful-image-optimizer'

const formats = generateImageFormats(originalUrl, {
  width: 1200,
  quality: 85,
})

// Results in:
// {
//   avif: "...?w=1200&q=85&fm=avif",
//   webp: "...?w=1200&q=85&fm=webp",
//   jpg: "...?w=1200&q=85&fm=jpg",
//   original: "..."
// }
```

### Responsive Images

```typescript
import { generateResponsiveImages } from '@/lib/contentful-image-optimizer'

const responsiveImages = generateResponsiveImages(originalUrl, {
  quality: 85,
  format: 'webp',
})

// Results in multiple sizes: 480w, 768w, 1024w, 1200w, 1920w
```

## Contentful Parameters Supported

| Parameter | Description           | Values                                  |
| --------- | --------------------- | --------------------------------------- |
| `w`       | Width in pixels       | Any integer                             |
| `h`       | Height in pixels      | Any integer                             |
| `q`       | Quality (1-100)       | Default: 80                             |
| `fm`      | Format                | `webp`, `avif`, `jpg`, `png`            |
| `fit`     | Resize behavior       | `pad`, `fill`, `scale`, `crop`, `thumb` |
| `f`       | Focus area (for crop) | `center`, `top`, `face`, etc.           |
| `fl`      | Flags                 | `progressive` for JPEG                  |

## Performance Benefits

### Before Optimization

- Images served in original JPEG/PNG formats
- No compression optimization
- Larger file sizes

### After Optimization

- WebP format reduces file sizes by 25-50%
- AVIF format provides even better compression
- Automatic browser support detection
- Responsive image sizes reduce bandwidth on mobile

## Browser Support

- **WebP**: Supported by all modern browsers (95%+ global support)
- **AVIF**: Supported by Chrome, Firefox, Safari (80%+ global support)
- **Fallback**: Automatic fallback to JPEG/PNG for older browsers

## Testing

To verify optimization is working:

1. **Dev Tools**: Check Network tab for WebP/AVIF requests
2. **Image URLs**: Should include `fm=webp` or `fm=avif` parameters
3. **File Sizes**: Compare original vs optimized image sizes
4. **Core Web Vitals**: Monitor LCP improvements

## Configuration Options

### Quality Settings

- **High quality**: 90-95% (for hero images)
- **Standard**: 80-85% (for most content)
- **Thumbnail**: 70-80% (for small images)

### Format Preferences

1. **AVIF** - Best compression, newest format
2. **WebP** - Good compression, wide support
3. **JPEG** - Universal fallback

## Monitoring

Track image optimization impact using:

- Lighthouse Core Web Vitals
- Network panel file sizes
- Page load times
- User experience metrics

## Future Enhancements

Potential improvements:

- Lazy loading for non-critical images
- Blur placeholders from image metadata
- Art direction with different crops for mobile/desktop
- Integration with image CDN analytics
