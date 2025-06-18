# Dynamic SEO Files Guide

## Overview
This project now uses **dynamic generation** for SEO files instead of static files. This ensures that robots.txt and sitemap.xml are always up-to-date with the latest blog posts from Contentful.

## Generated Files

### `/robots.txt` 
- **Route**: `src/app/robots.txt/route.ts`
- **Dynamic**: Yes, generated from `src/config/site.ts`
- **Cache**: 1 day (86400 seconds)
- **Features**:
  - Automatically includes/excludes pages based on configuration
  - Dynamic sitemap URL reference
  - Configurable crawl delay
  - Last updated timestamp

### `/sitemap.xml`
- **Route**: `src/app/sitemap.xml/route.ts` 
- **Dynamic**: Yes, pulls blog posts from Contentful
- **Cache**: 1 hour (3600 seconds)
- **Features**:
  - Static pages from configuration
  - All blog posts with correct URLs and dates
  - Automatic priority and changefreq settings
  - Fallback for when Contentful is unavailable

## Configuration

All SEO settings are managed in **`src/config/site.ts`**:

```typescript
export const SITE_CONFIG = {
  url: 'https://reggiepangilinan.com',
  name: 'Reggie Pangilinan',
  
  staticPages: [
    {
      path: '/',
      changefreq: 'monthly',
      priority: 1.0,
    },
    // ... more pages
  ],
  
  robots: {
    userAgent: '*',
    allow: ['/'],
    disallow: ['/dev-info', '/api'],
    crawlDelay: undefined,
  }
}
```

## Benefits

### ✅ **Dynamic Content**
- Blog posts automatically appear in sitemap when published
- No manual updates required
- Always reflects current site structure

### ✅ **Performance**
- Cached responses (1 hour for sitemap, 1 day for robots)
- Minimal server load
- Fast response times

### ✅ **SEO Optimized**
- Correct lastmod dates from Contentful
- Proper priorities and change frequencies
- Search engine friendly format

### ✅ **Reliability**
- Fallback sitemap if Contentful is unavailable
- Error handling and logging
- Consistent format

## How It Works

### Robots.txt Generation
1. Reads configuration from `SITE_CONFIG.robots`
2. Generates allow/disallow rules
3. Adds sitemap reference
4. Returns as `text/plain` with cache headers

### Sitemap.xml Generation
1. Fetches all blog posts from Contentful
2. Combines static pages from configuration
3. Uses blog publish dates for accurate `lastmod`
4. Returns as `application/xml` with cache headers

## Testing

### Local Testing
```bash
npm run dev

# Test the dynamic files
curl http://localhost:3000/robots.txt
curl http://localhost:3000/sitemap.xml
```

### Debug Information
Visit `/dev-info` to see:
- Links to generated robots.txt and sitemap.xml
- Current configuration status
- Blog post count and timing

## Deployment

### Netlify
- Dynamic routes work automatically
- Cached at CDN level
- Updates with ISR timing

### Static Hosts
- **Not compatible** - requires server-side generation
- Use static files instead (see backups in `/public/`)

## Migration Notes

### Old Static Files
- **Backed up** as `robots.txt.backup` and `sitemap.xml.backup`
- Can be restored if needed for static deployment
- No longer used by the application

### URL Structure
- **Same URLs**: `/robots.txt` and `/sitemap.xml` work as before
- **Transparent**: No changes needed for search engines
- **Automatic**: No manual intervention required

## Troubleshooting

### Sitemap Missing Blog Posts
1. Check Contentful connection and credentials
2. Verify blog posts have `publishDate` and `slug` fields
3. Check `/dev-info` for error messages

### Robots.txt Not Working
1. Verify site URL in `src/config/site.ts`
2. Check allow/disallow rules configuration
3. Clear cache and test

### Cache Issues
- Sitemap cache: 1 hour
- Robots cache: 1 day
- Force refresh: Add `?v=timestamp` to URL during testing

## Advanced Configuration

### Custom Change Frequencies
```typescript
staticPages: [
  {
    path: '/frequently-updated',
    changefreq: 'daily',
    priority: 0.8,
  }
]
```

### Robots.txt Customization
```typescript
robots: {
  userAgent: '*',
  allow: ['/', '/blog'],
  disallow: ['/admin', '/private'],
  crawlDelay: 1, // 1 second delay
}
```

This system ensures your SEO files are always current and require no manual maintenance!

## Related Documentation

- **[Double Slash Handling](./DOUBLE_SLASH_HANDLING.md)** - URL normalization and clean URL generation for SEO files
- **[Sitemap Guide](./SITEMAP_GUIDE.md)** - Additional sitemap configuration options
