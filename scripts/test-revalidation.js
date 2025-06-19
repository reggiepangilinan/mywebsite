#!/usr/bin/env node
/**
 * Test Revalidation Script
 * 
 * This script tests the /api/revalidate endpoint with various scenarios
 * to ensure proper functionality and error handling.
 * 
 * Usage:
 *   node scripts/test-revalidation.js
 *   
 * Requirements:
 *   - REVALIDATION_SECRET environment variable set
 *   - Site deployed and accessible
 */

const https = require('https')
const http = require('http')

// Configuration
const CONFIG = {
  // Update these values for your deployment
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  secret: process.env.REVALIDATION_SECRET,
  
  // Test scenarios
  tests: [
    {
      name: 'Endpoint Status Check',
      method: 'GET',
      path: '/api/revalidate',
      query: '?secret=' + (process.env.REVALIDATION_SECRET || 'test'),
      expectedStatus: 200
    },
    {
      name: 'Specific Blog Post Revalidation',
      method: 'POST',
      path: '/api/revalidate',
      body: {
        secret: process.env.REVALIDATION_SECRET,
        type: 'contentful',
        contentType: 'blogPost',
        slug: 'test-post-slug'
      },
      expectedStatus: 200
    },
    {
      name: 'All Blog Content Revalidation',
      method: 'POST', 
      path: '/api/revalidate',
      body: {
        secret: process.env.REVALIDATION_SECRET,
        type: 'contentful',
        contentType: 'blogPost'
      },
      expectedStatus: 200
    },
    {
      name: 'Path-based Revalidation',
      method: 'POST',
      path: '/api/revalidate',
      body: {
        secret: process.env.REVALIDATION_SECRET,
        type: 'path',
        path: '/blog'
      },
      expectedStatus: 200
    },
    {
      name: 'Multiple Paths Revalidation',
      method: 'POST',
      path: '/api/revalidate', 
      body: {
        secret: process.env.REVALIDATION_SECRET,
        type: 'path',
        path: ['/blog', '/sitemap.xml', '/robots.txt']
      },
      expectedStatus: 200
    },
    {
      name: 'Invalid Secret Test',
      method: 'POST',
      path: '/api/revalidate',
      body: {
        secret: 'invalid-secret-for-testing',
        type: 'path',
        path: '/blog'
      },
      expectedStatus: 401
    },
    {
      name: 'Missing Secret Test',
      method: 'POST',
      path: '/api/revalidate',
      body: {
        type: 'path',
        path: '/blog'
      },
      expectedStatus: 401
    },
    {
      name: 'Default Revalidation (Empty Body)',
      method: 'POST',
      path: '/api/revalidate',
      body: {
        secret: process.env.REVALIDATION_SECRET
      },
      expectedStatus: 200
    }
  ]
}

// Helper function to make HTTP requests
function makeRequest(test) {
  return new Promise((resolve, reject) => {
    const isHttps = CONFIG.baseUrl.startsWith('https')
    const client = isHttps ? https : http
    const url = new URL(CONFIG.baseUrl + test.path + (test.query || ''))
    
    const options = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname + url.search,
      method: test.method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Revalidation-Test-Script/1.0'
      }
    }

    const req = client.request(options, (res) => {
      let data = ''
      
      res.on('data', (chunk) => {
        data += chunk
      })
      
      res.on('end', () => {
        try {
          const response = {
            status: res.statusCode,
            headers: res.headers,
            body: data ? JSON.parse(data) : null
          }
          resolve(response)
        } catch (error) {
          resolve({
            status: res.statusCode,
            headers: res.headers, 
            body: data,
            parseError: error.message
          })
        }
      })
    })

    req.on('error', (error) => {
      reject(error)
    })

    // Send request body for POST requests
    if (test.method === 'POST' && test.body) {
      req.write(JSON.stringify(test.body))
    }
    
    req.end()
  })
}

// Test runner
async function runTests() {
  console.log('🧪 Force Revalidation API Test Suite')
  console.log('=' .repeat(50))
  console.log(`Base URL: ${CONFIG.baseUrl}`)
  console.log(`Secret configured: ${CONFIG.secret ? '✅ Yes' : '❌ No'}`)
  console.log('')

  if (!CONFIG.secret) {
    console.log('⚠️  WARNING: REVALIDATION_SECRET not found in environment variables')
    console.log('   Some tests may fail. Set REVALIDATION_SECRET to test authentication.')
    console.log('')
  }

  let passed = 0
  let failed = 0

  for (let i = 0; i < CONFIG.tests.length; i++) {
    const test = CONFIG.tests[i]
    console.log(`Test ${i + 1}/${CONFIG.tests.length}: ${test.name}`)
    
    try {
      const startTime = Date.now()
      const response = await makeRequest(test)
      const duration = Date.now() - startTime
      
      const statusMatch = response.status === test.expectedStatus
      const statusIcon = statusMatch ? '✅' : '❌'
      
      console.log(`  ${statusIcon} Status: ${response.status} (expected ${test.expectedStatus})`)
      console.log(`  ⏱️  Duration: ${duration}ms`)
      
      if (response.body) {
        if (response.body.success) {
          console.log(`  📝 Results: ${response.body.results?.length || 0} operations`)
          if (response.body.results) {
            response.body.results.forEach(result => {
              console.log(`     - ${result}`)
            })
          }
        } else if (response.body.error) {
          console.log(`  ❌ Error: ${response.body.error}`)
        }
      }
      
      if (statusMatch) {
        passed++
        console.log('  ✅ PASSED')
      } else {
        failed++
        console.log('  ❌ FAILED')
      }
      
    } catch (error) {
      failed++
      console.log(`  ❌ ERROR: ${error.message}`)
      console.log('  ❌ FAILED')
    }
    
    console.log('')
  }

  // Summary
  console.log('📊 Test Results Summary')
  console.log('=' .repeat(30))
  console.log(`✅ Passed: ${passed}`)
  console.log(`❌ Failed: ${failed}`)
  console.log(`📊 Total: ${CONFIG.tests.length}`)
  console.log(`🎯 Success Rate: ${Math.round((passed / CONFIG.tests.length) * 100)}%`)
  
  if (failed === 0) {
    console.log('')
    console.log('🎉 All tests passed! The revalidation endpoint is working correctly.')
  } else {
    console.log('')
    console.log('⚠️  Some tests failed. Check the configuration and try again.')
    process.exit(1)
  }
}

// Command line interface
if (require.main === module) {
  // Check for help flag
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    console.log('Force Revalidation API Test Script')
    console.log('')
    console.log('Usage:')
    console.log('  node scripts/test-revalidation.js')
    console.log('')
    console.log('Environment Variables:')
    console.log('  REVALIDATION_SECRET  - Required for authentication tests')
    console.log('  NEXT_PUBLIC_SITE_URL - Base URL (defaults to http://localhost:3000)')
    console.log('')
    console.log('Examples:')
    console.log('  # Test local development')
    console.log('  REVALIDATION_SECRET=your-secret node scripts/test-revalidation.js')
    console.log('')
    console.log('  # Test production')
    console.log('  NEXT_PUBLIC_SITE_URL=https://yourdomain.com \\')
    console.log('  REVALIDATION_SECRET=your-secret \\')
    console.log('  node scripts/test-revalidation.js')
    process.exit(0)
  }

  // Run the tests
  runTests().catch(error => {
    console.error('❌ Test runner failed:', error.message)
    process.exit(1)
  })
}

module.exports = { makeRequest, runTests, CONFIG }
