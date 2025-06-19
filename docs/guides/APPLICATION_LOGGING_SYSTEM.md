# Application Logging System

## Overview

The `logAppEvent` function provides comprehensive operational logging for the Next.js application, handling much more than just ISR (Incremental Static Regeneration) events. It serves as the primary logging mechanism for all application operations with contextual prefixes for easy identification.

## Contextual Prefixes

The logging system uses contextual prefixes to categorize different types of events:

- **`[ISR]`** - Incremental Static Regeneration events
- **`[Contentful]`** - Contentful API operations and responses
- **`[Page]`** - Page rendering lifecycle events
- **`[Error]`** - Error conditions and exception handling
- **`[Bulk]`** - Bulk operations and content management
- **`[API]`** - API route operations
- **`[System]`** - System-level events and debugging

## Logging Scope

### 1. ISR Events

- Page revalidation triggers
- Cache status changes
- Background regeneration completion
- Stale-while-revalidate behavior

### 2. Contentful API Operations

- Blog post fetching (individual and paginated)
- API response timing and status
- Content retrieval errors and retries
- SDK fallback scenarios

### 3. Page Rendering Events

- Blog post page generation
- 404 handling for missing content
- Dynamic route processing
- Server-side rendering lifecycle

### 4. Error Tracking & Debugging

- API connection failures
- Content parsing errors
- Timeout handling
- Fallback mechanism activation

### 5. Bulk Operations

- Content management operations
- Bulk deletion workflows
- Maintenance task execution
- Administrative operations

## Implementation

### Core Function: `logAppEvent(context, message, data?)`

**Location**: `/src/lib/app-logger.ts`

**Signature**:

```typescript
type LogContext =
  | 'ISR'
  | 'Contentful'
  | 'Page'
  | 'Error'
  | 'Bulk'
  | 'API'
  | 'System'

export async function logAppEvent(
  context: LogContext,
  message: string,
  data?: unknown
) {
  // Environment-aware logging with contextual prefixes
  // Production: console.error + console.log for maximum visibility
  // Development: console.log (when explicitly enabled)
  // Output: [Context] message | timestamp | Data: {...}
}
```

### Usage Patterns

**Import:**

```typescript
import { logAppEvent } from '@/lib/app-logger'
```

#### Contentful Operations

```typescript
// API call logging
await logAppEvent(
  'Contentful',
  `Fetching blog posts - limit: ${limit}, skip: ${skip}`
)

// Error handling
await logAppEvent('Error', 'Failed to fetch blog posts', { error, limit, skip })

// Success confirmation
await logAppEvent(
  'Contentful',
  `Successfully fetched ${posts.items.length} blog posts`
)
```

#### Page Rendering

```typescript
// Render start
await logAppEvent('Page', `Individual blog post render started - slug: ${slug}`)

// 404 handling
await logAppEvent('Page', `Blog post not found, returning 404 - slug: ${slug}`)

// Success
await logAppEvent('Page', `Blog post rendered successfully - slug: ${slug}`)
```

#### ISR Events

```typescript
// ISR-specific operations
await logAppEvent(
  'ISR',
  `Fetching blog post with ISR using SDK - slug: ${slug}`
)

// Fallback scenarios
await logAppEvent('ISR', `Falling back to regular getBlogPost - slug: ${slug}`)
```

#### Bulk Operations

```typescript
// Operation start
await logAppEvent('Bulk', 'Starting bulk deletion of all blog posts')

// Progress tracking
await logAppEvent('Bulk', `Found ${entries.items.length} blog posts to delete`)

// Completion
await logAppEvent(
  'Bulk',
  `Bulk deletion completed - ${deleted} items processed`
)
```

## Environment Configuration

### Development

```bash
ENABLE_ISR_LOGS=true    # Enable logging in development
DEBUG=true              # Alternative enable flag
```

### Production (Netlify)

```bash
ENABLE_ISR_LOGS=true    # Recommended for debugging
DEBUG=true              # Alternative enable flag
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_access_token
```

## Log Output Format

### Production Format

```
[APP-2025-01-04T12:34:56.789Z] Fetching blog posts - limit: 10, skip: 0
[APP-2025-01-04T12:34:57.123Z] Blog post rendered successfully - slug: my-post | Data: {"renderTime": 456}
```

### Development Format

```
[APP-2025-01-04T12:34:56.789Z] Individual blog post render started - slug: my-post
```

## Log Visibility Strategy

### Why console.error in Production?

1. **Higher Priority**: Hosting platforms prioritize error logs
2. **Better Retention**: Less likely to be filtered out
3. **Visibility**: More prominent in deployment logs
4. **Background Processes**: Serverless functions often suppress console.log
5. **Debugging**: Critical for troubleshooting production issues

### Multiple Output Streams

```typescript
console.error(fullLog) // High priority
console.log(fullLog) // Standard logging
process.stdout.write() // Direct output
process.stderr.write() // Error stream
```

## Related Files

### Core Implementation

- `/src/lib/app-logger.ts` - Main logging functions
- `/src/lib/contentful.ts` - Primary usage for Contentful operations
- `/src/app/blog/[slug]/page.tsx` - Page rendering events

### Configuration

- `/src/config/isr.ts` - ISR timing configuration
- `/docs/configuration/ISR_STATUS_SUMMARY.md` - Status and troubleshooting

### Documentation

- `/docs/guides/BLOG_POST_MANAGEMENT.md` - Bulk operations usage
- `/docs/configuration/COMPREHENSIVE_COST_ANALYSIS.md` - Performance impact
- `/docs/fixes/BLOG_IMAGE_LOADING_FIX.md` - Error handling examples

