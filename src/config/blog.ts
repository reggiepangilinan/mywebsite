// Blog configuration
export const blogConfig = {
  // ISR revalidation time in seconds
  // 3600 = 1 hour, 1800 = 30 minutes, 300 = 5 minutes
  revalidate: 300,

  // Pagination settings
  postsPerPage: 25,

  // Maximum length for blog post excerpts
  excerptMaxLength: 250,

  // Date formatting options
  dateFormat: {
    year: 'numeric' as const,
    month: 'long' as const,
    day: 'numeric' as const,
    hour: 'numeric' as const,
    minute: '2-digit' as const,
    hour12: true as const,
  },
}
