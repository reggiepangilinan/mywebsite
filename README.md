# Personal Website

A modern personal portfolio website built with Next.js 15, TypeScript, and CSS Modules.

## Features

- ✨ **Modern Design**: Clean and professional layout
- 🚀 **Next.js 15**: Latest React framework with App Router
- 📱 **Responsive**: Mobile-first design
- 🎨 **CSS Modules**: Scoped styling without conflicts
- 📊 **Static Site Generation**: Fast loading and SEO-friendly
- 🔧 **TypeScript**: Type-safe development

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

This creates an optimized static export in the `out` folder.

## Project Structure

```
src/
├── app/                # App Router pages
│   ├── about/         # About page
│   ├── projects/      # Projects page
│   ├── globals.css    # Global styles
│   ├── layout.tsx     # Root layout
│   └── page.tsx       # Home page
├── components/        # Reusable components
│   ├── Header.tsx     # Navigation header
│   ├── Footer.tsx     # Site footer
│   └── ProjectCard.tsx # Project card component
└── public/           # Static assets
```

## Customization

1. **Personal Information**: Update your name, bio, and contact links in the components
2. **Styling**: Modify CSS modules in respective `.module.css` files
3. **Content**: Add your projects, skills, and experience
4. **Images**: Replace placeholder images with your own

## Deployment

This site is configured for static export and can be deployed to:

- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

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

- **Missing images**: Add placeholder images to `/public/` folder (profile.jpg, project1.jpg, project2.jpg)
- **Build errors**: Run `npm run lint` to check for TypeScript/ESLint errors
- **Port already in use**: The app will automatically use the next available port (3001, 3002, etc.)

## Development Tools

This project includes several VS Code configurations:

- **Launch configurations**: Debug the app with Chrome DevTools integration
- **Tasks**: Automated build and development server startup
- **Auto Chrome launcher**: Smart port detection and browser opening
- **Background tasks**: Server monitoring and automatic browser refresh

## License

MIT License - feel free to use this template for your own portfolio!
