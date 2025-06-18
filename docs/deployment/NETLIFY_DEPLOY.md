# Netlify Deployment Checklist

## Pre-Deployment
- [x] Next.js configured for static export (`output: 'export'`)
- [x] Images set to `unoptimized: true`
- [x] netlify.toml configuration file created
- [x] robots.txt file added for SEO
- [x] sitemap.xml file added for search engine discovery
- [x] Build script working (`npm run build`)
- [x] Static files generated in `out/` directory
- [x] CSS errors resolved
- [x] All pages building successfully

## Deployment Steps

### Option 1: Git-based Deploy (Recommended)
1. Commit and push all changes to your Git repository
2. Go to [netlify.com](https://netlify.com) and sign in
3. Click "New site from Git"
4. Connect your Git provider (GitHub, GitLab, etc.)
5. Select your repository
6. Netlify will auto-detect settings from `netlify.toml`
7. Click "Deploy site"

### Option 2: Manual Deploy
1. Run `npm run build` locally
2. Go to [netlify.com](https://netlify.com)
3. Drag and drop the `out/` folder to deploy

## Post-Deployment
- [ ] Verify site loads correctly
- [ ] Test all navigation links
- [ ] Check mobile responsiveness
- [ ] Test dark/light mode toggle
- [ ] Verify images load properly
- [ ] Test download link functionality
- [ ] Verify robots.txt is accessible at yoursite.com/robots.txt
- [ ] Verify sitemap.xml is accessible at yoursite.com/sitemap.xml
- [ ] Submit sitemap to Google Search Console (optional)
- [ ] Set up custom domain (optional)

## Automatic Deployment
Once connected to Git, Netlify will automatically:
- Deploy on every push to main/master branch
- Run build process (`npm run build`)
- Generate preview deploys for pull requests
- Provide deploy previews and rollback options

## Site Configuration
The `netlify.toml` file includes:
- Build settings (command, publish directory)
- Security headers
- Cache optimization
- Redirect rules
- Node.js version specification

## Troubleshooting
- If build fails, check the deploy logs in Netlify dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility (using Node 18)
- Check for any CSS or TypeScript errors
