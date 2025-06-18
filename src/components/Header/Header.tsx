'use client'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import styles from './Header.module.css'
import ThemeToggle from '@/components/ThemeToggle'
import ScreenReaderToggle from '@/components/ScreenReaderToggle'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const firstMenuItemRef = useRef<HTMLAnchorElement>(null)

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
    // Focus management for accessibility
    if (!isMenuOpen) {
      // When opening menu, focus first item after a brief delay
      setTimeout(() => {
        firstMenuItemRef.current?.focus()
      }, 100)
    } else {
      // When closing menu, return focus to menu button
      menuButtonRef.current?.focus()
    }
  }

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape' && isMenuOpen) {
      setIsMenuOpen(false)
      menuButtonRef.current?.focus()
    }
  }

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
      <nav className={styles.nav} onKeyDown={handleKeyDown} id="navigation">
        <div className={styles.navContent}>
          <Link href="/" className={styles.logo} onClick={handleNavClick}>
            Reggie Pangilinan
          </Link>
          
          <button 
            ref={menuButtonRef}
            className={styles.hamburger}
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
            aria-controls="navigation-menu"
          >
            <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.hamburgerOpen : ''}`}></span>
            <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.hamburgerOpen : ''}`}></span>
            <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.hamburgerOpen : ''}`}></span>
          </button>
            
          <div className={`${styles.navRight} ${isMenuOpen ? styles.navRightOpen : ''}`}>
            <div 
              className={styles.navLinks} 
              suppressHydrationWarning
              id="navigation-menu"
              role="menu"
              aria-label="Main navigation"
            >
              <Link 
                ref={firstMenuItemRef}
                href="/" 
                className={`${styles.navLink} ${isActive('/') ? styles.active : ''}`}
                onClick={handleNavClick}
                suppressHydrationWarning
                role="menuitem"
              >
                Home
              </Link>
              {process.env.NODE_ENV === 'development' && (
                <Link 
                  href="/blog" 
                  className={`${styles.navLink} ${isActive('/blog') ? styles.active : ''}`}
                  onClick={handleNavClick}
                  suppressHydrationWarning
                  role="menuitem"
                >
                  Blog
                </Link>
              )}
              <Link 
                href="/about" 
                className={`${styles.navLink} ${isActive('/about') ? styles.active : ''}`}
                onClick={handleNavClick}
                suppressHydrationWarning
                role="menuitem"
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
                aria-label="Visit Reggie's GitHub profile (opens in new tab)"
              >
                GitHub
                <svg className={styles.externalIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
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
                aria-label="Visit Reggie's LinkedIn profile (opens in new tab)"
              >
                LinkedIn
                <svg className={styles.externalIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
            <div className={styles.toggles}>
              <div aria-label="Screen reader toggle">
                <ScreenReaderToggle />
              </div>
              <div aria-label="Theme toggle">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
