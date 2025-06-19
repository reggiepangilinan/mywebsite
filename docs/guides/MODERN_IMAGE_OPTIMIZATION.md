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
  unoptimized: true, // Keep static images unoptimized, enable for Contentful only
  formats: ['image/webp', 'image/avif'], // Enable modern formats for external images
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

**Key Changes:**

- `unoptimized: true` - Disables Next.js optimization globally for static images
- `formats: ['image/webp', 'image/avif']` - Prioritizes modern formats for external images
- Individual components override this setting with `unoptimized: false` for Contentful images
- Maintained Contentful domain configuration for remote images

### 2. Contentful Image Optimizer (`src/lib/contentful-image-optimizer.ts`)

A comprehensive utility library for optimizing Contentful images with modern formats:

**Core Functions:**

- `optimizeContentfulImage()` - Optimizes a single image with customizable parameters
- `generateImageFormats()` - Creates multiple format versions (AVIF, WebP, JPEG)
- `generateResponsiveImages()` - Creates responsive image sizes (480w to 1920w)
- `createOptimizedSrcSet()` - Generates srcSet for Next.js Image component

**Features:**

- Automatic Contentful URL detection (`ctfassets.net`)
- Format prioritization (WebP as default)
- Quality control (default 80%, configurable)
- Smart cropping with focus points
- Progressive JPEG support
- Responsive breakpoint generation

### 3. Component Updates

#### BlogPostImage Component (`src/app/blog/[slug]/BlogPostImage.tsx`)

**Current Implementation:**

- Uses WebP format by default with 85% quality
- Optimizes to max 1200px width for performance
- Maintains sophisticated fallback handling:
  - First tries optimized WebP version
  - Falls back to original URL if WebP fails
  - Disables Next.js optimization as final fallback
- Uses static blur placeholder for improved perceived performance
- Supports custom caption display

**Key Settings:**

```typescript
optimizeContentfulImage(src, {
  width: Math.min(width, 1200),
  quality: 85,
  format: 'webp',
  fit: 'fill',
})
```

#### BlogCard Component (`src/components/BlogCard/BlogCard.tsx`)

**Current Implementation:**

- Optimized thumbnail images with 400x250 crop for consistent card layouts
- WebP format with center focus for better visual consistency
- 85% quality for good balance of file size and visual quality
- Crop fit ensures thumbnails fill the card space uniformly

**Key Settings:**

```typescript
optimizeContentfulImage(baseUrl, {
  width: 400,
  height: 250,
  quality: 85,
  format: 'webp',
  fit: 'crop',
  focus: 'center',
})
```

#### DebugImage Component (`src/components/DebugImage/DebugImage.tsx`)

**Current Implementation:**

- Enables Next.js optimization (removed `unoptimized` flag)
- Uses WebP format for rich text embedded images
- Maintains error and success logging for debugging
- Optimizes to max 1200px width for embedded content
- 85% quality for rich text images

**Key Settings:**

```typescript
optimizeContentfulImage(src, {
  width: Math.min(width, 1200),
  quality: 85,
  format: 'webp',
})
```

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

## Testing & Verification

To verify optimization is working correctly:

### 1. Development Environment

```bash
npm run dev
# Visit http://localhost:3000/blog/[slug] to test blog post images
# Visit http://localhost:3000/blog to test card thumbnails
```

### 2. Network Analysis

- **Dev Tools**: Open Network tab and filter by "Img"
- **Image URLs**: Should include `fm=webp` parameters for Contentful images
- **File Sizes**: Compare original vs optimized image sizes
- **Format Detection**: Modern browsers should request WebP/AVIF versions

### 3. URL Structure Verification

Optimized Contentful URLs should follow this pattern:

```
https://images.ctfassets.net/[space]/[asset]/[token]/[filename]?w=400&h=250&q=85&fm=webp&fit=crop&f=center
```

### 4. Performance Monitoring

- **Core Web Vitals**: Monitor LCP (Largest Contentful Paint) improvements
- **Lighthouse**: Run audits to measure image optimization impact
- **Bundle Analysis**: Check that image optimization doesn't affect bundle size

### 5. Browser Compatibility Testing

Test across different browsers to ensure fallback behavior:

- Chrome/Edge: Should serve WebP/AVIF
- Firefox: Should serve WebP
- Safari: Should serve WebP (newer versions)
- Older browsers: Should fallback to JPEG/PNG

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

## Current Implementation Status

### ✅ Completed Features

- [x] Next.js image optimization enabled
- [x] WebP format support across all components
- [x] Contentful image optimizer utility library
- [x] BlogPostImage component optimization (85% quality, max 1200px)
- [x] BlogCard thumbnail optimization (400x250 crop, center focus)
- [x] DebugImage rich text optimization
- [x] Comprehensive error fallback handling
- [x] Static blur placeholder implementation
- [x] Quality settings per component type

### 🔄 Active Optimizations

- **Default Format**: WebP (best browser support vs compression ratio)
- **Quality Settings**: 85% for most images (good balance)
- **Max Width**: 1200px for large images (performance optimization)
- **Cropping**: Smart center focus for thumbnails
- **Fallbacks**: Multi-tier fallback system (WebP → Original → Unoptimized)

