// Temporary production logging utility for debugging image issues
// This will work even when console.log is stripped in production

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */

export function logToLocalStorage(key: string, data: any) {
  try {
    if (typeof window !== 'undefined') {
      const timestamp = new Date().toISOString()
      const logEntry = { timestamp, data }

      // Store in localStorage for inspection
      const existingLogs = JSON.parse(localStorage.getItem(key) || '[]')
      existingLogs.push(logEntry)

      // Keep only last 50 entries to avoid storage issues
      if (existingLogs.length > 50) {
        existingLogs.splice(0, existingLogs.length - 50)
      }

      localStorage.setItem(key, JSON.stringify(existingLogs))

      // Also log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[${key}]`, data)
      }
    }
  } catch (error) {
    // Silently fail if localStorage is not available
  }
}

export function getLogsFromLocalStorage(key: string) {
  try {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem(key) || '[]')
    }
  } catch (error) {
    return []
  }
  return []
}

export function clearLogsFromLocalStorage(key: string) {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key)
    }
  } catch (error) {
    // Silently fail
  }
}
