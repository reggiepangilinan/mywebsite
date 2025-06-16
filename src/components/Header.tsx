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
              <Link 
                href="/about" 
                className={`${styles.navLink} ${isActive('/about') ? styles.active : ''}`}
                onClick={handleNavClick}
                suppressHydrationWarning
              >
                About
              </Link>
              <Link 
                href="/projects" 
                className={`${styles.navLink} ${isActive('/projects') ? styles.active : ''}`}
                onClick={handleNavClick}
                suppressHydrationWarning
              >
                Projects
              </Link>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </header>
  )
}
