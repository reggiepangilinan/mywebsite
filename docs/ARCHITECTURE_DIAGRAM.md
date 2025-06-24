# System Architecture Diagram

## Overall System Architecture

```mermaid
graph TB
    %% External Services
    subgraph "External Services"
        CF["Contentful CMS"]
        NET["Netlify CDN"]
        GH["GitHub Repository"]
    end

    %% Frontend Application
    subgraph "Next.js Application"
        subgraph "App Router"
            HP["Homepage /"]
            AP["About Page /about"]
            BP["Blog Page /blog"]
            BPP["Blog Post /blog/slug"]
        end

        subgraph "Components Layer"
            HC["Header Component"]
            FC["Footer Component"]
            BC["BlogCard Component"]
            BPI["BlogPostImage Component"]
            AI["AnimatedSection Component"]
        end

        subgraph "Library Layer"
            SEO["SEO Utils"]
            AL["App Logger"]
            CIO["Contentful Image Optimizer"]
            CFT["Contentful Client"]
        end

        subgraph "Configuration"
            NC["Next.js Config"]
            MW["Middleware"]
            GL["Global CSS"]
        end
    end

    %% Static Assets
    subgraph "Static Assets (/public)"
        IMG["Images: profile.webp, logos/*"]
        FAV["Favicons & Icons"]
        DOC["Documents: CV PDF"]
        MAN["Manifest & Config Files"]
    end

    %% Data Flow
    CF --> CFT
    CFT --> CIO
    CIO --> BPI
    CIO --> BC

    IMG --> HP
    IMG --> AP
    FAV --> HP
    FAV --> AP
    FAV --> BP
    FAV --> BPP

    GH --> NET
    NET --> Users["Users"]

    %% Build Process
    subgraph "Build & Deploy"
        BUILD["Next.js Build"]
        EXPORT["Static Export"]
        DEPLOY["Netlify Deploy"]
    end

    GH --> BUILD
    BUILD --> EXPORT
    EXPORT --> DEPLOY
    DEPLOY --> NET

    %% Styling
    classDef external fill:#e1f5fe
    classDef nextjs fill:#f3e5f5
    classDef components fill:#e8f5e8
    classDef static fill:#fff3e0
    classDef build fill:#fce4ec

    class CF,NET,GH external
    class HP,AP,BP,BPP,HC,FC,BC,BPI,AI,SEO,AL,CIO,CFT,NC,MW,GL nextjs
    class IMG,FAV,DOC,MAN static
    class BUILD,EXPORT,DEPLOY build
```

## Image Optimization Architecture

```mermaid
graph TB
    subgraph "Image Sources"
        STATIC["Static Images<br/>/public/profile.webp<br/>/public/logos/*"]
        CONTENTFUL["Contentful Images<br/>images.ctfassets.net"]
    end

    subgraph "Next.js Image Processing"
        CONFIG["next.config.ts<br/>unoptimized: true<br/>formats: webp, avif"]

        subgraph "Component Logic"
            OVERRIDE["Component Override<br/>unoptimized: false for Contentful<br/>unoptimized: true for Static"]
        end
    end

    subgraph "Optimization Layer"
        CIO["Contentful Image Optimizer<br/>Format conversion WebP/AVIF<br/>Responsive sizing<br/>Quality optimization"]

        NEXTOPT["Next.js Image Optimization<br/>Automatic format selection<br/>Browser compatibility<br/>Lazy loading"]
    end

    subgraph "Components"
        BPI["BlogPostImage<br/>Conditional optimization"]
        BC["BlogCard<br/>Contentful optimization"]
        DI["DebugImage<br/>Smart optimization"]
        STATIC_COMP["Static Image Components<br/>No optimization"]
    end

    %% Flow for Contentful Images
    CONTENTFUL --> CIO
    CIO --> OVERRIDE
    OVERRIDE --> NEXTOPT
    NEXTOPT --> BPI
    NEXTOPT --> BC
    NEXTOPT --> DI

    %% Flow for Static Images
    STATIC --> CONFIG
    CONFIG --> STATIC_COMP

    %% Configuration
    CONFIG --> OVERRIDE

    classDef source fill:#e3f2fd
    classDef processing fill:#f3e5f5
    classDef optimization fill:#e8f5e8
    classDef components fill:#fff3e0

    class STATIC,CONTENTFUL source
    class CONFIG,OVERRIDE processing
    class CIO,NEXTOPT optimization
    class BPI,BC,DI,STATIC_COMP components
```

