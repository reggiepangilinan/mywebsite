# Blog Post Image Loading Fix

## Issue Summary

Blog post featured images were failing to load due to Next.js Image component restrictions on external domains and hydration errors caused by client-side blur placeholder generation.

## Root Causes Identified

### 1. Domain Configuration Issue

- **Problem**: Next.js Image component was blocking images from Contentful CDN (`images.ctfassets.net`)
- **Symptom**: Images would fail to load with no error message
- **Verification**: Direct URL access worked, but Next.js Image component failed

### 2. Hydration Mismatch

- **Problem**: Client-side blur placeholder generation caused server/client HTML mismatch
- **Symptom**: React hydration error: "server rendered HTML didn't match the client"
- **Cause**: Dynamic canvas-based blur placeholder generated only on client-side

## Solutions Implemented

### 1. Next.js Image Domain Configuration

**File**: `next.config.ts`

Added Contentful CDN domain to allowed image sources:

```typescript
images: {
  unoptimized: true,
  domains: ['images.ctfassets.net'],
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'images.ctfassets.net',
      port: '',
      pathname: '/**',
    },
  ],
},
```

**Why this works**:

- `domains`: Legacy support for external image domains
- `remotePatterns`: Modern, more secure way to allow external images
- Both included for maximum compatibility

### 2. Static Blur Placeholder

**File**: `src/app/blog/[slug]/BlogPostImage.tsx`

Replaced dynamic blur generation with static base64 placeholder:

```typescript
// Before: Dynamic generation causing hydration issues
const generateBlurPlaceholder = () => {
  const canvas = document.createElement('canvas')
  // ... canvas operations only available on client
}

// After: Static placeholder consistent between server and client
const STATIC_BLUR_DATA_URL =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/...'
```

## Image Loading Features

### Enhanced BlogPostImage Component

The `BlogPostImage` component now includes:

1. **Contentful Image Optimization**

   ```typescript
   const optimizedSrc = src.includes('ctfassets.net')
     ? `${src}?w=${Math.min(width, 1200)}&q=80`
     : src
   ```

2. **Progressive Fallback Strategy**

   - Try optimized Contentful URL first
   - Fall back to original URL if optimization fails
   - Fall back to unoptimized Next.js rendering if needed
   - Show error state if all attempts fail

3. **Performance Optimizations**
   - Static blur placeholder for perceived performance
   - Responsive sizing with `sizes` attribute
   - Priority loading for above-the-fold images
   - Proper alt text and caption support

## Testing Performed

### 1. URL Accessibility Test

```bash
curl -I "https://images.ctfassets.net/t225ta85zpu7/6fQPM2F20xPghtAZu4AxzK/f27016102b3f8365bc141de1139d9898/dummyFeaturedImage.jpg"
# Result: HTTP/2 200 - URL accessible
```

### 2. Component Testing

- ✅ Regular `<img>` tag loads successfully
- ✅ Next.js `<Image>` component loads after domain configuration
- ✅ No hydration errors in development or production
- ✅ Build process completes without errors

### 3. Browser Testing

- ✅ Images load correctly in development server
- ✅ Images load correctly in production build
- ✅ Responsive behavior works as expected
- ✅ Error fallbacks function properly

## Configuration Requirements

### Environment Variables

Ensure these Contentful variables are set:

```
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_access_token
```

### Next.js Configuration

The `next.config.ts` must include the image domain configuration as shown above.

## Future Considerations

### Image Optimization

- Consider implementing WebP format optimization
- Add lazy loading for images below the fold
- Implement responsive image sizing based on viewport

### Error Handling

- Add retry logic for failed image loads
- Implement fallback images for better UX
- Add monitoring for image load failures

### Performance

- Consider using Next.js built-in image optimization in production
- Implement progressive image loading
- Add image preloading for critical images

## Related Files Modified

1. **Core Configuration**

   - `next.config.ts` - Added Contentful domain configuration

2. **Image Components**

   - `src/app/blog/[slug]/BlogPostImage.tsx` - Enhanced with optimizations and static blur
   - `src/app/blog/[slug]/BlogPostImageSimple.tsx` - Simplified version for testing
   - `src/app/blog/[slug]/page.tsx` - Uses BlogPostImage component

3. **Utilities Created**
   - Test API endpoint for debugging image URLs (removed after testing)

## Verification Commands

```bash
# Build and test
npm run build
npm run dev

# Test image URL directly
curl -I "https://images.ctfassets.net/[space]/[asset_id]/[hash]/image.jpg"

# Check for hydration errors in browser console
# Open http://localhost:3000/blog/[slug] and check for React warnings
```

## Migration Notes

If upgrading or adding new image domains:

1. Add domain to `next.config.ts` `domains` array
2. Add corresponding `remotePatterns` entry
3. Restart development server to apply config changes
4. Test with both development and production builds

This fix ensures reliable image loading for all Contentful-hosted blog post images while maintaining optimal performance and user experience.
