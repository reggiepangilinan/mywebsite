# Contentful Webhook Integration Guide

## Overview

This guide covers setting up Contentful webhooks to automatically trigger revalidation when blog content is updated, providing immediate content updates without waiting for ISR cache expiration.

## 🎯 **Why Webhooks + Force Revalidation?**

### **Problem Solved:**

- **ISR Delay**: Blog posts use 1-hour ISR, meaning updates take up to 1 hour to appear
- **Manual Process**: Previously required manual intervention to refresh content
- **SEO Impact**: Sitemaps need immediate updates when content changes

### **Solution:**

- **Instant Updates**: Content appears immediately when published/updated in Contentful
- **Automated Process**: No manual intervention required
- **SEO Optimized**: Sitemaps update immediately for search engine crawlers

---

## 🔧 **Implementation Overview**

### **Flow Diagram:**

```
Contentful CMS → Webhook → /api/revalidate → ISR Cache Invalidation → Updated Site
```

### **What Gets Revalidated:**

| Content Change        | Revalidated Routes                    | Impact                          |
| --------------------- | ------------------------------------- | ------------------------------- |
| **Blog Post Updated** | `/blog/{slug}` + `/blog` + SEO routes | Specific post + list + sitemaps |
| **New Blog Post**     | All blog routes + SEO routes          | Complete blog refresh           |
| **Blog Post Deleted** | All blog routes + SEO routes          | Remove from lists + sitemaps    |

---

## ⚙️ **Setup Instructions**

### **Step 1: Configure Environment Variables**

#### **For Netlify Deployment:**

1. **Generate a secure secret**:

   ```bash
   # Generate a random 32-character string
   openssl rand -base64 32
   ```

2. **Set environment variable in Netlify**:

   - Go to **Netlify Dashboard** → **Site Settings** → **Environment Variables**
   - Click **Add a variable**
   - Set `REVALIDATION_SECRET` to your generated string
   - **Important**: Select all scopes (Deploy time, Runtime, etc.)
   - Click **Create variable**

3. **Redeploy your site** to apply the environment variable

#### **For Local Development:**

Add to your `.env.local`:

```bash
# Revalidation Security
REVALIDATION_SECRET=your-super-secure-random-string-here
```

**Important:** Use a strong, unique secret (32+ characters recommended).

### **Step 2: Deploy Revalidation Endpoint**

The endpoint is automatically available at `/api/revalidate` after deployment.

**Test the endpoint:**

```bash
# GET request to verify it's working
curl "https://yourdomain.com/api/revalidate?secret=your-secret"
```

### **Step 3: Configure Contentful Webhook**

1. **Login to Contentful** → Go to your space
2. **Navigate to Settings** → Webhooks
3. **Create New Webhook:**

   - **Name**: `Blog Revalidation`
   - **URL**: `https://yourdomain.com/api/revalidate`
   - **Method**: `POST`
   - **Content Type**: `application/json`

4. **Configure Triggers:**

   - ✅ **Entry.publish** (new posts)
   - ✅ **Entry.unpublish** (remove posts)
   - ✅ **Entry.save** (draft updates)
   - ✅ **Entry.delete** (delete posts)

5. **Filter by Content Type:**

   - **Content Type**: `blogPost` (your blog post content type)

6. **Custom Payload Template:**

```json
{
  "secret": "your-super-secure-random-string-here",
  "type": "contentful",
  "contentType": "blogPost",
  "slug": "{{ entry.fields.slug }}",
  "entryId": "{{ entry.sys.id }}",
  "action": "{{ webhook.name }}",
  "environment": "{{ webhook.space.environment }}",
  "timestamp": "{{ webhook.createdAt }}"
}
```

### **Step 4: Test the Integration**

1. **Create/Update a blog post** in Contentful
2. **Publish the post**
3. **Check your site** - changes should appear immediately
4. **Monitor logs** in Netlify dashboard (Functions → Function logs)

---

## 🔑 **API Endpoint Reference**

### **Endpoint:** `POST /api/revalidate`

### **Authentication:**

- **Method**: Secret token in request body
- **Header**: `Content-Type: application/json`

### **Request Examples:**

#### **Specific Blog Post (from Contentful webhook):**

```bash
curl -X POST https://yourdomain.com/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{
    "secret": "your-secret",
    "type": "contentful",
    "contentType": "blogPost",
    "slug": "my-blog-post"
  }'
```

#### **All Blog Content:**

```bash
curl -X POST https://yourdomain.com/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{
    "secret": "your-secret",
    "type": "contentful",
    "contentType": "blogPost"
  }'
```

#### **Specific Path:**

```bash
curl -X POST https://yourdomain.com/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{
    "secret": "your-secret",
    "type": "path",
    "path": "/blog/specific-post"
  }'
```

#### **Multiple Paths:**

```bash
curl -X POST https://yourdomain.com/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{
    "secret": "your-secret",
    "type": "path",
    "path": ["/blog", "/sitemap.xml", "/robots.txt"]
  }'
```