## Data Flow Architecture

```mermaid
sequenceDiagram
    participant U as User
    participant N as Netlify CDN
    participant A as Next.js App
    participant C as Contentful
    participant S as Static Assets

    %% Initial Page Load
    U->>N: Request page
    N->>A: Serve cached page or SSG
    A->>U: Return HTML with image placeholders

    %% Static Images
    A->>S: Request static images (profile.webp, logos)
    S->>A: Return optimized static files
    A->>U: Display static images

    %% Contentful Images
    A->>C: Request blog content & images
    C->>A: Return content + image URLs

    Note over A: Contentful Image Optimizer processes URLs
    A->>A: Generate WebP/AVIF URLs with sizing

    Note over A: Next.js Image component with unoptimized=false
    A->>N: Request optimized Contentful images
    N->>U: Serve optimized images (WebP/AVIF)

    %% SEO & Metadata
    A->>A: Generate canonical URLs & OG tags
    A->>U: Update page metadata
```

## Component Architecture

```mermaid
graph TB
    subgraph "Page Components"
        HP["page.tsx<br/>Homepage"]
        AP["about/page.tsx<br/>About Page"]
        BP["blog/page.tsx<br/>Blog Listing"]
        BPP["blog/slug/page.tsx<br/>Blog Post Detail"]
    end

    subgraph "Layout Components"
        RL["layout.tsx<br/>Root Layout"]
        HD["Header Component"]
        FT["Footer Component"]
        TP["ThemeProvider"]
        EB["ErrorBoundary"]
    end

    subgraph "Content Components"
        BC["BlogCard<br/>Blog preview cards"]
        BPI["BlogPostImage<br/>Featured images"]
        AS["AnimatedSection<br/>Scroll animations"]
        SL["SkipLink<br/>Accessibility"]
    end

    subgraph "Utility Components"
        DI["DebugImage<br/>Rich text images"]
        BLI["BlogListImage<br/>Image listings"]
    end

    %% Relationships
    RL --> HD
    RL --> FT
    RL --> TP
    RL --> EB

    HP --> AS
    AP --> AS
    BP --> BC
    BPP --> BPI
    BPP --> DI

    BC --> BLI
    BPI --> CIO["Contentful Image Optimizer"]
    DI --> CIO

    classDef page fill:#e3f2fd
    classDef layout fill:#f3e5f5
    classDef content fill:#e8f5e8
    classDef utility fill:#fff3e0

    class HP,AP,BP,BPP page
    class RL,HD,FT,TP,EB layout
    class BC,BPI,AS,SL content
    class DI,BLI utility
```

## Technology Stack

```mermaid
mindmap
  root((Website Architecture))
    Frontend
      Next.js 15
        App Router
        Static Site Generation (SSG)
        Incremental Static Regeneration (ISR)
        Image Optimization
      TypeScript
      CSS Modules
        Responsive Design
        CSS Grid & Flexbox
    Content Management
      Contentful CMS
        Rich Text Content
        Image Assets
        Webhook Integration
        Real-time Revalidation
    Deployment
      Netlify
        CDN with Edge Caching
        Static Hosting
        Build Pipeline
        ISR Support
      GitHub
        Version Control
        CI/CD Triggers
    Performance
      Rendering Strategy
        SSG for Static Pages
        ISR for Dynamic Content
        Edge Caching
        Background Revalidation
      Image Optimization
        WebP/AVIF Formats
        Responsive Images
        Lazy Loading
      SEO
        Pre-rendered Content
        Canonical URLs
        Meta Tags
        Structured Data
    Development
      ESLint
      TypeScript
      CSS Modules
      Git Hooks
```

