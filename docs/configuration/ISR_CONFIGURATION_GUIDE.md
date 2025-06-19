# ISR Configuration Guide

## Overview
This project uses centralized ISR (Incremental Static Regeneration) configuration to manage revalidation timing across all blog pages.

## Configuration Location
All ISR timing is managed in: **`src/config/isr.ts`**

## Current Settings
- **Blog List** (`/blog`): Dynamic (no ISR - shows new posts immediately)
- **Blog Posts** (`/blog/[slug]`): 3600 seconds (1 hour)  
- **Development Dashboard** (`/dev-info`): 1800 seconds (30 minutes)

## How to Change ISR Timing

### 1. Update the Configuration
Edit `src/config/isr.ts`:
```typescript
export const ISR_CONFIG = {
  BLOG_POST_REVALIDATE: 3600, // 1 hour - Individual blog posts (cost-optimized)
  DEV_INFO_PAGE_REVALIDATE: 1800, // 30 minutes - Dev info (cost-optimized)
  // Note: Blog list (/blog) is now dynamic for immediate post visibility
  // ...
}
```

### 2. Update Page Exports
Due to Next.js limitations, you must also update the literal values in each page:

**`src/app/blog/page.tsx`:**
```typescript
export const dynamic = 'force-dynamic' // Blog list is now dynamic, not ISR
```

**`src/app/blog/[slug]/page.tsx`:**
```typescript
export const revalidate = 3600 // Update to match BLOG_POST_REVALIDATE (1 hour)
```

**`src/app/dev-info/page.tsx`:**
```typescript
// Dev info page is client-side rendered, no ISR export needed
```

### 3. Validation
The system includes automatic validation that warns in console if page values don't match the configuration. If you see warnings like:
```
⚠️ ISR Config Mismatch: blog-list page has revalidate=300, expected=600
```
Update the page export to match the config.

## Debug Information
Visit `/dev-info` to see current timing configuration and test ISR behavior. The page automatically displays values from the centralized config using the `formatDuration()` helper.

## Why This Approach?
Next.js requires literal numbers for `revalidate` exports - dynamic imports don't work. This approach provides:
- ✅ Central configuration source of truth
- ✅ Runtime validation to catch mismatches  
- ✅ Automatic formatting in debug output
- ✅ Clear documentation of current settings

## Benefits
1. **Single Source of Truth**: All timing in one file
2. **Easy Updates**: Change in one place, sync to pages
3. **Validation**: Automatic checking for consistency
4. **Debug Visibility**: Real-time display of current config
5. **Type Safety**: TypeScript interfaces ensure correctness

## Related Documentation

- [Cost Optimization Summary](./COST_OPTIMIZATION_SUMMARY.md) - Complete cost analysis and optimization results
- [Server vs Client Analysis](./SERVER_VS_CLIENT_ANALYSIS.md) - Why server-rendering is optimal for blog list
- [SEO Cost Optimization](./SEO_COST_OPTIMIZATION.md) - SEO-specific cost strategies
- [Blog Setup Guide](../setup/BLOG_SETUP.md) - Complete blog implementation overview

---

*Last updated: June 19, 2025*
