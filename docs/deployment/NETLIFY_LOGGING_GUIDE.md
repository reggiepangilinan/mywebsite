# Netlify Logging Guide for ISR

## Why You Might Not See Logs on Netlify Free Tier

### 1. Log Retention Limits
- **Free Tier**: Very limited log retention (usually minutes to hours)
- **Pro Tier**: Extended log retention (days to weeks)
- Your ISR logs might be there but expire quickly

### 2. Log Access Methods
- **Deploy Logs**: Visible during build only
- **Function Logs**: Only for API routes (Netlify Functions)
- **Server Logs**: Limited access on free tier

### 3. ISR Behavior on Netlify
- ISR revalidation happens in the background
- Logs from ISR might not appear in standard Netlify logs
- Console logs during ISR may be filtered out

## Current Logging Strategy

Our current setup logs to:
1. `console.error()` - Highest priority, more likely to be visible
2. `console.log()` - Standard logging
3. `process.stdout/stderr` - Direct output streams

## How to Debug ISR

### Method 1: Browser Console (Most Reliable)
1. Visit your blog pages in production
2. Open browser developer tools
3. Check Console tab for any client-side hydration logs
4. Look for network requests to see if ISR is triggering

### Method 2: Development Dashboard
Visit `/dev-info` to see:
- Environment configuration
- Recent blog posts (confirms Contentful connection)
- ISR timing information

### Method 3: Network Monitoring
1. Open DevTools → Network tab
2. Visit blog pages
3. Look for:
   - Cache headers (`Cache-Control`, `x-vercel-cache`)
   - Response timing differences
   - Background revalidation requests

### Method 4: Contentful Webhooks (Advanced)
1. Set up webhook in Contentful
2. Point to Netlify build hook
3. Trigger rebuild when content changes

## Environment Variables for Logging

```bash
# Enable ISR logs in production
ENABLE_ISR_LOGS=true

# Enable debug mode
DEBUG=true

# Check in Netlify dashboard under Site settings → Environment variables
```

## Testing ISR Locally

```bash
npm run build
npm start

# In another terminal
curl -I http://localhost:3000/blog
# Look for Cache-Control headers
```

## Verifying ISR is Working

### Signs ISR is Active:
1. Build output shows "λ" (lambda) next to blog routes
2. `Cache-Control: s-maxage=60, stale-while-revalidate` headers
3. Response times vary between requests
4. Content updates without full deploys

### Signs ISR is NOT Working:
1. Build output shows "○" (static) next to blog routes
2. No `Cache-Control` headers with revalidate
3. Consistent fast response times
4. Content never updates without deploy

## Troubleshooting Steps

1. **Check Build Output**:
   ```
   ○ (Static)  automatically rendered as static HTML
   λ (Server)  server-side renders at runtime (uses getInitialProps or getServerSideProps)
   ```

2. **Verify Environment Variables** in Netlify dashboard

3. **Test Locally** with production build

4. **Monitor Network Tab** in browser DevTools

5. **Check Contentful** for content changes

## Alternative: Lightweight Status Endpoint

If you need better visibility, consider adding a simple status endpoint:

```typescript
// app/api/status/route.ts
export async function GET() {
  return Response.json({
    timestamp: new Date().toISOString(),
    isr: process.env.ENABLE_ISR_LOGS === 'true',
    env: process.env.NODE_ENV
  })
}
```

Then visit `/api/status` to check if ISR environment is configured correctly.
