# Image Loading Configuration - Quick Reference

## Problem Solved

Blog post featured images from Contentful CDN were failing to load due to Next.js Image component domain restrictions and React hydration errors.

## Quick Fix Summary

### 1. Add Contentful Domain to next.config.ts

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

### 2. Fixed Hydration Error

- Replaced dynamic client-side blur placeholder generation with static base64 placeholder
- Ensures consistent server/client rendering

## Result

✅ Blog post images now load correctly  
✅ No hydration errors  
✅ Better performance with optimizations  
✅ Robust error handling

## Full Documentation

See `docs/fixes/BLOG_IMAGE_LOADING_FIX.md` for complete technical details.
