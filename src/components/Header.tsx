'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import styles from './Header.module.css'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Normalize paths to handle trailing slashes consistently
  const normalizePath = (path: string): string => {
    if (path === '/') return '/'
    return path.replace(/\/$/, '')
  }

  // Check if a navigation link is active - always return false on server to prevent hydration mismatch
  const isActive = (path: string): boolean => {
    // Always return false during SSR to prevent hydration mismatch
    if (typeof window === 'undefined' || !mounted) return false
    
    const normalizedPathname = normalizePath(pathname)
    const normalizedPath = normalizePath(path)
    
    return normalizedPathname === normalizedPath
  }

  const handleNavClick = () => {
    setIsMenuOpen(false)
  }

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      // Store current scroll position
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      
      // Prevent scrolling on the body
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollTop}px`
      document.body.style.width = '100%'
      // Also prevent scrolling on html element
      document.documentElement.style.overflow = 'hidden'
    } else {
      // Get the stored scroll position
      const scrollTop = document.body.style.top
      
      // Restore scrolling
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.documentElement.style.overflow = ''
      
      // Restore scroll position
      if (scrollTop) {
        window.scrollTo(0, parseInt(scrollTop || '0') * -1)
      }
    }
    
    // Cleanup function to restore scroll when component unmounts
    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.documentElement.style.overflow = ''
    }
  }, [isMenuOpen])

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.navContent}>
          <Link href="/" className={styles.logo} onClick={handleNavClick}>
            Reggie Pangilinan
          </Link>
          
          <button 
            className={styles.hamburger}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.hamburgerOpen : ''}`}></span>
            <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.hamburgerOpen : ''}`}></span>
            <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.hamburgerOpen : ''}`}></span>
          </button>
            
          <div className={`${styles.navRight} ${isMenuOpen ? styles.navRightOpen : ''}`}>
            <div className={styles.navLinks} suppressHydrationWarning>
              <Link 
                href="/" 
                className={`${styles.navLink} ${isActive('/') ? styles.active : ''}`}
                onClick={handleNavClick}
                suppressHydrationWarning
              >
                Home
              </Link>
              {process.env.NODE_ENV === 'development' && (
                <Link 
                  href="/blog" 
                  className={`${styles.navLink} ${isActive('/blog') ? styles.active : ''}`}
                  onClick={handleNavClick}
                  suppressHydrationWarning
                >
                  Blog
                </Link>
              )}
              <Link 
                href="/about" 
                className={`${styles.navLink} ${isActive('/about') ? styles.active : ''}`}
                onClick={handleNavClick}
                suppressHydrationWarning
              >
                About
              </Link>
            </div>
            <div className={styles.mobileSocialLinks} suppressHydrationWarning>
              <a 
                href="https://github.com/reggiepangilinan" 
                className={styles.mobileSocialLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleNavClick}
                suppressHydrationWarning
              >
                GitHub
                <svg className={styles.externalIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <a 
                href="https://linkedin.com/in/reggiepangilinan" 
                className={styles.mobileSocialLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleNavClick}
                suppressHydrationWarning
              >
                LinkedIn
                <svg className={styles.externalIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </header>
  )
}
