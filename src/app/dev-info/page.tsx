import { createDebugInfo } from '@/lib/isr-logger'
import { getBlogPosts } from '@/lib/contentful'
import { ISR_CONFIG } from '@/config/isr'

// Add revalidate for ISR testing
// NOTE: This value must match ISR_CONFIG.DEV_INFO_PAGE_REVALIDATE (currently 60)
export const revalidate = 60 // 1 minute - update ISR_CONFIG.DEV_INFO_PAGE_REVALIDATE when changing

export default async function DevInfoPage() {
  // Validate revalidate matches config
  ISR_CONFIG.validatePageRevalidate('dev-info', revalidate)
  
  const debugInfo = createDebugInfo()
  const startTime = Date.now()
  const { items: posts } = await getBlogPosts(5) // Get first 5 posts
  const loadTime = Date.now() - startTime
  
  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', maxWidth: '800px', color: 'var(--foreground)', backgroundColor: 'var(--background)' }}>
      <h1>🛠️ Development Info Dashboard</h1>
      <p style={{ marginBottom: '30px', color: '#666' }}>ISR status, SEO tools, and development debugging information</p>
      
      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #666', borderRadius: '5px' }}>
        <h2>🔍 Debug Status</h2>
        <pre style={{ backgroundColor: 'transparent', color: 'inherit' }}>{JSON.stringify(debugInfo, null, 2)}</pre>
        <p><strong>Content Load Time:</strong> {loadTime}ms</p>
        <p><strong>Page Generated:</strong> {new Date().toISOString()}</p>
      </div>

      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #666', borderRadius: '5px' }}>
        <h2>🚀 ISR Configuration</h2>
        <ul>
          <li><strong>This page revalidates every:</strong> {ISR_CONFIG.formatDuration(ISR_CONFIG.DEV_INFO_PAGE_REVALIDATE)}</li>
          <li><strong>Blog list revalidates every:</strong> {ISR_CONFIG.formatDuration(ISR_CONFIG.BLOG_LIST_REVALIDATE)}</li>
          <li><strong>Blog posts revalidate every:</strong> {ISR_CONFIG.formatDuration(ISR_CONFIG.BLOG_POST_REVALIDATE)}</li>
        </ul>
        <p><small>💡 <strong>Configure timing in:</strong> <code>src/config/isr.ts</code></small></p>
      </div>

      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #666', borderRadius: '5px' }}>
        <h2>📝 Recent Blog Posts</h2>
        <p><strong>Count:</strong> {posts.length}</p>
        <p><strong>Load Time:</strong> {loadTime}ms {loadTime > 1000 ? '(Slow - likely fresh fetch)' : '(Fast - likely cached)'}</p>
        {posts.map((post, index) => (
          <div key={post.sys.id} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #888', borderRadius: '3px' }}>
            <strong>{index + 1}. {String(post.fields.title || 'Untitled')}</strong>
            <br />
            <small>ID: {post.sys.id} | Updated: {post.sys.updatedAt}</small>
          </div>
        ))}
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
        </ul>
        <p><small>💡 <strong>Configure in:</strong> <code>src/config/site.ts</code></small></p>
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
