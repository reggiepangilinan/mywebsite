# Sitemap Configuration Guide

## After Deployment: Update Your Domain

Once your site is deployed to Netlify, you'll need to update the sitemap.xml and robots.txt files with your actual domain name.

### Step 1: Update sitemap.xml
Replace `https://yoursite.com` with your actual domain in:
- `/public/sitemap.xml`

### Step 2: Update robots.txt
Replace `https://yoursite.com` with your actual domain in:
- `/public/robots.txt`

### Step 3: Rebuild and Deploy
After updating the domain:
```bash
npm run build
```
Then redeploy to Netlify.

## Example Domains:
- Netlify subdomain: `https://your-site-name.netlify.app`
- Custom domain: `https://reggiepangilinan.com`

## Submit to Search Engines

### Google Search Console:
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add your property (domain or URL prefix)
3. Verify ownership
4. Submit your sitemap: `https://yourdomain.com/sitemap.xml`

### Bing Webmaster Tools:
1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Add your site
3. Submit your sitemap

## Sitemap Contents:
- **Homepage** (`/`) - Priority: 1.0, Change frequency: monthly
- **About page** (`/about`) - Priority: 0.8, Change frequency: monthly  
- **Projects page** (`/projects`) - Priority: 0.8, Change frequency: monthly

## When to Update:
- When you add new pages
- When you change page content significantly
- When you want to signal freshness to search engines (update lastmod dates)
