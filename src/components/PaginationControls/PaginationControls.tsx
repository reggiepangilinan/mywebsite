import Link from 'next/link'
import { joinUrl } from '@/lib/url-utils'
import styles from './PaginationControls.module.css'

interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  totalPosts?: number
  postsPerPage?: number
  basePath?: string
}

export default function PaginationControls({
  currentPage,
  totalPages,
  basePath = '/blog',
}: PaginationControlsProps) {
  // Always show pagination, even for single page

  const getPageUrl = (page: number) => {
    if (page === 1) {
      return basePath
    }
    return joinUrl(basePath, `page/${page}`)
  }

  const renderPageLink = (page: number, isCurrent = false) => (
    <Link
      key={page}
      href={getPageUrl(page)}
      className={`${styles.pageLink} ${isCurrent ? styles.current : ''}`}
      aria-label={
        isCurrent ? `Current page, page ${page}` : `Go to page ${page}`
      }
      aria-current={isCurrent ? 'page' : undefined}
    >
      {page}
    </Link>
  )

  const renderPageLinks = () => {
    const links = []
    const maxVisiblePages = 7 // Show at most 7 page numbers

    if (totalPages <= maxVisiblePages) {
      // Show all pages if we have few enough
      for (let i = 1; i <= totalPages; i++) {
        links.push(renderPageLink(i, i === currentPage))
      }
    } else {
      // Always show first page
      links.push(renderPageLink(1, currentPage === 1))

      let startPage = Math.max(2, currentPage - 2)
      let endPage = Math.min(totalPages - 1, currentPage + 2)

      // Adjust range to show 5 pages in middle section
      if (currentPage <= 3) {
        endPage = Math.min(totalPages - 1, 5)
      } else if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 4)
      }

      // Add ellipsis before middle section if needed
      if (startPage > 2) {
        links.push(
          <span
            key="ellipsis-start"
            className={styles.ellipsis}
            aria-hidden="true"
          >
            …
          </span>
        )
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        links.push(renderPageLink(i, i === currentPage))
      }

      // Add ellipsis after middle section if needed
      if (endPage < totalPages - 1) {
        links.push(
          <span
            key="ellipsis-end"
            className={styles.ellipsis}
            aria-hidden="true"
          >
            …
          </span>
        )
      }

      // Always show last page
      if (totalPages > 1) {
        links.push(renderPageLink(totalPages, currentPage === totalPages))
      }
    }

    return links
  }

  return (
    <nav
      className={styles.pagination}
      role="navigation"
      aria-label="Blog pagination"
    >
      <div className={styles.controls}>
        {/* Page indicator */}
        <span className={styles.pageInfo}>
          Page {currentPage} of {totalPages}
        </span>

        {/* Navigation controls container */}
        <div className={styles.navigationContainer}>
          {/* Previous page link */}
          {currentPage > 1 ? (
            <Link
              href={getPageUrl(currentPage - 1)}
              className={`${styles.navLink} ${styles.prev}`}
              aria-label="Go to previous page"
            >
              <span aria-hidden="true">‹</span>
            </Link>
          ) : (
            <span
              className={`${styles.navLink} ${styles.prev} ${styles.disabled}`}
              aria-hidden="true"
            >
              <span aria-hidden="true">‹</span>
            </span>
          )}

          {/* Page numbers */}
          <div className={styles.pageNumbers}>{renderPageLinks()}</div>

          {/* Next page link */}
          {currentPage < totalPages ? (
            <Link
              href={getPageUrl(currentPage + 1)}
              className={`${styles.navLink} ${styles.next}`}
              aria-label="Go to next page"
            >
              <span aria-hidden="true">›</span>
            </Link>
          ) : (
            <span
              className={`${styles.navLink} ${styles.next} ${styles.disabled}`}
              aria-hidden="true"
            >
              <span aria-hidden="true">›</span>
            </span>
          )}
        </div>
      </div>
    </nav>
  )
}