### **Response Format:**

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

---

## 🚨 **Troubleshooting**

If you're experiencing issues with revalidation not working:

1. **Check the comprehensive troubleshooting guide**: [`docs/troubleshooting/CONTENTFUL_REVALIDATION_ISSUE.md`](../troubleshooting/CONTENTFUL_REVALIDATION_ISSUE.md)

2. **Common Issues**:

   - **Development vs Production**: ISR behaves differently - always test in production mode
   - **Webhook Payload**: Ensure slug field is properly configured as `{{ entry.fields.slug }}`
   - **Environment Variables**: Verify `REVALIDATION_SECRET` matches between Contentful and your app
   - **Network Issues**: Check that webhooks are reaching your endpoint

3. **Quick Diagnostic**:

   ```bash
   # Test your revalidation endpoint manually
   curl -X POST https://yourdomain.com/api/revalidate \
     -H "Content-Type: application/json" \
     -d '{
       "secret": "your-secret",
       "type": "contentful",
       "contentType": "blogPost",
       "slug": "test-slug"
     }'
   ```

4. **Monitor Logs**: Check server logs for detailed revalidation information

---

## 🔍 **Monitoring & Debugging**

### **Check Revalidation Status:**

Visit `/dev-info` page on your site to see:

- Recent revalidation events
- Performance metrics
- Error logs

### **Manual Testing:**

Use the test utility script:

```bash
# From your project root
node scripts/test-revalidation.js
```

### **Contentful Webhook Logs:**

1. Go to **Contentful** → **Settings** → **Webhooks**
2. Click on your webhook
3. Check **Activity** tab for delivery status

### **Common Issues:**

| Issue                | Cause              | Solution                                |
| -------------------- | ------------------ | --------------------------------------- |
| **401 Unauthorized** | Wrong secret       | Check `REVALIDATION_SECRET` env var     |
| **500 Server Error** | Missing env var    | Add `REVALIDATION_SECRET` to deployment |
| **No revalidation**  | Wrong content type | Verify webhook filters                  |
| **Timeout**          | Large cache clear  | Normal for bulk operations              |

---

## 🚀 **Advanced Configuration**

### **Environment-Specific Webhooks:**

Set up different webhooks for different environments:

- **Development**: `http://localhost:3000/api/revalidate`
- **Staging**: `https://staging.yourdomain.com/api/revalidate`
- **Production**: `https://yourdomain.com/api/revalidate`

### **Webhook Security Best Practices:**

1. **Use HTTPS only** in production
2. **Rotate secrets regularly** (quarterly recommended)
3. **Monitor webhook activity** for suspicious requests
4. **Rate limiting**: Consider adding rate limits for production

### **Custom Content Types:**

To support other content types, extend the API:

```typescript
// In /api/revalidate/route.ts
if (contentType === 'author' && slug) {
  // Revalidate author pages
  revalidatePath(`/authors/${slug}`)
  results.push(`Revalidated author: /authors/${slug}`)
}
```

---

## 📊 **Performance Impact**

### **Revalidation Cost Analysis:**

- **API calls**: No additional Contentful API calls (webhook provides data)
- **Function invocations**: 1 per webhook trigger (~5-20/month for personal blog)
- **Revalidation time**: 50-200ms per endpoint
- **Cost impact**: Minimal (~$0.01/month additional)

### **Benefits vs Costs:**

| Benefit                | Value                   | Cost                  |
| ---------------------- | ----------------------- | --------------------- |
| **Immediate updates**  | High SEO value          | ~$0.01/month          |
| **Better UX**          | Users see fresh content | Minimal function time |
| **Automated workflow** | Saves manual work       | One-time setup        |

---

## 🎯 **Success Checklist**

- [ ] Environment variable `REVALIDATION_SECRET` configured
- [ ] Webhook created in Contentful with correct URL
- [ ] Webhook configured with blog post content type filter
- [ ] Custom payload template includes secret and required fields
- [ ] Test post published and site updated immediately
- [ ] Monitoring setup in `/dev-info` page working
- [ ] Error handling tested (wrong secret, missing fields)

---

## 📚 Related Documentation

- [Force Revalidation API Reference](./FORCE_REVALIDATION_API.md) - Detailed API documentation
- [ISR Configuration Guide](../configuration/ISR_CONFIGURATION_GUIDE.md) - ISR setup and timing
- [Cost Optimization Summary](../configuration/COST_OPTIMIZATION_SUMMARY.md) - Cost analysis including webhooks
- [Server vs Client Analysis](../configuration/SERVER_VS_CLIENT_ANALYSIS.md) - Rendering strategy comparison
- [Blog Setup Guide](../setup/BLOG_SETUP.md) - Complete blog implementation
- [Monitoring Guide](./MONITORING_ANALYTICS.md) - Performance monitoring setup

---

_Last updated: June 19, 2025_
_Tested with Contentful CMS and Next.js 15.3.3_
