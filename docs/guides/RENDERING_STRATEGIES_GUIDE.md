# Page Rendering Strategies Guide

## Overview

This guide documents the different rendering strategies used across the website, their advantages, and when to use each approach. Understanding these strategies is crucial for optimizing performance, cost, and user experience.

## Rendering Strategy Types

### 1. **Static Site Generation (SSG)** - `○`

**Symbol in Build Output**: `○ (Static)`

**How it Works**:

- Pages are pre-rendered at build time
- HTML is generated during the build process
- Same HTML served to all users
- No server-side computation at request time

**Implementation**:

```typescript
// No special exports needed - default behavior
export default function StaticPage() {
  return <div>Static content</div>
}
```

**Current Usage**:

- `/` (Homepage)
- `/about` (About page)
- `/_not-found` (404 page)
- `/debug` (Debug utilities)
- `/robots.txt` (SEO)
- `/sitemap.xml` (SEO)

**Advantages**:

- ✅ **Fastest possible loading** - Pre-generated HTML
- ✅ **Zero server cost** at runtime
- ✅ **Perfect for CDN caching** - Long cache times
- ✅ **SEO optimized** - Complete HTML available immediately
- ✅ **High availability** - No server dependencies
- ✅ **Security** - No server-side attack surface

**Best For**:

- Marketing pages (homepage, about)
- Documentation pages
- Landing pages
- Any content that rarely changes

---

### 2. **Incremental Static Regeneration (ISR)** - `●`

**Symbol in Build Output**: `● (SSG) + Revalidate time`

**How it Works**:

- Pages pre-generated at build time (like SSG)
- Automatic revalidation in background after specified time
- First user after expiry triggers regeneration
- Stale content served while regenerating (stale-while-revalidate)

**Implementation**:

```typescript
export const revalidate = 86400 // 24 hours

export default function ISRPage() {
  return <div>Content that updates periodically</div>
}
```

**Current Usage**:

- `/blog/page/[page]` (Blog pagination) - Static generation with params
- `/sitemap-isr.xml` (Dynamic sitemap) - 6 hours revalidation
- `/dev-info` (Development dashboard) - 30 minutes revalidation

**Advantages**:

- ✅ **Fast loading** - Pre-generated HTML
- ✅ **Fresh content** - Automatic updates
- ✅ **Cost efficient** - Fewer API calls than dynamic
- ✅ **Graceful degradation** - Stale content if regeneration fails
- ✅ **SEO benefits** - Complete HTML available
- ✅ **Background updates** - No user waits for regeneration

**Best For**:

- Content that changes periodically
- Data-driven pages that need freshness
- High-traffic pages that benefit from caching
- Content where some staleness is acceptable

---

### 3. **On-Demand ISR** - `ƒ` (without generateStaticParams)

**Symbol in Build Output**: `ƒ (Dynamic)` but with revalidate export

**How it Works**:

- Pages generated on first request (not at build time)
- Cached after first generation
- Automatic revalidation like regular ISR
- No pre-generation of any routes

**Implementation**:

```typescript
export const revalidate = 86400 // 24 hours
export const dynamicParams = true // Allow dynamic generation

// No generateStaticParams function

export default function OnDemandISRPage() {
  return <div>Generated on first request, then cached</div>
}
```

**Current Usage**:

- `/blog/[slug]` (Individual blog posts) - 24 hours revalidation

**Advantages**:

- ✅ **Faster builds** - No pre-generation
- ✅ **Unlimited scalability** - Handle infinite routes
- ✅ **Cost efficient** - Generate only accessed pages
- ✅ **Fresh content** - Automatic revalidation
- ✅ **SEO benefits** - Server-rendered HTML
- ✅ **Resource efficient** - No wasted pre-generation

**Best For**:

- Large content collections (blogs, products)
- User-generated content
- Content with unknown access patterns
- When build time is a concern

---

### 4. **Server-Side Rendering (SSR)** - `ƒ`