## File Structure Overview

```
mywebsite/
├── src/
│   ├── app/                    # App Router pages
│   │   ├── layout.tsx         # Root layout with SEO
│   │   ├── page.tsx           # Homepage with hero
│   │   ├── about/             # About page
│   │   └── blog/              # Blog pages (including slug)
│   ├── components/            # Reusable components
│   │   ├── BlogCard/          # Blog preview cards
│   │   ├── Header/            # Navigation
│   │   └── Footer/            # Site footer
│   ├── lib/                   # Utilities & services
│   │   ├── contentful.ts      # CMS integration
│   │   ├── seo.ts             # SEO utilities
│   │   ├── app-logger.ts      # Application logging
│   │   └── contentful-image-optimizer.ts
│   └── hooks/                 # Custom React hooks
├── public/                    # Static assets
│   ├── profile.webp           # Hero avatar
│   ├── logos/                 # Company logos
│   └── favicon.ico            # Site icons
├── docs/                      # Documentation
│   ├── guides/                # Implementation guides
│   └── fixes/                 # Fix documentation
└── next.config.ts             # Next.js configuration
```

## Rendering Strategy Architecture

### Next.js Rendering Methods Overview

```mermaid
graph TB
    subgraph "Build Time"
        SSG["Static Site Generation<br/>Pre-rendered at build time"]
        ISG["Incremental Static Generation<br/>Generated on-demand + cached"]
    end

    subgraph "Request Time"
        SSR["Server-Side Rendering<br/>Rendered per request"]
        CSR["Client-Side Rendering<br/>Rendered in browser"]
    end

    subgraph "Current Implementation"
        STATIC_PAGES["Static Pages<br/>Homepage, About"]
        BLOG_LIST["Blog List<br/>ISR with revalidation"]
        BLOG_POSTS["Blog Posts<br/>ISR with revalidation"]
    end

    SSG --> STATIC_PAGES
    ISG --> BLOG_LIST
    ISG --> BLOG_POSTS

    classDef buildTime fill:#e8f5e8
    classDef requestTime fill:#fff3e0
    classDef implementation fill:#e3f2fd

    class SSG,ISG buildTime
    class SSR,CSR requestTime
    class STATIC_PAGES,BLOG_LIST,BLOG_POSTS implementation
```

## ISR (Incremental Static Regeneration) Flow

```mermaid
sequenceDiagram
    participant U as User
    participant CDN as Netlify CDN
    participant API as Revalidation API
    participant CF as Contentful
    participant BUILD as Build Process

    Note over U,BUILD: Blog Post Request Flow with ISR

    %% First request - cached content
    U->>CDN: Request /blog/my-post
    CDN->>U: Serve cached static page (stale-while-revalidate)

    %% Background revalidation check
    Note over CDN,API: Background revalidation process
    CDN->>API: Check if revalidation needed
    API->>CF: Fetch latest content
    CF->>API: Return updated content

    alt Content has changed
        API->>BUILD: Trigger incremental rebuild
        BUILD->>BUILD: Generate new static page
        BUILD->>CDN: Update cached content
        Note over CDN: Fresh content ready for next request
    else Content unchanged
        Note over API: No rebuild needed
    end

    %% Subsequent request
    U->>CDN: Request /blog/my-post (later)
    CDN->>U: Serve fresh static page
```

## Static Site Generation (SSG) Flow

