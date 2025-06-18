// ISR Configuration - Centralized revalidate timing
// 
// IMPORTANT: Next.js requires literal values for revalidate exports
// To change timing, update the values below and in the corresponding pages:
// - src/app/blog/page.tsx
// - src/app/blog/[slug]/page.tsx  
// - src/app/debug-isr/page.tsx

export const ISR_CONFIG = {
  // Blog pages revalidation timing (in seconds)
  BLOG_LIST_REVALIDATE: 300, // 5 minutes
  BLOG_POST_REVALIDATE: 300, // 5 minutes
  
  // Debug page revalidation timing
  DEBUG_PAGE_REVALIDATE: 60, // 1 minute
  
  // Helper functions for display
  formatDuration: (seconds: number): string => {
    if (seconds < 60) return `${seconds} seconds`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''}`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours} hour${hours > 1 ? 's' : ''}${remainingMinutes > 0 ? ` ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}` : ''}`
  },
  
  // Validation helper to ensure pages match config
  validatePageRevalidate: (pageType: 'blog-list' | 'blog-post' | 'debug', actualValue: number): boolean => {
    const expected = {
      'blog-list': ISR_CONFIG.BLOG_LIST_REVALIDATE,
      'blog-post': ISR_CONFIG.BLOG_POST_REVALIDATE,
      'debug': ISR_CONFIG.DEBUG_PAGE_REVALIDATE
    }[pageType]
    
    if (actualValue !== expected) {
      console.warn(`⚠️ ISR Config Mismatch: ${pageType} page has revalidate=${actualValue}, expected=${expected}`)
      return false
    }
    return true
  }
} as const

// Type safety for revalidate values
export type ISRConfig = typeof ISR_CONFIG
