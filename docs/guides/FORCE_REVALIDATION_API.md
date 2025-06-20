# Force Revalidation API Reference

## Overview

The Force Revalidation API (`/api/revalidate`) provides on-demand cache invalidation for ISR pages, enabling immediate content updates when triggered by webhooks or manual requests.

## 🎯 **Supported Routes for Revalidation**

### **Core Blog Routes**

| Route          | Purpose               | ISR Timing | Revalidation Impact         |
| -------------- | --------------------- | ---------- | --------------------------- |
| `/blog/{slug}` | Individual blog posts | 1 hour     | Immediate fresh content     |
| `/blog`        | Blog list page        | Dynamic    | Consistency (already fresh) |

### **SEO Routes**

| Route              | Purpose      | ISR Timing | Revalidation Impact           |
| ------------------ | ------------ | ---------- | ----------------------------- |
| `/sitemap.xml`     | Main sitemap | Dynamic    | Immediate update for crawlers |
| `/sitemap-isr.xml` | ISR sitemap  | 6 hours    | Force regeneration            |
| `/robots.txt`      | Robots file  | Dynamic    | Update sitemap references     |

### **Flexible Routes**

- **Any path**: Support for custom route revalidation
- **Multiple paths**: Batch revalidation in single request
- **Cache tags**: Tag-based bulk invalidation

---

## 🔐 **Authentication & Security**

### **Secret Token Authentication**

```typescript
// Required in request body
{
  "secret": "your-revalidation-secret"
}
```

### **Environment Configuration**

#### **For Netlify Deployment:**

1. **Generate secure secret**: `openssl rand -base64 32`
2. **Netlify Dashboard** → **Site Settings** → **Environment Variables**
3. **Add variable**: `REVALIDATION_SECRET` = your generated string
4. **Redeploy site** to apply changes

#### **For Local Development:**

```bash
# .env.local
REVALIDATION_SECRET=your-super-secure-random-string-here
```

#### **Production URL:**

Your deployed endpoint will be: `https://your-site.netlify.app/api/revalidate`

### **Security Features**

- ✅ **Token validation**: Prevents unauthorized revalidation
- ✅ **Error logging**: Tracks failed attempts
- ✅ **Input validation**: Sanitizes request parameters
- ✅ **Rate limiting ready**: Extensible for production limits

---

## 📡 **API Endpoints**

### **POST /api/revalidate**

#### **Content-Type:** `application/json`

#### **Request Body Options:**

##### **1. Contentful Integration (Recommended)**

```json
{
  "secret": "your-secret",
  "type": "contentful",
  "contentType": "blogPost",
  "slug": "blog-post-slug"
}
```

**Revalidates:** Specific post + blog list + SEO routes

##### **2. All Blog Content**

```json
{
  "secret": "your-secret",
  "type": "contentful",
  "contentType": "blogPost"
}
```

**Revalidates:** All blog routes + SEO routes

##### **3. Specific Path**

```json
{
  "secret": "your-secret",
  "type": "path",
  "path": "/blog/specific-post"
}
```

**Revalidates:** Only the specified path

##### **4. Multiple Paths**

```json
{
  "secret": "your-secret",
  "type": "path",
  "path": ["/blog", "/sitemap.xml", "/robots.txt"]
}
```

**Revalidates:** All specified paths

##### **5. Cache Tags**

```json
{
  "secret": "your-secret",
  "type": "tag",
  "tag": "blog-posts"
}
```

**Revalidates:** All content with the specified cache tag

#### **Response Format:**

##### **Success Response (200):**

```json
{
  "success": true,
  "message": "Revalidation completed",
  "results": [
    "Revalidated blog post: /blog/my-post",
    "Revalidated blog list: /blog",
    "Revalidated sitemaps and robots.txt"
  ],
  "duration": "45ms",
  "timestamp": "2025-06-19T00:15:30.123Z"
}
```

##### **Error Responses:**

**401 Unauthorized:**

```json
{
  "error": "Invalid secret token",
  "timestamp": "2025-06-19T00:15:30.123Z"
}
```

**500 Server Error:**

```json
{
  "error": "Revalidation not configured - missing REVALIDATION_SECRET",
  "timestamp": "2025-06-19T00:15:30.123Z"
}
```

**500 Revalidation Failed:**

```json
{
  "error": "Revalidation failed",
  "details": "Error message details",
  "timestamp": "2025-06-19T00:15:30.123Z"
}
```

### **GET /api/revalidate**

#### **Query Parameters:**

- `secret` (required): Authentication token

#### **Purpose:**

- Endpoint status check
- Configuration verification
- Usage examples

