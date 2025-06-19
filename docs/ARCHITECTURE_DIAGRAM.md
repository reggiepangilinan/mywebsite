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
        Static Site Generation
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
    Deployment
      Netlify
        CDN
        Static Hosting
        Build Pipeline
      GitHub
        Version Control
        CI/CD Triggers
    Performance
      Image Optimization
        WebP/AVIF Formats
        Responsive Images
        Lazy Loading
      SEO
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
