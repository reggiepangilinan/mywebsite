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

## 📚 Documentation

See the [docs folder](./docs/) for comprehensive guides:

- **Setup**: Blog configuration, favicon setup
- **Guides**: SEO, social sharing, performance optimization  
- **Configuration**: ISR settings, cost optimization
- **Deployment**: Netlify setup and troubleshooting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

For detailed documentation, please visit the [docs folder](./docs/).
   - **Plugin**: `@netlify/plugin-nextjs` (enables ISR)
   - **Node version**: `18`

4. **Environment Variables**: Add your Contentful credentials:
   ```
   CONTENTFUL_SPACE_ID=your_space_id
   CONTENTFUL_ACCESS_TOKEN=your_access_token
   ENABLE_ISR_LOGS=true
   ```

5. **Deploy**: Click "Deploy site" - Netlify will automatically build and deploy with ISR support

#### Option 2: Manual Deploy

1. **Build locally**:
   ```bash
   npm run build
   ```

2. **Deploy the `out` folder**:
   - Go to [Netlify](https://netlify.com)
   - Drag and drop the `out` folder to the deploy area

#### Features Included:

- ✅ **Static Export**: Optimized for CDN delivery
- ✅ **Security Headers**: XSS protection, frame options, etc.
- ✅ **Cache Optimization**: Long-term caching for static assets
- ✅ **Redirect Handling**: Clean URLs and trailing slash management
- ✅ **Performance**: Pre-built static files for fast loading

#### Custom Domain

After deployment, you can add a custom domain in your Netlify site settings.

## Troubleshooting

### Chrome Not Opening Automatically

If Chrome doesn't open automatically, try these solutions:

1. **Make sure Chrome is installed** and accessible from the command line
2. **Check permissions**: On macOS, you might need to allow VS Code to control other applications
3. **Manual fallback**: If auto-launch fails, the console will show the URL to open manually
4. **Alternative browsers**: Modify the scripts in `scripts/open-browser.js` to use your preferred browser

### VS Code Debugger Issues

1. **F5 not working**: 
   - Make sure you're in the VS Code workspace folder
   - Check that "🚀 Launch Next.js + Chrome" is selected in the debug dropdown
   - Try manually selecting the configuration and clicking the play button
   - If still not working, use `npm run dev:chrome` as an alternative

2. **Chrome not opening automatically**:
   - Install Chrome if not already installed
   - Check that the path to Chrome is correct in `scripts/open-browser.js`
   - Try running `node scripts/open-browser.js` manually after starting the dev server

3. **Install Chrome Debugger**: The JavaScript Debugger extension should be installed automatically
4. **Port conflicts**: If you see "port in use" errors, the script will find the next available port
5. **Server timeout**: If the server takes too long to start, increase the timeout in `scripts/open-browser.js`

### Common Issues

- **Missing Contentful credentials**: Add environment variables for blog functionality
- **ISR not working**: Check `/dev-info` page and ensure environment variables are set
- **Build errors**: Run `npm run lint` to check for TypeScript/ESLint errors
- **Port already in use**: The app will automatically use the next available port (3001, 3002, etc.)

## Documentation

This project includes comprehensive documentation:

- **`ISR_CONFIGURATION_GUIDE.md`** - How to configure ISR timing
- **`ISR_STATUS_SUMMARY.md`** - Current ISR setup and verification
- **`NETLIFY_LOGGING_GUIDE.md`** - Debugging ISR on Netlify
- **`NETLIFY_DEPLOY.md`** - Deployment instructions
- **`BLOG_SETUP.md`** - Blog and Contentful setup

## Development Tools

This project includes several VS Code configurations:

- **Launch configurations**: Debug the app with Chrome DevTools integration
- **Tasks**: Automated build and development server startup
- **Auto Chrome launcher**: Smart port detection and browser opening
- **Background tasks**: Server monitoring and automatic browser refresh

## License

MIT License - feel free to use this template for your own portfolio!