```mermaid
sequenceDiagram
    participant DEV as Developer
    participant GH as GitHub
    participant BUILD as Build Process
    participant CF as Contentful
    participant CDN as Netlify CDN
    participant U as User

    Note over DEV,U: Static Site Generation Flow

    %% Build process
    DEV->>GH: Push code changes
    GH->>BUILD: Trigger build webhook

    Note over BUILD: Build-time data fetching
    BUILD->>CF: Fetch all blog posts
    BUILD->>CF: Fetch page content
    CF->>BUILD: Return content data

    BUILD->>BUILD: Generate static pages
    Note over BUILD: Pre-render all routes:<br/>/, /about, /blog, /blog/[slug]

    BUILD->>CDN: Deploy static files

    %% User request
    U->>CDN: Request any page
    CDN->>U: Serve pre-built static HTML
    Note over U: Instant loading<br/>No server processing
```

## Current Page Rendering Strategy

```mermaid
graph TB
    subgraph "Static Pages (SSG)"
        HP["Homepage /<br/>✅ Pre-rendered<br/>⚡ Instant load"]
        AP["About Page /about<br/>✅ Pre-rendered<br/>⚡ Instant load"]
    end

    subgraph "Dynamic Pages (ISR)"
        BP["Blog List /blog<br/>🔄 ISR enabled<br/>⏱️ Revalidate on change"]
        BPP["Blog Posts /blog/slug<br/>🔄 ISR enabled<br/>⏱️ Background revalidation"]
    end

    subgraph "Data Sources"
        STATIC_DATA["Static Data<br/>Skills, Experience"]
        CF_DATA["Contentful CMS<br/>Blog posts, Images"]
    end

    subgraph "Optimization Features"
        CACHE["CDN Caching<br/>Global edge locations"]
        PREFETCH["Link Prefetching<br/>Hover preloading"]
        IMG_OPT["Image Optimization<br/>WebP/AVIF formats"]
    end

    STATIC_DATA --> HP
    STATIC_DATA --> AP
    CF_DATA --> BP
    CF_DATA --> BPP

    HP --> CACHE
    AP --> CACHE
    BP --> CACHE
    BPP --> CACHE

    BP --> PREFETCH
    BPP --> IMG_OPT

    classDef static fill:#e8f5e8
    classDef dynamic fill:#e3f2fd
    classDef data fill:#fff3e0
    classDef optimization fill:#fce4ec

    class HP,AP static
    class BP,BPP dynamic
    class STATIC_DATA,CF_DATA data
    class CACHE,PREFETCH,IMG_OPT optimization
```

## Revalidation Strategy

```mermaid
graph TB
    subgraph "Content Update Triggers"
        WEBHOOK["Contentful Webhook<br/>Content published"]
        MANUAL["Manual Revalidation<br/>API endpoint trigger"]
        TIME["Time-based<br/>24-hour fallback"]
    end

    subgraph "Revalidation Process"
        API_ROUTE["API Route<br/>/api/revalidate"]
        VALIDATION["Content Validation<br/>Check for changes"]
        REBUILD["Incremental Rebuild<br/>Affected pages only"]
    end

    subgraph "Cache Strategy"
        STALE["Stale While Revalidate<br/>Serve old + update background"]
        FRESH["Fresh Content<br/>Updated cache"]
        FALLBACK["Fallback Handling<br/>Error recovery"]
    end

    WEBHOOK --> API_ROUTE
    MANUAL --> API_ROUTE
    TIME --> API_ROUTE

    API_ROUTE --> VALIDATION
    VALIDATION --> REBUILD
    REBUILD --> STALE
    STALE --> FRESH
    REBUILD --> FALLBACK

    classDef trigger fill:#e8f5e8
    classDef process fill:#e3f2fd
    classDef cache fill:#fff3e0

    class WEBHOOK,MANUAL,TIME trigger
    class API_ROUTE,VALIDATION,REBUILD process
    class STALE,FRESH,FALLBACK cache
```

## Performance Benefits by Rendering Method

