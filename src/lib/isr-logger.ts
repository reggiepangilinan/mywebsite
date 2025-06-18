// Helper function to log ISR events efficiently without extra API calls
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
    
    // Use multiple console methods to ensure visibility in Netlify
    console.error(logMessage + logData)
    console.log(logMessage + logData)
    console.warn(logMessage + logData)
    
    // Also try process.stdout if available (for Node.js environments)
    if (typeof process !== 'undefined' && process.stdout) {
      process.stdout.write(`${logMessage}${logData}\n`)
    }
    
    // For development, also log to stderr
    if (typeof process !== 'undefined' && process.stderr && process.env.NODE_ENV === 'development') {
      process.stderr.write(`${logMessage}${logData}\n`)
    }
    
  } catch (error) {
    // Fallback to basic console.error
    console.error('[ISR] Logging error:', error)
    console.error(`[ISR] Original message: ${message}`)
  }
}

// Lightweight logging for production (minimal overhead)
export function logISREventLite(message: string) {
  console.error(`[ISR] ${message} | ${new Date().toISOString()}`)
}