## Best Practices

### 1. Meaningful Messages

```typescript
// ✅ Good - specific and actionable
await logAppEvent(
  'Contentful',
  `Blog post fetch failed - slug: ${slug}, status: 404`
)

// ❌ Poor - vague and unhelpful
await logAppEvent('Error', 'Error occurred')
```

### 2. Include Context Data

```typescript
// ✅ Good - includes debugging context
await logAppEvent('Error', 'Contentful API timeout', {
  slug,
  timeout: 5000,
  attempt: 2,
})
```

### 3. Consistent Formatting

```typescript
// ✅ Good - follows established patterns
await logAppEvent('Bulk', `Operation started - type: ${type}, count: ${count}`)
await logAppEvent(
  'Bulk',
  `Operation completed - type: ${type}, processed: ${processed}`
)
```

## Log Output Format

### Current Format

```
[Context] message | timestamp | Data: {...}
```

### Examples

```
[Contentful] Fetching blog posts - limit: 10, skip: 0 | 2025-06-19T10:19:12.891Z
[Page] Individual blog post render started - slug: example-post | 2025-06-19T10:19:13.925Z
[ISR] Blog post fetched successfully via SDK ISR - slug: example-post, title: My Post | 2025-06-19T10:19:14.128Z
[Error] Failed to fetch blog post - slug: invalid | 2025-06-19T10:19:15.234Z | Data: {"error":"Not found"}
[Bulk] Starting bulk deletion of all blog posts | 2025-06-19T10:19:16.345Z
```

## Troubleshooting

### Logs Not Appearing

1. Check environment variables are set
2. Verify not in development without explicit enable
3. Check Netlify function logs (not just deploy logs)
4. Consider log retention limits on free tier

### Performance Impact

- Minimal overhead in production
- Disabled by default in development
- Asynchronous execution doesn't block operations
- Multiple output streams ensure visibility

## Future Enhancements

### Potential Improvements

1. **Structured Logging**: JSON format for better parsing
2. **Log Levels**: INFO, WARN, ERROR categorization
3. **External Services**: Integration with monitoring platforms
4. **Performance Metrics**: Request timing and performance data
5. **Name Update**: Rename to `logApplicationEvent` for clarity

## Migration History

### Complete Migration (June 2025)

The logging system has been completely migrated:

1. **New Primary Function**: `logAppEvent(context, message, data?)` with contextual prefixes
2. **File Renamed**: `isr-logger.ts` → `app-logger.ts` to reflect broader purpose
3. **All Legacy Functions Removed**: Complete migration from `logISREvent` to `logAppEvent`
4. **Contextual Prefixes**:

   - `[ISR]` for ISR events
   - `[Contentful]` for API operations
   - `[Page]` for rendering events
   - `[Error]` for error conditions
   - `[Bulk]` for bulk operations
   - `[API]` for API routes
   - `[System]` for system events

5. **Complete Implementation Update**:
   - All Contentful operations migrated to use contextual logging
   - Page rendering events use `[Page]` prefix
   - Error handling uses `[Error]` prefix
   - Bulk operations use `[Bulk]` prefix
   - All imports updated to use new file path

### Benefits

- **Better Log Organization**: Easy filtering by context
- **Improved Debugging**: Context-specific prefixes for faster issue identification
- **Enhanced Monitoring**: Clear categorization of different application events
- **Comprehensive Coverage**: Single logging system handles all operational events
- **Clean Architecture**: No legacy functions, simplified API

## Recent Updates

### June 2025 - System Renamed and Enhanced

- **File renamed**: `src/lib/isr-logger.ts` → `src/lib/app-logger.ts`
- **Function renamed**: `logISREvent` → `logAppEvent`
- Added contextual prefixes for better log categorization
- Improved documentation and examples
- All legacy code removed

### June 2025 - SEO Canonical Links Fixed

- **URL Construction Improved**: Replaced string concatenation with `joinUrl` utility in SEO metadata generation
- **Canonical Links Fixed**: Individual blog posts now have proper canonical URLs pointing to their specific pages instead of the homepage
- **Better URL Handling**: Improved handling of external image URLs from Contentful CDN
- **JSON-LD Updated**: Structured data now uses consistent URL utilities

## Migration Summary

### Complete Migration (June 2025)

The logging system has been completely migrated:

1. **New Primary Function**: `logAppEvent(context, message, data?)` with contextual prefixes
2. **File Renamed**: `isr-logger.ts` → `app-logger.ts` to reflect broader purpose
3. **All Legacy Functions Removed**: Complete migration from `logISREvent` to `logAppEvent`
4. **Contextual Prefixes**:

   - `[ISR]` for ISR events
   - `[Contentful]` for API operations
   - `[Page]` for rendering events
   - `[Error]` for error conditions
   - `[Bulk]` for bulk operations
   - `[API]` for API routes
   - `[System]` for system events

5. **Complete Implementation Update**:
   - All Contentful operations migrated to use contextual logging
   - Page rendering events use `[Page]` prefix
   - Error handling uses `[Error]` prefix
   - Bulk operations use `[Bulk]` prefix
   - All imports updated to use new file path

### Benefits

- **Better Log Organization**: Easy filtering by context
- **Improved Debugging**: Context-specific prefixes for faster issue identification
- **Enhanced Monitoring**: Clear categorization of different application events
- **Comprehensive Coverage**: Single logging system handles all operational events
- **Clean Architecture**: No legacy functions, simplified API

---

**Note**: The system provides comprehensive operational logging for the entire Next.js application with contextual prefixes for easy identification and debugging.