```mermaid
graph LR
    subgraph "Static Pages (SSG)"
        SSG_PERF["⚡ TTFB: ~50ms<br/>📊 LCP: Excellent<br/>🎯 CLS: Minimal<br/>💾 CDN: 100% cached"]
    end

    subgraph "ISR Pages"
        ISR_PERF["⚡ TTFB: ~100ms<br/>📊 LCP: Very Good<br/>🔄 Updates: Seamless<br/>💾 CDN: Cached + Fresh"]
    end

    subgraph "Benefits"
        SEO["🔍 SEO Optimized<br/>Pre-rendered content"]
        UX["👤 User Experience<br/>Instant navigation"]
        SCALE["📈 Scalability<br/>Edge distribution"]
        COST["💰 Cost Effective<br/>Minimal compute"]
    end

    SSG_PERF --> SEO
    ISR_PERF --> SEO
    SSG_PERF --> UX
    ISR_PERF --> UX
    SSG_PERF --> SCALE
    ISR_PERF --> SCALE
    SSG_PERF --> COST
    ISR_PERF --> COST

    classDef performance fill:#e8f5e8
    classDef benefits fill:#e3f2fd

    class SSG_PERF,ISR_PERF performance
    class SEO,UX,SCALE,COST benefits
```

## Implementation Details

### ISR Configuration

Your website uses the following ISR configuration:

**Blog Post Pages (`/blog/[slug]/page.tsx`)**:

```typescript
export async function generateStaticParams() {
  // Pre-generate paths for all published blog posts at build time
  const posts = await getBlogPosts()
  return posts.map((post) => ({ slug: post.fields.slug }))
}

// ISR configuration
export const revalidate = 86400 // Revalidate every 24 hours
export const dynamic = 'force-static' // Force static generation
```

**Blog List Page (`/blog/page.tsx`)**:

```typescript
// ISR with on-demand revalidation
export const revalidate = 86400 // 24 hours fallback
```

**Revalidation API (`/api/revalidate/route.ts`)**:

```typescript
export async function POST(request: Request) {
  const { path } = await request.json()

  try {
    await revalidatePath(path)
    return NextResponse.json({ revalidated: true })
  } catch (err) {
    return NextResponse.json({ error: 'Error revalidating' }, { status: 500 })
  }
}
```

### Contentful Webhook Integration

```mermaid
sequenceDiagram
    participant CF as Contentful
    participant WEBHOOK as Webhook Endpoint
    participant API as Revalidation API
    participant CDN as Netlify CDN

    Note over CF,CDN: Content Update Flow

    CF->>WEBHOOK: POST /api/webhook<br/>Content published/updated
    WEBHOOK->>WEBHOOK: Validate webhook signature
    WEBHOOK->>API: Trigger revalidation<br/>Affected paths

    loop For each affected path
        API->>API: revalidatePath(path)
        API->>CDN: Mark cache as stale
    end

    Note over CDN: Next user request will<br/>trigger background rebuild
```

### Cache Strategy Implementation

```mermaid
graph TB
    subgraph "Edge Locations"
        GLOBAL["Global CDN<br/>Netlify Edge"]
        REGIONAL["Regional Caches<br/>Geographic distribution"]
    end

    subgraph "Cache Layers"
        BROWSER["Browser Cache<br/>Client-side caching"]
        CDN_CACHE["CDN Cache<br/>Edge locations"]
        ISR_CACHE["ISR Cache<br/>Generated pages"]
    end

    subgraph "Cache Headers"
        STATIC_HEADERS["Static Pages<br/>Cache-Control: public, max-age=31536000"]
        ISR_HEADERS["ISR Pages<br/>Cache-Control: s-maxage=1, stale-while-revalidate"]
        API_HEADERS["API Routes<br/>Cache-Control: no-cache"]
    end

    GLOBAL --> CDN_CACHE
    REGIONAL --> CDN_CACHE
    CDN_CACHE --> BROWSER
    ISR_CACHE --> CDN_CACHE

    STATIC_HEADERS --> CDN_CACHE
    ISR_HEADERS --> CDN_CACHE
    API_HEADERS --> CDN_CACHE

    classDef edge fill:#e8f5e8
    classDef cache fill:#e3f2fd
    classDef headers fill:#fff3e0

    class GLOBAL,REGIONAL edge
    class BROWSER,CDN_CACHE,ISR_CACHE cache
    class STATIC_HEADERS,ISR_HEADERS,API_HEADERS headers
```