#### **Response:**

```json
{
  "status": "Revalidation endpoint is active",
  "timestamp": "2025-06-19T00:15:30.123Z",
  "environment": "production",
  "usage": {
    "post": "/api/revalidate",
    "methods": ["POST", "GET"],
    "examples": [...]
  }
}
```

---

## 🔄 **Revalidation Scenarios**

### **Blog Post Updated**

```bash
# Webhook triggered from Contentful
POST /api/revalidate
{
  "secret": "...",
  "type": "contentful",
  "contentType": "blogPost",
  "slug": "updated-post"
}
```

**Result:**

- Individual post cache cleared
- Blog list refreshed (shows update)
- Sitemaps regenerated with updated metadata

### **New Blog Post Published**

```bash
# Webhook triggered from Contentful
POST /api/revalidate
{
  "secret": "...",
  "type": "contentful",
  "contentType": "blogPost"
}
```

**Result:**

- All blog content refreshed
- Blog list shows new post immediately
- Sitemaps include new post

### **Blog Post Deleted**

```bash
# Manual or webhook triggered
POST /api/revalidate
{
  "secret": "...",
  "type": "contentful",
  "contentType": "blogPost"
}
```

**Result:**

- All blog content refreshed
- Blog list removes deleted post
- Sitemaps updated to exclude deleted post

### **Manual Site Refresh**

```bash
# Developer/admin triggered
POST /api/revalidate
{
  "secret": "...",
  "type": "path",
  "path": ["/blog", "/sitemap.xml", "/sitemap-isr.xml", "/robots.txt"]
}
```

**Result:** Complete blog and SEO refresh

---

## ⚡ **Performance Characteristics**

### **Response Times**

| Operation             | Typical Duration | Max Duration |
| --------------------- | ---------------- | ------------ |
| **Single path**       | 20-50ms          | 100ms        |
| **Multiple paths**    | 50-150ms         | 300ms        |
| **Full blog refresh** | 100-200ms        | 500ms        |

### **Resource Usage**

- **Memory**: Minimal (stateless operation)
- **CPU**: Low (cache invalidation only)
- **Network**: One API request per revalidation call

### **Cost Impact**

- **Function invocations**: 1 per request
- **ISR regeneration**: Triggered on next request
- **Monthly cost**: ~$0.01 for typical usage (5-20 triggers)

---

## 🧪 **Testing & Debugging**

### **Manual Testing**

```bash
# Test endpoint status
curl "https://yourdomain.com/api/revalidate?secret=your-secret"

# Test blog post revalidation
curl -X POST https://yourdomain.com/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{
    "secret": "your-secret",
    "type": "contentful",
    "contentType": "blogPost",
    "slug": "test-post"
  }'
```

### **Monitoring**

- **Dev Info Page**: Visit `/dev-info` for revalidation logs
- **Server Logs**: Check Vercel/Netlify function logs
- **Response Validation**: Verify response format and timing

### **Common Test Scenarios**

1. **Valid request**: Should return 200 with results
2. **Invalid secret**: Should return 401 error
3. **Missing secret**: Should return 500 error
4. **Invalid JSON**: Should return 500 error
5. **Empty request**: Should revalidate default paths

---

## 🔧 **Implementation Details**

### **Next.js Functions Used**

```typescript
import { revalidatePath, revalidateTag } from 'next/cache'

// Path-based revalidation
revalidatePath('/blog/post-slug')

// Tag-based revalidation
revalidateTag('blog-posts')

// Layout revalidation (all nested routes)
revalidatePath('/blog', 'layout')
```

### **Cache Tags Support**

Currently implemented for future extensibility:

```typescript
// In blog post fetching
fetch(url, {
  next: {
    revalidate: 3600,
    tags: ['blog-posts', `blog-post-${slug}`],
  },
})
```

### **Error Handling**

- **Try-catch blocks**: Prevent crashes
- **Detailed logging**: Track errors and performance
- **Graceful degradation**: Partial success handling
- **Client feedback**: Clear error messages

---

## 📚 Related Documentation

- [Contentful Webhook Guide](./CONTENTFUL_WEBHOOK_GUIDE.md) - Webhook setup and configuration
- [ISR Configuration Guide](../configuration/ISR_CONFIGURATION_GUIDE.md) - ISR timing and setup
- [Cost Optimization Summary](../configuration/COST_OPTIMIZATION_SUMMARY.md) - Cost analysis
- [Blog Setup Guide](../setup/BLOG_SETUP.md) - Complete implementation overview

---

_Last updated: June 19, 2025_
_API Version: 1.0_
_Compatible with Next.js 15.3.3+_
