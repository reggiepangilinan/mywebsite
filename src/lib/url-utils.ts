/**
 * URL utility functions to handle double slash issues in routes
 */

/**
 * Normalizes a URL path by removing double slashes and ensuring proper formatting
 * @param url - The URL to normalize
 * @returns Normalized URL without double slashes
 */
export function normalizeUrl(url: string): string {
  if (!url) return ''
  
  // Handle protocol preservation (http://, https://)
  const protocolMatch = url.match(/^(https?:\/\/)/)
  const protocol = protocolMatch ? protocolMatch[1] : ''
  const restOfUrl = protocolMatch ? url.slice(protocol.length) : url
  
  // Remove multiple consecutive slashes and replace with single slash
  const normalized = restOfUrl.replace(/\/+/g, '/')
  
  // Combine protocol with normalized path
  return protocol + normalized
}

/**
 * Joins URL segments ensuring no double slashes
 * @param base - Base URL (e.g., 'https://example.com')
 * @param path - Path to join (e.g., '/path/to/resource')
 * @returns Properly joined URL
 */
export function joinUrl(base: string, path: string): string {
  if (!base) return normalizeUrl(path)
  if (!path) return normalizeUrl(base)
  
  // Remove trailing slash from base and leading slash from path to avoid double slashes
  const cleanBase = base.replace(/\/+$/, '')
  const cleanPath = path.replace(/^\/+/, '')
  
  // Join with single slash and normalize
  const joined = cleanPath ? `${cleanBase}/${cleanPath}` : cleanBase
  return normalizeUrl(joined)
}

/**
 * Normalizes a pathname by removing trailing slashes (except for root)
 * @param pathname - The pathname to normalize
 * @returns Normalized pathname
 */
export function normalizePathname(pathname: string): string {
  if (!pathname || pathname === '/') return '/'
  return pathname.replace(/\/+$/, '')
}

/**
 * Ensures a path starts with a slash (for internal routing)
 * @param path - The path to normalize
 * @returns Path starting with slash
 */
export function ensureLeadingSlash(path: string): string {
  if (!path) return '/'
  return path.startsWith('/') ? path : `/${path}`
}

/**
 * Removes leading slash from a path
 * @param path - The path to process
 * @returns Path without leading slash
 */
export function removeLeadingSlash(path: string): string {
  if (!path) return ''
  return path.replace(/^\/+/, '')
}
