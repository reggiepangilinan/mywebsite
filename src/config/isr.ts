// ISR Configuration - Centralized revalidate timing
// 
// IMPORTANT: Next.js requires literal values for revalidate exports
// To change timing, update the values below and in the corresponding pages:
// - src/app/blog/[slug]/page.tsx (ISR enabled)
// - src/app/dev-info/page.tsx (ISR enabled)
// 
// Note: Blog list page (src/app/blog/page.tsx) is now dynamic for immediate post visibility

export const ISR_CONFIG = {
  // Blog pages revalidation timing (in seconds)
  BLOG_POST_REVALIDATE: 3600, // 1 hour - Individual blog posts (cost-optimized)
  
  // Dev info page revalidation timing  
  DEV_INFO_PAGE_REVALIDATE: 1800, // 30 minutes - Dev info (cost-optimized)
  
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
  validatePageRevalidate: (pageType: 'blog-post' | 'dev-info', actualValue: number): boolean => {
    const expected = {
      'blog-post': ISR_CONFIG.BLOG_POST_REVALIDATE,
      'dev-info': ISR_CONFIG.DEV_INFO_PAGE_REVALIDATE
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
