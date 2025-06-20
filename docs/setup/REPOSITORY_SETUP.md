# Repository Setup Guide

This guide provides comprehensive instructions for setting up the development environment for Reggie Pangilinan's personal website project.

## 🎯 Overview

This is a Next.js 15 personal website with TypeScript, CSS Modules, Contentful CMS integration, and comprehensive development tooling including automated guards, linting, and documentation validation.

## 📋 Prerequisites

### Required Software

- **Node.js 18+** ([Download here](https://nodejs.org/))
- **npm** (comes with Node.js) or **yarn**
- **Git** ([Download here](https://git-scm.com/))

### Recommended IDE Setup

- **VS Code** with extensions:
  - ESLint
  - Prettier - Code formatter
  - TypeScript Importer
  - CSS Modules
  - Next.js snippets
  - Contentful

## 🚀 Initial Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd mywebsite

# Install dependencies
npm install

# Verify installation
npm run lint
npm run type-check
```

### 2. Environment Configuration

Create `.env.local` in the project root:

```bash
# Contentful CMS Configuration
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_access_token

# Optional: Control professional content visibility
OPEN_TO_WORK_MODE=false

# Optional: Enable ISR logging (useful for debugging)
ENABLE_ISR_LOGS=true

# Optional: Enable detailed application logging
ENABLE_APP_LOGS=true
```

### 3. Contentful Setup (Required for Blog)

1. **Create Contentful Account**: Sign up at [contentful.com](https://www.contentful.com/)

2. **Create Space**: Create a new space for your blog content

3. **Content Model**: Create a "Blog Post" content type with fields:

   - `title` (Short text)
   - `slug` (Short text, unique)
   - `content` (Rich text)
   - `publishedDate` (Date & time)
   - `excerpt` (Long text, optional)
   - `tags` (Short text, list, optional)

4. **API Keys**: Get your Space ID and Content Delivery API access token from Settings > API keys

5. **Test Content**: Create a few test blog posts to verify the integration

### 4. Development Server

```bash
# Start development server
npm run dev

# Open in browser
open http://localhost:3000
```

## 🛠️ Development Workflow

### Available Scripts

```bash
# Development
npm run dev              # Start development server (port 3000)
npm run build           # Build for production
npm run start           # Start production server

# Quality Assurance
npm run lint            # Run ESLint
npm run type-check      # TypeScript type checking
npm run guards          # Run complete guard validation

# Guard System (Individual)
npm run validate:guards    # Validate guard pattern mappings
npm run sync:guards       # Sync guard configuration
npm run check:site-config # Check for hardcoded values
npm run check:docs        # Validate documentation cross-references
```

### Pre-commit Hooks

The project includes automated pre-commit hooks that will:

- Run ESLint and fix auto-fixable issues
- Format code with Prettier
- Validate no hardcoded values are committed
- Ensure TypeScript compiles without errors

### Guard System

This project has a comprehensive guard system to prevent hardcoded values:

- **Real-time ESLint rules**: Immediate feedback in your editor
- **Pre-commit validation**: Prevents bad code from being committed
- **Documentation validation**: Ensures all internal links work
- **Configuration sync**: Auto-updates guard patterns from SITE_CONFIG

All site-wide values must use `SITE_CONFIG` from `src/config/site.ts`.

## 📁 Project Architecture

### Folder Structure

```
src/
├── app/                    # Next.js App Router
│   ├── about/             # About page (SSG)
│   ├── blog/              # Blog pages (ISR)
│   ├── dev-info/          # Development dashboard
│   ├── api/               # API routes
│   └── robots.txt/        # Dynamic SEO routes
├── components/            # React components
├── config/               # Centralized configuration
├── contexts/             # React contexts
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and services
└── types/                # TypeScript type definitions

docs/                     # Project documentation
├── setup/               # Setup guides
├── guides/              # Feature guides
├── configuration/       # Config documentation
├── deployment/          # Deployment docs
└── guards/              # Guard system docs

scripts/                 # Build and utility scripts
public/                  # Static assets
```

### Component Conventions

Each component follows this structure:

```
src/components/ComponentName/
├── ComponentName.tsx          # Main component
├── ComponentName.module.css   # CSS modules
└── index.tsx                  # Re-export
```

This enables clean imports:

```typescript
import ComponentName from '@/components/ComponentName'
```

## 🎨 Styling Guidelines

- **CSS Modules**: All component styles use CSS modules
- **No Global CSS**: Except for `globals.css` for base styles
- **Mobile-First**: Responsive design using CSS Grid and Flexbox
- **No External CSS Libraries**: Pure CSS approach for maintainability

## 🔧 Configuration Management

### SITE_CONFIG

All site-wide configuration is centralized in `src/config/site.ts`:

```typescript
export const SITE_CONFIG = {
  name: 'Your Name',
  url: 'https://yoursite.com',
  contact: {
    email: 'your@email.com',
  },
  social: {
    github: 'https://github.com/yourusername',
    linkedin: 'https://linkedin.com/in/yourusername',
  },
  // ... more configuration
}
```

**Important**: Never use hardcoded values in components. Always reference `SITE_CONFIG`.

### ISR Configuration

ISR settings are in `src/config/isr.ts`:

- Blog list: 1 hour revalidation
- Blog posts: 1 hour revalidation
- Configurable per route

## 🧪 Testing and Quality

### Development Dashboard

Access `/dev-info` in development for:

- API endpoint testing
- ISR status monitoring
- Configuration verification
- Real-time debugging tools

### Linting Rules

- ESLint with Next.js and TypeScript rules
- Custom rules for preventing hardcoded values
- Prettier for code formatting
- Automatic fixing on save (with proper VS Code setup)

### Type Safety

- Full TypeScript coverage
- Strict mode enabled
- Type definitions for all external APIs
- No `any` types allowed

## 🚀 Deployment

### Netlify (Recommended)

1. **Connect Repository**: Link your GitHub repo to Netlify
2. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `out`
   - Node version: `18`
3. **Environment Variables**: Add your `.env.local` variables to Netlify
4. **Deploy**: Automatic deployments on push to main

### Manual Deployment

```bash
# Build for production
npm run build

# Deploy the 'out' folder to your hosting provider
```

## 🐛 Troubleshooting

### Common Issues

**1. Module Resolution Errors**

```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

**2. TypeScript Errors**

```bash
# Check for type errors
npm run type-check

# Restart TypeScript server in VS Code
Cmd+Shift+P → "TypeScript: Restart TS Server"
```

**3. ESLint/Prettier Conflicts**

```bash
# Run linting
npm run lint

# Check VS Code settings for conflicting formatters
```

**4. Contentful Connection Issues**

- Verify environment variables are correctly set
- Check Contentful space ID and access token
- Ensure content model matches expected structure

**5. Guard System Failures**

```bash
# Run individual guard checks
npm run validate:guards
npm run check:site-config
npm run check:docs

# Sync guard configuration
npm run sync:guards
```

### Getting Help

1. Check existing documentation in `/docs`
2. Review the development dashboard at `/dev-info`
3. Ensure all guard validations pass with `npm run guards`
4. Check the project's issue tracker for known problems

## 📚 Next Steps

After setup, explore:

1. **[Blog Setup](./BLOG_SETUP.md)** - Configure Contentful integration
2. **[Component Convention](../guides/COMPONENT_CONVENTION.md)** - Learn component structure
3. **[Guard System](../guards/README.md)** - Understand configuration validation
4. **[Deployment Guide](../deployment/NETLIFY_DEPLOY.md)** - Deploy to production

## 🤝 Contributing

1. Create a feature branch from `main`
2. Make your changes following the established conventions
3. Ensure all guard validations pass: `npm run guards`
4. Test thoroughly in development
5. Submit a pull request with clear description

---

**Happy coding!** 🚀

For questions or issues, refer to the comprehensive documentation in the `/docs` folder or check the development dashboard at `/dev-info`.