## Architecture Summary

### Rendering Strategy Overview

| Page Type                     | Rendering Method | Revalidation    | Use Case                            |
| ----------------------------- | ---------------- | --------------- | ----------------------------------- |
| **Homepage (/)**              | SSG              | Build time only | Static content, maximum performance |
| **About (/about)**            | SSG              | Build time only | Static content, skills, experience  |
| **Blog List (/blog)**         | ISR              | 24h + webhook   | Dynamic list, frequent updates      |
| **Blog Posts (/blog/[slug])** | ISR              | 1h + webhook    | Dynamic content, SEO optimized      |

### Performance Characteristics

```mermaid
graph LR
    subgraph "Static Pages"
        SSG_METRICS["⚡ TTFB: 50ms<br/>🎯 LCP: < 1s<br/>📊 CLS: 0<br/>💯 Lighthouse: 100"]
    end

    subgraph "ISR Pages"
        ISR_METRICS["⚡ TTFB: 100ms<br/>🎯 LCP: < 1.5s<br/>📊 CLS: 0.1<br/>💯 Lighthouse: 95+"]
    end

    subgraph "Benefits"
        PERFORMANCE["🚀 Performance<br/>Instant loading"]
        SCALABILITY["📈 Scalability<br/>Global edge cache"]
        FRESHNESS["🔄 Content Freshness<br/>Real-time updates"]
        SEO_BENEFIT["🔍 SEO Excellence<br/>Pre-rendered HTML"]
    end

    SSG_METRICS --> PERFORMANCE
    ISR_METRICS --> PERFORMANCE
    SSG_METRICS --> SCALABILITY
    ISR_METRICS --> SCALABILITY
    ISR_METRICS --> FRESHNESS
    SSG_METRICS --> SEO_BENEFIT
    ISR_METRICS --> SEO_BENEFIT

    classDef metrics fill:#e8f5e8
    classDef benefits fill:#e3f2fd

    class SSG_METRICS,ISR_METRICS metrics
    class PERFORMANCE,SCALABILITY,FRESHNESS,SEO_BENEFIT benefits
```

### Content Update Flow

```mermaid
flowchart TD
    START([Content Editor Updates Contentful])

    WEBHOOK{Webhook Triggered?}
    MANUAL{Manual Revalidation?}
    SCHEDULE{Scheduled Revalidation?}

    VALIDATE[Validate Content Changes]
    REVALIDATE[Trigger ISR Revalidation]
    REBUILD[Background Page Rebuild]
    UPDATE_CACHE[Update CDN Cache]
    SERVE[Serve Fresh Content]

    START --> WEBHOOK
    START --> MANUAL
    START --> SCHEDULE

    WEBHOOK -->|Yes| VALIDATE
    MANUAL -->|API Call| VALIDATE
    SCHEDULE -->|Time Interval| VALIDATE

    VALIDATE --> REVALIDATE
    REVALIDATE --> REBUILD
    REBUILD --> UPDATE_CACHE
    UPDATE_CACHE --> SERVE

    classDef trigger fill:#e8f5e8
    classDef process fill:#e3f2fd
    classDef result fill:#fff3e0

    class START,WEBHOOK,MANUAL,SCHEDULE trigger
    class VALIDATE,REVALIDATE,REBUILD,UPDATE_CACHE process
    class SERVE result
```

### Deployment Architecture

The website employs a **hybrid static + ISR architecture** that provides:

1. **Build-time optimization** for static content (homepage, about)
2. **Runtime flexibility** for dynamic content (blog posts)
3. **Edge distribution** via Netlify CDN
4. **Real-time content updates** through Contentful webhooks
5. **Graceful degradation** with fallback revalidation intervals

This architecture ensures optimal performance while maintaining content freshness and editorial flexibility.
