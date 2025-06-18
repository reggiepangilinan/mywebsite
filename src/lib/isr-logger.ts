// Simple ISR logging for free Netlify tier - stores logs in browser localStorage
export async function logISREvent(message: string, data?: unknown) {
  // Only log in development or when debugging is enabled
  const shouldLog = process.env.NODE_ENV === 'development' || 
                   process.env.ENABLE_ISR_LOGS === 'true' ||
                   process.env.DEBUG === 'true'
  
  if (!shouldLog) {
    return // Skip logging in production unless explicitly enabled
  }
  
  try {
    const timestamp = new Date().toISOString()
    const logMessage = `[ISR-${timestamp}] ${message}`
    const logData = data ? ` | Data: ${JSON.stringify(data)}` : ''
    const fullLog = logMessage + logData
    
    // Always log to console (visible in build logs and browser console)
    console.error(fullLog)
    console.log(fullLog) // Both error and log for better visibility
    
    // For server-side, also try different output streams
    if (typeof process !== 'undefined') {
      if (process.stdout?.write) {
        process.stdout.write(`${fullLog}\n`)
      }
      if (process.stderr?.write) {
        process.stderr.write(`${fullLog}\n`)
      }
    }
    
  } catch (error) {
    // Fallback to basic console.error
    console.error('[ISR] Logging error:', error)
    console.error(`[ISR] Original message: ${message}`)
  }
}

// Lightweight logging for production (minimal overhead)
export function logISREventLite(message: string) {
  if (process.env.ENABLE_ISR_LOGS === 'true' || process.env.NODE_ENV === 'development') {
    const log = `[ISR] ${message} | ${new Date().toISOString()}`
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