**Symbol in Build Output**: `ƒ (Dynamic)`

**How it Works**:

- Pages rendered on every request
- Fresh data fetched on each request
- HTML generated server-side for each user
- No caching (unless manually implemented)

**Implementation**:

```typescript
export const dynamic = 'force-dynamic' // Force SSR

export default function SSRPage() {
  return <div>Rendered fresh on every request</div>
}
```

**Current Usage**:

- `/blog` (Blog list) - Shows new posts immediately
- `/api/*` (API routes) - Dynamic responses

**Advantages**:

- ✅ **Always fresh** - Latest data on every request
- ✅ **Real-time updates** - No cache delay
- ✅ **Personalization** - User-specific content
- ✅ **SEO benefits** - Server-rendered HTML
- ✅ **Immediate updates** - No revalidation wait

**Best For**:

- Frequently changing content
- User dashboards
- Real-time data
- Personalized content
- When freshness is critical

---

### 5. **Client-Side Rendering (CSR)** - `ƒ` (with client-side data fetching)

**Symbol in Build Output**: `ƒ (Dynamic)` but JavaScript-heavy

**How it Works**:

- Initial HTML shell served
- JavaScript loads and renders content
- Data fetched in browser
- Interactive after hydration

**Implementation**:

```typescript
'use client'

export default function CSRPage() {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetchData().then(setData)
  }, [])

  return <div>{data ? 'Loaded' : 'Loading...'}</div>
}
```

**Current Usage**:

- Components with interactive features
- Development tools and dashboards
- Non-SEO critical pages

**Advantages**:

- ✅ **Highly interactive** - Rich user interfaces
- ✅ **Real-time updates** - WebSocket connections
- ✅ **Reduced server load** - Client does the work
- ✅ **App-like experience** - Single-page app feel
- ✅ **Offline capabilities** - Service workers

**Best For**:

- Interactive applications
- Real-time features
- Internal tools
- When SEO is not important

---

## Strategy Selection Matrix

| Content Type    | Change Frequency | SEO Importance | Traffic Volume | Recommended Strategy |
| --------------- | ---------------- | -------------- | -------------- | -------------------- |
| Landing Pages   | Rarely           | Critical       | High           | **SSG**              |
| Blog Posts      | Rarely           | Critical       | Medium         | **On-Demand ISR**    |
| Blog List       | Frequently       | Critical       | Medium         | **SSR**              |
| User Dashboard  | Real-time        | Low            | Low            | **CSR**              |
| Product Catalog | Daily            | Critical       | High           | **ISR**              |
| Search Results  | Real-time        | Medium         | High           | **SSR**              |
| Documentation   | Weekly           | Critical       | Medium         | **ISR**              |
| API Endpoints   | Real-time        | N/A            | Varies         | **SSR**              |

## Performance Comparison

| Strategy          | Time to First Byte | SEO Score | Server Cost | Build Time | Cache Efficiency |
| ----------------- | ------------------ | --------- | ----------- | ---------- | ---------------- |
| **SSG**           | Fastest            | Excellent | None        | Medium     | Excellent        |
| **ISR**           | Fast               | Excellent | Low         | Medium     | Good             |
| **On-Demand ISR** | Fast\*             | Excellent | Very Low    | Fast       | Good             |
| **SSR**           | Medium             | Excellent | Medium-High | Fast       | Poor             |
| **CSR**           | Fast†              | Poor      | Low         | Fast       | Good             |

\*After first generation  
†Initial shell only

## Cost Analysis by Strategy

### Monthly API Calls (for 30 visits/day)

