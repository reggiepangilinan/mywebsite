# Application Logging System

## Overview

The `logISREvent` function provides comprehensive operational logging for the Next.js application, handling much more than just ISR (Incremental Static Regeneration) events. Despite its historical name, it serves as the primary logging mechanism for all application operations.

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

### Core Function: `logISREvent(message, data?)`

**Location**: `/src/lib/isr-logger.ts`

```typescript
// Application logging system for Netlify free tier
// Handles ISR events, Contentful operations, error tracking, and operational logging
export async function logISREvent(message: string, data?: unknown) {
  // Environment-aware logging
  // Production: console.error + console.log for maximum visibility
  // Development: console.log (when explicitly enabled)
}
```

### Usage Patterns

#### Contentful Operations

```typescript
// API call logging
await logISREvent(`Fetching blog posts - limit: ${limit}, skip: ${skip}`)

// Error handling
await logISREvent('Error fetching blog posts', { error, limit, skip })

// Success confirmation
await logISREvent(`Successfully fetched ${posts.items.length} blog posts`)
```

#### Page Rendering

```typescript
// Render start
await logISREvent(`Individual blog post render started - slug: ${slug}`)

// 404 handling
await logISREvent(`Blog post not found, returning 404 - slug: ${slug}`)

// Success
await logISREvent(`Blog post rendered successfully - slug: ${slug}`)
```

#### Bulk Operations

```typescript
// Operation start
await logISREvent('Starting bulk deletion of all blog posts')

// Progress tracking
await logISREvent(`Found ${entries.items.length} blog posts to delete`)

// Completion
await logISREvent(`Bulk deletion completed - ${deleted} items processed`)
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

- `/src/lib/isr-logger.ts` - Main logging functions
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
await logISREvent(`Blog post fetch failed - slug: ${slug}, status: 404`)

// ❌ Poor - vague and unhelpful
await logISREvent('Error occurred')
```

### 2. Include Context Data

```typescript
// ✅ Good - includes debugging context
await logISREvent('Contentful API timeout', {
  slug,
  timeout: 5000,
  attempt: 2,
})
```

### 3. Consistent Formatting

```typescript
// ✅ Good - follows established patterns
await logISREvent(`Operation started - type: ${type}, count: ${count}`)
await logISREvent(
  `Operation completed - type: ${type}, processed: ${processed}`
)
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

### Migration Considerations

If renaming `logISREvent`:

1. Update all import statements
2. Update documentation references
3. Maintain backward compatibility during transition
4. Update environment variable names for consistency

---

**Note**: While historically named for ISR logging, this system now serves as the primary operational logging mechanism for the entire application. The name reflects its origins but not its current comprehensive scope.
