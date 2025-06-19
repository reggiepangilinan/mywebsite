# Netlify Force Revalidation Setup Guide

## 🎯 **Quick Setup for Netlify Deployment**

This guide walks you through setting up the force revalidation API on Netlify, including environment variables, testing, and webhook configuration.

---

## 🔐 **Step 1: Generate and Set Revalidation Secret**

### **Generate a Secure Secret**
```bash
# Option 1: Using OpenSSL (recommended)
openssl rand -base64 32

# Option 2: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Option 3: Online generator (use a trusted source)
# Visit: https://randomkeygen.com/ (use "CodeIgniter Encryption Keys")
```

### **Set Environment Variable in Netlify**

1. **Login to Netlify Dashboard**
2. **Navigate to your site** → **Site Settings**
3. **Go to Environment Variables** (under "Build & deploy")
4. **Click "Add a variable"**
5. **Set the variable**:
   - **Key**: `REVALIDATION_SECRET`
   - **Value**: Your generated secure string (paste the output from above)
   - **Scopes**: ✅ Select all scopes (recommended)
6. **Click "Create variable"**

### **Trigger a Redeploy**
- Go to **Deploys** tab
- Click **"Trigger deploy"** → **"Deploy site"**
- Wait for deployment to complete

---

## ✅ **Step 2: Test the Revalidation Endpoint**

### **Test with curl (After Deployment)**
```bash
# Replace with your actual Netlify URL and secret
export NETLIFY_URL="https://your-site-name.netlify.app"
export REVALIDATION_SECRET="your-actual-secret-here"

# Test 1: Check endpoint status
curl -X GET "${NETLIFY_URL}/api/revalidate?secret=${REVALIDATION_SECRET}"

# Test 2: Test blog revalidation
curl -X POST "${NETLIFY_URL}/api/revalidate" \
  -H "Content-Type: application/json" \
  -d '{
    "secret": "'$REVALIDATION_SECRET'",
    "type": "contentful",
    "contentType": "blogPost"
  }'
```

### **Expected Responses**

#### **Success Response (200)**
```json
{
  "success": true,
  "message": "Revalidation completed",
  "results": [
    "Revalidated all blog content",
    "Revalidated sitemaps and robots.txt"
  ],
  "duration": "45ms",
  "timestamp": "2025-06-19T10:30:00.000Z"
}
```

#### **Error Response (401)**
```json
{
  "error": "Invalid secret token",
  "timestamp": "2025-06-19T10:30:00.000Z"
}
```

---

## 🎣 **Step 3: Set Up Contentful Webhook (Optional)**

### **Configure Webhook in Contentful**

1. **Login to Contentful** → Select your space
2. **Settings** → **Webhooks** → **Add webhook**
3. **Webhook Configuration**:
   - **Name**: `Netlify Blog Revalidation`
   - **URL**: `https://your-site-name.netlify.app/api/revalidate`
   - **Method**: `POST`
   - **Content type**: `application/json`

4. **Triggers** (select these):
   - ✅ Entry.publish
   - ✅ Entry.unpublish  
   - ✅ Entry.delete

5. **Filters**:
   - **Content type**: `blogPost` (or your blog content type name)

6. **Custom payload**:
```json
{
  "secret": "YOUR_ACTUAL_SECRET_HERE",
  "type": "contentful",
  "contentType": "blogPost",
  "slug": "{{ entry.fields.slug }}",
  "entryId": "{{ entry.sys.id }}",
  "action": "{{ webhook.name }}",
  "timestamp": "{{ webhook.createdAt }}"
}
```

7. **Save webhook**

### **Test Webhook**
1. **Edit and publish** a blog post in Contentful
2. **Check Netlify Function logs** (Site → Functions → View logs)
3. **Verify your site** updates immediately

---

## 🔍 **Step 4: Monitor and Debug**

### **View Function Logs in Netlify**
1. **Netlify Dashboard** → **Your Site** → **Functions**
2. **Click on your function** → **View function logs**
3. **Look for revalidation events** like:
   ```
   [REVALIDATION] 2025-06-19T10:30:00.000Z - Revalidated blog post: /blog/my-post, Revalidated blog list: /blog (45ms)
   ```

### **Use Built-in Testing Dashboard**
Visit `https://your-site-name.netlify.app/dev-info` to:
- ✅ Test revalidation with example payloads
- ✅ Monitor API status
- ✅ View configuration details

### **Common Issues & Solutions**

| Issue | Solution |
|-------|----------|
| **401 Unauthorized** | Check `REVALIDATION_SECRET` is set correctly in Netlify |
| **500 Server Error** | Verify function deployed correctly, check function logs |
| **Webhook not triggering** | Verify webhook URL and payload format in Contentful |
| **Function timeout** | Check Netlify function logs for specific errors |

---

## 📊 **Verification Checklist**

- [ ] **Environment variable set** in Netlify dashboard
- [ ] **Site redeployed** after setting environment variable
- [ ] **GET endpoint working** (returns status without errors)
- [ ] **POST endpoint working** (accepts revalidation requests)
- [ ] **Contentful webhook configured** (if using Contentful)
- [ ] **Test webhook triggered** (publish a test blog post)
- [ ] **Function logs show revalidation events**
- [ ] **Site content updates immediately**

---

## 🔗 **Related Documentation**

- **[Force Revalidation API Reference](../guides/FORCE_REVALIDATION_API.md)** - Complete API documentation
- **[Contentful Webhook Guide](../guides/CONTENTFUL_WEBHOOK_GUIDE.md)** - Detailed webhook setup
- **[Netlify Deploy Guide](./NETLIFY_DEPLOY.md)** - General Netlify deployment
- **[ISR Configuration](../configuration/ISR_CONFIGURATION_GUIDE.md)** - ISR timing and cache strategy

---

*Last updated: June 19, 2025*
*Netlify-specific revalidation setup guide*