| Strategy          | API Calls/Month | Contentful Cost | Server Cost | Total Cost  |
| ----------------- | --------------- | --------------- | ----------- | ----------- |
| **SSG**           | 1 (build only)  | $0.0003         | $0          | **$0.0003** |
| **ISR (1h)**      | ~720            | $0.22           | $0.10       | **$0.32**   |
| **ISR (24h)**     | ~30             | $0.009          | $0.05       | **$0.059**  |
| **On-Demand ISR** | ~30             | $0.009          | $0.05       | **$0.059**  |
| **SSR**           | ~900            | $0.75           | $0.20       | **$0.95**   |
| **CSR**           | ~900            | $0.75           | $0.05       | **$0.80**   |

## Implementation Guidelines

### When to Use Each Strategy

#### Choose **SSG** for:

- ✅ Content that changes less than weekly
- ✅ Marketing and landing pages
- ✅ Documentation that's version-controlled
- ✅ Maximum performance requirements

#### Choose **ISR** for:

- ✅ Content that changes daily/weekly
- ✅ Data-driven pages
- ✅ High-traffic content sites
- ✅ When some staleness is acceptable

#### Choose **On-Demand ISR** for:

- ✅ Large content collections
- ✅ Blog posts and articles
- ✅ When build time matters
- ✅ Unknown access patterns

#### Choose **SSR** for:

- ✅ Frequently changing content
- ✅ Real-time requirements
- ✅ Personalized content
- ✅ When freshness is critical

#### Choose **CSR** for:

- ✅ Interactive applications
- ✅ Internal tools
- ✅ When SEO doesn't matter
- ✅ Real-time features

### Migration Strategies

#### From SSG to ISR:

```typescript
// Before
export default function Page() { ... }

// After
export const revalidate = 3600
export default function Page() { ... }
```

#### From ISR to On-Demand ISR:

```typescript
// Before
export const revalidate = 3600
export async function generateStaticParams() { ... }

// After
export const revalidate = 3600
export const dynamicParams = true
// Remove generateStaticParams
```

#### From ISR to SSR:

```typescript
// Before
export const revalidate = 3600

// After
export const dynamic = 'force-dynamic'
```

## Monitoring and Optimization

### Build Output Analysis

Check the build output to verify your strategy:

```bash
npm run build

# Look for symbols:
# ○ (Static) - SSG
# ● (SSG) - ISR with generateStaticParams
# ƒ (Dynamic) - SSR or On-Demand ISR
```

### Performance Monitoring

1. **Core Web Vitals**

   - Monitor LCP, FID, CLS for each strategy
   - Use tools like PageSpeed Insights

2. **Server Metrics**

   - Track function invocations
   - Monitor API call patterns
   - Watch for cost anomalies

3. **Cache Hit Rates**
   - Monitor CDN cache effectiveness
   - Track ISR regeneration frequency

### Cost Optimization Tips

1. **Increase ISR intervals** for stable content
2. **Use On-Demand ISR** instead of pre-generation
3. **Minimize API calls** with efficient data fetching
4. **Implement proper error handling** to avoid regeneration storms
5. **Use edge caching** where possible

## Current Website Strategy

### Optimized Hybrid Approach

Our website uses a **cost-optimized hybrid strategy**:

- **Static (SSG)**: Marketing pages (`/`, `/about`)
- **Dynamic (SSR)**: Blog list (`/blog`) for immediate new post visibility
- **On-Demand ISR**: Blog posts (`/blog/[slug]`) with 24h revalidation
- **Regular ISR**: Paginated blog lists with generateStaticParams
- **Client-Side**: Interactive components and dev tools

### Results

- **Total monthly cost**: $0.76
- **Excellent performance**: Fast loading across all pages
- **SEO optimized**: Server-rendered HTML for all public content
- **Scalable**: Can handle unlimited blog posts

---

## Related Documentation

- [ISR Configuration Guide](../configuration/ISR_CONFIGURATION_GUIDE.md)
- [Cost Optimization Summary](../configuration/COST_OPTIMIZATION_SUMMARY.md)
- [Blog Setup Guide](../setup/BLOG_SETUP.md)
- [Force Revalidation API](./FORCE_REVALIDATION_API.md)

---

_Last updated: June 24, 2025_
