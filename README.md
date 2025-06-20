# Personal Website

A modern personal portfolio website built with Next.js 15, TypeScript, and CSS Modules.

## ✨ Features

- 🚀 **Next.js 15**: Latest React framework with App Router
- 📱 **Responsive Design**: Mobile-first, modern layout
- 🎨 **CSS Modules**: Scoped styling without conflicts
- 📝 **Dynamic Blog**: Contentful CMS integration with ISR
- ⚡ **ISR**: Incremental Static Regeneration for optimal performance
- 🔍 **Dynamic SEO**: Auto-generated robots.txt and sitemap.xml
- 💼 **Open to Work Mode**: Toggle professional content visibility
- 🛠️ **Developer Tools**: Built-in API testing dashboard at `/dev-info`
- 🔧 **TypeScript**: Type-safe development

## 🏗️ Architecture

- **Static Pages**: Home, About (fast SSG)
- **Dynamic Blog**: Contentful-powered with ISR revalidation
- **Centralized Configuration**: ISR and SEO settings in `/src/config/`
- **Dynamic SEO**: Cost-effective robots.txt and sitemap.xml generation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd mywebsite

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Setup
Create `.env.local` with your Contentful credentials:
```bash
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_access_token

# Optional: Control job search content visibility
OPEN_TO_WORK_MODE=false
```

### 💼 Open to Work Mode
Control the visibility of professional content on the About page:
- Set `OPEN_TO_WORK_MODE=true` to show Open to Work announcement, Key Skills, Tech Stack, Experience, and Resume download
- Set to `false` or omit to hide job search related content
- **Rebuild required** - changes require rebuild and redeploy as the About page is statically generated
- See [Open to Work Mode Guide](./docs/guides/OPEN_TO_WORK_MODE.md) for details

## 📚 Documentation

For detailed setup, configuration, and deployment instructions, see the [docs folder](./docs/):

- **[Setup Guides](./docs/setup/)** - Blog, favicon, and initial configuration
- **[Feature Guides](./docs/guides/)** - SEO, social sharing, and advanced features  
- **[Configuration](./docs/configuration/)** - ISR, performance, and cost optimization
- **[Deployment](./docs/deployment/)** - Netlify setup and logging

## 🛠️ Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── about/             # About page
│   ├── blog/              # Blog pages (ISR enabled)
│   ├── dev-info/          # Development dashboard
│   ├── api/               # API routes
│   └── robots.txt/        # Dynamic SEO routes
├── components/            # React components (see conventions below)
├── config/               # Configuration files
├── lib/                  # Utilities and services
└── hooks/                # Custom React hooks
docs/                     # All documentation
public/                   # Static assets
```

## 📋 Development Conventions

### Component Structure
Each component has its own folder containing:
- `ComponentName.tsx` - Main component file
- `ComponentName.module.css` - CSS modules for styling
- `index.tsx` - Re-export for clean imports

Example structure:
```
src/components/
├── Header/
│   ├── Header.tsx
│   ├── Header.module.css
│   └── index.tsx
├── Footer/
│   ├── Footer.tsx
│   ├── Footer.module.css
│   └── index.tsx
```

This allows importing components cleanly:
```typescript
import Header from '@/components/Header'
```

### Documentation Organization
All documentation is organized under the `docs/` folder:
- `setup/` - Initial setup guides
- `guides/` - Feature and development guides  
- `configuration/` - Configuration and optimization
- `deployment/` - Deployment instructions

## 🔧 Key Technologies

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **CSS Modules** - Scoped styling
- **Contentful** - Headless CMS for blog content
- **ISR** - Incremental Static Regeneration for performance

## 📊 Performance Features

- **Hybrid Rendering**: Static pages + ISR for dynamic content
- **Dynamic SEO**: Cost-effective robots.txt and sitemap.xml generation
- **Optimized Caching**: Strategic cache headers for minimal costs
- **Image Optimization**: Next.js Image component with WebP support

## 🛠️ Development Tools

- **Dev Dashboard**: Visit `/dev-info` for API testing and ISR monitoring
- **API Endpoints**: `/api/status`, `/robots.txt`, `/sitemap.xml`
- **Debug Logging**: Console-based logging with Netlify compatibility

## 🚀 Deployment

For deployment instructions, see the [Netlify Deployment Guide](./docs/deployment/NETLIFY_DEPLOY.md).

## 🔧 Troubleshooting

For troubleshooting common issues, see the [Repository Setup Guide](./docs/setup/REPOSITORY_SETUP.md#troubleshooting).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
