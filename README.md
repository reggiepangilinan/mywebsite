# Personal Website

A modern personal portfolio website built with Next.js 15, TypeScript, and CSS Modules.

## Features

- ✨ **Modern Design**: Clean and professional layout
- 🚀 **Next.js 15**: Latest React framework with App Router
- 📱 **Responsive**: Mobile-first design
- 🎨 **CSS Modules**: Scoped styling without conflicts
- � **Dynamic Blog**: Contentful CMS integration with ISR
- ⚡ **ISR (Incremental Static Regeneration)**: Fast, always-fresh content
- 📊 **Hybrid Rendering**: SSG for static pages, ISR for dynamic content
- 🔧 **TypeScript**: Type-safe development
- 🔍 **SEO Optimized**: Meta tags, sitemap, and structured data

## Architecture

- **Static Pages**: Home, About, Projects (fast SSG)
- **Dynamic Blog**: Contentful-powered with ISR revalidation
- **Centralized ISR Config**: Easy timing management in `src/config/isr.ts`
- **Debug Tools**: Built-in ISR monitoring at `/debug-isr`

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Add your images to the `public` folder:
   - `profile.jpg` - Your profile picture
   - `project1.jpg` - Project screenshot
   - `project2.jpg` - Project screenshot

4. Customize the content:
   - Update your name and details in components
   - Modify the projects data in `/src/app/projects/page.tsx`
   - Add your experience in `/src/app/about/page.tsx`

### Development

You have several options to run the development server:

#### Option 1: Basic Development Server
```bash
npm run dev
```
Then manually open [http://localhost:3000](http://localhost:3000) in your browser.

#### Option 2: Auto-Launch Chrome (Recommended)
```bash
npm run dev:chrome
```
This will automatically start the dev server and open Chrome to the correct URL, even if the server uses a different port.

#### Option 3: VS Code Quick Launch (F5)
1. Open the project in VS Code
2. Press **F5** or go to Debug panel (Ctrl/Cmd + Shift + D)
3. Select "🚀 Launch Next.js + Chrome" (should be default)
4. Press F5 or click the green play button

This will start the dev server and automatically open Chrome with the correct URL.

#### Option 4: VS Code Debug Panel
1. Open the Debug panel (Ctrl/Cmd + Shift + D)  
2. Choose from available configurations:
   - **🚀 Launch Next.js + Chrome** - Full auto-launch (recommended)
   - **Launch Next.js App Only** - Server only, no browser
   - **Attach Chrome Debugger** - Attach to running Chrome instance
   - **Launch Chrome Only** - Open browser to existing server

#### Port Handling
The application will automatically use the next available port if 3000 is occupied (3001, 3002, etc.). The Chrome launcher scripts are smart enough to detect and open the correct port.

### Building for Production

```bash
npm run build
```

This creates an optimized hybrid build with:
- Static pages pre-rendered at build time
- ISR-enabled blog pages for dynamic updates
- Proper cache headers for performance

## Project Structure

```
src/
├── app/                # App Router pages
│   ├── about/         # About page with experience & skills
│   ├── blog/          # Blog list page (ISR enabled)
│   │   └── [slug]/    # Individual blog posts (ISR enabled)
│   ├── debug-isr/     # ISR debugging tools
│   ├── projects/      # Projects showcase
│   ├── api/           # API routes
│   │   └── status/    # ISR status endpoint
│   ├── globals.css    # Global styles
│   ├── layout.tsx     # Root layout with navigation
│   └── page.tsx       # Home page
├── components/        # Reusable components
│   ├── AnimatedSection.tsx  # Scroll animations
│   ├── BlogCard.tsx         # Blog post cards
│   ├── Header.tsx           # Navigation header
│   ├── Footer.tsx           # Site footer
│   ├── ProjectCard.tsx      # Project showcase cards
│   ├── RichTextRenderer.tsx # Contentful rich text display
│   └── ThemeToggle.tsx      # Dark/light mode toggle
├── config/            # Configuration files
│   ├── blog.ts        # Blog display settings
│   └── isr.ts         # ISR timing configuration
├── hooks/             # Custom React hooks
├── lib/               # Utility libraries
│   ├── contentful.ts  # Contentful CMS integration
│   └── isr-logger.ts  # ISR logging utilities
└── public/           # Static assets
```

## Configuration

### ISR Timing
All ISR revalidation timing is managed in `src/config/isr.ts`:
- Blog pages: 300 seconds (5 minutes)
- Debug page: 60 seconds (1 minute)

📖 **See**: `ISR_CONFIGURATION_GUIDE.md` for detailed instructions

### Content Management
Blog content is managed via Contentful CMS. Set environment variables:
```bash
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_access_token
```

## Customization

1. **Personal Information**: Update your name, bio, and contact links in the components
2. **ISR Timing**: Modify revalidation intervals in `src/config/isr.ts`
3. **Blog Content**: Manage posts through Contentful CMS
4. **Styling**: Modify CSS modules in respective `.module.css` files
5. **Content**: Add your projects, skills, and experience
6. **Images**: Replace placeholder images with your own

## Monitoring & Debugging

- **ISR Debug Page**: Visit `/debug-isr` to monitor ISR behavior
- **API Status**: Check `/api/status` for configuration verification
- **Build Output**: Monitor revalidate timing in build logs

## Deployment

This site uses **hybrid rendering**:
- **Static pages** (Home, About, Projects): Traditional SSG
- **Blog pages**: ISR-enabled for dynamic content updates

### Supported Platforms

- **Netlify** ✅ (Recommended - Full ISR support)
- **Vercel** ✅ (Native ISR support)
- Static hosts (Limited - ISR becomes SSG)

### Netlify Deployment

This project is configured for Netlify with **ISR support** via `@netlify/plugin-nextjs`.

#### Option 1: Connect Git Repository (Recommended)

1. **Push to Git**: Make sure your code is pushed to a Git repository (GitHub, GitLab, etc.)

2. **Connect to Netlify**:
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your Git provider and select your repository

3. **Build Settings** (Auto-configured via `netlify.toml`):
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
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
- **ISR not working**: Check `/debug-isr` page and ensure environment variables are set
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
