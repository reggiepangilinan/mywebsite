// Simple ISR logging for free Netlify tier - stores logs in browser localStorage
export async function logISREvent(message: string, data?: unknown) {
  // COMPLETELY DISABLE logging in development to prevent Next.js debugger errors
  // Only enable if explicitly requested via environment variables
  const isDev = process.env.NODE_ENV === 'development'
  const isExplicitlyEnabled = process.env.ENABLE_ISR_LOGS === 'true' || process.env.DEBUG === 'true'
  
  // Skip ALL logging in development unless explicitly requested
  if (isDev && !isExplicitlyEnabled) {
    return
  }
  
  // In production, always log (for Netlify build logs)
  const shouldLog = !isDev || isExplicitlyEnabled
  
  if (!shouldLog) {
    return
  }
  
  try {
    const timestamp = new Date().toISOString()
    const logMessage = `[ISR-${timestamp}] ${message}`
    const logData = data ? ` | Data: ${JSON.stringify(data)}` : ''
    const fullLog = logMessage + logData
    
    // Use appropriate log level - console.log for info, not console.error
    // This prevents showing as errors in Next.js debugger
    if (isDev) {
      // In development, use console.log to avoid error highlighting
      console.log(fullLog)
    } else {
      // In production/build, use console.error for better visibility in logs
      // Why console.error in production?
      // 1. Higher priority in hosting platform log aggregation (Netlify, Vercel)
      // 2. Better visibility in deployment and function logs
      // 3. Less likely to be filtered out by log retention policies
      // 4. ISR events are important for debugging, need reliable capture
      // 5. Background ISR processes (serverless functions) often suppress console.log
      // Note: These aren't actual errors - [ISR] prefix identifies them as informational
      console.error(fullLog)
      console.log(fullLog)
      
      // For server-side, also try different output streams
      if (typeof process !== 'undefined') {
        if (process.stdout?.write) {
          process.stdout.write(`${fullLog}\n`)
        }
        if (process.stderr?.write) {
          process.stderr.write(`${fullLog}\n`)
        }
      }
    }
    
  } catch (error) {
    // Fallback - only in non-dev or when debugging
    if (!isDev || isExplicitlyEnabled) {
      console.warn('[ISR] Logging error:', error)
      console.warn(`[ISR] Original message: ${message}`)
    }
  }
}

// Lightweight logging for production (minimal overhead)
export function logISREventLite(message: string) {
  // COMPLETELY DISABLE in development unless explicitly enabled
  const isDev = process.env.NODE_ENV === 'development'
  const isExplicitlyEnabled = process.env.ENABLE_ISR_LOGS === 'true' || process.env.DEBUG === 'true'
  
  // Skip ALL logging in development unless explicitly requested
  if (isDev && !isExplicitlyEnabled) {
    return
  }
  
  // Only log in production or when explicitly enabled
  const log = `[ISR] ${message} | ${new Date().toISOString()}`
  
  if (isDev && isExplicitlyEnabled) {
    // In development with explicit enabling, use console.log
    console.log(log)
  } else if (!isDev) {
    // In production, use console.error for visibility
    console.error(log)
    console.log(log)
  }
}

// For debugging: create a simple debug page component
export function createDebugInfo() {
  return {
    isrEnabled: process.env.ENABLE_ISR_LOGS === 'true',
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    message: 'ISR logging system active'
  }
}