### 📊 Performance Impact

Based on typical Contentful images:

- **File Size Reduction**: 25-50% smaller with WebP
- **Load Time Improvement**: Significant LCP improvements
- **Browser Support**: 95%+ with automatic fallbacks
- **Quality Retention**: Minimal visual quality loss at 85%

## Future Enhancements

### Priority 1 (High Impact)

- [ ] AVIF format implementation for even better compression
- [ ] Lazy loading for non-critical images
- [ ] Dynamic quality adjustment based on image importance

### Priority 2 (Medium Impact)

- [ ] Blur placeholders generated from actual image metadata
- [ ] Art direction with different crops for mobile/desktop breakpoints
- [ ] Automatic format selection based on browser capabilities

### Priority 3 (Nice to Have)

- [ ] Integration with Contentful's image analytics
- [ ] Real-time optimization monitoring dashboard
- [ ] A/B testing framework for image quality settings
- [ ] CDN integration for global image delivery optimization

## Troubleshooting & Best Practices

### Common Issues

#### 1. Images Not Optimizing

**Symptoms**: Images loading in original format without WebP parameters
**Solutions**:

- Verify `unoptimized: false` in `next.config.ts`
- Check that image URLs contain `ctfassets.net`
- Ensure `optimizeContentfulImage()` is being called

#### 2. Fallback Chain Not Working

**Symptoms**: Images failing to load or showing error states
**Solutions**:

- Check BlogPostImage component's fallback logic
- Verify original image URLs are accessible
- Monitor console for image loading errors

#### 3. Poor Quality Results

**Symptoms**: Images appear blurry or pixelated
**Solutions**:

- Increase quality setting (try 90-95% for critical images)
- Check source image resolution vs display size
- Verify `fit` parameter is appropriate for use case

## Troubleshooting

### Static Images Not Loading

**Problem**: Hero avatar, company logos, or other static images appear broken after enabling image optimization.

**Root Cause**: Next.js image optimization conflicts with static assets when `unoptimized: false` is set globally.

**Solution**:

1. Set `unoptimized: true` globally in `next.config.ts` for static images
2. Override with `unoptimized: false` specifically for Contentful images
3. Example implementation:

```tsx
// For Contentful images (enable optimization)
<Image
  src={contentfulImageUrl}
  alt="Blog post image"
  unoptimized={false} // Enable Next.js optimization
  width={800}
  height={600}
/>

// For static images (use global setting - unoptimized: true)
<Image
  src="/profile.webp"
  alt="Profile picture"
  width={200}
  height={200}
  // No unoptimized prop - uses global setting
/>
```

### Contentful Images Not Optimizing

**Problem**: Contentful images still loading in original format instead of WebP/AVIF.

**Solution**:

1. Ensure `unoptimized: false` is set on Contentful Image components
2. Verify Contentful domains are configured in `next.config.ts`
3. Check that the image URL contains `ctfassets.net`

### Build Failures with Image Optimization

**Problem**: Build fails with image optimization errors.

**Solution**:

1. Ensure all required image domains are added to `next.config.ts`
2. For static export (`output: 'export'`), consider disabling optimization globally
3. Use `unoptimized: true` for images that don't need optimization

### Performance Issues

**Problem**: Images loading slowly despite optimization.

**Solutions**:

1. Implement proper `sizes` attribute for responsive images
2. Use `priority` prop for above-the-fold images
3. Enable lazy loading for below-the-fold images
4. Monitor Lighthouse scores and Core Web Vitals

### Best Practices

#### Image Quality Guidelines

```typescript
// Hero/Featured Images (high visibility)
{ quality: 90, format: 'webp' }

// Content Images (blog posts, articles)
{ quality: 85, format: 'webp' }

// Thumbnails/Cards (small display size)
{ quality: 80, format: 'webp' }

// Background/Decorative Images
{ quality: 75, format: 'webp' }
```

#### Responsive Image Sizing

```typescript
// Mobile-first approach
const responsiveSettings = {
  mobile: { width: 320, quality: 80 },
  tablet: { width: 768, quality: 85 },
  desktop: { width: 1200, quality: 85 },
  large: { width: 1920, quality: 90 },
}
```

#### Performance Optimization Tips

1. **Use appropriate dimensions**: Don't load 4K images for thumbnail displays
2. **Implement lazy loading**: For images below the fold
3. **Preload critical images**: For above-the-fold content
4. **Monitor Core Web Vitals**: Track LCP improvements
5. **Test on slow connections**: Verify performance on 3G networks

### Debugging Tools

#### Network Analysis

```javascript
// Check if WebP is being served
const images = document.querySelectorAll('img')
images.forEach((img) => {
  if (img.src.includes('ctfassets.net')) {
    console.log('Image URL:', img.src)
    console.log('Contains WebP?', img.src.includes('fm=webp'))
  }
})
```

#### Performance Monitoring

```javascript
// Monitor LCP for image-heavy pages
new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.entryType === 'largest-contentful-paint') {
      console.log('LCP:', entry.startTime, 'ms')
    }
  }
}).observe({ entryTypes: ['largest-contentful-paint'] })
```
