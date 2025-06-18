'use client'

import { createDebugInfo } from '@/lib/isr-logger'
import { getBlogPosts } from '@/lib/contentful'
import { ISR_CONFIG } from '@/config/isr'
import { useEffect, useState } from 'react'

export default function DevInfoPage() {
  const [debugInfo, setDebugInfo] = useState<object | null>(null)
  const [posts, setPosts] = useState<Array<Record<string, unknown>>>([])
  const [loadTime, setLoadTime] = useState<number>(0)
  const [pageGenerated, setPageGenerated] = useState<string>('')

  useEffect(() => {
    async function loadData() {
      const debugInfo = createDebugInfo()
      setDebugInfo(debugInfo)
      
      const startTime = Date.now()
      const { items: posts } = await getBlogPosts(5) // Get first 5 posts
      const loadTime = Date.now() - startTime
      
      setPosts(posts)
      setLoadTime(loadTime)
      setPageGenerated(new Date().toISOString())
    }
    
    loadData()
  }, [])

  if (!debugInfo) {
    return (
      <div style={{ padding: '20px', fontFamily: 'monospace', maxWidth: '800px', color: 'var(--foreground)', backgroundColor: 'var(--background)' }}>
        <h1>🛠️ Development Info Dashboard</h1>
        <p>Loading...</p>
      </div>
    )
  }
  
  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', maxWidth: '800px', color: 'var(--foreground)', backgroundColor: 'var(--background)' }}>
      <h1>🛠️ Development Info Dashboard</h1>
      <p style={{ marginBottom: '30px', color: '#666' }}>ISR status, SEO tools, and development debugging information</p>
      
      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #666', borderRadius: '5px' }}>
        <h2>🔍 Debug Status</h2>
        <pre style={{ backgroundColor: 'transparent', color: 'inherit' }}>{JSON.stringify(debugInfo, null, 2)}</pre>
        <p><strong>Content Load Time:</strong> {loadTime}ms</p>
        <p><strong>Page Generated:</strong> {pageGenerated}</p>
      </div>

      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #666', borderRadius: '5px' }}>
        <h2>🚀 ISR Configuration</h2>
        <ul>
          <li><strong>This page:</strong> Client-side rendered (no ISR due to interactive features)</li>
          <li><strong>Blog list revalidates every:</strong> {ISR_CONFIG.formatDuration(ISR_CONFIG.BLOG_LIST_REVALIDATE)}</li>
          <li><strong>Blog posts revalidate every:</strong> {ISR_CONFIG.formatDuration(ISR_CONFIG.BLOG_POST_REVALIDATE)}</li>
        </ul>
        <p><small>💡 <strong>Configure timing in:</strong> <code>src/config/isr.ts</code></small></p>
      </div>

      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #666', borderRadius: '5px' }}>
        <h2>📝 Recent Blog Posts</h2>
        <p><strong>Count:</strong> {posts.length}</p>
        <p><strong>Load Time:</strong> {loadTime}ms {loadTime > 1000 ? '(Slow - likely fresh fetch)' : '(Fast - likely cached)'}</p>
        {posts.map((post, index) => {
          const typedPost = post as { sys: { id: string; updatedAt: string }; fields: { title?: string } }
          return (
            <div key={typedPost.sys.id} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #888', borderRadius: '3px' }}>
              <strong>{index + 1}. {String(typedPost.fields.title || 'Untitled')}</strong>
              <br />
              <small>ID: {typedPost.sys.id} | Updated: {typedPost.sys.updatedAt}</small>
            </div>
          )
        })}
      </div>

      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #666', borderRadius: '5px' }}>
        <h2>🔧 How to Test ISR</h2>
        <ol>
          <li><strong>Refresh this page multiple times</strong> - Load time should vary</li>
          <li><strong>Check browser Network tab</strong> - Look for Cache-Control headers</li>
          <li><strong>Visit /blog</strong> - Should show ISR behavior</li>
          <li><strong>Update content in Contentful</strong> - Changes should appear within {ISR_CONFIG.formatDuration(ISR_CONFIG.BLOG_LIST_REVALIDATE)}</li>
        </ol>
      </div>

      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #666', borderRadius: '5px' }}>
        <h2>🤖 Dynamic SEO Files</h2>
        <p>The following files are dynamically generated:</p>
        <ul>
          <li><strong><a href="/robots.txt" target="_blank">/robots.txt</a></strong> - Auto-generated from site config</li>
          <li><strong><a href="/sitemap.xml" target="_blank">/sitemap.xml</a></strong> - Includes all blog posts from Contentful</li>
          <li><strong><a href="/sitemap-isr.xml" target="_blank">/sitemap-isr.xml</a></strong> - ISR-optimized sitemap (6h revalidation)</li>
        </ul>
        <p><small>💡 <strong>Configure in:</strong> <code>src/config/site.ts</code></small></p>
      </div>

      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #666', borderRadius: '5px' }}>
        <h2>🚀 Complete API Reference & Testing</h2>
        <p>Comprehensive documentation and testing tools for all available endpoints:</p>
        
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ margin: '15px 0 10px 0', fontSize: '18px', borderBottom: '2px solid #444', paddingBottom: '5px' }}>📊 Status & Monitoring APIs</h3>
          
          <div style={{ marginBottom: '15px', paddingLeft: '10px', borderLeft: '3px solid #3b82f6' }}>
            <h4 style={{ margin: '5px 0', fontSize: '16px' }}>🔍 /api/status</h4>
            <p style={{ margin: '5px 0', fontSize: '14px', color: '#888' }}>
              Real-time server status, ISR configuration, environment info, and Contentful connectivity
            </p>
            <p style={{ margin: '5px 0', fontSize: '13px' }}>
              <strong>Returns:</strong> JSON with timestamp, ISR config, environment variables, cache headers
            </p>
            <p style={{ margin: '5px 0', fontSize: '13px' }}>
              <strong>Cache:</strong> No cache (always fresh data for monitoring)
            </p>
            <div style={{ margin: '8px 0' }}>
              <button 
                onClick={() => window.open('/api/status', '_blank')}
                style={{
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  padding: '6px 10px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginRight: '8px',
                  fontSize: '12px'
                }}
              >
                🌐 Open in Browser
              </button>
              <button 
                onClick={() => {
                  fetch('/api/status')
                    .then(res => res.json())
                    .then(data => {
                      const pre = document.createElement('pre')
                      pre.style.cssText = 'background: #1a1a1a; color: #00ff00; padding: 12px; border-radius: 4px; overflow-x: auto; margin: 10px 0; font-size: 11px; border: 1px solid #333;'
                      pre.textContent = JSON.stringify(data, null, 2)
                      const container = document.getElementById('api-results')
                      if (container) {
                        container.innerHTML = '<h4 style="margin: 10px 0 5px 0; color: #3b82f6;">📊 /api/status Response:</h4>'
                        container.appendChild(pre)
                        container.scrollIntoView({ behavior: 'smooth' })
                      }
                    })
                    .catch(err => {
                      console.error('API Error:', err)
                      const container = document.getElementById('api-results')
                      if (container) {
                        container.innerHTML = '<div style="background: #dc2626; color: white; padding: 10px; border-radius: 4px; margin: 10px 0;">❌ Error: ' + err.message + '</div>'
                      }
                    })
                }}
                style={{
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  padding: '6px 10px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                🧪 Test API Call
              </button>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ margin: '15px 0 10px 0', fontSize: '18px', borderBottom: '2px solid #444', paddingBottom: '5px' }}>🤖 SEO & Discovery Routes</h3>
          
          <div style={{ marginBottom: '15px', paddingLeft: '10px', borderLeft: '3px solid #8b5cf6' }}>
            <h4 style={{ margin: '5px 0', fontSize: '16px' }}>📝 /robots.txt</h4>
            <p style={{ margin: '5px 0', fontSize: '14px', color: '#888' }}>
              Dynamic robots.txt file generated from site configuration
            </p>
            <p style={{ margin: '5px 0', fontSize: '13px' }}>
              <strong>Content:</strong> Allow all crawlers, disallow /dev-info, references dynamic sitemap
            </p>
            <p style={{ margin: '5px 0', fontSize: '13px' }}>
              <strong>Cache:</strong> 24 hours (s-maxage=86400) for cost efficiency
            </p>
            <p style={{ margin: '5px 0', fontSize: '13px' }}>
              <strong>Config:</strong> <code>src/config/site.ts</code> → ROBOTS_CONFIG
            </p>
            <button 
              onClick={() => window.open('/robots.txt', '_blank')}
              style={{
                background: '#8b5cf6',
                color: 'white',
                border: 'none',
                padding: '6px 10px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                margin: '8px 8px 8px 0'
              }}
            >
              🌐 View /robots.txt
            </button>
          </div>

          <div style={{ marginBottom: '15px', paddingLeft: '10px', borderLeft: '3px solid #f59e0b' }}>
            <h4 style={{ margin: '5px 0', fontSize: '16px' }}>🗺️ /sitemap.xml</h4>
            <p style={{ margin: '5px 0', fontSize: '14px', color: '#888' }}>
              Dynamic sitemap including all static pages + live blog posts from Contentful
            </p>
            <p style={{ margin: '5px 0', fontSize: '13px' }}>
              <strong>Content:</strong> Homepage, About, Blog index, all blog posts with proper lastmod dates
            </p>
            <p style={{ margin: '5px 0', fontSize: '13px' }}>
              <strong>Cache:</strong> 6 hours (s-maxage=21600) for balance of freshness vs. cost
            </p>
            <p style={{ margin: '5px 0', fontSize: '13px' }}>
              <strong>Config:</strong> <code>src/config/site.ts</code> → SITEMAP_CONFIG
            </p>
            <p style={{ margin: '5px 0', fontSize: '13px' }}>
              <strong>Fallback:</strong> Shows static pages if Contentful fails
            </p>
            <button 
              onClick={() => window.open('/sitemap.xml', '_blank')}
              style={{
                background: '#f59e0b',
                color: 'white',
                border: 'none',
                padding: '6px 10px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                margin: '8px 8px 8px 0'
              }}
            >
              🌐 View /sitemap.xml
            </button>
          </div>

          <div style={{ marginBottom: '15px', paddingLeft: '10px', borderLeft: '3px solid #ef4444' }}>
            <h4 style={{ margin: '5px 0', fontSize: '16px' }}>⚡ /sitemap-isr.xml</h4>
            <p style={{ margin: '5px 0', fontSize: '14px', color: '#888' }}>
              ISR-optimized sitemap for ultra-low cost with longer caching
            </p>
            <p style={{ margin: '5px 0', fontSize: '13px' }}>
              <strong>Content:</strong> Same as /sitemap.xml but with ISR revalidation
            </p>
            <p style={{ margin: '5px 0', fontSize: '13px' }}>
              <strong>Cache:</strong> 6 hours ISR revalidation (even more cost-effective)
            </p>
            <p style={{ margin: '5px 0', fontSize: '13px' }}>
              <strong>Use case:</strong> Consider switching production sitemap to this for maximum cost savings
            </p>
            <button 
              onClick={() => window.open('/sitemap-isr.xml', '_blank')}
              style={{
                background: '#ef4444',
                color: 'white',
                border: 'none',
                padding: '6px 10px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                margin: '8px 8px 8px 0'
              }}
            >
              🌐 View /sitemap-isr.xml
            </button>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ margin: '15px 0 10px 0', fontSize: '18px', borderBottom: '2px solid #444', paddingBottom: '5px' }}>🛠️ Developer Tools & cURL Commands</h3>
          
          <div style={{ background: '#1a1a1a', padding: '12px', borderRadius: '6px', fontSize: '11px', fontFamily: 'monospace' }}>
            <div style={{ marginBottom: '8px' }}>
              <strong style={{ color: '#3b82f6' }}>Monitor Server Status:</strong><br/>
              <code style={{ color: '#10b981' }}>curl -s -H &quot;Accept: application/json&quot; {typeof window !== 'undefined' ? window.location.origin : 'https://reggiepangilinan.com'}/api/status | jq .</code>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <strong style={{ color: '#8b5cf6' }}>Check Robots.txt (with headers):</strong><br/>
              <code style={{ color: '#10b981' }}>curl -I {typeof window !== 'undefined' ? window.location.origin : 'https://reggiepangilinan.com'}/robots.txt</code>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <strong style={{ color: '#f59e0b' }}>Validate Sitemap (with cache info):</strong><br/>
              <code style={{ color: '#10b981' }}>curl -s -I -H &quot;Accept: application/xml&quot; {typeof window !== 'undefined' ? window.location.origin : 'https://reggiepangilinan.com'}/sitemap.xml</code>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <strong style={{ color: '#ef4444' }}>Compare ISR Sitemap Performance:</strong><br/>
              <code style={{ color: '#10b981' }}>time curl -s {typeof window !== 'undefined' ? window.location.origin : 'https://reggiepangilinan.com'}/sitemap-isr.xml &gt; /dev/null</code>
            </div>
            <div>
              <strong style={{ color: '#6b7280' }}>Test All Endpoints (health check):</strong><br/>
              <code style={{ color: '#10b981' }}>for endpoint in api/status robots.txt sitemap.xml sitemap-isr.xml; do echo &quot;Testing /$endpoint:&quot;; curl -s -o /dev/null -w &quot;http_code: %{'{http_code}'}, time: %{'{time_total}'}s\n&quot; {typeof window !== 'undefined' ? window.location.origin : 'https://reggiepangilinan.com'}/$endpoint; done</code>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ margin: '15px 0 10px 0', fontSize: '18px', borderBottom: '2px solid #444', paddingBottom: '5px' }}>🔧 Performance & Cache Testing</h3>
          
          <div style={{ background: '#0f172a', border: '1px solid #334155', padding: '12px', borderRadius: '6px' }}>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#94a3b8' }}>🚀 Quick Performance Tests</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
              <button 
                onClick={() => {
                  const startTime = performance.now()
                  fetch('/api/status')
                    .then(res => {
                      const endTime = performance.now()
                      return res.json().then(data => ({ data, time: endTime - startTime, status: res.status }))
                    })
                    .then(({ data, time, status }) => {
                      const container = document.getElementById('api-results')
                      if (container) {
                        container.innerHTML = `
                          <h4 style="margin: 10px 0 5px 0; color: #10b981;">⚡ Performance Test Results:</h4>
                          <div style="background: #1a1a1a; padding: 10px; border-radius: 4px; font-size: 12px; font-family: monospace;">
                            <div style="color: #10b981;">✅ Status: ${status}</div>
                            <div style="color: #3b82f6;">⏱️  Response Time: ${time.toFixed(2)}ms</div>
                            <div style="color: #f59e0b;">📅 Server Time: ${data.timestamp}</div>
                            <div style="color: #8b5cf6;">🔧 ISR Enabled: ${data.isr.enabled}</div>
                            <div style="color: #ef4444;">🌐 Environment: ${data.isr.nodeEnv}</div>
                          </div>
                        `
                        container.scrollIntoView({ behavior: 'smooth' })
                      }
                    })
                    .catch(err => console.error('Performance test failed:', err))
                }}
                style={{
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '11px'
                }}
              >
                ⚡ Test API Speed
              </button>
              
              <button 
                onClick={() => {
                  Promise.all([
                    fetch('/robots.txt').then(r => ({ url: '/robots.txt', status: r.status, headers: Object.fromEntries(r.headers.entries()) })),
                    fetch('/sitemap.xml').then(r => ({ url: '/sitemap.xml', status: r.status, headers: Object.fromEntries(r.headers.entries()) })),
                    fetch('/sitemap-isr.xml').then(r => ({ url: '/sitemap-isr.xml', status: r.status, headers: Object.fromEntries(r.headers.entries()) }))
                  ]).then(results => {
                    const container = document.getElementById('api-results')
                    if (container) {
                      container.innerHTML = `
                        <h4 style="margin: 10px 0 5px 0; color: #f59e0b;">🗺️ SEO Endpoints Status:</h4>
                        <div style="background: #1a1a1a; padding: 10px; border-radius: 4px; font-size: 11px; font-family: monospace;">
                          ${results.map(r => `
                            <div style="margin: 5px 0; padding: 8px; border: 1px solid #333; border-radius: 3px;">
                              <div style="color: ${r.status === 200 ? '#10b981' : '#ef4444'};">📍 ${r.url} - Status: ${r.status}</div>
                              <div style="color: #6b7280;">Cache-Control: ${r.headers['cache-control'] || 'Not set'}</div>
                              <div style="color: #6b7280;">Content-Type: ${r.headers['content-type'] || 'Not set'}</div>
                            </div>
                          `).join('')}
                        </div>
                      `
                      container.scrollIntoView({ behavior: 'smooth' })
                    }
                  })
                }}
                style={{
                  background: '#f59e0b',
                  color: 'white',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '11px'
                }}
              >
                🗺️ Check All SEO Routes
              </button>
            </div>
          </div>
        </div>

        <div id="api-results" style={{ marginTop: '20px' }}></div>
        
        <div style={{ marginTop: '15px', padding: '10px', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px' }}>
          <p style={{ margin: '0', fontSize: '12px', color: '#94a3b8' }}>
            💡 <strong>Pro Tips:</strong>
          </p>
          <ul style={{ margin: '8px 0 0 20px', fontSize: '11px', color: '#6b7280' }}>
            <li>Check browser Network tab (F12) for detailed cache headers and response times</li>
            <li>Use browser DevTools Performance tab to analyze page load timing</li>
            <li>Monitor Netlify Analytics for real-world performance data</li>
            <li>Test endpoints with different user agents to verify robots.txt compliance</li>
            <li>Use Google Search Console to validate sitemap.xml parsing</li>
          </ul>
        </div>
      </div>

      <div style={{ padding: '15px', border: '1px solid #666', borderRadius: '5px' }}>
        <h2>📊 Logging Info</h2>
        <p>Logs are written to console.error() for better visibility on Netlify.</p>
        <p>Check:</p>
        <ul>
          <li>Browser console (F12) for client-side logs</li>
          <li>Netlify deploy logs for build-time logs</li>
          <li>Network timing for ISR behavior indicators</li>
        </ul>
        <p><strong>Note:</strong> Netlify free tier has limited log retention. See NETLIFY_LOGGING_GUIDE.md for details.</p>
      </div>
    </div>
  )
}
