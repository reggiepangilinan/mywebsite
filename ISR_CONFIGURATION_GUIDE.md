# ISR Configuration Guide

## Overview
This project uses centralized ISR (Incremental Static Regeneration) configuration to manage revalidation timing across all blog pages.

## Configuration Location
All ISR timing is managed in: **`src/config/isr.ts`**

## Current Settings
- **Blog List** (`/blog`): 300 seconds (5 minutes)
- **Blog Posts** (`/blog/[slug]`): 300 seconds (5 minutes)  
- **Development Dashboard** (`/dev-info`): 60 seconds (1 minute)

## How to Change ISR Timing

### 1. Update the Configuration
Edit `src/config/isr.ts`:
```typescript
export const ISR_CONFIG = {
  BLOG_LIST_REVALIDATE: 600, // Change from 300 to 600 (10 minutes)
  BLOG_POST_REVALIDATE: 600, // Change from 300 to 600 (10 minutes)
  DEV_INFO_PAGE_REVALIDATE: 120, // Change from 60 to 120 (2 minutes)
  // ...
}
```

### 2. Update Page Exports
Due to Next.js limitations, you must also update the literal values in each page:

**`src/app/blog/page.tsx`:**
```typescript
export const revalidate = 600 // Update to match BLOG_LIST_REVALIDATE
```

**`src/app/blog/[slug]/page.tsx`:**
```typescript
export const revalidate = 600 // Update to match BLOG_POST_REVALIDATE
```

**`src/app/dev-info/page.tsx`:**
```typescript
export const revalidate = 120 // Update to match DEV_INFO_PAGE_REVALIDATE
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
