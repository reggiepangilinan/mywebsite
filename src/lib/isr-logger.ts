// Helper function to log ISR events to Netlify Functions
export async function logISREvent(message: string, data?: unknown) {
  try {
    // Always log to console (for build logs)
    console.error(`[ISR] ${message}`, data ? JSON.stringify(data) : '')
    
    // Also log to API route (for Netlify Functions logs)
    if (typeof window === 'undefined') { // Only on server side
      try {
        const baseUrl = process.env.VERCEL_URL 
          ? `https://${process.env.VERCEL_URL}`
          : process.env.NETLIFY_URL 
          ? process.env.NETLIFY_URL
          : 'http://localhost:3000'
          
        await fetch(`${baseUrl}/api/isr-log`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message, data }),
          cache: 'no-store'
        })
      } catch (apiError) {
        console.error('[ISR] Failed to log to API:', apiError)
      }
    }
  } catch (error) {
    console.error('[ISR] Logging error:', error)
  }
}
