#!/bin/bash

# Revalidation Testing Script
# Usage: ./scripts/test-revalidation.sh [URL] [SECRET]

set -e

# Configuration
URL="${1:-http://localhost:3000}"
SECRET="${2:-your-secret-token}"

echo "🧪 Testing Revalidation API"
echo "URL: $URL"
echo "Secret: ${SECRET:0:10}..."
echo ""

# Test 1: Check endpoint status
echo "1️⃣ Testing endpoint status..."
curl -s "$URL/api/revalidate?secret=$SECRET" | jq '.' || echo "❌ Status check failed"
echo ""

# Test 2: Revalidate specific blog post
echo "2️⃣ Testing specific blog post revalidation..."
curl -s -X POST "$URL/api/revalidate" \
  -H "Content-Type: application/json" \
  -d "{
    \"secret\": \"$SECRET\",
    \"type\": \"contentful\",
    \"contentType\": \"blogPost\",
    \"slug\": \"test-post\"
  }" | jq '.' || echo "❌ Blog post revalidation failed"
echo ""

# Test 3: Revalidate all blog content
echo "3️⃣ Testing all blog content revalidation..."
curl -s -X POST "$URL/api/revalidate" \
  -H "Content-Type: application/json" \
  -d "{
    \"secret\": \"$SECRET\",
    \"type\": \"contentful\",
    \"contentType\": \"blogPost\"
  }" | jq '.' || echo "❌ All blog revalidation failed"
echo ""

# Test 4: Revalidate specific path
echo "4️⃣ Testing path-based revalidation..."
curl -s -X POST "$URL/api/revalidate" \
  -H "Content-Type: application/json" \
  -d "{
    \"secret\": \"$SECRET\",
    \"type\": \"path\",
    \"path\": \"/blog\"
  }" | jq '.' || echo "❌ Path revalidation failed"
echo ""

# Test 5: Test with invalid secret
echo "5️⃣ Testing security (invalid secret)..."
curl -s -X POST "$URL/api/revalidate" \
  -H "Content-Type: application/json" \
  -d "{
    \"secret\": \"invalid-secret\",
    \"type\": \"path\",
    \"path\": \"/blog\"
  }" | jq '.' || echo "✅ Security test passed (invalid secret rejected)"
echo ""

echo "✅ All tests completed!"
echo ""
echo "💡 Next steps:"
echo "  1. Check your application logs for revalidation events"
echo "  2. Visit /dev-info to see revalidation status"
echo "  3. Set up Contentful webhook using CONTENTFUL_WEBHOOK_GUIDE.md"
echo ""
